import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  Eye,
  RefreshCw,
  Home,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import type { ParentSettings } from '../types/learning';
import {
  STUDIO_COLOR_PALETTE,
  COLORING_BOOK_TEMPLATES,
} from '../data/creativeArtData';
import COLORING_REGIONS_DATA from '../data/coloringRegions.json';
import { playSoundEffect, speakTeacherVoice } from '../utils/audioEngine';
import { fireFireworksCelebration } from '../utils/confetti';

interface MagicColoringGameProps {
  settings: ParentSettings;
  onBack: () => void;
  onWin?: () => void;
  onGentleRetry?: (msgVi: string, msgEn: string) => void;
}

interface PrecomputedRegion {
  regionId: number;
  x: number;
  y: number;
  inscribedRadius: number;
  badgeRadius: number;
  fontSize: number;
  colorNumber: number;
  colorNameVi: string;
  colorHex: string;
  isEye: boolean;
  pixelCount: number;
}

interface PrecomputedTemplateData {
  templateId: string;
  file: string;
  nameVi: string;
  totalColorableRegions: number;
  maxBlackRadius: number;
  measuredMaxBlackRadiusPx: number;
  overlappingPairs: number;
  regions: PrecomputedRegion[];
}

const TYPED_REGIONS_DATA = COLORING_REGIONS_DATA as Record<string, PrecomputedTemplateData>;

