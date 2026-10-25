import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Star,
  Sparkles,
  Music,
  Gamepad2,
  BookOpen,
  Mic,
  RotateCcw,
  CheckCircle2,
  Heart,
  Palette,
} from 'lucide-react';
import type {
  AgeGroupId,
  GameType,
  ParentSettings,
  TopicLesson,
  VocabularyItem,
} from '../types/learning';
import {
  buildGentleTryAgainScript,
  buildSegmentedGentleTryAgain,
  buildSegmentedVocabularyScript,
  getAgeGroupConfig,
  getRotatedGamesForAge,
} from '../utils/learningLogic';
import {
  playCelebrationChime,
  playGentleEncourageTone,
  playMelodyNotes,
  playSoundEffect,
  speakTeacherVoice,
  stopAllAudio,
} from '../utils/audioEngine';
import { PastelIllustration } from './PastelIllustration';
import { fireFireworksCelebration, fireStarExplosion } from '../utils/confetti';

interface LessonPlaygroundProps {
  topic: TopicLesson;
  ageId: AgeGroupId;
  settings: ParentSettings;
  rotationSeed: number;
  onBack: () => void;
  onWordPracticed: (item: VocabularyItem, topicId: string) => void;
  onTopicCompleted: (topic: TopicLesson, starsEarned: number) => void;
}

const GAME_META: Record<GameType, { titleVi: string; shortVi: string; badgeEmoji: string }> = {
  tap_correct: {
    titleVi: 'Nghe & Chạm đúng hình',
    shortVi: 'Chạm hình',
    badgeEmoji: '👆',
  },
  balloon_pop: {
    titleVi: 'Đập bóng bay từ vựng',
    shortVi: 'Bóng bay',
    badgeEmoji: '🎈',
  },
  basket_drag: {
    titleVi: 'Thu hoạch vào giỏ',
    shortVi: 'Bỏ vào giỏ',
    badgeEmoji: '🧺',
  },
  memory_match: {
    titleVi: 'Lật thẻ ghép đôi trí nhớ',
    shortVi: 'Lật thẻ nhớ',
    badgeEmoji: '🃏',
  },
  coloring_count: {
    titleVi: 'Tô màu & Tập đếm',
    shortVi: 'Tô màu & Đếm',
    badgeEmoji: '🎨',
  },
  word_echo: {
    titleVi: 'Ghép chữ & Nhại giọng',
    shortVi: 'Ghép chữ',
    badgeEmoji: '🔤',
  },
};

const COLOR_PALETTE = [
  { id: 'red', nameEn: 'Red', nameVi: 'Màu đỏ', hex: '#F87171' },
  { id: 'yellow', nameEn: 'Yellow', nameVi: 'Màu vàng', hex: '#FACC15' },
  { id: 'sky', nameEn: 'Sky Blue', nameVi: 'Xanh da trời', hex: '#38BDF8' },
  { id: 'green', nameEn: 'Green', nameVi: 'Xanh lá', hex: '#34D399' },
  { id: 'pink', nameEn: 'Pink', nameVi: 'Màu hồng', hex: '#F472B6' },
  { id: 'purple', nameEn: 'Purple', nameVi: 'Màu tím', hex: '#A78BFA' },
];

const ZONE_REQUIREMENTS: Record<
  'sky' | 'sun' | 'body' | 'ground',
  { labelVi: string; colorId: string; nameEn: string; nameVi: string; hex: string }
> = {
  sky: { labelVi: 'Bầu trời', colorId: 'sky', nameEn: 'Sky Blue', nameVi: 'Xanh da trời', hex: '#38BDF8' },
  sun: { labelVi: 'Ông mặt trời', colorId: 'yellow', nameEn: 'Yellow', nameVi: 'Màu vàng', hex: '#FACC15' },
  body: { labelVi: 'Khung hình chính', colorId: 'pink', nameEn: 'Pink', nameVi: 'Màu hồng', hex: '#F472B6' },
  ground: { labelVi: 'Thảm cỏ', colorId: 'green', nameEn: 'Green', nameVi: 'Xanh lá', hex: '#34D399' },
};

