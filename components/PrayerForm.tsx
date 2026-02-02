import React from 'react';
import { Upload, Calendar, Clock, User } from 'lucide-react';

type PrayerEntry = {
    adhan: string;
    iqamah: string;
};

type Times = {
    Fajr: PrayerEntry;
    Sunrise: string;
    Dhuhr: PrayerEntry;
    Asr: PrayerEntry;
    Maghrib: PrayerEntry;
    Isha: PrayerEntry;
};

interface PrayerFormProps {
    logo: string | null;
    setLogo: (logo: string | null) => void;
    uploaderName: string;
    setUploaderName: (name: string) => void;
    uploaderPhone: string;
    setUploaderPhone: (phone: string) => void;
    location: string;
    setLocation: (location: string) => void;
    date: string;
    setDate: (date: string) => void;
    times: Times;
    handleTimeChange: (salat: keyof Times, type: 'adhan' | 'iqamah' | 'single', value: string) => void;
    lastUpdated: string;
    setLastUpdated: (updated: string) => void;
    onDownload: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

const PrayerForm: React.FC<PrayerFormProps> = ({
    logo,
    setLogo,
    uploaderName,
    setUploaderName,
    uploaderPhone,
    setUploaderPhone,
    location,
    setLocation,
    date,
    setDate,
    times,
    handleTimeChange,
    lastUpdated,
    setLastUpdated,
    onDownload,
    fileInputRef,
}) => {
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <span className="text-gold-400">🕌</span>
                    Salat Time Flyer Generator
                </h1>
                <p className="text-emerald-100">Create & share manually verified prayer times</p>
            </div>

            {/* Logo Upload */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-gold-400" />
                    Masjid/Organization Logo (Optional)
                </label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-gray-200 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold-500 file:text-white hover:file:bg-gold-600 cursor-pointer transition-all bg-white/5 rounded-lg border border-white/20 hover:border-gold-400/50"
                />
                {logo && (
                    <div className="mt-3 flex items-center gap-3">
                        <img src={logo} alt="Logo preview" className="w-20 h-20 object-contain rounded-lg border-2 border-gold-400 bg-white/10 p-2" />
                        <button
                            onClick={() => setLogo(null)}
                            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>

            {/* Location */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-white mb-2">
                    Location/Masjid Name *
                </label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Central Masjid, Lagos"
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-white placeholder-gray-400"
                />
            </div>

            {/* Uploader Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-gold-400" />
                        Uploaded By (Name) *
                    </label>
                    <input
                        type="text"
                        value={uploaderName}
                        onChange={(e) => setUploaderName(e.target.value)}
                        placeholder="Enter uploader's full name"
                        className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-white placeholder-gray-400"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-white mb-2">Uploader Phone *</label>
                    <input
                        type="tel"
                        value={uploaderPhone}
                        onChange={(e) => setUploaderPhone(e.target.value)}
                        placeholder="e.g., +234 801 234 5678"
                        className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-white placeholder-gray-400"
                        required
                    />
                </div>
            </div>
            {(!uploaderName || !uploaderPhone) && (
                <p className="text-sm text-red-300 mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                    Uploader name and phone are required to download the flyer.
                </p>
            )}

            {/* Date */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-400" />
                    Date *
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-white"
                />
            </div>

            {/* Prayer Times */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-400" />
                    Prayer Times *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.keys(times) as Array<keyof Times>).map((salat) => {
                        if (salat === 'Sunrise') {
                            return (
                                <div key={salat} className="bg-white/5 rounded-lg p-3 border border-white/20">
                                    <label className="block text-xs font-medium text-gold-300 mb-1">Ash-Shuru q</label>
                                    <input
                                        type="time"
                                        value={times.Sunrise}
                                        onChange={(e) => handleTimeChange('Sunrise', 'single', e.target.value)}
                                        className="w-full px-3 py-2 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 text-white"
                                    />
                                </div>
                            );
                        }
                        const entry = times[salat] as PrayerEntry;
                        return (
                            <div key={salat} className="bg-white/5 rounded-lg p-3 border border-white/20">
                                <label className="block text-xs font-medium text-gold-300 mb-1">{salat}</label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-[10px] text-emerald-200 mb-0.5">Adhan</label>
                                        <input
                                            type="time"
                                            value={entry.adhan}
                                            onChange={(e) => handleTimeChange(salat, 'adhan', e.target.value)}
                                            className="w-full px-2 py-2 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 text-sm text-white"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] text-emerald-200 mb-0.5">Iqamah</label>
                                        <input
                                            type="time"
                                            value={entry.iqamah}
                                            onChange={(e) => handleTimeChange(salat, 'iqamah', e.target.value)}
                                            className="w-full px-2 py-2 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 text-sm text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Last Updated */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                    Last Updated Timestamp
                </label>
                <input
                    type="text"
                    value={lastUpdated}
                    onChange={(e) => setLastUpdated(e.target.value)}
                    placeholder="e.g., 22 Dec 2024, 6:00 AM"
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-all text-white placeholder-gray-400"
                />
            </div>

            {/* Download Button */}
            <button
                onClick={onDownload}
                disabled={!uploaderName || !uploaderPhone}
                className={`w-full font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all transform shadow-lg ${!uploaderName || !uploaderPhone
                    ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white hover:scale-105 hover:shadow-2xl'
                    }`}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span className="text-lg">Download Flyer as Image</span>
            </button>
        </div>
    );
};

export default PrayerForm;
