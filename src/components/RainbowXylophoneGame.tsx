import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Music,
  Check,
  ChevronDown,
  Star,
  X,
  Disc3,
  Sparkles,
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
// THEME DATA FOR COMMERCIAL RAINBOW XYLOPHONE
// ============================================================================

export const XYLOPHONE_THEME_DATA = [
  { note: 'C4', solfegeVi: 'Đô', letter: 'C', from: '#E4605B', to: '#C2403F', heightPct: 100, isDarkText: false },
  { note: 'D4', solfegeVi: 'Rê', letter: 'D', from: '#F7A552', to: '#E07A1F', heightPct: 95, isDarkText: true },
  { note: 'E4', solfegeVi: 'Mi', letter: 'E', from: '#F4CF58', to: '#D9A623', heightPct: 90, isDarkText: true },
  { note: 'F4', solfegeVi: 'Fa', letter: 'F', from: '#7FD686', to: '#4DB056', heightPct: 85, isDarkText: true },
  { note: 'G4', solfegeVi: 'Sol', letter: 'G', from: '#6EC0F2', to: '#3E96D4', heightPct: 80, isDarkText: true },
  { note: 'A4', solfegeVi: 'La', letter: 'A', from: '#6B6EEB', to: '#4244C4', heightPct: 75, isDarkText: false },
  { note: 'B4', solfegeVi: 'Si', letter: 'B', from: '#A065EB', to: '#7A35C8', heightPct: 70, isDarkText: false },
  { note: 'C5', solfegeVi: 'Đố', letter: 'C', from: '#E0568F', to: '#B72F72', heightPct: 66, isDarkText: false },
];

// ============================================================================
// UNIFIED VECTOR STROKE ICONS (Stroke 2px, 22px, commercial grade)
// ============================================================================

export const PianoSegmentIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M6 4v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4" />
    <path d="M14 4v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4" />
    <line x1="8" y1="13" x2="8" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="16" y1="13" x2="16" y2="20" />
  </svg>
);

export const ModeSegmentIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const TimbreSegmentIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

