import type { BrainCategorySection, BrainGameItem } from '../types/learning';

export const BRAIN_GAME_SECTIONS: BrainCategorySection[] = [
  {
    id: 'thinking',
    titleVi: 'Tư Duy',
    subtitleVi: 'Quan sát, ghi nhớ và tư duy',
    iconEmoji: '🧠',
    iconBg: '#FCE7F3',
    games: [
      {
        id: 'find-same',
        category: 'thinking',
        titleVi: 'Tìm Hình Giống Nhau',
        titleEn: 'Find the Same',
        descriptionEn: 'Spot the identical twin picture and learn its English name!',
        promptVi: 'Bé nhìn kỹ hình mẫu và chạm vào hình giống hệt nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '👀',
        defaultLevel: 8,
      },
      {
        id: 'odd-one-out',
        category: 'thinking',
        titleVi: 'Tìm Vật Khác Biệt',
        titleEn: 'Odd One Out',
        descriptionEn: 'Find the one item that is different from all the others!',
        promptVi: 'Trong các hình dưới đây, có 1 bạn khác biệt! Bé tìm giúp cô nhé!',
        ageLabel: '3-5 tuổi',
        emoji: '🔍',
      },
      {
        id: 'memory-flip',
        category: 'thinking',
        titleVi: 'Lật Thẻ Trí Nhớ',
        titleEn: 'Animal Memory',
        descriptionEn: 'Flip cards and remember where cute friends are hiding!',
        promptVi: 'Bé hãy lật mở từng cặp thẻ giống nhau nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🃏',
      },
      {
        id: 'big-or-small',
        category: 'thinking',
        titleVi: 'To hay Nhỏ',
        titleEn: 'Big or Small',
        descriptionEn: 'Compare sizes: which friend is Bigger or Smaller?',
        promptVi: 'Bé cùng so sánh kích thước to lớn và nhỏ xíu nào!',
        ageLabel: '2-4 tuổi',
        emoji: '🐘',
        defaultLevel: 2,
      },
      {
        id: 'shadow-match',
        category: 'thinking',
        titleVi: 'Ghép Bóng Con Vật',
        titleEn: 'Shadow Match',
        descriptionEn: 'Connect each cute animal or object with its silhouette shadow!',
        promptVi: 'Chiếc bóng đen bí ẩn này là của bạn nào nhỉ? Bé chạm chọn đúng nhé!',
        ageLabel: '3-5 tuổi',
        emoji: '👤',
      },
      {
        id: 'pattern-next',
        category: 'thinking',
        titleVi: 'Quy Luật Tiếp Theo',
        titleEn: 'What Comes Next?',
        descriptionEn: 'Discover the pattern sequence and pick what comes next!',
        promptVi: 'Đoàn tàu quy luật đang thiếu 1 hình ở dấu chấm hỏi, bé chọn hình tiếp theo nhé!',
        ageLabel: '3-5 tuổi',
        emoji: '🔄',
      },
      {
        id: 'bubble-pop',
        category: 'thinking',
        titleVi: 'Bé Bấm Nổ Bong Bóng',
        titleEn: 'Bubble Pop Fun',
        descriptionEn: 'Pop colorful floating soap bubbles and hear English words!',
        promptVi: 'Chạm vào những quả bong bóng xà phòng đang bay để nghe từ tiếng Anh nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🫧',
        defaultLevel: 3,
      },
    ],
  },
  {
    id: 'english',
    titleVi: 'Tiếng Anh',
    subtitleVi: 'Nghe nói, bảng chữ cái và từ vựng',
    iconEmoji: '🔤',
    iconBg: '#DBEAFE',
    games: [
      {
        id: 'alphabet-explorer',
        category: 'english',
        titleVi: 'Khám Phá Chữ Cái A-Z',
        titleEn: 'Alphabet Explorer',
        descriptionEn: 'Interactive A to Z phonics board with native voice & illustrations!',
        promptVi: 'Bé chạm vào từng chữ cái từ A đến Z để nghe phát âm Phonics chuẩn nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🔤',
      },
      {
        id: 'listen-animals',
        category: 'english',
        titleVi: 'Nghe Tên Con Vật',
        titleEn: 'Listen: Animals',
        descriptionEn: 'Listen to the teacher and tap the matching animal friend!',
        promptVi: 'Bé lắng nghe cô đọc tên tiếng Anh và chạm đúng bạn thú đáng yêu nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🐶',
        defaultLevel: 7,
      },
      {
        id: 'listen-fruits',
        category: 'english',
        titleVi: 'Nghe Tên Hoa Quả',
        titleEn: 'Listen: Yummy Fruits',
        descriptionEn: 'Listen and pick the delicious sweet fruit in the basket!',
        promptVi: 'Cô đang tìm quả gì thế nhỉ? Bé nghe tiếng Anh và chọn đúng quả ngon nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🍎',
      },
      {
        id: 'first-letter-sound',
        category: 'english',
        titleVi: 'Âm Đầu Của Từ',
        titleEn: 'First Letter Sound',
        descriptionEn: 'Match the word with its starting phonics letter sound!',
        promptVi: 'Từ tiếng Anh này bắt đầu bằng chữ cái nào? Bé chọn chữ cái đầu tiên nhé!',
        ageLabel: '4-5 tuổi',
        emoji: '👂',
      },
      {
        id: 'catch-letter-fish',
        category: 'english',
        titleVi: 'Câu Cá Bắt Chữ Cái & Số',
        titleEn: 'Catch the Letter Fish',
        descriptionEn: 'Go fishing! Tap the swimming fish carrying the target letter or word!',
        promptVi: 'Những chú cá mang chữ cái đang bơi kìa! Bé chạm bắt đúng chú cá cô gọi tên nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🎣',
      },
    ],
  },
  {
    id: 'numbers',
    titleVi: 'Con Số',
    subtitleVi: 'Đếm hình và nhận diện số lượng',
    iconEmoji: '🔢',
    iconBg: '#E0E7FF',
    games: [
      {
        id: 'count-feed-bunny',
        category: 'numbers',
        titleVi: 'Đếm Hình & Cho Thỏ Ăn',
        titleEn: 'Count 1 to 5',
        descriptionEn: 'Count yummy carrots and apples to feed the hungry bunny!',
        promptVi: 'Bé hãy chạm đếm từng củ cà rốt giòn tan đút cho bạn Thỏ Trắng ăn nhé!',
        ageLabel: '2-4 tuổi',
        emoji: '🖐️',
      },
      {
        id: 'find-number',
        category: 'numbers',
        titleVi: 'Tìm Chữ Số',
        titleEn: 'Find the Number',
        descriptionEn: 'Listen to the English number and tap the matching digit!',
        promptVi: 'Bé nghe cô đọc số tiếng Anh và chạm vào chữ số đúng nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '3️⃣',
        defaultLevel: 14,
      },
      {
        id: 'number-to-quantity',
        category: 'numbers',
        titleVi: 'Nối Số Với Số Lượng',
        titleEn: 'Number to Quantity',
        descriptionEn: 'Count the objects and match them with the right number card!',
        promptVi: 'Bé đếm xem có bao nhiêu đồ vật trên màn hình rồi chọn con số tương ứng nhé!',
        ageLabel: '3-5 tuổi',
        emoji: '🔢',
      },
      {
        id: 'which-has-more',
        category: 'numbers',
        titleVi: 'Nhóm Nào Nhiều Hơn?',
        titleEn: 'Which Has More?',
        descriptionEn: 'Compare two baskets and pick the side with MORE items!',
        promptVi: 'Hai khay quà bên dưới, khay nào có số lượng nhiều hơn? Bé chạm chọn nhé!',
        ageLabel: '3-5 tuổi',
        emoji: '⚖️',
      },
      {
        id: 'number-train',
        category: 'numbers',
        titleVi: 'Đoàn Tàu Con Số',
        titleEn: 'Number Train',
        descriptionEn: 'Complete the missing number on the chugging number train!',
        promptVi: 'Xình xịch! Đoàn tàu con số đang bị thiếu 1 toa số, bé lắp đúng số vào toa nhé!',
        ageLabel: '3-5 tuổi',
        emoji: '🚂',
      },
      {
        id: 'one-more-friend',
        category: 'numbers',
        titleVi: 'Thêm Một Bạn Nữa',
        titleEn: 'One More Friend',
        descriptionEn: 'Visual addition: what happens when one more friend joins?',
        promptVi: 'Nếu có thêm 1 bạn nữa chạy tới thì tổng cộng có mấy bạn nhỉ?',
        ageLabel: '3-5 tuổi',
        emoji: '🍎',
      },
    ],
  },
  {
    id: 'shapes_colors',
    titleVi: 'Hình & Màu',
    subtitleVi: 'Phân loại màu sắc và hình khối',
    iconEmoji: '🔷',
    iconBg: '#FEF3C7',
    games: [
      {
        id: 'find-color',
        category: 'shapes_colors',
        titleVi: 'Tìm Màu Sắc',
        titleEn: 'Find the Color',
        descriptionEn: 'Listen to the color in English and tap the matching splash!',
        promptVi: 'Bé nghe tên màu sắc tiếng Anh và chạm vào sắc màu rực rỡ đó nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🎨',
      },
      {
        id: 'shape-matching',
        category: 'shapes_colors',
        titleVi: 'Ghép Hình Khối',
        titleEn: 'Shape Matching',
        descriptionEn: 'Match circles, squares, triangles, stars and hearts!',
        promptVi: 'Bé tìm đúng hình khối giống với khuôn mẫu của cô nhé!',
        ageLabel: '2-4 tuổi',
        emoji: '🔺',
        defaultLevel: 3,
      },
      {
        id: 'sort-by-color',
        category: 'shapes_colors',
        titleVi: 'Phân Loại Màu Sắc',
        titleEn: 'Sort by Color',
        descriptionEn: 'Put colorful fruits and toys into the matching color basket!',
        promptVi: 'Bé hãy chọn món đồ có cùng màu với chiếc giỏ trên màn hình nhé!',
        ageLabel: '3-5 tuổi',
        emoji: '🧺',
        defaultLevel: 2,
      },
      {
        id: 'magic-coloring',
        category: 'shapes_colors',
        titleVi: 'Bé Tô Màu Sáng Tạo',
        titleEn: 'Magic Coloring',
        descriptionEn: 'Color cute animals and fruits with magical rainbow brushes!',
        promptVi: 'Bé chọn bút màu cầu vồng và chạm tô màu cho bức tranh thật đẹp nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🎨',
      },
      {
        id: 'alphabet-tracing',
        category: 'shapes_colors',
        titleVi: 'Bé Tập Vẽ Chữ Tiếng Việt & Anh',
        titleEn: 'Alphabet Tracing',
        descriptionEn: 'Trace big letters with your finger and hear phonics sounds!',
        promptVi: 'Bé dùng ngón tay tô theo nét chữ cái lớn trên bảng nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '✏️',
      },
      {
        id: 'free-drawing',
        category: 'shapes_colors',
        titleVi: 'Bé Tập Vẽ Tranh',
        titleEn: 'Free Drawing Canvas',
        descriptionEn: 'Draw freely with colorful crayons and cute animal stamps!',
        promptVi: 'Bảng vẽ tự do! Bé thỏa sức vẽ tranh và đóng dấu sticker ngộ nghĩnh nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🖍️',
      },
      {
        id: 'rainbow-xylophone',
        category: 'shapes_colors',
        titleVi: 'Đàn Cầu Vồng Vui Nhộn',
        titleEn: 'Rainbow Xylophone',
        descriptionEn: 'Play musical notes on a bright 8-key rainbow xylophone!',
        promptVi: 'Bé gõ đàn Xylophone 8 phím cầu vồng và đánh theo giai điệu bài hát nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🎹',
      },
      {
        id: 'dress-up-makeover',
        category: 'shapes_colors',
        titleVi: 'Trang Điểm & Trang Phục',
        titleEn: 'Character Dress Up & Makeover',
        descriptionEn: 'Dress up cute characters with beautiful clothes, stylish hats, blush and magical props!',
        promptVi: 'Bé chọn trang phục lộng lẫy, trang điểm má hồng xinh và phụ kiện cho bạn nhỏ nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '👗',
      },
    ],
  },
  {
    id: 'puzzles',
    titleVi: 'Ghép Hình',
    subtitleVi: 'Mảnh ghép và đường đi vui nhộn',
    iconEmoji: '🧩',
    iconBg: '#DCFCE7',
    games: [
      {
        id: 'character-puzzle',
        category: 'puzzles',
        titleVi: 'Ghép Hình Nhân Vật',
        titleEn: 'Character Jigsaw Puzzle',
        descriptionEn: 'Choose 4, 6, or 9 pieces, peek at the hint, and assemble cute character puzzles!',
        promptVi: 'Bé chọn số lượng mảnh ghép và ghép hoàn thiện bức tranh nhân vật đáng yêu nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🧩',
        defaultLevel: 4,
      },
      {
        id: 'chunky-puzzle',
        category: 'puzzles',
        titleVi: 'Ghép Hình Đơn Giản',
        titleEn: 'Chunky Puzzle',
        descriptionEn: 'Fit the missing wooden puzzle piece into the board!',
        promptVi: 'Bảng gỗ đang khuyết 1 mảnh ghép, bé chạm chọn mảnh ghép vừa khít nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🧩',
      },
      {
        id: 'puppy-maze',
        category: 'puzzles',
        titleVi: 'Dẫn Đường Cho Chú Chó',
        titleEn: 'Puppy Path Maze',
        descriptionEn: 'Tap the stepping stones in order to guide Puppy home!',
        promptVi: 'Bé chạm lần lượt các bước chân từ 1 đến 5 để dẫn bạn Cún về nhà nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🐾',
      },
    ],
  },
  {
    id: 'discovery',
    titleVi: 'Khám Phá',
    subtitleVi: 'Động vật, xe cộ và âm thanh',
    iconEmoji: '🌍',
    iconBg: '#E0F2FE',
    games: [
      {
        id: 'sunny-farm',
        category: 'discovery',
        titleVi: 'Nông Trại Vui Vẻ',
        titleEn: 'Sunny Farm',
        descriptionEn: 'Explore the sunny farm, tap animals to hear real sounds!',
        promptVi: 'Chào mừng bé đến nông trại nắng ấm! Bé chạm vào các con vật để nghe tiếng kêu nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🚜',
      },
      {
        id: 'things-that-go',
        category: 'discovery',
        titleVi: 'Phương Tiện Giao Thông',
        titleEn: 'Things That Go',
        descriptionEn: 'Cars, fire trucks, airplanes and boats with horn & siren sounds!',
        promptVi: 'Bíp bíp! Bé khám phá các phương tiện giao thông và tìm đúng chiếc xe nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🚗',
      },
      {
        id: 'world-flags',
        category: 'discovery',
        titleVi: 'Khám Phá Quốc Kỳ Các Nước',
        titleEn: 'Flags of the World',
        descriptionEn: 'Learn country flags and names in English & Vietnamese!',
        promptVi: 'Bé chạm vào lá cờ các quốc gia để nghe tên nước bằng tiếng Anh và tiếng Việt nhé!',
        ageLabel: '2-5 tuổi',
        emoji: '🚩',
      },
      {
        id: 'find-flag',
        category: 'discovery',
        titleVi: 'Tìm Lá Cờ Quốc Gia',
        titleEn: 'Find the Flag',
        descriptionEn: 'Listen to the country name and pick its national flag!',
        promptVi: 'Đố bé tìm đúng lá cờ quốc kỳ của đất nước mà cô vừa gọi tên!',
        ageLabel: '3-5 tuổi',
        emoji: '🗺️',
      },
    ],
  },
];

