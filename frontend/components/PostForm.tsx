'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FaFacebook, FaInstagram, FaLine } from 'react-icons/fa';
import { FiPhone, FiUser } from 'react-icons/fi';
import ThaiAddressInput from '@/components/ThaiAddressInput';

const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-80 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-gray-400 text-sm">กำลังโหลดแผนที่...</p>
    </div>
  ),
});

// ── Schema ──────────────────────────────────────────────────────────────────

const schema = z
  .object({
    petName: z.string()
      .min(1, 'กรุณากรอกชื่อน้อง')
      .min(2, 'ชื่อน้องต้องมีอย่างน้อย 2 ตัวอักษร')
      .max(50, 'ชื่อน้องยาวเกินไป (ไม่เกิน 50 ตัวอักษร)'),
    petType: z.enum(['cat', 'dog', 'other']),
    otherPetType: z.string().optional(),
    breed: z.string().optional(),
    gender: z.enum(['male', 'female', 'unknown']),
    ageEstimate: z.string().optional(),
    // lost-only
    lostDate: z.string().optional(),
    hasReward: z.boolean().optional(),
    rewardAmount: z.string().optional(),
    // adoption-only
    vaccinated: z.boolean().optional(),
    neutered: z.boolean().optional(),
    healthInfo: z.string().optional(),
    // address
    district: z.string().min(1, 'กรุณาเลือกตำบล/แขวง'),
    amphoe: z.string().min(1, 'กรุณาเลือกอำเภอ/เขต'),
    province: z.string().min(1, 'กรุณาเลือกจังหวัด'),
    zipcode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
    latitude: z.number(),
    longitude: z.number(),
    description: z.string().optional(),
    phoneNumber: z.string()
      .min(1, 'กรุณากรอกเบอร์โทร')
      .regex(/^0[0-9]{8,9}$/, 'เบอร์โทรไม่ถูกต้อง (ต้องขึ้นต้นด้วย 0 และมี 9-10 หลัก)'),
    lineId: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    posterName: z.string()
      .min(1, 'กรุณากรอกชื่อผู้โพสต์')
      .min(2, 'ชื่อผู้โพสต์ต้องมีอย่างน้อย 2 ตัวอักษร')
      .max(50, 'ชื่อผู้โพสต์ยาวเกินไป (ไม่เกิน 50 ตัวอักษร)'),
  })
  .refine(
    (d) => d.petType !== 'other' || (d.otherPetType && d.otherPetType.trim().length > 0),
    { message: 'กรุณาระบุประเภทสัตว์', path: ['otherPetType'] },
  );

export type PostFormData = z.infer<typeof schema>;

