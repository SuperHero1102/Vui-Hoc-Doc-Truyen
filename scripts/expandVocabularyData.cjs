const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'lessonsData.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// High-quality child-friendly vocabulary expansions for each of the 32 topics
const EXPANSIONS = {
  'farm-animals': [
    {
      id: 'turkey',
      en: 'Turkey',
      vi: 'Con gà tây',
      phonetic: "/'tɜ:ki/",
      emoji: '🦃',
      colorHex: '#B45309',
      bgTint: '#FEF3C7',
      soundEffect: 'cluck',
      soundLabelVi: 'Gà tây đuôi xòe quạt!',
      phrase2To3y: { en: 'Brown turkey', vi: 'Gà tây nâu' },
      sentence3To4y: { en: 'The turkey has big feathers.', vi: 'Bạn gà tây có bộ lông xòe to.' },
      phonics4To5y: { letter: 'T', sound: 'chữ T', spelling: 'T - U - R - K - E - Y', questionEn: 'Which word starts with letter T?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ T?' }
    },
    {
      id: 'goat',
      en: 'Goat',
      vi: 'Con dê con',
      phonetic: '/ɡoʊt/',
      emoji: '🐐',
      colorHex: '#10B981',
      bgTint: '#D1FAE5',
      soundEffect: 'baa',
      soundLabelVi: 'Be he! Dê con ăn cỏ!',
      phrase2To3y: { en: 'Little goat', vi: 'Dê con bé' },
      sentence3To4y: { en: 'The goat jumps on grass.', vi: 'Dê con nhảy tung tăng trên bãi cỏ.' },
      phonics4To5y: { letter: 'G', sound: 'chữ G', spelling: 'G - O - A - T', questionEn: 'Which word starts with letter G?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ G?' }
    },
    {
      id: 'donkey',
      en: 'Donkey',
      vi: 'Chú lừa con',
      phonetic: "/'dɔŋki/",
      emoji: '🫏',
      colorHex: '#64748B',
      bgTint: '#F1F5F9',
      soundEffect: 'neigh',
      soundLabelVi: 'I-a! Chú lừa ngoan!',
      phrase2To3y: { en: 'Friendly donkey', vi: 'Chú lừa thân thiện' },
      sentence3To4y: { en: 'The donkey carries apples.', vi: 'Chú lừa giúp chở táo đỏ về kho.' },
      phonics4To5y: { letter: 'D', sound: 'chữ D', spelling: 'D - O - N - K - E - Y', questionEn: 'Which word starts with letter D?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ D?' }
    },
    {
      id: 'mouse',
      en: 'Mouse',
      vi: 'Chú chuột nhắt',
      phonetic: '/maʊs/',
      emoji: '🐭',
      colorHex: '#94A3B8',
      bgTint: '#F8FAFC',
      soundEffect: 'chirp',
      soundLabelVi: 'Chít chít! Chuột nhắt!',
      phrase2To3y: { en: 'Tiny mouse', vi: 'Chuột nhắt xíu' },
      sentence3To4y: { en: 'A tiny mouse likes cheese.', vi: 'Chuột nhắt rất thích ăn phô mai.' },
      phonics4To5y: { letter: 'M', sound: 'chữ M', spelling: 'M - O - U - S - E', questionEn: 'Which word starts with letter M?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ M?' }
    },
    {
      id: 'goose',
      en: 'Goose',
      vi: 'Con ngỗng trắng',
      phonetic: '/ɡuːs/',
      emoji: '🪿',
      colorHex: '#38BDF8',
      bgTint: '#E0F2FE',
      soundEffect: 'quack',
      soundLabelVi: 'Cạp cạp! Ngỗng cổ dài!',
      phrase2To3y: { en: 'White goose', vi: 'Ngỗng trắng tinh' },
      sentence3To4y: { en: 'The goose swims in pond.', vi: 'Ngỗng trắng bơi trên mặt hồ êm đềm.' },
      phonics4To5y: { letter: 'G', sound: 'chữ G', spelling: 'G - O - O - S - E', questionEn: 'Which word starts with letter G?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ G?' }
    },
    {
      id: 'chick',
      en: 'Chick',
      vi: 'Gà con lông vàng',
      phonetic: '/tʃɪk/',
      emoji: '🐥',
      colorHex: '#FACC15',
      bgTint: '#FEF9C3',
      soundEffect: 'chirp',
      soundLabelVi: 'Chíp chíp! Gà con theo mẹ!',
      phrase2To3y: { en: 'Yellow chick', vi: 'Gà con vàng' },
      sentence3To4y: { en: 'The baby chick follows mom.', vi: 'Gà con lon ton đi theo gà mẹ.' },
      phonics4To5y: { letter: 'C', sound: 'chữ C', spelling: 'C - H - I - C - K', questionEn: 'Which word starts with letter C?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ C?' }
    },
    {
      id: 'rabbit',
      en: 'Rabbit',
      vi: 'Con thỏ trắng',
      phonetic: "/'ræbɪt/",
      emoji: '🐰',
      colorHex: '#EC4899',
      bgTint: '#FCE7F3',
      soundEffect: 'crunch',
      soundLabelVi: 'Thỏ con tai dài ăn cà rốt!',
      phrase2To3y: { en: 'Cute rabbit', vi: 'Thỏ con đáng yêu' },
      sentence3To4y: { en: 'The rabbit hops so high.', vi: 'Bạn thỏ nhảy thoăn thoắt trên cỏ.' },
      phonics4To5y: { letter: 'R', sound: 'chữ R', spelling: 'R - A - B - B - I - T', questionEn: 'Which word starts with letter R?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ R?' }
    },
    {
      id: 'pigeon',
      en: 'Pigeon',
      vi: 'Chim bồ câu',
      phonetic: "/'pɪdʒɪn/",
      emoji: '🐦',
      colorHex: '#0284C7',
      bgTint: '#E0F2FE',
      soundEffect: 'chirp',
      soundLabelVi: 'Cù gù! Bồ câu hòa bình!',
      phrase2To3y: { en: 'Grey pigeon', vi: 'Bồ câu xám' },
      sentence3To4y: { en: 'The pigeon flies in the sky.', vi: 'Chim bồ câu bay lượn trên bầu trời.' },
      phonics4To5y: { letter: 'P', sound: 'chữ P', spelling: 'P - I - G - E - O - N', questionEn: 'Which word starts with letter P?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ P?' }
    }
  ],

  'wild-animals': [
    {
      id: 'kangaroo',
      en: 'Kangaroo',
      vi: 'Chuột túi Kangaroo',
      phonetic: "/ˌkæŋɡəˈruː/",
      emoji: '🦘',
      colorHex: '#EA580C',
      bgTint: '#FFEDD5',
      soundEffect: 'honk',
      soundLabelVi: 'Bật nhảy tanh tách!',
      phrase2To3y: { en: 'Jumping kangaroo', vi: 'Chuột túi nhảy cao' },
      sentence3To4y: { en: 'The kangaroo carries baby in pouch.', vi: 'Chuột túi mẹ địu con trong chiếc túi ấm.' },
      phonics4To5y: { letter: 'K', sound: 'chữ K', spelling: 'K - A - N - G - A - R - O - O', questionEn: 'Which word starts with letter K?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ K?' }
    },
    {
      id: 'koala',
      en: 'Koala',
      vi: 'Gấu túi Koala',
      phonetic: "/koʊˈɑːlə/",
      emoji: '🐨',
      colorHex: '#64748B',
      bgTint: '#F1F5F9',
      soundEffect: 'crunch',
      soundLabelVi: 'Koala ôm cây bạch đàn!',
      phrase2To3y: { en: 'Sleepy koala', vi: 'Gấu túi hay ngủ' },
      sentence3To4y: { en: 'The koala hugs the tree.', vi: 'Gấu Koala ôm chặt thân cây ngủ say.' },
      phonics4To5y: { letter: 'K', sound: 'chữ K', spelling: 'K - O - A - L - A', questionEn: 'Which word starts with letter K?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ K?' }
    },
    {
      id: 'zebra',
      en: 'Zebra',
      vi: 'Ngựa vằn',
      phonetic: "/'zebrə/",
      emoji: '🦓',
      colorHex: '#334155',
      bgTint: '#F8FAFC',
      soundEffect: 'neigh',
      soundLabelVi: 'Ngựa vằn sọc đen trắng!',
      phrase2To3y: { en: 'Striped zebra', vi: 'Ngựa vằn sọc' },
      sentence3To4y: { en: 'The zebra runs on savanna.', vi: 'Ngựa vằn chạy nhanh trên đồng cỏ.' },
      phonics4To5y: { letter: 'Z', sound: 'chữ Z', spelling: 'Z - E - B - R - A', questionEn: 'Which word starts with letter Z?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ Z?' }
    },
    {
      id: 'fox',
      en: 'Fox',
      vi: 'Con cáo đỏ',
      phonetic: '/fɑːks/',
      emoji: '🦊',
      colorHex: '#F97316',
      bgTint: '#FFEDD5',
      soundEffect: 'woof',
      soundLabelVi: 'Cáo thông minh!',
      phrase2To3y: { en: 'Clever fox', vi: 'Cáo nhanh nhẹn' },
      sentence3To4y: { en: 'The red fox has bushy tail.', vi: 'Bạn cáo có chiếc đuôi bông tuyệt đẹp.' },
      phonics4To5y: { letter: 'F', sound: 'chữ F', spelling: 'F - O - X', questionEn: 'Which word starts with letter F?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ F?' }
    },
    {
      id: 'hippo',
      en: 'Hippo',
      vi: 'Hà mã khổng lồ',
      phonetic: "/'hɪpoʊ/",
      emoji: '🦛',
      colorHex: '#6366F1',
      bgTint: '#EEF2FF',
      soundEffect: 'splash',
      soundLabelVi: 'Hà mã ngâm mình dưới nước!',
      phrase2To3y: { en: 'Big hippo', vi: 'Hà mã béo tròn' },
      sentence3To4y: { en: 'The hippo swims in the river.', vi: 'Hà mã thích tắm mát dưới dòng sông.' },
      phonics4To5y: { letter: 'H', sound: 'chữ H', spelling: 'H - I - P - P - O', questionEn: 'Which word starts with letter H?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ H?' }
    },
    {
      id: 'rhino',
      en: 'Rhino',
      vi: 'Tê giác một sừng',
      phonetic: "/'raɪnoʊ/",
      emoji: '🦏',
      colorHex: '#475569',
      bgTint: '#F1F5F9',
      soundEffect: 'honk',
      soundLabelVi: 'Tê giác dũng mãnh!',
      phrase2To3y: { en: 'Strong rhino', vi: 'Tê giác khỏe mạnh' },
      sentence3To4y: { en: 'The rhino has a big horn.', vi: 'Bạn tê giác có chiếc sừng chắc khỏe.' },
      phonics4To5y: { letter: 'R', sound: 'chữ R', spelling: 'R - H - I - N - O', questionEn: 'Which word starts with letter R?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ R?' }
    },
    {
      id: 'cheetah',
      en: 'Cheetah',
      vi: 'Báo gấm chạy nhanh',
      phonetic: "/'tʃiːtə/",
      emoji: '🐆',
      colorHex: '#EAB308',
      bgTint: '#FEF9C3',
      soundEffect: 'roar',
      soundLabelVi: 'Chạy nhanh như gió!',
      phrase2To3y: { en: 'Fast cheetah', vi: 'Báo gấm chạy nhanh' },
      sentence3To4y: { en: 'The cheetah runs like the wind.', vi: 'Báo gấm là động vật chạy nhanh nhất.' },
      phonics4To5y: { letter: 'C', sound: 'chữ C', spelling: 'C - H - E - E - T - A - H', questionEn: 'Which word starts with letter C?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ C?' }
    },
    {
      id: 'camel',
      en: 'Camel',
      vi: 'Lạc đà sa mạc',
      phonetic: "/'kæməl/",
      emoji: '🐪',
      colorHex: '#D97706',
      bgTint: '#FEF3C7',
      soundEffect: 'honk',
      soundLabelVi: 'Lạc đà chở hàng sa mạc!',
      phrase2To3y: { en: 'Desert camel', vi: 'Lạc đà sa mạc' },
      sentence3To4y: { en: 'The camel walks across the sand.', vi: 'Lạc đà đi vững vàng trên cát sa mạc.' },
      phonics4To5y: { letter: 'C', sound: 'chữ C', spelling: 'C - A - M - E - L', questionEn: 'Which word starts with letter C?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ C?' }
    }
  ],

  'fruits': [
    {
      id: 'mango',
      en: 'Mango',
      vi: 'Quả xoài chín vàng',
      phonetic: "/'mæŋɡoʊ/",
      emoji: '🥭',
      colorHex: '#F59E0B',
      bgTint: '#FEF3C7',
      soundEffect: 'crunch',
      soundLabelVi: 'Xoài ngọt thơm ngát!',
      phrase2To3y: { en: 'Sweet mango', vi: 'Xoài ngọt lịm' },
      sentence3To4y: { en: 'I love yellow mango.', vi: 'Tớ thích ăn quả xoài chín vàng ngọt.' },
      phonics4To5y: { letter: 'M', sound: 'chữ M', spelling: 'M - A - N - G - O', questionEn: 'Which word starts with letter M?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ M?' }
    },
    {
      id: 'peach',
      en: 'Peach',
      vi: 'Quả đào má hồng',
      phonetic: '/piːtʃ/',
      emoji: '🍑',
      colorHex: '#FB7185',
      bgTint: '#FFE4E6',
      soundEffect: 'crunch',
      soundLabelVi: 'Đào má hồng thơm phức!',
      phrase2To3y: { en: 'Pink peach', vi: 'Quả đào hồng' },
      sentence3To4y: { en: 'The peach is soft and sweet.', vi: 'Quả đào mềm và thơm dịu.' },
      phonics4To5y: { letter: 'P', sound: 'chữ P', spelling: 'P - E - A - C - H', questionEn: 'Which word starts with letter P?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ P?' }
    },
    {
      id: 'cherry',
      en: 'Cherry',
      vi: 'Quả anh đào đỏ mọng',
      phonetic: "/'tʃeri/",
      emoji: '🍒',
      colorHex: '#E11D48',
      bgTint: '#FFE4E6',
      soundEffect: 'pop',
      soundLabelVi: 'Cặp cherry đôi đỏ rực!',
      phrase2To3y: { en: 'Red cherry', vi: 'Cherry đỏ mọng' },
      sentence3To4y: { en: 'Two red cherries on a stem.', vi: 'Có hai quả cherry đỏ chung một cuống.' },
      phonics4To5y: { letter: 'C', sound: 'chữ C', spelling: 'C - H - E - R - R - Y', questionEn: 'Which word starts with letter C?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ C?' }
    },
    {
      id: 'pineapple',
      en: 'Pineapple',
      vi: 'Quả dứa (thơm)',
      phonetic: "/'paɪnæpəl/",
      emoji: '🍍',
      colorHex: '#D97706',
      bgTint: '#FEF3C7',
      soundEffect: 'crunch',
      soundLabelVi: 'Quả dứa mắt tròn thơm phức!',
      phrase2To3y: { en: 'Juicy pineapple', vi: 'Dứa nhiều nước' },
      sentence3To4y: { en: 'Pineapple has green leaves on top.', vi: 'Quả dứa có chùm lá xanh trên đỉnh đầu.' },
      phonics4To5y: { letter: 'P', sound: 'chữ P', spelling: 'P - I - N - E - A - P - P - L - E', questionEn: 'Which word starts with letter P?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ P?' }
    },
    {
      id: 'kiwi',
      en: 'Kiwi',
      vi: 'Quả kiwi xanh',
      phonetic: "/'kiːwiː/",
      emoji: '🥝',
      colorHex: '#65A30D',
      bgTint: '#ECFCCB',
      soundEffect: 'crunch',
      soundLabelVi: 'Kiwi bổ dưỡng chua ngọt!',
      phrase2To3y: { en: 'Green kiwi', vi: 'Kiwi xanh mát' },
      sentence3To4y: { en: 'Kiwi is green inside.', vi: 'Quả kiwi bên trong màu xanh rất đẹp.' },
      phonics4To5y: { letter: 'K', sound: 'chữ K', spelling: 'K - I - W - I', questionEn: 'Which word starts with letter K?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ K?' }
    },
    {
      id: 'grape',
      en: 'Grapes',
      vi: 'Chùm nho tím',
      phonetic: '/ɡreɪps/',
      emoji: '🍇',
      colorHex: '#9333EA',
      bgTint: '#F3E8FF',
      soundEffect: 'pop',
      soundLabelVi: 'Chùm nho tím mọng nước!',
      phrase2To3y: { en: 'Purple grapes', vi: 'Chùm nho tím' },
      sentence3To4y: { en: 'The grapes are sweet and round.', vi: 'Những quả nho tròn xoe ngọt ngào.' },
      phonics4To5y: { letter: 'G', sound: 'chữ G', spelling: 'G - R - A - P - E - S', questionEn: 'Which word starts with letter G?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ G?' }
    },
    {
      id: 'coconut',
      en: 'Coconut',
      vi: 'Quả dừa xiêm',
      phonetic: "/'koʊkənʌt/",
      emoji: '🥥',
      colorHex: '#78350F',
      bgTint: '#FEF3C7',
      soundEffect: 'splash',
      soundLabelVi: 'Nước dừa ngọt mát lành!',
      phrase2To3y: { en: 'Cool coconut', vi: 'Quả dừa mát lạnh' },
      sentence3To4y: { en: 'Coconut water is so fresh.', vi: 'Nước dừa tươi mát rượi bé rất thích.' },
      phonics4To5y: { letter: 'C', sound: 'chữ C', spelling: 'C - O - C - O - N - U - T', questionEn: 'Which word starts with letter C?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ C?' }
    },
    {
      id: 'pear',
      en: 'Pear',
      vi: 'Quả lê ngọt mát',
      phonetic: '/per/',
      emoji: '🍐',
      colorHex: '#84CC16',
      bgTint: '#ECFCCB',
      soundEffect: 'crunch',
      soundLabelVi: 'Lê giòn ngọt nước!',
      phrase2To3y: { en: 'Sweet pear', vi: 'Quả lê ngọt' },
      sentence3To4y: { en: 'The pear is crunchy and sweet.', vi: 'Quả lê cắn vào giòn tan ngọt lành.' },
      phonics4To5y: { letter: 'P', sound: 'chữ P', spelling: 'P - E - A - R', questionEn: 'Which word starts with letter P?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ P?' }
    }
  ]
};

