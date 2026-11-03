export interface TimedLyricLine {
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

export const KIDS_SONGS_DATA: KidsSong[] = [
  {
    "id": "chau-len-ba",
    "title": "Cháu lên ba",
    "subtitleEn": "I'm Three Years Old",
    "category": "vi_3y",
    "categoryLabelVi": "Lớp 3 tuổi · Chăm sóc bản thân & Đi học",
    "ageBadge": "3 tuổi",
    "composer": "Nhạc & lời: Phạm Minh Tuấn",
    "emoji": "🎒",
    "colorHex": "#3B82F6",
    "bgGradient": "from-blue-500 to-indigo-600",
    "tempo": 108,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Cháu lên ba cháu đi mẫu giáo",
      "Cô thương cháu vì cháu không khóc nhè",
      "Không khóc nhè để mẹ trồng cây trái",
      "Ba vào nhà máy ông bà vui cấy cày",
      "La la la, là la la la!"
    ],
    "funFactVi": "Bé ba tuổi tự tin, vui tươi đi mẫu giáo ngoan không khóc nhè.",
    "audioUrl": "/assets/music/chau-len-ba.mp3",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.6
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.8
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_chau-len-ba.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Cháu lên ba cháu đi mẫu giáo",
        "translation": "I'm three years old, I go to kindergarten"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Cô thương cháu vì cháu không khóc nhè",
        "translation": "Teacher loves me because I don't cry"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Không khóc nhè để mẹ trồng cây trái",
        "translation": "I don't cry so mother can grow fruit trees"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Ba vào nhà máy ông bà vui cấy cày",
        "translation": "Father works in the factory, grandparents happily farm"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "La la la, là la la la!",
        "translation": "La la la, la la la la!"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Cháu lên ba cháu đi mẫu giáo",
        "translation": "I'm three years old, I go to kindergarten"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Cô thương cháu vì cháu không khóc nhè",
        "translation": "Teacher loves me because I don't cry"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Không khóc nhè để mẹ trồng cây trái",
        "translation": "I don't cry so mother can grow fruit trees"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Ba vào nhà máy ông bà vui cấy cày",
        "translation": "Father works in the factory, grandparents happily farm"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "La la la, là la la la!",
        "translation": "La la la, la la la la!"
      }
    ],
    "englishTranslation": [
      "I'm three years old, I go to kindergarten",
      "Teacher loves me because I don't cry",
      "I don't cry so mother can grow fruit trees",
      "Father works in the factory, grandparents happily farm",
      "La la la, la la la la!"
    ]
  },
  {
    "id": "rua-mat-nhu-meo",
    "title": "Rửa mặt như mèo",
    "subtitleEn": "Wash Face Like a Kitty",
    "category": "vi_3y",
    "categoryLabelVi": "Lớp 3 tuổi · Vệ sinh cá nhân",
    "ageBadge": "3 tuổi",
    "composer": "Nhạc & lời: Hàn Ngọc Bích",
    "emoji": "🐱",
    "colorHex": "#EC4899",
    "bgGradient": "from-pink-500 to-rose-600",
    "tempo": 112,
    "melodyStyle": "playful",
    "lyrics": [
      "Meo meo meo, rửa mặt như mèo",
      "Sâu sâu lắm chẳng được mẹ yêu",
      "Khăn mặt đâu mà ngồi liếm mép",
      "Đau mắt rồi lại khóc meo meo!"
    ],
    "funFactVi": "Rửa mặt bằng khăn sạch mỗi sớm giúp bé tươi vui, mắt sáng.",
    "audioUrl": "/assets/music/rua-mat-nhu-meo.mp3",
    "melodyNotes": [
      {
        "note": "E4",
        "dur": 0.3
      },
      {
        "note": "E4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.8
      },
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_rua-mat-nhu-meo.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Meo meo meo, rửa mặt như mèo",
        "translation": "Meow meow meow, washing face like a kitten"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Sâu sâu lắm chẳng được mẹ yêu",
        "translation": "Not very clean, mother will not praise"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Khăn mặt đâu mà ngồi liếm mép",
        "translation": "Where is your clean towel instead of licking paws"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Đau mắt rồi lại khóc meo meo!",
        "translation": "Sore eyes will make kitten cry meow meow!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Meo meo meo, rửa mặt như mèo",
        "translation": "Meow meow meow, washing face like a kitten"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Sâu sâu lắm chẳng được mẹ yêu",
        "translation": "Not very clean, mother will not praise"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Khăn mặt đâu mà ngồi liếm mép",
        "translation": "Where is your clean towel instead of licking paws"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Đau mắt rồi lại khóc meo meo!",
        "translation": "Sore eyes will make kitten cry meow meow!"
      }
    ],
    "englishTranslation": [
      "Meow meow meow, washing face like a kitten",
      "Not very clean, mother will not praise",
      "Where is your clean towel instead of licking paws",
      "Sore eyes will make kitten cry meow meow!"
    ]
  },
  {
    "id": "di-hoc",
    "title": "Đi học",
    "subtitleEn": "Going to School",
    "category": "vi_3y",
    "categoryLabelVi": "Lớp 3 tuổi · Đến trường mến thương",
    "ageBadge": "3 tuổi",
    "composer": "Nhạc: Bùi Đình Thảo · Lời: Minh Huệ",
    "emoji": "🌸",
    "colorHex": "#10B981",
    "bgGradient": "from-emerald-500 to-teal-600",
    "tempo": 92,
    "melodyStyle": "gentle",
    "lyrics": [
      "Hôm qua em tới trường",
      "Mẹ dắt tay từng bước",
      "Hôm nay mẹ lên nương",
      "Một mình em tới lớp",
      "Đường xa em đi nhanh",
      "Hương rừng thơm đồi vắng",
      "Nước suối trong thầm thì",
      "Cọ xòe ô che nắng, râm mát đường em đi."
    ],
    "funFactVi": "Đường tới lớp rợp bóng cọ nâng bước chân bé tự lập, yêu trường.",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "D4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.7
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.8
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "C5",
        "dur": 0.7
      },
      {
        "note": "D5",
        "dur": 0.5
      },
      {
        "note": "C5",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_di-hoc.webp",
    "isVocalTrack": false,
    "timedLyrics": [],
    "englishTranslation": [
      "Yesterday mother guided my steps to school",
      "Today mother goes to the terrace field",
      "All by myself I walk to the classroom",
      "Walking briskly along the winding trail",
      "Gentle morning stream whispers in the forest",
      "Palm trees shade the sunny path to school"
    ]
  },
  {
    "id": "truong-chung-chau-la-truong-mam-non",
    "title": "Trường chúng cháu là trường mầm non",
    "subtitleEn": "Our Kindergarten",
    "category": "vi_3y",
    "categoryLabelVi": "Lớp 3 tuổi · Trường lớp thân thương",
    "ageBadge": "3 tuổi",
    "composer": "Nhạc & lời: Phạm Tuyên",
    "emoji": "🏫",
    "colorHex": "#F59E0B",
    "bgGradient": "from-amber-500 to-orange-600",
    "tempo": 116,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Ai hỏi cháu cháu học trường nào đây?",
      "Bé mà ngoan lại múa hát thật hay!",
      "Cô là mẹ và các cháu là con",
      "Trường của cháu đây là trường mầm non!"
    ],
    "funFactVi": "Trường mầm non rực rỡ tiếng cười của bạn bè và cô giáo hiền.",
    "audioUrl": "/assets/music/truong-chung-chau-la-truong-mam-non.mp3",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "B4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.6
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "B4",
        "dur": 0.6
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "B4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_truong-chung-chau-la-truong-mam-non.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Ai hỏi cháu cháu học trường nào đây?",
        "translation": "Who is asking where is my preschool?"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Bé mà ngoan lại múa hát thật hay!",
        "translation": "Come here and visit, our school is so lovely"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Cô là mẹ và các cháu là con",
        "translation": "Lots of pretty toys and kind teacher"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Trường của cháu đây là trường mầm non!",
        "translation": "Our school is a cheerful kindergarten!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Ai hỏi cháu cháu học trường nào đây?",
        "translation": "Who is asking where is my preschool?"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Bé mà ngoan lại múa hát thật hay!",
        "translation": "Come here and visit, our school is so lovely"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Cô là mẹ và các cháu là con",
        "translation": "Lots of pretty toys and kind teacher"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Trường của cháu đây là trường mầm non!",
        "translation": "Our school is a cheerful kindergarten!"
      }
    ],
    "englishTranslation": [
      "Who is asking where is my preschool?",
      "Come here and visit, our school is so lovely",
      "Lots of pretty toys and kind teacher",
      "Our school is a cheerful kindergarten!"
    ]
  },
  {
    "id": "con-co-be-be",
    "title": "Con cò bé bé",
    "subtitleEn": "Little Egret",
    "category": "vi_3y",
    "categoryLabelVi": "Lớp 3 tuổi · Lễ phép chào hỏi",
    "ageBadge": "3 tuổi",
    "composer": "Nhạc: Phan Huỳnh Điểu · Lời: Võ Quảng",
    "emoji": "🕊️",
    "colorHex": "#8B5CF6",
    "bgGradient": "from-purple-500 to-indigo-600",
    "tempo": 104,
    "melodyStyle": "playful",
    "lyrics": [
      "Con cò bé bé",
      "Nó đậu cành tre",
      "Đi không hỏi mẹ",
      "Biết đi đường nào?",
      "Khi đi em hỏi",
      "Khi về em chào",
      "Miệng em chúm chím",
      "Mẹ có yêu không nào!"
    ],
    "funFactVi": "Bé ngoan luôn lễ phép chào hỏi người lớn khi đi và về.",
    "audioUrl": "/assets/music/con-co-be-be.mp3",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.8
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_con-co-be-be.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Con cò bé bé",
        "translation": "Little white egret perched on the bamboo branch"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Nó đậu cành tre",
        "translation": "Where are you going without asking your mother?"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Đi không hỏi mẹ",
        "translation": "Now that I ask, mother loves me so much"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Biết đi đường nào?",
        "translation": "Going out I say hello, coming back I say hello!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Khi đi em hỏi"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Khi về em chào"
      },
      {
        "startTimeSec": 26,
        "endTimeSec": 28.8,
        "text": "Miệng em chúm chím"
      },
      {
        "startTimeSec": 29,
        "endTimeSec": 31.8,
        "text": "Mẹ có yêu không nào!"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Con cò bé bé",
        "translation": "Little white egret perched on the bamboo branch"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Nó đậu cành tre",
        "translation": "Where are you going without asking your mother?"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Đi không hỏi mẹ",
        "translation": "Now that I ask, mother loves me so much"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Biết đi đường nào?",
        "translation": "Going out I say hello, coming back I say hello!"
      },
      {
        "startTimeSec": 52,
        "endTimeSec": 54.8,
        "text": "Khi đi em hỏi"
      },
      {
        "startTimeSec": 55,
        "endTimeSec": 57.8,
        "text": "Khi về em chào"
      },
      {
        "startTimeSec": 58,
        "endTimeSec": 60.8,
        "text": "Miệng em chúm chím"
      },
      {
        "startTimeSec": 61,
        "endTimeSec": 63.8,
        "text": "Mẹ có yêu không nào!"
      }
    ],
    "englishTranslation": [
      "Little white egret perched on the bamboo branch",
      "Where are you going without asking your mother?",
      "Now that I ask, mother loves me so much",
      "Going out I say hello, coming back I say hello!"
    ]
  },
  {
    "id": "ca-nha-thuong-nhau",
    "title": "Cả nhà thương nhau",
    "subtitleEn": "We Love Each Other",
    "category": "vi_3y",
    "categoryLabelVi": "Lớp 3 tuổi · Tình cảm gia đình",
    "ageBadge": "3 tuổi",
    "composer": "Nhạc & lời: Phan Văn Minh",
    "emoji": "👨‍👩‍👧",
    "colorHex": "#EF4444",
    "bgGradient": "from-red-500 to-rose-600",
    "tempo": 100,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Ba thương con vì con giống mẹ",
      "Mẹ thương con vì con giống ba",
      "Cả nhà ta cùng thương yêu nhau",
      "Xa là nhớ, gần nhau là cười!"
    ],
    "funFactVi": "Tình cảm gia đình ấm áp, cả nhà luôn sẻ chia yêu thương.",
    "audioUrl": "/assets/music/ca-nha-thuong-nhau.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "C5",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.8
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_ca-nha-thuong-nhau.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Ba thương con vì con giống mẹ",
        "translation": "Daddy loves baby because baby looks like mommy"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Mẹ thương con vì con giống ba",
        "translation": "Mommy loves baby because baby looks like daddy"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Cả nhà ta cùng thương yêu nhau",
        "translation": "Our whole happy family loves one another"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Xa là nhớ, gần nhau là cười!",
        "translation": "When apart we miss, when together we smile!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Ba thương con vì con giống mẹ",
        "translation": "Daddy loves baby because baby looks like mommy"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Mẹ thương con vì con giống ba",
        "translation": "Mommy loves baby because baby looks like daddy"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Cả nhà ta cùng thương yêu nhau",
        "translation": "Our whole happy family loves one another"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Xa là nhớ, gần nhau là cười!",
        "translation": "When apart we miss, when together we smile!"
      }
    ],
    "englishTranslation": [
      "Daddy loves baby because baby looks like mommy",
      "Mommy loves baby because baby looks like daddy",
      "Our whole happy family loves one another",
      "When apart we miss, when together we smile!"
    ]
  },
  {
    "id": "chau-yeu-ba",
    "title": "Cháu yêu bà",
    "subtitleEn": "I Love Grandma",
    "category": "vi_3y",
    "categoryLabelVi": "Lớp 3 tuổi · Kính yêu ông bà",
    "ageBadge": "3 tuổi",
    "composer": "Nhạc & lời: Xuân Giao",
    "emoji": "👵",
    "colorHex": "#6366F1",
    "bgGradient": "from-indigo-500 to-purple-600",
    "tempo": 96,
    "melodyStyle": "gentle",
    "lyrics": [
      "Bà ơi bà, cháu yêu bà lắm",
      "Tóc bà trắng, màu trắng như mây",
      "Cháu yêu bà, cháu nắm bàn tay",
      "Khi cháu vâng lời, cháu biết bà vui!"
    ],
    "funFactVi": "Lòng hiếu thảo, cử chỉ âu yếm bé dành cho người bà tóc bạc.",
    "audioUrl": "/assets/music/chau-yeu-ba.mp3",
    "melodyNotes": [
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.7
      },
      {
        "note": "C5",
        "dur": 0.5
      },
      {
        "note": "D5",
        "dur": 0.5
      },
      {
        "note": "C5",
        "dur": 0.8
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "C5",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.7
      },
      {
        "note": "D4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_chau-yeu-ba.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Bà ơi bà, cháu yêu bà lắm",
        "translation": "Dear grandma, I love you so much"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Tóc bà trắng, màu trắng như mây",
        "translation": "Your hair is pure white like fluffy clouds"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Cháu yêu bà, cháu nắm bàn tay",
        "translation": "I love you and gently hold your hand"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Khi cháu vâng lời, cháu biết bà vui!",
        "translation": "When I listen obediently, I know you are joyful!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Bà ơi bà, cháu yêu bà lắm",
        "translation": "Dear grandma, I love you so much"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Tóc bà trắng, màu trắng như mây",
        "translation": "Your hair is pure white like fluffy clouds"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Cháu yêu bà, cháu nắm bàn tay",
        "translation": "I love you and gently hold your hand"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Khi cháu vâng lời, cháu biết bà vui!",
        "translation": "When I listen obediently, I know you are joyful!"
      }
    ],
    "englishTranslation": [
      "Dear grandma, I love you so much",
      "Your hair is pure white like fluffy clouds",
      "I love you and gently hold your hand",
      "When I listen obediently, I know you are joyful!"
    ]
  },
  {
    "id": "mot-con-vit",
    "title": "Một con vịt",
    "subtitleEn": "One Little Duck",
    "category": "vi_3y",
    "categoryLabelVi": "Lớp 3 tuổi · Động vật quanh bé",
    "ageBadge": "3 tuổi",
    "composer": "Nhạc & lời: Kim Phước",
    "emoji": "🦆",
    "colorHex": "#EAB308",
    "bgGradient": "from-yellow-500 to-amber-600",
    "tempo": 118,
    "melodyStyle": "playful",
    "lyrics": [
      "Một con vịt xòe ra hai cái cánh",
      "Nó kêu rằng: Cáp cáp cáp, cạp cạp cạp!",
      "Gặp hồ nước nó bì bõm bì bõm",
      "Lên bờ vẫy cái cánh cho khô!"
    ],
    "funFactVi": "Chú vịt vàng tinh nghịch xòe cánh bơi lội trong làn nước trong.",
    "audioUrl": "/assets/music/mot-con-vit.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.6
      },
      {
        "note": "C5",
        "dur": 0.3
      },
      {
        "note": "C5",
        "dur": 0.3
      },
      {
        "note": "C5",
        "dur": 0.3
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_mot-con-vit.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Một con vịt xòe ra hai cái cánh",
        "translation": "One little duckling spreads out two wings"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Nó kêu rằng: Cáp cáp cáp, cạp cạp cạp!",
        "translation": "Quacking loudly: Quack quack quack!"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Gặp hồ nước nó bì bõm bì bõm",
        "translation": "Seeing the blue pond, it splashes playfully"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Lên bờ vẫy cái cánh cho khô!",
        "translation": "Stepping ashore, it flaps wings dry in the sun!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Một con vịt xòe ra hai cái cánh",
        "translation": "One little duckling spreads out two wings"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Nó kêu rằng: Cáp cáp cáp, cạp cạp cạp!",
        "translation": "Quacking loudly: Quack quack quack!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Gặp hồ nước nó bì bõm bì bõm",
        "translation": "Seeing the blue pond, it splashes playfully"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Lên bờ vẫy cái cánh cho khô!",
        "translation": "Stepping ashore, it flaps wings dry in the sun!"
      }
    ],
    "englishTranslation": [
      "One little duckling spreads out two wings",
      "Quacking loudly: Quack quack quack!",
      "Seeing the blue pond, it splashes playfully",
      "Stepping ashore, it flaps wings dry in the sun!"
    ]
  },
  {
    "id": "ca-vang-boi",
    "title": "Cá vàng bơi",
    "subtitleEn": "Goldfish Swimming",
    "category": "vi_3y",
    "categoryLabelVi": "Lớp 3 tuổi · Thế giới nước",
    "ageBadge": "3 tuổi",
    "composer": "Nhạc & lời: Phan Huỳnh Điểu",
    "emoji": "🐠",
    "colorHex": "#06B6D4",
    "bgGradient": "from-cyan-500 to-blue-600",
    "tempo": 110,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Hai vây xinh xinh",
      "Cá vàng bơi trong bể nước",
      "Ngoi lên, lặn xuống",
      "Cá vàng múa tung tăng",
      "Hai vây xinh xinh",
      "Sao mà bơi nhanh thế?",
      "Cá vàng thấy bọ gậy nên đuổi theo rất nhanh",
      "Cá vàng bắt bọ gậy cho nước thêm sạch trong!"
    ],
    "funFactVi": "Đàn cá vàng tung tăng bơi lội bắt bọ gậy giữ sạch nước.",
    "audioUrl": "/assets/music/ca-vang-boi.mp3",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.6
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "E5",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_ca-vang-boi.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Hai vây xinh xinh",
        "translation": "Two little goldfish swim in a crystal tank"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Cá vàng bơi trong bể nước",
        "translation": "Dancing up and down so graceful and quick"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Ngoi lên, lặn xuống",
        "translation": "Two goldfish swim so swiftly"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Cá vàng múa tung tăng",
        "translation": "Catching pesky bugs to keep the water clean!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Hai vây xinh xinh"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Sao mà bơi nhanh thế?"
      },
      {
        "startTimeSec": 26,
        "endTimeSec": 28.8,
        "text": "Cá vàng thấy bọ gậy nên đuổi theo rất nhanh"
      },
      {
        "startTimeSec": 29,
        "endTimeSec": 31.8,
        "text": "Cá vàng bắt bọ gậy cho nước thêm sạch trong!"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Hai vây xinh xinh",
        "translation": "Two little goldfish swim in a crystal tank"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Cá vàng bơi trong bể nước",
        "translation": "Dancing up and down so graceful and quick"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Ngoi lên, lặn xuống",
        "translation": "Two goldfish swim so swiftly"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Cá vàng múa tung tăng",
        "translation": "Catching pesky bugs to keep the water clean!"
      },
      {
        "startTimeSec": 52,
        "endTimeSec": 54.8,
        "text": "Hai vây xinh xinh"
      },
      {
        "startTimeSec": 55,
        "endTimeSec": 57.8,
        "text": "Sao mà bơi nhanh thế?"
      },
      {
        "startTimeSec": 58,
        "endTimeSec": 60.8,
        "text": "Cá vàng thấy bọ gậy nên đuổi theo rất nhanh"
      },
      {
        "startTimeSec": 61,
        "endTimeSec": 63.8,
        "text": "Cá vàng bắt bọ gậy cho nước thêm sạch trong!"
      }
    ],
    "englishTranslation": [
      "Two little goldfish swim in a crystal tank",
      "Dancing up and down so graceful and quick",
      "Two goldfish swim so swiftly",
      "Catching pesky bugs to keep the water clean!"
    ]
  },
  {
    "id": "kia-con-buom-vang",
    "title": "Kìa con bướm vàng",
    "subtitleEn": "Frère Jacques / Little Butterfly",
    "category": "vi_3y",
    "categoryLabelVi": "Lớp 3 tuổi · Nhịp điệu thiên nhiên",
    "ageBadge": "3 tuổi",
    "composer": "Nhạc Pháp · Lời Việt quen thuộc",
    "emoji": "🦋",
    "colorHex": "#14B8A6",
    "bgGradient": "from-teal-500 to-emerald-600",
    "tempo": 108,
    "melodyStyle": "playful",
    "lyrics": [
      "Kìa con bướm vàng, kìa con bướm vàng",
      "Xòe đôi cánh, xòe đôi cánh",
      "Bươm bướm bay đôi ba vòng, bươm bướm bay đôi ba vòng",
      "Tung cánh bay, tung cánh bay!"
    ],
    "funFactVi": "Đôi bướm vàng rực rỡ chao liệng đón gió xuân rộn ràng.",
    "audioUrl": "/assets/music/kia-con-buom-vang.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "D4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "D4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "F4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 1
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "F4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_kia-con-buom-vang.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Kìa con bướm vàng, kìa con bướm vàng",
        "translation": "Look at the lovely yellow butterfly"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Xòe đôi cánh, xòe đôi cánh",
        "translation": "Spreading out two bright colorful wings"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Bươm bướm bay đôi ba vòng, bươm bướm bay đôi ba vòng",
        "translation": "Flying round and round in the fresh air"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Tung cánh bay, tung cánh bay!",
        "translation": "Flapping wings, flapping wings in the breeze!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Kìa con bướm vàng, kìa con bướm vàng",
        "translation": "Look at the lovely yellow butterfly"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Xòe đôi cánh, xòe đôi cánh",
        "translation": "Spreading out two bright colorful wings"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Bươm bướm bay đôi ba vòng, bươm bướm bay đôi ba vòng",
        "translation": "Flying round and round in the fresh air"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Tung cánh bay, tung cánh bay!",
        "translation": "Flapping wings, flapping wings in the breeze!"
      }
    ],
    "englishTranslation": [
      "Look at the lovely yellow butterfly",
      "Spreading out two bright colorful wings",
      "Flying round and round in the fresh air",
      "Flapping wings, flapping wings in the breeze!"
    ]
  },
  {
    "id": "ba-ngon-nen-lung-linh",
    "title": "Ba ngọn nến lung linh",
    "subtitleEn": "Three Glowing Candles",
    "category": "vi_4y",
    "categoryLabelVi": "Lớp 4 tuổi · Tình cảm gia đình",
    "ageBadge": "4 tuổi",
    "composer": "Nhạc & lời: Ngọc Lễ",
    "emoji": "🕯️",
    "colorHex": "#F97316",
    "bgGradient": "from-orange-500 to-amber-600",
    "tempo": 98,
    "melodyStyle": "gentle",
    "lyrics": [
      "Ba là cây nến vàng",
      "Mẹ là cây nến xanh",
      "Con là cây nến hồng",
      "Ba ngọn nến lung linh",
      "Thắp sáng một gia đình!",
      "Gia đình gia đình, ôm ấp những ngày thơ",
      "Cho ta bao tình thương đi suốt cả cuộc đời!"
    ],
    "funFactVi": "Ba ngọn nến tượng trưng cho ngọn lửa yêu thương gia đình.",
    "audioUrl": "/assets/music/ba-ngon-nen-lung-linh.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.8
      },
      {
        "note": "D4",
        "dur": 0.5
      },
      {
        "note": "F4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "C5",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.8
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "B4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_ba-ngon-nen-lung-linh.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Ba là cây nến vàng",
        "translation": "Yellow candle represents strong father"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Mẹ là cây nến xanh",
        "translation": "Pink candle represents gentle mother"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Con là cây nến hồng",
        "translation": "Blue candle represents cheerful baby"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Ba ngọn nến lung linh",
        "translation": "Three bright candles light up a happy home!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Thắp sáng một gia đình!"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Gia đình gia đình, ôm ấp những ngày thơ"
      },
      {
        "startTimeSec": 26,
        "endTimeSec": 28.8,
        "text": "Cho ta bao tình thương đi suốt cả cuộc đời!"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Ba là cây nến vàng",
        "translation": "Yellow candle represents strong father"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Mẹ là cây nến xanh",
        "translation": "Pink candle represents gentle mother"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Con là cây nến hồng",
        "translation": "Blue candle represents cheerful baby"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Ba ngọn nến lung linh",
        "translation": "Three bright candles light up a happy home!"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Thắp sáng một gia đình!"
      },
      {
        "startTimeSec": 52,
        "endTimeSec": 54.8,
        "text": "Gia đình gia đình, ôm ấp những ngày thơ"
      },
      {
        "startTimeSec": 55,
        "endTimeSec": 57.8,
        "text": "Cho ta bao tình thương đi suốt cả cuộc đời!"
      }
    ],
    "englishTranslation": [
      "Yellow candle represents strong father",
      "Pink candle represents gentle mother",
      "Blue candle represents cheerful baby",
      "Three bright candles light up a happy home!"
    ]
  },
  {
    "id": "bo-la-tat-ca",
    "title": "Bố là tất cả",
    "subtitleEn": "Dad is Everything",
    "category": "vi_4y",
    "categoryLabelVi": "Lớp 4 tuổi · Tình yêu thương của Bố",
    "ageBadge": "4 tuổi",
    "composer": "Nhạc & lời: Thập Nhất",
    "emoji": "👨‍👧",
    "colorHex": "#3B82F6",
    "bgGradient": "from-blue-600 to-indigo-700",
    "tempo": 104,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Bố là tàu lửa, bố là xe hơi",
      "Bố là con ngựa em cưỡi em chơi",
      "Bố là thuyền lớn cho em vượt sóng",
      "Bố là sông rộng cho thuyền em bơi",
      "Bố là bờ đê cho em nằm ngủ",
      "Bố là phi thuyền đưa em lên trời!"
    ],
    "funFactVi": "Người cha luôn là điểm tựa chở che vững chãi cho con.",
    "audioUrl": "/assets/music/bo-la-tat-ca.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.6
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.8
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      }
    ],
    "cover": "/assets/music/covers/music_cover_bo-la-tat-ca.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Bố là tàu lửa, bố là xe hơi",
        "translation": "Daddy is a train engine chugging ahead"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Bố là con ngựa em cưỡi em chơi",
        "translation": "Daddy is a sturdy horse giving me rides"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Bố là thuyền lớn cho em vượt sóng",
        "translation": "Daddy is a ship sailing across oceans"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Bố là sông rộng cho thuyền em bơi",
        "translation": "Daddy is the whole world of wonder for me!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Bố là bờ đê cho em nằm ngủ"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Bố là phi thuyền đưa em lên trời!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Bố là tàu lửa, bố là xe hơi",
        "translation": "Daddy is a train engine chugging ahead"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Bố là con ngựa em cưỡi em chơi",
        "translation": "Daddy is a sturdy horse giving me rides"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Bố là thuyền lớn cho em vượt sóng",
        "translation": "Daddy is a ship sailing across oceans"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Bố là sông rộng cho thuyền em bơi",
        "translation": "Daddy is the whole world of wonder for me!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Bố là bờ đê cho em nằm ngủ"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Bố là phi thuyền đưa em lên trời!"
      }
    ],
    "englishTranslation": [
      "Daddy is a train engine chugging ahead",
      "Daddy is a sturdy horse giving me rides",
      "Daddy is a ship sailing across oceans",
      "Daddy is the whole world of wonder for me!"
    ]
  },
  {
    "id": "co-va-me",
    "title": "Cô và mẹ",
    "subtitleEn": "Teacher and Mother",
    "category": "vi_4y",
    "categoryLabelVi": "Lớp 4 tuổi · Tình cảm cô trò",
    "ageBadge": "4 tuổi",
    "composer": "Nhạc & lời: Phạm Thị Định",
    "emoji": "👩‍🏫",
    "colorHex": "#EC4899",
    "bgGradient": "from-pink-500 to-purple-600",
    "tempo": 96,
    "melodyStyle": "gentle",
    "lyrics": [
      "Lúc ở nhà mẹ cũng là cô giáo",
      "Khi đến trường cô giáo như mẹ hiền",
      "Cô và mẹ là hai cô giáo",
      "Mẹ và cô ấy hai mẹ hiền!"
    ],
    "funFactVi": "Cô giáo và người mẹ là hai vầng sáng dịu hiền bên con.",
    "audioUrl": "/assets/music/co-va-me.mp3",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.7
      },
      {
        "note": "C5",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "C5",
        "dur": 0.5
      },
      {
        "note": "D5",
        "dur": 0.5
      },
      {
        "note": "E5",
        "dur": 0.7
      },
      {
        "note": "D5",
        "dur": 0.5
      },
      {
        "note": "C5",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_co-va-me.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Lúc ở nhà mẹ cũng là cô giáo",
        "translation": "At home, mommy is also like a teacher"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Khi đến trường cô giáo như mẹ hiền",
        "translation": "At school, teacher is just like a sweet mommy"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Cô và mẹ là hai cô giáo",
        "translation": "Teacher and mommy are two gentle mothers"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Mẹ và cô ấy hai mẹ hiền!",
        "translation": "Mommy and teacher are two radiant smiles!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Lúc ở nhà mẹ cũng là cô giáo",
        "translation": "At home, mommy is also like a teacher"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Khi đến trường cô giáo như mẹ hiền",
        "translation": "At school, teacher is just like a sweet mommy"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Cô và mẹ là hai cô giáo",
        "translation": "Teacher and mommy are two gentle mothers"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Mẹ và cô ấy hai mẹ hiền!",
        "translation": "Mommy and teacher are two radiant smiles!"
      }
    ],
    "englishTranslation": [
      "At home, mommy is also like a teacher",
      "At school, teacher is just like a sweet mommy",
      "Teacher and mommy are two gentle mothers",
      "Mommy and teacher are two radiant smiles!"
    ]
  },
  {
    "id": "con-heo-dat",
    "title": "Con heo đất",
    "subtitleEn": "Little Piggy Bank",
    "category": "vi_4y",
    "categoryLabelVi": "Lớp 4 tuổi · Tiết kiệm ngoan ngoãn",
    "ageBadge": "4 tuổi",
    "composer": "Nhạc & lời: Ngọc Châu",
    "emoji": "🐷",
    "colorHex": "#F43F5E",
    "bgGradient": "from-rose-500 to-pink-600",
    "tempo": 114,
    "melodyStyle": "playful",
    "lyrics": [
      "Mẹ mua cho con heo đất",
      "Mẹ mua cho con heo đất, í o i ò!",
      "Ngày hôm nay em vui lắm",
      "Cầm đồng tiền nhỏ em nhét vào bụng heo!",
      "Em không thèm ăn kem, em không thèm mua kẹo",
      "Em để dành tiền nuôi heo đất lớn nhanh!"
    ],
    "funFactVi": "Thói quen tiết kiệm tiền lẻ nuôi heo đất giúp bé tự lập.",
    "audioUrl": "/assets/music/con-heo-dat.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "E4",
        "dur": 0.3
      },
      {
        "note": "D4",
        "dur": 0.6
      },
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_con-heo-dat.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Mẹ mua cho con heo đất",
        "translation": "Mom bought for me a cute ceramic piggy bank"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Mẹ mua cho con heo đất, í o i ò!",
        "translation": "Feeding it small coins each happy day"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Ngày hôm nay em vui lắm",
        "translation": "Piggy does not eat bran, piggy only saves"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Cầm đồng tiền nhỏ em nhét vào bụng heo!",
        "translation": "Helping me learn to save for school supplies!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Em không thèm ăn kem, em không thèm mua kẹo"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Em để dành tiền nuôi heo đất lớn nhanh!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Mẹ mua cho con heo đất",
        "translation": "Mom bought for me a cute ceramic piggy bank"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Mẹ mua cho con heo đất, í o i ò!",
        "translation": "Feeding it small coins each happy day"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Ngày hôm nay em vui lắm",
        "translation": "Piggy does not eat bran, piggy only saves"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Cầm đồng tiền nhỏ em nhét vào bụng heo!",
        "translation": "Helping me learn to save for school supplies!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Em không thèm ăn kem, em không thèm mua kẹo"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Em để dành tiền nuôi heo đất lớn nhanh!"
      }
    ],
    "englishTranslation": [
      "Mom bought for me a cute ceramic piggy bank",
      "Feeding it small coins each happy day",
      "Piggy does not eat bran, piggy only saves",
      "Helping me learn to save for school supplies!"
    ]
  },
  {
    "id": "chu-ech-con",
    "title": "Chú ếch con",
    "subtitleEn": "Little Froggy",
    "category": "vi_4y",
    "categoryLabelVi": "Lớp 4 tuổi · Chăm ngoan học tập",
    "ageBadge": "4 tuổi",
    "composer": "Nhạc & lời: Phan Huỳnh Điểu",
    "emoji": "🐸",
    "colorHex": "#22C55E",
    "bgGradient": "from-green-500 to-emerald-600",
    "tempo": 118,
    "melodyStyle": "playful",
    "lyrics": [
      "Kìa chú là chú ếch con, có hai là hai mắt tròn",
      "Chú ngồi học bài một mình bên hố bom kề vườn xoan",
      "Bao cô cá trê non cùng bao chú cá rô ron",
      "Tung tăng chiếc vây son cùng nghe ếch vang lừng câu ca!"
    ],
    "funFactVi": "Chú ếch con chăm ngoan ngồi học bài bên bờ ao xanh.",
    "audioUrl": "/assets/music/chu-ech-con.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.3
      },
      {
        "note": "D4",
        "dur": 0.3
      },
      {
        "note": "E4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "E4",
        "dur": 0.3
      },
      {
        "note": "D4",
        "dur": 0.6
      },
      {
        "note": "E4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "C5",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_chu-ech-con.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Kìa chú là chú ếch con, có hai là hai mắt tròn",
        "translation": "Little frog sitting on a green lotus leaf"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Chú ngồi học bài một mình bên hố bom kề vườn xoan",
        "translation": "Big round eyes reading his morning lesson"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Bao cô cá trê non cùng bao chú cá rô ron",
        "translation": "Two little birds singing on the tree branch"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Tung tăng chiếc vây son cùng nghe ếch vang lừng câu ca!",
        "translation": "Praising the diligent little froggy scholar!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Kìa chú là chú ếch con, có hai là hai mắt tròn",
        "translation": "Little frog sitting on a green lotus leaf"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Chú ngồi học bài một mình bên hố bom kề vườn xoan",
        "translation": "Big round eyes reading his morning lesson"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Bao cô cá trê non cùng bao chú cá rô ron",
        "translation": "Two little birds singing on the tree branch"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Tung tăng chiếc vây son cùng nghe ếch vang lừng câu ca!",
        "translation": "Praising the diligent little froggy scholar!"
      }
    ],
    "englishTranslation": [
      "Little frog sitting on a green lotus leaf",
      "Big round eyes reading his morning lesson",
      "Two little birds singing on the tree branch",
      "Praising the diligent little froggy scholar!"
    ]
  },
  {
    "id": "dan-ga-con",
    "title": "Đàn gà con",
    "subtitleEn": "Flock of Chicks",
    "category": "vi_4y",
    "categoryLabelVi": "Lớp 4 tuổi · Thiên nhiên động vật",
    "ageBadge": "4 tuổi",
    "composer": "Nhạc & lời: Phi Hải",
    "emoji": "🐥",
    "colorHex": "#FBBF24",
    "bgGradient": "from-amber-400 to-yellow-600",
    "tempo": 112,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Trông kìa đàn gà con lông vàng",
      "Đi theo mẹ tìm ăn trong vườn",
      "Cùng tìm mồi ăn ngon ngon",
      "Đàn gà con đi lon ton!",
      "Thóc vãi rồi nhặt ăn cho nhiều",
      "Uống nước vào là no căng diều!"
    ],
    "funFactVi": "Đàn gà con lông vàng óng ả theo mẹ kiếm mồi vui vẻ.",
    "audioUrl": "/assets/music/dan-ga-con.mp3",
    "melodyNotes": [
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 0.8
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_dan-ga-con.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Trông kìa đàn gà con lông vàng",
        "translation": "Look at the yellow chicks in the sunny garden"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Đi theo mẹ tìm ăn trong vườn",
        "translation": "Feathers fluffy like warm golden balls"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Cùng tìm mồi ăn ngon ngon",
        "translation": "Pecking tiny seeds with mother hen"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Đàn gà con đi lon ton!",
        "translation": "Chirping happily: Cheep cheep cheep!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Thóc vãi rồi nhặt ăn cho nhiều"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Uống nước vào là no căng diều!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Trông kìa đàn gà con lông vàng",
        "translation": "Look at the yellow chicks in the sunny garden"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Đi theo mẹ tìm ăn trong vườn",
        "translation": "Feathers fluffy like warm golden balls"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Cùng tìm mồi ăn ngon ngon",
        "translation": "Pecking tiny seeds with mother hen"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Đàn gà con đi lon ton!",
        "translation": "Chirping happily: Cheep cheep cheep!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Thóc vãi rồi nhặt ăn cho nhiều"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Uống nước vào là no căng diều!"
      }
    ],
    "englishTranslation": [
      "Look at the yellow chicks in the sunny garden",
      "Feathers fluffy like warm golden balls",
      "Pecking tiny seeds with mother hen",
      "Chirping happily: Cheep cheep cheep!"
    ]
  },
  {
    "id": "chu-voi-con-o-ban-don",
    "title": "Chú voi con ở Bản Đôn",
    "subtitleEn": "Little Elephant in Ban Don",
    "category": "vi_4y",
    "categoryLabelVi": "Lớp 4 tuổi · Đất nước tươi đẹp",
    "ageBadge": "4 tuổi",
    "composer": "Nhạc & lời: Phạm Tuyên",
    "emoji": "🐘",
    "colorHex": "#8B5CF6",
    "bgGradient": "from-violet-500 to-purple-700",
    "tempo": 116,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Chú voi con ở Bản Đôn",
      "Chưa có ngà nên còn trẻ con",
      "Từ rừng già chú đến với người",
      "Rất ham ăn với lại ham chơi!",
      "Voi con ơi, voi con ơi!",
      "Mau lớn nhanh có đôi ngà to",
      "Có sức đi khắp miền rừng xa",
      "Kéo gỗ cho buôn làng của ta!"
    ],
    "funFactVi": "Chú voi con Tây Nguyên ngộ nghĩnh, hiền lành được buôn làng yêu quý.",
    "audioUrl": "/assets/music/chu-voi-con-o-ban-don.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.7
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.8
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_chu-voi-con-o-ban-don.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Chú voi con ở Bản Đôn",
        "translation": "Baby elephant living in Ban Don village"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Chưa có ngà nên còn trẻ con",
        "translation": "Still so little without any ivory yet"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Từ rừng già chú đến với người",
        "translation": "Eating sweet bananas and splashing by the stream"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Rất ham ăn với lại ham chơi!",
        "translation": "Growing big and strong to help our village!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Voi con ơi, voi con ơi!"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Mau lớn nhanh có đôi ngà to"
      },
      {
        "startTimeSec": 26,
        "endTimeSec": 28.8,
        "text": "Có sức đi khắp miền rừng xa"
      },
      {
        "startTimeSec": 29,
        "endTimeSec": 31.8,
        "text": "Kéo gỗ cho buôn làng của ta!"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Chú voi con ở Bản Đôn",
        "translation": "Baby elephant living in Ban Don village"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Chưa có ngà nên còn trẻ con",
        "translation": "Still so little without any ivory yet"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Từ rừng già chú đến với người",
        "translation": "Eating sweet bananas and splashing by the stream"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Rất ham ăn với lại ham chơi!",
        "translation": "Growing big and strong to help our village!"
      },
      {
        "startTimeSec": 52,
        "endTimeSec": 54.8,
        "text": "Voi con ơi, voi con ơi!"
      },
      {
        "startTimeSec": 55,
        "endTimeSec": 57.8,
        "text": "Mau lớn nhanh có đôi ngà to"
      },
      {
        "startTimeSec": 58,
        "endTimeSec": 60.8,
        "text": "Có sức đi khắp miền rừng xa"
      },
      {
        "startTimeSec": 61,
        "endTimeSec": 63.8,
        "text": "Kéo gỗ cho buôn làng của ta!"
      }
    ],
    "englishTranslation": [
      "Baby elephant living in Ban Don village",
      "Still so little without any ivory yet",
      "Eating sweet bananas and splashing by the stream",
      "Growing big and strong to help our village!"
    ]
  },
  {
    "id": "bac-kim-thang",
    "title": "Bắc kim thang",
    "subtitleEn": "Folk Rhyme Bac Kim Thang",
    "category": "vi_4y",
    "categoryLabelVi": "Lớp 4 tuổi · Dân ca đồng dao",
    "ageBadge": "4 tuổi",
    "composer": "Dân ca Nam Bộ / Bắc Bộ",
    "emoji": "🎋",
    "colorHex": "#10B981",
    "bgGradient": "from-emerald-500 to-green-700",
    "tempo": 120,
    "melodyStyle": "playful",
    "lyrics": [
      "Bắc kim thang cà lang bí rợ",
      "Cột qua kèo là kèo qua cột",
      "Chú bán dầu qua cầu mà té",
      "Chú bán ếch ở lại làm chi",
      "Con chim le le bổ trống thổi kèn",
      "Con bìm bịp thổi tò tí te tò te!"
    ],
    "funFactVi": "Giai điệu dân ca đồng dao Nam Bộ rộn ràng tiếng vỗ tay.",
    "audioUrl": "/assets/music/bac-kim-thang.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.3
      },
      {
        "note": "C4",
        "dur": 0.3
      },
      {
        "note": "D4",
        "dur": 0.3
      },
      {
        "note": "E4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "E4",
        "dur": 0.3
      },
      {
        "note": "D4",
        "dur": 0.6
      },
      {
        "note": "E4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "C5",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_bac-kim-thang.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Bắc kim thang cà lang bí rợ",
        "translation": "Bac kim thang balancing on the wooden stile"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Cột qua kèo là kèo qua cột",
        "translation": "Spur-of-the-moment folk rhyme game"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Chú bán dầu qua cầu mà té",
        "translation": "Singing together in rhythm and clapping"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Chú bán ếch ở lại làm chi",
        "translation": "Joyful laughter across the playground!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Con chim le le bổ trống thổi kèn"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Con bìm bịp thổi tò tí te tò te!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Bắc kim thang cà lang bí rợ",
        "translation": "Bac kim thang balancing on the wooden stile"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Cột qua kèo là kèo qua cột",
        "translation": "Spur-of-the-moment folk rhyme game"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Chú bán dầu qua cầu mà té",
        "translation": "Singing together in rhythm and clapping"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Chú bán ếch ở lại làm chi",
        "translation": "Joyful laughter across the playground!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Con chim le le bổ trống thổi kèn"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Con bìm bịp thổi tò tí te tò te!"
      }
    ],
    "englishTranslation": [
      "Bac kim thang balancing on the wooden stile",
      "Spur-of-the-moment folk rhyme game",
      "Singing together in rhythm and clapping",
      "Joyful laughter across the playground!"
    ]
  },
  {
    "id": "ngay-dau-tien-di-hoc",
    "title": "Ngày đầu tiên đi học",
    "subtitleEn": "The Very First Day of School",
    "category": "vi_5y",
    "categoryLabelVi": "Lớp 5 tuổi · Bước vào lớp 1",
    "ageBadge": "5 tuổi",
    "composer": "Nhạc: Nguyễn Ngọc Thiện · Lời: Viễn Phương",
    "emoji": "🎒",
    "colorHex": "#6366F1",
    "bgGradient": "from-indigo-600 to-blue-700",
    "tempo": 88,
    "melodyStyle": "gentle",
    "lyrics": [
      "Ngày đầu tiên đi học, mẹ dắt tay đến trường",
      "Em vừa đi vừa khóc, mẹ dỗ dành yêu thương",
      "Ngày đầu tiên đi học, em mắt ướt nhạt nhòa",
      "Cô vỗ về an ủi, chao ôi sao thiết tha!",
      "Ngày đầu như thế đó, cô giáo như mẹ hiền",
      "Em bây giờ cứ ngỡ, cô giáo là cô tiên!"
    ],
    "funFactVi": "Kỷ niệm ngày đầu vào lớp bỡ ngỡ nhưng đầy ắp tình thương.",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.8
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "D4",
        "dur": 0.5
      },
      {
        "note": "C4",
        "dur": 0.8
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "C5",
        "dur": 0.9
      }
    ],
    "cover": "/assets/music/covers/music_cover_ngay-dau-tien-di-hoc.webp",
    "isVocalTrack": false,
    "timedLyrics": [],
    "englishTranslation": [
      "The very first day going to school",
      "Mother held my hand, I cried softly",
      "Teacher caressed my head comforting me",
      "Now grown up, I fondly remember that gentle day!"
    ]
  },
  {
    "id": "em-di-mau-giao",
    "title": "Em đi mẫu giáo",
    "subtitleEn": "Going to Preschool",
    "category": "vi_5y",
    "categoryLabelVi": "Lớp 5 tuổi · Mái trường tuổi thơ",
    "ageBadge": "5 tuổi",
    "composer": "Nhạc: Hoàng Hà · Lời: Phương Nhung",
    "emoji": "☀️",
    "colorHex": "#F59E0B",
    "bgGradient": "from-amber-500 to-yellow-600",
    "tempo": 110,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Nắng vừa lên em đi mẫu giáo",
      "Chim chuyền cành hót véo von",
      "Mẹ dắt tay em đi trên đường làng",
      "Em mỉm cười chào chú công an!",
      "Đến trường rồi vui ơi là vui",
      "Có cô giáo đón em vào lớp học!"
    ],
    "funFactVi": "Bước chân rộn rã tới lớp mầm non đón chào ngày học mới.",
    "audioUrl": "https://ia600607.us.archive.org/1/items/rua-mat-nhu-meo/Em%20%C4%90i%20M%E1%BA%ABu%20Gi%C3%A1o.mp3",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "B4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.6
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.8
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_em-di-mau-giao.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Nắng vừa lên em đi mẫu giáo",
        "translation": "Sunny morning birds chirp in the branches"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Chim chuyền cành hót véo von",
        "translation": "I put on my backpack and walk to class"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Mẹ dắt tay em đi trên đường làng",
        "translation": "Teacher welcomes me with open loving arms"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Em mỉm cười chào chú công an!",
        "translation": "Preschool is my joyful second home!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Đến trường rồi vui ơi là vui"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Có cô giáo đón em vào lớp học!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Nắng vừa lên em đi mẫu giáo",
        "translation": "Sunny morning birds chirp in the branches"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Chim chuyền cành hót véo von",
        "translation": "I put on my backpack and walk to class"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Mẹ dắt tay em đi trên đường làng",
        "translation": "Teacher welcomes me with open loving arms"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Em mỉm cười chào chú công an!",
        "translation": "Preschool is my joyful second home!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Đến trường rồi vui ơi là vui"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Có cô giáo đón em vào lớp học!"
      }
    ],
    "englishTranslation": [
      "Sunny morning birds chirp in the branches",
      "I put on my backpack and walk to class",
      "Teacher welcomes me with open loving arms",
      "Preschool is my joyful second home!"
    ]
  },
  {
    "id": "em-yeu-truong-em",
    "title": "Em yêu trường em",
    "subtitleEn": "I Love My School",
    "category": "vi_5y",
    "categoryLabelVi": "Lớp 5 tuổi · Thầy cô & Bạn bè",
    "ageBadge": "5 tuổi",
    "composer": "Nhạc & lời: Hoàng Văn Vân",
    "emoji": "🏫",
    "colorHex": "#10B981",
    "bgGradient": "from-emerald-600 to-teal-700",
    "tempo": 112,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Em yêu trường em, với bao bạn thân",
      "Và cô giáo hiền, như yêu quê hương",
      "Cắp sách đến trường trong muôn vàn yêu thương!",
      "Nào bàn nào ghế, nào sách nào vở",
      "Nào mực nào bút, nào phấn nào bảng",
      "Cả tiếng chim vui trên cành cây cao!"
    ],
    "funFactVi": "Mái trường thân thương nơi lưu giữ bạn bè và ngàn bài học hay.",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.6
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.8
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_em-yeu-truong-em.webp",
    "isVocalTrack": false,
    "timedLyrics": [],
    "englishTranslation": [
      "I love my school with all my good friends",
      "And kind teachers loving like mother",
      "Like thousands of flowers in sunny spring",
      "Our school is filled with knowledge and joy!"
    ]
  },
  {
    "id": "tam-biet-bup-be",
    "title": "Tạm biệt búp bê",
    "subtitleEn": "Goodbye Teddy Bear & Dolls",
    "category": "vi_5y",
    "categoryLabelVi": "Lớp 5 tuổi · Lễ ra trường mầm non",
    "ageBadge": "5 tuổi",
    "composer": "Nhạc & lời: Tân Huyền",
    "emoji": "🧸",
    "colorHex": "#EC4899",
    "bgGradient": "from-pink-500 to-rose-600",
    "tempo": 100,
    "melodyStyle": "gentle",
    "lyrics": [
      "Tạm biệt búp bê thân yêu",
      "Tạm biệt gấu mi-sa nhé",
      "Tạm biệt thỏ trắng mắt tròn",
      "Mai tôi vào lớp một rồi!",
      "Nhớ lắm quên sao được",
      "Trường mầm non thân yêu!"
    ],
    "funFactVi": "Lời tạm biệt trường mầm non bước vào lớp một tự tin, chững chạc.",
    "audioUrl": "https://ia600607.us.archive.org/1/items/rua-mat-nhu-meo/Tam%20Biet%20Bup%20Be%20Than%20Yeu.mp3",
    "melodyNotes": [
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "C5",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.8
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_tam-biet-bup-be.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Tạm biệt búp bê thân yêu",
        "translation": "Goodbye lovely doll, goodbye cute teddy bear"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Tạm biệt gấu mi-sa nhé",
        "translation": "Goodbye yellow birdie, now I enter grade one"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Tạm biệt thỏ trắng mắt tròn",
        "translation": "I will remember my dear kindergarten school"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Mai tôi vào lớp một rồi!",
        "translation": "Carrying sweet memories into grade one!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Nhớ lắm quên sao được"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Trường mầm non thân yêu!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Tạm biệt búp bê thân yêu",
        "translation": "Goodbye lovely doll, goodbye cute teddy bear"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Tạm biệt gấu mi-sa nhé",
        "translation": "Goodbye yellow birdie, now I enter grade one"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Tạm biệt thỏ trắng mắt tròn",
        "translation": "I will remember my dear kindergarten school"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Mai tôi vào lớp một rồi!",
        "translation": "Carrying sweet memories into grade one!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Nhớ lắm quên sao được"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Trường mầm non thân yêu!"
      }
    ],
    "englishTranslation": [
      "Goodbye lovely doll, goodbye cute teddy bear",
      "Goodbye yellow birdie, now I enter grade one",
      "I will remember my dear kindergarten school",
      "Carrying sweet memories into grade one!"
    ]
  },
  {
    "id": "tap-the-duc-buoi-sang",
    "title": "Tập thể dục buổi sáng",
    "subtitleEn": "Morning Exercise",
    "category": "vi_5y",
    "categoryLabelVi": "Lớp 5 tuổi · Rèn luyện sức khỏe",
    "ageBadge": "5 tuổi",
    "composer": "Nhạc & lời: Nguyễn Văn Chung",
    "emoji": "🤸",
    "colorHex": "#3B82F6",
    "bgGradient": "from-sky-500 to-blue-600",
    "tempo": 124,
    "melodyStyle": "playful",
    "lyrics": [
      "Một hai ba, hít thở thật sâu",
      "Hai tay giơ lên cao qua đầu",
      "Nghiêng sang trái, nghiêng sang phải",
      "Bé tập thể dục cho người khỏe dai!",
      "Chạy nhảy tung tăng đón ánh bình minh!"
    ],
    "funFactVi": "Thể dục buổi sáng rèn luyện thể chất dẻo dai cho bé khỏe mạnh.",
    "audioUrl": "/assets/music/tap-the-duc-buoi-sang.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.3
      },
      {
        "note": "E4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "C5",
        "dur": 0.6
      },
      {
        "note": "D5",
        "dur": 0.3
      },
      {
        "note": "C5",
        "dur": 0.3
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_tap-the-duc-buoi-sang.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Một hai ba, hít thở thật sâu",
        "translation": "One two three, breathe in fresh morning air"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Hai tay giơ lên cao qua đầu",
        "translation": "Hands up high, stretch wide to both sides"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Nghiêng sang trái, nghiêng sang phải",
        "translation": "Hands on waist, jump merrily in place"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Bé tập thể dục cho người khỏe dai!",
        "translation": "Healthy exercise makes body strong and alert!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Chạy nhảy tung tăng đón ánh bình minh!"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Một hai ba, hít thở thật sâu",
        "translation": "One two three, breathe in fresh morning air"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Hai tay giơ lên cao qua đầu",
        "translation": "Hands up high, stretch wide to both sides"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Nghiêng sang trái, nghiêng sang phải",
        "translation": "Hands on waist, jump merrily in place"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Bé tập thể dục cho người khỏe dai!",
        "translation": "Healthy exercise makes body strong and alert!"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Chạy nhảy tung tăng đón ánh bình minh!"
      }
    ],
    "englishTranslation": [
      "One two three, breathe in fresh morning air",
      "Hands up high, stretch wide to both sides",
      "Hands on waist, jump merrily in place",
      "Healthy exercise makes body strong and alert!"
    ]
  },
  {
    "id": "chiec-den-ong-sao",
    "title": "Chiếc đèn ông Sao",
    "subtitleEn": "Star Lantern on Mid-Autumn",
    "category": "vi_5y",
    "categoryLabelVi": "Lớp 5 tuổi · Lễ hội Trung Thu",
    "ageBadge": "5 tuổi",
    "composer": "Nhạc & lời: Phạm Tuyên",
    "emoji": "⭐",
    "colorHex": "#EAB308",
    "bgGradient": "from-amber-400 to-yellow-600",
    "tempo": 120,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Chiếc đèn ông sao sao năm cánh tươi màu",
      "Cán đây rất dài, cán cao quá đầu",
      "Em cầm đèn sao em hát vang vang",
      "Đèn sao tươi màu của đềm rằm liên hoan!",
      "Tùng rinh rinh, tùng tùng tùng rinh rinh!",
      "Đây ánh sao vui chiếu xa non ngàn!"
    ],
    "funFactVi": "Đêm rằm Trung thu lung linh ánh sao cùng bạn bè rước đèn.",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "B4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "B4",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_chiec-den-ong-sao.webp",
    "isVocalTrack": false,
    "timedLyrics": [],
    "englishTranslation": [
      "Star lantern with five colorful glowing points",
      "Holding lantern high on Mid-Autumn night",
      "Tung rinh rinh, drums beat under full moon",
      "Children singing and dancing under bright moonlight!"
    ]
  },
  {
    "id": "trai-dat-nay-la-cua-chung-minh",
    "title": "Trái đất này là của chúng mình",
    "subtitleEn": "This Earth Belongs to Us",
    "category": "vi_5y",
    "categoryLabelVi": "Lớp 5 tuổi · Tình hữu nghị năm châu",
    "ageBadge": "5 tuổi",
    "composer": "Nhạc: Trương Quang Lục · Lời: Định Hải",
    "emoji": "🌍",
    "colorHex": "#0284C7",
    "bgGradient": "from-sky-600 to-indigo-700",
    "tempo": 114,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Trái đất này là của chúng mình",
      "Quả bóng xanh bay giữa trời xanh",
      "Bồ câu ơi tiếng chim gù thương mến",
      "Hải âu ơi cánh chim vờn sóng biển",
      "Cùng bay nào cho trái đất quay!",
      "Cùng bay nào cho trái đất quay!"
    ],
    "funFactVi": "Khát vọng hòa bình, tình hữu nghị giữa trẻ em trên toàn thế giới.",
    "audioUrl": "https://ia600607.us.archive.org/1/items/rua-mat-nhu-meo/Tr%C3%A1i%20%C4%90%E1%BA%A5t%20N%C3%A0y%20L%C3%A0%20C%E1%BB%A7a%20Ch%C3%BAng%20M%C3%ACnh.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.7
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "E5",
        "dur": 0.8
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_trai-dat-nay-la-cua-chung-minh.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Trái đất này là của chúng mình",
        "translation": "This earth belongs to all of us children"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Quả bóng xanh bay giữa trời xanh",
        "translation": "Golden fruit of peace, shining sun of hope"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Bồ câu ơi tiếng chim gù thương mến",
        "translation": "White doves flying across the blue sky"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Hải âu ơi cánh chim vờn sóng biển",
        "translation": "Singing for a peaceful and loving world!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Cùng bay nào cho trái đất quay!"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Cùng bay nào cho trái đất quay!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Trái đất này là của chúng mình",
        "translation": "This earth belongs to all of us children"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Quả bóng xanh bay giữa trời xanh",
        "translation": "Golden fruit of peace, shining sun of hope"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Bồ câu ơi tiếng chim gù thương mến",
        "translation": "White doves flying across the blue sky"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Hải âu ơi cánh chim vờn sóng biển",
        "translation": "Singing for a peaceful and loving world!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Cùng bay nào cho trái đất quay!"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Cùng bay nào cho trái đất quay!"
      }
    ],
    "englishTranslation": [
      "This earth belongs to all of us children",
      "Golden fruit of peace, shining sun of hope",
      "White doves flying across the blue sky",
      "Singing for a peaceful and loving world!"
    ]
  },
  {
    "id": "hong-dam-dau",
    "title": "Hổng dám đâu",
    "subtitleEn": "I Dare Not Play",
    "category": "vi_5y",
    "categoryLabelVi": "Lớp 5 tuổi · Chăm chỉ rèn luyện",
    "ageBadge": "5 tuổi",
    "composer": "Nhạc & lời: Nguyễn Văn Chung",
    "emoji": "📚",
    "colorHex": "#8B5CF6",
    "bgGradient": "from-purple-600 to-pink-600",
    "tempo": 118,
    "melodyStyle": "playful",
    "lyrics": [
      "Trên cành cao chim hót líu lo",
      "Mời em ra ngoài kia cùng chơi đá bóng",
      "Hổng dám đâu, em còn phải học bài!",
      "Học bài xong rồi em mới đi chơi",
      "Cô giáo khen em bé ngoan chăm chỉ!"
    ],
    "funFactVi": "Bé chăm chỉ học bài đầy đủ trước khi cùng bạn ra chơi.",
    "audioUrl": "/assets/music/hong-dam-dau.mp3",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.6
      },
      {
        "note": "E5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.8
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_hong-dam-dau.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Trên cành cao chim hót líu lo",
        "translation": "Friends call me out to play and skip study"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Mời em ra ngoài kia cùng chơi đá bóng",
        "translation": "I say no way, learning comes first today"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Hổng dám đâu, em còn phải học bài!",
        "translation": "Doing all my homework before going out to play"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Học bài xong rồi em mới đi chơi",
        "translation": "Diligent child earns high marks and praise!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Cô giáo khen em bé ngoan chăm chỉ!"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Trên cành cao chim hót líu lo",
        "translation": "Friends call me out to play and skip study"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Mời em ra ngoài kia cùng chơi đá bóng",
        "translation": "I say no way, learning comes first today"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Hổng dám đâu, em còn phải học bài!",
        "translation": "Doing all my homework before going out to play"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Học bài xong rồi em mới đi chơi",
        "translation": "Diligent child earns high marks and praise!"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Cô giáo khen em bé ngoan chăm chỉ!"
      }
    ],
    "englishTranslation": [
      "Friends call me out to play and skip study",
      "I say no way, learning comes first today",
      "Doing all my homework before going out to play",
      "Diligent child earns high marks and praise!"
    ]
  },
  {
    "id": "abc-alphabet-song",
    "title": "The ABC Alphabet Song",
    "subtitleEn": "A B C D E F G...",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Bảng chữ cái",
    "ageBadge": "0–5 tuổi",
    "composer": "Music for Little People Choir",
    "emoji": "🔤",
    "colorHex": "#EF4444",
    "bgGradient": "from-rose-500 to-red-600",
    "tempo": 104,
    "melodyStyle": "cheerful",
    "lyrics": [
      "A B C D E F G",
      "H I J K L M N O P",
      "Q R S, T U V",
      "W X, Y and Z",
      "Now I know my ABCs",
      "Next time won't you sing with me!"
    ],
    "englishTranslation": [
      "A B C D E F G",
      "H I J K L M N O P",
      "Q R S, T U V",
      "W X, Y and Z",
      "Bây giờ bé đã thuộc bài ca bảng chữ cái",
      "Lần tới bạn có muốn cùng hát với bé không?"
    ],
    "funFactVi": "Bài ca kinh điển giúp bé ghi nhớ trọn vẹn 26 chữ cái.",
    "audioUrl": "/assets/music/abc-alphabet-song.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 1
      },
      {
        "note": "F4",
        "dur": 0.5
      },
      {
        "note": "F4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "D4",
        "dur": 0.5
      },
      {
        "note": "D4",
        "dur": 0.5
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_abc-alphabet-song.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "A B C D E F G",
        "translation": "A B C D E F G"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "H I J K L M N O P",
        "translation": "H I J K L M N O P"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Q R S, T U V",
        "translation": "Q R S, T U V"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "W X, Y and Z",
        "translation": "W X, Y and Z"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Now I know my ABCs",
        "translation": "Bây giờ bé đã thuộc bài ca bảng chữ cái"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Next time won't you sing with me!",
        "translation": "Lần tới bạn có muốn cùng hát với bé không?"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "A B C D E F G",
        "translation": "A B C D E F G"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "H I J K L M N O P",
        "translation": "H I J K L M N O P"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Q R S, T U V",
        "translation": "Q R S, T U V"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "W X, Y and Z",
        "translation": "W X, Y and Z"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Now I know my ABCs",
        "translation": "Bây giờ bé đã thuộc bài ca bảng chữ cái"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Next time won't you sing with me!",
        "translation": "Lần tới bạn có muốn cùng hát với bé không?"
      }
    ]
  },
  {
    "id": "twinkle-twinkle-little-star",
    "title": "Twinkle Twinkle Little Star",
    "subtitleEn": "How I wonder what you are",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Hát ru êm dịu",
    "ageBadge": "0–5 tuổi",
    "composer": "Music for Little People Choir",
    "emoji": "⭐",
    "colorHex": "#F59E0B",
    "bgGradient": "from-amber-400 to-yellow-600",
    "tempo": 86,
    "melodyStyle": "gentle",
    "lyrics": [
      "Twinkle, twinkle, little star,",
      "How I wonder what you are!",
      "Up above the world so high,",
      "Like a diamond in the sky.",
      "Twinkle, twinkle, little star,",
      "How I wonder what you are!"
    ],
    "funFactVi": "Ngôi sao nhỏ soi sáng màn đêm khơi gợi trí tò mò của bé.",
    "audioUrl": "/assets/music/twinkle-twinkle-little-star.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 1
      },
      {
        "note": "F4",
        "dur": 0.5
      },
      {
        "note": "F4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "D4",
        "dur": 0.5
      },
      {
        "note": "D4",
        "dur": 0.5
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_twinkle-twinkle-little-star.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Twinkle, twinkle, little star,",
        "translation": "Ngôi sao nhỏ lấp lánh trên bầu trời đêm"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "How I wonder what you are!",
        "translation": "Bé tự hỏi bạn là điều kỳ diệu phương nào"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Up above the world so high,",
        "translation": "Tít trên cao vút trên thế gian này"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Like a diamond in the sky.",
        "translation": "Giống như viên kim cương sáng rực trên bầu trời!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Twinkle, twinkle, little star,"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "How I wonder what you are!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Twinkle, twinkle, little star,",
        "translation": "Ngôi sao nhỏ lấp lánh trên bầu trời đêm"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "How I wonder what you are!",
        "translation": "Bé tự hỏi bạn là điều kỳ diệu phương nào"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Up above the world so high,",
        "translation": "Tít trên cao vút trên thế gian này"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Like a diamond in the sky.",
        "translation": "Giống như viên kim cương sáng rực trên bầu trời!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Twinkle, twinkle, little star,"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "How I wonder what you are!"
      }
    ],
    "englishTranslation": [
      "Ngôi sao nhỏ lấp lánh trên bầu trời đêm",
      "Bé tự hỏi bạn là điều kỳ diệu phương nào",
      "Tít trên cao vút trên thế gian này",
      "Giống như viên kim cương sáng rực trên bầu trời!"
    ]
  },
  {
    "id": "old-macdonald-had-a-farm",
    "title": "Old MacDonald Had a Farm",
    "subtitleEn": "E-I-E-I-O!",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Nông trại & Động vật",
    "ageBadge": "0–5 tuổi",
    "composer": "Music for Little People Choir",
    "emoji": "🚜",
    "colorHex": "#10B981",
    "bgGradient": "from-emerald-500 to-green-600",
    "tempo": 114,
    "melodyStyle": "playful",
    "lyrics": [
      "Old MacDonald had a farm, E-I-E-I-O!",
      "And on that farm he had a cow, E-I-E-I-O!",
      "With a moo moo here, and a moo moo there,",
      "Here a moo, there a moo, everywhere a moo moo!",
      "Old MacDonald had a farm, E-I-E-I-O!"
    ],
    "funFactVi": "Làm quen tên gọi và tiếng kêu các loài động vật nông trại.",
    "audioUrl": "/assets/music/old-macdonald-had-a-farm.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "G3",
        "dur": 0.4
      },
      {
        "note": "A3",
        "dur": 0.4
      },
      {
        "note": "A3",
        "dur": 0.4
      },
      {
        "note": "G3",
        "dur": 0.8
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_old-macdonald-had-a-farm.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Old MacDonald had a farm, E-I-E-I-O!",
        "translation": "Bác MacDonald có một trang trại vui vẻ, E-I-E-I-O"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "And on that farm he had a cow, E-I-E-I-O!",
        "translation": "Và trên nông trại bác nuôi những chú bò sữa, E-I-E-I-O"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "With a moo moo here, and a moo moo there,",
        "translation": "Với tiếng kêu: Ùm bò nơi đây, ùm bò nơi đó"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Here a moo, there a moo, everywhere a moo moo!",
        "translation": "Nông trại của bác MacDonald thật rộn ràng!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Old MacDonald had a farm, E-I-E-I-O!"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Old MacDonald had a farm, E-I-E-I-O!",
        "translation": "Bác MacDonald có một trang trại vui vẻ, E-I-E-I-O"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "And on that farm he had a cow, E-I-E-I-O!",
        "translation": "Và trên nông trại bác nuôi những chú bò sữa, E-I-E-I-O"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "With a moo moo here, and a moo moo there,",
        "translation": "Với tiếng kêu: Ùm bò nơi đây, ùm bò nơi đó"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Here a moo, there a moo, everywhere a moo moo!",
        "translation": "Nông trại của bác MacDonald thật rộn ràng!"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Old MacDonald had a farm, E-I-E-I-O!"
      }
    ],
    "englishTranslation": [
      "Bác MacDonald có một trang trại vui vẻ, E-I-E-I-O",
      "Và trên nông trại bác nuôi những chú bò sữa, E-I-E-I-O",
      "Với tiếng kêu: Ùm bò nơi đây, ùm bò nơi đó",
      "Nông trại của bác MacDonald thật rộn ràng!"
    ]
  },
  {
    "id": "the-wheels-on-the-bus",
    "title": "The Wheels on the Bus",
    "subtitleEn": "Go round and round!",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Xe buýt & Chuyển động",
    "ageBadge": "0–5 tuổi",
    "composer": "Music for Little People Choir",
    "emoji": "🚌",
    "colorHex": "#3B82F6",
    "bgGradient": "from-blue-500 to-indigo-600",
    "tempo": 120,
    "melodyStyle": "cheerful",
    "lyrics": [
      "The wheels on the bus go round and round,",
      "Round and round, round and round.",
      "The wheels on the bus go round and round,",
      "All through the town!",
      "The horn on the bus goes beep beep beep,",
      "The wipers on the bus go swish swish swish!"
    ],
    "funFactVi": "Nhịp điệu sôi động mô phỏng chuyến xe buýt vui vẻ đến trường.",
    "audioUrl": "/assets/music/the-wheels-on-the-bus.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.8
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      }
    ],
    "cover": "/assets/music/covers/music_cover_the-wheels-on-the-bus.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "The wheels on the bus go round and round,",
        "translation": "Những bánh xe buýt cứ xoay tròn xoay tròn"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Round and round, round and round.",
        "translation": "Xoay tròn suốt cả ngày trên khắp nẻo đường"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "The wheels on the bus go round and round,",
        "translation": "Cần gạt nước kêu vun vút, vun vút, vun vút"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "All through the town!",
        "translation": "Tiếng còi xe kêu: Bim bim bim cho bé tới trường!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "The horn on the bus goes beep beep beep,"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "The wipers on the bus go swish swish swish!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "The wheels on the bus go round and round,",
        "translation": "Những bánh xe buýt cứ xoay tròn xoay tròn"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Round and round, round and round.",
        "translation": "Xoay tròn suốt cả ngày trên khắp nẻo đường"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "The wheels on the bus go round and round,",
        "translation": "Cần gạt nước kêu vun vút, vun vút, vun vút"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "All through the town!",
        "translation": "Tiếng còi xe kêu: Bim bim bim cho bé tới trường!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "The horn on the bus goes beep beep beep,"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "The wipers on the bus go swish swish swish!"
      }
    ],
    "englishTranslation": [
      "Những bánh xe buýt cứ xoay tròn xoay tròn",
      "Xoay tròn suốt cả ngày trên khắp nẻo đường",
      "Cần gạt nước kêu vun vút, vun vút, vun vút",
      "Tiếng còi xe kêu: Bim bim bim cho bé tới trường!"
    ]
  },
  {
    "id": "baa-baa-black-sheep",
    "title": "Baa Baa Black Sheep",
    "subtitleEn": "Have you any wool?",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Chú cừu ngoan",
    "ageBadge": "0–5 tuổi",
    "composer": "Music for Little People Choir",
    "emoji": "🐑",
    "colorHex": "#64748B",
    "bgGradient": "from-slate-600 to-slate-800",
    "tempo": 100,
    "melodyStyle": "gentle",
    "lyrics": [
      "Baa, baa, black sheep, have you any wool?",
      "Yes, sir, yes, sir, three bags full!",
      "One for the master, and one for the dame,",
      "And one for the little boy who lives down the lane."
    ],
    "funFactVi": "Bài học chia sẻ len ấm áp cho mọi người xung quanh.",
    "audioUrl": "/assets/music/baa-baa-black-sheep.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "C4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "B4",
        "dur": 0.3
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_baa-baa-black-sheep.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Baa, baa, black sheep, have you any wool?",
        "translation": "Cừu đen ơi cừu có cuộn len nào không?"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Yes, sir, yes, sir, three bags full!",
        "translation": "Dạ có chứ, cháu có tận ba túi len đầy"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "One for the master, and one for the dame,",
        "translation": "Một túi cho ông chủ, một túi cho bà chủ"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "And one for the little boy who lives down the lane.",
        "translation": "Và một túi cho em bé ngoan sống ở cuối đường!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Baa, baa, black sheep, have you any wool?",
        "translation": "Cừu đen ơi cừu có cuộn len nào không?"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Yes, sir, yes, sir, three bags full!",
        "translation": "Dạ có chứ, cháu có tận ba túi len đầy"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "One for the master, and one for the dame,",
        "translation": "Một túi cho ông chủ, một túi cho bà chủ"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "And one for the little boy who lives down the lane.",
        "translation": "Và một túi cho em bé ngoan sống ở cuối đường!"
      }
    ],
    "englishTranslation": [
      "Cừu đen ơi cừu có cuộn len nào không?",
      "Dạ có chứ, cháu có tận ba túi len đầy",
      "Một túi cho ông chủ, một túi cho bà chủ",
      "Và một túi cho em bé ngoan sống ở cuối đường!"
    ]
  },
  {
    "id": "if-youre-happy-and-you-know-it",
    "title": "If You're Happy and You Know It",
    "subtitleEn": "Clap your hands! 👏",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Cảm xúc & Vận động",
    "ageBadge": "0–5 tuổi",
    "composer": "Music for Little People Choir",
    "emoji": "👏",
    "colorHex": "#EC4899",
    "bgGradient": "from-pink-500 to-rose-600",
    "tempo": 116,
    "melodyStyle": "playful",
    "lyrics": [
      "If you're happy and you know it, clap your hands! (Clap, clap!)",
      "If you're happy and you know it, clap your hands! (Clap, clap!)",
      "If you're happy and you know it, and you really want to show it,",
      "If you're happy and you know it, clap your hands! (Clap, clap!)",
      "If you're happy and you know it, stomp your feet! (Stomp, stomp!)",
      "If you're happy and you know it, shout hurray! (Hurray!)"
    ],
    "funFactVi": "Khích lệ bé bộc lộ cảm xúc vui tươi bằng cử chỉ tay chân.",
    "audioUrl": "/assets/music/if-youre-happy-and-you-know-it.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.3
      },
      {
        "note": "C4",
        "dur": 0.3
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_if-youre-happy-and-you-know-it.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "If you're happy and you know it, clap your hands! (Clap, clap!)",
        "translation": "Nếu bạn thấy vui vẻ và hạnh phúc, hãy vỗ tay nhé!"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "If you're happy and you know it, clap your hands! (Clap, clap!)",
        "translation": "Nếu bạn thấy vui vẻ và hạnh phúc, hãy vỗ tay nhé!"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "If you're happy and you know it, and you really want to show it,",
        "translation": "Nếu bạn vui vẻ và muốn lan tỏa điều đó"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "If you're happy and you know it, clap your hands! (Clap, clap!)",
        "translation": "Hãy cùng vỗ tay thật to nào bạn ơi!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "If you're happy and you know it, stomp your feet! (Stomp, stomp!)"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "If you're happy and you know it, shout hurray! (Hurray!)"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "If you're happy and you know it, clap your hands! (Clap, clap!)",
        "translation": "Nếu bạn thấy vui vẻ và hạnh phúc, hãy vỗ tay nhé!"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "If you're happy and you know it, clap your hands! (Clap, clap!)",
        "translation": "Nếu bạn thấy vui vẻ và hạnh phúc, hãy vỗ tay nhé!"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "If you're happy and you know it, and you really want to show it,",
        "translation": "Nếu bạn vui vẻ và muốn lan tỏa điều đó"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "If you're happy and you know it, clap your hands! (Clap, clap!)",
        "translation": "Hãy cùng vỗ tay thật to nào bạn ơi!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "If you're happy and you know it, stomp your feet! (Stomp, stomp!)"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "If you're happy and you know it, shout hurray! (Hurray!)"
      }
    ],
    "englishTranslation": [
      "Nếu bạn thấy vui vẻ và hạnh phúc, hãy vỗ tay nhé!",
      "Nếu bạn thấy vui vẻ và hạnh phúc, hãy vỗ tay nhé!",
      "Nếu bạn vui vẻ và muốn lan tỏa điều đó",
      "Hãy cùng vỗ tay thật to nào bạn ơi!"
    ]
  },
  {
    "id": "row-row-row-your-boat",
    "title": "Row Row Row Your Boat",
    "subtitleEn": "Gently down the stream",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Chèo thuyền vui vẻ",
    "ageBadge": "0–5 tuổi",
    "composer": "The Best Nursery Rhymes Choir",
    "emoji": "🛶",
    "colorHex": "#0284C7",
    "bgGradient": "from-sky-500 to-blue-600",
    "tempo": 96,
    "melodyStyle": "gentle",
    "lyrics": [
      "Row, row, row your boat",
      "Gently down the stream,",
      "Merrily, merrily, merrily, merrily,",
      "Life is but a dream!"
    ],
    "funFactVi": "Giai điệu êm đềm dạy bé vượt qua dòng nước nhẹ nhàng.",
    "audioUrl": "/assets/music/row-row-row-your-boat.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.6
      },
      {
        "note": "C4",
        "dur": 0.6
      },
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.8
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 1.2
      }
    ],
    "cover": "/assets/music/covers/music_cover_row-row-row-your-boat.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Row, row, row your boat",
        "translation": "Chèo chèo chèo con thuyền nhỏ xuôi dòng êm ả"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Gently down the stream,",
        "translation": "Thật nhẹ nhàng, thật dịu dàng, cuộc đời tựa giấc mơ"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Merrily, merrily, merrily, merrily,",
        "translation": "Chèo chèo chèo con thuyền nhỏ ngắm nhìn dòng suối"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Life is but a dream!",
        "translation": "Nếu gặp chú cá sấu, đừng quên mỉm cười chào bạn nhé!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Row, row, row your boat",
        "translation": "Chèo chèo chèo con thuyền nhỏ xuôi dòng êm ả"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Gently down the stream,",
        "translation": "Thật nhẹ nhàng, thật dịu dàng, cuộc đời tựa giấc mơ"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Merrily, merrily, merrily, merrily,",
        "translation": "Chèo chèo chèo con thuyền nhỏ ngắm nhìn dòng suối"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Life is but a dream!",
        "translation": "Nếu gặp chú cá sấu, đừng quên mỉm cười chào bạn nhé!"
      }
    ],
    "englishTranslation": [
      "Chèo chèo chèo con thuyền nhỏ xuôi dòng êm ả",
      "Thật nhẹ nhàng, thật dịu dàng, cuộc đời tựa giấc mơ",
      "Chèo chèo chèo con thuyền nhỏ ngắm nhìn dòng suối",
      "Nếu gặp chú cá sấu, đừng quên mỉm cười chào bạn nhé!"
    ]
  },
  {
    "id": "head-shoulders-knees-and-toes",
    "title": "Head, Shoulders, Knees and Toes",
    "subtitleEn": "And eyes, and ears, and mouth, and nose!",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Bộ phận cơ thể",
    "ageBadge": "0–5 tuổi",
    "composer": "Kids Music Dance Party Band",
    "emoji": "🙆",
    "colorHex": "#8B5CF6",
    "bgGradient": "from-purple-500 to-indigo-600",
    "tempo": 112,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Head, shoulders, knees and toes, knees and toes!",
      "Head, shoulders, knees and toes, knees and toes!",
      "And eyes, and ears, and mouth, and nose,",
      "Head, shoulders, knees and toes, knees and toes!"
    ],
    "funFactVi": "Vừa hát vừa chạm đúng bộ phận cơ thể để tăng phản xạ.",
    "audioUrl": "/assets/music/head-shoulders-knees-and-toes.mp3",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "E5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.6
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "E5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.6
      }
    ],
    "cover": "/assets/music/covers/music_cover_head-shoulders-knees-and-toes.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Head, shoulders, knees and toes, knees and toes!",
        "translation": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Head, shoulders, knees and toes, knees and toes!",
        "translation": "Đầu gối và ngón chân!"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "And eyes, and ears, and mouth, and nose,",
        "translation": "Mắt, tai, miệng và mũi nhỏ xinh"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Head, shoulders, knees and toes, knees and toes!",
        "translation": "Đầu, vai, đầu gối và ngón chân xinh xắn!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "Head, shoulders, knees and toes, knees and toes!",
        "translation": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Head, shoulders, knees and toes, knees and toes!",
        "translation": "Đầu gối và ngón chân!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "And eyes, and ears, and mouth, and nose,",
        "translation": "Mắt, tai, miệng và mũi nhỏ xinh"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Head, shoulders, knees and toes, knees and toes!",
        "translation": "Đầu, vai, đầu gối và ngón chân xinh xắn!"
      }
    ],
    "englishTranslation": [
      "Đầu, vai, đầu gối và ngón chân",
      "Đầu gối và ngón chân!",
      "Mắt, tai, miệng và mũi nhỏ xinh",
      "Đầu, vai, đầu gối và ngón chân xinh xắn!"
    ]
  },
  {
    "id": "five-little-monkeys",
    "title": "Five Little Monkeys",
    "subtitleEn": "Jumping on the bed!",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Đếm số & Cẩn thận",
    "ageBadge": "0–5 tuổi",
    "composer": "Kids Music Dance Party Band",
    "emoji": "🐒",
    "colorHex": "#D97706",
    "bgGradient": "from-amber-600 to-orange-700",
    "tempo": 118,
    "melodyStyle": "playful",
    "lyrics": [
      "Five little monkeys jumping on the bed,",
      "One fell off and bumped his head!",
      "Mama called the doctor and the doctor said:",
      "\"No more monkeys jumping on the bed!\"",
      "Four little monkeys jumping on the bed..."
    ],
    "funFactVi": "Dạy bé đếm lùi số lượng và nhắc nhở an toàn khi chơi.",
    "audioUrl": "/assets/music/five-little-monkeys.mp3",
    "melodyNotes": [
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.6
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_five-little-monkeys.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Five little monkeys jumping on the bed,",
        "translation": "Năm chú khỉ con nhảy nhót tung tăng trên giường"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "One fell off and bumped his head!",
        "translation": "Một chú bị trượt chân ngã u đầu xuống sàn"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Mama called the doctor and the doctor said:",
        "translation": "Mẹ liền gọi bác sĩ, bác sĩ dặn ngay:"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "\"No more monkeys jumping on the bed!\"",
        "translation": "Không được nhảy nhót trên giường nữa nhé khỉ con!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Four little monkeys jumping on the bed..."
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Five little monkeys jumping on the bed,",
        "translation": "Năm chú khỉ con nhảy nhót tung tăng trên giường"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "One fell off and bumped his head!",
        "translation": "Một chú bị trượt chân ngã u đầu xuống sàn"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Mama called the doctor and the doctor said:",
        "translation": "Mẹ liền gọi bác sĩ, bác sĩ dặn ngay:"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "\"No more monkeys jumping on the bed!\"",
        "translation": "Không được nhảy nhót trên giường nữa nhé khỉ con!"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Four little monkeys jumping on the bed..."
      }
    ],
    "englishTranslation": [
      "Năm chú khỉ con nhảy nhót tung tăng trên giường",
      "Một chú bị trượt chân ngã u đầu xuống sàn",
      "Mẹ liền gọi bác sĩ, bác sĩ dặn ngay:",
      "Không được nhảy nhót trên giường nữa nhé khỉ con!"
    ]
  },
  {
    "id": "baby-shark",
    "title": "Baby Shark",
    "subtitleEn": "Doo doo doo doo doo doo!",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Gia đình cá mập",
    "ageBadge": "0–5 tuổi",
    "composer": "Pinkfong & Kids Dance Choir",
    "emoji": "🦈",
    "colorHex": "#0284C7",
    "bgGradient": "from-sky-400 to-blue-600",
    "tempo": 115,
    "melodyStyle": "playful",
    "lyrics": [
      "Baby shark, doo doo doo doo doo doo!",
      "Baby shark, doo doo doo doo doo doo!",
      "Baby shark, doo doo doo doo doo doo, Baby shark!",
      "Mommy shark, doo doo doo doo doo doo!",
      "Mommy shark, doo doo doo doo doo doo!",
      "Mommy shark, doo doo doo doo doo doo, Mommy shark!",
      "Daddy shark, doo doo doo doo doo doo!",
      "Daddy shark, doo doo doo doo doo doo!",
      "Daddy shark, doo doo doo doo doo doo, Daddy shark!",
      "Grandma shark, doo doo doo doo doo doo!",
      "Grandpa shark, doo doo doo doo doo doo!",
      "Let's go hunt, doo doo doo doo doo doo!",
      "Run away, doo doo doo doo doo doo, Run away!",
      "Safe at last, doo doo doo doo doo doo, Safe at last!",
      "It's the end, doo doo doo doo doo doo!"
    ],
    "funFactVi": "Vũ điệu cá mập sôi động cả nhà cùng nhún nhảy theo nhịp.",
    "audioUrl": "/assets/music/baby-shark.mp3",
    "melodyNotes": [
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      }
    ],
    "cover": "/assets/music/covers/music_cover_baby-shark.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Baby shark, doo doo doo doo doo doo!",
        "translation": "Cá mập con, đu đu đu đu đu"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Baby shark, doo doo doo doo doo doo!",
        "translation": "Cá mập mẹ, đu đu đu đu đu"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Baby shark, doo doo doo doo doo doo, Baby shark!",
        "translation": "Cá mập bố, đu đu đu đu đu"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Mommy shark, doo doo doo doo doo doo!",
        "translation": "Cùng bơi lội dưới đại dương xanh bao la!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Mommy shark, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Mommy shark, doo doo doo doo doo doo, Mommy shark!"
      },
      {
        "startTimeSec": 26,
        "endTimeSec": 28.8,
        "text": "Daddy shark, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 29,
        "endTimeSec": 31.8,
        "text": "Daddy shark, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 32,
        "endTimeSec": 34.8,
        "text": "Daddy shark, doo doo doo doo doo doo, Daddy shark!"
      },
      {
        "startTimeSec": 35,
        "endTimeSec": 37.8,
        "text": "Grandma shark, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 38,
        "endTimeSec": 40.8,
        "text": "Grandpa shark, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 41,
        "endTimeSec": 43.8,
        "text": "Let's go hunt, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 44,
        "endTimeSec": 46.8,
        "text": "Run away, doo doo doo doo doo doo, Run away!"
      },
      {
        "startTimeSec": 47,
        "endTimeSec": 49.8,
        "text": "Safe at last, doo doo doo doo doo doo, Safe at last!"
      },
      {
        "startTimeSec": 50,
        "endTimeSec": 52.8,
        "text": "It's the end, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 61,
        "endTimeSec": 63.8,
        "text": "Baby shark, doo doo doo doo doo doo!",
        "translation": "Cá mập con, đu đu đu đu đu"
      },
      {
        "startTimeSec": 64,
        "endTimeSec": 66.8,
        "text": "Baby shark, doo doo doo doo doo doo!",
        "translation": "Cá mập mẹ, đu đu đu đu đu"
      },
      {
        "startTimeSec": 67,
        "endTimeSec": 69.8,
        "text": "Baby shark, doo doo doo doo doo doo, Baby shark!",
        "translation": "Cá mập bố, đu đu đu đu đu"
      },
      {
        "startTimeSec": 70,
        "endTimeSec": 72.8,
        "text": "Mommy shark, doo doo doo doo doo doo!",
        "translation": "Cùng bơi lội dưới đại dương xanh bao la!"
      },
      {
        "startTimeSec": 73,
        "endTimeSec": 75.8,
        "text": "Mommy shark, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 76,
        "endTimeSec": 78.8,
        "text": "Mommy shark, doo doo doo doo doo doo, Mommy shark!"
      },
      {
        "startTimeSec": 79,
        "endTimeSec": 81.8,
        "text": "Daddy shark, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 82,
        "endTimeSec": 84.8,
        "text": "Daddy shark, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 85,
        "endTimeSec": 87.8,
        "text": "Daddy shark, doo doo doo doo doo doo, Daddy shark!"
      },
      {
        "startTimeSec": 88,
        "endTimeSec": 90.8,
        "text": "Grandma shark, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 91,
        "endTimeSec": 93.8,
        "text": "Grandpa shark, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 94,
        "endTimeSec": 96.8,
        "text": "Let's go hunt, doo doo doo doo doo doo!"
      },
      {
        "startTimeSec": 97,
        "endTimeSec": 99.8,
        "text": "Run away, doo doo doo doo doo doo, Run away!"
      },
      {
        "startTimeSec": 100,
        "endTimeSec": 102.8,
        "text": "Safe at last, doo doo doo doo doo doo, Safe at last!"
      },
      {
        "startTimeSec": 103,
        "endTimeSec": 105.8,
        "text": "It's the end, doo doo doo doo doo doo!"
      }
    ],
    "englishTranslation": [
      "Cá mập con, đu đu đu đu đu",
      "Cá mập mẹ, đu đu đu đu đu",
      "Cá mập bố, đu đu đu đu đu",
      "Cùng bơi lội dưới đại dương xanh bao la!"
    ]
  },
  {
    "id": "bingo-dog-song",
    "title": "B-I-N-G-O",
    "subtitleEn": "And Bingo was his name-o!",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Đánh vần chữ cái",
    "ageBadge": "0–5 tuổi",
    "composer": "Kids Music Dance Party Band",
    "emoji": "🐶",
    "colorHex": "#EA580C",
    "bgGradient": "from-orange-500 to-amber-600",
    "tempo": 112,
    "melodyStyle": "cheerful",
    "lyrics": [
      "There was a farmer had a dog,",
      "And Bingo was his name-o.",
      "B-I-N-G-O, B-I-N-G-O, B-I-N-G-O,",
      "And Bingo was his name-o!"
    ],
    "funFactVi": "Học đánh vần từng chữ cái vui nhộn cùng chú cún Bingo.",
    "audioUrl": "/assets/music/bingo-dog-song.mp3",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "D5",
        "dur": 0.4
      },
      {
        "note": "E5",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_bingo-dog-song.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "There was a farmer had a dog,",
        "translation": "Có một bác nông dân nuôi một chú cún đáng yêu"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "And Bingo was his name-o.",
        "translation": "Và Bingo là tên của chú cún ấy"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "B-I-N-G-O, B-I-N-G-O, B-I-N-G-O,",
        "translation": "B-I-N-G-O! B-I-N-G-O! B-I-N-G-O!"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "And Bingo was his name-o!",
        "translation": "Và Bingo là tên của chú cún con!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "There was a farmer had a dog,",
        "translation": "Có một bác nông dân nuôi một chú cún đáng yêu"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "And Bingo was his name-o.",
        "translation": "Và Bingo là tên của chú cún ấy"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "B-I-N-G-O, B-I-N-G-O, B-I-N-G-O,",
        "translation": "B-I-N-G-O! B-I-N-G-O! B-I-N-G-O!"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "And Bingo was his name-o!",
        "translation": "Và Bingo là tên của chú cún con!"
      }
    ],
    "englishTranslation": [
      "Có một bác nông dân nuôi một chú cún đáng yêu",
      "Và Bingo là tên của chú cún ấy",
      "B-I-N-G-O! B-I-N-G-O! B-I-N-G-O!",
      "Và Bingo là tên của chú cún con!"
    ]
  },
  {
    "id": "mary-had-a-little-lamb",
    "title": "Mary Had a Little Lamb",
    "subtitleEn": "Its fleece was white as snow",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Bạn cừu trắng",
    "ageBadge": "0–5 tuổi",
    "composer": "Music for Little People Choir",
    "emoji": "🐑",
    "colorHex": "#059669",
    "bgGradient": "from-emerald-600 to-teal-700",
    "tempo": 106,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Mary had a little lamb,",
      "Little lamb, little lamb,",
      "Mary had a little lamb,",
      "Its fleece was white as snow.",
      "And everywhere that Mary went,",
      "The lamb was sure to go!"
    ],
    "funFactVi": "Tình bạn gắn bó thân thiết giữa cô bé Mary và chú cừu.",
    "audioUrl": "/assets/music/mary-had-a-little-lamb.mp3",
    "melodyNotes": [
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.8
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.8
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_mary-had-a-little-lamb.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Mary had a little lamb,",
        "translation": "Mary có một chú cừu nhỏ lông trắng như tuyết"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Little lamb, little lamb,",
        "translation": "Lông của chú cừu trắng muốt như những đám mây"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Mary had a little lamb,",
        "translation": "Và bất cứ nơi đâu cô bé Mary đi tới"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Its fleece was white as snow.",
        "translation": "Chú cừu nhỏ cũng lon ton bước theo sau!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "And everywhere that Mary went,"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "The lamb was sure to go!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "Mary had a little lamb,",
        "translation": "Mary có một chú cừu nhỏ lông trắng như tuyết"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Little lamb, little lamb,",
        "translation": "Lông của chú cừu trắng muốt như những đám mây"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Mary had a little lamb,",
        "translation": "Và bất cứ nơi đâu cô bé Mary đi tới"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Its fleece was white as snow.",
        "translation": "Chú cừu nhỏ cũng lon ton bước theo sau!"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "And everywhere that Mary went,"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "The lamb was sure to go!"
      }
    ],
    "englishTranslation": [
      "Mary có một chú cừu nhỏ lông trắng như tuyết",
      "Lông của chú cừu trắng muốt như những đám mây",
      "Và bất cứ nơi đâu cô bé Mary đi tới",
      "Chú cừu nhỏ cũng lon ton bước theo sau!"
    ]
  },
  {
    "id": "rain-rain-go-away",
    "title": "Rain, Rain, Go Away",
    "subtitleEn": "Come again another day!",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Mưa ơi đi nhé",
    "ageBadge": "0–5 tuổi",
    "composer": "Barney & Kids Choir",
    "emoji": "🌧️",
    "colorHex": "#0EA5E9",
    "bgGradient": "from-sky-500 to-blue-600",
    "tempo": 104,
    "melodyStyle": "playful",
    "lyrics": [
      "Rain, rain, go away,",
      "Come again another day!",
      "Little Johnny wants to play,",
      "Rain, rain, go away!",
      "Daddy wants to play, rain, rain, go away!",
      "Mommy wants to play, rain, rain, go away!",
      "Brother wants to play, sister wants to play,",
      "All the family wants to play, rain, rain, go away!"
    ],
    "funFactVi": "Lời ước ngày nắng ấm để bé được ra sân chơi đùa.",
    "audioUrl": "/assets/music/rain-rain-go-away.mp3",
    "melodyNotes": [
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "E4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_rain-rain-go-away.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Rain, rain, go away,",
        "translation": "Mưa ơi mưa ơi hãy bay đi nơi khác nhé"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "Come again another day!",
        "translation": "Hãy quay lại vào một ngày khác nha mưa"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Little Johnny wants to play,",
        "translation": "Em bé nhỏ muốn chạy ra ngoài sân vui chơi"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Rain, rain, go away!",
        "translation": "Mưa ơi hãy tạnh đi để trời trong xanh nào!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Daddy wants to play, rain, rain, go away!"
      },
      {
        "startTimeSec": 23,
        "endTimeSec": 25.8,
        "text": "Mommy wants to play, rain, rain, go away!"
      },
      {
        "startTimeSec": 26,
        "endTimeSec": 28.8,
        "text": "Brother wants to play, sister wants to play,"
      },
      {
        "startTimeSec": 29,
        "endTimeSec": 31.8,
        "text": "All the family wants to play, rain, rain, go away!"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Rain, rain, go away,",
        "translation": "Mưa ơi mưa ơi hãy bay đi nơi khác nhé"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Come again another day!",
        "translation": "Hãy quay lại vào một ngày khác nha mưa"
      },
      {
        "startTimeSec": 46,
        "endTimeSec": 48.8,
        "text": "Little Johnny wants to play,",
        "translation": "Em bé nhỏ muốn chạy ra ngoài sân vui chơi"
      },
      {
        "startTimeSec": 49,
        "endTimeSec": 51.8,
        "text": "Rain, rain, go away!",
        "translation": "Mưa ơi hãy tạnh đi để trời trong xanh nào!"
      },
      {
        "startTimeSec": 52,
        "endTimeSec": 54.8,
        "text": "Daddy wants to play, rain, rain, go away!"
      },
      {
        "startTimeSec": 55,
        "endTimeSec": 57.8,
        "text": "Mommy wants to play, rain, rain, go away!"
      },
      {
        "startTimeSec": 58,
        "endTimeSec": 60.8,
        "text": "Brother wants to play, sister wants to play,"
      },
      {
        "startTimeSec": 61,
        "endTimeSec": 63.8,
        "text": "All the family wants to play, rain, rain, go away!"
      }
    ],
    "englishTranslation": [
      "Mưa ơi mưa ơi hãy bay đi nơi khác nhé",
      "Hãy quay lại vào một ngày khác nha mưa",
      "Em bé nhỏ muốn chạy ra ngoài sân vui chơi",
      "Mưa ơi hãy tạnh đi để trời trong xanh nào!"
    ]
  },
  {
    "id": "hickory-dickory-dock",
    "title": "Hickory Dickory Dock",
    "subtitleEn": "The mouse ran up the clock!",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Chuột con & Đồng hồ",
    "ageBadge": "0–5 tuổi",
    "composer": "The Best Nursery Rhymes Choir",
    "emoji": "🕰️",
    "colorHex": "#7C3AED",
    "bgGradient": "from-violet-600 to-purple-700",
    "tempo": 110,
    "melodyStyle": "playful",
    "lyrics": [
      "Hickory dickory dock,",
      "The mouse ran up the clock.",
      "The clock struck one, the mouse ran down,",
      "Hickory dickory dock!",
      "Tick tock, tick tock, tick tock!"
    ],
    "funFactVi": "Làm quen với mặt đồng hồ và nhịp tích tắc thời gian.",
    "audioUrl": "/assets/music/hickory-dickory-dock.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "D4",
        "dur": 0.4
      },
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.8
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "B4",
        "dur": 0.4
      },
      {
        "note": "C5",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_hickory-dickory-dock.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Hickory dickory dock,",
        "translation": "Tích tắc tích tắc, chiếc đồng hồ gõ nhịp"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "The mouse ran up the clock.",
        "translation": "Chú chuột nhắt chạy nhanh lên đỉnh đồng hồ"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "The clock struck one, the mouse ran down,",
        "translation": "Đồng hồ điểm một giờ: Bính boong!"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Hickory dickory dock!",
        "translation": "Chú chuột liền chạy tuột xuống dưới!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Tick tock, tick tock, tick tock!"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Hickory dickory dock,",
        "translation": "Tích tắc tích tắc, chiếc đồng hồ gõ nhịp"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "The mouse ran up the clock.",
        "translation": "Chú chuột nhắt chạy nhanh lên đỉnh đồng hồ"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "The clock struck one, the mouse ran down,",
        "translation": "Đồng hồ điểm một giờ: Bính boong!"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "Hickory dickory dock!",
        "translation": "Chú chuột liền chạy tuột xuống dưới!"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Tick tock, tick tock, tick tock!"
      }
    ],
    "englishTranslation": [
      "Tích tắc tích tắc, chiếc đồng hồ gõ nhịp",
      "Chú chuột nhắt chạy nhanh lên đỉnh đồng hồ",
      "Đồng hồ điểm một giờ: Bính boong!",
      "Chú chuột liền chạy tuột xuống dưới!"
    ]
  },
  {
    "id": "you-are-my-sunshine",
    "title": "You Are My Sunshine",
    "subtitleEn": "You make me happy when skies are gray",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Ánh dương của mẹ",
    "ageBadge": "0–5 tuổi",
    "composer": "Elizabeth Mitchell & Family",
    "emoji": "🌞",
    "colorHex": "#F59E0B",
    "bgGradient": "from-amber-400 to-orange-500",
    "tempo": 92,
    "melodyStyle": "gentle",
    "lyrics": [
      "You are my sunshine, my only sunshine,",
      "You make me happy when skies are gray.",
      "You'll never know, dear, how much I love you,",
      "Please don't take my sunshine away!"
    ],
    "funFactVi": "Bày tỏ tình thương yêu vô bờ bến cha mẹ dành cho con.",
    "audioUrl": "/assets/music/you-are-my-sunshine.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.8
      },
      {
        "note": "A4",
        "dur": 0.8
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "F4",
        "dur": 0.8
      },
      {
        "note": "F4",
        "dur": 0.8
      },
      {
        "note": "F4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "Bb4",
        "dur": 0.8
      },
      {
        "note": "D5",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_you-are-my-sunshine.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "You are my sunshine, my only sunshine,",
        "translation": "Bé là ánh mặt trời rực rỡ duy nhất của mẹ"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "You make me happy when skies are gray.",
        "translation": "Bé làm cho mẹ hạnh phúc cả khi trời u ám"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "You'll never know, dear, how much I love you,",
        "translation": "Bé yêu sẽ không bao giờ biết mẹ yêu bé chừng nào đâu"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Please don't take my sunshine away!",
        "translation": "Xin đừng mang ánh mặt trời ấm áp của mẹ đi nhé!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "You are my sunshine, my only sunshine,",
        "translation": "Bé là ánh mặt trời rực rỡ duy nhất của mẹ"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "You make me happy when skies are gray.",
        "translation": "Bé làm cho mẹ hạnh phúc cả khi trời u ám"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "You'll never know, dear, how much I love you,",
        "translation": "Bé yêu sẽ không bao giờ biết mẹ yêu bé chừng nào đâu"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Please don't take my sunshine away!",
        "translation": "Xin đừng mang ánh mặt trời ấm áp của mẹ đi nhé!"
      }
    ],
    "englishTranslation": [
      "Bé là ánh mặt trời rực rỡ duy nhất của mẹ",
      "Bé làm cho mẹ hạnh phúc cả khi trời u ám",
      "Bé yêu sẽ không bao giờ biết mẹ yêu bé chừng nào đâu",
      "Xin đừng mang ánh mặt trời ấm áp của mẹ đi nhé!"
    ]
  },
  {
    "id": "three-little-kittens",
    "title": "Three Little Kittens",
    "subtitleEn": "They lost their mittens!",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Ba chú mèo con",
    "ageBadge": "0–5 tuổi",
    "composer": "Traditional Mother Goose Choir",
    "emoji": "🐱",
    "colorHex": "#EC4899",
    "bgGradient": "from-pink-500 to-rose-600",
    "tempo": 104,
    "melodyStyle": "playful",
    "lyrics": [
      "Three little kittens, they lost their mittens,",
      "And they began to cry: Oh, mother dear, we sadly fear,",
      "Our mittens we have lost!",
      "What! Lost your mittens, you naughty kittens!",
      "Then you shall have no pie! Mee-ow, mee-ow, mee-ow!"
    ],
    "funFactVi": "Ba chú mèo con biết nhận lỗi và tìm lại găng tay.",
    "audioUrl": "/assets/music/three-little-kittens.ogg",
    "melodyNotes": [
      {
        "note": "E4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.4
      },
      {
        "note": "G4",
        "dur": 0.6
      },
      {
        "note": "C5",
        "dur": 0.4
      },
      {
        "note": "B4",
        "dur": 0.4
      },
      {
        "note": "A4",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_three-little-kittens.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Three little kittens, they lost their mittens,",
        "translation": "Ba chú mèo con tinh nghịch làm mất đôi găng tay"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "And they began to cry: Oh, mother dear, we sadly fear,",
        "translation": "Và chúng bắt đầu òa khóc meo meo"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Our mittens we have lost!",
        "translation": "Ôi mẹ ơi mẹ, chúng con làm mất găng tay rồi"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "What! Lost your mittens, you naughty kittens!",
        "translation": "Các chú mèo ngoan tìm lại được găng tay và mẹ mỉm cười!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "Then you shall have no pie! Mee-ow, mee-ow, mee-ow!"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Three little kittens, they lost their mittens,",
        "translation": "Ba chú mèo con tinh nghịch làm mất đôi găng tay"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "And they began to cry: Oh, mother dear, we sadly fear,",
        "translation": "Và chúng bắt đầu òa khóc meo meo"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Our mittens we have lost!",
        "translation": "Ôi mẹ ơi mẹ, chúng con làm mất găng tay rồi"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "What! Lost your mittens, you naughty kittens!",
        "translation": "Các chú mèo ngoan tìm lại được găng tay và mẹ mỉm cười!"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "Then you shall have no pie! Mee-ow, mee-ow, mee-ow!"
      }
    ],
    "englishTranslation": [
      "Ba chú mèo con tinh nghịch làm mất đôi găng tay",
      "Và chúng bắt đầu òa khóc meo meo",
      "Ôi mẹ ơi mẹ, chúng con làm mất găng tay rồi",
      "Các chú mèo ngoan tìm lại được găng tay và mẹ mỉm cười!"
    ]
  },
  {
    "id": "pop-goes-the-weasel",
    "title": "Pop! Goes the Weasel",
    "subtitleEn": "Up and down the city road",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Điệu nhảy sôi động",
    "ageBadge": "0–5 tuổi",
    "composer": "Kids Music Dance Party Band",
    "emoji": "🦡",
    "colorHex": "#8B5CF6",
    "bgGradient": "from-purple-500 to-indigo-600",
    "tempo": 120,
    "melodyStyle": "cheerful",
    "lyrics": [
      "All around the mulberry bush,",
      "The monkey chased the weasel.",
      "The monkey thought 'twas all in fun,",
      "Pop! Goes the weasel!"
    ],
    "funFactVi": "Trò chơi hộp nhạc bất ngờ mang lại tiếng cười sảng khoái.",
    "audioUrl": "/assets/music/pop-goes-the-weasel.mp3",
    "melodyNotes": [
      {
        "note": "C4",
        "dur": 0.3
      },
      {
        "note": "F4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.3
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "Bb4",
        "dur": 0.3
      },
      {
        "note": "A4",
        "dur": 0.3
      },
      {
        "note": "G4",
        "dur": 0.5
      },
      {
        "note": "F4",
        "dur": 0.8
      }
    ],
    "cover": "/assets/music/covers/music_cover_pop-goes-the-weasel.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "All around the mulberry bush,",
        "translation": "Xoay tròn chiếc hộp nhạc theo điệu nhạc ngân nga"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "The monkey chased the weasel.",
        "translation": "Khỉ con đuổi theo chú chồn nhỏ quanh bụi dâu"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "The monkey thought 'twas all in fun,",
        "translation": "Khỉ con nghĩ trò chơi thật là vui nhộn"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "Pop! Goes the weasel!",
        "translation": "Bật tung nắp hộp: Bính boong chú chồn nhảy ra!"
      },
      {
        "startTimeSec": 28,
        "endTimeSec": 30.8,
        "text": "All around the mulberry bush,",
        "translation": "Xoay tròn chiếc hộp nhạc theo điệu nhạc ngân nga"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "The monkey chased the weasel.",
        "translation": "Khỉ con đuổi theo chú chồn nhỏ quanh bụi dâu"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "The monkey thought 'twas all in fun,",
        "translation": "Khỉ con nghĩ trò chơi thật là vui nhộn"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Pop! Goes the weasel!",
        "translation": "Bật tung nắp hộp: Bính boong chú chồn nhảy ra!"
      }
    ],
    "englishTranslation": [
      "Xoay tròn chiếc hộp nhạc theo điệu nhạc ngân nga",
      "Khỉ con đuổi theo chú chồn nhỏ quanh bụi dâu",
      "Khỉ con nghĩ trò chơi thật là vui nhộn",
      "Bật tung nắp hộp: Bính boong chú chồn nhảy ra!"
    ]
  },
  {
    "id": "hot-cross-buns",
    "title": "Hot Cross Buns",
    "subtitleEn": "One a penny, two a penny!",
    "category": "en_rhymes",
    "categoryLabelVi": "Nhạc Tiếng Anh · Bánh mì ngọt ngào",
    "ageBadge": "0–5 tuổi",
    "composer": "Children Songs International Choir",
    "emoji": "🥯",
    "colorHex": "#D97706",
    "bgGradient": "from-amber-500 to-orange-600",
    "tempo": 96,
    "melodyStyle": "gentle",
    "lyrics": [
      "Hot cross buns! Hot cross buns!",
      "One a penny, two a penny,",
      "Hot cross buns!",
      "If you have no daughters, give them to your sons,",
      "One a penny, two a penny, hot cross buns!"
    ],
    "funFactVi": "Giai điệu đồng dao về món bánh nướng thơm lừng truyền thống.",
    "audioUrl": "/assets/music/hot-cross-buns.mp3",
    "melodyNotes": [
      {
        "note": "B4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 1
      },
      {
        "note": "B4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 1
      },
      {
        "note": "G4",
        "dur": 0.25
      },
      {
        "note": "G4",
        "dur": 0.25
      },
      {
        "note": "G4",
        "dur": 0.25
      },
      {
        "note": "G4",
        "dur": 0.25
      },
      {
        "note": "A4",
        "dur": 0.25
      },
      {
        "note": "A4",
        "dur": 0.25
      },
      {
        "note": "A4",
        "dur": 0.25
      },
      {
        "note": "A4",
        "dur": 0.25
      },
      {
        "note": "B4",
        "dur": 0.5
      },
      {
        "note": "A4",
        "dur": 0.5
      },
      {
        "note": "G4",
        "dur": 1
      }
    ],
    "cover": "/assets/music/covers/music_cover_hot-cross-buns.webp",
    "isVocalTrack": true,
    "timedLyrics": [
      {
        "startTimeSec": 8,
        "endTimeSec": 10.8,
        "text": "Hot cross buns! Hot cross buns!",
        "translation": "Bánh nướng chữ thập thơm lừng, bánh nướng thơm lừng!"
      },
      {
        "startTimeSec": 11,
        "endTimeSec": 13.8,
        "text": "One a penny, two a penny,",
        "translation": "Một đồng một chiếc, hai đồng một chiếc"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 16.8,
        "text": "Hot cross buns!",
        "translation": "Nếu bạn không có con gái thì hãy mua cho con trai"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 19.8,
        "text": "If you have no daughters, give them to your sons,",
        "translation": "Bánh nướng chữ thập thơm ngon nóng hổi vừa ra lò!"
      },
      {
        "startTimeSec": 20,
        "endTimeSec": 22.8,
        "text": "One a penny, two a penny, hot cross buns!"
      },
      {
        "startTimeSec": 31,
        "endTimeSec": 33.8,
        "text": "Hot cross buns! Hot cross buns!",
        "translation": "Bánh nướng chữ thập thơm lừng, bánh nướng thơm lừng!"
      },
      {
        "startTimeSec": 34,
        "endTimeSec": 36.8,
        "text": "One a penny, two a penny,",
        "translation": "Một đồng một chiếc, hai đồng một chiếc"
      },
      {
        "startTimeSec": 37,
        "endTimeSec": 39.8,
        "text": "Hot cross buns!",
        "translation": "Nếu bạn không có con gái thì hãy mua cho con trai"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 42.8,
        "text": "If you have no daughters, give them to your sons,",
        "translation": "Bánh nướng chữ thập thơm ngon nóng hổi vừa ra lò!"
      },
      {
        "startTimeSec": 43,
        "endTimeSec": 45.8,
        "text": "One a penny, two a penny, hot cross buns!"
      }
    ],
    "englishTranslation": [
      "Bánh nướng chữ thập thơm lừng, bánh nướng thơm lừng!",
      "Một đồng một chiếc, hai đồng một chiếc",
      "Nếu bạn không có con gái thì hãy mua cho con trai",
      "Bánh nướng chữ thập thơm ngon nóng hổi vừa ra lò!"
    ]
  }
];
