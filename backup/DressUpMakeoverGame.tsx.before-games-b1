import React, { useState } from 'react';
import { Sparkles, Camera, RotateCcw, Shuffle, CheckCircle2 } from 'lucide-react';
import type { ParentSettings } from '../types/learning';
import { playSoundEffect, speakTeacherVoice } from '../utils/audioEngine';
import { fireFireworksCelebration } from '../utils/confetti';

interface DressUpMakeoverGameProps {
  settings: ParentSettings;
  onWin?: () => void;
}

type CharacterId = 'lily' | 'leo' | 'mimi';
type CategoryTab = 'outfit' | 'hat' | 'makeup' | 'shoes' | 'prop';

interface StylingItem {
  id: string;
  nameVi: string;
  emoji: string;
  colorHex: string;
}

const CHARACTERS = [
  { id: 'lily' as CharacterId, nameVi: 'Bé Gái Lily', nameEn: 'Lily', emoji: '👧' },
  { id: 'leo' as CharacterId, nameVi: 'Bé Trai Leo', nameEn: 'Leo', emoji: '👦' },
  { id: 'mimi' as CharacterId, nameVi: 'Mèo Mimi', nameEn: 'Mimi', emoji: '🐱' },
];

const OUTFITS: StylingItem[] = [
  { id: 'casual', nameVi: 'Áo thun năng động', emoji: '👕', colorHex: '#38BDF8' },
  { id: 'princess', nameVi: 'Váy công chúa', emoji: '👗', colorHex: '#EC4899' },
  { id: 'superhero', nameVi: 'Đồ siêu nhân', emoji: '🦸', colorHex: '#2563EB' },
  { id: 'doctor', nameVi: 'Áo blouse bác sĩ', emoji: '🥼', colorHex: '#0284C7' },
  { id: 'winter', nameVi: 'Áo len ấm áp', emoji: '🧥', colorHex: '#F59E0B' },
  { id: 'fairy', nameVi: 'Váy tiên hoa', emoji: '🧚', colorHex: '#10B981' },
];

const HATS: StylingItem[] = [
  { id: 'none', nameVi: 'Không đội mũ', emoji: '✨', colorHex: '#94A3B8' },
  { id: 'crown', nameVi: 'Vương miện vàng', emoji: '👑', colorHex: '#FACC15' },
  { id: 'pink-bow', nameVi: 'Nơ hồng xinh', emoji: '🎀', colorHex: '#F472B6' },
  { id: 'cap', nameVi: 'Mũ lưỡi trai', emoji: '🧢', colorHex: '#3B82F6' },
  { id: 'cat-ears', nameVi: 'Băng đô tai mèo', emoji: '🐱', colorHex: '#A855F7' },
  { id: 'chef-hat', nameVi: 'Mũ đầu bếp', emoji: '👨‍🍳', colorHex: '#E2E8F0' },
];

const MAKEUPS: StylingItem[] = [
  { id: 'natural', nameVi: 'Mặt mộc tự nhiên', emoji: '😊', colorHex: '#FDA4AF' },
  { id: 'peach-blush', nameVi: 'Má hồng đào đào', emoji: '🌸', colorHex: '#FB7185' },
  { id: 'heart-cheeks', nameVi: 'Má hồng trái tim', emoji: '💖', colorHex: '#F43F5E' },
  { id: 'star-glitter', nameVi: 'Sticker ngôi sao', emoji: '⭐', colorHex: '#FACC15' },
  { id: 'sparkle-eyes', nameVi: 'Mắt cười lấp lánh', emoji: '✨', colorHex: '#38BDF8' },
  { id: 'butterfly-face', nameVi: 'Sticker cánh bướm', emoji: '🦋', colorHex: '#C084FC' },
];

