'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import { fetchPost, getToken, deletePost, type Post } from '@/lib/api';
import { PET_META, STATUS_META, GENDER_LABEL, relativeTime } from '@/lib/utils';
import { FiPhone, FiMapPin, FiCalendar, FiUser, FiArrowLeft, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { FaLine, FaFacebook, FaInstagram } from 'react-icons/fa';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-72 bg-gray-100 rounded-2xl animate-pulse" />,
});

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPost(id)
      .then(setPost)
      .catch(() => router.replace('/posts'))
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleDelete() {
    if (!confirm('ต้องการลบประกาศนี้ใช่ไหม?')) return;
    setDeleting(true);
    try {
      await deletePost(id);
      router.replace('/my-posts');
    } catch {
      alert('ลบไม่สำเร็จ กรุณาลองใหม่');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-80 bg-gray-200 rounded-2xl" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) return null;

  const pet = PET_META[post.petType] ?? PET_META.other;
  const status = STATUS_META[post.status] ?? STATUS_META.lost;
  const sortedImages = [...(post.images ?? [])].sort((a, b) => a.order - b.order);
  const isOwner = !!getToken(); // simplified — real check needs user id comparison

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#5fca9f] transition-colors">หน้าแรก</Link>
          <span>/</span>
          <Link href="/posts" className="hover:text-[#5fca9f] transition-colors">ประกาศ</Link>
          <span>/</span>
          <span className="text-gray-800 truncate max-w-[160px]">{post.petName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Left: Images + Info ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image Gallery */}
            <div className="card !p-0 overflow-hidden">
              <div className={`relative aspect-[4/3] bg-gradient-to-br ${pet.bg}`}>
                {sortedImages.length > 0 ? (
                  <img
                    src={sortedImages[activeImg]?.imageUrl}
                    alt={post.petName}
                    className="w-full h-full object-cover"
                  />
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
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImg ? 'border-[#5fca9f] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
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
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="ลบประกาศ"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
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
          </div>

          {/* ── Right: Contact ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Poster */}
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full border-2 border-[#06C755]/30 bg-[#06C755]/5 text-[#06C755] font-medium py-3 px-5 rounded-2xl hover:bg-[#06C755]/10 active:scale-95 transition-all"
                  >
                    <FaLine className="w-5 h-5 shrink-0" />
                    <span>{post.lineId}</span>
                  </a>
                )}

                {post.facebook && (
                  <a
                    href={`https://facebook.com/${post.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full border-2 border-[#1877F2]/30 bg-[#1877F2]/5 text-[#1877F2] font-medium py-3 px-5 rounded-2xl hover:bg-[#1877F2]/10 active:scale-95 transition-all"
                  >
                    <FaFacebook className="w-5 h-5 shrink-0" />
                    <span>{post.facebook}</span>
                  </a>
                )}

                {post.instagram && (
                  <a
                    href={`https://instagram.com/${post.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full border-2 border-[#E1306C]/30 bg-[#E1306C]/5 text-[#E1306C] font-medium py-3 px-5 rounded-2xl hover:bg-[#E1306C]/10 active:scale-95 transition-all"
                  >
                    <FaInstagram className="w-5 h-5 shrink-0" />
                    <span>{post.instagram}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Quick actions */}
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
