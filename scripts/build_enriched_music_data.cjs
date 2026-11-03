const fs = require('fs');
const path = require('path');

// 1. Translations dictionary for Vietnamese songs (to English) and English songs (to Vietnamese)
const TRANSLATIONS = {
  // Vietnamese songs -> English
  'chau-len-ba': [
    "I'm three years old, I go to kindergarten",
    "Teacher loves me because I don't cry",
    "I don't cry so mother can grow fruit trees",
    "Father works in the factory, grandparents happily farm",
    "La la la, la la la la!"
  ],
  'rua-mat-nhu-meo': [
    "Meow meow meow, washing face like a kitten",
    "Not very clean, mother will not praise",
    "Where is your clean towel instead of licking paws",
    "Sore eyes will make kitten cry meow meow!"
  ],
  'di-hoc': [
    "Yesterday mother guided my steps to school",
    "Today mother goes to the terrace field",
    "All by myself I walk to the classroom",
    "Walking briskly along the winding trail",
    "Gentle morning stream whispers in the forest",
    "Palm trees shade the sunny path to school"
  ],
  'truong-chung-chau-la-truong-mam-non': [
    "Who is asking where is my preschool?",
    "Come here and visit, our school is so lovely",
    "Lots of pretty toys and kind teacher",
    "Our school is a cheerful kindergarten!"
  ],
  'con-co-be-be': [
    "Little white egret perched on the bamboo branch",
    "Where are you going without asking your mother?",
    "Now that I ask, mother loves me so much",
    "Going out I say hello, coming back I say hello!"
  ],
  'ca-nha-thuong-nhau': [
    "Daddy loves baby because baby looks like mommy",
    "Mommy loves baby because baby looks like daddy",
    "Our whole happy family loves one another",
    "When apart we miss, when together we smile!"
  ],
  'chau-yeu-ba': [
    "Dear grandma, I love you so much",
    "Your hair is pure white like fluffy clouds",
    "I love you and gently hold your hand",
    "When I listen obediently, I know you are joyful!"
  ],
  'mot-con-vit': [
    "One little duckling spreads out two wings",
    "Quacking loudly: Quack quack quack!",
    "Seeing the blue pond, it splashes playfully",
    "Stepping ashore, it flaps wings dry in the sun!"
  ],
  'ca-vang-boi': [
    "Two little goldfish swim in a crystal tank",
    "Dancing up and down so graceful and quick",
    "Two goldfish swim so swiftly",
    "Catching pesky bugs to keep the water clean!"
  ],
  'kia-con-buom-vang': [
    "Look at the lovely yellow butterfly",
    "Spreading out two bright colorful wings",
    "Flying round and round in the fresh air",
    "Flapping wings, flapping wings in the breeze!"
  ],
  'ba-ngon-nen-lung-linh': [
    "Yellow candle represents strong father",
    "Pink candle represents gentle mother",
    "Blue candle represents cheerful baby",
    "Three bright candles light up a happy home!"
  ],
  'bo-la-tat-ca': [
    "Daddy is a train engine chugging ahead",
    "Daddy is a sturdy horse giving me rides",
    "Daddy is a ship sailing across oceans",
    "Daddy is the whole world of wonder for me!"
  ],
  'co-va-me': [
    "At home, mommy is also like a teacher",
    "At school, teacher is just like a sweet mommy",
    "Teacher and mommy are two gentle mothers",
    "Mommy and teacher are two radiant smiles!"
  ],
  'con-heo-dat': [
    "Mom bought for me a cute ceramic piggy bank",
    "Feeding it small coins each happy day",
    "Piggy does not eat bran, piggy only saves",
    "Helping me learn to save for school supplies!"
  ],
  'chu-ech-con': [
    "Little frog sitting on a green lotus leaf",
    "Big round eyes reading his morning lesson",
    "Two little birds singing on the tree branch",
    "Praising the diligent little froggy scholar!"
  ],
  'dan-ga-con': [
    "Look at the yellow chicks in the sunny garden",
    "Feathers fluffy like warm golden balls",
    "Pecking tiny seeds with mother hen",
    "Chirping happily: Cheep cheep cheep!"
  ],
  'chu-voi-con-o-ban-don': [
    "Baby elephant living in Ban Don village",
    "Still so little without any ivory yet",
    "Eating sweet bananas and splashing by the stream",
    "Growing big and strong to help our village!"
  ],
  'bac-kim-thang': [
    "Bac kim thang balancing on the wooden stile",
    "Spur-of-the-moment folk rhyme game",
    "Singing together in rhythm and clapping",
    "Joyful laughter across the playground!"
  ],
  'ngay-dau-tien-di-hoc': [
    "The very first day going to school",
    "Mother held my hand, I cried softly",
    "Teacher caressed my head comforting me",
    "Now grown up, I fondly remember that gentle day!"
  ],
  'em-di-mau-giao': [
    "Sunny morning birds chirp in the branches",
    "I put on my backpack and walk to class",
    "Teacher welcomes me with open loving arms",
    "Preschool is my joyful second home!"
  ],
  'em-yeu-truong-em': [
    "I love my school with all my good friends",
    "And kind teachers loving like mother",
    "Like thousands of flowers in sunny spring",
    "Our school is filled with knowledge and joy!"
  ],
  'tam-biet-bup-be': [
    "Goodbye lovely doll, goodbye cute teddy bear",
    "Goodbye yellow birdie, now I enter grade one",
    "I will remember my dear kindergarten school",
    "Carrying sweet memories into grade one!"
  ],
  'tap-the-duc-buoi-sang': [
    "One two three, breathe in fresh morning air",
    "Hands up high, stretch wide to both sides",
    "Hands on waist, jump merrily in place",
    "Healthy exercise makes body strong and alert!"
  ],
  'chiec-den-ong-sao': [
    "Star lantern with five colorful glowing points",
    "Holding lantern high on Mid-Autumn night",
    "Tung rinh rinh, drums beat under full moon",
    "Children singing and dancing under bright moonlight!"
  ],
  'trai-dat-nay-la-cua-chung-minh': [
    "This earth belongs to all of us children",
    "Golden fruit of peace, shining sun of hope",
    "White doves flying across the blue sky",
    "Singing for a peaceful and loving world!"
  ],
  'hong-dam-dau': [
    "Friends call me out to play and skip study",
    "I say no way, learning comes first today",
    "Doing all my homework before going out to play",
    "Diligent child earns high marks and praise!"
  ],

  // English songs -> Vietnamese
  'abc-alphabet-song': [
    "A B C D E F G",
    "H I J K L M N O P",
    "Q R S, T U V",
    "W X, Y and Z",
    "Bây giờ bé đã thuộc bài ca bảng chữ cái",
    "Lần tới bạn có muốn cùng hát với bé không?"
  ],
  'twinkle-twinkle-little-star': [
    "Ngôi sao nhỏ lấp lánh trên bầu trời đêm",
    "Bé tự hỏi bạn là điều kỳ diệu phương nào",
    "Tít trên cao vút trên thế gian này",
    "Giống như viên kim cương sáng rực trên bầu trời!"
  ],
  'old-macdonald-had-a-farm': [
    "Bác MacDonald có một trang trại vui vẻ, E-I-E-I-O",
    "Và trên nông trại bác nuôi những chú bò sữa, E-I-E-I-O",
    "Với tiếng kêu: Ùm bò nơi đây, ùm bò nơi đó",
    "Nông trại của bác MacDonald thật rộn ràng!"
  ],
  'the-wheels-on-the-bus': [
    "Những bánh xe buýt cứ xoay tròn xoay tròn",
    "Xoay tròn suốt cả ngày trên khắp nẻo đường",
    "Cần gạt nước kêu vun vút, vun vút, vun vút",
    "Tiếng còi xe kêu: Bim bim bim cho bé tới trường!"
  ],
  'baa-baa-black-sheep': [
    "Cừu đen ơi cừu có cuộn len nào không?",
    "Dạ có chứ, cháu có tận ba túi len đầy",
    "Một túi cho ông chủ, một túi cho bà chủ",
    "Và một túi cho em bé ngoan sống ở cuối đường!"
  ],
  'if-youre-happy-and-you-know-it': [
    "Nếu bạn thấy vui vẻ và hạnh phúc, hãy vỗ tay nhé!",
    "Nếu bạn thấy vui vẻ và hạnh phúc, hãy vỗ tay nhé!",
    "Nếu bạn vui vẻ và muốn lan tỏa điều đó",
    "Hãy cùng vỗ tay thật to nào bạn ơi!"
  ],
  'row-row-row-your-boat': [
    "Chèo chèo chèo con thuyền nhỏ xuôi dòng êm ả",
    "Thật nhẹ nhàng, thật dịu dàng, cuộc đời tựa giấc mơ",
    "Chèo chèo chèo con thuyền nhỏ ngắm nhìn dòng suối",
    "Nếu gặp chú cá sấu, đừng quên mỉm cười chào bạn nhé!"
  ],
  'head-shoulders-knees-and-toes': [
    "Đầu, vai, đầu gối và ngón chân",
    "Đầu gối và ngón chân!",
    "Mắt, tai, miệng và mũi nhỏ xinh",
    "Đầu, vai, đầu gối và ngón chân xinh xắn!"
  ],
  'five-little-monkeys': [
    "Năm chú khỉ con nhảy nhót tung tăng trên giường",
    "Một chú bị trượt chân ngã u đầu xuống sàn",
    "Mẹ liền gọi bác sĩ, bác sĩ dặn ngay:",
    "Không được nhảy nhót trên giường nữa nhé khỉ con!"
  ],
  'baby-shark': [
    "Cá mập con, đu đu đu đu đu",
    "Cá mập mẹ, đu đu đu đu đu",
    "Cá mập bố, đu đu đu đu đu",
    "Cùng bơi lội dưới đại dương xanh bao la!"
  ],
  'bingo-dog-song': [
    "Có một bác nông dân nuôi một chú cún đáng yêu",
    "Và Bingo là tên của chú cún ấy",
    "B-I-N-G-O! B-I-N-G-O! B-I-N-G-O!",
    "Và Bingo là tên của chú cún con!"
  ],
  'mary-had-a-little-lamb': [
    "Mary có một chú cừu nhỏ lông trắng như tuyết",
    "Lông của chú cừu trắng muốt như những đám mây",
    "Và bất cứ nơi đâu cô bé Mary đi tới",
    "Chú cừu nhỏ cũng lon ton bước theo sau!"
  ],
  'rain-rain-go-away': [
    "Mưa ơi mưa ơi hãy bay đi nơi khác nhé",
    "Hãy quay lại vào một ngày khác nha mưa",
    "Em bé nhỏ muốn chạy ra ngoài sân vui chơi",
    "Mưa ơi hãy tạnh đi để trời trong xanh nào!"
  ],
  'hickory-dickory-dock': [
    "Tích tắc tích tắc, chiếc đồng hồ gõ nhịp",
    "Chú chuột nhắt chạy nhanh lên đỉnh đồng hồ",
    "Đồng hồ điểm một giờ: Bính boong!",
    "Chú chuột liền chạy tuột xuống dưới!"
  ],
  'you-are-my-sunshine': [
    "Bé là ánh mặt trời rực rỡ duy nhất của mẹ",
    "Bé làm cho mẹ hạnh phúc cả khi trời u ám",
    "Bé yêu sẽ không bao giờ biết mẹ yêu bé chừng nào đâu",
    "Xin đừng mang ánh mặt trời ấm áp của mẹ đi nhé!"
  ],
  'three-little-kittens': [
    "Ba chú mèo con tinh nghịch làm mất đôi găng tay",
    "Và chúng bắt đầu òa khóc meo meo",
    "Ôi mẹ ơi mẹ, chúng con làm mất găng tay rồi",
    "Các chú mèo ngoan tìm lại được găng tay và mẹ mỉm cười!"
  ],
  'pop-goes-the-weasel': [
    "Xoay tròn chiếc hộp nhạc theo điệu nhạc ngân nga",
    "Khỉ con đuổi theo chú chồn nhỏ quanh bụi dâu",
    "Khỉ con nghĩ trò chơi thật là vui nhộn",
    "Bật tung nắp hộp: Bính boong chú chồn nhảy ra!"
  ],
  'hot-cross-buns': [
    "Bánh nướng chữ thập thơm lừng, bánh nướng thơm lừng!",
    "Một đồng một chiếc, hai đồng một chiếc",
    "Nếu bạn không có con gái thì hãy mua cho con trai",
    "Bánh nướng chữ thập thơm ngon nóng hổi vừa ra lò!"
  ]
};

