import type { Metadata } from 'next';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว',
  description: 'นโยบายความเป็นส่วนตัวของ PetHub Thai ว่าด้วยการเก็บและใช้ข้อมูลส่วนบุคคล',
};

const dot = <span className="text-[#5fca9f] shrink-0">•</span>;
const check = <span className="text-[#5fca9f] shrink-0 font-bold">✓</span>;

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">{dot}{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  const updated = '5 มิถุนายน 2026';

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="mb-10">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">นโยบายความเป็นส่วนตัว</h1>
          <p className="text-sm text-gray-400">อัปเดตล่าสุด: {updated}</p>
        </div>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">1. บทนำ</h2>
            <p>
              PetHub Thai ("เรา") ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน ("คุณ") เป็นอย่างยิ่ง
              นโยบายนี้อธิบายว่าเราเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณอย่างไร
              เมื่อคุณใช้งานเว็บไซต์ pethubthai.com และบริการที่เกี่ยวข้อง
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4">2. ข้อมูลที่เราเก็บรวบรวม</h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.1 ข้อมูลที่คุณให้โดยตรง</h3>
                <List items={[
                  'ชื่อและอีเมล (สำหรับการสมัครสมาชิก)',
                  'รหัสผ่าน (เข้ารหัสด้วย bcrypt ก่อนบันทึก ไม่มีใครเห็นได้)',
                  'ข้อมูลประกาศ: ชื่อสัตว์เลี้ยง ประเภท สายพันธุ์ เพศ อายุ',
                  'เบอร์โทรศัพท์ LINE ID Facebook Instagram สำหรับติดต่อ',
                  'สถานที่ที่สัตว์หาย พร้อมพิกัด GPS บนแผนที่',
                  'รูปภาพสัตว์เลี้ยงที่อัพโหลด (สูงสุด 3 รูป ขนาดไม่เกิน 5 MB)',
                ]} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.2 ข้อมูลที่เก็บอัตโนมัติ</h3>
                <List items={[
                  'ที่อยู่ IP สำหรับ rate limiting และ security',
                  'User Agent ของเบราวเซอร์',
                  'ข้อมูลการใช้งาน (Analytics): หน้าที่เข้าชม, การกดแชร์, เวลาที่ใช้งาน',
                  'สถานะ login/guest สำหรับวิเคราะห์การใช้งาน',
                  'จำนวนครั้งที่โพสต์ถูกเข้าชม (View Count)',
                ]} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.3 ข้อมูลจาก OAuth (Google / Facebook / LINE)</h3>
                <p>
                  หากคุณเข้าสู่ระบบด้วย Google, Facebook หรือ LINE เราจะได้รับเฉพาะชื่อ อีเมล
                  และรูปโปรไฟล์จากบัญชีนั้น ตามที่คุณอนุญาต เราไม่มีสิทธิ์เข้าถึงข้อมูลอื่น
                  ในบัญชีโซเชียลของคุณ
                </p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">3. วัตถุประสงค์การใช้ข้อมูล</h2>
            <ul className="space-y-2">
              {[
                'ให้บริการแพลตฟอร์มโพสต์และค้นหาสัตว์เลี้ยงที่หายหรือหาบ้านใหม่',
                'ยืนยันตัวตนและรักษาความปลอดภัยของบัญชี',
                'แสดงข้อมูลติดต่อในประกาศเพื่อช่วยเหลือสัตว์เลี้ยง',
                'วิเคราะห์การใช้งานเพื่อปรับปรุงบริการ (เก็บเป็น Event Log ไม่ระบุตัวตน)',
                'ป้องกัน spam และการใช้งานที่ผิดวัตถุประสงค์ด้วย rate limiting',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">{check}{item}</li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">4. Analytics และ Event Log</h2>
            <p className="mb-3">
              เราเก็บข้อมูลการใช้งาน (Event Log) เพื่อพัฒนาแพลตฟอร์ม โดยข้อมูลที่เก็บ ได้แก่:
            </p>
            <List items={[
              'การเข้าชมหน้าเว็บ พร้อมสถานะว่าเป็นสมาชิกหรือผู้เยี่ยมชมทั่วไป',
              'การกดปุ่มแชร์ผ่านช่องทางต่างๆ (Facebook, X, LINE)',
              'การยืนยันเจอน้อง/น้องได้บ้านแล้ว',
              'การสมัครสมาชิกและเข้าสู่ระบบ',
            ]} />
            <p className="mt-3 text-gray-500">
              ข้อมูลเหล่านี้ใช้สำหรับ Dashboard ของผู้ดูแลระบบเท่านั้น ไม่มีการเปิดเผยต่อสาธารณะ
              และไม่นำไปใช้ในเชิงพาณิชย์
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">5. การเปิดเผยข้อมูล</h2>
            <p className="mb-3">เราจะไม่ขายหรือเช่าข้อมูลส่วนบุคคลของคุณให้บุคคลที่สาม ยกเว้นกรณีดังนี้:</p>
            <List items={[
              'ข้อมูลในประกาศ (ชื่อสัตว์, เบอร์ติดต่อ) จะแสดงสาธารณะตามเจตนาของคุณในการโพสต์ — เมื่อสัตว์เจอแล้ว ข้อมูลติดต่อจะถูกซ่อนโดยอัตโนมัติ',
              'ข้อมูลที่จำเป็นสำหรับผู้ให้บริการระบบ (เซิร์ฟเวอร์, ฐานข้อมูล) ภายใต้สัญญาเก็บรักษาความลับ',
              'ข้อมูลที่กฎหมายกำหนดให้ต้องเปิดเผยต่อหน่วยงานรัฐ',
            ]} />
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">6. การรักษาความปลอดภัย</h2>
            <p className="mb-3">เราใช้มาตรการรักษาความปลอดภัยหลายชั้น ดังนี้:</p>
            <ul className="space-y-2">
              {[
                'เข้ารหัสรหัสผ่านด้วย bcrypt ก่อนบันทึก',
                'ใช้ HTTPS เข้ารหัสการรับส่งข้อมูลทั้งหมด (HSTS)',
                'JWT Token สำหรับการยืนยันตัวตน',
                'Rate Limiting: จำกัด 5 ครั้ง/นาที สำหรับ Login และ Register ป้องกัน brute-force',
                'จำกัด 3 โพสต์/วัน/ผู้ใช้ ป้องกัน spam',
                'HTTP Security Headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy ฯลฯ)',
                'Honeypot field ในฟอร์มสมัครสมาชิกและเข้าสู่ระบบ ป้องกัน bot',
                'ตรวจสอบประเภทไฟล์ที่อัพโหลดว่าเป็นรูปภาพเท่านั้น',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="shrink-0">🔒</span>{item}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">7. สิทธิ์ของคุณ</h2>
            <ul className="space-y-2">
              {[
                'สิทธิ์ในการเข้าถึงข้อมูลส่วนบุคคลของตนเอง',
                'สิทธิ์ในการแก้ไขข้อมูลประกาศที่ไม่ถูกต้อง',
                'สิทธิ์ในการลบโพสต์ของตนเองได้ตลอดเวลา',
                'สิทธิ์ในการขอลบบัญชีและข้อมูลทั้งหมด',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">{check}{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-gray-500">
              ติดต่อ <a href="mailto:pethubth@gmail.com" className="text-[#5fca9f] hover:underline">pethubth@gmail.com</a> เพื่อใช้สิทธิ์ของคุณ
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">8. การเก็บรักษาข้อมูล</h2>
            <List items={[
              'ข้อมูลบัญชีและโพสต์ — เก็บตลอดอายุการใช้งาน หรือจนกว่าคุณจะขอลบ',
              'Event Log — เก็บไว้เพื่อวิเคราะห์และพัฒนาบริการ',
              'ข้อมูลรูปภาพ — เก็บบน server จนกว่าโพสต์จะถูกลบ',
            ]} />
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">9. คุกกี้และ LocalStorage</h2>
            <p>
              เราใช้ LocalStorage ของเบราวเซอร์สำหรับเก็บ JWT Token (session) เท่านั้น
              ซึ่งจะถูกลบเมื่อคุณกด "ออกจากระบบ" เราไม่ใช้ Tracking Cookies
              สำหรับ Analytics เราใช้ Google Analytics และระบบ Event Log ภายในเท่านั้น
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">10. การเปลี่ยนแปลงนโยบาย</h2>
            <p>
              เราอาจอัปเดตนโยบายนี้เป็นครั้งคราว โดยจะแจ้งวันที่อัปเดตล่าสุดที่ด้านบนของหน้านี้
              การใช้งานต่อเนื่องหลังจากการเปลี่ยนแปลงถือว่าคุณยอมรับนโยบายใหม่
            </p>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3">11. ติดต่อเรา</h2>
            <p className="mb-3">หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว ติดต่อได้ที่:</p>
            <div className="space-y-2">
              <a href="mailto:pethubth@gmail.com" className="flex items-center gap-2 text-[#5fca9f] hover:underline font-medium">
                📧 pethubth@gmail.com
              </a>
              <a href="https://www.facebook.com/pethubthailand" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#1877F2] hover:underline font-medium">
                📘 facebook.com/pethubthailand
              </a>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}
