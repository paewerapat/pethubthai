/**
 * startup.js — Plesk Node.js entry point
 *
 * ตั้ง Application Startup File ใน Plesk ชี้มาที่ไฟล์นี้
 * ครั้งแรกที่ start จะรัน `npm install --production` อัตโนมัติ
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const nm = path.join(__dirname, 'node_modules');

if (!fs.existsSync(nm)) {
  console.log('[startup] Installing dependencies...');
  try {
    execSync('npm install --production --prefer-offline', {
      cwd: __dirname,
      stdio: 'inherit',
    });
    console.log('[startup] Done.');
  } catch (err) {
    console.error('[startup] npm install failed:', err.message);
    process.exit(1);
  }
}

require('./dist/main.js');