export const ALL_BRAIN_GAMES: BrainGameItem[] = BRAIN_GAME_SECTIONS.flatMap((s) => s.games);

export interface BigSmallPair {
  id: string;
  bigEn: string;
  bigVi: string;
  bigEmoji: string;
  smallEn: string;
  smallVi: string;
  smallEmoji: string;
}

export const BIG_SMALL_PAIRS: BigSmallPair[] = [
  {
    id: 'elephant-mouse',
    bigEn: 'Big Elephant',
    bigVi: 'Voi khổng lồ',
    bigEmoji: '🐘',
    smallEn: 'Small Mouse',
    smallVi: 'Chuột nhỏ xíu',
    smallEmoji: '🐭',
  },
  {
    id: 'whale-fish',
    bigEn: 'Big Whale',
    bigVi: 'Cá voi to lớn',
    bigEmoji: '🐋',
    smallEn: 'Small Fish',
    smallVi: 'Cá nhỏ xinh',
    smallEmoji: '🐠',
  },
  {
    id: 'bus-bike',
    bigEn: 'Big Bus',
    bigVi: 'Xe buýt to',
    bigEmoji: '🚌',
    smallEn: 'Small Bike',
    smallVi: 'Xe đạp nhỏ',
    smallEmoji: '🚲',
  },
  {
    id: 'lion-cat',
    bigEn: 'Big Lion',
    bigVi: 'Sư tử lớn',
    bigEmoji: '🦁',
    smallEn: 'Small Kitten',
    smallVi: 'Mèo con nhỏ',
    smallEmoji: '🐱',
  },
  {
    id: 'tree-flower',
    bigEn: 'Big Tree',
    bigVi: 'Cây cổ thụ to',
    bigEmoji: '🌳',
    smallEn: 'Small Flower',
    smallVi: 'Bông hoa nhỏ',
    smallEmoji: '🌸',
  },
  {
    id: 'melon-cherry',
    bigEn: 'Big Watermelon',
    bigVi: 'Quả dưa hấu to',
    bigEmoji: '🍉',
    smallEn: 'Small Cherry',
    smallVi: 'Quả anh đào nhỏ',
    smallEmoji: '🍒',
  },
];

