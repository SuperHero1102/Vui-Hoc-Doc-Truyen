import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Volume2,
  Eye,
  RefreshCw,
  Home,
  CheckCircle2,
} from 'lucide-react';
import type { ParentSettings } from '../types/learning';
import {
  STUDIO_COLOR_PALETTE,
  COLORING_BOOK_TEMPLATES,
  type ColoringTemplate,
} from '../data/creativeArtData';
import { playSoundEffect, speakTeacherVoice } from '../utils/audioEngine';
import { fireFireworksCelebration } from '../utils/confetti';

interface MagicColoringGameProps {
  settings: ParentSettings;
  onBack: () => void;
  onWin?: () => void;
  onGentleRetry?: (msgVi: string, msgEn: string) => void;
}

interface RegionCentroid {
  id: string;
  x: number;
  y: number;
  colorNumber: number;
}

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
  const [coloredRegionsSet, setColoredRegionsSet] = useState<Set<string>>(new Set());
  const [showBriefCongrats, setShowBriefCongrats] = useState<boolean>(false);
  const [showRoundCompleteModal, setShowRoundCompleteModal] = useState<boolean>(false);
  const hasTriggeredCompletionRef = useRef<boolean>(false);

  // Dynamic regions for number mode
  const [dynamicRegions, setDynamicRegions] = useState<RegionCentroid[]>([]);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Undo history stack
  const undoStackRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  // Number mode badges completed tracking
  const [completedBadges, setCompletedBadges] = useState<Record<string, boolean>>({});

  const activeTemplate = COLORING_BOOK_TEMPLATES[templateIdx % COLORING_BOOK_TEMPLATES.length];
  const selectedColorItem =
    STUDIO_COLOR_PALETTE.find((c) => c.hex === brushColor) || STUDIO_COLOR_PALETTE[0];

  // 1. Distance Transform & Hollow Thick Black Areas (Thickness > 10px -> Hollow Outline with White Interior)
  const hollowThickBlackAreas = useCallback((ctx: CanvasRenderingContext2D, w = 512, h = 512) => {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const black = new Uint8Array(w * h);

    for (let i = 0; i < w * h; i++) {
      const idx = i * 4;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < 115) {
        black[i] = 1;
      }
    }

    // Chamfer 3-4 distance transform
    const INF = 999999;
    const dist = new Int32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      dist[i] = black[i] === 0 ? 0 : INF;
    }

    // Forward pass
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        if (dist[idx] > 0) {
          let d = dist[idx];
          if (x > 0) d = Math.min(d, dist[idx - 1] + 3);
          if (y > 0) {
            d = Math.min(d, dist[idx - w] + 3);
            if (x > 0) d = Math.min(d, dist[idx - w - 1] + 4);
            if (x < w - 1) d = Math.min(d, dist[idx - w + 1] + 4);
          }
          dist[idx] = d;
        }
      }
    }

    // Backward pass
    for (let y = h - 1; y >= 0; y--) {
      for (let x = w - 1; x >= 0; x--) {
        const idx = y * w + x;
        if (dist[idx] > 0) {
          let d = dist[idx];
          if (x < w - 1) d = Math.min(d, dist[idx + 1] + 3);
          if (y < h - 1) {
            d = Math.min(d, dist[idx + w] + 3);
            if (x > 0) d = Math.min(d, dist[idx + w - 1] + 4);
            if (x < w - 1) d = Math.min(d, dist[idx + w + 1] + 4);
          }
          dist[idx] = d;
        }
      }
    }

    // Any black pixel with dist > 14 (radius > 4.6px, thickness > 9.2px) becomes pure white interior
    for (let i = 0; i < w * h; i++) {
      if (black[i] === 1 && dist[i] > 14) {
        const idx = i * 4;
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, []);

  // 2. Simplify Coloring Page: Close leaks & find colorable regions
  const simplifyColoringPage = useCallback(
    (canvas: HTMLCanvasElement) => {
      const w = 512;
      const h = 512;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return { success: false, blackRatio: 0, regionCount: 0, centroids: [] };

      // Hollow thick areas first
      hollowThickBlackAreas(ctx, w, h);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const isLine = new Uint8Array(w * h);
      let blackPixelCount = 0;

      for (let i = 0; i < w * h; i++) {
        const idx = i * 4;
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        if (lum < 95) {
          isLine[i] = 1;
          blackPixelCount++;
        }
      }

      const blackRatio = blackPixelCount / (w * h);

      // Label connected white regions (BFS)
      const labels = new Int32Array(w * h);
      labels.fill(-1);
      let currentLabel = 0;
      const pixelCounts: number[] = [];
      const sumX: number[] = [];
      const sumY: number[] = [];
      const minX: number[] = [];
      const maxX: number[] = [];
      const minY: number[] = [];
      const maxY: number[] = [];

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          if (isLine[idx] === 0 && labels[idx] === -1) {
            labels[idx] = currentLabel;
            let count = 0;
            let sX = 0;
            let sY = 0;
            let rMinX = x;
            let rMaxX = x;
            let rMinY = y;
            let rMaxY = y;

            const queue = [idx];
            while (queue.length > 0) {
              const curr = queue.pop()!;
              count++;
              const cx = curr % w;
              const cy = Math.floor(curr / w);
              sX += cx;
              sY += cy;
              if (cx < rMinX) rMinX = cx;
              if (cx > rMaxX) rMaxX = cx;
              if (cy < rMinY) rMinY = cy;
              if (cy > rMaxY) rMaxY = cy;

              if (cy > 0) {
                const up = (cy - 1) * w + cx;
                if (isLine[up] === 0 && labels[up] === -1) {
                  labels[up] = currentLabel;
                  queue.push(up);
                }
              }
              if (cy < h - 1) {
                const down = (cy + 1) * w + cx;
                if (isLine[down] === 0 && labels[down] === -1) {
                  labels[down] = currentLabel;
                  queue.push(down);
                }
              }
              if (cx > 0) {
                const left = cy * w + (cx - 1);
                if (isLine[left] === 0 && labels[left] === -1) {
                  labels[left] = currentLabel;
                  queue.push(left);
                }
              }
              if (cx < w - 1) {
                const right = cy * w + (cx + 1);
                if (isLine[right] === 0 && labels[right] === -1) {
                  labels[right] = currentLabel;
                  queue.push(right);
                }
              }
            }

            pixelCounts.push(count);
            sumX.push(sX);
            sumY.push(sY);
            minX.push(rMinX);
            maxX.push(rMaxX);
            minY.push(rMinY);
            maxY.push(rMaxY);
            currentLabel++;
          }
        }
      }

      // Merge tiny white regions (< 1.5% area = 3932px)
      const minArea = w * h * 0.015;
      for (let lbl = 0; lbl < currentLabel; lbl++) {
        const cy = sumY[lbl] / pixelCounts[lbl];
        const cx = sumX[lbl] / pixelCounts[lbl];
        const isEye = cy > 100 && cy < 280 && cx > 120 && cx < 390 && pixelCounts[lbl] > 80;
        if (pixelCounts[lbl] < minArea && !isEye) {
          for (let ry = minY[lbl]; ry <= maxY[lbl]; ry++) {
            for (let rx = minX[lbl]; rx <= maxX[lbl]; rx++) {
              if (labels[ry * w + rx] === lbl) {
                const pIdx = (ry * w + rx) * 4;
                data[pIdx] = 25;
                data[pIdx + 1] = 30;
                data[pIdx + 2] = 40;
                data[pIdx + 3] = 255;
              }
            }
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Centroids of colorable regions
      const centroids: RegionCentroid[] = [];
      let validCount = 0;
      for (let lbl = 0; lbl < currentLabel; lbl++) {
        const isBoundary =
          minX[lbl] === 0 || maxX[lbl] === w - 1 || minY[lbl] === 0 || maxY[lbl] === h - 1;
        const cy = sumY[lbl] / pixelCounts[lbl];
        const cx = sumX[lbl] / pixelCounts[lbl];
        const isEye = cy > 100 && cy < 280 && cx > 120 && cx < 390 && pixelCounts[lbl] > 80;

        if ((pixelCounts[lbl] >= minArea || isEye) && !isBoundary) {
          validCount++;
          const colorNum = ((validCount - 1) % 12) + 1;
          centroids.push({
            id: `reg-${validCount}`,
            x: Math.round(cx),
            y: Math.round(cy),
            colorNumber: colorNum,
          });
        }
      }

      const success = blackRatio <= 0.16 && validCount >= 4 && validCount <= 30;
      return { success, blackRatio, regionCount: validCount, centroids };
    },
    [hollowThickBlackAreas]
  );

  // Draw image to 512x512 canvas and prepare for coloring
  const drawThickenedImage = useCallback(
    (img: HTMLImageElement | HTMLCanvasElement) => {
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

      const result = simplifyColoringPage(canvas);
      setDynamicRegions(result.centroids);

      undoStackRef.current = [ctx.getImageData(0, 0, 512, 512)];
      setCanUndo(false);
      setCompletedBadges({});
      setColoredRegionsSet(new Set());
      hasTriggeredCompletionRef.current = false;
    },
    [simplifyColoringPage]
  );

  // Load active template
  useEffect(() => {
    if (activeTemplate.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => drawThickenedImage(img);
      img.src = activeTemplate.imageUrl;
    }
  }, [activeTemplate, drawThickenedImage]);

  // Check Auto-completion of current drawing
  const checkAutoCompletion = useCallback(() => {
    if (hasTriggeredCompletionRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Measure non-white, non-line pixels on canvas
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;

    let totalWhiteInside = 0;
    let coloredPixels = 0;

    for (let i = 0; i < 512 * 512; i++) {
      const idx = i * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum >= 90) {
        if (r > 245 && g > 245 && b > 245) {
          totalWhiteInside++;
        } else {
          coloredPixels++;
        }
      }
    }

    const totalRegions = dynamicRegions.length > 0 ? dynamicRegions.length : activeTemplate.regions.length;
    const regionsFilledCount = coloredRegionsSet.size;

    const isCompleted =
      (totalRegions > 0 && regionsFilledCount >= totalRegions) ||
      (coloredPixels > 25000 && coloredPixels / (coloredPixels + totalWhiteInside) >= 0.75);

    if (isCompleted) {
      hasTriggeredCompletionRef.current = true;
      playSoundEffect('sparkle', settings.volume);
      fireFireworksCelebration();

      setShowBriefCongrats(true);
      speakTeacherVoice(
        [
          { lang: 'vi', text: 'Hoan hô bé! Bức tranh đã tô màu hoàn thành rực rỡ rồi!' },
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
    dynamicRegions,
    activeTemplate,
    coloredRegionsSet,
    completedCountInRound,
    settings,
    onWin,
  ]);

  // Scanline Flood Fill on 512x512 Canvas
  const handleCanvasClick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (showRoundCompleteModal || showBriefCongrats) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = 512 / rect.width;
    const scaleY = 512 / rect.height;
    const startX = Math.floor((e.clientX - rect.left) * scaleX);
    const startY = Math.floor((e.clientY - rect.top) * scaleY);

    if (startX < 0 || startX >= 512 || startY < 0 || startY >= 512) return;

    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;

    const startIdx = (startY * 512 + startX) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];

    const startLum = 0.299 * startR + 0.587 * startG + 0.114 * startB;
    if (startLum < 90) return; // Do not fill black border

    const cleanHex = brushColor.replace('#', '');
    const num = parseInt(cleanHex, 16);
    const fillR = (num >> 16) & 255;
    const fillG = (num >> 8) & 255;
    const fillB = num & 255;

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
    const queue = [startY * 512 + startX];
    visited[startY * 512 + startX] = 1;

    let filledCount = 0;
    while (queue.length > 0) {
      const curr = queue.pop()!;
      filledCount++;
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

    // Track completed region badges in number mode
    if (coloringMode === 'number') {
      const allRegs = dynamicRegions.length > 0 ? dynamicRegions : activeTemplate.regions.map(r => ({
        id: r.id,
        x: (r.badgePos.x / 320) * 512,
        y: (r.badgePos.y / 320) * 512,
        colorNumber: r.colorNumber,
      }));

      for (const reg of allRegs) {
        const dist = Math.hypot(reg.x - startX, reg.y - startY);
        if (dist < 48) {
          setCompletedBadges((prev) => ({ ...prev, [reg.id]: true }));
          setColoredRegionsSet((prev) => new Set([...prev, reg.id]));
        }
      }
    } else {
      setColoredRegionsSet((prev) => new Set([...prev, `click-${Date.now()}`]));
    }

    setTimeout(() => {
      checkAutoCompletion();
    }, 150);
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

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col justify-between items-center bg-gradient-to-b from-amber-50/70 via-pink-50/30 to-sky-50/70 p-1 sm:p-2 select-none overflow-hidden font-sans">
      {/* 1. Header Toolbar: Compact, balanced, NO blank gaps */}
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

      {/* 2. Interactive Coloring Canvas: STRICTLY CLEAN, NO CORNER DECORATIONS */}
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

        {/* HTML Canvas with Flood Fill */}
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          onPointerDown={handleCanvasClick}
          className="w-full h-full max-h-full aspect-square object-contain touch-none cursor-crosshair rounded-[20px] select-none"
        />

        {/* Number Badges Overlay in "Theo Số" Mode */}
        {coloringMode === 'number' && (
          <div className="absolute inset-0 pointer-events-none p-1 sm:p-2 flex items-center justify-center">
            <div className="relative w-full h-full aspect-square">
              {(dynamicRegions.length > 0
                ? dynamicRegions
                : activeTemplate.regions.map((r) => ({
                    id: r.id,
                    x: (r.badgePos.x / 320) * 512,
                    y: (r.badgePos.y / 320) * 512,
                    colorNumber: r.colorNumber,
                  }))
              ).map((region) => {
                const isCompleted = completedBadges[region.id];
                if (isCompleted) return null;

                const isSelectedNumber = selectedColorItem.number === region.colorNumber;
                const leftPercent = (region.x / 512) * 100;
                const topPercent = (region.y / 512) * 100;

                return (
                  <div
                    key={region.id}
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute pointer-events-auto cursor-pointer rounded-full flex items-center justify-center font-black text-xs transition-transform ${
                      isSelectedNumber
                        ? 'w-6 h-6 bg-amber-400 text-amber-950 ring-2 ring-amber-600 scale-125 shadow-md animate-bounce'
                        : 'w-5 h-5 bg-white text-slate-800 border-2 border-slate-600 shadow-xs'
                    }`}
                    onClick={() => {
                      if (selectedColorItem.number !== region.colorNumber) {
                        const expectedColor =
                          STUDIO_COLOR_PALETTE.find((c) => c.number === region.colorNumber) ||
                          STUDIO_COLOR_PALETTE[0];
                        if (onGentleRetry) {
                          onGentleRetry(
                            `Vùng này mang số ${region.colorNumber} (${expectedColor.nameVi.toLowerCase()}). Bé hãy chọn màu số ${region.colorNumber} ở thanh màu nhé!`,
                            expectedColor.nameEn
                          );
                        }
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

      {/* 3. Studio Color Palette (12 colors) */}
      <div className="w-full max-w-md shrink-0 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-amber-400 p-1.5 sm:p-2 shadow-2xs space-y-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-amber-950">
            {coloringMode === 'number'
              ? `Màu số ${selectedColorItem.number}: ${selectedColorItem.nameVi}`
              : `Màu cọ: ${selectedColorItem.nameVi}`}
          </span>
          <span className="text-[11px] font-black text-amber-700">
            {templateIdx + 1}/{COLORING_BOOK_TEMPLATES.length}
          </span>
        </div>

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

      {/* 5. Template Picker Modal: 22 Static 3D Chibi Previews */}
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
