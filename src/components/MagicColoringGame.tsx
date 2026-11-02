import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Camera,
  RotateCcw,
  Volume2,
  Eye,
  Crop,
  X,
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
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-completion & Round Tracking (3 drawings per round)
  const [completedCountInRound, setCompletedCountInRound] = useState<number>(0);
  const [coloredRegionsSet, setColoredRegionsSet] = useState<Set<string>>(new Set());
  const [showBriefCongrats, setShowBriefCongrats] = useState<boolean>(false);
  const [showRoundCompleteModal, setShowRoundCompleteModal] = useState<boolean>(false);
  const hasTriggeredCompletionRef = useRef<boolean>(false);

  // Parent Consent & Crop Modal States
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [rawUploadImage, setRawUploadImage] = useState<HTMLImageElement | null>(null);
  const [showCropModal, setShowCropModal] = useState<boolean>(false);
  const [cropBox, setCropBox] = useState<{ x: number; y: number; size: number }>({ x: 0, y: 0, size: 300 });

  // Waiting Screen States for Camera / AI (5 to 30s normal, >60s timeout)
  const [isWaitingAi, setIsWaitingAi] = useState<boolean>(false);
  const [aiProgress, setAiProgress] = useState<number>(10);
  const [aiStatusText, setAiStatusText] = useState<string>('Đang ngắm bức ảnh của bé... 📸');
  const [aiElapsedSeconds, setAiElapsedSeconds] = useState<number>(0);
  const [aiTimeoutWarning, setAiTimeoutWarning] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Dynamic regions for number mode
  const [dynamicRegions, setDynamicRegions] = useState<RegionCentroid[]>([]);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Undo history stack
  const undoStackRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  // Number mode badges completed tracking
  const [completedBadges, setCompletedBadges] = useState<Record<string, boolean>>({});

  const activeTemplate = COLORING_BOOK_TEMPLATES[templateIdx % COLORING_BOOK_TEMPLATES.length];
  const selectedColorItem =
    STUDIO_COLOR_PALETTE.find((c) => c.hex === brushColor) || STUDIO_COLOR_PALETTE[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

    // Threshold: border radius ~3.2px (stroke ~6.5px). In chamfer: 3.2 * 3 = 10
    const CHAMFER_THRESH = 10;
    let blackCount = 0;
    for (let i = 0; i < w * h; i++) {
      const idx = i * 4;
      if (black[i] === 1) {
        if (dist[i] > CHAMFER_THRESH) {
          // Hollow out interior to pure white
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = 255;
        } else {
          // Keep crisp dark line
          data[idx] = 25;
          data[idx + 1] = 30;
          data[idx + 2] = 40;
          data[idx + 3] = 255;
          blackCount++;
        }
      } else {
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return blackCount / (w * h);
  }, []);

  // 2. SimplifyColoringPage algorithm:
  // - Applies distance transform hollowing
  // - Finds connected white regions
  // - Merges small regions < 1.5% area
  // - Validates black ratio < 15% and region count in 4..30
  const simplifyColoringPage = useCallback(
    (canvas: HTMLCanvasElement): {
      success: boolean;
      blackRatio: number;
      regionCount: number;
      centroids: RegionCentroid[];
    } => {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return { success: false, blackRatio: 0, regionCount: 0, centroids: [] };

      const w = 512;
      const h = 512;

      // 1. First run distance-transform hollowing
      const blackRatio = hollowThickBlackAreas(ctx, w, h);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      const isLine = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) {
        if (data[i * 4] < 115) {
          isLine[i] = 1;
        }
      }

      // 2. Connected Component Analysis on white areas
      const labels = new Int32Array(w * h).fill(-1);
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
            let count = 0;
            let sX = 0;
            let sY = 0;
            let rMinX = x,
              rMaxX = x,
              rMinY = y,
              rMaxY = y;

            const queue: number[] = [idx];
            labels[idx] = currentLabel;

            let qHead = 0;
            while (qHead < queue.length) {
              const cur = queue[qHead++];
              const cy = Math.floor(cur / w);
              const cx = cur % w;

              count++;
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

      // 3. Merge tiny white regions (< 1.5% area = 3932px)
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
    if (isCameraActive) return;

    if (activeTemplate.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => drawThickenedImage(img);
      img.src = activeTemplate.imageUrl;
    }
  }, [activeTemplate, isCameraActive, drawThickenedImage]);

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
        // Is it pure white or colored?
        if (r > 245 && g > 245 && b > 245) {
          totalWhiteInside++;
        } else {
          coloredPixels++;
        }
      }
    }

    // Number of dynamic regions
    const totalRegions = dynamicRegions.length > 0 ? dynamicRegions.length : activeTemplate.regions.length;
    const regionsFilledCount = coloredRegionsSet.size;

    // If all regions have been clicked at least once OR >= 80% colored
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
          // Finished 3 drawings in a round -> show dialog with 2 big buttons
          setShowRoundCompleteModal(true);
          if (onWin) onWin();
        } else {
          // Move to next template
          setTemplateIdx((prev) => (prev + 1) % COLORING_BOOK_TEMPLATES.length);
          setIsCameraActive(false);
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
    if (isWaitingAi || showRoundCompleteModal || showBriefCongrats) return;
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

    const pixelStack: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(512 * 512);

    while (pixelStack.length > 0) {
      const newPos = pixelStack.pop();
      if (!newPos) break;
      const x = newPos[0];
      let y = newPos[1];

      let pixelIdx = (y * 512 + x) * 4;
      while (y >= 0 && matchStartColor(pixelIdx) && visited[y * 512 + x] === 0) {
        y--;
        pixelIdx -= 512 * 4;
      }
      pixelIdx += 512 * 4;
      y++;

      let spanLeft = false;
      let spanRight = false;
      let curY = y;
      let idx = pixelIdx;

      while (curY < 512 && matchStartColor(idx) && visited[curY * 512 + x] === 0) {
        visited[curY * 512 + x] = 1;
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = 255;

        if (x > 0) {
          const leftIdx = idx - 4;
          if (matchStartColor(leftIdx) && visited[curY * 512 + (x - 1)] === 0) {
            if (!spanLeft) {
              pixelStack.push([x - 1, curY]);
              spanLeft = true;
            }
          } else if (spanLeft) {
            spanLeft = false;
          }
        }

        if (x < 511) {
          const rightIdx = idx + 4;
          if (matchStartColor(rightIdx) && visited[curY * 512 + (x + 1)] === 0) {
            if (!spanRight) {
              pixelStack.push([x + 1, curY]);
              spanRight = true;
            }
          } else if (spanRight) {
            spanRight = false;
          }
        }

        curY++;
        idx += 512 * 4;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    undoStackRef.current.push(ctx.getImageData(0, 0, 512, 512));
    if (undoStackRef.current.length > 16) {
      undoStackRef.current.shift();
    }
    setCanUndo(true);

    // Track which region was colored
    const regionsToCheck =
      dynamicRegions.length > 0
        ? dynamicRegions
        : activeTemplate.regions.map((r) => ({
            id: r.id,
            x: (r.badgePos.x / 320) * 512,
            y: (r.badgePos.y / 320) * 512,
            colorNumber: r.colorNumber,
          }));

    let closestRegId: string | null = null;
    let minDist = 999;
    for (const reg of regionsToCheck) {
      const d = Math.hypot(startX - reg.x, startY - reg.y);
      if (d < minDist) {
        minDist = d;
        closestRegId = reg.id;
      }
      if (d < 50 && reg.colorNumber === selectedColorItem.number) {
        setCompletedBadges((prev) => ({ ...prev, [reg.id]: true }));
      }
    }
    if (closestRegId && minDist < 120) {
      setColoredRegionsSet((prev) => new Set([...prev, closestRegId!]));
    }

    playSoundEffect('sparkle', settings.volume);
    speakTeacherVoice(
      [
        { lang: 'en', text: `${selectedColorItem.nameEn}!` },
        { lang: 'vi', text: selectedColorItem.nameVi },
      ],
      settings
    );

    // Trigger auto-completion test
    setTimeout(checkAutoCompletion, 100);
  };

  // Undo Action
  const handleUndo = () => {
    if (undoStackRef.current.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    undoStackRef.current.pop();
    const previous = undoStackRef.current[undoStackRef.current.length - 1];
    ctx.putImageData(previous, 0, 0);
    setCanUndo(undoStackRef.current.length > 1);
    playSoundEffect('pop', settings.volume);
  };

  // Reset Action
  const handleReset = () => {
    playSoundEffect('pop', settings.volume);
    if (isCameraActive) {
      const firstState = undoStackRef.current[0];
      if (firstState && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.putImageData(firstState, 0, 0);
        undoStackRef.current = [firstState];
        setCanUndo(false);
        setColoredRegionsSet(new Set());
        hasTriggeredCompletionRef.current = false;
      }
    } else {
      if (activeTemplate.imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => drawThickenedImage(img);
        img.src = activeTemplate.imageUrl;
      }
    }
  };

  // ----------------------------------------------------
  // Camera & Image Upload Pipeline with Waiting Screen
  // ----------------------------------------------------
  const handleCameraBtnClick = () => {
    playSoundEffect('pop', settings.volume);
    const hasConsent = localStorage.getItem('coloring_ai_consent') === 'true';
    if (!hasConsent) {
      setShowConsentModal(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleConsentAccept = () => {
    localStorage.setItem('coloring_ai_consent', 'true');
    setShowConsentModal(false);
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setRawUploadImage(img);
        const minDim = Math.min(img.width, img.height);
        const cropW = Math.round(minDim * 0.85);
        const cropX = Math.round((img.width - cropW) / 2);
        const cropY = Math.round((img.height - cropW) / 2);
        setCropBox({ x: cropX, y: cropY, size: cropW });
        setShowCropModal(true);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Cancel AI waiting
  const handleCancelAi = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsWaitingAi(false);
    setAiTimeoutWarning(false);
    showToast('Đã dừng xử lý ảnh');
  };

  // Local fallback processing with distance transform hollowing
  const runLocalFallbackPipeline = (cropCanvas: HTMLCanvasElement): boolean => {
    const off = document.createElement('canvas');
    off.width = 512;
    off.height = 512;
    const offCtx = off.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return false;

    offCtx.fillStyle = '#FFFFFF';
    offCtx.fillRect(0, 0, 512, 512);
    offCtx.drawImage(cropCanvas, 0, 0, 512, 512);

    const imgData = offCtx.getImageData(0, 0, 512, 512);
    const src = imgData.data;

    // Grayscale + Gaussian Blur 3x3
    const gray = new Float32Array(512 * 512);
    for (let i = 0; i < 512 * 512; i++) {
      const idx = i * 4;
      gray[i] = 0.299 * src[idx] + 0.587 * src[idx + 1] + 0.114 * src[idx + 2];
    }

    const smoothed = new Float32Array(512 * 512);
    for (let y = 1; y < 511; y++) {
      for (let x = 1; x < 511; x++) {
        const sum =
          gray[(y - 1) * 512 + (x - 1)] +
          gray[(y - 1) * 512 + x] * 2 +
          gray[(y - 1) * 512 + (x + 1)] +
          gray[y * 512 + (x - 1)] * 2 +
          gray[y * 512 + x] * 4 +
          gray[y * 512 + (x + 1)] * 2 +
          gray[(y + 1) * 512 + (x - 1)] +
          gray[(y + 1) * 512 + x] * 2 +
          gray[(y + 1) * 512 + (x + 1)];
        smoothed[y * 512 + x] = sum / 16;
      }
    }

    // Sobel Edge Detection
    const edges = new Uint8Array(512 * 512);
    const threshold = 34;
    for (let y = 1; y < 511; y++) {
      for (let x = 1; x < 511; x++) {
        const gx =
          -smoothed[(y - 1) * 512 + (x - 1)] +
          smoothed[(y - 1) * 512 + (x + 1)] -
          2 * smoothed[y * 512 + (x - 1)] +
          2 * smoothed[y * 512 + (x + 1)] -
          smoothed[(y + 1) * 512 + (x - 1)] +
          smoothed[(y + 1) * 512 + (x + 1)];

        const gy =
          -smoothed[(y - 1) * 512 + (x - 1)] -
          2 * smoothed[(y - 1) * 512 + x] -
          smoothed[(y - 1) * 512 + (x + 1)] +
          smoothed[(y + 1) * 512 + (x - 1)] +
          2 * smoothed[(y + 1) * 512 + x] +
          smoothed[(y + 1) * 512 + (x + 1)];

        if (Math.hypot(gx, gy) > threshold) {
          edges[y * 512 + x] = 1;
        }
      }
    }

    const finalData = offCtx.createImageData(512, 512);
    const dst = finalData.data;
    for (let i = 0; i < dst.length; i += 4) {
      dst[i] = 255;
      dst[i + 1] = 255;
      dst[i + 2] = 255;
      dst[i + 3] = 255;
    }

    for (let y = 1; y < 511; y++) {
      for (let x = 1; x < 511; x++) {
        if (edges[y * 512 + x] === 1) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const idx = ((y + dy) * 512 + (x + dx)) * 4;
              dst[idx] = 25;
              dst[idx + 1] = 30;
              dst[idx + 2] = 40;
              dst[idx + 3] = 255;
            }
          }
        }
      }
    }
    offCtx.putImageData(finalData, 0, 0);

    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return false;
    const mainCtx = mainCanvas.getContext('2d');
    if (!mainCtx) return false;

    mainCtx.drawImage(off, 0, 0);

    // Apply distance transform hollowing + simplification
    const simRes = simplifyColoringPage(mainCanvas);
    setDynamicRegions(simRes.centroids);

    if (simRes.blackRatio > 0.20 || simRes.blackRatio < 0.02 || simRes.regionCount < 3) {
      return false;
    }

    undoStackRef.current = [mainCtx.getImageData(0, 0, 512, 512)];
    setCanUndo(false);
    setIsCameraActive(true);
    setColoringMode('free');
    setColoredRegionsSet(new Set());
    hasTriggeredCompletionRef.current = false;
    return true;
  };

  // Confirm Crop & Process with Cute Waiting Screen & 60s Timeout
  const handleConfirmCrop = async () => {
    if (!rawUploadImage) return;
    setShowCropModal(false);
    setIsWaitingAi(true);
    setAiProgress(10);
    setAiStatusText('Đang ngắm bức ảnh của bé... 📸');
    setAiElapsedSeconds(0);
    setAiTimeoutWarning(false);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Start timer interval
    const startTs = Date.now();
    timerIntervalRef.current = window.setInterval(() => {
      const secs = Math.floor((Date.now() - startTs) / 1000);
      setAiElapsedSeconds(secs);
      if (secs >= 3 && secs < 8) {
        setAiProgress(35);
        setAiStatusText('Đang biến hình thành nét vẽ 3D chibi... 🪄');
      } else if (secs >= 8 && secs < 18) {
        setAiProgress(65);
        setAiStatusText('Đang trau chuốt các đường nét cho bé... 🎨');
      } else if (secs >= 18 && secs < 45) {
        setAiProgress(85);
      } else if (secs >= 60) {
        setAiTimeoutWarning(true);
        setAiStatusText('Mạng chậm, thử lại nhé ⏰');
      }
    }, 1000);

    try {
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = 512;
      cropCanvas.height = 512;
      const cropCtx = cropCanvas.getContext('2d');
      if (!cropCtx) throw new Error('Cannot create crop context');

      cropCtx.drawImage(
        rawUploadImage,
        cropBox.x,
        cropBox.y,
        cropBox.size,
        cropBox.size,
        0,
        0,
        512,
        512
      );

      const base64Crop = cropCanvas.toDataURL('image/jpeg', 0.85);

      // Call server route
      let usedAi = false;
      try {
        const response = await fetch('/api/image-to-coloring', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Crop }),
          signal: controller.signal,
        });

        const json = await response.json();
        console.log('[CLIENT_AI_RESPONSE]', { status: response.status, json });

        if (response.ok && json.success && json.imageBase64) {
          const aiImg = new Image();
          await new Promise<void>((resolve, reject) => {
            aiImg.onload = () => resolve();
            aiImg.onerror = reject;
            aiImg.src = json.imageBase64;
          });

          drawThickenedImage(aiImg);
          setIsCameraActive(true);
          setColoringMode('free');
          usedAi = true;
        } else {
          console.warn('[AI_FALLBACK_TRIGGERED]', json.reason, json.errorMessage);
        }
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
        console.warn('[AI_FETCH_ERROR]', err);
      }

      // If AI did not return image, run local fallback with realistic smooth progress
      if (!usedAi) {
        setAiStatusText('Đang xử lý nét vẽ trực tiếp trên máy bé... ⚡');
        await new Promise((r) => setTimeout(r, 1200));

        const fallbackSuccess = runLocalFallbackPipeline(cropCanvas);
        if (!fallbackSuccess) {
          showToast('Ảnh mờ hoặc không rõ chủ thể, bé thử ảnh khác nhé 📸');
          if (activeTemplate.imageUrl) {
            const img = new Image();
            img.onload = () => drawThickenedImage(img);
            img.src = activeTemplate.imageUrl;
          }
          return;
        }
      }

      playSoundEffect('sparkle', settings.volume);
      speakTeacherVoice(
        [{ lang: 'vi', text: 'Tranh chụp của bé đã sẵn sàng! Cùng tô màu thật xinh nhé!' }],
        settings
      );
    } catch {
      showToast('Ảnh mờ hoặc không rõ chủ thể, bé thử ảnh khác nhé 📸');
    } finally {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsWaitingAi(false);
      setAiTimeoutWarning(false);
    }
  };

  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col justify-between items-center bg-gradient-to-b from-amber-50/70 via-pink-50/30 to-sky-50/70 p-1 sm:p-2 select-none overflow-hidden font-sans">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 z-50 bg-amber-900 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span>📸</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Toolbar: Single row <= 48px, Icons Only */}
      <div className="w-full max-w-md h-11 sm:h-12 shrink-0 rounded-2xl border-2 border-amber-400 bg-white/95 backdrop-blur-md px-2 shadow-2xs flex items-center justify-between gap-1">
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Quay lại sân chơi"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Template Selector Button */}
          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95 text-base"
            title="Chọn tranh tô màu"
            aria-label="Chọn tranh"
          >
            🖼️
          </button>

          {/* Camera Button */}
          <button
            type="button"
            onClick={handleCameraBtnClick}
            disabled={isWaitingAi}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95 disabled:opacity-50"
            title="Chụp hoặc chọn ảnh từ máy"
            aria-label="Chụp ảnh tô màu"
          >
            <Camera className="w-5 h-5" />
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
        <div className="flex items-center gap-1 shrink-0">
          {!isCameraActive && (
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
          )}

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
                    text: isCameraActive
                      ? 'Bé hãy chọn màu và chạm vào các ô để đổ màu cho bức tranh nhé!'
                      : `Bé tô màu tranh ${activeTemplate.titleVi} nhé!`,
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
        {showSampleHint && !isCameraActive && (
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
                    title={`Vùng số ${region.colorNumber}`}
                  >
                    {region.colorNumber}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Short Celebration Overlay when 1 drawing finishes (3D Chibi, NO EMOJI) */}
        {showBriefCongrats && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-30 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center mb-2 shadow-md">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 stroke-[2.5] animate-bounce" />
            </div>
            <h3 className="text-base font-black text-amber-950 mb-0.5">
              Hoàn thành xuất sắc!
            </h3>
            <p className="text-xs font-bold text-amber-800">
              Đang chuyển sang tranh tiếp theo...
            </p>
          </div>
        )}
      </div>

      {/* 3. Bottom Palette Drawer: SINGLE HORIZONTAL ROW, BUTTONS 36-40px, NO DONE BUTTON */}
      <div className="w-full max-w-md h-12 sm:h-14 shrink-0 rounded-2xl border-2 border-amber-400 bg-[#FFFDF5] px-2 shadow-2xs flex items-center justify-between gap-1.5 overflow-hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 no-scrollbar flex-1 min-w-0">
          {STUDIO_COLOR_PALETTE.map((c) => {
            const isSelected = brushColor === c.hex;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setBrushColor(c.hex);
                  speakTeacherVoice(
                    [
                      { lang: 'en', text: `${c.nameEn}!` },
                      { lang: 'vi', text: c.nameVi },
                    ],
                    settings
                  );
                }}
                style={{ backgroundColor: c.hex }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm cursor-pointer transition-all select-none shrink-0 ${
                  isSelected
                    ? 'ring-4 ring-amber-400 scale-110 border-2 border-white shadow-md'
                    : 'border-2 border-white hover:scale-105 shadow-2xs opacity-90 hover:opacity-100'
                }`}
                title={`Màu số ${c.number}: ${c.nameVi}`}
                aria-label={c.nameVi}
              >
                <span className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] font-black">
                  {c.number}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Confirmation Dialog after 3 Drawings Completed ("Chơi lại" & "Về màn hình chính") */}
      {showRoundCompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
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

      {/* 5. CUTE WAITING SCREEN (Mandatory Waiting with 3D Chibi Animation & Cancel Button) */}
      {isWaitingAi && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-6 flex flex-col items-center text-center space-y-4">
            {/* Cute animated 3D spinner icon */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-3xl animate-pulse">
                🎨
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-amber-950">
                {aiStatusText}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Thời gian xử lý: {aiElapsedSeconds}s
              </p>
            </div>

            {/* Smooth progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${aiProgress}%` }}
              />
            </div>

            {/* Timeout warning (>60s) or normal cancel */}
            {aiTimeoutWarning ? (
              <div className="flex items-center gap-2 w-full pt-2">
                <button
                  type="button"
                  onClick={handleCancelAi}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCrop}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs hover:from-amber-600 shadow-sm cursor-pointer"
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCancelAi}
                className="px-6 py-2 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-black text-xs cursor-pointer transition active:scale-95"
              >
                Hủy bỏ
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. Parent Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-5 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <h3 className="text-base font-black text-amber-950">Góc Phụ Huynh</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ảnh được gửi tới dịch vụ AI để tạo tranh tô màu, không được lưu lại.
            </p>
            <div className="flex items-center gap-2 w-full pt-2">
              <button
                type="button"
                onClick={() => setShowConsentModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConsentAccept}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs hover:from-amber-600 shadow-sm cursor-pointer"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Interactive Square Crop Modal */}
      {showCropModal && rawUploadImage && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-4 flex flex-col items-center space-y-3">
            <div className="flex items-center justify-between w-full border-b border-amber-100 pb-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-black text-sm">
                <Crop className="w-4 h-4 text-amber-600" />
                <span>Cắt Khung Vuông 1 Chủ Thể</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-600 text-center">
              Khung vuông bao quanh 1 nhân vật hoặc đồ vật cần vẽ nhé!
            </p>

            <div className="relative w-64 h-64 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-slate-700">
              <img
                src={rawUploadImage.src}
                alt="Upload preview"
                className="max-w-full max-h-full object-contain pointer-events-none"
              />
              <div className="absolute inset-0 border-4 border-amber-400 rounded-xl pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
            </div>

            <div className="flex items-center gap-2 w-full pt-1">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Chọn lại
              </button>
              <button
                type="button"
                onClick={handleConfirmCrop}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs hover:from-emerald-600 shadow-sm cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Tạo nét vẽ</span>
                <span>✨</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Template Picker Modal: 22 Static 3D Chibi Previews */}
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
                const isCurrent = !isCameraActive && templateIdx === idx;
                return (
                  <button
                    key={`${tmpl.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      setTemplateIdx(idx);
                      setIsCameraActive(false);
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