export interface ShapeItemData {
  id: string;
  en: string;
  vi: string;
  emoji: string;
  colorHex: string;
  bgTint: string;
}

export const SHAPES_DATA: ShapeItemData[] = [
  { id: 'circle', en: 'Circle', vi: 'Hình tròn', emoji: '🔴', colorHex: '#EF4444', bgTint: '#FEE2E2' },
  { id: 'square', en: 'Square', vi: 'Hình vuông', emoji: '🟦', colorHex: '#3B82F6', bgTint: '#DBEAFE' },
  { id: 'triangle', en: 'Triangle', vi: 'Hình tam giác', emoji: '🔺', colorHex: '#F97316', bgTint: '#FFEDD5' },
  { id: 'star', en: 'Star', vi: 'Hình ngôi sao', emoji: '⭐', colorHex: '#EAB308', bgTint: '#FEF9C3' },
  { id: 'heart', en: 'Heart', vi: 'Hình trái tim', emoji: '❤️', colorHex: '#EC4899', bgTint: '#FCE7F3' },
  { id: 'diamond', en: 'Diamond', vi: 'Hình thoi', emoji: '🔶', colorHex: '#F59E0B', bgTint: '#FEF3C7' },
];

export interface ColorSwatchData {
  id: string;
  en: string;
  vi: string;
  emoji: string;
  colorHex: string;
  bgTint: string;
  sampleItemEn: string;
  sampleItemVi: string;
  sampleEmoji: string;
}

export const COLORS_DATA: ColorSwatchData[] = [
  {
    id: 'color-red',
    en: 'Red',
    vi: 'Màu đỏ',
    emoji: '🟥',
    colorHex: '#EF4444',
    bgTint: '#FEE2E2',
    sampleItemEn: 'Red Apple',
    sampleItemVi: 'Quả táo đỏ',
    sampleEmoji: '🍎',
  },
  {
    id: 'color-yellow',
    en: 'Yellow',
    vi: 'Màu vàng',
    emoji: '🟨',
    colorHex: '#EAB308',
    bgTint: '#FEF9C3',
    sampleItemEn: 'Yellow Banana',
    sampleItemVi: 'Quả chuối vàng',
    sampleEmoji: '🍌',
  },
  {
    id: 'color-blue',
    en: 'Blue',
    vi: 'Màu xanh dương',
    emoji: '🟦',
    colorHex: '#0284C7',
    bgTint: '#E0F2FE',
    sampleItemEn: 'Blue Whale',
    sampleItemVi: 'Cá voi xanh',
    sampleEmoji: '🐳',
  },
  {
    id: 'color-green',
    en: 'Green',
    vi: 'Màu xanh lá',
    emoji: '🟩',
    colorHex: '#16A34A',
    bgTint: '#DCFCE7',
    sampleItemEn: 'Green Broccoli',
    sampleItemVi: 'Súp lơ xanh',
    sampleEmoji: '🥦',
  },
  {
    id: 'color-orange',
    en: 'Orange',
    vi: 'Màu da cam',
    emoji: '🟧',
    colorHex: '#F97316',
    bgTint: '#FFEDD5',
    sampleItemEn: 'Orange Carrot',
    sampleItemVi: 'Củ cà rốt cam',
    sampleEmoji: '🥕',
  },
  {
    id: 'color-pink',
    en: 'Pink',
    vi: 'Màu hồng',
    emoji: '🩷',
    colorHex: '#EC4899',
    bgTint: '#FCE7F3',
    sampleItemEn: 'Pink Peach',
    sampleItemVi: 'Quả đào hồng',
    sampleEmoji: '🍑',
  },
  {
    id: 'color-purple',
    en: 'Purple',
    vi: 'Màu tím',
    emoji: '🟪',
    colorHex: '#8B5CF6',
    bgTint: '#EDE9FE',
    sampleItemEn: 'Purple Grapes',
    sampleItemVi: 'Chùm nho tím',
    sampleEmoji: '🍇',
  },
];

export interface CountryFlagData {
  id: string;
  countryEn: string;
  countryVi: string;
  flagEmoji: string;
  greetingOrFactVi: string;
  colorHex: string;
}

