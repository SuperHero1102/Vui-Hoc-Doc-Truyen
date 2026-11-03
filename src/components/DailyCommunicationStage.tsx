import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Volume2,
  Star,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Play,
  Square,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Lightbulb,
} from 'lucide-react';
import {
  COMMUNICATION_SITUATIONS,
  type CommunicationSituation,
  type CommunicationCard,
  type DialogueLine,
  type SpeakerRole,
  CHARACTER_AVATARS,
} from '../data/dailyCommunicationData';
import type { ParentSettings } from '../types/learning';
import {
  speakTeacherVoice,
  speakCharacterVoice,
  playCelebrationChime,
  playGentleEncourageTone,
  stopAllAudio,
} from '../utils/audioEngine';
import { fireStarExplosion, fireFireworksCelebration } from '../utils/confetti';
import { logActivity } from '../utils/activityTracker';

interface DailyCommunicationStageProps {
  settings: ParentSettings;
  childName?: string;
  initialSituationId?: string;
  initialStars?: number;
  onBack: () => void;
  onEarnStar?: (count: number) => void;
  onCompleteSituation?: (situationId: string) => void;
}

export const DailyCommunicationStage: React.FC<DailyCommunicationStageProps> = ({
  settings,
  childName = 'Bé',
  initialSituationId,
  initialStars = 0,
  onBack,
  onEarnStar,
  onCompleteSituation,
}) => {
  const [selectedSituationIndex, setSelectedSituationIndex] = useState<number>(() => {
    if (initialSituationId) {
      const idx = COMMUNICATION_SITUATIONS.findIndex((s) => s.id === initialSituationId);
      if (idx >= 0) return idx;
    }
    return 0;
  });

  const [activeTab, setActiveTab] = useState<'do' | 'dont'>('do');
  const [languageMode, setLanguageMode] = useState<'bilingual' | 'vi' | 'en'>('bilingual');
  const [selectedQuizOptionId, setSelectedQuizOptionId] = useState<string | null>(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean>(false);
  const [completedSituations, setCompletedSituations] = useState<Record<string, boolean>>({});
  const [totalStars, setTotalStars] = useState<number>(initialStars);
  const [playingLineId, setPlayingLineId] = useState<string | null>(null);
  const [playingCardId, setPlayingCardId] = useState<string | null>(null);
  const [isParentTipOpen, setIsParentTipOpen] = useState<boolean>(false);

  const currentSituation: CommunicationSituation =
    COMMUNICATION_SITUATIONS[selectedSituationIndex] || COMMUNICATION_SITUATIONS[0];

  const stopAudioRef = useRef(false);

  // Stop any ongoing audio immediately on situation change, tab change, or unmount
  useEffect(() => {
    stopAllAudio();
    stopAudioRef.current = true;
    setSelectedQuizOptionId(null);
    setIsQuizCorrect(false);
    setPlayingLineId(null);
    setPlayingCardId(null);
    setIsParentTipOpen(false);

    // Speak situational golden rule briefly
    const timer = window.setTimeout(() => {
      stopAudioRef.current = false;
      speakTeacherVoice(
        [
          {
            lang: 'vi',
            text: `${currentSituation.titleVi}. ${currentSituation.goldenRuleVi}`,
          },
        ],
        settings
      );
    }, 150);

    logActivity(
      'vocab',
      `Giao tiếp: ${currentSituation.titleVi}`,
      'Giao tiếp hàng ngày',
      5
    );

    return () => {
      window.clearTimeout(timer);
      stopAudioRef.current = true;
      stopAllAudio();
    };
  }, [selectedSituationIndex, settings, currentSituation.id, currentSituation.titleVi, currentSituation.goldenRuleVi]);

  // Stop audio when switching tabs
  const handleTabChange = (tab: 'do' | 'dont') => {
    if (tab === activeTab) return;
    stopAllAudio();
    setPlayingLineId(null);
    setPlayingCardId(null);
    setActiveTab(tab);
  };

  // Play a single dialogue line with specific character voice (Child voice for Bé Bông, Bạn Mi!)
  const handlePlayLine = (line: DialogueLine) => {
    stopAllAudio();
    setPlayingCardId(null);
    setPlayingLineId(line.id);

    const segments: { lang: 'vi' | 'en'; text: string }[] = [];
    if (languageMode === 'bilingual') {
      segments.push({ lang: 'en', text: line.en });
      segments.push({ lang: 'vi', text: line.vi });
    } else if (languageMode === 'en') {
      segments.push({ lang: 'en', text: line.en });
    } else {
      segments.push({ lang: 'vi', text: line.vi });
    }

    speakCharacterVoice(segments, line.role, settings, () => {
      setPlayingLineId(null);
    });
  };

  // Play all lines in a card sequentially with each character's genuine voice
  const handlePlayCard = async (card: CommunicationCard) => {
    stopAllAudio();
    if (playingCardId === card.id) {
      setPlayingCardId(null);
      setPlayingLineId(null);
      return;
    }

    setPlayingCardId(card.id);
    stopAudioRef.current = false;

    for (let i = 0; i < card.lines.length; i++) {
      if (stopAudioRef.current) break;
      const line = card.lines[i];
      setPlayingLineId(line.id);

      const segments: { lang: 'vi' | 'en'; text: string }[] = [];
      if (languageMode === 'bilingual') {
        segments.push({ lang: 'en', text: line.en });
        segments.push({ lang: 'vi', text: line.vi });
      } else if (languageMode === 'en') {
        segments.push({ lang: 'en', text: line.en });
      } else {
        segments.push({ lang: 'vi', text: line.vi });
      }

      await speakCharacterVoice(segments, line.role, settings);
      // Brief natural pause between character turns
      await new Promise((r) => setTimeout(r, 650));
    }

    setPlayingLineId(null);
    setPlayingCardId(null);
  };

  // Handle quiz option selection
  const handleSelectQuizOption = (option: CommunicationSituation['quiz']['options'][0]) => {
    stopAllAudio();
    setSelectedQuizOptionId(option.id);

    if (option.isCorrect) {
      setIsQuizCorrect(true);
      playCelebrationChime(settings.volume);
      fireStarExplosion();
      fireFireworksCelebration();

      if (!completedSituations[currentSituation.id]) {
        setCompletedSituations((prev) => ({ ...prev, [currentSituation.id]: true }));
        setTotalStars((prev) => prev + 1);
        if (onEarnStar) {
          onEarnStar(1);
        }
        if (onCompleteSituation) {
          onCompleteSituation(currentSituation.id);
        }
      }

      speakTeacherVoice(
        [
          {
            lang: 'vi',
            text: `Tuyệt vời lắm ${childName}! ${option.feedbackVi}`,
          },
          {
            lang: 'en',
            text: option.feedbackEn,
          },
        ],
        settings
      );
    } else {
      setIsQuizCorrect(false);
      playGentleEncourageTone(settings.volume);
      speakTeacherVoice(
        [
          {
            lang: 'vi',
            text: `${childName} ơi, ${option.feedbackVi}`,
          },
        ],
        settings
      );
    }
  };

  const handleNextSituation = () => {
    stopAllAudio();
    if (selectedSituationIndex < COMMUNICATION_SITUATIONS.length - 1) {
      setSelectedSituationIndex((prev) => prev + 1);
    } else {
      setSelectedSituationIndex(0);
    }
  };

  const handlePrevSituation = () => {
    stopAllAudio();
    if (selectedSituationIndex > 0) {
      setSelectedSituationIndex((prev) => prev - 1);
    } else {
      setSelectedSituationIndex(COMMUNICATION_SITUATIONS.length - 1);
    }
  };

  const activeCards = activeTab === 'do' ? currentSituation.doCards : currentSituation.dontCards;

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3 pb-8 max-w-4xl mx-auto w-full select-none">
      {/* 1. Header Toolbar */}
      <header className="rounded-3xl bg-white/95 p-3 sm:p-4 border-2 border-sky-200/90 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              stopAllAudio();
              onBack();
            }}
            className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 tracking-wide">
                Giao Tiếp Lễ Phép
              </span>
              <span className="text-[11px] font-extrabold text-slate-500 tabular-nums">
                {currentSituation.index}/10
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
              {currentSituation.titleVi}
            </h1>
          </div>
        </div>

        {/* Right Tools: Language Mode & Stars */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setLanguageMode('vi')}
              className={`min-h-[36px] px-2.5 sm:px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                languageMode === 'vi' ? 'bg-white text-sky-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Việt
            </button>
            <button
              type="button"
              onClick={() => setLanguageMode('bilingual')}
              className={`min-h-[36px] px-2.5 sm:px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                languageMode === 'bilingual'
                  ? 'bg-[#1E88E5] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Song Ngữ
            </button>
            <button
              type="button"
              onClick={() => setLanguageMode('en')}
              className={`min-h-[36px] px-2.5 sm:px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                languageMode === 'en'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>

          {/* Stars */}
          <div className="min-h-[44px] px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs tabular-nums">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
            <span>{totalStars}</span>
          </div>
        </div>
      </header>

      {/* 2. Situation Selector Strip (Horizontal Carousel) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 px-0.5 scrollbar-thin scroll-smooth">
        {COMMUNICATION_SITUATIONS.map((sit, idx) => {
          const isActive = idx === selectedSituationIndex;
          const isDone = completedSituations[sit.id];

          return (
            <button
              key={sit.id}
              type="button"
              onClick={() => {
                if (idx !== selectedSituationIndex) {
                  setSelectedSituationIndex(idx);
                }
              }}
              className={`min-h-[50px] shrink-0 px-3.5 py-1.5 rounded-2xl border-2 flex items-center gap-2 transition cursor-pointer text-left active:scale-95 ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-700 shadow-sm scale-102 font-extrabold'
                  : isDone
                  ? 'bg-amber-50 text-slate-800 border-amber-300 hover:bg-amber-100 font-bold'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 font-semibold'
              }`}
            >
              <span className="text-xl shrink-0 select-none">{sit.icon3D}</span>
              <div className="min-w-0">
                <div className="text-xs truncate max-w-[130px] leading-tight font-black">
                  {sit.shortName}
                </div>
                <div className={`text-[10px] tabular-nums ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                  {isDone ? '⭐ Đã học' : `Bài ${sit.index}`}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Golden Rule Banner (<= 10 words) */}
      <div className="rounded-2xl bg-amber-50 border-2 border-amber-300/80 px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-400/90 text-amber-950 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
            ⭐
          </div>
          <p className="text-xs sm:text-sm font-black text-amber-950 leading-tight">
            {currentSituation.goldenRuleVi}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            speakTeacherVoice([{ lang: 'vi', text: currentSituation.goldenRuleVi }], settings)
          }
          className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-amber-200/70 hover:bg-amber-300 text-amber-900 flex items-center justify-center cursor-pointer transition active:scale-95 shrink-0"
          title="Nghe quy tắc vàng"
          aria-label="Nghe quy tắc vàng"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Two Segmented Tabs: "Nên làm" (Green, checkmark) & "Không nên làm" (Soft Red, X) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => handleTabChange('do')}
          className={`min-h-[48px] rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-xs sm:text-sm transition cursor-pointer active:scale-98 ${
            activeTab === 'do'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${activeTab === 'do' ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white'}`}>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>Nên làm</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'do' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
            3
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('dont')}
          className={`min-h-[48px] rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-xs sm:text-sm transition cursor-pointer active:scale-98 ${
            activeTab === 'dont'
              ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-200'
              : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
          }`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${activeTab === 'dont' ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'}`}>
            <X className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>Không nên làm</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'dont' ? 'bg-white/20 text-white' : 'bg-rose-200 text-rose-900'}`}>
            2
          </span>
        </button>
      </div>

      {/* 5. Vertical Scene Cards */}
      <div className="space-y-4">
        {activeCards.map((card, cardIndex) => {
          const isCardPlaying = playingCardId === card.id;

          return (
            <div
              key={card.id}
              className={`rounded-3xl border-2 overflow-hidden shadow-xs bg-white transition-all ${
                activeTab === 'do'
                  ? 'border-emerald-200/90 hover:border-emerald-300'
                  : 'border-rose-200/90 hover:border-rose-300'
              }`}
            >
              {/* Card Title & Play All Audio Toolbar */}
              <div
                className={`px-4 py-2.5 flex items-center justify-between border-b ${
                  activeTab === 'do'
                    ? 'bg-emerald-50/80 border-emerald-100 text-emerald-900'
                    : 'bg-rose-50/80 border-rose-100 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black">
                    Cảnh {cardIndex + 1}: {card.title}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayCard(card)}
                  className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs ${
                    isCardPlaying
                      ? 'bg-slate-800 text-white'
                      : activeTab === 'do'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                  aria-label={isCardPlaying ? 'Dừng đọc cảnh này' : 'Nghe toàn bộ cảnh này'}
                >
                  {isCardPlaying ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Nghe cảnh này</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4:3 Aspect Ratio Image with Overlay Badges */}
              <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
                  loading="lazy"
                  onError={(e) => {
                    // Stylized Clay Placeholder fallback if webp is not yet rendered
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.clay-fallback')) {
                      const fallback = document.createElement('div');
                      fallback.className =
                        'clay-fallback absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-sky-50 to-purple-50 text-center';
                      fallback.innerHTML = `
                        <div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-4xl mb-2">${currentSituation.icon3D}</div>
                        <p class="text-xs font-black text-slate-800">${card.title}</p>
                        <p class="text-[10px] text-slate-500 mt-1">Đang hoàn thiện tranh 3D chibi đợt tiếp</p>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />

                {/* Badge for Don't tab */}
                {card.isNegative && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-rose-600/95 text-white font-black text-[11px] shadow-md flex items-center gap-1 backdrop-blur-xs">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Không nên làm</span>
                  </div>
                )}

                {/* Badge for Do tab */}
                {!card.isNegative && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-emerald-600/95 text-white font-black text-[11px] shadow-md flex items-center gap-1 backdrop-blur-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Nên làm</span>
                  </div>
                )}
              </div>

              {/* Corrective tip for negative card */}
              {card.correctiveTipVi && (
                <div className="mx-3.5 mt-3 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-900 flex items-center gap-2">
                  <span className="text-base shrink-0">💡</span>
                  <span>{card.correctiveTipVi}</span>
                </div>
              )}

              {/* Dialogue lines */}
              <div className="p-3.5 sm:p-4 space-y-2.5">
                {card.lines.map((line) => {
                  const isLinePlaying = playingLineId === line.id;
                  const avatarInfo = CHARACTER_AVATARS[line.role] || {
                    nameVi: line.speaker,
                    nameEn: line.speaker,
                    emoji: line.avatar,
                  };

                  return (
                    <div
                      key={line.id}
                      onClick={() => handlePlayLine(line)}
                      className={`rounded-2xl p-3 border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isLinePlaying
                          ? 'border-sky-500 bg-sky-50/90 shadow-xs ring-2 ring-sky-300'
                          : line.role === 'child'
                          ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/60'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        {/* Avatar circle */}
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0 shadow-2xs select-none">
                          {line.avatar || avatarInfo.emoji}
                        </div>

                        {/* Speech content */}
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="text-[11px] font-black text-slate-500">
                            {line.speaker}
                          </div>

                          {/* Large Bold English Sentence */}
                          {(languageMode === 'bilingual' || languageMode === 'en') && (
                            <p className="text-sm sm:text-base font-black text-slate-900 leading-snug tracking-tight">
                              {line.en}
                            </p>
                          )}

                          {/* Vietnamese Subtitle */}
                          {(languageMode === 'bilingual' || languageMode === 'vi') && (
                            <p
                              className={`text-xs font-bold leading-tight ${
                                languageMode === 'vi'
                                  ? 'text-sm font-black text-slate-900'
                                  : 'text-slate-600'
                              }`}
                            >
                              {line.vi}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Line Audio Play Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayLine(line);
                        }}
                        className={`min-h-[44px] min-w-[44px] p-2 rounded-xl flex items-center justify-center cursor-pointer transition active:scale-95 shrink-0 ${
                          isLinePlaying
                            ? 'bg-sky-600 text-white'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                        aria-label={`Nghe câu của ${line.speaker}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Thử Thách Bé Ngoan (Streamlined Quiz) */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-yellow-50 p-4 sm:p-5 border-2 border-amber-300 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm shrink-0">
            ✨
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-amber-950">
              Thử Thách Bé Ngoan Lễ Phép
            </h3>
            <p className="text-xs font-bold text-amber-900">
              {currentSituation.quiz.questionVi}
            </p>
          </div>
        </div>

        {/* 2 Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentSituation.quiz.options.map((opt) => {
            const isSelected = selectedQuizOptionId === opt.id;
            const isCorrect = opt.isCorrect;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectQuizOption(opt)}
                className={`min-h-[52px] p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 active:scale-95 ${
                  isSelected && isCorrect
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md font-black'
                    : isSelected && !isCorrect
                    ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                    : 'bg-white hover:bg-amber-100/70 text-slate-800 border-amber-200 font-bold shadow-2xs'
                }`}
              >
                <span className="text-2xl shrink-0 select-none">{opt.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-black leading-snug">
                    {opt.vi}
                  </div>
                  {languageMode !== 'vi' && (
                    <div
                      className={`text-[11px] leading-tight mt-0.5 ${
                        isSelected && isCorrect ? 'text-emerald-100' : 'text-slate-500'
                      }`}
                    >
                      {opt.en}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {selectedQuizOptionId && (
          <div
            className={`p-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 ${
              isQuizCorrect
                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                : 'bg-rose-100 text-rose-950 border border-rose-300'
            }`}
          >
            {isQuizCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Đúng rồi! Bé nhận được 1 ⭐ Sao Bé Ngoan! Bé rất lịch sự và đáng yêu!
                </span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Bé hãy suy nghĩ lại một chút và bấm chọn câu lễ phép nhất nhé!</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* 7. Mẹo Cho Bố Mẹ (Collapsible, <= 15 words) */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsParentTipOpen((prev) => !prev)}
          className="w-full min-h-[44px] px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-black text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Mẹo nhỏ cho bố mẹ (Chạm để xem)</span>
          </div>
          {isParentTipOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isParentTipOpen && (
          <div className="px-3.5 pb-3 pt-1 text-xs text-slate-600 font-semibold border-t border-slate-200/60 bg-white">
            {currentSituation.parentTipVi}
          </div>
        )}
      </div>

      {/* 8. Bottom Navigation Strip: Prev & Next Situation */}
      <footer className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrevSituation}
          className="flex-1 min-h-[44px] px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Tình huống trước</span>
        </button>

        <button
          type="button"
          onClick={handleNextSituation}
          className="flex-1 min-h-[44px] px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 shadow-xs"
        >
          <span>Tình huống tiếp</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
