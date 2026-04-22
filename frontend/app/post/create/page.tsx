'use client';

import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-80 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-gray-400 text-sm">กำลังโหลดแผนที่...</p>
    </div>
  ),
});

const schema = z.object({
  petName: z.string().min(1, 'กรุณากรอกชื่อน้อง'),
  petType: z.enum(['cat', 'dog']),
  breed: z.string().optional(),
  gender: z.enum(['male', 'female', 'unknown']),
  ageEstimate: z.string().optional(),
  status: z.enum(['lost', 'found', 'adopted']),
  lostDate: z.string().min(1, 'กรุณาเลือกวันที่'),
  lostLocation: z.string().min(1, 'กรุณากรอกสถานที่'),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().optional(),
  phoneNumber: z.string().min(1, 'กรุณากรอกเบอร์โทร'),
  lineId: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  posterName: z.string().min(1, 'กรุณากรอกชื่อผู้โพสต์'),
  posterRelation: z.enum(['owner', 'witness', 'other']),
});

type FormData = z.infer<typeof schema>;

interface ImagePreview {
  file: File;
  url: string;
}

const STATUS_OPTIONS = [
  { value: 'lost', label: 'หาย', color: 'from-[#ff9ec7] to-[#e685b3]', icon: '🔍' },
  { value: 'found', label: 'พบแล้ว', color: 'from-[#6bb8e3] to-[#5aa3ce]', icon: '✅' },
  { value: 'adopted', label: 'รับเลี้ยง', color: 'from-[#5fca9f] to-[#4db889]', icon: '🏡' },
];

const RELATION_OPTIONS = [
  { value: 'owner', label: 'เจ้าของ' },
  { value: 'witness', label: 'ผู้พบเห็น' },
  { value: 'other', label: 'อื่นๆ' },
];

