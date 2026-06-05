'use client';

import { useEffect, useState } from 'react';
import { adminGetDashboard } from '@/lib/api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const STAT_CARDS = [
  { key: 'totalPosts',    label: 'โพสต์ทั้งหมด',    color: '#5fca9f', icon: '📋' },
  { key: 'totalUsers',    label: 'ผู้ใช้งานทั้งหมด', color: '#6bb8e3', icon: '👥' },
  { key: 'totalLost',     label: 'กำลังหาย',         color: '#e685b3', icon: '🔍' },
  { key: 'totalFound',    label: 'เจอแล้ว',          color: '#4db889', icon: '✅' },
  { key: 'todayEvents',   label: 'Events วันนี้',    color: '#f97316', icon: '📊' },
  { key: 'newUsersToday', label: 'สมาชิกใหม่วันนี้', color: '#a78bfa', icon: '🆕' },
];

const EVENT_LABELS: Record<string, string> = {
  page_view: 'เข้าชมหน้า', share_click: 'แชร์', post_resolved: 'เจอน้อง/ได้บ้าน',
  user_login: 'Login', user_register: 'สมัครสมาชิก',
};

const PIE_COLORS = ['#e685b3', '#4db889', '#94a3b8', '#f59e0b'];

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-gray-800 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 bg-gray-800 rounded-2xl" />
        <div className="h-72 bg-gray-800 rounded-2xl" />
      </div>
    </div>
  );

  const postStatusData = [
    { name: 'หาย',       value: data?.stats.totalLost },
    { name: 'เจอแล้ว',   value: data?.stats.totalFound },
    { name: 'รับเลี้ยง', value: data?.stats.totalAdopted },
    { name: 'หาบ้าน',    value: data?.stats.totalAvailable },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAT_CARDS.map(({ key, label, color, icon }) => (
          <div key={key} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-2xl font-bold" style={{ color }}>
              {(data?.stats[key] ?? 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Page Views Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">📈 การเข้าชม 30 วันล่าสุด (สมาชิก vs ทั่วไป)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data?.pageViews ?? []}>
            <defs>
              <linearGradient id="gAll" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6bb8e3" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6bb8e3" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gLogin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5fca9f" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#5fca9f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={d => d.slice(5)} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#fff' }} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
            <Area type="monotone" dataKey="count" name="ทั้งหมด" stroke="#6bb8e3" fill="url(#gAll)" />
            <Area type="monotone" dataKey="loggedIn" name="สมาชิก" stroke="#5fca9f" fill="url(#gLogin)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events by type */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">📊 Events ตามประเภท (30 วัน)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={(data?.eventTypes ?? []).map((r: any) => ({ ...r, label: EVENT_LABELS[r.event] ?? r.event }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="count" name="จำนวน" fill="#5fca9f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Post Status Pie */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">🐾 สถานะโพสต์</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={postStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {postStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Share Platform + Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Share platforms */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">🔗 แชร์ผ่านช่องทาง (30 วัน)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data?.sharePlatforms ?? []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis dataKey="platform" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="count" name="ครั้ง" fill="#e685b3" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent events */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">🕐 Events ล่าสุด</h2>
          <div className="space-y-2 overflow-auto max-h-52">
            {(data?.recentEvents ?? []).map((e: any) => (
              <div key={e.id} className="flex items-start justify-between gap-2 text-xs border-b border-gray-800 pb-2">
                <div>
                  <span className="text-[#5fca9f] font-medium">{EVENT_LABELS[e.event] ?? e.event}</span>
                  {e.metadata?.page && <span className="text-gray-500 ml-2">{e.metadata.page}</span>}
                  {e.metadata?.platform && <span className="text-gray-500 ml-2">({e.metadata.platform})</span>}
                  <span className="ml-2">{e.metadata?.isLoggedIn ? '👤 สมาชิก' : '🌐 ทั่วไป'}</span>
                </div>
                <span className="text-gray-600 shrink-0">
                  {new Date(e.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