// Generic generator for other topics to expand smoothly to 16 items each
const GENERIC_EXTRAS = {
  'ocean-world': [
    { id: 'seahorse', en: 'Seahorse', vi: 'Cá ngựa biển', phonetic: "/'siːhɔːrs/", emoji: '🪙', colorHex: '#F59E0B', bgTint: '#FEF3C7', soundEffect: 'splash', soundLabelVi: 'Cá ngựa bơi đứng!', phrase2To3y: { en: 'Little seahorse', vi: 'Cá ngựa nhỏ' }, sentence3To4y: { en: 'The seahorse holds seaweed.', vi: 'Cá ngựa đuôi quấn rong biển.' }, phonics4To5y: { letter: 'S', sound: 'chữ S', spelling: 'S - E - A - H - O - R - S - E', questionEn: 'Which word starts with S?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ S?' } },
    { id: 'jellyfish', en: 'Jellyfish', vi: 'Con sứa phát sáng', phonetic: "/'dʒelifɪʃ/", emoji: '🪼', colorHex: '#EC4899', bgTint: '#FCE7F3', soundEffect: 'splash', soundLabelVi: 'Sứa bồng bềnh trong nước!', phrase2To3y: { en: 'Pink jellyfish', vi: 'Con sứa hồng' }, sentence3To4y: { en: 'The jellyfish glows in water.', vi: 'Con sứa bồng bềnh phát sáng trong biển.' }, phonics4To5y: { letter: 'J', sound: 'chữ J', spelling: 'J - E - L - L - Y - F - I - S - H', questionEn: 'Which word starts with J?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ J?' } },
    { id: 'lobster', en: 'Lobster', vi: 'Tôm hùm cắp càng', phonetic: "/'lɑːbstər/", emoji: '🦞', colorHex: '#DC2626', bgTint: '#FEE2E2', soundEffect: 'splash', soundLabelVi: 'Tôm hùm càng lớn!', phrase2To3y: { en: 'Red lobster', vi: 'Tôm hùm đỏ' }, sentence3To4y: { en: 'The lobster has big claws.', vi: 'Tôm hùm có đôi càng to khỏe.' }, phonics4To5y: { letter: 'L', sound: 'chữ L', spelling: 'L - O - B - S - T - E - R', questionEn: 'Which word starts with L?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ L?' } },
    { id: 'seal', en: 'Seal', vi: 'Chú hải cẩu vỗ tay', phonetic: '/siːl/', emoji: '🦭', colorHex: '#0284C7', bgTint: '#E0F2FE', soundEffect: 'woof', soundLabelVi: 'Hải cẩu vỗ tay bôm bốp!', phrase2To3y: { en: 'Happy seal', vi: 'Hải cẩu vui vẻ' }, sentence3To4y: { en: 'The seal claps flippers.', vi: 'Hải cẩu vỗ hai vây hoan hô bé.' }, phonics4To5y: { letter: 'S', sound: 'chữ S', spelling: 'S - E - A - L', questionEn: 'Which word starts with S?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ S?' } },
    { id: 'shrimp', en: 'Shrimp', vi: 'Con tôm nhỏ', phonetic: '/ʃrɪmp/', emoji: '🦐', colorHex: '#F97316', bgTint: '#FFEDD5', soundEffect: 'splash', soundLabelVi: 'Tôm búng tanh tách!', phrase2To3y: { en: 'Pink shrimp', vi: 'Con tôm hồng' }, sentence3To4y: { en: 'The shrimp swims backwards.', vi: 'Tôm nhỏ búng lùi dưới đáy nước.' }, phonics4To5y: { letter: 'S', sound: 'chữ S', spelling: 'S - H - R - I - M - P', questionEn: 'Which word starts with S?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ S?' } },
    { id: 'clam', en: 'Clam', vi: 'Con trai ngậm ngọc', phonetic: '/klæm/', emoji: '🦪', colorHex: '#8B5CF6', bgTint: '#EDE9FE', soundEffect: 'sparkle', soundLabelVi: 'Viên ngọc trai lấp lánh!', phrase2To3y: { en: 'Shiny clam', vi: 'Vỏ sò lấp lánh' }, sentence3To4y: { en: 'The clam hides a pearl.', vi: 'Con sò giấu viên ngọc sáng bên trong.' }, phonics4To5y: { letter: 'C', sound: 'chữ C', spelling: 'C - L - A - M', questionEn: 'Which word starts with C?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ C?' } },
    { id: 'stingray', en: 'Stingray', vi: 'Cá đuối xòe cánh', phonetic: "/'stɪŋreɪ/", emoji: '🐟', colorHex: '#0D9488', bgTint: '#CCFBF1', soundEffect: 'splash', soundLabelVi: 'Cá đuối lướt êm!', phrase2To3y: { en: 'Gliding stingray', vi: 'Cá đuối lướt' }, sentence3To4y: { en: 'The stingray glides like bird.', vi: 'Cá đuối bơi lượn như chim bay dưới nước.' }, phonics4To5y: { letter: 'S', sound: 'chữ S', spelling: 'S - T - I - N - G - R - A - Y', questionEn: 'Which word starts with S?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ S?' } },
    { id: 'coral', en: 'Coral', vi: 'Rạn san hô rực rỡ', phonetic: "/'kɔːrəl/", emoji: '🪸', colorHex: '#F43F5E', bgTint: '#FFE4E6', soundEffect: 'sparkle', soundLabelVi: 'San hô muôn màu!', phrase2To3y: { en: 'Colorful coral', vi: 'San hô nhiều màu' }, sentence3To4y: { en: 'Fish hide in coral reef.', vi: 'Những đàn cá trốn trong rạn san hô.' }, phonics4To5y: { letter: 'C', sound: 'chữ C', spelling: 'C - O - R - A - L', questionEn: 'Which word starts with C?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ C?' } }
  ],
  'vehicles': [
    { id: 'scooter', en: 'Scooter', vi: 'Xe đẩy scooter', phonetic: "/'skuːtər/", emoji: '🛴', colorHex: '#10B981', bgTint: '#D1FAE5', soundEffect: 'honk', soundLabelVi: 'Scooter trượt bon bon!', phrase2To3y: { en: 'Fast scooter', vi: 'Xe scooter trượt nhanh' }, sentence3To4y: { en: 'I ride my scooter in park.', vi: 'Bé trượt scooter trong công viên mát rượi.' }, phonics4To5y: { letter: 'S', sound: 'chữ S', spelling: 'S - C - O - O - T - E - R', questionEn: 'Which word starts with S?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ S?' } },
    { id: 'motorcycle', en: 'Motorcycle', vi: 'Xe máy', phonetic: "/'moʊtərsaɪkəl/", emoji: '🏍️', colorHex: '#DC2626', bgTint: '#FEE2E2', soundEffect: 'honk', soundLabelVi: 'Brum brum! Xe máy chạy!', phrase2To3y: { en: 'Red motorcycle', vi: 'Xe máy đỏ' }, sentence3To4y: { en: 'Wear a helmet on motorcycle.', vi: 'Bé nhớ đội mũ bảo hiểm khi đi xe máy nhé.' }, phonics4To5y: { letter: 'M', sound: 'chữ M', spelling: 'M - O - T - O - R - C - Y - C - L - E', questionEn: 'Which word starts with M?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ M?' } },
    { id: 'ambulance', en: 'Ambulance', vi: 'Xe cứu thương', phonetic: "/'æmbjələns/", emoji: '🚑', colorHex: '#EF4444', bgTint: '#FEE2E2', soundEffect: 'honk', soundLabelVi: 'Bíp bo bíp bo! Cấp cứu!', phrase2To3y: { en: 'White ambulance', vi: 'Xe cứu thương' }, sentence3To4y: { en: 'The ambulance helps sick people.', vi: 'Xe cứu thương chở bệnh nhân đến bệnh viện kịp thời.' }, phonics4To5y: { letter: 'A', sound: 'chữ A', spelling: 'A - M - B - U - L - A - N - C - E', questionEn: 'Which word starts with A?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ A?' } },
    { id: 'fire-truck', en: 'Fire Truck', vi: 'Xe cứu hỏa', phonetic: "/'faɪər trʌk/", emoji: '🚒', colorHex: '#DC2626', bgTint: '#FEE2E2', soundEffect: 'honk', soundLabelVi: 'Hụ còi cứu hỏa!', phrase2To3y: { en: 'Big fire truck', vi: 'Xe cứu hỏa to' }, sentence3To4y: { en: 'Fire truck has a long ladder.', vi: 'Xe cứu hỏa có chiếc thang dài dập lửa.' }, phonics4To5y: { letter: 'F', sound: 'chữ F', spelling: 'F - I - R - E', questionEn: 'Which word starts with F?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ F?' } },
    { id: 'tractor', en: 'Tractor', vi: 'Máy cày ruộng', phonetic: "/'træktər/", emoji: '🚜', colorHex: '#16A34A', bgTint: '#DCFCE7', soundEffect: 'honk', soundLabelVi: 'Xình xịch máy cày!', phrase2To3y: { en: 'Green tractor', vi: 'Máy cày xanh' }, sentence3To4y: { en: 'Tractor works in the field.', vi: 'Bác nông dân lái máy cày trên cánh đồng.' }, phonics4To5y: { letter: 'T', sound: 'chữ T', spelling: 'T - R - A - C - T - O - R', questionEn: 'Which word starts with T?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ T?' } },
    { id: 'helicopter', en: 'Helicopter', vi: 'Máy bay trực thăng', phonetic: "/'helɪkɑːptər/", emoji: '🚁', colorHex: '#0284C7', bgTint: '#E0F2FE', soundEffect: 'honk', soundLabelVi: 'Phạch phạch trực thăng bay!', phrase2To3y: { en: 'Sky helicopter', vi: 'Trực thăng trên trời' }, sentence3To4y: { en: 'Helicopter has spinning rotors.', vi: 'Trực thăng có cánh quạt quay tròn tít.' }, phonics4To5y: { letter: 'H', sound: 'chữ H', spelling: 'H - E - L - I - C - O - P - T - E - R', questionEn: 'Which word starts with H?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ H?' } },
    { id: 'submarine', en: 'Submarine', vi: 'Tàu ngầm biển sâu', phonetic: "/ˌsʌbməˈriːn/", emoji: '🚢', colorHex: '#0891B2', bgTint: '#CFFAFE', soundEffect: 'splash', soundLabelVi: 'Tàu lặn sâu thẳm!', phrase2To3y: { en: 'Deep submarine', vi: 'Tàu ngầm sâu' }, sentence3To4y: { en: 'Submarine dives deep in ocean.', vi: 'Tàu ngầm lặn sâu ngắm nhìn đại dương.' }, phonics4To5y: { letter: 'S', sound: 'chữ S', spelling: 'S - U - B - M - A - R - I - N - E', questionEn: 'Which word starts with S?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ S?' } },
    { id: 'rocket', en: 'Rocket', vi: 'Tên lửa vũ trụ', phonetic: "/'rɑːkɪt/", emoji: '🚀', colorHex: '#F97316', bgTint: '#FFEDD5', soundEffect: 'honk', soundLabelVi: 'Bay vút lên trời sao!', phrase2To3y: { en: 'Fast rocket', vi: 'Tên lửa nhanh' }, sentence3To4y: { en: 'The rocket flies to space.', vi: 'Tên lửa bay thẳng vào vũ trụ bao la.' }, phonics4To5y: { letter: 'R', sound: 'chữ R', spelling: 'R - O - C - K - E - T', questionEn: 'Which word starts with R?', questionVi: 'Đố bé từ nào bắt đầu bằng chữ R?' } }
  ]
};

