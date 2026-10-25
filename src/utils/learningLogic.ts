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
    label: '0–3 tháng',
    shortLabel: '0–3 th',
    stageTitle: 'Giác quan đầu đời',
    subtitle: 'Bố mẹ dẫn dắt · Tương phản Đen–Trắng–Đỏ & Nhạc ru',
    sessionMinutes: '2–3 phút',
    recommendedDailyLimitMins: 5,
    underTwoNotice: true,
    badgeColor: 'bg-rose-100 text-rose-900',
    accentColor: '#F43F5E',
    focusDescription:
      'Hình tương phản cao chuyển động chậm, nhạc ru êm dịu và thẻ gợi ý để bố mẹ trò chuyện, hát ru cùng bé.',
    supportedGameTypes: ['tap_correct'],
  },
  {
    id: '4-12m',
    label: '4–12 tháng',
    shortLabel: '4–12 th',
    stageTitle: 'Nghe và nhìn',
    subtitle: 'Thẻ âm thanh lớn · Trò Ú òa (Peek-a-boo) & Đập bong bóng',
    sessionMinutes: '3–5 phút',
    recommendedDailyLimitMins: 10,
    underTwoNotice: true,
    badgeColor: 'bg-amber-100 text-amber-900',
    accentColor: '#F59E0B',
    focusDescription:
      'Chạm thẻ hình lớn nghe từ tiếng Anh và tiếng kêu thật, chơi Ú òa hoạt hình và chạm vỡ bong bóng xà phòng.',
    supportedGameTypes: ['tap_correct', 'balloon_pop'],
  },
  {
    id: '1-2y',
    label: '1–2 tuổi',
    shortLabel: '1–2 tuổi',
    stageTitle: 'Nói bi bô',
    subtitle: 'Từ đơn · Chạm hình, Đập bóng bay, Kéo vào giỏ & Tô màu',
    sessionMinutes: '5–7 phút',
    recommendedDailyLimitMins: 15,
    underTwoNotice: true,
    badgeColor: 'bg-sky-100 text-sky-900',
    accentColor: '#0EA5E9',
    focusDescription:
      'Từ vựng đơn quen thuộc (màu sắc, con vật, trái cây, gia đình). Bé chạm đúng hình, cho vật vào giỏ và tô màu bằng ngón tay.',
    supportedGameTypes: ['tap_correct', 'balloon_pop', 'basket_drag', 'coloring_count'],
  },
  {
    id: '2-3y',
    label: '2–3 tuổi',
    shortLabel: '2–3 tuổi',
    stageTitle: 'Khám phá thế giới',
    subtitle: 'Cụm 2–3 từ · Ghép đôi trí nhớ, Phân loại, Đếm 1–10',
    sessionMinutes: '6–8 phút',
    recommendedDailyLimitMins: 20,
    underTwoNotice: false,
    badgeColor: 'bg-emerald-100 text-emerald-900',
    accentColor: '#10B981',
    focusDescription:
      'Làm quen cụm từ "red apple", "big cow". Chơi lật thẻ trí nhớ (Memory Match), phân loại vào giỏ và đếm đồ vật.',
    supportedGameTypes: [
      'tap_correct',
      'basket_drag',
      'memory_match',
      'coloring_count',
      'balloon_pop',
    ],
  },
  {
    id: '3-4y',
    label: '3–4 tuổi',
    shortLabel: '3–4 tuổi',
    stageTitle: 'Bé tập nói câu',
    subtitle: 'Câu ngắn "I like..." · Chữ cái A–Z, Đố nghe-chọn, Nhập vai',
    sessionMinutes: '8–10 phút',
    recommendedDailyLimitMins: 20,
    underTwoNotice: false,
    badgeColor: 'bg-purple-100 text-purple-900',
    accentColor: '#8B5CF6',
    focusDescription:
      'Tập nói câu đơn giản ("I like apples", "I see a cow"), ghép chữ cái đầu tiên (A is for Apple) và giải câu đố.',
    supportedGameTypes: [
      'tap_correct',
      'memory_match',
      'basket_drag',
      'word_echo',
      'coloring_count',
    ],
  },
  {
    id: '4-5y',
    label: '4–5 tuổi',
    shortLabel: '4–5 tuổi',
    stageTitle: 'Bé sắp vào lớp 1',
    subtitle: 'Phonics & Đánh vần · Ghép từ 3 chữ cái, Đố vui & Nhại giọng',
    sessionMinutes: '8–10 phút',
    recommendedDailyLimitMins: 25,
    underTwoNotice: false,
    badgeColor: 'bg-pink-100 text-pink-900',
    accentColor: '#EC4899',
    focusDescription:
      'Âm vị (Phonics), đánh vần từ ngắn (C-A-T, S-U-N), nối từ với hình, đếm số và trò chơi nhại giọng chuẩn bản xứ.',
    supportedGameTypes: [
      'word_echo',
      'memory_match',
      'tap_correct',
      'basket_drag',
      'coloring_count',
      'balloon_pop',
    ],
  },
];

