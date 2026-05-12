import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'คำถามที่พบบ่อย (FAQ)',
  description: 'คำถามและคำตอบที่พบบ่อยเกี่ยวกับการใช้งาน PetHub Thai',
};

const faqs = [
  {
    category: 'ทั่วไป',
    icon: '💬',
    items: [
      {
        q: 'PetHub Thai คืออะไร?',
        a: 'PetHub Thai เป็นแพลตฟอร์มออนไลน์สำหรับช่วยเหลือสัตว์เลี้ยงที่หายไป รวมประกาศตามหา และเป็นสื่อกลางให้เจ้าของสัตว์เลี้ยงและผู้ที่พบเจอสัตว์ได้ติดต่อกัน',
      },
      {
        q: 'ใช้งาน PetHub Thai ฟรีไหม?',
        a: 'ฟรี 100% ไม่มีค่าใช้จ่ายใดๆ ทั้งการสมัครสมาชิก โพสต์ประกาศ และดูประกาศทั้งหมด',
      },
      {
        q: 'PetHub Thai รองรับสัตว์ประเภทไหนบ้าง?',
        a: 'รองรับทุกประเภทสัตว์เลี้ยง ไม่ว่าจะเป็นสุนัข แมว กระต่าย นก หรือสัตว์เลี้ยงอื่นๆ สามารถเลือกหมวด "อื่นๆ" และระบุประเภทได้',
      },
    ],
  },
  {
    category: 'บัญชีผู้ใช้',
    icon: '👤',
    items: [
      {
        q: 'สมัครสมาชิกด้วยอะไรได้บ้าง?',
        a: 'สมัครได้ 3 วิธี: (1) อีเมลและรหัสผ่าน (2) บัญชี Google (3) บัญชี Facebook ใช้งานได้ทันทีหลังสมัคร',
      },
      {
        q: 'ลืมรหัสผ่านทำอย่างไร?',
        a: 'ขณะนี้ระบบรีเซ็ตรหัสผ่านอยู่ระหว่างพัฒนา หากลืมรหัสผ่านสามารถใช้การเข้าสู่ระบบด้วย Google หรือ Facebook แทนได้ หรือติดต่อเราที่ pethubth@gmail.com',
      },
      {
        q: 'แก้ไขข้อมูลโปรไฟล์ได้ไหม?',
        a: 'ได้ครับ สามารถแก้ไขชื่อและข้อมูลส่วนตัวได้ในหน้าโปรไฟล์ของตัวเอง',
      },
    ],
  },
  {
    category: 'ประกาศ',
    icon: '📋',
    items: [
      {
        q: 'โพสต์ประกาศได้มากแค่ไหน?',
        a: 'สามารถโพสต์ได้สูงสุด 3 ประกาศต่อชั่วโมง เพื่อป้องกันการสแปม แต่ไม่มีจำกัดจำนวนประกาศรวม',
      },
      {
        q: 'แก้ไขประกาศที่โพสต์แล้วได้ไหม?',
        a: 'ได้ครับ เจ้าของประกาศสามารถแก้ไขข้อมูลทั้งหมดได้ รวมถึงรูปภาพ โดยไปที่หน้ารายละเอียดประกาศและกดปุ่มแก้ไข (✏️)',
      },
      {
        q: 'ลบประกาศได้ไหม?',
        a: 'ได้ครับ เจ้าของประกาศสามารถลบได้ตลอดเวลา โดยกดปุ่มลบ (🗑️) ในหน้ารายละเอียดหรือหน้า "โพสต์ของฉัน"',
      },
      {
        q: 'เมื่อน้องกลับมาแล้วต้องทำอย่างไร?',
        a: 'ไปที่หน้า "โพสต์ของฉัน" แล้วกด "ทำเครื่องหมายพบแล้ว" เพื่ออัปเดตสถานะ จะช่วยให้คนอื่นรู้ว่าน้องกลับบ้านแล้ว 🎉',
      },
      {
        q: 'รูปภาพในประกาศมีข้อจำกัดอะไรบ้าง?',
        a: 'อัพโหลดได้สูงสุด 3 รูปต่อประกาศ ขนาดสูงสุดรูปละ 5 MB รองรับไฟล์ JPG, PNG และ WebP',
      },
    ],
  },
  {
    category: 'ความปลอดภัย',
    icon: '🔒',
    items: [
      {
        q: 'ข้อมูลส่วนตัวของเราปลอดภัยไหม?',
        a: 'เราเก็บข้อมูลเฉพาะที่จำเป็น และไม่แชร์ข้อมูลส่วนตัวให้บุคคลที่สาม รายละเอียดเพิ่มเติมดูได้ที่หน้านโยบายความเป็นส่วนตัว',
      },
      {
        q: 'เบอร์โทรในประกาศจะถูกเปิดเผยสาธารณะไหม?',
        a: 'ใช่ครับ เบอร์โทรที่ใส่ในประกาศจะแสดงสาธารณะเพื่อให้คนที่พบเจอน้องติดต่อได้ หากไม่ต้องการเปิดเผย แนะนำให้ใช้ Line ID หรือช่องทางอื่นแทน',
      },
      {
        q: 'พบประกาศหลอกลวงหรือเนื้อหาไม่เหมาะสม ทำอย่างไร?',
        a: 'ติดต่อเราได้ทันทีที่ pethubth@gmail.com พร้อมแนบลิงก์ประกาศ ทีมงานจะตรวจสอบและดำเนินการภายใน 24 ชั่วโมง',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-5xl mb-4">❓</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">คำถามที่พบบ่อย</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            รวบรวมคำถามที่ผู้ใช้งานถามบ่อย หากไม่พบคำตอบติดต่อเราได้เสมอ
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10">
          {faqs.map((section, si) => (
            <div key={si}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">{section.icon}</span>
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, ii) => (
                  <details key={ii} className="group card cursor-pointer">
                    <summary className="flex items-center justify-between font-semibold text-gray-800 list-none">
                      <span>{item.q}</span>
                      <span className="text-[#5fca9f] shrink-0 ml-4 text-xl group-open:rotate-45 transition-transform duration-200">+</span>
                    </summary>
                    <p className="mt-3 pt-3 border-t border-gray-100 text-gray-600 text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-14 bg-gradient-to-br from-[#e8f8f0] to-[#e8f4f8] rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ยังมีคำถามอีกไหม?</h2>
          <p className="text-gray-600 mb-5">ติดต่อทีมงานได้โดยตรง เราพร้อมช่วยเหลือคุณ</p>
          <a
            href="mailto:pethubth@gmail.com"
            className="btn-primary inline-flex"
          >
            📧 pethubth@gmail.com
          </a>
        </div>
      </div>
    </Layout>
  );
}
