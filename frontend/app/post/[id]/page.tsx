import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PostDetailClient from './PostDetailClient';
import type { Post } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function getPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API}/posts/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: 'ไม่พบประกาศ' };

  const petLabel = post.petType === 'dog' ? 'สุนัข' : post.petType === 'cat' ? 'แมว' : 'สัตว์เลี้ยง';
  const title = `ตามหา${petLabel} "${post.petName}"`;
  const description = post.description
    ? post.description.slice(0, 120)
    : `ตามหา${petLabel}ชื่อ ${post.petName} หายบริเวณ ${post.lostLocation}`;
  const sorted = [...(post.images ?? [])].sort((a, b) => a.order - b.order);
  const coverImage = sorted[0]?.imageUrl ?? '/images/logo-banner.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: coverImage, width: 1200, height: 630, alt: post.petName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverImage],
    },
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  return <PostDetailClient post={post} />;
}
