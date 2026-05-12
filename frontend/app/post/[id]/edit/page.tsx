'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FiStar, FiX, FiUpload } from 'react-icons/fi';
import Layout from '@/components/Layout';
import ThaiAddressInput from '@/components/ThaiAddressInput';
import { fetchPost, updatePost, uploadImage, getToken, getMe, type Post } from '@/lib/api';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center"><p className="text-gray-400 text-sm">กำลังโหลดแผนที่...</p></div>,
});

const schema = z.object({
  petName: z.string().min(1, 'กรุณากรอกชื่อสัตว์เลี้ยง'),
  petType: z.enum(['cat', 'dog', 'other']),
  otherPetType: z.string().optional(),
  breed: z.string().optional(),
  gender: z.enum(['male', 'female', 'unknown']),
  ageEstimate: z.string().optional(),
  lostDate: z.string().min(1, 'กรุณาระบุวันที่หาย'),
  latitude: z.number(),
  longitude: z.number(),
  district: z.string().min(1, 'กรุณาเลือกตำบล/แขวง'),
  amphoe: z.string().min(1, 'กรุณาเลือกอำเภอ/เขต'),
  province: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  zipcode: z.string().optional(),
  description: z.string().optional(),
  phoneNumber: z.string().min(9, 'กรุณากรอกเบอร์โทรศัพท์'),
  posterName: z.string().min(1, 'กรุณากรอกชื่อผู้โพสต์'),
  hasReward: z.boolean().optional(),
  rewardAmount: z.string().optional(),
  lineId: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ManagedImage {
  id?: string;       // existing image
  imageUrl?: string; // existing image URL
  file?: File;       // new image to upload
  preview: string;   // display URL
}

const PET_TYPES = [
  { value: 'dog', label: '🐶 สุนัข' },
  { value: 'cat', label: '🐱 แมว' },
  { value: 'other', label: '🐾 อื่นๆ' },
];
const GENDERS = [
  { value: 'male', label: 'เพศผู้', icon: '♂' },
  { value: 'female', label: 'เพศเมีย', icon: '♀' },
  { value: 'unknown', label: 'ไม่ทราบ', icon: '?' },
];

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [images, setImages] = useState<ManagedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const petType = watch('petType');
  const lat = watch('latitude');
  const lng = watch('longitude');

  // Auth + owner check
  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }

    Promise.all([fetchPost(id), getMe()]).then(([p, user]) => {
      if (p.userId !== user.id) { router.replace(`/post/${id}`); return; }

      setPost(p);

      // Parse lostLocation back to district/amphoe/province/zipcode
      const parts = p.lostLocation?.split(' ') ?? [];
      const [district = '', amphoe = '', province = '', zipcode = ''] = parts;

      // Pre-fill form
      const lostDateLocal = p.lostDate
        ? new Date(p.lostDate).toISOString().slice(0, 16)
        : '';

      reset({
        petName: p.petName,
        petType: p.petType as 'cat' | 'dog' | 'other',
        breed: p.breed ?? '',
        gender: p.gender as 'male' | 'female' | 'unknown',
        ageEstimate: p.ageEstimate ?? '',
        lostDate: lostDateLocal,
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
        district,
        amphoe,
        province,
        zipcode,
        description: p.description ?? '',
        phoneNumber: p.phoneNumber,
        posterName: p.posterName,
        hasReward: p.hasReward ?? false,
        rewardAmount: p.rewardAmount ?? '',
        lineId: p.lineId ?? '',
        facebook: p.facebook ?? '',
        instagram: p.instagram ?? '',
      });

      // Load existing images (sorted by order)
      const sorted = [...(p.images ?? [])].sort((a, b) => a.order - b.order);
      setImages(sorted.map(img => ({ id: img.id, imageUrl: img.imageUrl, preview: img.imageUrl })));
    }).catch(() => router.replace('/posts')).finally(() => setLoadingPost(false));
  }, [id, router, reset]);

  // Image handling
  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const remaining = 3 - images.length;
    const newImgs: ManagedImage[] = Array.from(files).slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImgs]);
  }, [images.length]);

  function removeImage(index: number) {
    setImages(prev => {
      const next = [...prev];
      if (next[index].preview.startsWith('blob:')) URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  }

  function setCover(index: number) {
    setImages(prev => {
      const next = [...prev];
      const [cover] = next.splice(index, 1);
      return [cover, ...next];
    });
  }

  async function onSubmit(data: FormData) {
    setSubmitError(null);
    if (images.length === 0) { setSubmitError('กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป'); return; }

    try {
      // Upload new images, reuse existing URLs
      const finalImages = await Promise.all(
        images.map(async (img, i) => {
          const url = img.file ? await uploadImage(img.file) : img.imageUrl!;
          return { imageUrl: url, order: i };
        })
      );

      const lostLocation = [data.district, data.amphoe, data.province, data.zipcode].filter(Boolean).join(' ');
      const { district, amphoe, province, zipcode, otherPetType, hasReward, rewardAmount, ...rest } = data;

      await updatePost(id, {
        ...rest,
        status: post!.status,
        lostLocation,
        ...(data.petType === 'other' && { breed: otherPetType }),
        hasReward: hasReward ?? false,
        rewardAmount: hasReward ? (rewardAmount || undefined) : undefined,
        images: finalImages,
      });

      router.refresh();
      router.push(`/post/${id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
      setSubmitError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }

  if (loadingPost) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href={`/post/${id}`} className="hover:text-[#5fca9f] transition-colors">ประกาศ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">แก้ไขประกาศ</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">แก้ไขประกาศ</h1>
          <p className="text-gray-500">แก้ไขข้อมูลประกาศตามหาน้อง</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ── 1. ข้อมูลสัตว์เลี้ยง ── */}
          <div className="card space-y-5">
            <h2 className="text-xl font-bold text-gray-800">🐾 ข้อมูลสัตว์เลี้ยง</h2>

            {/* Pet Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทสัตว์เลี้ยง</label>
              <div className="flex gap-3 flex-wrap">
                {PET_TYPES.map(t => (
                  <label key={t.value} className="cursor-pointer">
                    <input {...register('petType')} type="radio" value={t.value} className="sr-only" />
                    <span className={`px-4 py-2 rounded-xl border-2 font-medium transition-all ${petType === t.value ? 'border-[#5fca9f] bg-[#5fca9f]/10 text-[#5fca9f]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {t.label}
                    </span>
                  </label>
                ))}
              </div>
              {petType === 'other' && (
                <input {...register('otherPetType')} placeholder="ระบุประเภท เช่น กระต่าย" className="mt-3 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" />
              )}
            </div>

            {/* Pet Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อสัตว์เลี้ยง *</label>
              <input {...register('petName')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" placeholder="ชื่อน้อง" />
              {errors.petName && <p className="text-red-400 text-xs mt-1">{errors.petName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สายพันธุ์</label>
                <input {...register('breed')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" placeholder="ไม่ทราบ" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อายุโดยประมาณ</label>
                <input {...register('ageEstimate')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" placeholder="เช่น 2 ปี" />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เพศ</label>
              <div className="flex gap-3">
                {GENDERS.map(g => (
                  <label key={g.value} className="cursor-pointer">
                    <input {...register('gender')} type="radio" value={g.value} className="sr-only" />
                    <span className={`px-4 py-2 rounded-xl border-2 font-medium transition-all ${watch('gender') === g.value ? 'border-[#6bb8e3] bg-[#6bb8e3]/10 text-[#6bb8e3]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {g.icon} {g.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── 2. รูปภาพ ── */}
          <div className="card space-y-4">
            <h2 className="text-xl font-bold text-gray-800">📷 รูปภาพ</h2>
            <p className="text-sm text-gray-500">อัพโหลดได้สูงสุด 3 รูป — รูปแรก (มีมงกุฎ ⭐) คือรูปปก คลิก ⭐ บนรูปอื่นเพื่อตั้งเป็นปก</p>

            {images.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    {i === 0 ? (
                      <span className="absolute top-1 left-1 bg-yellow-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">⭐</span>
                    ) : (
                      <button type="button" onClick={() => setCover(i)}
                        className="absolute top-1 left-1 bg-white/80 hover:bg-yellow-400 hover:text-white text-gray-500 text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all"
                        title="ตั้งเป็นรูปปก">
                        <FiStar className="w-3 h-3" />
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 3 && (
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-[#5fca9f] bg-[#5fca9f]/5' : 'border-gray-300 hover:border-[#5fca9f] hover:bg-[#5fca9f]/5'}`}
              >
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">ลากรูปมาวาง หรือคลิกเพื่อเลือก</p>
                <p className="text-xs text-gray-400 mt-1">เหลือได้อีก {3 - images.length} รูป</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
              </div>
            )}
          </div>

          {/* ── 3. วันที่และสถานที่ ── */}
          <div className="card space-y-5">
            <h2 className="text-xl font-bold text-gray-800">📍 วันที่และสถานที่</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">วันที่หาย *</label>
              <input {...register('lostDate')} type="datetime-local" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" />
              {errors.lostDate && <p className="text-red-400 text-xs mt-1">{errors.lostDate.message}</p>}
            </div>

            <Controller
              control={control}
              name="district"
              render={() => (
                <ThaiAddressInput
                  value={{ district: watch('district'), amphoe: watch('amphoe'), province: watch('province'), zipcode: watch('zipcode') ?? '' }}
                  onChange={v => {
                    setValue('district', v.district, { shouldValidate: true });
                    setValue('amphoe', v.amphoe, { shouldValidate: true });
                    setValue('province', v.province, { shouldValidate: true });
                    setValue('zipcode', v.zipcode);
                  }}
                  errors={{ district: errors.district?.message, amphoe: errors.amphoe?.message, province: errors.province?.message }}
                />
              )}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ปักหมุดบนแผนที่</label>
              <Controller
                control={control}
                name="latitude"
                render={() => (
                  <MapPicker
                    lat={lat ?? 13.7563}
                    lng={lng ?? 100.5018}
                    onChange={(newLat, newLng) => {
                      setValue('latitude', newLat);
                      setValue('longitude', newLng);
                    }}
                  />
                )}
              />
            </div>
          </div>

          {/* ── 4. รายละเอียด ── */}
          <div className="card space-y-5">
            <h2 className="text-xl font-bold text-gray-800">📝 รายละเอียดเพิ่มเติม</h2>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="ลักษณะเด่น สิ่งที่สังเกตได้ หรือรายละเอียดอื่นๆ"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f] resize-none"
            />
          </div>

          {/* ── 5. ข้อมูลผู้โพสต์ ── */}
          <div className="card space-y-5">
            <h2 className="text-xl font-bold text-gray-800">📞 ข้อมูลผู้โพสต์</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อผู้โพสต์ *</label>
              <input {...register('posterName')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" />
              {errors.posterName && <p className="text-red-400 text-xs mt-1">{errors.posterName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์ *</label>
              <input {...register('phoneNumber')} type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" />
              {errors.phoneNumber && <p className="text-red-400 text-xs mt-1">{errors.phoneNumber.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Line ID</label>
                <input {...register('lineId')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" placeholder="Line ID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input {...register('facebook')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" placeholder="ชื่อ Facebook" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input {...register('instagram')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" placeholder="@username" />
              </div>
            </div>
          </div>

          {/* ── ค่าตอบแทน ── */}
          <div className="card space-y-4">
            <h2 className="text-xl font-bold text-gray-800">💰 ค่าตอบแทน / สินน้ำใจ</h2>
            <p className="text-sm text-gray-400">สำหรับผู้ที่ช่วยนำน้องกลับมาได้</p>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register('hasReward')} className="w-5 h-5 rounded accent-amber-500 cursor-pointer" />
              <span className="font-medium text-gray-700">มีค่าตอบแทน / สินน้ำใจ</span>
            </label>

            {watch('hasReward') && (
              <div className="space-y-4 pl-8">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">เลือกจำนวนเงินด่วน</p>
                  <div className="flex flex-wrap gap-2">
                    {['100', '200', '300', '500', '1,000', '2,000', '3,000', '5,000'].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setValue('rewardAmount', `${amount} บาท`)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                          watch('rewardAmount') === `${amount} บาท`
                            ? 'bg-amber-400 border-amber-400 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-500'
                        }`}
                      >
                        {amount} บาท
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    หรือระบุเอง <span className="text-gray-400 font-normal">(ไม่บังคับ)</span>
                  </label>
                  <input
                    {...register('rewardAmount')}
                    placeholder="เช่น 500 บาท, ของขวัญ หรือเว้นว่างหากไม่ระบุจำนวน"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
              </div>
            )}
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{submitError}</div>
          )}

          <div className="flex gap-4">
            <Link href={`/post/${id}`} className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-center hover:border-gray-300 transition-all">
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