const SHOES: StylingItem[] = [
  { id: 'sneakers', nameVi: 'Giày thể thao trắng', emoji: '👟', colorHex: '#E2E8F0' },
  { id: 'mary-jane', nameVi: 'Giày búp bê đỏ', emoji: '👠', colorHex: '#EF4444' },
  { id: 'boots', nameVi: 'Ủng cầu vồng', emoji: '👢', colorHex: '#F59E0B' },
  { id: 'sandals', nameVi: 'Sandal mùa hè', emoji: '🩴', colorHex: '#10B981' },
  { id: 'royal-shoes', nameVi: 'Giày hoàng gia', emoji: '👞', colorHex: '#6366F1' },
];

const PROPS: StylingItem[] = [
  { id: 'none', nameVi: 'Không cầm đồ', emoji: '🖐️', colorHex: '#94A3B8' },
  { id: 'magic-wand', nameVi: 'Đũa thần phép thuật', emoji: '🪄', colorHex: '#FACC15' },
  { id: 'teddy', nameVi: 'Gấu bông nhỏ', emoji: '🧸', colorHex: '#B45309' },
  { id: 'balloon', nameVi: 'Bong bóng trái tim', emoji: '🎈', colorHex: '#EF4444' },
  { id: 'ice-cream', nameVi: 'Kem ốc quế mát lạnh', emoji: '🍦', colorHex: '#EC4899' },
  { id: 'backpack', nameVi: 'Cặp sách đi học', emoji: '🎒', colorHex: '#0284C7' },
];

