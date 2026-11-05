import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  Image as ImageIcon,
  Maximize2,
  User,
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

import babyCharImg from '../assets/characters/char_baby.jpg';
import teddyCharImg from '../assets/characters/char_teddy.jpg';
import petCharImg from '../assets/characters/char_pet.jpg';
import brotherCharImg from '../assets/characters/char_brother.jpg';

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

const PRESET_BABIES = [
  { id: 'preset-baby', nameVi: 'Bé Bông Thiên Thần', imageUrl: babyCharImg },
  { id: 'preset-teddy', nameVi: 'Bé Gấu Nâu Chibi', imageUrl: teddyCharImg },
  { id: 'preset-pet', nameVi: 'Bé Cún Đáng Yêu', imageUrl: petCharImg },
  { id: 'preset-brother', nameVi: 'Bé Bin Thông Minh', imageUrl: brotherCharImg },
];

export const DressUpMakeoverGame: React.FC<DressUpMakeoverGameProps> = ({
  settings,
  onBack,
  onWin,
}) => {
  const [characterIdx, setCharacterIdx] = useState<number>(0);
  const [customCharacterUrl, setCustomCharacterUrl] = useState<string | null>(null);
  const [customPhotoName, setCustomPhotoName] = useState<string>('Ảnh của bé');
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory>('hat');
  const [placedItems, setPlacedItems] = useState<PlacedAccessory[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [showCharModal, setShowCharModal] = useState<boolean>(false);
  const [showBabyPresetsModal, setShowBabyPresetsModal] = useState<boolean>(false);
  const [isPhotoFlash, setIsPhotoFlash] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Photo Pan & Zoom state (Limits: 50% to 400%, contain fit by default)
  const [photoZoom, setPhotoZoom] = useState<number>(1.0); // 0.5 .. 4.0
  const [photoPan, setPhotoPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const characterStageRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dragging accessory ref
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

  // Dragging / Pinching background photo ref
  const photoTouchRef = useRef<{
    startX: number;
    startY: number;
    initPanX: number;
    initPanY: number;
    initDist?: number;
    initZoom?: number;
    isPanning: boolean;
  } | null>(null);

  const currentCharacter: PuzzleCharacterDef =
    PUZZLE_CHARACTERS_DATA[characterIdx % PUZZLE_CHARACTERS_DATA.length];

  const characterImageToDisplay = customCharacterUrl || currentCharacter.imageUrl;
  const isCustomPhotoActive = Boolean(customCharacterUrl);

  const currentCategoryItems = useMemo(() => {
    return ACCESSORIES_DATA.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Tải trước (preloading) các món phụ kiện thuộc danh mục đang mở để bé lướt mượt mà
  useEffect(() => {
    currentCategoryItems.forEach((item) => {
      if (item.imageUrl && !item.imageUrl.startsWith('data:')) {
        const img = new Image();
        img.src = item.imageUrl;
      }
    });
  }, [currentCategoryItems]);

  const activePlacedItem = placedItems.find((p) => p.instanceId === selectedInstanceId) || null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset photo zoom & pan to default fit
  const handleResetPhotoFit = () => {
    setPhotoZoom(1.0);
    setPhotoPan({ x: 0, y: 0 });
    playSoundEffect('pop', settings.volume);
    showToast('Đã đưa ảnh vừa vặn vào khung ✨');
  };

  // Add accessory
  const handleSelectAccessory = (item: AccessoryItem) => {
    playSoundEffect('pop', settings.volume);

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
  const handleZoomAccessory = (delta: number) => {
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

  const handleRotateAccessory = (angleDelta: number) => {
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

  // Accessory Pointer Handlers
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
    };
  };

  // Touch handlers for accessory
  const handleTouchStart = (e: React.TouchEvent, instanceId: string) => {
    e.stopPropagation();
    const stage = characterStageRef.current;
    if (!stage) return;

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
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const drag = activeDragRef.current;
    const stage = characterStageRef.current;

    // If dragging an accessory:
    if (drag && stage) {
      const rect = stage.getBoundingClientRect();
      if (e.touches.length === 2 && drag.initDistance && drag.initScale !== undefined) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const scaleFactor = currentDist / drag.initDistance;
        const newScale = Math.min(2.5, Math.max(0.45, drag.initScale * scaleFactor));

        let newRotation = drag.initRotation || 0;
        if (drag.initAngle !== undefined) {
          const currentAngle =
            (Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180) / Math.PI;
          const deltaAngle = currentAngle - drag.initAngle;
          newRotation = (newRotation + deltaAngle) % 360;
        }

        setPlacedItems((prev) =>
          prev.map((item) =>
            item.instanceId === drag.instanceId
              ? { ...item, scale: Number(newScale.toFixed(2)), rotation: Math.round(newRotation) }
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
      return;
    }

    // Otherwise, handle background photo pinch-to-zoom & pan
    const photoTouch = photoTouchRef.current;
    if (photoTouch && isCustomPhotoActive) {
      if (e.touches.length === 2 && photoTouch.initDist && photoTouch.initZoom !== undefined) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const ratio = dist / photoTouch.initDist;
        const nextZoom = Math.min(4.0, Math.max(0.5, photoTouch.initZoom * ratio));
        setPhotoZoom(Number(nextZoom.toFixed(2)));
      } else if (e.touches.length === 1 && photoTouch.isPanning) {
        const t = e.touches[0];
        const dx = t.clientX - photoTouch.startX;
        const dy = t.clientY - photoTouch.startY;
        setPhotoPan({
          x: photoTouch.initPanX + dx,
          y: photoTouch.initPanY + dy,
        });
      }
    }
  };

  const handleTouchEnd = () => {
    activeDragRef.current = null;
    photoTouchRef.current = null;
  };

  // Stage pointer handlers
  const handleStagePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest?.('[data-accessory-control="true"]')) {
      return;
    }
    setSelectedInstanceId(null);
    if (!isCustomPhotoActive) return;

    photoTouchRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initPanX: photoPan.x,
      initPanY: photoPan.y,
      initZoom: photoZoom,
      isPanning: true,
    };
  };

  const handleStageTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest?.('[data-accessory-control="true"]')) {
      return;
    }
    setSelectedInstanceId(null);
    if (!isCustomPhotoActive) return;

    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      photoTouchRef.current = {
        startX: (t1.clientX + t2.clientX) / 2,
        startY: (t1.clientY + t2.clientY) / 2,
        initPanX: photoPan.x,
        initPanY: photoPan.y,
        initDist: dist,
        initZoom: photoZoom,
        isPanning: false,
      };
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      photoTouchRef.current = {
        startX: t.clientX,
        startY: t.clientY,
        initPanX: photoPan.x,
        initPanY: photoPan.y,
        initZoom: photoZoom,
        isPanning: true,
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = activeDragRef.current;
    const stage = characterStageRef.current;

    if (drag && stage) {
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
      return;
    }

    const photoTouch = photoTouchRef.current;
    if (photoTouch && photoTouch.isPanning && isCustomPhotoActive) {
      const dx = e.clientX - photoTouch.startX;
      const dy = e.clientY - photoTouch.startY;
      setPhotoPan({
        x: photoTouch.initPanX + dx,
        y: photoTouch.initPanY + dy,
      });
    }
  };

  const handlePointerUp = () => {
    activeDragRef.current = null;
    photoTouchRef.current = null;
  };

  // Wheel zoom on custom photo
  const handleWheel = (e: React.WheelEvent) => {
    if (!isCustomPhotoActive) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const nextZoom = Math.min(4.0, Math.max(0.5, photoZoom + delta));
    setPhotoZoom(Number(nextZoom.toFixed(2)));
  };

  // Photo Snapshot feature (Composite canvas with background + accessories)
  const handleTakePhoto = async () => {
    playSoundEffect('sparkle', settings.volume);
    setIsPhotoFlash(true);
    setTimeout(() => setIsPhotoFlash(false), 300);

    fireFireworksCelebration();

    // Render snapshot onto offscreen 600x600 canvas
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 600, 600);

        // Load background image
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          bgImg.onload = () => resolve();
          bgImg.onerror = reject;
          bgImg.src = characterImageToDisplay;
        });

        ctx.save();
        // Clip to rounded bounds
        ctx.beginPath();
        ctx.arc(300, 300, 290, 0, Math.PI * 2);
        ctx.clip();

        // Draw character / custom photo with pan and zoom
        if (isCustomPhotoActive) {
          ctx.translate(300 + photoPan.x, 300 + photoPan.y);
          ctx.scale(photoZoom, photoZoom);
          // Contain fit
          const scale = Math.min(600 / bgImg.width, 600 / bgImg.height);
          const dw = bgImg.width * scale;
          const dh = bgImg.height * scale;
          ctx.drawImage(bgImg, -dw / 2, -dh / 2, dw, dh);
        } else {
          ctx.drawImage(bgImg, 0, 0, 600, 600);
        }
        ctx.restore();

        // Draw each placed accessory
        for (const item of placedItems) {
          const accImg = new Image();
          const targetUrl = item.item.imageUrl;
          if (!targetUrl.startsWith('data:')) {
            accImg.crossOrigin = 'anonymous';
          }
          await new Promise<void>((resolve) => {
            accImg.onload = () => resolve();
            accImg.onerror = () => {
              if (item.item.fallbackUrl && item.item.fallbackUrl !== targetUrl) {
                accImg.onload = () => resolve();
                accImg.onerror = () => resolve();
                accImg.src = item.item.fallbackUrl;
              } else {
                resolve();
              }
            };
            accImg.src = targetUrl;
          });

          ctx.save();
          const posX = (item.xPercent / 100) * 600;
          const posY = (item.yPercent / 100) * 600;
          ctx.translate(posX, posY);
          ctx.rotate((item.rotation * Math.PI) / 180);
          ctx.scale(item.scale, item.scale);

          // Standard size ~ 110px
          const size = 110;
          ctx.drawImage(accImg, -size / 2, -size / 2, size, size);
          ctx.restore();
        }

        // Trigger safe client-side download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `trang-diem-be-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch {
      // Fallback
    }

    showToast('Tách! Đã lưu ảnh kỷ niệm xinh xắn cho bé 📸');
    speakTeacherVoice(
      [
        {
          lang: 'vi',
          text: `Tách! Bé đã chụp lại diện mạo xinh xắn cho ${isCustomPhotoActive ? customPhotoName : currentCharacter.nameVi} rồi!`,
        },
        { lang: 'en', text: 'Stunning makeover photoshoot! Beautiful styling!' },
      ],
      settings
    );
  };

  // File picker handler: DIRECTLY SET PHOTO AS CHARACTER, NO AI, NO CROP MODAL
  const handleCameraUploadClick = () => {
    playSoundEffect('pop', settings.volume);
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomCharacterUrl(dataUrl);
      setCustomPhotoName('Ảnh của bé');
      setPhotoZoom(1.0);
      setPhotoPan({ x: 0, y: 0 });
      playSoundEffect('sparkle', settings.volume);
      showToast('Đã đặt ảnh bé vào khung! Dùng tay kéo & phóng to thu nhỏ nhé 🌟');
      speakTeacherVoice(
        [{ lang: 'vi', text: 'Ảnh của bé đã vào khung! Bé hãy chọn mũ, kính và nơ xinh để diện đồ nhé!' }],
        settings
      );
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Select Preset Baby Model
  const handleSelectPresetBaby = (baby: typeof PRESET_BABIES[0]) => {
    setCustomCharacterUrl(baby.imageUrl);
    setCustomPhotoName(baby.nameVi);
    setPhotoZoom(1.0);
    setPhotoPan({ x: 0, y: 0 });
    setShowBabyPresetsModal(false);
    playSoundEffect('sparkle', settings.volume);
    showToast(`Đã chọn ${baby.nameVi} để trang điểm ✨`);
    speakTeacherVoice([{ lang: 'vi', text: `Bé diện đồ cho bạn ${baby.nameVi} nhé!` }], settings);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full max-h-[100dvh] flex flex-col justify-between items-center bg-gradient-to-b from-pink-50/70 via-purple-50/30 to-rose-50/70 p-1 sm:p-2 select-none overflow-hidden font-sans"
    >
      {/* Hidden File Input for Device Photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* Snapshot Flash Overlay */}
      {isPhotoFlash && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none animate-out fade-out duration-300" />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 z-50 bg-pink-900 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span>💖</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <div className="w-full max-w-md h-11 sm:h-12 shrink-0 rounded-2xl border-2 border-pink-400 bg-white/95 backdrop-blur-md px-2 shadow-2xs flex items-center justify-between gap-1">
        {/* Left: Back, 20 Characters Selector, Preset Baby Models, Camera */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Quay lại sân chơi"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* 20 Characters Modal Button */}
          <button
            type="button"
            onClick={() => setShowCharModal(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95"
            title="Chọn 20 nhân vật 3D"
            aria-label="Chọn nhân vật"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Preset Baby Models Button */}
          <button
            type="button"
            onClick={() => setShowBabyPresetsModal(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 text-amber-950 flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95"
            title="Ảnh mẫu em bé dễ thương"
            aria-label="Mẫu em bé"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Blue Camera Button: DIRECT LOAD INTO FRAME, NO AI WAITING */}
          <button
            type="button"
            onClick={handleCameraUploadClick}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95"
            title="Chụp hoặc chọn ảnh từ máy để diện đồ"
            aria-label="Chụp ảnh nhân vật"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Snapshot Button, Reset All, Voice Guide */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleTakePhoto}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white flex items-center justify-center cursor-pointer shadow-2xs transition active:scale-95 text-base"
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
                    text: `Bé chọn nơ, mũ, kính và đồ chơi xinh cho bạn ${isCustomPhotoActive ? customPhotoName : currentCharacter.nameVi} nhé!`,
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

      {/* 2. Main Character Stage: >= 55% OF SCREEN */}
      <div
        ref={characterStageRef}
        onPointerDown={handleStagePointerDown}
        onTouchStart={handleStageTouchStart}
        onWheel={handleWheel}
        className="relative flex-1 min-h-0 w-full max-w-md aspect-square rounded-[26px] border-4 border-pink-400 bg-white shadow-md p-1 flex items-center justify-center overflow-hidden touch-none"
      >
        {/* Base Character / Custom Photo Layer */}
        <div className="w-full h-full rounded-[22px] overflow-hidden flex items-center justify-center relative bg-pink-50/20">
          <img
            src={characterImageToDisplay}
            alt={isCustomPhotoActive ? customPhotoName : currentCharacter.nameVi}
            style={
              isCustomPhotoActive
                ? {
                    transform: `translate(${photoPan.x}px, ${photoPan.y}px) scale(${photoZoom})`,
                    transition: photoTouchRef.current ? 'none' : 'transform 0.15s ease-out',
                  }
                : undefined
            }
            className={`w-full h-full ${
              isCustomPhotoActive ? 'object-contain' : 'object-cover'
            } pointer-events-none select-none`}
          />
        </div>

        {/* Reset Frame Button (Vừa khung) when custom photo is active */}
        {isCustomPhotoActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetPhotoFit();
            }}
            className="absolute bottom-2 left-2 z-40 px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-pink-300 text-pink-900 text-xs font-black flex items-center gap-1 shadow-md cursor-pointer transition active:scale-95 hover:bg-pink-50"
            title="Đưa ảnh vừa khung mặc định (50%-400%)"
          >
            <Maximize2 className="w-3.5 h-3.5 text-pink-600" />
            <span>Vừa khung</span>
            <span className="text-[10px] text-pink-500 font-mono">({Math.round(photoZoom * 100)}%)</span>
          </button>
        )}

        {/* Placed Accessories Layer */}
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
              <img
                src={item.item.imageUrl}
                alt={item.item.nameVi}
                onError={(e) => {
                  if (item.item.fallbackUrl && e.currentTarget.src !== item.item.fallbackUrl) {
                    e.currentTarget.src = item.item.fallbackUrl;
                  }
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain pointer-events-none select-none filter drop-shadow-sm"
              />
            </div>
          );
        })}

        {/* Floating Quick Controls (+, -, rotate, delete) near active item */}
        {activePlacedItem && (
          <div
            data-accessory-control="true"
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 left-2 z-40 bg-white/95 backdrop-blur-md border-2 border-pink-400 rounded-2xl p-1.5 shadow-xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-1 pl-1 pr-1.5 py-0.5 rounded-xl bg-pink-50 border border-pink-200">
              <span className="text-xs font-black text-pink-900 max-w-[85px] sm:max-w-[120px] truncate">
                {activePlacedItem.item.nameVi}
              </span>
            </div>

            <button
              type="button"
              data-accessory-control="true"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                handleZoomAccessory(0.15);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-100 hover:bg-sky-200 active:scale-90 text-sky-800 border border-sky-300 flex items-center justify-center cursor-pointer transition shadow-2xs font-black"
              title="Phóng to phụ kiện (+15%)"
              aria-label="Phóng to phụ kiện"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              data-accessory-control="true"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                handleZoomAccessory(-0.15);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-90 text-amber-800 border border-amber-300 flex items-center justify-center cursor-pointer transition shadow-2xs font-black"
              title="Thu nhỏ phụ kiện (-15%)"
              aria-label="Thu nhỏ phụ kiện"
            >
              <Minus className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              data-accessory-control="true"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                handleRotateAccessory(20);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 hover:bg-purple-200 active:scale-90 text-purple-800 border border-purple-300 flex items-center justify-center cursor-pointer transition shadow-2xs font-bold"
              title="Xoay phụ kiện (+20°)"
              aria-label="Xoay phụ kiện"
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              data-accessory-control="true"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteActive();
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-100 hover:bg-rose-200 active:scale-90 text-rose-700 border border-rose-300 flex items-center justify-center cursor-pointer transition shadow-2xs"
              title="Xóa phụ kiện này"
              aria-label="Xóa phụ kiện"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Bottom Controls Panel */}
      <div className="w-full max-w-md shrink-0 flex flex-col gap-1">
        {/* Category Tab Row */}
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

        {/* Accessory Items Row */}
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
                    loading="lazy"
                    onError={(e) => {
                      if (item.fallbackUrl && e.currentTarget.src !== item.fallbackUrl) {
                        e.currentTarget.src = item.fallbackUrl;
                      }
                    }}
                    className="w-12 h-12 object-contain pointer-events-none filter drop-shadow-xs"
                  />
                  <span className="text-[9px] font-bold text-slate-700 line-clamp-1 mt-0.5">
                    {item.nameVi}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Confirm Done Button */}
          <button
            type="button"
            onClick={() => {
              fireFireworksCelebration();
              speakTeacherVoice(
                [
                  {
                    lang: 'vi',
                    text: `Tuyệt đẹp! Bé đã tạo phong cách thời trang cực đáng yêu cho ${isCustomPhotoActive ? customPhotoName : currentCharacter.nameVi}!`,
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

      {/* 4. Preset Baby Models Modal */}
      {showBabyPresetsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-4 flex flex-col items-center space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between w-full border-b border-amber-100 pb-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-black text-sm">
                <User className="w-4 h-4 text-amber-600" />
                <span>Mẫu Ảnh Em Bé Dễ Thương</span>
              </div>
              <button
                type="button"
                onClick={() => setShowBabyPresetsModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-600 text-center">
              Chọn một bé mẫu để trải nghiệm ngay căn chỉnh và đeo phụ kiện nhé!
            </p>

            <div className="grid grid-cols-2 gap-2.5 w-full">
              {PRESET_BABIES.map((baby) => {
                const isSelected = customCharacterUrl === baby.imageUrl;
                return (
                  <button
                    key={baby.id}
                    type="button"
                    onClick={() => handleSelectPresetBaby(baby)}
                    className={`p-2 rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition text-center ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400 scale-102'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={baby.imageUrl}
                      alt={baby.nameVi}
                      className="w-24 h-24 rounded-xl object-cover border border-slate-100 shadow-xs"
                    />
                    <span className="text-xs font-black text-slate-800 line-clamp-1">
                      {baby.nameVi}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Character Picker Modal (20 3D Chibi characters) */}
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
                      setPhotoZoom(1.0);
                      setPhotoPan({ x: 0, y: 0 });
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
