'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { fetchPosts, type Post } from '@/lib/api';

const GEO_URL =
  'https://raw.githubusercontent.com/thailand-geography-data/thailand-geography-json/main/src/geography.json';

interface GeoEntry {
  provinceNameTh: string;
  districtNameTh: string;
  subdistrictNameTh: string;
  postalCode: number;
}

const PET_FILTERS = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'dog', label: '🐶 สุนัข' },
  { value: 'cat', label: '🐱 แมว' },
  { value: 'other', label: '🐾 อื่นๆ' },
];

const STATUS_FILTERS = [
  { value: '', label: 'ทุกสถานะ' },
  { value: 'lost', label: 'หาย' },
  { value: 'found', label: 'พบแล้ว' },
  { value: 'adopted', label: 'รับเลี้ยง' },
];

const LIMIT = 12;

let _geoCache: GeoEntry[] | null = null;

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [petType, setPetType] = useState('');
  const [status, setStatus] = useState('');
  const [province, setProvince] = useState('');
  const [amphoe, setAmphoe] = useState('');
  const [tambon, setTambon] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Geography data
  const [geoData, setGeoData] = useState<GeoEntry[]>([]);
  const [geoLoading, setGeoLoading] = useState(true);

  useEffect(() => {
    if (_geoCache) { setGeoData(_geoCache); setGeoLoading(false); return; }
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((d) => { _geoCache = d; setGeoData(d); })
      .catch(() => {})
      .finally(() => setGeoLoading(false));
  }, []);

  const provinces = Array.from(new Set(geoData.map((e) => e.provinceNameTh))).sort();

  const amphoes = province
    ? Array.from(new Set(geoData.filter((e) => e.provinceNameTh === province).map((e) => e.districtNameTh))).sort()
    : [];

  const tambons = amphoe
    ? Array.from(new Set(geoData.filter((e) => e.districtNameTh === amphoe && e.provinceNameTh === province).map((e) => e.subdistrictNameTh))).sort()
    : [];

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPosts({
        page,
        limit: LIMIT,
        petType: petType || undefined,
        status: status || undefined,
        province: province || undefined,
        amphoe: amphoe || undefined,
        tambon: tambon || undefined,
      });
      setPosts(res.data);
      setTotal(res.total);
    } catch {
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  }, [page, petType, status, province, amphoe, tambon]);

  useEffect(() => { load(); }, [load]);

  function changePetType(val: string) { setPage(1); setPetType(val); }
  function changeStatus(val: string) { setPage(1); setStatus(val); }

  function changeProvince(val: string) {
    setPage(1);
    setProvince(val);
    setAmphoe('');
    setTambon('');
  }
  function changeAmphoe(val: string) {
    setPage(1);
    setAmphoe(val);
    setTambon('');
  }
  function changeTambon(val: string) { setPage(1); setTambon(val); }

  function clearLocation() {
    setPage(1);
    setProvince('');
    setAmphoe('');
    setTambon('');
  }

  const totalPages = Math.ceil(total / LIMIT);
  const hasLocationFilter = province || amphoe || tambon;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">ตามหาน้อง</h1>
          <p className="text-gray-500">
            {loading ? 'กำลังโหลด...' : `พบ ${total.toLocaleString()} ประกาศ`}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-8 shadow-sm border border-white/50 space-y-4">
          {/* Pet type */}
          <div className="flex flex-wrap gap-2">
            {PET_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => changePetType(f.value)}
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

          {/* Status */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => changeStatus(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  status === f.value
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Location filter */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-600 shrink-0">📍 พื้นที่:</span>

              {/* Province */}
              <select
                value={province}
                onChange={(e) => changeProvince(e.target.value)}
                disabled={geoLoading}
                className="flex-1 min-w-[150px] px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#5fca9f] focus:ring-2 focus:ring-[#5fca9f]/20 disabled:opacity-50"
              >
                <option value="">{geoLoading ? 'กำลังโหลด...' : 'ทุกจังหวัด'}</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              {/* Amphoe */}
              <select
                value={amphoe}
                onChange={(e) => changeAmphoe(e.target.value)}
                disabled={!province}
                className="flex-1 min-w-[150px] px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#5fca9f] focus:ring-2 focus:ring-[#5fca9f]/20 disabled:opacity-50 disabled:bg-gray-50"
              >
                <option value="">ทุกอำเภอ/เขต</option>
                {amphoes.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              {/* Tambon */}
              <select
                value={tambon}
                onChange={(e) => changeTambon(e.target.value)}
                disabled={!amphoe}
                className="flex-1 min-w-[150px] px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#5fca9f] focus:ring-2 focus:ring-[#5fca9f]/20 disabled:opacity-50 disabled:bg-gray-50"
              >
                <option value="">ทุกตำบล/แขวง</option>
                {tambons.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {hasLocationFilter && (
                <button
                  onClick={clearLocation}
                  className="px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                >
                  ✕ ล้าง
                </button>
              )}
            </div>
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
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">ไม่พบประกาศ</h3>
            <p className="text-gray-400">ลองเปลี่ยนตัวกรองหรือค้นหาใหม่อีกครั้ง</p>
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
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#5fca9f] hover:text-[#5fca9f] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                    page === p
                      ? 'bg-[#5fca9f] text-white shadow-md'
                      : 'border border-gray-200 text-gray-600 hover:border-[#5fca9f] hover:text-[#5fca9f]'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#5fca9f] hover:text-[#5fca9f] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
