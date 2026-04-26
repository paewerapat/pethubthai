import Link from 'next/link';
import type { Post } from '@/lib/api';
import { PET_META, STATUS_META, relativeTime } from '@/lib/utils';
import { FiMapPin, FiClock } from 'react-icons/fi';

export default function PostCard({ post }: { post: Post }) {
  const pet = PET_META[post.petType] ?? PET_META.other;
  const status = STATUS_META[post.status] ?? STATUS_META.lost;
  const mainImage = post.images?.find((img) => img.order === 0) ?? post.images?.[0];

  return (
    <Link href={`/post/${post.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 hover:-translate-y-1">
        {/* Image */}
        <div className={`relative aspect-[4/3] bg-gradient-to-br ${pet.bg}`}>
          {mainImage ? (
            <img
              src={mainImage.imageUrl}
              alt={post.petName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl opacity-60">{pet.icon}</span>
            </div>
          )}
          {/* Status badge */}
          <span className={`absolute top-3 right-3 badge text-xs font-semibold ${status.color}`}>
            {status.label}
          </span>
          {/* Pet type pill */}
          <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            {pet.icon} {pet.label}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">{post.petName}</h3>

          <div className="space-y-1.5 text-sm text-gray-500">
            <div className="flex items-center gap-1.5 truncate">
              <FiMapPin className="w-3.5 h-3.5 shrink-0 text-[#5fca9f]" />
              <span className="truncate">{post.lostLocation || '—'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 shrink-0 text-[#6bb8e3]" />
              <span>{relativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
