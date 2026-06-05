'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminGetUsers, adminDeleteUser } from '@/lib/api';
import { FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await adminGetUsers(page, query)); }
    finally { setLoading(false); }
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`ลบผู้ใช้ "${name}" ใช่ไหม?`)) return;
    await adminDeleteUser(id);
    toast.success('ลบผู้ใช้แล้ว');
    load();
  }

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 flex-1">
          <FiSearch className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setPage(1); setQuery(search); } }}
            placeholder="ค้นหาชื่อหรืออีเมล..."
            className="bg-transparent flex-1 text-sm text-white placeholder-gray-500 focus:outline-none"
          />
        </div>
        <button onClick={() => { setPage(1); setQuery(search); }}
          className="px-4 py-2.5 bg-[#5fca9f] text-white rounded-xl text-sm font-medium hover:bg-[#4db889]">
          ค้นหา
        </button>
      </div>

      {/* Stats */}
      <p className="text-sm text-gray-400">ทั้งหมด {total.toLocaleString()} คน</p>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr className="text-xs text-gray-400 uppercase">
                <th className="px-5 py-3 text-left">ชื่อ</th>
                <th className="px-5 py-3 text-left">อีเมล</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">สมัครเมื่อ</th>
                <th className="px-5 py-3 text-left">ผู้ให้บริการ</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800/50 animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-3 bg-gray-800 rounded w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                : (data?.data ?? []).map((u: any) => (
                    <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3 font-medium">{u.name}</td>
                      <td className="px-5 py-3 text-gray-400">{u.email || '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-300'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-5 py-3 text-gray-400 capitalize">{u.provider}</td>
                      <td className="px-5 py-3">
                        {u.role !== 'admin' && (
                          <button onClick={() => handleDelete(u.id, u.name)}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
