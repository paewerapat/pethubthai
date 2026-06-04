/**
 * seed-adopt.mjs — เพิ่มข้อมูล Adoption Mockup + ติด [AI] ทุก post
 * รัน: node seed-adopt.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API = 'https://api.pethubthai.com/api';
const MOCKUP_DIR = path.join(__dirname, 'frontend/public/images/mockup');

// ── Adoption posts (home-1 ถึง home-6) ────────────────────────────────────────
const adoptPosts = [
  {
    account: 'seed@pethubthai.com',
    imageFile: 'home-1.jfif',
    petName: 'น้องบัตเตอร์คัพ [AI]',
    petType: 'dog',
    breed: 'โกลเด้น รีทรีฟเวอร์',
    gender: 'male',
    ageEstimate: '3 ปี',
    lostLocation: 'ลาดพร้าว กรุงเทพมหานคร 10230',
    latitude: 13.8121, longitude: 100.6075,
    description: '🤖 ข้อมูลนี้เป็น Mockup สร้างโดย AI เพื่อการทดสอบระบบเท่านั้น\n\nน้องบัตเตอร์คัพเป็นโกลเด้นฯ ขนสีทองสวย อารมณ์ดีมาก เล่นกับเด็กได้ดี ฉีดวัคซีนครบ ทำหมันแล้ว สุขภาพแข็งแรง หาบ้านใหม่เพราะเจ้าของย้ายคอนโดที่ไม่อนุญาตให้เลี้ยงสัตว์',
    phoneNumber: '0811111101',
    posterName: 'ทีมงาน PetHub Thai',
    lineId: 'pethub.adopt1',
    hasReward: false,
  },
  {
    account: 'seed@pethubthai.com',
    imageFile: 'home-2.jpg',
    petName: 'น้องมะลิ [AI]',
    petType: 'cat',
    breed: 'เปอร์เซีย',
    gender: 'female',
    ageEstimate: '2 ปี',
    lostLocation: 'สาทร กรุงเทพมหานคร 10120',
    latitude: 13.7234, longitude: 100.5236,
    description: '🤖 ข้อมูลนี้เป็น Mockup สร้างโดย AI เพื่อการทดสอบระบบเท่านั้น\n\nน้องมะลิแมวเปอร์เซียขนยาวสีขาว ใจดี ไม่ข่วน เลี้ยงในบ้าน ชอบนอนตักคน ฉีดวัคซีนครบ ทำหมันแล้ว หาบ้านที่รักแมวจริงๆ มีเวลาดูแลน้องได้',
    phoneNumber: '0811111102',
    posterName: 'ทีมงาน PetHub Thai',
    lineId: 'pethub.adopt2',
    hasReward: false,
  },
  {
    account: 'seed@pethubthai.com',
    imageFile: 'home-3.jfif',
    petName: 'น้องโดนัท [AI]',
    petType: 'dog',
    breed: 'ชิสุ',
    gender: 'male',
    ageEstimate: '1 ปี',
    lostLocation: 'บึงกุ่ม กรุงเทพมหานคร 10240',
    latitude: 13.7962, longitude: 100.6512,
    description: '🤖 ข้อมูลนี้เป็น Mockup สร้างโดย AI เพื่อการทดสอบระบบเท่านั้น\n\nน้องโดนัทชิสุตัวเล็กน่ารัก ขนฟูสีน้ำตาล-ขาว ซุกซนและเล่นสนุก ฝึกขับถ่ายในพื้นที่แล้ว ฉีดวัคซีนครบ ยังไม่ได้ทำหมัน เจ้าของเดิมเลี้ยงไม่ไหวเพราะมีลูกเล็ก',
    phoneNumber: '0811111103',
    posterName: 'ทีมงาน PetHub Thai',
    lineId: 'pethub.adopt3',
    hasReward: false,
  },
  {
    account: 'seed2@pethubthai.com',
    imageFile: 'home-4.jpeg',
    petName: 'น้องวานิลลา [AI]',
    petType: 'cat',
    breed: 'วิเชียรมาศ',
    gender: 'female',
    ageEstimate: '4 ปี',
    lostLocation: 'ดอนเมือง กรุงเทพมหานคร 10210',
    latitude: 13.9125, longitude: 100.5896,
    description: '🤖 ข้อมูลนี้เป็น Mockup สร้างโดย AI เพื่อการทดสอบระบบเท่านั้น\n\nน้องวานิลลาวิเชียรมาศสีครีม ดวงตาสีฟ้าสวยมาก เชื่อง ไม่กลัวคน ฉีดวัคซีนครบทุกปี ทำหมันแล้ว เจ้าของย้ายไปต่างประเทศ หาบ้านที่ดีให้น้องด่วน',
    phoneNumber: '0822222201',
    posterName: 'ทีมงาน PetHub Thai',
    lineId: 'pethub.adopt4',
    hasReward: false,
  },
  {
    account: 'seed2@pethubthai.com',
    imageFile: 'home-5.jpeg',
    petName: 'น้องปอนด์ [AI]',
    petType: 'dog',
    breed: 'ลาบราดอร์',
    gender: 'male',
    ageEstimate: '5 ปี',
    lostLocation: 'มีนบุรี กรุงเทพมหานคร 10510',
    latitude: 13.8156, longitude: 100.7254,
    description: '🤖 ข้อมูลนี้เป็น Mockup สร้างโดย AI เพื่อการทดสอบระบบเท่านั้น\n\nน้องปอนด์ลาบราดอร์สีดำ ฝึกมาดีมาก นั่ง นอน รอคำสั่งได้ ชอบออกกำลังกาย เหมาะบ้านที่มีพื้นที่กว้าง ฉีดวัคซีนครบ ทำหมันแล้ว เจ้าของเดิมป่วยดูแลไม่ได้',
    phoneNumber: '0822222202',
    posterName: 'ทีมงาน PetHub Thai',
    lineId: 'pethub.adopt5',
    hasReward: false,
  },
  {
    account: 'seed2@pethubthai.com',
    imageFile: 'home-6.webp',
    petName: 'น้องมิลค์ [AI]',
    petType: 'cat',
    breed: 'สก็อตติชโฟลด์',
    gender: 'female',
    ageEstimate: '1.5 ปี',
    lostLocation: 'ปทุมวัน กรุงเทพมหานคร 10330',
    latitude: 13.7454, longitude: 100.5342,
    description: '🤖 ข้อมูลนี้เป็น Mockup สร้างโดย AI เพื่อการทดสอบระบบเท่านั้น\n\nน้องมิลค์สก็อตติชโฟลด์หูพับ ขนสีขาวครีม ตากลมโต น่ารักมาก ชอบนอนอยู่เงียบๆ เหมาะสำหรับคอนโดหรือบ้านขนาดเล็ก ฉีดวัคซีนครบ ทำหมันแล้ว',
    phoneNumber: '0822222203',
    posterName: 'ทีมงาน PetHub Thai',
    lineId: 'pethub.adopt6',
    hasReward: false,
  },
];

// ── existing cat posts ที่ต้องติด [AI] ────────────────────────────────────────
const existingUpdates = [
  { account: 'seed@pethubthai.com',  name: 'น้องมิ้ว',    newName: 'น้องมิ้ว [AI]' },
  { account: 'seed@pethubthai.com',  name: 'น้องส้ม',    newName: 'น้องส้ม [AI]' },
  { account: 'seed@pethubthai.com',  name: 'น้องเมฆ',    newName: 'น้องเมฆ [AI]' },
  { account: 'seed2@pethubthai.com', name: 'น้องโมจิ',   newName: 'น้องโมจิ [AI]' },
  { account: 'seed2@pethubthai.com', name: 'น้องขนมปัง', newName: 'น้องขนมปัง [AI]' },
  { account: 'seed2@pethubthai.com', name: 'น้องซากุระ', newName: 'น้องซากุระ [AI]' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const log  = (msg) => console.log(`  ✅  ${msg}`);
const info = (msg) => console.log(`  ℹ️   ${msg}`);
const err  = (msg) => console.error(`  ❌  ${msg}`);

const tokens = {};
async function getToken(email) {
  if (tokens[email]) return tokens[email];
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'SeedPass2026!' }),
  });
  if (!res.ok) throw new Error(`Login ล้มเหลว: ${email}`);
  const { access_token } = await res.json();
  tokens[email] = access_token;
  log(`Login: ${email}`);
  return access_token;
}

async function uploadImage(token, filePath) {
  const filename = path.basename(filePath);
  const buffer = fs.readFileSync(filePath);
  const ext = filename.split('.').pop().toLowerCase();
  const mimeType = ext === 'webp' ? 'image/webp'
    : ['jpeg', 'jpg', 'jfif'].includes(ext) ? 'image/jpeg'
    : 'image/png';
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mimeType }), filename);
  const res = await fetch(`${API}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Upload ล้มเหลว: ${await res.text()}`);
  const { url } = await res.json();
  log(`อัพโหลด: ${filename} → ${url}`);
  return url;
}

async function createAdoptPost(token, post, imageUrl) {
  const { account, imageFile, ...data } = post;
  const res = await fetch(`${API}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ...data,
      status: 'available',
      category: 'adoption',
      lostDate: new Date().toISOString(),
      images: [{ imageUrl, order: 0 }],
    }),
  });
  if (!res.ok) throw new Error(`สร้าง post ล้มเหลว (${res.status}): ${await res.text()}`);
  const created = await res.json();
  log(`สร้าง adopt post: "${data.petName}" → /post/${created.id}`);
}

async function updatePostName(token, oldName, newName) {
  // หา post ก่อน
  const res = await fetch(`${API}/posts?limit=20`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const posts = data.data ?? [];
  const target = posts.find((p) => p.petName === oldName);
  if (!target) { info(`ไม่พบ post "${oldName}" (อาจอัปเดตไปแล้ว)`); return; }

  const patch = await fetch(`${API}/posts/${target.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ petName: newName }),
  });
  if (!patch.ok) throw new Error(`PATCH ล้มเหลว (${patch.status}): ${await patch.text()}`);
  log(`อัปเดต: "${oldName}" → "${newName}"`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🏡  PetHub Thai — Seed Adoption Data\n');

  // 1. สร้าง adoption posts
  console.log('── สร้าง Adoption Posts ──');
  for (const post of adoptPosts) {
    console.log(`\n  ${post.petName} (${post.imageFile})`);
    const imagePath = path.join(MOCKUP_DIR, post.imageFile);
    if (!fs.existsSync(imagePath)) { err(`ไม่พบ: ${imagePath}`); continue; }
    try {
      const token = await getToken(post.account);
      const imageUrl = await uploadImage(token, imagePath);
      await createAdoptPost(token, post, imageUrl);
    } catch (e) { err(e.message); }
  }

  // 2. ติด [AI] ให้ existing cat posts
  console.log('\n── อัปเดต Cat Posts เดิม ──');
  for (const u of existingUpdates) {
    try {
      const token = await getToken(u.account);
      await updatePostName(token, u.name, u.newName);
    } catch (e) { err(e.message); }
  }

  console.log('\n🎉  เสร็จสิ้น!\n');
}

main().catch((e) => { err(e.message); process.exit(1); });
