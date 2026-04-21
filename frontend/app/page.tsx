import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {
  const stats = [
    { number: '1,284', label: 'ประกาศทั้งหมด', icon: '📋' },
    { number: '312', label: 'พบตัวแล้ว', icon: '✅' },
    { number: '89', label: 'หาบ้านใหม่แล้ว', icon: '🏡' },
  ];

  const featuredPosts = [
    {
      id: 1,
      name: 'โกเล่ม เพศผู้',
      location: 'บางนา, กรุงเทพฯ',
      time: '3 วันที่แล้ว',
      status: 'หาย',
      emoji: '🐶',
      bgColor: 'bg-gradient-to-br from-[#fef0f5] to-[#ffe8f0]',
      statusColor: 'bg-[#ff9ec7]/20 text-[#e685b3] border-[#ff9ec7]/30',
    },
    {
      id: 2,
      name: 'แมวส้ม เพศเมีย',
      location: 'ลาดกระบัง, กรุงเทพฯ',
      time: '1 วัน',
      status: 'รับเลี้ยง',
      emoji: '🐱',
      bgColor: 'bg-gradient-to-br from-[#e8f4f8] to-[#d4ebf5]',
      statusColor: 'bg-[#6bb8e3]/20 text-[#5aa3ce] border-[#6bb8e3]/30',
    },
    {
      id: 3,
      name: 'ข้าวา สีขาว',
      location: 'รังสิต, ปทุมธานี',
      time: '5 วันที่แล้ว',
      status: 'พบแล้ว',
      emoji: '🐶',
      bgColor: 'bg-gradient-to-br from-[#e8f8f0] to-[#d4f0e5]',
      statusColor: 'bg-[#5fca9f]/20 text-[#4db889] border-[#5fca9f]/30',
    },
  ];

  const donors = [
    { name: 'พรรดิ จ.', amount: '฿200', message: 'ขอให้น้องหมดตัวได้บ้าน', initial: 'พ', color: 'bg-gradient-to-br from-[#5fca9f] to-[#4db889]' },
    { name: 'สมชาย จ.', amount: '฿100', message: 'สู้ๆ นะพี่น้อง', initial: 'ส', color: 'bg-gradient-to-br from-[#6bb8e3] to-[#5aa3ce]' },
    { name: 'กมลวรรณ ร.', amount: '฿500', message: 'ทำดีมากเลย', initial: 'ก', color: 'bg-gradient-to-br from-[#ff9ec7] to-[#e685b3]' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-block">
                <span className="badge badge-primary text-sm">
                  🎉 ฟรี! ไม่มีค่าใช้จ่าย
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  ช่วยกันตามหา
                  <br />
                  <span className="bg-gradient-to-r from-[#5fca9f] via-[#6bb8e3] to-[#ff9ec7] bg-clip-text text-transparent">
                    น้องหมาน้องแมว
                  </span>
                  <br />
                  <span className="text-gray-800">ที่หายไป</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  แพลตฟอร์มรวมประกาศหาย ประกาศรับเลี้ยง และหาบ้านให้น้องทั่วประเทศไทย
                  ช่วยเหลือกันเพื่อให้ทุกชีวิตได้กลับบ้าน 🏠
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
                {stats.map((stat, index) => (
                  <div key={index} className="card-compact text-center">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#5fca9f] to-[#6bb8e3] bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/post/create" className="btn-primary text-lg">
                  <span>ประกาศตามหา</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
                <Link href="/posts" className="btn-outline text-lg">
                  <span>ดูประกาศทั้งหมด</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Content - Featured Posts */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg">
              <div className="space-y-5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">ประกาศล่าสุด</h3>
                  <Link href="/posts" className="text-[#5fca9f] hover:text-[#4db889] text-sm font-medium flex items-center gap-1">
                    ดูทั้งหมด
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="group block"
                  >
                    <div className="flex items-center justify-between p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:-translate-y-1">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 ${post.bgColor} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                          {post.emoji}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800 mb-1">
                            {post.name}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {post.location}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{post.time}</p>
                        </div>
                      </div>
                      <span className={`badge ${post.statusColor} whitespace-nowrap`}>
                        {post.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">ทำไมต้อง PetHub TH?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              เราเข้าใจว่าการสูญเสียสัตว์เลี้ยงเป็นเรื่องที่หนักใจ ด้วยเครื่องมือที่ครบครัน เราช่วยให้คุณหาน้องได้เร็วขึ้น
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#5fca9f] to-[#4db889] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                📍
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">ปักหมุดแผนที่</h3>
              <p className="text-gray-600 leading-relaxed">
                ระบุตำแหน่งที่น้องหายได้แม่นยำ พร้อมแสดงบนแผนที่แบบเรียลไทม์
              </p>
            </div>

            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6bb8e3] to-[#5aa3ce] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                📸
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">อัพโหลดรูปภาพ</h3>
              <p className="text-gray-600 leading-relaxed">
                เพิ่มรูปน้องได้ 1-3 รูป เพื่อให้คนที่เจอสามารถระบุตัวได้ง่ายขึ้น
              </p>
            </div>

            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff9ec7] to-[#e685b3] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                🔔
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">แจ้งเตือนอัตโนมัติ</h3>
              <p className="text-gray-600 leading-relaxed">
                รับการแจ้งเตือนทันทีเมื่อมีคนพบเจอหรือมีข้อมูลเพิ่มเติม
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 lg:p-12 text-white shadow-2xl border border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <span className="text-4xl">💝</span>
                    Wall of Kindness
                  </h2>
                  <p className="text-gray-300">ขอบคุณทุกการสนับสนุนที่ทำให้เราดำเนินงานต่อไปได้</p>
                </div>
                <div className="text-center md:text-right">
                  <span className="text-sm text-gray-400">ยอดรวม</span>
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#5fca9f] to-[#6bb8e3] bg-clip-text text-transparent">
                    ฿12,450
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {donors.map((donor, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/10 transition-colors">
                    <div className={`w-14 h-14 ${donor.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {donor.initial}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-lg">{donor.name}</span>
                        <span className="text-[#5fca9f] font-bold text-lg">{donor.amount}</span>
                      </div>
                      <p className="text-sm text-gray-300">{donor.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-[#5fca9f] to-[#6bb8e3] hover:from-[#4db889] hover:to-[#5aa3ce] text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2">
                <span>บริจาคผ่าน TipMe</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#e8f8f0] to-[#e8f4f8]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-6xl">🐾</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">
              พร้อมช่วยน้องกลับบ้านหรือยัง?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              เริ่มต้นประกาศตามหาน้องของคุณวันนี้ หรือช่วยเหลือน้องที่กำลังมองหาบ้านใหม่
              <br />
              ทุกการช่วยเหลือมีความหมาย 💚
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/post/create" className="btn-primary text-lg">
                <span>ประกาศตามหาเลย</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/guide" className="btn-outline text-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>อ่านคู่มือการใช้งาน</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
