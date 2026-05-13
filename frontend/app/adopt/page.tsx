'use client';

import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { fetchPosts, type Post } from '@/lib/api';

const PET_FILTERS = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'dog', label: '🐶 สุนัข' },
  { value: 'cat', label: '🐱 แมว' },
  { value: 'other', label: '🐾 อื่นๆ' },
];
const LIMIT = 12;

export default function AdoptPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [petType, setPetType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPosts({
        page,
        limit: LIMIT,
        petType: petType || undefined,
        category: 'adoption',
        status: 'available',
      });
      setPosts(res.data);
      setTotal(res.total);
    } catch {
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }, [page, petType]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">หาบ้านให้น้อง 🏡</h1>
            <p className="text-gray-500">
              {loading ? 'กำลังโหลด...' : `น้องที่รอบ้านใหม่ ${total.toLocaleString()} ตัว`}
            </p>
          </div>
          <Link href="/adopt/create" className="btn-primary shrink-0">
            <span>ลงประกาศหาบ้านให้น้อง</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>

        {/* Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-8 shadow-sm border border-white/50">
          <div className="flex flex-wrap gap-2">
            {PET_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setPetType(f.value); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  petType === f.value
                    ? 'bg-[#5fca9f] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={load} className="btn-primary">ลองใหม่</button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-2 bg-white">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏡</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">ยังไม่มีประกาศ</h3>
            <p className="text-gray-400 mb-6">เป็นคนแรกที่ลงประกาศหาบ้านให้น้อง</p>
            <Link href="/adopt/create" className="btn-primary">ลงประกาศเลย</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#5fca9f] hover:text-[#5fca9f] disabled:opacity-40 disabled:cursor-not-allowed transition-all">‹</button>
            {(() => {
              const w = Math.min(5, totalPages);
              const start = Math.max(1, Math.min(page - Math.floor(w / 2), totalPages - w + 1));
              return Array.from({ length: w }, (_, i) => start + i).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${page === p ? 'bg-[#5fca9f] text-white shadow-md' : 'border border-gray-200 text-gray-600 hover:border-[#5fca9f] hover:text-[#5fca9f]'}`}>
                  {p}
                </button>
              ));
            })()}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#5fca9f] hover:text-[#5fca9f] disabled:opacity-40 disabled:cursor-not-allowed transition-all">›</button>
          </div>
        )}
      </div>
    </Layout>
  );
}
