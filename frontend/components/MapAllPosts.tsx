'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Post } from '@/lib/api';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PET_EMOJI: Record<string, string> = { dog: '🐶', cat: '🐱', other: '🐾' };

function markerIcon(petType: string, status: string, category: string) {
  const emoji = PET_EMOJI[petType] ?? '🐾';
  const bg = category === 'adoption'
    ? '#5fca9f'
    : petType === 'dog'
      ? '#f97316'
      : petType === 'cat'
        ? '#e685b3'
        : '#ef4444';

  return L.divIcon({
    html: `<div style="
      width:34px;height:34px;
      background:${bg};
      border:3px solid white;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:16px;line-height:1;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      cursor:pointer;
    ">${emoji}</div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -21],
  });
}

const PET_ICON: Record<string, string> = { dog: '🐶', cat: '🐱', other: '🐾' };

function FitBounds({ posts }: { posts: Post[] }) {
  const map = useMap();
  useEffect(() => {
    if (posts.length === 0) return;
    const coords = posts.map((p) => [Number(p.latitude), Number(p.longitude)] as [number, number]);
    if (posts.length === 1) {
      map.setView(coords[0], 13);
      return;
    }
    const bounds = L.latLngBounds(coords);
    if (bounds.getNorth() === bounds.getSouth() && bounds.getEast() === bounds.getWest()) {
      map.setView(coords[0], 13);
    } else {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 });
    }
  }, [posts, map]);
  return null;
}

export default function MapAllPosts({ posts }: { posts: Post[] }) {
  const valid = posts.filter((p) => p.latitude && p.longitude);

  const hasLost = valid.some((p) => p.category !== 'adoption' && p.status === 'lost');
  const hasFound = valid.some((p) => p.category !== 'adoption' && p.status === 'found');
  const hasAdopted = valid.some((p) => p.category !== 'adoption' && p.status === 'adopted');
  const hasAdoption = valid.some((p) => p.category === 'adoption');

  return (
    <div>
      <MapContainer
        center={[13.03, 101.5]}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: '480px', width: '100%', borderRadius: '1rem' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds posts={valid} />
        {valid.map((post) => (
          <Marker
            key={post.id}
            position={[Number(post.latitude), Number(post.longitude)]}
            icon={markerIcon(post.petType, post.status, post.category)}
          >
            <Popup>
              <div style={{ minWidth: '160px', maxWidth: '200px', fontFamily: 'inherit' }}>
                {post.images?.[0] && (
                  <img
                    src={post.images[0].imageUrl}
                    alt={post.petName}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      marginBottom: '8px',
                    }}
                  />
                )}
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                  {PET_ICON[post.petType] ?? '🐾'} {post.petName}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  📍 {post.lostLocation || '—'}
                </div>
                <a
                  href={`/post/${post.id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#5fca9f',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '13px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  ดูรายละเอียด →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend + count */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1">
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          {valid.some((p) => p.petType === 'dog' && p.category !== 'adoption') && (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex w-6 h-6 rounded-full bg-orange-400 border-2 border-white shadow items-center justify-center text-sm shrink-0">🐶</span>
              สุนัข
            </span>
          )}
          {valid.some((p) => p.petType === 'cat' && p.category !== 'adoption') && (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex w-6 h-6 rounded-full bg-[#e685b3] border-2 border-white shadow items-center justify-center text-sm shrink-0">🐱</span>
              แมว
            </span>
          )}
          {valid.some((p) => p.category === 'adoption') && (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex w-6 h-6 rounded-full border-2 border-white shadow items-center justify-center text-sm shrink-0" style={{ background: '#5fca9f' }}>🐶</span>
              รอบ้านใหม่
            </span>
          )}
          {valid.some((p) => p.petType === 'other') && (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex w-6 h-6 rounded-full bg-red-400 border-2 border-white shadow items-center justify-center text-sm shrink-0">🐾</span>
              อื่นๆ
            </span>
          )}
        </div>
        <span className="text-sm text-gray-400">
          {valid.length.toLocaleString()} ตำแหน่งบนแผนที่
        </span>
      </div>
    </div>
  );
}
