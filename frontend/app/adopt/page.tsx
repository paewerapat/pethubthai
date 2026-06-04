'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { fetchPosts, type Post } from '@/lib/api';
import { FiGrid, FiMap } from 'react-icons/fi';

const MapAllPosts = dynamic(() => import('@/components/MapAllPosts'), { ssr: false });

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

const LIMIT = 12;

let _geoCache: GeoEntry[] | null = null;

export default function AdoptPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [petType, setPetType] = useState('');
  const [province, setProvince] = useState('');
  const [amphoe, setAmphoe] = useState('');
  const [tambon, setTambon] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [mapPosts, setMapPosts] = useState<Post[]>([]);
  const [mapLoading, setMapLoading] = useState(false);

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
        category: 'adoption',
        status: 'available',
        province: province || undefined,
        amphoe: amphoe || undefined,
        tambon: tambon || undefined,
      });
      setPosts(res.data);
      setTotal(res.total);
    } catch {
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }, [page, petType, province, amphoe, tambon]);

  useEffect(() => { load(); }, [load]);

  const loadMapPosts = useCallback(async () => {
    if (viewMode !== 'map') return;
    setMapLoading(true);
    try {
      const res = await fetchPosts({
        limit: 500,
        petType: petType || undefined,
        category: 'adoption',
        status: 'available',
        province: province || undefined,
        amphoe: amphoe || undefined,
        tambon: tambon || undefined,
      });
      setMapPosts(res.data);
    } catch {
      // silently fail
    } finally {
      setMapLoading(false);
    }
  }, [viewMode, petType, province, amphoe, tambon]);

  useEffect(() => { loadMapPosts(); }, [loadMapPosts]);

  function changeProvince(val: string) { setPage(1); setProvince(val); setAmphoe(''); setTambon(''); }
  function changeAmphoe(val: string) { setPage(1); setAmphoe(val); setTambon(''); }
  function changeTambon(val: string) { setPage(1); setTambon(val); }
  function clearLocation() { setPage(1); setProvince(''); setAmphoe(''); setTambon(''); }

  const totalPages = Math.ceil(total / LIMIT);
  const hasLocationFilter = province || amphoe || tambon;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">หาบ้านให้น้อง 🏡</h1>
            <p className="text-gray-500">
              {loading ? 'กำลังโหลด...' : `น้องที่รอบ้านใหม่ ${total.toLocaleString()} ตัว`}
            </p>
          </div>
          <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#5fca9f] text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiGrid className="w-4 h-4" />
              รายการ
            </button>
            <div className="w-px h-8 bg-gray-200" />
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-[#6bb8e3] text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiMap className="w-4 h-4" />
              แผนที่
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-8 shadow-sm border border-white/50 space-y-4">
          {/* Pet type */}
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

          {/* Location filter */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-600 shrink-0">📍 พื้นที่:</span>

              <select
                value={province}
                onChange={(e) => changeProvince(e.target.value)}
                disabled={geoLoading}
                className="flex-1 min-w-[150px] px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#5fca9f] focus:ring-2 focus:ring-[#5fca9f]/20 disabled:opacity-50"
              >
                <option value="">{geoLoading ? 'กำลังโหลด...' : 'ทุกจังหวัด'}</option>
                {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>

              <select
                value={amphoe}
                onChange={(e) => changeAmphoe(e.target.value)}
                disabled={!province}
                className="flex-1 min-w-[150px] px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#5fca9f] focus:ring-2 focus:ring-[#5fca9f]/20 disabled:opacity-50 disabled:bg-gray-50"
              >
                <option value="">ทุกอำเภอ/เขต</option>
                {amphoes.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>

              <select
                value={tambon}
                onChange={(e) => changeTambon(e.target.value)}
                disabled={!amphoe}
                className="flex-1 min-w-[150px] px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#5fca9f] focus:ring-2 focus:ring-[#5fca9f]/20 disabled:opacity-50 disabled:bg-gray-50"
              >
                <option value="">ทุกตำบล/แขวง</option>
                {tambons.map((t) => <option key={t} value={t}>{t}</option>)}
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
        {viewMode === 'map' ? (
          mapLoading ? (
            <div className="h-[480px] rounded-2xl bg-gray-100 animate-pulse" />
          ) : (
            <MapAllPosts posts={mapPosts} />
          )
        ) : error ? (
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
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {hasLocationFilter || petType ? 'ไม่พบประกาศที่ตรงกัน' : 'ยังไม่มีประกาศ'}
            </h3>
            <p className="text-gray-400">
              {hasLocationFilter || petType ? 'ลองเปลี่ยนตัวกรองหรือค้นหาใหม่อีกครั้ง' : 'ใช้ปุ่ม "เพิ่มโพสต์" ด้านบนเพื่อลงประกาศ'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {viewMode === 'grid' && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#5fca9f] hover:text-[#5fca9f] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >‹</button>

            {(() => {
              const w = Math.min(5, totalPages);
              const start = Math.max(1, Math.min(page - Math.floor(w / 2), totalPages - w + 1));
              return Array.from({ length: w }, (_, i) => start + i).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                    page === p
                      ? 'bg-[#5fca9f] text-white shadow-md'
                      : 'border border-gray-200 text-gray-600 hover:border-[#5fca9f] hover:text-[#5fca9f]'
                  }`}
                >{p}</button>
              ));
            })()}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#5fca9f] hover:text-[#5fca9f] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >›</button>
          </div>
        )}
      </div>
    </Layout>
  );
}
