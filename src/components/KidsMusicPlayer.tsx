import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { KIDS_SONGS_DATA, type KidsSong, type TimedLyricLine } from '../data/kidsMusicData';
import type { ParentSettings } from '../types/learning';
import { stopAllAudio } from '../utils/audioEngine';
import { logActivity } from '../utils/activityTracker';
import { fireStarExplosion } from '../utils/confetti';

interface KidsMusicPlayerProps {
  settings: ParentSettings;
  childName?: string;
  onBack?: () => void;
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
  { id: 'all', label: 'Tất cả (44)', icon: Music },
  { id: 'vi_all', label: 'Nhạc Việt (26)', icon: Sparkles },
  { id: 'vi_3y', label: 'Lớp 3 tuổi (10)', icon: Star },
  { id: 'vi_4y', label: 'Lớp 4 tuổi (8)', icon: Star },
  { id: 'vi_5y', label: 'Lớp 5 tuổi (8)', icon: Star },
  { id: 'en_rhymes', label: 'English (18)', icon: Headphones },
  { id: 'favorites', label: 'Yêu thích', icon: Heart },
];

export const KidsMusicPlayer: React.FC<KidsMusicPlayerProps> = ({
  settings,
  childName = 'Bé',
  onBack,
  onOpenParentGate,
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
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [audioErrorMsg, setAudioErrorMsg] = useState<string | null>(null);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(30);
  const [tappedBeatsCount, setTappedBeatsCount] = useState<number>(0);
  const [isStageCollapsed, setIsStageCollapsed] = useState<boolean>(false);
  const [showFullLyricsOnly, setShowFullLyricsOnly] = useState<boolean>(false);
  const [isMiniPlayerDismissed, setIsMiniPlayerDismissed] = useState<boolean>(false);
  const [isStageScrolledOut, setIsStageScrolledOut] = useState<boolean>(false);

  const [favoritedSongIds, setFavoritedSongIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playbackIdRef = useRef<number>(0);
  const currentSongRef = useRef<KidsSong | null>(activeSong);
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

  // Initialize or resume Web Audio context
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
      const masterVol = isMuted ? 0 : Math.max(0.05, Math.min(0.8, settings.volume * 0.45));

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
      const vol = isMuted ? 0 : settings.volume;
      setTappedBeatsCount((c) => c + 1);
      fireStarExplosion(0.5, 0.5);

      if (type === 'drum') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
        gain.gain.setValueAtTime(vol * 0.5, now);
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
        gain.gain.setValueAtTime(vol * 0.35, now);
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
        gain.gain.setValueAtTime(vol * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch {}
  };

  // Complete audio tear-down to ensure zero sound overlap
  const stopPlayback = useCallback((keepPosition = false) => {
    playbackIdRef.current += 1;
    setIsPlaying(false);
    setIsLoadingAudio(false);

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      if (!keepPosition) {
        audioElementRef.current.currentTime = 0;
      }
      // Detach handlers
      audioElementRef.current.onloadedmetadata = null;
      audioElementRef.current.ontimeupdate = null;
      audioElementRef.current.onended = null;
      audioElementRef.current.onerror = null;
    }

    melodyTimeoutIdsRef.current.forEach((id) => clearTimeout(id));
    melodyTimeoutIdsRef.current = [];

    stopAllAudio();

    if (currentSongRef.current && !keepPosition) {
      const elapsedSec = Math.max(3, Math.round((Date.now() - songStartTimeRef.current) / 1000));
      logActivity(
        'music',
        `Bài hát: ${currentSongRef.current.title}`,
        `${currentSongRef.current.categoryLabelVi} · ${currentSongRef.current.composer}`,
        elapsedSec
      );
    }
  }, [settings.volume]);

  // Clean cleanup on component unmount
  useEffect(() => {
    return () => {
      stopPlayback(false);
      if (audioElementRef.current) {
        audioElementRef.current.src = '';
        audioElementRef.current = null;
      }
    };
  }, [stopPlayback]);

  // Track scroll position to reveal sticky mini-player only when main stage is out of sight
  useEffect(() => {
    const handleScroll = () => {
      if (!playerStageRef.current) return;
      const rect = playerStageRef.current.getBoundingClientRect();
      // If the top of the stage has scrolled past the viewport top by 220px
      setIsStageScrolledOut(rect.bottom < 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync active line auto-scroll in karaoke viewport
  useEffect(() => {
    if (activeLineRef.current && isPlaying && !showFullLyricsOnly) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentLineIndex, isPlaying, showFullLyricsOnly]);

  // Update volume live
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = isMuted ? 0 : settings.volume;
    }
  }, [settings.volume, isMuted]);

  const handleNextSong = useCallback(() => {
    if (!activeSong || filteredSongs.length === 0) return;
    if (isShuffle) {
      const pool = filteredSongs.filter((s) => s.id !== activeSong.id);
      const nextOne = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : activeSong;
      startSongPlayback(nextOne);
      return;
    }
    const currentIndex = filteredSongs.findIndex((s) => s.id === activeSong.id);
    const nextIdx = (currentIndex + 1) % filteredSongs.length;
    startSongPlayback(filteredSongs[nextIdx]);
  }, [activeSong, filteredSongs, isShuffle]);

  const handlePrevSong = useCallback(() => {
    if (!activeSong || filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex((s) => s.id === activeSong.id);
    const prevIdx = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    startSongPlayback(filteredSongs[prevIdx]);
  }, [activeSong, filteredSongs]);

  // Play synthesized acoustic music box for songs without full vocal track
  const playSynthesizedAcousticMelody = (song: KidsSong, currentPlaybackId: number) => {
    const notes = song.melodyNotes || [
      { note: 'C4', dur: 0.5 },
      { note: 'E4', dur: 0.5 },
      { note: 'G4', dur: 0.5 },
      { note: 'C5', dur: 0.8 },
    ];

    let delayMs = 0;
    const totalDurationSec = notes.reduce((sum, n) => sum + n.dur, 0);
    setDurationSec(Math.round(totalDurationSec));
    setIsLoadingAudio(false);

    notes.forEach((item, idx) => {
      const freq = NOTE_FREQS[item.note] || 330;
      const tId = window.setTimeout(() => {
        if (playbackIdRef.current !== currentPlaybackId) return;
        playAcousticMusicBoxNote(freq, item.dur);
        setCurrentTimeSec(Math.round(delayMs / 1000));
        if (song.lyrics && song.lyrics.length > 0) {
          const lineIdx = Math.floor((idx / notes.length) * song.lyrics.length);
          setCurrentLineIndex(Math.min(lineIdx, song.lyrics.length - 1));
        }
      }, delayMs);

      melodyTimeoutIdsRef.current.push(tId);
      delayMs += item.dur * 1000;
    });

    const endId = window.setTimeout(() => {
      if (playbackIdRef.current !== currentPlaybackId) return;
      if (isLooping) {
        startSongPlayback(song);
      } else {
        handleNextSong();
      }
    }, delayMs + 600);
    melodyTimeoutIdsRef.current.push(endId);
  };

  // Authoritative song starter
  const startSongPlayback = (song: KidsSong, resumeFromSec = 0) => {
    stopPlayback(false);
    const thisPlaybackId = playbackIdRef.current;

    setActiveSong(song);
    currentSongRef.current = song;
    songStartTimeRef.current = Date.now();
    setIsPlaying(true);
    setAudioErrorMsg(null);
    setCurrentLineIndex(0);
    setCurrentTimeSec(resumeFromSec);
    setIsMiniPlayerDismissed(false);

    try {
      localStorage.setItem(RECENT_SONG_KEY, song.id);
    } catch {}

    // Track A: Vocal MP3 Track
    if (song.audioUrl && song.isVocalTrack !== false) {
      setIsLoadingAudio(true);
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio();
      }
      const audio = audioElementRef.current;
      audio.preload = 'auto';
      audio.src = song.audioUrl;
      audio.volume = isMuted ? 0 : settings.volume;
      audio.loop = isLooping;

      audio.onloadedmetadata = () => {
        if (playbackIdRef.current !== thisPlaybackId) return;
        setIsLoadingAudio(false);
        if (audio.duration && !Number.isNaN(audio.duration)) {
          setDurationSec(Math.round(audio.duration));
        }
        if (resumeFromSec > 0) {
          audio.currentTime = resumeFromSec;
        }
      };

      audio.ontimeupdate = () => {
        if (playbackIdRef.current !== thisPlaybackId) return;
        const cur = audio.currentTime;
        setCurrentTimeSec(Math.round(cur));

        // Sync timed karaoke line if available
        if (song.timedLyrics && song.timedLyrics.length > 0) {
          if (cur < song.timedLyrics[0].startTimeSec) {
            setCurrentLineIndex(-1);
            return;
          }
          const matchIdx = song.timedLyrics.findIndex((line, i) => {
            const end =
              line.endTimeSec ??
              (song.timedLyrics![i + 1]?.startTimeSec ?? line.startTimeSec + 4.5);
            return cur >= line.startTimeSec && cur <= end;
          });
          setCurrentLineIndex(matchIdx);
        } else {
          setCurrentLineIndex(-1);
        }
      };

      audio.onerror = () => {
        if (playbackIdRef.current !== thisPlaybackId) return;
        setIsLoadingAudio(false);
        setIsPlaying(false);
        setAudioErrorMsg('Không thể phát bản thu âm bài này. Bé hãy thử lại hoặc nghe bản giai điệu nhé!');
      };

      audio.onended = () => {
        if (playbackIdRef.current !== thisPlaybackId) return;
        if (isLooping) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        } else {
          handleNextSong();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (playbackIdRef.current !== thisPlaybackId) {
              audio.pause();
            }
          })
          .catch((err) => {
            if (playbackIdRef.current !== thisPlaybackId) return;
            // Ignore intentional interruption / abort
            if (err.name === 'AbortError') return;
            console.warn('Vocal playback warning, falling back to melodic synth:', err);
            setAudioErrorMsg('Đang tải bản thu hoặc kết nối mạng yếu. Chuyển sang giai điệu hộp nhạc cho bé.');
            playSynthesizedAcousticMelody(song, thisPlaybackId);
          });
      }
      return;
    }

    // Track B: Instrumental acoustic melody
    playSynthesizedAcousticMelody(song, thisPlaybackId);
  };

  // Resume or Pause
  const handleTogglePlay = () => {
    if (!activeSong) return;
    if (isPlaying) {
      // Pause
      stopPlayback(true);
    } else {
      // Resume from current time
      if (activeSong.audioUrl && activeSong.isVocalTrack !== false && audioElementRef.current) {
        const audio = audioElementRef.current;
        if (audio.src && audio.src.includes(activeSong.audioUrl)) {
          audio.volume = isMuted ? 0 : settings.volume;
          audio.play().catch(() => {
            startSongPlayback(activeSong, currentTimeSec);
          });
          setIsPlaying(true);
          return;
        }
      }
      startSongPlayback(activeSong, currentTimeSec);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTimeSec(newTime);
    if (audioElementRef.current && activeSong?.audioUrl && activeSong.isVocalTrack !== false) {
      try {
        audioElementRef.current.currentTime = newTime;
      } catch {}
    }
    if (activeSong?.timedLyrics && activeSong.timedLyrics.length > 0) {
      if (newTime < activeSong.timedLyrics[0].startTimeSec) {
        setCurrentLineIndex(-1);
      } else {
        const matchIdx = activeSong.timedLyrics.findIndex((line, i) => {
          const end =
            line.endTimeSec ??
            (activeSong.timedLyrics![i + 1]?.startTimeSec ?? line.startTimeSec + 4.5);
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

  const hasTimedLyrics = Boolean(activeSong?.timedLyrics && activeSong.timedLyrics.length > 0);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-3 sm:space-y-4 pb-28 px-1 sm:px-2 select-none font-sans">
      {/* 1. TOP COMMERCIAL APP BAR WITH BACK BUTTON & COLLAPSE STAGE TOGGLE */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white p-3.5 sm:p-5 shadow-sm border border-white/20">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Back button & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={() => {
                  stopPlayback(false);
                  onBack();
                }}
                className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs border border-white/30 cursor-pointer transition shrink-0"
                title="Quay lại sân chơi"
                aria-label="Quay lại"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden xs:inline">Quay lại</span>
              </button>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-xl bg-white/20 backdrop-blur-md hidden sm:inline-block">
                  <Music className="w-4 h-4 text-white" />
                </span>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight drop-shadow-xs truncate">
                  Giai Điệu Tuổi Thơ
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-white/90 font-medium truncate mt-0.5">
                44 bài hát thiếu nhi Việt & Anh · Ca sĩ hát & Karaoke chữ chạy
              </p>
            </div>
          </div>

          {/* Right: Quick Stage Toggle & Status */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <button
              type="button"
              onClick={() => setIsStageCollapsed((prev) => !prev)}
              className="min-h-[44px] px-3 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition active:scale-95 border border-white/25"
              title={isStageCollapsed ? 'Mở rộng bàn phát' : 'Thu gọn bàn phát'}
            >
              {isStageCollapsed ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="hidden sm:inline">Mở khung nghe</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Thu gọn</span>
                </>
              )}
            </button>

            {activeSong && (
              <button
                type="button"
                onClick={() => {
                  scrollToPlayer();
                  if (!isPlaying) handleTogglePlay();
                }}
                className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white text-rose-600 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-rose-50 active:scale-95 transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                <span className="hidden sm:inline">{isPlaying ? 'Đang phát' : 'Phát bài'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. CATEGORY CHIPS & SEARCH BAR (Zero overflow, touch friendly) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto touch-pan-x pb-1 scrollbar-none">
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
                    ? 'bg-rose-500 text-white shadow-sm font-black'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-rose-500'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input with 16px font on mobile to prevent iOS Safari auto-zoom */}
        <div className="relative w-full sm:w-64 sm:shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên bài, lời ca, nhạc sĩ..."
            className="w-full min-h-[44px] pl-9 pr-9 text-base sm:text-xs font-medium rounded-2xl bg-white border border-slate-200/90 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-[44px] min-w-[40px] flex items-center justify-center absolute right-0 top-0 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. MAIN STAGE & SONGS LIST SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5" ref={playerStageRef}>
        {/* LEFT COLUMN: ACTIVE INTERACTIVE PLAYER STAGE */}
        {activeSong && !isStageCollapsed && (
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="rounded-3xl bg-white border border-slate-200/90 p-3.5 sm:p-5 shadow-xs space-y-3.5">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 truncate max-w-[200px]">
                  {activeSong.categoryLabelVi}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {activeSong.isVocalTrack !== false ? (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Headphones className="w-3 h-3" /> Ca sĩ hát
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-xl bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1">
                      <Music className="w-3 h-3" /> Nghe giai điệu
                    </span>
                  )}
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-xl bg-amber-100 text-amber-900">
                    {activeSong.ageBadge}
                  </span>
                </div>
              </div>

              {/* Artwork & Title Card (Responsive: side-by-side on mobile, centered on larger) */}
              <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                <div className="relative w-24 h-24 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border-2 border-slate-100 bg-slate-50 shrink-0">
                  <img
                    src={activeSong.cover || `/assets/music/covers/music_cover_${activeSong.id}.webp`}
                    alt={activeSong.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute top-1.5 right-1.5 bg-slate-900/70 backdrop-blur-md text-white p-1 rounded-full animate-spin">
                      <Disc3 className="w-4 h-4 text-rose-400" />
                    </div>
                  )}
                  {isLoadingAudio && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 sm:w-full space-y-0.5">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug truncate">
                    {activeSong.title}
                  </h2>
                  {activeSong.subtitleEn && (
                    <p className="text-xs text-slate-500 font-bold truncate">{activeSong.subtitleEn}</p>
                  )}
                  <p className="text-[11px] text-slate-500 font-medium truncate">{activeSong.composer}</p>
                </div>
              </div>

              {/* Error Notice with Friendly Retry */}
              {audioErrorMsg && (
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">{audioErrorMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => startSongPlayback(activeSong)}
                    className="min-h-[36px] px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] shrink-0 cursor-pointer"
                  >
                    Thử lại 🔄
                  </button>
                </div>
              )}

              {/* Scrubbable Progress Bar */}
              <div className="space-y-1 px-1">
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(1, durationSec)}
                    value={currentTimeSec}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-rose-500 focus:outline-none"
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

              {/* Main Controls Row with 44px+ Touch Targets */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 pt-0.5">
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
                  onClick={handleTogglePlay}
                  className={`min-h-[48px] sm:min-h-[52px] px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-95 ${
                    isPlaying
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-rose-500 hover:bg-rose-600 text-white'
                  }`}
                >
                  {isLoadingAudio ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Đang tải...</span>
                    </>
                  ) : isPlaying ? (
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

                <button
                  type="button"
                  onClick={() => setIsMuted((v) => !v)}
                  className={`min-h-[44px] min-w-[44px] rounded-2xl border flex items-center justify-center cursor-pointer transition active:scale-95 ${
                    isMuted
                      ? 'bg-rose-100 border-rose-300 text-rose-700'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                  }`}
                  title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
                  aria-label="Tắt hoặc bật tiếng"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Karaoke & Lyrics Box (Fluid height, switchable between timed karaoke and full text) */}
              <div
                ref={karaokeListRef}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 max-h-56 sm:max-h-64 overflow-y-auto space-y-2 select-none"
              >
                {/* Header label & View Mode Toggle */}
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between gap-1 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    {hasTimedLyrics && !showFullLyricsOnly ? (
                      <>
                        <Mic className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-purple-700 font-black">
                          Karaoke Chữ Chạy:
                        </span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-slate-700 font-black">
                          Lời Bài Hát Đầy Đủ:
                        </span>
                      </>
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    {hasTimedLyrics && (
                      <button
                        type="button"
                        onClick={() => setShowFullLyricsOnly((v) => !v)}
                        className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        {showFullLyricsOnly ? '🎤 Bật chạy chữ' : '📖 Xem lời đầy đủ'}
                      </button>
                    )}
                    {isPlaying && (
                      <span className="text-rose-600 flex items-center gap-1 text-[10px] font-bold">
                        <Radio className="w-3 h-3 animate-pulse" /> Đang phát
                      </span>
                    )}
                  </div>
                </div>

                {/* View A: Full Lyrics Mode (for uncalibrated songs or when user toggles) */}
                {(!hasTimedLyrics || showFullLyricsOnly) ? (
                  <div className="py-1 space-y-2">
                    <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-semibold px-0.5">
                      {activeSong.lyrics.map((l, i) => {
                        const translation = activeSong.englishTranslation?.[i];
                        const showSubtitle =
                          Boolean(translation) &&
                          (settings.storyLanguage !== 'vi' || activeSong.category === 'en_rhymes');
                        return (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-white/80 border border-slate-100 flex flex-col gap-0.5"
                          >
                            <p className="flex items-start gap-1.5 text-slate-800 leading-relaxed font-bold">
                              <span className="text-rose-400 font-black">•</span>
                              <span>{l}</span>
                            </p>
                            {showSubtitle && (
                              <p className="text-[11px] font-medium text-slate-500 pl-4 italic">
                                {translation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* View B: Strictly Calibrated Timed Karaoke View */
                  <div className="space-y-2 pt-1">
                    {/* Intro / Interlude prompt */}
                    {isPlaying && currentLineIndex === -1 && (
                      <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black flex items-center gap-1.5 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        <span>Nhạc dạo... Chuẩn bị hát nào bé ơi! ✨</span>
                      </div>
                    )}

                    {activeSong.timedLyrics?.map((line, idx) => {
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
                          className={`transition-colors duration-200 px-3 py-2 rounded-2xl flex flex-col gap-0.5 ${
                            isCurrent
                              ? 'bg-rose-500 text-white font-black shadow-sm'
                              : isPast
                              ? 'text-slate-400 bg-white/40 opacity-60'
                              : 'text-slate-700 bg-white/80'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                            {isCurrent && (
                              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse shrink-0" />
                            )}
                            <span className="leading-snug">{line.text}</span>
                          </div>

                          {/* Progressive sweep indicator */}
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

              {/* Fun Educational Note */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-2.5 text-xs text-amber-950 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">
                  <strong>Ý nghĩa:</strong> {activeSong.funFactVi}
                </p>
              </div>

              {/* Percussion Beat Rhythm Pads */}
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

        {/* RIGHT COLUMN: 44 SONGS BROWSER GRID */}
        <div className={`space-y-3 ${activeSong && !isStageCollapsed ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-600 px-1">
            <span>Danh sách bài hát ({filteredSongs.length})</span>
            <span>Chạm để phát bài</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-h-[700px] overflow-y-auto pr-0.5 scrollbar-thin">
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
                      handleTogglePlay();
                    } else {
                      startSongPlayback(song);
                    }
                  }}
                  className={`group rounded-2xl border-2 p-2.5 sm:p-3 flex items-start gap-2.5 sm:gap-3 transition-all cursor-pointer hover:shadow-sm select-none ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/60 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:border-rose-300'
                  }`}
                >
                  {/* 64px 3D Chibi Cover */}
                  <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs shrink-0 group-hover:scale-105 transition">
                    <img
                      src={coverImg}
                      alt={song.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Song Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch gap-1">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                          {song.title}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(song.id, e)}
                          className={`min-h-[44px] min-w-[44px] -mt-2 -mr-2 flex items-center justify-center cursor-pointer transition active:scale-90 ${
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

                    {/* Lyric quote preview */}
                    <p className="text-[11px] text-slate-600 italic truncate">
                      "{song.lyrics[0]}"
                    </p>

                    {/* Age Badge and Status Button */}
                    <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {song.ageBadge}
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-xl font-black text-[11px] flex items-center gap-1 transition ${
                          isCurPlaying
                            ? 'bg-rose-500 text-white'
                            : song.isVocalTrack !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-sky-100 text-sky-800 border border-sky-300'
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
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSongs.length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 space-y-2">
              <span className="text-3xl">🎵</span>
              <p className="text-sm font-bold text-slate-700">
                Không tìm thấy bài hát nào với từ khóa "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer"
              >
                Xem tất cả 44 bài hát
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. DISCREET STICKY MINI-PLAYER (Positioned strictly ABOVE the 56px bottom navigation dock) */}
      {activeSong && isStageScrolledOut && !isMiniPlayerDismissed && (
        <div className="fixed bottom-[72px] sm:bottom-20 left-2 right-2 sm:left-auto sm:right-6 sm:w-96 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-2.5 flex items-center justify-between gap-2.5 select-none animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Hairline progress bar */}
          <div className="absolute top-0 left-2.5 right-2.5 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-200"
              style={{
                width: `${Math.min(100, Math.max(0, (currentTimeSec / Math.max(1, durationSec)) * 100))}%`,
              }}
            />
          </div>

          <div
            onClick={scrollToPlayer}
            className="flex items-center gap-2 min-w-0 cursor-pointer pt-1"
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
              onClick={handleTogglePlay}
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

            <button
              type="button"
              onClick={() => setIsMiniPlayerDismissed(true)}
              className="min-h-[44px] min-w-[32px] flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer ml-1"
              aria-label="Đóng thanh phát nhanh"
              title="Đóng thanh phát nhanh"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
