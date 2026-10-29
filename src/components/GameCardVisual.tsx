import React, { useState } from 'react';
import { REAL_ANIMAL_IMAGES } from './PastelIllustration';

interface GameCardVisualProps {
  itemId: string;
  emoji: string;
  en?: string;
  vi?: string;
  colorHex?: string;
  bgTint?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'card' | 'hero' | 'fluid';
  className?: string;
  isSilhouette?: boolean;
}

/**
 * Tra cứu nhanh tên tiếng Việt & Emoji sang khóa ảnh thực tế HD
 */
const EMOJI_AND_VI_LOOKUP: Record<string, string> = {
  // Động vật hoang dã
  '🦁': 'lion',
  'sư tử': 'lion',
  'con sư tử': 'lion',
  '🐘': 'elephant',
  'voi': 'elephant',
  'con voi': 'elephant',
  '🐒': 'monkey',
  'khỉ': 'monkey',
  'con khỉ': 'monkey',
  '🐯': 'tiger',
  'hổ': 'tiger',
  'cọp': 'tiger',
  'con hổ': 'tiger',
  '🐻': 'bear',
  'gấu': 'bear',
  'con gấu': 'bear',
  '🦒': 'giraffe',
  'hươu cao cổ': 'giraffe',
  '🦓': 'zebra',
  'ngựa vằn': 'zebra',
  '🦛': 'hippo',
  'hà mã': 'hippo',
  '🦘': 'kangaroo',
  'chuột túi': 'kangaroo',
  '🐨': 'koala',
  'gấu túi': 'koala',
  '🐼': 'panda',
  'gấu trúc': 'panda',
  '🦊': 'fox',
  'cáo': 'fox',
  'con cáo': 'fox',
  '🦌': 'deer',
  'hươu': 'deer',
  'con nai': 'deer',
  '🦏': 'rhino',
  'tê giác': 'rhino',
  '🐆': 'cheetah',
  'báo đốm': 'cheetah',
  '🐫': 'camel',
  'lạc đà': 'camel',

  // Động vật trang trại / quen thuộc
  '🐮': 'cow',
  '🐄': 'cow',
  'bò': 'cow',
  'bò sữa': 'cow',
  'con bò': 'cow',
  '🐱': 'cat',
  'mèo': 'cat',
  'con mèo': 'cat',
  '🐶': 'dog',
  'chó': 'dog',
  'con chó': 'dog',
  'duck': 'duck',
  '🦆': 'duck',
  'vịt': 'duck',
  'con vịt': 'duck',
  '🐷': 'pig',
  'lợn': 'pig',
  'heo': 'pig',
  'con heo': 'pig',
  'con lợn': 'pig',
  '🐑': 'sheep',
  'cừu': 'sheep',
  'con cừu': 'sheep',
  '🐔': 'chicken',
  'gà': 'chicken',
  'con gà': 'chicken',
  '🐴': 'horse',
  'ngựa': 'horse',
  'con ngựa': 'horse',
  '🦃': 'turkey',
  'gà tây': 'turkey',
  '🐐': 'goat',
  'dê': 'goat',
  'con dê': 'goat',
  '🫏': 'donkey',
  'lừa': 'donkey',
  'con lừa': 'donkey',
  '🐭': 'mouse',
  'chuột': 'mouse',
  'con chuột': 'mouse',
  '🪿': 'goose',
  'ngỗng': 'goose',
  'con ngỗng': 'goose',
  '🐥': 'chick',
  'gà con': 'chick',
  '🐰': 'rabbit',
  'thỏ': 'rabbit',
  'con thỏ': 'rabbit',
  '🐦': 'pigeon',
  'bồ câu': 'pigeon',
  'chim bồ câu': 'pigeon',

  // Đại dương & sinh vật biển
  '🐟': 'fish',
  'cá': 'fish',
  '🐬': 'dolphin',
  'cá heo': 'dolphin',
  '🐳': 'whale',
  'cá voi': 'whale',
  '🦀': 'crab',
  'cua': 'crab',
  'con cua': 'crab',
  '🐙': 'octopus',
  'bạch tuộc': 'octopus',
  '🐢': 'turtle',
  'rùa': 'turtle',
  'rùa biển': 'turtle',
  'con rùa': 'turtle',
  '⭐': 'starfish',
  'sao biển': 'starfish',
  '🪼': 'jellyfish',
  'sứa': 'jellyfish',
  'con sứa': 'jellyfish',
  'con cá ngựa': 'seahorse',
  'cá ngựa': 'seahorse',
  'shark': 'shark',
  '🦈': 'shark',
  'cá mập': 'shark',
  'lobster': 'lobster',
  '🦞': 'lobster',
  'tôm hùm': 'lobster',
  'seal': 'seal',
  '🦭': 'seal',
  'hải cẩu': 'seal',
  'shrimp': 'shrimp',
  '🦐': 'shrimp',
  'tôm': 'shrimp',
  'con tôm': 'shrimp',
  'clam': 'clam',
  'sò': 'clam',
  'con sò': 'clam',
  'stingray': 'stingray',
  'cá đuối': 'stingray',
  'coral': 'coral',
  'san hô': 'coral',

  // Côn trùng & loài chim
  '🐝': 'bee',
  'ong': 'bee',
  'con ong': 'bee',
  'butterfly': 'butterfly',
  '🦋': 'butterfly',
  'bướm': 'butterfly',
  'con bướm': 'butterfly',
  'ladybug': 'ladybug',
  '🐞': 'ladybug',
  'bọ rùa': 'ladybug',
  'ant': 'ant',
  '🐜': 'ant',
  'kiến': 'ant',
  'con kiến': 'ant',
  'owl': 'owl',
  '🦉': 'owl',
  'cú mèo': 'owl',
  'parrot': 'parrot',
  '🦜': 'parrot',
  'vẹt': 'parrot',
  'con vẹt': 'parrot',
  'snail': 'snail',
  '🐌': 'snail',
  'ốc sên': 'snail',
  'caterpillar': 'caterpillar',
  'sâu': 'caterpillar',
  'con sâu': 'caterpillar',
  'firefly': 'firefly',
  'đom đóm': 'firefly',
  'grasshopper': 'grasshopper',
  'châu chấu': 'grasshopper',
  'beetle': 'beetle',
  'bọ cánh cứng': 'beetle',
  'dragonfly': 'dragonfly',
  'chuồn chuồn': 'dragonfly',
  'duckling': 'duckling',
  'vịt con': 'duckling',
  'woodpecker': 'woodpecker',
  'chim gõ kiến': 'woodpecker',

  // Hoa quả & rau củ
  '🍎': 'apple',
  'táo': 'apple',
  'quả táo': 'apple',
  '🍌': 'banana',
  'chuối': 'banana',
  'quả chuối': 'banana',
  '🍊': 'orange',
  'cam': 'orange',
  'quả cam': 'orange',
  '🍓': 'strawberry',
  'dâu tây': 'strawberry',
  '🍉': 'watermelon',
  'dưa hấu': 'watermelon',
  '🍇': 'grapes',
  'nho': 'grapes',
  'chùm nho': 'grapes',
  'mango': 'mango',
  'xoài': 'mango',
  'quả xoài': 'mango',
  'peach': 'peach',
  'đào': 'peach',
  'quả đào': 'peach',
  'cherry': 'cherry',
  'anh đào': 'cherry',
  'pineapple': 'pineapple',
  'dứa': 'pineapple',
  'quả dứa': 'pineapple',
  'kiwi': 'kiwi',
  'guava': 'guava',
  'ổi': 'guava',
  'coconut': 'coconut',
  'dừa': 'coconut',
  'pear': 'pear',
  'lê': 'pear',
  'avocado': 'avocado',
  'bơ': 'avocado',
  'papaya': 'papaya',
  'đu đủ': 'papaya',
  '🥕': 'carrot',
  'cà rốt': 'carrot',
  'củ cà rốt': 'carrot',
  '🍅': 'tomato',
  'cà chua': 'tomato',
  'quả cà chua': 'tomato',
  '🌽': 'corn',
  'ngô': 'corn',
  'bắp ngô': 'corn',
  'broccoli': 'broccoli',
  'súp lơ': 'broccoli',
  'potato': 'potato',
  'khoai tây': 'potato',
  'cucumber': 'cucumber',
  'dưa chuột': 'cucumber',
  'pumpkin': 'pumpkin',
  'bí ngô': 'pumpkin',
  'mushroom': 'mushroom',
  'nấm': 'mushroom',
  'cabbage': 'cabbage',
  'bắp cải': 'cabbage',
  'onion': 'onion',
  'hành tây': 'onion',

  // Phương tiện giao thông
  '🚗': 'car',
  'ô tô': 'car',
  'xe hơi': 'car',
  '🚌': 'bus',
  'xe buýt': 'bus',
  '🚂': 'train',
  'tàu hỏa': 'train',
  '✈️': 'airplane',
  'máy bay': 'airplane',
  '⛵': 'boat',
  'thuyền': 'boat',
  'thuyền buồm': 'boat',
  '🚲': 'bicycle',
  'xe đạp': 'bicycle',
  '🚒': 'fire-truck',
  'xe cứu hỏa': 'fire-truck',
  'helicopter': 'helicopter',
  '🚁': 'helicopter',
  'trực thăng': 'helicopter',
  'scooter': 'scooter',
  '🛵': 'scooter',
  'xe ga': 'scooter',
  'motorcycle': 'motorcycle',
  '🏍️': 'motorcycle',
  'xe máy': 'motorcycle',
  'ambulance': 'ambulance',
  '🚑': 'ambulance',
  'xe cấp cứu': 'ambulance',
  'ship': 'ship',
  'tàu thủy': 'ship',
  'tractor': 'tractor',
  'máy kéo': 'tractor',
  'truck': 'truck',
  'xe tải': 'truck',
  'submarine': 'submarine',
  'tàu ngầm': 'submarine',
  'rocket': 'rocket',
  '🚀': 'rocket',
  'tên lửa': 'rocket',
};

