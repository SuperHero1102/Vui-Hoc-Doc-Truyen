import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Music,
  Eraser,
  ChevronRight,
  Play,
  Pause,
  BarChart3,
} from 'lucide-react';
import type {
  BrainGameItem,
  ParentSettings,
  TopicLesson,
  VocabularyItem,
} from '../types/learning';
import {
  ALPHABET_A_TO_Z,
  BIG_SMALL_PAIRS,
  COLORS_DATA,
  SHAPES_DATA,
  WORLD_FLAGS_DATA,
} from '../data/brainGamesData';
import {
  COLORING_BOOK_TEMPLATES,
  STUDIO_COLOR_PALETTE,
  VIETNAMESE_LETTER_TRACES,
} from '../data/creativeArtData';
import {
  playCelebrationChime,
  playGentleEncourageTone,
  playSoundEffect,
  speakTeacherVoice,
  stopAllAudio,
} from '../utils/audioEngine';
import { fireFireworksCelebration, fireStarExplosion } from '../utils/confetti';
import { CountryFlagSvg } from './CountryFlagSvg';
import { GameCardVisual } from './GameCardVisual';
import { CharacterPuzzleGame } from './CharacterPuzzleGame';
import { DressUpMakeoverGame } from './DressUpMakeoverGame';
import { MagicColoringGame } from './MagicColoringGame';
import { RainbowXylophoneGame } from './RainbowXylophoneGame';

interface BrainGamePlaygroundProps {
  game: BrainGameItem;
  currentLevel: number;
  topics: TopicLesson[];
  settings: ParentSettings;
  onBack: () => void;
  onOpenActivityHistory?: () => void;
  onLevelComplete: (game: BrainGameItem, starsEarned: number) => void;
  onSelectNextGame: (nextGame: BrainGameItem) => void;
  allGames: BrainGameItem[];
}

const NUMBER_WORDS_EN = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
];

const CONCRETE_TOPIC_IDS = [
  'farm-animals',
  'wild-animals',
  'ocean-world',
  'insects-birds',
  'fruits',
  'vegetables',
  'baby-meals',
  'clothes',
  'toys',
  'my-house',
  'vehicles',
  'music-instruments',
  'school-items',
];

function deduplicateVocabByEmojiAndEn(items: VocabularyItem[]): VocabularyItem[] {
  const seenEmoji = new Set<string>();
  const seenEn = new Set<string>();
  const result: VocabularyItem[] = [];
  for (const item of items) {
    const keyEn = item.en.trim().toLowerCase();
    if (!seenEmoji.has(item.emoji) && !seenEn.has(keyEn)) {
      seenEmoji.add(item.emoji);
      seenEn.add(keyEn);
      result.push(item);
    }
  }
  return result;
}

function pickDistinctVocabOptions(
  pool: VocabularyItem[],
  target: VocabularyItem,
  count: number,
  seed: number
): VocabularyItem[] {
  const chosen: VocabularyItem[] = [target];
  const usedEmojis = new Set<string>([target.emoji]);
  const usedEn = new Set<string>([target.en.toLowerCase()]);

  for (let step = 1; step <= pool.length && chosen.length < count; step++) {
    const candidate = pool[(seed + step * 3) % pool.length];
    if (
      candidate &&
      candidate.id !== target.id &&
      !usedEmojis.has(candidate.emoji) &&
      !usedEn.has(candidate.en.toLowerCase())
    ) {
      usedEmojis.add(candidate.emoji);
      usedEn.add(candidate.en.toLowerCase());
      chosen.push(candidate);
    }
  }

  return chosen
    .map((item, idx) => ({
      item,
      order: ((item.id.charCodeAt(0) * 13 + idx * 7 + seed) % 19),
    }))
    .sort((a, b) => a.order - b.order)
    .map((x) => x.item);
}

