export type AccessoryCategory = 'hat' | 'face' | 'jewelry' | 'prop' | 'plush';

export interface AccessoryItem {
  id: string;
  category: AccessoryCategory;
  nameVi: string;
  nameEn: string;
  imageUrl: string;
  fallbackUrl?: string;
  /** Suggested default normalized position relative to 1:1 character frame (0..1) */
  defaultPos: { x: number; y: number };
  defaultScale: number;
}

export interface CategoryTabDef {
  id: AccessoryCategory;
  nameVi: string;
  iconImage: string;
}

// Giữ nguyên các tài nguyên gốc để làm fallback an toàn
import hatCrown from '../assets/accessories/hat_crown.png';
import hatWitchHat from '../assets/accessories/hat_witch_hat.png';
import hatChefHat from '../assets/accessories/hat_chef_hat.png';
import hatDoctorHat from '../assets/accessories/hat_doctor_hat.png';
import hatCowboyHat from '../assets/accessories/hat_cowboy_hat.png';
import hatBeanie from '../assets/accessories/hat_beanie.png';
import hatBunnyEars from '../assets/accessories/hat_bunny_ears.png';
import hatCatEars from '../assets/accessories/hat_cat_ears.png';
import hatBearBeanie from '../assets/accessories/hat_bear_beanie.png';
import hatFlowerCrown from '../assets/accessories/hat_flower_crown.png';
import hatPartyCone from '../assets/accessories/hat_party_cone.png';
import hatSailorCap from '../assets/accessories/hat_sailor_cap.png';

import faceRoundGlasses from '../assets/accessories/face_round_glasses.png';
import faceSunglasses from '../assets/accessories/face_sunglasses.png';
import faceMustache from '../assets/accessories/face_mustache.png';
import faceBlush from '../assets/accessories/face_blush.png';
import faceClownNose from '../assets/accessories/face_clown_nose.png';
import faceLips from '../assets/accessories/face_lips.png';
import faceEarrings from '../assets/accessories/face_earrings.png';
import faceBearMask from '../assets/accessories/face_bear_mask.png';
import faceHeartGlasses from '../assets/accessories/face_heart_glasses.png';
import faceStarGlasses from '../assets/accessories/face_star_glasses.png';
import faceStarStickers from '../assets/accessories/face_star_stickers.png';
import faceCatWhiskers from '../assets/accessories/face_cat_whiskers.png';

import jewelryPinkBow from '../assets/accessories/jewelry_pink_bow.png';
import jewelryPearlNecklace from '../assets/accessories/jewelry_pearl_necklace.png';
import jewelryFlowerPin from '../assets/accessories/jewelry_flower_pin.png';
import jewelryNecktie from '../assets/accessories/jewelry_necktie.png';
import jewelryScarf from '../assets/accessories/jewelry_scarf.png';
import jewelryMiniTiara from '../assets/accessories/jewelry_mini_tiara.png';
import jewelryStarBadge from '../assets/accessories/jewelry_star_badge.png';
import jewelryFairyWings from '../assets/accessories/jewelry_fairy_wings.png';
import jewelryRedBow from '../assets/accessories/jewelry_red_bow.png';
import jewelryYellowPolkaBow from '../assets/accessories/jewelry_yellow_polka_bow.png';
import jewelryMintBow from '../assets/accessories/jewelry_mint_bow.png';
import jewelryGentlemanBowtie from '../assets/accessories/jewelry_gentleman_bowtie.png';
import jewelryBellChoker from '../assets/accessories/jewelry_bell_choker.png';
import jewelryCandyNecklace from '../assets/accessories/jewelry_candy_necklace.png';

import propMagicWand from '../assets/accessories/prop_magic_wand.png';
import propBalloons from '../assets/accessories/prop_balloons.png';
import propFlowerBouquet from '../assets/accessories/prop_flower_bouquet.png';
import propIceCream from '../assets/accessories/prop_ice_cream.png';
import propStorybook from '../assets/accessories/prop_storybook.png';
import propCrystalStaff from '../assets/accessories/prop_crystal_staff.png';
import propGuitar from '../assets/accessories/prop_guitar.png';
import propBackpack from '../assets/accessories/prop_backpack.png';
import propLollipop from '../assets/accessories/prop_lollipop.png';
import propHeartBalloon from '../assets/accessories/prop_heart_balloon.png';
import propRainbowScepter from '../assets/accessories/prop_rainbow_scepter.png';
import propBabyBottle from '../assets/accessories/prop_baby_bottle.png';

