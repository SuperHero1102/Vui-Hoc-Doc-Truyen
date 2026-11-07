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
    "badgeVi": "Dễ & Rất vui",
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
        "keyIdx": 3,
        "syllableVi": "con",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "vịt",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "xòe",
        "syllableEn": "duck",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "ra",
        "syllableEn": "spreads",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "hai",
        "syllableEn": "out",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cái",
        "syllableEn": "both",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "cánh,",
        "syllableEn": "wings,",
        "beats": 2
      },
      {
        "keyIdx": 5,
        "syllableVi": "Nó",
        "syllableEn": "It",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "kêu",
        "syllableEn": "cries",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "rằng:",
        "syllableEn": "out:",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "Cáp",
        "syllableEn": "Quack",
        "beats": 0.5
      },
      {
        "keyIdx": 5,
        "syllableVi": "cáp",
        "syllableEn": "quack",
        "beats": 0.5
      },
      {
        "keyIdx": 5,
        "syllableVi": "cáp,",
        "syllableEn": "quack,",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "cạp",
        "syllableEn": "quack",
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
        "syllableVi": "cạp!",
        "syllableEn": "quack!",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Gặp",
        "syllableEn": "In",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "hồ",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "nước",
        "syllableEn": "pond",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "nó",
        "syllableEn": "it",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "bì",
        "syllableEn": "splish-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "bà",
        "syllableEn": "es",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "bì",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "bõm,",
        "syllableEn": "splashes,",
        "beats": 2
      },
      {
        "keyIdx": 5,
        "syllableVi": "Lúc",
        "syllableEn": "Up",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "lên",
        "syllableEn": "on",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "bờ",
        "syllableEn": "shore",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "vẫy",
        "syllableEn": "shakes",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "cái",
        "syllableEn": "its",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "cánh",
        "syllableEn": "wings",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "cho",
        "syllableEn": "un-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "khô!",
        "syllableEn": "til dry!",
        "beats": 2
      }
    ]
  },
  {
    "id": "twinkle",
    "titleVi": "Ngôi Sao Lấp Lánh",
    "titleEn": "Twinkle Twinkle Little Star",
    "emoji": "⭐",
    "badgeVi": "Quốc tế",
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
        "syllableVi": "trời,",
        "syllableEn": "star,",
        "beats": 2
      },
      {
        "keyIdx": 3,
        "syllableVi": "Như",
        "syllableEn": "How",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "kim",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "cương",
        "syllableEn": "won-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "sáng",
        "syllableEn": "der",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "giữa",
        "syllableEn": "what",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "bầu",
        "syllableEn": "you",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "trời,",
        "syllableEn": "are,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Chiếu",
        "syllableEn": "Up",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "muôn",
        "syllableEn": "a-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "nơi",
        "syllableEn": "bove",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "ánh",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "sáng",
        "syllableEn": "world",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "lung",
        "syllableEn": "so",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "linh,",
        "syllableEn": "high,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Sáng",
        "syllableEn": "Like",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "đêm",
        "syllableEn": "a",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "thâu",
        "syllableEn": "dia-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "lấp",
        "syllableEn": "mond",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "lánh",
        "syllableEn": "in",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "reo",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "vui,",
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
        "syllableVi": "trời,",
        "syllableEn": "star,",
        "beats": 2
      },
      {
        "keyIdx": 3,
        "syllableVi": "Như",
        "syllableEn": "How",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "kim",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "cương",
        "syllableEn": "won-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "sáng",
        "syllableEn": "der",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "giữa",
        "syllableEn": "what",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "bầu",
        "syllableEn": "you",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "trời!",
        "syllableEn": "are!",
        "beats": 2
      }
    ]
  },
  {
    "id": "tam_tam_vong",
    "titleVi": "Tập Tầm Vông",
    "titleEn": "Tap Tam Vong Folk Game",
    "emoji": "✊",
    "badgeVi": "Đồng dao",
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
        "syllableEn": "which",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "không",
        "syllableEn": "hand",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "tay",
        "syllableEn": "has",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "có,",
        "syllableEn": "it,",
        "beats": 2
      },
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
        "syllableVi": "vó,",
        "syllableEn": "vo,",
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
        "syllableVi": "có",
        "syllableEn": "hand",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "tay",
        "syllableEn": "is",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "không,",
        "syllableEn": "free,",
        "beats": 2
      },
      {
        "keyIdx": 1,
        "syllableVi": "Mời",
        "syllableEn": "Come",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "các",
        "syllableEn": "on",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "bạn,",
        "syllableEn": "friends,",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "đoán",
        "syllableEn": "guess",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "sao",
        "syllableEn": "which",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "cho",
        "syllableEn": "hand",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "trúng,",
        "syllableEn": "now,",
        "beats": 2
      },
      {
        "keyIdx": 1,
        "syllableVi": "Tập",
        "syllableEn": "Tap",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "tầm",
        "syllableEn": "tam",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "vông",
        "syllableEn": "vong",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "tay",
        "syllableEn": "which",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nào",
        "syllableEn": "hand",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "có",
        "syllableEn": "has",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "đố",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "tay",
        "syllableEn": "which",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "không?",
        "syllableEn": "none?",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Có",
        "syllableEn": "Yes",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "có,",
        "syllableEn": "yes,",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "không",
        "syllableEn": "no",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "không!",
        "syllableEn": "no!",
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
    "badgeVi": "Giáng sinh",
    "category": "international",
    "bpm": 112,
    "notes": [
      {
        "keyIdx": 2,
        "syllableVi": "Chuông",
        "syllableEn": "Jin-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "reo",
        "syllableEn": "gle",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vang,",
        "syllableEn": "bells,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "chuông",
        "syllableEn": "jin-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "reo",
        "syllableEn": "gle",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vang,",
        "syllableEn": "bells,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "chuông",
        "syllableEn": "jin-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "reo",
        "syllableEn": "gle",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "khắp",
        "syllableEn": "all",
        "beats": 1.5
      },
      {
        "keyIdx": 1,
        "syllableVi": "nơi",
        "syllableEn": "the",
        "beats": 0.5
      },
      {
        "keyIdx": 2,
        "syllableVi": "nơi!",
        "syllableEn": "way!",
        "beats": 4
      },
      {
        "keyIdx": 3,
        "syllableVi": "Nghe",
        "syllableEn": "Oh",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "rộn",
        "syllableEn": "what",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "rã",
        "syllableEn": "fun",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "tiếng",
        "syllableEn": "it",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "ca",
        "syllableEn": "is",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vang",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "lừng",
        "syllableEn": "ride",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "bốn",
        "syllableEn": "in",
        "beats": 0.5
      },
      {
        "keyIdx": 2,
        "syllableVi": "phương",
        "syllableEn": "a",
        "beats": 0.5
      },
      {
        "keyIdx": 2,
        "syllableVi": "xa",
        "syllableEn": "one",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "xôi",
        "syllableEn": "horse",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "kìa",
        "syllableEn": "o-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "hỡi",
        "syllableEn": "pen",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "bé",
        "syllableEn": "sleigh,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "ơi!",
        "syllableEn": "hey!",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Chuông",
        "syllableEn": "Jin-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "reo",
        "syllableEn": "gle",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vang,",
        "syllableEn": "bells,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "chuông",
        "syllableEn": "jin-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "reo",
        "syllableEn": "gle",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vang,",
        "syllableEn": "bells,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "chuông",
        "syllableEn": "jin-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "reo",
        "syllableEn": "gle",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "khắp",
        "syllableEn": "all",
        "beats": 1.5
      },
      {
        "keyIdx": 1,
        "syllableVi": "nơi",
        "syllableEn": "the",
        "beats": 0.5
      },
      {
        "keyIdx": 2,
        "syllableVi": "nơi!",
        "syllableEn": "way!",
        "beats": 4
      },
      {
        "keyIdx": 3,
        "syllableVi": "Đêm",
        "syllableEn": "Oh",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "giáng",
        "syllableEn": "what",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "sinh",
        "syllableEn": "fun",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "an",
        "syllableEn": "it",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "lành",
        "syllableEn": "is",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "cùng",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ngân",
        "syllableEn": "ride",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vang",
        "syllableEn": "in",
        "beats": 0.5
      },
      {
        "keyIdx": 2,
        "syllableVi": "tiếng",
        "syllableEn": "a",
        "beats": 0.5
      },
      {
        "keyIdx": 4,
        "syllableVi": "ca",
        "syllableEn": "one",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "mừng",
        "syllableEn": "horse",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "vui",
        "syllableEn": "o-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "chan",
        "syllableEn": "pen",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "hòa!",
        "syllableEn": "sleigh!",
        "beats": 4
      }
    ]
  },
  {
    "id": "ca_nha_thuong_nhau",
    "titleVi": "Cả Nhà Thương Nhau",
    "titleEn": "We Love Each Other",
    "emoji": "👨‍👩‍👧",
    "badgeVi": "Gia đình",
    "category": "vietnam",
    "bpm": 96,
    "notes": [
      {
        "keyIdx": 3,
        "syllableVi": "Ba",
        "syllableEn": "Dad",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "thương",
        "syllableEn": "loves",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "con",
        "syllableEn": "me",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "vì",
        "syllableEn": "for",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "con",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "giống",
        "syllableEn": "look",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "mẹ,",
        "syllableEn": "mom,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Mẹ",
        "syllableEn": "Mom",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "thương",
        "syllableEn": "loves",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "con",
        "syllableEn": "me",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "vì",
        "syllableEn": "for",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "con",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "giống",
        "syllableEn": "look",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ba,",
        "syllableEn": "dad,",
        "beats": 2
      },
      {
        "keyIdx": 3,
        "syllableVi": "Cả",
        "syllableEn": "Our",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nhà",
        "syllableEn": "whole",
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
        "syllableEn": "loves",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "thương",
        "syllableEn": "each",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "yêu",
        "syllableEn": "o-",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "nhau,",
        "syllableEn": "ther,",
        "beats": 2
      },
      {
        "keyIdx": 5,
        "syllableVi": "Xa",
        "syllableEn": "Far",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "là",
        "syllableEn": "we",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "nhớ,",
        "syllableEn": "miss,",
        "beats": 1.5
      },
      {
        "keyIdx": 7,
        "syllableVi": "gần",
        "syllableEn": "near",
        "beats": 0.5
      },
      {
        "keyIdx": 0,
        "syllableVi": "nhau",
        "syllableEn": "we",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "là",
        "syllableEn": "all",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "cười!",
        "syllableEn": "smile!",
        "beats": 2
      }
    ]
  },
  {
    "id": "chau_len_ba",
    "titleVi": "Cháu Lên Ba",
    "titleEn": "I Am Three Years Old",
    "emoji": "🎒",
    "badgeVi": "Mầm non",
    "category": "vietnam",
    "bpm": 104,
    "notes": [
      {
        "keyIdx": 5,
        "syllableVi": "Cháu",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "lên",
        "syllableEn": "am",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "ba,",
        "syllableEn": "three,",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cháu",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "đi",
        "syllableEn": "go",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "mẫu",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 5,
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
        "keyIdx": 4,
        "syllableVi": "thương",
        "syllableEn": "er",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "cháu",
        "syllableEn": "loves",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "vì",
        "syllableEn": "me",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "cháu",
        "syllableEn": "'cause",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "không",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "khóc",
        "syllableEn": "don't",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "nhè,",
        "syllableEn": "cry,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Không",
        "syllableEn": "No",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "khóc",
        "syllableEn": "more",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "nhè",
        "syllableEn": "tears",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "để",
        "syllableEn": "for",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "mẹ",
        "syllableEn": "mom",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "trồng",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "cây",
        "syllableEn": "farm",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "trái,",
        "syllableEn": "fruits,",
        "beats": 2
      },
      {
        "keyIdx": 3,
        "syllableVi": "Ba",
        "syllableEn": "Dad",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "vào",
        "syllableEn": "works",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "nhà",
        "syllableEn": "at",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "máy,",
        "syllableEn": "plant,",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "ông",
        "syllableEn": "grand-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "bà",
        "syllableEn": "pa",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "vui",
        "syllableEn": "plows",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cấy",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "cày!",
        "syllableEn": "field!",
        "beats": 2
      },
      {
        "keyIdx": 7,
        "syllableVi": "Là",
        "syllableEn": "La",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "lá",
        "syllableEn": "la",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "la,",
        "syllableEn": "la,",
        "beats": 2
      },
      {
        "keyIdx": 5,
        "syllableVi": "la",
        "syllableEn": "la",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "là",
        "syllableEn": "la",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "là",
        "syllableEn": "la",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "lá",
        "syllableEn": "la",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "la!",
        "syllableEn": "la!",
        "beats": 2
      }
    ]
  },
  {
    "id": "mary_lamb",
    "titleVi": "Bé Và Chú Cừu Nhỏ",
    "titleEn": "Mary Had a Little Lamb",
    "emoji": "🐑",
    "badgeVi": "Quốc tế",
    "category": "international",
    "bpm": 104,
    "notes": [
      {
        "keyIdx": 2,
        "syllableVi": "Bé",
        "syllableEn": "Ma-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "chăn",
        "syllableEn": "ry",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "ngoan",
        "syllableEn": "had",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "chú",
        "syllableEn": "a",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "cừu",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "nhỏ",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "xinh,",
        "syllableEn": "lamb,",
        "beats": 2
      },
      {
        "keyIdx": 1,
        "syllableVi": "chú",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "cừu",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "xinh,",
        "syllableEn": "lamb,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "chú",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cừu",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "xinh,",
        "syllableEn": "lamb,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Bé",
        "syllableEn": "Ma-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "chăn",
        "syllableEn": "ry",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "ngoan",
        "syllableEn": "had",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "chú",
        "syllableEn": "a",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "cừu",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "nhỏ",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "xinh",
        "syllableEn": "lamb",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ngoan,",
        "syllableEn": "good,",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "Lông",
        "syllableEn": "its",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "trắng",
        "syllableEn": "fleece",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "như",
        "syllableEn": "was",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "là",
        "syllableEn": "white",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "tuyết!",
        "syllableEn": "as snow!",
        "beats": 2
      }
    ]
  },
  {
    "id": "bac_kim_thang",
    "titleVi": "Bắc Kim Thang",
    "titleEn": "Bac Kim Thang Folk Song",
    "emoji": "🪵",
    "badgeVi": "Dân ca",
    "category": "vietnam",
    "bpm": 110,
    "notes": [
      {
        "keyIdx": 5,
        "syllableVi": "Bắc",
        "syllableEn": "Bac",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "kim",
        "syllableEn": "kim",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "thang,",
        "syllableEn": "thang,",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "cà",
        "syllableEn": "ca",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "lang",
        "syllableEn": "lang",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "bí",
        "syllableEn": "bi",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "rợ,",
        "syllableEn": "ro,",
        "beats": 2
      },
      {
        "keyIdx": 1,
        "syllableVi": "Cột",
        "syllableEn": "Cot",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "qua",
        "syllableEn": "qua",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "kèo,",
        "syllableEn": "keo,",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "là",
        "syllableEn": "la",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "kèo",
        "syllableEn": "keo",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "qua",
        "syllableEn": "qua",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "cột,",
        "syllableEn": "cot,",
        "beats": 2
      },
      {
        "keyIdx": 5,
        "syllableVi": "Chú",
        "syllableEn": "Oil",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "bán",
        "syllableEn": "man",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "dầu,",
        "syllableEn": "falls,",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "qua",
        "syllableEn": "cross-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "cầu",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 0,
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
        "keyIdx": 5,
        "syllableVi": "Chú",
        "syllableEn": "Frog",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "bán",
        "syllableEn": "man",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ếch,",
        "syllableEn": "stays,",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "ở",
        "syllableEn": "won-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "lại",
        "syllableEn": "der-",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "làm",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "chi",
        "syllableEn": "why",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nào,",
        "syllableEn": "now,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Con",
        "syllableEn": "Lit-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "le",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "le",
        "syllableEn": "teal",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "đánh",
        "syllableEn": "beats",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "trống",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "thổi",
        "syllableEn": "joy-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "kèn",
        "syllableEn": "ful",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "vang,",
        "syllableEn": "drum,",
        "beats": 2
      },
      {
        "keyIdx": 3,
        "syllableVi": "Con",
        "syllableEn": "Cuc-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "bìm",
        "syllableEn": "koo",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "bịp",
        "syllableEn": "bird",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "thổi",
        "syllableEn": "plays",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "tò",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "tí",
        "syllableEn": "ti",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "te",
        "syllableEn": "te",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "tò",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "te!",
        "syllableEn": "te!",
        "beats": 2
      }
    ]
  },
  {
    "id": "dan_ga_con",
    "titleVi": "Đàn Gà Con",
    "titleEn": "Little Yellow Chicks",
    "emoji": "🐥",
    "badgeVi": "Vui nhộn",
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
        "keyIdx": 1,
        "syllableVi": "kìa",
        "syllableEn": "at",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "đàn",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "gà",
        "syllableEn": "yel-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "con",
        "syllableEn": "low",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "lông",
        "syllableEn": "lit-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "vàng",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "tươi,",
        "syllableEn": "chicks,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Đi",
        "syllableEn": "Fol-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "theo",
        "syllableEn": "low",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "mẹ",
        "syllableEn": "mo-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "tìm",
        "syllableEn": "ther",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ăn",
        "syllableEn": "in",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "trong",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "vườn",
        "syllableEn": "green",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "xanh,",
        "syllableEn": "yard,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Cùng",
        "syllableEn": "Seek-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "tìm",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "mồi",
        "syllableEn": "food",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "ngon",
        "syllableEn": "so",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ngon",
        "syllableEn": "good",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "thơm",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "lành,",
        "syllableEn": "sweet,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Đàn",
        "syllableEn": "Chicks",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "gà",
        "syllableEn": "run",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "con",
        "syllableEn": "a-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "đi",
        "syllableEn": "round",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "lon",
        "syllableEn": "on",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ton",
        "syllableEn": "hap-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "vui!",
        "syllableEn": "py feet!",
        "beats": 2
      }
    ]
  },
  {
    "id": "old_macdonald",
    "titleVi": "Trang Trại Bác MacDonald",
    "titleEn": "Old MacDonald Had a Farm",
    "emoji": "🚜",
    "badgeVi": "Quốc tế",
    "category": "international",
    "bpm": 104,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Bác",
        "syllableEn": "Old",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "Mác",
        "syllableEn": "Mac-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "Đô-",
        "syllableEn": "Don-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nan",
        "syllableEn": "ald",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "có",
        "syllableEn": "had",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "nông",
        "syllableEn": "a",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "trại,",
        "syllableEn": "farm,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "E",
        "syllableEn": "E",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "I",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "E",
        "syllableEn": "E",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "I",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "O!",
        "syllableEn": "O!",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Nơi",
        "syllableEn": "And",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nông",
        "syllableEn": "on",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "trại",
        "syllableEn": "his",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "bác",
        "syllableEn": "farm",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "nuôi",
        "syllableEn": "he",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "đàn",
        "syllableEn": "had",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "vịt",
        "syllableEn": "some",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ngoan",
        "syllableEn": "ducks",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "hiền,",
        "syllableEn": "here,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "E",
        "syllableEn": "E",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "I",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "E",
        "syllableEn": "E",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "I",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "O!",
        "syllableEn": "O!",
        "beats": 2
      }
    ]
  },
  {
    "id": "rua_mat_nhu_meo",
    "titleVi": "Rửa Mặt Như Mèo",
    "titleEn": "Washing Face Like a Cat",
    "emoji": "🐱",
    "badgeVi": "Hóm hỉnh",
    "category": "vietnam",
    "bpm": 104,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Meo",
        "syllableEn": "Meow",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "meo",
        "syllableEn": "meow",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "meo,",
        "syllableEn": "meow,",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "rửa",
        "syllableEn": "wash",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "mặt",
        "syllableEn": "face",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "như",
        "syllableEn": "like",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "chú",
        "syllableEn": "a",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "mèo,",
        "syllableEn": "cat,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Xấu",
        "syllableEn": "Naugh-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "xấu",
        "syllableEn": "ty",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "lắm",
        "syllableEn": "kit-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "chẳng",
        "syllableEn": "ty",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "được",
        "syllableEn": "not",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "mẹ",
        "syllableEn": "loved",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "yêu",
        "syllableEn": "by",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "nào,",
        "syllableEn": "mom,",
        "beats": 2
      },
      {
        "keyIdx": 4,
        "syllableVi": "Khăn",
        "syllableEn": "Where",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "mặt",
        "syllableEn": "is",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "đâu",
        "syllableEn": "towl",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "mà",
        "syllableEn": "why",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "ngồi",
        "syllableEn": "sit",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "liếm",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "mép",
        "syllableEn": "lick",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "thế,",
        "syllableEn": "lips,",
        "beats": 2
      },
      {
        "keyIdx": 1,
        "syllableVi": "Đau",
        "syllableEn": "Sore",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "mắt",
        "syllableEn": "eyes",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "rồi",
        "syllableEn": "then",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "lại",
        "syllableEn": "cry",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "khóc",
        "syllableEn": "out",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "meo",
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
    "emoji": "🏠",
    "badgeVi": "Ngoan ngoãn",
    "category": "vietnam",
    "bpm": 100,
    "notes": [
      {
        "keyIdx": 0,
        "syllableVi": "Đi",
        "syllableEn": "Go",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "học",
        "syllableEn": "home",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "về",
        "syllableEn": "from",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "là",
        "syllableEn": "school,",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "đi",
        "syllableEn": "hap-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "học",
        "syllableEn": "py",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "về,",
        "syllableEn": "way,",
        "beats": 2
      },
      {
        "keyIdx": 2,
        "syllableVi": "Em",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "vào",
        "syllableEn": "step",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "nhà",
        "syllableEn": "in",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "em",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "chào",
        "syllableEn": "greet",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "cha",
        "syllableEn": "mom",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "mẹ",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "hiền,",
        "syllableEn": "dad,",
        "beats": 2
      },
      {
        "keyIdx": 1,
        "syllableVi": "Cha",
        "syllableEn": "Fa-",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "em",
        "syllableEn": "ther",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "khen",
        "syllableEn": "praises",
        "beats": 1
      },
      {
        "keyIdx": 2,
        "syllableVi": "rằng",
        "syllableEn": "that",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "con",
        "syllableEn": "I",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "rất",
        "syllableEn": "am",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ngoan,",
        "syllableEn": "good,",
        "beats": 2
      },
      {
        "keyIdx": 0,
        "syllableVi": "Mẹ",
        "syllableEn": "Mo-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "âu",
        "syllableEn": "ther",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "yếm",
        "syllableEn": "kis-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "hôn",
        "syllableEn": "ses",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "đôi",
        "syllableEn": "both",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "má",
        "syllableEn": "my",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "em!",
        "syllableEn": "cheeks!",
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
    "badgeVi": "Tây Nguyên",
    "category": "vietnam",
    "bpm": 112,
    "notes": [
      {
        "keyIdx": 5,
        "syllableVi": "Chú",
        "syllableEn": "Lit-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "voi",
        "syllableEn": "tle",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "con",
        "syllableEn": "el-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "ở",
        "syllableEn": "e-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "Bản",
        "syllableEn": "phant",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "Đôn,",
        "syllableEn": "in",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "kìa,",
        "syllableEn": "town,",
        "beats": 2
      },
      {
        "keyIdx": 5,
        "syllableVi": "Chưa",
        "syllableEn": "No",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "có",
        "syllableEn": "tusks",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "ngà",
        "syllableEn": "yet",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "nên",
        "syllableEn": "still",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "còn",
        "syllableEn": "a",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "trẻ",
        "syllableEn": "young",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "con,",
        "syllableEn": "child,",
        "beats": 2
      },
      {
        "keyIdx": 1,
        "syllableVi": "Từ",
        "syllableEn": "From",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "rừng",
        "syllableEn": "deep",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "già",
        "syllableEn": "for-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "chú",
        "syllableEn": "est",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "đến",
        "syllableEn": "it",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "với",
        "syllableEn": "comes",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "người,",
        "syllableEn": "here,",
        "beats": 2
      },
      {
        "keyIdx": 3,
        "syllableVi": "Vẫn",
        "syllableEn": "Still",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "ham",
        "syllableEn": "loves",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "ăn",
        "syllableEn": "eat-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "với",
        "syllableEn": "ing",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "lại",
        "syllableEn": "and",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "ham",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "chơi!",
        "syllableEn": "play!",
        "beats": 2
      },
      {
        "keyIdx": 7,
        "syllableVi": "Voi",
        "syllableEn": "El-",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "con",
        "syllableEn": "e-",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "ơi,",
        "syllableEn": "phant,",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "voi",
        "syllableEn": "el-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "con",
        "syllableEn": "e-",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "ơi!",
        "syllableEn": "phant!",
        "beats": 2
      },
      {
        "keyIdx": 5,
        "syllableVi": "Mau",
        "syllableEn": "Grow",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "lớn",
        "syllableEn": "up",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "nhanh",
        "syllableEn": "fast",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "có",
        "syllableEn": "with",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "đôi",
        "syllableEn": "big",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "ngà",
        "syllableEn": "white",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "thật",
        "syllableEn": "strong",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "to!",
        "syllableEn": "tusks!",
        "beats": 2
      },
      {
        "keyIdx": 5,
        "syllableVi": "Có",
        "syllableEn": "Strong",
        "beats": 1
      },
      {
        "keyIdx": 5,
        "syllableVi": "sức",
        "syllableEn": "to",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "đi",
        "syllableEn": "roam",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "khắp",
        "syllableEn": "a-",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "miền",
        "syllableEn": "cross",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "rừng",
        "syllableEn": "the",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "rộng",
        "syllableEn": "for-",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "xa,",
        "syllableEn": "est,",
        "beats": 2
      },
      {
        "keyIdx": 5,
        "syllableVi": "Kéo",
        "syllableEn": "Pull",
        "beats": 1
      },
      {
        "keyIdx": 7,
        "syllableVi": "gỗ",
        "syllableEn": "wood",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "cho",
        "syllableEn": "for",
        "beats": 1
      },
      {
        "keyIdx": 4,
        "syllableVi": "buôn",
        "syllableEn": "our",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "làng",
        "syllableEn": "dear",
        "beats": 1
      },
      {
        "keyIdx": 1,
        "syllableVi": "của",
        "syllableEn": "peace-",
        "beats": 1
      },
      {
        "keyIdx": 0,
        "syllableVi": "chúng",
        "syllableEn": "ful",
        "beats": 1
      },
      {
        "keyIdx": 3,
        "syllableVi": "ta!",
        "syllableEn": "home!",
        "beats": 2
      }
    ]
  }
];