// Concise funFact (max 15 words)
const FUN_FACTS_CONCISE = {
  'chau-len-ba': 'Bé ba tuổi tự tin, vui tươi đi mẫu giáo ngoan không khóc nhè.',
  'rua-mat-nhu-meo': 'Rửa mặt bằng khăn sạch mỗi sớm giúp bé tươi vui, mắt sáng.',
  'di-hoc': 'Đường tới lớp rợp bóng cọ nâng bước chân bé tự lập, yêu trường.',
  'truong-chung-chau-la-truong-mam-non': 'Trường mầm non rực rỡ tiếng cười của bạn bè và cô giáo hiền.',
  'con-co-be-be': 'Bé ngoan luôn lễ phép chào hỏi người lớn khi đi và về.',
  'ca-nha-thuong-nhau': 'Tình cảm gia đình ấm áp, cả nhà luôn sẻ chia yêu thương.',
  'chau-yeu-ba': 'Lòng hiếu thảo, cử chỉ âu yếm bé dành cho người bà tóc bạc.',
  'mot-con-vit': 'Chú vịt vàng tinh nghịch xòe cánh bơi lội trong làn nước trong.',
  'ca-vang-boi': 'Đàn cá vàng tung tăng bơi lội bắt bọ gậy giữ sạch nước.',
  'kia-con-buom-vang': 'Đôi bướm vàng rực rỡ chao liệng đón gió xuân rộn ràng.',
  'ba-ngon-nen-lung-linh': 'Ba ngọn nến tượng trưng cho ngọn lửa yêu thương gia đình.',
  'bo-la-tat-ca': 'Người cha luôn là điểm tựa chở che vững chãi cho con.',
  'co-va-me': 'Cô giáo và người mẹ là hai vầng sáng dịu hiền bên con.',
  'con-heo-dat': 'Thói quen tiết kiệm tiền lẻ nuôi heo đất giúp bé tự lập.',
  'chu-ech-con': 'Chú ếch con chăm ngoan ngồi học bài bên bờ ao xanh.',
  'dan-ga-con': 'Đàn gà con lông vàng óng ả theo mẹ kiếm mồi vui vẻ.',
  'chu-voi-con-o-ban-don': 'Chú voi con Tây Nguyên ngộ nghĩnh, hiền lành được buôn làng yêu quý.',
  'bac-kim-thang': 'Giai điệu dân ca đồng dao Nam Bộ rộn ràng tiếng vỗ tay.',
  'ngay-dau-tien-di-hoc': 'Kỷ niệm ngày đầu vào lớp bỡ ngỡ nhưng đầy ắp tình thương.',
  'em-di-mau-giao': 'Bước chân rộn rã tới lớp mầm non đón chào ngày học mới.',
  'em-yeu-truong-em': 'Mái trường thân thương nơi lưu giữ bạn bè và ngàn bài học hay.',
  'tam-biet-bup-be': 'Lời tạm biệt trường mầm non bước vào lớp một tự tin, chững chạc.',
  'tap-the-duc-buoi-sang': 'Thể dục buổi sáng rèn luyện thể chất dẻo dai cho bé khỏe mạnh.',
  'chiec-den-ong-sao': 'Đêm rằm Trung thu lung linh ánh sao cùng bạn bè rước đèn.',
  'trai-dat-nay-la-cua-chung-minh': 'Khát vọng hòa bình, tình hữu nghị giữa trẻ em trên toàn thế giới.',
  'hong-dam-dau': 'Bé chăm chỉ học bài đầy đủ trước khi cùng bạn ra chơi.',
  'abc-alphabet-song': 'Bài ca kinh điển giúp bé ghi nhớ trọn vẹn 26 chữ cái.',
  'twinkle-twinkle-little-star': 'Ngôi sao nhỏ soi sáng màn đêm khơi gợi trí tò mò của bé.',
  'old-macdonald-had-a-farm': 'Làm quen tên gọi và tiếng kêu các loài động vật nông trại.',
  'the-wheels-on-the-bus': 'Nhịp điệu sôi động mô phỏng chuyến xe buýt vui vẻ đến trường.',
  'baa-baa-black-sheep': 'Bài học chia sẻ len ấm áp cho mọi người xung quanh.',
  'if-youre-happy-and-you-know-it': 'Khích lệ bé bộc lộ cảm xúc vui tươi bằng cử chỉ tay chân.',
  'row-row-row-your-boat': 'Giai điệu êm đềm dạy bé vượt qua dòng nước nhẹ nhàng.',
  'head-shoulders-knees-and-toes': 'Vừa hát vừa chạm đúng bộ phận cơ thể để tăng phản xạ.',
  'five-little-monkeys': 'Dạy bé đếm lùi số lượng và nhắc nhở an toàn khi chơi.',
  'baby-shark': 'Vũ điệu cá mập sôi động cả nhà cùng nhún nhảy theo nhịp.',
  'bingo-dog-song': 'Học đánh vần từng chữ cái vui nhộn cùng chú cún Bingo.',
  'mary-had-a-little-lamb': 'Tình bạn gắn bó thân thiết giữa cô bé Mary và chú cừu.',
  'rain-rain-go-away': 'Lời ước ngày nắng ấm để bé được ra sân chơi đùa.',
  'hickory-dickory-dock': 'Làm quen với mặt đồng hồ và nhịp tích tắc thời gian.',
  'you-are-my-sunshine': 'Bày tỏ tình thương yêu vô bờ bến cha mẹ dành cho con.',
  'three-little-kittens': 'Ba chú mèo con biết nhận lỗi và tìm lại găng tay.',
  'pop-goes-the-weasel': 'Trò chơi hộp nhạc bất ngờ mang lại tiếng cười sảng khoái.',
  'hot-cross-buns': 'Giai điệu đồng dao về món bánh nướng thơm lừng truyền thống.'
};

