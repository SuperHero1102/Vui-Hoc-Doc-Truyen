import type {
  AgeGroupConfig,
  AgeGroupId,
  GameType,
  SpeechSegment,
  TopicLesson,
  VocabularyItem,
  WordMasteryRecord,
} from '../types/learning';

export const AGE_GROUPS: AgeGroupConfig[] = [
  {
    id: '0-3m',
    label: '0 - 3 tháng',
    shortLabel: '0-3m',
    stageTitle: 'Kích thích thị giác & thính giác',
    subtitle: 'Tương phản đen trắng, âm thanh êm dịu',
    sessionMinutes: '3-5 phút',
    recommendedDailyLimitMins: 5,
    underTwoNotice: true,
    badgeColor: 'bg-slate-100 text-slate-700',
    accentColor: '#64748B',
    focusDescription: 'Tranh tương phản cao đen trắng đỏ, tiếng vỗ về dịu nhẹ giúp phát triển thị giác và làm quen âm điệu ngôn ngữ.',
    supportedGameTypes: [],
  },
  {
    id: '4-12m',
    label: '4 - 12 tháng',
    shortLabel: '4-12m',
    stageTitle: 'Ú òa & Khám phá âm thanh',
    subtitle: 'Trò chơi ú òa, tiếng kêu động vật vui nhộn',
    sessionMinutes: '5-10 phút',
    recommendedDailyLimitMins: 10,
    underTwoNotice: true,
    badgeColor: 'bg-pink-100 text-pink-700',
    accentColor: '#EC4899',
    focusDescription: 'Thẻ bài ú òa tương tác, làm quen với tiếng kêu con vật và âm thanh tự nhiên.',
    supportedGameTypes: ['tap_correct'],
  },
  {
    id: '1-2y',
    label: '1 - 2 tuổi',
    shortLabel: '1-2y',
    stageTitle: 'Bập bẹ từ vựng đầu đời',
    subtitle: 'Chạm nghe từ đơn, bóng bay, vỗ tay',
    sessionMinutes: '10-15 phút',
    recommendedDailyLimitMins: 15,
    underTwoNotice: true,
    badgeColor: 'bg-amber-100 text-amber-800',
    accentColor: '#F59E0B',
    focusDescription: 'Từ đơn giản, âm thanh chuẩn cô giáo phát âm rõ ràng, hứng thú khám phá.',
    supportedGameTypes: ['tap_correct', 'balloon_pop'],
  },
  {
    id: '2-3y',
    label: '2 - 3 tuổi',
    shortLabel: '2-3y',
    stageTitle: 'Cụm từ 2 từ & Thu hoạch',
    subtitle: 'Kéo thả vào giỏ, cụm từ ghép sinh động',
    sessionMinutes: '15-20 phút',
    recommendedDailyLimitMins: 20,
    underTwoNotice: false,
    badgeColor: 'bg-emerald-100 text-emerald-800',
    accentColor: '#10B981',
    focusDescription: 'Kết hợp cụm từ ngắn (A cute cat, red apple), kéo thả đồ vật vào giỏ theo yêu cầu.',
    supportedGameTypes: ['tap_correct', 'balloon_pop', 'basket_drag'],
  },
  {
    id: '3-4y',
    label: '3 - 4 tuổi',
    shortLabel: '3-4y',
    stageTitle: 'Câu hoàn chỉnh & Trí nhớ',
    subtitle: 'Lật thẻ ghép đôi, tô màu đếm số',
    sessionMinutes: '15-25 phút',
    recommendedDailyLimitMins: 25,
    underTwoNotice: false,
    badgeColor: 'bg-sky-100 text-sky-800',
    accentColor: '#0EA5E9',
    focusDescription: 'Luyện câu hoàn chỉnh, rèn luyện trí nhớ qua trò lật thẻ và tô màu đếm đồ vật.',
    supportedGameTypes: ['tap_correct', 'balloon_pop', 'basket_drag', 'memory_match', 'coloring_count'],
  },
  {
    id: '4-5y',
    label: '4 - 5 tuổi',
    shortLabel: '4-5y',
    stageTitle: 'Phonics, Ghép chữ & Tự tin nói',
    subtitle: 'Phát âm chữ cái phonics, ghép vần & tập nói',
    sessionMinutes: '20-30 phút',
    recommendedDailyLimitMins: 30,
    underTwoNotice: false,
    badgeColor: 'bg-indigo-100 text-indigo-800',
    accentColor: '#6366F1',
    focusDescription: 'Nhận diện mặt chữ cái, phát âm Phonics theo chuẩn quốc tế, tự tin nói nhại theo cô.',
    supportedGameTypes: ['tap_correct', 'balloon_pop', 'basket_drag', 'memory_match', 'coloring_count', 'word_echo'],
  },
];

export function getAgeGroupConfig(ageId: AgeGroupId): AgeGroupConfig {
  return AGE_GROUPS.find((g) => g.id === ageId) || AGE_GROUPS[2];
}

export function getRotatedGamesForAge(ageId: AgeGroupId, seed = 0): GameType[] {
  const cfg = getAgeGroupConfig(ageId);
  const games = [...cfg.supportedGameTypes];
  if (games.length <= 1) return games;
  const shift = Math.abs(seed) % games.length;
  return [...games.slice(shift), ...games.slice(0, shift)];
}

