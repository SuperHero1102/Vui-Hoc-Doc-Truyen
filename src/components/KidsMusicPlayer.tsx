import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Music,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  Mic,
  Star,
  Disc3,
  Heart,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  X,
  Radio,
  Repeat,
  Headphones,
} from 'lucide-react';
import { KIDS_SONGS_DATA, type KidsSong } from '../data/kidsMusicData';
import type { ParentSettings } from '../types/learning';
import { stopAllAudio } from '../utils/audioEngine';
import { logActivity } from '../utils/activityTracker';
import { fireStarExplosion } from '../utils/confetti';

interface KidsMusicPlayerProps {
  settings: ParentSettings;
  childName?: string;
  onOpenParentGate?: () => void;
}

// Frequency mapping for authentic acoustic glockenspiel / marimba tones
const NOTE_FREQS: Record<string, number> = {
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

export const KidsMusicPlayer: React.FC<KidsMusicPlayerProps> = ({
  settings,
  childName = 'Bé',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSong, setActiveSong] = useState<KidsSong | null>(KIDS_SONGS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isKaraokeMode, setIsKaraokeMode] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(30);
  const [tappedBeatsCount, setTappedBeatsCount] = useState<number>(0);
  const [favoritedSongIds, setFavoritedSongIds] = useState<Record<string, boolean>>({});

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const currentSongRef = useRef<KidsSong | null>(null);
  const melodyTimeoutIdsRef = useRef<number[]>([]);
  const songStartTimeRef = useRef<number>(Date.now());
  const progressIntervalRef = useRef<number | null>(null);

  // Filtered song list
  const filteredSongs = useMemo(() => {
    return KIDS_SONGS_DATA.filter((s) => {
      const matchCat =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'vi_all'
          ? s.category.startsWith('vi_')
          : s.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q.length === 0 ||
        s.title.toLowerCase().includes(q) ||
        (s.subtitleEn && s.subtitleEn.toLowerCase().includes(q)) ||
        s.composer.toLowerCase().includes(q) ||
        s.lyrics.some((l) => l.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getAudioContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  };

  // Rich Polyphonic Music Box & Marimba Tone Generator (Natural acoustic bell timbre)
  const playAcousticMusicBoxNote = (freq: number, durationSec: number) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const masterVol = Math.max(0.05, Math.min(0.8, settings.volume * 0.45));

      // 1. Fundamental warm sine tone (soft wooden body)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(masterVol * 0.7, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + durationSec + 0.05);

      // 2. Bell harmonic overtone (sparkly music box chime)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(masterVol * 0.35, now + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(durationSec, 0.4));

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + durationSec + 0.05);

      // 3. Gentle harmonic fifth (provides rich acoustic fullness)
      if (durationSec > 0.4) {
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(freq * 1.5, now);

        gain3.gain.setValueAtTime(0, now);
        gain3.gain.linearRampToValueAtTime(masterVol * 0.2, now + 0.02);
        gain3.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 0.7);

        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now);
        osc3.stop(now + durationSec + 0.05);
      }
    } catch {
      // AudioContext unavailable
    }
  };

  // Percussive baby sound effects for interactive beat tapping
  const playPercussionSound = (type: 'drum' | 'bell' | 'wood') => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      setTappedBeatsCount((c) => c + 1);
      fireStarExplosion(0.5, 0.5);

      if (type === 'drum') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
        gain.gain.setValueAtTime(settings.volume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'bell') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(settings.volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      } else {
        // Wood block
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(settings.volume * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch {
      // ignore
    }
  };

  // Stop all running audio, timers, and synth timeouts
  const stopPlayback = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }

    melodyTimeoutIdsRef.current.forEach((id) => clearTimeout(id));
    melodyTimeoutIdsRef.current = [];

    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    stopAllAudio();

    if (currentSongRef.current) {
      const elapsedSec = Math.max(3, Math.round((Date.now() - songStartTimeRef.current) / 1000));
      logActivity(
        'music',
        `Bài hát: ${currentSongRef.current.title}`,
        `${currentSongRef.current.categoryLabelVi} · ${currentSongRef.current.composer}`,
        elapsedSec
      );
    }
  };

  // Play next or previous song in current filtered list
  const handleNextSong = () => {
    if (!activeSong) return;
    const currentIndex = filteredSongs.findIndex((s) => s.id === activeSong.id);
    const nextIdx = (currentIndex + 1) % filteredSongs.length;
    startSongPlayback(filteredSongs[nextIdx]);
  };

  const handlePrevSong = () => {
    if (!activeSong) return;
    const currentIndex = filteredSongs.findIndex((s) => s.id === activeSong.id);
    const prevIdx = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    startSongPlayback(filteredSongs[prevIdx]);
  };

  // Start Song Playback: Real Audio Track or Rich Polyphonic Acoustic Music Box
  const startSongPlayback = (song: KidsSong) => {
    stopPlayback();
    setActiveSong(song);
    currentSongRef.current = song;
    songStartTimeRef.current = Date.now();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setCurrentLineIndex(0);
    setCurrentTimeSec(0);

    // Option A: If real audio file track is available, play via HTML5 Audio
    if (song.audioUrl) {
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio();
      }
      const audio = audioElementRef.current;
      audio.src = song.audioUrl;
      audio.volume = settings.volume;
      audio.loop = isLooping;

      audio.onloadedmetadata = () => {
        if (audio.duration && !Number.isNaN(audio.duration)) {
          setDurationSec(Math.round(audio.duration));
        }
      };

      audio.ontimeupdate = () => {
        if (!isPlayingRef.current) return;
        const cur = audio.currentTime;
        setCurrentTimeSec(Math.round(cur));
        const dur = audio.duration || 30;
        if (dur > 0 && song.lyrics.length > 0) {
          const ratio = Math.min(1, Math.max(0, cur / dur));
          const lineIdx = Math.min(
            song.lyrics.length - 1,
            Math.floor(ratio * song.lyrics.length)
          );
          setCurrentLineIndex(lineIdx);
        }
      };

      audio.onended = () => {
        if (isLooping) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        } else {
          handleNextSong();
        }
      };

      audio.play().catch((err) => {
        console.warn('Direct audio play failed, falling back to acoustic melody synth:', err);
        playSynthesizedAcousticMelody(song);
      });
      return;
    }

    // Option B: Rich Polyphonic Acoustic Music Box & Marimba Synthesizer
    playSynthesizedAcousticMelody(song);
  };

  // Polyphonic acoustic music box arrangement for instrumental nursery songs
  const playSynthesizedAcousticMelody = (song: KidsSong) => {
    const notes = song.melodyNotes || [
      { note: 'C4', dur: 0.5 },
      { note: 'E4', dur: 0.5 },
      { note: 'G4', dur: 0.5 },
      { note: 'C5', dur: 0.8 },
    ];

    let delayMs = 0;
    const totalDurationSec = notes.reduce((sum, n) => sum + n.dur, 0);
    setDurationSec(Math.round(totalDurationSec));

    notes.forEach((item, idx) => {
      const freq = NOTE_FREQS[item.note] || 330;
      const tId = window.setTimeout(() => {
        if (!isPlayingRef.current) return;
        playAcousticMusicBoxNote(freq, item.dur);

        // Update time and karaoke line highlight
        setCurrentTimeSec(Math.round(delayMs / 1000));
        if (song.lyrics.length > 0) {
          const lineIdx = Math.floor((idx / notes.length) * song.lyrics.length);
          setCurrentLineIndex(Math.min(lineIdx, song.lyrics.length - 1));
        }
      }, delayMs);
      melodyTimeoutIdsRef.current.push(tId);
      delayMs += Math.round(item.dur * 1000);
    });

    // End of song cycle
    const endId = window.setTimeout(() => {
      if (!isPlayingRef.current) return;
      if (isLooping) {
        startSongPlayback(song);
      } else {
        handleNextSong();
      }
    }, delayMs + 800);
    melodyTimeoutIdsRef.current.push(endId);
  };

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const toggleFavorite = (songId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavoritedSongIds((prev) => ({ ...prev, [songId]: !prev[songId] }));
    fireStarExplosion(0.8, 0.3);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3 sm:gap-4 pb-4">
      {/* 1. Header Hero Card with Music Theme */}
      <div className="rounded-[28px] bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 p-4 sm:p-6 text-white shadow-md border-2 border-pink-300/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xl sm:text-3xl select-none">🎵</span>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight font-display">
              Góc Âm Nhạc & Bài Hát Cho Bé (0–5 Tuổi)
            </h1>
            <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs">
              {KIDS_SONGS_DATA.length} Bài Hát Chọn Lọc
            </span>
          </div>
          <p className="text-xs sm:text-sm text-pink-100 font-medium">
            Kho bài hát thiếu nhi & Đồng dao tiếng Anh với âm thanh thu âm, giai điệu thực tế vui tươi, giàu cảm xúc giúp bé phát triển thính giác và hát theo lời ca.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[11px] font-bold">
            <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl flex items-center gap-1 text-white">
              <Headphones className="w-3.5 h-3.5" /> Âm thanh bài hát & hòa tấu thực tế
            </span>
            <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl flex items-center gap-1 text-white">
              <Mic className="w-3.5 h-3.5" /> Chế độ Karaoke hát theo lời ca
            </span>
            <span className="bg-amber-300 text-slate-900 px-2.5 py-1 rounded-xl flex items-center gap-1 font-black shadow-2xs">
              ⭐ {tappedBeatsCount > 0 ? `Bé đã gõ ${tappedBeatsCount} nhịp sao!` : 'Bé gõ nhịp cùng bài hát nhé!'}
            </span>
          </div>
        </div>

        {/* Quick Active Song Player Bar */}
        {activeSong && (
          <div className="shrink-0 bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 flex items-center gap-3 w-full lg:w-auto">
            <div
              className={`w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-xs ${
                isPlaying ? 'animate-bounce-gentle' : ''
              }`}
            >
              {activeSong.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold truncate flex items-center gap-1">
                <span>{activeSong.title}</span>
                {activeSong.audioUrl && (
                  <span className="px-1.5 py-0.5 bg-emerald-400 text-emerald-950 text-[9px] rounded-md font-black flex items-center gap-0.5">
                    🎤 Ca sĩ hát
                  </span>
                )}
              </div>
              <div className="text-[10px] text-pink-100 truncate">{activeSong.composer}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isPlaying) {
                  stopPlayback();
                } else {
                  startSongPlayback(activeSong);
                }
              }}
              className="min-h-[44px] min-w-[44px] rounded-xl bg-white text-rose-600 hover:bg-rose-50 active:scale-95 flex items-center justify-center shadow-sm cursor-pointer transition"
              aria-label={isPlaying ? 'Dừng phát nhạc' : 'Phát bài hát'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
          </div>
        )}
      </div>

      {/* 2. Category Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white/95 px-3 sm:px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          {[
            { id: 'all', label: `Tất cả (${KIDS_SONGS_DATA.length})` },
            { id: 'vi_all', label: `🇻🇳 Toàn bộ Nhạc Việt (${KIDS_SONGS_DATA.filter((s) => s.category.startsWith('vi_')).length})` },
            { id: 'vi_3y', label: 'Lớp 3 tuổi (10 bài)' },
            { id: 'vi_4y', label: 'Lớp 4 tuổi (8 bài)' },
            { id: 'vi_5y', label: 'Lớp 5 tuổi (8 bài)' },
            { id: 'en_rhymes', label: `🇬🇧 English Nursery Rhymes (${KIDS_SONGS_DATA.filter((s) => s.category === 'en_rhymes').length})` },
          ].map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[32px] sm:min-h-[34px] px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-rose-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-60">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài hát, tác giả..."
            aria-label="Tìm kiếm bài hát"
            className="w-full min-h-[34px] pl-8 pr-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-slate-50"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Split View: Active Interactive Player & Song Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Karaoke & Tap-Along Stage */}
        {activeSong && (
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="rounded-3xl bg-white border-2 border-rose-200 p-4 sm:p-5 shadow-sm space-y-4">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                  <span>{activeSong.categoryLabelVi}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {activeSong.audioUrl && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                      <Headphones className="w-3 h-3" /> 🎤 Ca Sĩ Hát
                    </span>
                  )}
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900">
                    {activeSong.ageBadge}
                  </span>
                </div>
              </div>

              {/* Album Visual Canvas */}
              <div
                className={`w-full h-40 sm:h-48 rounded-2xl bg-gradient-to-br ${activeSong.bgGradient} flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner p-4 text-center select-none`}
              >
                <div
                  className={`text-6xl sm:text-7xl mb-2 transition-transform duration-300 ${
                    isPlaying ? 'scale-110 drop-shadow-md' : ''
                  }`}
                >
                  {activeSong.emoji}
                </div>
                <h2 className="text-base sm:text-lg font-black tracking-tight drop-shadow-xs">
                  {activeSong.title}
                </h2>
                {activeSong.subtitleEn && (
                  <p className="text-xs text-white/80 font-bold">{activeSong.subtitleEn}</p>
                )}
                <div className="text-[11px] text-white/90 font-medium mt-1">
                  {activeSong.composer}
                </div>

                {/* Spinning vinyl record badge when playing */}
                {isPlaying && (
                  <div className="absolute top-2 right-2 text-white/80 animate-spin">
                    <Disc3 className="w-6 h-6" />
                  </div>
                )}

                {/* Interactive vinyl tap trigger on album cover */}
                <button
                  type="button"
                  onClick={() => playPercussionSound('bell')}
                  className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-[10px] font-black text-white flex items-center gap-1 cursor-pointer transition active:scale-95"
                  title="Chạm vào đây để lắc chuông theo nhạc"
                >
                  <span>🔔 Lắc chuông</span>
                </button>
              </div>

              {/* Player Progress Bar & Controls */}
              <div className="space-y-1.5 px-1">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, (currentTimeSec / Math.max(1, durationSec)) * 100)
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span>{Math.floor(currentTimeSec / 60)}:{String(currentTimeSec % 60).padStart(2, '0')}</span>
                  <span>{Math.floor(durationSec / 60)}:{String(durationSec % 60).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Karaoke Lyrics Screen with Real-Time Glowing Line */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 max-h-48 overflow-y-auto space-y-2">
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-purple-600" />
                    <span>Lời ca cho bé & bố mẹ cùng hát:</span>
                  </span>
                  {isPlaying && (
                    <span className="text-rose-600 flex items-center gap-1 text-[10px] font-bold">
                      <Radio className="w-3.5 h-3.5 animate-pulse" /> Đang phát nhạc
                    </span>
                  )}
                </div>
                <div className="space-y-1.5 pt-1">
                  {activeSong.lyrics.map((line, idx) => {
                    const isCurrent = isPlaying && currentLineIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`text-xs sm:text-sm font-bold transition-all px-2.5 py-1.5 rounded-xl flex items-center gap-2 ${
                          isCurrent
                            ? 'bg-rose-500 text-white font-extrabold shadow-sm scale-[1.02]'
                            : 'text-slate-700 bg-white/70'
                        }`}
                      >
                        {isCurrent && <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse shrink-0" />}
                        <span className="leading-snug">{line}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Educational fun fact */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950 leading-relaxed">
                <strong>💡 Ý nghĩa bài hát:</strong> {activeSong.funFactVi}
              </div>

              {/* Playback Transport Controls (Prev, Play/Pause, Next, Loop) */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePrevSong}
                  className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs"
                  title="Bài trước đó"
                  aria-label="Bài trước đó"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isPlaying) {
                      stopPlayback();
                    } else {
                      startSongPlayback(activeSong);
                    }
                  }}
                  className={`flex-1 min-h-[46px] rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-95 ${
                    isPlaying
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-rose-500 hover:bg-rose-600 text-white'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>Tạm Dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                      <span>{activeSong.audioUrl ? 'Nghe Ca Sĩ Hát' : 'Phát Giai Điệu Bé Hát'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNextSong}
                  className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs"
                  title="Bài tiếp theo"
                  aria-label="Bài tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLooping((v) => !v)}
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center cursor-pointer transition active:scale-95 shadow-2xs ${
                    isLooping
                      ? 'bg-purple-100 border-purple-300 text-purple-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                  }`}
                  title={isLooping ? 'Đang bật lặp lại bài này' : 'Bật lặp lại bài này'}
                  aria-label="Lặp lại bài hát"
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Rhythmic Beat Tap Pads (Trống, Lắc chuông, Mõ gỗ) */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-extrabold text-slate-700 block text-center">
                  👏 Bé gõ nhịp nhạc cụ cùng bài hát:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => playPercussionSound('drum')}
                    className="min-h-[46px] rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-90 text-slate-950 font-black text-xs flex flex-col items-center justify-center gap-0.5 shadow-2xs border-2 border-amber-500 cursor-pointer transition select-none"
                  >
                    <span>🥁 Trống bông</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => playPercussionSound('bell')}
                    className="min-h-[46px] rounded-2xl bg-pink-400 hover:bg-pink-300 active:scale-90 text-slate-950 font-black text-xs flex flex-col items-center justify-center gap-0.5 shadow-2xs border-2 border-pink-500 cursor-pointer transition select-none"
                  >
                    <span>🔔 Lắc chuông</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => playPercussionSound('wood')}
                    className="min-h-[46px] rounded-2xl bg-emerald-400 hover:bg-emerald-300 active:scale-90 text-slate-950 font-black text-xs flex flex-col items-center justify-center gap-0.5 shadow-2xs border-2 border-emerald-500 cursor-pointer transition select-none"
                  >
                    <span>🪵 Mõ gỗ vui</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Song Grid */}
        <div className={`space-y-3 ${activeSong ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-600 px-1">
            <span>Danh sách bài hát ({filteredSongs.length})</span>
            <span>Chạm bài để phát & xem lời</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredSongs.map((song) => {
              const isSelected = activeSong?.id === song.id;
              const isCurPlaying = isSelected && isPlaying;
              const isFav = Boolean(favoritedSongIds[song.id]);

              return (
                <div
                  key={song.id}
                  onClick={() => {
                    if (isSelected && isCurPlaying) {
                      stopPlayback();
                    } else {
                      startSongPlayback(song);
                    }
                  }}
                  className={`group rounded-2xl border-2 p-3 sm:p-3.5 flex flex-col justify-between gap-2.5 transition-all cursor-pointer hover:shadow-md select-none ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-rose-300'
                  }`}
                >
                  {/* Top Row: Emoji, Title, Fav & Play Indicator */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${song.bgGradient} text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition`}
                      >
                        {song.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                            {song.title}
                          </h3>
                          {song.audioUrl && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] rounded-md font-black border border-emerald-300 flex items-center gap-0.5">
                              🎤 Ca sĩ hát
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 truncate">
                          {song.composer}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(song.id, e)}
                      className={`min-h-[32px] min-w-[32px] rounded-lg flex items-center justify-center cursor-pointer transition ${
                        isFav ? 'text-rose-500' : 'text-slate-300 hover:text-slate-500'
                      }`}
                      aria-label="Yêu thích bài hát"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Lyrics excerpt */}
                  <div className="text-[11px] text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                    "{song.lyrics[0]}"
                  </div>

                  {/* Bottom Tags & Play Button */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 truncate max-w-[140px]">
                      {song.ageBadge}
                    </span>

                    <button
                      type="button"
                      className={`min-h-[32px] px-3 py-1 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition ${
                        isCurPlaying
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 group-hover:bg-rose-100 text-slate-700 group-hover:text-rose-700'
                      }`}
                    >
                      {isCurPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Đang phát</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{song.audioUrl ? 'Ca sĩ hát' : 'Bé hát'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
