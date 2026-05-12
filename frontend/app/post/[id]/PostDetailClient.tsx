'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { getToken, getMe, deletePost, trackPostView, type Post, type AuthUser } from '@/lib/api';
import { PET_META, STATUS_META, GENDER_LABEL, relativeTime } from '@/lib/utils';
import {
  FiPhone, FiMapPin, FiCalendar, FiUser, FiArrowLeft,
  FiTrash2, FiEdit2, FiShare2, FiCopy, FiCheck, FiEye,
} from 'react-icons/fi';
import { FaLine, FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-72 bg-gray-100 rounded-2xl animate-pulse" />,
});

const BASE_URL = 'https://pethubthai.com';

export default function PostDetailClient({ post }: { post: Post }) {
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (getToken()) {
      getMe().then(setUser).catch(() => {});
    }
    // นับ view ครั้งเดียวต่อ session ต่อ post
    const key = `viewed_${post.id}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      trackPostView(post.id);
    }
  }, [post.id]);

  const isOwner = !!user && user.id === post.userId;
  const postUrl = `${BASE_URL}/post/${post.id}`;
  const petLabel = post.petType === 'dog' ? 'สุนัข' : post.petType === 'cat' ? 'แมว' : 'สัตว์เลี้ยง';
  const shareText = `ตามหา${petLabel} "${post.petName}" หายบริเวณ ${post.lostLocation} ช่วยแชร์ด้วยนะครับ`;

  async function handleDelete() {
    if (!confirm('ต้องการลบประกาศนี้ใช่ไหม?')) return;
    setDeleting(true);
    try {
      await deletePost(post.id);
      router.replace('/my-posts');
    } catch {
      alert('ลบไม่สำเร็จ กรุณาลองใหม่');
      setDeleting(false);
    }
  }

  function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank', 'width=600,height=400');
  }

  function shareToTwitter() {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareText)}`, '_blank', 'width=600,height=400');
  }

  function shareToLine() {
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(postUrl)}`, '_blank', 'width=600,height=400');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(postUrl);
    }
  }

  const pet = PET_META[post.petType] ?? PET_META.other;
  const status = STATUS_META[post.status] ?? STATUS_META.lost;
  const sortedImages = [...(post.images ?? [])].sort((a, b) => a.order - b.order);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#5fca9f] transition-colors">หน้าแรก</Link>
            <span>/</span>
            <Link href="/posts" className="hover:text-[#5fca9f] transition-colors">ตามหาน้อง</Link>
            <span>/</span>
            <span className="text-gray-800 truncate max-w-[160px]">{post.petName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <FiEye className="w-4 h-4" />
            <span>{(post.viewCount ?? 0).toLocaleString()} ครั้ง</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Left ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image Gallery */}
            <div className="card !p-0 overflow-hidden">
              <div className={`relative aspect-[4/3] bg-gradient-to-br ${pet.bg}`}>
                {sortedImages.length > 0 ? (
                  <img src={sortedImages[activeImg]?.imageUrl} alt={post.petName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl opacity-40">{pet.icon}</span>
                  </div>
                )}
                <span className={`absolute top-4 right-4 badge text-sm font-semibold ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {sortedImages.length > 1 && (
                <div className="flex gap-2 p-3">
                  {sortedImages.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(i)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImg ? 'border-[#5fca9f] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-[#5fca9f]/80 text-white text-[9px] text-center py-0.5">ปก</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pet Details */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{pet.icon}</span>
                    <span className="text-sm text-gray-500">{pet.label}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800">{post.petName}</h1>
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <Link
                      href={`/post/${post.id}/edit`}
                      className="p-2 text-gray-400 hover:text-[#5fca9f] hover:bg-[#5fca9f]/10 rounded-xl transition-all"
                      title="แก้ไขประกาศ"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="ลบประกาศ"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {post.breed && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-gray-400 text-xs mb-0.5">สายพันธุ์</p>
                    <p className="font-medium text-gray-700">{post.breed}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-gray-400 text-xs mb-0.5">เพศ</p>
                  <p className="font-medium text-gray-700">{GENDER_LABEL[post.gender] ?? '—'}</p>
                </div>
                {post.ageEstimate && (
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-gray-400 text-xs mb-0.5">อายุ</p>
                    <p className="font-medium text-gray-700">{post.ageEstimate}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-gray-400 text-xs mb-0.5">โพสต์เมื่อ</p>
                  <p className="font-medium text-gray-700">{relativeTime(post.createdAt)}</p>
                </div>
              </div>

              {post.description && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">รายละเอียด</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.description}</p>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiMapPin className="text-[#5fca9f]" />
                สถานที่หาย
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                <FiCalendar className="text-[#6bb8e3] shrink-0" />
                <span>
                  {new Date(post.lostDate).toLocaleString('th-TH', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              {post.lostLocation && (
                <p className="text-gray-600 text-sm mb-4">{post.lostLocation}</p>
              )}
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <MapView lat={Number(post.latitude)} lng={Number(post.longitude)} />
              </div>
            </div>

            {/* Share */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiShare2 className="text-[#6bb8e3]" />
                แชร์ประกาศนี้
              </h3>
              <p className="text-sm text-gray-500 mb-4">ช่วยแชร์ออกไปเพื่อเพิ่มโอกาสให้น้องได้กลับบ้าน 🐾</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={shareToFacebook}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] text-white text-sm font-medium hover:bg-[#166fe5] active:scale-95 transition-all"
                >
                  <FaFacebook className="w-4 h-4" />
                  Facebook
                </button>
                <button
                  onClick={shareToTwitter}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all"
                >
                  <FaXTwitter className="w-4 h-4" />
                  X (Twitter)
                </button>
                <button
                  onClick={shareToLine}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#06C755] text-white text-sm font-medium hover:bg-[#05b34d] active:scale-95 transition-all"
                >
                  <FaLine className="w-4 h-4" />
                  Line
                </button>
                <button
                  onClick={copyLink}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-all border ${
                    copied ? 'bg-green-50 border-green-300 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                  {copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Contact ── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiUser className="text-[#6bb8e3]" />
                ผู้โพสต์
              </h3>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5fca9f] to-[#4db889] rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0">
                  {post.posterName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{post.posterName}</p>
                  <p className="text-sm text-gray-400">ผู้โพสต์ประกาศ</p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${post.phoneNumber}`}
                  className="flex items-center gap-3 w-full bg-gradient-to-r from-[#5fca9f] to-[#4db889] text-white font-semibold py-3.5 px-5 rounded-2xl hover:from-[#4db889] hover:to-[#3da87a] active:scale-95 transition-all shadow-md"
                >
                  <FiPhone className="w-5 h-5 shrink-0" />
                  <span>{post.phoneNumber}</span>
                </a>

                {post.lineId && (
                  <a
                    href={`https://line.me/R/ti/p/~${post.lineId}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full border-2 border-[#06C755]/30 bg-[#06C755]/5 text-[#06C755] font-medium py-3 px-5 rounded-2xl hover:bg-[#06C755]/10 active:scale-95 transition-all"
                  >
                    <FaLine className="w-5 h-5 shrink-0" />
                    <span>{post.lineId}</span>
                  </a>
                )}

                {post.facebook && (
                  <a
                    href={`https://facebook.com/${post.facebook}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full border-2 border-[#1877F2]/30 bg-[#1877F2]/5 text-[#1877F2] font-medium py-3 px-5 rounded-2xl hover:bg-[#1877F2]/10 active:scale-95 transition-all"
                  >
                    <FaFacebook className="w-5 h-5 shrink-0" />
                    <span>{post.facebook}</span>
                  </a>
                )}

                {post.instagram && (
                  <a
                    href={`https://instagram.com/${post.instagram}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full border-2 border-[#E1306C]/30 bg-[#E1306C]/5 text-[#E1306C] font-medium py-3 px-5 rounded-2xl hover:bg-[#E1306C]/10 active:scale-95 transition-all"
                  >
                    <FaInstagram className="w-5 h-5 shrink-0" />
                    <span>{post.instagram}</span>
                  </a>
                )}
              </div>
            </div>

            {post.hasReward && (
              <div className="card bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 !shadow-none">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">💰</span>
                  <div>
                    <p className="font-semibold text-amber-700 text-sm">มีค่าตอบแทน / สินน้ำใจ</p>
                    <p className="text-amber-600 text-sm mt-0.5">
                      {post.rewardAmount ? post.rewardAmount : 'ติดต่อสอบถามรายละเอียดได้เลย'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="card bg-gradient-to-br from-[#e8f8f0] to-[#e8f4f8] !shadow-none">
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                ถ้าคุณพบเห็น{post.petName} กรุณาติดต่อเจ้าของโดยตรง<br />
                ทุกการช่วยเหลือมีความหมาย 💚
              </p>
            </div>

            <Link
              href="/posts"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#5fca9f] transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              กลับไปดูประกาศทั้งหมด
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