export const WORLD_FLAGS_DATA: CountryFlagData[] = [
  {
    id: 'vn',
    countryEn: 'Vietnam',
    countryVi: 'Việt Nam',
    flagEmoji: '🇻🇳',
    greetingOrFactVi: 'Cờ đỏ sao vàng 5 cánh rực rỡ của Tổ quốc Việt Nam!',
    colorHex: '#DC2626',
  },
  {
    id: 'us',
    countryEn: 'United States',
    countryVi: 'Hoa Kỳ (Mỹ)',
    flagEmoji: '🇺🇸',
    greetingOrFactVi: 'Lá cờ có 50 ngôi sao trắng và các sọc đỏ trắng!',
    colorHex: '#2563EB',
  },
  {
    id: 'gb',
    countryEn: 'United Kingdom',
    countryVi: 'Vương quốc Anh',
    flagEmoji: '🇬🇧',
    greetingOrFactVi: 'Đất nước của tháp đồng hồ Big Ben tại Luân Đôn!',
    colorHex: '#1D4ED8',
  },
  {
    id: 'jp',
    countryEn: 'Japan',
    countryVi: 'Nhật Bản',
    flagEmoji: '🇯🇵',
    greetingOrFactVi: 'Đất nước Mặt Trời Mọc và hoa anh đào nở rộ!',
    colorHex: '#E11D48',
  },
  {
    id: 'kr',
    countryEn: 'South Korea',
    countryVi: 'Hàn Quốc',
    flagEmoji: '🇰🇷',
    greetingOrFactVi: 'Đất nước của món Kimbap và trang phục Hanbok!',
    colorHex: '#0284C7',
  },
  {
    id: 'fr',
    countryEn: 'France',
    countryVi: 'Nước Pháp',
    flagEmoji: '🇫🇷',
    greetingOrFactVi: 'Đất nước có tháp Eiffel cao vút ở thủ đô Paris!',
    colorHex: '#4F46E5',
  },
  {
    id: 'au',
    countryEn: 'Australia',
    countryVi: 'Nước Úc',
    flagEmoji: '🇦🇺',
    greetingOrFactVi: 'Quê hương của những chú Chuột túi Kangaroo và Gấu Koala!',
    colorHex: '#0D9488',
  },
  {
    id: 'ca',
    countryEn: 'Canada',
    countryVi: 'Canada',
    flagEmoji: '🇨🇦',
    greetingOrFactVi: 'Lá cờ có chiếc lá phong đỏ tuyệt đẹp ở chính giữa!',
    colorHex: '#DC2626',
  },
  {
    id: 'sg',
    countryEn: 'Singapore',
    countryVi: 'Singapore',
    flagEmoji: '🇸🇬',
    greetingOrFactVi: 'Quốc đảo Sư Tử xanh sạch đẹp với trăng lưỡi liềm và 5 ngôi sao!',
    colorHex: '#EF4444',
  },
  {
    id: 'de',
    countryEn: 'Germany',
    countryVi: 'Nước Đức',
    flagEmoji: '🇩🇪',
    greetingOrFactVi: 'Lá cờ 3 sọc ngang Đen - Đỏ - Vàng nổi tiếng ở châu Âu!',
    colorHex: '#D97706',
  },
  {
    id: 'br',
    countryEn: 'Brazil',
    countryVi: 'Brazil',
    flagEmoji: '🇧🇷',
    greetingOrFactVi: 'Đất nước của rừng nhiệt đới Amazon xanh mát!',
    colorHex: '#16A34A',
  },
  {
    id: 'it',
    countryEn: 'Italy',
    countryVi: 'Nước Ý',
    flagEmoji: '🇮🇹',
    greetingOrFactVi: 'Quê hương của bánh Pizza và mì Ý Spaghetti thơm ngon!',
    colorHex: '#059669',
  },
  {
    id: 'cn',
    countryEn: 'China',
    countryVi: 'Trung Quốc',
    flagEmoji: '🇨🇳',
    greetingOrFactVi: 'Đất nước của gấu trúc Panda và Vạn Lý Trường Thành kỳ vĩ!',
    colorHex: '#DC2626',
  },
  {
    id: 'es',
    countryEn: 'Spain',
    countryVi: 'Tây Ban Nha',
    flagEmoji: '🇪🇸',
    greetingOrFactVi: 'Xứ sở của điệu nhảy Flamenco sôi động và bóng đá đỉnh cao!',
    colorHex: '#EA580C',
  },
  {
    id: 'th',
    countryEn: 'Thailand',
    countryVi: 'Thái Lan',
    flagEmoji: '🇹🇭',
    greetingOrFactVi: 'Xứ sở Chùa Vàng xinh đẹp gần gũi với Việt Nam!',
    colorHex: '#2563EB',
  },
  {
    id: 'ch',
    countryEn: 'Switzerland',
    countryVi: 'Thụy Sĩ',
    flagEmoji: '🇨🇭',
    greetingOrFactVi: 'Đất nước của dãy núi Alps tuyết trắng và đồng hồ chính xác!',
    colorHex: '#E11D48',
  },
];

export interface AlphabetPhonicsItem {
  letter: string;
  wordEn: string;
  wordVi: string;
  emoji: string;
  colorHex: string;
}

export const ALPHABET_A_TO_Z: AlphabetPhonicsItem[] = [
  { letter: 'A', wordEn: 'Apple', wordVi: 'Quả táo', emoji: '🍎', colorHex: '#EF4444' },
  { letter: 'B', wordEn: 'Bear', wordVi: 'Con gấu', emoji: '🐻', colorHex: '#D97706' },
  { letter: 'C', wordEn: 'Cat', wordVi: 'Con mèo', emoji: '🐱', colorHex: '#F97316' },
  { letter: 'D', wordEn: 'Dog', wordVi: 'Con chó', emoji: '🐶', colorHex: '#EA580C' },
  { letter: 'E', wordEn: 'Elephant', wordVi: 'Con voi', emoji: '🐘', colorHex: '#3B82F6' },
  { letter: 'F', wordEn: 'Fish', wordVi: 'Con cá', emoji: '🐠', colorHex: '#0284C7' },
  { letter: 'G', wordEn: 'Giraffe', wordVi: 'Hươu cao cổ', emoji: '🦒', colorHex: '#EAB308' },
  { letter: 'H', wordEn: 'Horse', wordVi: 'Con ngựa', emoji: '🐴', colorHex: '#9333EA' },
  { letter: 'I', wordEn: 'Ice Cream', wordVi: 'Kem ốc quế', emoji: '🍦', colorHex: '#EC4899' },
  { letter: 'J', wordEn: 'Juice', wordVi: 'Nước ép', emoji: '🧃', colorHex: '#F59E0B' },
  { letter: 'K', wordEn: 'Kite', wordVi: 'Cánh diều', emoji: '🪁', colorHex: '#06B6D4' },
  { letter: 'L', wordEn: 'Lion', wordVi: 'Sư tử', emoji: '🦁', colorHex: '#D97706' },
  { letter: 'M', wordEn: 'Monkey', wordVi: 'Con khỉ', emoji: '🐵', colorHex: '#B45309' },
  { letter: 'N', wordEn: 'Nest', wordVi: 'Tổ chim', emoji: '🪺', colorHex: '#16A34A' },
  { letter: 'O', wordEn: 'Orange', wordVi: 'Quả cam', emoji: '🍊', colorHex: '#F97316' },
  { letter: 'P', wordEn: 'Panda', wordVi: 'Gấu trúc', emoji: '🐼', colorHex: '#0F766E' },
  { letter: 'Q', wordEn: 'Queen', wordVi: 'Nữ hoàng', emoji: '👑', colorHex: '#A855F7' },
  { letter: 'R', wordEn: 'Rabbit', wordVi: 'Con thỏ', emoji: '🐰', colorHex: '#EC4899' },
  { letter: 'S', wordEn: 'Sun', wordVi: 'Mặt trời', emoji: '☀️', colorHex: '#EAB308' },
  { letter: 'T', wordEn: 'Tiger', wordVi: 'Con hổ', emoji: '🐯', colorHex: '#EA580C' },
  { letter: 'U', wordEn: 'Umbrella', wordVi: 'Chiếc ô', emoji: '☂️', colorHex: '#6366F1' },
  { letter: 'V', wordEn: 'Violin', wordVi: 'Đàn vĩ cầm', emoji: '🎻', colorHex: '#B45309' },
  { letter: 'W', wordEn: 'Whale', wordVi: 'Cá voi', emoji: '🐋', colorHex: '#0284C7' },
  { letter: 'X', wordEn: 'Xylophone', wordVi: 'Đàn mộc cầm', emoji: '🎹', colorHex: '#10B981' },
  { letter: 'Y', wordEn: 'Yacht', wordVi: 'Du thuyền', emoji: '🛥️', colorHex: '#2563EB' },
  { letter: 'Z', wordEn: 'Zebra', wordVi: 'Ngựa vằn', emoji: '🦓', colorHex: '#475569' },
];

