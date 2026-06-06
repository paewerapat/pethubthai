/**
 * set-admin.mjs — กำหนด role=admin ให้ admin@pethubthai.com
 * รัน: node set-admin.mjs
 */

const API = 'https://api.pethubthai.com/api';

async function main() {
  // login เป็น admin ก่อน (ต้องรู้รหัสผ่าน)
  const email = 'admin@pethubthai.com';
  const password = process.argv[2];

  if (!password) {
    console.error('❌  ใส่รหัสผ่าน: node set-admin.mjs <password>');
    process.exit(1);
  }

  // ใช้ endpoint ที่จะสร้างด้านล่าง
  const res = await fetch(`${API}/auth/set-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('❌  ล้มเหลว:', data.message);
    process.exit(1);
  }
  console.log('✅  อัปเดต role=admin สำเร็จ กรุณา logout แล้ว login ใหม่');
}

main().catch(console.error);
