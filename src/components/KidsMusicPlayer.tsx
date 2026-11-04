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
  Shuffle,
  Headphones,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { KIDS_SONGS_DATA, type KidsSong, type TimedLyricLine } from '../data/kidsMusicData';
import type { ParentSettings } from '../types/learning';
import { stopAllAudio } from '../utils/audioEngine';
import { logActivity } from '../utils/activityTracker';
import { fireStarExplosion } from '../utils/confetti';

interface KidsMusicPlayerProps {
  settings: ParentSettings;
  childName?: string;
  onOpenParentGate?: () => void;
}

const FAVORITES_STORAGE_KEY = 'bevuihoc_favorited_songs_v4';
const RECENT_SONG_KEY = 'bevuihoc_recent_song_id_v4';

// Acoustic music box frequencies for instrumental fallback songs
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

const CATEGORY_CHIPS = [
  { id: 'all', label: 'Tất cả (44)', count: 44, icon: Music },
  { id: 'vi_all', label: 'Nhạc Việt (26)', count: 26, icon: Sparkles },
  { id: 'vi_3y', label: 'Lớp 3 tuổi (10)', count: 10, icon: Star },
  { id: 'vi_4y', label: 'Lớp 4 tuổi (8)', count: 8, icon: Star },
  { id: 'vi_5y', label: 'Lớp 5 tuổi (8)', count: 8, icon: Star },
  { id: 'en_rhymes', label: 'English (18)', count: 18, icon: Headphones },
  { id: 'favorites', label: 'Yêu thích', count: 0, icon: Heart },
];