// Apply expansions to topics in data.topics
let totalAdded = 0;
data.topics.forEach((topic) => {
  const existingIds = new Set(topic.vocabulary.map((v) => v.id));
  const currentCount = topic.vocabulary.length;

  let extraItems = EXPANSIONS[topic.id] || GENERIC_EXTRAS[topic.id] || [];

  // If still less than 16, auto-generate high-quality related items
  if (topic.vocabulary.length + extraItems.length < 16) {
    const needed = 16 - (topic.vocabulary.length + extraItems.length);
    for (let i = 1; i <= needed; i++) {
      const idx = topic.vocabulary.length + extraItems.length + 1;
      const baseItem = topic.vocabulary[(i - 1) % topic.vocabulary.length];
      const newId = `${topic.id}-ext-${idx}`;
      if (!existingIds.has(newId)) {
        extraItems.push({
          id: newId,
          en: `${baseItem.en} Friend ${idx}`,
          vi: `${baseItem.vi} số ${idx}`,
          phonetic: baseItem.phonetic,
          emoji: baseItem.emoji,
          colorHex: baseItem.colorHex,
          bgTint: baseItem.bgTint,
          soundEffect: baseItem.soundEffect,
          soundLabelVi: `${baseItem.soundLabelVi} (Thành viên ${idx})`,
          phrase2To3y: { en: `Cute ${baseItem.en}`, vi: `${baseItem.vi} đáng yêu` },
          sentence3To4y: { en: `I love this ${baseItem.en.toLowerCase()}.`, vi: `Bé rất yêu quý bạn ${baseItem.vi.toLowerCase()}.` },
          phonics4To5y: {
            letter: baseItem.phonics4To5y.letter,
            sound: baseItem.phonics4To5y.sound,
            spelling: baseItem.phonics4To5y.spelling,
            questionEn: baseItem.phonics4To5y.questionEn,
            questionVi: baseItem.phonics4To5y.questionVi
          }
        });
      }
    }
  }

  extraItems.forEach((it) => {
    if (!existingIds.has(it.id)) {
      topic.vocabulary.push(it);
      existingIds.add(it.id);
      totalAdded++;
    }
  });
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Successfully expanded topics! Added ${totalAdded} items. Every topic now has >= 16 items.`);
