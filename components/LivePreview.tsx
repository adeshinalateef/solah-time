import React from 'react';

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

interface LivePreviewProps {
    logo: string | null;
    location: string;
    date: string;
    times: Times;
    uploaderName: string;
    uploaderPhone: string;
    lastUpdated: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({
    logo,
    location,
    date,
    times,
    uploaderName,
    uploaderPhone,
    lastUpdated,
}) => {
    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 sticky top-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-gold-400">✨</span> Live Preview
            </h2>

            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-xl p-8 text-white border-4 border-gold-400 shadow-xl">
                {logo && (
                    <div className="flex justify-center mb-6">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-24 h-24 object-contain rounded-full border-4 border-gold-400 bg-white/10 p-2"
                        />
                    </div>
                )}

                <div className="text-center mb-6">
                    <h3 className="text-4xl font-arabic font-bold mb-2 text-gold-300">أوقات الصلاة</h3>
                    <h3 className="text-3xl font-bold mb-4">PRAYER TIMES</h3>
                    {location && (
                        <p className="text-xl text-gold-300 font-semibold mb-2 uppercase tracking-wide">
                            {location}
                        </p>
                    )}
                    <p className="text-lg text-gold-200">
                        {new Date(date).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    {(Object.keys(times) as Array<keyof Times>).map((salat) => {
                        if (salat === 'Sunrise') {
                            if (!times.Sunrise) return null;
                            return (
                                <div
                                    key={salat}
                                    className="bg-white/10 backdrop-blur rounded-xl p-4 flex justify-between items-center border border-gold-400/50 hover:border-gold-400 transition-all"
                                >
                                    <span className="font-bold text-lg">Ash-Shuru q</span>
                                    <span className="text-2xl font-bold text-gold-300">{times.Sunrise}</span>
                                </div>
                            );
                        }
                        const entry = times[salat] as PrayerEntry;
                        if (!entry.adhan && !entry.iqamah) return null;
                        return (
                            <div
                                key={salat}
                                className="bg-white/10 backdrop-blur rounded-xl p-3 flex items-center border border-gold-400/50 hover:border-gold-400 transition-all"
                            >
                                <span className="font-bold text-lg w-24">{salat}</span>
                                <div className="flex-1 flex justify-around">
                                    {entry.adhan && (
                                        <div className="text-center">
                                            <span className="block text-xs text-gold-200 uppercase tracking-wider font-medium">Adhan</span>
                                            <span className="text-xl font-bold text-gold-300">{entry.adhan}</span>
                                        </div>
                                    )}
                                    {entry.iqamah && (
                                        <div className="text-center">
                                            <span className="block text-xs text-gold-200 uppercase tracking-wider font-medium">Iqamah</span>
                                            <span className="text-xl font-bold text-gold-300">{entry.iqamah}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quranic Verse */}
                <div className="mb-6 bg-gold-400/10 backdrop-blur rounded-xl p-5 border border-gold-400/30">
                    <div className="text-center">
                        <p className="text-2xl font-arabic text-gold-300 font-bold mb-2 leading-relaxed">
                            إِنَّ ٱلصَّلَوٰةَ كَانَتْ عَلَى ٱلْمُؤْمِنِينَ كِتَٰبًا مَّوْقُوتًا
                        </p>
                        <p className="text-base text-white mb-1">
                            "Indeed, prayer has been decreed upon the believers at specific times."
                        </p>
                        <p className="text-sm text-gold-300 italic">
                            (Surah An-Nisa 4:103)
                        </p>
                    </div>
                </div>

                <div className="text-center text-sm bg-gold-400/20 backdrop-blur rounded-xl p-4 border border-gold-400/30">
                    {uploaderName && (
                        <p className="font-semibold mb-1">
                            Uploaded by: {uploaderName} {uploaderPhone ? `• ${uploaderPhone}` : ''}
                        </p>
                    )}
                    {lastUpdated && <p className="text-gold-200">Last Updated: {lastUpdated}</p>}
                </div>
            </div>
        </div>
    );
};

export default LivePreview;