const INSTRUMENTAL_ONLY_IDS = [
  'di-hoc',
  'ngay-dau-tien-di-hoc',
  'em-yeu-truong-em',
  'chiec-den-ong-sao'
];

console.log('Building enriched kids music data...');
// We will transpile and import the existing data, then re-emit TypeScript cleanly
const source = fs.readFileSync('src/data/kidsMusicData.ts', 'utf8');

// Read list of local audio files in public/assets/music
const localAudioFiles = new Set(
  fs.readdirSync('public/assets/music').filter(f => f.endsWith('.mp3') || f.endsWith('.ogg'))
);
console.log('Local audio files count:', localAudioFiles.size);

// We need to parse the songs array. Let us use a Node VM context or ts-node/tsx to evaluate the existing file
const { execSync } = require('child_process');
const songObjectsRaw = execSync('npx tsx -e "import { KIDS_SONGS_DATA } from \'./src/data/kidsMusicData\'; console.log(JSON.stringify(KIDS_SONGS_DATA));"', { maxBuffer: 10 * 1024 * 1024 }).toString();

const rawSongs = JSON.parse(songObjectsRaw);
console.log(`Evaluated ${rawSongs.length} songs from source.`);

const enrichedSongs = rawSongs.map((song) => {
  const isVocal = !INSTRUMENTAL_ONLY_IDS.includes(song.id);
  const coverPath = `/assets/music/covers/music_cover_${song.id}.webp`;

  // Local audio check
  let finalAudioUrl = undefined;
  if (isVocal) {
    if (localAudioFiles.has(`${song.id}.mp3`)) {
      finalAudioUrl = `/assets/music/${song.id}.mp3`;
    } else if (localAudioFiles.has(`${song.id}.ogg`)) {
      finalAudioUrl = `/assets/music/${song.id}.ogg`;
    } else {
      finalAudioUrl = song.audioUrl;
    }
  }

  // Construct timed lyrics
  let timedLyrics = [];
  if (isVocal && song.lyrics && song.lyrics.length > 0) {
    const translations = TRANSLATIONS[song.id] || [];
    // Average line timing based on song tempo
    const introOffset = 8.0; // average 8 seconds intro
    const lineDuration = Math.max(3.0, Math.min(6.5, (60 / (song.tempo || 100)) * 4));
    
    // First pass of lyrics
    song.lyrics.forEach((lineText, idx) => {
      const startTime = parseFloat((introOffset + idx * lineDuration).toFixed(2));
      const endTime = parseFloat((startTime + lineDuration - 0.2).toFixed(2));
      timedLyrics.push({
        startTimeSec: startTime,
        endTimeSec: endTime,
        text: lineText,
        translation: translations[idx] || undefined,
      });
    });

    // If song is long (> 90s), add second verse repetition with interlude
    const estimatedDur = 120; // 2 minutes
    const interludeStart = introOffset + song.lyrics.length * lineDuration + 8.0;
    if (interludeStart + song.lyrics.length * lineDuration <= estimatedDur) {
      song.lyrics.forEach((lineText, idx) => {
        const startTime = parseFloat((interludeStart + idx * lineDuration).toFixed(2));
        const endTime = parseFloat((startTime + lineDuration - 0.2).toFixed(2));
        timedLyrics.push({
          startTimeSec: startTime,
          endTimeSec: endTime,
          text: lineText,
          translation: translations[idx] || undefined,
        });
      });
    }
  }

  return {
    ...song,
    cover: coverPath,
    isVocalTrack: isVocal,
    funFactVi: FUN_FACTS_CONCISE[song.id] || song.funFactVi,
    audioUrl: finalAudioUrl,
    timedLyrics,
    englishTranslation: TRANSLATIONS[song.id] || song.englishTranslation
  };
});

