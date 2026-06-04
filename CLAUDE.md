# PetHub Thai — Project Guide for Claude

## Overview
แพลตฟอร์มช่วยเหลือสัตว์เลี้ยง ประกอบด้วย 2 ประเภทหลัก:
- **ตามหาน้อง** (`category: lost`) — ประกาศหาสัตว์เลี้ยงที่หาย
- **หาบ้านให้น้อง** (`category: adoption`) — ประกาศหาบ้านให้น้อง

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16.2.4, React 19, TypeScript, Tailwind CSS v4 |
| Animation | Framer Motion v12, Lottie React v2 |
| Backend | NestJS, TypeORM, PostgreSQL |
| Deploy | Plesk FTP — `node deploy.mjs` |

## URLs
- Production frontend: `https://pethubthai.com`
- Production API: `https://api.pethubthai.com/api`
- Deploy script: `node deploy.mjs` (root), `--only=frontend` / `--only=backend`

## Project Structure

```
pethubthai/
├── frontend/               # Next.js App Router
│   ├── app/
│   │   ├── page.tsx        # หน้าแรก (server component, force-dynamic)
│   │   ├── posts/          # ตามหาน้อง list
│   │   ├── adopt/          # หาบ้านให้น้อง list
│   │   ├── post/[id]/      # detail page (PostDetailClient.tsx)
│   │   ├── login/          # login page ('use client')
│   │   └── register/
│   ├── components/
│   │   ├── Header.tsx      # navbar + mobile hamburger menu
│   │   ├── CursorPaw.tsx   # custom cat paw cursor (desktop only)
│   │   ├── FloatingPets.tsx # floating pet emojis (hero + login bg)
│   │   ├── LottieCat.tsx   # Lottie animation wrapper (cat-play-ball.json)
│   │   ├── PostCard.tsx    # card ใช้ทั้ง posts + adopt
│   │   └── PostForm.tsx    # form ใช้ร่วมกัน create/edit
│   ├── lib/
│   │   ├── api.ts          # axios client + Post/AuthUser types
│   │   └── utils.ts        # PET_META, STATUS_META, relativeTime
│   └── public/
│       ├── images/mockup/  # cat-1..6 (lost), home-1..6 (adoption)
│       └── lottie/
│           └── cat-play-ball.json  # 1080x1080 square Lottie
├── backend/
│   └── src/
│       ├── entities/post.entity.ts  # PostStatus, PostCategory enums
│       ├── posts/guards/post-rate-limit.guard.ts  # limit 3 posts/day/user
│       └── upload/upload.controller.ts  # POST /api/upload
├── seed-cats.mjs    # seed lost posts (cat-4,5,6 only — ตัวเก่าถูกลบ)
├── seed-adopt.mjs   # seed adoption posts (home-1..6) + ติด [AI] ให้ทุก post
└── deploy.mjs       # Plesk FTP deploy script
```

## Data Model — Post

```
category: 'lost' | 'adoption'
status:   'lost' | 'found' | 'adopted' | 'available'
```

| category | status ที่ใช้ | แสดงที่ |
|---|---|---|
| `lost` | `lost` / `found` / `adopted` | /posts |
| `adoption` | `available` / `adopted` | /adopt |

**STATUS_META** (utils.ts) — badge สี:
- `lost` → ชมพู "หาย"
- `found` → ฟ้า "พบแล้ว"
- `adopted` → เขียว "รับเลี้ยง"
- `available` → ส้ม "หาบ้าน"

## Key Rules

### Rate Limit
Backend จำกัด **3 posts/วัน/user** — seed accounts:
- `seed@pethubthai.com` / `seed2@pethubthai.com` (SeedPass2026!)
- ถ้า 429 → ใช้ account ใหม่ หรือรอวันถัดไป

### Lottie Cat
- ไฟล์: `/public/lottie/cat-play-ball.json` (1080×1080 square)
- Component `LottieCat` รับ `width`, `cropTop`, `cropBottom` (px)
- หน้าแรก desktop: `width=650 cropTop=134 cropBottom=194`
- หน้าแรก mobile: `width=300 cropTop=62 cropBottom=90`
- Login (แทนโลโก้): `width=160 cropTop=33 cropBottom=48`
- Content จริงอยู่ตรงกลาง ~50% ของ frame

### Animation Components
- `FloatingPets` — `variant="hero"` (6 ตัว) หรือ `variant="login"` (4 ตัว)
  - ใช้ `mounted` state เพื่อป้องกัน SSR hydration issue
- `CursorPaw` — desktop เท่านั้น (`hover: hover and pointer: fine`)
  - CSS `cursor: none !important` อยู่ใน globals.css

### PostDetailClient
เช็ค `post.category === 'adoption'` ก่อนแสดง:
- Breadcrumb link: `/posts` หรือ `/adopt`
- Label: "สถานที่หาย" หรือ "สถานที่รับเลี้ยง"
- shareText: "ตามหา..." หรือ "หาบ้านให้..."

### `ssr: false` ไม่ได้ใน Server Components
Next.js 16 ห้ามใช้ `dynamic(..., { ssr: false })` ใน Server Components
→ แก้ที่ component โดยใช้ `mounted` state (`if (!mounted) return null`) แทน

### Tailwind CSS v4
ใช้ `@import "tailwindcss"` ใน globals.css (ไม่ใช่ `@tailwind base` แบบเก่า)

## Mockup Data
โพสต์ที่ชื่อมี `[AI]` = ข้อมูล Mockup สร้างโดย AI ไม่ใช่ข้อมูลจริง:
- Lost: น้องมิ้ว, น้องส้ม, น้องเมฆ, น้องโมจิ, น้องขนมปัง, น้องซากุระ
- Adoption: น้องบัตเตอร์คัพ, น้องมะลิ, น้องโดนัท, น้องวานิลลา, น้องปอนด์, น้องมิลค์

## Common Commands

```bash
# Frontend
cd frontend && npm run dev      # dev server
cd frontend && npm run build    # production build

# Backend
cd backend && npm run dev       # dev server
cd backend && npm run build     # compile

# Seed
node seed-cats.mjs              # seed lost posts (cat-4,5,6)
node seed-adopt.mjs             # seed adoption + ติด [AI] ทุก post

# Deploy
node deploy.mjs                 # deploy ทั้งหมด
node deploy.mjs --only=frontend
node deploy.mjs --only=backend
```
