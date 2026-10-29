import React, { useState } from 'react';
import { REAL_FLASHCARD_TOPIC_PHOTOS } from '../data/flashcardPhotosData';

// Topic 2: Jungle & Wild Animals
import lionImg from '../assets/images/real_lion_wildlife_1793085096309.jpg';
import elephantImg from '../assets/images/real_elephant_wildlife_1793085096141.jpg';
import monkeyImg from '../assets/images/real_monkey_wildlife_1793085097300.jpg';
import tigerImg from '../assets/images/real_tiger_wildlife_1793085098414.jpg';
import bearImg from '../assets/images/real_bear_wildlife_1793085098337.jpg';
import giraffeImg from '../assets/images/real_giraffe_wildlife_1793085098259.jpg';
import zebraImg from '../assets/images/real_zebra_wildlife_1793085098652.jpg';
import hippoImg from '../assets/images/real_hippo_wildlife_1793085098800.jpg';
import kangarooImg from '../assets/images/real_kangaroo_wildlife_1793085434028.jpg';
import koalaImg from '../assets/images/real_koala_wildlife_1793085468191.jpg';
import pandaImg from '../assets/images/real_panda_wildlife_1793085489512.jpg';
import foxImg from '../assets/images/real_fox_wildlife_1793085511252.jpg';
import deerImg from '../assets/images/real_deer_wildlife_1793085531166.jpg';
import rhinoImg from '../assets/images/real_rhino_wildlife_1793085560907.jpg';
import cheetahImg from '../assets/images/real_cheetah_wildlife_1793085581865.jpg';
import camelImg from '../assets/images/real_camel_wildlife_1793085602993.jpg';

// Topic 1: Farm Animals (Real Photography)
import cowImg from '../assets/images/real_cow_farm_1793087581842.jpg';
import catImg from '../assets/images/real_cat_farm_1793087601696.jpg';
import dogImg from '../assets/images/real_dog_farm_1793087620157.jpg';
import duckImg from '../assets/images/real_duck_farm_1793087640568.jpg';
import pigImg from '../assets/images/real_pig_farm_1793087662461.jpg';
import sheepImg from '../assets/images/real_sheep_farm_1793087681568.jpg';
import chickenImg from '../assets/images/real_chicken_farm_1793087700626.jpg';
import horseImg from '../assets/images/real_horse_farm_1793087720154.jpg';
import turkeyImg from '../assets/images/real_turkey_farm_1793087738573.jpg';
import goatImg from '../assets/images/real_goat_farm_1793087757163.jpg';
import donkeyImg from '../assets/images/real_donkey_farm_1793087777854.jpg';
import mouseImg from '../assets/images/real_mouse_farm_1793087798103.jpg';
import gooseImg from '../assets/images/real_goose_farm_1793087818378.jpg';
import chickImg from '../assets/images/real_chick_farm_1793087839039.jpg';
import rabbitImg from '../assets/images/real_rabbit_farm_1793087860462.jpg';
import pigeonImg from '../assets/images/real_pigeon_farm_1793087881213.jpg';

// Topic 5: Sweet Fruits (Natural Orchard & Garden Photography)
import appleImg from '../assets/images/real_apple_orchard_1793088530067.jpg';
import bananaImg from '../assets/images/real_banana_orchard_1793088550798.jpg';
import orangeImg from '../assets/images/real_orange_orchard_1793088572014.jpg';
import strawberryImg from '../assets/images/real_strawberry_garden_1793088593996.jpg';
import watermelonImg from '../assets/images/real_watermelon_farm_1793088618126.jpg';
import grapesImg from '../assets/images/real_grapes_vineyard_1793088639103.jpg';
import mangoImg from '../assets/images/real_mango_orchard_1793088660367.jpg';
import peachImg from '../assets/images/real_peach_orchard_1793088680382.jpg';
import cherryImg from '../assets/images/real_cherry_tree_1793088700060.jpg';
import pineappleImg from '../assets/images/real_pineapple_plant_1793088720324.jpg';
import kiwiImg from '../assets/images/real_kiwi_vine_1793088740758.jpg';
import guavaImg from '../assets/images/real_guava_tree_1793088761553.jpg';
import coconutImg from '../assets/images/real_coconut_palm_1793088783265.jpg';
import pearImg from '../assets/images/real_pear_orchard_1793088803683.jpg';
import avocadoImg from '../assets/images/real_avocado_tree_1793088824522.jpg';
import papayaImg from '../assets/images/real_papaya_tree_1793088844671.jpg';

// Topic 3: Ocean World (Real Marine Wildlife Photography)
import fishImg from '../assets/images/real_fish_ocean_1793089596610.jpg';
import dolphinImg from '../assets/images/real_dolphin_ocean_1793089597071.jpg';
import whaleImg from '../assets/images/real_whale_ocean_1793089598215.jpg';
import crabImg from '../assets/images/real_crab_ocean_1793089599238.jpg';
import octopusImg from '../assets/images/real_octopus_ocean_1793089617885.jpg';
import turtleImg from '../assets/images/real_turtle_ocean_1793089618674.jpg';
import starfishImg from '../assets/images/real_starfish_ocean_1793089619096.jpg';
import jellyfishImg from '../assets/images/real_jellyfish_ocean_1793089619022.jpg';
import seahorseImg from '../assets/images/real_seahorse_ocean_1793089639893.jpg';
import sharkImg from '../assets/images/real_shark_ocean_1793089640232.jpg';
import lobsterImg from '../assets/images/real_lobster_ocean_1793089641649.jpg';
import sealImg from '../assets/images/real_seal_ocean_1793089641706.jpg';
import shrimpImg from '../assets/images/real_shrimp_ocean_1793089689035.jpg';
import clamImg from '../assets/images/real_clam_ocean_1793089704085.jpg';
import stingrayImg from '../assets/images/real_stingray_ocean_1793089725167.jpg';
import coralImg from '../assets/images/real_coral_ocean_1793089739978.jpg';

// Topic 4: Insects & Birds (Natural Habitat Wildlife Photography)
import beeImg from '../assets/images/real_bee_nature_1793089761110.jpg';
import butterflyImg from '../assets/images/real_butterfly_nature_1793089761652.jpg';
import birdImg from '../assets/images/real_bird_nature_1793089762928.jpg';
import ladybugImg from '../assets/images/real_ladybug_nature_1793089781184.jpg';
import antImg from '../assets/images/real_ant_nature_1793089781730.jpg';
import owlImg from '../assets/images/real_owl_nature_1793089785548.jpg';
import parrotImg from '../assets/images/real_parrot_nature_1793089800756.jpg';
import snailImg from '../assets/images/real_snail_nature_1793089800674.jpg';
import caterpillarImg from '../assets/images/real_caterpillar_nature_1793089801329.jpg';
import fireflyImg from '../assets/images/real_firefly_nature_1793089820670.jpg';
import grasshopperImg from '../assets/images/real_grasshopper_nature_1793089821244.jpg';
import beetleImg from '../assets/images/real_beetle_nature_1793089820807.jpg';
import dragonflyImg from '../assets/images/real_dragonfly_nature_1793089853940.jpg';
import ducklingImg from '../assets/images/real_duckling_nature_1793089837197.jpg';
import woodpeckerImg from '../assets/images/real_woodpecker_nature_1793089837548.jpg';

// Topic 6: Fresh Vegetables (Natural Garden & Soil Agriculture Photography)
import carrotImg from '../assets/images/real_carrot_farm_1793089875974.jpg';
import tomatoImg from '../assets/images/real_tomato_farm_1793089876190.jpg';
import cornImg from '../assets/images/real_corn_farm_1793089877167.jpg';
import broccoliImg from '../assets/images/real_broccoli_farm_1793089894965.jpg';
import potatoImg from '../assets/images/real_potato_farm_1793089894899.jpg';
import cucumberImg from '../assets/images/real_cucumber_farm_1793089896322.jpg';
import pumpkinImg from '../assets/images/real_pumpkin_farm_1793089917767.jpg';
import mushroomImg from '../assets/images/real_mushroom_nature_1793089919107.jpg';
import peaImg from '../assets/images/real_pea_farm_1793089918328.jpg';
import cabbageImg from '../assets/images/real_cabbage_farm_1793089938520.jpg';
import sweetpotatoImg from '../assets/images/real_sweetpotato_farm_1793089938511.jpg';
import onionImg from '../assets/images/real_onion_farm_1793089938082.jpg';
import pepperImg from '../assets/images/real_pepper_farm_1793089967299.jpg';
import garlicImg from '../assets/images/real_garlic_farm_1793089969124.jpg';
import eggplantImg from '../assets/images/real_eggplant_farm_1793089967945.jpg';
import radishImg from '../assets/images/real_radish_farm_1793089993344.jpg';