export function getAgeGroupConfig(ageId: AgeGroupId): AgeGroupConfig {
  return AGE_GROUPS.find((g) => g.id === ageId) || AGE_GROUPS[2];
}

/**
 * Builds language-separated speech segments (`lang: 'vi'` vs `lang: 'en'`)
 * so that Vietnamese is 100% read by a Northern Vietnamese voice and English
 * is 100% read by a native English voice (never an English voice reading Vietnamese!).
 */
export function buildSegmentedVocabularyScript(
  item: VocabularyItem,
  ageId: AgeGroupId
): SpeechSegment[] {
  const spelledEnglish = item.en
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .split('')
    .join(', ');

  const cleanVi = item.vi.replace(/^[Cc]hữ\s+[A-Z]\s*-\s*/, '').toLowerCase();

  switch (ageId) {
    case '0-3m':
    case '4-12m':
    case '1-2y':
      return [
        { lang: 'vi', text: `Bé ơi nhìn nè! Đây là ${cleanVi}.` },
        { lang: 'en', text: `${item.en}! ${item.en}!` },
        { lang: 'vi', text: item.soundLabelVi },
      ];
    case '2-3y':
      return [
        { lang: 'vi', text: `Đây là ${cleanVi}.` },
        { lang: 'en', text: `${item.en}! ${item.phrase2To3y.en}!` },
        { lang: 'vi', text: `${item.phrase2To3y.vi}. ${item.soundLabelVi}` },
      ];
    case '3-4y':
      return [
        { lang: 'vi', text: `Đây là ${cleanVi}. Cùng nói câu tiếng Anh với cô nhé!` },
        { lang: 'en', text: `${item.en}! ${item.sentence3To4y.en}` },
        { lang: 'vi', text: `Nghĩa là: ${item.sentence3To4y.vi}` },
      ];
    case '4-5y':
      return [
        { lang: 'vi', text: `Đây là ${cleanVi}. Cùng đánh vần tiếng Anh với cô nhé!` },
        { lang: 'en', text: `${spelledEnglish}. ${item.en}! ${item.sentence3To4y.en}` },
        { lang: 'vi', text: item.sentence3To4y.vi },
      ];
  }
}

/**
 * Legacy string builder for display/captions, using buildSegmentedVocabularyScript.
 */
export function buildBilingualVocabularyScript(
  item: VocabularyItem,
  ageId: AgeGroupId
): string {
  return buildSegmentedVocabularyScript(item, ageId)
    .map((s) => s.text)
    .join(' ');
}

/**
 * Builds segmented encouragement when a child taps a different option.
 * Explicitly uses "Cố lên nào bé ơi!" and keeps Vietnamese and English segments 100% separate.
 */
export function buildSegmentedGentleTryAgain(
  tappedItem: VocabularyItem,
  targetItem: VocabularyItem
): SpeechSegment[] {
  const tappedVi = tappedItem.vi.replace(/^[Cc]hữ\s+[A-Z]\s*-\s*/, '').toLowerCase();
  const targetVi = targetItem.vi.replace(/^[Cc]hữ\s+[A-Z]\s*-\s*/, '').toLowerCase();
  return [
    { lang: 'vi', text: `Cố lên nào bé ơi! Đây là ${tappedVi}.` },
    { lang: 'en', text: `${tappedItem.en}!` },
    { lang: 'vi', text: `Bé hãy tìm ${targetVi} cùng cô nhé!` },
    { lang: 'en', text: `${targetItem.en}!` },
  ];
}

export function buildGentleTryAgainScript(
  tappedItem: VocabularyItem,
  targetItem: VocabularyItem
): string {
  return buildSegmentedGentleTryAgain(tappedItem, targetItem)
    .map((s) => s.text)
    .join(' ');
}

/**
 * Rotates the order of supported games for a given age group and session seed
 * so the child experiences fresh variety every time they enter a lesson.
 */
