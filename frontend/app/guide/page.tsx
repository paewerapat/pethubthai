import type { Metadata } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'คู่มือการใช้งาน',
  description: 'วิธีใช้งาน PetHub Thai สำหรับการโพสต์ประกาศตามหาสัตว์เลี้ยง หาบ้านให้น้อง และค้นหาประกาศ',
};

const steps = [
  {
    step: '01',
    title: 'สมัครสมาชิกหรือเข้าสู่ระบบ',
    icon: '👤',
    color: 'from-[#5fca9f] to-[#4db889]',
    content: [
      'กดปุ่ม "เข้าสู่ระบบ" มุมบนขวา หรือกด ☰ บนมือถือ',
      'สมัครด้วยอีเมลและรหัสผ่าน หรือใช้บัญชี Google / Facebook / LINE',
      'ไม่จำเป็นต้องสมัครสมาชิกก็ดูประกาศและแผนที่ได้',
    ],
  },
  {
    step: '02',
    title: 'โพสต์ประกาศตามหาน้อง',
    icon: '🔍',
    color: 'from-[#6bb8e3] to-[#5aa3ce]',
    content: [
      'กดปุ่ม "เพิ่มโพสต์" → เลือก "โพสต์ตามหาน้อง"',
      'กรอกข้อมูลน้อง: ชื่อ, ประเภท (หมา/แมว/อื่นๆ), เพศ, สายพันธุ์, อายุ',
      'อัพโหลดรูปน้อง 1–3 รูป (รูปแรกจะเป็นรูปปก)',
      'ระบุวันที่และเวลาที่หาย',
      'พิมพ์ที่อยู่แล้วปักหมุดบนแผนที่ให้ตรงจุดที่สุด',
      'ใส่รายละเอียดเพิ่มเติมและช่องทางติดต่อ (เบอร์, LINE, Facebook)',
      'ตั้งค่าสินน้ำใจ (ถ้ามี) แล้วกด "โพสต์ตามหาน้อง"',
      'จำกัด 3 โพสต์ต่อวันต่อบัญชี',
    ],
  },
  {
    step: '03',
    title: 'ลงประกาศหาบ้านให้น้อง',
    icon: '🏡',
    color: 'from-amber-400 to-yellow-500',
    content: [
      'กดปุ่ม "เพิ่มโพสต์" → เลือก "ลงประกาศหาบ้านให้น้อง"',
      'กรอกข้อมูลน้องและสถานที่ที่สามารถรับน้องได้',
      'ระบุข้อมูลสุขภาพ: ฉีดวัคซีน, ทำหมัน แล้วกด "ลงประกาศ"',
      'ประกาศจะแสดงในหน้า "หาบ้านให้น้อง" และแผนที่',
    ],
  },
  {
    step: '04',
    title: 'ค้นหาและกรองประกาศ',
    icon: '🗂️',
    color: 'from-[#ff9ec7] to-[#e685b3]',
    content: [
      'ไปที่ "ตามหาน้อง" หรือ "หาบ้านให้น้อง" จาก navbar',
      'กรองตามประเภทสัตว์: สุนัข 🐶, แมว 🐱, อื่นๆ',
      'กรองสถานะ: หาย / เจอน้องแล้ว / ทั้งหมด (เฉพาะหน้าตามหาน้อง)',
      'กรองตามพื้นที่: จังหวัด, อำเภอ/เขต, ตำบล/แขวง',
      'สลับ "รายการ" และ "แผนที่" ได้จากปุ่มด้านขวา',
      'หมุดแผนที่: 🐶 = สุนัข, 🐱 = แมว, 🐾 = อื่นๆ (สีแตกต่างตามสถานะ)',
    ],
  },
  {
    step: '05',
    title: 'แชร์ประกาศไปโซเชียล',
    icon: '📢',
    color: 'from-purple-400 to-purple-600',
    content: [
      'เปิดหน้ารายละเอียดประกาศที่ต้องการแชร์',
      'กดแชร์ผ่าน Facebook, X (Twitter), LINE หรือคัดลอกลิงก์',
      'ข้อความแชร์จะมีชื่อน้อง ที่อยู่ และข้อความช่วยแชร์อัตโนมัติ',
      'เมื่อน้องเจอแล้ว ข้อความแชร์จะเปลี่ยนเป็น "✅ เจอน้องแล้ว!" โดยอัตโนมัติ',
      'ยิ่งแชร์มากยิ่งเพิ่มโอกาสให้น้องได้กลับบ้าน 💚',
    ],
  },
  {
    step: '06',
    title: 'ยืนยันเมื่อเจอน้องแล้ว',
    icon: '🎉',
    color: 'from-[#5fca9f] to-[#4db889]',
    content: [
      'เมื่อน้องกลับมาแล้ว ให้เข้าไปที่โพสต์ของตัวเอง',
      'กดปุ่มสีเขียว "🎉 เจอน้องแล้ว!" ด้านล่างรูปภาพ',
      'ยืนยันในป็อปอัปที่ขึ้นมา',
      'ข้อมูลติดต่อจะถูกซ่อนอัตโนมัติ และสถานะเปลี่ยนเป็น "เจอแล้ว"',
      'สำหรับโพสต์หาบ้าน ให้กดปุ่ม "🏡 น้องได้บ้านแล้ว!" แทน',
    ],
  },
  {
    step: '07',
    title: 'จัดการประกาศของคุณ',
    icon: '⚙️',
    color: 'from-gray-500 to-gray-600',
    content: [
      'กดชื่อผู้ใช้มุมบนขวา → "โพสต์ของฉัน"',
      'ดูประกาศทั้งหมดที่คุณโพสต์ไว้',
      'กดแก้ไข ✏️ เพื่อแก้ไขข้อมูลหรือรูปภาพ',
      'กดลบ 🗑️ เพื่อลบประกาศที่ไม่ต้องการ',
    ],
  },
];