export interface XylophoneKeyItem {
  note: string;
  solfegeVi: string;
  colorEn: string;
  colorVi: string;
  freq: number;
  bgHex: string;
  borderHex: string;
  heightPct: number;
}

export const XYLOPHONE_KEYS: XylophoneKeyItem[] = [
  { note: 'C4', solfegeVi: 'Đô', colorEn: 'Red', colorVi: 'Đỏ', freq: 261.63, bgHex: '#EF4444', borderHex: '#B91C1C', heightPct: 100 },
  { note: 'D4', solfegeVi: 'Rê', colorEn: 'Orange', colorVi: 'Cam', freq: 293.66, bgHex: '#F97316', borderHex: '#C2410C', heightPct: 94 },
  { note: 'E4', solfegeVi: 'Mi', colorEn: 'Yellow', colorVi: 'Vàng', freq: 329.63, bgHex: '#EAB308', borderHex: '#A16207', heightPct: 88 },
  { note: 'F4', solfegeVi: 'Fa', colorEn: 'Green', colorVi: 'Xanh lá', freq: 349.23, bgHex: '#22C55E', borderHex: '#15803D', heightPct: 82 },
  { note: 'G4', solfegeVi: 'Sol', colorEn: 'Sky Blue', colorVi: 'Xanh da trời', freq: 392.0, bgHex: '#0EA5E9', borderHex: '#0369A1', heightPct: 76 },
  { note: 'A4', solfegeVi: 'La', colorEn: 'Indigo', colorVi: 'Chàm', freq: 440.0, bgHex: '#6366F1', borderHex: '#4338CA', heightPct: 70 },
  { note: 'B4', solfegeVi: 'Si', colorEn: 'Purple', colorVi: 'Tím', freq: 493.88, bgHex: '#A855F7', borderHex: '#7E22CE', heightPct: 64 },
  { note: 'C5', solfegeVi: 'Đố', colorEn: 'Pink', colorVi: 'Hồng', freq: 523.25, bgHex: '#EC4899', borderHex: '#BE185D', heightPct: 58 },
];

export interface RainbowSongNote {
  keyIdx: number; // 0..7 index in XYLOPHONE_KEYS (0: Đô, 1: Rê, 2: Mi, 3: Fa, 4: Sol, 5: La, 6: Si, 7: Đố)
  syllableVi: string;
  syllableEn?: string;
  beats?: number; // Duration in musical beats (default 1, e.g. 0.5, 1, 2, 3)
  durationMs?: number;
}

export interface RainbowSongItem {
  id: string;
  titleVi: string;
  titleEn: string;
  emoji: string;
  badgeVi: string;
  category: 'vietnam' | 'international' | 'folk_animals';
  bpm: number;
  notes: RainbowSongNote[];
}

export interface PianoBlackKeyItem {
  id: string;
  note: string;
  nameVi: string;
  freq: number;
  leftPct: number; // Percentage offset across the 8 white keys
}

export const PIANO_BLACK_KEYS: PianoBlackKeyItem[] = [
  { id: 'cs4', note: 'C#4', nameVi: 'Đô#', freq: 277.18, leftPct: 8.5 },
  { id: 'ds4', note: 'D#4', nameVi: 'Rê#', freq: 311.13, leftPct: 21.0 },
  { id: 'fs4', note: 'F#4', nameVi: 'Fa#', freq: 369.99, leftPct: 46.0 },
  { id: 'gs4', note: 'G#4', nameVi: 'Sol#', freq: 415.30, leftPct: 58.5 },
  { id: 'as4', note: 'A#4', nameVi: 'La#', freq: 466.16, leftPct: 71.0 },
];