// Topic 13: Vehicles (Real Transportation & Vehicle Photography)
import carImg from '../assets/images/real_car_road_1793090015027.jpg';
import busImg from '../assets/images/real_bus_city_1793090015148.jpg';
import trainImg from '../assets/images/real_train_track_1793090015301.jpg';
import airplaneImg from '../assets/images/real_airplane_sky_1793090035587.jpg';
import boatImg from '../assets/images/real_boat_sea_1793090035605.jpg';
import bicycleImg from '../assets/images/real_bicycle_park_1793090034897.jpg';
import fireTruckImg from '../assets/images/real_firetruck_city_1793090074201.jpg';
import helicopterImg from '../assets/images/real_helicopter_sky_1793090179530.jpg';
import scooterImg from '../assets/images/real_scooter_park_1793090135242.jpg';
import motorcycleImg from '../assets/images/real_motorcycle_road_1793090092979.jpg';
import ambulanceImg from '../assets/images/real_ambulance_city_1793090092152.jpg';
import shipImg from '../assets/images/real_ship_ocean_1793090111385.jpg';
import tractorImg from '../assets/images/real_tractor_farm_1793090075103.jpg';
import truckImg from '../assets/images/real_truck_highway_1793090093474.jpg';
import submarineImg from '../assets/images/real_submarine_sea_1793090111225.jpg';
import rocketImg from '../assets/images/real_rocket_launch_1793090110852.jpg';

/**
 * High-definition commercial photography mapping for Flashcards & Interactive Learning.
 * Replaces cartoon/emoji faces with authentic, full-body realistic photography in natural habitats.
 */
export const REAL_ANIMAL_IMAGES: Record<string, string> = {
  // Topic 1: Farm Animals (mapped by id and common names)
  cow: cowImg,
  'farm-animals-0': cowImg,
  cat: catImg,
  'farm-animals-1': catImg,
  dog: dogImg,
  'farm-animals-2': dogImg,
  duck: duckImg,
  'farm-animals-3': duckImg,
  pig: pigImg,
  'farm-animals-4': pigImg,
  sheep: sheepImg,
  'farm-animals-5': sheepImg,
  chicken: chickenImg,
  'farm-animals-6': chickenImg,
  horse: horseImg,
  'farm-animals-7': horseImg,
  turkey: turkeyImg,
  'farm-animals-8': turkeyImg,
  goat: goatImg,
  'farm-animals-9': goatImg,
  donkey: donkeyImg,
  'farm-animals-10': donkeyImg,
  mouse: mouseImg,
  'farm-animals-11': mouseImg,
  goose: gooseImg,
  'farm-animals-12': gooseImg,
  chick: chickImg,
  'farm-animals-13': chickImg,
  rabbit: rabbitImg,
  'farm-animals-14': rabbitImg,
  pigeon: pigeonImg,
  'farm-animals-15': pigeonImg,

  // Topic 2: Jungle & Wild Animals (mapped by both topic-item-id and english name)
  'wild-animals-0': lionImg,
  lion: lionImg,
  'wild-animals-1': elephantImg,
  elephant: elephantImg,
  'wild-animals-2': monkeyImg,
  monkey: monkeyImg,
  'wild-animals-3': tigerImg,
  tiger: tigerImg,
  'wild-animals-4': bearImg,
  bear: bearImg,
  'wild-animals-5': giraffeImg,
  giraffe: giraffeImg,
  'wild-animals-6': zebraImg,
  zebra: zebraImg,
  'wild-animals-7': hippoImg,
  hippo: hippoImg,
  kangaroo: kangarooImg,
  koala: koalaImg,
  panda: pandaImg,
  fox: foxImg,
  deer: deerImg,
  rhino: rhinoImg,
  cheetah: cheetahImg,
  camel: camelImg,

  // Topic 3: Ocean World (16 marine creatures)
  'ocean-world-0': fishImg,
  fish: fishImg,
  'ocean-world-1': dolphinImg,
  dolphin: dolphinImg,
  'ocean-world-2': whaleImg,
  whale: whaleImg,
  'ocean-world-3': crabImg,
  crab: crabImg,
  'ocean-world-4': octopusImg,
  octopus: octopusImg,
  'ocean-world-5': turtleImg,
  turtle: turtleImg,
  'sea-turtle': turtleImg,
  'ocean-world-6': starfishImg,
  starfish: starfishImg,
  'ocean-world-7': jellyfishImg,
  jellyfish: jellyfishImg,
  seahorse: seahorseImg,
  'ocean-world-8': seahorseImg,
  shark: sharkImg,
  'ocean-world-9': sharkImg,
  lobster: lobsterImg,
  'ocean-world-10': lobsterImg,
  seal: sealImg,
  'ocean-world-11': sealImg,
  shrimp: shrimpImg,
  'ocean-world-12': shrimpImg,
  clam: clamImg,
  'ocean-world-13': clamImg,
  stingray: stingrayImg,
  'ocean-world-14': stingrayImg,
  coral: coralImg,
  'coral-reef': coralImg,
  'ocean-world-15': coralImg,

  // Topic 4: Insects & Birds (16 creatures)
  'insects-birds-0': beeImg,
  bee: beeImg,
  'insects-birds-1': butterflyImg,
  butterfly: butterflyImg,
  'insects-birds-2': birdImg,
  bird: birdImg,
  'insects-birds-3': ladybugImg,
  ladybug: ladybugImg,
  'insects-birds-4': antImg,
  ant: antImg,
  'insects-birds-5': owlImg,
  owl: owlImg,
  'insects-birds-6': parrotImg,
  parrot: parrotImg,
  'insects-birds-7': snailImg,
  snail: snailImg,
  caterpillar: caterpillarImg,
  'insects-birds-8': caterpillarImg,
  firefly: fireflyImg,
  'insects-birds-9': fireflyImg,
  grasshopper: grasshopperImg,
  'insects-birds-10': grasshopperImg,
  beetle: beetleImg,
  'insects-birds-11': beetleImg,
  dragonfly: dragonflyImg,
  'insects-birds-12': dragonflyImg,
  'insects-birds-13': pigeonImg,
  duckling: ducklingImg,
  'insects-birds-14': ducklingImg,
  woodpecker: woodpeckerImg,
  'insects-birds-15': woodpeckerImg,

  // Topic 5: Sweet Fruits (Natural Orchard & Garden Photography)
  apple: appleImg,
  'fruits-0': appleImg,
  banana: bananaImg,
  'fruits-1': bananaImg,
  orange: orangeImg,
  'fruits-2': orangeImg,
  strawberry: strawberryImg,
  'fruits-3': strawberryImg,
  watermelon: watermelonImg,
  'fruits-4': watermelonImg,
  grapes: grapesImg,
  'fruits-5': grapesImg,
  mango: mangoImg,
  'fruits-6': mangoImg,
  peach: peachImg,
  'fruits-7': peachImg,
  cherry: cherryImg,
  'fruits-8': cherryImg,
  pineapple: pineappleImg,
  'fruits-9': pineappleImg,
  kiwi: kiwiImg,
  'fruits-10': kiwiImg,
  guava: guavaImg,
  'fruits-11': guavaImg,
  coconut: coconutImg,
  'fruits-12': coconutImg,
  pear: pearImg,
  'fruits-13': pearImg,
  avocado: avocadoImg,
  'fruits-14': avocadoImg,
  papaya: papayaImg,
  'fruits-15': papayaImg,

  // Topic 6: Fresh Vegetables (Natural Garden & Soil Agriculture Photography)
  'vegetables-0': carrotImg,
  carrot: carrotImg,
  'vegetables-1': tomatoImg,
  tomato: tomatoImg,
  'vegetables-2': cornImg,
  corn: cornImg,
  'vegetables-3': broccoliImg,
  broccoli: broccoliImg,
  'vegetables-4': potatoImg,
  potato: potatoImg,
  'vegetables-5': cucumberImg,
  cucumber: cucumberImg,
  'vegetables-6': pumpkinImg,
  pumpkin: pumpkinImg,
  'vegetables-7': mushroomImg,
  mushroom: mushroomImg,
  pea: peaImg,
  peas: peaImg,
  'vegetables-8': peaImg,
  cabbage: cabbageImg,
  'vegetables-9': cabbageImg,
  'sweet-potato': sweetpotatoImg,
  'vegetables-10': sweetpotatoImg,
  onion: onionImg,
  'vegetables-11': onionImg,
  'bell-pepper': pepperImg,
  'vegetables-12': pepperImg,
  garlic: garlicImg,
  'vegetables-13': garlicImg,
  eggplant: eggplantImg,
  'vegetables-14': eggplantImg,
  radish: radishImg,
  'vegetables-15': radishImg,

  // Topic 13: Vehicles (Real Transportation & Machinery Photography)
  'vehicles-0': carImg,
  car: carImg,
  'vehicles-1': busImg,
  bus: busImg,
  'vehicles-2': trainImg,
  train: trainImg,
  'vehicles-3': airplaneImg,
  airplane: airplaneImg,
  plane: airplaneImg,
  'vehicles-4': boatImg,
  boat: boatImg,
  sailboat: boatImg,
  'vehicles-5': bicycleImg,
  bicycle: bicycleImg,
  bike: bicycleImg,
  'vehicles-6': fireTruckImg,
  'fire-truck': fireTruckImg,
  firetruck: fireTruckImg,
  'vehicles-7': helicopterImg,
  helicopter: helicopterImg,
  scooter: scooterImg,
  'vehicles-8': scooterImg,
  motorcycle: motorcycleImg,
  motorbike: motorcycleImg,
  'vehicles-9': motorcycleImg,
  ambulance: ambulanceImg,
  'vehicles-10': ambulanceImg,
  ship: shipImg,
  'vehicles-11': shipImg,
  tractor: tractorImg,
  'vehicles-12': tractorImg,
  truck: truckImg,
  'vehicles-13': truckImg,
  submarine: submarineImg,
  'vehicles-14': submarineImg,
  rocket: rocketImg,
  'vehicles-15': rocketImg,

  // Topics 7-12: Baby meals, Clothes, Toys, My house, Music instruments, School items
  ...REAL_FLASHCARD_TOPIC_PHOTOS,
};

