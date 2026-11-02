import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Music,
  Check,
  ChevronDown,
} from 'lucide-react';
import type { ParentSettings } from '../types/learning';
import {
  XYLOPHONE_KEYS,
  PIANO_BLACK_KEYS,
  RAINBOW_SONGS,
  type RainbowSongItem,
  type PianoBlackKeyItem,
} from '../data/brainGamesData';
import {
  playMusicalInstrumentNote,
  playRhythmDrumHit,
  playCelebrationChime,
  speakTeacherVoice,
  type MusicalInstrumentType,
} from '../utils/audioEngine';
import { fireStarExplosion, fireFireworksCelebration } from '../utils/confetti';

// ============================================================================
// 3D CHIBI SVG ICONS (High-fidelity, colorful, tactile for toddlers)
// ============================================================================

export const ChibiPiano3dIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="40" height="32" rx="8" fill="url(#pianoBodyGrad)" stroke="#1E293B" strokeWidth="2.5" />
    <rect x="8" y="14" width="32" height="6" rx="3" fill="#F59E0B" />
    {/* White keys */}
    <rect x="7" y="22" width="6" height="15" rx="2" fill="#FFFDF5" stroke="#CBD5E1" strokeWidth="1.5" />
    <rect x="14" y="22" width="6" height="15" rx="2" fill="#FFFDF5" stroke="#CBD5E1" strokeWidth="1.5" />
    <rect x="21" y="22" width="6" height="15" rx="2" fill="#FFFDF5" stroke="#CBD5E1" strokeWidth="1.5" />
    <rect x="28" y="22" width="6" height="15" rx="2" fill="#FFFDF5" stroke="#CBD5E1" strokeWidth="1.5" />
    <rect x="35" y="22" width="6" height="15" rx="2" fill="#FFFDF5" stroke="#CBD5E1" strokeWidth="1.5" />
    {/* Black keys */}
    <rect x="11.5" y="22" width="3.5" height="9" rx="1.5" fill="#0F172A" />
    <rect x="18.5" y="22" width="3.5" height="9" rx="1.5" fill="#0F172A" />
    <rect x="25.5" y="22" width="3.5" height="9" rx="1.5" fill="#0F172A" />
    <rect x="32.5" y="22" width="3.5" height="9" rx="1.5" fill="#0F172A" />
    {/* Gold stars shine */}
    <circle cx="39" cy="11" r="2.5" fill="#FDE047" />
    <defs>
      <linearGradient id="pianoBodyGrad" x1="4" y1="8" x2="44" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#334155" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
    </defs>
  </svg>
);

export const ChibiXylophone3dIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wooden Frame */}
    <path d="M6 14L42 20L40 38L8 34Z" fill="#D97706" stroke="#92400E" strokeWidth="2" strokeLinejoin="round" />
    {/* Colored Bars */}
    <rect x="8" y="10" width="4.5" height="28" rx="2" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
    <rect x="13.5" y="12" width="4.5" height="25" rx="2" fill="#F97316" stroke="#C2410C" strokeWidth="1" />
    <rect x="19" y="14" width="4.5" height="22" rx="2" fill="#EAB308" stroke="#A16207" strokeWidth="1" />
    <rect x="24.5" y="16" width="4.5" height="19" rx="2" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
    <rect x="30" y="18" width="4.5" height="16" rx="2" fill="#0EA5E9" stroke="#0369A1" strokeWidth="1" />
    <rect x="35.5" y="20" width="4.5" height="13" rx="2" fill="#A855F7" stroke="#7E22CE" strokeWidth="1" />
    {/* Mallet */}
    <circle cx="28" cy="8" r="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
    <line x1="28" y1="12" x2="38" y2="34" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const ChibiPractice3dIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="url(#practiceGrad)" />
    {/* Cute smiling musical eighth notes */}
    <ellipse cx="17" cy="31" rx="5" ry="3.5" transform="rotate(-20 17 31)" fill="#F59E0B" />
    <ellipse cx="29" cy="27" rx="5" ry="3.5" transform="rotate(-20 29 27)" fill="#F59E0B" />
    <rect x="19" y="15" width="3" height="16" rx="1.5" fill="#B45309" />
    <rect x="31" y="11" width="3" height="16" rx="1.5" fill="#B45309" />
    <path d="M19 16L34 12V16L19 20Z" fill="#B45309" />
    <circle cx="36" cy="14" r="2" fill="#FEF08A" />
    <circle cx="12" cy="18" r="2.5" fill="#FEF08A" />
    <defs>
      <linearGradient id="practiceGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF3C7" />
        <stop offset="1" stopColor="#FDE68A" />
      </linearGradient>
    </defs>
  </svg>
);

