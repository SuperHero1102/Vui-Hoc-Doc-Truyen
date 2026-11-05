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
  Info,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  ListMusic,
  Check,
  Copy,
  FileText,
  BookmarkCheck,
} from 'lucide-react';
import {
  KIDS_SONGS_DATA,
  type KidsSong,
  type TimedLyricLine,
  type LyricLine,
  normalizeSongLyricLines,
  parseLRC,
} from '../data/kidsMusicData';
import type { ParentSettings } from '../types/learning';
import { stopAllAudio } from '../utils/audioEngine';
import { logActivity } from '../utils/activityTracker';
import { fireStarExplosion } from '../utils/confetti';

/**
 * Hằng số bù trễ (milliseconds) nếu lời sớm hoặc muộn hơn so với nhạc.
 * Mặc định: 0ms.
 */
export const LYRIC_OFFSET_MS = 0;

interface KidsMusicPlayerProps {
  settings: ParentSettings;
  childName?: string;
  onBack?: () => void;
  onOpenParentGate?: () => void;
}

const FAVORITES_STORAGE_KEY = 'bevuihoc_favorited_songs_v4';
const RECENT_SONG_KEY = 'bevuihoc_recent_song_id_v4';

// Acoustic music box note frequencies for instrumental fallback songs (e.g. Đi học, Em yêu trường em)
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

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const KidsMusicPlayer: React.FC<KidsMusicPlayerProps> = ({
  settings,
  childName = 'Bé',
  onBack,
  onOpenParentGate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSong, setActiveSong] = useState<KidsSong>(() => {
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
  const [mobileTab, setMobileTab] = useState<'player' | 'list'>('player');

  // Quản lý dữ liệu lời đã chỉnh sửa / đánh dấu / nhập từ LRC cho từng bài hát
  const [customSongLyricsMap, setCustomSongLyricsMap] = useState<Record<string, LyricLine[]>>({});
  const [lineProgressPct, setLineProgressPct] = useState<number>(0);

  // Trạng thái công cụ "Đánh dấu lời" & "Nhập LRC"
  const [isMarkingLyricsOpen, setIsMarkingLyricsOpen] = useState<boolean>(false);
  const [markingLines, setMarkingLines] = useState<LyricLine[]>([]);
  const [currentMarkIndex, setCurrentMarkIndex] = useState<number>(0);
  const [copySuccessMsg, setCopySuccessMsg] = useState<string | null>(null);
  const [isLrcModalOpen, setIsLrcModalOpen] = useState<boolean>(false);
  const [lrcInputText, setLrcInputText] = useState<string>('');

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
  const currentSongRef = useRef<KidsSong>(activeSong);
  const melodyTimeoutIdsRef = useRef<number[]>([]);
  const songStartTimeRef = useRef<number>(Date.now());
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const activeProgressBarRef = useRef<HTMLDivElement | null>(null);
  const currentLineIndexRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);
  const karaokeListRef = useRef<HTMLDivElement | null>(null);
  const playerStageRef = useRef<HTMLDivElement | null>(null);
  const songsListSectionRef = useRef<HTMLElement | null>(null);

  const favCount = useMemo(() => {
    return Object.values(favoritedSongIds).filter(Boolean).length;
  }, [favoritedSongIds]);

  // Dynamically include "Yêu thích" category chip ONLY when user has favorited songs
  const categoryChips = useMemo(() => {
    const chips = [
      { id: 'all', label: `Tất cả (${KIDS_SONGS_DATA.length})`, icon: Music },
      { id: 'vi_all', label: 'Nhạc Việt (26)', icon: Sparkles },
      { id: 'vi_3y', label: 'Lớp 3 tuổi (10)', icon: Star },
      { id: 'vi_4y', label: 'Lớp 4 tuổi (8)', icon: Star },
      { id: 'vi_5y', label: 'Lớp 5 tuổi (8)', icon: Star },
      { id: 'en_rhymes', label: 'English (18)', icon: Headphones },
    ];
    if (favCount > 0) {
      chips.push({
        id: 'favorites',
        label: `Yêu thích (${favCount})`,
        icon: Heart,
      });
    }
    return chips;
  }, [favCount]);

  // Reset to 'all' if favorites was selected and becomes empty
  useEffect(() => {
    if (favCount === 0 && selectedCategory === 'favorites') {
      setSelectedCategory('all');
    }
  }, [favCount, selectedCategory]);

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
      setIsStageScrolledOut(rect.bottom < 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update volume live
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = isMuted ? 0 : settings.volume;
    }
  }, [settings.volume, isMuted]);

  const handleNextSong = useCallback(() => {
    if (filteredSongs.length === 0) return;
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
    if (filteredSongs.length === 0) return;
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
      { note: 'G4', dur: 0.5 },
      { note: 'E4', dur: 0.5 },
      { note: 'C4', dur: 1.0 },
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

  // Danh sách dòng lời chuẩn hóa [{start, end, vi, en}] cho bài hát hiện tại
  const currentLines: LyricLine[] = useMemo(() => {
    if (activeSong && customSongLyricsMap[activeSong.id]) {
      return customSongLyricsMap[activeSong.id];
    }
    if (!activeSong) return [];
    const normalized = normalizeSongLyricLines(activeSong);
    return Array.isArray(normalized) ? normalized : (normalized?.lines ?? []);
  }, [activeSong, customSongLyricsMap]);

  // Hàm cập nhật đồng bộ karaoke theo đúng frame hiển thị dựa trên audio.currentTime
  const updateKaraokeFrame = useCallback(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    // 1. Dùng audio.currentTime làm nguồn thời gian duy nhất cho dòng đang hát và thanh tiến độ đỏ
    const rawTime = audio.currentTime;
    setCurrentTimeSec(rawTime);

    // 6. Thêm hằng số LYRIC_OFFSET_MS (mặc định 0) để bù trễ nếu lời sớm/muộn so với nhạc
    const effectiveTime = Math.max(0, rawTime + LYRIC_OFFSET_MS / 1000);
    const lines = currentLines;
    if (lines.length === 0) return;

    // 3. Dòng đang hát = dòng có start <= currentTime < end
    let activeIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (effectiveTime >= lines[i].start && effectiveTime < lines[i].end) {
        activeIdx = i;
        break;
      }
    }

    if (activeIdx === -1) {
      if (effectiveTime < lines[0].start) {
        activeIdx = -1; // Đang dạo nhạc đầu bài
      } else if (effectiveTime >= lines[lines.length - 1].end) {
        activeIdx = lines.length; // Đã hát hết toàn bài
      }
    }

    // 4. Khi sang dòng mới: tự đổi dòng đang hát, thanh đỏ dòng mới bắt đầu từ 0%, dòng cũ chuyển sang trạng thái đã hát
    if (activeIdx !== currentLineIndexRef.current) {
      currentLineIndexRef.current = activeIdx;
      setCurrentLineIndex(activeIdx);
    }

    // Phần trăm thanh đỏ = (currentTime - start) / (end - start), giới hạn 0-100%
    let pct = 0;
    if (activeIdx >= 0 && activeIdx < lines.length) {
      const curLine = lines[activeIdx];
      const dur = curLine.end - curLine.start;
      if (dur > 0) {
        pct = Math.min(100, Math.max(0, ((effectiveTime - curLine.start) / dur) * 100));
      } else {
        pct = 100;
      }
    } else if (activeIdx >= lines.length) {
      pct = 100;
    }

    // Cập nhật trực tiếp style DOM để đạt tần số quét mượt mà 60fps/120fps không giật lag
    if (activeProgressBarRef.current) {
      activeProgressBarRef.current.style.width = `${pct}%`;
    }
    setLineProgressPct(pct);
  }, [currentLines]);

  // Vòng lặp requestAnimationFrame liên tục khi audio đang phát
  useEffect(() => {
    let animId: number | null = null;
    let isCancelled = false;

    const tick = () => {
      if (isCancelled) return;
      const audio = audioElementRef.current;
      // Nhạc đang tải/đệm hoặc tạm dừng: thanh dừng theo nhạc
      if (audio && !audio.paused && !audio.ended && audio.readyState >= 2) {
        updateKaraokeFrame();
      }
      animId = requestAnimationFrame(tick);
    };

    if (isPlaying) {
      animId = requestAnimationFrame(tick);
    } else {
      // Khi tạm dừng: dừng tick và giữ nguyên vị trí (thanh đứng yên)
      updateKaraokeFrame();
    }

    return () => {
      isCancelled = true;
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
    };
  }, [isPlaying, updateKaraokeFrame]);

  // Xử lý tab bị ẩn rồi quay lại: đọc lại currentTime ngay lập tức
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && audioElementRef.current) {
        updateKaraokeFrame();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [updateKaraokeFrame]);

  // Tự động cuộn mượt để dòng đang hát luôn nằm trong vùng nhìn thấy
  useEffect(() => {
    if (activeLineRef.current && currentLineIndex >= 0 && !showFullLyricsOnly) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentLineIndex, showFullLyricsOnly]);

  // Authoritative song starter
  const startSongPlayback = (song: KidsSong, resumeFromSec = 0) => {
    stopPlayback(false);
    const thisPlaybackId = playbackIdRef.current;

    setActiveSong(song);
    currentSongRef.current = song;
    songStartTimeRef.current = Date.now();
    setIsPlaying(true);
    setAudioErrorMsg(null);

    // Chuyển bài/lặp bài: đặt lại về 0
    currentLineIndexRef.current = -1;
    setCurrentLineIndex(-1);
    setLineProgressPct(0);
    if (activeProgressBarRef.current) {
      activeProgressBarRef.current.style.width = '0%';
    }
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
        updateKaraokeFrame();
      };

      // Sự kiện audio chuẩn: đồng bộ với nhạc đệm/tải
      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoadingAudio(false);
        updateKaraokeFrame();
      };

      audio.onpause = () => {
        setIsPlaying(false);
        updateKaraokeFrame();
      };

      audio.onwaiting = () => {
        // Nhạc đang tải/đệm: thanh dừng theo nhạc
        setIsLoadingAudio(true);
      };

      audio.onplaying = () => {
        setIsLoadingAudio(false);
        setIsPlaying(true);
        updateKaraokeFrame();
      };

      audio.onseeked = () => {
        updateKaraokeFrame();
      };

      audio.ontimeupdate = () => {
        // Mốc phụ trợ khi thời gian audio dịch chuyển
        updateKaraokeFrame();
      };

      audio.onerror = () => {
        if (playbackIdRef.current !== thisPlaybackId) return;
        setIsLoadingAudio(false);
        setIsPlaying(false);
        setAudioErrorMsg('Không thể phát tệp âm thanh này. Bé hãy bấm Thử lại hoặc nghe giai điệu nhé!');
      };

      audio.onended = () => {
        if (playbackIdRef.current !== thisPlaybackId) return;
        if (isLooping) {
          audio.currentTime = 0;
          currentLineIndexRef.current = -1;
          setCurrentLineIndex(-1);
          setLineProgressPct(0);
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
            if (err.name === 'AbortError') return;
            console.warn('Playback error, falling back to melodic synth:', err);
            setAudioErrorMsg('Tải âm thanh bị gián đoạn. Đang phát giai điệu hộp nhạc ru bé.');
            playSynthesizedAcousticMelody(song, thisPlaybackId);
          });
      }
      return;
    }

    // Track B: Instrumental acoustic melody
    playSynthesizedAcousticMelody(song, thisPlaybackId);
  };

  const handleTogglePlay = () => {
    if (!activeSong) return;
    if (isPlaying) {
      stopPlayback(true);
    } else {
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
    updateKaraokeFrame();
  };

  // Mở công cụ "Đánh dấu lời"
  const openMarkingLyricsModal = () => {
    const baseLines =
      currentLines.length > 0
        ? currentLines.map((l) => ({ ...l }))
        : activeSong.lyrics.map((t, i) => ({
            start: 0,
            end: 0,
            vi: t,
            en: activeSong.englishTranslation?.[i] || '',
          }));
    setMarkingLines(baseLines);
    setCurrentMarkIndex(0);
    setCopySuccessMsg(null);
    setIsMarkingLyricsOpen(true);
  };

  // Ghi mốc start khi chạm nút hoặc bấm Space
  const handleMarkCurrentLine = () => {
    if (markingLines.length === 0) return;
    const audio = audioElementRef.current;
    const markTime = Number((audio ? audio.currentTime : currentTimeSec).toFixed(2));

    setMarkingLines((prev) => {
      const next = [...prev];
      if (currentMarkIndex < next.length) {
        next[currentMarkIndex] = {
          ...next[currentMarkIndex],
          start: markTime,
        };
        // Tự động gán end của dòng trước đó = start của dòng hiện tại
        if (currentMarkIndex > 0) {
          next[currentMarkIndex - 1] = {
            ...next[currentMarkIndex - 1],
            end: markTime,
          };
        }
      }
      return next;
    });

    if (currentMarkIndex < markingLines.length - 1) {
      setCurrentMarkIndex((i) => i + 1);
    } else {
      // Đã đánh dấu xong dòng cuối cùng
      const audio = audioElementRef.current;
      const finalEnd = audio?.duration ? Number(audio.duration.toFixed(2)) : markTime + 4.0;
      setMarkingLines((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        if (lastIdx >= 0) {
          next[lastIdx] = { ...next[lastIdx], end: finalEnd };
        }
        return next;
      });
    }
  };

  // Áp dụng mảng lời vừa đánh dấu vào bài hát
  const handleApplyMarkedLyrics = () => {
    if (!activeSong) return;
    setCustomSongLyricsMap((prev) => ({
      ...prev,
      [activeSong.id]: markingLines,
    }));
    setIsMarkingLyricsOpen(false);
    updateKaraokeFrame();
  };

  // Nhập từ định dạng LRC hoặc JSON
  const handleApplyLrcText = () => {
    if (!activeSong || !lrcInputText.trim()) return;
    try {
      const trimmed = lrcInputText.trim();
      let parsed: LyricLine[] = [];
      if (trimmed.startsWith('[')) {
        try {
          const jsonArr = JSON.parse(trimmed);
          if (Array.isArray(jsonArr) && jsonArr.length > 0 && typeof jsonArr[0].start === 'number') {
            parsed = jsonArr;
          }
        } catch {
          // không phải JSON, chuyển tiếp parseLRC
        }
      }
      if (parsed.length === 0) {
        parsed = parseLRC(trimmed, activeSong.englishTranslation);
      }
      if (parsed.length > 0) {
        setCustomSongLyricsMap((prev) => ({
          ...prev,
          [activeSong.id]: parsed,
        }));
        setIsLrcModalOpen(false);
        setLrcInputText('');
        updateKaraokeFrame();
      } else {
        alert('Không tìm thấy mốc thời gian hợp lệ trong định dạng LRC hoặc JSON.');
      }
    } catch {
      alert('Định dạng chưa đúng, vui lòng kiểm tra lại.');
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
    setMobileTab('player');
    setIsStageCollapsed(false);
    playerStageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 1. Category click: immediately switches category, reveals song list below, and scrolls it into view
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setMobileTab('list');
    setTimeout(() => {
      songsListSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  // 2. Shuffle click: toggles shuffle mode for upcoming songs without interrupting the current song
  const handleShuffleClick = () => {
    if (isLooping) return; // Must turn off repeat first
    setIsShuffle((prev) => !prev);
  };

  // 3. Repeat click: toggles looping of the current song; only allowed when shuffle (isShuffle) is OFF
  const handleToggleLoop = () => {
    if (isShuffle) return; // Must turn off shuffle first

    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    if (audioElementRef.current) {
      audioElementRef.current.loop = nextLoop;
    }
  };

  // 4. Mute click: toggles mute/unmute on the speaker
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioElementRef.current) {
      audioElementRef.current.muted = nextMuted;
      audioElementRef.current.volume = nextMuted ? 0 : settings.volume;
    }
  };

  const hasTimedLyrics = Boolean(activeSong?.timedLyrics && activeSong.timedLyrics.length > 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 pb-24 px-1 sm:px-3 select-none font-sans overflow-x-hidden">
      {/* Marquee Keyframes for Left-to-Right Title Motion */}
      <style>{`
        @keyframes marqueeLeftToRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-l2r {
          display: inline-flex;
          animation: marqueeLeftToRight 14s linear infinite;
        }
      `}</style>

      {/* 1. STICKY TOP APP BAR (Always visible, safe tap target >= 44px, zero horizontal overflow) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md -mx-1 sm:-mx-3 px-2 sm:px-4 py-2 border-b border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
          {/* Left: Prominent Back button with ArrowLeft & clear label */}
          <div className="flex items-center gap-2 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={() => {
                  stopPlayback(false);
                  onBack();
                }}
                className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 active:scale-95 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs border border-rose-200 cursor-pointer transition shrink-0"
                title="Quay lại sân chơi chính"
                aria-label="Quay lại"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                <span className="font-bold">Quay lại</span>
              </button>
            )}

            {/* Title with Left-to-Right Animated Marquee showing current active song */}
            <div className="min-w-0 max-w-[170px] xs:max-w-[240px] sm:max-w-[340px] md:max-w-[440px]">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-xl bg-rose-500 text-white shrink-0">
                  <Music className="w-3.5 h-3.5" />
                </span>
                <div className="overflow-hidden relative w-full select-none" title={activeSong.title}>
                  <div className="inline-flex whitespace-nowrap animate-marquee-l2r items-center gap-3 text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    <span>{activeSong.title}</span>
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{activeSong.title}</span>
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{activeSong.title}</span>
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{activeSong.title}</span>
                    <span className="text-rose-400 font-bold">•</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate hidden xs:block">
                {activeSong.categoryLabelVi} · {activeSong.composer}
              </p>
            </div>
          </div>

          {/* Right: Mobile View Tabs & Quick Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Tab Toggle: Player vs List */}
            <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setMobileTab('player')}
                className={`min-h-[40px] px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition ${
                  mobileTab === 'player'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Xem Bàn hát & Lời ca"
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hát Karaoke</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('list')}
                className={`min-h-[40px] px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition ${
                  mobileTab === 'list'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Xem Danh sách bài hát"
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Danh sách</span>
              </button>
            </div>

            {/* Desktop Stage Collapse/Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsStageCollapsed((prev) => !prev)}
              className="hidden lg:flex min-h-[44px] px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold items-center gap-1.5 cursor-pointer transition active:scale-95 border border-slate-200"
              title={isStageCollapsed ? 'Mở rộng bàn phát' : 'Thu gọn bàn phát'}
            >
              {isStageCollapsed ? (
                <>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                  <span>Mở bàn phát</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4 text-slate-600" />
                  <span>Thu gọn</span>
                </>
              )}
            </button>

            {/* Quick Play/Pause on Header */}
            <button
              type="button"
              onClick={() => {
                if (!isPlaying) handleTogglePlay();
                else handleTogglePlay();
              }}
              className="min-h-[44px] px-3 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition cursor-pointer"
              title={isPlaying ? 'Tạm dừng bài hát' : 'Phát bài hát'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">Dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span className="hidden sm:inline">Phát</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. CATEGORY CHIPS & SEARCH BAR (Fluid, touch friendly, no auto-zoom on mobile) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto touch-pan-x pb-1 scrollbar-none">
          {categoryChips.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            const Icon = chip.icon;

            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleSelectCategory(chip.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-xs font-black'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-rose-500'}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input with 16px font on mobile to prevent iOS Safari auto-zoom */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên bài, lời ca, nhạc sĩ..."
            className="w-full min-h-[44px] pl-9 pr-9 text-base md:text-xs font-medium rounded-2xl bg-white border border-slate-200/90 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition"
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

      {/* 3. MAIN WORKSPACE: 2-COLUMN ON DESKTOP, TABBED/FLUID ON MOBILE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start" ref={playerStageRef}>
        {/* LEFT COLUMN: ACTIVE PLAYER STAGE & KARAOKE (Always visible on desktop if not collapsed; controlled by mobileTab on mobile) */}
        {(!isStageCollapsed || mobileTab === 'player') && (
          <aside
            className={`lg:col-span-5 flex flex-col gap-3 ${
              mobileTab === 'player' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="rounded-3xl bg-white border border-slate-200/90 p-3 sm:p-4.5 shadow-xs space-y-3">
              {/* Header Info Badges */}
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 truncate max-w-[200px]">
                  {activeSong.categoryLabelVi}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {activeSong.isVocalTrack !== false ? (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Headphones className="w-3 h-3" /> Ca sĩ hát
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-xl bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1">
                      <Music className="w-3 h-3" /> Nghe giai điệu
                    </span>
                  )}
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-xl bg-amber-100 text-amber-900">
                    {activeSong.ageBadge}
                  </span>
                </div>
              </div>

              {/* Artwork & Title Card (Side-by-side compact layout, zero overflow) */}
              <div className="flex items-center gap-3 bg-gradient-to-br from-rose-50/70 to-amber-50/50 p-2.5 rounded-2xl border border-rose-100">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-2xs border border-white bg-slate-100 shrink-0">
                  <img
                    src={activeSong.cover || `/assets/music/covers/music_cover_${activeSong.id}.webp`}
                    alt={activeSong.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute top-1.5 right-1.5 bg-slate-900/80 backdrop-blur-md text-white p-1 rounded-full animate-spin [animation-duration:5s]">
                      <Disc3 className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                  )}
                  {isLoadingAudio && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-1">
                      <RefreshCw className="w-4 h-4 animate-spin text-rose-300" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug line-clamp-2">
                    {activeSong.title}
                  </h2>
                  {activeSong.subtitleEn && (
                    <p className="text-xs text-rose-600 font-bold truncate">{activeSong.subtitleEn}</p>
                  )}
                  <p className="text-[11px] text-slate-500 font-medium truncate">{activeSong.composer}</p>

                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(activeSong.id, e)}
                      className={`min-h-[36px] px-2.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold cursor-pointer transition ${
                        favoritedSongIds[activeSong.id]
                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          favoritedSongIds[activeSong.id] ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                        }`}
                      />
                      <span>{favoritedSongIds[activeSong.id] ? 'Đã thích' : 'Yêu thích'}</span>
                    </button>

                    {activeSong.isVocalTrack === false && (
                      <span className="text-[10px] text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-lg font-bold">
                        Hộp nhạc ru
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Notice with Friendly Retry */}
              {audioErrorMsg && (
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">{audioErrorMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => startSongPlayback(activeSong)}
                    className="min-h-[36px] px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] shrink-0 cursor-pointer shadow-2xs"
                  >
                    Thử lại 🔄
                  </button>
                </div>
              )}

              {/* Scrubbable Range Progress Bar */}
              <div className="space-y-1 px-0.5">
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={durationSec > 0 ? durationSec : 100}
                    value={currentTimeSec}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
                    aria-label="Thanh tua thời gian bài hát"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums">
                  <span>{formatTime(currentTimeSec)}</span>
                  <span>{formatTime(durationSec)}</span>
                </div>
              </div>

              {/* Playback Controls (Touch target >= 44px, kid-friendly buttons) */}
              <div className="flex items-center justify-between gap-1 pt-0.5">
                {/* Shuffle */}
                <button
                  type="button"
                  onClick={handleShuffleClick}
                  disabled={isLooping}
                  className={`min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center transition active:scale-95 border ${
                    isShuffle
                      ? 'bg-rose-50 border-rose-300 text-rose-600 font-bold shadow-2xs cursor-pointer'
                      : isLooping
                      ? 'bg-slate-50/60 border-slate-200/60 text-slate-300 cursor-not-allowed opacity-40'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 cursor-pointer'
                  }`}
                  title={
                    isShuffle
                      ? 'Đang bật trộn bài cho bài tiếp theo (bấm để tắt)'
                      : isLooping
                      ? 'Hãy tắt nút Lặp lại trước khi bật Trộn bài'
                      : 'Bật trộn bài cho bài tiếp theo'
                  }
                  aria-label={isShuffle ? 'Tắt trộn bài' : 'Bật trộn bài cho bài tiếp theo'}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                {/* Prev */}
                <button
                  type="button"
                  onClick={handlePrevSong}
                  className="min-h-[44px] min-w-[44px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-95 border border-slate-200"
                  title="Bài trước đó"
                  aria-label="Bài trước đó"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Big Center Play / Pause */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className={`min-h-[48px] px-5 sm:px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-95 ${
                    isPlaying
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                      : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                  }`}
                  title={isPlaying ? 'Tạm dừng' : 'Phát bài hát'}
                  aria-label={isPlaying ? 'Tạm dừng bài hát' : 'Phát bài hát'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>Tạm Dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                      <span>Hát Cùng Bé</span>
                    </>
                  )}
                </button>

                {/* Next */}
                <button
                  type="button"
                  onClick={handleNextSong}
                  className="min-h-[44px] min-w-[44px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-95 border border-slate-200"
                  title="Bài tiếp theo"
                  aria-label="Bài tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Loop */}
                <button
                  type="button"
                  onClick={handleToggleLoop}
                  disabled={isShuffle}
                  className={`min-h-[44px] min-w-[44px] rounded-2xl border flex items-center justify-center transition active:scale-95 ${
                    isLooping
                      ? 'bg-rose-50 border-rose-300 text-rose-600 font-bold shadow-2xs cursor-pointer'
                      : isShuffle
                      ? 'bg-slate-50/60 border-slate-200/60 text-slate-300 cursor-not-allowed opacity-40'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 cursor-pointer'
                  }`}
                  title={
                    isLooping
                      ? 'Đang bật lặp lại bài hát (bấm để tắt)'
                      : isShuffle
                      ? 'Hãy tắt nút Trộn bài trước khi bật Lặp lại'
                      : 'Lặp lại bài hát hiện tại'
                  }
                  aria-label={isLooping ? 'Tắt lặp lại' : 'Bật lặp lại'}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Mute */}
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className={`min-h-[44px] min-w-[44px] rounded-2xl border flex items-center justify-center cursor-pointer transition active:scale-95 ${
                    isMuted
                      ? 'bg-amber-100 border-amber-300 text-amber-700 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                  title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
                  aria-label="Tắt hoặc bật tiếng"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* 4. SMART KARAOKE & LYRICS BOX */}
              <div
                ref={karaokeListRef}
                className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 max-h-56 sm:max-h-64 overflow-y-auto space-y-2 select-none scrollbar-thin"
              >
                {/* Mode toggle bar */}
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between gap-1 flex-wrap pb-1 border-b border-slate-200/60">
                  <span className="flex items-center gap-1.5">
                    {showFullLyricsOnly ? (
                      <>
                        <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-slate-700 font-black">Lời Bài Hát:</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-rose-600" />
                        <span className="text-rose-700 font-black">Karaoke Đồng Bộ:</span>
                      </>
                    )}
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowFullLyricsOnly((v) => !v)}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer min-h-[30px] flex items-center px-1"
                    >
                      {showFullLyricsOnly ? '🎤 Bật karaoke' : '📖 Xem toàn bài'}
                    </button>
                    <button
                      type="button"
                      onClick={openMarkingLyricsModal}
                      className="px-2 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-black cursor-pointer flex items-center gap-1 transition"
                      title="Chế độ đánh dấu mốc thời gian lời bài hát"
                    >
                      <BookmarkCheck className="w-3 h-3" />
                      <span>Đánh dấu lời</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLrcModalOpen(true)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer flex items-center gap-1 transition"
                      title="Nhập lời từ định dạng LRC hoặc JSON"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Nhập LRC</span>
                    </button>
                    {isPlaying && (
                      <span className="text-rose-600 flex items-center gap-1 text-[10px] font-bold pl-1">
                        <Radio className="w-3 h-3 animate-pulse" /> Đang hát
                      </span>
                    )}
                  </div>
                </div>

                {/* View A: Full Lyrics Mode */}
                {showFullLyricsOnly ? (
                  <div className="py-1 space-y-2">
                    <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-semibold px-0.5">
                      {currentLines.map((l, i) => {
                        const showSubtitle =
                          Boolean(l.en) &&
                          (settings.storyLanguage !== 'vi' || activeSong.category === 'en_rhymes');
                        return (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-white/80 border border-slate-100 flex flex-col gap-0.5"
                          >
                            <p className="flex items-start gap-1.5 text-slate-800 leading-relaxed font-bold">
                              <span className="text-rose-400 font-black">•</span>
                              <span>{l.vi}</span>
                            </p>
                            {showSubtitle && (
                              <p className="text-[11px] font-medium text-slate-500 pl-4 italic">
                                {l.en}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* View B: Karaoke Synchronized View */
                  <div className="space-y-2 pt-1">
                    {/* Intro Music prompt */}
                    {isPlaying && currentLineIndex === -1 && (
                      <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black flex items-center gap-1.5 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        <span>Nhạc dạo... Bé cùng lắng nghe giai điệu nhé! ✨</span>
                      </div>
                    )}

                    {currentLines.map((line, idx) => {
                      const isCurrent = isPlaying && currentLineIndex === idx;
                      const isPast = isPlaying && currentLineIndex > idx;
                      const showSubtitle =
                        Boolean(line.en) &&
                        (settings.storyLanguage !== 'vi' || activeSong.category === 'en_rhymes');

                      return (
                        <div
                          key={idx}
                          ref={isCurrent ? activeLineRef : null}
                          className={`transition-colors duration-150 px-3 py-2 rounded-2xl flex flex-col gap-1 border ${
                            isCurrent
                              ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-200/70 shadow-xs text-rose-950 font-black scale-[1.01]'
                              : isPast
                              ? 'text-slate-400 bg-white/40 border-slate-100 opacity-60'
                              : 'text-slate-700 bg-white/80 border-slate-200/70'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                              {isCurrent ? (
                                <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-bounce shrink-0" />
                              ) : isPast ? (
                                <span className="w-4 h-4 text-emerald-500 text-xs font-black shrink-0 flex items-center justify-center">
                                  ✓
                                </span>
                              ) : (
                                <span className="w-4 h-4 text-slate-300 text-[10px] font-bold shrink-0 flex items-center justify-center">
                                  {idx + 1}
                                </span>
                              )}
                              <span className="leading-snug">{line.vi}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0 tabular-nums">
                              {formatTime(line.start)}
                            </span>
                          </div>

                          {/* Thanh tiến độ đỏ chuẩn hóa: Cập nhật 100% bằng audio.currentTime qua RAF */}
                          {isCurrent && (
                            <div className="w-full h-2 bg-slate-200/90 rounded-full overflow-hidden mt-1 relative">
                              <div
                                ref={activeProgressBarRef}
                                className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full will-change-[width]"
                                style={{ width: `${lineProgressPct}%` }}
                              />
                            </div>
                          )}

                          {showSubtitle && (
                            <div
                              className={`text-[11px] font-medium pl-5 italic ${
                                isCurrent ? 'text-rose-700 font-semibold' : 'text-slate-400'
                              }`}
                            >
                              {line.en}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Educational Meaning Callout */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-2.5 text-xs text-amber-950 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">
                  <strong>Ý nghĩa bài hát:</strong> {activeSong.funFactVi}
                </p>
              </div>

              {/* Kid-Friendly Rhythm Beat Pad (Tap for sound & star sparks) */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-0.5">
                  <span>Gõ nhịp vui nhộn cùng bé:</span>
                  <span className="text-amber-600 font-extrabold">{tappedBeatsCount} nhịp 🌟</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => playPercussionSound('drum')}
                    className="min-h-[44px] rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs flex flex-col items-center justify-center gap-0.5 shadow-2xs border border-amber-500 cursor-pointer transition select-none"
                  >
                    <span>🥁 Trống Bùm</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => playPercussionSound('bell')}
                    className="min-h-[44px] rounded-2xl bg-pink-400 hover:bg-pink-300 active:scale-95 text-slate-950 font-black text-xs flex flex-col items-center justify-center gap-0.5 shadow-2xs border border-pink-500 cursor-pointer transition select-none"
                  >
                    <span>🔔 Chuông Kính</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => playPercussionSound('wood')}
                    className="min-h-[44px] rounded-2xl bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-slate-950 font-black text-xs flex flex-col items-center justify-center gap-0.5 shadow-2xs border border-emerald-500 cursor-pointer transition select-none"
                  >
                    <span>🪵 Mõ Cốc</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* RIGHT COLUMN: CURATED 44 SONGS GRID (Always visible on desktop; controlled by mobileTab on mobile) */}
        <section
          ref={songsListSectionRef}
          className={`flex-1 min-w-0 ${
            mobileTab === 'list' ? 'block' : 'hidden lg:block'
          } ${isStageCollapsed ? 'lg:col-span-12' : 'lg:col-span-7'}`}
        >
          {/* Header count & Category indicator */}
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-700 flex items-center gap-1.5">
              <span>Danh sách bài hát</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black">
                {filteredSongs.length} bài
              </span>
            </h3>

            {/* Mobile jump to karaoke player */}
            <button
              type="button"
              onClick={() => {
                setMobileTab('player');
                setIsStageCollapsed(false);
              }}
              className="lg:hidden text-xs font-extrabold text-rose-600 hover:underline flex items-center gap-1"
            >
              <span>Xem bàn hát</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Responsive Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
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
                    } else if (isSelected && !isCurPlaying) {
                      handleTogglePlay();
                    } else {
                      startSongPlayback(song);
                      if (window.innerWidth < 1024) {
                        setMobileTab('player');
                        setIsStageCollapsed(false);
                      }
                    }
                  }}
                  className={`group rounded-2xl p-2.5 sm:p-3 border transition-all cursor-pointer select-none flex items-center justify-between gap-2.5 active:scale-[0.99] ${
                    isSelected
                      ? 'bg-rose-50/90 border-rose-400 shadow-sm ring-2 ring-rose-200'
                      : 'bg-white border-slate-200/90 hover:border-rose-300 hover:shadow-xs'
                  }`}
                >
                  {/* Left: Thumbnail with Play Indicator */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs shrink-0 group-hover:scale-105 transition">
                    <img
                      src={coverImg}
                      alt={song.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                        isCurPlaying
                          ? 'bg-rose-600/70 text-white opacity-100'
                          : 'bg-black/30 text-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isCurPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Middle: Title, Composer, Category Badge */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4
                        className={`text-xs sm:text-sm font-black truncate ${
                          isSelected ? 'text-rose-700' : 'text-slate-900'
                        }`}
                      >
                        {song.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium truncate">{song.composer}</p>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                        {song.ageBadge}
                      </span>
                      {song.isVocalTrack !== false ? (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                          Ca sĩ
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-sky-100 text-sky-800">
                          Giai điệu
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Favorite Button (>= 44px hit target) */}
                  <div className="shrink-0 flex items-center">
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(song.id, e)}
                      className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center cursor-pointer transition active:scale-90 ${
                        isFav ? 'text-rose-500 hover:text-rose-600' : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                      aria-label="Yêu thích"
                    >
                      <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty Search Result Fallback */}
          {filteredSongs.length === 0 && (
            <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center space-y-2 mt-4">
              <span className="text-3xl">🔍</span>
              <h4 className="text-sm font-bold text-slate-800">Không tìm thấy bài hát phù hợp</h4>
              <p className="text-xs text-slate-500">
                Bé hoặc cha mẹ hãy thử từ khóa khác hoặc xóa bộ lọc nhé!
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
        </section>
      </div>

      {/* 5. FLOATING MINI-PLAYER (Only when stage has scrolled out of view, safely above dock) */}
      {isStageScrolledOut && !isMiniPlayerDismissed && (
        <div className="fixed bottom-16 sm:bottom-20 left-2 right-2 sm:left-auto sm:right-6 sm:w-80 md:w-96 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-2.5 flex items-center justify-between gap-2.5 select-none animate-in fade-in slide-in-from-bottom-2 duration-200">
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

      {/* MODAL 1: CHẾ ĐỘ ĐÁNH DẤU LỜI BÀI HÁT */}
      {isMarkingLyricsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-rose-200 max-h-[92vh] flex flex-col space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-rose-500" />
                  <span>Đánh dấu lời: {activeSong.title}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Vừa nghe vừa chạm nút mỗi khi một dòng bắt đầu để ghi mốc start chính xác
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMarkingLyricsOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Audio Control & Time Bar */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="min-h-[40px] px-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  <span>{isPlaying ? 'Tạm dừng' : 'Phát nhạc'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSeek(0)}
                  className="min-h-[40px] px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
                  title="Về đầu bài (00:00)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-right">
                <div className="text-base font-black font-mono text-rose-600 tabular-nums">
                  {currentTimeSec.toFixed(2)}s
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {formatTime(currentTimeSec)} / {formatTime(durationSec)}
                </div>
              </div>
            </div>

            {/* Big Tap-to-Mark Button */}
            <button
              type="button"
              onClick={handleMarkCurrentLine}
              className="w-full min-h-[52px] rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 hover:brightness-105 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition cursor-pointer select-none"
            >
              <Star className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
              <span>
                Chạm để đánh dấu Bắt Đầu Dòng {Math.min(currentMarkIndex + 1, markingLines.length)}/
                {markingLines.length} ({currentTimeSec.toFixed(2)}s)
              </span>
            </button>

            {/* Lines List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 border border-slate-200 rounded-2xl p-2.5 bg-slate-50/60 max-h-48 scrollbar-thin">
              {markingLines.map((line, idx) => {
                const isTarget = idx === currentMarkIndex;
                const isMarked = line.start > 0 || line.end > 0;
                return (
                  <div
                    key={idx}
                    onClick={() => setCurrentMarkIndex(idx)}
                    className={`p-2 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                      isTarget
                        ? 'bg-rose-50 border-rose-400 font-black text-rose-950 ring-2 ring-rose-200'
                        : isMarked
                        ? 'bg-white border-slate-200 text-slate-800 font-medium'
                        : 'bg-white/60 border-slate-200/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{line.vi}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono tabular-nums">
                      <span>{line.start.toFixed(2)}s</span>
                      <span className="text-slate-300">→</span>
                      <span>{line.end.toFixed(2)}s</span>
                      {isMarked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* JSON Output View */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>Mảng JSON kết quả [{`{start, end, vi, en}`}]</span>
                {copySuccessMsg && <span className="text-emerald-600 font-extrabold">{copySuccessMsg}</span>}
              </div>
              <textarea
                readOnly
                value={JSON.stringify(markingLines, null, 2)}
                className="w-full h-24 p-2 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] border border-slate-800 select-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(markingLines, null, 2));
                    setCopySuccessMsg('✓ Đã sao chép vào bộ nhớ tạm!');
                    setTimeout(() => setCopySuccessMsg(null), 2500);
                  }}
                  className="min-h-[40px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMarkingLines(
                      activeSong.lyrics.map((t, i) => ({
                        start: 0,
                        end: 0,
                        vi: t,
                        en: activeSong.englishTranslation?.[i] || '',
                      }))
                    );
                    setCurrentMarkIndex(0);
                  }}
                  className="min-h-[40px] px-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Đặt lại
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyMarkedLyrics}
                  className="min-h-[40px] px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Áp dụng ngay cho bài này</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMarkingLyricsOpen(false)}
                  className="min-h-[40px] px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NHẬP ĐỊNH DẠNG LRC HOẶC JSON */}
      {isLrcModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <span>Nhập lời từ file LRC hoặc JSON</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Dán nội dung LRC chuẩn [mm:ss.xx] hoặc mảng JSON [{`{start, end, vi, en}`}]
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLrcModalOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={lrcInputText}
              onChange={(e) => setLrcInputText(e.target.value)}
              placeholder="Ví dụ định dạng LRC:&#10;[00:14.80]Cháu lên ba cháu đi mẫu giáo&#10;[00:18.80]Cô thương cháu vì cháu không khóc nhè&#10;&#10;Hoặc JSON:&#10;[{ &quot;start&quot;: 14.8, &quot;end&quot;: 18.8, &quot;vi&quot;: &quot;Cháu lên ba...&quot; }]"
              className="w-full h-44 p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 focus:outline-rose-500 resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsLrcModalOpen(false)}
                className="min-h-[40px] px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyLrcText}
                className="min-h-[40px] px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black shadow-xs cursor-pointer active:scale-95"
              >
                Chuyển đổi & Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
