
import React from 'react';
import { PrayerTimes, MasjidInfo, FlyerConfig } from '../types';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputField: React.FC<InputFieldProps> = React.memo(({ label, name, value, type = 'text', placeholder = '', onChange }) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
    />
  </div>
));

interface Props {
  prayerTimes: PrayerTimes;
  setPrayerTimes: React.Dispatch<React.SetStateAction<PrayerTimes>>;
  masjidInfo: MasjidInfo;
  setMasjidInfo: React.Dispatch<React.SetStateAction<MasjidInfo>>;
  config: FlyerConfig;
  setConfig: React.Dispatch<React.SetStateAction<FlyerConfig>>;
}

const PrayerInput: React.FC<Props> = ({ prayerTimes, setPrayerTimes, masjidInfo, setMasjidInfo, config, setConfig }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in prayerTimes) {
      setPrayerTimes(prev => ({ ...prev, [name]: value }));
    } else if (name in masjidInfo) {
      setMasjidInfo(prev => ({ ...prev, [name]: value }));
    } else {
      setConfig(prev => ({ ...prev, [name]: value }));
    }
  };



  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-8">
      {/* Branding Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
          Masjid Identity & Branding
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Masjid Name" name="name" value={masjidInfo.name} onChange={handleChange} />

          {/* Logo upload field (file + fallback URL) */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Logo</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setMasjidInfo(prev => ({ ...prev, logoUrl: String(reader.result) }));
                  };
                  reader.readAsDataURL(file);
                }}
                className="text-sm"
              />
              <InputField label="Logo Image URL" name="logoUrl" value={masjidInfo.logoUrl || ''} placeholder="https://..." onChange={handleChange} />
            </div>
            <div className="text-[11px] text-slate-500 mt-2">Upload an image or provide a public URL. PNG/JPG recommended.</div>
            {masjidInfo.logoUrl && (
              <div className="mt-3 flex items-center gap-3">
                <img src={masjidInfo.logoUrl} alt="logo-preview" className="w-12 h-12 object-contain rounded-md border border-slate-200" />
                <button onClick={() => setMasjidInfo(prev => ({ ...prev, logoUrl: undefined }))} className="text-xs text-rose-600">Remove</button>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <InputField label="Address / Location" name="address" value={masjidInfo.address} onChange={handleChange} />
          </div>

          <InputField label="Verifier Name" name="verifierName" value={masjidInfo.verifierName || ''} placeholder="Name of verifier" onChange={handleChange} />
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Last Updated</label>
            <input
              type="datetime-local"
              name="lastUpdated"
              value={masjidInfo.lastUpdated ? masjidInfo.lastUpdated.slice(0,16) : ''}
              onChange={(e) => setMasjidInfo(prev => ({ ...prev, lastUpdated: e.target.value }))}
              className="border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <InputField label="Contact Number" name="phone" value={masjidInfo.phone || ''} placeholder="e.g. +234 801 234 5678" onChange={handleChange} />
        </div>
      </section>

      {/* Schedule Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          Date & Prayer Times
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Gregorian Date" name="date" value={masjidInfo.date} type="date" onChange={handleChange} />
          <InputField label="Hijri Date" name="hijriDate" value={masjidInfo.hijriDate} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <InputField label="Fajr" name="fajr" value={prayerTimes.fajr} type="time" onChange={handleChange} />
          <InputField label="Shuruq" name="shuruq" value={prayerTimes.shuruq} type="time" onChange={handleChange} />
          <InputField label="Dhuhr" name="dhuhr" value={prayerTimes.dhuhr} type="time" onChange={handleChange} />
          <InputField label="Asr" name="asr" value={prayerTimes.asr} type="time" onChange={handleChange} />
          <InputField label="Maghrib" name="maghrib" value={prayerTimes.maghrib} type="time" onChange={handleChange} />
          <InputField label="Isha" name="isha" value={prayerTimes.isha} type="time" onChange={handleChange} />
          <InputField label="Jumu'ah 1" name="jumuah" value={prayerTimes.jumuah} type="time" onChange={handleChange} />
          <InputField label="Jumu'ah 2 (Opt)" name="jumuah2" value={prayerTimes.jumuah2 || ''} type="time" onChange={handleChange} />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <input
            id="showShuruq"
            type="checkbox"
            name="showShuruq"
            checked={config.showShuruq}
            onChange={(e) => setConfig(prev => ({ ...prev, showShuruq: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="showShuruq" className="text-sm text-slate-700">Show Shuruq on flyer</label>
        </div>
      </section>

      {/* Scripture Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
          Quranic Scripture (Importance of Salah)
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Ayah in Arabic</label>
            <textarea 
              name="ayahArabic"
              value={config.ayahArabic}
              onChange={handleChange}
              dir="rtl"
              className="border border-slate-200 rounded-lg px-3 py-2 text-lg font-arabic h-20 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="...إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1">English Translation</label>
            <textarea 
              name="ayahTranslation"
              value={config.ayahTranslation}
              onChange={handleChange}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm h-20 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Indeed, prayer has been decreed upon the believers a decree of specified times."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrayerInput;
