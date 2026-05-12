import type { Metadata } from 'next';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว',
  description: 'นโยบายความเป็นส่วนตัวของ PetHub Thai ว่าด้วยการเก็บและใช้ข้อมูลส่วนบุคคล',
};

export default function PrivacyPage() {
  const updated = '1 พฤษภาคม 2026';

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">นโยบายความเป็นส่วนตัว</h1>
          <p className="text-sm text-gray-400">อัปเดตล่าสุด: {updated}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-sm leading-relaxed">

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">1. บทนำ</h2>
            <p>
              PetHub Thai ("เรา", "บริษัท") ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน ("คุณ") เป็นอย่างยิ่ง
              นโยบายนี้อธิบายว่าเราเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณอย่างไร
              เมื่อคุณใช้งานเว็บไซต์ pethubthai.com และบริการที่เกี่ยวข้อง
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">2. ข้อมูลที่เราเก็บรวบรวม</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.1 ข้อมูลที่คุณให้โดยตรง</h3>
                <ul className="space-y-1 pl-4">
                  {['ชื่อและอีเมล (สำหรับการสมัครสมาชิก)', 'รหัสผ่าน (เข้ารหัสก่อนบันทึก)', 'ข้อมูลประกาศ: ชื่อสัตว์ ที่อยู่ เบอร์ติดต่อ', 'รูปภาพสัตว์เลี้ยงที่อัพโหลด'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#5fca9f] shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.2 ข้อมูลที่เก็บอัตโนมัติ</h3>
                <ul className="space-y-1 pl-4">
                  {['ที่อยู่ IP และ User Agent ของเบราวเซอร์', 'ตำแหน่ง GPS (เฉพาะเมื่อคุณอนุญาต)', 'วันและเวลาที่เข้าใช้งาน'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#5fca9f] shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.3 ข้อมูลจาก OAuth (Google / Facebook)</h3>
                <p>
                  หากคุณเข้าสู่ระบบด้วย Google หรือ Facebook เราจะได้รับเฉพาะชื่อ อีเมล และรูปโปรไฟล์
                  จากบัญชีนั้น ตามที่คุณอนุญาต เราไม่มีสิทธิ์เข้าถึงข้อมูลอื่นในบัญชีโซเชียลของคุณ
                </p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">3. วัตถุประสงค์การใช้ข้อมูล</h2>
            <ul className="space-y-2">
              {[
                'ให้บริการแพลตฟอร์มโพสต์และค้นหาสัตว์เลี้ยงที่หาย',
                'ยืนยันตัวตนและรักษาความปลอดภัยของบัญชี',
                'แสดงข้อมูลติดต่อในประกาศเพื่อช่วยเหลือสัตว์เลี้ยง',
                'ปรับปรุงประสิทธิภาพและคุณภาพของบริการ',
                'ส่งการแจ้งเตือนที่เกี่ยวข้องกับประกาศของคุณ',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#5fca9f] shrink-0 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">4. การเปิดเผยข้อมูล</h2>
            <p className="mb-3">เราจะไม่ขายหรือเช่าข้อมูลส่วนบุคคลของคุณให้บุคคลที่สาม ยกเว้นกรณีดังนี้:</p>
            <ul className="space-y-2">
              {[
                'ข้อมูลในประกาศ (ชื่อสัตว์, เบอร์ติดต่อ) จะแสดงสาธารณะตามเจตนาของคุณในการโพสต์',
                'ข้อมูลที่จำเป็นสำหรับผู้ให้บริการระบบ (เซิร์ฟเวอร์, ฐานข้อมูล) ภายใต้สัญญาเก็บรักษาความลับ',
                'ข้อมูลที่กฎหมายกำหนดให้ต้องเปิดเผยต่อหน่วยงานรัฐ',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gray-400 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">5. การรักษาความปลอดภัย</h2>
            <p className="mb-3">เราใช้มาตรการรักษาความปลอดภัย ดังนี้:</p>
            <ul className="space-y-2">
              {[
                'เข้ารหัสรหัสผ่านด้วย bcrypt ก่อนบันทึก',
                'ใช้ HTTPS เข้ารหัสการรับส่งข้อมูลทั้งหมด',
                'JWT Token สำหรับการยืนยันตัวตน มีอายุ 7 วัน',
                'จำกัดการเข้าถึงฐานข้อมูลเฉพาะระบบภายใน',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#5fca9f] shrink-0">🔒</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">6. สิทธิ์ของคุณ</h2>
            <ul className="space-y-2">
              {[
                'สิทธิ์ในการเข้าถึงข้อมูลส่วนบุคคลของตนเอง',
                'สิทธิ์ในการแก้ไขข้อมูลที่ไม่ถูกต้อง',
                'สิทธิ์ในการลบบัญชีและข้อมูลทั้งหมด',
                'สิทธิ์ในการคัดค้านการใช้ข้อมูลบางประเภท',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#5fca9f] shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-gray-500">
              ติดต่อ <a href="mailto:pethubth@gmail.com" className="text-[#5fca9f] hover:underline">pethubth@gmail.com</a> เพื่อใช้สิทธิ์ของคุณ
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">7. คุกกี้</h2>
            <p>
              เราใช้ LocalStorage ของเบราวเซอร์สำหรับเก็บข้อมูล session (JWT Token) และการตั้งค่า
              ซึ่งจะถูกลบเมื่อคุณกด "ออกจากระบบ" เราไม่ใช้คุกกี้ติดตามพฤติกรรม (Tracking Cookies)
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">8. การเปลี่ยนแปลงนโยบาย</h2>
            <p>
              เราอาจอัปเดตนโยบายนี้เป็นครั้งคราว โดยจะแจ้งให้ทราบผ่านหน้าเว็บไซต์
              การใช้งานต่อเนื่องหลังจากการเปลี่ยนแปลงถือว่าคุณยอมรับนโยบายใหม่
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">9. ติดต่อเรา</h2>
            <p className="mb-2">หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว ติดต่อได้ที่:</p>
            <a href="mailto:pethubth@gmail.com" className="text-[#5fca9f] hover:underline font-medium">
              📧 pethubth@gmail.com
            </a>
          </section>

        </div>
      </div>
    </Layout>
  );
}