export default function GuidePage() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-14">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">คู่มือการใช้งาน</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            เรียนรู้วิธีใช้งาน PetHub Thai เพื่อให้น้องของคุณได้กลับบ้านโดยเร็วที่สุด
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.step} className="card flex gap-5">
              <div className={`shrink-0 w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-2xl shadow-md`}>
                {s.icon}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-gray-400 tracking-widest">ขั้นตอนที่ {s.step}</span>
                <h2 className="text-xl font-bold text-gray-800 mt-1 mb-3">{s.title}</h2>
                <ul className="space-y-1.5">
                  {s.content.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="text-[#5fca9f] font-bold mt-0.5 shrink-0">✓</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Tips box */}
        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-bold text-amber-800 mb-3">💡 เคล็ดลับเพิ่มเติม</h3>
          <ul className="space-y-1.5 text-sm text-amber-700">
            {[
              'ใส่รูปที่ชัดเจน เห็นหน้าน้องครบ เพิ่มโอกาสให้คนจำได้มากขึ้น',
              'ระบุจุดที่หายให้แม่นยำบนแผนที่ ช่วยให้คนในพื้นที่เจอง่ายขึ้น',
              'แชร์ประกาศในกลุ่ม Facebook หรือ LINE ของชุมชนใกล้บ้าน',
              'อัปเดตสถานะทันทีเมื่อเจอน้องแล้ว เพื่อให้คนอื่นหยุดแชร์',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="shrink-0">→</span>{tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-center bg-gradient-to-br from-[#e8f8f0] to-[#e8f4f8] rounded-3xl p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">พร้อมเริ่มต้นแล้วใช่ไหม?</h2>
          <p className="text-gray-600 mb-6">โพสต์ประกาศได้เลย ฟรี ไม่มีค่าใช้จ่าย</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post/create" className="btn-primary">โพสต์ตามหาน้อง</Link>
            <Link href="/adopt/create" className="btn-secondary">หาบ้านให้น้อง</Link>
            <Link href="/faq" className="btn-outline">คำถามที่พบบ่อย</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
