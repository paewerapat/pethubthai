'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/api';

const MapAllPosts = dynamic(() => import('./MapAllPosts'), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export default function MapHomepageSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/posts?limit=300`).then((r) => r.json()),
      fetch(`${API}/posts?limit=300&category=adoption`).then((r) => r.json()),
    ])
      .then(([lostData, adoptData]) => {
        const merged = [
          ...(lostData.data ?? []),
          ...(adoptData.data ?? []),
        ];
        setPosts(merged);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const validCount = posts.filter((p) => p.latitude && p.longitude).length;

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              📍 แผนที่ประกาศทั่วประเทศ
            </h2>
            <p className="text-gray-500">
              ค้นหาน้องที่หายหรือน้องที่รอบ้านใกล้บ้านคุณ
            </p>
          </div>
          <Link
            href="/posts"
            className="btn-outline text-sm shrink-0"
          >
            ดูประกาศทั้งหมด →
          </Link>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
          {loading ? (
            <div className="h-[460px] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="text-4xl animate-bounce">🗺️</div>
                <p className="text-gray-400 text-sm">กำลังโหลดแผนที่...</p>
              </div>
            </div>
          ) : (
            <MapAllPosts posts={posts} />
          )}
        </div>

        {/* Footer note */}
        {!loading && validCount > 0 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            แสดง {validCount.toLocaleString()} ตำแหน่งบนแผนที่ · คลิกหมุดเพื่อดูรายละเอียด
          </p>
        )}
      </div>
    </section>
  );
}