export default function CreatePostPage() {
  const [images, setImages] = useState<ImagePreview[]>([]);
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
      status: 'lost',
      posterRelation: 'owner',
      latitude: 13.7563,
      longitude: 100.5018,
    },
  });

  const petType = watch('petType');
  const status = watch('status');
  const lat = watch('latitude');
  const lng = watch('longitude');

  function handleImageAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - images.length;
    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...toAdd]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleImageRemove(index: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function onSubmit(data: FormData) {
    if (images.length === 0) {
      alert('กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป');
      return;
    }
    console.log('form data:', data);
    console.log('images:', images.map((img) => img.file.name));
    // TODO: upload images → get URLs → POST /posts
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

          {/* Section 1: ข้อมูลน้อง */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[#5fca9f] to-[#4db889] rounded-lg flex items-center justify-center text-white text-sm font-bold">1</span>
              ข้อมูลน้อง
            </h2>

            {/* Pet Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">ประเภทสัตว์ <span className="text-red-400">*</span></label>
              <Controller
                name="petType"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'dog', label: 'หมา', icon: '🐶' },
                      { value: 'cat', label: 'แมว', icon: '🐱' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={`flex items-center justify-center gap-3 py-4 rounded-2xl border-2 font-semibold text-lg transition-all duration-200 ${
                          field.value === opt.value
                            ? 'border-[#5fca9f] bg-[#5fca9f]/10 text-[#4db889]'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-3xl">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">สถานะ <span className="text-red-400">*</span></label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-3">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={`flex flex-col items-center gap-1 py-3 rounded-2xl border-2 font-medium transition-all duration-200 ${
                          field.value === opt.value
                            ? 'border-transparent bg-gradient-to-br ' + opt.color + ' text-white shadow-lg'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl">{opt.icon}</span>
                        <span className="text-sm">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              />
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
                  placeholder={petType === 'cat' ? 'เช่น มิ้ว, ส้ม, ขาว' : 'เช่น โกลด์, บาร์, ดำ'}
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.petName ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f]'
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

              {/* Age Estimate */}
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
                      {[
                        { value: 'male', label: 'เพศผู้', icon: '♂️' },
                        { value: 'female', label: 'เพศเมีย', icon: '♀️' },
                        { value: 'unknown', label: 'ไม่ทราบ', icon: '❓' },
                      ].map((opt) => (
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
                          <span>{opt.icon}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Section 2: รูปภาพ */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[#6bb8e3] to-[#5aa3ce] rounded-lg flex items-center justify-center text-white text-sm font-bold">2</span>
              รูปภาพน้อง
            </h2>
            <p className="text-sm text-gray-400 mb-6">อัพโหลดได้ 1–3 รูป รูปชัดจะช่วยให้หาน้องเจอเร็วขึ้น</p>

            <div className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 group">
                  <img src={img.url} alt={`preview ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(i)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
                  >
                    ×
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">หลัก</span>
                  )}
                </div>
              ))}

              {images.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#5fca9f] hover:bg-[#5fca9f]/5 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#5fca9f] transition-all duration-200"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-medium">เพิ่มรูป</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageAdd}
            />
          </div>

          {/* Section 3: สถานที่หาย */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[#ff9ec7] to-[#e685b3] rounded-lg flex items-center justify-center text-white text-sm font-bold">3</span>
              สถานที่และวันที่
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Lost Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    วันที่หาย/พบ <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('lostDate')}
                    type="date"
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 focus:outline-none focus:ring-2 transition-all ${
                      errors.lostDate ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f]'
                    }`}
                  />
                  {errors.lostDate && <p className="text-red-400 text-xs mt-1">{errors.lostDate.message}</p>}
                </div>

                {/* Lost Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ที่อยู่ <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('lostLocation')}
                    type="text"
                    placeholder="เช่น แยกลาดพร้าว, บางนา กรุงเทพฯ"
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.lostLocation ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f]'
                    }`}
                  />
                  {errors.lostLocation && <p className="text-red-400 text-xs mt-1">{errors.lostLocation.message}</p>}
                </div>
              </div>

              {/* Map */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ปักหมุดบนแผนที่ <span className="text-gray-400 font-normal">(คลิกเพื่อเลือกตำแหน่ง)</span>
                </label>
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
                  ตำแหน่ง: {lat.toFixed(5)}, {lng.toFixed(5)}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: รายละเอียด */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[#5fca9f] to-[#4db889] rounded-lg flex items-center justify-center text-white text-sm font-bold">4</span>
              รายละเอียดเพิ่มเติม
            </h2>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="บอกเล่าลักษณะเด่น นิสัย สิ่งของที่ติดตัว หรือพฤติกรรมพิเศษของน้อง..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f] transition-all resize-none"
            />
          </div>

          {/* Section 5: ข้อมูลผู้โพสต์ */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[#6bb8e3] to-[#5aa3ce] rounded-lg flex items-center justify-center text-white text-sm font-bold">5</span>
              ข้อมูลผู้โพสต์
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Poster Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อผู้โพสต์ <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('posterName')}
                    type="text"
                    placeholder="ชื่อของคุณ"
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.posterName ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f]'
                    }`}
                  />
                  {errors.posterName && <p className="text-red-400 text-xs mt-1">{errors.posterName.message}</p>}
                </div>

                {/* Poster Relation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ความสัมพันธ์กับน้อง</label>
                  <Controller
                    name="posterRelation"
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-2">
                        {RELATION_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => field.onChange(opt.value)}
                            className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                              field.value === opt.value
                                ? 'border-[#5fca9f] bg-[#5fca9f]/10 text-[#4db889]'
                                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทรศัพท์ <span className="text-red-400">*</span>
                </label>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  placeholder="0812345678"
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.phoneNumber ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f]'
                  }`}
                />
                {errors.phoneNumber && <p className="text-red-400 text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>

              {/* Social */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">ช่องทางติดต่ออื่น (ไม่บังคับ)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#5fca9f] focus-within:ring-2 focus-within:ring-[#5fca9f]/30 transition-all">
                    <span className="text-lg">💬</span>
                    <input
                      {...register('lineId')}
                      type="text"
                      placeholder="Line ID"
                      className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#5fca9f] focus-within:ring-2 focus-within:ring-[#5fca9f]/30 transition-all">
                    <span className="text-lg">📘</span>
                    <input
                      {...register('facebook')}
                      type="text"
                      placeholder="Facebook"
                      className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#5fca9f] focus-within:ring-2 focus-within:ring-[#5fca9f]/30 transition-all">
                    <span className="text-lg">📷</span>
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
