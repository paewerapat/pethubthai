/**
 * deploy.mjs — PetHub TH Deploy Script (Plesk)
 *
 * Usage:
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

// ── Parse .env.local ──────────────────────────────────────────────────────────
function parseEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .forEach((line) => {
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

const env = parseEnv(path.join(__dirname, 'frontend/.env.local'));

const FTP_HOST        = env.FTP_HOST     || process.env.FTP_HOST;
const FTP_USER        = env.FTP_USER     || process.env.FTP_USER;
const FTP_PASSWORD    = env.FTP_PASSWORD || process.env.FTP_PASSWORD;
const FTP_PORT        = parseInt(env.FTP_PORT || '21', 10);
const FRONTEND_REMOTE = env.FTP_FRONTEND_PATH || 'httpdocs';
const BACKEND_REMOTE  = env.FTP_BACKEND_PATH  || 'api.pethubthai.com';

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
  console.error('❌  FTP credentials ไม่พบ — ตรวจสอบ frontend/.env.local');
  process.exit(1);
}

// ── CLI flags ─────────────────────────────────────────────────────────────────
const arg = process.argv.find((a) => a.startsWith('--only='));
const only = arg ? arg.split('=')[1] : 'all';
const doFrontend = only === 'all' || only === 'frontend';
const doBackend  = only === 'all' || only === 'backend';

// ── Helpers ───────────────────────────────────────────────────────────────────
const log   = (msg) => console.log(`\n${msg}`);
const ok    = (msg) => console.log(`  ✅  ${msg}`);
const info  = (msg) => console.log(`  ℹ️   ${msg}`);
const run   = (cmd, cwd) => {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
};

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDirSync(s, d) : fs.copyFileSync(s, d);
  }
}

// ── FTP Upload ────────────────────────────────────────────────────────────────
async function ftpUploadDir(localDir, remoteDir) {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  let lastFile = '';
  client.trackProgress((info) => {
    if (info.name !== lastFile) {
      lastFile = info.name;
      process.stdout.write(`\r  📤  ${info.name.slice(0, 55).padEnd(55)}`);
    }
  });

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      port: FTP_PORT,
      secure: false,
    });
    ok('FTP connected');

    await client.ensureDir(remoteDir);
    await client.clearWorkingDir();
    ok(`Cleared: /${remoteDir}`);

    await client.uploadFromDir(localDir);
    process.stdout.write('\n');
    ok(`Uploaded → /${remoteDir}`);
  } finally {
    client.close();
  }
}

// ── FRONTEND ──────────────────────────────────────────────────────────────────
async function deployFrontend() {
  log('══ FRONTEND ════════════════════════════════════════');
  log('[1/3] Building Next.js (standalone output)');

  const frontendDir   = path.join(__dirname, 'frontend');
  const standaloneSrc = path.join(frontendDir, '.next/standalone');
  const staticSrc     = path.join(frontendDir, '.next/static');
  const publicSrc     = path.join(frontendDir, 'public');
  const stagingDir    = path.join(__dirname, '.deploy/frontend');

  // Build with production API URL
  run(
    `NEXT_PUBLIC_API_URL=https://api.pethubthai.com/api npm run build`,
    frontendDir,
  );
  ok('Build complete');

  // Assemble standalone bundle
  log('[2/3] Assembling standalone bundle');
  fs.rmSync(stagingDir, { recursive: true, force: true });

  // standalone/ already contains its own minimal node_modules — no npm install needed
  copyDirSync(standaloneSrc, stagingDir);
  copyDirSync(staticSrc, path.join(stagingDir, '.next/static'));
  copyDirSync(publicSrc, path.join(stagingDir, 'public'));

  // Production .env
  fs.writeFileSync(
    path.join(stagingDir, '.env'),
    [
      `NEXT_PUBLIC_API_URL=https://api.pethubthai.com/api`,
      `NEXTAUTH_URL=https://pethubthai.com`,
      `NEXTAUTH_SECRET=${env.NEXTAUTH_SECRET || 'change-this-in-production'}`,
    ].join('\n'),
  );
  ok('Staging ready (no node_modules needed — included in standalone)');

  log('[3/3] Uploading via FTP');
  await ftpUploadDir(stagingDir, FRONTEND_REMOTE);
  ok(`Frontend deployed → /${FRONTEND_REMOTE}`);

  info('Plesk: Application Startup File = server.js');
}

// ── BACKEND ───────────────────────────────────────────────────────────────────
async function deployBackend() {
  log('══ BACKEND ═════════════════════════════════════════');
  log('[1/3] Building NestJS');

  const backendDir = path.join(__dirname, 'backend');
  const stagingDir = path.join(__dirname, '.deploy/backend');

  run('npm run build', backendDir);
  ok('Build complete → dist/');

  // Assemble: dist/ + startup.js + package.json + package-lock.json + uploads/
  log('[2/3] Assembling deploy package (ไม่รวม node_modules)');
  fs.rmSync(stagingDir, { recursive: true, force: true });
  fs.mkdirSync(stagingDir, { recursive: true });

  copyDirSync(path.join(backendDir, 'dist'), path.join(stagingDir, 'dist'));
  fs.mkdirSync(path.join(stagingDir, 'uploads'), { recursive: true });
  fs.copyFileSync(path.join(backendDir, 'startup.js'), path.join(stagingDir, 'startup.js'));
  fs.copyFileSync(path.join(backendDir, 'package.json'), path.join(stagingDir, 'package.json'));
  fs.copyFileSync(path.join(backendDir, 'package-lock.json'), path.join(stagingDir, 'package-lock.json'));

  // Production .env
  fs.writeFileSync(
    path.join(stagingDir, '.env'),
    [
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
    ].join('\n'),
  );
  ok('Production .env written');
  info('node_modules จะถูก install อัตโนมัติโดย startup.js เมื่อ Plesk start ครั้งแรก');

  log('[3/3] Uploading via FTP');
  await ftpUploadDir(stagingDir, BACKEND_REMOTE);
  ok(`Backend deployed → /${BACKEND_REMOTE}`);

  info('Plesk: Application Startup File = startup.js');
}

// ── CLEANUP ───────────────────────────────────────────────────────────────────
function cleanup() {
  const d = path.join(__dirname, '.deploy');
  if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true });
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀  PetHub TH — Plesk Deploy');
  console.log(`   FTP: ${FTP_USER}@${FTP_HOST}:${FTP_PORT}`);
  console.log(`   Target: ${only === 'all' ? 'frontend + backend' : only}`);

  try {
    if (doFrontend) await deployFrontend();
    if (doBackend)  await deployBackend();
    cleanup();

    console.log('\n🎉  Deploy เสร็จสิ้น!');
    console.log('\n📋  Plesk config ที่ต้องตั้งครั้งเดียว:');
    if (doFrontend) {
      console.log('   Frontend  (pethubthai.com)     → Startup File: server.js');
    }
    if (doBackend) {
      console.log('   Backend   (api.pethubthai.com) → Startup File: startup.js');
      console.log('   ⚠️  ครั้งแรกที่ start จะช้าเพราะ startup.js รัน npm install อัตโนมัติ');
    }
    console.log('');
  } catch (err) {
    console.error('\n❌  Deploy ล้มเหลว:', err.message);
    cleanup();
    process.exit(1);
  }
}

main();
