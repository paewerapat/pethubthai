import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'เคล็ดลับหาน้อง',
  description: 'เคล็ดลับและวิธีการค้นหาสัตว์เลี้ยงที่หายไป เพิ่มโอกาสให้น้องได้กลับบ้าน',
};

const sections = [
  {
    emoji: '⚡',
    title: 'ทำทันที — 24 ชั่วโมงแรกสำคัญที่สุด',
    color: 'border-red-200 bg-red-50',
    titleColor: 'text-red-700',
    tips: [
      'ค้นหารอบๆ บริเวณที่หายทันที ในรัศมี 500 เมตร – 1 กม.',
      'โพสต์ประกาศบน PetHub Thai พร้อมรูปที่ชัดเจน',
      'แจ้งเพื่อนบ้านใกล้เคียงและคนในชุมชน',
      'ติดโปสเตอร์บริเวณจุดที่หายและพื้นที่ใกล้เคียง',
      'แชร์ประกาศในกลุ่ม Facebook ในพื้นที่ทันที',
    ],
  },
  {
    emoji: '🗺️',
    title: 'ค้นหาอย่างเป็นระบบ',
    color: 'border-blue-200 bg-blue-50',
    titleColor: 'text-blue-700',
    tips: [
      'ค้นหาในช่วงเช้าตรู่และพลบค่ำ ซึ่งน้องมักออกมาหาอาหาร',
      'เรียกชื่อน้องด้วยเสียงปกติ ไม่ตะโกน เพราะอาจทำให้น้องกลัวมากขึ้น',
      'พกของที่น้องชอบ เช่น ขนม หรือของเล่น',
      'วางเสื้อผ้าที่มีกลิ่นตัวเจ้าของไว้ใกล้บ้าน',
      'ตรวจสอบที่ซ่อน เช่น ใต้รถ, ในพุ่มไม้, ในท่อระบายน้ำ',
      'ขยายพื้นที่ค้นหาเพิ่มทุกวัน',
    ],
  },
  {
    emoji: '📱',
    title: 'ใช้โซเชียลมีเดียให้เต็มที่',
    color: 'border-green-200 bg-green-50',
    titleColor: 'text-green-700',
    tips: [
      'แชร์ประกาศผ่าน Facebook, Line, Instagram ทุกช่องทาง',
      'โพสต์ใน Facebook Group ในพื้นที่ เช่น "หมาหายแมวหาย [จังหวัด]"',
      'ส่งข้อความในกลุ่มไลน์ชุมชน, หมู่บ้าน',
      'ใช้ฟีเจอร์ Stories บน Facebook/Instagram เพื่อเพิ่มการมองเห็น',
      'ติดต่อเพจรับเรื่องสัตว์หาย เช่น เพจในจังหวัดของคุณ',
      'อัปเดตสถานะบนประกาศ PetHub Thai อยู่เสมอ',
    ],
  },
  {
    emoji: '🏥',
    title: 'ติดต่อสถานที่สำคัญ',
    color: 'border-purple-200 bg-purple-50',
    titleColor: 'text-purple-700',
    tips: [
      'แจ้งคลินิกสัตวแพทย์และโรงพยาบาลสัตว์ในพื้นที่ทุกแห่ง',
      'ติดต่อสถานสงเคราะห์สัตว์ (Shelter) ในจังหวัด',
      'แจ้งเทศบาล/อบต. ที่ดูแลสุนัขและแมวจรจัด',
      'ติดต่อร้านขายอาหารสัตว์และร้านตัดขน ในย่านนั้น',
      'หากน้องมีไมโครชิป ติดต่อองค์กรที่จดทะเบียนไว้',
    ],
  },
  {
    emoji: '📸',
    title: 'รูปภาพที่ดีช่วยได้มาก',
    color: 'border-amber-200 bg-amber-50',
    titleColor: 'text-amber-700',
    tips: [
      'ใช้รูปที่เห็นหน้าน้องชัดเจน แสงสว่างเพียงพอ',
      'ถ่ายรูปจุดเด่นของน้อง เช่น สี, ลวดลาย, บาดแผล หรือจุดสังเกต',
      'ใส่รูปจากมุมต่างๆ ทั้งหน้า, ข้าง, และจากด้านบน',
      'อัปโหลดรูปล่าสุดที่สุด ไม่เกิน 6 เดือน',
    ],
  },
  {
    emoji: '💡',
    title: 'เคล็ดลับเพิ่มเติม',
    color: 'border-gray-200 bg-gray-50',
    titleColor: 'text-gray-700',
    tips: [
      'อย่าหมดหวัง มีน้องที่กลับบ้านได้แม้หายไปหลายสัปดาห์',
      'ติดกล้องดักถ่ายหน้าบ้านในเวลากลางคืน',
      'วางกรงดักพร้อมอาหารในบริเวณที่คาดว่าน้องอยู่',
      'หากน้องมีค่าตอบแทน ระบุในประกาศเพื่อเพิ่มแรงจูงใจ',
      'ติดต่อคนงาน, แม่บ้าน, หรือผู้ส่งของในพื้นที่',
    ],
  },
];

export default function TipsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-5xl mb-4">💡</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">เคล็ดลับหาน้อง</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            รวมวิธีค้นหาสัตว์เลี้ยงที่หายไปอย่างได้ผล เพิ่มโอกาสให้น้องได้กลับบ้าน
          </p>
        </div>

        {/* Alert */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-10 flex gap-4">
          <span className="text-2xl shrink-0">🚨</span>
          <div>
            <p className="font-bold text-red-700 mb-1">24 ชั่วโมงแรกสำคัญที่สุด!</p>
            <p className="text-red-600 text-sm">
              สัตว์เลี้ยงที่หายมีโอกาสสูงที่สุดที่จะถูกพบในช่วง 24–48 ชั่วโมงแรก
              ยิ่งดำเนินการเร็วยิ่งเพิ่มโอกาสในการค้นพบ
            </p>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="space-y-6">
          {sections.map((s, i) => (
            <div key={i} className={`rounded-2xl border p-6 ${s.color}`}>
              <h2 className={`text-xl font-bold mb-4 flex items-center gap-3 ${s.titleColor}`}>
                <span className="text-2xl">{s.emoji}</span>
                {s.title}
              </h2>
              <ul className="space-y-2.5">
                {s.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-gray-700 text-sm">
                    <span className="text-[#5fca9f] font-bold mt-0.5 shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-gray-600 mb-6">โพสต์ประกาศตามหาน้องพร้อมรูปภาพชัดๆ เพื่อเพิ่มโอกาส</p>
          <Link href="/post/create" className="btn-primary">
            โพสต์ตามหาน้องเดี๋ยวนี้
          </Link>
        </div>
      </div>
    </Layout>
  );
}
