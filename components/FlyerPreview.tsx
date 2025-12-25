
import React from 'react';
import { PrayerTimes, MasjidInfo, FlyerConfig, ThemeColors } from '../types';

interface Props {
  prayerTimes: PrayerTimes;
  masjidInfo: MasjidInfo;
  config: FlyerConfig;
  id?: string;
}

const FlyerPreview: React.FC<Props> = ({ prayerTimes, masjidInfo, config, id }) => {
  const rows = [
    { label: 'Fajr', time: prayerTimes.fajr, arabic: 'الفجر' },
    ...(config.showShuruq ? [{ label: 'Shuruq', time: prayerTimes.shuruq, arabic: 'الشروق' }] : []),
    { label: 'Dhuhr', time: prayerTimes.dhuhr, arabic: 'الظهر' },
    { label: 'Asr', time: prayerTimes.asr, arabic: 'العصر' },
    { label: 'Maghrib', time: prayerTimes.maghrib, arabic: 'المغرب' },
    { label: 'Isha', time: prayerTimes.isha, arabic: 'العشاء' },
  ];

  return (
    <div id={id} className={`w-full max-w-md mx-auto aspect-[4/5] ${config.themeColor} text-white shadow-2xl relative overflow-hidden flex flex-col p-8 print:shadow-none`}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      
      {/* Header with Logo */}
      <div className="flex flex-col items-center mb-4 relative z-10 text-center">
        {masjidInfo.logoUrl ? (
          <img src={masjidInfo.logoUrl} alt="Masjid Logo" className="w-16 h-16 object-contain mb-3 rounded-full bg-white/10 p-1 border border-white/20" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-amber-300">☪</span>
          </div>
        )}
        <h1 className="text-2xl font-arabic font-bold mb-1 tracking-wide leading-tight">{masjidInfo.name}</h1>
        <p className="text-[10px] opacity-80 uppercase tracking-[0.2em] font-medium">{masjidInfo.address}</p>
        <div className="h-[2px] w-12 bg-amber-400 my-3 rounded-full"></div>
        <div className="flex justify-between w-full px-2">
          <span className="text-xs font-semibold tracking-wider">{masjidInfo.date}</span>
          <span className="text-xs font-arabic font-bold text-amber-200">{masjidInfo.hijriDate}</span>
        </div>
      </div>

      {/* Quranic Verse Section (top capsule) */}
      {(config.ayahArabic || config.ayahTranslation) && (
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10 text-center">
          {config.ayahArabic && (
            <p className="text-lg font-arabic mb-2 leading-relaxed text-amber-100">
              {config.ayahArabic}
            </p>
          )}
          {config.ayahTranslation && (
            <p className="text-[10px] italic leading-snug opacity-90 font-light border-t border-white/5 pt-2">
              "{config.ayahTranslation}"
            </p>
          )}
        </div>
      )}

      {/* Prayer Times Grid */}
      <div className="flex-1 space-y-1.5 relative z-10">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2 px-4 bg-white/5 hover:bg-white/10 transition-colors rounded-lg border border-white/5 group">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold tracking-widest opacity-50 leading-none mb-1 group-hover:opacity-80 transition-opacity">{row.label}</span>
              <span className="text-lg font-black tracking-tight">{row.time || '--:--'}</span>
            </div>
            <span className="text-xl font-arabic opacity-70 group-hover:opacity-100 transition-opacity">{row.arabic}</span>
          </div>
        ))}

        {/* Jumu'ah Section */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center bg-amber-500/10 rounded-xl p-3 border border-amber-500/30">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-amber-300 block mb-1">Jumu'ah Salah</span>
              <div className="flex gap-4 items-center">
                <span className="text-xl font-black">{prayerTimes.jumuah}</span>
                {prayerTimes.jumuah2 && (
                  <div className="flex items-center gap-4">
                    <span className="h-4 w-px bg-white/20"></span>
                    <span className="text-xl font-black">{prayerTimes.jumuah2}</span>
                  </div>
                )}
              </div>
            </div>
            <span className="text-2xl font-arabic text-amber-300">الجمعة</span>
          </div>
        </div>
      </div>

      {/* Poster identity strip */}
      {(masjidInfo.posterName || masjidInfo.verifierName || masjidInfo.phone || masjidInfo.lastUpdated) && (
        <div className="mt-3 text-center">
          <p className="text-[10px] leading-tight opacity-80 border-t border-white/10 pt-3 font-medium">
            {masjidInfo.verifierName ? <span>Verified by {masjidInfo.verifierName}</span> : masjidInfo.posterName ? <span>Posted by {masjidInfo.posterName}</span> : null}
            {(masjidInfo.verifierName || masjidInfo.posterName) && masjidInfo.phone ? <span> • </span> : null}
            {masjidInfo.phone ? <span>{masjidInfo.phone}</span> : null}
            {masjidInfo.lastUpdated ? <span> • Last updated {new Date(masjidInfo.lastUpdated).toLocaleString()}</span> : null}
          </p>
        </div>
      )}

      {/* Quran footer (required) */}
      {(config.ayahArabic || config.ayahTranslation) && (
        <div className="mt-3 text-center">
          <div className="border-t border-white/10 pt-3">
            {config.ayahArabic && (
              <p className="text-sm font-arabic text-amber-100 leading-relaxed">{config.ayahArabic}</p>
            )}
            {config.ayahTranslation && (
              <p className="text-[9px] italic opacity-80 mt-1">"{config.ayahTranslation}"</p>
            )}
          </div>
        </div>
      )}

      {/* Closing announcement */}
      {config.announcement && (
        <div className="mt-3 text-center">
          <p className="text-[9px] leading-tight opacity-60 italic">
            {config.announcement}
          </p>
        </div>
      )}

      {/* Bottom Trim */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
    </div>
  );
};

export default FlyerPreview;