export function buildSegmentedVocabularyScript(
  item: VocabularyItem,
  ageId: AgeGroupId
): SpeechSegment[] {
  if (ageId === '0-3m' || ageId === '4-12m') {
    return [
      { lang: 'vi', text: `Bé ơi, đây là ${item.vi.toLowerCase()}.` },
      { lang: 'en', text: item.en },
    ];
  }

  if (ageId === '1-2y') {
    return [
      { lang: 'vi', text: `Bé ơi, đây là ${item.vi.toLowerCase()}!` },
      { lang: 'en', text: `${item.en}!` },
    ];
  }

  if (ageId === '2-3y' && item.phrase2To3y) {
    return [
      { lang: 'vi', text: `${item.vi}! ${item.phrase2To3y.vi}.` },
      { lang: 'en', text: `${item.en}! ${item.phrase2To3y.en}!` },
    ];
  }

  if (ageId === '3-4y' && item.sentence3To4y) {
    return [
      { lang: 'vi', text: `${item.vi}! ${item.sentence3To4y.vi}.` },
      { lang: 'en', text: `${item.sentence3To4y.en}!` },
    ];
  }

  if (ageId === '4-5y' && item.phonics4To5y) {
    return [
      {
        lang: 'vi',
        text: `Chữ ${item.phonics4To5y.letter}. Phát âm là ${item.phonics4To5y.sound}. ${item.phonics4To5y.questionVi}`,
      },
      {
        lang: 'en',
        text: `${item.phonics4To5y.letter}! ${item.phonics4To5y.sound}! ${item.en}!`,
      },
    ];
  }

  return [
    { lang: 'vi', text: `${item.vi}!` },
    { lang: 'en', text: `${item.en}!` },
  ];
}

export function buildGentleTryAgainScript(
  choice: VocabularyItem,
  target: VocabularyItem
): string {
  return `Chưa đúng rồi bé ơi, đây là ${choice.vi.toLowerCase()} (${choice.en}) mà! Bé tìm lại ${target.vi.toLowerCase()} (${target.en}) nhé!`;
}

export function buildSegmentedGentleTryAgain(
  choice: VocabularyItem,
  target: VocabularyItem
): SpeechSegment[] {
  return [
    { lang: 'vi', text: `Bé ơi, đây là ${choice.vi.toLowerCase()} mà.` },
    { lang: 'en', text: `${choice.en}!` },
    { lang: 'vi', text: `Bé tìm ${target.vi.toLowerCase()} nhé!` },
    { lang: 'en', text: `${target.en}!` },
  ];
}

export function getDailyRandomTopic(
  topics: TopicLesson[],
  dateStr: string,
  seedOffset = 0
): TopicLesson {
  if (!topics || topics.length === 0) return {} as TopicLesson;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash + seedOffset) % topics.length;
  return topics[index];
}

export function getWordsForSpacedRepetition(
  wordsLearned: Record<string, WordMasteryRecord> = {},
  topics: TopicLesson[] = [],
  count = 4
): WordMasteryRecord[] {
  const learnedList = Object.values(wordsLearned);
  if (learnedList.length >= count) {
    const sorted = [...learnedList].sort((a, b) => {
      if (a.timesPracticed !== b.timesPracticed) {
        return a.timesPracticed - b.timesPracticed;
      }
      return a.lastPracticedAt - b.lastPracticedAt;
    });
    return sorted.slice(0, count);
  }

  const result: WordMasteryRecord[] = [...learnedList];
  const usedIds = new Set(result.map((r) => r.wordId));

  for (const topic of topics) {
    for (const v of topic.vocabulary || []) {
      if (result.length >= count) break;
      if (!usedIds.has(v.id)) {
        usedIds.add(v.id);
        result.push({
          wordId: v.id,
          topicId: topic.id,
          en: v.en,
          vi: v.vi,
          emoji: v.emoji,
          timesPracticed: 0,
          lastPracticedAt: 0,
        });
      }
    }
    if (result.length >= count) break;
  }

  return result.slice(0, count);
}

export function checkScreenTimeStatus(
  minutesPlayed: number,
  dailyLimit: number,
  autoOffEnabled = true
): { shouldRemindEyeRest: boolean; isLimitReached: boolean; minutesRemaining: number } {
  if (!autoOffEnabled) {
    return { shouldRemindEyeRest: false, isLimitReached: false, minutesRemaining: 999 };
  }
  const minutesRemaining = Math.max(0, dailyLimit - minutesPlayed);
  const isLimitReached = minutesPlayed >= dailyLimit;
  const shouldRemindEyeRest = isLimitReached || (minutesRemaining <= 2 && minutesRemaining > 0);
  return { shouldRemindEyeRest, isLimitReached, minutesRemaining };
}

export function generateParentMathChallenge(seed = Date.now()): {
  questionText: string;
  answer: number;
} {
  const a = (Math.abs(Math.sin(seed) * 10000) % 8 | 0) + 2;
  const b = (Math.abs(Math.cos(seed) * 10000) % 7 | 0) + 2;
  const isMult = Math.abs(seed) % 2 === 0;
  if (isMult) {
    return {
      questionText: `${a} × ${b} = ?`,
      answer: a * b,
    };
  }
  return {
    questionText: `${a + b} − ${b} = ?`,
    answer: a,
  };
}

export function verifyParentMathAnswer(
  challenge: { answer: number },
  input: string
): boolean {
  if (!input || !challenge) return false;
  return parseInt(input.trim(), 10) === challenge.answer;
}

export function verifyParentPassword(
  pin: string | undefined,
  input: string,
  challenge?: { answer: number }
): boolean {
  const cleanInput = input?.trim() || '';
  if (pin && pin.trim().length > 0) {
    return cleanInput === pin.trim();
  }
  if (challenge) {
    return parseInt(cleanInput, 10) === challenge.answer;
  }
  return cleanInput.length > 0;
}