import plushSneakers from '../assets/accessories/plush_sneakers.png';
import plushMaryJane from '../assets/accessories/plush_mary_jane.png';
import plushRainBoots from '../assets/accessories/plush_rain_boots.png';
import plushSandals from '../assets/accessories/plush_sandals.png';
import plushTeddyBear from '../assets/accessories/plush_teddy_bear.png';
import plushBunnyPlush from '../assets/accessories/plush_bunny_plush.png';
import plushCatPlush from '../assets/accessories/plush_cat_plush.png';
import plushPuppyPlush from '../assets/accessories/plush_puppy_plush.png';
import plushBearSlippers from '../assets/accessories/plush_bear_slippers.png';
import plushDinoPlush from '../assets/accessories/plush_dino_plush.png';
import plushFrogPlush from '../assets/accessories/plush_frog_plush.png';
import plushRubberDuck from '../assets/accessories/plush_rubber_duck.png';

// Nhập các vector 3D Clay Chibi mới nâng cấp
import {
  svgHatWitch,
  svgHatChef,
  svgHatDoctor,
  svgHatCowboy,
  svgHatBeanie,
  svgHatBunnyEars,
  svgHatCatEars,
  svgHatPolice,
  svgHatFirefighter,
  svgHatPilot,
  svgHatPartyCone,
  svgHatFlowerCrown,
  svgHatSailorCap,
  svgHatBearBeanie,
  svgFaceRoundGlasses,
  svgFaceSunglasses,
  svgFaceHeartGlasses,
  svgFaceStarGlasses,
  svgFaceBlush,
  svgFaceMustache,
  svgFaceClownNose,
  svgFaceLips,
  svgFaceEarrings,
  svgFaceBearMask,
  svgFaceSwimGoggles,
  svgFaceStarStickers,
  svgFaceCatWhiskers,
  svgJewelryPinkBow,
  svgJewelryRedBow,
  svgJewelryFlowerPin,
  svgJewelryPearlNecklace,
  svgJewelryMiniTiara,
  svgJewelryFairyWings,
  svgJewelryScarf,
  svgJewelryCandyNecklace,
  svgJewelryYellowPolkaBow,
  svgJewelryMintBow,
  svgJewelryGentlemanBowtie,
  svgJewelryBellChoker,
  svgJewelryStarBadge,
  svgPropMagicWand,
  svgPropLollipop,
  svgPropHeartBalloon,
  svgPropKnightSword,
  svgPropStethoscope,
  svgPropRainbowScepter,
  svgPropBabyBottle,
  svgPropBalloons,
  svgPropFlowerBouquet,
  svgPropIceCream,
  svgPropStorybook,
  svgPropCrystalStaff,
  svgPropGuitar,
  svgPropBackpack,
  svgPlushTeddyBear,
  svgPlushClayBunny,
  svgPlushClayDino,
  svgPlushClayDuck,
  svgPlushClayCat,
  svgPlushPuppyPlush,
  svgPlushSneakers,
  svgPlushMaryJane,
  svgPlushRainBoots,
  svgPlushSandals,
  svgPlushBearSlippers,
  svgPlushFrogPlush,
} from '../assets/accessories/clayVectors';

/**
 * 5 Danh mục chính.
 * GIỮ NGUYÊN biểu tượng Vương Miện vàng cho danh mục Mũ (hatCrown)
 * GIỮ NGUYÊN biểu tượng Nơ/Cà vạt tối màu cho danh mục Nơ & Cổ (jewelryNecktie)
 */
export const CATEGORY_TABS: CategoryTabDef[] = [
  { id: 'hat', nameVi: 'Mũ & Nón', iconImage: hatCrown },
  { id: 'face', nameVi: 'Kính & Mặt', iconImage: svgFaceRoundGlasses },
  { id: 'jewelry', nameVi: 'Nơ & Cổ', iconImage: jewelryNecktie },
  { id: 'prop', nameVi: 'Cầm Tay', iconImage: svgPropMagicWand },
  { id: 'plush', nameVi: 'Giày & Thú', iconImage: svgPlushTeddyBear },
];

