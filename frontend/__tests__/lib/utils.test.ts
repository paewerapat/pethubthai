import { relativeTime, PET_META, STATUS_META, GENDER_LABEL } from '@/lib/utils';

describe('relativeTime', () => {
  const now = Date.now();

  it('returns "เพิ่งโพสต์" for less than 1 minute ago', () => {
    const date = new Date(now - 30_000).toISOString();
    expect(relativeTime(date)).toBe('เพิ่งโพสต์');
  });

  it('returns minutes for 1–59 minutes ago', () => {
    const date = new Date(now - 5 * 60_000).toISOString();
    expect(relativeTime(date)).toBe('5 นาทีที่แล้ว');
  });

  it('returns hours for 1–23 hours ago', () => {
    const date = new Date(now - 3 * 3_600_000).toISOString();
    expect(relativeTime(date)).toBe('3 ชั่วโมงที่แล้ว');
  });

  it('returns days for 1–29 days ago', () => {
    const date = new Date(now - 7 * 86_400_000).toISOString();
    expect(relativeTime(date)).toBe('7 วันที่แล้ว');
  });

  it('returns formatted date for 30+ days ago', () => {
    const date = new Date(now - 40 * 86_400_000).toISOString();
    const result = relativeTime(date);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).not.toContain('วันที่แล้ว');
  });
});

describe('PET_META', () => {
  it('has entries for dog, cat, other', () => {
    expect(PET_META.dog.icon).toBe('🐶');
    expect(PET_META.cat.icon).toBe('🐱');
    expect(PET_META.other.icon).toBe('🐾');
  });

  it('each entry has label, icon, and bg', () => {
    for (const key of ['dog', 'cat', 'other'] as const) {
      expect(PET_META[key]).toHaveProperty('label');
      expect(PET_META[key]).toHaveProperty('icon');
      expect(PET_META[key]).toHaveProperty('bg');
    }
  });
});

describe('STATUS_META', () => {
  it('has entries for lost, found, adopted', () => {
    expect(STATUS_META.lost.label).toBe('หาย');
    expect(STATUS_META.found.label).toBe('พบแล้ว');
    expect(STATUS_META.adopted.label).toBe('รับเลี้ยง');
  });

  it('each entry has a color class string', () => {
    for (const key of ['lost', 'found', 'adopted'] as const) {
      expect(typeof STATUS_META[key].color).toBe('string');
      expect(STATUS_META[key].color.length).toBeGreaterThan(0);
    }
  });
});

describe('GENDER_LABEL', () => {
  it('maps male, female, unknown to Thai labels', () => {
    expect(GENDER_LABEL.male).toBe('เพศผู้');
    expect(GENDER_LABEL.female).toBe('เพศเมีย');
    expect(GENDER_LABEL.unknown).toBe('ไม่ทราบเพศ');
  });
});
