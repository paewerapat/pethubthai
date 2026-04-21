import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="bg-white/90 backdrop-blur-xl border-t border-white/50 py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🐾</span>
                PetHub TH
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                ช่วยเหลือสัตว์เลี้ยงหายกลับบ้าน และหาบ้านใหม่ให้น้องทั่วประเทศไทย
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-gray-800">ลิงก์ด่วน</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-gray-600 hover:text-[#5fca9f] transition-colors">ตามหาน้อง</a></li>
                <li><a href="/posts" className="text-gray-600 hover:text-[#5fca9f] transition-colors">หาบ้าน</a></li>
                <li><a href="/about" className="text-gray-600 hover:text-[#5fca9f] transition-colors">เกี่ยวกับเรา</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-[#5fca9f] transition-colors">ติดต่อเรา</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-gray-800">ทรัพยากร</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/guide" className="text-gray-600 hover:text-[#5fca9f] transition-colors">คู่มือการใช้งาน</a></li>
                <li><a href="/tips" className="text-gray-600 hover:text-[#5fca9f] transition-colors">เคล็ดลับหาน้อง</a></li>
                <li><a href="/faq" className="text-gray-600 hover:text-[#5fca9f] transition-colors">คำถามที่พบบ่อย</a></li>
                <li><a href="/privacy" className="text-gray-600 hover:text-[#5fca9f] transition-colors">นโยบายความเป็นส่วนตัว</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-gray-800">ติดต่อเรา</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <span>info@pethub.th</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📱</span>
                  <span>02-XXX-XXXX</span>
                </li>
                <li className="flex gap-3 pt-2">
                  <a href="#" className="w-8 h-8 bg-[#5fca9f]/10 hover:bg-[#5fca9f]/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-lg">📘</span>
                  </a>
                  <a href="#" className="w-8 h-8 bg-[#6bb8e3]/10 hover:bg-[#6bb8e3]/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-lg">🐦</span>
                  </a>
                  <a href="#" className="w-8 h-8 bg-[#ff9ec7]/10 hover:bg-[#ff9ec7]/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-lg">📷</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              &copy; 2026 PetHub Thailand. Made with ❤️ for Thai pets 🐶🐱
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
