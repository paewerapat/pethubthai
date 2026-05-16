'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import PostForm, { type PostFormData, type ImagePreview } from '@/components/PostForm';
import { uploadImage, createPost, getToken } from '@/lib/api';

export default function CreatePostPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?redirect=/post/create');
    }
  }, [router]);

  async function handleSubmit(data: PostFormData, images: ImagePreview[]) {
    const uploadedUrls = await Promise.all(images.map((img) => uploadImage(img.file)));
    const imagePayload = uploadedUrls.map((url, i) => ({ imageUrl: url, order: i }));
    const lostLocation = [data.district, data.amphoe, data.province, data.zipcode]
      .filter(Boolean)
      .join(' ');
    const { district, amphoe, province, zipcode, otherPetType, hasReward, rewardAmount,
      vaccinated, neutered, healthInfo, ...rest } = data;

    const post = await createPost({
      ...rest,
      status: 'lost',
      lostDate: data.lostDate ?? new Date().toISOString(),
      lostLocation,
      ...(data.petType === 'other' && { breed: otherPetType }),
      hasReward: hasReward ?? false,
      rewardAmount: hasReward ? (rewardAmount || undefined) : undefined,
      images: imagePayload,
    });
    router.push(`/post/${post.id}`);
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#5fca9f] transition-colors">หน้าแรก</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">โพสต์ตามหาน้อง</span>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">โพสต์ตามหาน้อง</h1>
          <p className="text-gray-500">กรอกข้อมูลให้ครบถ้วนเพื่อเพิ่มโอกาสในการหาน้องเจอ</p>
        </div>

        <PostForm
          mode="lost"
          onSubmit={handleSubmit}
          cancelHref="/"
          submitLabel="โพสต์ตามหาน้อง"
          submitLoadingLabel="กำลังโพสต์..."
        />
      </div>
    </Layout>
  );
}