export const DressUpMakeoverGame: React.FC<DressUpMakeoverGameProps> = ({
  settings,
  onWin,
}) => {
  const [character, setCharacter] = useState<CharacterId>('lily');
  const [activeTab, setActiveTab] = useState<CategoryTab>('outfit');

  // Equipped Styles
  const [outfit, setOutfit] = useState<string>('princess');
  const [hat, setHat] = useState<string>('crown');
  const [makeup, setMakeup] = useState<string>('peach-blush');
  const [shoes, setShoes] = useState<string>('mary-jane');
  const [prop, setProp] = useState<string>('magic-wand');

  // Snapshot photo modal state
  const [photoFlash, setPhotoFlash] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const activeCharacterObj = CHARACTERS.find((c) => c.id === character) || CHARACTERS[0];

  // Random fashion styling
  const handleRandomize = () => {
    playSoundEffect('sparkle', settings.volume);
    const randomOutfit = OUTFITS[Math.floor(Math.random() * OUTFITS.length)].id;
    const randomHat = HATS[Math.floor(Math.random() * HATS.length)].id;
    const randomMakeup = MAKEUPS[Math.floor(Math.random() * MAKEUPS.length)].id;
    const randomShoes = SHOES[Math.floor(Math.random() * SHOES.length)].id;
    const randomProp = PROPS[Math.floor(Math.random() * PROPS.length)].id;

    setOutfit(randomOutfit);
    setHat(randomHat);
    setMakeup(randomMakeup);
    setShoes(randomShoes);
    setProp(randomProp);

    speakTeacherVoice(
      [{ lang: 'vi', text: 'Phong cách bất ngờ! Bé thấy bạn nhỏ xinh xắn chưa nào!' }],
      settings
    );
  };

  const handleReset = () => {
    playSoundEffect('pop', settings.volume);
    setOutfit('casual');
    setHat('none');
    setMakeup('natural');
    setShoes('sneakers');
    setProp('none');
  };

  const handleTakePhoto = () => {
    playSoundEffect('sparkle', settings.volume);
    setPhotoFlash(true);
    setTimeout(() => {
      setPhotoFlash(false);
      setShowPhotoModal(true);
      fireFireworksCelebration();
      speakTeacherVoice(
        [
          { lang: 'en', text: 'Say cheese! Beautiful styling!' },
          { lang: 'vi', text: 'Tách! Bé chụp được bức ảnh thời trang tuyệt đẹp!' },
        ],
        settings
      );
      if (onWin) onWin();
    }, 280);
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 select-none">
      {/* 1. Sub-Toolbar in Golden Border Container */}
      <div className="w-full max-w-lg rounded-2xl border-2 border-amber-400 bg-[#FFFDF5] p-2 shadow-2xs flex items-center justify-between gap-1.5 flex-wrap">
        {/* Character Switcher */}
        <div className="flex items-center bg-amber-100/80 p-0.5 rounded-xl border border-amber-300/80 shrink-0">
          {CHARACTERS.map((char) => (
            <button
              key={char.id}
              type="button"
              onClick={() => {
                setCharacter(char.id);
                playSoundEffect('pop', settings.volume);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                character === char.id
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-amber-950 hover:bg-amber-200/60'
              }`}
            >
              <span>{char.emoji}</span>
              <span className="hidden sm:inline">{char.nameVi}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons: Randomize, Snapshot, Reset */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleRandomize}
            className="h-9 px-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-900 text-xs font-black flex items-center gap-1 cursor-pointer transition active:scale-95 shadow-2xs"
            title="Phối đồ ngẫu nhiên"
          >
            <span>🎲</span>
            <span className="hidden sm:inline">Phối ngẫu nhiên</span>
          </button>

          <button
            type="button"
            onClick={handleTakePhoto}
            className="h-9 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-black flex items-center gap-1 cursor-pointer transition active:scale-95 shadow-xs"
            title="Chụp ảnh người mẫu"
          >
            <Camera className="w-4 h-4" />
            <span>Chụp ảnh</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Mặc lại đồ ban đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Dressing Room Canvas */}
      <div className="relative w-full max-w-md sm:max-w-lg aspect-[3/4] sm:aspect-auto sm:min-h-[420px] rounded-[32px] border-4 border-amber-400 bg-gradient-to-b from-sky-50 via-pink-50/40 to-amber-50 shadow-md p-3 sm:p-4 flex flex-col items-center justify-center overflow-hidden">
        {/* Flash effect overlay */}
        {photoFlash && (
          <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300 pointer-events-none" />
        )}

        {/* Sparkling environment accents */}
        <div className="absolute top-4 left-4 text-2xl animate-pulse">✨</div>
        <div className="absolute top-8 right-6 text-xl animate-bounce">💖</div>
        <div className="absolute bottom-6 left-6 text-xl">🌸</div>
        <div className="absolute bottom-8 right-6 text-2xl">⭐</div>

        {/* Dynamic Multi-layered SVG Avatar */}
        <svg
          viewBox="0 0 300 360"
          className="w-full max-w-[280px] sm:max-w-[320px] h-auto drop-shadow-md cursor-pointer transition-transform hover:scale-102 active:scale-98"
          onClick={() => {
            playSoundEffect('sparkle', settings.volume);
            speakTeacherVoice(
              [{ lang: 'vi', text: `Chào bé! ${activeCharacterObj.nameVi} thích bộ đồ này lắm!` }],
              settings
            );
          }}
          aria-label={`Nhân vật ${activeCharacterObj.nameVi}`}
        >
          {/* Shadow */}
          <ellipse cx="150" cy="335" rx="75" ry="12" fill="#000000" opacity="0.1" />

          {/* 1. BASE BODY & LEGS */}
          <rect x="130" y="240" width="16" height="70" rx="8" fill="#FED7AA" />
          <rect x="154" y="240" width="16" height="70" rx="8" fill="#FED7AA" />

          {/* 2. SHOES */}
          {shoes === 'sneakers' && (
            <g>
              <ellipse cx="138" cy="312" rx="14" ry="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
              <ellipse cx="162" cy="312" rx="14" ry="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
            </g>
          )}
          {shoes === 'mary-jane' && (
            <g>
              <ellipse cx="138" cy="312" rx="14" ry="8" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
              <ellipse cx="162" cy="312" rx="14" ry="8" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
              <circle cx="138" cy="310" r="2.5" fill="#FFFFFF" />
              <circle cx="162" cy="310" r="2.5" fill="#FFFFFF" />
            </g>
          )}
          {shoes === 'boots' && (
            <g>
              <rect x="127" y="280" width="22" height="34" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
              <rect x="151" y="280" width="22" height="34" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
              <line x1="127" y1="290" x2="149" y2="290" stroke="#EF4444" strokeWidth="3" />
              <line x1="151" y1="290" x2="173" y2="290" stroke="#EF4444" strokeWidth="3" />
            </g>
          )}
          {shoes === 'sandals' && (
            <g>
              <ellipse cx="138" cy="314" rx="13" ry="6" fill="#10B981" stroke="#047857" strokeWidth="2" />
              <ellipse cx="162" cy="314" rx="13" ry="6" fill="#10B981" stroke="#047857" strokeWidth="2" />
            </g>
          )}
          {shoes === 'royal-shoes' && (
            <g>
              <ellipse cx="138" cy="312" rx="15" ry="8" fill="#4338CA" stroke="#312E81" strokeWidth="2.5" />
              <ellipse cx="162" cy="312" rx="15" ry="8" fill="#4338CA" stroke="#312E81" strokeWidth="2.5" />
              <polygon points="138,308 141,313 135,313" fill="#FACC15" />
              <polygon points="162,308 165,313 159,313" fill="#FACC15" />
            </g>
          )}

          {/* 3. ARMS */}
          <rect x="85" y="160" width="18" height="65" rx="9" fill="#FED7AA" />
          <rect x="197" y="160" width="18" height="65" rx="9" fill="#FED7AA" />

          {/* 4. OUTFITS */}
          {outfit === 'casual' && (
            <g>
              <path d="M100 150 L200 150 L195 240 L105 240 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
              <circle cx="150" cy="190" r="18" fill="#FFFFFF" />
              <text x="142" y="196" fontSize="16">⭐</text>
              <rect x="115" y="235" width="70" height="25" rx="6" fill="#1E293B" />
            </g>
          )}
          {outfit === 'princess' && (
            <g>
              {/* Princess bodice */}
              <path d="M110 150 L190 150 L185 195 L115 195 Z" fill="#EC4899" stroke="#BE185D" strokeWidth="3" />
              {/* Grand puffy ballgown skirt */}
              <path d="M115 195 C75 220, 60 270, 70 280 L230 280 C240 270, 225 220, 185 195 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="3" />
              {/* Lace ruffles */}
              <path d="M80 275 Q115 260 150 275 Q185 260 220 275" fill="none" stroke="#FFFFFF" strokeWidth="4" />
              <circle cx="150" cy="170" r="5" fill="#FDE047" />
            </g>
          )}
          {outfit === 'superhero' && (
            <g>
              <path d="M85 150 L60 260 L240 260 L215 150 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
              <rect x="105" y="150" width="90" height="95" rx="16" fill="#2563EB" stroke="#1D4ED8" strokeWidth="3" />
              <polygon points="150,175 156,190 172,190 160,200 164,215 150,205 136,215 140,200 128,190 144,190" fill="#FACC15" />
              <rect x="105" y="235" width="90" height="14" fill="#FACC15" />
            </g>
          )}
          {outfit === 'doctor' && (
            <g>
              <rect x="100" y="150" width="100" height="100" rx="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
              <line x1="150" y1="150" x2="150" y2="250" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="4,4" />
              <rect x="110" y="180" width="22" height="24" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
              <path d="M120 165 C120 205, 180 205, 180 165" fill="none" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
              <circle cx="150" cy="205" r="9" fill="#F97316" />
            </g>
          )}
          {outfit === 'winter' && (
            <g>
              <rect x="98" y="148" width="104" height="98" rx="18" fill="#F59E0B" stroke="#B45309" strokeWidth="3.5" />
              {/* Cozy knit pattern */}
              <line x1="98" y1="180" x2="202" y2="180" stroke="#FEF3C7" strokeWidth="4" strokeDasharray="6,4" />
              <line x1="98" y1="210" x2="202" y2="210" stroke="#FEF3C7" strokeWidth="4" strokeDasharray="6,4" />
              <circle cx="150" cy="165" r="6" fill="#78350F" />
              <circle cx="150" cy="195" r="6" fill="#78350F" />
              <rect x="115" y="240" width="70" height="25" rx="6" fill="#475569" />
            </g>
          )}
          {outfit === 'fairy' && (
            <g>
              {/* Fairy Wings */}
              <ellipse cx="90" cy="160" rx="35" ry="50" fill="#A7F3D0" opacity="0.65" stroke="#10B981" strokeWidth="2" transform="rotate(-25 90 160)" />
              <ellipse cx="210" cy="160" rx="35" ry="50" fill="#A7F3D0" opacity="0.65" stroke="#10B981" strokeWidth="2" transform="rotate(25 210 160)" />
              <path d="M110 150 L190 150 L180 250 L120 250 Z" fill="#34D399" stroke="#059669" strokeWidth="3" />
              <circle cx="150" cy="180" r="10" fill="#FEF08A" />
            </g>
          )}

          {/* 5. HEAD & EARS */}
          <circle cx="150" cy="95" r="46" fill="#FED7AA" stroke="#D97706" strokeWidth="3.5" />

          {/* Mimi Cat Ears if Mimi character */}
          {character === 'mimi' && (
            <g>
              <polygon points="112,65 125,25 145,55" fill="#FDBA74" stroke="#EA580C" strokeWidth="3" />
              <polygon points="118,60 127,35 140,55" fill="#FECDD3" />
              <polygon points="188,65 175,25 155,55" fill="#FDBA74" stroke="#EA580C" strokeWidth="3" />
              <polygon points="182,60 173,35 160,55" fill="#FECDD3" />
              {/* Whiskers */}
              <line x1="95" y1="102" x2="120" y2="105" stroke="#78350F" strokeWidth="2.5" />
              <line x1="95" y1="112" x2="120" y2="110" stroke="#78350F" strokeWidth="2.5" />
              <line x1="205" y1="102" x2="180" y2="105" stroke="#78350F" strokeWidth="2.5" />
              <line x1="205" y1="112" x2="180" y2="110" stroke="#78350F" strokeWidth="2.5" />
            </g>
          )}

          {/* Hair for Lily (Twin Tails) or Leo (Short Boy Hair) */}
          {character === 'lily' && (
            <g>
              <path d="M106 90 C106 48, 194 48, 194 90 C180 65, 120 65, 106 90 Z" fill="#78350F" />
              {/* Left Pigtail */}
              <ellipse cx="98" cy="95" rx="14" ry="24" fill="#78350F" transform="rotate(-20 98 95)" />
              {/* Right Pigtail */}
              <ellipse cx="202" cy="95" rx="14" ry="24" fill="#78350F" transform="rotate(20 202 95)" />
            </g>
          )}
          {character === 'leo' && (
            <g>
              <path d="M105 88 C105 45, 195 45, 195 88 C185 62, 115 62, 105 88 Z" fill="#1E293B" />
              <polygon points="140,55 150,40 160,55" fill="#1E293B" />
            </g>
          )}

          {/* 6. EYES & MAKEUP EXPRESSIONS */}
          {makeup === 'sparkle-eyes' ? (
            <g>
              <ellipse cx="134" cy="94" rx="6" ry="7" fill="#0284C7" />
              <ellipse cx="166" cy="94" rx="6" ry="7" fill="#0284C7" />
              <circle cx="132" cy="91" r="2.5" fill="#FFFFFF" />
              <circle cx="164" cy="91" r="2.5" fill="#FFFFFF" />
              <polygon points="134,84 135,87 138,87 136,89 137,92 134,90 131,92 132,89 130,87 133,87" fill="#FACC15" />
              <polygon points="166,84 167,87 170,87 168,89 169,92 166,90 163,92 164,89 162,87 165,87" fill="#FACC15" />
            </g>
          ) : (
            <g>
              <circle cx="134" cy="94" r="5" fill="#1E293B" />
              <circle cx="166" cy="94" r="5" fill="#1E293B" />
              <circle cx="132" cy="92" r="1.8" fill="#FFFFFF" />
              <circle cx="164" cy="92" r="1.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Blush / Cheek Art */}
          {makeup === 'peach-blush' && (
            <g>
              <circle cx="122" cy="106" r="8" fill="#FB7185" opacity="0.75" />
              <circle cx="178" cy="106" r="8" fill="#FB7185" opacity="0.75" />
            </g>
          )}
          {makeup === 'heart-cheeks' && (
            <g>
              <path d="M120 102 A 3 3 0 0 0 115 106 Q 120 112 125 106 A 3 3 0 0 0 120 102 Z" fill="#F43F5E" />
              <path d="M180 102 A 3 3 0 0 0 175 106 Q 180 112 185 106 A 3 3 0 0 0 180 102 Z" fill="#F43F5E" />
            </g>
          )}
          {makeup === 'star-glitter' && (
            <g>
              <text x="114" y="112" fontSize="14">⭐</text>
              <text x="174" y="112" fontSize="14">⭐</text>
            </g>
          )}
          {makeup === 'butterfly-face' && (
            <g>
              <text x="113" y="112" fontSize="14">🦋</text>
              <text x="173" y="112" fontSize="14">🦋</text>
            </g>
          )}

          {/* Smile */}
          <path d="M142 110 Q150 120 158 110" fill="none" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />

          {/* 7. HATS & HAIR ACCESSORIES */}
          {hat === 'crown' && (
            <g>
              <polygon points="125,55 130,28 140,42 150,22 160,42 170,28 175,55" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
              <circle cx="130" cy="28" r="3" fill="#EF4444" />
              <circle cx="150" cy="22" r="3.5" fill="#3B82F6" />
              <circle cx="170" cy="28" r="3" fill="#10B981" />
            </g>
          )}
          {hat === 'pink-bow' && (
            <g>
              <polygon points="135,45 120,32 120,58" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
              <polygon points="165,45 180,32 180,58" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
              <circle cx="150" cy="45" r="7" fill="#EC4899" />
            </g>
          )}
          {hat === 'cap' && (
            <g>
              <path d="M110 65 C110 35, 190 35, 190 65 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
              <ellipse cx="160" cy="65" rx="38" ry="8" fill="#2563EB" />
              <circle cx="150" cy="38" r="3.5" fill="#FACC15" />
            </g>
          )}
          {hat === 'cat-ears' && character !== 'mimi' && (
            <g>
              <path d="M112 60 C130 52, 170 52, 188 60" fill="none" stroke="#A855F7" strokeWidth="4" />
              <polygon points="118,58 126,30 138,55" fill="#C084FC" stroke="#7E22CE" strokeWidth="2" />
              <polygon points="182,58 174,30 162,55" fill="#C084FC" stroke="#7E22CE" strokeWidth="2" />
            </g>
          )}
          {hat === 'chef-hat' && (
            <g>
              <path d="M125 55 L175 55 L175 42 C190 35, 175 10, 150 15 C125 10, 110 35, 125 42 Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
              <rect x="125" y="45" width="50" height="12" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
            </g>
          )}

          {/* 8. HANDHELD PROPS */}
          {prop === 'magic-wand' && (
            <g>
              <line x1="210" y1="180" x2="250" y2="130" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
              <polygon points="250,130 254,120 264,124 257,132 262,142 251,136 242,142 245,131 238,124 248,122" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
              <text x="255" y="115" fontSize="16">✨</text>
            </g>
          )}
          {prop === 'teddy' && (
            <g>
              <circle cx="82" cy="185" r="16" fill="#B45309" />
              <circle cx="82" cy="170" r="12" fill="#B45309" />
              <circle cx="74" cy="160" r="5" fill="#D97706" />
              <circle cx="90" cy="160" r="5" fill="#D97706" />
              <circle cx="79" cy="168" r="2" fill="#1E293B" />
              <circle cx="85" cy="168" r="2" fill="#1E293B" />
              <ellipse cx="82" cy="173" rx="4" ry="2.5" fill="#FDE68A" />
            </g>
          )}
          {prop === 'balloon' && (
            <g>
              <line x1="210" y1="190" x2="235" y2="105" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3,3" />
              <path d="M235 95 C220 70, 200 100, 235 125 C270 100, 250 70, 235 95 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
            </g>
          )}
          {prop === 'ice-cream' && (
            <g>
              <polygon points="215,190 225,230 235,190" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              <circle cx="225" cy="180" r="12" fill="#EC4899" />
              <circle cx="225" cy="165" r="10" fill="#38BDF8" />
              <circle cx="225" cy="152" r="8" fill="#FDE047" />
              <circle cx="225" cy="144" r="3.5" fill="#DC2626" />
            </g>
          )}
          {prop === 'backpack' && (
            <g>
              <rect x="65" y="165" width="28" height="38" rx="8" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
              <rect x="70" y="175" width="18" height="15" rx="4" fill="#38BDF8" />
            </g>
          )}
        </svg>

        {/* Floating Tag */}
        <div className="mt-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-amber-200 shadow-2xs">
          <span className="text-xs font-black text-amber-900">
            {activeCharacterObj.nameVi}
          </span>
          <span className="text-[10px] text-slate-500 font-bold">
            · Chạm vào bạn nhỏ để nghe tiếng cười nhé!
          </span>
        </div>
      </div>

      {/* 3. Bottom Wardrobe Drawer with 5 Category Tabs */}
      <div className="w-full max-w-md sm:max-w-lg rounded-2xl border-2 border-amber-400 bg-[#FFFDF5] p-2.5 shadow-2xs flex flex-col gap-2">
        {/* Category Tabs */}
        <div className="grid grid-cols-5 gap-1 bg-amber-100/70 p-1 rounded-xl border border-amber-300/80">
          {[
            { id: 'outfit' as CategoryTab, name: 'Trang phục', emoji: '👗' },
            { id: 'hat' as CategoryTab, name: 'Mũ & Nơ', emoji: '👒' },
            { id: 'makeup' as CategoryTab, name: 'Trang điểm', emoji: '💄' },
            { id: 'shoes' as CategoryTab, name: 'Giày dép', emoji: '👟' },
            { id: 'prop' as CategoryTab, name: 'Cầm tay', emoji: '🎒' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                playSoundEffect('pop', settings.volume);
              }}
              className={`py-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer transition ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white font-black shadow-2xs scale-102'
                  : 'text-amber-950 font-bold hover:bg-amber-200/50'
              }`}
            >
              <span className="text-base sm:text-lg">{tab.emoji}</span>
              <span className="text-[10px] sm:text-xs leading-none line-clamp-1">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Items Tray */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5">
          {activeTab === 'outfit' &&
            OUTFITS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setOutfit(item.id);
                  playSoundEffect('sparkle', settings.volume);
                  speakTeacherVoice([{ lang: 'vi', text: item.nameVi }], settings);
                }}
                className={`min-w-[85px] sm:min-w-[95px] p-2 rounded-2xl border-2 flex flex-col items-center gap-1 cursor-pointer transition shrink-0 ${
                  outfit === item.id
                    ? 'border-amber-500 bg-amber-50 shadow-xs ring-2 ring-amber-300 scale-105'
                    : 'border-slate-200 hover:border-amber-300 bg-white'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                <span className="text-[11px] font-black text-slate-800 text-center leading-tight line-clamp-1">
                  {item.nameVi}
                </span>
              </button>
            ))}

          {activeTab === 'hat' &&
            HATS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setHat(item.id);
                  playSoundEffect('sparkle', settings.volume);
                  speakTeacherVoice([{ lang: 'vi', text: item.nameVi }], settings);
                }}
                className={`min-w-[85px] sm:min-w-[95px] p-2 rounded-2xl border-2 flex flex-col items-center gap-1 cursor-pointer transition shrink-0 ${
                  hat === item.id
                    ? 'border-amber-500 bg-amber-50 shadow-xs ring-2 ring-amber-300 scale-105'
                    : 'border-slate-200 hover:border-amber-300 bg-white'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                <span className="text-[11px] font-black text-slate-800 text-center leading-tight line-clamp-1">
                  {item.nameVi}
                </span>
              </button>
            ))}

          {activeTab === 'makeup' &&
            MAKEUPS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMakeup(item.id);
                  playSoundEffect('sparkle', settings.volume);
                  speakTeacherVoice([{ lang: 'vi', text: item.nameVi }], settings);
                }}
                className={`min-w-[85px] sm:min-w-[95px] p-2 rounded-2xl border-2 flex flex-col items-center gap-1 cursor-pointer transition shrink-0 ${
                  makeup === item.id
                    ? 'border-amber-500 bg-amber-50 shadow-xs ring-2 ring-amber-300 scale-105'
                    : 'border-slate-200 hover:border-amber-300 bg-white'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                <span className="text-[11px] font-black text-slate-800 text-center leading-tight line-clamp-1">
                  {item.nameVi}
                </span>
              </button>
            ))}

          {activeTab === 'shoes' &&
            SHOES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setShoes(item.id);
                  playSoundEffect('sparkle', settings.volume);
                  speakTeacherVoice([{ lang: 'vi', text: item.nameVi }], settings);
                }}
                className={`min-w-[85px] sm:min-w-[95px] p-2 rounded-2xl border-2 flex flex-col items-center gap-1 cursor-pointer transition shrink-0 ${
                  shoes === item.id
                    ? 'border-amber-500 bg-amber-50 shadow-xs ring-2 ring-amber-300 scale-105'
                    : 'border-slate-200 hover:border-amber-300 bg-white'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                <span className="text-[11px] font-black text-slate-800 text-center leading-tight line-clamp-1">
                  {item.nameVi}
                </span>
              </button>
            ))}

          {activeTab === 'prop' &&
            PROPS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setProp(item.id);
                  playSoundEffect('sparkle', settings.volume);
                  speakTeacherVoice([{ lang: 'vi', text: item.nameVi }], settings);
                }}
                className={`min-w-[85px] sm:min-w-[95px] p-2 rounded-2xl border-2 flex flex-col items-center gap-1 cursor-pointer transition shrink-0 ${
                  prop === item.id
                    ? 'border-amber-500 bg-amber-50 shadow-xs ring-2 ring-amber-300 scale-105'
                    : 'border-slate-200 hover:border-amber-300 bg-white'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                <span className="text-[11px] font-black text-slate-800 text-center leading-tight line-clamp-1">
                  {item.nameVi}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* 4. Modal: Polaroid Snapshot Preview (Chụp ảnh kỷ niệm) */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center border-4 border-amber-300">
            {/* Polaroid Photo Frame */}
            <div className="w-full bg-[#FFFDF5] border-2 border-slate-200 rounded-2xl p-3 shadow-inner flex flex-col items-center">
              <div className="text-4xl mb-1">📸 ✨</div>
              <h4 className="text-base font-black text-amber-900">
                Ảnh Thời Trang Của Bé!
              </h4>
              <p className="text-xs font-bold text-slate-500 mb-2">
                Người mẫu: {activeCharacterObj.nameVi}
              </p>
              <div className="w-44 h-44 rounded-2xl bg-gradient-to-b from-sky-50 to-pink-50 border border-amber-200 flex items-center justify-center overflow-hidden p-2">
                <span className="text-6xl animate-bounce">
                  {outfit === 'princess'
                    ? '👸'
                    : outfit === 'superhero'
                    ? '🦸'
                    : outfit === 'doctor'
                    ? '👩‍⚕️'
                    : '✨'}
                </span>
              </div>
              <p className="text-[11px] font-extrabold text-amber-800 mt-2">
                ⭐ Bé phối đồ thật xinh xắn và đáng yêu! ⭐
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm cursor-pointer shadow-xs"
              >
                Tiếp tục tạo dáng 💖
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
