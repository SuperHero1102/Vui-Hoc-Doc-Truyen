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
  BookOpen,
  X,
  Radio,
} from 'lucide-react';
import { KIDS_SONGS_DATA, type KidsSong } from '../data/kidsMusicData';
import type { ParentSettings } from '../types/learning';
import { speakTeacherVoice, stopAllAudio } from '../utils/audioEngine';
import { logActivity } from '../utils/activityTracker';
import { fireStarExplosion } from '../utils/confetti';

interface KidsMusicPlayerProps {
  settings: ParentSettings;
  childName?: string;
  onOpenParentGate?: () => void;
}

// Note frequencies map for Web Audio melody synthesis
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
};

export const KidsMusicPlayer: React.FC<KidsMusicPlayerProps> = ({
  settings,
  childName = 'Bé',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSong, setActiveSong] = useState<KidsSong | null>(KIDS_SONGS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSingAlongMode, setIsSingAlongMode] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [tempoSpeed, setTempoSpeed] = useState<number>(1);
  const [tappedBeatsCount, setTappedBeatsCount] = useState<number>(0);
  const [favoritedSongIds, setFavoritedSongIds] = useState<Record<string, boolean>>({});

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const currentSongRef = useRef<KidsSong | null>(null);
  const melodyTimeoutIdsRef = useRef<number[]>([]);
  const songStartTimeRef = useRef<number>(Date.now());

  // Filter songs
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
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playTone = (freq: number, durationSec: number, type: OscillatorType = 'triangle') => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Sweet bell-like marimba envelope
      const vol = Math.max(0.05, Math.min(0.8, settings.volume * 0.4));
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationSec + 0.05);
    } catch {
      // AudioContext unavailable
    }
  };

  const playDrumTapSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      // High percussive click + wood chime
      playTone(660, 0.12, 'sine');
      playTone(330, 0.15, 'triangle');
      setTappedBeatsCount((c) => c + 1);
      fireStarExplosion(0.5, 0.6);
    } catch {
      // ignore
    }
  };

  const stopMelody = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    melodyTimeoutIdsRef.current.forEach((id) => clearTimeout(id));
    melodyTimeoutIdsRef.current = [];
    stopAllAudio();

    // Log played duration to activityTracker
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

  const startSongPlayback = (song: KidsSong, singAlong = false) => {
    stopMelody();
    setActiveSong(song);
    currentSongRef.current = song;
    songStartTimeRef.current = Date.now();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsSingAlongMode(singAlong);
    setCurrentLineIndex(0);

    const notes = song.melodyNotes || [
      { note: 'C4', dur: 0.5 },
      { note: 'E4', dur: 0.5 },
      { note: 'G4', dur: 0.5 },
      { note: 'C5', dur: 0.8 },
    ];

    let delayMs = 0;
    const speedRatio = 1 / tempoSpeed;

    // Schedule synthesized musical notes
    notes.forEach((item, idx) => {
      const freq = NOTE_FREQS[item.note] || 330;
      const noteDur = item.dur * speedRatio;
      const tId = window.setTimeout(() => {
        if (!isPlayingRef.current) return;
        playTone(freq, noteDur, 'triangle');
        // Synchronize karaoke line highlighting
        if (song.lyrics.length > 0) {
          const lineIdx = Math.floor((idx / notes.length) * song.lyrics.length);
          setCurrentLineIndex(Math.min(lineIdx, song.lyrics.length - 1));
        }
      }, delayMs);
      melodyTimeoutIdsRef.current.push(tId);
      delayMs += Math.round(noteDur * 1000);
    });

    // Loop melody or finish
    const totalMs = delayMs + 600;
    const endId = window.setTimeout(() => {
      if (isPlayingRef.current) {
        // Repeat loop smoothly
        startSongPlayback(song, singAlong);
      }
    }, totalMs);
    melodyTimeoutIdsRef.current.push(endId);

    // If singAlong is requested, invoke teacher AI narrator reading/singing the lyrics
    if (singAlong) {
      const lang = song.category === 'en_rhymes' ? 'en' : 'vi';
      const speechSegments = song.lyrics.map((l) => ({
        lang: lang as 'vi' | 'en',
        text: l,
      }));
      speakTeacherVoice(speechSegments, settings, () => {
        if (!isPlayingRef.current) return;
      });
    }
  };

  useEffect(() => {
    return () => {
      stopMelody();
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
            Kho bài hát mầm non chuẩn giáo dục 3-5 tuổi & Nhạc đồng dao Tiếng Anh kinh điển. Giai điệu vui tươi, lời ca trong sáng, hỗ trợ bé vỗ tay theo nhịp.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[11px] font-bold">
            <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl flex items-center gap-1 text-white">
              🎶 Giai điệu mầm non chuẩn lứa tuổi
            </span>
            <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl flex items-center gap-1 text-white">
              👏 Tích hợp gõ nhịp & Hát cùng cô
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
              <div className="text-xs font-extrabold truncate">{activeSong.title}</div>
              <div className="text-[10px] text-pink-100 truncate">{activeSong.composer}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isPlaying) {
                  stopMelody();
                } else {
                  startSongPlayback(activeSong, false);
                }
              }}
              className="min-h-[44px] min-w-[44px] rounded-xl bg-white text-rose-600 hover:bg-rose-50 flex items-center justify-center shadow-sm cursor-pointer"
              aria-label={isPlaying ? 'Dừng phát nhạc' : 'Phát bài hát'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
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
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                  {activeSong.categoryLabelVi}
                </span>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900">
                  {activeSong.ageBadge}
                </span>
              </div>

              {/* Album Visual Canvas */}
              <div
                className={`w-full h-40 sm:h-48 rounded-2xl bg-gradient-to-br ${activeSong.bgGradient} flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner p-4 text-center`}
              >
                <div
                  className={`text-6xl sm:text-7xl mb-2 transition-transform ${
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
              </div>

              {/* Karaoke Lyrics Screen */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 max-h-48 overflow-y-auto space-y-2">
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Lời bài hát:</span>
                  {isPlaying && (
                    <span className="text-rose-600 flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 animate-pulse" /> Đang phát giai điệu
                    </span>
                  )}
                </div>
                <div className="space-y-1.5 pt-1">
                  {activeSong.lyrics.map((line, idx) => {
                    const isCurrent = isPlaying && currentLineIndex === idx;
                    return (
                      <p
                        key={idx}
                        className={`text-xs sm:text-sm font-bold transition-all px-2 py-1 rounded-xl ${
                          isCurrent
                            ? 'bg-rose-500 text-white font-extrabold shadow-2xs scale-[1.02]'
                            : 'text-slate-700'
                        }`}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Educational fun fact */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950 leading-relaxed">
                <strong>💡 Ý nghĩa bài hát:</strong> {activeSong.funFactVi}
              </div>

              {/* Music Player Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isPlaying && !isSingAlongMode) {
                      stopMelody();
                    } else {
                      startSongPlayback(activeSong, false);
                    }
                  }}
                  className={`min-h-[44px] px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                    isPlaying && !isSingAlongMode
                      ? 'bg-slate-900 text-white'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
                  }`}
                >
                  {isPlaying && !isSingAlongMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying && !isSingAlongMode ? 'Tạm dừng nhạc' : 'Nghe Giai Điệu'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isPlaying && isSingAlongMode) {
                      stopMelody();
                    } else {
                      startSongPlayback(activeSong, true);
                    }
                  }}
                  className={`min-h-[44px] px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                    isPlaying && isSingAlongMode
                      ? 'bg-purple-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isPlaying && isSingAlongMode ? 'Dừng đọc mẫu' : 'Bé Hát Cùng Cô'}</span>
                </button>
              </div>

              {/* Interactive Rhythmic Beat Tap Pad */}
              <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2">
                <span className="text-xs font-extrabold text-slate-700">
                  👏 Bé gõ nhịp cùng bài hát:
                </span>
                <button
                  type="button"
                  onClick={playDrumTapSound}
                  className="w-full min-h-[48px] rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-sm border-2 border-amber-500 cursor-pointer transition select-none"
                >
                  <span>🥁</span>
                  <span>Chạm vào đây để Vỗ tay / Gõ trống!</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                    +{tappedBeatsCount}
                  </span>
                </button>
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
                      stopMelody();
                    } else {
                      startSongPlayback(song, false);
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
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                          {song.title}
                        </h3>
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
                          <span>Nghe nhạc</span>
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
