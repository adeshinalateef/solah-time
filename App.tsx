
import React, { useState, useRef } from 'react';
import { Download, Upload, Calendar, Clock, User } from 'lucide-react';

type Times = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export default function App(): JSX.Element {
  const [logo, setLogo] = useState<string | null>(null);
  const [uploaderName, setUploaderName] = useState<string>('');
  const [uploaderPhone, setUploaderPhone] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [times, setTimes] = useState<Times>({ Fajr: '', Sunrise: '', Dhuhr: '', Asr: '', Maghrib: '', Isha: '' });
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const flyerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleTimeChange = (salat: keyof Times, value: string) => {
    setTimes(prev => ({ ...prev, [salat]: value } as Times));
  };

  const downloadFlyer = async () => {
    try {
      const flyerElement = flyerRef.current;
      if (!flyerElement) return;

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Unable to get canvas context');
      
      // Set dimensions for WhatsApp-friendly size
      const width = 1080;
      const height = 1350;
      canvas.width = width;
      canvas.height = height;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#065f46');
      gradient.addColorStop(1, '#064e3b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Decorative border
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 6;
      ctx.strokeRect(15, 15, width - 30, height - 30);

      // Inner border
      ctx.strokeStyle = '#fcd34d';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, width - 50, height - 50);

      let y = 80;

      // Handle logo
      if (logo) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const logoSize = 100;
            const x = (width - logoSize) / 2;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + logoSize/2, y + logoSize/2, logoSize/2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, x, y, logoSize, logoSize);
            ctx.restore();
            y += logoSize + 40;
            resolve();
          };
          img.onerror = () => resolve();
          img.src = logo;
        });
      } else {
        y += 20;
      }

      // Title - Arabic
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('أوقات الصلاة', width / 2, y);
      y += 60;

      // Title - English
      ctx.font = 'bold 48px Arial';
      ctx.fillText('PRAYER TIMES', width / 2, y);
      y += 70;

      // Location
      if (location) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '32px Arial';
        ctx.fillText(location.toUpperCase(), width / 2, y);
        y += 45;
      }

      // Date
      ctx.fillStyle = '#fcd34d';
      ctx.font = '28px Arial';
      const formattedDate = new Date(date).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      ctx.fillText(formattedDate, width / 2, y);
      y += 80;

      // Prayer times
      const prayers = [
        { name: 'Fajr', arabic: 'الفجر', time: times.Fajr },
        { name: 'Sunrise', arabic: 'الشروق', time: times.Sunrise },
        { name: 'Dhuhr', arabic: 'الظهر', time: times.Dhuhr },
        { name: 'Asr', arabic: 'العصر', time: times.Asr },
        { name: 'Maghrib', arabic: 'المغرب', time: times.Maghrib },
        { name: 'Isha', arabic: 'العشاء', time: times.Isha }
      ];

      const boxWidth = width - 140;
      const boxHeight = 70;
      const boxX = 70;

      prayers.forEach((prayer) => {
        if (prayer.time) {
          // Box background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.fillRect(boxX, y - 52, boxWidth, boxHeight);
          
          // Box border
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1;
          ctx.strokeRect(boxX, y - 52, boxWidth, boxHeight);

          // Prayer name (English) - left
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 32px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(prayer.name, boxX + 25, y);

          // Prayer name (Arabic) - right
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 36px Arial';
          ctx.textAlign = 'right';
          ctx.fillText(prayer.arabic, boxX + boxWidth - 25, y);

          // Time - center
          ctx.fillStyle = '#fcd34d';
          ctx.font = 'bold 40px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(prayer.time, width / 2, y);

          y += 90;
        }
      });

      // Quranic verse section
      y += 30;
      
      // Verse box
      ctx.fillStyle = 'rgba(251, 191, 36, 0.1)';
      ctx.fillRect(60, y - 20, width - 120, 170);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, y - 20, width - 120, 170);

      // Arabic verse
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      
      // Split Arabic text into lines
      const arabicLine1 = 'إِنَّ ٱلصَّلَوٰةَ كَانَتْ عَلَى';
      const arabicLine2 = 'ٱلْمُؤْمِنِينَ كِتَٰبًا مَّوْقُوتًا';
      
      ctx.fillText(arabicLine1, width / 2, y + 10);
      ctx.fillText(arabicLine2, width / 2, y + 45);

      // English translation
      ctx.fillStyle = '#ffffff';
      ctx.font = '22px Arial';
      const engLine1 = '"Indeed, prayer has been decreed upon';
      const engLine2 = 'the believers at specific times."';
      
      ctx.fillText(engLine1, width / 2, y + 85);
      ctx.fillText(engLine2, width / 2, y + 112);

      // Surah reference
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'italic 20px Arial';
      ctx.fillText('(Surah An-Nisa 4:103)', width / 2, y + 142);

      // Footer section
      y = height - 140;
      
      // Footer box
      ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.fillRect(50, y - 10, width - 100, 110);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, y - 10, width - 100, 110);

      ctx.fillStyle = '#ffffff';
      ctx.font = '26px Arial';
      ctx.textAlign = 'center';

      // Watermark (soft large location in background)
      if (location) {
        ctx.save();
        ctx.translate(width/2, height/2);
        ctx.rotate(-0.35);
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(location.toUpperCase(), 0, 0);
        ctx.restore();
      }

      // Footer text: Uploaded by and timestamp
      ctx.fillStyle = '#ffffff';
      ctx.font = '26px Arial';
      ctx.textAlign = 'center';
      if (uploaderName) {
        ctx.fillText(`Uploaded by: ${uploaderName} ${uploaderPhone ? `• ${uploaderPhone}` : ''}`, width / 2, y + 25);
      }

      if (lastUpdated) {
        ctx.fillStyle = '#fcd34d';
        ctx.font = '24px Arial';
        ctx.fillText(`Last Updated: ${lastUpdated}`, width / 2, y + 60);
      }

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const filename = `prayer-times-${date}-${location.replace(/\s+/g, '-') || 'flyer'}.png`;
          link.download = filename;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Error generating flyer:', error);
      alert('Error generating flyer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-white mb-2">Salat Time Flyer Generator</h1>
          <p className="text-emerald-100">Create & share manually verified prayer times</p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 border-b pb-3">Enter Prayer Details</h2>
          
          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Upload className="inline w-4 h-4 mr-2" />
              Masjid/Organization Logo (Optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
            />
            {logo && (
              <div className="mt-3 flex items-center gap-3">
                <img src={logo} alt="Logo preview" className="w-20 h-20 object-contain rounded-lg border-2 border-emerald-200" />
                <button
                  onClick={() => setLogo(null)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location/Masjid Name *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Central Masjid, Lagos"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Uploader Name & Phone (required) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Uploaded By (Name) *
              </label>
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="Enter uploader's full name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Uploader Phone *</label>
              <input
                type="tel"
                value={uploaderPhone}
                onChange={(e) => setUploaderPhone(e.target.value)}
                placeholder="e.g., +234 801 234 5678"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>
          {(!uploaderName || !uploaderPhone) && (
            <p className="text-sm text-rose-600 mb-4">Uploader name and phone are required to download the flyer.</p>
          )}

          {/* Date */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Prayer Times */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Clock className="inline w-4 h-4 mr-2" />
              Prayer Times *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(times).map((salat) => (
                <div key={salat} className="bg-emerald-50 rounded-lg p-3">
                  <label className="block text-xs font-medium text-emerald-800 mb-1">{salat}</label>
                  <input
                    type="time"
                    value={times[salat]}
                    onChange={(e) => handleTimeChange(salat as keyof Times, e.target.value)}
                    className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Updated Timestamp
            </label>
            <input
              type="text"
              value={lastUpdated}
              onChange={(e) => setLastUpdated(e.target.value)}
              placeholder="e.g., 22 Dec 2024, 6:00 AM"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Download Button */}
          <button
            onClick={downloadFlyer}
            disabled={!uploaderName || !uploaderPhone}
            className={`w-full font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all transform shadow-lg ${(!uploaderName || !uploaderPhone) ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:scale-105'}`}
          >
            <Download className="w-6 h-6" />
            <span className="text-lg">Download Flyer as Image</span>
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <h2 className="text-xl font-bold text-emerald-900 mb-4">Live Preview</h2>
          <div 
            ref={flyerRef}
            className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-lg p-8 text-white border-4 border-amber-400"
          >
            {logo && (
              <div className="flex justify-center mb-6">
                <img src={logo} alt="Logo" className="w-24 h-24 object-contain rounded-full border-4 border-amber-400" />
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-4xl font-bold mb-2">أوقات الصلاة</h3>
              <h3 className="text-3xl font-bold mb-4">PRAYER TIMES</h3>
              {location && <p className="text-xl text-amber-300 font-semibold mb-2">{location.toUpperCase()}</p>}
              <p className="text-lg text-amber-200">
                {new Date(date).toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {Object.entries(times).map(([salat, time]) => time && (
                <div key={salat} className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4 flex justify-between items-center border border-amber-400">
                  <span className="font-bold text-lg">{salat}</span>
                  <span className="text-2xl font-bold text-amber-300">{time}</span>
                </div>
              ))}
            </div>

            {/* Quranic Verse */}
            <div className="mb-6 bg-amber-400 bg-opacity-10 backdrop-blur rounded-lg p-5 border border-amber-400">
              <div className="text-center">
                <p className="text-2xl text-amber-300 font-bold mb-2 leading-relaxed">
                  إِنَّ ٱلصَّلَوٰةَ كَانَتْ عَلَى ٱلْمُؤْمِنِينَ كِتَٰبًا مَّوْقُوتًا
                </p>
                <p className="text-base text-white mb-1">
                  "Indeed, prayer has been decreed upon the believers at specific times."
                </p>
                <p className="text-sm text-amber-300 italic">
                  (Surah An-Nisa 4:103)
                </p>
              </div>
            </div>

            <div className="text-center text-sm bg-amber-400 bg-opacity-20 backdrop-blur rounded-lg p-4 border border-amber-400">
              {uploaderName && <p className="font-semibold mb-1">Uploaded by: {uploaderName} {uploaderPhone ? `• ${uploaderPhone}` : ''}</p>}
              {lastUpdated && <p className="text-amber-200">Last Updated: {lastUpdated}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );}