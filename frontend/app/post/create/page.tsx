'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FaFacebook, FaInstagram, FaLine } from 'react-icons/fa';
import { FiPhone, FiUser } from 'react-icons/fi';
import Layout from '@/components/Layout';
import ThaiAddressInput from '@/components/ThaiAddressInput';
import { uploadImage, createPost, getToken } from '@/lib/api';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-80 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-gray-400 text-sm">กำลังโหลดแผนที่...</p>
    </div>
  ),
});

function getDefaultDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

const schema = z
  .object({
    petName: z.string().min(1, 'กรุณากรอกชื่อน้อง'),
    petType: z.enum(['cat', 'dog', 'other']),
    otherPetType: z.string().optional(),
    breed: z.string().optional(),
    gender: z.enum(['male', 'female', 'unknown']),
    ageEstimate: z.string().optional(),
    lostDate: z.string().min(1, 'กรุณาเลือกวันเวลา'),
    district: z.string().min(1, 'กรุณาเลือกตำบล/แขวง'),
    amphoe: z.string().min(1, 'กรุณาเลือกอำเภอ/เขต'),
    province: z.string().min(1, 'กรุณาเลือกจังหวัด'),
    zipcode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
    latitude: z.number(),
    longitude: z.number(),
    description: z.string().optional(),
    phoneNumber: z.string().min(1, 'กรุณากรอกเบอร์โทร'),
    lineId: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    posterName: z.string().min(1, 'กรุณากรอกชื่อผู้โพสต์'),
  })
  .refine(
    (d) => d.petType !== 'other' || (d.otherPetType && d.otherPetType.trim().length > 0),
    { message: 'กรุณาระบุประเภทสัตว์', path: ['otherPetType'] },
  );

type FormData = z.infer<typeof schema>;

interface ImagePreview {
  file: File;
  url: string;
}

const PET_TYPES = [
  { value: 'dog', label: 'สุนัข', icon: '🐶' },
  { value: 'cat', label: 'แมว', icon: '🐱' },
  { value: 'other', label: 'อื่นๆ', icon: '🐾' },
];

const GENDERS = [
  { value: 'male', label: 'เพศผู้', icon: '♂' },
  { value: 'female', label: 'เพศเมีย', icon: '♀' },
  { value: 'unknown', label: 'ไม่ทราบ', icon: '?' },
];

