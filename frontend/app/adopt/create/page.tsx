'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FiStar, FiX, FiUpload } from 'react-icons/fi';
import Layout from '@/components/Layout';
import ThaiAddressInput from '@/components/ThaiAddressInput';
import { uploadImage, createPost, getToken, getMe } from '@/lib/api';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center"><p className="text-gray-400 text-sm">กำลังโหลดแผนที่...</p></div>,
});

const schema = z.object({
  petName: z.string().min(1, 'กรุณากรอกชื่อสัตว์เลี้ยง').max(50),
  petType: z.enum(['cat', 'dog', 'other']),
  otherPetType: z.string().max(30).optional(),
  breed: z.string().max(50).optional(),
  gender: z.enum(['male', 'female', 'unknown']),
  ageEstimate: z.string().max(30).optional(),
  vaccinated: z.boolean().optional(),
  neutered: z.boolean().optional(),
  healthInfo: z.string().max(500).optional(),
  district: z.string().min(1, 'กรุณาเลือกตำบล/แขวง'),
  amphoe: z.string().min(1, 'กรุณาเลือกอำเภอ/เขต'),
  province: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  zipcode: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().max(1000).optional(),
  phoneNumber: z.string().min(9, 'กรุณากรอกเบอร์โทรศัพท์').max(20).regex(/^[0-9\-+() ]+$/, 'รูปแบบเบอร์โทรไม่ถูกต้อง'),
  posterName: z.string().min(1, 'กรุณากรอกชื่อ').max(100),
  lineId: z.string().max(50).optional(),
  facebook: z.string().max(100).optional(),
  instagram: z.string().max(100).optional(),
}).refine(
  (d) => d.petType !== 'other' || (d.otherPetType && d.otherPetType.trim().length > 0),
  { message: 'กรุณาระบุประเภทสัตว์', path: ['otherPetType'] },
);

type FormData = z.infer<typeof schema>;

interface ImagePreview { file: File; url: string; }

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