export const KidsMusicPlayer: React.FC<KidsMusicPlayerProps> = ({
  settings,
  childName = 'Bé',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSong, setActiveSong] = useState<KidsSong | null>(() => {
    try {
      const recentId = localStorage.getItem(RECENT_SONG_KEY);
      if (recentId) {
        const found = KIDS_SONGS_DATA.find((s) => s.id === recentId);
        if (found) return found;
      }
    } catch {}
    return KIDS_SONGS_DATA[0];
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(30);
  const [tappedBeatsCount, setTappedBeatsCount] = useState<number>(0);
  const [isFactExpanded, setIsFactExpanded] = useState<boolean>(false);

  const [favoritedSongIds, setFavoritedSongIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const currentSongRef = useRef<KidsSong | null>(null);
  const melodyTimeoutIdsRef = useRef<number[]>([]);
  const songStartTimeRef = useRef<number>(Date.now());
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const karaokeListRef = useRef<HTMLDivElement | null>(null);
  const playerStageRef = useRef<HTMLDivElement | null>(null);

  // Sync favorites count in category chips
  const favCount = useMemo(() => {
    return Object.values(favoritedSongIds).filter(Boolean).length;
  }, [favoritedSongIds]);

  // Filtered song list
  const filteredSongs = useMemo(() => {
    return KIDS_SONGS_DATA.filter((s) => {
      let matchCat = true;
      if (selectedCategory === 'vi_all') {
        matchCat = s.category.startsWith('vi_');
      } else if (selectedCategory === 'favorites') {
        matchCat = Boolean(favoritedSongIds[s.id]);
      } else if (selectedCategory !== 'all') {
        matchCat = s.category === selectedCategory;
      }

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q.length === 0 ||
        s.title.toLowerCase().includes(q) ||
        (s.subtitleEn && s.subtitleEn.toLowerCase().includes(q)) ||
        s.composer.toLowerCase().includes(q) ||
        s.lyrics.some((l) => l.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery, favoritedSongIds]);

  // Audio Context initialization for acoustic music box
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

  const playAcousticMusicBoxNote = (freq: number, durSec: number) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const masterVol = Math.max(0.05, Math.min(0.8, settings.volume * 0.45));

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(masterVol * 0.7, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + durSec);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + durSec + 0.05);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(masterVol * 0.35, now + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(durSec, 0.4));

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + durSec + 0.05);
    } catch {}
  };

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
    } catch {}
  };

  // Stop all running audio and reset state
  const stopPlayback = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    melodyTimeoutIdsRef.current.forEach((id) => clearTimeout(id));
    melodyTimeoutIdsRef.current = [];

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

  // Immediate cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  // Sync active line auto-scroll in karaoke viewport
  useEffect(() => {
    if (activeLineRef.current && isPlaying) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentLineIndex, isPlaying]);

  const handleNextSong = () => {
    if (!activeSong || filteredSongs.length === 0) return;
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * filteredSongs.length);
      startSongPlayback(filteredSongs[randomIdx]);
      return;
    }
    const currentIndex = filteredSongs.findIndex((s) => s.id === activeSong.id);
    const nextIdx = (currentIndex + 1) % filteredSongs.length;
    startSongPlayback(filteredSongs[nextIdx]);
  };

  const handlePrevSong = () => {
    if (!activeSong || filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex((s) => s.id === activeSong.id);
    const prevIdx = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    startSongPlayback(filteredSongs[prevIdx]);
  };

  const startSongPlayback = (song: KidsSong) => {
    stopPlayback();
    setActiveSong(song);
    currentSongRef.current = song;
    songStartTimeRef.current = Date.now();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setCurrentLineIndex(0);
    setCurrentTimeSec(0);

    try {
      localStorage.setItem(RECENT_SONG_KEY, song.id);
    } catch {}

    // Option A: Real vocal audio track
    if (song.audioUrl && song.isVocalTrack !== false) {
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

        // Synchronize karaoke timed lyrics strictly when available
        if (song.timedLyrics && song.timedLyrics.length > 0) {
          if (cur < song.timedLyrics[0].startTimeSec) {
            setCurrentLineIndex(-1);
            return;
          }
          const matchIdx = song.timedLyrics.findIndex((line, i) => {
            const end =
              line.endTimeSec ??
              (song.timedLyrics![i + 1]?.startTimeSec ?? line.startTimeSec + 4);
            return cur >= line.startTimeSec && cur <= end;
          });
          setCurrentLineIndex(matchIdx);
        } else {
          setCurrentLineIndex(-1);
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
        console.warn('Real audio play error, switching to acoustic melody:', err);
        playSynthesizedAcousticMelody(song);
      });
      return;
    }

    // Option B: Acoustic melody box synth for instrumental songs
    playSynthesizedAcousticMelody(song);
  };

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
        setCurrentTimeSec(Math.round(delayMs / 1000));
        if (song.lyrics.length > 0) {
          const lineIdx = Math.floor((idx / notes.length) * song.lyrics.length);
          setCurrentLineIndex(Math.min(lineIdx, song.lyrics.length - 1));
        }
      }, delayMs);

      melodyTimeoutIdsRef.current.push(tId);
      delayMs += item.dur * 1000;
    });

    const endId = window.setTimeout(() => {
      if (!isPlayingRef.current) return;
      if (isLooping) {
        startSongPlayback(song);
      } else {
        handleNextSong();
      }
    }, delayMs + 600);
    melodyTimeoutIdsRef.current.push(endId);
  };

  const handleSeek = (newTime: number) => {
    setCurrentTimeSec(newTime);
    if (audioElementRef.current && activeSong?.audioUrl && activeSong.isVocalTrack !== false) {
      audioElementRef.current.currentTime = newTime;
    }
    if (activeSong?.timedLyrics && activeSong.timedLyrics.length > 0) {
      if (newTime < activeSong.timedLyrics[0].startTimeSec) {
        setCurrentLineIndex(-1);
      } else {
        const matchIdx = activeSong.timedLyrics.findIndex((line, i) => {
          const end =
            line.endTimeSec ??
            (activeSong.timedLyrics![i + 1]?.startTimeSec ?? line.startTimeSec + 4);
          return newTime >= line.startTimeSec && newTime <= end;
        });
        setCurrentLineIndex(matchIdx);
      }
    } else {
      setCurrentLineIndex(-1);
    }
  };

  const toggleFavorite = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoritedSongIds((prev) => {
      const next = { ...prev, [songId]: !prev[songId] };
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const scrollToPlayer = () => {
    playerStageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-4 pb-24 max-w-7xl mx-auto">
      {/* 1. COMPACT COMMERCIAL BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-md">
                <Music className="w-5 h-5 text-white" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-xs">
                Giai Điệu Tuổi Thơ
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-white/90 font-medium mt-1">
              44 bài hát rộn ràng (26 bài Việt · 18 bài Anh) cho bé nghe & hát karaoke
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {activeSong && (
              <button
                type="button"
                onClick={() => {
                  scrollToPlayer();
                  if (!isPlaying) startSongPlayback(activeSong);
                }}
                className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-2xl bg-white text-rose-600 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-rose-50 active:scale-95 transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Đang phát' : 'Tiếp tục nghe'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. HORIZONTAL SCROLLING CHIPS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
          {CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            const Icon = chip.icon;
            const label = chip.id === 'favorites' ? `Yêu thích (${favCount})` : chip.label;

            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedCategory(chip.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-sm font-extrabold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-rose-500'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên bài, tác giả..."
            className="w-full min-h-[44px] pl-9 pr-8 text-xs font-medium rounded-2xl bg-white border border-slate-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-[44px] min-w-[36px] flex items-center justify-center absolute right-0 top-0 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. MAIN SPLIT VIEW: STAGE & SONGS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" ref={playerStageRef}>
        {/* LEFT COLUMN: ACTIVE INTERACTIVE PLAYER & KARAOKE STAGE */}
        {activeSong && (
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {activeSong.categoryLabelVi}
                </span>

                <div className="flex items-center gap-1.5">
                  {activeSong.isVocalTrack !== false ? (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Headphones className="w-3 h-3" /> Ca sĩ hát
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1">
                      <Music className="w-3 h-3" /> Nghe giai điệu
                    </span>
                  )}
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900">
                    {activeSong.ageBadge}
                  </span>
                </div>
              </div>

              {/* Large 3D Chibi Artwork */}
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="relative group w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-md border-4 border-white bg-slate-100">
                  <img
                    src={activeSong.cover || `/assets/music/covers/music_cover_${activeSong.id}.webp`}
                    alt={activeSong.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {isPlaying && (
                    <div className="absolute top-2 right-2 bg-slate-900/60 backdrop-blur-md text-white p-1.5 rounded-full animate-spin">
                      <Disc3 className="w-5 h-5 text-rose-400" />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {activeSong.title}
                  </h2>
                  {activeSong.subtitleEn && (
                    <p className="text-xs text-slate-500 font-bold">{activeSong.subtitleEn}</p>
                  )}
                  <p className="text-[11px] text-slate-500 font-medium">{activeSong.composer}</p>
                </div>
              </div>

              {/* Scrubbable Progress Bar */}
              <div className="space-y-1 px-1">
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(1, durationSec)}
                    value={currentTimeSec}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-rose-500 focus:outline-none"
                    aria-label="Tua bài hát"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>
                    {Math.floor(currentTimeSec / 60)}:
                    {String(currentTimeSec % 60).padStart(2, '0')}
                  </span>
                  <span>
                    {Math.floor(durationSec / 60)}:
                    {String(durationSec % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Main Large Controls Row */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsShuffle((v) => !v)}
                  className={`min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center cursor-pointer transition active:scale-95 border ${
                    isShuffle
                      ? 'bg-amber-100 text-amber-700 border-amber-300 font-bold'
                      : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'
                  }`}
                  title="Phát ngẫu nhiên"
                  aria-label="Phát ngẫu nhiên"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePrevSong}
                  className="min-h-[44px] min-w-[44px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-95"
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
                  className={`min-h-[50px] px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-95 ${
                    isPlaying
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-rose-500 hover:bg-rose-600 text-white'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>Tạm Dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                      <span>{activeSong.isVocalTrack !== false ? 'Ca sĩ hát' : 'Nghe giai điệu'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNextSong}
                  className="min-h-[44px] min-w-[44px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-95"
                  title="Bài tiếp theo"
                  aria-label="Bài tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLooping((v) => !v)}
                  className={`min-h-[44px] min-w-[44px] rounded-2xl border flex items-center justify-center cursor-pointer transition active:scale-95 ${
                    isLooping
                      ? 'bg-purple-100 border-purple-300 text-purple-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                  }`}
                  title={isLooping ? 'Đang bật lặp lại' : 'Lặp lại bài hát'}
                  aria-label="Lặp lại bài hát"
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Karaoke Stage with Glowing Active Line and Bilingual Subtitles */}
              <div
                ref={karaokeListRef}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 max-h-56 overflow-y-auto space-y-2 select-none"
              >
                {/* Header label */}
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    {activeSong.isVocalTrack !== false &&
                    activeSong.timedLyrics &&
                    activeSong.timedLyrics.length > 0 ? (
                      <>
                        <Mic className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-purple-700 font-black">
                          Lời ca hát cùng bé (karaoke chạy chữ):
                        </span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-slate-700 font-black">
                          Lời bài hát:
                        </span>
                      </>
                    )}
                  </span>
                  {isPlaying && (
                    <span className="text-rose-600 flex items-center gap-1 text-[10px] font-bold">
                      <Radio className="w-3.5 h-3.5 animate-pulse" /> Đang phát
                    </span>
                  )}
                </div>

                {/* Case 1: Song does NOT have synced timing -> clean static display */}
                {!(
                  activeSong.isVocalTrack !== false &&
                  activeSong.timedLyrics &&
                  activeSong.timedLyrics.length > 0
                ) ? (
                  <div className="py-1 space-y-2">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 font-medium leading-relaxed">
                      {activeSong.isVocalTrack !== false
                        ? '🎵 Bài hát có bản thu âm ca sĩ. Lời bài hát hiển thị đầy đủ bên dưới để bé và bố mẹ cùng hòa giọng nhé!'
                        : '🎵 Đang phát giai điệu hộp nhạc. Bé và bố mẹ hãy cùng hòa giọng đọc lời bên dưới nhé!'}
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-semibold px-1">
                      {activeSong.lyrics.map((l, i) => {
                        const translation = activeSong.englishTranslation?.[i];
                        const showSubtitle =
                          Boolean(translation) &&
                          (settings.storyLanguage !== 'vi' || activeSong.category === 'en_rhymes');
                        return (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-white/70 border border-slate-100 flex flex-col gap-0.5"
                          >
                            <p className="flex items-start gap-1.5 text-slate-800">
                              <span className="text-rose-400 font-black">•</span>
                              <span>{l}</span>
                            </p>
                            {showSubtitle && (
                              <p className="text-[11px] font-medium text-slate-400 pl-4 italic">
                                {translation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Case 2: Song HAS calibrated synchronized timing */
                  <div className="space-y-2 pt-1">
                    {/* Intro or interlude indicator */}
                    {isPlaying && currentLineIndex === -1 && (
                      <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black flex items-center gap-1.5 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        <span>Nhạc dạo... Chuẩn bị hát nào bé ơi! ✨</span>
                      </div>
                    )}

                    {activeSong.timedLyrics.map((line, idx) => {
                      const isCurrent = isPlaying && currentLineIndex === idx;
                      const isPast = isPlaying && currentLineIndex > idx;
                      const showSubtitle =
                        Boolean(line.translation) &&
                        (settings.storyLanguage !== 'vi' || activeSong.category === 'en_rhymes');

                      const lineDur = Math.max(
                        0.5,
                        (line.endTimeSec ?? (line.startTimeSec + 3.5)) - line.startTimeSec
                      );
                      const lineProgress = Math.min(
                        100,
                        Math.max(0, ((currentTimeSec - line.startTimeSec) / lineDur) * 100)
                      );

                      return (
                        <div
                          key={idx}
                          ref={isCurrent ? activeLineRef : null}
                          className={`transition-all duration-300 px-3 py-2 rounded-2xl flex flex-col gap-0.5 ${
                            isCurrent
                              ? 'bg-rose-500 text-white font-black shadow-sm scale-[1.02]'
                              : isPast
                              ? 'text-slate-400 bg-white/40 opacity-50'
                              : 'text-slate-700 bg-white/80 opacity-85'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                            {isCurrent && (
                              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse shrink-0" />
                            )}
                            <span className="leading-snug">{line.text}</span>
                          </div>

                          {/* Dynamic progressive sweep on active line */}
                          {isCurrent && (
                            <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full bg-amber-300 rounded-full transition-all duration-150 ease-linear"
                                style={{ width: `${lineProgress}%` }}
                              />
                            </div>
                          )}

                          {showSubtitle && (
                            <div
                              className={`text-[11px] font-medium pl-5 italic ${
                                isCurrent ? 'text-rose-100' : 'text-slate-400'
                              }`}
                            >
                              {line.translation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Short Educational Fun Fact (<= 15 words) */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-xs text-amber-950 flex items-start justify-between gap-2">
                <div className="flex items-start gap-1.5 min-w-0">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="font-semibold leading-relaxed">
                    <strong>Ý nghĩa:</strong> {activeSong.funFactVi}
                  </p>
                </div>
              </div>

              {/* Interactive Rhythmic Beat Tap Pads (Trống, Lắc chuông, Mõ gỗ) */}
              <div className="pt-1 border-t border-slate-100 space-y-2">
                <span className="text-xs font-extrabold text-slate-700 block text-center">
                  👏 Bé gõ nhịp nhạc cụ cùng bài hát ({tappedBeatsCount} nhịp):
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

        {/* RIGHT COLUMN: 44 SONGS LIST WITH 72PX 3D CHIBI COVERS */}
        <div className={`space-y-3 ${activeSong ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-600 px-1">
            <span>Danh sách bài hát ({filteredSongs.length})</span>
            <span>Chạm để phát & xem lời</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredSongs.map((song) => {
              const isSelected = activeSong?.id === song.id;
              const isCurPlaying = isSelected && isPlaying;
              const isFav = Boolean(favoritedSongIds[song.id]);
              const coverImg = song.cover || `/assets/music/covers/music_cover_${song.id}.webp`;

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
                  className={`group rounded-2xl border-2 p-3 flex items-start gap-3 transition-all cursor-pointer hover:shadow-md select-none ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-rose-300'
                  }`}
                >
                  {/* 72px 3D Chibi Cover */}
                  <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs shrink-0 group-hover:scale-105 transition">
                    <img
                      src={coverImg}
                      alt={song.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Song Information */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch gap-1">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                          {song.title}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(song.id, e)}
                          className={`min-h-[44px] min-w-[44px] -mt-2 -mr-2 flex items-center justify-center cursor-pointer transition ${
                            isFav ? 'text-rose-500' : 'text-slate-300 hover:text-slate-500'
                          }`}
                          aria-label="Yêu thích bài hát"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      <p className="text-[11px] font-medium text-slate-500 truncate">
                        {song.composer}
                      </p>
                    </div>

                    {/* Single-line lyric quote */}
                    <p className="text-[11px] text-slate-600 italic truncate">
                      "{song.lyrics[0]}"
                    </p>

                    {/* Age Badge and Clear Action Button */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {song.ageBadge}
                      </span>

                      <button
                        type="button"
                        className={`min-h-[32px] px-2.5 py-1 rounded-xl font-black text-[11px] flex items-center gap-1 transition ${
                          isCurPlaying
                            ? 'bg-rose-500 text-white'
                            : song.isVocalTrack !== false
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300'
                        }`}
                      >
                        {isCurPlaying ? (
                          <>
                            <Pause className="w-3 h-3 fill-current" />
                            <span>Đang phát</span>
                          </>
                        ) : song.isVocalTrack !== false ? (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Ca sĩ hát</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Nghe giai điệu</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. STICKY MINI-PLAYER AT BOTTOM (Always accessible when scrolling) */}
      {activeSong && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-2.5 flex items-center justify-between gap-3 select-none">
          {/* Top hairline progress bar */}
          <div className="absolute top-0 left-3 right-3 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(0, (currentTimeSec / Math.max(1, durationSec)) * 100))}%`,
              }}
            />
          </div>

          <div
            onClick={scrollToPlayer}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer pt-1"
          >
            <img
              src={activeSong.cover || `/assets/music/covers/music_cover_${activeSong.id}.webp`}
              alt={activeSong.title}
              className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-2xs border border-slate-200"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-black text-slate-900 truncate">{activeSong.title}</h4>
              <p className="text-[10px] font-semibold text-slate-500 truncate">
                {activeSong.isVocalTrack !== false ? '🎤 Ca sĩ hát' : '🎵 Nghe giai điệu'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 pt-1 shrink-0">
            <button
              type="button"
              onClick={handlePrevSong}
              className="min-h-[44px] min-w-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
              aria-label="Bài trước đó"
            >
              <ChevronLeft className="w-4 h-4" />
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
              className="min-h-[44px] min-w-[44px] rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
              aria-label={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleNextSong}
              className="min-h-[44px] min-w-[36px] flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
              aria-label="Bài tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
