/**
 * deploy.mjs — PetHub Thai Deploy Script (Plesk FTP)
 *
 * Usage (จาก backend/):
 *   node deploy.mjs                  # deploy ทั้ง frontend + backend
 *   node deploy.mjs --only=frontend  # deploy เฉพาะ frontend
 *   node deploy.mjs --only=backend   # deploy เฉพาะ backend
 *
 * Plesk config:
 *   Frontend — Application Startup File: server.js
 *   Backend  — Application Startup File: startup.js
 */

import * as ftp from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR  = path.join(__dirname, '..');

// ── Parse .env.local ──────────────────────────────────────────────────────────
function parseEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  fs.readFileSync(filePath, 'utf-8').split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  });
  return env;
}

const env = parseEnv(path.join(ROOT_DIR, 'frontend/.env.local'));

const FTP_HOST        = env.FTP_HOST        || process.env.FTP_HOST;
const FTP_USER        = env.FTP_USER        || process.env.FTP_USER;
const FTP_PASSWORD    = env.FTP_PASSWORD    || process.env.FTP_PASSWORD;
const FTP_PORT        = parseInt(env.FTP_PORT || '21', 10);
const FRONTEND_REMOTE = env.FTP_FRONTEND_PATH || 'httpdocs';
const BACKEND_REMOTE  = env.FTP_BACKEND_PATH  || 'api.pethubthai.com';

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
  console.error('❌  FTP credentials ไม่พบ — ตรวจสอบ frontend/.env.local');
  process.exit(1);
}

// ── CLI flags ─────────────────────────────────────────────────────────────────
const arg  = process.argv.find((a) => a.startsWith('--only='));
const only = arg ? arg.split('=')[1] : 'all';
const doFrontend = only === 'all' || only === 'frontend';
const doBackend  = only === 'all' || only === 'backend';

// ── Helpers ───────────────────────────────────────────────────────────────────
const log  = (msg) => console.log(`\n${msg}`);
const ok   = (msg) => console.log(`  ✅  ${msg}`);
const info = (msg) => console.log(`  ℹ️   ${msg}`);
const run  = (cmd, cwd) => { console.log(`  $ ${cmd}`); execSync(cmd, { cwd, stdio: 'inherit' }); };

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDirSync(s, d) : fs.copyFileSync(s, d);
  }
}

// ── FTP upload: ไฟล์ก่อน / node_modules สุดท้าย / ข้ามถ้ามีแล้ว ──────────────
async function uploadDir(client, localDir, remoteExisting = new Set()) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  const files   = entries.filter((e) => !e.isDirectory());
  const dirs    = entries.filter((e) =>  e.isDirectory() && e.name !== 'node_modules');
  const nmEntry = entries.find((e) =>   e.isDirectory() && e.name === 'node_modules');

  // 1. ไฟล์ทั้งหมดก่อน (server.js, package.json, .env ฯลฯ)
  for (const f of files) {
    process.stdout.write(`\r  📤  ${f.name.slice(0, 60).padEnd(60)}`);
    await client.uploadFrom(path.join(localDir, f.name), f.name);
  }

  // 2. directory อื่น (ยกเว้น node_modules)
  for (const d of dirs) {
    process.stdout.write(`\r  📤  ${d.name}/`.padEnd(65));
    await client.ensureDir(d.name);
    await uploadDirRecursive(client, path.join(localDir, d.name));
    await client.cdup();
  }

  // 3. node_modules — ข้ามถ้ามีอยู่แล้ว ประหยัดเวลา
  if (nmEntry) {
    if (remoteExisting.has('node_modules')) {
      process.stdout.write('\n');
      info('node_modules มีอยู่แล้วบน server — ข้าม');
    } else {
      process.stdout.write(`\r  📤  node_modules/ (uploading first time...)`.padEnd(65));
      await client.ensureDir('node_modules');
      await uploadDirRecursive(client, path.join(localDir, 'node_modules'));
      await client.cdup();
    }
  }
}

async function uploadDirRecursive(client, localDir) {
  for (const entry of fs.readdirSync(localDir, { withFileTypes: true })) {
    const localPath = path.join(localDir, entry.name);
    if (entry.isDirectory()) {
      await client.ensureDir(entry.name);
      await uploadDirRecursive(client, localPath);
      await client.cdup();
    } else {
      process.stdout.write(`\r  📤  ${entry.name.slice(0, 60).padEnd(60)}`);
      await client.uploadFrom(localPath, entry.name);
    }
  }
}

async function ftpUpload(localDir, remoteDir) {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASSWORD, port: FTP_PORT, secure: false });
    ok('FTP connected');

    await client.ensureDir(remoteDir);
    const remoteList = await client.list();
    const remoteExisting = new Set(remoteList.map((f) => f.name));

    await uploadDir(client, localDir, remoteExisting);
    process.stdout.write('\n');
    ok(`Uploaded → /${remoteDir}`);
  } finally {
    client.close();
  }
}