/**
 * Visual engine tối ưu riêng cho Thẻ Trò Chơi (Mini-games) cho bé:
 * - Ưu tiên HÌNH ẢNH THỰC TẾ HD từ kho thẻ từ vựng (Voi, Khỉ, Sư Tử, Hổ, Bò, Gà, Chó, Mèo...)
 * - Hình ảnh lấp đầy khung hình (85-95%), to rõ ràng, màu sắc sinh động, góc bo tròn mềm mại
 * - Hỗ trợ cả chế độ bóng (isSilhouette) cho trò chơi đoán bóng thông minh
 */
export const GameCardVisual: React.FC<GameCardVisualProps> = ({
  itemId,
  emoji,
  en,
  vi,
  colorHex = '#F59E0B',
  bgTint = '#FEF3C7',
  size = 'card',
  className = '',
  isSilhouette = false,
}) => {
  const [hasImgError, setHasImgError] = useState(false);
  const cleanId = (itemId || '').toLowerCase().trim();
  const cleanEn = (en || '').toLowerCase().trim();
  const cleanVi = (vi || '').toLowerCase().trim();

  // Container dimensions - Tối ưu kích thước lớn rõ ràng cho trẻ mầm non
  const containerClass =
    size === 'fluid'
      ? 'w-full h-full min-h-[90px] sm:min-h-[115px]'
      : size === 'card'
      ? 'w-full h-28 sm:h-36'
      : size === 'hero'
      ? 'w-36 h-36 sm:w-44 sm:h-44'
      : size === 'xl'
      ? 'w-28 h-28 sm:w-32 sm:h-32'
      : size === 'lg'
      ? 'w-24 h-24 sm:w-28 sm:h-28'
      : size === 'md'
      ? 'w-20 h-20 sm:w-24 sm:h-24'
      : 'w-14 h-14 sm:w-16 sm:h-16';

  const silhouetteStyle = isSilhouette
    ? 'brightness-0 contrast-200 opacity-90'
    : '';

  // 1. TÌM ẢNH THỰC TẾ TỪ REAL_ANIMAL_IMAGES (Theo itemId, English, Vietnamese, hoặc Emoji)
  const lookupKey =
    cleanId ||
    cleanEn ||
    EMOJI_AND_VI_LOOKUP[emoji] ||
    EMOJI_AND_VI_LOOKUP[cleanVi] ||
    cleanEn.replace(/\s+/g, '-');

  const realPhotoUrl =
    REAL_ANIMAL_IMAGES[cleanId] ||
    REAL_ANIMAL_IMAGES[cleanEn] ||
    REAL_ANIMAL_IMAGES[lookupKey] ||
    REAL_ANIMAL_IMAGES[EMOJI_AND_VI_LOOKUP[emoji] || ''] ||
    REAL_ANIMAL_IMAGES[EMOJI_AND_VI_LOOKUP[cleanVi] || ''] ||
    REAL_ANIMAL_IMAGES[cleanId.replace(/\s+/g, '-')] ||
    REAL_ANIMAL_IMAGES[cleanEn.replace(/\s+/g, '-')];

  // 2. KHI CÓ ẢNH THỰC TẾ & KHÔNG BỊ LỖI
  // - Nếu không phải chế độ bóng (!isSilhouette), hiển thị ảnh thực tế HD to trọn vẹn
  // - Nếu là chế độ bóng (isSilhouette), ảnh thực tế vẫn áp dụng filter bóng đen tương phản cao
  if (realPhotoUrl && !hasImgError) {
    return (
      <div
        className={`${containerClass} rounded-2xl relative overflow-hidden select-none shadow-xs border-2 bg-slate-50 flex items-center justify-center p-0.5 ${silhouetteStyle} ${className}`}
        style={{ borderColor: colorHex }}
      >
        <img
          src={realPhotoUrl}
          alt={en || vi || cleanId}
          className="w-full h-full object-cover object-center rounded-xl transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setHasImgError(true)}
        />
        {!isSilhouette && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-xl" />
        )}
      </div>
    );
  }

  // 3. NẾU LÀ SƯ TỬ (Lion) - Vector toàn thân to ngộ nghĩnh (dùng cho Silhouette hoặc dự phòng)
  const isLion =
    cleanId === 'lion' ||
    cleanId.includes('lion') ||
    cleanId === 'wild-animals-0' ||
    emoji === '🦁' ||
    cleanVi.includes('sư tử');

  if (isLion) {
    return (
      <div
        className={`${containerClass} rounded-2xl flex items-center justify-center p-1 relative overflow-hidden select-none bg-amber-50/80 ${silhouetteStyle} ${className}`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full max-h-[95%] max-w-[95%] drop-shadow-md transition-transform group-hover:scale-105"
        >
          <ellipse cx="80" cy="146" rx="58" ry="8" fill="#000000" opacity="0.08" />
          <path
            d="M32 90 C14 82, 10 56, 24 44 C28 56, 36 78, 42 90 Z"
            fill="#D97706"
            stroke="#92400E"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="44" r="8" fill="#78350F" />
          <rect x="40" y="100" width="16" height="42" rx="8" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
          <circle cx="48" cy="138" r="6" fill="#FDE68A" />
          <rect x="60" y="102" width="16" height="40" rx="8" fill="#D97706" stroke="#B45309" strokeWidth="3" />
          <circle cx="68" cy="138" r="6" fill="#FDE68A" />
          <rect x="36" y="74" width="76" height="48" rx="24" fill="#F59E0B" stroke="#B45309" strokeWidth="3.5" />
          <rect x="88" y="102" width="16" height="40" rx="8" fill="#D97706" stroke="#B45309" strokeWidth="3" />
          <circle cx="96" cy="138" r="6" fill="#FDE68A" />
          <rect x="106" y="100" width="16" height="42" rx="8" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
          <circle cx="114" cy="138" r="6" fill="#FDE68A" />
          <circle cx="112" cy="54" r="38" fill="#EA580C" stroke="#C2410C" strokeWidth="3" />
          <circle cx="112" cy="54" r="26" fill="#FDE68A" />
          <circle cx="102" cy="48" r="4.5" fill="#1E293B" />
          <circle cx="100" cy="46" r="1.5" fill="#FFFFFF" />
          <circle cx="122" cy="48" r="4.5" fill="#1E293B" />
          <circle cx="120" cy="46" r="1.5" fill="#FFFFFF" />
          <polygon points="108,56 116,56 112,61" fill="#78350F" />
          <path d="M106 64 Q112 70 118 64" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 4. NẾU LÀ HỔ (Tiger) - Vector toàn thân to ngộ nghĩnh
  const isTiger =
    cleanId === 'tiger' ||
    cleanId.includes('tiger') ||
    cleanId === 'wild-animals-3' ||
    emoji === '🐯' ||
    cleanVi.includes('hổ');

  if (isTiger) {
    return (
      <div
        className={`${containerClass} rounded-2xl flex items-center justify-center p-1 relative overflow-hidden select-none bg-orange-50/80 ${silhouetteStyle} ${className}`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full max-h-[95%] max-w-[95%] drop-shadow-md transition-transform group-hover:scale-105"
        >
          <ellipse cx="80" cy="146" rx="58" ry="8" fill="#000000" opacity="0.08" />
          <path
            d="M32 94 C14 84, 12 58, 26 46 C30 58, 38 78, 42 94 Z"
            fill="#EA580C"
            stroke="#9A3412"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="46" r="8" fill="#1E293B" />
          <rect x="40" y="100" width="16" height="42" rx="8" fill="#F97316" stroke="#9A3412" strokeWidth="3" />
          <rect x="60" y="102" width="16" height="40" rx="8" fill="#EA580C" stroke="#9A3412" strokeWidth="3" />
          <rect x="36" y="74" width="76" height="48" rx="24" fill="#F97316" stroke="#9A3412" strokeWidth="3.5" />
          <rect x="88" y="102" width="16" height="40" rx="8" fill="#EA580C" stroke="#9A3412" strokeWidth="3" />
          <rect x="106" y="100" width="16" height="42" rx="8" fill="#F97316" stroke="#9A3412" strokeWidth="3" />
          <circle cx="112" cy="54" r="32" fill="#F97316" stroke="#9A3412" strokeWidth="3" />
          <circle cx="102" cy="48" r="4.5" fill="#1E293B" />
          <circle cx="100" cy="46" r="1.5" fill="#FFFFFF" />
          <circle cx="122" cy="48" r="4.5" fill="#1E293B" />
          <circle cx="120" cy="46" r="1.5" fill="#FFFFFF" />
          <polygon points="108,56 116,56 112,61" fill="#78350F" />
          <path d="M106 64 Q112 70 118 64" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 5. NẾU LÀ VOI (Elephant) - Vector toàn thân to ngộ nghĩnh
  const isElephant =
    cleanId === 'elephant' ||
    cleanId.includes('elephant') ||
    cleanId === 'wild-animals-1' ||
    emoji === '🐘' ||
    cleanVi.includes('voi');

  if (isElephant) {
    return (
      <div
        className={`${containerClass} rounded-2xl flex items-center justify-center p-1 relative overflow-hidden select-none bg-sky-50/80 ${silhouetteStyle} ${className}`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full max-h-[95%] max-w-[95%] drop-shadow-md transition-transform group-hover:scale-105"
        >
          <ellipse cx="80" cy="146" rx="58" ry="8" fill="#000000" opacity="0.08" />
          <rect x="36" y="68" width="76" height="52" rx="26" fill="#94A3B8" stroke="#475569" strokeWidth="3.5" />
          <rect x="42" y="98" width="18" height="44" rx="8" fill="#64748B" stroke="#334155" strokeWidth="3" />
          <rect x="64" y="100" width="18" height="42" rx="8" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
          <rect x="88" y="100" width="18" height="42" rx="8" fill="#64748B" stroke="#334155" strokeWidth="3" />
          <rect x="104" y="98" width="18" height="44" rx="8" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
          <circle cx="106" cy="54" r="28" fill="#94A3B8" stroke="#475569" strokeWidth="3.5" />
          <path
            d="M82 46 C68 40, 64 64, 76 74 C82 78, 88 74, 88 64 Z"
            fill="#CBD5E1"
            stroke="#475569"
            strokeWidth="3"
          />
          <circle cx="104" cy="50" r="4.5" fill="#0F172A" />
          <circle cx="102" cy="48" r="1.5" fill="#FFFFFF" />
          <path
            d="M110 64 C110 82, 106 94, 118 98 C130 102, 142 90, 136 78 C134 74, 126 76, 126 72 C126 66, 126 60, 126 60 Z"
            fill="#94A3B8"
            stroke="#475569"
            strokeWidth="3"
          />
        </svg>
      </div>
    );
  }

  // 6. NẾU LÀ KHỈ (Monkey) - Vector toàn thân to ngộ nghĩnh
  const isMonkey =
    cleanId === 'monkey' ||
    cleanId.includes('monkey') ||
    cleanId === 'wild-animals-2' ||
    emoji === '🐒' ||
    cleanVi.includes('khỉ');

  if (isMonkey) {
    return (
      <div
        className={`${containerClass} rounded-2xl flex items-center justify-center p-1 relative overflow-hidden select-none bg-amber-50/80 ${silhouetteStyle} ${className}`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full max-h-[95%] max-w-[95%] drop-shadow-md transition-transform group-hover:scale-105"
        >
          <ellipse cx="80" cy="146" rx="58" ry="8" fill="#000000" opacity="0.08" />
          <ellipse cx="80" cy="108" rx="26" ry="28" fill="#92400E" stroke="#78350F" strokeWidth="3.5" />
          <ellipse cx="80" cy="110" rx="17" ry="19" fill="#FED7AA" />
          <ellipse cx="56" cy="134" rx="11" ry="6" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
          <ellipse cx="104" cy="134" rx="11" ry="6" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
          <circle cx="48" cy="56" r="14" fill="#92400E" stroke="#78350F" strokeWidth="3" />
          <circle cx="48" cy="56" r="8" fill="#FED7AA" />
          <circle cx="112" cy="56" r="14" fill="#92400E" stroke="#78350F" strokeWidth="3" />
          <circle cx="112" cy="56" r="8" fill="#FED7AA" />
          <circle cx="80" cy="58" r="30" fill="#92400E" stroke="#78350F" strokeWidth="3.5" />
          <ellipse cx="80" cy="66" rx="19" ry="14" fill="#FED7AA" stroke="#D97706" strokeWidth="2" />
          <circle cx="70" cy="48" r="4.5" fill="#0F172A" />
          <circle cx="68" cy="46" r="1.8" fill="#FFFFFF" />
          <circle cx="90" cy="48" r="4.5" fill="#0F172A" />
          <circle cx="88" cy="46" r="1.8" fill="#FFFFFF" />
          <ellipse cx="80" cy="60" rx="4" ry="2.5" fill="#78350F" />
          <path d="M70 68 Q80 75 90 68" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 7. HIỂN THỊ EMOJI / VECTOR LỚN PHÓNG TO, SẮC NÉT LẤP ĐẦY KHUNG
  return (
    <div
      className={`${containerClass} rounded-2xl flex items-center justify-center relative select-none shadow-xs transition-transform group-hover:scale-105 ${silhouetteStyle} ${className}`}
      style={{
        backgroundColor: bgTint,
        border: `2.5px solid ${colorHex}55`,
      }}
    >
      <div
        className="w-3 h-3 rounded-full absolute top-2 right-2.5 opacity-60"
        style={{ backgroundColor: colorHex }}
      />
      <span
        className="text-6xl sm:text-7xl leading-none filter drop-shadow-sm select-none flex items-center justify-center transform scale-125 sm:scale-135 transition-transform"
        role="img"
        aria-hidden="true"
      >
        {emoji}
      </span>
    </div>
  );
};
