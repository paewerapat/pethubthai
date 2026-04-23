'use client';

import { useState, useEffect, useMemo } from 'react';

interface GeoEntry {
  provinceNameTh: string;
  districtNameTh: string;   // อำเภอ/เขต
  subdistrictNameTh: string; // ตำบล/แขวง
  postalCode: number;
}

export interface AddressValue {
  district: string;   // ตำบล/แขวง
  amphoe: string;     // อำเภอ/เขต
  province: string;   // จังหวัด
  zipcode: string;
}

interface Props {
  value: AddressValue;
  onChange: (v: AddressValue) => void;
  errors?: Partial<Record<keyof AddressValue, string>>;
}

const CDN_URL =
  'https://raw.githubusercontent.com/thailand-geography-data/thailand-geography-json/main/src/geography.json';

let _cache: GeoEntry[] | null = null;

async function loadDB(): Promise<GeoEntry[]> {
  if (_cache) return _cache;
  const res = await fetch(CDN_URL);
  const raw: GeoEntry[] = await res.json();
  _cache = raw;
  return raw;
}

export default function ThaiAddressInput({ value, onChange, errors }: Props) {
  const [db, setDb] = useState<GeoEntry[]>([]);

  useEffect(() => {
    loadDB().then(setDb).catch(() => {});
  }, []);

  const provinces = useMemo(
    () => [...new Set(db.map((e) => e.provinceNameTh))].sort((a, b) => a.localeCompare(b, 'th')),
    [db],
  );

  const amphoes = useMemo(
    () =>
      value.province
        ? [
            ...new Set(
              db.filter((e) => e.provinceNameTh === value.province).map((e) => e.districtNameTh),
            ),
          ].sort((a, b) => a.localeCompare(b, 'th'))
        : [],
    [db, value.province],
  );

  const districts = useMemo(
    () =>
      value.amphoe
        ? [
            ...new Set(
              db
                .filter(
                  (e) =>
                    e.provinceNameTh === value.province && e.districtNameTh === value.amphoe,
                )
                .map((e) => e.subdistrictNameTh),
            ),
          ].sort((a, b) => a.localeCompare(b, 'th'))
        : [],
    [db, value.province, value.amphoe],
  );

  function onProvinceChange(province: string) {
    onChange({ province, amphoe: '', district: '', zipcode: '' });
  }

  function onAmphoeChange(amphoe: string) {
    onChange({ ...value, amphoe, district: '', zipcode: '' });
  }

  function onDistrictChange(district: string) {
    const entry = db.find(
      (e) =>
        e.provinceNameTh === value.province &&
        e.districtNameTh === value.amphoe &&
        e.subdistrictNameTh === district,
    );
    onChange({ ...value, district, zipcode: entry ? String(entry.postalCode) : '' });
  }

  const sel = (err?: string) =>
    `w-full px-4 py-3 rounded-xl border bg-white text-gray-800 focus:outline-none focus:ring-2 transition-all appearance-none ${
      err
        ? 'border-red-300 focus:ring-red-200'
        : 'border-gray-200 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f]'
    }`;

  const inp = (err?: string) =>
    `w-full px-4 py-3 rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
      err
        ? 'border-red-300 focus:ring-red-200'
        : 'border-gray-200 focus:ring-[#5fca9f]/30 focus:border-[#5fca9f]'
    }`;

  const isLoading = db.length === 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          จังหวัด <span className="text-red-400">*</span>
        </label>
        <select
          value={value.province}
          onChange={(e) => onProvinceChange(e.target.value)}
          disabled={isLoading}
          className={sel(errors?.province)}
        >
          <option value="">{isLoading ? 'กำลังโหลด...' : 'เลือกจังหวัด'}</option>
          {provinces.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors?.province && <p className="text-red-400 text-xs mt-1">{errors.province}</p>}
      </div>

      {/* Amphoe */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          อำเภอ/เขต <span className="text-red-400">*</span>
        </label>
        <select
          value={value.amphoe}
          onChange={(e) => onAmphoeChange(e.target.value)}
          disabled={!value.province}
          className={sel(errors?.amphoe)}
        >
          <option value="">เลือกอำเภอ/เขต</option>
          {amphoes.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        {errors?.amphoe && <p className="text-red-400 text-xs mt-1">{errors.amphoe}</p>}
      </div>

      {/* District (ตำบล) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ตำบล/แขวง <span className="text-red-400">*</span>
        </label>
        <select
          value={value.district}
          onChange={(e) => onDistrictChange(e.target.value)}
          disabled={!value.amphoe}
          className={sel(errors?.district)}
        >
          <option value="">เลือกตำบล/แขวง</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors?.district && <p className="text-red-400 text-xs mt-1">{errors.district}</p>}
      </div>

      {/* Zipcode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          รหัสไปรษณีย์ <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={value.zipcode}
          onChange={(e) => onChange({ ...value, zipcode: e.target.value })}
          placeholder="เช่น 10110"
          maxLength={5}
          className={inp(errors?.zipcode)}
        />
        {errors?.zipcode && <p className="text-red-400 text-xs mt-1">{errors.zipcode}</p>}
      </div>
    </div>
  );
}
