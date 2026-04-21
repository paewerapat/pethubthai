# 🐾 Pet Hub Thailand

แพลตฟอร์มช่วยเหลือสัตว์เลี้ยงหาย รวมประกาศตามหา ประกาศรับเลี้ยง และหาบ้านให้น้องในประเทศไทย

## ✨ Features

- 🔍 **ประกาศตามหาสัตว์เลี้ยงหาย** - โพสต์ข้อมูลพร้อมรูปภาพ (1-3 รูป) และปักหมุดแผนที่
- 🏠 **ประกาศหาบ้านใหม่** - ช่วยน้องหาที่อยู่อาศัยใหม่
- 🗺️ **แผนที่ตำแหน่ง** - ใช้ Leaflet + OpenStreetMap (ฟรี 100%)
- 📍 **GPS Geolocation** - ดึงพิกัดปัจจุบันอัตโนมัติ
- 🔐 **ระบบ Authentication** - รองรับ Google, Facebook และ Email/Password
- ⏱️ **Rate Limiting** - จำกัดการโพสต์ 3 โพสต์/วัน เพื่อป้องกัน spam
- 🎨 **Pastel Theme** - ธีมสีพาสเทล กลมมน น่ารัก ใช้งานง่าย

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4** - Pastel theme with rounded corners
- **NextAuth.js** - Authentication (Google, Facebook, Email/Password)
- **Leaflet.js** + **React-Leaflet** - Maps with geolocation
- **React Hook Form** + **Zod** - Form validation
- **Axios** - API calls

### Backend
- **NestJS** - Scalable Node.js framework
- **TypeScript**
- **TypeORM** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **Passport + JWT** - Authentication
- **Throttler** - Rate limiting
- **bcrypt** - Password hashing

## 📁 Project Structure

```
pethubthai/
├── frontend/          # Next.js frontend
│   ├── app/          # App router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities
│   └── types/        # TypeScript types
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── posts/    # Posts CRUD module
│   │   ├── entities/ # Database entities
│   │   └── config/   # Configuration files
│   └── .env          # Environment variables
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 14+

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/pethubthai.git
cd pethubthai
```

### 2. Setup Database

สร้าง PostgreSQL database:

```sql
CREATE DATABASE pethubthai;
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and update:
# - Database credentials
# - JWT secret
# - OAuth credentials (optional)

# Run the backend
npm run start:dev
```

Backend จะรันที่: `http://localhost:3001/api`

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local and update:
# - API URL (ใช้ค่า default ได้เลย)
# - NextAuth secret
# - OAuth credentials (optional)

# Run the frontend
npm run dev
```

Frontend จะรันที่: `http://localhost:3000`

## 📝 Environment Variables

### Backend (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=pethubthai

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/auth/facebook/callback

PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-in-production

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก (email/password)
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/me` - ดูข้อมูลผู้ใช้ปัจจุบัน (ต้อง login)

### Posts
- `POST /api/posts` - สร้างโพสต์ใหม่ (ต้อง login, max 3/day)
- `GET /api/posts` - ดูโพสต์ทั้งหมด (รองรับ pagination, filter)
- `GET /api/posts/:id` - ดูโพสต์ตาม ID
- `GET /api/posts/my-posts` - ดูโพสต์ของฉัน (ต้อง login)
- `PATCH /api/posts/:id` - แก้ไขโพสต์ (ต้อง login, เจ้าของเท่านั้น)
- `DELETE /api/posts/:id` - ลบโพสต์ (ต้อง login, เจ้าของเท่านั้น)

## 🗺️ Maps & Geolocation

โปรเจคนี้ใช้:
- **Leaflet.js** - Library แผนที่ open-source (ฟรี 100%)
- **OpenStreetMap** - แผนที่ฟรีไม่มีค่าใช้จ่าย
- **Browser Geolocation API** - ดึง GPS ปัจจุบันจาก browser

ไม่ต้องใช้ Google Maps API key!

## 🎨 Design System

### Colors (Pastel Theme)
- Primary: `#7dd3a0` (เขียวพาสเทล)
- Secondary: `#88c9e8` (ฟ้าพาสเทล)
- Accent: `#ffb4d4` (ชมพูพาสเทล)
- Background: Gradient from pastel green to pastel blue

### Border Radius
- Buttons: `rounded-full` (pill shape)
- Cards: `rounded-3xl` (24px)
- Containers: `rounded-2xl` (16px)

## 📱 Features ที่กำลังพัฒนา

- [ ] NextAuth.js OAuth integration
- [ ] Image upload to cloud storage
- [ ] Leaflet map component with geolocation
- [ ] Create post form with map picker
- [ ] Posts listing page with filters
- [ ] Post detail page
- [ ] User profile page
- [ ] Real-time notifications
- [ ] Mobile responsive optimization

## 🤝 Contributing

Pull requests are welcome! สำหรับการเปลี่ยนแปลงใหญ่ กรุณาเปิด issue ก่อนเพื่อหารือ

## 📄 License

[MIT](LICENSE)

## 🙏 Acknowledgments

- Icons: Emoji
- Maps: Leaflet + OpenStreetMap
- Inspiration: ช่วยเหลือสัตว์เลี้ยงหายทั่วประเทศไทย

---

Made with ❤️ for Thai pets 🐶🐱
