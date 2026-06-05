'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { adminGetPosts, adminDeletePost } from '@/lib/api';
import { FiTrash2, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'sonner';

const CATEGORY_FILTERS = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'lost', label: '🔍 ตามหาน้อง' },
  { value: 'adoption', label: '🏡 หาบ้าน' },
];
const STATUS_FILTERS = [
  { value: '', label: 'ทุกสถานะ' },
  { value: 'lost', label: 'หาย' },
  { value: 'found', label: 'เจอแล้ว' },
  { value: 'available', label: 'หาบ้าน' },
  { value: 'adopted', label: 'รับเลี้ยงแล้ว' },
];
const STATUS_COLOR: Record<string, string> = {
  lost: 'bg-pink-500/20 text-pink-400',
  found: 'bg-blue-500/20 text-blue-400',
  available: 'bg-amber-500/20 text-amber-400',
  adopted: 'bg-green-500/20 text-green-400',
};
const STATUS_LABEL: Record<string, string> = {
  lost: 'หาย', found: 'เจอแล้ว', available: 'หาบ้าน', adopted: 'รับเลี้ยง',
};

export default function AdminPostsPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await adminGetPosts(page, category, status)); }
    finally { setLoading(false); }
  }, [page, category, status]);

  useEffect(() => { load(); }, [load]);

  function changeFilter(cat: string, st: string) { setPage(1); setCategory(cat); setStatus(st); }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`ลบโพสต์ "${name}" ใช่ไหม?`)) return;
    await adminDeletePost(id);
    toast.success('ลบโพสต์แล้ว');
    load();
  }

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map(f => (
          <button key={f.value} onClick={() => changeFilter(f.value, status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === f.value ? 'bg-[#5fca9f] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}>{f.label}</button>
        ))}
        <div className="w-px bg-gray-700 mx-1" />
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => changeFilter(category, f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              status === f.value ? 'bg-gray-200 text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}>{f.label}</button>
        ))}
      </div>

      <p className="text-sm text-gray-400">ทั้งหมด {total.toLocaleString()} โพสต์</p>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr className="text-xs text-gray-400 uppercase">
                <th className="px-5 py-3 text-left">ชื่อสัตว์</th>
                <th className="px-5 py-3 text-left">ประเภท</th>
                <th className="px-5 py-3 text-left">สถานะ</th>
                <th className="px-5 py-3 text-left">สถานที่</th>
                <th className="px-5 py-3 text-left">โพสต์เมื่อ</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800/50 animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-3 bg-gray-800 rounded w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                : (data?.data ?? []).map((p: any) => (
                    <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {p.images?.[0] && (
                            <img src={p.images[0].imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                          )}
                          <span className="font-medium truncate max-w-[140px]">{p.petName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-400 capitalize">
                        {p.petType === 'dog' ? '🐶 สุนัข' : p.petType === 'cat' ? '🐱 แมว' : '🐾 อื่นๆ'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[p.status] ?? 'bg-gray-700 text-gray-300'}`}>
                          {STATUS_LABEL[p.status] ?? p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs max-w-[160px] truncate">{p.lostLocation || '—'}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(p.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/post/${p.id}`} target="_blank"
                            className="p-1.5 text-gray-500 hover:text-[#5fca9f] hover:bg-[#5fca9f]/10 rounded-lg transition-colors">
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => handleDelete(p.id, p.petName)}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:border-[#5fca9f] hover:text-[#5fca9f] disabled:opacity-40">
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-400">หน้า {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:border-[#5fca9f] hover:text-[#5fca9f] disabled:opacity-40">
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
