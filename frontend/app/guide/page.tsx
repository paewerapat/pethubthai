import type { Metadata } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'คู่มือการใช้งาน',
  description: 'วิธีใช้งาน PetHub Thai สำหรับการโพสต์ประกาศตามหาสัตว์เลี้ยง และค้นหาประกาศ',
};

const steps = [
  {
    step: '01',
    title: 'สมัครสมาชิกหรือเข้าสู่ระบบ',
    icon: '👤',
    color: 'from-[#5fca9f] to-[#4db889]',
    content: [
      'กด "เข้าสู่ระบบ" มุมบนขวาของหน้าจอ',
      'สมัครด้วยอีเมลและรหัสผ่าน หรือใช้บัญชี Google / Facebook',
      'ยืนยันอีเมลและตั้งค่าโปรไฟล์ของคุณ',
    ],
  },
  {
    step: '02',
    title: 'โพสต์ประกาศตามหาน้อง',
    icon: '📝',
    color: 'from-[#6bb8e3] to-[#5aa3ce]',
    content: [
      'กด "โพสต์ตามหา" ที่ navbar หรือหน้าแรก',
      'กรอกข้อมูลน้อง: ชื่อ, ประเภท, เพศ, สายพันธุ์, อายุ',
      'อัพโหลดรูปน้อง 1–3 รูป (รูปแรกจะเป็นรูปปก)',
      'ระบุวันที่หาย, ที่อยู่ และปักหมุดบนแผนที่',
      'ใส่รายละเอียดเพิ่มเติมและช่องทางติดต่อ',
      'ตั้งค่าค่าตอบแทน/สินน้ำใจ (ถ้ามี)',
      'กด "โพสต์ตามหาน้อง" เพื่อเผยแพร่ประกาศ',
    ],
  },
  {
    step: '03',
    title: 'ค้นหาและกรองประกาศ',
    icon: '🔍',
    color: 'from-[#ff9ec7] to-[#e685b3]',
    content: [
      'ไปที่หน้า "ตามหาน้อง" เพื่อดูประกาศทั้งหมด',
      'กรองตามประเภทสัตว์: สุนัข, แมว, อื่นๆ',
      'กรองตามสถานะ: หาย, พบแล้ว, รับเลี้ยง',
      'กรองตามพื้นที่: จังหวัด, อำเภอ, ตำบล',
      'คลิกประกาศเพื่อดูรายละเอียดและติดต่อเจ้าของ',
    ],
  },
  {
    step: '04',
    title: 'แชร์ประกาศไปโซเชียล',
    icon: '📢',
    color: 'from-amber-400 to-yellow-500',
    content: [
      'เข้าไปในหน้ารายละเอียดของประกาศ',
      'เลือกแชร์ผ่าน Facebook, X (Twitter), Line หรือคัดลอกลิงก์',
      'ยิ่งแชร์มากยิ่งเพิ่มโอกาสให้น้องได้กลับบ้าน',
    ],
  },
  {
    step: '05',
    title: 'จัดการประกาศของคุณ',
    icon: '⚙️',
    color: 'from-purple-400 to-purple-600',
    content: [
      'ไปที่ "โพสต์ของฉัน" ในเมนูผู้ใช้',
      'แก้ไขข้อมูลประกาศได้ตลอดเวลา เช่น รูปภาพ, ข้อมูลติดต่อ',
      'เมื่อน้องกลับมาแล้ว กด "ทำเครื่องหมายพบแล้ว" เพื่ออัปเดต',
      'ลบประกาศได้หากไม่ต้องการแล้ว',
    ],
  },
];

export default function GuidePage() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">คู่มือการใช้งาน</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            เรียนรู้วิธีใช้งาน PetHub Thai เพื่อให้น้องของคุณได้กลับบ้านโดยเร็วที่สุด
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((s) => (
            <div key={s.step} className="card flex gap-6">
              <div className={`shrink-0 w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-2xl shadow-md`}>
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-gray-400 tracking-widest">ขั้นตอนที่ {s.step}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">{s.title}</h2>
                <ul className="space-y-2">
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

        {/* CTA */}
        <div className="mt-14 text-center bg-gradient-to-br from-[#e8f8f0] to-[#e8f4f8] rounded-3xl p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">พร้อมเริ่มต้นแล้วใช่ไหม?</h2>
          <p className="text-gray-600 mb-6">โพสต์ประกาศตามหาน้องได้เลย ฟรี ไม่มีค่าใช้จ่าย</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/post/create" className="btn-primary">โพสต์ตามหาน้อง</Link>
            <Link href="/faq" className="btn-outline">คำถามที่พบบ่อย</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
