import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Maximize2,
  Minimize2,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import type { ParentSettings, StoryBookItem, StorySegmentToSpeak } from '../types/learning';
import { getStoryPhotoInfo, getStoryRealisticPhoto } from '../data/storyPhotosData';
import {
  fetchOrGetCachedSegmentUrl,
  playCelebrationChime,
  speakStoryNarration,
  startBackgroundAudioKeepAlive,
  stopAllAudio,
  stopBackgroundAudioKeepAlive,
} from '../utils/audioEngine';
import { fireFireworksCelebration } from '../utils/confetti';

interface StoryReaderModalProps {
  story: StoryBookItem;
  settings: ParentSettings;
  onClose: () => void;
  onSelectAnotherStory?: (story: StoryBookItem) => void;
}

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({
  story,
  settings,
  onClose,
}) => {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSpeechIdx, setActiveSpeechIdx] = useState<number | null>(null);
  const [showMoralModal, setShowMoralModal] = useState(false);
  const [userStoryLang, setUserStoryLang] = useState<'vi' | 'en' | 'bilingual'>(
    settings.storyLanguage || 'bilingual'
  );
  const [nightMode, setNightMode] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  const totalPages = story.pages.length;
  const currentPage = story.pages[currentPageIdx] || story.pages[0];

  // Request screen wake lock for comfortable bedtime story listening
  useEffect(() => {
    let released = false;
    const requestLock = async () => {
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
        try {
          const lock = await (navigator as any).wakeLock.request('screen');
          if (!released) {
            wakeLockRef.current = lock;
          } else {
            lock.release();
          }
        } catch {
          // ignore
        }
      }
    };
    requestLock();

    return () => {
      released = true;
      if (wakeLockRef.current) {
        try {
          wakeLockRef.current.release();
        } catch {
          // ignore
        }
        wakeLockRef.current = null;
      }
    };
  }, []);

  // Continuous background audio keep-alive while isPlaying is active
  useEffect(() => {
    if (isPlaying) {
      startBackgroundAudioKeepAlive();
    } else {
      stopBackgroundAudioKeepAlive();
    }
    return () => {
      stopBackgroundAudioKeepAlive();
    };
  }, [isPlaying]);

  // Configure Media Session API for background / screen-off narration and lock-screen controls
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: story.titleVi,
          artist: 'VUI HỌC - Bé Nghe Truyện',
          album: `Trang ${currentPageIdx + 1}/${totalPages} · ${story.moralBadgeVi}`,
          artwork: [
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        });
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

        navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
        navigator.mediaSession.setActionHandler('pause', () => {
          setIsPlaying(false);
          stopAllAudio();
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          if (currentPageIdx > 0) setCurrentPageIdx((p) => p - 1);
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          if (currentPageIdx < totalPages - 1) setCurrentPageIdx((p) => p + 1);
        });
      } catch {
        // ignore
      }
    }
  }, [story, currentPageIdx, totalPages, isPlaying]);

  // Pre-fetch next page audio in the background for zero-delay instant transition
  useEffect(() => {
    if (currentPageIdx < totalPages - 1) {
      const nextPage = story.pages[currentPageIdx + 1];
      if (nextPage) {
        const textsToFetch = [nextPage.textVi];
        if (nextPage.dialogues) {
          for (const d of nextPage.dialogues) {
            textsToFetch.push(d.textVi);
          }
        }
        for (const t of textsToFetch) {
          fetchOrGetCachedSegmentUrl({ text: t, lang: 'vi' }, settings).catch(() => {});
        }
      }
    }
  }, [currentPageIdx, story, totalPages, settings]);

  // Build segments to speak for the current page based on parent language settings
  const speechSegments = useMemo(() => {
    if (!currentPage) return [];
    const list: StorySegmentToSpeak[] = [];

    // Title intro on first page
    if (currentPageIdx === 0) {
      if (userStoryLang === 'vi' || userStoryLang === 'bilingual') {
        list.push({
          text: `Truyện: ${story.titleVi}.`,
          lang: 'vi',
          speaker: 'Người kể',
          voiceStyle: 'narrator',
        });
      }
      if (userStoryLang === 'en') {
        list.push({
          text: `Story: ${story.titleEn}.`,
          lang: 'en',
          speaker: 'Narrator',
          voiceStyle: 'narrator',
        });
      }
    }

    // Page Narration text
    if (userStoryLang === 'en') {
      list.push({
        text: currentPage.textEn,
        lang: 'en',
        speaker: 'Narrator',
        voiceStyle: 'narrator',
      });
    } else if (userStoryLang === 'vi') {
      list.push({
        text: currentPage.textVi,
        lang: 'vi',
        speaker: 'Người kể',
        voiceStyle: 'narrator',
      });
    } else {
      // Bilingual mode: English first, then Vietnamese interpretation
      list.push({
        text: currentPage.textEn,
        lang: 'en',
        speaker: 'Narrator',
        voiceStyle: 'narrator',
      });
      list.push({
        text: currentPage.textVi,
        lang: 'vi',
        speaker: 'Người kể',
        voiceStyle: 'narrator',
      });
    }

    // Character Dialogues: Speak directly in the character's voice for vivid, cute storytelling
    if (currentPage.dialogues && currentPage.dialogues.length > 0) {
      for (const d of currentPage.dialogues) {
        if (userStoryLang === 'en') {
          list.push({
            text: d.textEn,
            lang: 'en',
            speaker: d.speaker,
            voiceStyle: d.voiceStyle || 'child',
          });
        } else if (userStoryLang === 'vi') {
          list.push({
            text: d.textVi,
            lang: 'vi',
            speaker: d.speaker,
            voiceStyle: d.voiceStyle || 'child',
          });
        } else {
          list.push({
            text: d.textEn,
            lang: 'en',
            speaker: d.speaker,
            voiceStyle: d.voiceStyle || 'child',
          });
          list.push({
            text: d.textVi,
            lang: 'vi',
            speaker: d.speaker,
            voiceStyle: d.voiceStyle || 'child',
          });
        }
      }
    }

    return list;
  }, [currentPage, currentPageIdx, story, userStoryLang]);

  // Read speech segments sequentially with screen-off persistence
  useEffect(() => {
    if (!isPlaying || speechSegments.length === 0) {
      stopAllAudio();
      return;
    }

    let isMounted = true;
    speakStoryNarration(
      speechSegments,
      settings,
      (idx) => {
        if (isMounted) setActiveSpeechIdx(idx);
      },
      () => {
        if (!isMounted) return;
        setActiveSpeechIdx(null);
        // Automatically advance to next page to read the entire story from start to finish!
        if (currentPageIdx < totalPages - 1) {
          // Brief 250ms breath so audio does not cut out when screen is locked/turned off
          window.setTimeout(() => {
            if (isMounted && isPlaying) {
              setCurrentPageIdx((p) => p + 1);
            }
          }, 250);
        } else {
          // Finished entire story! Show Moral Lesson
          setIsPlaying(false);
          stopAllAudio();
          stopBackgroundAudioKeepAlive();
          playCelebrationChime(settings.volume);
          fireFireworksCelebration();
          setShowMoralModal(true);
        }
      }
    );

    return () => {
      isMounted = false;
      stopAllAudio();
    };
  }, [currentPageIdx, isPlaying, speechSegments, totalPages, settings]);

  // Instantaneous Left-to-Right Swipe Gesture to exit back to main playground
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (
      touchStartXRef.current !== null &&
      touchStartYRef.current !== null &&
      e.changedTouches.length === 1
    ) {
      const dx = e.changedTouches[0].clientX - touchStartXRef.current;
      const dy = e.changedTouches[0].clientY - touchStartYRef.current;
      // Swipe left-to-right: edge swipe dx >= 50 or standard rightward travel dx >= 80
      const isEdgeSwipe = touchStartXRef.current < 90 && dx >= 50 && Math.abs(dy) < 80;
      const isStandardSwipe = dx >= 80 && Math.abs(dy) < 65;
      if (isEdgeSwipe || isStandardSwipe) {
        stopAllAudio();
        onClose();
        return;
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAllAudio();
    } else {
      setIsPlaying(true);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      setCurrentPageIdx((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIdx < totalPages - 1) {
      setCurrentPageIdx((p) => p + 1);
    } else {
      setShowMoralModal(true);
    }
  };

  const handleReplayPage = () => {
    stopAllAudio();
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-50 flex flex-col select-none overflow-hidden transition-colors duration-300 ${
        nightMode ? 'bg-[#0F172A] text-slate-100' : 'bg-[#FFFDF7] text-slate-900'
      }`}
    >
      {/* 1. Top Story Reader Navigation Bar */}
      <div
        className={`w-full flex items-center justify-between px-3 sm:px-6 py-2.5 border-b shadow-2xs shrink-0 ${
          nightMode
            ? 'bg-[#1E293B]/90 border-slate-700/80'
            : 'bg-white/95 border-amber-200/80'
        }`}
      >
        {/* Left: Rounded Back Button with Swipe Hint */}
        <button
          type="button"
          onClick={() => {
            stopAllAudio();
            onClose();
          }}
          className={`min-h-[42px] px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs sm:text-sm font-black transition cursor-pointer active:scale-95 shadow-2xs ${
            nightMode
              ? 'bg-slate-800 text-sky-400 hover:bg-slate-700 border border-slate-700'
              : 'bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0284C7] border border-[#38BDF8]'
          }`}
          title="Thoát ra màn hình chính (Bé có thể vuốt phải 👉)"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          <span>Thoát</span>
          <span className="hidden sm:inline text-[11px] font-bold text-sky-600/80">
            (vuốt phải 👉)
          </span>
        </button>

        {/* Center: Story Title + Page Badge */}
        <div className="flex items-center gap-2 max-w-[55%] truncate">
          <span className="text-xl sm:text-2xl shrink-0">{story.emoji}</span>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-black truncate font-display">
              {story.titleVi}
            </h2>
            <div className="text-[11px] font-extrabold text-amber-600 truncate flex items-center gap-1.5">
              <span>{story.titleEn}</span>
              <span>·</span>
              <span className="text-emerald-600 font-bold">
                Trang {currentPageIdx + 1}/{totalPages}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Language Switcher + Night Mode + Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Language Toggle */}
          <button
            type="button"
            onClick={() => {
              setUserStoryLang((prev) =>
                prev === 'bilingual' ? 'vi' : prev === 'vi' ? 'en' : 'bilingual'
              );
            }}
            className={`min-h-[38px] px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 border cursor-pointer transition ${
              nightMode
                ? 'bg-slate-800 border-slate-700 text-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
            }`}
            title="Đổi ngôn ngữ đọc truyện: Song ngữ / Tiếng Việt / Tiếng Anh"
          >
            <span>
              {userStoryLang === 'bilingual'
                ? '🌐 Song Ngữ'
                : userStoryLang === 'vi'
                ? '🇻🇳 Tiếng Việt'
                : '🇬🇧 English'}
            </span>
          </button>

          {/* Night Mode Toggle */}
          <button
            type="button"
            onClick={() => setNightMode((v) => !v)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border cursor-pointer transition ${
              nightMode
                ? 'bg-amber-400 text-slate-900 border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title={nightMode ? 'Chuyển sang chế độ ban ngày' : 'Chuyển sang chế độ ban đêm'}
            aria-label="Chế độ ban đêm"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Story Canvas & Illustrated Pages */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-between p-3 sm:p-5 max-w-4xl mx-auto w-full">
        {/* Large Illustrated Story Card */}
        <div
          className={`w-full flex-1 min-h-0 rounded-3xl border-2 shadow-sm p-4 sm:p-6 flex flex-col justify-between overflow-y-auto transition-all ${
            nightMode
              ? 'bg-[#1E293B] border-slate-700 text-slate-100'
              : 'bg-white border-amber-200 text-slate-900'
          }`}
        >
          {/* Top: Scene Illustration with Realistic HD Photo and Emoji Badge */}
          {(() => {
            const photoInfo = getStoryPhotoInfo(story.id);
            return (
              <div className="flex flex-col items-center justify-center py-2 shrink-0 w-full max-w-md mx-auto">
                <div className="relative w-full min-h-[190px] sm:min-h-[240px] max-h-[280px] sm:max-h-[330px] rounded-3xl overflow-hidden shadow-sm border-2 border-amber-200/90 group bg-slate-900/95 flex items-center justify-center p-2">
                  {photoInfo.photoUrl ? (
                    <>
                      {/* Ambient blurred backdrop for seamless fill */}
                      <img
                        src={photoInfo.photoUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-lg opacity-35 scale-110 pointer-events-none select-none"
                      />
                      {/* Crisp centered cover / illustration fully visible */}
                      <img
                        src={photoInfo.photoUrl}
                        alt={story.titleVi}
                        className="relative z-10 max-h-[175px] sm:max-h-[225px] w-auto max-w-full object-contain rounded-2xl drop-shadow-lg transition-transform duration-500 group-hover:scale-102 select-none"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </>
                  ) : (
                    <div
                      className={`w-full h-full min-h-[180px] flex items-center justify-center text-6xl bg-gradient-to-br ${currentPage.bgGradient}`}
                    >
                      <span>{currentPage.illustrationEmoji}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none rounded-3xl" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white drop-shadow-md z-20">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-bold border border-white/20">
                      <span>{currentPage.illustrationEmoji}</span>
                      <span className="truncate max-w-[190px]">{story.titleVi}</span>
                    </div>
                    <span className="text-[11px] font-extrabold bg-amber-400 px-2.5 py-1 rounded-lg text-slate-950 shadow-2xs">
                      Trang {currentPageIdx + 1}/{totalPages}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-center max-w-md">
                  <p className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300">
                    📸 {photoInfo.captionVi}
                  </p>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500 italic mt-0.5">
                    {currentPage.illustrationDesc}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Middle: Highlighted Story Text (Bilingual / Vietnamese / English) */}
          <div className="space-y-3 my-auto py-2">
            {(userStoryLang === 'vi' || userStoryLang === 'bilingual') && (
              <div
                className={`text-base sm:text-xl font-bold leading-relaxed text-center rounded-2xl p-3.5 transition-all ${
                  nightMode ? 'bg-slate-800/80 text-amber-200' : 'bg-amber-50/70 text-slate-900'
                }`}
              >
                {currentPage.textVi}
              </div>
            )}

            {(userStoryLang === 'en' || userStoryLang === 'bilingual') && (
              <div
                className={`text-sm sm:text-base font-extrabold leading-relaxed text-center rounded-2xl p-2.5 transition-all ${
                  nightMode ? 'bg-slate-900/60 text-sky-300' : 'bg-sky-50/70 text-sky-900'
                }`}
              >
                {currentPage.textEn}
              </div>
            )}

            {/* Character Dialogues with Animated Speech Bubbles */}
            {currentPage.dialogues && currentPage.dialogues.length > 0 && (
              <div className="space-y-2 mt-3 pt-2 border-t border-slate-200/60">
                {currentPage.dialogues.map((d, dIdx) => (
                  <div
                    key={dIdx}
                    className={`rounded-2xl p-3 border flex items-start gap-3 shadow-2xs ${
                      nightMode
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-amber-200/90'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0 p-1 bg-white rounded-xl shadow-2xs">
                      {d.speakerEmoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-amber-700 flex items-center gap-1.5">
                        <span>{d.speaker}</span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          (Giọng {d.voiceStyle || 'tự nhiên'})
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-800 leading-snug mt-0.5">
                        "{d.textVi}"
                      </div>
                      {userStoryLang !== 'vi' && (
                        <div className="text-xs sm:text-sm font-semibold text-slate-600 italic">
                          "{d.textEn}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Badge: Moral Core Theme */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 shrink-0">
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                nightMode ? 'bg-slate-800 text-amber-300' : 'bg-amber-100 text-amber-900'
              }`}
            >
              🌟 Bài học: {story.moralBadgeVi}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Chế độ phát nền khi tắt màn hình: Đang bật 🎧
            </span>
          </div>
        </div>

        {/* 3. Bottom Player Controls & Page Pager */}
        <div
          className={`w-full rounded-2xl p-2.5 sm:p-3 mt-3 border flex items-center justify-between gap-2 shadow-xs shrink-0 ${
            nightMode
              ? 'bg-slate-800 border-slate-700 text-white'
              : 'bg-white border-amber-200 text-slate-800'
          }`}
        >
          {/* Previous Page */}
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPageIdx === 0}
            className={`min-h-[42px] px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition ${
              currentPageIdx === 0
                ? 'opacity-35 cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Trang trước</span>
          </button>

          {/* Center: Play/Pause Audio + Replay Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReplayPage}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer shadow-2xs transition active:scale-95"
              title="Nghe lại trang này"
              aria-label="Nghe lại"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              className={`min-h-[46px] px-5 sm:px-6 rounded-2xl font-black text-xs sm:text-base flex items-center gap-2 cursor-pointer shadow-md transition active:scale-95 text-white ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-white" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Nghe tiếp</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowMoralModal(true)}
              className="min-h-[42px] px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
              title="Xem bài học giáo dục rút ra từ câu chuyện"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Bài học</span>
            </button>
          </div>

          {/* Next Page / Finish */}
          <button
            type="button"
            onClick={handleNextPage}
            className="min-h-[42px] px-3 sm:px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-black text-xs sm:text-sm flex items-center gap-1 cursor-pointer transition active:scale-95"
          >
            <span className="hidden sm:inline">
              {currentPageIdx < totalPages - 1 ? 'Trang sau' : 'Xem bài học'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 4. Moral Lesson Modal (Luôn rút ra bài học ý nghĩa cho bé ở cuối mỗi câu truyện) */}
      {showMoralModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Bài Học Rút Ra Từ Câu Chuyện"
        >
          <div className="w-full max-w-lg rounded-[32px] bg-white p-5 sm:p-7 shadow-2xl border-4 border-amber-300 space-y-4 text-slate-900">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl shadow-inner border-2 border-amber-300">
                <span>🌟</span>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Bài Học Giáo Dục Ý Nghĩa Cho Bé
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 font-display">
                {story.titleVi}
              </h3>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-extrabold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Lời khuyên của cô giáo:</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-slate-800 leading-relaxed">
                "{story.moralLessonVi}"
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 italic">
                "{story.moralLessonEn}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowMoralModal(false);
                  setCurrentPageIdx(0);
                  setIsPlaying(true);
                }}
                className="min-h-[44px] px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Nghe lại từ đầu</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMoralModal(false);
                  stopAllAudio();
                  onClose();
                }}
                className="min-h-[44px] px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>Chọn câu chuyện khác</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
