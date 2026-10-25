import React, { useEffect, useState } from 'react';
import {
  Volume2,
  Moon,
  Sparkles,
  Clock,
  ChevronLeft,
  ChevronRight,
  Power,
} from 'lucide-react';
import type { ParentSettings, SpeechSegment } from '../types/learning';
import { playMelodyNotes, speakTeacherVoice, stopAllAudio } from '../utils/audioEngine';

interface SensoryProps {
  settings: ParentSettings;
  onUpdateSettings?: (next: ParentSettings) => void;
}

interface HighContrastCard {
  id: string;
  titleVi: string;
  whisperSegments: SpeechSegment[];
  parentTipVi: string;
}

const SENSORY_CARDS: HighContrastCard[] = [
  {
    id: 'bullseye',
    titleVi: 'Vòng tròn đồng tâm Đen – Trắng – Đỏ',
    whisperSegments: [
      { lang: 'vi', text: 'Bé ơi nhìn nè, vòng tròn màu đỏ ở chính giữa.' },
      { lang: 'en', text: 'Circle! Red circle!' },
      { lang: 'vi', text: 'Bé nhìn giỏi lắm!' },
    ],
    parentTipVi:
      'Giữ màn hình cách mắt bé 25–30cm, di chuyển chậm sang trái rồi sang phải để mắt bé dõi theo.',
  },
  {
    id: 'ladybug',
    titleVi: 'Bọ rùa chấm bi tương phản cao',
    whisperSegments: [
      { lang: 'vi', text: 'Bạn bọ rùa đỏ có những chấm đen tròn xoe.' },
      { lang: 'en', text: 'Ladybug! Little red ladybug!' },
      { lang: 'vi', text: 'Chào em bé ngoan nhé!' },
    ],
    parentTipVi:
      'Gọi tên bé nhẹ nhàng, mỉm cười nhìn vào mắt bé khi bé tập trung nhìn vào cánh bọ rùa.',
  },
  {
    id: 'star-moon',
    titleVi: 'Ngôi sao & Vầng trăng đêm',
    whisperSegments: [
      { lang: 'vi', text: 'Ngôi sao trắng lấp lánh trên bầu trời đêm.' },
      { lang: 'en', text: 'Twinkle, twinkle, little star!' },
      { lang: 'vi', text: 'Chúc bé ơi luôn bình an.' },
    ],
    parentTipVi:
      'Kết hợp vỗ nhẹ lưng hoặc xoa bàn tay bé theo nhịp bài hát ru để kích thích xúc giác.',
  },
  {
    id: 'heart-waves',
    titleVi: 'Trái tim đỏ & Sóng nhịp nhàng',
    whisperSegments: [
      { lang: 'vi', text: 'Trái tim yêu thương của bố mẹ dành cho con.' },
      { lang: 'en', text: 'Heart! I love you, little baby!' },
      { lang: 'vi', text: 'Bố mẹ yêu con thật nhiều!' },
    ],
    parentTipVi:
      'Áp nhẹ má bố mẹ gần bé, thì thầm câu "Bố mẹ yêu con" với âm lượng nhỏ, ấm áp.',
  },
];

const LULLABIES: {
  id: string;
  title: string;
  subtitleVi: string;
  style: 'twinkle' | 'lullaby';
  segments: SpeechSegment[];
}[] = [
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    subtitleVi: 'Ngôi sao nhỏ lấp lánh (Nhạc hộp êm dịu)',
    style: 'twinkle',
    segments: [
      { lang: 'en', text: 'Twinkle, twinkle, little star. How I wonder what you are.' },
      { lang: 'vi', text: 'Ngôi sao nhỏ lấp lánh trên cao, chúc em bé ngủ thật ngon nào.' },
    ],
  },
  {
    id: 'ru-em',
    title: 'Hát Ru Miền Bắc (Ầu ơ)',
    subtitleVi: 'Cái bống là cái bống bang · Giọng cô dịu hiền',
    style: 'lullaby',
    segments: [
      {
        lang: 'vi',
        text: 'Ầu ơ, cái bống là cái bống bang, khéo sảy khéo sàng cho mẹ nấu cơm.',
      },
      { lang: 'en', text: 'Sleep tight, my sweet little baby.' },
    ],
  },
  {
    id: 'rockabye',
    title: 'Rock-a-bye Baby',
    subtitleVi: 'Khúc hát ru bé trên ngọn cây xanh',
    style: 'lullaby',
    segments: [
      { lang: 'en', text: 'Rock-a-bye baby, on the treetop. When the wind blows, the cradle will rock.' },
      { lang: 'vi', text: 'Gió đưa nôi êm ái, bé ngoan khép mi tròn.' },
    ],
  },
];

