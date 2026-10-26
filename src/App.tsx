import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  Volume2,
  Star,
  Shield,
  Shuffle,
  RefreshCw,
  Compass,
  Clock,
  Power,
  Award,
  Baby,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Users,
  Gamepad2,
  Play,
  X,
  BookOpen,
  Headphones,
} from 'lucide-react';
import lessonsJson from './data/lessonsData.json';
import { ALL_BRAIN_GAMES, BRAIN_GAME_SECTIONS } from './data/brainGamesData';
import { STORY_BOOKS_DATA } from './data/storiesData';
import type {
  AgeGroupId,
  BrainCategoryKey,
  BrainGameItem,
  ChildProfile,
  LearningProgress,
  ParentSettings,
  RecentActivityItem,
  StoryBookItem,
  TopicLesson,
  VocabularyItem,
  WordMasteryRecord,
} from './types/learning';
import {
  AGE_GROUPS,
  checkScreenTimeStatus,
  getAgeGroupConfig,
  getDailyRandomTopic,
  getWordsForSpacedRepetition,
} from './utils/learningLogic';
import {
  playCelebrationChime,
  playSoundEffect,
  speakTeacherVoice,
  stopAllAudio,
} from './utils/audioEngine';
import { fireFireworksCelebration } from './utils/confetti';
import { SensoryZeroToThreeMonths } from './components/SensoryZeroToThreeMonths';
import { PeekabooFourToTwelveMonths } from './components/PeekabooFourToTwelveMonths';
import { LessonPlayground } from './components/LessonPlayground';
import { BrainGamePlayground } from './components/BrainGamePlayground';
import { StickerAlbumModal } from './components/StickerAlbumModal';
import { ParentDashboard, ParentGateModal, ScreenTimeLockModal } from './components/ParentArea';
import { AppBrandLogo, OfflineIndicator, PWAInstallButton } from './components/PWAWidgets';
import { ProfileManagerModal } from './components/ProfileManagerModal';
import { StoryReaderModal } from './components/StoryReaderModal';

const SETTINGS_STORAGE_KEY = 'bevuihoc_parent_settings_v3';
const PROFILES_STORAGE_KEY = 'bevuihoc_child_profiles_v3';
const ACTIVE_PROFILE_KEY = 'bevuihoc_active_profile_id_v3';

function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

const DEFAULT_SETTINGS: ParentSettings = {
  selectedAge: '1-2y',
  voicePersona: 'Kore',
  voiceSpeed: 'slow',
  volume: 0.85,
  autoOffEnabled: true,
  dailyLimitMinutes: 15,
  useGeminiTTS: true,
  allowMicrophone: false,
  autoFullscreen: true,
  storyLanguage: 'bilingual',
  characterVoices: true,
};

const INITIAL_PROFILES: ChildProfile[] = [
  {
    id: 'profile-bong',
    name: 'Bé Bông',
    avatarEmoji: '🐥',
    avatarBg: '#FEF08A',
    ageId: '1-2y',
    progress: {
      stars: 9,
      unlockedStickers: ['sticker-farm', 'sticker-fruits'],
      completedTopics: ['farm-animals', 'fruits'],
      wordsLearned: {},
      todayMinutesPlayed: 2,
      lastPlayDate: getTodayDateString(),
      sessionRotationSeed: 1,
    },
  },
  {
    id: 'profile-bin',
    name: 'Bé Bin',
    avatarEmoji: '🦁',
    avatarBg: '#FFEDD5',
    ageId: '4-5y',
    progress: {
      stars: 15,
      unlockedStickers: ['sticker-farm', 'sticker-jungle', 'sticker-numbers'],
      completedTopics: ['farm-animals', 'jungle-animals', 'numbers'],
      wordsLearned: {},
      todayMinutesPlayed: 1,
      lastPlayDate: getTodayDateString(),
      sessionRotationSeed: 2,
    },
  },
  {
    id: 'profile-soc',
    name: 'Bé Sóc',
    avatarEmoji: '🐰',
    avatarBg: '#FBCFE8',
    ageId: '2-3y',
    progress: {
      stars: 6,
      unlockedStickers: ['sticker-colors'],
      completedTopics: ['colors'],
      wordsLearned: {},
      todayMinutesPlayed: 0,
      lastPlayDate: getTodayDateString(),
      sessionRotationSeed: 1,
    },
  },
];

type AppDockTab = 'arcade' | 'stories' | 'worlds' | 'today' | 'sensory';
type CategoryFilterId = 'all' | 'nature' | 'food_body' | 'thinking' | 'life';
type ArcadeFilterId = 'all' | BrainCategoryKey | 'topics';

const CATEGORY_FILTERS: { id: CategoryFilterId; label: string; orders: number[] }[] = [
  { id: 'all', label: 'Tất cả (32)', orders: [] },
  { id: 'nature', label: 'Động vật & Tự nhiên', orders: [1, 2, 3, 4, 19, 25, 26, 30] },
  { id: 'food_body', label: 'Ẩm thực & Cơ thể', orders: [5, 6, 7, 12, 20, 21, 32] },
  { id: 'thinking', label: 'Chữ số & Tư duy', orders: [8, 9, 10, 11, 23, 27, 28, 29] },
  { id: 'life', label: 'Gia đình & Đời sống', orders: [13, 14, 15, 16, 17, 18, 22, 24, 31] },
];

