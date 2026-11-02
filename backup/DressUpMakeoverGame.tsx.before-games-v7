import React, { useState, useRef, useMemo } from 'react';
import {
  Camera,
  RotateCcw,
  ArrowLeft,
  Volume2,
  Plus,
  Minus,
  RotateCw,
  Trash2,
  Sparkles,
  Crop,
  Image as ImageIcon,
} from 'lucide-react';
import type { ParentSettings } from '../types/learning';
import { playSoundEffect, speakTeacherVoice } from '../utils/audioEngine';
import { fireFireworksCelebration } from '../utils/confetti';
import { PUZZLE_CHARACTERS_DATA, type PuzzleCharacterDef } from '../data/puzzleCharactersData';
import {
  ACCESSORIES_DATA,
  CATEGORY_TABS,
  type AccessoryCategory,
  type AccessoryItem,
} from '../data/dressUpAccessoriesData';

interface DressUpMakeoverGameProps {
  settings: ParentSettings;
  onBack?: () => void;
  onWin?: () => void;
}

interface PlacedAccessory {
  instanceId: string;
  item: AccessoryItem;
  xPercent: number; // 0..100
  yPercent: number; // 0..100
  scale: number; // 0.5 .. 2.5
  rotation: number; // degrees
}

export const DressUpMakeoverGame: React.FC<DressUpMakeoverGameProps> = ({
  settings,
  onBack,
  onWin,
}) => {
  const [characterIdx, setCharacterIdx] = useState<number>(0);
  const [customCharacterUrl, setCustomCharacterUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory>('hat');
  const [placedItems, setPlacedItems] = useState<PlacedAccessory[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [showCharModal, setShowCharModal] = useState<boolean>(false);
  const [isPhotoFlash, setIsPhotoFlash] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Camera & AI Waiting Screen States
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [rawUploadImage, setRawUploadImage] = useState<HTMLImageElement | null>(null);
  const [showCropModal, setShowCropModal] = useState<boolean>(false);
  const [cropBox, setCropBox] = useState<{ x: number; y: number; size: number }>({ x: 0, y: 0, size: 300 });

  const [isWaitingAi, setIsWaitingAi] = useState<boolean>(false);
  const [aiProgress, setAiProgress] = useState<number>(10);
  const [aiStatusText, setAiStatusText] = useState<string>('Đang ngắm nhân vật của bé... 📸');
  const [aiElapsedSeconds, setAiElapsedSeconds] = useState<number>(0);
  const [aiTimeoutWarning, setAiTimeoutWarning] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const characterStageRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dragging & Gesture Ref State
  const activeDragRef = useRef<{
    instanceId: string;
    startX: number;
    startY: number;
    initXPercent: number;
    initYPercent: number;
    initDistance?: number;
    initAngle?: number;
    initScale?: number;
    initRotation?: number;
  } | null>(null);

  const currentCharacter: PuzzleCharacterDef =
    PUZZLE_CHARACTERS_DATA[characterIdx % PUZZLE_CHARACTERS_DATA.length];

  const characterImageToDisplay = customCharacterUrl || currentCharacter.imageUrl;

  const currentCategoryItems = useMemo(() => {
    return ACCESSORIES_DATA.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const activePlacedItem = placedItems.find((p) => p.instanceId === selectedInstanceId) || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add accessory: ALLOW MULTIPLE ACCESSORIES SIMULTANEOUSLY (EVEN IN SAME GROUP)
  const handleSelectAccessory = (item: AccessoryItem) => {
    playSoundEffect('pop', settings.volume);

    // Count how many items in same category are currently placed to offset slightly
    const countSameCategory = placedItems.filter((p) => p.item.category === item.category).length;
    const offset = (countSameCategory % 4) * 4;

    const newItem: PlacedAccessory = {
      instanceId: `inst-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      item,
      xPercent: Math.min(85, Math.max(15, item.defaultPos.x * 100 + (countSameCategory > 0 ? (offset % 2 === 0 ? offset : -offset) : 0))),
      yPercent: Math.min(85, Math.max(15, item.defaultPos.y * 100 + (countSameCategory > 0 ? offset : 0))),
      scale: item.defaultScale,
      rotation: 0,
    };

    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedInstanceId(newItem.instanceId);

    speakTeacherVoice(
      [
        { lang: 'vi', text: `Bé đã chọn ${item.nameVi}` },
        { lang: 'en', text: item.nameEn },
      ],
      settings
    );
  };

  // Quick Action Buttons (+, -, rotate, delete)
  const handleZoom = (delta: number) => {
    if (!selectedInstanceId) return;
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId !== selectedInstanceId) return item;
        const nextScale = Math.min(2.5, Math.max(0.45, item.scale + delta));
        return { ...item, scale: Number(nextScale.toFixed(2)) };
      })
    );
    playSoundEffect('pop', settings.volume);
  };

  const handleRotate = (angleDelta: number) => {
    if (!selectedInstanceId) return;
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId !== selectedInstanceId) return item;
        const nextRot = (item.rotation + angleDelta) % 360;
        return { ...item, rotation: nextRot };
      })
    );
    playSoundEffect('pop', settings.volume);
  };

  const handleDeleteActive = () => {
    if (!selectedInstanceId) return;
    setPlacedItems((prev) => prev.filter((item) => item.instanceId !== selectedInstanceId));
    setSelectedInstanceId(null);
    playSoundEffect('pop', settings.volume);
  };

  const handleResetAll = () => {
    setPlacedItems([]);
    setSelectedInstanceId(null);
    playSoundEffect('pop', settings.volume);
    speakTeacherVoice([{ lang: 'vi', text: 'Bé bắt đầu phối đồ lại từ đầu nhé!' }], settings);
  };

  // Drag and 2-finger touch gesture handlers
  const handlePointerDown = (e: React.PointerEvent, instanceId: string) => {
    e.stopPropagation();
    const stage = characterStageRef.current;
    if (!stage) return;

    setSelectedInstanceId(instanceId);
    const item = placedItems.find((p) => p.instanceId === instanceId);
    if (!item) return;

    activeDragRef.current = {
      instanceId,
      startX: e.clientX,
      startY: e.clientY,
      initXPercent: item.xPercent,
      initYPercent: item.yPercent,
      initScale: item.scale,
      initRotation: item.rotation,
    };
  };

  const handleTouchStart = (e: React.TouchEvent, instanceId: string) => {
    e.stopPropagation();
    setSelectedInstanceId(instanceId);
    const item = placedItems.find((p) => p.instanceId === instanceId);
    if (!item) return;

    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const angle = (Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180) / Math.PI;

      activeDragRef.current = {
        instanceId,
        startX: (t1.clientX + t2.clientX) / 2,
        startY: (t1.clientY + t2.clientY) / 2,
        initXPercent: item.xPercent,
        initYPercent: item.yPercent,
        initDistance: dist,
        initAngle: angle,
        initScale: item.scale,
        initRotation: item.rotation,
      };
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      activeDragRef.current = {
        instanceId,
        startX: t.clientX,
        startY: t.clientY,
        initXPercent: item.xPercent,
        initYPercent: item.yPercent,
        initScale: item.scale,
        initRotation: item.rotation,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const drag = activeDragRef.current;
    const stage = characterStageRef.current;
    if (!drag || !stage) return;

    const rect = stage.getBoundingClientRect();

    if (e.touches.length === 2 && drag.initDistance !== undefined && drag.initAngle !== undefined) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const currentAngle = (Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180) / Math.PI;

      const scaleMultiplier = currentDist / drag.initDistance;
      const nextScale = Math.min(2.5, Math.max(0.45, (drag.initScale || 1.0) * scaleMultiplier));
      const angleDiff = currentAngle - drag.initAngle;
      const nextRot = Math.round(((drag.initRotation || 0) + angleDiff) % 360);

      setPlacedItems((prev) =>
        prev.map((item) =>
          item.instanceId === drag.instanceId
            ? { ...item, scale: Number(nextScale.toFixed(2)), rotation: nextRot }
            : item
        )
      );
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      const deltaX = t.clientX - drag.startX;
      const deltaY = t.clientY - drag.startY;

      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      const nextX = Math.min(95, Math.max(5, drag.initXPercent + deltaXPercent));
      const nextY = Math.min(95, Math.max(5, drag.initYPercent + deltaYPercent));

      setPlacedItems((prev) =>
        prev.map((item) =>
          item.instanceId === drag.instanceId
            ? { ...item, xPercent: nextX, yPercent: nextY }
            : item
        )
      );
    }
  };

  const handleTouchEnd = () => {
    activeDragRef.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = activeDragRef.current;
    const stage = characterStageRef.current;
    if (!drag || !stage) return;

    const rect = stage.getBoundingClientRect();
    const deltaX = e.clientX - drag.startX;
    const deltaY = e.clientY - drag.startY;

    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;

    const nextX = Math.min(95, Math.max(5, drag.initXPercent + deltaXPercent));
    const nextY = Math.min(95, Math.max(5, drag.initYPercent + deltaYPercent));

    setPlacedItems((prev) =>
      prev.map((item) =>
        item.instanceId === drag.instanceId
          ? { ...item, xPercent: nextX, yPercent: nextY }
          : item
      )
    );
  };

  const handlePointerUp = () => {
    activeDragRef.current = null;
  };

  // Photo Snapshot feature (Camera click on top right)
  const handleTakePhoto = () => {
    playSoundEffect('sparkle', settings.volume);
    setIsPhotoFlash(true);
    setTimeout(() => setIsPhotoFlash(false), 300);

    fireFireworksCelebration();
    speakTeacherVoice(
      [
        {
          lang: 'vi',
          text: `Tách! Bé đã chụp lại diện mạo xinh xắn cho ${currentCharacter.nameVi} rồi!`,
        },
        { lang: 'en', text: 'Stunning makeover photoshoot! Beautiful styling!' },
      ],
      settings
    );
  };

  // ----------------------------------------------------
  // Camera & Image Upload for Custom Chibi Character
  // ----------------------------------------------------
  const handleCameraUploadClick = () => {
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

  const handleCancelAi = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsWaitingAi(false);
    setAiTimeoutWarning(false);
    showToast('Đã dừng xử lý nhân vật');
  };

  // Local canvas chibi color smoothing pipeline
  const runLocalChibiPipeline = (cropCanvas: HTMLCanvasElement): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return cropCanvas.toDataURL('image/jpeg', 0.9);

    ctx.drawImage(cropCanvas, 0, 0, 600, 600);
    const imgData = ctx.getImageData(0, 0, 600, 600);
    const d = imgData.data;

    // Smooth and simplify colors into gentle chibi tones
    for (let i = 0; i < 600 * 600; i++) {
      const idx = i * 4;
      // Posterize color into 16 steps per channel for smooth clay look
      d[idx] = Math.round(d[idx] / 16) * 16;
      d[idx + 1] = Math.round(d[idx + 1] / 16) * 16;
      d[idx + 2] = Math.round(d[idx + 2] / 16) * 16;
    }
    ctx.putImageData(imgData, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.92);
  };

  const handleConfirmCrop = async () => {
    if (!rawUploadImage) return;
    setShowCropModal(false);
    setIsWaitingAi(true);
    setAiProgress(10);
    setAiStatusText('Đang ngắm nhân vật của bé... 📸');
    setAiElapsedSeconds(0);
    setAiTimeoutWarning(false);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const startTs = Date.now();
    timerIntervalRef.current = window.setInterval(() => {
      const secs = Math.floor((Date.now() - startTs) / 1000);
      setAiElapsedSeconds(secs);
      if (secs >= 3 && secs < 8) {
        setAiProgress(35);
        setAiStatusText('Đang tạo nhân vật 3D chibi cho bé... 🪄');
      } else if (secs >= 8 && secs < 18) {
        setAiProgress(65);
        setAiStatusText('Đang làm mịn sắc màu và đôi mắt long lanh... ✨');
      } else if (secs >= 18 && secs < 45) {
        setAiProgress(85);
      } else if (secs >= 60) {
        setAiTimeoutWarning(true);
        setAiStatusText('Mạng chậm, thử lại nhé ⏰');
      }
    }, 1000);

    try {
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = 600;
      cropCanvas.height = 600;
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
        600,
        600
      );

      const base64Crop = cropCanvas.toDataURL('image/jpeg', 0.85);

      let usedAi = false;
      try {
        const response = await fetch('/api/image-to-chibi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Crop }),
          signal: controller.signal,
        });

        const json = await response.json();
        console.log('[CHIBI_AI_RESPONSE]', { status: response.status, json });

        if (response.ok && json.success && json.imageBase64) {
          setCustomCharacterUrl(json.imageBase64);
          usedAi = true;
        }
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
        console.warn('[CHIBI_FETCH_ERROR]', err);
      }

      if (!usedAi) {
        setAiStatusText('Đang hoàn thiện nhân vật chibi trên máy bé... ⚡');
        await new Promise((r) => setTimeout(r, 1200));

        const processedUrl = runLocalChibiPipeline(cropCanvas);
        setCustomCharacterUrl(processedUrl);
      }

      playSoundEffect('sparkle', settings.volume);
      speakTeacherVoice(
        [{ lang: 'vi', text: 'Nhân vật của bé đã sẵn sàng! Cùng phối trang phục và mũ xinh nhé!' }],
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
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full max-h-[100dvh] flex flex-col justify-between items-center bg-gradient-to-b from-pink-50 via-purple-50/40 to-amber-50/60 p-1 sm:p-2 select-none overflow-hidden font-sans"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* Photo Flash Overlay */}
      {isPhotoFlash && (
        <div className="fixed inset-0 z-50 bg-white opacity-85 transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 z-50 bg-pink-900 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span>📸</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Toolbar: Single row <= 48px, Icons Only */}
      <div className="w-full max-w-md h-11 shrink-0 rounded-2xl border-2 border-pink-400 bg-white/95 backdrop-blur-md px-2 shadow-2xs flex items-center justify-between gap-1">
        {/* Left: Back + Character Picker (🖼️) + Camera Upload Button */}
        <div className="flex items-center gap-1 shrink-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 flex items-center justify-center cursor-pointer transition active:scale-95"
              title="Quay lại"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          {/* Character Picker Button: Image Icon */}
          <button
            type="button"
            onClick={() => setShowCharModal(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95"
            title="Đổi nhân vật 3D (20 nhân vật)"
            aria-label="Đổi nhân vật"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Camera Upload Button */}
          <button
            type="button"
            onClick={handleCameraUploadClick}
            disabled={isWaitingAi}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95 disabled:opacity-50"
            title="Chụp ảnh tạo nhân vật chibi mới"
            aria-label="Chụp ảnh nhân vật"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Snapshot Button, Reset All, Voice Guide */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Snapshot Button */}
          <button
            type="button"
            onClick={handleTakePhoto}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95 text-base"
            title="Chụp ảnh lưu tác phẩm"
            aria-label="Chụp ảnh"
          >
            📸
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Bỏ hết phụ kiện"
            aria-label="Bỏ hết phụ kiện"
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
                    text: `Bé chọn nơ, mũ, kính và đồ chơi xinh cho bạn ${currentCharacter.nameVi} nhé!`,
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

      {/* 2. Main Character Stage: >= 55% OF SCREEN, NO CORNER DECORATIONS */}
      <div
        ref={characterStageRef}
        onClick={() => setSelectedInstanceId(null)}
        className="relative flex-1 min-h-0 w-full max-w-md aspect-square rounded-[26px] border-4 border-pink-400 bg-white shadow-md p-1 flex items-center justify-center overflow-hidden touch-none"
      >
        {/* Base 3D Chibi Character Image */}
        <img
          src={characterImageToDisplay}
          alt={currentCharacter.nameVi}
          className="w-full h-full object-cover rounded-[22px] pointer-events-none select-none"
        />

        {/* Placed Accessories Layer (Supports Multiple Simultaneous Items) */}
        {placedItems.map((item) => {
          const isSelected = item.instanceId === selectedInstanceId;

          return (
            <div
              key={item.instanceId}
              onPointerDown={(e) => handlePointerDown(e, item.instanceId)}
              onTouchStart={(e) => handleTouchStart(e, item.instanceId)}
              style={{
                left: `${item.xPercent}%`,
                top: `${item.yPercent}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
              }}
              className={`absolute cursor-move touch-none transition-shadow ${
                isSelected
                  ? 'ring-2 ring-pink-500 rounded-2xl drop-shadow-[0_8px_16px_rgba(236,72,153,0.35)] z-30'
                  : 'z-20 hover:drop-shadow-md'
              }`}
            >
              {/* Accessory sticker with 3-4px dark outline & shadow */}
              <img
                src={item.item.imageUrl}
                alt={item.item.nameVi}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain pointer-events-none select-none filter drop-shadow-md"
              />
            </div>
          );
        })}

        {/* Floating Quick Controls (+, -, rotate, delete) near active item */}
        {activePlacedItem && (
          <div className="absolute top-2 left-2 z-40 bg-white/95 backdrop-blur-md border-2 border-pink-300 rounded-2xl p-1 shadow-lg flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleZoom(0.15);
              }}
              className="w-8 h-8 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 flex items-center justify-center cursor-pointer transition active:scale-95 font-bold"
              title="Phóng to"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleZoom(-0.15);
              }}
              className="w-8 h-8 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 flex items-center justify-center cursor-pointer transition active:scale-95 font-bold"
              title="Thu nhỏ"
            >
              <Minus className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRotate(20);
              }}
              className="w-8 h-8 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 flex items-center justify-center cursor-pointer transition active:scale-95"
              title="Xoay"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteActive();
              }}
              className="w-8 h-8 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center cursor-pointer transition active:scale-95"
              title="Xóa phụ kiện này"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Bottom Controls Panel: <= 28% OF SCREEN */}
      <div className="w-full max-w-md shrink-0 flex flex-col gap-1">
        {/* Category Tab Row (Buttons >= 52px with 3D Chibi icons) */}
        <div className="w-full h-[54px] shrink-0 rounded-2xl border-2 border-pink-300 bg-white/95 px-1.5 flex items-center justify-between gap-1 shadow-2xs">
          {CATEGORY_TABS.map((tab) => {
            const isTabActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(tab.id);
                  playSoundEffect('pop', settings.volume);
                }}
                className={`flex-1 h-[46px] min-w-[52px] rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all select-none ${
                  isTabActive
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm scale-102 font-bold'
                    : 'hover:bg-pink-50 text-slate-700'
                }`}
                title={tab.nameVi}
                aria-label={tab.nameVi}
              >
                <img
                  src={tab.iconImage}
                  alt={tab.nameVi}
                  className="w-8 h-8 object-contain pointer-events-none filter drop-shadow-xs"
                />
              </button>
            );
          })}
        </div>

        {/* Accessory Items Row: THUMBNAILS >= 80px, CONFIRM BUTTON >= 56px */}
        <div className="w-full h-[92px] shrink-0 rounded-2xl border-2 border-pink-300 bg-[#FFFDF8] px-2 py-1 flex items-center justify-between gap-2 shadow-2xs overflow-hidden">
          <div className="flex-1 min-w-0 h-full flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {currentCategoryItems.map((item: AccessoryItem) => {
              const isEquipped = placedItems.some((p) => p.item.id === item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectAccessory(item)}
                  className={`min-w-[80px] w-20 h-20 rounded-xl border-2 p-1 flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 bg-white ${
                    isEquipped
                      ? 'border-pink-500 ring-3 ring-pink-300 scale-102 shadow-sm bg-pink-50/50'
                      : 'border-slate-200 hover:border-pink-300 shadow-2xs hover:scale-102'
                  }`}
                  title={item.nameVi}
                  aria-label={item.nameVi}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.nameVi}
                    className="w-12 h-12 object-contain pointer-events-none filter drop-shadow-xs"
                  />
                  <span className="text-[9px] font-bold text-slate-700 line-clamp-1 mt-0.5">
                    {item.nameVi}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Confirm Done Button: >= 56px */}
          <button
            type="button"
            onClick={() => {
              fireFireworksCelebration();
              speakTeacherVoice(
                [
                  {
                    lang: 'vi',
                    text: `Tuyệt đẹp! Bé đã tạo phong cách thời trang cực đáng yêu cho ${currentCharacter.nameVi}!`,
                  },
                  { lang: 'en', text: 'Gorgeous makeover! You are a brilliant fashion designer!' },
                ],
                settings
              );
              if (onWin) onWin();
            }}
            className="shrink-0 w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white flex flex-col items-center justify-center text-base cursor-pointer transition active:scale-95 shadow-md"
            title="Hoàn thành trang điểm"
            aria-label="Hoàn thành"
          >
            <Sparkles className="w-5 h-5 mb-0.5 animate-spin" />
            <span className="text-[10px] font-black">Xong</span>
          </button>
        </div>
      </div>

      {/* 4. CUTE WAITING SCREEN FOR CHIBI CAMERA (Mandatory Waiting & 60s Timeout) */}
      {isWaitingAi && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-pink-400 shadow-2xl p-6 flex flex-col items-center text-center space-y-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
              <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center text-3xl animate-pulse">
                👗
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-pink-950">
                {aiStatusText}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Thời gian xử lý: {aiElapsedSeconds}s
              </p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-pink-400 to-rose-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${aiProgress}%` }}
              />
            </div>

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
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs hover:from-pink-600 shadow-sm cursor-pointer"
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

      {/* 5. Parent Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-pink-400 shadow-2xl p-5 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <h3 className="text-base font-black text-pink-950">Góc Phụ Huynh</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ảnh được gửi tới dịch vụ AI để tạo nhân vật trang điểm, không được lưu lại.
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
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs hover:from-pink-600 shadow-sm cursor-pointer"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Interactive Square Crop Modal */}
      {showCropModal && rawUploadImage && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-pink-400 shadow-2xl p-4 flex flex-col items-center space-y-3">
            <div className="flex items-center justify-between w-full border-b border-pink-100 pb-2">
              <div className="flex items-center gap-1.5 text-pink-900 font-black text-sm">
                <Crop className="w-4 h-4 text-pink-600" />
                <span>Cắt Khung Vuông 1 Nhân Vật</span>
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
              Khung vuông bao quanh 1 nhân vật để tạo hình chibi nhé!
            </p>

            <div className="relative w-64 h-64 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-slate-700">
              <img
                src={rawUploadImage.src}
                alt="Upload preview"
                className="max-w-full max-h-full object-contain pointer-events-none"
              />
              <div className="absolute inset-0 border-4 border-pink-400 rounded-xl pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
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
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs hover:from-pink-600 shadow-sm cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Tạo nhân vật</span>
                <span>✨</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Character Picker Modal (20 3D Chibi characters) */}
      {showCharModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-pink-400 shadow-2xl p-4 flex flex-col items-center space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between w-full border-b border-pink-100 pb-2">
              <div className="flex items-center gap-1.5 text-pink-900 font-black text-sm">
                <ImageIcon className="w-4 h-4 text-pink-600" />
                <span>Chọn Bạn Nhỏ Để Phối Đồ (20 Mẫu 3D)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCharModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full">
              {PUZZLE_CHARACTERS_DATA.map((char, idx) => {
                const isCurrent = !customCharacterUrl && characterIdx === idx;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      setCharacterIdx(idx);
                      setCustomCharacterUrl(null);
                      setShowCharModal(false);
                      playSoundEffect('pop', settings.volume);
                      speakTeacherVoice([{ lang: 'vi', text: char.nameVi }], settings);
                    }}
                    className={`p-1.5 rounded-2xl border-2 flex flex-col items-center gap-1 cursor-pointer transition text-center relative ${
                      isCurrent
                        ? 'border-pink-500 bg-pink-50 shadow-md ring-2 ring-pink-400 scale-105'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute top-1 right-1 bg-pink-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                        Đang chọn
                      </span>
                    )}
                    <img
                      src={char.imageUrl}
                      alt={char.nameVi}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-2xs"
                    />
                    <span className="text-[11px] font-bold text-slate-700 line-clamp-1">
                      {char.nameVi}
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