export const ChibiFreePlay3dIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="url(#freeGrad)" />
    {/* Magic Wand + Colorful Music Sparkles */}
    <path d="M13 35L33 15" stroke="#9333EA" strokeWidth="4" strokeLinecap="round" />
    <path d="M29 19L33 15L31 13" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
    <polygon points="34,7 36,12 41,14 36,16 34,21 32,16 27,14 32,12" fill="#FBBF24" />
    <circle cx="16" cy="15" r="3" fill="#EC4899" />
    <circle cx="21" cy="9" r="2" fill="#3B82F6" />
    <circle cx="37" cy="28" r="2.5" fill="#10B981" />
    <defs>
      <linearGradient id="freeGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F3E8FF" />
        <stop offset="1" stopColor="#E9D5FF" />
      </linearGradient>
    </defs>
  </svg>
);

export const ChibiDrum3dIcon: React.FC<{ className?: string; isPlaying?: boolean }> = ({
  className = 'w-6 h-6',
  isPlaying = false,
}) => (
  <svg
    viewBox="0 0 48 48"
    className={`${className} ${isPlaying ? 'scale-110' : ''} transition-transform`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Drum body */}
    <ellipse cx="24" cy="18" rx="16" ry="7" fill="#F87171" stroke="#B91C1C" strokeWidth="2" />
    <path d="M8 18V28C8 32 15 36 24 36C33 36 40 32 40 28V18" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
    <ellipse cx="24" cy="18" rx="13" ry="5" fill="#FEF2F2" />
    {/* Zigzag cords */}
    <path d="M11 20L17 34L23 21L30 35L37 20" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    {/* Drumsticks */}
    <line x1="8" y1="8" x2="20" y2="16" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="8" cy="8" r="2.5" fill="#F59E0B" />
    <line x1="40" y1="8" x2="28" y2="16" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="40" cy="8" r="2.5" fill="#F59E0B" />
  </svg>
);

export const ChibiBell3dIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 4C11.5 4 8 7.5 8 12V19L5 23H27L24 19V12C24 7.5 20.5 4 16 4Z"
      fill="url(#bellGrad)"
      stroke="#B45309"
      strokeWidth="1.5"
    />
    <circle cx="16" cy="25" r="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    <circle cx="16" cy="4" r="2" fill="#FDE047" />
    <defs>
      <linearGradient id="bellGrad" x1="8" y1="4" x2="24" y2="23" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
  </svg>
);

export const ChibiCat3dIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="18" rx="11" ry="9" fill="#FB923C" stroke="#C2410C" strokeWidth="1.5" />
    {/* Cat ears */}
    <polygon points="6,13 8,4 13,11" fill="#EA580C" stroke="#C2410C" strokeWidth="1" />
    <polygon points="26,13 24,4 19,11" fill="#EA580C" stroke="#C2410C" strokeWidth="1" />
    <polygon points="8,11 9,6 12,10" fill="#FBCFE8" />
    <polygon points="24,11 23,6 20,10" fill="#FBCFE8" />
    {/* Eyes & nose */}
    <circle cx="12" cy="16" r="1.5" fill="#1E293B" />
    <circle cx="20" cy="16" r="1.5" fill="#1E293B" />
    <polygon points="16,19 14.5,17.5 17.5,17.5" fill="#EC4899" />
    {/* Cute mouth */}
    <path d="M14 20C14.5 21.5 15.5 21.5 16 20C16.5 21.5 17.5 21.5 18 20" stroke="#1E293B" strokeWidth="1" />
  </svg>
);

// 4 Distinct Timbre Instruments
const INSTRUMENT_OPTIONS: {
  id: MusicalInstrumentType;
  nameVi: string;
  nameEn: string;
  renderIcon: () => React.ReactNode;
}[] = [
  {
    id: 'piano',
    nameVi: 'Dương Cầm',
    nameEn: 'Grand Piano',
    renderIcon: () => <ChibiPiano3dIcon className="w-5 h-5" />,
  },
  {
    id: 'xylophone',
    nameVi: 'Mộc Cầm',
    nameEn: 'Xylophone',
    renderIcon: () => <ChibiXylophone3dIcon className="w-5 h-5" />,
  },
  {
    id: 'bells',
    nameVi: 'Chuông Tiên',
    nameEn: 'Magic Bell',
    renderIcon: () => <ChibiBell3dIcon className="w-5 h-5" />,
  },
  {
    id: 'cat',
    nameVi: 'Mèo Meo',
    nameEn: 'Cute Kitten',
    renderIcon: () => <ChibiCat3dIcon className="w-5 h-5" />,
  },
];

// ============================================================================
// RAINBOW XYLOPHONE GAME COMPONENT PROPS
// ============================================================================

interface RainbowXylophoneGameProps {
  settings: ParentSettings;
  onBack: () => void;
  onWin: (titleVi: string, titleEn: string) => void;
}

