export type AgeGroupId = '0-3m' | '4-12m' | '1-2y' | '2-3y' | '3-4y' | '4-5y';

export type GameType =
  | 'tap_correct'
  | 'balloon_pop'
  | 'basket_drag'
  | 'memory_match'
  | 'coloring_count'
  | 'word_echo';

export type SoundEffectType =
  | 'meow'
  | 'woof'
  | 'moo'
  | 'quack'
  | 'oink'
  | 'baa'
  | 'cluck'
  | 'neigh'
  | 'crunch'
  | 'splash'
  | 'pop'
  | 'sparkle'
  | 'honk'
  | 'roar'
  | 'chirp'
  | 'drum';

export interface SpeechSegment {
  text: string;
  lang: 'vi' | 'en';
}

export interface AgeGroupConfig {
  id: AgeGroupId;
  label: string;
  shortLabel: string;
  stageTitle: string;
  subtitle: string;
  sessionMinutes: string;
  recommendedDailyLimitMins: number;
  underTwoNotice: boolean;
  badgeColor: string;
  accentColor: string;
  focusDescription: string;
  supportedGameTypes: GameType[];
}

export interface VocabularyItem {
  id: string;
  en: string;
  vi: string;
  phonetic: string;
  emoji: string;
  svgKey?: string;
  colorHex: string;
  bgTint: string;
  soundEffect: SoundEffectType;
  soundLabelVi: string;
  phrase2To3y: {
    en: string;
    vi: string;
  };
  sentence3To4y: {
    en: string;
    vi: string;
  };
  phonics4To5y: {
    letter: string;
    sound: string;
    spelling: string;
    questionEn: string;
    questionVi: string;
  };
}

export interface NarratorCharacter {
  id: string;
  name: string;
  species: string;
  emoji: string;
  avatarBg: string;
  greetingVi: string;
}

export interface LessonRhyme {
  title: string;
  melodyStyle: 'twinkle' | 'macdonald' | 'happy' | 'lullaby';
  lines: {
    en: string;
    vi: string;
    actionHintVi: string;
  }[];
}

export interface TopicLesson {
  id: string;
  order: number;
  titleVi: string;
  titleEn: string;
  isCompleteSample: boolean;
  worldTheme: {
    bgGradient: string;
    cardBg: string;
    borderColor: string;
    accentHex: string;
    iconEmoji: string;
  };
  narrator: NarratorCharacter;
  storyIntroVi: string;
  parentRealLifeTipVi: string;
  rewardSticker: {
    id: string;
    nameVi: string;
    emoji: string;
  };
  rhyme: LessonRhyme;
  vocabulary: VocabularyItem[];
}

export interface ParentSettings {
  selectedAge: AgeGroupId;
  voicePersona: 'Kore' | 'Zephyr' | 'Puck';
  voiceSpeed: 'slow' | 'normal' | 'fast';
  volume: number; // 0.0 to 1.0
  autoOffEnabled: boolean; // Allows toggling auto-off / eye-rest timer ON or OFF
  dailyLimitMinutes: number; // Adjustable timer duration in minutes
  useGeminiTTS: boolean;
  allowMicrophone: boolean;
  autoFullscreen?: boolean; // Automatically enter full-screen mode on launch/interaction
  englishAccent?: 'en-US' | 'en-GB'; // American vs British English accent choice
  parentPin?: string; // Custom PIN or password configured by parents to unlock settings and screen-time limit
  storyLanguage?: 'vi' | 'en' | 'bilingual'; // Cài đặt ngôn ngữ đọc truyện: Tiếng Việt, Tiếng Anh, hoặc Song ngữ
  characterVoices?: boolean; // Giả giọng đọc theo nhân vật (giọng sói trầm, giọng thỏ/heo con non nớt, tiên ông ấm áp...)
}

export type StoryAgeCategory = '0-2y' | '2-4y' | '4-5y';
export type StoryGenre =
  | 'folk_rhyme'
  | 'picture_repetition'
  | 'animal_fable'
  | 'vietnamese_fairytale'
  | 'world_fairytale'
  | 'aesop_fable';

export interface StoryDialogueSegment {
  speaker: string;
  speakerEmoji: string;
  textVi: string;
  textEn: string;
  voiceStyle?: 'narrator' | 'elder' | 'hero' | 'child' | 'gentle' | 'wolf' | 'fox';
}

export interface StoryBookPage {
  pageIndex: number;
  illustrationEmoji: string;
  illustrationDesc: string;
  bgGradient: string;
  textVi: string;
  textEn: string;
  dialogues?: StoryDialogueSegment[];
}

export interface StoryBookItem {
  id: string;
  indexNumber: number;
  titleVi: string;
  titleEn: string;
  ageCategory: StoryAgeCategory;
  genre: StoryGenre;
  isNewStar?: boolean;
  emoji: string;
  coverColor: string;
  summaryVi: string;
  summaryEn: string;
  moralLessonVi: string; // Bài học giáo dục rút ra cho bé cuối câu chuyện
  moralLessonEn: string;
  moralBadgeVi: string;
  moralBadgeEn: string;
  pages: StoryBookPage[];
}

export interface WordMasteryRecord {
  wordId: string;
  topicId: string;
  en: string;
  vi: string;
  emoji: string;
  timesPracticed: number;
  lastPracticedAt: number;
}

export interface RecentActivityItem {
  id: string;
  kind: 'game' | 'topic';
  titleVi: string;
  titleEn: string;
  subtitleEn: string;
  emoji: string;
}

export interface LearningProgress {
  stars: number;
  unlockedStickers: string[];
  completedTopics: string[];
  wordsLearned: Record<string, WordMasteryRecord>;
  todayMinutesPlayed: number;
  lastPlayDate: string;
  sessionRotationSeed: number;
  gameLevels?: Record<string, number>;
  recentActivities?: RecentActivityItem[];
}

export interface ChildProfile {
  id: string;
  name: string;
  avatarEmoji: string;
  avatarBg: string;
  ageId: AgeGroupId;
  progress: LearningProgress;
}

export type BrainCategoryKey =
  | 'thinking'
  | 'english'
  | 'numbers'
  | 'shapes_colors'
  | 'puzzles'
  | 'discovery';

export interface BrainGameItem {
  id: string;
  category: BrainCategoryKey;
  titleVi: string;
  titleEn: string;
  descriptionEn: string;
  promptVi: string;
  ageLabel: string;
  emoji: string;
  iconBg?: string;
  defaultLevel?: number;
}

export interface BrainCategorySection {
  id: BrainCategoryKey;
  titleVi: string;
  subtitleVi: string;
  iconEmoji: string;
  iconBg: string;
  games: BrainGameItem[];
}