export function getRotatedGamesForAge(
  ageId: AgeGroupId,
  rotationSeed: number
): GameType[] {
  const config = getAgeGroupConfig(ageId);
  const games = [...config.supportedGameTypes];
  if (games.length <= 1) return games;
  const offset = Math.abs(Math.floor(rotationSeed)) % games.length;
  return [...games.slice(offset), ...games.slice(0, offset)];
}

/**
 * Deterministically picks "Bài ngẫu nhiên hôm nay" (Today's Random Topic)
 * based on the date string (YYYY-MM-DD) or an optional offset.
 */
export function getDailyRandomTopic(
  topics: TopicLesson[],
  dateString: string,
  extraOffset = 0
): TopicLesson {
  if (topics.length === 0) {
    throw new Error('Topics array must not be empty');
  }
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash * 31 + dateString.charCodeAt(i)) >>> 0;
  }
  const index = (hash + Math.abs(extraOffset)) % topics.length;
  return topics[index];
}

/**
 * Selects up to `limit` words for Spaced Repetition Review ("Ôn lại từ cũ").
 */
export function getWordsForSpacedRepetition(
  wordsLearned: Record<string, WordMasteryRecord>,
  topics: TopicLesson[],
  limit = 4
): WordMasteryRecord[] {
  const records = Object.values(wordsLearned);
  if (records.length > 0) {
    return [...records]
      .sort((a, b) => {
        if (a.timesPracticed !== b.timesPracticed) {
          return a.timesPracticed - b.timesPracticed;
        }
        return a.lastPracticedAt - b.lastPracticedAt;
      })
      .slice(0, limit);
  }

  const fallbackRecords: WordMasteryRecord[] = [];
  for (const topic of topics) {
    for (const vocab of topic.vocabulary) {
      fallbackRecords.push({
        wordId: vocab.id,
        topicId: topic.id,
        en: vocab.en,
        vi: vocab.vi,
        emoji: vocab.emoji,
        timesPracticed: 1,
        lastPracticedAt: 0,
      });
      if (fallbackRecords.length >= limit) return fallbackRecords;
    }
  }
  return fallbackRecords;
}

export interface ParentMathChallenge {
  a: number;
  b: number;
  questionText: string;
  expectedAnswer: number;
}

export function generateParentMathChallenge(seed?: number): ParentMathChallenge {
  const s = typeof seed === 'number' ? Math.abs(Math.floor(seed)) : Date.now();
  const a = (s % 6) + 3;
  const b = ((s >> 3) % 5) + 2;
  return {
    a,
    b,
    questionText: `${a} + ${b} = ?`,
    expectedAnswer: a + b,
  };
}

export function verifyParentMathAnswer(
  challenge: ParentMathChallenge,
  userInput: string | number
): boolean {
  const parsed = typeof userInput === 'number' ? userInput : parseInt(userInput.trim(), 10);
  if (Number.isNaN(parsed)) return false;
  return parsed === challenge.expectedAnswer;
}

/**
 * Verifies the parent's custom PIN/password (or falls back to math answer only if no custom PIN is set).
 */
export function verifyParentPassword(
  configuredPin: string | undefined,
  enteredValue: string,
  fallbackChallenge?: ParentMathChallenge
): boolean {
  const trimmedEntered = enteredValue.trim();
  if (!trimmedEntered) return false;
  const activePin = configuredPin?.trim();
  if (activePin && activePin.length > 0) {
    return trimmedEntered === activePin;
  }
  if (fallbackChallenge) {
    return verifyParentMathAnswer(fallbackChallenge, trimmedEntered);
  }
  return false;
}

export interface ScreenTimeStatus {
  minutesPlayed: number;
  dailyLimit: number;
  remainingMinutes: number;
  autoOffEnabled: boolean;
  isLimitReached: boolean;
  shouldRemindEyeRest: boolean;
}

export function checkScreenTimeStatus(
  minutesPlayed: number,
  dailyLimit: number,
  autoOffEnabled = true
): ScreenTimeStatus {
  const safePlayed = Math.max(0, Math.round(minutesPlayed));
  const safeLimit = Math.max(1, Math.round(dailyLimit));
  const remainingMinutes = Math.max(0, safeLimit - safePlayed);
  const isLimitReached = autoOffEnabled && safePlayed >= safeLimit;
  const shouldRemindEyeRest = autoOffEnabled && safePlayed > 0 && safePlayed % 10 === 0;
  return {
    minutesPlayed: safePlayed,
    dailyLimit: safeLimit,
    remainingMinutes,
    autoOffEnabled,
    isLimitReached,
    shouldRemindEyeRest,
  };
}