export const MagicColoringGame: React.FC<MagicColoringGameProps> = ({
  settings,
  onBack,
  onWin,
  onGentleRetry,
}) => {
  const [templateIdx, setTemplateIdx] = useState<number>(0);
  const [coloringMode, setColoringMode] = useState<'free' | 'number'>('free');
  const [brushColor, setBrushColor] = useState<string>(STUDIO_COLOR_PALETTE[0].hex);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showSampleHint, setShowSampleHint] = useState<boolean>(false);

  // Auto-completion & Round Tracking (3 drawings per round)
  const [completedCountInRound, setCompletedCountInRound] = useState<number>(0);
  const [coloredRegionsSet, setColoredRegionsSet] = useState<Set<number>>(new Set());
  const [showBriefCongrats, setShowBriefCongrats] = useState<boolean>(false);
  const [showRoundCompleteModal, setShowRoundCompleteModal] = useState<boolean>(false);
  const hasTriggeredCompletionRef = useRef<boolean>(false);

  // Locked background feedback
  const [showBgLockedNotice, setShowBgLockedNotice] = useState<boolean>(false);
  const bgNoticeTimeoutRef = useRef<number | null>(null);

  // Shaking badge state for wrong number selection in "Theo Số" mode
  const [shakingBadgeId, setShakingBadgeId] = useState<number | null>(null);

  // Canvas & background mask ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgMaskRef = useRef<Uint8Array | null>(null);

  // Undo history stack
  const undoStackRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  // Number mode badges completed tracking
  const [completedBadges, setCompletedBadges] = useState<Record<number, boolean>>({});

  const activeTemplate = COLORING_BOOK_TEMPLATES[templateIdx % COLORING_BOOK_TEMPLATES.length];
  const selectedColorItem =
    STUDIO_COLOR_PALETTE.find((c) => c.hex === brushColor) || STUDIO_COLOR_PALETTE[0];

  // Resolve precomputed template data from coloringRegions.json
  const activeTemplateData: PrecomputedTemplateData = useMemo(() => {
    const byId = Object.values(TYPED_REGIONS_DATA).find(
      (d) => d.templateId === activeTemplate.id
    );
    if (byId) return byId;

    const fallbackKey = Object.keys(TYPED_REGIONS_DATA)[0];
    return TYPED_REGIONS_DATA[fallbackKey];
  }, [activeTemplate.id]);

  const totalColorableRegions = activeTemplateData.totalColorableRegions;
  const regionsList = activeTemplateData.regions;
  const coloredCount = coloredRegionsSet.size;

  // Load image onto canvas and compute background mask (BFS from 4 outer edges)
  const drawColoringImage = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 512, 512);

    const padding = 16;
    const availW = 512 - padding * 2;
    const availH = 512 - padding * 2;
    const scale = Math.min(availW / img.width, availH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = (512 - drawW) / 2;
    const drawY = (512 - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Compute Background Mask: BFS from all 4 boundaries on the canvas
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    const bgMask = new Uint8Array(512 * 512);
    const isLine = new Uint8Array(512 * 512);

    for (let i = 0; i < 512 * 512; i++) {
      const idx = i * 4;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < 95) isLine[i] = 1;
    }

    const bgQueue: number[] = [];
    for (let x = 0; x < 512; x++) {
      if (!isLine[x]) {
        bgMask[x] = 1;
        bgQueue.push(x);
      }
      const b = 511 * 512 + x;
      if (!isLine[b] && !bgMask[b]) {
        bgMask[b] = 1;
        bgQueue.push(b);
      }
    }
    for (let y = 0; y < 512; y++) {
      const l = y * 512;
      if (!isLine[l] && !bgMask[l]) {
        bgMask[l] = 1;
        bgQueue.push(l);
      }
      const r = y * 512 + 511;
      if (!isLine[r] && !bgMask[r]) {
        bgMask[r] = 1;
        bgQueue.push(r);
      }
    }

    while (bgQueue.length > 0) {
      const curr = bgQueue.pop()!;
      const cx = curr % 512;
      const cy = Math.floor(curr / 512);
      const neighbors = [
        cy > 0 ? curr - 512 : -1,
        cy < 511 ? curr + 512 : -1,
        cx > 0 ? curr - 1 : -1,
        cx < 511 ? curr + 1 : -1,
      ];
      for (const ni of neighbors) {
        if (ni >= 0 && !isLine[ni] && !bgMask[ni]) {
          bgMask[ni] = 1;
          bgQueue.push(ni);
        }
      }
    }

    bgMaskRef.current = bgMask;
    undoStackRef.current = [ctx.getImageData(0, 0, 512, 512)];
    setCanUndo(false);
    setCompletedBadges({});
    setColoredRegionsSet(new Set());
    hasTriggeredCompletionRef.current = false;
  }, []);

  // Load active template image
  useEffect(() => {
    if (activeTemplate.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => drawColoringImage(img);
      img.src = activeTemplate.imageUrl;
    }
  }, [activeTemplate, drawColoringImage]);

  // Check Auto-completion of current drawing
  const checkAutoCompletion = useCallback(() => {
    if (hasTriggeredCompletionRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Check colored progress
    const isCompleted =
      totalColorableRegions > 0 && coloredRegionsSet.size >= totalColorableRegions;

    if (isCompleted) {
      hasTriggeredCompletionRef.current = true;
      playSoundEffect('sparkle', settings.volume);
      fireFireworksCelebration();

      setShowBriefCongrats(true);
      speakTeacherVoice(
        [
          { lang: 'vi', text: 'Hoan hô bé! Bé đã tô màu bức tranh xuất sắc rồi!' },
          { lang: 'en', text: 'Splendid! You colored the whole picture!' },
        ],
        settings
      );

      setTimeout(() => {
        setShowBriefCongrats(false);
        const nextCount = completedCountInRound + 1;
        setCompletedCountInRound(nextCount);

        if (nextCount >= 3) {
          setShowRoundCompleteModal(true);
          if (onWin) onWin();
        } else {
          setTemplateIdx((prev) => (prev + 1) % COLORING_BOOK_TEMPLATES.length);
        }
      }, 2200);
    }
  }, [
    totalColorableRegions,
    coloredRegionsSet,
    completedCountInRound,
    settings,
    onWin,
  ]);

  // Find nearest colorable region to a click
  const findRegionAtPoint = useCallback(
    (startX: number, startY: number): PrecomputedRegion | null => {
      let closest: PrecomputedRegion | null = null;
      let minDist = 999999;
      for (const reg of regionsList) {
        const dx = reg.x - startX;
        const dy = reg.y - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          closest = reg;
        }
      }
      return closest;
    },
    [regionsList]
  );

  // Scanline Flood Fill on 512x512 Canvas
  const executeFill = useCallback(
    (startX: number, startY: number, targetRegionOverride?: PrecomputedRegion) => {
      if (showRoundCompleteModal || showBriefCongrats) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      if (startX < 0 || startX >= 512 || startY < 0 || startY >= 512) return;

      const clickIdx = startY * 512 + startX;

      // Requirement 2: Vùng nền (trắng nối với mép ảnh) bị khóa ở cả hai chế độ:
      // chạm không đổ màu, không đánh số, không tính tiến độ.
      if (bgMaskRef.current && bgMaskRef.current[clickIdx] === 1) {
        playSoundEffect('pop', settings.volume * 0.4);
        setShowBgLockedNotice(true);
        if (bgNoticeTimeoutRef.current) clearTimeout(bgNoticeTimeoutRef.current);
        bgNoticeTimeoutRef.current = window.setTimeout(() => {
          setShowBgLockedNotice(false);
        }, 1500);
        return;
      }

      const imgData = ctx.getImageData(0, 0, 512, 512);
      const data = imgData.data;
      const pixelIdx = clickIdx * 4;
      const startR = data[pixelIdx];
      const startG = data[pixelIdx + 1];
      const startB = data[pixelIdx + 2];

      const startLum = 0.299 * startR + 0.587 * startG + 0.114 * startB;
      if (startLum < 90) return; // Do not fill black outline

      const cleanHex = brushColor.replace('#', '');
      const num = parseInt(cleanHex, 16);
      const fillR = (num >> 16) & 255;
      const fillG = (num >> 8) & 255;
      const fillB = num & 255;

      // Target region identification
      const matchedRegion = targetRegionOverride || findRegionAtPoint(startX, startY);

      // Requirement 3 in Number Mode:
      // đổ sai số thì rung nhẹ và nhắc
      if (coloringMode === 'number' && matchedRegion) {
        if (matchedRegion.colorNumber !== selectedColorItem.number) {
          // Trigger gentle vibration
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate(50);
            } catch {
              // Ignore if vibration is restricted
            }
          }
          setShakingBadgeId(matchedRegion.regionId);
          setTimeout(() => setShakingBadgeId(null), 500);
          playSoundEffect('pop', settings.volume * 0.5);

          const expectedColor =
            STUDIO_COLOR_PALETTE.find((c) => c.number === matchedRegion.colorNumber) ||
            STUDIO_COLOR_PALETTE[0];
          const colorNameClean = expectedColor.nameVi.replace('Màu ', '');

          if (onGentleRetry) {
            onGentleRetry(
              `Vùng này mang số ${matchedRegion.colorNumber} (${colorNameClean}). Bé hãy chọn màu số ${matchedRegion.colorNumber} nhé!`,
              expectedColor.nameEn
            );
          } else {
            speakTeacherVoice(
              [
                {
                  lang: 'vi',
                  text: `Vùng này là số ${matchedRegion.colorNumber} (${colorNameClean}). Bé chọn màu số ${matchedRegion.colorNumber} nhé!`,
                },
              ],
              settings
            );
          }
          return; // Reject wrong color fill
        }
      }

      if (
        Math.abs(startR - fillR) < 15 &&
        Math.abs(startG - fillG) < 15 &&
        Math.abs(startB - fillB) < 15
      ) {
        return;
      }

      const matchStartColor = (idx: number) => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < 90) return false;
        return (
          Math.abs(r - startR) <= 32 &&
          Math.abs(g - startG) <= 32 &&
          Math.abs(b - startB) <= 32
        );
      };

      // Save undo step
      if (undoStackRef.current.length >= 15) {
        undoStackRef.current.shift();
      }
      undoStackRef.current.push(ctx.getImageData(0, 0, 512, 512));
      setCanUndo(true);

      // BFS Flood Fill
      const visited = new Uint8Array(512 * 512);
      const queue = [clickIdx];
      visited[clickIdx] = 1;

      while (queue.length > 0) {
        const curr = queue.pop()!;
        const idx = curr * 4;
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = 255;

        const cx = curr % 512;
        const cy = Math.floor(curr / 512);

        if (cy > 0) {
          const up = (cy - 1) * 512 + cx;
          if (!visited[up] && matchStartColor(up * 4)) {
            visited[up] = 1;
            queue.push(up);
          }
        }
        if (cy < 511) {
          const down = (cy + 1) * 512 + cx;
          if (!visited[down] && matchStartColor(down * 4)) {
            visited[down] = 1;
            queue.push(down);
          }
        }
        if (cx > 0) {
          const left = cy * 512 + (cx - 1);
          if (!visited[left] && matchStartColor(left * 4)) {
            visited[left] = 1;
            queue.push(left);
          }
        }
        if (cx < 511) {
          const right = cy * 512 + (cx + 1);
          if (!visited[right] && matchStartColor(right * 4)) {
            visited[right] = 1;
            queue.push(right);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      playSoundEffect('pop', settings.volume);

      if (matchedRegion) {
        setCompletedBadges((prev) => ({ ...prev, [matchedRegion.regionId]: true }));
        setColoredRegionsSet((prev) => new Set([...prev, matchedRegion.regionId]));
      }

      setTimeout(() => {
        checkAutoCompletion();
      }, 150);
    },
    [
      brushColor,
      checkAutoCompletion,
      coloringMode,
      findRegionAtPoint,
      onGentleRetry,
      selectedColorItem,
      settings,
      showBriefCongrats,
      showRoundCompleteModal,
    ]
  );

  const handleCanvasClick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 512 / rect.width;
    const scaleY = 512 / rect.height;
    const startX = Math.floor((e.clientX - rect.left) * scaleX);
    const startY = Math.floor((e.clientY - rect.top) * scaleY);

    executeFill(startX, startY);
  };

  const handleUndo = () => {
    if (undoStackRef.current.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    undoStackRef.current.pop();
    const prev = undoStackRef.current[undoStackRef.current.length - 1];
    if (prev) {
      ctx.putImageData(prev, 0, 0);
      playSoundEffect('pop', settings.volume);
    }
    setCanUndo(undoStackRef.current.length > 1);
  };

  const handleReset = () => {
    if (undoStackRef.current.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const initial = undoStackRef.current[0];
    if (initial) {
      ctx.putImageData(initial, 0, 0);
      undoStackRef.current = [initial];
      setCanUndo(false);
      setCompletedBadges({});
      setColoredRegionsSet(new Set());
      hasTriggeredCompletionRef.current = false;
      playSoundEffect('pop', settings.volume);
    }
  };

  const progressPercent = Math.min(
    100,
    Math.round((coloredCount / Math.max(1, totalColorableRegions)) * 100)
  );

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col justify-between items-center bg-gradient-to-b from-amber-50/70 via-pink-50/30 to-sky-50/70 p-1 sm:p-2 select-none overflow-hidden font-sans">
      <style>{`
        @keyframes subtleShake {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          20% { transform: translate(-54%, -50%) rotate(-4deg); }
          40% { transform: translate(-46%, -50%) rotate(4deg); }
          60% { transform: translate(-53%, -50%) rotate(-3deg); }
          80% { transform: translate(-47%, -50%) rotate(3deg); }
        }
        .animate-shake-badge {
          animation: subtleShake 0.45s ease-in-out;
        }
      `}</style>

      {/* 1. Header Toolbar */}
      <div className="w-full max-w-md h-11 sm:h-12 shrink-0 rounded-2xl border-2 border-amber-400 bg-white/95 backdrop-blur-md px-2.5 shadow-2xs flex items-center justify-between gap-1.5">
        {/* Left: Back, Template selector, Mode toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Quay lại sân chơi"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95 text-base"
            title="Chọn tranh tô màu (20 tranh)"
            aria-label="Chọn tranh"
          >
            🖼️
          </button>

          {/* Mode Switcher: Tự Do (🎨) vs Theo Số (🔢) */}
          <div className="flex items-center bg-amber-100/90 p-0.5 rounded-xl border border-amber-300 shrink-0">
            <button
              type="button"
              onClick={() => {
                setColoringMode('free');
                playSoundEffect('pop', settings.volume);
              }}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center cursor-pointer transition ${
                coloringMode === 'free'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-amber-950 hover:bg-amber-200/60'
              }`}
              title="Chế độ Tự do"
              aria-label="Tự do"
            >
              🎨
            </button>
            <button
              type="button"
              onClick={() => {
                setColoringMode('number');
                playSoundEffect('pop', settings.volume);
              }}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center cursor-pointer transition ${
                coloringMode === 'number'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-amber-950 hover:bg-amber-200/60'
              }`}
              title="Chế độ Theo số"
              aria-label="Theo số"
            >
              🔢
            </button>
          </div>
        </div>

        {/* Right: Hint (Eye), Undo, Reset, Audio Guide */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setShowSampleHint(!showSampleHint);
              playSoundEffect('pop', settings.volume);
            }}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base cursor-pointer transition ${
              showSampleHint
                ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-2xs scale-105'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Xem mẫu gợi ý"
            aria-label="Hình mẫu"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30 border border-slate-200 text-slate-700 text-base flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Hoàn tác nét vừa tô"
            aria-label="Hoàn tác"
          >
            ↩️
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-base flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Tô lại từ đầu"
            aria-label="Tô lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              speakTeacherVoice(
                [
                  {
                    lang: 'vi',
                    text: `Bé tô màu tranh ${activeTemplate.titleVi} nhé!`,
                  },
                ],
                settings
              )
            }
            className="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95"
            title="Nghe hướng dẫn"
            aria-label="Nghe hướng dẫn"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Coloring Canvas */}
      <div className="relative flex-1 min-h-0 w-full max-w-md aspect-square rounded-[24px] border-4 border-amber-400 bg-white shadow-md p-1 sm:p-2 flex items-center justify-center overflow-hidden">
        {/* Sample Reference Thumbnail when Eye is Active */}
        {showSampleHint && (
          <div className="absolute top-2 right-2 z-20 bg-white/95 backdrop-blur-xs border-2 border-amber-300 rounded-xl p-1.5 shadow-md flex flex-col items-center select-none animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
            {activeTemplate.imageUrl && (
              <img
                src={activeTemplate.imageUrl}
                alt="Hình mẫu"
                className="w-14 h-14 rounded-lg object-contain bg-amber-50/50"
              />
            )}
            <span className="text-[10px] font-black text-amber-900 mt-0.5">Hình Mẫu</span>
          </div>
        )}

        {/* Locked Background Toast / Notice */}
        {showBgLockedNotice && (
          <div className="absolute top-3 inset-x-4 z-20 flex items-center justify-center pointer-events-none animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="bg-slate-900/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/20">
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Vùng nền đã khóa, bé chạm vào hình để tô nhé!</span>
            </div>
          </div>
        )}

        {/* HTML Canvas with Flood Fill */}
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          onPointerDown={handleCanvasClick}
          className="w-full h-full max-h-full aspect-square object-contain touch-none cursor-crosshair rounded-[20px] select-none"
        />

        {/* Number Badges Overlay in "Theo Số" Mode: PRECOMPUTED & INSCRIBED */}
        {coloringMode === 'number' && (
          <div className="absolute inset-0 pointer-events-none p-1 sm:p-2 flex items-center justify-center">
            <div className="relative w-full h-full aspect-square">
              {regionsList.map((region) => {
                const isCompleted = completedBadges[region.regionId];
                if (isCompleted) return null;

                const isSelectedNumber = selectedColorItem.number === region.colorNumber;
                const isShaking = shakingBadgeId === region.regionId;
                const leftPercent = (region.x / 512) * 100;
                const topPercent = (region.y / 512) * 100;
                const badgeDiameter = Math.max(16, region.badgeRadius * 2);

                return (
                  <div
                    key={`badge-${region.regionId}`}
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      width: `${badgeDiameter}px`,
                      height: `${badgeDiameter}px`,
                      fontSize: `${region.fontSize}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute pointer-events-auto cursor-pointer rounded-full flex items-center justify-center font-black transition-all ${
                      isShaking
                        ? 'animate-shake-badge bg-rose-500 text-white shadow-lg ring-3 ring-rose-300 z-30'
                        : isSelectedNumber
                        ? 'animate-pulse bg-amber-400 text-amber-950 ring-3 ring-amber-500 shadow-md scale-110 z-20'
                        : 'bg-white text-slate-900 border-2 border-slate-700 shadow-2xs hover:scale-105 z-10'
                    }`}
                    onClick={() => {
                      if (selectedColorItem.number !== region.colorNumber) {
                        if (typeof navigator !== 'undefined' && navigator.vibrate) {
                          try {
                            navigator.vibrate(50);
                          } catch {
                            // Ignore
                          }
                        }
                        setShakingBadgeId(region.regionId);
                        setTimeout(() => setShakingBadgeId(null), 500);
                        playSoundEffect('pop', settings.volume * 0.5);

                        const expectedColor =
                          STUDIO_COLOR_PALETTE.find((c) => c.number === region.colorNumber) ||
                          STUDIO_COLOR_PALETTE[0];
                        const colorNameClean = expectedColor.nameVi.replace('Màu ', '');

                        if (onGentleRetry) {
                          onGentleRetry(
                            `Vùng này mang số ${region.colorNumber} (${colorNameClean}). Bé hãy chọn màu số ${region.colorNumber} ở thanh màu nhé!`,
                            expectedColor.nameEn
                          );
                        } else {
                          speakTeacherVoice(
                            [
                              {
                                lang: 'vi',
                                text: `Vùng này là số ${region.colorNumber} (${colorNameClean}). Bé chọn màu số ${region.colorNumber} nhé!`,
                              },
                            ],
                            settings
                          );
                        }
                      } else {
                        // Matching color: directly fill the region
                        executeFill(region.x, region.y, region);
                      }
                    }}
                  >
                    {region.colorNumber}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Brief Congratulations 3D Chibi Modal */}
        {showBriefCongrats && (
          <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border-4 border-amber-400 p-5 shadow-2xl flex flex-col items-center text-center space-y-2 animate-in zoom-in-95 duration-200 max-w-xs">
              <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-sm animate-bounce">
                🌟
              </div>
              <h3 className="text-base font-black text-amber-950">Tuyệt Vời Quá Bé Ơi!</h3>
              <p className="text-xs text-slate-600">Tranh bé tô thật rực rỡ và xinh xắn!</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Studio Color Palette & Progress Section */}
      <div className="w-full max-w-md shrink-0 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-400 p-1.5 sm:p-2 shadow-2xs space-y-1.5">
        {/* Requirement 4: Progress Bar & Text: “Màu 1: Đỏ” bên trái, “Đã tô 2/22 vùng” bên phải kèm thanh tiến độ mảnh */}
        <div className="flex items-center justify-between px-1.5 py-0.5">
          {/* Left: “Màu 1: Đỏ” */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
              style={{ backgroundColor: selectedColorItem.hex }}
            />
            <span className="text-xs font-black text-slate-800">
              Màu {selectedColorItem.number}: {selectedColorItem.nameVi.replace('Màu ', '')}
            </span>
          </div>

          {/* Right: “Đã tô 2/22 vùng” kèm thanh tiến độ mảnh */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              Đã tô {coloredCount}/{totalColorableRegions} vùng
            </span>
            <div className="w-20 sm:w-28 h-2 rounded-full bg-slate-200 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 12 Color Buttons */}
        <div className="grid grid-cols-6 gap-1.5">
          {STUDIO_COLOR_PALETTE.map((c) => {
            const isSelected = brushColor === c.hex;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setBrushColor(c.hex);
                  playSoundEffect('pop', settings.volume);
                  speakTeacherVoice([{ lang: 'vi', text: c.nameVi }], settings);
                }}
                style={{ backgroundColor: c.hex }}
                className={`relative h-8 sm:h-9 rounded-xl flex items-center justify-center cursor-pointer transition active:scale-95 ${
                  isSelected
                    ? 'ring-3 ring-amber-500 scale-105 shadow-md z-10'
                    : 'border border-black/15 hover:scale-102'
                }`}
                title={`${c.nameVi} (${c.nameEn})`}
                aria-label={c.nameVi}
              >
                {coloringMode === 'number' && (
                  <span
                    className={`font-black text-xs px-1.5 py-0.5 rounded-full ${
                      c.hex === '#1E293B' || c.hex === '#854D0E' || c.hex === '#8B5CF6'
                        ? 'text-white'
                        : 'text-slate-900 bg-white/80'
                    }`}
                  >
                    {c.number}
                  </span>
                )}
                {isSelected && coloringMode === 'free' && (
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      c.hex === '#1E293B' || c.hex === '#854D0E' || c.hex === '#8B5CF6'
                        ? 'text-white'
                        : 'text-slate-900'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Complete 3 Drawings Modal (Chơi lại 🔄 vs Về màn hình chính 🏠) */}
      {showRoundCompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200 select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-5 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-sm">
              🏆
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-950">
                Bé Đã Hoàn Thành 3 Bức Tranh!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Bé muốn tiếp tục tô thêm tranh mới hay quay về trang chủ?
              </p>
            </div>

            <div className="flex flex-col gap-2.5 w-full pt-1">
              <button
                type="button"
                onClick={() => {
                  setCompletedCountInRound(0);
                  setShowRoundCompleteModal(false);
                  setTemplateIdx((prev) => (prev + 1) % COLORING_BOOK_TEMPLATES.length);
                  playSoundEffect('pop', settings.volume);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-95"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Chơi lại</span>
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 rounded-2xl border-2 border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <Home className="w-5 h-5" />
                <span>Về màn hình chính</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Template Picker Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-4 flex flex-col items-center space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between w-full border-b border-amber-100 pb-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-black text-sm">
                <span>🖼️</span>
                <span>Chọn Tranh Tô Màu Cho Bé</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full">
              {COLORING_BOOK_TEMPLATES.map((tmpl, idx) => {
                const isCurrent = templateIdx === idx;
                return (
                  <button
                    key={`${tmpl.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      setTemplateIdx(idx);
                      setShowTemplateModal(false);
                      playSoundEffect('pop', settings.volume);
                      speakTeacherVoice([{ lang: 'vi', text: tmpl.titleVi }], settings);
                    }}
                    className={`p-2 rounded-2xl border-2 flex flex-col items-center gap-1 cursor-pointer transition text-center ${
                      isCurrent
                        ? 'border-amber-500 bg-amber-50 shadow-md scale-105'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {tmpl.imageUrl ? (
                      <img
                        src={tmpl.imageUrl}
                        alt={tmpl.titleVi}
                        className="w-14 h-14 rounded-lg object-contain bg-amber-50/40 p-0.5 border border-slate-100"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-amber-100 flex items-center justify-center font-black text-amber-800">
                        {idx + 1}
                      </div>
                    )}
                    <span className="text-[11px] font-bold text-slate-700 line-clamp-1">
                      {tmpl.titleVi}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
