export function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'เพิ่งโพสต์';
  if (m < 60) return `${m} นาทีที่แล้ว`;
  if (h < 24) return `${h} ชั่วโมงที่แล้ว`;
  if (d < 30) return `${d} วันที่แล้ว`;
  return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
}

export const PET_META = {
  dog:   { label: 'สุนัข', icon: '🐶', bg: 'from-[#fef0f5] to-[#ffe8f0]' },
  cat:   { label: 'แมว',   icon: '🐱', bg: 'from-[#e8f4f8] to-[#d4ebf5]' },
  other: { label: 'อื่นๆ',  icon: '🐾', bg: 'from-[#e8f8f0] to-[#d4f0e5]' },
} as const;

export const STATUS_META = {
  lost:      { label: 'หาย',      color: 'bg-[#e685b3]/85 backdrop-blur-sm text-white' },
  found:     { label: 'พบแล้ว',  color: 'bg-[#5aa3ce]/85 backdrop-blur-sm text-white' },
  adopted:   { label: 'รับเลี้ยง', color: 'bg-[#4db889]/85 backdrop-blur-sm text-white' },
  available: { label: 'หาบ้าน',  color: 'bg-[#f59e0b]/85 backdrop-blur-sm text-white' },
} as const;

export const GENDER_LABEL: Record<string, string> = {
  male: 'เพศผู้',
  female: 'เพศเมีย',
  unknown: 'ไม่ทราบเพศ',
};