// ── FRONTEND ──────────────────────────────────────────────────────────────────
async function deployFrontend() {
  log('══ FRONTEND ════════════════════════════════════════');
  log('[1/3] Building Next.js');

  const frontendDir   = path.join(ROOT_DIR, 'frontend');
  const standaloneSrc = path.join(frontendDir, '.next/standalone');
  const staticSrc     = path.join(frontendDir, '.next/static');
  const publicSrc     = path.join(frontendDir, 'public');
  const stagingDir    = path.join(ROOT_DIR, '.deploy/frontend');

  run(`NEXT_PUBLIC_API_URL=https://api.pethubthai.com/api npm run build`, frontendDir);
  ok('Build complete');

  log('[2/3] Assembling standalone bundle');
  fs.rmSync(stagingDir, { recursive: true, force: true });
  copyDirSync(standaloneSrc, stagingDir);
  copyDirSync(staticSrc, path.join(stagingDir, '.next/static'));
  copyDirSync(publicSrc,  path.join(stagingDir, 'public'));
  fs.writeFileSync(path.join(stagingDir, '.env'), [
    `NEXT_PUBLIC_API_URL=https://api.pethubthai.com/api`,
    `NEXTAUTH_URL=https://pethubthai.com`,
    `NEXTAUTH_SECRET=${env.NEXTAUTH_SECRET || 'change-this-in-production'}`,
  ].join('\n'));
  ok('Staging ready');

  log('[3/3] Uploading via FTP');
  await ftpUpload(stagingDir, FRONTEND_REMOTE);
  ok(`Frontend deployed → /${FRONTEND_REMOTE}`);
  info('Plesk Startup File: server.js');
}

// ── BACKEND ───────────────────────────────────────────────────────────────────
async function deployBackend() {
  log('══ BACKEND ═════════════════════════════════════════');
  log('[1/3] Building NestJS');

  const backendDir = __dirname;
  const stagingDir = path.join(ROOT_DIR, '.deploy/backend');

  run('npm run build', backendDir);
  ok('Build complete → dist/');

  log('[2/3] Assembling deploy package');
  fs.rmSync(stagingDir, { recursive: true, force: true });
  fs.mkdirSync(stagingDir, { recursive: true });
  copyDirSync(path.join(backendDir, 'dist'), path.join(stagingDir, 'dist'));
  fs.mkdirSync(path.join(stagingDir, 'uploads'), { recursive: true });
  fs.copyFileSync(path.join(backendDir, 'startup.js'),        path.join(stagingDir, 'startup.js'));
  fs.copyFileSync(path.join(backendDir, 'package.json'),      path.join(stagingDir, 'package.json'));
  fs.copyFileSync(path.join(backendDir, 'package-lock.json'), path.join(stagingDir, 'package-lock.json'));
  fs.writeFileSync(path.join(stagingDir, '.env'), [
    `DB_HOST=${env.DB_HOST}`,
    `DB_PORT=${env.DB_PORT || 3306}`,
    `DB_USERNAME=${env.DB_USER}`,
    `DB_PASSWORD=${env.DB_PASSWORD}`,
    `DB_NAME=${env.DB_NAME}`,
    `JWT_SECRET=${env.NEXTAUTH_SECRET || 'change-this-in-production'}`,
    `JWT_EXPIRES_IN=7d`,
    `GOOGLE_CLIENT_ID=${env.GOOGLE_CLIENT_ID}`,
    `GOOGLE_CLIENT_SECRET=${env.GOOGLE_CLIENT_SECRET}`,
    `GOOGLE_CALLBACK_URL=https://api.pethubthai.com/api/auth/google/callback`,
    `FACEBOOK_APP_ID=${env.FACEBOOK_APP_ID}`,
    `FACEBOOK_APP_SECRET=${env.FACEBOOK_APP_SECRET}`,
    `FACEBOOK_CALLBACK_URL=https://api.pethubthai.com/api/auth/facebook/callback`,
    `PORT=3001`,
    `FRONTEND_URL=https://pethubthai.com`,
    `BACKEND_URL=https://api.pethubthai.com`,
    `UPLOAD_DIR=./uploads`,
    `MAX_FILE_SIZE=5242880`,
  ].join('\n'));
  ok('Production .env written');
  info('node_modules จะถูก install อัตโนมัติโดย startup.js เมื่อ Plesk start ครั้งแรก');

  log('[3/3] Uploading via FTP');
  await ftpUpload(stagingDir, BACKEND_REMOTE);
  ok(`Backend deployed → /${BACKEND_REMOTE}`);
  info('Plesk Startup File: startup.js');
}

// ── CLEANUP ───────────────────────────────────────────────────────────────────
function cleanup() {
  const d = path.join(ROOT_DIR, '.deploy');
  if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true });
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀  PetHub Thai — Plesk Deploy');
  console.log(`   FTP: ${FTP_USER}@${FTP_HOST}:${FTP_PORT}`);
  console.log(`   Target: ${only === 'all' ? 'frontend + backend' : only}`);

  try {
    if (doFrontend) await deployFrontend();
    if (doBackend)  await deployBackend();
    cleanup();

    console.log('\n🎉  Deploy เสร็จสิ้น!');
    console.log('\n📋  Plesk config:');
    if (doFrontend) console.log('   Frontend  (pethubthai.com)     → Startup File: server.js');
    if (doBackend)  console.log('   Backend   (api.pethubthai.com) → Startup File: startup.js');
    console.log('');
  } catch (err) {
    console.error('\n❌  Deploy ล้มเหลว:', err.message);
    cleanup();
    process.exit(1);
  }
}

main();