export interface ImagePreview {
  file: File;
  url: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

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

function getDefaultDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

// ── Section header helper ────────────────────────────────────────────────────

const SECTION_COLORS = [
  'from-[#5fca9f] to-[#4db889]',
  'from-[#6bb8e3] to-[#5aa3ce]',
  'from-[#ff9ec7] to-[#e685b3]',
  'from-[#5fca9f] to-[#4db889]',
  'from-[#6bb8e3] to-[#5aa3ce]',
  'from-amber-400 to-yellow-500',
];

function SectionHeader({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <span
        className={`w-8 h-8 bg-gradient-to-br ${SECTION_COLORS[(n - 1) % SECTION_COLORS.length]} rounded-lg flex items-center justify-center text-white text-sm font-bold`}
      >
        {n}
      </span>
      {title}
    </h2>
  );
}

// ── Props ────────────────────────────────────────────────────────────────────

interface PostFormProps {
  mode: 'lost' | 'adoption';
  onSubmit: (data: PostFormData, images: ImagePreview[]) => Promise<void>;
  cancelHref: string;
  submitLabel: string;
  submitLoadingLabel: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function PostForm({
  mode,
  onSubmit: onSubmitProp,
  cancelHref,
  submitLabel,
  submitLoadingLabel,
}: PostFormProps) {
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
  } = useForm<PostFormData>({
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
      vaccinated: false,
      neutered: false,
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

  function setCover(index: number) {
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      return [item, ...next];
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

  async function onSubmit(data: PostFormData) {
    setSubmitError(null);
    if (images.length === 0) {
      setSubmitError('กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป');
      return;
    }
    try {
      await onSubmitProp(data, images);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
      setSubmitError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  }

  // dynamic section numbers
  let sectionIdx = 0;
  const nextSection = () => ++sectionIdx;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* ── Section: ข้อมูลน้อง ── */}
      <div className="card">
        <SectionHeader n={nextSection()} title="ข้อมูลน้อง" />

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

      {/* ── Section: สุขภาพ (adoption only) ── */}
      {mode === 'adoption' && (
        <div className="card">
          <SectionHeader n={nextSection()} title="สุขภาพและการดูแล" />
          <div className="flex flex-wrap gap-6 mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('vaccinated')} className="w-5 h-5 rounded accent-[#5fca9f] cursor-pointer" />
              <span className="font-medium text-gray-700">💉 ฉีดวัคซีนแล้ว</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('neutered')} className="w-5 h-5 rounded accent-[#5fca9f] cursor-pointer" />
              <span className="font-medium text-gray-700">✂️ ทำหมันแล้ว</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ข้อมูลสุขภาพเพิ่มเติม <span className="text-gray-400 font-normal">(ไม่บังคับ)</span>
            </label>
            <input
              {...register('healthInfo')}
              type="text"
              placeholder="เช่น สุขภาพดี ไม่มีโรคประจำตัว"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f] transition-all"
            />
          </div>
        </div>
      )}

      {/* ── Section: รูปภาพ ── */}
      <div className="card">
        <SectionHeader n={nextSection()} title="รูปภาพน้อง" />
        <p className="text-sm text-gray-400 mb-5">อัพโหลดได้ 1–3 รูป — รูปแรก (⭐) คือรูปปก กดดาวบนรูปอื่นเพื่อตั้งเป็นปก</p>

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
              {i === 0 ? (
                <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow">⭐</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setCover(i)}
                  className="absolute top-2 left-2 w-6 h-6 bg-white/80 hover:bg-yellow-400 hover:text-white text-gray-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs shadow"
                  title="ตั้งเป็นรูปปก"
                >
                  ☆
                </button>
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

      {/* ── Section: สถานที่และวันเวลา ── */}
      <div className="card">
        <SectionHeader
          n={nextSection()}
          title={mode === 'lost' ? 'สถานที่และวันเวลา' : 'สถานที่ของน้อง'}
        />

        <div className="space-y-5">
          {/* Lost Date (lost only) */}
          {mode === 'lost' && (
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
          )}

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

      {/* ── Section: รายละเอียด ── */}
      <div className="card">
        <SectionHeader
          n={nextSection()}
          title={mode === 'lost' ? 'รายละเอียดเพิ่มเติม' : 'นิสัยและข้อมูลเพิ่มเติม'}
        />
        <textarea
          {...register('description')}
          rows={4}
          placeholder={
            mode === 'lost'
              ? 'ลักษณะเด่น นิสัย สิ่งที่ติดตัว หรือพฤติกรรมพิเศษของน้อง...'
              : 'เช่น น้องเป็นแมวขี้อ้อน ชอบเล่น ไม่ดุ เข้ากับเด็กได้ดี เหมาะกับบ้านที่มีพื้นที่...'
          }
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f] transition-all resize-none"
        />
      </div>

      {/* ── Section: ข้อมูลผู้โพสต์ ── */}
      <div className="card">
        <SectionHeader n={nextSection()} title="ข้อมูลผู้โพสต์" />

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
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#06C755] focus-within:ring-2 focus-within:ring-[#06C755]/20 transition-all">
                <FaLine className="w-5 h-5 text-[#06C755] shrink-0" />
                <input
                  {...register('lineId')}
                  type="text"
                  placeholder="Line ID"
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#1877F2] focus-within:ring-2 focus-within:ring-[#1877F2]/20 transition-all">
                <FaFacebook className="w-5 h-5 text-[#1877F2] shrink-0" />
                <input
                  {...register('facebook')}
                  type="text"
                  placeholder="Facebook"
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#E1306C] focus-within:ring-2 focus-within:ring-[#E1306C]/20 transition-all">
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

      {/* ── Section: ค่าตอบแทน (lost only) ── */}
      {mode === 'lost' && (
        <div className="card">
          <SectionHeader n={nextSection()} title="ค่าตอบแทน / สินน้ำใจ" />
          <p className="text-sm text-gray-400 mb-5">สำหรับผู้ที่ช่วยนำน้องกลับมาได้</p>

          <label className="flex items-center gap-3 cursor-pointer mb-5">
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
      )}

      {/* Error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {submitError}
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-4 pb-8">
        <Link href={cancelHref} className="btn-outline text-base flex-1 text-center">
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
              {submitLoadingLabel}
            </>
          ) : (
            <>
              <span>{submitLabel}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