export const RAINBOW_SONGS: RainbowSongItem[] = [
  {
    "id": "butterfly",
    "titleVi": "Kìa Con Bướm Vàng",
    "titleEn": "Frère Jacques / Yellow Butterfly",
    "emoji": "🦋",
    "badgeVi": "Dễ & Rất vui",
    "category": "international",
    "bpm": 104,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Kìa",
        "syllableEn": "Are",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "con",
        "syllableEn": "you",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "bướm",
        "syllableEn": "sleep-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "vàng,",
        "syllableEn": "ing,",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "kìa",
        "syllableEn": "are",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "con",
        "syllableEn": "you",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "bướm",
        "syllableEn": "sleep-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "vàng,",
        "syllableEn": "ing,",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "xòe",
        "syllableEn": "Broth-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "đôi",
        "syllableEn": "er",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cánh,",
        "syllableEn": "John,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "xòe",
        "syllableEn": "Broth-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "đôi",
        "syllableEn": "er",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cánh,",
        "syllableEn": "John!",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "bướm",
        "syllableEn": "Morn-",
        "beats": 0.5
      },
      {
        "keyIdx": 5,
        "syllableVi": "tung",
        "syllableEn": "ing",
        "beats": 0.5
      },
      {
        "keyIdx": 4,
        "syllableVi": "tăng",
        "syllableEn": "bells",
        "beats": 0.5
      },
      {
        "keyIdx": 3,
        "syllableVi": "bay",
        "syllableEn": "are",
        "beats": 0.5
      },
      {
        "keyIdx": 2,
        "syllableVi": "lượn,",
        "syllableEn": "ring-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "kìa,",
        "syllableEn": "ing,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "bướm",
        "syllableEn": "morn-",
        "beats": 0.5
      },
      {
        "keyIdx": 5,
        "syllableVi": "tung",
        "syllableEn": "ing",
        "beats": 0.5
      },
      {
        "keyIdx": 4,
        "syllableVi": "tăng",
        "syllableEn": "bells",
        "beats": 0.5
      },
      {
        "keyIdx": 3,
        "syllableVi": "bay",
        "syllableEn": "are",
        "beats": 0.5
      },
      {
        "keyIdx": 2,
        "syllableVi": "lượn,",
        "syllableEn": "ring-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "kìa,",
        "syllableEn": "ing,",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "em",
        "syllableEn": "Ding",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "ngồi",
        "syllableEn": "dong",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "xem!",
        "syllableEn": "dong!",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Em",
        "syllableEn": "Ding",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "ngồi",
        "syllableEn": "dong",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "xem!",
        "syllableEn": "dong!",
        "beats": 2
      }
    ]
  },
  {
    "id": "duck",
    "titleVi": "Một Con Vịt",
    "titleEn": "One Little Duck",
    "emoji": "🦆",
    "badgeVi": "Quen thuộc & Đáng yêu",
    "category": "vietnam",
    "bpm": 108,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Một",
        "syllableEn": "One",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "con",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "vịt",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "xòe",
        "syllableEn": "duck",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ra",
        "syllableEn": "flaps",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "hai",
        "syllableEn": "two",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "cái",
        "syllableEn": "wide",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "cánh,",
        "syllableEn": "wings,",
        "beats": 2
      },
      {
        "keyIdx": 3,
        "syllableVi": "Nó",
        "syllableEn": "It",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "kêu",
        "syllableEn": "cries",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "rằng:",
        "syllableEn": "out:",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "Cạp",
        "syllableEn": "Quack",
        "beats": 0.5
      },
      {
        "keyIdx": 0,
        "syllableVi": "cạp",
        "syllableEn": "quack",
        "beats": 0.5
      },
      {
        "keyIdx": 0,
        "syllableVi": "cạp,",
        "syllableEn": "quack,",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "cạp",
        "syllableEn": "quack",
        "beats": 0.5
      },
      {
        "keyIdx": 2,
        "syllableVi": "cạp",
        "syllableEn": "quack",
        "beats": 0.5
      },
      {
        "keyIdx": 0,
        "syllableVi": "cạp!",
        "syllableEn": "quack!",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Gặp",
        "syllableEn": "See-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "hồ",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nước",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "nó",
        "syllableEn": "pond,",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "bì",
        "syllableEn": "it",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "bà",
        "syllableEn": "splish-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "bì",
        "syllableEn": "es",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "bõm,",
        "syllableEn": "in,",
        "beats": 2
      },
      {
        "keyIdx": 3,
        "syllableVi": "Lúc",
        "syllableEn": "When",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "lên",
        "syllableEn": "it",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "bờ",
        "syllableEn": "walks",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "vẫy",
        "syllableEn": "a-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "cánh",
        "syllableEn": "shore",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "cho",
        "syllableEn": "it",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "thật",
        "syllableEn": "shakes",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "khô!",
        "syllableEn": "dry!",
        "beats": 2
      }
    ]
  },
  {
    "id": "twinkle",
    "titleVi": "Ngôi Sao Lấp Lánh",
    "titleEn": "Twinkle Twinkle Little Star",
    "emoji": "⭐",
    "badgeVi": "Giai điệu êm dịu",
    "category": "international",
    "bpm": 100,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Kìa",
        "syllableEn": "Twin-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "ngôi",
        "syllableEn": "kle,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "sao",
        "syllableEn": "twin-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "sáng",
        "syllableEn": "kle,",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "lấp",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "lánh",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "trên trời,",
        "syllableEn": "star,",
        "beats": 2
      },
      {
        "keyIdx": 3,
        "syllableVi": "Soi",
        "syllableEn": "How",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "đêm",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "thâu",
        "syllableEn": "won-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "như",
        "syllableEn": "der",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "kim",
        "syllableEn": "what",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "cương",
        "syllableEn": "you",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "sáng,",
        "syllableEn": "are!",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Sao",
        "syllableEn": "Up",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "lung",
        "syllableEn": "a-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "linh",
        "syllableEn": "bove",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "chiếu",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "khắp",
        "syllableEn": "world",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "gian",
        "syllableEn": "so",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "trần,",
        "syllableEn": "high,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Đưa",
        "syllableEn": "Like",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "em",
        "syllableEn": "a",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "vào",
        "syllableEn": "dia-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "giấc",
        "syllableEn": "mond",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ngủ",
        "syllableEn": "in",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "êm",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "đềm,",
        "syllableEn": "sky,",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Kìa",
        "syllableEn": "Twin-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "ngôi",
        "syllableEn": "kle,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "sao",
        "syllableEn": "twin-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "sáng",
        "syllableEn": "kle,",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "lấp",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "lánh",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "trên trời!",
        "syllableEn": "star!",
        "beats": 2
      }
    ]
  },
  {
    "id": "tam_tam_vong",
    "titleVi": "Tập Tầm Vông",
    "titleEn": "Tap Tam Vong Folk Game",
    "emoji": "✊",
    "badgeVi": "Trò chơi đoán tay",
    "category": "vietnam",
    "bpm": 104,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Tập",
        "syllableEn": "Tap",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "tầm",
        "syllableEn": "tam",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "vông,",
        "syllableEn": "vong,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "tay",
        "syllableEn": "hand",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "không",
        "syllableEn": "emp-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "tay",
        "syllableEn": "ty,",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "có,",
        "syllableEn": "full,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Tập",
        "syllableEn": "Tap",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "tầm",
        "syllableEn": "tam",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "vó,",
        "syllableEn": "vo,",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "tay",
        "syllableEn": "hand",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "có",
        "syllableEn": "full,",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "tay",
        "syllableEn": "emp-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "không,",
        "syllableEn": "ty,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Tay",
        "syllableEn": "Which",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nào",
        "syllableEn": "hand",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "có,",
        "syllableEn": "has,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "tay",
        "syllableEn": "which",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "nào",
        "syllableEn": "hand",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "không?",
        "syllableEn": "none?",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Có",
        "syllableEn": "Has",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "có",
        "syllableEn": "has",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "không",
        "syllableEn": "none",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "không!",
        "syllableEn": "none!",
        "beats": 2
      }
    ]
  },
  {
    "id": "happy_birthday",
    "titleVi": "Chúc Mừng Sinh Nhật",
    "titleEn": "Happy Birthday to You",
    "emoji": "🎂",
    "badgeVi": "Sinh nhật tưng bừng",
    "category": "international",
    "bpm": 100,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Mừng",
        "syllableEn": "Hap-",
        "beats": 0.75
      },
      {
        "keyIdx": 0,
        "syllableVi": "ngày",
        "syllableEn": "py",
        "beats": 0.25
      },
      {
        "keyIdx": 1,
        "syllableVi": "sinh",
        "syllableEn": "birth-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "nhật",
        "syllableEn": "day",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "của",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "em,",
        "syllableEn": "you,",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Mừng",
        "syllableEn": "Hap-",
        "beats": 0.75
      },
      {
        "keyIdx": 0,
        "syllableVi": "ngày",
        "syllableEn": "py",
        "beats": 0.25
      },
      {
        "keyIdx": 1,
        "syllableVi": "sinh",
        "syllableEn": "birth-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "nhật",
        "syllableEn": "day",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "của",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "em,",
        "syllableEn": "you,",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Mừng",
        "syllableEn": "Hap-",
        "beats": 0.75
      },
      {
        "keyIdx": 0,
        "syllableVi": "ngày",
        "syllableEn": "py",
        "beats": 0.25
      },
      {
        "keyIdx": 7,
        "syllableVi": "sinh",
        "syllableEn": "birth-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "nhật",
        "syllableEn": "day",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "bé",
        "syllableEn": "dear",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "yêu",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "dấu,",
        "syllableEn": "tle baby,",
        "beats": 1.5
      },
      {
        "keyIdx": 5,
        "syllableVi": "Chúc",
        "syllableEn": "Hap-",
        "beats": 0.75
      },
      {
        "keyIdx": 5,
        "syllableVi": "em",
        "syllableEn": "py",
        "beats": 0.25
      },
      {
        "keyIdx": 4,
        "syllableVi": "sinh",
        "syllableEn": "birth-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "nhật",
        "syllableEn": "day",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "vui",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "tươi!",
        "syllableEn": "you!",
        "beats": 2
      }
    ]
  },
  {
    "id": "jingle_bells",
    "titleVi": "Chuông Reo Vang",
    "titleEn": "Jingle Bells",
    "emoji": "🔔",
    "badgeVi": "Giáng sinh rộn ràng",
    "category": "international",
    "bpm": 112,
    "notes": [
      {
        "keyIdx": 2,
        "syllableVi": "Jin-",
        "syllableEn": "Jin-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "gle",
        "syllableEn": "gle",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "bells,",
        "syllableEn": "bells,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "jin-",
        "syllableEn": "jin-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "gle",
        "syllableEn": "gle",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "bells,",
        "syllableEn": "bells,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "jin-",
        "syllableEn": "jin-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "gle",
        "syllableEn": "gle",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "all",
        "syllableEn": "all",
        "beats": 1.5
      },
      {
        "keyIdx": 1,
        "syllableVi": "the",
        "syllableEn": "the",
        "beats": 0.5
      },
      {
        "keyIdx": 2,
        "syllableVi": "way,",
        "syllableEn": "way,",
        "beats": 3
      },
      {
        "keyIdx": 3,
        "syllableVi": "Oh",
        "syllableEn": "Oh",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "what",
        "syllableEn": "what",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "fun",
        "syllableEn": "fun",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "it",
        "syllableEn": "it",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "is",
        "syllableEn": "is",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "to",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ride",
        "syllableEn": "ride",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "in",
        "syllableEn": "a",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "one",
        "syllableEn": "horse",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "horse",
        "syllableEn": "o-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "o-",
        "syllableEn": "pen",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "pen",
        "syllableEn": "sleigh!",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "sleigh!",
        "syllableEn": "sleigh!",
        "beats": 2
      }
    ]
  },
  {
    "id": "ca_nha_thuong_nhau",
    "titleVi": "Cả Nhà Thương Nhau",
    "titleEn": "We Love Each Other",
    "emoji": "👨‍👩‍👧",
    "badgeVi": "Gia đình yêu thương",
    "category": "vietnam",
    "bpm": 96,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Ba",
        "syllableEn": "Dad",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "thương",
        "syllableEn": "loves",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "con",
        "syllableEn": "child",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "vì",
        "syllableEn": "cause",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "con",
        "syllableEn": "you",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "giống",
        "syllableEn": "look",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "mẹ,",
        "syllableEn": "like mom,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Mẹ",
        "syllableEn": "Mom",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "thương",
        "syllableEn": "loves",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "con",
        "syllableEn": "child",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "vì",
        "syllableEn": "cause",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "con",
        "syllableEn": "you",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "giống",
        "syllableEn": "look",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "ba,",
        "syllableEn": "like dad,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Cả",
        "syllableEn": "All",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nhà",
        "syllableEn": "our",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ta",
        "syllableEn": "home",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cùng",
        "syllableEn": "we",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "thương",
        "syllableEn": "love",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "yêu",
        "syllableEn": "each",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "nhau,",
        "syllableEn": "oth-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nhau,",
        "syllableEn": "er,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Xa",
        "syllableEn": "Far",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "là",
        "syllableEn": "a-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "nhớ,",
        "syllableEn": "way",
        "beats": 1.5
      },
      {
        "keyIdx": 0,
        "syllableVi": "gần",
        "syllableEn": "near",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "nhau",
        "syllableEn": "we",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "là",
        "syllableEn": "laugh",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "cười!",
        "syllableEn": "cheer!",
        "beats": 2
      }
    ]
  },
  {
    "id": "chau_len_ba",
    "titleVi": "Cháu Lên Ba",
    "titleEn": "I Am Three Years Old",
    "emoji": "👧",
    "badgeVi": "Bé ngoan đi học",
    "category": "vietnam",
    "bpm": 104,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Cháu",
        "syllableEn": "I'm",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "lên",
        "syllableEn": "three",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "ba",
        "syllableEn": "years",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cháu",
        "syllableEn": "old,",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "đi",
        "syllableEn": "off",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "mẫu",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "giáo,",
        "syllableEn": "school,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Cô",
        "syllableEn": "Teach-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "thương",
        "syllableEn": "er",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "cháu",
        "syllableEn": "loves",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "vì",
        "syllableEn": "me",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "không",
        "syllableEn": "cause",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "khóc",
        "syllableEn": "no",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "nhè,",
        "syllableEn": "tears,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Không",
        "syllableEn": "No",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "khóc",
        "syllableEn": "cry-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "nhè",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "để",
        "syllableEn": "so",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "mẹ",
        "syllableEn": "mom",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "trồng",
        "syllableEn": "plants",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "cây",
        "syllableEn": "green",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "trái,",
        "syllableEn": "trees,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Ba",
        "syllableEn": "Dad",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vào",
        "syllableEn": "works",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "nhà",
        "syllableEn": "hard,",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "máy,",
        "syllableEn": "grand-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "ông",
        "syllableEn": "ma",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "bà",
        "syllableEn": "farms",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "vui",
        "syllableEn": "so",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "cấy cày!",
        "syllableEn": "free!",
        "beats": 2
      }
    ]
  },
  {
    "id": "con_co_be_be",
    "titleVi": "Con Cò Bé Bé",
    "titleEn": "Little White Stork",
    "emoji": "🦩",
    "badgeVi": "Giai điệu thân thương",
    "category": "vietnam",
    "bpm": 100,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Con",
        "syllableEn": "Lit-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "cò",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "bé",
        "syllableEn": "white",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "bé,",
        "syllableEn": "stork,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nó",
        "syllableEn": "sits",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "đậu",
        "syllableEn": "on",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cành",
        "syllableEn": "bam-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "tre,",
        "syllableEn": "boo,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Đi",
        "syllableEn": "Leav-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "không",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "hỏi",
        "syllableEn": "with-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "mẹ,",
        "syllableEn": "out,",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "biết",
        "syllableEn": "know-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "đi",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "đường nào?",
        "syllableEn": "the way?",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Khi",
        "syllableEn": "When",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "đi",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "em",
        "syllableEn": "go,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "hỏi,",
        "syllableEn": "ask,",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "khi",
        "syllableEn": "when",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "về",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "em",
        "syllableEn": "come,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "chào,",
        "syllableEn": "bow,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Miệng",
        "syllableEn": "Smil-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "em",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "chúm",
        "syllableEn": "bright-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "chím,",
        "syllableEn": "ly,",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "mẹ",
        "syllableEn": "mom",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "yêu",
        "syllableEn": "loves",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "không",
        "syllableEn": "me",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "nào!",
        "syllableEn": "so!",
        "beats": 2
      }
    ]
  },
  {
    "id": "bac_kim_thang",
    "titleVi": "Bắc Kim Thang",
    "titleEn": "Bac Kim Thang Folk Song",
    "emoji": "🎋",
    "badgeVi": "Đồng dao dân gian",
    "category": "vietnam",
    "bpm": 110,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Bắc",
        "syllableEn": "Bac",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "kim",
        "syllableEn": "Kim",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "thang,",
        "syllableEn": "Thang,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cà",
        "syllableEn": "sweet",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "lang",
        "syllableEn": "pump-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "bí",
        "syllableEn": "kin",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "rợ,",
        "syllableEn": "vine,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Cột",
        "syllableEn": "Tie",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "qua",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "kèo,",
        "syllableEn": "beam,",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "là",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "kèo",
        "syllableEn": "cross",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "qua",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "cột,",
        "syllableEn": "pole,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Chú",
        "syllableEn": "Mis-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "bán",
        "syllableEn": "ter",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "dầu,",
        "syllableEn": "oil,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "qua",
        "syllableEn": "falls",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "cầu",
        "syllableEn": "on",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "mà",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "té,",
        "syllableEn": "bridge,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Chú",
        "syllableEn": "Mis-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "bán",
        "syllableEn": "ter",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "ếch,",
        "syllableEn": "frog,",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "ở",
        "syllableEn": "stays",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "lại",
        "syllableEn": "right",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "làm",
        "syllableEn": "by",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "chi!",
        "syllableEn": "here!",
        "beats": 2
      }
    ]
  },
  {
    "id": "dan_ga_con",
    "titleVi": "Đàn Gà Con",
    "titleEn": "Little Yellow Chicks",
    "emoji": "🐥",
    "badgeVi": "Vui tươi nhí nhảnh",
    "category": "vietnam",
    "bpm": 104,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Trông",
        "syllableEn": "Look",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "kìa",
        "syllableEn": "at",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "đàn",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "gà",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "con",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "lông",
        "syllableEn": "yel-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vàng,",
        "syllableEn": "low chicks,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Đi",
        "syllableEn": "Fol-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "theo",
        "syllableEn": "low-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "mẹ",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "tìm",
        "syllableEn": "their",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "ăn",
        "syllableEn": "mom",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "trong",
        "syllableEn": "in",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "vườn,",
        "syllableEn": "the yard,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Cùng",
        "syllableEn": "Eat-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "tìm",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "mồi",
        "syllableEn": "good",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "ăn",
        "syllableEn": "grain",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ngon",
        "syllableEn": "so",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "ngon",
        "syllableEn": "yum-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ghê,",
        "syllableEn": "my,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Đàn",
        "syllableEn": "The",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "gà",
        "syllableEn": "chicks",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "con",
        "syllableEn": "run",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "lon",
        "syllableEn": "hap-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "ton",
        "syllableEn": "pi-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vui",
        "syllableEn": "ly",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "ghê!",
        "syllableEn": "along!",
        "beats": 2
      }
    ]
  },
  {
    "id": "chu_ech_con",
    "titleVi": "Chú Ếch Con",
    "titleEn": "Little Green Frog",
    "emoji": "🐸",
    "badgeVi": "Vui nhộn & Đáng yêu",
    "category": "vietnam",
    "bpm": 110,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Kìa",
        "syllableEn": "See",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "chú",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "là",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "chú",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ếch",
        "syllableEn": "green",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "con,",
        "syllableEn": "frog,",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "Có",
        "syllableEn": "Two",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "hai",
        "syllableEn": "big",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "là",
        "syllableEn": "eyes",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "hai",
        "syllableEn": "so",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "mắt",
        "syllableEn": "shin-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "tròn,",
        "syllableEn": "ing,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Chú",
        "syllableEn": "Sit-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ngồi",
        "syllableEn": "ting",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "học",
        "syllableEn": "study-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "bài",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "một",
        "syllableEn": "by",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "mình,",
        "syllableEn": "himself,",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Bên",
        "syllableEn": "Near",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "khóm",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "hoa",
        "syllableEn": "lil-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "kề",
        "syllableEn": "y",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "bờ ao!",
        "syllableEn": "pond!",
        "beats": 2
      }
    ]
  },
  {
    "id": "rua_mat_nhu_meo",
    "titleVi": "Rửa Mặt Như Mèo",
    "titleEn": "Washing Face Like a Cat",
    "emoji": "🐱",
    "badgeVi": "Vệ sinh cá nhân ngoan",
    "category": "vietnam",
    "bpm": 104,
    "notes": [
      {
        "keyIdx": 4,
        "syllableVi": "Meo",
        "syllableEn": "Meow",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "meo",
        "syllableEn": "meow",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "meo,",
        "syllableEn": "meow,",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "rửa",
        "syllableEn": "wash",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "mặt",
        "syllableEn": "your",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "như",
        "syllableEn": "face",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "mèo,",
        "syllableEn": "cat,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Xấu",
        "syllableEn": "So",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "xấu",
        "syllableEn": "dirt-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "lắm",
        "syllableEn": "y",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "chẳng",
        "syllableEn": "mom",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "được",
        "syllableEn": "won't",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "mẹ",
        "syllableEn": "love",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "yêu,",
        "syllableEn": "you,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Khăn",
        "syllableEn": "Where's",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "mặt",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "đâu",
        "syllableEn": "tow-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "mà",
        "syllableEn": "el,",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "ngồi",
        "syllableEn": "lick-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "liếm",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "mép,",
        "syllableEn": "lips,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Đau",
        "syllableEn": "Sore",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "mắt",
        "syllableEn": "eyes",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "rồi",
        "syllableEn": "now,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "lại",
        "syllableEn": "crying",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "khóc",
        "syllableEn": "meow",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "meo",
        "syllableEn": "meow",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "meo!",
        "syllableEn": "meow!",
        "beats": 2
      }
    ]
  },
  {
    "id": "di_hoc_ve",
    "titleVi": "Đi Học Về",
    "titleEn": "Coming Home from School",
    "emoji": "🎒",
    "badgeVi": "Chào hỏi lễ phép",
    "category": "vietnam",
    "bpm": 100,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Đi",
        "syllableEn": "Com-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "học",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "về",
        "syllableEn": "home",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "là",
        "syllableEn": "from",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "đi",
        "syllableEn": "kin-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "học",
        "syllableEn": "der-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "về,",
        "syllableEn": "garten,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Em",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vào",
        "syllableEn": "come",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "nhà",
        "syllableEn": "in",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "em",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "chào",
        "syllableEn": "greet",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "cha",
        "syllableEn": "my",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "mẹ,",
        "syllableEn": "parents,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Cha",
        "syllableEn": "Fa-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "em",
        "syllableEn": "ther",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "khen",
        "syllableEn": "praises",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "rằng",
        "syllableEn": "good",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "con",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "rất",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ngoan,",
        "syllableEn": "child,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Mẹ",
        "syllableEn": "Mo-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "âu",
        "syllableEn": "ther",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "yếm",
        "syllableEn": "kisses",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "hôn",
        "syllableEn": "soft",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "đôi",
        "syllableEn": "rosy",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "má",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "em!",
        "syllableEn": "tle cheeks!",
        "beats": 2
      }
    ]
  },
  {
    "id": "abc_song",
    "titleVi": "Bé Học Chữ ABC",
    "titleEn": "The ABC Alphabet Song",
    "emoji": "🔤",
    "badgeVi": "Học bảng chữ cái",
    "category": "international",
    "bpm": 100,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "A",
        "syllableEn": "A",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "B",
        "syllableEn": "B",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "C",
        "syllableEn": "C",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "D",
        "syllableEn": "D",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "E",
        "syllableEn": "E",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "F",
        "syllableEn": "F",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "G,",
        "syllableEn": "G,",
        "beats": 2
      },
      {
        "keyIdx": 3,
        "syllableVi": "H",
        "syllableEn": "H",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "I",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "J",
        "syllableEn": "J",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "K",
        "syllableEn": "K",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "L M",
        "syllableEn": "L M",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "N O",
        "syllableEn": "N O",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "P,",
        "syllableEn": "P,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Q",
        "syllableEn": "Q",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "R",
        "syllableEn": "R",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "S,",
        "syllableEn": "S,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "T",
        "syllableEn": "T",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "U",
        "syllableEn": "U",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "V,",
        "syllableEn": "V,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "W,",
        "syllableEn": "W,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "X,",
        "syllableEn": "X,",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "Y",
        "syllableEn": "Y",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "and",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "Z,",
        "syllableEn": "Z,",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Now",
        "syllableEn": "Now",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "I",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "know",
        "syllableEn": "know",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "my",
        "syllableEn": "my",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "A",
        "syllableEn": "A",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "B",
        "syllableEn": "B",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "Cs!",
        "syllableEn": "Cs!",
        "beats": 2
      }
    ]
  },
  {
    "id": "chu_voi_con",
    "titleVi": "Chú Voi Con Ở Bản Đôn",
    "titleEn": "Little Elephant in Don Village",
    "emoji": "🐘",
    "badgeVi": "Hào hùng Tây Nguyên",
    "category": "vietnam",
    "bpm": 112,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Chú",
        "syllableEn": "Lit-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "voi",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "con",
        "syllableEn": "el-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "ở",
        "syllableEn": "e-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "Bản",
        "syllableEn": "phant",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "Đôn,",
        "syllableEn": "at Don,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Chưa",
        "syllableEn": "Has",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "có",
        "syllableEn": "no",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ngà",
        "syllableEn": "tusks",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nên",
        "syllableEn": "so",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "còn",
        "syllableEn": "still",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "trẻ",
        "syllableEn": "a",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "con,",
        "syllableEn": "child,",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Từ",
        "syllableEn": "From",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "rừng",
        "syllableEn": "deep",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "già",
        "syllableEn": "for-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "chú",
        "syllableEn": "est",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "đến",
        "syllableEn": "he",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "với",
        "syllableEn": "comes",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "người,",
        "syllableEn": "here,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Vẫn",
        "syllableEn": "Still",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ham",
        "syllableEn": "loves",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "ăn",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "với",
        "syllableEn": "eat",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "lại",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ham",
        "syllableEn": "run",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "chơi!",
        "syllableEn": "free!",
        "beats": 2
      }
    ]
  }
];