interface PastelIllustrationProps {
  wordId: string;
  emoji: string;
  colorHex: string;
  bgTint: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'fill';
  className?: string;
}

const COLOR_SWATCH_MAP: Record<string, { fill: string; stroke: string; label: string }> = {
  red: { fill: '#EF4444', stroke: '#991B1B', label: 'RED' },
  yellow: { fill: '#FACC15', stroke: '#A16207', label: 'YELLOW' },
  blue: { fill: '#0284C7', stroke: '#075985', label: 'BLUE' },
  green: { fill: '#10B981', stroke: '#065F46', label: 'GREEN' },
  pink: { fill: '#EC4899', stroke: '#9D174D', label: 'PINK' },
  'orange-color': { fill: '#F97316', stroke: '#9A3412', label: 'ORANGE' },
  purple: { fill: '#8B5CF6', stroke: '#5B21B6', label: 'PURPLE' },
  white: { fill: '#FFFFFF', stroke: '#64748B', label: 'WHITE' },
};

/**
 * High-definition Vector Illustration engine for flashcards and interactive learning.
 * Produces crisp, infinite-resolution SVG vector artwork that fills the card frame
 * without pixelation or blurriness on any display.
 */
export const PastelIllustration: React.FC<PastelIllustrationProps> = ({
  wordId,
  emoji,
  colorHex,
  bgTint,
  size = 'lg',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const isHero = size === 'hero' || size === 'fill';

  const renderCustomSvg = () => {
    // 1. Color Swatches
    if (COLOR_SWATCH_MAP[wordId]) {
      const swatch = COLOR_SWATCH_MAP[wordId];
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm">
          <ellipse cx="60" cy="106" rx="42" ry="7" fill="#000000" opacity="0.08" />
          <path
            d="M60 16 C86 16, 104 34, 104 60 C104 86, 86 104, 60 104 C34 104, 16 86, 16 60 C16 34, 34 16, 60 16 Z"
            fill={swatch.fill}
            stroke={swatch.stroke}
            strokeWidth="6"
          />
          <ellipse cx="45" cy="40" rx="14" ry="8" fill="#FFFFFF" opacity="0.65" transform="rotate(-25 45 40)" />
          <circle cx="46" cy="62" r="5" fill={wordId === 'white' ? '#1E293B' : '#FFFFFF'} />
          <circle cx="74" cy="62" r="5" fill={wordId === 'white' ? '#1E293B' : '#FFFFFF'} />
          <path
            d="M48 74 Q60 84 72 74"
            stroke={wordId === 'white' ? '#1E293B' : '#FFFFFF'}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    switch (wordId) {
      // 2. DOG (Chú Chó Cún Vui Vẻ - Toàn thân đứng vẫy đuôi)
      case 'dog':
      case 'farm-animals-3':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            {/* Soft ground shadow */}
            <ellipse cx="70" cy="126" rx="46" ry="7" fill="#000000" opacity="0.08" />
            {/* Wagging Tail */}
            <path d="M38 78 C24 72, 22 52, 32 44 C38 54, 42 68, 44 78 Z" fill="#B45309" stroke="#78350F" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M28 46 C32 43, 35 48, 33 53 C30 50, 27 48, 28 46 Z" fill="#FFFFFF" />
            {/* Back Legs */}
            <rect x="42" y="90" width="12" height="32" rx="6" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
            <rect x="42" y="114" width="12" height="9" rx="4.5" fill="#FFFFFF" />
            <rect x="58" y="92" width="12" height="30" rx="6" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
            <rect x="58" y="114" width="12" height="9" rx="4.5" fill="#FEF3C7" />
            {/* Body */}
            <path d="M40 76 C40 64, 82 64, 86 76 L88 100 C88 112, 40 112, 40 100 Z" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            {/* White Chest & Belly */}
            <path d="M54 78 C54 96, 76 96, 76 78 Z" fill="#FFFFFF" />
            {/* Front Legs */}
            <rect x="74" y="90" width="12" height="32" rx="6" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            <rect x="74" y="114" width="12" height="9" rx="4.5" fill="#FFFFFF" />
            <rect x="88" y="88" width="12" height="34" rx="6" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            <rect x="88" y="114" width="12" height="9" rx="4.5" fill="#FFFFFF" />
            {/* Head */}
            <circle cx="86" cy="48" r="26" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
            {/* Floppy Ears */}
            <path d="M64 36 C54 42, 54 62, 64 72 C70 76, 74 68, 72 54 Z" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
            <path d="M106 36 C116 42, 116 62, 106 72 C100 76, 96 68, 98 54 Z" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
            {/* White Muzzle & Forehead Blaze */}
            <ellipse cx="86" cy="54" rx="14" ry="11" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
            <path d="M83 26 L89 26 L88 44 L84 44 Z" fill="#FFFFFF" />
            {/* Eyes */}
            <ellipse cx="76" cy="46" rx="4.5" ry="5.5" fill="#1E293B" />
            <circle cx="74.5" cy="44" r="1.8" fill="#FFFFFF" />
            <ellipse cx="96" cy="46" rx="4.5" ry="5.5" fill="#1E293B" />
            <circle cx="94.5" cy="44" r="1.8" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <ellipse cx="86" cy="52" rx="5.5" ry="4" fill="#1E293B" />
            <path d="M82 58 Q86 62 90 58" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M84 60 C84 66, 88 66, 88 60 Z" fill="#F43F5E" />
            {/* Cheeks */}
            <circle cx="70" cy="54" r="4" fill="#FB7185" opacity="0.6" />
            <circle cx="102" cy="54" r="4" fill="#FB7185" opacity="0.6" />
            {/* Collar & Gold Tag */}
            <path d="M74 68 L98 68" stroke="#EF4444" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="86" cy="74" r="4.5" fill="#FACC15" stroke="#B45309" strokeWidth="1.5" />
          </svg>
        );

      // 3. CAT (Mèo Con Đáng Yêu - Toàn thân ngồi ngoan ngoãn)
      case 'cat':
      case 'farm-animals-2':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="42" ry="6" fill="#000000" opacity="0.08" />
            {/* Curled Tail */}
            <path d="M38 106 C24 104, 18 84, 26 72 C32 64, 38 72, 32 82 C28 88, 34 98, 42 100 Z" fill="#FB923C" stroke="#C2410C" strokeWidth="2.5" />
            <path d="M26 72 C28 66, 32 66, 34 72 Z" fill="#FFFFFF" />
            {/* Sitting Body */}
            <path d="M46 68 C46 56, 94 56, 94 68 L100 112 C100 124, 40 124, 40 112 Z" fill="#FED7AA" stroke="#EA580C" strokeWidth="3" />
            {/* Tabby Stripes on Back */}
            <path d="M48 78 L58 80 M48 88 L60 90 M48 98 L58 100" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
            {/* White Chest Patch */}
            <path d="M58 68 C58 92, 82 92, 82 68 Z" fill="#FFFFFF" />
            {/* Front Paws */}
            <rect x="58" y="108" width="11" height="16" rx="5.5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
            <rect x="71" y="108" width="11" height="16" rx="5.5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
            {/* Head */}
            <circle cx="70" cy="52" r="26" fill="#FED7AA" stroke="#EA580C" strokeWidth="3" />
            {/* Ears */}
            <polygon points="46,42 52,18 68,34" fill="#FB923C" stroke="#C2410C" strokeWidth="2.5" strokeLinejoin="round" />
            <polygon points="52,38 56,24 64,34" fill="#FECDD3" />
            <polygon points="94,42 88,18 72,34" fill="#FB923C" stroke="#C2410C" strokeWidth="2.5" strokeLinejoin="round" />
            <polygon points="88,38 84,24 76,34" fill="#FECDD3" />
            {/* Forehead Stripes */}
            <path d="M70 28 L70 38 M64 30 L66 38 M76 30 L74 38" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
            {/* Eyes */}
            <ellipse cx="58" cy="48" rx="5" ry="6" fill="#0284C7" />
            <circle cx="56.5" cy="46" r="2" fill="#FFFFFF" />
            <ellipse cx="82" cy="48" rx="5" ry="6" fill="#0284C7" />
            <circle cx="80.5" cy="46" r="2" fill="#FFFFFF" />
            {/* Nose & Smile */}
            <polygon points="67,54 73,54 70,58" fill="#FB7185" />
            <path d="M65 59 Q70 63 75 59" stroke="#7C2D12" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="40" y1="52" x2="52" y2="54" stroke="#7C2D12" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="40" y1="58" x2="52" y2="58" stroke="#7C2D12" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="100" y1="52" x2="88" y2="54" stroke="#7C2D12" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="100" y1="58" x2="88" y2="58" stroke="#7C2D12" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="52" cy="54" r="4" fill="#FDA4AF" opacity="0.6" />
            <circle cx="88" cy="54" r="4" fill="#FDA4AF" opacity="0.6" />
          </svg>
        );

      // 4. COW (Bò Sữa Nông Trại - Toàn thân đứng trên đồng cỏ)
      case 'cow':
      case 'farm-animals-1':
      case 'farm-animals-0':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="52" ry="7" fill="#000000" opacity="0.08" />
            {/* Tail */}
            <path d="M26 76 C14 86, 12 102, 18 112" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M16 110 C10 116, 20 124, 22 114 Z" fill="#1E293B" />
            {/* Back Legs with Hooves */}
            <rect x="30" y="86" width="12" height="36" rx="6" fill="#F8FAFC" stroke="#334155" strokeWidth="2.5" />
            <rect x="30" y="116" width="12" height="7" rx="3" fill="#1E293B" />
            <rect x="44" y="88" width="12" height="34" rx="6" fill="#E2E8F0" stroke="#334155" strokeWidth="2.5" />
            <rect x="44" y="116" width="12" height="7" rx="3" fill="#1E293B" />
            {/* Pink Udder */}
            <path d="M46 96 Q54 104 62 96" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1.5" />
            {/* Cow Body */}
            <rect x="28" y="58" width="66" height="42" rx="20" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
            {/* Spots on Body */}
            <path d="M38 64 C48 62, 54 74, 46 82 C36 80, 32 72, 38 64 Z" fill="#1E293B" />
            <path d="M68 76 C78 72, 84 82, 78 92 C68 90, 64 82, 68 76 Z" fill="#1E293B" />
            {/* Front Legs with Hooves */}
            <rect x="68" y="88" width="12" height="34" rx="6" fill="#F8FAFC" stroke="#334155" strokeWidth="2.5" />
            <rect x="68" y="116" width="12" height="7" rx="3" fill="#1E293B" />
            <rect x="82" y="86" width="12" height="36" rx="6" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
            <rect x="82" y="116" width="12" height="7" rx="3" fill="#1E293B" />
            {/* Head */}
            <circle cx="94" cy="50" r="24" fill="#FFFFFF" stroke="#334155" strokeWidth="3" />
            {/* Head Spot */}
            <path d="M84 32 C92 30, 96 42, 90 46 C82 44, 80 36, 84 32 Z" fill="#1E293B" />
            {/* Horns */}
            <path d="M82 34 C76 24, 72 36, 78 38" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
            <path d="M106 34 C112 24, 116 36, 110 38" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
            {/* Ears */}
            <ellipse cx="72" cy="46" rx="10" ry="5" fill="#FFFFFF" stroke="#334155" strokeWidth="2" transform="rotate(-20 72 46)" />
            <ellipse cx="72" cy="46" rx="6" ry="3" fill="#FBCFE8" transform="rotate(-20 72 46)" />
            <ellipse cx="116" cy="46" rx="10" ry="5" fill="#FFFFFF" stroke="#334155" strokeWidth="2" transform="rotate(20 116 46)" />
            <ellipse cx="116" cy="46" rx="6" ry="3" fill="#FBCFE8" transform="rotate(20 116 46)" />
            {/* Eyes */}
            <circle cx="86" cy="46" r="4.5" fill="#0F172A" />
            <circle cx="84.5" cy="44" r="1.8" fill="#FFFFFF" />
            <circle cx="106" cy="46" r="4.5" fill="#0F172A" />
            <circle cx="104.5" cy="44" r="1.8" fill="#FFFFFF" />
            {/* Pink Snout & Nostrils */}
            <ellipse cx="96" cy="58" rx="15" ry="10" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
            <circle cx="91" cy="58" r="2" fill="#9D174D" />
            <circle cx="101" cy="58" r="2" fill="#9D174D" />
            <path d="M92 63 Q96 66 100 63" stroke="#9D174D" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Red Collar & Golden Bell */}
            <path d="M82 66 L94 70" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
            <circle cx="88" cy="76" r="5" fill="#FACC15" stroke="#B45309" strokeWidth="1.5" />
          </svg>
        );

      // 5. DUCK (Vịt Vàng Bơi Lội - Toàn thân đứng trên 2 chân màng)
      case 'duck':
      case 'farm-animals-4':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="42" ry="6" fill="#000000" opacity="0.08" />
            {/* 2 Orange Webbed Feet */}
            <rect x="54" y="104" width="6" height="16" fill="#F97316" />
            <path d="M46 124 L64 124 L56 116 Z" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
            <rect x="76" y="104" width="6" height="16" fill="#F97316" />
            <path d="M68 124 L86 124 L78 116 Z" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
            {/* Plump Body & Tail Feathers */}
            <path d="M34 76 C20 72, 22 86, 32 88 L46 96 C46 112, 94 112, 94 94 C94 80, 84 76, 76 76 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
            {/* Cute Wing */}
            <path d="M52 82 C56 72, 74 74, 70 90 C58 92, 48 90, 52 82 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
            {/* Head & Neck */}
            <circle cx="82" cy="52" r="24" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
            {/* Feather Tuft on Head */}
            <path d="M82 28 C80 20, 88 20, 86 28 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            {/* Eyes */}
            <circle cx="86" cy="48" r="5" fill="#0F172A" />
            <circle cx="84.5" cy="46" r="2" fill="#FFFFFF" />
            {/* Orange Bill */}
            <path d="M98 48 C114 46, 116 58, 98 58 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
            <circle cx="106" cy="51" r="1.5" fill="#9A3412" />
            {/* Cheeks */}
            <circle cx="76" cy="56" r="4.5" fill="#FB7185" opacity="0.6" />
          </svg>
        );

      // 6. PIG (Bạn Lợn Hồng Đáng Yêu - Toàn thân tròn trịa 4 chân)
      case 'pig':
      case 'farm-animals-5':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="46" ry="7" fill="#000000" opacity="0.08" />
            {/* Curly Tail */}
            <path d="M28 80 Q16 74 20 68 Q28 64 28 72" stroke="#DB2777" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* 4 Trotters */}
            <rect x="38" y="94" width="11" height="28" rx="5.5" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
            <rect x="52" y="96" width="11" height="26" rx="5.5" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
            <rect x="72" y="96" width="11" height="26" rx="5.5" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
            <rect x="86" y="94" width="11" height="28" rx="5.5" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
            {/* Plump Pink Body */}
            <ellipse cx="64" cy="80" rx="36" ry="28" fill="#FBCFE8" stroke="#DB2777" strokeWidth="3" />
            {/* Head */}
            <circle cx="88" cy="52" r="25" fill="#FBCFE8" stroke="#DB2777" strokeWidth="3" />
            {/* Floppy Ears */}
            <path d="M72 36 C64 26, 68 46, 76 48 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
            <path d="M106 36 C114 26, 110 46, 102 48 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
            {/* Eyes */}
            <ellipse cx="80" cy="48" rx="4" ry="5.5" fill="#0F172A" />
            <circle cx="78.5" cy="46" r="1.8" fill="#FFFFFF" />
            <ellipse cx="98" cy="48" rx="4" ry="5.5" fill="#0F172A" />
            <circle cx="96.5" cy="46" r="1.8" fill="#FFFFFF" />
            {/* Oval Snout */}
            <ellipse cx="90" cy="58" rx="14" ry="10" fill="#F472B6" stroke="#BE185D" strokeWidth="2.5" />
            <ellipse cx="85" cy="58" rx="3" ry="4" fill="#831843" />
            <ellipse cx="95" cy="58" rx="3" ry="4" fill="#831843" />
            <circle cx="74" cy="56" r="4.5" fill="#FB7185" opacity="0.6" />
            <circle cx="104" cy="56" r="4.5" fill="#FB7185" opacity="0.6" />
          </svg>
        );

      // 7. SHEEP (Cừu Bông Trắng Muốt - Toàn thân đám mây 4 chân đen)
      case 'sheep':
      case 'farm-animals-6':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="46" ry="7" fill="#000000" opacity="0.08" />
            {/* 4 Little Dark Legs with Hooves */}
            <rect x="40" y="96" width="9" height="26" rx="4.5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <rect x="54" y="98" width="9" height="24" rx="4.5" fill="#334155" stroke="#0F172A" strokeWidth="2" />
            <rect x="74" y="98" width="9" height="24" rx="4.5" fill="#334155" stroke="#0F172A" strokeWidth="2" />
            <rect x="88" y="96" width="9" height="26" rx="4.5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            {/* Fluffy Wool Cloud Body */}
            <circle cx="44" cy="72" r="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="62" cy="62" r="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="82" cy="70" r="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="50" cy="90" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="74" cy="90" r="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            {/* Little Cloud Tail */}
            <circle cx="28" cy="78" r="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            {/* Head */}
            <ellipse cx="94" cy="54" rx="18" ry="20" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            {/* Forehead Wool Cap */}
            <circle cx="94" cy="38" r="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="86" cy="40" r="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="102" cy="40" r="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            {/* Floppy Ears */}
            <ellipse cx="78" cy="52" rx="10" ry="5" fill="#334155" transform="rotate(-20 78 52)" />
            <ellipse cx="110" cy="52" rx="10" ry="5" fill="#334155" transform="rotate(20 110 52)" />
            {/* Eyes */}
            <circle cx="88" cy="52" r="3.5" fill="#FFFFFF" />
            <circle cx="88" cy="52" r="2" fill="#0F172A" />
            <circle cx="102" cy="52" r="3.5" fill="#FFFFFF" />
            <circle cx="102" cy="52" r="2" fill="#0F172A" />
            <ellipse cx="94" cy="64" rx="3.5" ry="2" fill="#F472B6" />
          </svg>
        );

      // 8. HORSE (Chú Ngựa Nâu Phi Nhanh - Toàn thân 4 vó)
      case 'horse':
      case 'farm-animals-7':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="50" ry="7" fill="#000000" opacity="0.08" />
            {/* Flowing Tail */}
            <path d="M28 72 C14 80, 10 102, 18 116 C22 106, 26 92, 32 82 Z" fill="#78350F" />
            {/* 4 Strong Legs & Hooves */}
            <rect x="36" y="86" width="11" height="36" rx="5.5" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            <rect x="36" y="116" width="11" height="7" rx="3" fill="#1E293B" />
            <rect x="50" y="88" width="11" height="34" rx="5.5" fill="#B45309" stroke="#92400E" strokeWidth="2.5" />
            <rect x="50" y="116" width="11" height="7" rx="3" fill="#1E293B" />
            <rect x="74" y="88" width="11" height="34" rx="5.5" fill="#B45309" stroke="#92400E" strokeWidth="2.5" />
            <rect x="74" y="116" width="11" height="7" rx="3" fill="#1E293B" />
            <rect x="88" y="86" width="11" height="36" rx="5.5" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            <rect x="88" y="116" width="11" height="7" rx="3" fill="#1E293B" />
            {/* Body */}
            <rect x="32" y="62" width="62" height="38" rx="18" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            {/* Flowing Mane along Neck */}
            <path d="M72 32 C68 20, 80 20, 78 32 C74 22, 86 24, 82 38" fill="#78350F" />
            {/* Head & Neck */}
            <path d="M74 62 L82 36 L102 36 L106 66 Z" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            {/* Ears */}
            <polygon points="76,36 82,18 90,34" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
            <polygon points="98,36 104,18 108,34" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
            {/* White Star Blaze on Forehead */}
            <path d="M90 38 L94 48 L86 48 Z" fill="#FEF3C7" />
            {/* Eyes */}
            <ellipse cx="88" cy="46" rx="4.5" ry="6" fill="#0F172A" />
            <circle cx="86.5" cy="44" r="1.8" fill="#FFFFFF" />
            {/* Muzzle & Nostrils */}
            <ellipse cx="102" cy="62" rx="12" ry="9" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
            <circle cx="98" cy="62" r="2" fill="#78350F" />
            <circle cx="106" cy="62" r="2" fill="#78350F" />
          </svg>
        );

      // 9. CHICKEN / HEN (Gà Mái Cục Tác - Toàn thân đứng 2 chân)
      case 'chicken':
      case 'farm-animals-8':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="40" ry="6" fill="#000000" opacity="0.08" />
            {/* 2 Claws */}
            <rect x="56" y="106" width="5" height="16" fill="#F59E0B" />
            <path d="M48 124 L64 124 L58 116 Z" fill="#F59E0B" stroke="#CA8A04" strokeWidth="1.5" />
            <rect x="76" y="106" width="5" height="16" fill="#F59E0B" />
            <path d="M68 124 L84 124 L78 116 Z" fill="#F59E0B" stroke="#CA8A04" strokeWidth="1.5" />
            {/* Plump Feathered Body */}
            <ellipse cx="64" cy="82" rx="32" ry="26" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
            {/* Tail Feathers */}
            <path d="M36 78 C24 64, 28 88, 38 90 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <path d="M38 72 C28 58, 34 82, 42 84 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            {/* Wing */}
            <path d="M52 82 C56 70, 76 72, 72 90 C60 92, 48 90, 52 82 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            {/* Red Comb */}
            <path d="M76 34 C72 20, 84 20, 84 30 C88 18, 98 22, 94 36 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            {/* Head */}
            <circle cx="86" cy="52" r="22" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
            {/* Eyes */}
            <circle cx="88" cy="48" r="4.5" fill="#0F172A" />
            <circle cx="86.5" cy="46" r="1.8" fill="#FFFFFF" />
            {/* Beak & Wattle */}
            <polygon points="98,48 112,48 104,58" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
            <ellipse cx="102" cy="62" rx="4" ry="6" fill="#EF4444" />
            <circle cx="78" cy="54" r="4" fill="#FB7185" opacity="0.6" />
          </svg>
        );

      // 10. RABBIT (Bạn Thỏ Trắng - Toàn thân ngồi vểnh tai)
      case 'rabbit':
      case 'bunny':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="42" ry="6" fill="#000000" opacity="0.08" />
            {/* Fluffy Round Tail */}
            <circle cx="34" cy="98" r="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
            {/* Big Back Foot */}
            <ellipse cx="50" cy="116" rx="16" ry="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
            {/* Body */}
            <ellipse cx="64" cy="88" rx="28" ry="24" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
            {/* Front Paws */}
            <rect x="74" y="96" width="9" height="24" rx="4.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="85" y="96" width="9" height="24" rx="4.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            {/* Head */}
            <circle cx="78" cy="56" r="24" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
            {/* Long Ears */}
            <ellipse cx="68" cy="24" rx="9" ry="22" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" transform="rotate(-10 68 24)" />
            <ellipse cx="68" cy="24" rx="5" ry="16" fill="#FBCFE8" transform="rotate(-10 68 24)" />
            <ellipse cx="88" cy="24" rx="9" ry="22" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" transform="rotate(10 88 24)" />
            <ellipse cx="88" cy="24" rx="5" ry="16" fill="#FBCFE8" transform="rotate(10 88 24)" />
            {/* Eyes */}
            <ellipse cx="70" cy="52" rx="4.5" ry="6" fill="#0F172A" />
            <circle cx="68.5" cy="50" r="1.8" fill="#FFFFFF" />
            <ellipse cx="90" cy="52" rx="4.5" ry="6" fill="#0F172A" />
            <circle cx="88.5" cy="50" r="1.8" fill="#FFFFFF" />
            {/* Nose & Whiskers */}
            <polygon points="78,60 82,60 80,64" fill="#FB7185" />
            <path d="M76 65 Q80 68 84 65" stroke="#64748B" strokeWidth="1.8" fill="none" />
            <line x1="56" y1="58" x2="68" y2="60" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="56" y1="64" x2="68" y2="64" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="104" y1="58" x2="92" y2="60" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="104" y1="64" x2="92" y2="64" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="64" cy="58" r="4" fill="#FDA4AF" opacity="0.6" />
            <circle cx="96" cy="58" r="4" fill="#FDA4AF" opacity="0.6" />
          </svg>
        );

      // 14. LION (Sư Tử Dũng Mãnh - Toàn thân đứng 4 chân có bờm xù & đuôi chùm)
      case 'lion':
      case 'wild-animals-0':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="52" ry="7" fill="#000000" opacity="0.08" />
            {/* Long Tufted Tail */}
            <path d="M30 76 C16 70, 12 50, 22 42" stroke="#D97706" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M20 44 C14 36, 26 34, 28 42 Z" fill="#78350F" />
            {/* 4 Strong Legs & Paws */}
            <rect x="36" y="86" width="12" height="36" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="42" cy="118" r="5" fill="#FDE68A" />
            <rect x="52" y="88" width="12" height="34" rx="6" fill="#D97706" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="58" cy="118" r="5" fill="#FDE68A" />
            <rect x="76" y="88" width="12" height="34" rx="6" fill="#D97706" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="82" cy="118" r="5" fill="#FDE68A" />
            <rect x="90" y="86" width="12" height="36" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="96" cy="118" r="5" fill="#FDE68A" />
            {/* Body */}
            <rect x="34" y="64" width="62" height="38" rx="19" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
            {/* Fluffy Round Mane */}
            <circle cx="94" cy="50" r="32" fill="#F59E0B" stroke="#D97706" strokeWidth="2.5" />
            <circle cx="72" cy="36" r="11" fill="#F97316" />
            <circle cx="116" cy="36" r="11" fill="#F97316" />
            <circle cx="66" cy="52" r="11" fill="#F97316" />
            <circle cx="122" cy="52" r="11" fill="#F97316" />
            <circle cx="74" cy="68" r="11" fill="#F97316" />
            <circle cx="114" cy="68" r="11" fill="#F97316" />
            <circle cx="94" cy="22" r="11" fill="#F97316" />
            {/* Ears */}
            <circle cx="76" cy="34" r="8" fill="#FDE047" stroke="#D97706" strokeWidth="2" />
            <circle cx="76" cy="34" r="4" fill="#F472B6" />
            <circle cx="112" cy="34" r="8" fill="#FDE047" stroke="#D97706" strokeWidth="2" />
            <circle cx="112" cy="34" r="4" fill="#F472B6" />
            {/* Face */}
            <circle cx="94" cy="52" r="22" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" />
            {/* Eyes */}
            <ellipse cx="86" cy="48" rx="4" ry="5.5" fill="#0F172A" />
            <circle cx="84.5" cy="46" r="1.8" fill="#FFFFFF" />
            <ellipse cx="104" cy="48" rx="4" ry="5.5" fill="#0F172A" />
            <circle cx="102.5" cy="46" r="1.8" fill="#FFFFFF" />
            {/* White Muzzle & Nose */}
            <ellipse cx="94" cy="58" rx="11" ry="8" fill="#FFFFFF" stroke="#CA8A04" strokeWidth="1.5" />
            <polygon points="91,54 97,54 94,58" fill="#78350F" />
            <path d="M91 60 Q94 63 97 60" stroke="#78350F" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <circle cx="78" cy="56" r="3.5" fill="#FDA4AF" opacity="0.6" />
            <circle cx="110" cy="56" r="3.5" fill="#FDA4AF" opacity="0.6" />
          </svg>
        );

      // 15. ELEPHANT (Voi Bi Thông Minh - Toàn thân 4 chân to & vòi cong phun nước)
      case 'elephant':
      case 'wild-animals-1':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="54" ry="7" fill="#000000" opacity="0.08" />
            {/* Tail */}
            <path d="M26 84 C18 90, 16 102, 22 108" stroke="#475569" strokeWidth="2.5" fill="none" />
            <circle cx="22" cy="108" r="3" fill="#1E293B" />
            {/* 4 Pillar Legs with White Toe Nails */}
            <rect x="34" y="86" width="14" height="36" rx="7" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
            <circle cx="41" cy="118" r="3" fill="#FFFFFF" />
            <rect x="52" y="88" width="14" height="34" rx="7" fill="#64748B" stroke="#475569" strokeWidth="2.5" />
            <circle cx="59" cy="118" r="3" fill="#FFFFFF" />
            <rect x="76" y="88" width="14" height="34" rx="7" fill="#64748B" stroke="#475569" strokeWidth="2.5" />
            <circle cx="83" cy="118" r="3" fill="#FFFFFF" />
            <rect x="92" y="86" width="14" height="36" rx="7" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
            <circle cx="99" cy="118" r="3" fill="#FFFFFF" />
            {/* Plump Elephant Body */}
            <rect x="28" y="60" width="76" height="46" rx="23" fill="#CBD5E1" stroke="#475569" strokeWidth="3" />
            {/* Big Ears with Soft Pink Inside */}
            <ellipse cx="72" cy="48" rx="14" ry="20" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" transform="rotate(-15 72 48)" />
            <ellipse cx="72" cy="48" rx="8" ry="14" fill="#FBCFE8" transform="rotate(-15 72 48)" />
            {/* Head */}
            <circle cx="94" cy="50" r="24" fill="#CBD5E1" stroke="#475569" strokeWidth="3" />
            {/* Other Ear */}
            <ellipse cx="118" cy="48" rx="14" ry="20" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" transform="rotate(15 118 48)" />
            <ellipse cx="118" cy="48" rx="8" ry="14" fill="#FBCFE8" transform="rotate(15 118 48)" />
            {/* Eyes */}
            <circle cx="86" cy="46" r="4.5" fill="#0F172A" />
            <circle cx="84.5" cy="44" r="1.8" fill="#FFFFFF" />
            <circle cx="104" cy="46" r="4.5" fill="#0F172A" />
            <circle cx="102.5" cy="44" r="1.8" fill="#FFFFFF" />
            {/* Curved Trunk Lifting Upward */}
            <path
              d="M92 56 C92 72, 88 82, 98 86 C108 90, 118 80, 114 70 C112 66, 106 68, 106 64 C106 58, 106 52, 106 52 Z"
              fill="#94A3B8"
              stroke="#475569"
              strokeWidth="2.5"
            />
            {/* Little Blue Water Drops */}
            <circle cx="124" cy="62" r="3.5" fill="#38BDF8" />
            <circle cx="130" cy="54" r="2.5" fill="#38BDF8" />
            <circle cx="120" cy="48" r="2" fill="#38BDF8" />
          </svg>
        );

      // 16. MONKEY (Khỉ Con Tinh Nghịch - Toàn thân ngồi cầm chuối)
      case 'monkey':
      case 'wild-animals-2':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            {/* Green Grassy Mound */}
            <path d="M24 126 C40 114, 100 114, 116 126 Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
            {/* Long Spiral Curled Tail */}
            <path d="M46 96 C30 96, 22 76, 32 64 C40 54, 50 64, 44 74 C40 80, 48 88, 54 88" stroke="#78350F" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Feet */}
            <ellipse cx="50" cy="116" rx="9" ry="5" fill="#92400E" stroke="#78350F" strokeWidth="2" />
            <ellipse cx="90" cy="116" rx="9" ry="5" fill="#92400E" stroke="#78350F" strokeWidth="2" />
            {/* Body */}
            <ellipse cx="70" cy="94" rx="22" ry="24" fill="#92400E" stroke="#78350F" strokeWidth="3" />
            {/* Peach Belly */}
            <ellipse cx="70" cy="96" rx="14" ry="16" fill="#FED7AA" />
            {/* Hands Holding Yellow Banana */}
            <path d="M56 86 C64 80, 80 82, 84 94 C76 96, 62 96, 56 86 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="62" cy="88" r="4" fill="#FED7AA" />
            <circle cx="78" cy="88" r="4" fill="#FED7AA" />
            {/* Round Ears */}
            <circle cx="44" cy="50" r="12" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
            <circle cx="44" cy="50" r="7" fill="#FED7AA" />
            <circle cx="96" cy="50" r="12" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
            <circle cx="96" cy="50" r="7" fill="#FED7AA" />
            {/* Head */}
            <circle cx="70" cy="52" r="26" fill="#92400E" stroke="#78350F" strokeWidth="3" />
            {/* Peach Face Mask */}
            <path d="M58 44 C54 36, 64 36, 70 42 C76 36, 86 36, 82 44 C84 56, 56 56, 58 44 Z" fill="#FED7AA" />
            <ellipse cx="70" cy="58" rx="16" ry="12" fill="#FED7AA" stroke="#D97706" strokeWidth="1.5" />
            {/* Eyes */}
            <circle cx="62" cy="44" r="4" fill="#0F172A" />
            <circle cx="60.5" cy="42" r="1.5" fill="#FFFFFF" />
            <circle cx="78" cy="44" r="4" fill="#0F172A" />
            <circle cx="76.5" cy="42" r="1.5" fill="#FFFFFF" />
            {/* Nose & Big Smile */}
            <ellipse cx="70" cy="54" rx="3.5" ry="2" fill="#78350F" />
            <path d="M62 60 Q70 66 78 60" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="54" cy="56" r="4" fill="#FDA4AF" opacity="0.6" />
            <circle cx="86" cy="56" r="4" fill="#FDA4AF" opacity="0.6" />
          </svg>
        );

      // 17. TIGER (Hổ Con Oai Dũng - Toàn thân sọc vằn 4 chân)
      case 'tiger':
      case 'wild-animals-3':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="52" ry="7" fill="#000000" opacity="0.08" />
            {/* Striped Tail */}
            <path d="M28 78 C16 70, 14 52, 24 44" stroke="#F97316" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M18 64 L22 62 M18 52 L23 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M22 46 C24 42, 28 44, 26 48 Z" fill="#1E293B" />
            {/* 4 Striped Legs */}
            <rect x="36" y="86" width="12" height="36" rx="6" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
            <rect x="52" y="88" width="12" height="34" rx="6" fill="#EA580C" stroke="#C2410C" strokeWidth="2.5" />
            <rect x="76" y="88" width="12" height="34" rx="6" fill="#EA580C" stroke="#C2410C" strokeWidth="2.5" />
            <rect x="90" y="86" width="12" height="36" rx="6" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
            {/* Body */}
            <rect x="32" y="62" width="64" height="38" rx="19" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
            {/* Stripes on Back */}
            <path d="M48 64 L52 74 M62 64 L64 74 M74 64 L72 74" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            {/* White Underbelly */}
            <ellipse cx="64" cy="94" rx="18" ry="6" fill="#FFFFFF" />
            {/* Head */}
            <circle cx="94" cy="50" r="25" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
            {/* Round Ears */}
            <circle cx="74" cy="34" r="9" fill="#EA580C" stroke="#C2410C" strokeWidth="2.5" />
            <circle cx="74" cy="34" r="5" fill="#FFFFFF" />
            <circle cx="114" cy="34" r="9" fill="#EA580C" stroke="#C2410C" strokeWidth="2.5" />
            <circle cx="114" cy="34" r="5" fill="#FFFFFF" />
            {/* Head Stripes */}
            <path d="M94 28 L94 36 M86 30 L88 38 M102 30 L100 38" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="86" cy="46" r="4.5" fill="#0F172A" />
            <circle cx="84.5" cy="44" r="1.8" fill="#FFFFFF" />
            <circle cx="104" cy="46" r="4.5" fill="#0F172A" />
            <circle cx="102.5" cy="44" r="1.8" fill="#FFFFFF" />
            {/* White Snout */}
            <ellipse cx="94" cy="56" rx="13" ry="9" fill="#FFFFFF" stroke="#C2410C" strokeWidth="1.5" />
            <polygon points="91,52 97,52 94,56" fill="#FB7185" />
            <path d="M90 58 Q94 62 98 58" stroke="#7C2D12" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        );

      // 18. BEAR (Gấu Nâu Hiền Lành - Toàn thân ngồi ôm bụng béo)
      case 'bear':
      case 'wild-animals-4':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="46" ry="7" fill="#000000" opacity="0.08" />
            {/* 2 Big Paws Forward */}
            <ellipse cx="48" cy="116" rx="14" ry="9" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
            <circle cx="48" cy="116" r="5" fill="#FED7AA" />
            <ellipse cx="92" cy="116" rx="14" ry="9" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
            <circle cx="92" cy="116" r="5" fill="#FED7AA" />
            {/* Round Brown Body */}
            <ellipse cx="70" cy="88" rx="30" ry="28" fill="#B45309" stroke="#78350F" strokeWidth="3" />
            {/* Honey Belly Patch */}
            <ellipse cx="70" cy="90" rx="18" ry="20" fill="#FED7AA" />
            {/* Hands on Belly */}
            <ellipse cx="48" cy="84" rx="8" ry="12" fill="#B45309" stroke="#78350F" strokeWidth="2" transform="rotate(-20 48 84)" />
            <ellipse cx="92" cy="84" rx="8" ry="12" fill="#B45309" stroke="#78350F" strokeWidth="2" transform="rotate(20 92 84)" />
            {/* Round Ears */}
            <circle cx="52" cy="36" r="10" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
            <circle cx="52" cy="36" r="5" fill="#FED7AA" />
            <circle cx="88" cy="36" r="10" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
            <circle cx="88" cy="36" r="5" fill="#FED7AA" />
            {/* Head */}
            <circle cx="70" cy="52" r="26" fill="#B45309" stroke="#78350F" strokeWidth="3" />
            {/* Eyes */}
            <circle cx="60" cy="48" r="4" fill="#0F172A" />
            <circle cx="58.5" cy="46" r="1.5" fill="#FFFFFF" />
            <circle cx="80" cy="48" r="4" fill="#0F172A" />
            <circle cx="78.5" cy="46" r="1.5" fill="#FFFFFF" />
            {/* Snout */}
            <ellipse cx="70" cy="58" rx="14" ry="10" fill="#FED7AA" stroke="#92400E" strokeWidth="1.5" />
            <ellipse cx="70" cy="54" rx="5" ry="3.5" fill="#1E293B" />
            <path d="M66 60 Q70 64 74 60" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        );

      // 19. GIRAFFE (Hươu Cao Cổ Đáng Yêu - Toàn thân cổ cao 4 chân thanh mảnh)
      case 'giraffe':
      case 'wild-animals-5':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="48" ry="7" fill="#000000" opacity="0.08" />
            {/* Tail */}
            <path d="M26 84 C18 90, 16 104, 22 110" stroke="#CA8A04" strokeWidth="2.5" fill="none" />
            <circle cx="22" cy="110" r="3" fill="#78350F" />
            {/* 4 Long Slender Legs */}
            <rect x="36" y="90" width="8" height="34" rx="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <rect x="36" y="118" width="8" height="6" rx="2" fill="#78350F" />
            <rect x="48" y="92" width="8" height="32" rx="4" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
            <rect x="48" y="118" width="8" height="6" rx="2" fill="#78350F" />
            <rect x="70" y="92" width="8" height="32" rx="4" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
            <rect x="70" y="118" width="8" height="6" rx="2" fill="#78350F" />
            <rect x="80" y="90" width="8" height="34" rx="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <rect x="80" y="118" width="8" height="6" rx="2" fill="#78350F" />
            {/* Body */}
            <path d="M30 76 C30 68, 70 66, 82 74 L84 94 C84 102, 30 102, 30 94 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
            {/* Body Spots */}
            <circle cx="42" cy="80" r="4.5" fill="#B45309" opacity="0.85" />
            <circle cx="56" cy="86" r="5" fill="#B45309" opacity="0.85" />
            <circle cx="70" cy="80" r="4.5" fill="#B45309" opacity="0.85" />
            {/* Long Neck with Mane */}
            <path d="M74 74 L86 36 L98 36 L88 74 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
            <path d="M84 42 L80 44 M82 50 L78 52 M80 58 L76 60 M78 66 L74 68" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="88" cy="48" r="3.5" fill="#B45309" opacity="0.85" />
            <circle cx="86" cy="60" r="4" fill="#B45309" opacity="0.85" />
            {/* Head */}
            <ellipse cx="98" cy="32" rx="16" ry="18" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
            {/* Horns (Ossicones) */}
            <line x1="94" y1="20" x2="92" y2="10" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="92" cy="10" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            <line x1="104" y1="20" x2="106" y2="10" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="106" cy="10" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            {/* Ears */}
            <ellipse cx="84" cy="24" rx="7" ry="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" transform="rotate(-20 84 24)" />
            <ellipse cx="112" cy="24" rx="7" ry="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" transform="rotate(20 112 24)" />
            {/* Eyes */}
            <circle cx="94" cy="28" r="3.5" fill="#0F172A" />
            <circle cx="93" cy="26.5" r="1.2" fill="#FFFFFF" />
            <circle cx="106" cy="28" r="3.5" fill="#0F172A" />
            <circle cx="105" cy="26.5" r="1.2" fill="#FFFFFF" />
            {/* Snout */}
            <ellipse cx="102" cy="40" rx="10" ry="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="98" cy="40" r="1.5" fill="#78350F" />
            <circle cx="106" cy="40" r="1.5" fill="#78350F" />
          </svg>
        );

      // 20. ZEBRA (Ngựa Vằn Nhanh Nhẹn - Toàn thân sọc đen trắng 4 vó)
      case 'zebra':
      case 'wild-animals-6':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="50" ry="7" fill="#000000" opacity="0.08" />
            {/* Striped Tail with Black Tuft */}
            <path d="M28 72 C16 80, 14 100, 20 112" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="20" cy="112" r="3.5" fill="#0F172A" />
            {/* 4 Striped Legs & Hooves */}
            <rect x="36" y="86" width="11" height="36" rx="5.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M36 94 L47 94 M36 104 L47 104" stroke="#0F172A" strokeWidth="2" />
            <rect x="36" y="116" width="11" height="7" rx="3" fill="#0F172A" />
            <rect x="50" y="88" width="11" height="34" rx="5.5" fill="#F1F5F9" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="50" y="116" width="11" height="7" rx="3" fill="#0F172A" />
            <rect x="74" y="88" width="11" height="34" rx="5.5" fill="#F1F5F9" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="74" y="116" width="11" height="7" rx="3" fill="#0F172A" />
            <rect x="88" y="86" width="11" height="36" rx="5.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M88 94 L99 94 M88 104 L99 104" stroke="#0F172A" strokeWidth="2" />
            <rect x="88" y="116" width="11" height="7" rx="3" fill="#0F172A" />
            {/* Body */}
            <rect x="32" y="62" width="62" height="38" rx="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            {/* Zebra Stripes on Body */}
            <path d="M42 62 L42 78 M52 62 L50 82 M62 62 L60 82 M72 62 L74 80" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            {/* Neck & Upright Brush Mane */}
            <path d="M74 62 L82 36 L102 36 L106 66 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            <path d="M78 26 L78 36 M84 22 L84 36 M90 24 L90 36 M96 24 L96 36" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
            {/* Ears */}
            <polygon points="78,36 84,20 92,34" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <polygon points="98,36 104,20 108,34" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            {/* Head Stripes */}
            <path d="M84 44 L92 46 M84 52 L90 54" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            {/* Eyes */}
            <ellipse cx="94" cy="44" rx="4" ry="5.5" fill="#0F172A" />
            <circle cx="92.5" cy="42" r="1.5" fill="#FFFFFF" />
            {/* Dark Muzzle */}
            <ellipse cx="104" cy="58" rx="11" ry="8" fill="#334155" stroke="#0F172A" strokeWidth="2" />
            <circle cx="100" cy="58" r="1.8" fill="#FFFFFF" />
            <circle cx="108" cy="58" r="1.8" fill="#FFFFFF" />
          </svg>
        );

      // 21. APPLE (Quả Táo Đỏ Mọng)
      case 'apple':
      case 'fruits-1':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="42" ry="6" fill="#000000" opacity="0.08" />
            <path d="M70 32 C72 18, 82 16, 84 16" stroke="#78350F" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M72 26 C88 16, 100 28, 84 36 Z" fill="#4ADE80" stroke="#166534" strokeWidth="3" />
            <path d="M70 36 C42 30, 24 54, 30 86 C38 112, 58 118, 70 110 C82 118, 102 112, 110 86 C116 54, 98 30, 70 36 Z" fill="#F87171" stroke="#991B1B" strokeWidth="4" />
            <ellipse cx="50" cy="54" rx="9" ry="16" fill="#FFFFFF" opacity="0.4" transform="rotate(-20 50 54)" />
            <circle cx="54" cy="74" r="5" fill="#0F172A" />
            <circle cx="86" cy="74" r="5" fill="#0F172A" />
            <path d="M62 84 Q70 92 78 84" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <ellipse cx="44" cy="80" rx="5" ry="3" fill="#FECDD3" />
            <ellipse cx="96" cy="80" rx="5" ry="3" fill="#FECDD3" />
          </svg>
        );

      // 22. CAR (Xe Hơi Đỏ Tí Hon)
      case 'car':
      case 'vehicles-1':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <ellipse cx="70" cy="126" rx="52" ry="7" fill="#000000" opacity="0.1" />
            <path d="M38 72 C44 48, 88 48, 100 72 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="3.5" />
            <path d="M44 70 C48 54, 66 52, 66 70 Z" fill="#BAE6FD" opacity="0.75" />
            <rect x="18" y="70" width="104" height="34" rx="14" fill="#EF4444" stroke="#B91C1C" strokeWidth="3.5" />
            <circle cx="28" cy="84" r="5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="112" cy="84" r="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="42" cy="104" r="15" fill="#334155" stroke="#0F172A" strokeWidth="3" />
            <circle cx="42" cy="104" r="6" fill="#E2E8F0" />
            <circle cx="98" cy="104" r="15" fill="#334155" stroke="#0F172A" strokeWidth="3" />
            <circle cx="98" cy="104" r="6" fill="#E2E8F0" />
          </svg>
        );

      // 23. Eraser
      case 'vocab-school-3':
        return (
          <svg viewBox="0 0 140 140" className="w-full h-full max-w-[130px] max-h-[130px] drop-shadow-sm select-none">
            <rect x="26" y="48" width="56" height="48" rx="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="4" />
            <rect x="68" y="48" width="46" height="48" rx="10" fill="#F472B6" stroke="#DB2777" strokeWidth="4" />
            <line x1="68" y1="48" x2="68" y2="96" stroke="#1E293B" strokeWidth="3" />
          </svg>
        );

      default:
        return null;
    }
  };

  const customSvg = renderCustomSvg();

  const cleanWordId = (wordId || '').toLowerCase().trim();
  const realPhotoUrl =
    REAL_ANIMAL_IMAGES[wordId] ||
    REAL_ANIMAL_IMAGES[cleanWordId] ||
    REAL_ANIMAL_IMAGES[cleanWordId.replace(/\s+/g, '-')];

  // If in Hero Flashcard Mode (Filling the top banner of the card)
  if (isHero) {
    if (realPhotoUrl && !imgError) {
      return (
        <div className={`w-full h-full relative overflow-hidden select-none group/img ${className}`}>
          <img
            src={realPhotoUrl}
            alt={wordId}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setImgError(true)}
          />
          {/* Subtle gradient vignette at bottom so it blends softly into the card */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent pointer-events-none" />
        </div>
      );
    }

    return (
      <div className={`w-full h-full flex items-center justify-center relative select-none shrink-0 ${className}`}>
        {customSvg ? (
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-3 transition-transform group-hover:scale-105 duration-200">
            {customSvg}
          </div>
        ) : (
          /* High-resolution Vector Backdrop with centered extra-large visual */
          <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
            <div
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-white/95 shadow-sm border-2 border-white flex items-center justify-center relative transition-transform group-hover:scale-105 duration-200"
            >
              <div
                className="w-3.5 h-3.5 rounded-full absolute top-2 right-2.5 opacity-60"
                style={{ backgroundColor: colorHex }}
              />
              <span
                className="text-7xl sm:text-8xl leading-none filter drop-shadow-sm select-none flex items-center justify-center transform scale-125"
                role="img"
                aria-hidden="true"
              >
                {emoji}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard Compact Mode (Used in games, badges, mini thumbnails)
  const dimensions =
    size === 'sm'
      ? 'w-14 h-14 text-3xl'
      : size === 'md'
        ? 'w-20 h-20 text-4xl'
        : size === 'lg'
          ? 'w-28 h-28 text-6xl'
          : 'w-36 h-36 text-7xl';

  if (realPhotoUrl && !imgError) {
    return (
      <div
        className={`${dimensions} rounded-2xl sm:rounded-3xl relative overflow-hidden select-none shrink-0 shadow-sm border-2 ${className}`}
        style={{ borderColor: colorHex }}
      >
        <img
          src={realPhotoUrl}
          alt={wordId}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${dimensions} rounded-3xl flex items-center justify-center relative select-none shrink-0 shadow-inner ${className}`}
      style={{
        backgroundColor: bgTint,
        border: `3px solid ${colorHex}40`,
      }}
    >
      <div
        className="w-3 h-3 rounded-full absolute top-2.5 right-3 opacity-60"
        style={{ backgroundColor: colorHex }}
      />
      {customSvg || (
        <span className="leading-none filter drop-shadow-sm select-none transform scale-125 flex items-center justify-center" role="img" aria-hidden="true">
          {emoji}
        </span>
      )}
    </div>
  );
};
