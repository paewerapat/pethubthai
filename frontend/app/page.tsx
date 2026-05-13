export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import type { Post, PostsResponse } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function getLatestPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API}/posts?limit=6&status=lost`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data: PostsResponse = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

async function getStats(): Promise<{ total: number; found: number }> {
  try {
    const [allRes, foundRes] = await Promise.all([
      fetch(`${API}/posts?limit=1`, { cache: 'no-store' }),
      fetch(`${API}/posts?limit=1&status=found`, { cache: 'no-store' }),
    ]);
    const allData: PostsResponse  = await allRes.json();
    const foundData: PostsResponse = await foundRes.json();
    return { total: allData.total ?? 0, found: foundData.total ?? 0 };
  } catch {
    return { total: 0, found: 0 };
  }
}

export default async function Home() {
  const [posts, stats] = await Promise.all([getLatestPosts(), getStats()]);

  const statCards = [
    { number: stats.total.toLocaleString(), label: 'ประกาศทั้งหมด', icon: '📋' },
    { number: stats.found.toLocaleString(), label: 'พบตัวแล้ว', icon: '✅' },
    { number: 'ฟรี', label: 'ไม่มีค่าใช้จ่าย', icon: '🎉' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
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
                {statCards.map((stat, i) => (
                  <div key={i} className="card-compact text-center">
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

            {/* Right Content — Latest Posts */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">ประกาศล่าสุด</h3>
                <Link href="/posts" className="text-[#5fca9f] hover:text-[#4db889] text-sm font-medium flex items-center gap-1">
                  ดูทั้งหมด
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-3">🐾</div>
                  <p>ยังไม่มีประกาศ</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {posts.slice(0, 6).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">ทำไมต้อง PetHub Thai?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              เราเข้าใจว่าการสูญเสียสัตว์เลี้ยงเป็นเรื่องที่หนักใจ ด้วยเครื่องมือที่ครบครัน เราช่วยให้คุณหาน้องได้เร็วขึ้น
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📍', title: 'ปักหมุดแผนที่', desc: 'ระบุตำแหน่งที่น้องหายได้แม่นยำ พร้อมแสดงบนแผนที่แบบเรียลไทม์', from: '[#5fca9f]', to: '[#4db889]' },
              { icon: '📸', title: 'อัพโหลดรูปภาพ', desc: 'เพิ่มรูปน้องได้ 1–3 รูป เพื่อให้คนที่เจอสามารถระบุตัวได้ง่ายขึ้น', from: '[#6bb8e3]', to: '[#5aa3ce]' },
              { icon: '🔗', title: 'แชร์ได้ทันที', desc: 'แชร์ประกาศไปยัง Facebook, X, Line ได้ในคลิกเดียวเพื่อกระจายข่าว', from: '[#ff9ec7]', to: '[#e685b3]' },
            ].map((f, i) => (
              <div key={i} className="card text-center group hover:scale-105 transition-transform duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br from-${f.from} to-${f.to} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <img src="/images/logo-width-transparent.png" alt="PetHub Thai" className="h-48 w-auto mx-auto" />
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">
              พร้อมช่วยน้องกลับบ้านหรือยัง?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              เริ่มต้นประกาศตามหาน้องของคุณวันนี้<br />
              ทุกการช่วยเหลือมีความหมาย 💚
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/post/create" className="btn-primary text-lg">
                <span>ประกาศตามหาเลย</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/posts" className="btn-outline text-lg">
                <span>ดูประกาศทั้งหมด</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
