import Link from 'next/link';
import { FaFacebook } from 'react-icons/fa6';
import Header from './Header';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <MobileBottomNav />

      <footer className="bg-white/90 backdrop-blur-xl border-t border-white/50 pt-12 pb-32 md:pb-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

            {/* About */}
            <div className="space-y-4">
              <Link href="/">
                <img
                  src="/images/logo-width-transparent.png"
                  alt="PetHub Thai"
                  className="h-16 w-auto"
                />
              </Link>
              <p className="text-sm text-gray-600 leading-relaxed">
                ช่วยเหลือสัตว์เลี้ยงหายกลับบ้าน และหาบ้านใหม่ให้น้องทั่วประเทศไทย
                ฟรี ไม่มีค่าใช้จ่าย
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-gray-800">ลิงก์ด่วน</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-600 hover:text-[#5fca9f] transition-colors">กลับบ้าน</Link></li>
                <li><Link href="/posts" className="text-gray-600 hover:text-[#5fca9f] transition-colors">ตามหาน้อง</Link></li>
                <li><Link href="/post/create" className="text-gray-600 hover:text-[#5fca9f] transition-colors">โพสต์ตามหา</Link></li>
                <li><Link href="/adopt" className="text-gray-600 hover:text-[#5fca9f] transition-colors">หาบ้านให้น้อง</Link></li>
                <li><Link href="/login" className="text-gray-600 hover:text-[#5fca9f] transition-colors">เข้าสู่ระบบ</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-gray-800">ทรัพยากร</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/guide" className="text-gray-600 hover:text-[#5fca9f] transition-colors">คู่มือการใช้งาน</Link></li>
                <li><Link href="/tips" className="text-gray-600 hover:text-[#5fca9f] transition-colors">เคล็ดลับหาน้อง</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-[#5fca9f] transition-colors">คำถามที่พบบ่อย</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-[#5fca9f] transition-colors">นโยบายความเป็นส่วนตัว</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-gray-800">ติดต่อเรา</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <a href="mailto:pethubth@gmail.com" className="hover:text-[#5fca9f] transition-colors">
                    pethubth@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/pethubthailand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#1877F2] hover:text-[#166fe5] transition-colors font-medium"
                  >
                    <FaFacebook className="w-4 h-4 shrink-0" />
                    PetHub Thailand
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} PetHub Thai — ช่วยน้องกลับบ้าน 🐾
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
