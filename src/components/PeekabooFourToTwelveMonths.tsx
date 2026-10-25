import React, { useState } from 'react';
import { Volume2, Sparkles, Eye, Smile } from 'lucide-react';
import type { ParentSettings, TopicLesson, VocabularyItem } from '../types/learning';
import {
  playCelebrationChime,
  playSoundEffect,
  speakTeacherVoice,
} from '../utils/audioEngine';
import { buildSegmentedVocabularyScript } from '../utils/learningLogic';
import { PastelIllustration } from './PastelIllustration';

interface PeekabooProps {
  topics: TopicLesson[];
  settings: ParentSettings;
  onWordPracticed: (item: VocabularyItem, topicId: string) => void;
  onSelectTopicLesson: (topic: TopicLesson) => void;
}

const PEEKABOO_HIDING_SPOTS = [
  { id: 'bush', labelVi: 'Bụi cây xanh', coverEmoji: '🌳' },
  { id: 'barn', labelVi: 'Nhà kho nông trại', coverEmoji: '🏠' },
  { id: 'cloud', labelVi: 'Đám mây trắng', coverEmoji: '☁️' },
  { id: 'gift', labelVi: 'Hộp quà bí mật', coverEmoji: '🎁' },
];

export const PeekabooFourToTwelveMonths: React.FC<PeekabooProps> = ({
  topics,
  settings,
  onWordPracticed,
  onSelectTopicLesson,
}) => {
  const farmTopic = topics.find((t) => t.id === 'farm-animals') || topics[0];
  const fruitTopic = topics.find((t) => t.id === 'fruits') || topics[1];
  const combinedWords = [...farmTopic.vocabulary.slice(0, 4), ...fruitTopic.vocabulary.slice(0, 4)];

  const [subMode, setSubMode] = useState<'peekaboo' | 'bubbles' | 'cards'>('peekaboo');
  const [revealedSpotId, setRevealedSpotId] = useState<string | null>(null);
  const [spotWordMap, setSpotWordMap] = useState<Record<string, VocabularyItem>>(() => ({
    bush: combinedWords[0],
    barn: combinedWords[1],
    cloud: combinedWords[2],
    gift: combinedWords[4],
  }));

  const [poppedBubbles, setPoppedBubbles] = useState<Record<string, boolean>>({});
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handlePeekabooTap = (spot: (typeof PEEKABOO_HIDING_SPOTS)[number]) => {
    const item = spotWordMap[spot.id] || combinedWords[0];
    setRevealedSpotId(spot.id);
    playCelebrationChime(settings.volume);
    playSoundEffect(item.soundEffect, settings.volume);

    speakTeacherVoice(
      [
        { lang: 'vi', text: `Ú òa! Đây là ${item.vi.toLowerCase()}!` },
        { lang: 'en', text: `Peek-a-boo! ${item.en}! ${item.en}!` },
        { lang: 'vi', text: item.soundLabelVi },
      ],
      settings
    );
    onWordPracticed(item, farmTopic.id);

    setTimeout(() => {
      const randomNext = combinedWords[Math.floor(Math.random() * combinedWords.length)];
      setSpotWordMap((prev) => ({ ...prev, [spot.id]: randomNext }));
    }, 3200);
  };

  const handlePopBubble = (item: VocabularyItem) => {
    setPoppedBubbles((prev) => ({ ...prev, [item.id]: true }));
    playSoundEffect('pop', settings.volume);
    speakTeacherVoice(
      [
        { lang: 'vi', text: `Bụp! Vỡ bong bóng rồi! ${item.vi}!` },
        { lang: 'en', text: `${item.en}! ${item.en}!` },
      ],
      settings
    );
    onWordPracticed(item, farmTopic.id);

    setTimeout(() => {
      setPoppedBubbles((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const handleGiantCardTap = (item: VocabularyItem) => {
    setActiveCardId(item.id);
    playSoundEffect(item.soundEffect, settings.volume);
    const segments = buildSegmentedVocabularyScript(item, '4-12m');
    speakTeacherVoice(segments, settings);
    onWordPracticed(item, farmTopic.id);
    setTimeout(() => setActiveCardId(null), 900);
  };

  return (
    <div className="space-y-3">
      {/* Single-Frame Mode Switcher for 4-12 Months */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-amber-200 shadow-sm">
        <div className="flex items-center gap-1.5 flex-1 min-w-[260px]">
          <button
            type="button"
            onClick={() => setSubMode('peekaboo')}
            className={`flex-1 min-h-[42px] px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
              subMode === 'peekaboo'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span className="truncate">1. Ú òa (Peek-a-boo)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubMode('bubbles')}
            className={`flex-1 min-h-[42px] px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
              subMode === 'bubbles'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-sky-50'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">2. Bong bóng xà phòng</span>
          </button>

          <button
            type="button"
            onClick={() => setSubMode('cards')}
            className={`flex-1 min-h-[42px] px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
              subMode === 'cards'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <Smile className="w-4 h-4 shrink-0" />
            <span className="truncate">3. Thẻ hình lớn (8 từ)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onSelectTopicLesson(farmTopic)}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shrink-0"
        >
          Mở bài Nông trại
        </button>
      </div>

      {/* Stage 1: Interactive Peek-a-boo ("Ú òa!") */}
      {subMode === 'peekaboo' && (
        <section className="rounded-3xl bg-white border-2 border-amber-200 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Trò chơi Ú òa! · Chạm vào bụi cây, ngôi nhà hay hộp quà để tìm bạn nhỏ!
              </h2>
            </div>
            {revealedSpotId && (
              <button
                type="button"
                onClick={() => setRevealedSpotId(null)}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs cursor-pointer shrink-0"
              >
                Trốn lại nào!
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PEEKABOO_HIDING_SPOTS.map((spot) => {
              const isRevealed = revealedSpotId === spot.id;
              const item = spotWordMap[spot.id] || combinedWords[0];
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handlePeekabooTap(spot)}
                  className={`min-h-[150px] sm:min-h-[170px] rounded-3xl p-3.5 border-4 flex flex-col items-center justify-center text-center transition-transform active:scale-95 cursor-pointer ${
                    isRevealed
                      ? 'bg-amber-50 border-amber-400 animate-bounce-gentle shadow-md'
                      : 'bg-sky-50/80 border-sky-200 hover:border-sky-300'
                  }`}
                >
                  {isRevealed ? (
                    <>
                      <span className="text-[11px] font-extrabold text-rose-600">
                        Ú ÒA! PEEK-A-BOO!
                      </span>
                      <div className="text-5xl sm:text-6xl my-1">{item.emoji}</div>
                      <span className="text-base sm:text-lg font-extrabold text-slate-900">
                        {item.en}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">{item.vi}</span>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl sm:text-6xl my-1.5 animate-float-slow">
                        {spot.coverEmoji}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {spot.labelVi}
                      </span>
                      <span className="text-[11px] text-slate-500">Chạm mở Ú òa!</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Stage 2: Soap Bubble Pop with Vocabulary */}
      {subMode === 'bubbles' && (
        <section className="rounded-3xl bg-gradient-to-br from-sky-100 via-cyan-50 to-pink-50 border-2 border-sky-200 p-4 sm:p-5 shadow-sm">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mb-3">
            Bong bóng xà phòng biết nói · Chạm nhẹ cho bong bóng nổ "Bụp!"
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {combinedWords.map((item) => {
              const isPopped = Boolean(poppedBubbles[item.id]);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePopBubble(item)}
                  className={`min-h-[124px] sm:min-h-[138px] rounded-full p-3 border-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isPopped
                      ? 'scale-90 bg-white/90 border-pink-400 shadow-inner'
                      : 'bg-white/80 hover:bg-white border-sky-300 shadow-sm animate-float-slow'
                  }`}
                >
                  <span className="text-4xl sm:text-5xl">{isPopped ? '✨' : item.emoji}</span>
                  <span className="text-sm sm:text-base font-extrabold text-sky-900 mt-1">
                    {item.en}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {isPopped ? 'Bụp! Giỏi quá!' : item.vi}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Stage 3: Giant Tactile Sound Flashcards */}
      {subMode === 'cards' && (
        <section className="rounded-3xl bg-white border-2 border-emerald-200 p-4 sm:p-5 shadow-sm">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mb-3">
            Thẻ hình âm thanh khổng lồ (Chạm là nghe giọng cô miền Bắc + tiếng Anh)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {combinedWords.map((item) => {
              const isActive = activeCardId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleGiantCardTap(item)}
                  className={`min-h-[136px] sm:min-h-[150px] rounded-3xl p-3 border-4 flex flex-col items-center justify-center text-center transition-transform active:scale-95 cursor-pointer ${
                    isActive ? 'animate-bounce-gentle ring-4 ring-sky-300' : ''
                  }`}
                  style={{
                    backgroundColor: item.bgTint,
                    borderColor: item.colorHex,
                  }}
                >
                  <PastelIllustration
                    wordId={item.id}
                    emoji={item.emoji}
                    colorHex={item.colorHex}
                    bgTint="#FFFFFF"
                    size="sm"
                  />
                  <span className="text-base sm:text-lg font-extrabold text-slate-900 mt-1.5">
                    {item.en}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{item.vi}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-sky-700">
                    <Volume2 className="w-3 h-3" />
                    {item.soundLabelVi}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
