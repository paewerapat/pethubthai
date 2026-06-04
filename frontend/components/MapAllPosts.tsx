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

// SVG paw print สีขาว (emoji ถูกควบคุมสีโดย OS ไม่ได้ ต้องใช้ SVG)
const PAW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="15" height="15">
  <ellipse cx="50" cy="66" rx="23" ry="21" fill="white"/>
  <ellipse cx="24" cy="38" rx="11" ry="10" fill="white"/>
  <ellipse cx="50" cy="30" rx="11" ry="10" fill="white"/>
  <ellipse cx="76" cy="38" rx="11" ry="10" fill="white"/>
  <ellipse cx="14" cy="56" rx="8" ry="7" fill="white"/>
</svg>`;

function markerIcon(petType: string, status: string, category: string) {
  if (petType === 'other') {
    const color = category === 'adoption' ? '#5fca9f' : status === 'found' ? '#22c55e' : '#ef4444';
    return L.divIcon({
      html: `<div style="width:20px;height:20px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -14],
    });
  }

  const bg = petType === 'dog'
    ? (category === 'adoption' ? '#5fca9f' : '#f97316')
    : (category === 'adoption' ? '#5fca9f' : '#e685b3');

  return L.divIcon({
    html: `<div style="
      width:32px;height:32px;
      background:${bg};
      border:3px solid white;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      cursor:pointer;
    ">${PAW_SVG}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
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
              <span className="inline-flex w-5 h-5 rounded-full bg-orange-400 border-2 border-white shadow items-center justify-center shrink-0"
                dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="10" height="10"><ellipse cx="50" cy="66" rx="23" ry="21" fill="white"/><ellipse cx="24" cy="38" rx="11" ry="10" fill="white"/><ellipse cx="50" cy="30" rx="11" ry="10" fill="white"/><ellipse cx="76" cy="38" rx="11" ry="10" fill="white"/><ellipse cx="14" cy="56" rx="8" ry="7" fill="white"/></svg>' }}
              />
              สุนัข (หาย)
            </span>
          )}
          {valid.some((p) => p.petType === 'cat' && p.category !== 'adoption') && (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex w-5 h-5 rounded-full bg-[#e685b3] border-2 border-white shadow items-center justify-center shrink-0"
                dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="10" height="10"><ellipse cx="50" cy="66" rx="23" ry="21" fill="white"/><ellipse cx="24" cy="38" rx="11" ry="10" fill="white"/><ellipse cx="50" cy="30" rx="11" ry="10" fill="white"/><ellipse cx="76" cy="38" rx="11" ry="10" fill="white"/><ellipse cx="14" cy="56" rx="8" ry="7" fill="white"/></svg>' }}
              />
              แมว (หาย)
            </span>
          )}
          {valid.some((p) => p.category === 'adoption') && (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex w-5 h-5 rounded-full border-2 border-white shadow items-center justify-center shrink-0" style={{ background: '#5fca9f' }}
                dangerouslySetInnerHTML={{ __html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="10" height="10"><ellipse cx="50" cy="66" rx="23" ry="21" fill="white"/><ellipse cx="24" cy="38" rx="11" ry="10" fill="white"/><ellipse cx="50" cy="30" rx="11" ry="10" fill="white"/><ellipse cx="76" cy="38" rx="11" ry="10" fill="white"/><ellipse cx="14" cy="56" rx="8" ry="7" fill="white"/></svg>' }}
              />
              รอบ้านใหม่
            </span>
          )}
          {valid.some((p) => p.petType === 'other') && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-red-400 shrink-0" />
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