export default function App() {
  const allTopics = useMemo(
    () => (lessonsJson as { topics: TopicLesson[] }).topics,
    []
  );

  const [profiles, setProfiles] = useState<ChildProfile[]>(() => {
    try {
      const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChildProfile[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const today = getTodayDateString();
          return parsed.map((p) => ({
            ...p,
            progress: {
              ...p.progress,
              todayMinutesPlayed:
                p.progress.lastPlayDate === today ? p.progress.todayMinutesPlayed : 0,
              lastPlayDate: today,
            },
          }));
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return INITIAL_PROFILES[0].id;
  });

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) || profiles[0],
    [profiles, activeProfileId]
  );

  const [settings, setSettings] = useState<ParentSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Sync active profile's ageId with settings.selectedAge
  const currentAgeId: AgeGroupId = activeProfile?.ageId || settings.selectedAge;
  const progress: LearningProgress = activeProfile.progress;

  const updateActiveProgress = useCallback(
    (updater: (prev: LearningProgress) => LearningProgress) => {
      setProfiles((prevProfiles) =>
        prevProfiles.map((p) =>
          p.id === activeProfile.id ? { ...p, progress: updater(p.progress) } : p
        )
      );
    },
    [activeProfile.id]
  );

  const [activeDockTab, setActiveDockTab] = useState<AppDockTab>('arcade');
  const [arcadeFilter, setArcadeFilter] = useState<ArcadeFilterId>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterId>('all');
  const [activeTopic, setActiveTopic] = useState<TopicLesson | null>(null);
  const [activeBrainGame, setActiveBrainGame] = useState<BrainGameItem | null>(null);
  const [worldPage, setWorldPage] = useState(0);
  const [randomSeedOffset, setRandomSeedOffset] = useState(0);
  const [isStickerAlbumOpen, setIsStickerAlbumOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isParentDashboardOpen, setIsParentDashboardOpen] = useState(false);
  const [showEyeRestModal, setShowEyeRestModal] = useState(false);
  const [showQuickTimerPopover, setShowQuickTimerPopover] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>(() =>
    String(settings.dailyLimitMinutes || 15)
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hasAttemptedAutoFullscreen, setHasAttemptedAutoFullscreen] = useState<boolean>(false);
  const [selectedStory, setSelectedStory] = useState<StoryBookItem | null>(null);
  const [storyCategoryFilter, setStoryCategoryFilter] = useState<string>('all');
  const [storySearchQuery, setStorySearchQuery] = useState<string>('');
  const mainScrollRef = useRef<HTMLElement | null>(null);

  const filteredStories = useMemo(() => {
    const q = storySearchQuery.trim().toLowerCase();
    return STORY_BOOKS_DATA.filter((story) => {
      if (q) {
        const matchTitle =
          story.titleVi.toLowerCase().includes(q) ||
          story.titleEn.toLowerCase().includes(q) ||
          story.summaryVi.toLowerCase().includes(q);
        if (!matchTitle) return false;
      }
      if (storyCategoryFilter === 'all') return true;
      if (storyCategoryFilter === '0-2y') return story.ageCategory === '0-2y';
      if (storyCategoryFilter === '2-4y') return story.ageCategory === '2-4y';
      if (storyCategoryFilter === '4-5y') return story.ageCategory === '4-5y';
      if (storyCategoryFilter === 'star') return Boolean(story.isNewStar);
      if (storyCategoryFilter === 'vn') {
        return (
          story.genre === 'vietnamese_fairytale' ||
          story.genre === 'folk_rhyme' ||
          story.id.includes('con-co') ||
          story.id.includes('nu-na') ||
          story.id.includes('dung-dang') ||
          story.id.includes('ganh-ganh') ||
          story.id.includes('ong-trang') ||
          story.id.includes('tam-cam') ||
          story.id.includes('thach-sanh') ||
          story.id.includes('cay-khe') ||
          story.id.includes('banh-chung') ||
          story.id.includes('su-tich') ||
          story.id.includes('chu-cuoi') ||
          story.id.includes('thanh-giong') ||
          story.id.includes('son-tinh') ||
          story.id.includes('ho-guom')
        );
      }
      if (storyCategoryFilter === 'world') {
        return (
          story.genre === 'world_fairytale' ||
          story.id.includes('lo-lem') ||
          story.id.includes('quang-khan-do') ||
          story.id.includes('bach-tuyet') ||
          story.id.includes('tien-ca') ||
          story.id.includes('ban-diem') ||
          story.id.includes('hoang-tu-ech') ||
          story.id.includes('linh-chi') ||
          story.id.includes('ti-hon') ||
          story.id.includes('quy-lun') ||
          story.id.includes('pinocchio') ||
          story.id.includes('hansel') ||
          story.id.includes('aladdin') ||
          story.id.includes('peter-pan') ||
          story.id.includes('alice') ||
          story.id.includes('jack') ||
          story.id.includes('cong-chua-hat-dau') ||
          story.id.includes('ngong-vang') ||
          story.id.includes('chan-cuu')
        );
      }
      if (storyCategoryFilter === 'aesop') {
        return (
          story.genre === 'aesop_fable' ||
          story.id.includes('qua-khat-nuoc') ||
          story.id.includes('cao-chum-nho') ||
          story.id.includes('su-tu-chuot') ||
          story.id.includes('kien-chau-chau')
        );
      }
      return true;
    });
  }, [storyCategoryFilter, storySearchQuery]);

  // Auto-reset main viewport scroll position to top when navigating into any game, lesson topic, or settings
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeBrainGame?.id, activeTopic?.id, isParentDashboardOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
      localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfile.id);
    } catch {
      // ignore
    }
  }, [profiles, activeProfile.id]);

  // Track Fullscreen API state & auto-enter fullscreen on first user interaction when enabled by default
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Silently ignore if iframe policy restricts native fullscreen
    }
  }, []);

  const handleFirstInteractionFullscreen = useCallback(() => {
    if (!hasAttemptedAutoFullscreen && settings.autoFullscreen !== false) {
      setHasAttemptedAutoFullscreen(true);
      if (typeof document !== 'undefined' && !document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {
          // Safe no-op in restricted iframe contexts
        });
      }
    }
  }, [hasAttemptedAutoFullscreen, settings.autoFullscreen]);

  // Check if daily limit is already reached when autoOffEnabled is true
  useEffect(() => {
    if (!settings.autoOffEnabled) {
      setShowEyeRestModal(false);
      return;
    }
    if (progress.todayMinutesPlayed >= settings.dailyLimitMinutes) {
      setShowEyeRestModal(true);
    }
  }, [settings.autoOffEnabled, settings.dailyLimitMinutes, progress.todayMinutesPlayed]);

  // Track play time every 60 seconds (only triggers eye-rest modal when autoOffEnabled is true)
  useEffect(() => {
    const interval = window.setInterval(() => {
      updateActiveProgress((prev) => {
        const nextMins = prev.todayMinutesPlayed + 1;
        const status = checkScreenTimeStatus(
          nextMins,
          settings.dailyLimitMinutes,
          settings.autoOffEnabled
        );
        if (status.shouldRemindEyeRest || status.isLimitReached) {
          setShowEyeRestModal(true);
        }
        return {
          ...prev,
          todayMinutesPlayed: nextMins,
        };
      });
    }, 60000);
    return () => window.clearInterval(interval);
  }, [settings.dailyLimitMinutes, settings.autoOffEnabled, updateActiveProgress]);

  const currentAgeConfig = useMemo(
    () => getAgeGroupConfig(currentAgeId),
    [currentAgeId]
  );

  const effectiveSettings: ParentSettings = useMemo(
    () => ({
      ...settings,
      selectedAge: currentAgeId,
    }),
    [settings, currentAgeId]
  );

  const dailyRandomTopic = useMemo(
    () => getDailyRandomTopic(allTopics, getTodayDateString(), randomSeedOffset),
    [allTopics, randomSeedOffset]
  );

  const reviewWords = useMemo(
    () => getWordsForSpacedRepetition(progress.wordsLearned, allTopics, 4),
    [progress.wordsLearned, allTopics]
  );

  const filteredTopics = useMemo(() => {
    const filterObj = CATEGORY_FILTERS.find((c) => c.id === categoryFilter);
    if (!filterObj || filterObj.id === 'all') return allTopics;
    return allTopics.filter((t) => filterObj.orders.includes(t.order));
  }, [allTopics, categoryFilter]);

  // Paginate topics into pages of 8 (4x2 grid on desktop, 2x4 on mobile) so all cards fit in 1 frame
  const TOPICS_PER_PAGE = 8;
  const totalWorldPages = Math.max(1, Math.ceil(filteredTopics.length / TOPICS_PER_PAGE));
  const safeWorldPage = Math.min(worldPage, totalWorldPages - 1);

  const currentPageTopics = useMemo(
    () =>
      filteredTopics.slice(
        safeWorldPage * TOPICS_PER_PAGE,
        safeWorldPage * TOPICS_PER_PAGE + TOPICS_PER_PAGE
      ),
    [filteredTopics, safeWorldPage]
  );

  const handleSelectAge = (ageId: AgeGroupId) => {
    stopAllAudio();
    const cfg = getAgeGroupConfig(ageId);
    setSettings((prev) => ({
      ...prev,
      selectedAge: ageId,
    }));
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfile.id ? { ...p, ageId } : p))
    );
    if (ageId === '0-3m' || ageId === '4-12m') {
      setActiveDockTab('sensory');
    }
    speakTeacherVoice(
      [{ lang: 'vi', text: `Chế độ ${cfg.label}: ${cfg.stageTitle} cho ${activeProfile.name}!` }],
      {
        ...effectiveSettings,
        selectedAge: ageId,
      }
    );
  };

  const handleSelectProfile = (profileId: string) => {
    stopAllAudio();
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;
    setActiveProfileId(profileId);
    setActiveTopic(null);
    setSettings((prev) => ({
      ...prev,
      selectedAge: target.ageId,
    }));
    playCelebrationChime(settings.volume);
    speakTeacherVoice(
      [
        {
          lang: 'vi',
          text: `Cô chào ${target.name}! Hôm nay cô trò mình cùng chơi và học tiếng Anh nhé!`,
        },
      ],
      {
        ...settings,
        selectedAge: target.ageId,
      }
    );
  };

  const handleCreateProfile = (
    name: string,
    avatarEmoji: string,
    avatarBg: string,
    ageId: AgeGroupId
  ) => {
    const newProfile: ChildProfile = {
      id: `profile-${Date.now()}`,
      name,
      avatarEmoji,
      avatarBg,
      ageId,
      progress: {
        stars: 3,
        unlockedStickers: ['sticker-farm'],
        completedTopics: [],
        wordsLearned: {},
        todayMinutesPlayed: 0,
        lastPlayDate: getTodayDateString(),
        sessionRotationSeed: 1,
      },
    };
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    setSettings((prev) => ({ ...prev, selectedAge: ageId }));
    playCelebrationChime(settings.volume);
    speakTeacherVoice(
      [
        {
          lang: 'vi',
          text: `Chào mừng ${name} đến với sân chơi Vui Học - Đọc Truyện!`,
        },
      ],
      { ...settings, selectedAge: ageId }
    );
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfiles((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((p) => p.id !== profileId);
      if (activeProfileId === profileId) {
        setActiveProfileId(next[0].id);
      }
      return next;
    });
  };

  const handleWordPracticed = (item: VocabularyItem, topicId: string) => {
    updateActiveProgress((prev) => {
      const existing = prev.wordsLearned[item.id];
      const updatedRecord: WordMasteryRecord = {
        wordId: item.id,
        topicId,
        en: item.en,
        vi: item.vi,
        emoji: item.emoji,
        timesPracticed: (existing?.timesPracticed || 0) + 1,
        lastPracticedAt: Date.now(),
      };
      return {
        ...prev,
        wordsLearned: {
          ...prev.wordsLearned,
          [item.id]: updatedRecord,
        },
      };
    });
  };

  const handleTopicCompleted = (topic: TopicLesson, starsEarned: number) => {
    fireFireworksCelebration();
    updateActiveProgress((prev) => {
      const nextStickers = prev.unlockedStickers.includes(topic.rewardSticker.id)
        ? prev.unlockedStickers
        : [...prev.unlockedStickers, topic.rewardSticker.id];
      const nextCompleted = prev.completedTopics.includes(topic.id)
        ? prev.completedTopics
        : [...prev.completedTopics, topic.id];

      return {
        ...prev,
        stars: prev.stars + starsEarned,
        unlockedStickers: nextStickers,
        completedTopics: nextCompleted,
        sessionRotationSeed: prev.sessionRotationSeed + 1,
      };
    });
  };

  const handleOpenTopic = (topic: TopicLesson) => {
    setActiveBrainGame(null);
    setActiveTopic(topic);
    updateActiveProgress((prev) => {
      const nextRecent: RecentActivityItem = {
        id: topic.id,
        kind: 'topic',
        titleVi: topic.titleVi,
        titleEn: topic.titleEn,
        subtitleEn: topic.storyIntroVi,
        emoji: topic.worldTheme.iconEmoji,
      };
      const filteredRecent = (prev.recentActivities || []).filter((r) => r.id !== topic.id);
      return {
        ...prev,
        sessionRotationSeed: prev.sessionRotationSeed + 1,
        recentActivities: [nextRecent, ...filteredRecent].slice(0, 6),
      };
    });
    speakTeacherVoice(
      [
        {
          lang: 'vi',
          text: `${topic.narrator.greetingVi} Mời ${activeProfile.name} khám phá chủ đề ${topic.titleVi}!`,
        },
        { lang: 'en', text: `${topic.titleEn}!` },
      ],
      effectiveSettings
    );
  };

  const handleOpenBrainGame = (game: BrainGameItem) => {
    setActiveTopic(null);
    setActiveBrainGame(game);
    playSoundEffect('pop', settings.volume);
    updateActiveProgress((prev) => {
      const nextRecent: RecentActivityItem = {
        id: game.id,
        kind: 'game',
        titleVi: game.titleVi,
        titleEn: game.titleEn,
        subtitleEn: game.descriptionEn,
        emoji: game.emoji,
      };
      const filteredRecent = (prev.recentActivities || []).filter((r) => r.id !== game.id);
      return {
        ...prev,
        recentActivities: [nextRecent, ...filteredRecent].slice(0, 6),
      };
    });
  };

  const handleBrainGameLevelComplete = (game: BrainGameItem, starsEarned: number) => {
    updateActiveProgress((prev) => {
      const prevLevels = prev.gameLevels || {};
      const currentLv = prevLevels[game.id] ?? (game.defaultLevel || 1);
      return {
        ...prev,
        stars: prev.stars + starsEarned,
        gameLevels: {
          ...prevLevels,
          [game.id]: currentLv + 1,
        },
      };
    });
  };

  const defaultRecentActivities: RecentActivityItem[] = useMemo(
    () => [
      {
        id: 'shadow-match',
        kind: 'game',
        titleVi: 'Ghép Bóng Con Vật',
        titleEn: 'Shadow Match',
        subtitleEn: 'Connect each animal with its silhouette shadow...',
        emoji: '👤',
      },
      {
        id: 'shape-matching',
        kind: 'game',
        titleVi: 'Ghép Hình Khối',
        titleEn: 'Shape Matching',
        subtitleEn: 'Match circles, squares, triangles and stars!',
        emoji: '🔺',
      },
      {
        id: 'bubble-pop',
        kind: 'game',
        titleVi: 'Bé Bấm Nổ Bong Bóng',
        titleEn: 'Bubble Pop Fun',
        subtitleEn: 'Pop colorful floating soap bubbles!',
        emoji: '🫧',
      },
      {
        id: 'find-same',
        kind: 'game',
        titleVi: 'Tìm Hình Giống Nhau',
        titleEn: 'Find the Same',
        subtitleEn: 'Spot the identical twin picture!',
        emoji: '👀',
      },
      {
        id: 'rainbow-xylophone',
        kind: 'game',
        titleVi: 'Đàn Cầu Vồng Vui Nhộn',
        titleEn: 'Rainbow Xylophone',
        subtitleEn: 'Play musical notes on a rainbow xylophone!',
        emoji: '🎹',
      },
    ],
    []
  );

  const recentList = useMemo(() => {
    if (progress.recentActivities && progress.recentActivities.length > 0) {
      const merged = [...progress.recentActivities];
      for (const def of defaultRecentActivities) {
        if (!merged.some((m) => m.id === def.id)) {
          merged.push(def);
        }
      }
      return merged.slice(0, 5);
    }
    return defaultRecentActivities;
  }, [progress.recentActivities, defaultRecentActivities]);

  const continueHeroItem = recentList[0];

  const handleLaunchRecentItem = (item: RecentActivityItem) => {
    if (item.kind === 'game') {
      const foundGame = ALL_BRAIN_GAMES.find((g) => g.id === item.id);
      if (foundGame) {
        handleOpenBrainGame(foundGame);
        return;
      }
    }
    const foundTopic = allTopics.find((t) => t.id === item.id);
    if (foundTopic) {
      handleOpenTopic(foundTopic);
    }
  };

  const handleReviewWordTap = (record: WordMasteryRecord) => {
    playCelebrationChime(settings.volume);
    speakTeacherVoice(
      [
        { lang: 'vi', text: `Ôn lại từ cũ nhé! Đây là ${record.vi.toLowerCase()}.` },
        { lang: 'en', text: `${record.en}! ${record.en}!` },
        { lang: 'vi', text: `${activeProfile.name} nhớ giỏi lắm!` },
      ],
      effectiveSettings
    );
    updateActiveProgress((prev) => ({
      ...prev,
      wordsLearned: {
        ...prev.wordsLearned,
        [record.wordId]: {
          ...record,
          timesPracticed: record.timesPracticed + 1,
          lastPracticedAt: Date.now(),
        },
      },
    }));
  };

  return (
    <div
      onClick={handleFirstInteractionFullscreen}
      className="fixed inset-0 w-screen h-dvh overflow-hidden flex flex-col bg-[#F5F9FC] text-slate-800 select-none"
    >
      {/* Commercial Full-Bleed App Top Bar */}
      <header className="shrink-0 bg-white/95 border-b border-slate-200/80 px-2.5 sm:px-5 py-1.5 sm:py-2 z-30 shadow-2xs">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Zone 1: Brand + Multi-User Active Child Profile Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => {
                stopAllAudio();
                setActiveTopic(null);
                setActiveBrainGame(null);
                setIsParentDashboardOpen(false);
                setActiveDockTab('arcade');
              }}
              className="flex items-center gap-1.5 sm:gap-2 text-left cursor-pointer shrink-0 group"
            >
              <AppBrandLogo className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-xs group-hover:scale-105 transition" />
              <span className="inline text-base sm:text-lg font-extrabold tracking-tight text-[#1565D8] whitespace-nowrap font-display">
                Vui Học - Đọc Truyện
              </span>
            </button>

            {/* Multi-User Profile Pill (Switch / Add Child) */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="min-h-[34px] sm:min-h-[40px] pl-1.5 pr-2 sm:pr-3 py-1 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center gap-1.5 transition cursor-pointer shrink-0"
              aria-label="Chuyển đổi hoặc thêm hồ sơ bé"
            >
              <span
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center text-xs sm:text-base shadow-2xs border border-white shrink-0"
                style={{ backgroundColor: activeProfile.avatarBg }}
              >
                {activeProfile.avatarEmoji}
              </span>
              <div className="text-left leading-none">
                <div className="text-[11px] sm:text-xs font-extrabold text-slate-900 flex items-center gap-1">
                  <span className="truncate max-w-[58px] sm:max-w-[110px]">{activeProfile.name}</span>
                  <span className="text-amber-600 font-black tabular-nums">★{progress.stars}</span>
                </div>
                <div className="hidden sm:flex text-[10px] font-bold text-sky-700 items-center gap-0.5 mt-0.5">
                  <Users className="w-2.5 h-2.5" />
                  <span>Đổi bé ({profiles.length})</span>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: Quick Age Selector Strip (Desktop/Wide Tablet) */}
          <div className="hidden xl:flex items-center gap-1 bg-sky-50/90 p-1 rounded-2xl border border-sky-200">
            {AGE_GROUPS.map((g) => {
              const active = currentAgeId === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectAge(g.id)}
                  className={`min-h-[34px] px-2.5 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#1E88E5] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>

          {/* Zone 3: Auto-Off Timer + Fullscreen Toggle + Install + Parent Gate */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 relative">
            {/* Quick Auto-Off Timer Toggle & Adjuster Trigger */}
            <button
              type="button"
              onClick={() => setShowQuickTimerPopover((v) => !v)}
              className={`min-h-[34px] sm:min-h-[40px] px-2 sm:px-2.5 py-1 rounded-xl font-bold text-[11px] sm:text-xs flex items-center gap-1 border transition cursor-pointer whitespace-nowrap ${
                settings.autoOffEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
              aria-label="Bật tắt chế độ tự tắt và chỉnh thời gian"
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Tự tắt:</span>
              <span className="tabular-nums font-extrabold">
                {settings.autoOffEnabled ? `${settings.dailyLimitMinutes}p` : 'Tắt'}
              </span>
            </button>

            {/* Fullscreen Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`hidden sm:flex min-h-[36px] sm:min-h-[40px] px-2 sm:px-2.5 py-1 rounded-xl font-bold text-xs items-center gap-1 border transition cursor-pointer whitespace-nowrap ${
                isFullscreen
                  ? 'bg-sky-100 border-sky-300 text-sky-900'
                  : 'bg-white border-sky-200 text-slate-700 hover:bg-sky-50'
              }`}
              aria-label={isFullscreen ? 'Thoát toàn màn hình' : 'Bật toàn màn hình'}
              title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              )}
              <span className="hidden md:inline">
                {isFullscreen ? 'Thu nhỏ' : 'Full màn hình'}
              </span>
            </button>

            <PWAInstallButton />

            <button
              type="button"
              onClick={() => {
                if (isParentDashboardOpen) {
                  setIsParentDashboardOpen(false);
                } else {
                  setIsParentGateOpen(true);
                }
              }}
              className="min-h-[34px] sm:min-h-[40px] px-2 sm:px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1 transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span className="hidden sm:inline">{isParentDashboardOpen ? 'Đóng' : 'Phụ huynh'}</span>
              <span className="sm:hidden">{isParentDashboardOpen ? 'Đóng' : 'Bố mẹ'}</span>
            </button>

            {/* Quick Timer & Voice Accent Popover */}
            {showQuickTimerPopover && (
              <div
                className="absolute right-0 top-12 z-50 w-80 rounded-3xl bg-white p-4 shadow-2xl border-2 border-sky-200 space-y-3"
                role="dialog"
                aria-label="Điều chỉnh nhanh chế độ tự tắt và giọng đọc"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    Cài đặt nhanh cho Bố Mẹ
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQuickTimerPopover(false)}
                    className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
                    aria-label="Đóng bảng hẹn giờ"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* English Accent Switcher */}
                <div className="space-y-1.5 p-2.5 rounded-2xl bg-sky-50/80 border border-sky-200">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>Phát âm Tiếng Anh:</span>
                    <span className="text-sky-700 font-extrabold">
                      {settings.englishAccent === 'en-GB' ? '🇬🇧 Anh - Anh' : '🇺🇸 Anh - Mỹ'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          englishAccent: 'en-US',
                        }))
                      }
                      className={`min-h-[34px] px-2 rounded-xl text-xs font-extrabold border transition cursor-pointer flex items-center justify-center gap-1 ${
                        (settings.englishAccent || 'en-US') === 'en-US'
                          ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-100'
                      }`}
                    >
                      <span>🇺🇸</span> Anh - Mỹ
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          englishAccent: 'en-GB',
                        }))
                      }
                      className={`min-h-[34px] px-2 rounded-xl text-xs font-extrabold border transition cursor-pointer flex items-center justify-center gap-1 ${
                        settings.englishAccent === 'en-GB'
                          ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-100'
                      }`}
                    >
                      <span>🇬🇧</span> Anh - Anh
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Phần tiếng Việt: Giọng cô giáo miền Bắc ấm áp, chậm rãi.
                  </p>
                </div>

                {/* Auto-Off Switch */}
                <button
                  type="button"
                  onClick={() => {
                    if (settings.autoOffEnabled && settings.parentPin) {
                      setShowQuickTimerPopover(false);
                      setIsParentGateOpen(true);
                      return;
                    }
                    setSettings((prev) => ({
                      ...prev,
                      autoOffEnabled: !prev.autoOffEnabled,
                    }));
                  }}
                  className={`w-full min-h-[40px] px-3 py-1.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    settings.autoOffEnabled
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span>
                    {settings.autoOffEnabled
                      ? `TỰ TẮT: ĐANG BẬT (${settings.dailyLimitMinutes}p)`
                      : 'TỰ TẮT: ĐANG TẮT (Chạm để bật)'}
                  </span>
                </button>

                {settings.autoOffEnabled && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-600">
                      Chọn phút nhắc nghỉ mắt:
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[1, 3, 5, 10, 15, 20].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            if (settings.parentPin && m > settings.dailyLimitMinutes) {
                              setShowQuickTimerPopover(false);
                              setIsParentGateOpen(true);
                              return;
                            }
                            setCustomMinutesInput(String(m));
                            setSettings((prev) => ({
                              ...prev,
                              dailyLimitMinutes: m,
                              autoOffEnabled: true,
                            }));
                          }}
                          className={`min-h-[34px] rounded-xl text-xs font-bold border tabular-nums cursor-pointer ${
                            settings.dailyLimitMinutes === m
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                          }`}
                        >
                          {m} phút
                        </button>
                      ))}
                    </div>

                    {/* Custom minutes input field */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const parsed = parseInt(customMinutesInput, 10);
                        if (Number.isNaN(parsed) || parsed < 1) return;
                        const clamped = Math.min(300, Math.max(1, parsed));
                        if (settings.parentPin && clamped > settings.dailyLimitMinutes) {
                          setShowQuickTimerPopover(false);
                          setIsParentGateOpen(true);
                          return;
                        }
                        setCustomMinutesInput(String(clamped));
                        setSettings((prev) => ({
                          ...prev,
                          dailyLimitMinutes: clamped,
                          autoOffEnabled: true,
                        }));
                      }}
                      className="pt-1 flex items-center gap-1.5"
                    >
                      <input
                        type="number"
                        min={1}
                        max={300}
                        value={customMinutesInput}
                        onChange={(e) => setCustomMinutesInput(e.target.value)}
                        placeholder="Nhập số phút..."
                        aria-label="Nhập số phút nhắc nghỉ mắt tùy chỉnh"
                        className="flex-1 min-h-[36px] px-2.5 rounded-xl border border-slate-300 bg-white text-xs font-extrabold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-xs font-bold text-slate-600 shrink-0">phút</span>
                      <button
                        type="submit"
                        className="min-h-[36px] px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold cursor-pointer shrink-0 shadow-2xs"
                      >
                        Lưu
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Developer Attribution Strip directly below main title, child profile, Cài App & Bố mẹ */}
        <div className="w-full max-w-7xl mx-auto pt-1 mt-1 border-t border-slate-100/90 flex items-center justify-between gap-2 text-[11px] sm:text-xs font-bold text-slate-600">
          <span className="truncate">
            ✨ Được phát triển bởi <strong className="text-[#1565D8]">GemPro - Hải An Group</strong>
          </span>
          <span className="hidden sm:inline text-[11px] font-semibold text-slate-400">
            An toàn cho bé · Hỗ trợ Online & Offline
          </span>
        </div>
      </header>

      {/* Main Full-Bleed App Canvas (Vertical scroll only, strictly zero horizontal scroll) */}
      <main
        ref={mainScrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2.5 sm:px-5 py-2 sm:py-3"
      >
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-between">
          {isParentDashboardOpen ? (
            <ParentDashboard
              settings={effectiveSettings}
              progress={progress}
              topics={allTopics}
              onUpdateSettings={(next) => {
                setSettings(next);
                if (next.selectedAge !== currentAgeId) {
                  setProfiles((prev) =>
                    prev.map((p) =>
                      p.id === activeProfile.id ? { ...p, ageId: next.selectedAge } : p
                    )
                  );
                }
              }}
              onResetProgress={() => {
                updateActiveProgress(() => ({
                  stars: 0,
                  unlockedStickers: [],
                  completedTopics: [],
                  wordsLearned: {},
                  todayMinutesPlayed: 0,
                  lastPlayDate: getTodayDateString(),
                  sessionRotationSeed: 1,
                  gameLevels: {},
                  recentActivities: [],
                }));
              }}
              onClose={() => setIsParentDashboardOpen(false)}
            />
          ) : activeBrainGame ? (
            <BrainGamePlayground
              game={activeBrainGame}
              currentLevel={progress.gameLevels?.[activeBrainGame.id] || activeBrainGame.defaultLevel || 1}
              settings={effectiveSettings}
              topics={allTopics}
              allGames={ALL_BRAIN_GAMES}
              onBack={() => setActiveBrainGame(null)}
              onLevelComplete={handleBrainGameLevelComplete}
              onSelectNextGame={(nextGame) => handleOpenBrainGame(nextGame)}
            />
          ) : activeTopic ? (
            <LessonPlayground
              topic={activeTopic}
              ageId={currentAgeId}
              settings={effectiveSettings}
              rotationSeed={progress.sessionRotationSeed}
              onBack={() => setActiveTopic(null)}
              onWordPracticed={handleWordPracticed}
              onTopicCompleted={handleTopicCompleted}
            />
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4 pb-4">
              {/* Mobile/Tablet Age Selector Strip (Visible when < xl, wraps vertically without horizontal scroll) */}
              <div className="xl:hidden shrink-0 flex flex-wrap items-center gap-1 sm:gap-1.5 bg-white/95 px-2 py-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                {AGE_GROUPS.map((g) => {
                  const active = currentAgeId === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleSelectAge(g.id)}
                      className={`min-h-[28px] sm:min-h-[30px] px-2 sm:px-2.5 py-0.5 rounded-xl text-[11px] font-extrabold transition cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#1E88E5] text-white shadow-xs'
                          : 'bg-sky-50 text-slate-700'
                      }`}
                    >
                      <span>{g.label}</span>
                      <span className="hidden sm:inline"> · {g.stageTitle}</span>
                    </button>
                  );
                })}
              </div>

              {/* DOCK TAB 0: Little-Brain Style Interactive Game Arcade (31 Brain Games + Continue Hero + Recent Strip) */}
              {activeDockTab === 'arcade' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* 1. Orange "▶ CHƠI TIẾP" (Continue Playing) Hero Card */}
                  <div className="rounded-[28px] bg-gradient-to-r from-[#FF9800] via-[#FFA726] to-[#FFB300] p-3.5 sm:p-5 text-white shadow-md border-2 border-[#FB8C00] flex items-center justify-between gap-3 sm:gap-5">
                    <button
                      type="button"
                      onClick={() => handleLaunchRecentItem(continueHeroItem)}
                      className="flex items-center gap-3 sm:gap-4 text-left flex-1 min-w-0 cursor-pointer group"
                    >
                      <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-[22px] bg-[#FFFDF5] border-2 border-white/80 flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-sm group-hover:scale-105 transition">
                        {continueHeroItem.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-950 bg-white/90 px-2.5 py-0.5 rounded-full mb-1">
                          <span>▶ CHƠI TIẾP</span>
                        </div>
                        <h1 className="text-base sm:text-2xl font-black text-white leading-tight truncate drop-shadow-2xs">
                          {continueHeroItem.titleVi}
                        </h1>
                        <p className="text-xs sm:text-sm font-bold text-amber-50 truncate">
                          {continueHeroItem.subtitleEn}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLaunchRecentItem(continueHeroItem)}
                      aria-label={`Chơi tiếp ${continueHeroItem.titleVi}`}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-[#F57C00] hover:scale-105 active:scale-95 transition flex items-center justify-center shadow-md shrink-0 cursor-pointer"
                    >
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5" />
                    </button>
                  </div>

                  {/* 2. "Gần đây:" (Recent Activity) Strip — Flex-wrap, zero horizontal scroll */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 px-1">
                    <span className="text-xs font-extrabold text-slate-500 mr-1">
                      Gần đây:
                    </span>
                    {recentList.map((item) => (
                      <button
                        key={`${item.kind}-${item.id}`}
                        type="button"
                        onClick={() => handleLaunchRecentItem(item)}
                        className="min-h-[34px] px-3 py-1 rounded-full bg-white hover:bg-amber-50 border border-slate-200/90 shadow-2xs flex items-center gap-1.5 text-xs font-extrabold text-slate-700 transition active:scale-95 cursor-pointer"
                      >
                        <span className="text-sm">{item.emoji}</span>
                        <span>{item.titleVi}</span>
                      </button>
                    ))}
                  </div>

                  {/* 3. Category Filter Pills (Tất cả + 6 Brain Categories + Jump to 32 Topics) */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setArcadeFilter('all')}
                      className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        arcadeFilter === 'all'
                          ? 'bg-[#1E88E5] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-sky-50'
                      }`}
                    >
                      ✨ Tất cả ({ALL_BRAIN_GAMES.length} Trò chơi)
                    </button>
                    {BRAIN_GAME_SECTIONS.map((sec) => {
                      const active = arcadeFilter === sec.id;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setArcadeFilter(sec.id)}
                          className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1 ${
                            active
                              ? 'bg-[#1E88E5] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-sky-50'
                          }`}
                        >
                          <span>{sec.iconEmoji}</span>
                          <span>{sec.titleVi}</span>
                          <span className="opacity-75">({sec.games.length})</span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setActiveDockTab('worlds')}
                      className="min-h-[34px] px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer ml-auto flex items-center gap-1"
                    >
                      <Compass className="w-3.5 h-3.5 text-amber-600" />
                      <span>📚 {allTopics.length} Chủ đề Từ vựng</span>
                    </button>
                  </div>

                  {/* 4. Categorized Sections matching little-brain.ai.studio layout */}
                  {BRAIN_GAME_SECTIONS.filter(
                    (sec) => arcadeFilter === 'all' || sec.id === arcadeFilter
                  ).map((section) => (
                    <section key={section.id} className="space-y-2.5 sm:space-y-3">
                      {/* Section Header */}
                      <div className="flex items-center justify-between gap-2 px-1">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-2xs border border-white"
                            style={{ backgroundColor: section.iconBg }}
                          >
                            {section.iconEmoji}
                          </div>
                          <div>
                            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                              {section.titleVi}
                            </h2>
                            <p className="text-xs font-semibold text-slate-500">
                              {section.subtitleVi}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 tabular-nums shrink-0">
                          {section.games.length} trò chơi
                        </span>
                      </div>

                      {/* Responsive Card Grid (2 cols mobile, 3 cols tablet, 4 cols desktop) */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                        {section.games.map((game) => {
                          const userLevel = progress.gameLevels?.[game.id];
                          const displayLevel = userLevel ?? game.defaultLevel;
                          const showNewBadge = !userLevel && !game.defaultLevel;

                          return (
                            <button
                              key={game.id}
                              type="button"
                              onClick={() => handleOpenBrainGame(game)}
                              className="group rounded-[26px] bg-white hover:bg-[#FFFDF9] p-3 sm:p-4 border-2 border-slate-200/80 hover:border-amber-300 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0.5 flex flex-col items-center justify-between text-center cursor-pointer"
                            >
                              {/* Card Top Row: Badge (Lv.X or Mới) + Age Range */}
                              <div className="w-full flex items-center justify-between gap-1 mb-2">
                                {showNewBadge ? (
                                  <span className="px-2 py-0.5 rounded-full bg-[#E0F2F1] text-[#00796B] font-extrabold text-[10px] sm:text-[11px] flex items-center gap-0.5">
                                    ✨ Mới
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#E65100] font-extrabold text-[10px] sm:text-[11px] flex items-center gap-0.5 tabular-nums">
                                    ⭐ Lv.{displayLevel || 1}
                                  </span>
                                )}
                                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 tabular-nums">
                                  {game.ageLabel}
                                </span>
                              </div>

                              {/* Center Cream Squircle Illustration */}
                              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-[24px] bg-[#FFFDF5] border border-[#F3EFE0] flex items-center justify-center text-4xl sm:text-5xl my-1 sm:my-2 shadow-2xs group-hover:scale-105 transition">
                                {game.emoji}
                              </div>

                              {/* Bottom Titles */}
                              <div className="w-full mt-1.5 space-y-0.5">
                                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug line-clamp-1">
                                  {game.titleVi}
                                </h3>
                                <p className="text-[10px] sm:text-xs font-semibold text-slate-400 line-clamp-1">
                                  {game.titleEn}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}

                  {/* 5. Quick Preview of 32 Bilingual Vocabulary Worlds right inside Arcade */}
                  <section className="space-y-2.5 sm:space-y-3 pt-2">
                    <div className="flex items-center justify-between gap-2 px-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-sky-100 flex items-center justify-center text-xl sm:text-2xl shadow-2xs border border-white">
                          📚
                        </div>
                        <div>
                          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                            32 Chủ Đề Từ Vựng & Mẫu Câu
                          </h2>
                          <p className="text-xs font-semibold text-slate-500">
                            512+ từ vựng song ngữ kèm kể chuyện & trò chơi tương tác
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveDockTab('worlds')}
                        className="min-h-[34px] px-3 py-1 rounded-xl bg-[#1E88E5] hover:bg-[#1565C0] text-white text-xs font-extrabold cursor-pointer shrink-0"
                      >
                        Xem tất cả 32 chủ đề →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
                      {allTopics.slice(0, 8).map((topic) => {
                        const isDone = progress.completedTopics.includes(topic.id);
                        const practicedCount = topic.vocabulary.filter((w) =>
                          Boolean(progress.wordsLearned[w.id])
                        ).length;

                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => handleOpenTopic(topic)}
                            className="group rounded-[26px] bg-white hover:bg-[#FFFDF9] p-3 sm:p-4 border-2 border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col items-center justify-between text-center cursor-pointer"
                          >
                            <div className="w-full flex items-center justify-between gap-1 mb-1.5">
                              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-extrabold text-[10px] sm:text-[11px] tabular-nums">
                                {isDone ? '⭐ Đã xong' : `📖 ${practicedCount}/${topic.vocabulary.length} từ`}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">
                                Chủ đề #{topic.order}
                              </span>
                            </div>

                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] bg-[#FFFDF5] border border-[#F3EFE0] flex items-center justify-center text-3xl sm:text-4xl my-1 shadow-2xs group-hover:scale-105 transition">
                              {topic.worldTheme.iconEmoji}
                            </div>

                            <div className="w-full mt-1.5 space-y-0.5">
                              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1">
                                {topic.titleVi}
                              </h3>
                              <p className="text-[10px] sm:text-xs font-semibold text-slate-400 line-clamp-1">
                                {topic.titleEn}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* 6. Kid's Sticker Collection Section at the bottom of the Arcade tab */}
                  <section className="rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-yellow-50/80 p-3.5 sm:p-5 border-2 border-amber-200/90 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shadow-xs">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>Bộ Sưu Tập Sticker Của Bé</span>
                            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                              ★ {progress.stars} Sao
                            </span>
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-600">
                            Đã mở khóa <strong className="text-amber-800">{progress.unlockedStickers.length}</strong> / {allTopics.length} huy hiệu sticker từ các bài học
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsStickerAlbumOpen(true)}
                        className="min-h-[38px] px-3.5 sm:px-4 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Mở Album Toàn Bộ</span>
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-amber-200/70 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.round((progress.unlockedStickers.length / Math.max(1, allTopics.length)) * 100))}%`,
                        }}
                      />
                    </div>

                    {/* Quick sticker preview ribbon */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                      {allTopics.slice(0, 8).map((t) => {
                        const isUnlocked = progress.unlockedStickers.includes(t.rewardSticker.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              if (isUnlocked) {
                                setIsStickerAlbumOpen(true);
                              } else {
                                handleOpenTopic(t);
                              }
                            }}
                            className={`p-2 rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer border ${
                              isUnlocked
                                ? 'bg-white border-amber-300 shadow-2xs hover:scale-105'
                                : 'bg-slate-100/70 border-slate-200/60 opacity-60 hover:opacity-90'
                            }`}
                            title={isUnlocked ? `Đã mở: ${t.rewardSticker.nameVi}` : `Khám phá để mở: ${t.titleVi}`}
                          >
                            <span className="text-2xl sm:text-3xl select-none mb-1">
                              {isUnlocked ? t.rewardSticker.emoji : '🔒'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-700 truncate max-w-full">
                              {isUnlocked ? t.rewardSticker.nameVi : t.titleVi}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* 7. Little-Brain Style Clean Kid-Safe & Offline Ready Footer */}
                  <footer className="pt-3 pb-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
                    <div className="font-bold text-slate-500 flex flex-wrap items-center gap-2">
                      <span>No Ads · 100% Kid Safe</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-extrabold">
                        Dùng ngay không cần đăng nhập · Hỗ trợ Online & Offline
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsParentGateOpen(true)}
                      className="min-h-[34px] px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 font-extrabold text-slate-700 shadow-2xs cursor-pointer"
                    >
                      Cài Đặt Phụ Huynh
                    </button>
                  </footer>
                </div>
              )}

              {/* DOCK TAB: 53 Curated Fairy Tales, Folk Nursery Rhymes & Aesop Fables */}
              {activeDockTab === 'stories' && (
                <section className="flex-1 min-h-0 flex flex-col gap-3 sm:gap-4 pb-4">
                  {/* 1. Header Hero Card with Background Narration & Offline Info */}
                  <div className="rounded-[28px] bg-gradient-to-r from-purple-700 via-indigo-700 to-sky-700 p-4 sm:p-6 text-white shadow-md border-2 border-purple-400/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-2xl sm:text-3xl select-none">📚</span>
                        <h2 className="text-lg sm:text-2xl font-black tracking-tight font-display">
                          Kho Truyện Cổ Tích & Đồng Dao Cho Bé
                        </h2>
                        <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                          {STORY_BOOKS_DATA.length} Truyện
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-purple-100 font-medium">
                        Kho tàng 53 câu chuyện kinh điển chọn lọc cho bé 0-5 tuổi, giọng đọc truyền cảm, bài học đạo đức bổ ích.
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[11px] font-bold">
                        <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl flex items-center gap-1 text-purple-50">
                          🌙 Nghe khi tắt màn hình (khóa máy vẫn đọc)
                        </span>
                        <span className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl flex items-center gap-1 text-purple-50">
                          📶 Ổn định cả Online & Offline
                        </span>
                        <span className="bg-amber-300 text-slate-900 px-2.5 py-1 rounded-xl flex items-center gap-1 font-black shadow-2xs">
                          {settings.storyLanguage === 'vi'
                            ? '🇻🇳 Đang đọc: Tiếng Việt'
                            : settings.storyLanguage === 'en'
                            ? '🇬🇧 Đang đọc: Tiếng Anh'
                            : '🌐 Đang đọc: Song ngữ'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Story Language Switcher */}
                    <div className="shrink-0 bg-white/15 backdrop-blur-sm p-1.5 rounded-2xl border border-white/25 flex flex-col gap-1 w-full lg:w-auto">
                      <span className="text-[10px] font-extrabold text-purple-100 uppercase tracking-wider px-1">
                        Ngôn ngữ đọc truyện:
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'vi' as const, label: '🇻🇳 Tiếng Việt' },
                          { id: 'en' as const, label: '🇬🇧 Tiếng Anh' },
                          { id: 'bilingual' as const, label: '🌐 Song Ngữ' },
                        ].map((item) => {
                          const active = (settings.storyLanguage || 'bilingual') === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSettings((prev) => ({ ...prev, storyLanguage: item.id }));
                                playCelebrationChime(settings.volume);
                              }}
                              className={`min-h-[34px] px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap text-center ${
                                active
                                  ? 'bg-white text-purple-900 shadow-xs'
                                  : 'text-white/90 hover:bg-white/10'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 2. Filter Pills & Search */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white/95 px-3 sm:px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      {[
                        { id: 'all', label: `Tất cả (${STORY_BOOKS_DATA.length})` },
                        { id: 'star', label: `⭐ Mới thêm (${STORY_BOOKS_DATA.filter((s) => s.isNewStar).length})` },
                        { id: '0-2y', label: '0–2 tuổi: Đồng dao & Nhận biết' },
                        { id: '2-4y', label: '2–4 tuổi: Loài vật & Cổ tích ngắn' },
                        { id: 'vn', label: '4–5 tuổi: Cổ tích Việt Nam' },
                        { id: 'world', label: '4–5 tuổi: Cổ tích Thế giới' },
                        { id: 'aesop', label: 'Ngụ ngôn Aesop' },
                      ].map((tab) => {
                        const active = storyCategoryFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setStoryCategoryFilter(tab.id)}
                            className={`min-h-[32px] sm:min-h-[34px] px-3 py-1 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                              active
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-purple-50'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Search stories */}
                    <div className="w-full sm:w-72">
                      <input
                        type="text"
                        value={storySearchQuery}
                        onChange={(e) => setStorySearchQuery(e.target.value)}
                        placeholder="Tìm truyện (Tấm Cám, Ba chú heo, Con cò...)"
                        aria-label="Tìm kiếm truyện cho bé"
                        className="w-full min-h-[38px] px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* 3. Grid of Story Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {filteredStories.map((story) => (
                      <div
                        key={story.id}
                        className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                      >
                        <div className="p-4 sm:p-5 space-y-3">
                          {/* Top row: Emoji & Badges */}
                          <div className="flex items-start justify-between gap-2">
                            <div
                              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-2xs shrink-0 group-hover:scale-105 transition"
                              style={{ backgroundColor: `${story.coverColor}18` }}
                            >
                              {story.emoji}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {story.isNewStar && (
                                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
                                  ⭐ Mới thêm
                                </span>
                              )}
                              <span className="bg-purple-50 text-purple-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                {story.ageCategory === '0-2y'
                                  ? '0–2 tuổi'
                                  : story.ageCategory === '2-4y'
                                  ? '2–4 tuổi'
                                  : '4–5 tuổi'}
                              </span>
                              <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {story.moralBadgeVi}
                              </span>
                            </div>
                          </div>

                          {/* Title & Index */}
                          <div>
                            <div className="text-[11px] font-bold text-slate-400">
                              Truyện số #{story.indexNumber}
                            </div>
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 line-clamp-1 group-hover:text-purple-600 transition">
                              {story.titleVi}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 line-clamp-1">
                              {story.titleEn}
                            </p>
                          </div>

                          {/* Summary */}
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {story.summaryVi}
                          </p>

                          {/* Moral Lesson snippet */}
                          <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-100 text-[11px] text-amber-900 flex items-start gap-1.5">
                            <span className="shrink-0 text-amber-600">💡</span>
                            <span className="line-clamp-2">{story.moralLessonVi}</span>
                          </div>
                        </div>

                        {/* Action button */}
                        <div className="p-3 sm:p-4 pt-0">
                          <button
                            type="button"
                            onClick={() => {
                              stopAllAudio();
                              setSelectedStory(story);
                            }}
                            className="w-full min-h-[42px] px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                          >
                            <Headphones className="w-4 h-4" />
                            <span>Đọc & Nghe Truyện Ngay</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredStories.length === 0 && (
                    <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                      <p className="text-base font-bold text-slate-700">
                        Không tìm thấy truyện nào phù hợp với từ khóa "{storySearchQuery}"
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setStorySearchQuery('');
                          setStoryCategoryFilter('all');
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 font-bold text-xs cursor-pointer"
                      >
                        Xem tất cả {STORY_BOOKS_DATA.length} truyện
                      </button>
                    </div>
                  )}
                </section>
              )}

              {/* DOCK TAB 1: 32 Topic Worlds (Paginated 8 per frame so all fit in 1 screen!) */}
              {activeDockTab === 'worlds' && (
                <section className="flex-1 min-h-0 flex flex-col gap-2 sm:gap-3">
                  {/* Unified Category Filter + Page Switcher Bar (Purely flex-wrap, zero horizontal dragging) */}
                  <div className="shrink-0 flex flex-wrap items-center justify-between gap-1.5 bg-white/95 px-3 sm:px-4 py-2 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 min-w-0">
                      <Compass className="w-4 h-4 text-sky-600 shrink-0 hidden sm:inline" />
                      {CATEGORY_FILTERS.map((cat) => {
                        const active = categoryFilter === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setCategoryFilter(cat.id);
                              setWorldPage(0);
                            }}
                            className={`min-h-[30px] sm:min-h-[34px] px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                              active
                                ? 'bg-[#1E88E5] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-sky-50'
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Page Switcher so all 8 cards fit inside a single screen */}
                    <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
                      <button
                        type="button"
                        onClick={() =>
                          setWorldPage((p) => (p - 1 + totalWorldPages) % totalWorldPages)
                        }
                        className="min-h-[30px] sm:min-h-[34px] px-2 sm:px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] sm:text-xs flex items-center gap-1 cursor-pointer"
                        aria-label="Trang chủ đề trước"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Trước</span>
                      </button>

                      {Array.from({ length: totalWorldPages }).map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setWorldPage(idx)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-extrabold text-xs transition cursor-pointer tabular-nums ${
                            safeWorldPage === idx
                              ? 'bg-[#1E88E5] text-white shadow-xs'
                              : 'bg-sky-50 text-slate-700 hover:bg-sky-100'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setWorldPage((p) => (p + 1) % totalWorldPages)}
                        className="min-h-[30px] sm:min-h-[34px] px-2 sm:px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1 cursor-pointer"
                        aria-label="Trang chủ đề tiếp theo"
                      >
                        <span>Tiếp</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 4x2 (Desktop) / 2x4 (Mobile) Little-Brain Style Topic Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                    {currentPageTopics.map((topic) => {
                      const isDone = progress.completedTopics.includes(topic.id);
                      const practicedInTopic = topic.vocabulary.filter(
                        (w) => Boolean(progress.wordsLearned[w.id])
                      ).length;

                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => handleOpenTopic(topic)}
                          className="group rounded-[26px] p-3 sm:p-4 border-2 border-slate-200/90 hover:border-sky-400 text-center flex flex-col items-center justify-between transition-all hover:-translate-y-0.5 active:translate-y-0.5 shadow-xs hover:shadow-md cursor-pointer bg-white overflow-hidden"
                        >
                          <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-bold">
                            {isDone ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#E65100] font-extrabold">
                                ⭐ Đã mở Sticker
                              </span>
                            ) : practicedInTopic > 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-extrabold tabular-nums">
                                ⭐ {practicedInTopic}/{topic.vocabulary.length} từ
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-[#E0F2F1] text-[#00796B] font-extrabold">
                                ✨ Chủ đề #{topic.order}
                              </span>
                            )}
                            <span className="text-slate-400 font-bold">
                              {topic.narrator.emoji} {topic.narrator.name}
                            </span>
                          </div>

                          <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-[24px] bg-[#FFFDF5] border border-[#F3EFE0] flex items-center justify-center text-4xl sm:text-5xl my-2 shadow-2xs group-hover:scale-105 transition">
                            {topic.worldTheme.iconEmoji}
                          </div>

                          <div className="w-full space-y-0.5">
                            <h2 className="text-xs sm:text-base font-extrabold text-slate-900 leading-tight truncate">
                              {topic.titleVi}
                            </h2>
                            <div className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">
                              {topic.titleEn}
                            </div>
                          </div>

                          <div className="w-full mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-0.5 text-xs sm:text-sm">
                              {topic.vocabulary.slice(0, 5).map((w) => (
                                <span key={w.id}>{w.emoji}</span>
                              ))}
                            </div>
                            <span className="px-2 py-0.5 rounded-lg bg-[#1E88E5] text-white text-[10px] sm:text-xs font-extrabold flex items-center gap-1 shrink-0">
                              <Volume2 className="w-3 h-3" /> Học
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* DOCK TAB 2: Today's Random Lesson + Spaced Repetition + Age Stage */}
              {activeDockTab === 'today' && (
                <section className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                  <div
                    className={`lg:col-span-7 rounded-3xl bg-gradient-to-br ${dailyRandomTopic.worldTheme.bgGradient} border-3 p-4 sm:p-6 shadow-sm flex flex-col justify-between`}
                    style={{ borderColor: dailyRandomTopic.worldTheme.borderColor }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-sky-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Bài học Hôm nay cho {activeProfile.name} · {dailyRandomTopic.vocabulary.length} từ vựng
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            playSoundEffect('pop', settings.volume);
                            setRandomSeedOffset((n) => n + 1);
                          }}
                          className="min-h-[38px] px-3 py-1 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Shuffle className="w-3.5 h-3.5" />
                          <span>Đổi bài khác</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shrink-0 border-2 border-white shadow-sm animate-float-slow"
                          style={{ backgroundColor: dailyRandomTopic.narrator.avatarBg }}
                        >
                          {dailyRandomTopic.narrator.emoji}
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                            {dailyRandomTopic.titleVi} ({dailyRandomTopic.titleEn})
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-700 mt-1">
                            Cùng <strong>{dailyRandomTopic.narrator.name}</strong>: {dailyRandomTopic.storyIntroVi}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-2xl">
                        {dailyRandomTopic.vocabulary.map((v) => (
                          <span key={v.id} title={v.en}>
                            {v.emoji}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        data-start="true"
                        onClick={() => handleOpenTopic(dailyRandomTopic)}
                        className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#1E88E5] hover:bg-[#1565C0] active:scale-95 text-white font-extrabold text-sm flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Volume2 className="w-5 h-5" />
                        <span>Vào chơi cùng {dailyRandomTopic.narrator.name}!</span>
                      </button>
                    </div>
                  </div>

                  {/* Spaced Repetition Review */}
                  <div className="lg:col-span-5 rounded-3xl bg-white border-3 border-emerald-200 p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-5 h-5 text-emerald-600" />
                          <h2 className="text-base font-extrabold text-slate-900">
                            Ôn lại từ cũ của {activeProfile.name}
                          </h2>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700">
                          Chạm là nghe!
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Giọng cô miền Bắc giới thiệu + giọng bản xứ đọc từ tiếng Anh:
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 flex-1">
                      {reviewWords.map((w) => (
                        <button
                          key={w.wordId}
                          type="button"
                          onClick={() => handleReviewWordTap(w)}
                          className="p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border-2 border-emerald-200 flex flex-col items-center justify-center text-center transition active:scale-95 cursor-pointer"
                        >
                          <span className="text-3xl">{w.emoji}</span>
                          <span className="text-sm font-extrabold text-slate-900 mt-1">
                            {w.en}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600">
                            {w.vi}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* DOCK TAB 3: Sensory 0-3m & Peek-a-boo 4-12m Studio */}
              {activeDockTab === 'sensory' && (
                <section className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto">
                  <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2 rounded-2xl border border-rose-200">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                      Sân chơi Giác quan & Ú òa cho bé dưới 1 tuổi:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectAge('0-3m')}
                        className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer ${
                          currentAgeId === '0-3m'
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        0–3 tháng (Đen–Trắng–Đỏ & Hát ru)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectAge('4-12m')}
                        className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer ${
                          currentAgeId !== '0-3m'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        4–12 tháng (Ú òa & Bong bóng)
                      </button>
                    </div>
                  </div>

                  {currentAgeId === '0-3m' ? (
                    <SensoryZeroToThreeMonths
                      settings={effectiveSettings}
                      onUpdateSettings={setSettings}
                    />
                  ) : (
                    <PeekabooFourToTwelveMonths
                      topics={allTopics}
                      settings={effectiveSettings}
                      onWordPracticed={handleWordPracticed}
                      onSelectTopicLesson={handleOpenTopic}
                    />
                  )}
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Native App Bottom Navigation Dock (Hidden inside active lesson/game for full-screen focus) */}
      {!activeTopic && !activeBrainGame && !isParentDashboardOpen && (
        <nav
          aria-label="Thanh điều hướng ứng dụng"
          className="shrink-0 bg-white/95 border-t border-slate-200 px-2 sm:px-3 py-1.5 z-30 shadow-xs"
        >
          <div className="max-w-4xl mx-auto grid grid-cols-5 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveDockTab('arcade')}
              className={`min-h-[46px] sm:min-h-[50px] rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
                activeDockTab === 'arcade'
                  ? 'bg-[#FF9800] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-amber-50'
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="text-[10px] sm:text-[11px] font-extrabold mt-0.5 truncate max-w-full px-1">
                {ALL_BRAIN_GAMES.length} Trò chơi
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDockTab('stories')}
              className={`min-h-[46px] sm:min-h-[50px] rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
                activeDockTab === 'stories'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] sm:text-[11px] font-extrabold mt-0.5 truncate max-w-full px-1">
                {STORY_BOOKS_DATA.length} Truyện
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDockTab('worlds')}
              className={`min-h-[46px] sm:min-h-[50px] rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
                activeDockTab === 'worlds'
                  ? 'bg-[#1E88E5] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-sky-50'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] sm:text-[11px] font-extrabold mt-0.5 truncate max-w-full px-1">
                {allTopics.length} Chủ đề
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDockTab('today')}
              className={`min-h-[46px] sm:min-h-[50px] rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
                activeDockTab === 'today'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] sm:text-[11px] font-extrabold mt-0.5 truncate max-w-full px-1">
                Hôm nay
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDockTab('sensory')}
              className={`min-h-[46px] sm:min-h-[50px] rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
                activeDockTab === 'sensory'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-rose-50'
              }`}
            >
              <Baby className="w-5 h-5" />
              <span className="text-[10px] sm:text-[11px] font-extrabold mt-0.5 truncate max-w-full px-1">
                Giác quan
              </span>
            </button>
          </div>
        </nav>
      )}

      {/* Multi-User Profile Manager Modal */}
      <ProfileManagerModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfile.id}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      {/* Sticker Album & Parent Gate Modals */}
      <StickerAlbumModal
        isOpen={isStickerAlbumOpen}
        onClose={() => setIsStickerAlbumOpen(false)}
        topics={allTopics}
        progress={progress}
        settings={effectiveSettings}
        onSelectTopic={handleOpenTopic}
      />

      <ParentGateModal
        isOpen={isParentGateOpen}
        parentPin={settings.parentPin}
        onClose={() => setIsParentGateOpen(false)}
        onUnlocked={() => {
          setIsParentGateOpen(false);
          setIsParentDashboardOpen(true);
        }}
      />

      <ScreenTimeLockModal
        isOpen={showEyeRestModal && settings.autoOffEnabled}
        childName={activeProfile.name}
        todayMinutesPlayed={progress.todayMinutesPlayed}
        dailyLimitMinutes={settings.dailyLimitMinutes}
        parentPin={settings.parentPin}
        onExtendTime={(extraMins) => {
          setSettings((prev) => ({
            ...prev,
            dailyLimitMinutes: Math.max(prev.dailyLimitMinutes, progress.todayMinutesPlayed) + extraMins,
          }));
          setShowEyeRestModal(false);
        }}
        onDisableAutoOff={() => {
          setSettings((prev) => ({ ...prev, autoOffEnabled: false }));
          setShowEyeRestModal(false);
        }}
      />

      {/* Interactive Bedtime & Fairytale Story Reader Modal */}
      {selectedStory && (
        <StoryReaderModal
          story={selectedStory}
          settings={effectiveSettings}
          onClose={() => setSelectedStory(null)}
          onSelectAnotherStory={(nextStory) => setSelectedStory(nextStory)}
        />
      )}

      <OfflineIndicator />
    </div>
  );
}