export const LessonPlayground: React.FC<LessonPlaygroundProps> = ({
  topic,
  ageId,
  settings,
  rotationSeed,
  onBack,
  onWordPracticed,
  onTopicCompleted,
}) => {
  const ageConfig = getAgeGroupConfig(ageId);
  const rotatedGames = useMemo(
    () => getRotatedGamesForAge(ageId, rotationSeed),
    [ageId, rotationSeed]
  );

  const [activeTab, setActiveTab] = useState<'learn' | 'games' | 'rhyme'>('learn');
  const [selectedGame, setSelectedGame] = useState<GameType>(rotatedGames[0] || 'tap_correct');
  const [activeVocabId, setActiveVocabId] = useState<string | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    text: string;
    tone: 'happy' | 'gentle';
  } | null>(null);

  // Game 1: Tap Correct state (3 rounds required)
  const [targetIndex, setTargetIndex] = useState(0);
  const [scoreStars, setScoreStars] = useState(0);

  // Game 2: Balloon Pop state (3 target rounds required)
  const [poppedIds, setPoppedIds] = useState<Record<string, boolean>>({});
  const [balloonTargetIdx, setBalloonTargetIdx] = useState(0);
  const [balloonRound, setBalloonRound] = useState(0);

  // Game 3: Basket Sort/Collect state (3 rounds required)
  const [basketCollected, setBasketCollected] = useState<string[]>([]);
  const [basketTargetIdx, setBasketTargetIdx] = useState(0);

  // Game 4: Memory Match state (8 cards = 4 pairs, all 4 pairs required)
  const [memoryShuffleSeed, setMemoryShuffleSeed] = useState(1);
  const memoryCards = useMemo(() => {
    const subset = topic.vocabulary.slice(0, 4);
    const pairs = [...subset, ...subset].map((item, idx) => ({
      uid: `${item.id}-${idx}`,
      item,
      sortWeight: ((item.id.charCodeAt(0) * 13 + idx * 37 + memoryShuffleSeed * 19) % 29),
    }));
    return pairs.sort((a, b) => a.sortWeight - b.sortWeight);
  }, [topic, memoryShuffleSeed]);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedWordIds, setMatchedWordIds] = useState<string[]>([]);

  // Game 5: Finger Coloring & Counting state (4 target zones + 8 counted items required)
  const [selectedBrush, setSelectedBrush] = useState(COLOR_PALETTE[2]); // default Sky Blue
  const [canvasZones, setCanvasZones] = useState<Record<'sky' | 'sun' | 'body' | 'ground', string>>({
    sky: '#F8FAFC',
    sun: '#F8FAFC',
    body: '#F8FAFC',
    ground: '#F8FAFC',
  });
  const [coloredZonesDone, setColoredZonesDone] = useState<Record<'sky' | 'sun' | 'body' | 'ground', boolean>>({
    sky: false,
    sun: false,
    body: false,
    ground: false,
  });
  const [countedIndices, setCountedIndices] = useState<number[]>([]);

  // Game 6: Phonics Word Builder & Echo Mic state (3 words required)
  const [wordBuilderIdx, setWordBuilderIdx] = useState(0);
  const [pickedTileIds, setPickedTileIds] = useState<string[]>([]);
  const [isListeningEcho, setIsListeningEcho] = useState(false);
  const [echoSuccess, setEchoSuccess] = useState(false);
  const [wordEchoCompletedCount, setWordEchoCompletedCount] = useState(0);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  const triggerTopicCompletion = (starsEarned = 3) => {
    onTopicCompleted(topic, starsEarned);
    setShowCelebrationModal(true);
    fireFireworksCelebration();
    playCelebrationChime(settings.volume);
    speakTeacherVoice(
      [
        {
          lang: 'vi',
          text: `Hoan hô! Chúc mừng bé ơi! Bé đã vượt qua tất cả các màn chơi của chủ đề ${topic.titleVi}! Cô tặng bé huy hiệu ${topic.rewardSticker.nameVi} và ba ngôi sao vàng!`,
        },
        { lang: 'en', text: 'You did it! Wonderful! Super star!' },
      ],
      settings
    );
  };

  useEffect(() => {
    setSelectedGame(rotatedGames[0] || 'tap_correct');
  }, [rotatedGames]);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const currentTapTarget = topic.vocabulary[targetIndex % topic.vocabulary.length];
  const currentTapChoices = useMemo(() => {
    const others = topic.vocabulary.filter((v) => v.id !== currentTapTarget.id).slice(0, 3);
    const combined = [currentTapTarget, ...others];
    return combined.sort(
      (a, b) =>
        ((a.id.charCodeAt(0) + targetIndex) % 5) - ((b.id.charCodeAt(0) + targetIndex) % 5)
    );
  }, [topic.vocabulary, currentTapTarget, targetIndex]);

  const handleReadStoryIntro = () => {
    speakTeacherVoice(
      [{ lang: 'vi', text: `${topic.narrator.greetingVi} ${topic.storyIntroVi}` }],
      settings
    );
  };

  const handleVocabCardTap = (item: VocabularyItem) => {
    setActiveVocabId(item.id);
    playSoundEffect(item.soundEffect, settings.volume);
    const segments = buildSegmentedVocabularyScript(item, ageId);
    speakTeacherVoice(segments, settings);
    onWordPracticed(item, topic.id);
    setTimeout(() => setActiveVocabId(null), 900);
  };

  const promptCurrentTapQuestion = (item: VocabularyItem) => {
    speakTeacherVoice(
      [
        { lang: 'vi', text: `Bé ơi, đâu là ${item.vi.toLowerCase()} nhỉ?` },
        { lang: 'en', text: `${item.en}!` },
      ],
      settings
    );
  };

  const handleTapChoice = (choice: VocabularyItem) => {
    onWordPracticed(choice, topic.id);
    if (choice.id === currentTapTarget.id) {
      playCelebrationChime(settings.volume);
      playSoundEffect(choice.soundEffect, settings.volume);
      const nextStars = scoreStars + 1;
      setScoreStars(nextStars);
      fireStarExplosion(0.5, 0.4);

      if (nextStars >= 3) {
        const praiseText = `Hoan hô! Đúng là ${choice.vi.toLowerCase()} (${choice.en}) rồi! Chúc mừng bé đã hoàn thành cả 3 màn!`;
        setFeedbackBanner({ text: praiseText, tone: 'happy' });
        setTimeout(() => {
          setScoreStars(0);
          setTargetIndex((i) => (i + 1) % topic.vocabulary.length);
          setFeedbackBanner(null);
          triggerTopicCompletion(3);
        }, 700);
      } else {
        const praiseText = `Giỏi lắm! Đúng là ${choice.vi.toLowerCase()} (${choice.en}) rồi! Mình sang màn ${nextStars + 1}/3 nhé!`;
        setFeedbackBanner({ text: praiseText, tone: 'happy' });
        speakTeacherVoice(
          [
            { lang: 'vi', text: `Giỏi lắm! Đúng là ${choice.vi.toLowerCase()} rồi!` },
            { lang: 'en', text: `${choice.en}!` },
            { lang: 'vi', text: 'Bé sang câu tiếp theo nhé!' },
          ],
          settings
        );
        setTimeout(() => {
          const nextIdx = (targetIndex + 1) % topic.vocabulary.length;
          setTargetIndex(nextIdx);
          setFeedbackBanner(null);
          promptCurrentTapQuestion(topic.vocabulary[nextIdx]);
        }, 1600);
      }
    } else {
      playGentleEncourageTone(settings.volume);
      const gentleText = buildGentleTryAgainScript(choice, currentTapTarget);
      setFeedbackBanner({ text: gentleText, tone: 'gentle' });
      speakTeacherVoice(buildSegmentedGentleTryAgain(choice, currentTapTarget), settings);
    }
  };

  // Game 2: Balloon Pop target logic
  const currentBalloonTarget = topic.vocabulary[balloonTargetIdx % topic.vocabulary.length];

  const promptBalloonQuestion = (item: VocabularyItem) => {
    speakTeacherVoice(
      [
        { lang: 'vi', text: `Bé ơi, hãy đập quả bóng có hình ${item.vi.toLowerCase()} nhé!` },
        { lang: 'en', text: `${item.en}!` },
      ],
      settings
    );
  };

  const handleBalloonPop = (item: VocabularyItem) => {
    if (poppedIds[item.id]) return;

    if (item.id === currentBalloonTarget.id) {
      const nextPopped = { ...poppedIds, [item.id]: true };
      setPoppedIds(nextPopped);
      playSoundEffect('pop', settings.volume);
      fireStarExplosion(0.5, 0.5);
      onWordPracticed(item, topic.id);

      const nextRound = balloonRound + 1;
      setBalloonRound(nextRound);

      if (nextRound >= 3) {
        setFeedbackBanner({
          text: `Bụp! Đúng là ${item.vi} (${item.en})! Chúc mừng bé đã hoàn thành cả 3 màn đập bóng!`,
          tone: 'happy',
        });
        setTimeout(() => {
          setPoppedIds({});
          setBalloonRound(0);
          setBalloonTargetIdx((i) => (i + 1) % topic.vocabulary.length);
          setFeedbackBanner(null);
          triggerTopicCompletion(3);
        }, 800);
      } else {
        // Pick next unpopped item
        const unpoppedIdx = topic.vocabulary.findIndex(
          (v, idx) => !nextPopped[v.id] && idx !== balloonTargetIdx % topic.vocabulary.length
        );
        const nextIdx = unpoppedIdx >= 0 ? unpoppedIdx : (balloonTargetIdx + 1) % topic.vocabulary.length;
        setFeedbackBanner({
          text: `Bụp! Đúng là ${item.vi} (${item.en})! Mình sang màn ${nextRound + 1}/3 nhé!`,
          tone: 'happy',
        });
        speakTeacherVoice(
          [
            { lang: 'vi', text: `Bụp! Đúng là ${item.vi.toLowerCase()} rồi!` },
            { lang: 'en', text: `${item.en}!` },
            { lang: 'vi', text: `Tiếp theo, bé tìm quả bóng ${topic.vocabulary[nextIdx].vi.toLowerCase()} nhé!` },
            { lang: 'en', text: `${topic.vocabulary[nextIdx].en}!` },
          ],
          settings
        );
        setBalloonTargetIdx(nextIdx);
      }
    } else {
      playGentleEncourageTone(settings.volume);
      const gentleText = buildGentleTryAgainScript(item, currentBalloonTarget);
      setFeedbackBanner({ text: gentleText, tone: 'gentle' });
      speakTeacherVoice(buildSegmentedGentleTryAgain(item, currentBalloonTarget), settings);
    }
  };

  // Game 3: Basket Drag/Collect logic
  const basketTargetItem = topic.vocabulary[basketTargetIdx % topic.vocabulary.length];
  const basketChoices = useMemo(() => {
    const others = topic.vocabulary.filter((v) => v.id !== basketTargetItem.id).slice(0, 3);
    return [basketTargetItem, ...others].sort((a, b) => a.id.localeCompare(b.id));
  }, [topic.vocabulary, basketTargetItem]);

  const handlePutInBasket = (item: VocabularyItem) => {
    onWordPracticed(item, topic.id);
    if (item.id === basketTargetItem.id) {
      playCelebrationChime(settings.volume);
      fireStarExplosion(0.5, 0.45);
      const updated = [...basketCollected, item.id];
      setBasketCollected(updated);

      if (updated.length >= 3) {
        const praise = `Hoan hô! Bé đã thu hoạch đủ 3 món vào giỏ của ${topic.narrator.name}!`;
        setFeedbackBanner({ text: praise, tone: 'happy' });
        setTimeout(() => {
          setBasketCollected([]);
          setBasketTargetIdx((i) => i + 1);
          setFeedbackBanner(null);
          triggerTopicCompletion(3);
        }, 700);
      } else {
        const nextItem = topic.vocabulary[(basketTargetIdx + 1) % topic.vocabulary.length];
        const praise = `Tuyệt vời! Bé đã cho ${item.vi.toLowerCase()} (${item.en}) vào giỏ! Màn ${updated.length + 1}/3: Tìm ${nextItem.vi.toLowerCase()} nhé!`;
        setFeedbackBanner({ text: praise, tone: 'happy' });
        speakTeacherVoice(
          [
            { lang: 'vi', text: `Tuyệt vời! Bé đã cho ${item.vi.toLowerCase()} vào giỏ rồi!` },
            { lang: 'en', text: `${item.en}!` },
            { lang: 'vi', text: `Tiếp theo, bé cho ${nextItem.vi.toLowerCase()} vào giỏ nhé!` },
            { lang: 'en', text: `${nextItem.en}!` },
          ],
          settings
        );
        setBasketTargetIdx((i) => i + 1);
      }
    } else {
      playGentleEncourageTone(settings.volume);
      const msg = buildGentleTryAgainScript(item, basketTargetItem);
      setFeedbackBanner({ text: msg, tone: 'gentle' });
      speakTeacherVoice(buildSegmentedGentleTryAgain(item, basketTargetItem), settings);
    }
  };

  // Game 4: Memory Match logic (all 4 pairs required)
  const handleMemoryCardFlip = (uid: string, item: VocabularyItem) => {
    if (matchedWordIds.includes(item.id) || flippedUids.includes(uid) || flippedUids.length >= 2) {
      return;
    }
    playSoundEffect(item.soundEffect, settings.volume);
    speakTeacherVoice(
      [
        { lang: 'en', text: `${item.en}!` },
        { lang: 'vi', text: item.vi },
      ],
      settings
    );
    const nextFlipped = [...flippedUids, uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 2) {
      const firstCard = memoryCards.find((c) => c.uid === nextFlipped[0]);
      const secondCard = memoryCards.find((c) => c.uid === nextFlipped[1]);
      if (firstCard && secondCard && firstCard.item.id === secondCard.item.id) {
        playCelebrationChime(settings.volume);
        fireStarExplosion(0.5, 0.45);
        const nextMatched = [...matchedWordIds, firstCard.item.id];
        setMatchedWordIds(nextMatched);
        setFlippedUids([]);
        onWordPracticed(firstCard.item, topic.id);

        if (nextMatched.length >= 4) {
          setFeedbackBanner({
            text: `Hoan hô! Bé đã ghép đúng cả 4/4 cặp thẻ!`,
            tone: 'happy',
          });
          setTimeout(() => {
            setMatchedWordIds([]);
            setFlippedUids([]);
            setMemoryShuffleSeed((s) => s + 1);
            setFeedbackBanner(null);
            triggerTopicCompletion(3);
          }, 800);
        } else {
          setFeedbackBanner({
            text: `Ghép đôi thành công (${nextMatched.length}/4 cặp): ${firstCard.item.vi} – ${firstCard.item.en}! Bé tìm cặp tiếp theo nhé!`,
            tone: 'happy',
          });
        }
      } else {
        playGentleEncourageTone(settings.volume);
        setFeedbackBanner({
          text: 'Cố lên nào bé ơi! Hai thẻ này chưa giống nhau, bé nhớ vị trí rồi lật tiếp nhé!',
          tone: 'gentle',
        });
        speakTeacherVoice(
          [
            {
              lang: 'vi',
              text: 'Cố lên nào bé ơi! Hai thẻ này chưa giống nhau, bé thử lại nhé!',
            },
          ],
          settings
        );
        setTimeout(() => {
          setFlippedUids([]);
        }, 950);
      }
    }
  };

  // Game 5: Coloring & Counting logic
  const checkColoringAndCountingComplete = (
    nextZonesDone: Record<'sky' | 'sun' | 'body' | 'ground', boolean>,
    nextCounted: number[]
  ) => {
    const allZonesColored = Object.values(nextZonesDone).every(Boolean);
    const allItemsCounted = nextCounted.length >= 8;
    if (allZonesColored && allItemsCounted) {
      setTimeout(() => {
        setCanvasZones({ sky: '#F8FAFC', sun: '#F8FAFC', body: '#F8FAFC', ground: '#F8FAFC' });
        setColoredZonesDone({ sky: false, sun: false, body: false, ground: false });
        setCountedIndices([]);
        setFeedbackBanner(null);
        triggerTopicCompletion(3);
      }, 800);
    }
  };

  const handleColorZone = (zone: 'sky' | 'sun' | 'body' | 'ground') => {
    const req = ZONE_REQUIREMENTS[zone];
    if (selectedBrush.id !== req.colorId) {
      playGentleEncourageTone(settings.volume);
      setFeedbackBanner({
        text: `Cố lên nào bé ơi! ${req.labelVi} cần tô ${req.nameVi.toLowerCase()} (${req.nameEn}), bé chọn cọ ${req.nameVi.toLowerCase()} nhé!`,
        tone: 'gentle',
      });
      speakTeacherVoice(
        [
          {
            lang: 'vi',
            text: `Cố lên nào bé ơi! ${req.labelVi} cần tô ${req.nameVi.toLowerCase()}, bé chọn bút màu ${req.nameVi.toLowerCase()} nhé!`,
          },
          { lang: 'en', text: `${req.nameEn}!` },
        ],
        settings
      );
      return;
    }

    const nextZones = { ...canvasZones, [zone]: req.hex };
    const nextDone = { ...coloredZonesDone, [zone]: true };
    setCanvasZones(nextZones);
    setColoredZonesDone(nextDone);
    playSoundEffect('sparkle', settings.volume);
    fireStarExplosion(0.5, 0.4);
    const doneCount = Object.values(nextDone).filter(Boolean).length;
    setFeedbackBanner({
      text: `Đẹp quá! Bé đã tô đúng ${req.labelVi.toLowerCase()} màu ${req.nameVi.toLowerCase()} (${doneCount}/4 vùng)!`,
      tone: 'happy',
    });
    speakTeacherVoice(
      [
        { lang: 'en', text: `${req.nameEn}!` },
        { lang: 'vi', text: `${req.nameVi} đẹp quá!` },
      ],
      settings
    );
    checkColoringAndCountingComplete(nextDone, countedIndices);
  };

  const handleCountTap = (idx: number) => {
    if (countedIndices.includes(idx)) return;
    // Must tap in sequential order or count each unique item
    const next = [...countedIndices, idx];
    setCountedIndices(next);
    const countNum = next.length;
    const enNumbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
    const viNumbers = ['Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám'];
    const enWord = enNumbers[countNum - 1] || String(countNum);
    const viWord = viNumbers[countNum - 1] || String(countNum);
    const tappedItem = topic.vocabulary[idx % topic.vocabulary.length];

    playCelebrationChime(settings.volume);
    fireStarExplosion(0.5, 0.5);
    setFeedbackBanner({
      text: `Bé đếm: ${viWord} (${enWord}) — ${tappedItem.vi} (${tappedItem.en})! (${countNum}/8)`,
      tone: 'happy',
    });
    speakTeacherVoice(
      [
        { lang: 'vi', text: `${viWord}!` },
        { lang: 'en', text: `${enWord}! ${tappedItem.en}!` },
      ],
      settings
    );
    checkColoringAndCountingComplete(coloredZonesDone, next);
  };

  // Game 6: Phonics Word Builder & Echo Mic (full word spelling + scrambled letters + 3 rounds)
  const currentPhonicsItem = topic.vocabulary[wordBuilderIdx % topic.vocabulary.length];
  const targetWordUpper = currentPhonicsItem.en.toUpperCase().replace(/[^A-Z]/g, '');
  const letterPool = useMemo(() => {
    const chars = targetWordUpper.split('');
    return chars
      .map((ch, idx) => ({
        id: `${ch}-${idx}`,
        char: ch,
        sortKey: ((ch.charCodeAt(0) * 17 + idx * 31 + wordBuilderIdx * 13) % 23),
      }))
      .sort((a, b) => a.sortKey - b.sortKey);
  }, [targetWordUpper, wordBuilderIdx]);

  const handlePickLetter = (tile: { id: string; char: string }) => {
    if (pickedTileIds.includes(tile.id)) return;
    const nextIdx = pickedTileIds.length;
    const expected = targetWordUpper[nextIdx];
    if (tile.char === expected) {
      const updated = [...pickedTileIds, tile.id];
      setPickedTileIds(updated);
      playSoundEffect('pop', settings.volume);
      fireStarExplosion(0.5, 0.45);
      if (updated.length === targetWordUpper.length) {
        playCelebrationChime(settings.volume);
        const msg = `Giỏi quá! Bé đã ghép đủ từ ${currentPhonicsItem.en} (${currentPhonicsItem.vi})! Bây giờ bé bấm nút "Nghe cô & Nói theo" ở Bước 2 nhé!`;
        setFeedbackBanner({ text: msg, tone: 'happy' });
        speakTeacherVoice(
          [
            { lang: 'vi', text: 'Giỏi quá! Cùng đánh vần và đọc từ này nhé:' },
            {
              lang: 'en',
              text: `${targetWordUpper.split('').join(', ')}. ${currentPhonicsItem.en}!`,
            },
            { lang: 'vi', text: `${currentPhonicsItem.vi}! Bây giờ bé bấm nút nói theo cô nhé!` },
          ],
          settings
        );
        onWordPracticed(currentPhonicsItem, topic.id);
      } else {
        speakTeacherVoice([{ lang: 'en', text: tile.char }], settings);
      }
    } else {
      playGentleEncourageTone(settings.volume);
      setFeedbackBanner({
        text: `Cố lên nào bé ơi! Chữ cái tiếp theo là chữ "${expected}", bé tìm chữ "${expected}" nhé!`,
        tone: 'gentle',
      });
      speakTeacherVoice(
        [
          { lang: 'vi', text: 'Cố lên nào bé ơi! Bé tìm chữ cái tiếp theo nhé:' },
          { lang: 'en', text: expected },
        ],
        settings
      );
    }
  };

  const completeWordEchoRound = () => {
    const nextCount = wordEchoCompletedCount + 1;
    setWordEchoCompletedCount(nextCount);
    if (nextCount >= 3) {
      setFeedbackBanner({
        text: `Hoan hô! Bé đã ghép chữ và đọc to xuất sắc cả 3/3 từ!`,
        tone: 'happy',
      });
      setTimeout(() => {
        setWordEchoCompletedCount(0);
        setWordBuilderIdx((i) => i + 1);
        setPickedTileIds([]);
        setEchoSuccess(false);
        setFeedbackBanner(null);
        triggerTopicCompletion(3);
      }, 900);
    } else {
      setFeedbackBanner({
        text: `Tuyệt vời! Bé đã hoàn thành từ ${nextCount}/3! Mình sang từ thứ ${nextCount + 1}/3 nhé!`,
        tone: 'happy',
      });
      setTimeout(() => {
        setWordBuilderIdx((i) => i + 1);
        setPickedTileIds([]);
        setEchoSuccess(false);
      }, 1500);
    }
  };

  const handleEchoMicPractice = async () => {
    if (pickedTileIds.length < targetWordUpper.length) {
      playGentleEncourageTone(settings.volume);
      setFeedbackBanner({
        text: `Cố lên nào bé ơi! Bé hãy chạm ghép đủ các chữ cái của từ "${targetWordUpper}" ở Bước 1 trước khi đọc to nhé!`,
        tone: 'gentle',
      });
      speakTeacherVoice(
        [
          {
            lang: 'vi',
            text: 'Cố lên nào bé ơi! Bé hãy ghép đủ các chữ cái ở bước một trước khi đọc to nhé!',
          },
        ],
        settings
      );
      return;
    }

    setEchoSuccess(false);
    await speakTeacherVoice(
      [
        { lang: 'vi', text: 'Bé nói to theo cô nhé:' },
        { lang: 'en', text: `${currentPhonicsItem.en}! ${currentPhonicsItem.sentence3To4y.en}` },
      ],
      settings
    );

    if (settings.allowMicrophone && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      try {
        setIsListeningEcho(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setTimeout(() => {
          stream.getTracks().forEach((t) => t.stop());
          setIsListeningEcho(false);
          setEchoSuccess(true);
          playCelebrationChime(settings.volume);
          speakTeacherVoice(
            [
              { lang: 'vi', text: 'Cô nghe thấy giọng của bé rồi! Bé phát âm giỏi lắm!' },
              { lang: 'en', text: `${currentPhonicsItem.en}! Wonderful!` },
            ],
            settings
          );
          completeWordEchoRound();
        }, 2000);
        return;
      } catch {
        setIsListeningEcho(false);
      }
    }

    setIsListeningEcho(true);
    setTimeout(() => {
      setIsListeningEcho(false);
      setEchoSuccess(true);
      playCelebrationChime(settings.volume);
      speakTeacherVoice(
        [
          { lang: 'vi', text: 'Tuyệt vời! Bé đọc to giỏi lắm!' },
          { lang: 'en', text: `${currentPhonicsItem.en}!` },
        ],
        settings
      );
      completeWordEchoRound();
    }, 1600);
  };

  return (
    <div className="h-full flex flex-col gap-1.5 sm:gap-2.5 min-h-0 overflow-y-auto overflow-x-hidden">
      {/* Compact Native-App Lesson Header + Mode Tabs in a Single Unified Bar */}
      <div
        className={`shrink-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${topic.worldTheme.bgGradient} border-2 p-2 sm:p-3.5 shadow-sm`}
        style={{ borderColor: topic.worldTheme.borderColor }}
      >
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => {
                stopAllAudio();
                onBack();
              }}
              className="min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3 py-1 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-1 shadow-sm border border-slate-200 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Chủ đề</span>
            </button>

            <div
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 border-2 border-white shadow-sm"
              style={{ backgroundColor: topic.narrator.avatarBg }}
            >
              {topic.narrator.emoji}
            </div>

            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-bold text-sky-800 truncate">
                #{topic.order} · Cùng {topic.narrator.name} · {ageConfig.label}
              </div>
              <h1 className="text-sm sm:text-xl font-extrabold text-slate-900 truncate">
                {topic.titleVi} ({topic.titleEn})
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleReadStoryIntro}
              className="min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3.5 py-1 rounded-xl sm:rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Nghe truyện</span>
              <span className="sm:hidden">Truyện</span>
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs inside header so cards below fit 100% in viewport */}
        <div className="mt-1.5 sm:mt-2 grid grid-cols-3 gap-1.5 sm:gap-2 bg-white/90 p-1 rounded-xl sm:rounded-2xl border border-white">
          <button
            type="button"
            onClick={() => setActiveTab('learn')}
            className={`min-h-[34px] sm:min-h-[40px] rounded-lg sm:rounded-xl px-2 py-1 font-extrabold text-[11px] sm:text-sm flex items-center justify-center gap-1 transition cursor-pointer ${
              activeTab === 'learn'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-sky-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Từ vựng ({topic.vocabulary.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('games');
              if (selectedGame === 'tap_correct') {
                promptCurrentTapQuestion(currentTapTarget);
              } else if (selectedGame === 'balloon_pop') {
                promptBalloonQuestion(currentBalloonTarget);
              }
            }}
            className={`min-h-[34px] sm:min-h-[40px] rounded-lg sm:rounded-xl px-2 py-1 font-extrabold text-[11px] sm:text-sm flex items-center justify-center gap-1 transition cursor-pointer ${
              activeTab === 'games'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Trò chơi ({rotatedGames.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rhyme')}
            className={`min-h-[34px] sm:min-h-[40px] rounded-lg sm:rounded-xl px-2 py-1 font-extrabold text-[11px] sm:text-sm flex items-center justify-center gap-1 transition cursor-pointer ${
              activeTab === 'rhyme'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-700 hover:bg-pink-50'
            }`}
          >
            <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Bài hát ({topic.rhyme.lines.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Responsive Non-Overlapping Vocabulary Cards Grid */}
      {activeTab === 'learn' && (
        <section className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5 pb-3">
            {topic.vocabulary.map((item) => {
              const isPlaying = activeVocabId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleVocabCardTap(item)}
                  className={`rounded-2xl sm:rounded-3xl p-3 border-2 sm:border-3 flex flex-col items-center justify-between text-center transition-all hover:scale-[1.02] active:scale-95 cursor-pointer bg-white shadow-xs hover:shadow-md min-h-[175px] sm:min-h-[195px] overflow-hidden ${
                    isPlaying ? 'animate-bounce-gentle ring-4 ring-sky-300' : ''
                  }`}
                  style={{ borderColor: item.colorHex }}
                >
                  <div className="my-1 shrink-0">
                    <PastelIllustration
                      wordId={item.id}
                      emoji={item.emoji}
                      colorHex={item.colorHex}
                      bgTint={item.bgTint}
                      size="md"
                    />
                  </div>

                  <div className="w-full min-w-0 space-y-0.5 my-1">
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-snug break-words">
                      {item.en}
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-600 leading-tight">
                      {item.vi}
                    </div>

                    {ageId === '2-3y' && (
                      <div className="text-[11px] font-bold text-emerald-700 truncate">
                        "{item.phrase2To3y.en}"
                      </div>
                    )}
                    {ageId === '3-4y' && (
                      <div className="text-[11px] font-bold text-purple-700 truncate">
                        "{item.sentence3To4y.en}"
                      </div>
                    )}
                    {ageId === '4-5y' && (
                      <div className="text-[11px] font-bold text-pink-700 truncate">
                        {item.phonics4To5y.spelling}
                      </div>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sky-600 max-w-full bg-sky-50 px-2 py-0.5 rounded-full mt-1">
                    <Volume2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.soundLabelVi}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="shrink-0 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 px-3 py-1.5 flex items-center justify-between gap-2">
            <div className="text-[11px] sm:text-xs text-amber-950 truncate flex-1">
              <strong>Mẹo cùng con:</strong> {topic.parentRealLifeTipVi}
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('games');
                promptCurrentTapQuestion(currentTapTarget);
              }}
              className="min-h-[32px] sm:min-h-[36px] px-3 sm:px-4 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] sm:text-xs shrink-0 cursor-pointer"
            >
              Chơi ngay →
            </button>
          </div>
        </section>
      )}

      {/* TAB 2: Age-Rotated Multi-Game Playground Fitted in Single Frame */}
      {activeTab === 'games' && (
        <section className="space-y-3">
          {/* Compact Multi-Game Switcher (Flex-wrap, no horizontal scroll) */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1">
            {rotatedGames.map((gType, idx) => {
              const meta = GAME_META[gType];
              const isSelected = selectedGame === gType;
              return (
                <button
                  key={gType}
                  type="button"
                  onClick={() => {
                    setSelectedGame(gType);
                    setFeedbackBanner(null);
                    if (gType === 'tap_correct') {
                      promptCurrentTapQuestion(currentTapTarget);
                    } else if (gType === 'balloon_pop') {
                      promptBalloonQuestion(currentBalloonTarget);
                    }
                  }}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{meta.badgeEmoji}</span>
                  <span>
                    Trò {idx + 1}: {meta.titleVi}
                  </span>
                </button>
              );
            })}
          </div>

          {feedbackBanner && (
            <div
              className={`rounded-2xl px-4 py-2.5 border-2 flex items-center gap-2.5 ${
                feedbackBanner.tone === 'happy'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <Sparkles className="w-5 h-5 shrink-0 text-amber-500" />
              <span className="text-xs sm:text-sm font-bold">{feedbackBanner.text}</span>
            </div>
          )}

          {/* GAME 1: Listen & Tap Correct Picture (3 rounds required) */}
          {selectedGame === 'tap_correct' && (
            <div className="rounded-3xl bg-white border-2 border-sky-200 p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800 text-[11px] font-extrabold mb-1">
                    Màn {scoreStars + 1}/3 · Chọn đúng cả 3 màn để nhận huy hiệu
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Bé ơi, đâu là "{currentTapTarget.en}" ({currentTapTarget.vi}) nhỉ?
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => promptCurrentTapQuestion(currentTapTarget)}
                  className="min-h-[42px] px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe câu hỏi</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentTapChoices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handleTapChoice(choice)}
                    className="min-h-[148px] sm:min-h-[164px] rounded-3xl p-3 border-4 flex flex-col items-center justify-center text-center transition-transform active:scale-95 cursor-pointer hover:shadow-md"
                    style={{
                      backgroundColor: choice.bgTint,
                      borderColor: choice.colorHex,
                    }}
                  >
                    <PastelIllustration
                      wordId={choice.id}
                      emoji={choice.emoji}
                      colorHex={choice.colorHex}
                      bgTint="#FFFFFF"
                      size="md"
                    />
                    <span className="text-base sm:text-lg font-extrabold text-slate-900 mt-2">
                      {choice.en}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{choice.vi}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME 2: Target Balloon Pop (3 rounds required) */}
          {selectedGame === 'balloon_pop' && (
            <div className="rounded-3xl bg-gradient-to-b from-sky-100 to-white border-2 border-sky-200 p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-pink-100 text-pink-800 text-[11px] font-extrabold mb-1">
                    Màn {balloonRound + 1}/3 · Đập đúng quả bóng cô yêu cầu
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Bé hãy tìm và đập quả bóng "{currentBalloonTarget.en}" ({currentBalloonTarget.vi}) nhé!
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => promptBalloonQuestion(currentBalloonTarget)}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-sky-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe yêu cầu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPoppedIds({});
                      setBalloonRound(0);
                      setFeedbackBanner(null);
                    }}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-sky-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Thả bóng mới</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {topic.vocabulary.map((item) => {
                  const isPopped = Boolean(poppedIds[item.id]);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isPopped}
                      onClick={() => handleBalloonPop(item)}
                      className={`min-h-[124px] sm:min-h-[136px] rounded-full p-3 border-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isPopped
                          ? 'bg-emerald-50 border-emerald-400 scale-95 opacity-75'
                          : 'bg-white border-pink-300 shadow-sm animate-float-slow hover:scale-105'
                      }`}
                    >
                      <span className="text-4xl">{isPopped ? '🌟' : item.emoji}</span>
                      <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                        {item.en}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {isPopped ? 'Đã nổ Bụp!' : item.vi}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GAME 3: Basket Collect (3 rounds required) */}
          {selectedGame === 'basket_drag' && (
            <div className="rounded-3xl bg-white border-2 border-amber-200 p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{topic.narrator.emoji}</div>
                  <div>
                    <div className="text-xs font-extrabold text-amber-800">
                      Màn {basketCollected.length + 1}/3 · Giỏ mây của {topic.narrator.name} ({basketCollected.length}/3 món)
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Bé hãy chạm đưa "{basketTargetItem.en}" ({basketTargetItem.vi}) vào giỏ nhé!
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    speakTeacherVoice(
                      [
                        {
                          lang: 'vi',
                          text: `Bé cho ${basketTargetItem.vi.toLowerCase()} vào giỏ giúp ${topic.narrator.name} nhé!`,
                        },
                        { lang: 'en', text: `${basketTargetItem.en}!` },
                      ],
                      settings
                    )
                  }
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe yêu cầu</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {basketChoices.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePutInBasket(item)}
                    className="min-h-[136px] rounded-3xl p-3 border-4 flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer bg-slate-50 hover:bg-amber-50/50"
                    style={{ borderColor: item.colorHex }}
                  >
                    <span className="text-4xl sm:text-5xl">{item.emoji}</span>
                    <span className="text-base font-extrabold text-slate-900 mt-1.5">{item.en}</span>
                    <span className="text-xs text-slate-600">{item.vi}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GAME 4: Memory Match (8 cards = 4 pairs in a 4x2 grid, all 4 pairs required) */}
          {selectedGame === 'memory_match' && (
            <div className="rounded-3xl bg-white border-2 border-emerald-200 p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-extrabold mb-1">
                    Đã ghép {matchedWordIds.length}/4 cặp · Hoàn thành đủ 4 cặp để chiến thắng
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Lật thẻ tìm đôi bạn giống nhau
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMatchedWordIds([]);
                    setFlippedUids([]);
                    setMemoryShuffleSeed((s) => s + 1);
                    setFeedbackBanner(null);
                  }}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ván mới</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {memoryCards.map((card) => {
                  const isOpen =
                    flippedUids.includes(card.uid) || matchedWordIds.includes(card.item.id);
                  return (
                    <button
                      key={card.uid}
                      type="button"
                      onClick={() => handleMemoryCardFlip(card.uid, card.item)}
                      className={`min-h-[118px] sm:min-h-[128px] rounded-3xl p-3 border-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isOpen
                          ? 'bg-white border-emerald-400 shadow-sm'
                          : 'bg-sky-500 hover:bg-sky-600 border-sky-300 text-white shadow-sm'
                      }`}
                    >
                      {isOpen ? (
                        <>
                          <span className="text-4xl">{card.item.emoji}</span>
                          <span className="text-sm font-extrabold text-slate-900 mt-1">
                            {card.item.en}
                          </span>
                          <span className="text-[11px] text-slate-600">{card.item.vi}</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-8 h-8 text-amber-300 fill-amber-300" />
                          <span className="text-xs font-bold mt-1.5">Chạm để lật</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GAME 5: Finger Coloring & Object Counting (All 4 zones + all 8 items required) */}
          {selectedGame === 'coloring_count' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white border-2 border-pink-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-pink-500" />
                    <h3 className="text-base font-extrabold text-slate-900">
                      Bước 1: Tô đúng màu 4 vùng ({Object.values(coloredZonesDone).filter(Boolean).length}/4)
                    </h3>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-600 bg-pink-50 border border-pink-100 rounded-xl p-2">
                  Gợi ý: Bầu trời = <strong>Sky Blue</strong> · Mặt trời = <strong>Yellow</strong> · Khung giữa = <strong>Pink</strong> · Thảm cỏ = <strong>Green</strong>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.nameEn}
                      type="button"
                      onClick={() => {
                        setSelectedBrush(c);
                        speakTeacherVoice(
                          [
                            { lang: 'en', text: `${c.nameEn}!` },
                            { lang: 'vi', text: c.nameVi },
                          ],
                          settings
                        );
                      }}
                      className={`min-h-[38px] px-2.5 py-1 rounded-xl border-2 flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                        selectedBrush.nameEn === c.nameEn
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-800'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>
                        {c.nameEn} ({c.nameVi})
                      </span>
                    </button>
                  ))}
                </div>

                <svg
                  viewBox="0 0 320 170"
                  className="w-full h-44 rounded-2xl border-2 border-slate-200 cursor-pointer"
                >
                  <rect
                    x="0"
                    y="0"
                    width="320"
                    height="120"
                    fill={canvasZones.sky}
                    onClick={() => handleColorZone('sky')}
                  />
                  <rect
                    x="0"
                    y="120"
                    width="320"
                    height="50"
                    fill={canvasZones.ground}
                    onClick={() => handleColorZone('ground')}
                  />
                  <circle
                    cx="65"
                    cy="45"
                    r="25"
                    fill={canvasZones.sun}
                    stroke="#1E293B"
                    strokeWidth="3"
                    onClick={() => handleColorZone('sun')}
                  />
                  <rect
                    x="130"
                    y="55"
                    width="90"
                    height="70"
                    rx="16"
                    fill={canvasZones.body}
                    stroke="#1E293B"
                    strokeWidth="3"
                    onClick={() => handleColorZone('body')}
                  />
                  <text x="175" y="102" textAnchor="middle" fontSize="32" pointerEvents="none">
                    {topic.vocabulary[0].emoji}
                  </text>
                </svg>
              </div>

              <div className="rounded-3xl bg-white border-2 border-sky-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Bước 2: Đếm đủ 8 hình ({countedIndices.length}/8)
                  </h3>
                  {countedIndices.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCountedIndices([])}
                      className="min-h-[34px] px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Đếm lại
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
                    const isCounted = countedIndices.includes(idx);
                    const orderNumber = countedIndices.indexOf(idx) + 1;
                    const item = topic.vocabulary[idx % topic.vocabulary.length];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCountTap(idx)}
                        className={`min-h-[82px] rounded-2xl border-2 flex flex-col items-center justify-center transition cursor-pointer ${
                          isCounted
                            ? 'bg-emerald-50 border-emerald-400 scale-105'
                            : 'bg-sky-50 border-sky-200 hover:bg-sky-100'
                        }`}
                      >
                        <span className="text-3xl">{item.emoji}</span>
                        <span className="text-[11px] font-bold text-slate-700 mt-0.5 truncate max-w-full px-1">
                          {item.en}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                          {isCounted ? `#${orderNumber}` : 'Chạm đếm'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* GAME 6: Phonics Word Builder & Voice Echo (3 words required) */}
          {selectedGame === 'word_echo' && (
            <div className="rounded-3xl bg-white border-2 border-purple-200 p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{currentPhonicsItem.emoji}</span>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 text-[11px] font-extrabold mb-1">
                      Màn {wordEchoCompletedCount + 1}/3 · Ghép đủ chữ và đọc to cả 3 từ
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Từ mục tiêu: {currentPhonicsItem.en} ({currentPhonicsItem.vi})
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWordBuilderIdx((i) => i + 1);
                    setPickedTileIds([]);
                    setEchoSuccess(false);
                    setFeedbackBanner(null);
                  }}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs cursor-pointer"
                >
                  Đổi từ khác
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600">
                  Bước 1: Chạm các chữ cái theo đúng thứ tự "{targetWordUpper.split('').join(' - ')}" ({pickedTileIds.length}/{targetWordUpper.length})
                </div>

                {/* Progress slots */}
                <div className="flex flex-wrap gap-1.5 py-1">
                  {targetWordUpper.split('').map((expectedChar, idx) => {
                    const isFilled = idx < pickedTileIds.length;
                    return (
                      <div
                        key={idx}
                        className={`w-10 h-10 rounded-xl border-2 font-black text-base flex items-center justify-center ${
                          isFilled
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : 'bg-slate-100 border-dashed border-slate-300 text-slate-400'
                        }`}
                      >
                        {isFilled ? expectedChar : '?'}
                      </div>
                    );
                  })}
                </div>

                {/* Scrambled letter buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {letterPool.map((tile) => {
                    const isUsed = pickedTileIds.includes(tile.id);
                    return (
                      <button
                        key={tile.id}
                        type="button"
                        disabled={isUsed}
                        onClick={() => handlePickLetter(tile)}
                        className={`w-12 h-12 rounded-2xl border-2 font-extrabold text-lg flex items-center justify-center transition cursor-pointer ${
                          isUsed
                            ? 'bg-slate-100 border-slate-200 text-slate-300 scale-95'
                            : 'bg-purple-50 border-purple-300 text-purple-950 hover:bg-purple-100 active:scale-95'
                        }`}
                      >
                        {tile.char}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                    Bước 2: Nhại giọng theo cô ({currentPhonicsItem.en} — {currentPhonicsItem.sentence3To4y.en})
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Sau khi ghép xong chữ ở Bước 1, bé bấm nút để đọc to theo cô nhé!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleEchoMicPractice}
                  disabled={isListeningEcho}
                  className={`min-h-[42px] px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isListeningEcho
                      ? 'bg-rose-500 text-white animate-pulse'
                      : pickedTileIds.length === targetWordUpper.length
                      ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isListeningEcho ? 'Đang nghe bé...' : 'Nghe cô & Nói theo'}</span>
                </button>
              </div>

              {echoSuccess && (
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bé phát âm tuyệt vời lắm!</span>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: Interactive Song & Nursery Rhyme */}
      {activeTab === 'rhyme' && (
        <section className="rounded-3xl bg-white border-2 border-pink-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Bài hát & Vần điệu: {topic.rhyme.title}
              </h2>
              <p className="text-xs text-slate-600">
                Chạm từng câu để nghe tiếng Anh chuẩn bản xứ kèm lời dịch giọng cô miền Bắc:
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                playMelodyNotes(topic.rhyme.melodyStyle, settings.volume);
                const segments = topic.rhyme.lines.flatMap((l) => [
                  { lang: 'en' as const, text: l.en },
                  { lang: 'vi' as const, text: l.vi },
                ]);
                setTimeout(() => speakTeacherVoice(segments, settings), 700);
              }}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Hát cả bài</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {topic.rhyme.lines.map((line, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  playMelodyNotes(topic.rhyme.melodyStyle, settings.volume);
                  speakTeacherVoice(
                    [
                      { lang: 'en', text: line.en },
                      { lang: 'vi', text: line.vi },
                    ],
                    settings
                  );
                }}
                className="p-3.5 rounded-2xl bg-pink-50/70 hover:bg-pink-100/80 border border-pink-200 text-left flex flex-col justify-between gap-1.5 transition cursor-pointer"
              >
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    🎵 {line.en}
                  </div>
                  <div className="text-xs font-medium text-slate-700 mt-0.5">{line.vi}</div>
                </div>
                <span className="text-[11px] font-bold text-pink-700 flex items-center gap-1">
                  <Heart className="w-3 h-3 shrink-0" />
                  Động tác: {line.actionHintVi}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Celebratory Topic Completion Modal with Fireworks (Confetti) */}
      {showCelebrationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="celebration-title"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl border-4 border-amber-300 space-y-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 flex items-center justify-center text-5xl sm:text-6xl mx-auto shadow-lg animate-bounce border-4 border-white">
                {topic.rewardSticker.emoji}
              </div>
              <span className="absolute -top-1 -right-1 text-2xl">✨</span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
                🎉 Chúc Mừng Bé Ơi!
              </div>
              <h2 id="celebration-title" className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {topic.titleVi}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                Bé đã vượt qua đủ các màn chơi và nhận huy hiệu: <strong>{topic.rewardSticker.nameVi}</strong>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3].map((star) => (
                <div key={star} className="flex items-center gap-1 text-amber-500 font-black text-lg">
                  <Star className="w-7 h-7 fill-amber-400 text-amber-500 animate-pulse" />
                </div>
              ))}
              <span className="text-sm font-extrabold text-amber-700 ml-1">+3 Ngôi Sao</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  fireFireworksCelebration();
                  playSoundEffect('sparkle', settings.volume);
                }}
                className="flex-1 min-h-[46px] rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
              >
                <span>🎆 Bắn Pháo Hoa!</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCelebrationModal(false);
                  onBack();
                }}
                className="flex-1 min-h-[46px] rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
              >
                <span>Đổi chủ đề khác →</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCelebrationModal(false)}
              className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 py-1 cursor-pointer"
            >
              Chơi lại chủ đề này
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