export const ACCESSORIES_DATA: AccessoryItem[] = [
  // =========================================================================
  // 1. MŨ & NÓN (hat)
  // =========================================================================
  {
    // GIỮ NGUYÊN HOÀN TOÀN MÓN VƯƠNG MIỆN VÀNG
    id: 'hat-crown',
    category: 'hat',
    nameVi: 'Vương miện vàng',
    nameEn: 'Golden Crown',
    imageUrl: hatCrown,
    fallbackUrl: hatCrown,
    defaultPos: { x: 0.5, y: 0.16 },
    defaultScale: 1.1,
  },
  {
    id: 'hat-witch',
    category: 'hat',
    nameVi: 'Mũ phù thủy',
    nameEn: 'Witch Hat',
    imageUrl: svgHatWitch,
    fallbackUrl: hatWitchHat,
    defaultPos: { x: 0.5, y: 0.14 },
    defaultScale: 1.2,
  },
  {
    id: 'hat-chef',
    category: 'hat',
    nameVi: 'Mũ đầu bếp',
    nameEn: 'Chef Hat',
    imageUrl: svgHatChef,
    fallbackUrl: hatChefHat,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.15,
  },
  {
    id: 'hat-doctor',
    category: 'hat',
    nameVi: 'Mũ bác sĩ',
    nameEn: 'Doctor Cap',
    imageUrl: svgHatDoctor,
    fallbackUrl: hatDoctorHat,
    defaultPos: { x: 0.5, y: 0.17 },
    defaultScale: 1.05,
  },
  {
    id: 'hat-cowboy',
    category: 'hat',
    nameVi: 'Mũ cao bồi',
    nameEn: 'Cowboy Hat',
    imageUrl: svgHatCowboy,
    fallbackUrl: hatCowboyHat,
    defaultPos: { x: 0.5, y: 0.16 },
    defaultScale: 1.25,
  },
  {
    id: 'hat-beanie',
    category: 'hat',
    nameVi: 'Mũ len ấm áp',
    nameEn: 'Warm Beanie',
    imageUrl: svgHatBeanie,
    fallbackUrl: hatBeanie,
    defaultPos: { x: 0.5, y: 0.16 },
    defaultScale: 1.1,
  },
  {
    id: 'hat-bunny-ears',
    category: 'hat',
    nameVi: 'Tai thỏ xinh',
    nameEn: 'Bunny Ears',
    imageUrl: svgHatBunnyEars,
    fallbackUrl: hatBunnyEars,
    defaultPos: { x: 0.5, y: 0.13 },
    defaultScale: 1.2,
  },
  {
    id: 'hat-cat-ears',
    category: 'hat',
    nameVi: 'Tai mèo tím',
    nameEn: 'Cat Ears',
    imageUrl: svgHatCatEars,
    fallbackUrl: hatCatEars,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.15,
  },
  {
    id: 'hat-police',
    category: 'hat',
    nameVi: 'Mũ cảnh sát',
    nameEn: 'Police Cap',
    imageUrl: svgHatPolice,
    fallbackUrl: hatSailorCap,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.15,
  },
  {
    id: 'hat-firefighter',
    category: 'hat',
    nameVi: 'Mũ cứu hỏa',
    nameEn: 'Fire Helmet',
    imageUrl: svgHatFirefighter,
    fallbackUrl: hatDoctorHat,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.15,
  },
  {
    id: 'hat-pilot',
    category: 'hat',
    nameVi: 'Mũ phi công',
    nameEn: 'Pilot Hat',
    imageUrl: svgHatPilot,
    fallbackUrl: hatCowboyHat,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.15,
  },
  {
    id: 'hat-party-cone',
    category: 'hat',
    nameVi: 'Nón sinh nhật',
    nameEn: 'Party Cone',
    imageUrl: svgHatPartyCone,
    fallbackUrl: hatPartyCone,
    defaultPos: { x: 0.5, y: 0.13 },
    defaultScale: 1.1,
  },
  {
    id: 'hat-flower-crown',
    category: 'hat',
    nameVi: 'Vòng hoa đầu',
    nameEn: 'Flower Crown',
    imageUrl: svgHatFlowerCrown,
    fallbackUrl: hatFlowerCrown,
    defaultPos: { x: 0.5, y: 0.17 },
    defaultScale: 1.1,
  },
  {
    id: 'hat-sailor-cap',
    category: 'hat',
    nameVi: 'Mũ thủy thủ',
    nameEn: 'Sailor Cap',
    imageUrl: svgHatSailorCap,
    fallbackUrl: hatSailorCap,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.1,
  },
  {
    id: 'hat-bear-beanie',
    category: 'hat',
    nameVi: 'Mũ len gấu',
    nameEn: 'Bear Beanie',
    imageUrl: svgHatBearBeanie,
    fallbackUrl: hatBearBeanie,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.15,
  },

  // =========================================================================
  // 2. KÍNH & MẶT (face)
  // =========================================================================
  {
    id: 'face-round-glasses',
    category: 'face',
    nameVi: 'Kính tròn tri',
    nameEn: 'Round Glasses',
    imageUrl: svgFaceRoundGlasses,
    fallbackUrl: faceRoundGlasses,
    defaultPos: { x: 0.5, y: 0.32 },
    defaultScale: 1.05,
  },
  {
    id: 'face-sunglasses',
    category: 'face',
    nameVi: 'Kính râm ngầu',
    nameEn: 'Cool Sunglasses',
    imageUrl: svgFaceSunglasses,
    fallbackUrl: faceSunglasses,
    defaultPos: { x: 0.5, y: 0.32 },
    defaultScale: 1.1,
  },
  {
    id: 'face-heart-glasses',
    category: 'face',
    nameVi: 'Kính tim hồng',
    nameEn: 'Heart Sunglasses',
    imageUrl: svgFaceHeartGlasses,
    fallbackUrl: faceHeartGlasses,
    defaultPos: { x: 0.5, y: 0.32 },
    defaultScale: 1.15,
  },
  {
    id: 'face-star-glasses',
    category: 'face',
    nameVi: 'Kính ngôi sao',
    nameEn: 'Star Sunglasses',
    imageUrl: svgFaceStarGlasses,
    fallbackUrl: faceStarGlasses,
    defaultPos: { x: 0.5, y: 0.32 },
    defaultScale: 1.15,
  },
  {
    id: 'face-blush',
    category: 'face',
    nameVi: 'Má hồng đào',
    nameEn: 'Rosy Cheeks',
    imageUrl: svgFaceBlush,
    fallbackUrl: faceBlush,
    defaultPos: { x: 0.5, y: 0.36 },
    defaultScale: 1.05,
  },
  {
    id: 'face-mustache',
    category: 'face',
    nameVi: 'Ria mép nâu',
    nameEn: 'Funny Mustache',
    imageUrl: svgFaceMustache,
    fallbackUrl: faceMustache,
    defaultPos: { x: 0.5, y: 0.38 },
    defaultScale: 0.9,
  },
  {
    id: 'face-clown-nose',
    category: 'face',
    nameVi: 'Mũi hề đỏ',
    nameEn: 'Clown Red Nose',
    imageUrl: svgFaceClownNose,
    fallbackUrl: faceClownNose,
    defaultPos: { x: 0.5, y: 0.35 },
    defaultScale: 0.9,
  },
  {
    id: 'face-swim-goggles',
    category: 'face',
    nameVi: 'Kính bơi xanh',
    nameEn: 'Swim Goggles',
    imageUrl: svgFaceSwimGoggles,
    fallbackUrl: faceRoundGlasses,
    defaultPos: { x: 0.5, y: 0.32 },
    defaultScale: 1.1,
  },
  {
    id: 'face-star-stickers',
    category: 'face',
    nameVi: 'Dán má sao',
    nameEn: 'Star Stickers',
    imageUrl: svgFaceStarStickers,
    fallbackUrl: faceStarStickers,
    defaultPos: { x: 0.5, y: 0.36 },
    defaultScale: 0.95,
  },
  {
    id: 'face-cat-whiskers',
    category: 'face',
    nameVi: 'Ria mèo xinh',
    nameEn: 'Playful Whiskers',
    imageUrl: svgFaceCatWhiskers,
    fallbackUrl: faceCatWhiskers,
    defaultPos: { x: 0.5, y: 0.38 },
    defaultScale: 1.05,
  },
  {
    // ĐÃ TÁI TẠO NỤ CƯỜI TƯƠI TRỌN VẸN
    id: 'face-lips',
    category: 'face',
    nameVi: 'Nụ cười tươi',
    nameEn: 'Sweet Smile',
    imageUrl: svgFaceLips,
    fallbackUrl: faceLips,
    defaultPos: { x: 0.5, y: 0.42 },
    defaultScale: 0.85,
  },
  {
    // ĐÃ TÁI TẠO CẶP KHUYÊN TAI ĐỐI XỨNG CÂN ĐỐI
    id: 'face-earrings',
    category: 'face',
    nameVi: 'Khuyên tai sao',
    nameEn: 'Star Earrings',
    imageUrl: svgFaceEarrings,
    fallbackUrl: faceEarrings,
    defaultPos: { x: 0.5, y: 0.35 },
    defaultScale: 1.25,
  },
  {
    // ĐÃ TÁI TẠO MẶT NẠ GẤU RÕ NÉT TRÊN MỌI NỀN
    id: 'face-bear-mask',
    category: 'face',
    nameVi: 'Mặt nạ gấu',
    nameEn: 'Bear Mask',
    imageUrl: svgFaceBearMask,
    fallbackUrl: faceBearMask,
    defaultPos: { x: 0.5, y: 0.33 },
    defaultScale: 1.1,
  },

  // =========================================================================
  // 3. NƠ & CỔ (jewelry)
  // =========================================================================
  {
    // GIỮ NGUYÊN CÀ VẠT LỊCH SỰ
    id: 'jewelry-necktie',
    category: 'jewelry',
    nameVi: 'Cà vạt lịch sự',
    nameEn: 'Smart Necktie',
    imageUrl: jewelryNecktie,
    fallbackUrl: jewelryNecktie,
    defaultPos: { x: 0.5, y: 0.56 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-pink-bow',
    category: 'jewelry',
    nameVi: 'Nơ hồng xinh',
    nameEn: 'Pink Bow',
    imageUrl: svgJewelryPinkBow,
    fallbackUrl: jewelryPinkBow,
    defaultPos: { x: 0.5, y: 0.50 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-red-bow',
    category: 'jewelry',
    nameVi: 'Nơ đỏ nhung',
    nameEn: 'Velvet Red Bow',
    imageUrl: svgJewelryRedBow,
    fallbackUrl: jewelryRedBow,
    defaultPos: { x: 0.5, y: 0.50 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-scarf',
    category: 'jewelry',
    nameVi: 'Khăn quàng đỏ',
    nameEn: 'Warm Red Scarf',
    imageUrl: svgJewelryScarf,
    fallbackUrl: jewelryScarf,
    defaultPos: { x: 0.5, y: 0.51 },
    defaultScale: 1.15,
  },
  {
    id: 'jewelry-candy-necklace',
    category: 'jewelry',
    nameVi: 'Vòng kẹo ngọt',
    nameEn: 'Sweet Candy Necklace',
    imageUrl: svgJewelryCandyNecklace,
    fallbackUrl: jewelryCandyNecklace,
    defaultPos: { x: 0.5, y: 0.52 },
    defaultScale: 1.05,
  },
  {
    id: 'jewelry-yellow-polka-bow',
    category: 'jewelry',
    nameVi: 'Nơ chấm bi',
    nameEn: 'Yellow Polka Bow',
    imageUrl: svgJewelryYellowPolkaBow,
    fallbackUrl: jewelryYellowPolkaBow,
    defaultPos: { x: 0.5, y: 0.50 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-mint-bow',
    category: 'jewelry',
    nameVi: 'Nơ ngọc mint',
    nameEn: 'Mint Silk Bow',
    imageUrl: svgJewelryMintBow,
    fallbackUrl: jewelryMintBow,
    defaultPos: { x: 0.5, y: 0.50 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-gentleman-bowtie',
    category: 'jewelry',
    nameVi: 'Nơ bướm đen',
    nameEn: 'Gentleman Bowtie',
    imageUrl: svgJewelryGentlemanBowtie,
    fallbackUrl: jewelryGentlemanBowtie,
    defaultPos: { x: 0.5, y: 0.51 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-bell-choker',
    category: 'jewelry',
    nameVi: 'Vòng chuông',
    nameEn: 'Bell Choker',
    imageUrl: svgJewelryBellChoker,
    fallbackUrl: jewelryBellChoker,
    defaultPos: { x: 0.5, y: 0.51 },
    defaultScale: 1.0,
  },
  {
    // ĐÃ TÁI TẠO VÒNG NGỌC TRAI TƯƠNG PHẢN TỐT TRÊN NỀN SÁNG
    id: 'jewelry-pearl-necklace',
    category: 'jewelry',
    nameVi: 'Vòng ngọc trai',
    nameEn: 'Pearl Necklace',
    imageUrl: svgJewelryPearlNecklace,
    fallbackUrl: jewelryPearlNecklace,
    defaultPos: { x: 0.5, y: 0.52 },
    defaultScale: 1.05,
  },
  {
    // ĐÃ TÁI TẠO CÀI ÁO HOA VÀNG NGUYÊN VẸN ĐẦY ĐỦ
    id: 'jewelry-flower-pin',
    category: 'jewelry',
    nameVi: 'Cài áo hoa',
    nameEn: 'Flower Pin',
    imageUrl: svgJewelryFlowerPin,
    fallbackUrl: jewelryFlowerPin,
    defaultPos: { x: 0.42, y: 0.54 },
    defaultScale: 0.9,
  },
  {
    // ĐÃ TÁI TẠO VƯƠNG MIỆN NHỎ TRỌN VẸN 5 ĐỈNH
    id: 'jewelry-mini-tiara',
    category: 'jewelry',
    nameVi: 'Vương miện nhỏ',
    nameEn: 'Princess Tiara',
    imageUrl: svgJewelryMiniTiara,
    fallbackUrl: jewelryMiniTiara,
    defaultPos: { x: 0.5, y: 0.17 },
    defaultScale: 0.95,
  },
  {
    id: 'jewelry-star-badge',
    category: 'jewelry',
    nameVi: 'Huy hiệu sao',
    nameEn: 'Star Badge',
    imageUrl: svgJewelryStarBadge,
    fallbackUrl: jewelryStarBadge,
    defaultPos: { x: 0.42, y: 0.54 },
    defaultScale: 0.85,
  },
  {
    // ĐÃ TÁI TẠO CÁNH TIÊN MỊN TRONG SUỐT 100%
    id: 'jewelry-fairy-wings',
    category: 'jewelry',
    nameVi: 'Cánh tiên xinh',
    nameEn: 'Fairy Wings',
    imageUrl: svgJewelryFairyWings,
    fallbackUrl: jewelryFairyWings,
    defaultPos: { x: 0.5, y: 0.50 },
    defaultScale: 1.4,
  },

  // =========================================================================
  // 4. CẦM TAY (prop)
  // =========================================================================
  {
    id: 'prop-magic-wand',
    category: 'prop',
    nameVi: 'Đũa thần kỳ',
    nameEn: 'Magic Wand',
    imageUrl: svgPropMagicWand,
    fallbackUrl: propMagicWand,
    defaultPos: { x: 0.76, y: 0.55 },
    defaultScale: 1.1,
  },
  {
    id: 'prop-lollipop',
    category: 'prop',
    nameVi: 'Kẹo mút xoắn',
    nameEn: 'Rainbow Lollipop',
    imageUrl: svgPropLollipop,
    fallbackUrl: propLollipop,
    defaultPos: { x: 0.74, y: 0.56 },
    defaultScale: 1.05,
  },
  {
    id: 'prop-heart-balloon',
    category: 'prop',
    nameVi: 'Bóng trái tim',
    nameEn: 'Heart Balloon',
    imageUrl: svgPropHeartBalloon,
    fallbackUrl: propHeartBalloon,
    defaultPos: { x: 0.78, y: 0.34 },
    defaultScale: 1.2,
  },
  {
    id: 'prop-knight-sword',
    category: 'prop',
    nameVi: 'Kiếm hiệp sĩ',
    nameEn: 'Hero Sword',
    imageUrl: svgPropKnightSword,
    fallbackUrl: propCrystalStaff,
    defaultPos: { x: 0.74, y: 0.55 },
    defaultScale: 1.15,
  },
  {
    id: 'prop-stethoscope',
    category: 'prop',
    nameVi: 'Ống nghe y tế',
    nameEn: 'Stethoscope',
    imageUrl: svgPropStethoscope,
    fallbackUrl: propBabyBottle,
    defaultPos: { x: 0.5, y: 0.52 },
    defaultScale: 1.1,
  },
  {
    id: 'prop-rainbow-scepter',
    category: 'prop',
    nameVi: 'Gậy cầu vồng',
    nameEn: 'Rainbow Scepter',
    imageUrl: svgPropRainbowScepter,
    fallbackUrl: propRainbowScepter,
    defaultPos: { x: 0.76, y: 0.54 },
    defaultScale: 1.15,
  },
  {
    id: 'prop-baby-bottle',
    category: 'prop',
    nameVi: 'Bình sữa em bé',
    nameEn: 'Baby Bottle',
    imageUrl: svgPropBabyBottle,
    fallbackUrl: propBabyBottle,
    defaultPos: { x: 0.72, y: 0.60 },
    defaultScale: 0.95,
  },
  {
    id: 'prop-balloons',
    category: 'prop',
    nameVi: 'Bóng bay màu',
    nameEn: 'Party Balloons',
    imageUrl: svgPropBalloons,
    fallbackUrl: propBalloons,
    defaultPos: { x: 0.78, y: 0.35 },
    defaultScale: 1.25,
  },
  {
    id: 'prop-flower-bouquet',
    category: 'prop',
    nameVi: 'Bó hoa tươi',
    nameEn: 'Flower Bouquet',
    imageUrl: svgPropFlowerBouquet,
    fallbackUrl: propFlowerBouquet,
    defaultPos: { x: 0.74, y: 0.60 },
    defaultScale: 1.1,
  },
  {
    id: 'prop-ice-cream',
    category: 'prop',
    nameVi: 'Kem ốc quế',
    nameEn: 'Ice Cream Cone',
    imageUrl: svgPropIceCream,
    fallbackUrl: propIceCream,
    defaultPos: { x: 0.74, y: 0.58 },
    defaultScale: 0.95,
  },
  {
    id: 'prop-storybook',
    category: 'prop',
    nameVi: 'Sách cổ tích',
    nameEn: 'Fairy Storybook',
    imageUrl: svgPropStorybook,
    fallbackUrl: propStorybook,
    defaultPos: { x: 0.74, y: 0.62 },
    defaultScale: 1.0,
  },
  {
    id: 'prop-crystal-staff',
    category: 'prop',
    nameVi: 'Gậy pha lê',
    nameEn: 'Crystal Staff',
    imageUrl: svgPropCrystalStaff,
    fallbackUrl: propCrystalStaff,
    defaultPos: { x: 0.76, y: 0.55 },
    defaultScale: 1.2,
  },
  {
    id: 'prop-guitar',
    category: 'prop',
    nameVi: 'Đàn ukulele',
    nameEn: 'Little Ukulele',
    imageUrl: svgPropGuitar,
    fallbackUrl: propGuitar,
    defaultPos: { x: 0.5, y: 0.64 },
    defaultScale: 1.2,
  },
  {
    id: 'prop-backpack',
    category: 'prop',
    nameVi: 'Balo đi học',
    nameEn: 'School Backpack',
    imageUrl: svgPropBackpack,
    fallbackUrl: propBackpack,
    defaultPos: { x: 0.26, y: 0.60 },
    defaultScale: 1.1,
  },

  // =========================================================================
  // 5. GIÀY & THÚ (plush)
  // =========================================================================
  {
    id: 'plush-teddy-bear',
    category: 'plush',
    nameVi: 'Gấu nâu đất',
    nameEn: 'Little Teddy Bear',
    imageUrl: svgPlushTeddyBear,
    fallbackUrl: plushTeddyBear,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.15,
  },
  {
    id: 'plush-bunny-plush',
    category: 'plush',
    nameVi: 'Thỏ trắng con',
    nameEn: 'Bunny Plushie',
    imageUrl: svgPlushClayBunny,
    fallbackUrl: plushBunnyPlush,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.15,
  },
  {
    id: 'plush-cat-plush',
    category: 'plush',
    nameVi: 'Mèo con vui',
    nameEn: 'Kitty Plushie',
    imageUrl: svgPlushClayCat,
    fallbackUrl: plushCatPlush,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.15,
  },
  {
    id: 'plush-dino-plush',
    category: 'plush',
    nameVi: 'Khủng long con',
    nameEn: 'Baby Dino Plushie',
    imageUrl: svgPlushClayDino,
    fallbackUrl: plushDinoPlush,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.15,
  },
  {
    id: 'plush-rubber-duck',
    category: 'plush',
    nameVi: 'Vịt vàng bơi',
    nameEn: 'Yellow Rubber Duck',
    imageUrl: svgPlushClayDuck,
    fallbackUrl: plushRubberDuck,
    defaultPos: { x: 0.28, y: 0.64 },
    defaultScale: 1.0,
  },
  {
    id: 'plush-sneakers',
    category: 'plush',
    nameVi: 'Giày thể thao',
    nameEn: 'Sport Sneakers',
    imageUrl: svgPlushSneakers,
    fallbackUrl: plushSneakers,
    defaultPos: { x: 0.5, y: 0.88 },
    defaultScale: 1.1,
  },
  {
    id: 'plush-bear-slippers',
    category: 'plush',
    nameVi: 'Dép bông gấu',
    nameEn: 'Cozy Bear Slippers',
    imageUrl: svgPlushBearSlippers,
    fallbackUrl: plushBearSlippers,
    defaultPos: { x: 0.5, y: 0.88 },
    defaultScale: 1.1,
  },
  {
    id: 'plush-frog-plush',
    category: 'plush',
    nameVi: 'Ếch xanh con',
    nameEn: 'Green Frog Plushie',
    imageUrl: svgPlushFrogPlush,
    fallbackUrl: plushFrogPlush,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.05,
  },
  {
    // ĐÃ TÁI TẠO ĐÔI GIÀY BÚP BÊ CÂN ĐỐI KHÔNG CHỒNG LẤN
    id: 'plush-mary-jane',
    category: 'plush',
    nameVi: 'Giày búp bê đỏ',
    nameEn: 'Mary Jane Shoes',
    imageUrl: svgPlushMaryJane,
    fallbackUrl: plushMaryJane,
    defaultPos: { x: 0.5, y: 0.88 },
    defaultScale: 1.05,
  },
  {
    // ĐÃ TÁI TẠO ĐÔI ỦNG ĐI MƯA ĐỨNG THẲNG RIÊNG BIỆT
    id: 'plush-rain-boots',
    category: 'plush',
    nameVi: 'Ủng đi mưa',
    nameEn: 'Rain Boots',
    imageUrl: svgPlushRainBoots,
    fallbackUrl: plushRainBoots,
    defaultPos: { x: 0.5, y: 0.88 },
    defaultScale: 1.15,
  },
  {
    // ĐÃ TÁI TẠO ĐÔI DÉP SANDAL HÈ 2 CHIẾC SONG SONG
    id: 'plush-sandals',
    category: 'plush',
    nameVi: 'Dép sandal hè',
    nameEn: 'Summer Sandals',
    imageUrl: svgPlushSandals,
    fallbackUrl: plushSandals,
    defaultPos: { x: 0.5, y: 0.88 },
    defaultScale: 1.05,
  },
  {
    // ĐÃ TÁI TẠO CÚN ĐỐM 1 BÉ DUY NHẤT CHIBI ĐÁNG YÊU
    id: 'plush-puppy-plush',
    category: 'plush',
    nameVi: 'Cún đốm con',
    nameEn: 'Puppy Plushie',
    imageUrl: svgPlushPuppyPlush,
    fallbackUrl: plushPuppyPlush,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.1,
  },
];
