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
    imageFile: 'cat-1.jpeg',
    petName: 'น้องมิ้ว',
    petType: 'cat',
    breed: 'วิเชียรมาศ',
    gender: 'female',
    ageEstimate: '2 ปี',
    lostDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lostLocation: 'ลาดพร้าว บางกะปิ กรุงเทพมหานคร 10240',
    latitude: 13.8121,
    longitude: 100.6075,
    description: 'น้องมิ้วเป็นแมววิเชียรมาศ ขนสีขาวครีม ดวงตาสีฟ้า ตัวเล็กบอบบาง ใส่ปลอกคอสีชมพูมีกระดิ่งเล็ก หายไปแถวซอยลาดพร้าว 71 ถ้าเจอกรุณาโทรติดต่อด่วน',
    phoneNumber: '0812345601',
    posterName: 'สุภาพร ใจดี',
    lineId: 'suphaporn.cat',
    hasReward: true,
    rewardAmount: '500 บาท',
  },
  {
    imageFile: 'cat-2.jpeg',
    petName: 'น้องส้ม',
    petType: 'cat',
    breed: 'พันธุ์ผสม',
    gender: 'male',
    ageEstimate: '1 ปี',
    lostDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lostLocation: 'ประชาธิปัตย์ ธัญบุรี ปทุมธานี 12130',
    latitude: 14.0245,
    longitude: 100.7473,
    description: 'น้องส้มแมวสีส้มอ่อน ท้องสีขาว ขนสั้น ตัวกลม หน้าตาน่ารัก ไม่ใส่ปลอกคอ หายออกจากบ้านตอนกลางคืน บริเวณหมู่บ้านแถวรังสิต ช่วยแชร์ด้วยนะคะ',
    phoneNumber: '0898765432',
    posterName: 'กมลา รักน้อง',
    lineId: 'kamala.cat99',
    hasReward: true,
    rewardAmount: '1,000 บาท',
  },
  {
    imageFile: 'cat-3.webp',
    petName: 'น้องเมฆ',
    petType: 'cat',
    breed: 'อเมริกันช็อตแฮร์',
    gender: 'male',
    ageEstimate: '3 ปี',
    lostDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lostLocation: 'บางใหญ่ บางใหญ่ นนทบุรี 11140',
    latitude: 13.8532,
    longitude: 100.4178,
    description: 'น้องเมฆแมวลายเสือสีเทา มีแถบสีดำที่หน้าผาก ใส่ปลอกคอสีแดง มีชิปฝังที่หู หายไปเมื่อเย็นวาน แถวหมู่บ้านศุภาลัย นนทบุรี น้องเป็นแมวที่ตกใจง่ายมาก ถ้าเจอกรุณาอย่าจับทันที',
    phoneNumber: '0654321098',
    posterName: 'ธนากร สีเมฆ',
    facebook: 'thanakorn.cat',
    hasReward: false,
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
                 : filename.endsWith('.jpeg') || filename.endsWith('.jpg') ? 'image/jpeg'
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
    'seed@pethubthai.com',
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
