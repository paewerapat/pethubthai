'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import PostForm, { type PostFormData, type ImagePreview } from '@/components/PostForm';
import { uploadImage, createPost, getToken } from '@/lib/api';

export default function AdoptCreatePage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?redirect=/adopt/create');
    }
  }, [router]);

  async function handleSubmit(data: PostFormData, images: ImagePreview[]) {
    const uploadedUrls = await Promise.all(images.map((img) => uploadImage(img.file)));
    const lostLocation = [data.district, data.amphoe, data.province, data.zipcode]
      .filter(Boolean)
      .join(' ');
    const { district, amphoe, province, zipcode, otherPetType,
      vaccinated, neutered, healthInfo, hasReward, rewardAmount, ...rest } = data;

    const healthParts: string[] = [];
    if (vaccinated) healthParts.push('ฉีดวัคซีนแล้ว');
    if (neutered) healthParts.push('ทำหมันแล้ว');
    if (healthInfo) healthParts.push(healthInfo);
    let description = data.description ?? '';
    if (healthParts.length > 0) {
      description = `🏥 สุขภาพ: ${healthParts.join(', ')}\n\n${description}`.trim();
    }

    const post = await createPost({
      ...rest,
      status: 'available' as any,
      category: 'adoption' as any,
      lostDate: new Date().toISOString(),
      lostLocation,
      ...(data.petType === 'other' && { breed: otherPetType }),
      description,
      images: uploadedUrls.map((url, i) => ({ imageUrl: url, order: i })),
    });
    router.push(`/post/${post.id}`);
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/adopt" className="hover:text-[#5fca9f] transition-colors">หาบ้านให้น้อง</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">ลงประกาศ</span>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏡 หาบ้านให้น้อง</h1>
          <p className="text-gray-500">ลงข้อมูลน้องเพื่อหาเจ้าของบ้านใหม่ที่รักน้องเหมือนกัน</p>
        </div>

        <PostForm
          mode="adoption"
          onSubmit={handleSubmit}
          cancelHref="/adopt"
          submitLabel="ลงประกาศหาบ้านให้น้อง"
          submitLoadingLabel="กำลังโพสต์..."
        />
      </div>
    </Layout>
  );
}