export default function AdoptCreatePage() {
  const router = useRouter();
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      petType: 'cat',
      gender: 'unknown',
      latitude: 13.7563,
      longitude: 100.5018,
      district: '',
      amphoe: '',
      province: '',
      zipcode: '',
      vaccinated: false,
      neutered: false,
    },
  });

  const petType = watch('petType');
  const lat = watch('latitude');
  const lng = watch('longitude');

  useEffect(() => {
    if (!getToken()) router.replace('/login?redirect=/adopt/create');
  }, [router]);

  const addFiles = useCallback((files: FileList | File[] | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, 3 - images.length);
    setImages((prev) => [...prev, ...arr.map((f) => ({ file: f, url: URL.createObjectURL(f) }))]);
  }, [images.length]);

  function removeImage(i: number) {
    setImages((prev) => { const n = [...prev]; URL.revokeObjectURL(n[i].url); n.splice(i, 1); return n; });
  }

  async function onSubmit(data: FormData) {
    setSubmitError(null);
    if (images.length === 0) { setSubmitError('กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป'); return; }
    try {
      const urls = await Promise.all(images.map((img) => uploadImage(img.file)));
      const lostLocation = [data.district, data.amphoe, data.province, data.zipcode].filter(Boolean).join(' ');
      const { district, amphoe, province, zipcode, otherPetType, vaccinated, neutered, healthInfo, ...rest } = data;

      let description = data.description ?? '';
      const healthParts: string[] = [];
      if (vaccinated) healthParts.push('ฉีดวัคซีนแล้ว');
      if (neutered) healthParts.push('ทำหมันแล้ว');
      if (healthInfo) healthParts.push(healthInfo);
      if (healthParts.length > 0) {
        description = `🏥 สุขภาพ: ${healthParts.join(', ')}\n\n${description}`.trim();
      }

      const user = await getMe();
      const post = await createPost({
        ...rest,
        status: 'available' as any,
        category: 'adoption' as any,
        lostDate: new Date().toISOString(),
        lostLocation,
        ...(data.petType === 'other' && { breed: otherPetType }),
        description,
        images: urls.map((url, i) => ({ imageUrl: url, order: i })),
      });

      router.push(`/post/${post.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่';
      setSubmitError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ── 1. ข้อมูลน้อง ── */}
          <div className="card space-y-5">
            <h2 className="text-xl font-bold text-gray-800">🐾 ข้อมูลน้อง</h2>

            {/* Pet Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทสัตว์เลี้ยง *</label>
              <div className="flex gap-3 flex-wrap">
                {PET_TYPES.map((t) => (
                  <label key={t.value} className="cursor-pointer">
                    <input {...register('petType')} type="radio" value={t.value} className="sr-only" />
                    <span className={`px-4 py-2 rounded-xl border-2 font-medium transition-all ${petType === t.value ? 'border-[#5fca9f] bg-[#5fca9f]/10 text-[#5fca9f]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{t.label}</span>
                  </label>
                ))}
              </div>
              {petType === 'other' && (
                <input {...register('otherPetType')} placeholder="ระบุประเภท" className="mt-3 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" />
              )}
              {errors.otherPetType && <p className="text-red-400 text-xs mt-1">{errors.otherPetType.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อน้อง *</label>
                <input {...register('petName')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" placeholder="ชื่อน้อง" />
                {errors.petName && <p className="text-red-400 text-xs mt-1">{errors.petName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สายพันธุ์</label>
                <input {...register('breed')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" placeholder="ไม่ทราบ" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เพศ</label>
                <div className="flex gap-2 flex-wrap">
                  {GENDERS.map((g) => (
                    <label key={g.value} className="cursor-pointer">
                      <input {...register('gender')} type="radio" value={g.value} className="sr-only" />
                      <span className={`px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${watch('gender') === g.value ? 'border-[#6bb8e3] bg-[#6bb8e3]/10 text-[#6bb8e3]' : 'border-gray-200 text-gray-600'}`}>{g.icon} {g.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อายุโดยประมาณ</label>
                <input {...register('ageEstimate')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" placeholder="เช่น 2 ปี" />
              </div>
            </div>
          </div>

          {/* ── 2. สุขภาพ ── */}
          <div className="card space-y-4">
            <h2 className="text-xl font-bold text-gray-800">🏥 สุขภาพและการดูแล</h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('vaccinated')} className="w-5 h-5 rounded accent-[#5fca9f]" />
                <span className="text-gray-700 font-medium">💉 ฉีดวัคซีนแล้ว</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('neutered')} className="w-5 h-5 rounded accent-[#5fca9f]" />
                <span className="text-gray-700 font-medium">✂️ ทำหมันแล้ว</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ข้อมูลสุขภาพเพิ่มเติม <span className="text-gray-400 font-normal">(ไม่บังคับ)</span></label>
              <input {...register('healthInfo')} placeholder="เช่น สุขภาพดี ไม่มีโรคประจำตัว" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" />
            </div>
          </div>

          {/* ── 3. รูปภาพ ── */}
          <div className="card space-y-4">
            <h2 className="text-xl font-bold text-gray-800">📷 รูปภาพน้อง</h2>
            <p className="text-sm text-gray-400">อัพโหลดได้สูงสุด 3 รูป — รูปแรก (⭐) คือรูปปก</p>
            {images.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 group">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 0 ? (
                      <span className="absolute top-1 left-1 bg-yellow-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">⭐</span>
                    ) : (
                      <button type="button" onClick={() => setImages((p) => { const n = [...p]; const [c] = n.splice(i, 1); return [c, ...n]; })}
                        className="absolute top-1 left-1 bg-white/80 hover:bg-yellow-400 hover:text-white text-gray-500 text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all">
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
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-[#5fca9f] bg-[#5fca9f]/5' : 'border-gray-300 hover:border-[#5fca9f] hover:bg-[#5fca9f]/5'}`}
              >
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">ลากรูปมาวาง หรือคลิกเพื่อเลือก</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
              </div>
            )}
          </div>

          {/* ── 4. ที่อยู่ปัจจุบัน ── */}
          <div className="card space-y-5">
            <h2 className="text-xl font-bold text-gray-800">📍 ที่อยู่ปัจจุบันของน้อง</h2>
            <Controller control={control} name="district" render={() => (
              <ThaiAddressInput
                value={{ district: watch('district'), amphoe: watch('amphoe'), province: watch('province'), zipcode: watch('zipcode') ?? '' }}
                onChange={(v) => { setValue('district', v.district, { shouldValidate: true }); setValue('amphoe', v.amphoe, { shouldValidate: true }); setValue('province', v.province, { shouldValidate: true }); setValue('zipcode', v.zipcode); }}
                errors={{ district: errors.district?.message, amphoe: errors.amphoe?.message, province: errors.province?.message }}
              />
            )} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ปักหมุดบนแผนที่</label>
              <Controller control={control} name="latitude" render={() => (
                <MapPicker lat={lat ?? 13.7563} lng={lng ?? 100.5018} onChange={(la, lo) => { setValue('latitude', la); setValue('longitude', lo); }} />
              )} />
            </div>
          </div>

          {/* ── 5. รายละเอียดนิสัย ── */}
          <div className="card space-y-4">
            <h2 className="text-xl font-bold text-gray-800">💭 นิสัยและข้อมูลเพิ่มเติม</h2>
            <textarea {...register('description')} rows={5} placeholder="เช่น น้องเป็นแมวขี้อ้อน ชอบเล่น ไม่ดุ เข้ากับเด็กได้ดี เหมาะกับบ้านที่มีพื้นที่ ต้องการบ้านที่ไม่เลี้ยงสัตว์อื่น..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f] resize-none" />
          </div>

          {/* ── 6. ข้อมูลผู้ลงประกาศ ── */}
          <div className="card space-y-5">
            <h2 className="text-xl font-bold text-gray-800">📞 ข้อมูลผู้ลงประกาศ</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ *</label>
                <input {...register('posterName')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" />
                {errors.posterName && <p className="text-red-400 text-xs mt-1">{errors.posterName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทร *</label>
                <input {...register('phoneNumber')} type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5fca9f]" />
                {errors.phoneNumber && <p className="text-red-400 text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>
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

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{submitError}</div>
          )}

          <div className="flex gap-4 pb-8">
            <Link href="/adopt" className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-center hover:border-gray-300 transition-all">
              ยกเลิก
            </Link>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed">
              {isSubmitting ? 'กำลังโพสต์...' : '🏡 ลงประกาศหาบ้านให้น้อง'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