export default function CreatePostPage() {
  const router = useRouter();
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      petType: 'dog',
      gender: 'unknown',
      lostDate: getDefaultDateTime(),
      latitude: 13.7563,
      longitude: 100.5018,
      district: '',
      amphoe: '',
      province: '',
      zipcode: '',
    },
  });

  const petType = watch('petType');
  const lat = watch('latitude');
  const lng = watch('longitude');
  const addressValue = {
    district: watch('district'),
    amphoe: watch('amphoe'),
    province: watch('province'),
    zipcode: watch('zipcode'),
  };

  // Try GPS on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setValue('latitude', pos.coords.latitude);
          setValue('longitude', pos.coords.longitude);
        },
        () => {},
        { timeout: 5000 },
      );
    }
  }, [setValue]);

  function addFiles(files: File[]) {
    const remaining = 3 - images.length;
    const toAdd = files
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...toAdd]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(e.target.files || []));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (images.length >= 3) return;
      addFiles(Array.from(e.dataTransfer.files));
    },
    [images.length],
  );

  function removeImage(index: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function requestGPS() {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setValue('latitude', pos.coords.latitude);
        setValue('longitude', pos.coords.longitude);
      },
      () => alert('ไม่สามารถรับตำแหน่ง GPS ได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง'),
    );
  }

  async function onSubmit(data: FormData) {
    setSubmitError(null);
    if (images.length === 0) {
      setSubmitError('กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป');
      return;
    }
    if (!getToken()) {
      router.push('/login?redirect=/post/create');
      return;
    }
    try {
      const uploadedUrls = await Promise.all(images.map((img) => uploadImage(img.file)));
      const imagePayload = uploadedUrls.map((url, i) => ({ imageUrl: url, order: i }));
      const lostLocation = [data.district, data.amphoe, data.province, data.zipcode]
        .filter(Boolean)
        .join(' ');
      const { district, amphoe, province, zipcode, otherPetType, ...rest } = data;
      const post = await createPost({
        ...rest,
        status: 'lost',
        lostLocation,
        ...(data.petType === 'other' && { breed: otherPetType }),
        images: imagePayload,
      });
      router.push(`/post/${post.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
      setSubmitError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#5fca9f] transition-colors">หน้าแรก</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">โพสต์ตามหาน้อง</span>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">โพสต์ตามหาน้อง</h1>
          <p className="text-gray-500">กรอกข้อมูลให้ครบถ้วนเพื่อเพิ่มโอกาสในการหาน้องเจอ</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* ── Section 1: ข้อมูลน้อง ── */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[#5fca9f] to-[#4db889] rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
              ข้อมูลน้อง
            </h2>

            {/* Pet Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ประเภทสัตว์ <span className="text-red-400">*</span>
              </label>
              <Controller
                name="petType"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-3">
                    {PET_TYPES.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-semibold text-base transition-all duration-200 ${
                          field.value === opt.value
                            ? 'border-[#5fca9f] bg-[#5fca9f]/10 text-[#4db889]'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              />
              {petType === 'other' && (
                <div className="mt-3">
                  <input
                    {...register('otherPetType')}
                    type="text"
                    placeholder="ระบุประเภทสัตว์ เช่น กระต่าย, นก, เต่า"
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.otherPetType
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f]'
                    }`}
                  />
                  {errors.otherPetType && (
                    <p className="text-red-400 text-xs mt-1">{errors.otherPetType.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Pet Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อน้อง <span className="text-red-400">*</span>
                </label>
                <input
                  {...register('petName')}
                  type="text"
                  placeholder="ชื่อเล่นของน้อง"
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.petName
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f]'
                  }`}
                />
                {errors.petName && <p className="text-red-400 text-xs mt-1">{errors.petName.message}</p>}
              </div>

              {/* Breed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">สายพันธุ์</label>
                <input
                  {...register('breed')}
                  type="text"
                  placeholder="เช่น พันธุ์ผสม, ชิวาวา"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f] transition-all"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อายุประมาณ</label>
                <input
                  {...register('ageEstimate')}
                  type="text"
                  placeholder="เช่น 2 ปี, 6 เดือน"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f] transition-all"
                />
              </div>

              {/* Gender */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">เพศ</label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-3">
                      {GENDERS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                            field.value === opt.value
                              ? 'border-[#6bb8e3] bg-[#6bb8e3]/10 text-[#5aa3ce]'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          <span className="font-bold">{opt.icon}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: รูปภาพ ── */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[#6bb8e3] to-[#5aa3ce] rounded-lg flex items-center justify-center text-white text-sm font-bold">2</span>
              รูปภาพน้อง
            </h2>
            <p className="text-sm text-gray-400 mb-5">อัพโหลดได้ 1–3 รูป — ลากวางหรือกดเพื่อเลือกไฟล์</p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 group">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold shadow"
                  >
                    ×
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">หลัก</span>
                  )}
                </div>
              ))}

              {images.length < 3 && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? 'border-[#5fca9f] bg-[#5fca9f]/10 scale-105'
                      : 'border-gray-300 hover:border-[#5fca9f] hover:bg-[#5fca9f]/5 text-gray-400 hover:text-[#5fca9f]'
                  }`}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium text-center leading-tight">
                    {isDragging ? 'วางรูปที่นี่' : 'ลากวาง\nหรือกดเลือก'}
                  </span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* ── Section 3: สถานที่และวันเวลา ── */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[#ff9ec7] to-[#e685b3] rounded-lg flex items-center justify-center text-white text-sm font-bold">3</span>
              สถานที่และวันเวลา
            </h2>

            <div className="space-y-5">
              {/* Lost DateTime */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันเวลาที่หาย <span className="text-red-400">*</span>
                </label>
                <input
                  {...register('lostDate')}
                  type="datetime-local"
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 focus:outline-none focus:ring-2 transition-all ${
                    errors.lostDate
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f]'
                  }`}
                />
                {errors.lostDate && <p className="text-red-400 text-xs mt-1">{errors.lostDate.message}</p>}
              </div>

              {/* Thai Address */}
              <ThaiAddressInput
                value={addressValue}
                onChange={(v) => {
                  setValue('district', v.district, { shouldValidate: true });
                  setValue('amphoe', v.amphoe, { shouldValidate: true });
                  setValue('province', v.province, { shouldValidate: true });
                  setValue('zipcode', v.zipcode, { shouldValidate: true });
                }}
                errors={{
                  district: errors.district?.message,
                  amphoe: errors.amphoe?.message,
                  province: errors.province?.message,
                  zipcode: errors.zipcode?.message,
                }}
              />

              {/* Map */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    ปักหมุดบนแผนที่{' '}
                    <span className="text-gray-400 font-normal">(คลิกเพื่อเลือกตำแหน่ง)</span>
                  </label>
                  <button
                    type="button"
                    onClick={requestGPS}
                    className="flex items-center gap-1.5 text-xs text-[#5fca9f] hover:text-[#4db889] font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    ใช้ตำแหน่ง GPS
                  </button>
                </div>
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <MapPicker
                    lat={lat}
                    lng={lng}
                    onChange={(newLat, newLng) => {
                      setValue('latitude', newLat);
                      setValue('longitude', newLng);
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {lat.toFixed(5)}, {lng.toFixed(5)}
                </p>
              </div>
            </div>
          </div>

          {/* ── Section 4: รายละเอียด ── */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[#5fca9f] to-[#4db889] rounded-lg flex items-center justify-center text-white text-sm font-bold">4</span>
              รายละเอียดเพิ่มเติม
            </h2>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="ลักษณะเด่น นิสัย สิ่งที่ติดตัว หรือพฤติกรรมพิเศษของน้อง..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f] transition-all resize-none"
            />
          </div>

          {/* ── Section 5: ข้อมูลผู้โพสต์ ── */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[#6bb8e3] to-[#5aa3ce] rounded-lg flex items-center justify-center text-white text-sm font-bold">5</span>
              ข้อมูลผู้โพสต์
            </h2>

            <div className="space-y-5">
              {/* Poster Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้โพสต์ <span className="text-red-400">*</span>
                </label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all focus-within:ring-2 ${
                  errors.posterName
                    ? 'border-red-300 focus-within:ring-red-200'
                    : 'border-gray-200 focus-within:ring-[#5fca9f]/30 focus-within:border-[#5fca9f]'
                }`}>
                  <FiUser className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    {...register('posterName')}
                    type="text"
                    placeholder="ชื่อของคุณ"
                    className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                {errors.posterName && <p className="text-red-400 text-xs mt-1">{errors.posterName.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทรศัพท์ <span className="text-red-400">*</span>
                </label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all focus-within:ring-2 ${
                  errors.phoneNumber
                    ? 'border-red-300 focus-within:ring-red-200'
                    : 'border-gray-200 focus-within:ring-[#5fca9f]/30 focus-within:border-[#5fca9f]'
                }`}>
                  <FiPhone className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    {...register('phoneNumber')}
                    type="tel"
                    placeholder="0812345678"
                    className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-400 text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>

              {/* Social */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ช่องทางติดต่ออื่น <span className="text-gray-400 font-normal">(ไม่บังคับ)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all focus-within:ring-2 border-gray-200 focus-within:border-[#06C755] focus-within:ring-[#06C755]/20`}>
                    <FaLine className="w-5 h-5 text-[#06C755] shrink-0" />
                    <input
                      {...register('lineId')}
                      type="text"
                      placeholder="Line ID"
                      className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                    />
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all focus-within:ring-2 border-gray-200 focus-within:border-[#1877F2] focus-within:ring-[#1877F2]/20`}>
                    <FaFacebook className="w-5 h-5 text-[#1877F2] shrink-0" />
                    <input
                      {...register('facebook')}
                      type="text"
                      placeholder="Facebook"
                      className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                    />
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all focus-within:ring-2 border-gray-200 focus-within:border-[#E1306C] focus-within:ring-[#E1306C]/20`}>
                    <FaInstagram className="w-5 h-5 text-[#E1306C] shrink-0" />
                    <input
                      {...register('instagram')}
                      type="text"
                      placeholder="Instagram"
                      className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {submitError}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4 pb-8">
            <Link href="/" className="btn-outline text-base flex-1 text-center">
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-base flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  กำลังโพสต์...
                </>
              ) : (
                <>
                  <span>โพสต์ตามหาน้อง</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