// Output formatted TypeScript file
const tsHeader = `export interface TimedLyricLine {
  startTimeSec: number;
  endTimeSec?: number;
  text: string;
  translation?: string;
}

export interface KidsSong {
  id: string;
  title: string;
  subtitleEn?: string;
  category: 'vi_3y' | 'vi_4y' | 'vi_5y' | 'en_rhymes';
  categoryLabelVi: string;
  ageBadge: string;
  composer: string; // Tác giả / Nhạc và lời
  emoji: string;
  cover?: string; // Ảnh đại diện 256x256 WebP < 15KB
  colorHex: string;
  bgGradient: string;
  tempo: number; // BPM
  melodyStyle: 'cheerful' | 'gentle' | 'playful' | 'lullaby';
  lyrics: string[];
  timedLyrics?: TimedLyricLine[];
  englishTranslation?: string[];
  funFactVi: string;
  audioUrl?: string; // Bản thu âm thật có lời (nén mono 64kbps MP3)
  melodyNotes?: { note: string; dur: number }[]; // Note frequency representation for Web Audio player
  isVocalTrack?: boolean; // true: Ca sĩ hát, false: Nghe giai điệu
}

export const KIDS_SONGS_DATA: KidsSong[] = ${JSON.stringify(enrichedSongs, null, 2)};
`;

fs.writeFileSync('src/data/kidsMusicData.ts', tsHeader, 'utf8');
console.log('Successfully wrote enriched src/data/kidsMusicData.ts!');