export const DrumSegmentIcon: React.FC<{ className?: string }> = ({
  className = 'w-[22px] h-[22px]',
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="7" rx="9" ry="3.5" />
    <path d="M3 7v9.5c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5V7" />
    <path d="M6 8.5l4 9" />
    <path d="M18 8.5l-4 9" />
  </svg>
);

export const ButterflyIcon: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 4v16" />
    <path d="M12 7c-2-3-7-3-7 2s4 5 7 6" />
    <path d="M12 7c2-3 7-3 7 2s-4 5-7 6" />
    <path d="M12 15c-2 2-5 2-5 0s3-3 5-2" />
    <path d="M12 15c2 2 5 2 5 0s-3-3-5-2" />
  </svg>
);

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
  const [gameVolume, setGameVolume] = useState<number>(() =>
    settings.volume !== undefined ? settings.volume : 0.8
  );
  const [isGameMuted, setIsGameMuted] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const currentVol = isGameMuted ? 0 : gameVolume;
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
  // Active segment in the 4-cell segmented control
  const [activeControlSegment, setActiveControlSegment] = useState<'instrument' | 'mode' | 'timbre' | 'drum'>('instrument');

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
      if (step === 0) playRhythmDrumHit('kick', currentVol * 0.45);
      else if (step === 1) playRhythmDrumHit('hihat', currentVol * 0.22);
      else if (step === 2) playRhythmDrumHit('snare', currentVol * 0.38);
      else if (step === 3) playRhythmDrumHit('woodblock', currentVol * 0.3);
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

        playMusicalInstrumentNote(targetK.freq, musicalInstrument, currentVol);

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
    playMusicalInstrumentNote(k.freq, musicalInstrument, currentVol);
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
        playCelebrationChime(currentVol);
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

    playMusicalInstrumentNote(blackKey.freq, musicalInstrument, currentVol);
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
      { ...settings, volume: currentVol }
    );
  };

  const activeTimbre =
    INSTRUMENT_OPTIONS.find((t) => t.id === musicalInstrument) || INSTRUMENT_OPTIONS[1];

  const filteredSongs = RAINBOW_SONGS.filter((s) => {
    if (songCategoryFilter === 'all') return true;
    return s.category === songCategoryFilter;
  });

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-start items-center bg-[#F8FAFC] p-[14px] pb-[max(14px,env(safe-area-inset-bottom))] select-none overflow-hidden font-sans gap-[10px]">
      {/* Custom Styles for Keyframe Animations & Prefers-Reduced-Motion */}
      <style>{`
        @keyframes rainbow-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-rainbow-breathe {
          animation: rainbow-breathe 1.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-rainbow-breathe {
            animation: none !important;
          }
        }
      `}</style>

      {/* ========================================================================= */}
      {/* 1. HEADER (CAO 52PX): Nút "Sân chơi" (nền #F1F5F9), tiêu đề, nút loa (#FFF8E6) */}
      {/* ========================================================================= */}
      <div className="w-full max-w-3xl h-[52px] shrink-0 rounded-[16px] border border-slate-200/90 bg-white px-3 shadow-2xs flex items-center justify-between gap-2">
        {/* Nút "Sân chơi" (nền #F1F5F9, cao 44px) */}
        <button
          type="button"
          onClick={() => {
            stopDemo();
            onBack();
          }}
          className="h-[44px] px-3.5 rounded-[12px] bg-[#F1F5F9] hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition active:scale-[0.97]"
          title="Trở về sân chơi"
          aria-label="Sân chơi"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Sân chơi</span>
        </button>

        {/* Tiêu đề giữa */}
        <div className="flex items-center gap-2 min-w-0">
          <PianoSegmentIcon className="w-5 h-5 text-amber-500 shrink-0 stroke-[2]" />
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
            Đàn Cầu Vồng Vui Nhộn
          </h2>
        </div>

        {/* Nút loa & Thanh tăng giảm âm lượng đàn */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowVolumeSlider((prev) => !prev)}
            className={`w-[44px] h-[44px] rounded-[12px] border flex items-center justify-center cursor-pointer transition active:scale-[0.97] shrink-0 ${
              isGameMuted || gameVolume === 0
                ? 'bg-amber-100 border-amber-300 text-amber-700 font-bold shadow-2xs'
                : 'bg-[#FFF8E6] hover:bg-amber-100/70 text-amber-800 border-[#FBE3A1]'
            }`}
            title={isGameMuted || gameVolume === 0 ? 'Bật âm thanh đàn' : 'Tùy chỉnh âm lượng đàn'}
            aria-label="Tùy chỉnh âm lượng đàn"
          >
            {isGameMuted || gameVolume === 0 ? (
              <VolumeX className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Volume2 className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>

          {/* Thanh kéo tăng giảm âm lượng khi bấm vào loa */}
          {showVolumeSlider && (
            <div className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-200/90 flex flex-col items-center gap-2 z-50 min-w-[155px] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700">
                <span>Âm lượng đàn</span>
                <span className="text-amber-600 font-black">
                  {isGameMuted ? '0%' : `${Math.round(gameVolume * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isGameMuted ? 0 : gameVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setGameVolume(val);
                  if (val === 0) {
                    setIsGameMuted(true);
                  } else {
                    if (isGameMuted) setIsGameMuted(false);
                  }
                }}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                aria-label="Thanh trượt âm lượng đàn"
              />
              <div className="flex items-center gap-1.5 w-full">
                <button
                  type="button"
                  onClick={() => setIsGameMuted((prev) => !prev)}
                  className="flex-1 text-center text-[10px] font-extrabold py-1 px-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                >
                  {isGameMuted ? 'Bật loa' : 'Tắt tiếng'}
                </button>
                <button
                  type="button"
                  onClick={handleTeacherVoiceGuide}
                  className="flex-1 text-center text-[10px] font-extrabold py-1 px-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition cursor-pointer"
                  title="Cô hướng dẫn"
                >
                  Hướng dẫn
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THANH NHẠC CỤ (SEGMENTED CONTROL NỀN #EEF2F7, CAO 52PX, 4 Ô BẰNG NHAU) */}
      {/* ========================================================================= */}
      <div className="w-full max-w-3xl h-[52px] shrink-0 rounded-[16px] bg-[#EEF2F7] p-1 border border-slate-200/80 shadow-2xs">
        <div className="grid grid-cols-4 gap-1.5 w-full h-full items-center">
          {/* Ô 1: Cầu vồng / Piano */}
          <button
            type="button"
            onClick={() => {
              setActiveControlSegment('instrument');
              const nextView = instrumentView === 'piano' ? 'xylophone' : 'piano';
              setInstrumentView(nextView);
              setMusicalInstrument(nextView);
              playMusicalInstrumentNote(440, nextView, currentVol * 0.8);
            }}
            className={`h-[44px] rounded-[12px] flex flex-col items-center justify-center transition active:scale-[0.97] cursor-pointer select-none px-1 ${
              activeControlSegment === 'instrument'
                ? 'bg-[#111827] text-white border-2 border-[#F5CF55] shadow-xs'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-slate-50 shadow-2xs'
            }`}
            title="Bấm để đổi loại đàn (Piano ⇄ Cầu Vồng)"
            aria-label="Chuyển đổi loại đàn"
          >
            <PianoSegmentIcon className="w-[22px] h-[22px] stroke-[2] shrink-0" />
            <span className="text-[11px] font-bold leading-none mt-0.5 truncate max-w-full">
              {instrumentView === 'piano' ? 'Piano' : 'Cầu vồng'}
            </span>
          </button>

          {/* Ô 2: Tập bài / Tự do */}
          <button
            type="button"
            onClick={() => {
              setActiveControlSegment('mode');
              stopDemo();
              setPlayMode((m) => (m === 'guided' ? 'free' : 'guided'));
            }}
            className={`h-[44px] rounded-[12px] flex flex-col items-center justify-center transition active:scale-[0.97] cursor-pointer select-none px-1 ${
              activeControlSegment === 'mode'
                ? 'bg-[#111827] text-white border-2 border-[#F5CF55] shadow-xs'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-slate-50 shadow-2xs'
            }`}
            title="Bấm để đổi chế độ (Tập theo bài ⇄ Chơi tự do)"
            aria-label="Chuyển chế độ chơi"
          >
            <ModeSegmentIcon className="w-[22px] h-[22px] stroke-[2] shrink-0" />
            <span className="text-[11px] font-bold leading-none mt-0.5 truncate max-w-full">
              {playMode === 'guided' ? 'Tập bài' : 'Tự do'}
            </span>
          </button>

          {/* Ô 3: Âm sắc */}
          <button
            type="button"
            onClick={() => {
              setActiveControlSegment('timbre');
              setShowTimbreModal(true);
            }}
            className={`h-[44px] rounded-[12px] flex flex-col items-center justify-center transition active:scale-[0.97] cursor-pointer select-none px-1 ${
              activeControlSegment === 'timbre'
                ? 'bg-[#111827] text-white border-2 border-[#F5CF55] shadow-xs'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-slate-50 shadow-2xs'
            }`}
            title="Bấm để chọn âm sắc nhạc cụ"
            aria-label="Chọn âm sắc"
          >
            <TimbreSegmentIcon className="w-[22px] h-[22px] stroke-[2] shrink-0" />
            <span className="text-[11px] font-bold leading-none mt-0.5 truncate max-w-full">
              {activeTimbre.nameVi}
            </span>
          </button>

          {/* Ô 4: Trống: Bật / Trống: Tắt */}
          <button
            type="button"
            onClick={() => {
              setActiveControlSegment('drum');
              setIsRhythmPlaying((v) => !v);
            }}
            className={`h-[44px] rounded-[12px] flex flex-col items-center justify-center transition active:scale-[0.97] cursor-pointer select-none px-1 ${
              activeControlSegment === 'drum'
                ? 'bg-[#111827] text-white border-2 border-[#F5CF55] shadow-xs'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-slate-50 shadow-2xs'
            }`}
            title="Bật/Tắt nhịp trống vui nhộn"
            aria-label="Nhịp trống"
          >
            <DrumSegmentIcon className="w-[22px] h-[22px] stroke-[2] shrink-0" />
            <span className="text-[11px] font-bold leading-none mt-0.5 truncate max-w-full">
              {isRhythmPlaying ? 'Trống: Bật' : 'Trống: Tắt'}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. THẺ BÀI HÁT (NỀN TRẮNG, VIỀN #E5E7EB, PADDING 8PX, 2 TẦNG) */}
      {/* ========================================================================= */}
      {playMode === 'guided' && (
        <div className="w-full max-w-3xl shrink-0 rounded-[16px] bg-white border border-[#E5E7EB] p-2 shadow-2xs flex flex-col gap-2">
          {/* Tầng trên: nút bài trước/sau (40x44px) hai bên, giữa là icon cánh bướm + tên bài (14px đậm) + dòng phụ Frère Jacques (11px xám) */}
          <div className="flex items-center justify-between gap-2 w-full">
            <button
              type="button"
              onClick={handlePrevSong}
              className="w-[40px] h-[44px] rounded-[12px] bg-[#F1F5F9] hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-[0.97] shrink-0"
              title="Bài trước"
              aria-label="Bài trước"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="flex flex-col items-center justify-center min-w-0 flex-1 text-center">
              <div className="flex items-center justify-center gap-1.5 min-w-0">
                <ButterflyIcon className="w-4 h-4 text-amber-500 shrink-0 stroke-[2]" />
                <span className="text-[14px] font-extrabold text-[#111827] truncate leading-tight">
                  {activeSong.titleVi}
                </span>
              </div>
              <div className="text-[11px] font-medium text-[#6B7280] truncate leading-tight mt-0.5">
                {activeSong.titleEn}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextSong}
              className="w-[40px] h-[44px] rounded-[12px] bg-[#F1F5F9] hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-[0.97] shrink-0"
              title="Bài kế tiếp"
              aria-label="Bài kế tiếp"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Tầng dưới: 2 nút lớn cao 46px chia đôi ngang */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {/* "Chọn bài" nền #EEF0FF, viền #4F46E5, chữ #3730A3, icon danh sách, kèm huy hiệu tròn số bài "16" */}
            <button
              type="button"
              onClick={() => setShowSongPickerModal(true)}
              className="h-[46px] rounded-[12px] bg-[#EEF0FF] hover:bg-indigo-100/70 border border-[#4F46E5] text-[#3730A3] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.97]"
              title="Mở danh sách bài hát"
            >
              <Disc3 className="w-4 h-4 stroke-[2]" />
              <span>Chọn bài</span>
              <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white text-[11px] font-black flex items-center justify-center leading-none">
                16
              </span>
            </button>

            {/* "Nghe mẫu" nền vàng #F5C84B, chữ #1F2937, icon phát */}
            <button
              type="button"
              onClick={handleToggleDemo}
              className={`h-[46px] rounded-[12px] font-black text-xs cursor-pointer transition shadow-2xs flex items-center justify-center gap-1.5 active:scale-[0.97] ${
                isDemoPlaying
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-[#F5C84B] hover:bg-amber-400 text-[#1F2937]'
              }`}
              title="Phát giai điệu mẫu"
            >
              {isDemoPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current stroke-[2]" />
                  <span>Dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current stroke-[2]" />
                  <span>Nghe mẫu</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LỜI HÁT + PHÍM TIẾP THEO (THẺ TRẮNG, VIỀN #E5E7EB, PADDING 8PX) */}
      {/* ========================================================================= */}
      <div className="w-full max-w-3xl shrink-0 rounded-[16px] bg-white border border-[#E5E7EB] p-2 shadow-2xs flex flex-col justify-between overflow-hidden">
        {playMode === 'guided' ? (
          <div className="flex flex-col gap-1.5 w-full">
            {/* Dòng 1: Lời bài hát Karaoke chạy theo nhịp */}
            <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">
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
                        className={`px-2 py-0.5 rounded-[8px] text-xs font-black transition-all ${
                          isCurrent
                            ? 'bg-[#F5CF55] text-slate-950 border border-[#E0A81F] shadow-xs scale-105'
                            : actualIdx < songStepIdx
                            ? 'text-slate-400 line-through'
                            : 'text-slate-700 bg-[#F1F5F9]'
                        }`}
                      >
                        {n.syllableVi}
                      </span>
                    );
                  })}
              </div>
            </div>

            {/* Dòng 2: Phím tiếp theo dạng pill đỏ #C2403F chữ trắng + ngôi sao, "Nốt: x/32" căn phải */}
            <div className="w-full flex items-center justify-between border-t border-slate-100 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-slate-700">
                  Phím tiếp theo:
                </span>
                <span className="bg-[#C2403F] text-white px-2.5 py-0.5 rounded-full text-xs font-black inline-flex items-center gap-1 shadow-xs">
                  <span>
                    {targetKey.solfegeVi} ({targetKey.note.replace('4', '').replace('5', '')})
                  </span>
                  <Star className="w-3 h-3 fill-white text-white" />
                </span>
              </div>
              <div className="text-[11px] font-black text-slate-500">
                Nốt: {songStepIdx + 1}/{activeSong.notes.length}
              </div>
            </div>
          </div>
        ) : (
          /* Chế độ Chơi tự do */
          <div className="w-full py-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 stroke-[2]" />
              <div>
                <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                  Sân Khấu Âm Nhạc Tự Do
                </div>
                <div className="text-[11px] font-medium text-slate-500 leading-tight">
                  Bé tự do gõ mọi nốt đàn {instrumentView === 'piano' ? 'Piano' : 'Cầu Vồng'}!
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-slate-100 px-3 py-1 rounded-[12px] text-slate-800 border border-slate-200">
                Đã gõ: <strong className="text-amber-600 font-black">{freeNoteCount}</strong> nốt
              </span>
              {freeNoteCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFreeNoteCount(0);
                    setLastPlayedNoteName('');
                  }}
                  className="p-1.5 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer active:scale-[0.97]"
                  title="Đặt lại số nốt"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. KHUNG ĐÀN (CHIẾM HẾT CHIỀU CAO CÒN LẠI VỚI FLEX: 1, KHÔNG CUỘN DỌC) */}
      {/* ========================================================================= */}
      <div className="w-full max-w-3xl flex-1 min-h-0 flex flex-col justify-center items-center">
        {instrumentView === 'piano' ? (
          /* ===================================================================== */
          /* 6. PIANO (KHUNG GRADIENT #1B2440 → #0E1424, BO 20PX, PADDING 12PX) */
          /* ===================================================================== */
          <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#1B2440] to-[#0E1424] rounded-[20px] p-3 border border-[#2A375E] shadow-2xl relative overflow-hidden">
            {/* Thanh tiêu đề "GRAND PIANO · DƯƠNG CẦM" cao 32px */}
            <div className="w-full h-[32px] shrink-0 flex items-center justify-between px-3 mb-2 rounded-[10px] bg-black/40 border border-[#F5CF55]/40 text-[#F5CF55]">
              <div className="flex items-center gap-1.5">
                <PianoSegmentIcon className="w-3.5 h-3.5 text-[#F5CF55] stroke-[2]" />
                <span className="text-[11px] font-black tracking-wider uppercase text-[#F5CF55]">
                  Grand Piano · Dương Cầm
                </span>
              </div>
              <div className="text-[11px] font-bold text-amber-200">
                {lastPlayedNoteName ? `Nốt: ${lastPlayedNoteName}` : 'Nốt: Đô'}
              </div>
            </div>

            {/* Vùng phím đàn: 8 phím trắng lấp đầy 100% chiều cao vùng phím */}
            <div className="relative w-full flex-1 min-h-0 rounded-b-[12px] overflow-hidden">
              {/* 8 Phím trắng */}
              <div className="grid grid-cols-8 gap-[2px] h-full w-full">
                {XYLOPHONE_KEYS.map((k, idx) => {
                  const isGuidedNext = playMode === 'guided' && idx === targetKeyIdx;
                  const isPressed = activeNoteIdx === idx;

                  return (
                    <button
                      key={`piano-white-${k.note}`}
                      type="button"
                      onPointerDown={(e) => handleKeyPress(idx, e)}
                      className={`w-full h-full rounded-b-[12px] border border-[#CBD2DC] bg-gradient-to-b from-[#FFFFFF] via-[#FAF7F0] to-[#EFEAD8] flex flex-col justify-end pb-3 items-center select-none relative touch-manipulation cursor-pointer transition-all duration-120 ease-out active:translate-y-[3px] active:brightness-110 active:shadow-xs ${
                        isPressed
                          ? 'brightness-110 shadow-inner'
                          : 'shadow-md hover:brightness-105'
                      } ${
                        isGuidedNext
                          ? 'ring-inset ring-3 ring-[#F5CF55] shadow-[inset_0_0_0_2px_#F5CF55] animate-pulse z-10'
                          : ''
                      }`}
                    >
                      {/* Ngôi sao chỉ dẫn phím tiếp theo (nằm trong phím, không tràn, không cắt viền) */}
                      {isGuidedNext && (
                        <div className="absolute top-10 flex flex-col items-center pointer-events-none">
                          <Star className="w-5 h-5 fill-[#F5CF55] text-amber-500 animate-bounce drop-shadow" />
                        </div>
                      )}

                      {/* Nhãn tên nốt + chữ cái căn đáy cách 12px */}
                      <div className="text-center z-10 pointer-events-none">
                        <div className="text-[14px] font-black text-slate-900 leading-none">
                          {k.solfegeVi}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                          {k.note.replace('4', '').replace('5', '')}
                        </div>
                      </div>

                      {/* Vạch màu cầu vồng 4px bo tròn ở đáy */}
                      <div
                        className="w-3/4 h-1 rounded-full mt-1.5 opacity-90"
                        style={{ backgroundColor: k.bgHex }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* 5 Phím đen: cao 60% phím trắng, rộng 60% phím trắng, đặt đúng giữa các phím trắng */}
              <div className="absolute top-0 left-0 right-0 h-[60%] pointer-events-none">
                {PIANO_BLACK_KEYS.map((bk) => {
                  const isPressed = activeBlackKeyId === bk.id;
                  return (
                    <button
                      key={bk.id}
                      type="button"
                      onPointerDown={(e) => handleBlackKeyPress(bk, e)}
                      style={{
                        left: `${bk.leftPct}%`,
                        width: '7.5%',
                      }}
                      className={`absolute top-0 h-full rounded-b-[8px] bg-gradient-to-b from-[#2E2E35] to-[#0B0B0D] border-l border-white/20 flex flex-col justify-end pb-1.5 items-center pointer-events-auto transition-all duration-120 ease-out cursor-pointer shadow-xl touch-manipulation active:translate-y-[3px] active:brightness-125 ${
                        isPressed
                          ? 'brightness-150'
                          : 'hover:brightness-110'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-amber-200/90 leading-none">
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
          /* 5. ĐÀN CẦU VỒNG (KHUNG NỀN GRADIENT #F3F6FB → #E9EEF6, BO 20PX) */
          /* ===================================================================== */
          <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-b from-[#F3F6FB] to-[#E9EEF6] border-2 border-[#DCE3EE] rounded-[20px] p-3 relative overflow-hidden shadow-sm">
            {/* Hai thanh gỗ ngang (gradient #E8D3A6 → #C9AD76, cao 10px) đặt tại 24% và 76% chiều cao khung */}
            <div
              className="absolute left-2 right-2 h-[10px] rounded-full bg-gradient-to-r from-[#E8D3A6] via-[#D8C08E] to-[#C9AD76] shadow-sm z-0 pointer-events-none"
              style={{ top: '24%' }}
            />
            <div
              className="absolute left-2 right-2 h-[10px] rounded-full bg-gradient-to-r from-[#E8D3A6] via-[#D8C08E] to-[#C9AD76] shadow-sm z-0 pointer-events-none"
              style={{ top: '76%' }}
            />

            {/* Phím chia đều chiều ngang, khoảng cách 6px, căn giữa dọc, cao dần từ 100% xuống 66% */}
            <div className="grid grid-cols-8 gap-[6px] w-full h-full relative z-10 items-center justify-items-center">
              {XYLOPHONE_THEME_DATA.map((theme, idx) => {
                const isGuidedNext = playMode === 'guided' && idx === targetKeyIdx;
                const isPressed = activeNoteIdx === idx;

                return (
                  <button
                    key={theme.note}
                    type="button"
                    onPointerDown={(e) => handleKeyPress(idx, e)}
                    style={{
                      height: `${theme.heightPct}%`,
                      background: `linear-gradient(to bottom, ${theme.from}, ${theme.to})`,
                      boxShadow: 'inset 0 1.5px 0 0 rgba(255, 255, 255, 0.55), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    className={`w-full min-w-[38px] sm:min-w-[44px] rounded-[14px] border-l border-white/20 flex flex-col items-center justify-center select-none relative touch-manipulation cursor-pointer transition-all duration-120 ease-out active:translate-y-[3px] active:brightness-110 ${
                      isPressed ? 'brightness-125' : 'hover:brightness-105'
                    } ${
                      isGuidedNext
                        ? 'ring-3 ring-[#FFD84A] ring-offset-2 ring-offset-transparent animate-rainbow-breathe z-20'
                        : ''
                    }`}
                  >
                    {/* 2 đinh ốc tròn 10px (gradient trắng-xám, inset shadow) trên 2 thanh gỗ */}
                    <div
                      className="absolute w-[10px] h-[10px] rounded-full bg-gradient-to-b from-[#F8FAFC] to-[#94A3B8] shadow-inner border border-slate-400/40 pointer-events-none"
                      style={{ top: '24%', transform: 'translateY(-50%)' }}
                    />
                    <div
                      className="absolute w-[10px] h-[10px] rounded-full bg-gradient-to-b from-[#F8FAFC] to-[#94A3B8] shadow-inner border border-slate-400/40 pointer-events-none"
                      style={{ top: '76%', transform: 'translateY(-50%)' }}
                    />

                    {/* Nhãn: tên nốt 15px đậm, ký hiệu C/D/E 11px dưới, căn giữa phím */}
                    <div className="flex flex-col items-center justify-center pointer-events-none text-center z-10">
                      {isGuidedNext && (
                        <Star className="w-5 h-5 fill-amber-300 text-amber-300 drop-shadow mb-1 animate-bounce" />
                      )}
                      <span
                        className={`text-[15px] font-black leading-none drop-shadow-xs ${
                          theme.isDarkText ? 'text-[#1F2937]' : 'text-white'
                        }`}
                      >
                        {theme.solfegeVi}
                      </span>
                      <span
                        className={`text-[11px] font-extrabold leading-none mt-1 opacity-90 ${
                          theme.isDarkText ? 'text-[#374151]' : 'text-white/90'
                        }`}
                      >
                        {theme.letter}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: KHO 16 BÀI HÁT THIẾU NHI */}
      {/* ========================================================================= */}
      {showSongPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Kho 16 Bài Hát Thiếu Nhi
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Chọn bài hát bé yêu thích để gõ phím hoặc nghe mẫu nhé!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSongPickerModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-black flex items-center justify-center cursor-pointer shadow-2xs active:scale-[0.97]"
                aria-label="Đóng"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-200/80 flex flex-wrap gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setSongCategoryFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition active:scale-[0.97] ${
                  songCategoryFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs border-2 border-[#F5CF55]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Tất Cả ({RAINBOW_SONGS.length})
              </button>
              <button
                type="button"
                onClick={() => setSongCategoryFilter('vietnam')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition active:scale-[0.97] ${
                  songCategoryFilter === 'vietnam'
                    ? 'bg-slate-900 text-white shadow-2xs border-2 border-[#F5CF55]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Việt Nam
              </button>
              <button
                type="button"
                onClick={() => setSongCategoryFilter('international')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition active:scale-[0.97] ${
                  songCategoryFilter === 'international'
                    ? 'bg-slate-900 text-white shadow-2xs border-2 border-[#F5CF55]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Quốc Tế
              </button>
              <button
                type="button"
                onClick={() => setSongCategoryFilter('folk_animals')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition active:scale-[0.97] ${
                  songCategoryFilter === 'folk_animals'
                    ? 'bg-slate-900 text-white shadow-2xs border-2 border-[#F5CF55]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Đồng Dao
              </button>
            </div>

            {/* Song Grid List */}
            <div className="p-3 sm:p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[58vh]">
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
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left cursor-pointer transition active:scale-[0.97] flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-50/80 border-[#F5CF55] ring-2 ring-[#F5CF55]/50 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Music className="w-5 h-5 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {song.titleVi}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium truncate">
                          {song.titleEn}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {song.badgeVi}
                          </span>
                          <span className="text-[9px] font-medium text-slate-400">
                            {song.notes.length} nốt · {song.bpm} BPM
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-600 stroke-[3] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP MODAL CHỌN ÂM SẮC (POPUP NỔI BẬT TO RÕ, ĐỒNG BỘ NÉT) */}
      {/* ========================================================================= */}
      {showTimbreModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-5 flex flex-col gap-3 relative animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Bé chọn tiếng đàn nhé!
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTimbreModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center cursor-pointer transition active:scale-[0.97]"
                aria-label="Đóng bảng chọn âm sắc"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Grid 4 Instrument Options */}
            <div className="grid grid-cols-2 gap-2.5">
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
                    className={`min-h-[76px] p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.97] ${
                      isSelected
                        ? 'bg-amber-50/80 border-[#F5CF55] shadow-xs ring-2 ring-[#F5CF55]/50 text-slate-900 font-black'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="relative">
                      {item.renderIcon()}
                      {isSelected && (
                        <div className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#F5CF55] text-slate-950 flex items-center justify-center text-[10px] font-black">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-center leading-tight">{item.nameVi}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-center text-slate-500 font-medium">
              Chạm vào nhạc cụ bé thích để đổi âm thanh
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