export const RainbowXylophoneGame: React.FC<RainbowXylophoneGameProps> = ({
  settings,
  onBack,
  onWin,
}) => {
  // Instrument type view: Piano or Rainbow Xylophone
  const [instrumentView, setInstrumentView] = useState<'xylophone' | 'piano'>('xylophone');
  // Play mode: Guided (Tập theo bài) or Free (Chơi tự do)
  const [playMode, setPlayMode] = useState<'guided' | 'free'>('guided');
  // Sound timbre: Piano, Xylophone, Bells, Cat
  const [musicalInstrument, setMusicalInstrument] = useState<MusicalInstrumentType>('xylophone');
  // Timbre picker modal state (Popup Modal 3D Chibi)
  const [showTimbreModal, setShowTimbreModal] = useState(false);
  // Rhythm drum beat
  const [isRhythmPlaying, setIsRhythmPlaying] = useState(false);
  // Song selection
  const [selectedSongId, setSelectedSongId] = useState<string>('butterfly');
  const [songStepIdx, setSongStepIdx] = useState<number>(0);
  // Auto demo play
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  // Key press highlights
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [activeBlackKeyId, setActiveBlackKeyId] = useState<string | null>(null);
  const [lastPlayedNoteName, setLastPlayedNoteName] = useState<string>('');
  // Free play stats
  const [freeNoteCount, setFreeNoteCount] = useState<number>(0);
  // 16 songs picker modal
  const [showSongPickerModal, setShowSongPickerModal] = useState<boolean>(false);
  const [songCategoryFilter, setSongCategoryFilter] = useState<'all' | 'vietnam' | 'international' | 'folk_animals'>('all');

  // Timers and intervals refs
  const demoTimerRef = useRef<number | null>(null);
  const drumIntervalRef = useRef<number | null>(null);

  // Active song resolution
  const activeSong: RainbowSongItem =
    RAINBOW_SONGS.find((s) => s.id === selectedSongId) || RAINBOW_SONGS[0];
  const targetNote = activeSong.notes[songStepIdx % activeSong.notes.length];
  const targetKeyIdx = targetNote?.keyIdx ?? 0;
  const targetKey = XYLOPHONE_KEYS[targetKeyIdx] || XYLOPHONE_KEYS[0];

  // Stop demo helper
  const stopDemo = useCallback(() => {
    setIsDemoPlaying(false);
    if (demoTimerRef.current) {
      window.clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (demoTimerRef.current) window.clearTimeout(demoTimerRef.current);
      if (drumIntervalRef.current) window.clearInterval(drumIntervalRef.current);
    };
  }, []);

  // Rhythm drum beat player
  useEffect(() => {
    if (!isRhythmPlaying) {
      if (drumIntervalRef.current) {
        window.clearInterval(drumIntervalRef.current);
        drumIntervalRef.current = null;
      }
      return;
    }

    const bpm = activeSong.bpm || 108;
    const beatMs = Math.round(60000 / bpm);
    let beat = 0;

    drumIntervalRef.current = window.setInterval(() => {
      const step = beat % 4;
      if (step === 0) playRhythmDrumHit('kick', settings.volume * 0.45);
      else if (step === 1) playRhythmDrumHit('hihat', settings.volume * 0.22);
      else if (step === 2) playRhythmDrumHit('snare', settings.volume * 0.38);
      else if (step === 3) playRhythmDrumHit('woodblock', settings.volume * 0.3);
      beat += 1;
    }, beatMs);

    return () => {
      if (drumIntervalRef.current) {
        window.clearInterval(drumIntervalRef.current);
        drumIntervalRef.current = null;
      }
    };
  }, [isRhythmPlaying, activeSong.bpm, settings.volume]);

  // Toggle Auto Demo Playing
  const handleToggleDemo = () => {
    if (isDemoPlaying) {
      stopDemo();
    } else {
      stopDemo();
      setIsDemoPlaying(true);
      let step = 0;
      const notesList = activeSong.notes;
      const bpm = activeSong.bpm || 104;

      const playNextStep = () => {
        if (step >= notesList.length) {
          setIsDemoPlaying(false);
          setActiveNoteIdx(null);
          return;
        }

        const noteItem = notesList[step];
        const targetK = XYLOPHONE_KEYS[noteItem.keyIdx];
        const beats = noteItem.beats ?? 1;
        const noteDurationMs = Math.max(220, Math.round((beats * 60000) / bpm));

        setActiveNoteIdx(noteItem.keyIdx);
        setLastPlayedNoteName(targetK.solfegeVi);
        setSongStepIdx(step);

        playMusicalInstrumentNote(targetK.freq, musicalInstrument, settings.volume);

        // Turn off key highlight slightly before next note
        window.setTimeout(() => {
          setActiveNoteIdx(null);
        }, Math.min(noteDurationMs - 40, 360));

        step += 1;
        demoTimerRef.current = window.setTimeout(playNextStep, noteDurationMs);
      };

      playNextStep();
    }
  };

  // Handle Child Pressing White Key (C4..C5)
  const handleKeyPress = (idx: number, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isDemoPlaying) {
      stopDemo();
    }

    const k = XYLOPHONE_KEYS[idx];
    playMusicalInstrumentNote(k.freq, musicalInstrument, settings.volume);
    setActiveNoteIdx(idx);
    setLastPlayedNoteName(k.solfegeVi);
    window.setTimeout(() => setActiveNoteIdx(null), 240);

    if (playMode === 'free') {
      setFreeNoteCount((c) => c + 1);
      return;
    }

    // Guided Mode: Check if matches target note
    if (idx === targetKeyIdx) {
      const nextStep = songStepIdx + 1;
      if (nextStep >= activeSong.notes.length) {
        setSongStepIdx(0);
        fireStarExplosion(0.5, 0.5);
        fireFireworksCelebration();
        playCelebrationChime(settings.volume);
        onWin(activeSong.titleVi, activeSong.titleEn);
      } else {
        setSongStepIdx(nextStep);
      }
    }
  };

  // Handle Child Pressing Black Piano Key
  const handleBlackKeyPress = (blackKey: PianoBlackKeyItem, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isDemoPlaying) {
      stopDemo();
    }

    playMusicalInstrumentNote(blackKey.freq, musicalInstrument, settings.volume);
    setActiveBlackKeyId(blackKey.id);
    setLastPlayedNoteName(blackKey.nameVi);
    window.setTimeout(() => setActiveBlackKeyId(null), 240);

    if (playMode === 'free') {
      setFreeNoteCount((c) => c + 1);
    }
  };

  // Navigate songs
  const currentSongIdx = RAINBOW_SONGS.findIndex((s) => s.id === activeSong.id);
  const handlePrevSong = () => {
    stopDemo();
    const prevIdx = (currentSongIdx - 1 + RAINBOW_SONGS.length) % RAINBOW_SONGS.length;
    setSelectedSongId(RAINBOW_SONGS[prevIdx].id);
    setSongStepIdx(0);
  };

  const handleNextSong = () => {
    stopDemo();
    const nextIdx = (currentSongIdx + 1) % RAINBOW_SONGS.length;
    setSelectedSongId(RAINBOW_SONGS[nextIdx].id);
    setSongStepIdx(0);
  };

  // Teacher Voice Guide Audio
  const handleTeacherVoiceGuide = () => {
    speakTeacherVoice(
      [
        {
          lang: 'vi',
          text:
            playMode === 'guided'
              ? `Bé hãy nhìn phím đàn có ngôi sao lấp lánh và gõ theo bài hát ${activeSong.titleVi} nhé!`
              : 'Bé thỏa sức gõ các phím đàn để sáng tác bài ca vui tươi của riêng mình nhé!',
        },
        {
          lang: 'en',
          text:
            playMode === 'guided'
              ? `Let us play ${activeSong.titleEn}!`
              : 'Free musical play!',
        },
      ],
      settings
    );
  };

  const activeTimbre =
    INSTRUMENT_OPTIONS.find((t) => t.id === musicalInstrument) || INSTRUMENT_OPTIONS[1];

  const filteredSongs = RAINBOW_SONGS.filter((s) => {
    if (songCategoryFilter === 'all') return true;
    return s.category === songCategoryFilter;
  });

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col justify-between items-center bg-gradient-to-b from-amber-50/50 via-sky-50/20 to-purple-50/40 p-1 sm:p-2.5 select-none overflow-hidden font-sans">
      {/* ========================================================================= */}
      {/* HÀNG 1: TOP BAR (CAO <= 56PX): QUAY LẠI SÂN CHƠI, TÊN TRÒ NGẮN, NÚT LOA */}
      {/* ========================================================================= */}
      <div className="w-full max-w-4xl h-11 sm:h-12 shrink-0 rounded-2xl border-2 border-amber-300 bg-white/95 backdrop-blur-md px-2.5 shadow-2xs flex items-center justify-between gap-2">
        {/* Nút quay lại "Sân chơi" */}
        <button
          type="button"
          onClick={() => {
            stopDemo();
            onBack();
          }}
          className="min-h-[40px] px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-2xs"
          title="Trở về sân chơi"
          aria-label="Sân chơi"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.8]" />
          <span>Sân chơi</span>
        </button>

        {/* Tên trò ngắn */}
        <div className="flex items-center gap-1.5 min-w-0">
          <ChibiXylophone3dIcon className="w-6 h-6 shrink-0" />
          <h2 className="text-xs sm:text-base font-black text-slate-800 tracking-tight truncate font-display">
            Đàn Cầu Vồng Vui Nhộn
          </h2>
        </div>

        {/* Nút loa: Nghe cô giáo hướng dẫn */}
        <button
          type="button"
          onClick={handleTeacherVoiceGuide}
          className="w-10 h-10 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs shrink-0"
          title="Cô giáo hướng dẫn âm thanh"
          aria-label="Hướng dẫn âm thanh"
        >
          <Volume2 className="w-5 h-5 stroke-[2.4]" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* HÀNG 2: ĐIỀU KHIỂN (CÁC NÚT >= 48PX): ĐỔI ĐÀN, ĐỔI CHẾ ĐỘ, ÂM SẮC, TRỐNG */}
      {/* ========================================================================= */}
      <div className="w-full max-w-4xl min-h-[50px] shrink-0 rounded-2xl bg-white border border-amber-200/90 px-2 py-1 shadow-2xs flex items-center justify-between gap-1.5 overflow-x-auto">
        {/* 1. MỘT Nút chuyển đổi loại đàn: Piano ⇄ Cầu Vồng (>= 48px) */}
        <button
          type="button"
          onClick={() => {
            const nextView = instrumentView === 'piano' ? 'xylophone' : 'piano';
            setInstrumentView(nextView);
            setMusicalInstrument(nextView);
            playMusicalInstrumentNote(440, nextView, settings.volume * 0.8);
          }}
          className={`min-h-[48px] px-2.5 sm:px-3.5 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1.5 border shadow-2xs active:scale-95 shrink-0 ${
            instrumentView === 'piano'
              ? 'bg-slate-900 text-amber-300 border-amber-400 ring-2 ring-amber-300'
              : 'bg-gradient-to-r from-red-500 via-amber-500 to-indigo-500 text-white border-amber-300 ring-2 ring-amber-300'
          }`}
          title="Bấm để đổi loại đàn (Piano ⇄ Cầu Vồng)"
          aria-label="Chuyển đổi loại đàn"
        >
          {instrumentView === 'piano' ? (
            <ChibiPiano3dIcon className="w-6 h-6 shrink-0" />
          ) : (
            <ChibiXylophone3dIcon className="w-6 h-6 shrink-0" />
          )}
          <div className="text-left leading-tight hidden xs:block">
            <div className="text-[10px] opacity-80 uppercase tracking-wider">Đàn</div>
            <div className="text-xs font-black">
              {instrumentView === 'piano' ? 'Piano Cổ Điển' : 'Gõ Cầu Vồng'}
            </div>
          </div>
        </button>

        {/* 2. MỘT Nút chuyển chế độ: Tập theo bài ⇄ Chơi tự do (>= 48px) */}
        <button
          type="button"
          onClick={() => {
            stopDemo();
            setPlayMode((m) => (m === 'guided' ? 'free' : 'guided'));
          }}
          className={`min-h-[48px] px-2.5 sm:px-3.5 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1.5 border shadow-2xs active:scale-95 shrink-0 ${
            playMode === 'guided'
              ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300'
              : 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-300'
          }`}
          title="Bấm để đổi chế độ (Tập theo bài ⇄ Chơi tự do)"
          aria-label="Chuyển chế độ chơi"
        >
          {playMode === 'guided' ? (
            <ChibiPractice3dIcon className="w-6 h-6 shrink-0" />
          ) : (
            <ChibiFreePlay3dIcon className="w-6 h-6 shrink-0" />
          )}
          <div className="text-left leading-tight hidden xs:block">
            <div className="text-[10px] opacity-80 uppercase tracking-wider">Chế độ</div>
            <div className="text-xs font-black">
              {playMode === 'guided' ? 'Tập Theo Bài' : 'Chơi Tự Do'}
            </div>
          </div>
        </button>

        {/* 3. MỘT Nút chọn Âm sắc dạng nút mở Modal 3D Chibi (>= 48px) */}
        <button
          type="button"
          onClick={() => setShowTimbreModal(true)}
          className="min-h-[48px] px-2.5 sm:px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border-2 border-indigo-200 text-indigo-950 text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-2xs transition active:scale-95 shrink-0"
          title="Bấm để chọn âm sắc nhạc cụ"
          aria-label="Chọn âm sắc"
        >
          {activeTimbre.renderIcon()}
          <div className="text-left leading-tight hidden xs:block">
            <div className="text-[9px] text-indigo-500 uppercase tracking-wider">Âm sắc</div>
            <div className="text-xs font-black text-indigo-900">{activeTimbre.nameVi}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-indigo-600 ml-0.5" />
        </button>

        {/* 4. Nút Bật nhịp trống vui dạng biểu tượng bật/tắt (>= 48px) */}
        <button
          type="button"
          onClick={() => setIsRhythmPlaying((v) => !v)}
          className={`min-h-[48px] px-2.5 sm:px-3 rounded-xl text-xs font-black cursor-pointer border shadow-2xs transition active:scale-95 flex items-center gap-1.5 shrink-0 ${
            isRhythmPlaying
              ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 animate-pulse'
              : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-200'
          }`}
          title="Bật/Tắt nhịp trống vui nhộn"
          aria-label="Nhịp trống"
        >
          <ChibiDrum3dIcon className="w-6 h-6 shrink-0" isPlaying={isRhythmPlaying} />
          <div className="text-left leading-tight hidden xs:block">
            <div className="text-[10px] opacity-80 uppercase tracking-wider">Trống</div>
            <div className="text-xs font-black">
              {isRhythmPlaying ? 'Đang Bật' : 'Bật Nhịp'}
            </div>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* HÀNG 3: BÀI HÁT (CHỈ KHI Ở CHẾ ĐỘ TẬP THEO BÀI) */}
      {/* ========================================================================= */}
      {playMode === 'guided' && (
        <div className="w-full max-w-4xl min-h-[42px] shrink-0 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-white to-pink-50/90 border border-indigo-200/90 px-2 sm:px-3 py-1 shadow-2xs flex items-center justify-between gap-1.5">
          {/* Cụm chuyển bài Trước / Kế tiếp & Tên bài */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={handlePrevSong}
                className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-indigo-50 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-90"
                title="Bài trước"
                aria-label="Bài trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextSong}
                className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-indigo-50 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-90"
                title="Bài kế tiếp"
                aria-label="Bài kế tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-base sm:text-lg shrink-0">{activeSong.emoji}</span>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black text-indigo-950 truncate leading-tight">
                  {activeSong.titleVi}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 truncate leading-none">
                  {activeSong.titleEn}
                </div>
              </div>
            </div>
          </div>

          {/* Cụm nút: Kho 16 bài & Nghe mẫu nổi bật */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Kho 16 bài button */}
            <button
              type="button"
              onClick={() => setShowSongPickerModal(true)}
              className="min-h-[38px] px-2.5 sm:px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs transition active:scale-95"
              title="Mở danh sách 16 bài hát"
            >
              <Music className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden xs:inline">Kho 16 bài</span>
              <span className="xs:hidden">16 bài</span>
            </button>

            {/* Nút Nghe mẫu nổi bật */}
            <button
              type="button"
              onClick={handleToggleDemo}
              className={`min-h-[38px] px-3 sm:px-3.5 rounded-xl text-xs font-black cursor-pointer border transition shadow-xs flex items-center gap-1.5 active:scale-95 ${
                isDemoPlaying
                  ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300'
              }`}
              title="Phát giai điệu mẫu"
            >
              {isDemoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Dừng Nghe</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Nghe Mẫu</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HÀNG 4: KARAOKE VÀ "PHÍM TIẾP THEO" GỌN TRONG MỘT THẺ, CAO <= 110PX */}
      {/* ========================================================================= */}
      <div className="w-full max-w-4xl h-[78px] sm:h-[86px] max-h-[110px] shrink-0 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 border-2 border-amber-200/90 px-3 py-1.5 shadow-2xs flex flex-col justify-between overflow-hidden">
        {playMode === 'guided' ? (
          <>
            {/* Dòng 1: Lời bài hát Karaoke chạy theo nhịp */}
            <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-black uppercase text-amber-800 shrink-0">
                Lời hát:
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {activeSong.notes
                  .slice(
                    Math.max(0, songStepIdx - 2),
                    Math.min(activeSong.notes.length, songStepIdx + 6)
                  )
                  .map((n, i) => {
                    const actualIdx = Math.max(0, songStepIdx - 2) + i;
                    const isCurrent = actualIdx === songStepIdx;
                    return (
                      <span
                        key={actualIdx}
                        className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-950 shadow-xs scale-105 ring-2 ring-amber-500'
                            : actualIdx < songStepIdx
                            ? 'text-slate-400 line-through'
                            : 'text-slate-700 bg-white/80'
                        }`}
                      >
                        {n.syllableVi}
                      </span>
                    );
                  })}
              </div>
            </div>

            {/* Dòng 2: Phím tiếp theo và tiến độ nốt */}
            <div className="w-full flex items-center justify-between border-t border-amber-100 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-slate-700">
                  Phím tiếp theo:
                </span>
                <span
                  style={{ backgroundColor: targetKey.bgHex }}
                  className="px-2.5 py-0.5 rounded-md text-white text-xs font-black shadow-2xs"
                >
                  {targetKey.solfegeVi} ({targetKey.note.replace('4', '').replace('5', '')}) ⭐
                </span>
              </div>
              <div className="text-[11px] font-black text-amber-800">
                Nốt: {songStepIdx + 1}/{activeSong.notes.length}
              </div>
            </div>
          </>
        ) : (
          /* Chế độ Chơi tự do: Thẻ hiển thị số nốt đã gõ */
          <div className="w-full h-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChibiFreePlay3dIcon className="w-8 h-8 shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-black text-purple-950">
                  Sân Khấu Âm Nhạc Tự Do
                </div>
                <div className="text-[11px] font-semibold text-purple-800">
                  Bé tự do gõ mọi nốt đàn {instrumentView === 'piano' ? 'Piano' : 'Cầu Vồng'}!
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-white px-3 py-1 rounded-xl border border-purple-200 text-purple-900 shadow-2xs">
                🎵 Đã gõ: <strong className="text-purple-600">{freeNoteCount}</strong> nốt
              </span>
              {freeNoteCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFreeNoteCount(0);
                    setLastPlayedNoteName('');
                  }}
                  className="p-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 cursor-pointer"
                  title="Đặt lại số nốt"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* HÀNG 5: BÀN PHÍM ĐÀN (CHIẾM >= 45% CHIỀU CAO MÀN HÌNH) */}
      {/* ========================================================================= */}
      <div className="w-full max-w-4xl flex-1 min-h-[45%] flex flex-col justify-center items-center py-1">
        {instrumentView === 'piano' ? (
          /* ===================================================================== */
          /* 🎹 ĐÀN GRAND PIANO: 8 PHÍM TRẮNG RỘNG + 5 PHÍM ĐEN NỔI */
          /* ===================================================================== */
          <div className="w-full h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 p-2 sm:p-3 rounded-3xl border-4 border-slate-700 shadow-2xl relative overflow-hidden">
            {/* Piano Gold Nameplate */}
            <div className="w-full flex items-center justify-between px-3 py-1 mb-1.5 rounded-xl bg-slate-950/80 border border-amber-500/40 text-amber-300 shrink-0">
              <div className="flex items-center gap-1.5">
                <ChibiPiano3dIcon className="w-4 h-4" />
                <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase font-display">
                  Grand Piano · Dương Cầm
                </span>
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-amber-200">
                {lastPlayedNoteName ? `Nốt: ${lastPlayedNoteName}` : 'Chạm phím đàn'}
              </div>
            </div>

            {/* Keys Container */}
            <div className="relative w-full flex-1 rounded-2xl overflow-hidden shadow-inner bg-slate-950 p-1">
              {/* 8 White Ivory Keys */}
              <div className="grid grid-cols-8 gap-1 h-full w-full">
                {XYLOPHONE_KEYS.map((k, idx) => {
                  const isGuidedNext = playMode === 'guided' && idx === targetKeyIdx;
                  const isPressed = activeNoteIdx === idx;

                  return (
                    <button
                      key={`piano-white-${k.note}`}
                      type="button"
                      onPointerDown={(e) => handleKeyPress(idx, e)}
                      className={`w-full h-full rounded-b-2xl border-x border-b-6 flex flex-col justify-end pb-3 sm:pb-4 items-center transition-all cursor-pointer select-none relative touch-manipulation ${
                        isPressed
                          ? 'bg-amber-200 border-b-2 border-slate-400 translate-y-1 shadow-inner'
                          : 'bg-gradient-to-b from-[#FFFDF7] via-[#FCF9F2] to-[#F1E9DA] border-slate-300 hover:bg-slate-50 shadow-md active:translate-y-1 active:border-b-2'
                      } ${
                        isGuidedNext
                          ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900'
                          : ''
                      }`}
                    >
                      {/* Guided Star Guide */}
                      {isGuidedNext && (
                        <div className="absolute top-20 sm:top-28 flex flex-col items-center pointer-events-none">
                          <span className="text-xl sm:text-2xl animate-bounce filter drop-shadow">
                            ⭐
                          </span>
                        </div>
                      )}

                      {/* Note Solfege & Letter */}
                      <div className="text-center z-10 pointer-events-none">
                        <div
                          className={`text-sm sm:text-lg font-black leading-none ${
                            isGuidedNext ? 'text-amber-700' : 'text-slate-800'
                          }`}
                        >
                          {k.solfegeVi}
                        </div>
                        <div className="text-[10px] sm:text-xs font-extrabold text-slate-500 mt-0.5">
                          {k.note.replace('4', '').replace('5', '')}
                        </div>
                      </div>

                      {/* White Key Bottom Color Accent */}
                      <div
                        className="w-3/4 h-1 rounded-full mt-1.5 opacity-80"
                        style={{ backgroundColor: k.bgHex }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* 5 Elevated Ebony Black Keys */}
              <div className="absolute top-1 left-1 right-1 h-32 sm:h-44 pointer-events-none">
                {PIANO_BLACK_KEYS.map((bk) => {
                  const isPressed = activeBlackKeyId === bk.id;
                  return (
                    <button
                      key={bk.id}
                      type="button"
                      onPointerDown={(e) => handleBlackKeyPress(bk, e)}
                      style={{
                        left: `${bk.leftPct}%`,
                        width: '9.2%',
                      }}
                      className={`absolute top-0 h-full rounded-b-xl border-x-2 border-b-6 border-slate-950 flex flex-col justify-end pb-2 items-center pointer-events-auto transition-all cursor-pointer shadow-2xl touch-manipulation ${
                        isPressed
                          ? 'bg-slate-700 border-b-2 translate-y-1 brightness-150'
                          : 'bg-gradient-to-b from-[#2A2B2F] via-[#1A1B1E] to-[#0A0A0C] hover:brightness-125 active:translate-y-1 active:border-b-2'
                      }`}
                    >
                      <span className="text-[9px] sm:text-[11px] font-black text-amber-200/90 leading-none">
                        {bk.nameVi}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 mt-0.5">
                        {bk.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ===================================================================== */
          /* 🌈 ĐÀN GÕ CẦU VỒNG: 8 THANH MÀU RỰC RỠ VỚI ĐINH TÁN BẠC */
          /* ===================================================================== */
          <div className="w-full h-full grid grid-cols-8 gap-1 sm:gap-2 items-end p-2 sm:p-3 bg-gradient-to-b from-amber-50 to-orange-50/70 rounded-3xl border-4 border-amber-300 shadow-md">
            {XYLOPHONE_KEYS.map((k, idx) => {
              const isGuidedNext = playMode === 'guided' && idx === targetKeyIdx;
              const isPressed = activeNoteIdx === idx;

              return (
                <button
                  key={k.note}
                  type="button"
                  onPointerDown={(e) => handleKeyPress(idx, e)}
                  style={{
                    backgroundColor: k.bgHex,
                    borderColor: k.borderHex,
                    height: `${k.heightPct}%`,
                  }}
                  className={`w-full rounded-2xl border-b-4 text-white flex flex-col items-center justify-between py-2 px-0.5 sm:px-1 transition-all cursor-pointer select-none shadow-sm relative touch-manipulation ${
                    isPressed
                      ? 'scale-95 brightness-125 shadow-inner'
                      : 'hover:scale-[1.02] active:scale-95'
                  } ${
                    isGuidedNext
                      ? 'ring-4 ring-amber-300 ring-offset-2 animate-pulse scale-[1.02]'
                      : ''
                  }`}
                >
                  {/* Top Silver Mallet Peg */}
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/70 shadow-inner block" />

                  {/* Guided Star or Note Solfege */}
                  <div className="my-auto flex flex-col items-center justify-center pointer-events-none">
                    {isGuidedNext ? (
                      <span className="text-xl sm:text-2xl animate-bounce filter drop-shadow">
                        ⭐
                      </span>
                    ) : (
                      <span className="text-xs sm:text-sm opacity-50">⚪</span>
                    )}

                    <div className="text-center mt-1">
                      <div className="text-sm sm:text-lg font-black leading-none drop-shadow-sm">
                        {k.solfegeVi}
                      </div>
                      <div className="text-[10px] sm:text-xs font-extrabold opacity-90 mt-0.5">
                        {k.note.replace('4', '').replace('5', '')}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Silver Mallet Peg */}
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/70 shadow-inner block" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: KHO 16 BÀI HÁT THIẾU NHI */}
      {/* ========================================================================= */}
      {showSongPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-6 h-6 text-amber-600" />
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
                    Kho 16 Bài Hát Thiếu Nhi
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">
                    Chọn bài hát bé yêu thích để gõ phím hoặc nghe mẫu nhé!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSongPickerModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-black flex items-center justify-center cursor-pointer shadow-2xs"
              >
                ✕
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex flex-wrap gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setSongCategoryFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition ${
                  songCategoryFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50'
                }`}
              >
                Tất Cả ({RAINBOW_SONGS.length})
              </button>
              <button
                type="button"
                onClick={() => setSongCategoryFilter('vietnam')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition ${
                  songCategoryFilter === 'vietnam'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50'
                }`}
              >
                Việt Nam 🇻🇳
              </button>
              <button
                type="button"
                onClick={() => setSongCategoryFilter('international')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition ${
                  songCategoryFilter === 'international'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50'
                }`}
              >
                Quốc Tế 🌍
              </button>
              <button
                type="button"
                onClick={() => setSongCategoryFilter('folk_animals')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition ${
                  songCategoryFilter === 'folk_animals'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50'
                }`}
              >
                Đồng Dao 🐥
              </button>
            </div>

            {/* Song Grid List */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[58vh]">
              {filteredSongs.map((song) => {
                const isSelected = song.id === selectedSongId;
                return (
                  <button
                    key={song.id}
                    type="button"
                    onClick={() => {
                      stopDemo();
                      setSelectedSongId(song.id);
                      setSongStepIdx(0);
                      setShowSongPickerModal(false);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-amber-200 hover:bg-amber-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl shrink-0">{song.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {song.titleVi}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold truncate">
                          {song.titleEn}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                            {song.badgeVi}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400">
                            {song.notes.length} nốt · {song.bpm} BPM
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-amber-600 stroke-[3] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP MODAL CHỌN ÂM SẮC 3D CHIBI (POPUP NỔI BẬT TO RÕ, KHÔNG BỊ TRÀN KẸT) */}
      {/* ========================================================================= */}
      {showTimbreModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl border-3 border-amber-300 shadow-2xl p-5 flex flex-col gap-4 relative animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎵</span>
                <h3 className="text-base font-black text-slate-800">Bé chọn tiếng đàn nhé!</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTimbreModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center cursor-pointer transition"
                aria-label="Đóng bảng chọn âm sắc"
              >
                ✕
              </button>
            </div>

            {/* Grid 4 Instrument Options */}
            <div className="grid grid-cols-2 gap-3">
              {INSTRUMENT_OPTIONS.map((item) => {
                const isSelected = musicalInstrument === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMusicalInstrument(item.id);
                      playMusicalInstrumentNote(440, item.id, settings.volume * 0.85);
                      setShowTimbreModal(false);
                    }}
                    className={`min-h-[80px] p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-300 text-amber-950 font-black'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="relative">
                      {item.renderIcon()}
                      {isSelected && (
                        <div className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-center leading-tight">{item.nameVi}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-center text-slate-400 font-medium">
              Chạm vào nhạc cụ bé thích để đổi âm thanh
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