export const SensoryZeroToThreeMonths: React.FC<SensoryProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const [autoOffEnabled, setAutoOffEnabled] = useState<boolean>(settings.autoOffEnabled);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number>(3);
  const [secondsLeft, setSecondsLeft] = useState<number>(180);
  const [isScreenDimmed, setIsScreenDimmed] = useState(false);
  const [activeLullaby, setActiveLullaby] = useState<string | null>(null);

  const currentCard = SENSORY_CARDS[cardIndex];

  useEffect(() => {
    setAutoOffEnabled(settings.autoOffEnabled);
  }, [settings.autoOffEnabled]);

  useEffect(() => {
    if (isScreenDimmed) return;
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 360);
    }, 80);
    return () => clearInterval(interval);
  }, [isScreenDimmed]);

  // Countdown sleep timer (only ticks when autoOffEnabled is true)
  useEffect(() => {
    if (isScreenDimmed || !autoOffEnabled) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsScreenDimmed(true);
          stopAllAudio();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isScreenDimmed, autoOffEnabled]);

  const handleToggleAutoOff = () => {
    const next = !autoOffEnabled;
    setAutoOffEnabled(next);
    setIsScreenDimmed(false);
    if (next && secondsLeft <= 0) {
      setSecondsLeft(sleepTimerMinutes * 60);
    }
    onUpdateSettings?.({ ...settings, autoOffEnabled: next });
  };

  const handleSetTimer = (mins: number) => {
    setAutoOffEnabled(true);
    setSleepTimerMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsScreenDimmed(false);
    onUpdateSettings?.({ ...settings, autoOffEnabled: true });
  };

  const handlePlayWhisper = () => {
    const gentleSettings: ParentSettings = {
      ...settings,
      volume: Math.min(0.4, settings.volume),
      voiceSpeed: 'slow',
    };
    speakTeacherVoice(currentCard.whisperSegments, gentleSettings);
  };

  const handlePlayLullaby = (lullaby: (typeof LULLABIES)[number]) => {
    setActiveLullaby(lullaby.id);
    playMelodyNotes(lullaby.style, 0.25);
    const gentleSettings: ParentSettings = {
      ...settings,
      volume: Math.min(0.4, settings.volume),
      voiceSpeed: 'slow',
    };
    setTimeout(() => {
      speakTeacherVoice(lullaby.segments, gentleSettings, () => {
        setActiveLullaby(null);
      });
    }, 700);
  };

  const offsetX = Math.sin((phase * Math.PI) / 180) * 16;
  const scalePulse = 1 + Math.sin((phase * Math.PI) / 90) * 0.05;

  if (isScreenDimmed) {
    return (
      <div className="h-full rounded-3xl bg-slate-950 text-white p-6 flex flex-col items-center justify-center text-center space-y-4 border-2 border-slate-800 shadow-xl">
        <Moon className="w-14 h-14 text-amber-300 animate-pulse" />
        <h2 className="text-xl sm:text-2xl font-bold font-display">
          Màn hình đã tự động nghỉ cho mắt bé
        </h2>
        <p className="text-slate-300 max-w-md text-xs sm:text-sm leading-relaxed">
          Trẻ 0–3 tháng chỉ nên quan sát hình tương phản vài phút mỗi lần. Bố mẹ có thể bật lại hoặc tắt chế độ tự tắt bên dưới:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleSetTimer(sleepTimerMinutes)}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm transition cursor-pointer"
          >
            Bật lại thêm {sleepTimerMinutes} phút
          </button>
          <button
            type="button"
            onClick={handleToggleAutoOff}
            className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition cursor-pointer"
          >
            Tắt chế độ Tự tắt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Compact Single-Row Timer & Co-viewing Control Bar */}
      <div className="rounded-2xl bg-white border border-rose-200 px-3.5 py-2.5 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          <span className="text-xs sm:text-sm font-extrabold text-slate-900">
            0–3 tháng: Giác quan Đen–Trắng–Đỏ & Hát ru
          </span>
          <span className="hidden md:inline text-xs text-slate-500">
            · Giữ cách mắt bé 25–30cm
          </span>
        </div>

        {/* Toggleable Auto-Off Timer & Duration Picker */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleAutoOff}
            className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
              autoOffEnabled
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
            aria-pressed={autoOffEnabled}
          >
            <Power className="w-3.5 h-3.5" />
            <span>Tự tắt: {autoOffEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}</span>
          </button>

          {autoOffEnabled && (
            <span className="text-xs font-bold text-slate-700 px-1.5 tabular-nums flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </span>
          )}

          {[2, 5, 10, 15, 30].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleSetTimer(m)}
              className={`min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer tabular-nums ${
                autoOffEnabled && sleepTimerMinutes === m
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {m}p
            </button>
          ))}
        </div>
      </div>

      {/* Main Single-Viewport Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Left: High-Contrast Black-White-Red Sensory Stage */}
        <div className="lg:col-span-7 rounded-3xl bg-white border-4 border-slate-900 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-extrabold text-slate-700 truncate">
              Thẻ {cardIndex + 1}/{SENSORY_CARDS.length}: {currentCard.titleVi}
            </span>
            <button
              type="button"
              onClick={handlePlayWhisper}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <Volume2 className="w-4 h-4" />
              <span>Cô thì thầm</span>
            </button>
          </div>

          <div
            onClick={handlePlayWhisper}
            role="button"
            tabIndex={0}
            aria-label={`Phát âm thanh thẻ ${currentCard.titleVi}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handlePlayWhisper();
            }}
            className="w-full h-52 sm:h-64 rounded-2xl bg-white border-4 border-black flex items-center justify-center overflow-hidden cursor-pointer relative select-none"
          >
            <div
              style={{
                transform: `translateX(${offsetX}px) scale(${scalePulse})`,
                transition: 'transform 120ms linear',
              }}
              className="w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center"
            >
              {currentCard.id === 'bullseye' && (
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="92" fill="#000000" />
                  <circle cx="100" cy="100" r="70" fill="#FFFFFF" />
                  <circle cx="100" cy="100" r="48" fill="#000000" />
                  <circle cx="100" cy="100" r="26" fill="#EF4444" />
                  <circle cx="92" cy="92" r="6" fill="#FFFFFF" />
                </svg>
              )}
              {currentCard.id === 'ladybug' && (
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="52" r="28" fill="#000000" />
                  <circle cx="88" cy="46" r="6" fill="#FFFFFF" />
                  <circle cx="112" cy="46" r="6" fill="#FFFFFF" />
                  <circle cx="100" cy="118" r="64" fill="#EF4444" stroke="#000000" strokeWidth="10" />
                  <line x1="100" y1="54" x2="100" y2="182" stroke="#000000" strokeWidth="8" />
                  <circle cx="72" cy="98" r="13" fill="#000000" />
                  <circle cx="128" cy="98" r="13" fill="#000000" />
                  <circle cx="68" cy="138" r="15" fill="#000000" />
                  <circle cx="132" cy="138" r="15" fill="#000000" />
                </svg>
              )}
              {currentCard.id === 'star-moon' && (
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <rect x="10" y="10" width="180" height="180" rx="28" fill="#000000" />
                  <path
                    d="M100 32 L118 76 L166 80 L128 112 L140 158 L100 132 L60 158 L72 112 L34 80 L82 76 Z"
                    fill="#FFFFFF"
                  />
                  <circle cx="100" cy="104" r="18" fill="#EF4444" />
                </svg>
              )}
              {currentCard.id === 'heart-waves' && (
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <rect x="10" y="10" width="180" height="180" rx="28" fill="#FFFFFF" stroke="#000000" strokeWidth="10" />
                  <path
                    d="M100 156 C100 156 42 116 42 74 C42 52 60 38 80 38 C92 38 100 46 100 54 C100 46 108 38 120 38 C140 38 158 52 158 74 C158 116 100 156 100 156 Z"
                    fill="#EF4444"
                    stroke="#000000"
                    strokeWidth="10"
                  />
                  <circle cx="78" cy="68" r="8" fill="#FFFFFF" />
                </svg>
              )}
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setCardIndex((i) => (i - 1 + SENSORY_CARDS.length) % SENSORY_CARDS.length)}
              className="min-h-[42px] px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>
            <p className="text-[11px] sm:text-xs text-slate-600 text-center flex-1 line-clamp-2">
              {currentCard.parentTipVi}
            </p>
            <button
              type="button"
              onClick={() => setCardIndex((i) => (i + 1) % SENSORY_CARDS.length)}
              className="min-h-[42px] px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Lullabies & Parent Guide */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          <div className="rounded-3xl bg-white border border-sky-100 p-4 shadow-sm space-y-2.5 flex-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-extrabold text-slate-900">
                Nhạc ru & Hát ru song ngữ (Tách biệt giọng Bắc & Anh)
              </h3>
            </div>

            <div className="space-y-2">
              {LULLABIES.map((lullaby) => {
                const isPlaying = activeLullaby === lullaby.id;
                return (
                  <button
                    key={lullaby.id}
                    type="button"
                    onClick={() => handlePlayLullaby(lullaby)}
                    className={`w-full min-h-[50px] p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition cursor-pointer ${
                      isPlaying
                        ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-sm'
                        : 'bg-slate-50/80 border-slate-200 hover:bg-sky-50/50 text-slate-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm truncate">{lullaby.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{lullaby.subtitleVi}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-sky-500 text-white text-xs font-bold shrink-0">
                      {isPlaying ? 'Đang phát' : 'Nghe ru'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-3.5 space-y-1">
            <h3 className="text-xs font-extrabold text-amber-950">
              Gợi ý gắn kết cho bố mẹ (0–3 tháng)
            </h3>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Khuôn mặt bố mẹ là hình ảnh đẹp nhất với bé. Hãy nhìn bé mỉm cười khi nghe cô đọc, và tắt màn hình ngay khi bé ngáp hoặc quay mặt đi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
