import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Volume2,
  Star,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Heart,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Lightbulb,
  Award,
  Play,
  Languages,
} from 'lucide-react';
import {
  DAILY_COMMUNICATION_SITUATIONS,
  type DailyCommunicationSituation,
  type DialogueLine,
} from '../data/dailyCommunicationData';
import { DailyScenicArtwork } from './DailyScenicArtwork';
import type { ParentSettings } from '../types/learning';
import {
  speakTeacherVoice,
  playSoundEffect,
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
  onBack: () => void;
  onEarnStar?: (count: number) => void;
}

export const DailyCommunicationStage: React.FC<DailyCommunicationStageProps> = ({
  settings,
  childName = 'Bé',
  initialSituationId,
  onBack,
  onEarnStar,
}) => {
  const [selectedSituationIndex, setSelectedSituationIndex] = useState<number>(() => {
    if (initialSituationId) {
      const idx = DAILY_COMMUNICATION_SITUATIONS.findIndex((s) => s.id === initialSituationId);
      if (idx >= 0) return idx;
    }
    return 0;
  });

  const [activeDialogueStep, setActiveDialogueStep] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnsweredCorrect, setIsAnsweredCorrect] = useState<boolean>(false);
  const [completedSituations, setCompletedSituations] = useState<Record<string, boolean>>({});
  const [totalCommunicationStars, setTotalCommunicationStars] = useState<number>(0);
  const [languageMode, setLanguageMode] = useState<'bilingual' | 'vi' | 'en'>('bilingual');
  const [isAutoPlayingDialogue, setIsAutoPlayingDialogue] = useState<boolean>(false);

  const currentSituation: DailyCommunicationSituation =
    DAILY_COMMUNICATION_SITUATIONS[selectedSituationIndex] || DAILY_COMMUNICATION_SITUATIONS[0];

  const dialogueTimeoutRef = useRef<number | null>(null);

  // Stop audio on change of situation or unmount
  useEffect(() => {
    stopAllAudio();
    setActiveDialogueStep(0);
    setSelectedOptionId(null);
    setIsAnsweredCorrect(false);
    setIsAutoPlayingDialogue(false);

    if (dialogueTimeoutRef.current) {
      window.clearTimeout(dialogueTimeoutRef.current);
      dialogueTimeoutRef.current = null;
    }

    // Play situational intro prompt
    const introSpeech = [
      {
        lang: 'vi' as const,
        text: `Tình huống: ${currentSituation.titleVi}. ${currentSituation.contextDescVi}`,
      },
    ];
    speakTeacherVoice(introSpeech, settings);

    logActivity(
      'vocab',
      `Tình huống: ${currentSituation.titleVi}`,
      currentSituation.categoryLabelVi,
      5
    );

    return () => {
      stopAllAudio();
      if (dialogueTimeoutRef.current) {
        window.clearTimeout(dialogueTimeoutRef.current);
      }
    };
  }, [currentSituation.id, settings]);

  // Read a single dialogue line
  const handlePlayDialogueLine = (line: DialogueLine) => {
    stopAllAudio();
    const speechItems: { lang: 'vi' | 'en'; text: string }[] = [];

    if (languageMode === 'bilingual') {
      speechItems.push({ lang: 'vi', text: `${line.speakerVi} nói: ${line.speechVi}` });
      speechItems.push({ lang: 'en', text: line.speechEn });
    } else if (languageMode === 'en') {
      speechItems.push({ lang: 'en', text: `${line.speakerEn} says: ${line.speechEn}` });
    } else {
      speechItems.push({ lang: 'vi', text: `${line.speakerVi} nói: ${line.speechVi}` });
    }

    speakTeacherVoice(speechItems, settings);
  };

  // Play entire conversation automatically
  const handleAutoPlayAllDialogues = async () => {
    setIsAutoPlayingDialogue(true);
    for (let i = 0; i < currentSituation.dialogue.length; i++) {
      setActiveDialogueStep(i);
      const line = currentSituation.dialogue[i];
      handlePlayDialogueLine(line);
      // Wait for speech to complete
      await new Promise((resolve) => setTimeout(resolve, 3200));
    }
    setIsAutoPlayingDialogue(false);
  };

  // Handle option selection in Challenge
  const handleSelectOption = (option: DailyCommunicationSituation['challenge']['options'][0]) => {
    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      setIsAnsweredCorrect(true);
      playCelebrationChime(settings.volume);
      fireStarExplosion();
      fireFireworksCelebration();

      if (!completedSituations[currentSituation.id]) {
        setCompletedSituations((prev) => ({ ...prev, [currentSituation.id]: true }));
        setTotalCommunicationStars((prev) => prev + 1);
        if (onEarnStar) {
          onEarnStar(1);
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
      setIsAnsweredCorrect(false);
      playGentleEncourageTone(settings.volume);
      speakTeacherVoice(
        [
          {
            lang: 'vi',
            text: `Bé ơi hãy thử lại nhé! ${option.feedbackVi}`,
          },
        ],
        settings
      );
    }
  };

  // Next and Previous situation navigation
  const handleNextSituation = () => {
    if (selectedSituationIndex < DAILY_COMMUNICATION_SITUATIONS.length - 1) {
      setSelectedSituationIndex((prev) => prev + 1);
    } else {
      setSelectedSituationIndex(0);
    }
  };

  const handlePrevSituation = () => {
    if (selectedSituationIndex > 0) {
      setSelectedSituationIndex((prev) => prev - 1);
    } else {
      setSelectedSituationIndex(DAILY_COMMUNICATION_SITUATIONS.length - 1);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3 pb-6 max-w-6xl mx-auto w-full select-none">
      {/* 1. Header Toolbar */}
      <div className="rounded-3xl bg-white/95 p-3 sm:p-4 border-2 border-sky-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[42px] px-3.5 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{currentSituation.badgeEmoji}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                  {currentSituation.categoryLabelVi}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  #{currentSituation.order} / {DAILY_COMMUNICATION_SITUATIONS.length}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                {currentSituation.titleVi}
              </h1>
            </div>
          </div>
        </div>

        {/* Right tools: Language switcher & Star count badge */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setLanguageMode('vi')}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                languageMode === 'vi' ? 'bg-white text-sky-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              🇻🇳 Việt
            </button>
            <button
              type="button"
              onClick={() => setLanguageMode('bilingual')}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                languageMode === 'bilingual' ? 'bg-[#1E88E5] text-white shadow-2xs' : 'text-slate-600'
              }`}
            >
              🌐 Song Ngữ
            </button>
            <button
              type="button"
              onClick={() => setLanguageMode('en')}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                languageMode === 'en' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          {/* Stars Earned */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs sm:text-sm shadow-2xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{totalCommunicationStars} Sao Bé Ngoan</span>
          </div>
        </div>
      </div>

      {/* 2. Situation Selector Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1 scrollbar-thin">
        {DAILY_COMMUNICATION_SITUATIONS.map((sit, idx) => {
          const isActive = idx === selectedSituationIndex;
          const isDone = completedSituations[sit.id];

          return (
            <button
              key={sit.id}
              type="button"
              onClick={() => setSelectedSituationIndex(idx)}
              className={`shrink-0 px-3 py-2 rounded-2xl border-2 flex items-center gap-2 transition cursor-pointer text-left ${
                isActive
                  ? 'bg-sky-500 text-white border-sky-600 shadow-sm scale-102 font-extrabold'
                  : isDone
                  ? 'bg-amber-50 text-slate-800 border-amber-300 hover:bg-amber-100 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold'
              }`}
            >
              <span className="text-xl">{sit.badgeEmoji}</span>
              <div className="text-left">
                <div className="text-xs truncate max-w-[150px] leading-tight">{sit.titleVi}</div>
                <div className={`text-[10px] ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                  {isDone ? '⭐ Đã hoàn thành' : sit.ageBadge}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Main Stage: Left Scenic Visual & Right Interactive Dialogue Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Left Column (5 cols): 3D Scenic Artwork + Situation Context Card */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="rounded-3xl bg-white p-3.5 sm:p-4 border-2 border-slate-200/90 shadow-xs space-y-3">
            {/* 3D Visual Artwork */}
            <DailyScenicArtwork
              scenicType={currentSituation.scenicType}
              isCelebrating={isAnsweredCorrect}
              className="w-full h-52 sm:h-64"
            />

            {/* Context Narrative */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 space-y-1.5">
              <div className="text-xs font-black text-sky-950 flex items-center justify-between">
                <span>📖 Bối Cảnh Tình Huống</span>
                <button
                  type="button"
                  onClick={() =>
                    speakTeacherVoice(
                      [{ lang: 'vi', text: currentSituation.contextDescVi }],
                      settings
                    )
                  }
                  className="p-1 rounded-lg bg-sky-200/70 hover:bg-sky-300 text-sky-800 cursor-pointer"
                  title="Nghe cô giáo kể bối cảnh"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-sky-900 leading-relaxed font-medium">
                {currentSituation.contextDescVi}
              </p>
              {languageMode !== 'vi' && (
                <p className="text-[11px] text-sky-700/90 italic leading-snug">
                  {currentSituation.contextDescEn}
                </p>
              )}
            </div>

            {/* Golden Rule Badge */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-950 font-bold leading-relaxed">
              {currentSituation.goldenRuleVi}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handlePrevSituation}
                className="flex-1 min-h-[40px] px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer transition active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Tình huống trước</span>
              </button>
              <button
                type="button"
                onClick={handleNextSituation}
                className="flex-1 min-h-[40px] px-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer transition active:scale-95 shadow-xs"
              >
                <span>Tình huống tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Dialogue Interactive Flow + Quiz Challenge */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* A. Conversational Dialogues Box */}
          <div className="rounded-3xl bg-white p-3.5 sm:p-5 border-2 border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900">
                    Hội Thoại Mẫu Lễ Phép
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Chạm vào từng câu để nghe giọng phát âm chuẩn
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoPlayAllDialogues}
                disabled={isAutoPlayingDialogue}
                className="min-h-[34px] px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isAutoPlayingDialogue ? 'Đang đọc...' : 'Nghe toàn bộ'}</span>
              </button>
            </div>

            {/* Dialogue Bubble List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {currentSituation.dialogue.map((line, idx) => {
                const isChild = line.role === 'child';
                const isHighlighted = activeDialogueStep === idx;

                return (
                  <div
                    key={line.id}
                    onClick={() => {
                      setActiveDialogueStep(idx);
                      handlePlayDialogueLine(line);
                    }}
                    className={`rounded-2xl p-3 border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      isHighlighted
                        ? 'border-purple-400 bg-purple-50/90 shadow-xs scale-[1.01]'
                        : isChild
                        ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50'
                        : 'border-slate-200/80 bg-slate-50/70 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-3xl shrink-0 select-none">{line.avatarEmoji}</div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-slate-800">
                          {line.speakerVi}{' '}
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({line.speakerEn})
                          </span>
                        </span>
                        <button
                          type="button"
                          className="text-purple-600 hover:text-purple-800 p-1"
                          aria-label="Nghe câu này"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {line.speechVi}
                      </p>

                      {languageMode !== 'vi' && (
                        <p className="text-[11px] sm:text-xs font-semibold text-purple-700 italic">
                          "{line.speechEn}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Kid's Polite Challenge (Quiz) */}
          <div className="rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-yellow-50/80 p-3.5 sm:p-5 border-2 border-amber-300 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black">
                ✨
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-amber-950">
                  Thử Thách Bé Ngoan Lễ Phép
                </h3>
                <p className="text-[11px] font-bold text-amber-800">
                  {currentSituation.challenge.questionVi}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {currentSituation.challenge.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = opt.isCorrect;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-2.5 active:scale-95 ${
                      isSelected && isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md font-black'
                        : isSelected && !isCorrect
                        ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                        : 'bg-white hover:bg-amber-100/60 text-slate-800 border-amber-200/90 font-bold shadow-2xs'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{opt.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs leading-snug">{opt.textVi}</div>
                      {languageMode !== 'vi' && (
                        <div
                          className={`text-[10px] mt-0.5 italic ${
                            isSelected && isCorrect ? 'text-emerald-100' : 'text-slate-500'
                          }`}
                        >
                          {opt.textEn}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback Message */}
            {selectedOptionId && (
              <div
                className={`p-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 ${
                  isAnsweredCorrect
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                {isAnsweredCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Đúng rồi! Bé nhận được 1 Sao Bé Ngoan! Tiếp tục tình huống tiếp theo nhé!
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

          {/* C. Parent Coaching Tip Card */}
          <div className="rounded-3xl bg-slate-50 p-3.5 sm:p-4 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Gợi Ý Dành Cho Bố Mẹ Đồng Hành Tại Nhà:</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
              {currentSituation.parentRealLifeTipVi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
