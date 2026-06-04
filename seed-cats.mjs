/**
 * seed-cats.mjs — เพิ่มข้อมูลแมวตัวอย่างลง PetHub Thai
 * รัน: node seed-cats.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API = 'https://api.pethubthai.com/api';
const MOCKUP_DIR = path.join(__dirname, 'frontend/public/images/mockup');

// ── ข้อมูลแมวตัวอย่าง ─────────────────────────────────────────────────────────
const catPosts = [
  {
    imageFile: 'cat-4.webp',
    petName: 'น้องโมจิ',
    petType: 'cat',
    breed: 'สก็อตติชโฟลด์',
    gender: 'female',
    ageEstimate: '1.5 ปี',
    lostDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lostLocation: 'อ่อนนุช วัฒนา กรุงเทพมหานคร 10110',
    latitude: 13.7134,
    longitude: 100.6036,
    description: 'น้องโมจิแมวสก็อตติชโฟลด์ ขนสีเทาอ่อน หูพับ ตาสีทองกลมโต ใส่ปลอกคอสีม่วงมีชื่อห้อย หายออกจากคอนโดชั้น 3 แถวอ่อนนุช 17 ตอนประมาณ 2 ทุ่ม น้องไม่คุ้นที่ อาจซ่อนอยู่ใต้รถหรือพุ่มไม้',
    phoneNumber: '0923456789',
    posterName: 'พิมพ์นารา วงษ์ทอง',
    lineId: 'pimnaramochi',
    hasReward: true,
    rewardAmount: '2,000 บาท',
  },
  {
    imageFile: 'cat-5.jpg',
    petName: 'น้องขนมปัง',
    petType: 'cat',
    breed: 'เมนคูน',
    gender: 'male',
    ageEstimate: '4 ปี',
    lostDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    lostLocation: 'บางแค บางแค กรุงเทพมหานคร 10160',
    latitude: 13.7198,
    longitude: 100.4058,
    description: 'น้องขนมปังแมวเมนคูนตัวใหญ่ ขนยาวสีน้ำตาลทองลายแทบ มีขนฟูรอบคอ หางยาวฟู หายจากบ้านแถวซอยบางแค 14 ตอนบ่าย น้องเป็นแมวในบ้านไม่เคยออกนอก อาจตกใจและซ่อนอยู่ใกล้บ้าน',
    phoneNumber: '0876543219',
    posterName: 'วิชัย ประดิษฐ์',
    lineId: 'wichai.munchkin',
    facebook: 'wichai.cat',
    hasReward: true,
    rewardAmount: '1,500 บาท',
  },
  {
    imageFile: 'cat-6.jfif',
    petName: 'น้องซากุระ',
    petType: 'cat',
    breed: 'เปอร์เซีย',
    gender: 'female',
    ageEstimate: '2.5 ปี',
    lostDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    lostLocation: 'รามคำแหง สะพานสูง กรุงเทพมหานคร 10240',
    latitude: 13.7562,
    longitude: 100.6623,
    description: 'น้องซากุระแมวเปอร์เซียขนยาวสีขาวปลอด ขนฟูมาก หน้าบี้ ดวงตาสีฟ้า ใส่ปลอกคอสีชมพูลายดอก หายออกไปทางประตูหลังบ้านแถวรามคำแหง 150 น้องต้องการยาทุกวัน ถ้าเจอโปรดโทรด่วนมาก',
    phoneNumber: '0765432198',
    posterName: 'อรุณี จันทร์แสง',
    lineId: 'arunee.sakura',
    hasReward: true,
    rewardAmount: '3,000 บาท',
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const log  = (msg) => console.log(`  ✅  ${msg}`);
const info = (msg) => console.log(`  ℹ️   ${msg}`);
const err  = (msg) => console.error(`  ❌  ${msg}`);

async function registerOrLogin(email, password, name) {
  // ลอง register ก่อน
  const regRes = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  if (regRes.ok) {
    const data = await regRes.json();
    log(`Register สำเร็จ: ${email}`);
    return data.access_token;
  }

  // ถ้า register ไม่ได้ (email ซ้ำ) ให้ login แทน
  const loginRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!loginRes.ok) {
    const body = await loginRes.json();
    throw new Error(`Login ล้มเหลว: ${JSON.stringify(body)}`);
  }

  const data = await loginRes.json();
  log(`Login สำเร็จ: ${email}`);
  return data.access_token;
}

async function uploadImage(token, filePath) {
  const filename = path.basename(filePath);
  const buffer   = fs.readFileSync(filePath);
  const mimeType = filename.endsWith('.webp') ? 'image/webp'
                 : filename.endsWith('.jpeg') || filename.endsWith('.jpg') || filename.endsWith('.jfif') ? 'image/jpeg'
                 : 'image/png';

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mimeType }), filename);

  const res = await fetch(`${API}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Upload ล้มเหลว (${res.status}): ${body}`);
  }

  const { url } = await res.json();
  log(`อัพโหลด: ${filename} → ${url}`);
  return url;
}

async function createPost(token, postData, imageUrl) {
  const res = await fetch(`${API}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...postData,
      status: 'lost',
      images: [{ imageUrl, order: 0 }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`สร้าง post ล้มเหลว (${res.status}): ${body}`);
  }

  const post = await res.json();
  log(`สร้างประกาศ: "${postData.petName}" → /post/${post.id}`);
  return post;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🐱  PetHub Thai — Seed Cat Data\n');

  // Login ด้วย account สำหรับ seed
  const token = await registerOrLogin(
    'seed2@pethubthai.com',
    'SeedPass2026!',
    'ทีมงาน PetHub Thai',
  );

  console.log('');

  for (const cat of catPosts) {
    console.log(`\n── ${cat.petName} (${cat.imageFile}) ──`);

    const imagePath = path.join(MOCKUP_DIR, cat.imageFile);
    if (!fs.existsSync(imagePath)) {
      err(`ไม่พบไฟล์: ${imagePath}`);
      continue;
    }

    try {
      const imageUrl = await uploadImage(token, imagePath);
      const { imageFile, ...postData } = cat;
      await createPost(token, postData, imageUrl);
    } catch (e) {
      err(e.message);
    }
  }

  console.log('\n🎉  Seed เสร็จสิ้น! ดูผลได้ที่ https://pethubthai.com\n');
}

main().catch((e) => { err(e.message); process.exit(1); });