export const BrainGamePlayground: React.FC<BrainGamePlaygroundProps> = ({
  game,
  currentLevel,
  topics,
  settings,
  onBack,
  onOpenActivityHistory,
  onLevelComplete,
  onSelectNextGame,
  allGames,
}) => {
  const [round, setRound] = useState(1);
  const totalRounds = 3;
  const [feedbackVi, setFeedbackVi] = useState<string>(game.promptVi);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const isAdvancingRef = useRef(false);

  // Deduplicated concrete vocabulary pool so every emoji matches its exact word 100%
  const concreteVocab = useMemo(() => {
    const raw = topics
      .filter((t) => CONCRETE_TOPIC_IDS.includes(t.id))
      .flatMap((t) => t.vocabulary);
    const deduped = deduplicateVocabByEmojiAndEn(raw);
    return deduped.length >= 8 ? deduped : deduplicateVocabByEmojiAndEn(topics.flatMap((t) => t.vocabulary));
  }, [topics]);

  const animalVocab = useMemo(() => {
    const raw = topics
      .filter((t) => ['farm-animals', 'wild-animals', 'ocean-world', 'insects-birds'].includes(t.id))
      .flatMap((t) => t.vocabulary);
    const deduped = deduplicateVocabByEmojiAndEn(raw);
    return deduped.length >= 6 ? deduped : concreteVocab;
  }, [topics, concreteVocab]);

  const fruitVocab = useMemo(() => {
    const raw = topics
      .filter((t) => ['fruits', 'vegetables', 'baby-meals'].includes(t.id))
      .flatMap((t) => t.vocabulary);
    const deduped = deduplicateVocabByEmojiAndEn(raw);
    return deduped.length >= 6 ? deduped : concreteVocab;
  }, [topics, concreteVocab]);

  const vehicleVocab = useMemo(() => {
    const raw = topics
      .filter((t) => t.id === 'vehicles')
      .flatMap((t) => t.vocabulary);
    const deduped = deduplicateVocabByEmojiAndEn(raw);
    return deduped.length >= 4 ? deduped : concreteVocab;
  }, [topics, concreteVocab]);

  // State for Memory Flip Game
  const [memoryDeck, setMemoryDeck] = useState<
    { uid: string; id: string; emoji: string; en: string; vi: string; matched: boolean }[]
  >([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // State for Bubble Pop Game
  const [poppedIds, setPoppedIds] = useState<Record<string, boolean>>({});

  // State for Count & Feed Bunny Game
  const [fedCount, setFedCount] = useState(0);

  // State for Puppy Path Maze
  const [mazeStep, setMazeStep] = useState(1);

  // State for Alphabet Explorer & World Flags Explorer
  const [selectedAlphaIdx, setSelectedAlphaIdx] = useState(0);
  const [selectedFlagIdx, setSelectedFlagIdx] = useState(0);



  // State for Drawing / Coloring / Tracing Studio
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const canvasSnapshotsRef = useRef<ImageData[]>([]);
  const [brushColor, setBrushColor] = useState('#EF4444');
  const [drawingTool, setDrawingTool] = useState<'brush' | 'pencil' | 'eraser'>('brush');
  const [strokeWidth, setStrokeWidth] = useState<number>(14);
  const [isDrawing, setIsDrawing] = useState(false);
  const isDrawingRef = useRef(false);
  const [drawnDistance, setDrawnDistance] = useState(0);

  // State for Alphabet Tracing (Stroke-by-Stroke guided tracing matching Image 1)
  const [traceLetterIdx, setTraceLetterIdx] = useState(0);
  const [traceAlphabetLang, setTraceAlphabetLang] = useState<'vi' | 'en'>('vi');
  const [activeStrokeIdx, setActiveStrokeIdx] = useState(0);
  const [activeStrokePoints, setActiveStrokePoints] = useState<{ x: number; y: number }[]>([]);
  const [isTracingStroke, setIsTracingStroke] = useState(false);

  // State for Magic Coloring Book (Matching Images 3, 4, 5)
  const [coloringTemplateIdx, setColoringTemplateIdx] = useState(0);
  const [coloringMode, setColoringMode] = useState<'free' | 'number'>('free');
  const [showTemplatePickerModal, setShowTemplatePickerModal] = useState(false);
  const [showSamplePreview, setShowSamplePreview] = useState(false);
  const [coloredZones, setColoredZones] = useState<Record<string, string>>({});
  const [coloringHistory, setColoringHistory] = useState<Record<string, string>[]>([]);

  const seed = useMemo(
    () => currentLevel * 17 + round * 31 + game.id.length * 7,
    [currentLevel, round, game.id]
  );

  // Completes a single round; ONLY celebrates and finishes level when round === totalRounds (3/3)
  const triggerRoundWin = useCallback(
    async (enSpeech: string, viPraise: string, e?: React.MouseEvent) => {
      if (isAdvancingRef.current) return;
      isAdvancingRef.current = true;

      if (e) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        fireStarExplosion(
          (rect.left + rect.width / 2) / window.innerWidth,
          (rect.top + rect.height / 2) / window.innerHeight
        );
      } else {
        fireStarExplosion(0.5, 0.5);
      }

      playCelebrationChime(settings.volume);

      if (round < totalRounds) {
        const roundMsg = `${viPraise} Bé qua màn ${round}/${totalRounds} rồi, mình sang màn ${round + 1} nhé!`;
        setFeedbackVi(roundMsg);

        // Chờ cô giáo nói xong xuôi lời chúc mừng và hướng dẫn trước khi chuyển sang màn mới
        const speechPromise = speakTeacherVoice(
          [
            { lang: 'en', text: enSpeech },
            { lang: 'vi', text: `${viPraise} Mình sang màn tiếp theo nhé!` },
          ],
          settings
        );
        const safetyTimeoutPromise = new Promise((resolve) => setTimeout(resolve, 12000));

        await Promise.race([speechPromise, safetyTimeoutPromise]);

        // Đợi thêm một thoáng 350ms tự nhiên rồi mới dọn sạch âm thanh và sang màn mới
        await new Promise((resolve) => setTimeout(resolve, 350));
        stopAllAudio();
        setSelectedRightId(null);
        setFedCount(0);
        setMazeStep(1);
        setPoppedIds({});
        setColoredZones({});
        setColoringHistory([]);
        setActiveStrokeIdx(0);
        setActiveStrokePoints([]);
        setDrawnDistance(0);
        isAdvancingRef.current = false;
        setRound((r) => r + 1);
      } else {
        const finalMsg = `${viPraise} Chúc mừng bé ơi! Bé đã hoàn thành xuất sắc cả ${totalRounds} màn chơi!`;
        setFeedbackVi(finalMsg);

        const speechPromise = speakTeacherVoice(
          [
            { lang: 'en', text: `${enSpeech} Wonderful job!` },
            {
              lang: 'vi',
              text: `${viPraise} Chúc mừng bé ơi! Bé đã vượt qua đủ cả ba màn chơi xuất sắc!`,
            },
          ],
          settings
        );
        const safetyTimeoutPromise = new Promise((resolve) => setTimeout(resolve, 12000));

        await Promise.race([speechPromise, safetyTimeoutPromise]);
        await new Promise((resolve) => setTimeout(resolve, 400));

        stopAllAudio();
        setSelectedRightId(null);
        isAdvancingRef.current = false;
        fireFireworksCelebration();
        setShowVictoryModal(true);
        onLevelComplete(game, 3);
      }
    },
    [round, totalRounds, settings, game, onLevelComplete]
  );

  // Gentle retry with warm encouragement "Cố lên nào bé ơi!" and strict language separation
  const triggerGentleRetry = useCallback(
    (hintVi: string, targetEn: string) => {
      if (isAdvancingRef.current) return;
      playGentleEncourageTone(settings.volume);
      const fullHintVi = hintVi.startsWith('Cố lên nào bé ơi')
        ? hintVi
        : `Cố lên nào bé ơi! ${hintVi}`;
      setFeedbackVi(fullHintVi);
      speakTeacherVoice(
        [
          { lang: 'vi', text: fullHintVi },
          { lang: 'en', text: targetEn },
        ],
        settings
      );
    },
    [settings]
  );

  // Reset round to 1 when switching to a different game
  useEffect(() => {
    setRound(1);
    setShowVictoryModal(false);
    isAdvancingRef.current = false;
  }, [game.id]);

  // Initialize or reset round state when game or round changes
  useEffect(() => {
    setFeedbackVi(game.promptVi);
    setSelectedRightId(null);
    setFedCount(0);
    setMazeStep(1);
    setPoppedIds({});
    setColoredZones({});
    setColoringHistory([]);
    setActiveStrokeIdx(0);
    setActiveStrokePoints([]);
    setDrawnDistance(0);
    isAdvancingRef.current = false;

    if (game.id === 'alphabet-tracing') {
      setTraceLetterIdx((currentLevel + round - 2) % VIETNAMESE_LETTER_TRACES.length);
    }
    if (game.id === 'magic-coloring') {
      setColoringTemplateIdx((currentLevel + round - 2) % COLORING_BOOK_TEMPLATES.length);
    }

    if (game.id === 'memory-flip') {
      const pool = animalVocab;
      const start = seed % Math.max(1, pool.length - 3);
      const chosen = [
        pool[start % pool.length],
        pool[(start + 1) % pool.length],
        pool[(start + 2) % pool.length],
      ];
      const pairs = [...chosen, ...chosen].map((item, idx) => ({
        uid: `${item.id}-${idx}`,
        id: item.id,
        emoji: item.emoji,
        en: item.en,
        vi: item.vi,
        matched: false,
      }));
      const shuffled = pairs
        .map((val, i) => ({ val, sort: (seed + i * 13) % 19 }))
        .sort((a, b) => a.sort - b.sort)
        .map((x) => x.val);
      setMemoryDeck(shuffled);
      setFlippedIndices([]);
    }
  }, [game.id, game.promptVi, round, seed, animalVocab, currentLevel]);

  // Speak initial game prompt on mount
  useEffect(() => {
    speakTeacherVoice(
      [
        { lang: 'vi', text: `${game.titleVi}. ${game.promptVi}` },
        { lang: 'en', text: `${game.titleEn}!` },
      ],
      settings
    );
    return () => {
      stopAllAudio();
    };
  }, [game.id]);


  // Setup drawing canvas for free-drawing
  const renderCanvasBackground = useCallback(() => {
    if (game.id !== 'free-drawing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.max(600, Math.round((rect.width || 800) * dpr));
    const targetH = Math.max(500, Math.round((rect.height || 600) * dpr));
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvasSnapshotsRef.current = [];
  }, [game.id]);

  useEffect(() => {
    renderCanvasBackground();
  }, [renderCanvasBackground, round]);

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save snapshot for Undo
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvasSnapshotsRef.current = [...canvasSnapshotsRef.current.slice(-15), snap];
    } catch {
      // ignore if canvas tainted
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    isDrawingRef.current = true;
    setIsDrawing(true);
    lastPointRef.current = { x, y };
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (drawingTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = strokeWidth * 1.6;
      ctx.globalAlpha = 1;
    } else if (drawingTool === 'pencil') {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = Math.max(3, strokeWidth * 0.55);
      ctx.globalAlpha = 0.85;
    } else {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = strokeWidth;
      ctx.globalAlpha = 1;
    }
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
    setDrawnDistance((prev) => prev + 6);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();

    if (lastPointRef.current) {
      const dx = x - lastPointRef.current.x;
      const dy = y - lastPointRef.current.y;
      const dist = Math.hypot(dx, dy);
      setDrawnDistance((prev) => prev + dist);
    }
    lastPointRef.current = { x, y };
  };

  const handleCanvasPointerUp = (e?: React.PointerEvent<HTMLCanvasElement>) => {
    if (e) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    isDrawingRef.current = false;
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const undoCanvasStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snaps = canvasSnapshotsRef.current;
    if (snaps.length === 0) return;
    const prevSnap = snaps[snaps.length - 1];
    canvasSnapshotsRef.current = snaps.slice(0, -1);
    ctx.putImageData(prevSnap, 0, 0);
  };

  const clearCanvas = () => {
    setDrawnDistance(0);
    renderCanvasBackground();
  };

  // Next game suggestion
  const nextGame = useMemo(() => {
    const idx = allGames.findIndex((g) => g.id === game.id);
    return allGames[(idx + 1) % allGames.length];
  }, [allGames, game.id]);

  // Render specific interactive game board based on game.id
  const renderGameBody = () => {
    // 0. NEW COMMERCIAL GAMES: CHARACTER JIGSAW PUZZLE & DRESS UP MAKEOVER
    if (game.id === 'character-puzzle') {
      return (
        <CharacterPuzzleGame
          settings={settings}
          onBack={onBack}
          onWin={() =>
            triggerRoundWin(
              'Character puzzle solved!',
              'Tuyệt vời! Bé đã ghép xong bức tranh nhân vật thật khéo léo!'
            )
          }
          onGentleRetry={(msgVi, msgEn) => triggerGentleRetry(msgVi, msgEn)}
        />
      );
    }
    if (game.id === 'dress-up-makeover') {
      return (
        <DressUpMakeoverGame
          settings={settings}
          onBack={onBack}
          onWin={() =>
            triggerRoundWin(
              'Fashion star!',
              'Bé phối đồ và làm đẹp cho bạn nhỏ thật lộng lẫy và đáng yêu!'
            )
          }
        />
      );
    }

    // 1. FIND THE SAME / SHADOW MATCH / CHUNKY PUZZLE
    if (game.id === 'find-same' || game.id === 'shadow-match' || game.id === 'chunky-puzzle') {
      const pool = concreteVocab;
      const target = pool[seed % pool.length];
      const options = pickDistinctVocabOptions(pool, target, 4, seed);

      const isShadow = game.id === 'shadow-match';
      const isPuzzle = game.id === 'chunky-puzzle';

      return (
        <div className="flex flex-col items-center justify-between gap-4 py-2">
          <div className="w-full max-w-md rounded-3xl bg-[#FFFDF5] border-2 border-amber-200 p-5 text-center shadow-sm flex flex-col items-center">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-2">
              {isShadow
                ? `Màn ${round}/${totalRounds}: Chiếc bóng bí ẩn này là của ai?`
                : isPuzzle
                ? `Màn ${round}/${totalRounds}: Mảnh ghép còn thiếu là hình nào?`
                : `Màn ${round}/${totalRounds}: Bé tìm hình giống hệt hình mẫu của cô:`}
            </span>
            <button
              type="button"
              onClick={() =>
                speakTeacherVoice(
                  [
                    { lang: 'vi', text: `Bé hãy tìm ${target.vi.toLowerCase()} nhé!` },
                    { lang: 'en', text: `${target.en}!` },
                  ],
                  settings
                )
              }
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white border-2 border-amber-200 shadow-inner flex items-center justify-center p-2 cursor-pointer relative group"
            >
              <GameCardVisual
                itemId={target.id}
                emoji={target.emoji}
                en={target.en}
                vi={target.vi}
                isSilhouette={isShadow}
                size="fluid"
              />
              {isPuzzle && (
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-black text-amber-600 bg-white/40 backdrop-blur-2xs rounded-3xl">
                  🧩?
                </span>
              )}
            </button>
            <div className="mt-2 font-extrabold text-base sm:text-lg text-slate-900">
              {isShadow ? 'Chạm vào loa hoặc đoán bóng nhé!' : `${target.en} · ${target.vi}`}
            </div>
          </div>

          <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-3">
            {options.map((opt) => {
              const isRight = selectedRightId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isAdvancingRef.current}
                  onClick={(e) => {
                    if (isAdvancingRef.current) return;
                    if (opt.id === target.id) {
                      setSelectedRightId(opt.id);
                      triggerRoundWin(
                        `${opt.en}! ${opt.phrase2To3y.en}!`,
                        `Đúng rồi! Đó là ${opt.vi.toLowerCase()}!`,
                        e
                      );
                    } else {
                      triggerGentleRetry(
                        `Đây là ${opt.vi.toLowerCase()}. Bé hãy tìm ${target.vi.toLowerCase()} nhé!`,
                        target.en
                      );
                    }
                  }}
                  className={`rounded-3xl p-3.5 bg-white border-2 border-b-4 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    isRight
                      ? 'border-emerald-500 bg-emerald-50 scale-105'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="w-full h-24 sm:h-28 flex items-center justify-center p-0.5">
                    <GameCardVisual
                      itemId={opt.id}
                      emoji={opt.emoji}
                      en={opt.en}
                      vi={opt.vi}
                      size="fluid"
                    />
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 truncate max-w-full">{opt.en}</span>
                  <span className="text-xs font-semibold text-slate-500 truncate max-w-full">{opt.vi}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 2. ODD ONE OUT (Tìm Vật Khác Biệt)
    if (game.id === 'odd-one-out') {
      const pool = concreteVocab;
      const sameItem = pool[seed % pool.length];
      let oddItem = pool[(seed + 7) % pool.length];
      if (oddItem.id === sameItem.id || oddItem.emoji === sameItem.emoji) {
        oddItem = pool[(seed + 3) % pool.length];
      }
      const oddPosition = seed % 4;
      const cards = [0, 1, 2, 3].map((idx) => (idx === oddPosition ? oddItem : sameItem));

      return (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-center">
            <p className="text-sm sm:text-base font-extrabold text-slate-800">
              Màn {round}/{totalRounds}: Có 3 hình{' '}
              <span className="text-sky-700">
                {sameItem.vi} ({sameItem.en})
              </span>{' '}
              giống nhau và 1 hình khác biệt! Bé chạm đúng hình khác biệt nhé!
            </p>
          </div>

          <div className="w-full max-w-lg grid grid-cols-2 gap-4">
            {cards.map((item, idx) => {
              const isOdd = idx === oddPosition;
              const isRight = selectedRightId === `odd-${idx}`;
              return (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={(e) => {
                    if (isOdd) {
                      setSelectedRightId(`odd-${idx}`);
                      triggerRoundWin(
                        `${item.en}!`,
                        `Tinh mắt quá! ${item.vi} là hình khác biệt!`,
                        e
                      );
                    } else {
                      triggerGentleRetry(
                        `Hình ${item.vi.toLowerCase()} này giống các hình bên cạnh rồi. Bé tìm hình ${oddItem.vi.toLowerCase()} khác biệt nhé!`,
                        oddItem.en
                      );
                    }
                  }}
                  className={`rounded-3xl p-4 bg-white border-2 border-b-4 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    isRight
                      ? 'border-emerald-500 bg-emerald-50 scale-105'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="w-full h-24 sm:h-32 flex items-center justify-center p-0.5">
                    <GameCardVisual
                      itemId={item.id}
                      emoji={item.emoji}
                      en={item.en}
                      vi={item.vi}
                      size="fluid"
                    />
                  </div>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    {item.en}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{item.vi}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 3. ANIMAL MEMORY (Lật Thẻ Trí Nhớ)
    if (game.id === 'memory-flip') {
      const handleCardTap = (idx: number, e: React.MouseEvent) => {
        const card = memoryDeck[idx];
        if (!card || card.matched || flippedIndices.includes(idx) || flippedIndices.length >= 2) {
          return;
        }
        playSoundEffect('pop', settings.volume);
        speakTeacherVoice(
          [
            { lang: 'en', text: `${card.en}!` },
            { lang: 'vi', text: card.vi },
          ],
          settings
        );
        const nextFlipped = [...flippedIndices, idx];
        setFlippedIndices(nextFlipped);

        if (nextFlipped.length === 2) {
          const [firstIdx, secondIdx] = nextFlipped;
          const firstCard = memoryDeck[firstIdx];
          const secondCard = memoryDeck[secondIdx];
          if (firstCard.id === secondCard.id) {
            const updated = memoryDeck.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, matched: true } : c
            );
            setMemoryDeck(updated);
            setFlippedIndices([]);
            if (updated.every((c) => c.matched)) {
              triggerRoundWin(
                `${secondCard.en}!`,
                'Trí nhớ siêu đẳng! Bé đã lật mở hết các cặp hình giống nhau!',
                e
              );
            }
          } else {
            playGentleEncourageTone(settings.volume);
            setFeedbackVi('Cố lên nào bé ơi! Hai thẻ chưa giống nhau, bé nhớ vị trí để lật lại nhé!');
            window.setTimeout(() => {
              setFlippedIndices([]);
            }, 800);
          }
        }
      };

      const matchedPairsCount = memoryDeck.filter((c) => c.matched).length / 2;

      return (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="text-xs sm:text-sm font-extrabold text-amber-900 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
            Màn {round}/{totalRounds}: Đã ghép đúng {matchedPairsCount}/3 cặp hình giống nhau
          </div>
          <div className="w-full max-w-xl grid grid-cols-3 gap-3 sm:gap-4">
            {memoryDeck.map((card, idx) => {
              const isOpen = card.matched || flippedIndices.includes(idx);
              return (
                <button
                  key={card.uid}
                  type="button"
                  onClick={(e) => handleCardTap(idx, e)}
                  className={`min-h-[120px] sm:min-h-[145px] rounded-3xl p-3 border-2 border-b-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    card.matched
                      ? 'bg-emerald-50 border-emerald-400'
                      : isOpen
                      ? 'bg-white border-sky-400'
                      : 'bg-gradient-to-br from-amber-400 to-orange-400 border-amber-600 text-white hover:scale-[1.02]'
                  }`}
                >
                  {isOpen ? (
                    <div className="w-full flex flex-col items-center justify-center">
                      <div className="w-full h-16 sm:h-20 flex items-center justify-center p-0.5 mb-1">
                        <GameCardVisual
                          itemId={card.id}
                          emoji={card.emoji}
                          en={card.en}
                          vi={card.vi}
                          size="fluid"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate max-w-full">
                        {card.en}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold truncate max-w-full">{card.vi}</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl sm:text-4xl">🃏</span>
                      <span className="text-xs font-extrabold mt-1">Chạm mở</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 4. BIG OR SMALL (To hay Nhỏ)
    if (game.id === 'big-or-small') {
      const pair = BIG_SMALL_PAIRS[seed % BIG_SMALL_PAIRS.length];
      const askBig = round % 2 === 1;
      const swapOrder = seed % 2 === 0;

      const items = [
        {
          id: 'big',
          isTarget: askBig,
          en: pair.bigEn,
          vi: pair.bigVi,
          emoji: pair.bigEmoji,
          sizeClass: 'text-6xl sm:text-8xl scale-110',
          boxClass: 'w-28 h-28 sm:w-36 sm:h-36',
          tag: 'BIG · TO LỚN',
        },
        {
          id: 'small',
          isTarget: !askBig,
          en: pair.smallEn,
          vi: pair.smallVi,
          emoji: pair.smallEmoji,
          sizeClass: 'text-3xl sm:text-4xl scale-75',
          boxClass: 'w-20 h-20 sm:w-24 sm:h-24',
          tag: 'SMALL · NHỎ XÍU',
        },
      ];
      const ordered = swapOrder ? [items[1], items[0]] : items;

      return (
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="rounded-3xl bg-amber-50 border-2 border-amber-200 px-5 py-3 text-center">
            <div className="text-base sm:text-xl font-extrabold text-slate-900">
              Màn {round}/{totalRounds}: Bé hãy chạm vào bạn{' '}
              <span className="text-orange-600 underline">
                {askBig ? 'TO HƠN (BIGGER)' : 'NHỎ HƠN (SMALLER)'}
              </span>{' '}
              nhé!
            </div>
          </div>

          <div className="w-full max-w-xl grid grid-cols-2 gap-4">
            {ordered.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={(e) => {
                  if (it.isTarget) {
                    setSelectedRightId(it.id);
                    triggerRoundWin(
                      `${it.en}!`,
                      `Chuẩn xác! Đó là ${it.vi.toLowerCase()}!`,
                      e
                    );
                  } else {
                    triggerGentleRetry(
                      `Đó là ${it.vi.toLowerCase()}. Bé hãy chọn bạn ${
                        askBig ? 'to lớn hơn' : 'nhỏ xíu hơn'
                      } nhé!`,
                      askBig ? pair.bigEn : pair.smallEn
                    );
                  }
                }}
                className="min-h-[210px] rounded-3xl bg-white border-2 border-b-4 border-slate-200 hover:border-amber-400 p-5 flex flex-col items-center justify-between cursor-pointer active:scale-95 transition-all"
              >
                <span className="text-[11px] font-extrabold text-slate-400 tracking-wider">
                  {it.tag}
                </span>
                <div
                  className={`${it.boxClass} rounded-3xl bg-[#FFFDF5] border border-amber-100 flex items-center justify-center overflow-hidden p-1`}
                >
                  <GameCardVisual
                    itemId={it.en.toLowerCase()}
                    emoji={it.emoji}
                    en={it.en}
                    vi={it.vi}
                    size="fluid"
                  />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900">{it.en}</div>
                  <div className="text-xs font-semibold text-slate-500">{it.vi}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 5. WHAT COMES NEXT? (Quy Luật Tiếp Theo)
    if (game.id === 'pattern-next') {
      const pool = concreteVocab;
      const itemA = pool[seed % pool.length];
      const choices = pickDistinctVocabOptions(pool, itemA, 3, seed);
      const itemB = choices.find((c) => c.id !== itemA.id) || pool[(seed + 5) % pool.length];
      // Pattern: A - B - A - B - [A]
      const sequence = [itemA, itemB, itemA, itemB];
      const answer = itemA;

      return (
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="w-full max-w-2xl rounded-3xl bg-[#FFFDF5] border-2 border-amber-200 p-4 sm:p-6">
            <div className="text-xs font-extrabold text-amber-800 text-center mb-3 uppercase">
              Màn {round}/{totalRounds} · Đoàn tàu quy luật: Hình nào tiếp theo ở dấu chấm hỏi (?)
            </div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3 items-center">
              {sequence.map((s, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-2xl bg-white border-2 border-amber-200 flex flex-col items-center justify-center p-2 shadow-2xs"
                >
                  <span className="text-3xl sm:text-5xl">{s.emoji}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-1 truncate max-w-full">
                    {s.en}
                  </span>
                </div>
              ))}
              <div className="aspect-square rounded-2xl bg-amber-100 border-2 border-dashed border-amber-500 flex flex-col items-center justify-center p-2 animate-pulse">
                <span className="text-3xl sm:text-5xl font-black text-amber-700">?</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-amber-800">Tiếp theo</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-lg grid grid-cols-3 gap-3">
            {choices.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={(e) => {
                  if (ch.id === answer.id) {
                    setSelectedRightId(ch.id);
                    triggerRoundWin(
                      `${ch.en}!`,
                      `Tuyệt vời! Hình tiếp theo theo quy luật chính là ${ch.vi.toLowerCase()}!`,
                      e
                    );
                  } else {
                    triggerGentleRetry(
                      `Quy luật đang là ${itemA.vi.toLowerCase()}, ${itemB.vi.toLowerCase()}, ${itemA.vi.toLowerCase()}, ${itemB.vi.toLowerCase()}. Vậy tiếp theo phải là ${answer.vi.toLowerCase()} nhé!`,
                      answer.en
                    );
                  }
                }}
                className="rounded-3xl bg-white border-2 border-b-4 border-slate-200 hover:border-amber-400 p-4 flex flex-col items-center gap-1 cursor-pointer active:scale-95"
              >
                <div className="w-full h-16 sm:h-20 flex items-center justify-center p-0.5">
                  <GameCardVisual
                    itemId={ch.id}
                    emoji={ch.emoji}
                    en={ch.en}
                    vi={ch.vi}
                    size="fluid"
                  />
                </div>
                <span className="text-sm font-extrabold text-slate-900">{ch.en}</span>
                <span className="text-xs text-slate-500 font-semibold">{ch.vi}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 6. BUBBLE POP FUN (Bé Bấm Nổ Đúng Bong Bóng Cô Gọi)
    if (game.id === 'bubble-pop') {
      const targetBubble = concreteVocab[seed % concreteVocab.length];
      const bubbles = useMemo(
        () => pickDistinctVocabOptions(concreteVocab, targetBubble, 6, seed),
        [concreteVocab, targetBubble, seed]
      );

      return (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-full max-w-lg rounded-3xl bg-sky-50 border-2 border-sky-200 p-4 text-center flex flex-col items-center gap-2">
            <span className="text-xs font-extrabold text-sky-800 uppercase">
              Màn {round}/{totalRounds} · Bé lắng nghe và bấm nổ ĐÚNG quả bong bóng:
            </span>
            <button
              type="button"
              onClick={() =>
                speakTeacherVoice(
                  [
                    { lang: 'vi', text: `Bé hãy bấm nổ bong bóng ${targetBubble.vi.toLowerCase()} nhé!` },
                    { lang: 'en', text: `${targetBubble.en}!` },
                  ],
                  settings
                )
              }
              className="px-5 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Volume2 className="w-5 h-5" />
              <span>
                Bong bóng cần tìm: {targetBubble.en} ({targetBubble.vi})
              </span>
            </button>
          </div>

          <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-3 gap-4">
            {bubbles.map((b) => {
              const popped = Boolean(poppedIds[b.id]);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={(e) => {
                    if (b.id === targetBubble.id) {
                      playSoundEffect('pop', settings.volume);
                      setPoppedIds({ ...poppedIds, [b.id]: true });
                      triggerRoundWin(
                        `Pop! ${b.en}!`,
                        `Bụp! Bé bấm nổ đúng bong bóng ${b.vi.toLowerCase()} rồi!`,
                        e
                      );
                    } else {
                      triggerGentleRetry(
                        `Đó là bong bóng ${b.vi.toLowerCase()}. Bé hãy tìm bong bóng ${targetBubble.vi.toLowerCase()} nhé!`,
                        targetBubble.en
                      );
                    }
                  }}
                  className={`aspect-square rounded-full border-3 flex flex-col items-center justify-center p-4 transition-all cursor-pointer ${
                    popped
                      ? 'bg-emerald-50 border-emerald-400 scale-95'
                      : 'bg-gradient-to-br from-sky-100/90 via-white to-pink-100/90 border-sky-300 shadow-md hover:scale-105 active:scale-90'
                  }`}
                >
                  {popped ? (
                    <span className="text-5xl sm:text-6xl animate-ping">✨</span>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5">
                      <GameCardVisual
                        itemId={b.id}
                        emoji={b.emoji}
                        en={b.en}
                        vi={b.vi}
                        size="fluid"
                      />
                    </div>
                  )}
                  <span className="text-sm font-extrabold text-slate-900 mt-1.5">{b.en}</span>
                  <span className="text-xs font-semibold text-sky-700">{b.vi}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 7. ALPHABET EXPLORER (Khám Phá & Tìm Đúng Chữ Cái A-Z Qua 3 Màn)
    if (game.id === 'alphabet-explorer') {
      const targetAlphaIdx = seed % ALPHABET_A_TO_Z.length;
      const targetAlpha = ALPHABET_A_TO_Z[targetAlphaIdx];
      const currentAlpha = ALPHABET_A_TO_Z[selectedAlphaIdx % ALPHABET_A_TO_Z.length];

      return (
        <div className="flex flex-col gap-4 py-1">
          {/* Active Round Mission Card */}
          <div className="rounded-3xl bg-[#FFFDF5] border-2 border-amber-300 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center text-white shadow-sm shrink-0"
                style={{ backgroundColor: targetAlpha.colorHex }}
              >
                <span className="text-3xl sm:text-4xl font-black leading-none">
                  {targetAlpha.letter}
                  {targetAlpha.letter.toLowerCase()}
                </span>
                <span className="text-xl mt-0.5">{targetAlpha.emoji}</span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-amber-800 uppercase">
                  Màn {round}/{totalRounds} · Thử thách tìm chữ cái A–Z:
                </div>
                <div className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  Bé hãy tìm chữ <span className="text-orange-600 underline">{targetAlpha.letter}</span> ({targetAlpha.wordEn} · {targetAlpha.wordVi})
                </div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">
                  Đang xem: Chữ {currentAlpha.letter} — {currentAlpha.wordEn} ({currentAlpha.wordVi})
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                speakTeacherVoice(
                  [
                    {
                      lang: 'vi',
                      text: `Bé hãy tìm chữ ${targetAlpha.letter}, trong từ ${targetAlpha.wordVi.toLowerCase()} nhé!`,
                    },
                    {
                      lang: 'en',
                      text: `Letter ${targetAlpha.letter}! ${targetAlpha.letter} is for ${targetAlpha.wordEn}!`,
                    },
                  ],
                  settings
                )
              }
              className="min-h-[44px] px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4" /> Nghe chữ cần tìm
            </button>
          </div>

          {/* 26 Letters Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-9 gap-2">
            {ALPHABET_A_TO_Z.map((item, idx) => {
              const isTargetPicked = selectedRightId === item.letter;
              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={(e) => {
                    setSelectedAlphaIdx(idx);
                    playSoundEffect('pop', settings.volume);
                    if (item.letter === targetAlpha.letter) {
                      setSelectedRightId(item.letter);
                      triggerRoundWin(
                        `Letter ${item.letter}! ${item.letter} is for ${item.wordEn}!`,
                        `Chính xác! Đó là chữ ${item.letter}, ${item.wordVi.toLowerCase()}!`,
                        e
                      );
                    } else {
                      triggerGentleRetry(
                        `Đó là chữ ${item.letter}, ${item.wordVi.toLowerCase()}. Bé hãy tìm chữ ${targetAlpha.letter}, ${targetAlpha.wordVi.toLowerCase()} nhé!`,
                        `Letter ${targetAlpha.letter}! ${targetAlpha.wordEn}!`
                      );
                    }
                  }}
                  className={`rounded-2xl p-2 border-2 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                    isTargetPicked
                      ? 'bg-emerald-100 border-emerald-500 shadow-sm scale-105'
                      : 'bg-white border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <span
                    className="text-lg sm:text-xl font-black leading-none"
                    style={{ color: item.colorHex }}
                  >
                    {item.letter}
                  </span>
                  <span className="text-lg sm:text-xl my-0.5">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-600 truncate max-w-full">
                    {item.wordEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 8. FIRST LETTER SOUND & CATCH THE LETTER FISH
    if (game.id === 'first-letter-sound' || game.id === 'catch-letter-fish') {
      const targetAlpha = ALPHABET_A_TO_Z[seed % ALPHABET_A_TO_Z.length];
      const distractors = [
        ALPHABET_A_TO_Z[(seed + 4) % ALPHABET_A_TO_Z.length],
        ALPHABET_A_TO_Z[(seed + 9) % ALPHABET_A_TO_Z.length],
        ALPHABET_A_TO_Z[(seed + 15) % ALPHABET_A_TO_Z.length],
      ];
      const choices = [targetAlpha, ...distractors].sort(
        (a, b) => ((a.letter.charCodeAt(0) + seed) % 7) - ((b.letter.charCodeAt(0) + seed) % 7)
      );
      const isFish = game.id === 'catch-letter-fish';

      return (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-full max-w-md rounded-3xl bg-[#FFFDF5] border-2 border-sky-200 p-5 text-center flex flex-col items-center">
            <span className="text-xs font-extrabold text-sky-700 uppercase mb-1">
              {isFish
                ? `Màn ${round}/${totalRounds} · 🎣 Câu chú cá mang chữ cái đầu của từ:`
                : `Màn ${round}/${totalRounds} · 👂 Từ này bắt đầu bằng chữ cái nào?`}
            </span>
            <button
              type="button"
              onClick={() =>
                speakTeacherVoice(
                  [
                    { lang: 'en', text: `${targetAlpha.wordEn}! Starts with letter ${targetAlpha.letter}!` },
                    { lang: 'vi', text: targetAlpha.wordVi },
                  ],
                  settings
                )
              }
              className="w-24 h-24 rounded-3xl bg-white border-2 border-sky-100 flex items-center justify-center text-6xl my-1 cursor-pointer"
            >
              {targetAlpha.emoji}
            </button>
            <div className="text-xl font-black text-slate-900 tracking-wide">
              <span className="text-amber-600 underline">_</span>
              {targetAlpha.wordEn.slice(1)} ({targetAlpha.wordVi})
            </div>
          </div>

          <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-3">
            {choices.map((ch) => (
              <button
                key={ch.letter}
                type="button"
                onClick={(e) => {
                  if (ch.letter === targetAlpha.letter) {
                    setSelectedRightId(ch.letter);
                    triggerRoundWin(
                      `Letter ${ch.letter}! ${targetAlpha.wordEn}!`,
                      `Giỏi quá! Đó là chữ ${ch.letter}, trong từ ${targetAlpha.wordVi.toLowerCase()}!`,
                      e
                    );
                  } else {
                    triggerGentleRetry(
                      `Đó là chữ ${ch.letter}. Bé hãy tìm chữ ${targetAlpha.letter} của từ ${targetAlpha.wordVi.toLowerCase()} nhé!`,
                      `Letter ${targetAlpha.letter}! ${targetAlpha.wordEn}!`
                    );
                  }
                }}
                className={`rounded-3xl p-4 border-2 border-b-4 flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all ${
                  isFish
                    ? 'bg-sky-50 border-sky-300 hover:bg-sky-100'
                    : 'bg-white border-slate-200 hover:border-amber-400'
                }`}
              >
                <div className="text-3xl">{isFish ? '🐠' : ch.emoji}</div>
                <div
                  className="text-3xl sm:text-4xl font-black"
                  style={{ color: ch.colorHex }}
                >
                  {ch.letter}
                </div>
                <span className="text-xs font-bold text-slate-500">{ch.wordEn}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 9. COUNT & FEED BUNNY (Đếm Hình & Cho Thỏ Ăn Đúng Số Lượng)
    if (game.id === 'count-feed-bunny') {
      const targetCount = (seed % 5) + 1; // 1 to 5
      const foodEmoji = round % 2 === 1 ? '🥕' : '🍎';
      const foodNameEn = round % 2 === 1 ? 'carrots' : 'apples';
      const foodNameVi = round % 2 === 1 ? 'củ cà rốt' : 'quả táo đỏ';
      const numberChoices = [1, 2, 3, 4, 5];

      return (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-full max-w-md rounded-3xl bg-[#FFFDF5] border-2 border-amber-200 p-4 text-center flex flex-col items-center">
            <div className="text-5xl sm:text-6xl mb-1 animate-bounce">🐰</div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900">
              Màn {round}/{totalRounds}: Bạn Thỏ muốn ăn đúng{' '}
              <span className="text-orange-600 text-xl">{targetCount}</span> {foodNameVi}!
            </div>
            <div className="text-xs font-bold text-emerald-700 mt-1">
              Bước 1: Đút đủ {targetCount} {foodNameVi} ({fedCount}/{targetCount}) · Bước 2: Bấm chọn chữ số đúng!
            </div>
          </div>

          {/* Step 1: Tap items to feed Bunny */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-lg">
            {Array.from({ length: targetCount }).map((_, idx) => {
              const eaten = idx < fedCount;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (eaten) return;
                    const nextCount = fedCount + 1;
                    setFedCount(nextCount);
                    playSoundEffect('crunch', settings.volume);
                    const countWord = NUMBER_WORDS_EN[nextCount];
                    speakTeacherVoice([{ lang: 'en', text: `${countWord}!` }], settings);
                  }}
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-3xl border-2 border-b-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    eaten
                      ? 'bg-emerald-50 border-emerald-400 scale-95'
                      : 'bg-white border-amber-300 hover:scale-105 active:scale-95 shadow-xs'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl">{eaten ? '😋' : foodEmoji}</span>
                  <span className="text-[11px] font-extrabold text-slate-700 mt-0.5">
                    {eaten ? NUMBER_WORDS_EN[idx + 1] : `Đút #${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Step 2: Verify by selecting the matching number card */}
          <div className="w-full max-w-lg rounded-2xl bg-slate-50 border border-slate-200 p-3 text-center space-y-2">
            <div className="text-xs font-extrabold text-slate-700">
              Bước 2: Bạn Thỏ đã ăn bao nhiêu {foodNameVi}? Bé chạm đúng con số nhé:
            </div>
            <div className="grid grid-cols-5 gap-2">
              {numberChoices.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={(e) => {
                    if (fedCount < targetCount) {
                      triggerGentleRetry(
                        `Bé hãy chạm đút hết ${targetCount} ${foodNameVi} ở trên cho bạn Thỏ ăn trước nhé!`,
                        `${NUMBER_WORDS_EN[targetCount]} ${foodNameEn}`
                      );
                      return;
                    }
                    if (num === targetCount) {
                      setSelectedRightId(String(num));
                      triggerRoundWin(
                        `${NUMBER_WORDS_EN[targetCount]}! ${targetCount} ${foodNameEn}!`,
                        `Giỏi quá! Bạn Thỏ đã ăn đủ ${targetCount} ${foodNameVi}!`,
                        e
                      );
                    } else {
                      triggerGentleRetry(
                        `Đó là số ${num}. Bạn Thỏ ăn ${targetCount} ${foodNameVi}, bé chọn số ${targetCount} nhé!`,
                        NUMBER_WORDS_EN[targetCount]
                      );
                    }
                  }}
                  className="min-h-[60px] rounded-2xl bg-white border-2 border-b-4 border-slate-200 hover:border-amber-400 flex flex-col items-center justify-center cursor-pointer active:scale-95"
                >
                  <span className="text-xl sm:text-2xl font-black text-indigo-600">{num}</span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {NUMBER_WORDS_EN[num]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 10. NUMBERS GAMES: find-number, number-to-quantity, number-train, one-more-friend
    if (
      game.id === 'find-number' ||
      game.id === 'number-to-quantity' ||
      game.id === 'number-train' ||
      game.id === 'one-more-friend'
    ) {
      const targetNum = (seed % 5) + 2; // 2 to 6
      const sampleItem = animalVocab[seed % animalVocab.length];
      const choiceSet = new Set<number>([targetNum]);
      for (let d = 1; choiceSet.size < 4; d++) {
        choiceSet.add(((targetNum + d * 2 - 1) % 8) + 1);
      }
      const choices = Array.from(choiceSet).sort((a, b) => a - b);

      const isTrain = game.id === 'number-train';
      const isAddOne = game.id === 'one-more-friend';
      const isFindNumber = game.id === 'find-number';

      return (
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="w-full max-w-xl rounded-3xl bg-[#FFFDF5] border-2 border-indigo-200 p-5 text-center">
            {isTrain ? (
              <>
                <div className="text-xs font-extrabold text-indigo-700 uppercase mb-2">
                  Màn {round}/{totalRounds} · 🚂 Đoàn tàu con số đang thiếu toa số mấy?
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  <span className="text-4xl sm:text-5xl">🚂</span>
                  {[targetNum - 1, targetNum, targetNum + 1].map((n, i) => (
                    <div
                      key={i}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl font-black ${
                        n === targetNum
                          ? 'bg-amber-100 border-dashed border-amber-500 text-amber-700 animate-pulse'
                          : 'bg-white border-indigo-200 text-slate-900'
                      }`}
                    >
                      {n === targetNum ? '?' : n}
                    </div>
                  ))}
                </div>
              </>
            ) : isAddOne ? (
              <>
                <div className="text-xs font-extrabold text-indigo-700 uppercase mb-2">
                  Màn {round}/{totalRounds} · Đố vui thêm 1 bạn nữa ({targetNum - 1} + 1 = ?):
                </div>
                <div className="flex items-center justify-center gap-3 text-3xl sm:text-5xl my-2 flex-wrap">
                  <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200">
                    {Array.from({ length: targetNum - 1 }).map((_, i) => (
                      <span key={i}>{sampleItem.emoji}</span>
                    ))}
                  </div>
                  <span className="text-2xl font-black text-amber-600">+</span>
                  <div className="px-3 py-2 rounded-2xl bg-amber-50 border border-amber-200">
                    <span>{sampleItem.emoji}</span>
                  </div>
                  <span className="text-2xl font-black text-slate-700">= ?</span>
                </div>
              </>
            ) : isFindNumber ? (
              <>
                <div className="text-xs font-extrabold text-indigo-700 uppercase mb-2">
                  Màn {round}/{totalRounds} · Bé lắng nghe và chọn đúng chữ số cô đọc nhé:
                </div>
                <button
                  type="button"
                  onClick={() =>
                    speakTeacherVoice(
                      [
                        { lang: 'en', text: `Number ${NUMBER_WORDS_EN[targetNum]}!` },
                        { lang: 'vi', text: `Bé hãy tìm số ${targetNum} nhé!` },
                      ],
                      settings
                    )
                  }
                  className="mx-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg sm:text-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-6 h-6" />
                  <span>
                    {NUMBER_WORDS_EN[targetNum]} · Số {targetNum}
                  </span>
                </button>
              </>
            ) : (
              <>
                <div className="text-xs font-extrabold text-indigo-700 uppercase mb-2">
                  Màn {round}/{totalRounds} · Bé đếm xem có bao nhiêu bạn {sampleItem.vi.toLowerCase()} ({sampleItem.en}) nhé!
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 my-2">
                  {Array.from({ length: targetNum }).map((_, i) => (
                    <span
                      key={i}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center text-3xl sm:text-4xl shadow-2xs"
                    >
                      {sampleItem.emoji}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="w-full max-w-lg grid grid-cols-2 sm:grid-cols-4 gap-3">
            {choices.map((num) => (
              <button
                key={num}
                type="button"
                onClick={(e) => {
                  if (num === targetNum) {
                    setSelectedRightId(String(num));
                    triggerRoundWin(
                      `${NUMBER_WORDS_EN[num]}! Number ${num}!`,
                      `Chính xác! Đó là số ${num}!`,
                      e
                    );
                  } else {
                    triggerGentleRetry(
                      `Đó là số ${num}. Bé hãy tìm số ${targetNum} nhé!`,
                      NUMBER_WORDS_EN[targetNum]
                    );
                  }
                }}
                className="min-h-[96px] rounded-3xl bg-white border-2 border-b-4 border-slate-200 hover:border-indigo-400 p-4 flex flex-col items-center justify-center cursor-pointer active:scale-95"
              >
                <span className="text-3xl sm:text-4xl font-black text-indigo-600 tabular-nums">
                  {num}
                </span>
                <span className="text-xs font-extrabold text-slate-600 mt-1">
                  {NUMBER_WORDS_EN[num]}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 11. WHICH HAS MORE? (Nhóm Nào Nhiều Hơn?)
    if (game.id === 'which-has-more') {
      const moreCount = 5;
      const lessCount = 2;
      const itemLeft = fruitVocab[seed % fruitVocab.length];
      let itemRight = fruitVocab[(seed + 3) % fruitVocab.length];
      if (itemRight.id === itemLeft.id) {
        itemRight = fruitVocab[(seed + 1) % fruitVocab.length];
      }
      const leftIsMore = seed % 2 === 0;

      const sides = [
        {
          id: 'left',
          isMore: leftIsMore,
          count: leftIsMore ? moreCount : lessCount,
          item: itemLeft,
        },
        {
          id: 'right',
          isMore: !leftIsMore,
          count: !leftIsMore ? moreCount : lessCount,
          item: itemRight,
        },
      ];

      return (
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-center">
            <span className="text-sm sm:text-base font-extrabold text-slate-900">
              Màn {round}/{totalRounds} · ⚖️ Khay nào có{' '}
              <span className="text-emerald-700 underline">NHIỀU HƠN (MORE)</span>? Bé chạm vào khay nhiều hơn nhé!
            </span>
          </div>

          <div className="w-full max-w-xl grid grid-cols-2 gap-4">
            {sides.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={(e) => {
                  if (s.isMore) {
                    setSelectedRightId(s.id);
                    triggerRoundWin(
                      `More! ${NUMBER_WORDS_EN[s.count]} ${s.item.en}!`,
                      `Giỏi lắm! Khay có ${s.count} ${s.item.vi.toLowerCase()} nhiều hơn!`,
                      e
                    );
                  } else {
                    triggerGentleRetry(
                      `Khay này chỉ có ${s.count} thôi. Bé hãy chọn khay có ${moreCount} quả nhiều hơn nhé!`,
                      'More!'
                    );
                  }
                }}
                className="min-h-[190px] rounded-3xl bg-white border-2 border-b-4 border-slate-200 hover:border-amber-400 p-4 flex flex-col items-center justify-between cursor-pointer active:scale-95"
              >
                <span className="text-xs font-extrabold text-slate-500">
                  Khay {s.item.vi}
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2 my-2">
                  {Array.from({ length: s.count }).map((_, i) => (
                    <span key={i} className="text-4xl sm:text-5xl">
                      {s.item.emoji}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-extrabold text-slate-800">
                  {s.count} · {s.item.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 12A. SHAPE MATCHING (Ghép Hình Khối)
    if (game.id === 'shape-matching') {
      const targetShape = SHAPES_DATA[seed % SHAPES_DATA.length];
      const choices = [
        targetShape,
        SHAPES_DATA[(seed + 1) % SHAPES_DATA.length],
        SHAPES_DATA[(seed + 2) % SHAPES_DATA.length],
        SHAPES_DATA[(seed + 3) % SHAPES_DATA.length],
      ].sort((a, b) => ((a.id.charCodeAt(0) + seed) % 5) - ((b.id.charCodeAt(0) + seed) % 5));

      return (
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="w-full max-w-md rounded-3xl bg-[#FFFDF5] border-2 border-amber-200 p-5 text-center flex flex-col items-center">
            <span className="text-xs font-extrabold text-amber-800 uppercase mb-1">
              Màn {round}/{totalRounds} · Bé tìm đúng hình khối giống mẫu nhé:
            </span>
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl my-1 shadow-inner border border-white"
              style={{ backgroundColor: targetShape.bgTint }}
            >
              {targetShape.emoji}
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              {targetShape.en} · {targetShape.vi}
            </div>
          </div>

          <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-3">
            {choices.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={(e) => {
                  if (ch.id === targetShape.id) {
                    setSelectedRightId(ch.id);
                    triggerRoundWin(
                      `${ch.en}!`,
                      `Tuyệt vời! Đó là ${ch.vi.toLowerCase()}!`,
                      e
                    );
                  } else {
                    triggerGentleRetry(
                      `Đó là ${ch.vi.toLowerCase()}. Bé hãy chọn ${targetShape.vi.toLowerCase()} nhé!`,
                      targetShape.en
                    );
                  }
                }}
                className="rounded-3xl bg-white border-2 border-b-4 border-slate-200 hover:border-amber-400 p-4 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                  style={{ backgroundColor: ch.bgTint }}
                >
                  {ch.emoji}
                </div>
                <span className="text-sm font-extrabold text-slate-900">{ch.en}</span>
                <span className="text-xs font-semibold text-slate-500">{ch.vi}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 12B. FIND THE COLOR & SORT BY COLOR (Tìm Màu Sắc & Phân Loại Màu Sắc)
    if (game.id === 'find-color' || game.id === 'sort-by-color') {
      const targetColor = COLORS_DATA[seed % COLORS_DATA.length];
      const choices = [
        targetColor,
        COLORS_DATA[(seed + 1) % COLORS_DATA.length],
        COLORS_DATA[(seed + 2) % COLORS_DATA.length],
        COLORS_DATA[(seed + 3) % COLORS_DATA.length],
      ].sort((a, b) => ((a.id.charCodeAt(6) + seed) % 5) - ((b.id.charCodeAt(6) + seed) % 5));

      const isSortByColor = game.id === 'sort-by-color';

      return (
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="w-full max-w-md rounded-3xl bg-[#FFFDF5] border-2 border-amber-200 p-5 text-center flex flex-col items-center">
            <span className="text-xs font-extrabold text-amber-800 uppercase mb-1">
              {isSortByColor
                ? `Màn ${round}/${totalRounds} · 🧺 Bé chọn món đồ có cùng màu với chiếc giỏ:`
                : `Màn ${round}/${totalRounds} · 🎨 Bé lắng nghe và chạm đúng màu sắc:`}
            </span>
            <button
              type="button"
              onClick={() =>
                speakTeacherVoice(
                  [
                    { lang: 'en', text: `${targetColor.en}!` },
                    { lang: 'vi', text: `Bé hãy chọn ${targetColor.vi.toLowerCase()} nhé!` },
                  ],
                  settings
                )
              }
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl my-1 shadow-md border-4 border-white cursor-pointer"
              style={{ backgroundColor: targetColor.colorHex }}
            >
              {isSortByColor ? '🧺' : '🎨'}
            </button>
            <div className="text-lg font-extrabold text-slate-900">
              {targetColor.en} · {targetColor.vi}
            </div>
          </div>

          <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-3">
            {choices.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={(e) => {
                  if (ch.id === targetColor.id) {
                    setSelectedRightId(ch.id);
                    triggerRoundWin(
                      isSortByColor ? `${ch.sampleItemEn}! ${ch.en}!` : `${ch.en}!`,
                      isSortByColor
                        ? `Đúng rồi! ${ch.sampleItemVi} có ${ch.vi.toLowerCase()}!`
                        : `Tuyệt vời! Đó là ${ch.vi.toLowerCase()}!`,
                      e
                    );
                  } else {
                    triggerGentleRetry(
                      isSortByColor
                        ? `${ch.sampleItemVi} là ${ch.vi.toLowerCase()}. Bé hãy chọn món đồ có ${targetColor.vi.toLowerCase()} nhé!`
                        : `Đó là ${ch.vi.toLowerCase()}. Bé hãy chọn ${targetColor.vi.toLowerCase()} nhé!`,
                      targetColor.en
                    );
                  }
                }}
                className="rounded-3xl bg-white border-2 border-b-4 border-slate-200 hover:border-amber-400 p-4 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {isSortByColor ? (
                  <>
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                      style={{ backgroundColor: ch.bgTint }}
                    >
                      {ch.sampleEmoji}
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">{ch.sampleItemEn}</span>
                    <span className="text-xs font-semibold text-slate-500">{ch.sampleItemVi}</span>
                  </>
                ) : (
                  <>
                    <div
                      className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm"
                      style={{ backgroundColor: ch.colorHex }}
                    />
                    <span className="text-sm font-extrabold text-slate-900">{ch.en}</span>
                    <span className="text-xs font-semibold text-slate-500">{ch.vi}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 13. RAINBOW XYLOPHONE & GRAND PIANO (Đàn Cầu Vồng Vui Nhộn & Đàn Piano Cổ Điển — 16 Bài Hát Thiếu Nhi)
    if (game.id === 'rainbow-xylophone') {
      return (
        <RainbowXylophoneGame
          settings={settings}
          onBack={onBack}
          onWin={(titleVi, titleEn) => {
            triggerRoundWin(
              `Wonderful melody! You played ${titleEn}!`,
              `Hoan hô bé ơi! Bé đã hoàn thành trọn vẹn bài hát "${titleVi}" rồi!`
            );
          }}
        />
      );
    }


    // 14. MAGIC COLORING (Bé Tô Màu Sáng Tạo — 512x512 Canvas Flood Fill + Camera Sobel Pipeline)
    if (game.id === 'magic-coloring') {
      return (
        <MagicColoringGame
          settings={settings}
          onBack={onBack}
          onWin={() => {
            triggerRoundWin(
              'Splendid coloring! You are a brilliant artist!',
              'Tuyệt vời! Bé đã hoàn thành bức tranh tô màu rực rỡ quá!'
            );
          }}
          onGentleRetry={(msgVi, msgEn) => {
            triggerGentleRetry(msgVi, msgEn);
          }}
        />
      );
    }

    // 15A. ALPHABET TRACING (Bé Tập Viết Chữ Từng Nét — Matches Reference Image 1)
    if (game.id === 'alphabet-tracing') {
      const currentLetterObj =
        VIETNAMESE_LETTER_TRACES[traceLetterIdx % VIETNAMESE_LETTER_TRACES.length];
      const totalStrokes = currentLetterObj.strokes.length;
      const safeStrokeIdx = Math.min(activeStrokeIdx, totalStrokes - 1);
      const currentStroke = currentLetterObj.strokes[safeStrokeIdx];

      const completeActiveStroke = (e?: React.MouseEvent | React.PointerEvent) => {
        playSoundEffect('sparkle', settings.volume);
        setActiveStrokePoints([]);
        setIsTracingStroke(false);

        if (safeStrokeIdx + 1 < totalStrokes) {
          const nextIdx = safeStrokeIdx + 1;
          setActiveStrokeIdx(nextIdx);
          const nextHint = currentLetterObj.strokes[nextIdx].hintVi;
          setFeedbackVi(nextHint);
          speakTeacherVoice(
            [
              {
                lang: 'vi',
                text: `Giỏi lắm! Tiếp theo bé viết nét số ${nextIdx + 1} nhé!`,
              },
            ],
            settings
          );
        } else {
          // Completed all strokes for this letter!
          triggerRoundWin(
            `Letter ${currentLetterObj.letter}! ${currentLetterObj.wordEn}!`,
            `Tuyệt vời! Bé đã viết hoàn chỉnh chữ ${currentLetterObj.letter} — ${currentLetterObj.wordVi}!`,
            e as React.MouseEvent | undefined
          );
        }
      };

      const handleTracingPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 300;
        const y = ((e.clientY - rect.top) / rect.height) * 300;
        setIsTracingStroke(true);
        setActiveStrokePoints([{ x, y }]);
      };

      const handleTracingPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isTracingStroke) return;
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 300;
        const y = ((e.clientY - rect.top) / rect.height) * 300;

        setActiveStrokePoints((prev) => {
          const next = [...prev, { x, y }];
          // Check if child started reasonably close to start or drew at least 35 units and reached near the target star
          const distToEnd = Math.hypot(x - currentStroke.end.x, y - currentStroke.end.y);
          let pathLen = 0;
          for (let i = 1; i < next.length; i++) {
            pathLen += Math.hypot(next[i].x - next[i - 1].x, next[i].y - next[i - 1].y);
          }
          if (distToEnd <= 38 && pathLen >= 42) {
            window.setTimeout(() => completeActiveStroke(), 40);
          }
          return next;
        });
      };

      const handleTracingPointerUp = () => {
        setIsTracingStroke(false);
      };

      return (
        <div className="w-full h-full flex flex-col items-center justify-between gap-1 select-none overflow-hidden">
          {/* Top Toolbar: SINGLE ROW, MAX HEIGHT 48px, ICONS ONLY (No text, no title chips, no long instructions) */}
          <div className="w-full max-w-md h-11 shrink-0 rounded-2xl border-2 border-indigo-300 bg-white px-2 shadow-2xs flex items-center justify-between gap-1">
            {/* Left: Back + Prev letter + Next letter + Lang toggle */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={onBack}
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-95"
                title="Quay lại sân chơi"
                aria-label="Quay lại"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStrokeIdx(0);
                  setActiveStrokePoints([]);
                  setTraceLetterIdx(
                    (prev) =>
                      (prev - 1 + VIETNAMESE_LETTER_TRACES.length) %
                      VIETNAMESE_LETTER_TRACES.length
                  );
                }}
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-black text-sm cursor-pointer transition active:scale-95"
                title="Chữ trước"
                aria-label="Chữ trước"
              >
                ◀
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStrokeIdx(0);
                  setActiveStrokePoints([]);
                  setTraceLetterIdx(
                    (prev) => (prev + 1) % VIETNAMESE_LETTER_TRACES.length
                  );
                }}
                className="w-9 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm cursor-pointer transition active:scale-95"
                title="Chữ tiếp theo"
                aria-label="Chữ tiếp theo"
              >
                ▶
              </button>

              <button
                type="button"
                onClick={() =>
                  setTraceAlphabetLang((prev) => (prev === 'vi' ? 'en' : 'vi'))
                }
                className="w-9 h-9 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-base flex items-center justify-center cursor-pointer transition active:scale-95"
                title={
                  traceAlphabetLang === 'vi'
                    ? 'Chuyển sang Tiếng Anh'
                    : 'Chuyển sang Tiếng Việt'
                }
                aria-label="Đổi ngôn ngữ"
              >
                {traceAlphabetLang === 'vi' ? '🇻🇳' : '🇬🇧'}
              </button>
            </div>

            {/* Right: Reset current letter + Audio Guide */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveStrokeIdx(0);
                  setActiveStrokePoints([]);
                }}
                className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center text-sm cursor-pointer transition active:scale-95"
                title="Viết lại từ nét đầu"
                aria-label="Viết lại"
              >
                🔄
              </button>

              <button
                type="button"
                onClick={() =>
                  speakTeacherVoice(
                    [
                      {
                        lang: 'vi',
                        text: `Chữ ${currentLetterObj.letter}. ${currentLetterObj.wordVi}! Bé hãy vẽ nét số ${safeStrokeIdx + 1} nhé!`,
                      },
                      {
                        lang: 'en',
                        text: `Letter ${currentLetterObj.letter}. ${currentLetterObj.wordEn}!`,
                      },
                    ],
                    settings
                  )
                }
                className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95"
                title="Nghe hướng dẫn phát âm"
                aria-label="Nghe hướng dẫn"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Compact Stroke Progress & Letter Info on 1 Single Line */}
          <div className="w-full max-w-md px-2 flex items-center justify-between text-xs font-black shrink-0">
            <span className="text-indigo-800 truncate">
              Chữ {currentLetterObj.letter} · {currentLetterObj.emoji}{' '}
              {traceAlphabetLang === 'vi'
                ? currentLetterObj.wordVi
                : currentLetterObj.wordEn}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              {currentLetterObj.strokes.map((_, sIdx) => {
                const isDone = sIdx < safeStrokeIdx;
                const isCurrent = sIdx === safeStrokeIdx;
                return (
                  <span
                    key={sIdx}
                    className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isDone ? '✓' : sIdx + 1}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Interactive Lined-Paper SVG Letter Tracing Canvas: Fills remaining space, maintains aspect-square, largest possible */}
          <div className="relative flex-1 min-h-0 w-full max-w-md aspect-square rounded-[24px] bg-[#FAFBFD] border-2 border-indigo-200 shadow-inner flex items-center justify-center p-1.5 sm:p-2 overflow-hidden">
            <svg
              viewBox="0 0 300 300"
              onPointerDown={handleTracingPointerDown}
              onPointerMove={handleTracingPointerMove}
              onPointerUp={handleTracingPointerUp}
              onPointerLeave={handleTracingPointerUp}
              className="w-full h-full max-h-full aspect-square rounded-2xl bg-white border border-slate-200/80 shadow-xs touch-none select-none cursor-crosshair"
              aria-label={`Bảng tập viết chữ ${currentLetterObj.letter}`}
            >
              {/* Primary school notebook horizontal guide lines */}
              <line x1="20" y1="55" x2="280" y2="55" stroke="#E2E8F0" strokeWidth="1.5" />
              <line
                x1="20"
                y1="145"
                x2="280"
                y2="145"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />
              <line x1="20" y1="235" x2="280" y2="235" stroke="#E2E8F0" strokeWidth="1.5" />
              <line x1="150" y1="20" x2="150" y2="280" stroke="#F1F5F9" strokeWidth="1.5" />

              {/* Base Gray Silhouette of All Strokes */}
              {currentLetterObj.strokes.map((st, idx) => (
                <path
                  key={`bg-stroke-${idx}`}
                  d={st.d}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="30"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* Already Completed Strokes */}
              {currentLetterObj.strokes.slice(0, safeStrokeIdx).map((st, idx) => (
                <path
                  key={`done-stroke-${idx}`}
                  d={st.d}
                  fill="none"
                  stroke={brushColor}
                  strokeWidth="26"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* Active Stroke Dashed Guide Line */}
              <path
                d={currentStroke.d}
                fill="none"
                stroke="#60A5FA"
                strokeWidth="5"
                strokeDasharray="10 8"
                strokeLinecap="round"
              />

              {/* Active Stroke Guide Dots */}
              {currentStroke.dots.map((pt, dIdx) => (
                <circle
                  key={`dot-${dIdx}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  fill="#93C5FD"
                />
              ))}

              {/* User's Live Drawn Trail for Current Stroke */}
              {activeStrokePoints.length > 1 && (
                <polyline
                  points={activeStrokePoints.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke={brushColor}
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Golden Target Star ⭐ at End of Active Stroke */}
              <g
                onClick={(e) => {
                  if (activeStrokePoints.length >= 2) {
                    completeActiveStroke(e);
                  } else {
                    triggerGentleRetry(
                      `${currentStroke.hintVi}. Bé hãy đặt ngón tay vào nút tròn màu xanh số ${safeStrokeIdx + 1} rồi kéo xuống ngôi sao vàng nhé!`,
                      `Letter ${currentLetterObj.letter}`
                    );
                  }
                }}
                className="cursor-pointer"
              >
                <circle
                  cx={currentStroke.end.x}
                  cy={currentStroke.end.y}
                  r="19"
                  fill="#FEF9C3"
                  stroke="#FACC15"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                />
                <text
                  x={currentStroke.end.x}
                  y={currentStroke.end.y + 6}
                  textAnchor="middle"
                  fontSize="18"
                >
                  ⭐
                </text>
              </g>

              {/* Green Numbered Start Circle (1, 2, 3...) at Start of Active Stroke */}
              <g className="pointer-events-none">
                <circle
                  cx={currentStroke.start.x}
                  cy={currentStroke.start.y}
                  r="17"
                  fill="#22C55E"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
                <text
                  x={currentStroke.start.x}
                  y={currentStroke.start.y + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="900"
                  fill="#FFFFFF"
                >
                  {safeStrokeIdx + 1}
                </text>
              </g>
            </svg>
          </div>

          {/* Bottom Bar: SINGLE HORIZONTAL ROW, BUTTONS 36-40px, DONE BUTTON ON RIGHT (Not overlapping) */}
          <div className="w-full max-w-md h-12 sm:h-14 shrink-0 rounded-2xl border-2 border-indigo-300 bg-white px-2 shadow-2xs flex items-center justify-between gap-1.5 overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 no-scrollbar flex-1 min-w-0">
              {STUDIO_COLOR_PALETTE.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setBrushColor(c.hex)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 cursor-pointer shrink-0 transition-transform ${
                    brushColor === c.hex
                      ? 'scale-110 border-slate-900 ring-2 ring-indigo-300 shadow-sm'
                      : 'border-white hover:scale-105'
                  }`}
                  aria-label={`Chọn màu mực ${c.nameVi}`}
                />
              ))}
            </div>

            {/* Green "⭐ Xong" Button on Right of color row without overlapping */}
            <button
              type="button"
              onClick={(e) => {
                if (safeStrokeIdx === 0 && activeStrokePoints.length === 0) {
                  triggerGentleRetry(
                    `Bé hãy tập viết nét số 1 của chữ ${currentLetterObj.letter} trước nhé!`,
                    currentLetterObj.letter
                  );
                  return;
                }
                triggerRoundWin(
                  `Letter ${currentLetterObj.letter}! ${currentLetterObj.wordEn}!`,
                  `Tuyệt vời! Bé đã hoàn thành bài tập viết chữ ${currentLetterObj.letter}!`,
                  e
                );
              }}
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white font-black text-base flex items-center justify-center shadow-xs active:scale-95 transition cursor-pointer"
              title="Xong"
              aria-label="Xong"
            >
              ⭐
            </button>
          </div>
        </div>
      );
    }

    // 15B. FREE DRAWING is handled in dedicated fullscreen view
    if (game.id === 'free-drawing') {
      return null;
    }

    // 16. PUPPY PATH MAZE (Dẫn Đường Cho Chú Chó)
    if (game.id === 'puppy-maze') {
      const steps = [1, 2, 3, 4, 5];
      return (
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-center">
            <span className="text-sm sm:text-base font-extrabold text-emerald-950">
              Màn {round}/{totalRounds} · 🐾 Bé chạm lần lượt vào các bậc đá số{' '}
              <strong>1 → 2 → 3 → 4 → 5</strong> để dẫn bạn Cún 🐶 về nhà ăn xương 🦴 nhé!
            </span>
          </div>

          <div className="w-full max-w-2xl rounded-3xl bg-[#FFFDF5] border-2 border-emerald-200 p-5 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl">🐶</span>
              <span className="text-xs font-extrabold text-slate-700">Puppy</span>
            </div>

            {steps.map((st) => {
              const passed = st < mazeStep;
              const isCurrent = st === mazeStep;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={(e) => {
                    if (st === mazeStep) {
                      playSoundEffect('woof', settings.volume);
                      if (st === 5) {
                        triggerRoundWin(
                          'Five! Puppy is home!',
                          'Hoan hô! Bạn Cún đã đi đủ 5 bậc đá về tới ngôi nhà ấm áp rồi!',
                          e
                        );
                      } else {
                        setMazeStep(st + 1);
                        speakTeacherVoice(
                          [{ lang: 'en', text: NUMBER_WORDS_EN[st] }],
                          settings
                        );
                      }
                    } else if (st > mazeStep) {
                      triggerGentleRetry(
                        `Bé phải chạm bậc đá số ${mazeStep} trước nhé!`,
                        NUMBER_WORDS_EN[mazeStep]
                      );
                    }
                  }}
                  className={`w-14 h-14 sm:w-18 sm:h-18 rounded-2xl border-2 border-b-4 font-black text-lg sm:text-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    passed
                      ? 'bg-emerald-500 border-emerald-700 text-white'
                      : isCurrent
                      ? 'bg-amber-400 border-amber-600 text-slate-950 animate-bounce shadow-md'
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}
                >
                  <span>{passed ? '🐾' : st}</span>
                </button>
              );
            })}

            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl">🏠🦴</span>
              <span className="text-xs font-extrabold text-slate-700">Home</span>
            </div>
          </div>
        </div>
      );
    }

    // 17. WORLD FLAGS EXPLORER & FIND THE FLAG
    if (game.id === 'world-flags' || game.id === 'find-flag') {
      const targetFlag = WORLD_FLAGS_DATA[seed % WORLD_FLAGS_DATA.length];

      if (game.id === 'world-flags') {
        const activeFlag = WORLD_FLAGS_DATA[selectedFlagIdx % WORLD_FLAGS_DATA.length];
        return (
          <div className="flex flex-col gap-4 py-1">
            <div className="rounded-3xl bg-[#FFFDF5] border-2 border-sky-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-14 sm:w-28 sm:h-18 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-sm flex items-center justify-center shrink-0 bg-white">
                  <CountryFlagSvg countryId={targetFlag.id} className="w-full h-full object-cover" title={targetFlag.countryVi} />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-sky-700 uppercase">
                    Màn {round}/{totalRounds} · Thử thách tìm lá cờ thế giới:
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-slate-900">
                    Bé hãy chạm vào lá cờ của <span className="text-sky-700 underline">{targetFlag.countryVi}</span> ({targetFlag.countryEn})
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    Đang xem: {activeFlag.countryVi} — {activeFlag.greetingOrFactVi}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  speakTeacherVoice(
                    [
                      { lang: 'vi', text: `Bé hãy tìm lá cờ của ${targetFlag.countryVi} nhé!` },
                      { lang: 'en', text: `${targetFlag.countryEn}!` },
                    ],
                    settings
                  )
                }
                className="min-h-[44px] px-4 py-2 rounded-2xl bg-sky-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Volume2 className="w-4 h-4" /> Nghe tên nước cần tìm
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {WORLD_FLAGS_DATA.map((fl, idx) => (
                <button
                  key={fl.id}
                  type="button"
                  onClick={(e) => {
                    setSelectedFlagIdx(idx);
                    if (fl.id === targetFlag.id) {
                      setSelectedRightId(fl.id);
                      triggerRoundWin(
                        `${fl.countryEn}!`,
                        `Đúng rồi! Đó là quốc kỳ của ${fl.countryVi}!`,
                        e
                      );
                    } else {
                      triggerGentleRetry(
                        `Đó là lá cờ của ${fl.countryVi}. Bé hãy tìm lá cờ của ${targetFlag.countryVi} nhé!`,
                        targetFlag.countryEn
                      );
                    }
                  }}
                  className={`rounded-2xl p-2.5 border-2 flex flex-col items-center gap-1.5 cursor-pointer transition ${
                    selectedRightId === fl.id
                      ? 'bg-emerald-50 border-emerald-500 scale-105 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className="w-14 h-9 sm:w-16 sm:h-10 rounded-lg overflow-hidden border border-slate-300/80 shadow-2xs">
                    <CountryFlagSvg countryId={fl.id} className="w-full h-full object-cover" title={fl.countryVi} />
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 truncate max-w-full">
                    {fl.countryVi}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 truncate max-w-full">
                    {fl.countryEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      }

      // find-flag quiz
      const flagChoices = [
        targetFlag,
        WORLD_FLAGS_DATA[(seed + 2) % WORLD_FLAGS_DATA.length],
        WORLD_FLAGS_DATA[(seed + 5) % WORLD_FLAGS_DATA.length],
        WORLD_FLAGS_DATA[(seed + 8) % WORLD_FLAGS_DATA.length],
      ].sort((a, b) => ((a.id.charCodeAt(0) + seed) % 5) - ((b.id.charCodeAt(0) + seed) % 5));

      return (
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="w-full max-w-md rounded-3xl bg-[#FFFDF5] border-2 border-sky-200 p-5 text-center">
            <span className="text-xs font-extrabold text-sky-700 uppercase">
              Màn {round}/{totalRounds} · 🗺️ Đố bé tìm đúng lá cờ quốc kỳ của:
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {targetFlag.countryEn} · {targetFlag.countryVi}
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              {targetFlag.greetingOrFactVi}
            </p>
          </div>

          <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-3">
            {flagChoices.map((fl) => (
              <button
                key={fl.id}
                type="button"
                onClick={(e) => {
                  if (fl.id === targetFlag.id) {
                    setSelectedRightId(fl.id);
                    triggerRoundWin(
                      `${fl.countryEn}!`,
                      `Đúng rồi! Quốc kỳ của ${fl.countryVi}!`,
                      e
                    );
                  } else {
                    triggerGentleRetry(
                      `Đó là cờ ${fl.countryVi}. Bé hãy tìm cờ ${targetFlag.countryVi} nhé!`,
                      targetFlag.countryEn
                    );
                  }
                }}
                className="rounded-3xl bg-white border-2 border-b-4 border-slate-200 hover:border-sky-400 p-4 sm:p-5 flex flex-col items-center gap-2.5 cursor-pointer active:scale-95"
              >
                <div className="w-20 h-13 sm:w-24 sm:h-15 rounded-xl overflow-hidden border-2 border-slate-300 shadow-2xs">
                  <CountryFlagSvg countryId={fl.id} className="w-full h-full object-cover" title={fl.countryVi} />
                </div>
                <span className="text-sm font-extrabold text-slate-900">{fl.countryVi}</span>
                <span className="text-xs font-semibold text-slate-500">{fl.countryEn}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 18. DEFAULT LISTENING & DISCOVERY GAMES (listen-animals, listen-fruits, sunny-farm, things-that-go)
    const pool: VocabularyItem[] =
      game.id === 'listen-fruits'
        ? fruitVocab
        : game.id === 'things-that-go'
        ? vehicleVocab
        : animalVocab;

    const targetItem = pool[seed % pool.length];
    const options = pickDistinctVocabOptions(pool, targetItem, 4, seed);

    return (
      <div className="flex flex-col items-center gap-5 py-2">
        <div className="w-full max-w-lg rounded-3xl bg-[#FFFDF5] border-2 border-amber-200 p-5 text-center flex flex-col items-center">
          <span className="text-xs font-extrabold text-amber-800 uppercase mb-1">
            Màn {round}/{totalRounds} · Bé lắng nghe tiếng Anh và chọn hình đúng nhé:
          </span>
          <button
            type="button"
            onClick={() => {
              playSoundEffect(targetItem.soundEffect, settings.volume);
              speakTeacherVoice(
                [
                  { lang: 'en', text: `${targetItem.en}! ${targetItem.phrase2To3y.en}!` },
                  { lang: 'vi', text: `Bé hãy tìm ${targetItem.vi.toLowerCase()} nhé!` },
                ],
                settings
              );
            }}
            className="mt-1 min-h-[54px] px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-base sm:text-lg flex items-center gap-2.5 shadow-sm cursor-pointer hover:brightness-105"
          >
            <Volume2 className="w-6 h-6" />
            <span>
              Nghe từ: &ldquo;{targetItem.en}&rdquo; ({targetItem.vi})
            </span>
          </button>
        </div>

        <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={(e) => {
                playSoundEffect(opt.soundEffect, settings.volume);
                if (opt.id === targetItem.id) {
                  setSelectedRightId(opt.id);
                  triggerRoundWin(
                    `${opt.en}! ${opt.sentence3To4y.en}`,
                    `Giỏi quá! Đúng là ${opt.vi.toLowerCase()} rồi!`,
                    e
                  );
                } else {
                  triggerGentleRetry(
                    `Đây là ${opt.vi.toLowerCase()}. Bé hãy tìm ${targetItem.vi.toLowerCase()} nhé!`,
                    targetItem.en
                  );
                }
              }}
              className="rounded-3xl bg-white border-2 border-b-4 border-slate-200 hover:border-amber-400 p-3 flex flex-col items-center justify-between gap-2 cursor-pointer active:scale-95 transition-all min-h-[160px] sm:min-h-[190px]"
            >
              <div className="w-full h-24 sm:h-32 flex items-center justify-center p-0.5">
                <GameCardVisual
                  itemId={opt.id}
                  emoji={opt.emoji}
                  en={opt.en}
                  vi={opt.vi}
                  size="fluid"
                />
              </div>
              <div className="text-center w-full">
                <div className="text-base font-extrabold text-slate-900 truncate max-w-full">{opt.en}</div>
                <div className="text-xs font-semibold text-slate-500 truncate max-w-full">{opt.vi}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Dedicated Full-Screen Free Drawing Canvas Mode (Matches User Reference Image image_5bd3e63b.png)
  if (game.id === 'free-drawing') {
    const STROKE_SIZES = [
      { size: 6, dotClass: 'w-2 h-2', label: 'Nét mảnh' },
      { size: 16, dotClass: 'w-3.5 h-3.5', label: 'Nét vừa' },
      { size: 28, dotClass: 'w-5 h-5', label: 'Nét to' },
    ];
    const minRequiredStrokeDistance = 60;
    const hasDrawnEnough = drawnDistance >= minRequiredStrokeDistance;

    return (
      <div className="fixed inset-0 z-50 bg-[#F4F9FD] flex flex-col p-2 sm:p-3.5 select-none overflow-hidden">
        {/* Row 1: Top Navigation Bar (Matches Reference Image 5bd3e63b.png) */}
        <div className="w-full flex items-center justify-between gap-2 shrink-0 pb-1">
          {/* Left: Rounded Blue Square Back Button */}
          <button
            type="button"
            onClick={() => {
              stopAllAudio();
              onBack();
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#E0F2FE] hover:bg-[#BAE6FD] border-2 border-[#38BDF8] text-[#0284C7] shadow-xs flex items-center justify-center cursor-pointer shrink-0 transition active:scale-95"
            title="Trở về sân chơi"
            aria-label="Trở về sân chơi"
          >
            <ArrowLeft className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Center: Title Pill [ 🖍️ Bé Tập Vẽ Tranh ] */}
          <div className="px-5 sm:px-7 py-2 rounded-full bg-white border-2 border-slate-200/90 shadow-xs flex items-center gap-2">
            <span className="text-xl">🖍️</span>
            <span className="font-black text-sm sm:text-base text-slate-800 font-display">
              Bé Tập Vẽ Tranh
            </span>
          </div>

          {/* Right: Flag Button + Speaker Button in Amber Square Borders */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                speakTeacherVoice(
                  [
                    { lang: 'vi', text: 'Bé thỏa sức sáng tạo bức tranh thật đẹp nhé!' },
                    { lang: 'en', text: 'Free drawing canvas! Let us draw!' },
                  ],
                  settings
                );
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border-2 border-[#F5B400] shadow-xs flex items-center justify-center text-xl cursor-pointer transition active:scale-95"
              title="Tiếng Việt"
              aria-label="Tiếng Việt"
            >
              <span>🇻🇳</span>
            </button>

            <button
              type="button"
              onClick={() => {
                speakTeacherVoice(
                  [
                    {
                      lang: 'vi',
                      text: 'Bé hãy chọn cọ vẽ hoặc bút chì, chọn màu sắc yêu thích và vẽ bức tranh thật đẹp lên bảng trắng nhé!',
                    },
                    { lang: 'en', text: 'Pick a tool and color to draw your picture!' },
                  ],
                  settings
                );
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border-2 border-[#F5B400] text-slate-700 shadow-xs flex items-center justify-center text-xl cursor-pointer transition active:scale-95"
              title="Cô giáo hướng dẫn"
              aria-label="Hướng dẫn âm thanh"
            >
              <Volume2 className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Row 2: Studio Toolbar On 1 Single Row (Bé có thể vuốt qua lại thao tác) */}
        <div className="w-full bg-white border-2 border-[#F5B400] rounded-2xl p-1.5 sm:p-2 shadow-xs flex items-center justify-between gap-2 overflow-x-auto shrink-0 my-1">
          {/* Tool Group (Brush, Pencil, Eraser) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setDrawingTool('brush')}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg cursor-pointer transition ${
                drawingTool === 'brush'
                  ? 'bg-[#F5B400] text-white shadow-xs scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Cọ vẽ"
              aria-label="Cọ vẽ"
            >
              🖌️
            </button>
            <button
              type="button"
              onClick={() => setDrawingTool('pencil')}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg cursor-pointer transition ${
                drawingTool === 'pencil'
                  ? 'bg-[#F5B400] text-white shadow-xs scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Bút chì"
              aria-label="Bút chì"
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={() => setDrawingTool('eraser')}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg cursor-pointer transition ${
                drawingTool === 'eraser'
                  ? 'bg-[#F5B400] text-white shadow-xs scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Cục tẩy"
              aria-label="Cục tẩy"
            >
              🧹
            </button>
          </div>

          {/* Stroke Size Pill Selector ( • ● ⬤ ) */}
          <div className="flex items-center bg-[#F1F5F9] px-3 py-1.5 rounded-xl gap-2.5 shrink-0">
            {STROKE_SIZES.map((st) => (
              <button
                key={st.size}
                type="button"
                onClick={() => setStrokeWidth(st.size)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center cursor-pointer transition ${
                  strokeWidth === st.size
                    ? 'bg-white shadow-2xs scale-110 ring-1 ring-slate-300'
                    : 'opacity-60 hover:opacity-100'
                }`}
                title={st.label}
                aria-label={st.label}
              >
                <span
                  className={`rounded-full ${st.dotClass}`}
                  style={{
                    backgroundColor: drawingTool === 'eraser' ? '#64748B' : brushColor,
                  }}
                />
              </button>
            ))}
          </div>

          {/* Action Buttons: Undo, Clear, Xong */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={undoCanvasStroke}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm cursor-pointer transition"
              title="Hoàn tác nét vừa vẽ"
              aria-label="Hoàn tác"
            >
              ↩️
            </button>
            <button
              type="button"
              onClick={clearCanvas}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-center text-sm cursor-pointer transition"
              title="Xóa trắng bảng vẽ"
              aria-label="Xóa bảng vẽ"
            >
              🗑️
            </button>
            <button
              type="button"
              onClick={(e) => {
                if (!hasDrawnEnough) {
                  triggerGentleRetry(
                    'Bé hãy dùng cọ vẽ bức tranh thật đẹp lên bảng trắng trước khi bấm Xong nhé!',
                    'Let us draw a picture!'
                  );
                  return;
                }
                triggerRoundWin(
                  'Wonderful drawing!',
                  'Bức tranh bé tự tay vẽ sáng tạo và đẹp tuyệt vời!',
                  e
                );
              }}
              className="min-h-[38px] sm:min-h-[42px] px-4 sm:px-6 py-1.5 rounded-xl bg-[#00B074] hover:bg-[#009B66] text-white font-black text-xs sm:text-sm flex items-center gap-1 cursor-pointer shadow-xs transition active:scale-95"
            >
              <span>✨</span>
              <span>Xong</span>
            </button>
          </div>
        </div>

        {/* Row 3: Maximized Drawing Canvas Area — Màn hình rộng hết mức có thể với viền vàng */}
        <div className="flex-1 w-full min-h-0 relative my-1.5 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            onPointerLeave={handleCanvasPointerUp}
            className="w-full h-full rounded-[24px] sm:rounded-[36px] border-[3.5px] border-[#F5B400] bg-white shadow-xs touch-none cursor-crosshair"
          />
        </div>

        {/* Row 4: Bottom Color Palette — 1 DÒNG DƯỚI CÙNG bé vuốt qua lại thoải mái */}
        <div className="w-full bg-white/95 border-2 border-slate-200/90 rounded-2xl py-2 px-3 shadow-xs flex items-center gap-3 overflow-x-auto shrink-0">
          {STUDIO_COLOR_PALETTE.map((c) => {
            const isSelected = brushColor === c.hex && drawingTool !== 'eraser';
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setBrushColor(c.hex);
                  if (drawingTool === 'eraser') {
                    setDrawingTool('brush');
                  }
                  speakTeacherVoice(
                    [
                      { lang: 'en', text: `${c.nameEn}!` },
                      { lang: 'vi', text: c.nameVi },
                    ],
                    settings
                  );
                }}
                style={{ backgroundColor: c.hex }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer shrink-0 transition-all ${
                  isSelected
                    ? 'scale-115 ring-4 ring-[#F5B400] border-2 border-white shadow-md'
                    : 'border-2 border-white hover:scale-105 shadow-2xs'
                }`}
                aria-label={`Chọn màu ${c.nameVi}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Dedicated Full-Screen Single-Screen Rainbow Xylophone Game
  if (game.id === 'rainbow-xylophone') {
    return (
      <div className="fixed inset-0 z-50 bg-[#FFFDF7] flex flex-col select-none overflow-hidden">
        <RainbowXylophoneGame
          settings={settings}
          onBack={onBack}
          onWin={(titleVi, titleEn) => {
            triggerRoundWin(
              `Wonderful melody! You played ${titleEn}!`,
              `Hoan hô bé ơi! Bé đã hoàn thành trọn vẹn bài hát "${titleVi}" rồi!`
            );
          }}
        />

        {/* Level Complete Fireworks Modal — shown after completing all 3 rounds */}
        {showVictoryModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md rounded-[32px] bg-white p-6 text-center shadow-2xl border-4 border-amber-300 space-y-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-300 mx-auto flex items-center justify-center text-6xl shadow-md border-4 border-white">
                🌈
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase">
                <Trophy className="w-4 h-4 text-amber-600" /> Chúc mừng bé qua đủ 3 màn · Lv.{currentLevel + 1}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{game.titleVi}</h2>
              <p className="text-sm font-semibold text-slate-600">
                Chúc mừng bé ơi! Bé đã vượt qua cả 3 màn chơi và nhận thêm <strong>+3 Ngôi Sao Vàng</strong>!
              </p>
              <div className="flex items-center justify-center gap-2 text-3xl text-amber-400">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowVictoryModal(false);
                    setRound(1);
                  }}
                  className="min-h-[42px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Chơi lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVictoryModal(false);
                    onBack();
                  }}
                  className="min-h-[42px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  Về màn hình chính
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dedicated Single-Screen Non-Scrolling Container for Step 1 Games
  const isCompactSingleScreenGame = [
    'magic-coloring',
    'alphabet-tracing',
    'character-puzzle',
    'dress-up-makeover',
  ].includes(game.id);

  if (isCompactSingleScreenGame) {
    return (
      <div className="w-full max-w-md mx-auto h-[calc(100dvh-92px)] max-h-[calc(100dvh-92px)] flex flex-col p-1 sm:p-2 select-none overflow-hidden justify-between">
        {renderGameBody()}
        {showVictoryModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md rounded-[32px] bg-white p-6 text-center shadow-2xl border-4 border-amber-300 space-y-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-300 mx-auto flex items-center justify-center text-6xl shadow-md border-4 border-white">
                {game.emoji}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase">
                <Trophy className="w-4 h-4 text-amber-600" /> Chúc mừng bé qua đủ 3 màn · Lv.{currentLevel + 1}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{game.titleVi}</h2>
              <p className="text-sm font-semibold text-slate-600">
                Chúc mừng bé ơi! Bé đã vượt qua cả 3 màn chơi và nhận thêm <strong>+3 Ngôi Sao Vàng</strong>!
              </p>
              <div className="flex items-center justify-center gap-2 text-3xl text-amber-400">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    fireFireworksCelebration();
                    playCelebrationChime(settings.volume);
                  }}
                  className="w-full min-h-[46px] rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4" /> 🎆 Bắn Pháo Hoa Khen Thưởng!
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowVictoryModal(false);
                    setRound(1);
                    onSelectNextGame(nextGame);
                  }}
                  className="w-full min-h-[46px] rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Chơi tiếp: {nextGame.titleVi}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowVictoryModal(false);
                      setRound(1);
                    }}
                    className="min-h-[42px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Chơi lại
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowVictoryModal(false);
                      onBack();
                    }}
                    className="min-h-[42px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Về màn hình chính
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 pb-6 select-none">
      {/* Top Game Navigation Header */}
      <div className="rounded-3xl bg-white border border-slate-200/90 px-4 py-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => {
              stopAllAudio();
              onBack();
            }}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Quay lại sân chơi"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>

          {onOpenActivityHistory && (
            <button
              type="button"
              onClick={onOpenActivityHistory}
              className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
              title="Lịch sử hoạt động của bé"
            >
              <BarChart3 className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Lịch sử hoạt động</span>
              <span className="sm:hidden">Lịch sử</span>
            </button>
          )}

          <div className="w-11 h-11 rounded-2xl bg-[#FFFDF5] border border-amber-200 flex items-center justify-center text-2xl shrink-0">
            {game.emoji}
          </div>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 truncate">
              {game.titleVi}
            </h1>
            <div className="text-xs font-bold text-slate-500 truncate">
              {game.titleEn} · ⭐ Lv.{currentLevel}
            </div>
          </div>
        </div>

        {/* Round Progress Dots & Audio Guide Trigger */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl"
            aria-label={`Tiến độ màn ${round} trên ${totalRounds}`}
          >
            {[1, 2, 3].map((r) => (
              <span
                key={r}
                className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                  r < round
                    ? 'bg-emerald-500 text-white'
                    : r === round
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {r < round ? '✓' : r}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              speakTeacherVoice(
                [
                  { lang: 'vi', text: feedbackVi },
                  { lang: 'en', text: game.titleEn },
                ],
                settings
              )
            }
            className="min-h-[42px] px-3.5 py-1.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Cô hướng dẫn</span>
          </button>
        </div>
      </div>

      {/* Teacher Voice Prompt Strip */}
      <div className="rounded-2xl bg-white/90 border border-amber-200/80 px-4 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">👩‍🏫</span>
          <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{feedbackVi}</p>
        </div>
        <span className="text-[11px] font-extrabold text-amber-700 shrink-0 tabular-nums">
          Màn {round}/{totalRounds}
        </span>
      </div>

      {/* Main Interactive Game Arena */}
      <div className="rounded-[28px] bg-white border border-slate-200/80 p-4 sm:p-6 shadow-sm">
        {renderGameBody()}
      </div>

      {/* Level Complete Fireworks Modal — ONLY shown after completing all 3 rounds! */}
      {showVictoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 text-center shadow-2xl border-4 border-amber-300 space-y-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-300 mx-auto flex items-center justify-center text-6xl shadow-md border-4 border-white">
              {game.emoji}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase">
              <Trophy className="w-4 h-4 text-amber-600" /> Chúc mừng bé qua đủ 3 màn · Lv.{currentLevel + 1}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">{game.titleVi}</h2>
            <p className="text-sm font-semibold text-slate-600">
              Chúc mừng bé ơi! Bé đã vượt qua cả 3 màn chơi và nhận thêm <strong>+3 Ngôi Sao Vàng</strong>!
            </p>
            <div className="flex items-center justify-center gap-2 text-3xl text-amber-400">
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  fireFireworksCelebration();
                  playCelebrationChime(settings.volume);
                }}
                className="w-full min-h-[46px] rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> 🎆 Bắn Pháo Hoa Khen Thưởng!
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowVictoryModal(false);
                  setRound(1);
                  onSelectNextGame(nextGame);
                }}
                className="w-full min-h-[46px] rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Chơi tiếp: {nextGame.titleVi}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowVictoryModal(false);
                    setRound(1);
                  }}
                  className="min-h-[42px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Chơi lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVictoryModal(false);
                    onBack();
                  }}
                  className="min-h-[42px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  Về màn hình chính
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
