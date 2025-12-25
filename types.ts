
export interface PrayerTimes {
  fajr: string;
  shuruq: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumuah: string;
  jumuah2?: string;
}

export interface MasjidInfo {
  name: string;
  address: string;
  date: string;
  hijriDate: string;
  logoUrl?: string;
  posterName?: string;
  verifierName?: string; // person who manually verified times
  lastUpdated?: string; // ISO timestamp of last verification
  phone?: string;
}

export interface FlyerConfig {
  themeColor: string;
  reminderText: string;
  announcement: string;
  showShuruq: boolean;
  ayahArabic: string;
  ayahTranslation: string;
}

export enum ThemeColors {
  EMERALD = 'bg-emerald-800',
  NAVY = 'bg-slate-900',
  BURGUNDY = 'bg-rose-900',
  GOLD = 'bg-amber-700'
}
