// 62 3D Clay Chibi Accessories across 5 categories with perfect anchors & zero clipping
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

export type AccessoryCategory = 'hat' | 'face' | 'jewelry' | 'prop' | 'plush';

export interface AccessoryItem {
  id: string;
  category: AccessoryCategory;
  nameVi: string;
  nameEn: string;
  imageUrl: string;
  /** Suggested default normalized position relative to 1:1 character frame (0..1) */
  defaultPos: { x: number; y: number };
  defaultScale: number;
}

export interface CategoryTabDef {
  id: AccessoryCategory;
  nameVi: string;
  iconImage: string;
}

export const CATEGORY_TABS: CategoryTabDef[] = [
  { id: 'hat', nameVi: 'Mũ & Nón', iconImage: hatCrown },
  { id: 'face', nameVi: 'Kính & Mặt', iconImage: faceRoundGlasses },
  { id: 'jewelry', nameVi: 'Nơ & Cổ', iconImage: jewelryPinkBow },
  { id: 'prop', nameVi: 'Cầm Tay', iconImage: propMagicWand },
  { id: 'plush', nameVi: 'Giày & Thú', iconImage: plushTeddyBear },
];

export const ACCESSORIES_DATA: AccessoryItem[] = [
  // 1. Mũ & Nón (hat - 12 items)
  {
    id: 'hat-crown',
    category: 'hat',
    nameVi: 'Vương miện vàng',
    nameEn: 'Golden Crown',
    imageUrl: hatCrown,
    defaultPos: { x: 0.5, y: 0.16 },
    defaultScale: 1.1,
  },
  {
    id: 'hat-witch',
    category: 'hat',
    nameVi: 'Mũ phù thủy',
    nameEn: 'Witch Hat',
    imageUrl: hatWitchHat,
    defaultPos: { x: 0.5, y: 0.14 },
    defaultScale: 1.2,
  },
  {
    id: 'hat-chef',
    category: 'hat',
    nameVi: 'Mũ đầu bếp',
    nameEn: 'Chef Hat',
    imageUrl: hatChefHat,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.15,
  },
  {
    id: 'hat-doctor',
    category: 'hat',
    nameVi: 'Mũ bác sĩ',
    nameEn: 'Doctor Cap',
    imageUrl: hatDoctorHat,
    defaultPos: { x: 0.5, y: 0.17 },
    defaultScale: 1.05,
  },
  {
    id: 'hat-cowboy',
    category: 'hat',
    nameVi: 'Mũ cao bồi',
    nameEn: 'Cowboy Hat',
    imageUrl: hatCowboyHat,
    defaultPos: { x: 0.5, y: 0.16 },
    defaultScale: 1.25,
  },
  {
    id: 'hat-beanie',
    category: 'hat',
    nameVi: 'Mũ len ấm áp',
    nameEn: 'Warm Beanie',
    imageUrl: hatBeanie,
    defaultPos: { x: 0.5, y: 0.16 },
    defaultScale: 1.1,
  },
  {
    id: 'hat-bunny-ears',
    category: 'hat',
    nameVi: 'Tai thỏ xinh',
    nameEn: 'Bunny Ears',
    imageUrl: hatBunnyEars,
    defaultPos: { x: 0.5, y: 0.13 },
    defaultScale: 1.2,
  },
  {
    id: 'hat-cat-ears',
    category: 'hat',
    nameVi: 'Tai mèo tím',
    nameEn: 'Cat Ears',
    imageUrl: hatCatEars,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.15,
  },
  {
    id: 'hat-bear-beanie',
    category: 'hat',
    nameVi: 'Mũ len tai gấu',
    nameEn: 'Bear Beanie',
    imageUrl: hatBearBeanie,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.15,
  },
  {
    id: 'hat-flower-crown',
    category: 'hat',
    nameVi: 'Vòng hoa cài đầu',
    nameEn: 'Flower Crown',
    imageUrl: hatFlowerCrown,
    defaultPos: { x: 0.5, y: 0.17 },
    defaultScale: 1.1,
  },
  {
    id: 'hat-party-cone',
    category: 'hat',
    nameVi: 'Mũ chóp sinh nhật',
    nameEn: 'Party Cone Hat',
    imageUrl: hatPartyCone,
    defaultPos: { x: 0.5, y: 0.13 },
    defaultScale: 1.1,
  },
  {
    id: 'hat-sailor-cap',
    category: 'hat',
    nameVi: 'Mũ thủy thủ xanh',
    nameEn: 'Sailor Cap',
    imageUrl: hatSailorCap,
    defaultPos: { x: 0.5, y: 0.15 },
    defaultScale: 1.1,
  },

  // 2. Kính & Mặt (face - 12 items)
  {
    id: 'face-round-glasses',
    category: 'face',
    nameVi: 'Kính tròn tri thức',
    nameEn: 'Round Glasses',
    imageUrl: faceRoundGlasses,
    defaultPos: { x: 0.5, y: 0.32 },
    defaultScale: 1.05,
  },
  {
    id: 'face-sunglasses',
    category: 'face',
    nameVi: 'Kính râm sành điệu',
    nameEn: 'Cool Sunglasses',
    imageUrl: faceSunglasses,
    defaultPos: { x: 0.5, y: 0.32 },
    defaultScale: 1.1,
  },
  {
    id: 'face-heart-glasses',
    category: 'face',
    nameVi: 'Kính mắt trái tim',
    nameEn: 'Heart Sunglasses',
    imageUrl: faceHeartGlasses,
    defaultPos: { x: 0.5, y: 0.32 },
    defaultScale: 1.15,
  },
  {
    id: 'face-star-glasses',
    category: 'face',
    nameVi: 'Kính mắt ngôi sao',
    nameEn: 'Star Sunglasses',
    imageUrl: faceStarGlasses,
    defaultPos: { x: 0.5, y: 0.32 },
    defaultScale: 1.15,
  },
  {
    id: 'face-star-stickers',
    category: 'face',
    nameVi: 'Dán má ngôi sao',
    nameEn: 'Star Face Stickers',
    imageUrl: faceStarStickers,
    defaultPos: { x: 0.5, y: 0.36 },
    defaultScale: 0.95,
  },
  {
    id: 'face-cat-whiskers',
    category: 'face',
    nameVi: 'Ria mèo tinh nghịch',
    nameEn: 'Playful Whiskers',
    imageUrl: faceCatWhiskers,
    defaultPos: { x: 0.5, y: 0.38 },
    defaultScale: 1.05,
  },
  {
    id: 'face-mustache',
    category: 'face',
    nameVi: 'Ria mép ngộ nghĩnh',
    nameEn: 'Funny Mustache',
    imageUrl: faceMustache,
    defaultPos: { x: 0.5, y: 0.38 },
    defaultScale: 0.9,
  },
  {
    id: 'face-blush',
    category: 'face',
    nameVi: 'Má hồng đào',
    nameEn: 'Rosy Cheeks',
    imageUrl: faceBlush,
    defaultPos: { x: 0.5, y: 0.36 },
    defaultScale: 1.05,
  },
  {
    id: 'face-clown-nose',
    category: 'face',
    nameVi: 'Mũi hề đỏ',
    nameEn: 'Clown Red Nose',
    imageUrl: faceClownNose,
    defaultPos: { x: 0.5, y: 0.35 },
    defaultScale: 0.9,
  },
  {
    id: 'face-lips',
    category: 'face',
    nameVi: 'Nụ cười tươi',
    nameEn: 'Sweet Smile',
    imageUrl: faceLips,
    defaultPos: { x: 0.5, y: 0.42 },
    defaultScale: 0.85,
  },
  {
    id: 'face-earrings',
    category: 'face',
    nameVi: 'Khuyên tai sao',
    nameEn: 'Star Earrings',
    imageUrl: faceEarrings,
    defaultPos: { x: 0.5, y: 0.35 },
    defaultScale: 1.25,
  },
  {
    id: 'face-bear-mask',
    category: 'face',
    nameVi: 'Mặt nạ gấu con',
    nameEn: 'Bear Mask',
    imageUrl: faceBearMask,
    defaultPos: { x: 0.5, y: 0.33 },
    defaultScale: 1.1,
  },

  // 3. Nơ & Cổ (jewelry - 14 items)
  {
    id: 'jewelry-pink-bow',
    category: 'jewelry',
    nameVi: 'Nơ hồng rực rỡ',
    nameEn: 'Pink Bow',
    imageUrl: jewelryPinkBow,
    defaultPos: { x: 0.5, y: 0.50 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-red-bow',
    category: 'jewelry',
    nameVi: 'Nơ đỏ nhung',
    nameEn: 'Velvet Red Bow',
    imageUrl: jewelryRedBow,
    defaultPos: { x: 0.5, y: 0.50 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-yellow-polka-bow',
    category: 'jewelry',
    nameVi: 'Nơ vàng chấm bi',
    nameEn: 'Yellow Polka Bow',
    imageUrl: jewelryYellowPolkaBow,
    defaultPos: { x: 0.5, y: 0.50 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-mint-bow',
    category: 'jewelry',
    nameVi: 'Nơ xanh ngọc mint',
    nameEn: 'Mint Silk Bow',
    imageUrl: jewelryMintBow,
    defaultPos: { x: 0.5, y: 0.50 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-gentleman-bowtie',
    category: 'jewelry',
    nameVi: 'Nơ bướm quý ông',
    nameEn: 'Gentleman Bowtie',
    imageUrl: jewelryGentlemanBowtie,
    defaultPos: { x: 0.5, y: 0.51 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-necktie',
    category: 'jewelry',
    nameVi: 'Cà vạt lịch sự',
    nameEn: 'Smart Necktie',
    imageUrl: jewelryNecktie,
    defaultPos: { x: 0.5, y: 0.56 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-bell-choker',
    category: 'jewelry',
    nameVi: 'Vòng cổ chuông vàng',
    nameEn: 'Bell Choker',
    imageUrl: jewelryBellChoker,
    defaultPos: { x: 0.5, y: 0.51 },
    defaultScale: 1.0,
  },
  {
    id: 'jewelry-candy-necklace',
    category: 'jewelry',
    nameVi: 'Vòng cổ kẹo ngọt',
    nameEn: 'Sweet Candy Necklace',
    imageUrl: jewelryCandyNecklace,
    defaultPos: { x: 0.5, y: 0.52 },
    defaultScale: 1.05,
  },
  {
    id: 'jewelry-pearl-necklace',
    category: 'jewelry',
    nameVi: 'Vòng ngọc trai',
    nameEn: 'Pearl Necklace',
    imageUrl: jewelryPearlNecklace,
    defaultPos: { x: 0.5, y: 0.52 },
    defaultScale: 1.05,
  },
  {
    id: 'jewelry-flower-pin',
    category: 'jewelry',
    nameVi: 'Cài áo hoa vàng',
    nameEn: 'Flower Pin',
    imageUrl: jewelryFlowerPin,
    defaultPos: { x: 0.42, y: 0.54 },
    defaultScale: 0.9,
  },
  {
    id: 'jewelry-scarf',
    category: 'jewelry',
    nameVi: 'Khăn quàng đỏ',
    nameEn: 'Warm Red Scarf',
    imageUrl: jewelryScarf,
    defaultPos: { x: 0.5, y: 0.51 },
    defaultScale: 1.15,
  },
  {
    id: 'jewelry-mini-tiara',
    category: 'jewelry',
    nameVi: 'Vương miện công chúa',
    nameEn: 'Princess Tiara',
    imageUrl: jewelryMiniTiara,
    defaultPos: { x: 0.5, y: 0.17 },
    defaultScale: 0.95,
  },
  {
    id: 'jewelry-star-badge',
    category: 'jewelry',
    nameVi: 'Huy hiệu ngôi sao',
    nameEn: 'Star Badge',
    imageUrl: jewelryStarBadge,
    defaultPos: { x: 0.42, y: 0.54 },
    defaultScale: 0.85,
  },
  {
    id: 'jewelry-fairy-wings',
    category: 'jewelry',
    nameVi: 'Cánh tiên lấp lánh',
    nameEn: 'Fairy Wings',
    imageUrl: jewelryFairyWings,
    defaultPos: { x: 0.5, y: 0.50 },
    defaultScale: 1.4,
  },

  // 4. Cầm Tay (prop - 12 items)
  {
    id: 'prop-lollipop',
    category: 'prop',
    nameVi: 'Kẹo mút cầu vồng',
    nameEn: 'Rainbow Lollipop',
    imageUrl: propLollipop,
    defaultPos: { x: 0.74, y: 0.56 },
    defaultScale: 1.05,
  },
  {
    id: 'prop-heart-balloon',
    category: 'prop',
    nameVi: 'Bóng bay trái tim',
    nameEn: 'Heart Balloon',
    imageUrl: propHeartBalloon,
    defaultPos: { x: 0.78, y: 0.34 },
    defaultScale: 1.2,
  },
  {
    id: 'prop-rainbow-scepter',
    category: 'prop',
    nameVi: 'Vương trượng cầu vồng',
    nameEn: 'Rainbow Scepter',
    imageUrl: propRainbowScepter,
    defaultPos: { x: 0.76, y: 0.54 },
    defaultScale: 1.15,
  },
  {
    id: 'prop-baby-bottle',
    category: 'prop',
    nameVi: 'Bình sữa em bé',
    nameEn: 'Baby Bottle',
    imageUrl: propBabyBottle,
    defaultPos: { x: 0.72, y: 0.60 },
    defaultScale: 0.95,
  },
  {
    id: 'prop-magic-wand',
    category: 'prop',
    nameVi: 'Đũa phép thần kỳ',
    nameEn: 'Magic Wand',
    imageUrl: propMagicWand,
    defaultPos: { x: 0.76, y: 0.55 },
    defaultScale: 1.1,
  },
  {
    id: 'prop-balloons',
    category: 'prop',
    nameVi: 'Bóng bay sắc màu',
    nameEn: 'Party Balloons',
    imageUrl: propBalloons,
    defaultPos: { x: 0.78, y: 0.35 },
    defaultScale: 1.25,
  },
  {
    id: 'prop-flower-bouquet',
    category: 'prop',
    nameVi: 'Bó hoa tươi thắm',
    nameEn: 'Flower Bouquet',
    imageUrl: propFlowerBouquet,
    defaultPos: { x: 0.74, y: 0.60 },
    defaultScale: 1.1,
  },
  {
    id: 'prop-ice-cream',
    category: 'prop',
    nameVi: 'Kem ốc quế mát lạnh',
    nameEn: 'Ice Cream Cone',
    imageUrl: propIceCream,
    defaultPos: { x: 0.74, y: 0.58 },
    defaultScale: 0.95,
  },
  {
    id: 'prop-storybook',
    category: 'prop',
    nameVi: 'Cuốn sách cổ tích',
    nameEn: 'Fairy Storybook',
    imageUrl: propStorybook,
    defaultPos: { x: 0.74, y: 0.62 },
    defaultScale: 1.0,
  },
  {
    id: 'prop-crystal-staff',
    category: 'prop',
    nameVi: 'Gậy ngọc pha lê',
    nameEn: 'Crystal Staff',
    imageUrl: propCrystalStaff,
    defaultPos: { x: 0.76, y: 0.55 },
    defaultScale: 1.2,
  },
  {
    id: 'prop-guitar',
    category: 'prop',
    nameVi: 'Đàn ukulele vui nhộn',
    nameEn: 'Little Ukulele',
    imageUrl: propGuitar,
    defaultPos: { x: 0.5, y: 0.64 },
    defaultScale: 1.2,
  },
  {
    id: 'prop-backpack',
    category: 'prop',
    nameVi: 'Balo đi học',
    nameEn: 'School Backpack',
    imageUrl: propBackpack,
    defaultPos: { x: 0.26, y: 0.60 },
    defaultScale: 1.1,
  },

  // 5. Giày & Thú (plush - 12 items)
  {
    id: 'plush-bear-slippers',
    category: 'plush',
    nameVi: 'Dép bông gấu ấm',
    nameEn: 'Cozy Bear Slippers',
    imageUrl: plushBearSlippers,
    defaultPos: { x: 0.5, y: 0.88 },
    defaultScale: 1.1,
  },
  {
    id: 'plush-dino-plush',
    category: 'plush',
    nameVi: 'Khủng long bông xanh',
    nameEn: 'Baby Dino Plushie',
    imageUrl: plushDinoPlush,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.1,
  },
  {
    id: 'plush-frog-plush',
    category: 'plush',
    nameVi: 'Ếch xanh tí hon',
    nameEn: 'Green Frog Plushie',
    imageUrl: plushFrogPlush,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.05,
  },
  {
    id: 'plush-rubber-duck',
    category: 'plush',
    nameVi: 'Vịt vàng cao su',
    nameEn: 'Yellow Rubber Duck',
    imageUrl: plushRubberDuck,
    defaultPos: { x: 0.28, y: 0.64 },
    defaultScale: 0.95,
  },
  {
    id: 'plush-sneakers',
    category: 'plush',
    nameVi: 'Giày thể thao năng động',
    nameEn: 'Sport Sneakers',
    imageUrl: plushSneakers,
    defaultPos: { x: 0.5, y: 0.88 },
    defaultScale: 1.1,
  },
  {
    id: 'plush-mary-jane',
    category: 'plush',
    nameVi: 'Giày búp bê đỏ',
    nameEn: 'Mary Jane Shoes',
    imageUrl: plushMaryJane,
    defaultPos: { x: 0.5, y: 0.88 },
    defaultScale: 1.05,
  },
  {
    id: 'plush-rain-boots',
    category: 'plush',
    nameVi: 'Ủng đi mưa vàng',
    nameEn: 'Rain Boots',
    imageUrl: plushRainBoots,
    defaultPos: { x: 0.5, y: 0.88 },
    defaultScale: 1.15,
  },
  {
    id: 'plush-sandals',
    category: 'plush',
    nameVi: 'Dép sandal hè',
    nameEn: 'Summer Sandals',
    imageUrl: plushSandals,
    defaultPos: { x: 0.5, y: 0.88 },
    defaultScale: 1.05,
  },
  {
    id: 'plush-teddy-bear',
    category: 'plush',
    nameVi: 'Gấu bông ôm tay',
    nameEn: 'Little Teddy Bear',
    imageUrl: plushTeddyBear,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.1,
  },
  {
    id: 'plush-bunny-plush',
    category: 'plush',
    nameVi: 'Thỏ bông tai dài',
    nameEn: 'Bunny Plushie',
    imageUrl: plushBunnyPlush,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.1,
  },
  {
    id: 'plush-cat-plush',
    category: 'plush',
    nameVi: 'Mèo bông tam thể',
    nameEn: 'Kitty Plushie',
    imageUrl: plushCatPlush,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.1,
  },
  {
    id: 'plush-puppy-plush',
    category: 'plush',
    nameVi: 'Cún bông đốm nâu',
    nameEn: 'Puppy Plushie',
    imageUrl: plushPuppyPlush,
    defaultPos: { x: 0.28, y: 0.62 },
    defaultScale: 1.1,
  },
];
