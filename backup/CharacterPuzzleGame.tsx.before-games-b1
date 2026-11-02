import React, { useState, useMemo, useEffect } from 'react';
import { Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import type { ParentSettings } from '../types/learning';
import { playGentleEncourageTone, playSoundEffect, speakTeacherVoice } from '../utils/audioEngine';
import { fireFireworksCelebration } from '../utils/confetti';

interface CharacterPuzzleGameProps {
  settings: ParentSettings;
  onWin?: () => void;
  onGentleRetry?: (msgVi: string, msgEn: string) => void;
}

interface PuzzleCharacterTemplate {
  id: string;
  nameVi: string;
  nameEn: string;
  emoji: string;
  taglineVi: string;
  bgColor: string;
  accentColor: string;
  svgContent: React.ReactNode;
}

// 8 Nhân vật đáng yêu đa dạng cho bé ghép hình
const PUZZLE_CHARACTERS: PuzzleCharacterTemplate[] = [
  {
    id: 'doctor-kid',
    nameVi: 'Bác Sĩ Nhí Tí Hon',
    nameEn: 'Little Doctor',
    emoji: '👩‍⚕️',
    taglineVi: 'Bác sĩ nhí tận tâm khám bệnh giúp bạn gấu khỏe mạnh',
    bgColor: '#E0F2FE',
    accentColor: '#0284C7',
    svgContent: (
      <g>
        {/* Sky background */}
        <rect width="300" height="300" rx="20" fill="#F0F9FF" />
        <circle cx="150" cy="150" r="110" fill="#E0F2FE" />
        {/* Doctor Coat */}
        <rect x="90" y="150" width="120" height="120" rx="20" fill="#FFFFFF" stroke="#0284C7" strokeWidth="4" />
        <line x1="150" y1="150" x2="150" y2="270" stroke="#0284C7" strokeWidth="3" strokeDasharray="6,4" />
        {/* Tie & Collar */}
        <polygon points="150,150 135,180 150,195 165,180" fill="#38BDF8" />
        <path d="M120 150 L150 170 L180 150" stroke="#0284C7" strokeWidth="3" fill="none" />
        {/* Stethoscope */}
        <path d="M115 170 C115 225, 185 225, 185 170" fill="none" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" />
        <circle cx="150" cy="225" r="12" fill="#F97316" stroke="#9A3412" strokeWidth="3" />
        {/* Head */}
        <circle cx="150" cy="95" r="48" fill="#FED7AA" stroke="#D97706" strokeWidth="3.5" />
        {/* Hair */}
        <path d="M102 90 C102 50, 198 50, 198 90 C185 70, 165 72, 150 72 C135 72, 115 70, 102 90 Z" fill="#78350F" />
        {/* Doctor Hat */}
        <path d="M120 52 L180 52 L175 32 L125 32 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
        <path d="M145 36 L155 36 M150 31 L150 41" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
        {/* Eyes & Smile */}
        <circle cx="132" cy="95" r="5" fill="#1E293B" />
        <circle cx="168" cy="95" r="5" fill="#1E293B" />
        <circle cx="130" cy="93" r="1.8" fill="#FFFFFF" />
        <circle cx="166" cy="93" r="1.8" fill="#FFFFFF" />
        {/* Rosy cheeks */}
        <circle cx="124" cy="106" r="6" fill="#FDA4AF" opacity="0.8" />
        <circle cx="176" cy="106" r="6" fill="#FDA4AF" opacity="0.8" />
        {/* Smile */}
        <path d="M142 110 Q150 120 158 110" fill="none" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
        {/* Sparkles */}
        <text x="220" y="70" fontSize="28">✨</text>
        <text x="40" y="240" fontSize="24">💊</text>
      </g>
    ),
  },
  {
    id: 'firefighter-kid',
    nameVi: 'Chú Lính Cứu Hỏa',
    nameEn: 'Brave Firefighter',
    emoji: '🧑‍🚒',
    taglineVi: 'Chiến sĩ dũng cảm bảo vệ mọi người và thành phố',
    bgColor: '#FEE2E2',
    accentColor: '#EF4444',
    svgContent: (
      <g>
        <rect width="300" height="300" rx="20" fill="#FEF2F2" />
        <circle cx="150" cy="150" r="110" fill="#FEE2E2" />
        {/* Firefighter Uniform */}
        <rect x="90" y="150" width="120" height="120" rx="20" fill="#F97316" stroke="#9A3412" strokeWidth="4" />
        {/* Reflective Stripes */}
        <rect x="90" y="190" width="120" height="16" fill="#FACC15" />
        <rect x="90" y="240" width="120" height="14" fill="#FACC15" />
        {/* Head */}
        <circle cx="150" cy="95" r="48" fill="#FED7AA" stroke="#D97706" strokeWidth="3.5" />
        {/* Yellow Fire Helmet */}
        <path d="M96 75 C96 35, 204 35, 204 75 L218 78 L82 78 Z" fill="#EAB308" stroke="#A16207" strokeWidth="4" />
        <rect x="135" y="38" width="30" height="24" rx="6" fill="#EF4444" />
        <circle cx="150" cy="50" r="4" fill="#FFFFFF" />
        {/* Eyes & Smile */}
        <circle cx="132" cy="95" r="5" fill="#1E293B" />
        <circle cx="168" cy="95" r="5" fill="#1E293B" />
        <circle cx="130" cy="93" r="1.8" fill="#FFFFFF" />
        <circle cx="166" cy="93" r="1.8" fill="#FFFFFF" />
        <circle cx="124" cy="106" r="6" fill="#FCA5A5" opacity="0.8" />
        <circle cx="176" cy="106" r="6" fill="#FCA5A5" opacity="0.8" />
        <path d="M142 112 Q150 122 158 112" fill="none" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
        {/* Water Hose */}
        <path d="M60 270 Q100 230 110 200" fill="none" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
        <path d="M50 260 L65 275 L75 265" stroke="#E2E8F0" strokeWidth="6" />
        <text x="215" y="80" fontSize="28">🚒</text>
        <text x="40" y="90" fontSize="26">💧</text>
      </g>
    ),
  },
  {
    id: 'astronaut-kid',
    nameVi: 'Bé Phi Hành Gia',
    nameEn: 'Cute Astronaut',
    emoji: '🧑‍🚀',
    taglineVi: 'Bé bay vào không gian khám phá những vì sao kỳ diệu',
    bgColor: '#EDE9FE',
    accentColor: '#8B5CF6',
    svgContent: (
      <g>
        <rect width="300" height="300" rx="20" fill="#0F172A" />
        {/* Stars in space */}
        <circle cx="40" cy="40" r="2.5" fill="#FDE047" />
        <circle cx="260" cy="50" r="3" fill="#FDE047" />
        <circle cx="50" cy="230" r="2" fill="#FDE047" />
        <circle cx="250" cy="240" r="2.5" fill="#FDE047" />
        <text x="230" y="110" fontSize="24">🪐</text>
        <text x="35" y="140" fontSize="24">🚀</text>
        {/* Spacesuit Body */}
        <rect x="90" y="155" width="120" height="115" rx="22" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="4" />
        <rect x="130" y="180" width="40" height="30" rx="8" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
        <circle cx="140" cy="195" r="4" fill="#EF4444" />
        <circle cx="160" cy="195" r="4" fill="#22C55E" />
        {/* Helmet */}
        <circle cx="150" cy="98" r="56" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="4.5" />
        {/* Glass Visor */}
        <ellipse cx="150" cy="98" rx="42" ry="34" fill="#0284C7" stroke="#38BDF8" strokeWidth="3" />
        <ellipse cx="138" cy="88" rx="14" ry="6" fill="#FFFFFF" opacity="0.65" transform="rotate(-15 138 88)" />
        {/* Face inside helmet */}
        <circle cx="135" cy="100" r="4" fill="#FFFFFF" />
        <circle cx="165" cy="100" r="4" fill="#FFFFFF" />
        <path d="M143 112 Q150 120 157 112" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: 'superhero-kid',
    nameVi: 'Siêu Nhân Tí Hon',
    nameEn: 'Mini Superhero',
    emoji: '🦸',
    taglineVi: 'Siêu nhân tí hon dũng cảm bay lượn trên bầu trời xanh',
    bgColor: '#FEF08A',
    accentColor: '#CA8A04',
    svgContent: (
      <g>
        <rect width="300" height="300" rx="20" fill="#FEFCE8" />
        <circle cx="150" cy="150" r="110" fill="#FEF08A" />
        {/* Cape */}
        <path d="M80 150 L60 270 L240 270 L220 150 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
        {/* Suit */}
        <rect x="95" y="150" width="110" height="115" rx="20" fill="#2563EB" stroke="#1D4ED8" strokeWidth="4" />
        {/* Chest Star Emblem */}
        <polygon points="150,175 156,192 174,192 160,203 165,220 150,210 135,220 140,203 126,192 144,192" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
        {/* Yellow Belt */}
        <rect x="95" y="235" width="110" height="14" fill="#FACC15" />
        {/* Head */}
        <circle cx="150" cy="95" r="48" fill="#FED7AA" stroke="#D97706" strokeWidth="3.5" />
        {/* Hair */}
        <path d="M102 90 C102 48, 198 48, 198 90 C180 65, 120 65, 102 90 Z" fill="#1E293B" />
        {/* Mask */}
        <path d="M110 88 C130 98, 170 98, 190 88 C185 106, 115 106, 110 88 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
        {/* Eyes inside mask */}
        <ellipse cx="132" cy="95" rx="5" ry="4" fill="#FFFFFF" />
        <ellipse cx="168" cy="95" rx="5" ry="4" fill="#FFFFFF" />
        <circle cx="132" cy="95" r="2.5" fill="#1E293B" />
        <circle cx="168" cy="95" r="2.5" fill="#1E293B" />
        {/* Smile */}
        <path d="M142 116 Q150 126 158 116" fill="none" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
        <text x="215" y="75" fontSize="28">⚡</text>
        <text x="40" y="80" fontSize="26">⭐</text>
      </g>
    ),
  },
  {
    id: 'mermaid',
    nameVi: 'Nàng Tiên Cá',
    nameEn: 'Little Mermaid',
    emoji: '🧜‍♀️',
    taglineVi: 'Nàng tiên cá bơi lội vui đùa cùng các bạn cá heo dưới đại dương',
    bgColor: '#CCFBF1',
    accentColor: '#0D9488',
    svgContent: (
      <g>
        <rect width="300" height="300" rx="20" fill="#F0FDFA" />
        <circle cx="150" cy="150" r="110" fill="#CCFBF1" />
        {/* Bubbles */}
        <circle cx="60" cy="60" r="8" fill="#5EEAD4" opacity="0.6" />
        <circle cx="240" cy="80" r="10" fill="#5EEAD4" opacity="0.6" />
        <circle cx="50" cy="200" r="6" fill="#5EEAD4" opacity="0.6" />
        {/* Tail */}
        <path d="M130 180 C130 230, 160 250, 170 280 C150 270, 120 285, 110 275 C130 260, 130 230, 130 180 Z" fill="#0D9488" stroke="#115E59" strokeWidth="3" />
        <polygon points="170,280 195,295 185,275 195,260" fill="#14B8A6" />
        <polygon points="110,275 90,290 100,270 90,255" fill="#14B8A6" />
        {/* Body Top */}
        <rect x="115" y="145" width="70" height="40" rx="15" fill="#FED7AA" />
        <path d="M125 155 C125 145, 140 145, 145 155 C150 145, 165 145, 165 155" fill="#EC4899" stroke="#BE185D" strokeWidth="2.5" />
        {/* Head */}
        <circle cx="150" cy="95" r="45" fill="#FED7AA" stroke="#D97706" strokeWidth="3" />
        {/* Long Red Hair */}
        <path d="M105 90 C105 40, 195 40, 195 90 C210 130, 190 180, 175 190 C165 130, 185 90, 150 75 C115 90, 135 130, 125 190 C110 180, 90 130, 105 90 Z" fill="#E11D48" />
        {/* Crown Starfish */}
        <polygon points="150,45 153,52 160,52 155,57 157,64 150,60 143,64 145,57 140,52 147,52" fill="#FACC15" />
        {/* Eyes & Smile */}
        <circle cx="135" cy="95" r="4.5" fill="#047857" />
        <circle cx="165" cy="95" r="4.5" fill="#047857" />
        <circle cx="133" cy="93" r="1.5" fill="#FFFFFF" />
        <circle cx="163" cy="93" r="1.5" fill="#FFFFFF" />
        <circle cx="128" cy="104" r="5" fill="#FDA4AF" opacity="0.8" />
        <circle cx="172" cy="104" r="5" fill="#FDA4AF" opacity="0.8" />
        <path d="M143 110 Q150 118 157 110" fill="none" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
        <text x="215" y="160" fontSize="24">🐬</text>
        <text x="40" y="130" fontSize="22">🐚</text>
      </g>
    ),
  },
  {
    id: 'cute-dino',
    nameVi: 'Khủng Long Tốt Bụng',
    nameEn: 'Friendly Dino',
    emoji: '🦖',
    taglineVi: 'Chú khủng long xanh lá mập mạp, vui tính và thích ăn hoa quả',
    bgColor: '#DCFCE7',
    accentColor: '#16A34A',
    svgContent: (
      <g>
        <rect width="300" height="300" rx="20" fill="#F0FDF4" />
        <circle cx="150" cy="150" r="110" fill="#DCFCE7" />
        {/* Tail */}
        <path d="M90 200 C50 200, 30 170, 30 150 C50 160, 80 180, 100 190 Z" fill="#22C55E" stroke="#15803D" strokeWidth="3" />
        {/* Big Round Body */}
        <ellipse cx="150" cy="180" rx="65" ry="75" fill="#22C55E" stroke="#15803D" strokeWidth="4" />
        {/* Pale Green Belly */}
        <ellipse cx="150" cy="190" rx="42" ry="50" fill="#BBF7D0" />
        {/* Back Plates / Spikes */}
        <polygon points="135,105 145,85 155,105" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
        <polygon points="110,120 120,100 130,120" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
        <polygon points="90,145 100,125 110,145" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
        {/* Dino Head */}
        <path d="M120 130 C120 70, 210 70, 210 130 C210 160, 150 160, 120 130 Z" fill="#22C55E" stroke="#15803D" strokeWidth="4" />
        {/* Dino Nostrils */}
        <circle cx="195" cy="120" r="3" fill="#15803D" />
        {/* Big Cute Eye */}
        <circle cx="160" cy="98" r="14" fill="#FFFFFF" stroke="#15803D" strokeWidth="2.5" />
        <circle cx="162" cy="98" r="8" fill="#0F172A" />
        <circle cx="159" cy="95" r="3" fill="#FFFFFF" />
        {/* Cheerful Smile */}
        <path d="M170 135 Q185 145 195 130" fill="none" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
        {/* Cheek */}
        <circle cx="148" cy="118" r="7" fill="#FCA5A5" opacity="0.8" />
        {/* Feet */}
        <ellipse cx="120" cy="255" rx="18" ry="12" fill="#16A34A" stroke="#15803D" strokeWidth="3" />
        <ellipse cx="180" cy="255" rx="18" ry="12" fill="#16A34A" stroke="#15803D" strokeWidth="3" />
        <text x="220" y="70" fontSize="26">🌿</text>
        <text x="40" y="80" fontSize="26">🌴</text>
      </g>
    ),
  },
];

export const CharacterPuzzleGame: React.FC<CharacterPuzzleGameProps> = ({
  settings,
  onWin,
  onGentleRetry,
}) => {
  const [templateIdx, setTemplateIdx] = useState(0);
  const [pieceCount, setPieceCount] = useState<4 | 6 | 9>(4);
  const [showGhostHint, setShowGhostHint] = useState(false);
  const [placedSlots, setPlacedSlots] = useState<Record<number, number>>({});
  const [selectedPieceIdx, setSelectedPieceIdx] = useState<number | null>(null);
  const [showPickerModal, setShowPickerModal] = useState(false);

  const currentTemplate = PUZZLE_CHARACTERS[templateIdx % PUZZLE_CHARACTERS.length];

  // Grid configuration:
  // 4 pieces = 2x2
  // 6 pieces = 3 cols x 2 rows
  // 9 pieces = 3 cols x 3 rows
  const { cols, rows } = useMemo(() => {
    if (pieceCount === 4) return { cols: 2, rows: 2 };
    if (pieceCount === 6) return { cols: 3, rows: 2 };
    return { cols: 3, rows: 3 };
  }, [pieceCount]);

  const totalPieces = cols * rows;

  // Unplaced pieces for the tray
  const unplacedPieces = useMemo(() => {
    const placedIndices = new Set(Object.values(placedSlots));
    const list: number[] = [];
    for (let i = 0; i < totalPieces; i++) {
      if (!placedIndices.has(i)) {
        list.push(i);
      }
    }
    // Stable pseudo-random shuffle so pieces aren't in trivial order
    return list.sort((a, b) => ((a * 7 + templateIdx * 3) % totalPieces) - ((b * 7 + templateIdx * 3) % totalPieces));
  }, [totalPieces, placedSlots, templateIdx]);

  // Reset puzzle when template or piece count changes
  const handleReset = () => {
    setPlacedSlots({});
    setSelectedPieceIdx(null);
    playSoundEffect('pop', settings.volume);
  };

  useEffect(() => {
    setPlacedSlots({});
    setSelectedPieceIdx(null);
  }, [templateIdx, pieceCount]);

  const handleSlotClick = (slotIdx: number, e: React.MouseEvent) => {
    // If slot is already correctly filled, ignore
    if (placedSlots[slotIdx] !== undefined) return;

    if (selectedPieceIdx === null) {
      // Prompt child to pick a piece first
      speakTeacherVoice(
        [{ lang: 'vi', text: 'Bé hãy chạm chọn 1 mảnh ghép ở hàng dưới trước nhé!' }],
        settings
      );
      return;
    }

    // Check if the piece belongs in this slot
    if (selectedPieceIdx === slotIdx) {
      playSoundEffect('sparkle', settings.volume);
      const nextPlaced = { ...placedSlots, [slotIdx]: selectedPieceIdx };
      setPlacedSlots(nextPlaced);
      setSelectedPieceIdx(null);

      // Check win condition
      if (Object.keys(nextPlaced).length >= totalPieces) {
        fireFireworksCelebration();
        speakTeacherVoice(
          [
            { lang: 'en', text: `Great job! ${currentTemplate.nameEn}!` },
            {
              lang: 'vi',
              text: `Tuyệt vời! Bé đã ghép hoàn thành bức tranh ${currentTemplate.nameVi} rồi!`,
            },
          ],
          settings
        );
        if (onWin) onWin();
      } else {
        speakTeacherVoice(
          [{ lang: 'vi', text: 'Đúng rồi! Mảnh ghép vừa khít luôn!' }],
          settings
        );
      }
    } else {
      playGentleEncourageTone(settings.volume);
      if (onGentleRetry) {
        onGentleRetry(
          'Mảnh ghép này chưa đúng vị trí này bé ơi. Bé quan sát hình mẫu và thử lại nhé!',
          'Try another slot!'
        );
      }
    }
  };

  const isCompleted = Object.keys(placedSlots).length === totalPieces;

  return (
    <div className="w-full flex flex-col items-center gap-2 select-none">
      {/* 1. Sub-Toolbar in Amber Border Box (Matches Design System Standard) */}
      <div className="w-full max-w-lg rounded-2xl border-2 border-amber-400 bg-[#FFFDF5] p-2 shadow-2xs flex items-center justify-between gap-1.5 flex-wrap">
        {/* Left: Template Selector Pill */}
        <button
          type="button"
          onClick={() => setShowPickerModal(true)}
          className="min-h-[38px] px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs transition active:scale-95 shrink-0"
        >
          <span>📖</span>
          <span className="truncate max-w-[130px] sm:max-w-[170px]">
            {currentTemplate.emoji} {currentTemplate.nameVi}
          </span>
          <span className="text-amber-200 text-xs">▼</span>
        </button>

        {/* Center: Piece Count Switcher (4, 6, 9 Mảnh) */}
        <div className="flex items-center bg-amber-100/80 p-0.5 rounded-xl border border-amber-300/80 shrink-0">
          {[4, 6, 9].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setPieceCount(count as 4 | 6 | 9)}
              className={`px-2 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                pieceCount === count
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              {count} mảnh
            </button>
          ))}
        </div>

        {/* Right: Eye Hint Toggle & Reset */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Eye Button to toggle ghost preview / sample reference */}
          <button
            type="button"
            onClick={() => {
              const next = !showGhostHint;
              setShowGhostHint(next);
              playSoundEffect('pop', settings.volume);
              speakTeacherVoice(
                [
                  {
                    lang: 'vi',
                    text: next ? 'Cô bật hình mẫu gợi ý cho bé nhé!' : 'Tắt hình gợi ý để bé trổ tài!',
                  },
                ],
                settings
              );
            }}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base cursor-pointer transition ${
              showGhostHint
                ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-xs scale-105'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Bật / Tắt hình mẫu gợi ý"
            aria-label="Hình mẫu gợi ý"
          >
            👁️
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Xáo trộn và ghép lại từ đầu"
            aria-label="Ghép lại"
          >
            🔄
          </button>
        </div>
      </div>

      {/* 2. Main Puzzle Board in Golden Border Container */}
      <div className="relative w-full max-w-md sm:max-w-lg aspect-square rounded-[32px] border-4 border-amber-400 bg-white shadow-md p-3 sm:p-4 flex flex-col items-center justify-center overflow-hidden">
        {/* Top-Right Mini Complete Sample Preview (Shown when Eye 👁️ is clicked) */}
        {showGhostHint && (
          <div className="absolute top-2.5 right-2.5 z-20 bg-white/95 backdrop-blur-xs border-2 border-amber-300 rounded-2xl p-1.5 shadow-md flex flex-col items-center select-none animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-1 text-[9px] font-black text-amber-800 uppercase tracking-wider mb-0.5">
              <span>🎨</span> Mẫu
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
              <svg viewBox="0 0 300 300" className="w-full h-full">
                {currentTemplate.svgContent}
              </svg>
            </div>
          </div>
        )}

        {/* Ghost background guide on the board when hint is active */}
        {showGhostHint && !isCompleted && (
          <div className="absolute inset-4 opacity-30 pointer-events-none rounded-2xl overflow-hidden">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {currentTemplate.svgContent}
            </svg>
          </div>
        )}

        {/* Puzzle Grid Slots */}
        <div
          className="w-full h-full grid gap-1.5 sm:gap-2 relative z-10"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: totalPieces }).map((_, slotIdx) => {
            const placedPiece = placedSlots[slotIdx];
            const isFilled = placedPiece !== undefined;

            const row = Math.floor(slotIdx / cols);
            const col = slotIdx % cols;

            const slotWidth = 300 / cols;
            const slotHeight = 300 / rows;
            const viewBoxX = col * slotWidth;
            const viewBoxY = row * slotHeight;

            return (
              <div
                key={`slot-${slotIdx}`}
                onClick={(e) => handleSlotClick(slotIdx, e)}
                className={`rounded-2xl relative overflow-hidden transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  isFilled
                    ? 'border-2 border-emerald-400 bg-white shadow-xs'
                    : selectedPieceIdx !== null
                    ? 'border-2 border-dashed border-amber-400 bg-amber-50/70 hover:bg-amber-100/80 animate-pulse'
                    : 'border-2 border-dashed border-slate-200 bg-slate-50/70 hover:border-amber-300'
                }`}
              >
                {isFilled ? (
                  <svg
                    viewBox={`${viewBoxX} ${viewBoxY} ${slotWidth} ${slotHeight}`}
                    className="w-full h-full object-cover"
                  >
                    {currentTemplate.svgContent}
                  </svg>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <span className="text-sm font-black text-slate-300">
                      {slotIdx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Chạm đặt</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Full Celebration Overlay when finished */}
        {isCompleted && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs z-30 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in-95 duration-300">
            <span className="text-6xl mb-2 animate-bounce">🎉</span>
            <h3 className="text-lg sm:text-xl font-black text-amber-900 mb-1">
              Hoàn thành xuất sắc!
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mb-4 max-w-xs">
              Bé đã ghép đúng toàn bộ {totalPieces} mảnh bức tranh {currentTemplate.nameVi}!
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs sm:text-sm cursor-pointer shadow-2xs"
              >
                🔄 Ghép lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setTemplateIdx((prev) => (prev + 1) % PUZZLE_CHARACTERS.length);
                  handleReset();
                }}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs sm:text-sm cursor-pointer shadow-xs"
              >
                Tranh tiếp theo ➡️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Pieces Tray Bank (Mảnh ghép chờ đặt) */}
      {!isCompleted && (
        <div className="w-full max-w-md sm:max-w-lg rounded-2xl border-2 border-amber-300/80 bg-amber-50/60 p-2.5 shadow-2xs">
          <div className="text-[11px] font-black text-amber-900 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>🧩 Mảnh ghép ({unplacedPieces.length} mảnh còn lại):</span>
            <span className="text-slate-500 font-semibold lowercase">
              chạm mảnh rồi chạm ô trên bảng
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {unplacedPieces.map((pieceIdx) => {
              const row = Math.floor(pieceIdx / cols);
              const col = pieceIdx % cols;
              const slotWidth = 300 / cols;
              const slotHeight = 300 / rows;
              const viewBoxX = col * slotWidth;
              const viewBoxY = row * slotHeight;

              const isSelected = selectedPieceIdx === pieceIdx;

              return (
                <button
                  key={`tray-piece-${pieceIdx}`}
                  type="button"
                  onClick={() => {
                    setSelectedPieceIdx(isSelected ? null : pieceIdx);
                    playSoundEffect('pop', settings.volume);
                  }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 ring-4 ring-amber-300 scale-110 shadow-md bg-white -translate-y-1'
                      : 'border-slate-300 hover:border-amber-400 bg-white shadow-xs hover:scale-105'
                  }`}
                  aria-label={`Mảnh ghép số ${pieceIdx + 1}`}
                >
                  <svg
                    viewBox={`${viewBoxX} ${viewBoxY} ${slotWidth} ${slotHeight}`}
                    className="w-full h-full object-cover"
                  >
                    {currentTemplate.svgContent}
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Modal: Chọn Hình Mẫu Nhân Vật */}
      {showPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-amber-300 shadow-xl p-4 sm:p-5 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧩</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Chọn Tranh Nhân Vật Cho Bé
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPickerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 overflow-y-auto py-3">
              {PUZZLE_CHARACTERS.map((char, idx) => {
                const isSelected = idx === templateIdx % PUZZLE_CHARACTERS.length;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      setTemplateIdx(idx);
                      setShowPickerModal(false);
                      playSoundEffect('sparkle', settings.volume);
                    }}
                    className={`rounded-2xl p-2.5 border-2 flex flex-col items-center text-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-xs'
                        : 'border-slate-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                      <svg viewBox="0 0 300 300" className="w-full h-full">
                        {char.svgContent}
                      </svg>
                    </div>
                    <span className="text-xs font-black text-slate-900 leading-tight">
                      {char.emoji} {char.nameVi}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold line-clamp-1">
                      {char.nameEn}
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
