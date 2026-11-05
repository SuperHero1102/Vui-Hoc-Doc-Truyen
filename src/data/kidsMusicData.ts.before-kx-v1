export interface LyricLine {
  start: number; // Thời gian bắt đầu (giây)
  end: number;   // Thời gian kết thúc (giây)
  vi: string;    // Lời bài hát tiếng Việt
  en?: string;   // Dịch tiếng Anh (tùy chọn)
}

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
  lyricsData?: LyricLine[]; // Dữ liệu lời mỗi bài là mảng [{start, end, vi, en}] (giây)
  englishTranslation?: string[];
  funFactVi: string;
  audioUrl?: string; // Bản thu âm thật có lời (nén mono 64kbps MP3)
  melodyNotes?: { note: string; dur: number }[]; // Note frequency representation for Web Audio player
  isVocalTrack?: boolean; // true: Ca sĩ hát, false: Nghe giai điệu
}

/**
 * Phân tích chuỗi định dạng LRC chuẩn [mm:ss.xx] thành mảng [{start, end, vi, en}]
 */
export function parseLRC(lrcContent: string, defaultTranslations: string[] = []): LyricLine[] {
  const lines = lrcContent.split('\n');
  const tempItems: { time: number; text: string }[] = [];
  const timeRegex = /\[(\d{2}):(\d{2}(?:\.\d{1,3})?)\]/g;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;
    let match;
    const timestamps: number[] = [];
    while ((match = timeRegex.exec(trimmed)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      timestamps.push(minutes * 60 + seconds);
    }
    const cleanText = trimmed.replace(timeRegex, '').trim();
    if (cleanText && timestamps.length > 0) {
      for (const t of timestamps) {
        tempItems.push({ time: t, text: cleanText });
      }
    }
  }

  tempItems.sort((a, b) => a.time - b.time);

  return tempItems.map((item, idx) => {
    const nextItem = tempItems[idx + 1];
    const end = nextItem ? nextItem.time : Number((item.time + 4.0).toFixed(2));
    return {
      start: Number(item.time.toFixed(2)),
      end: Number(end.toFixed(2)),
      vi: item.text,
      en: defaultTranslations[idx] || '',
    };
  });
}

export interface NormalizedLyricsResult {
  lines: LyricLine[];
  hasRealTimestamps: boolean;
}

/**
 * Chuẩn hóa lời bài hát thành mảng [{start, end, vi, en}] theo trình tự hát THẬT.
 * Nếu bài chưa có mốc thật, tuyệt đối không chia đều hay tự tạo số giả.
 */
export function normalizeSongLyricLines(song: KidsSong): NormalizedLyricsResult {
  if (song.lyricsData && song.lyricsData.length > 0) {
    const hasReal = song.lyricsData.some((l) => l.start > 0 || l.end > 0);
    if (hasReal) {
      const mapped = song.lyricsData.map((item, idx) => {
        const next = song.lyricsData![idx + 1];
        const end = next && next.start > item.start ? next.start : item.end;
        return {
          start: Number(item.start.toFixed(2)),
          end: Number(end.toFixed(2)),
          vi: item.vi,
          en: item.en || '',
        };
      });
      return { lines: mapped, hasRealTimestamps: true };
    }
  }

  if (song.timedLyrics && song.timedLyrics.length > 0) {
    const hasReal = song.timedLyrics.some((l) => l.startTimeSec > 0);
    if (hasReal) {
      const mapped = song.timedLyrics.map((item, idx) => {
        const next = song.timedLyrics![idx + 1];
        const start = item.startTimeSec;
        const end = next ? next.startTimeSec : (item.endTimeSec ?? start + 4.0);
        return {
          start: Number(start.toFixed(2)),
          end: Number(end.toFixed(2)),
          vi: item.text,
          en: item.translation || '',
        };
      });
      return { lines: mapped, hasRealTimestamps: true };
    }
  }

  // Bài chưa có mốc thật: trả về lời nguyên gốc, hasRealTimestamps = false (không tự bịa số)
  if (song.lyrics && song.lyrics.length > 0) {
    return {
      lines: song.lyrics.map((line, idx) => ({
        start: 0,
        end: 0,
        vi: line,
        en: song.englishTranslation?.[idx] || '',
      })),
      hasRealTimestamps: false,
    };
  }

  return { lines: [], hasRealTimestamps: false };
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
        "startTimeSec": 14.8,
        "endTimeSec": 18.8,
        "text": "Cháu lên ba cháu đi mẫu giáo",
        "translation": "I am three years old, I go to kindergarten"
      },
      {
        "startTimeSec": 19,
        "endTimeSec": 23,
        "text": "Cô thương cháu vì cháu không khóc nhè",
        "translation": "Teacher loves me because I don't cry"
      },
      {
        "startTimeSec": 23.2,
        "endTimeSec": 27.2,
        "text": "Không khóc nhè để mẹ trồng cây trái",
        "translation": "I don't cry so mother can grow fruit trees"
      },
      {
        "startTimeSec": 27.5,
        "endTimeSec": 31.5,
        "text": "Ba vào nhà máy ông bà vui cấy cày",
        "translation": "Father works in the factory, grandparents happily farm"
      },
      {
        "startTimeSec": 31.8,
        "endTimeSec": 35.8,
        "text": "La la la, là la la la!",
        "translation": "La la la, la la la la!"
      },
      {
        "startTimeSec": 36,
        "endTimeSec": 40,
        "text": "Cháu lên ba cháu đi mẫu giáo",
        "translation": "I am three years old, I go to kindergarten"
      },
      {
        "startTimeSec": 40.2,
        "endTimeSec": 44.2,
        "text": "Cô thương cháu vì cháu không khóc nhè",
        "translation": "Teacher loves me because I don't cry"
      },
      {
        "startTimeSec": 44.5,
        "endTimeSec": 48.5,
        "text": "Không khóc nhè để mẹ trồng cây trái",
        "translation": "I don't cry so mother can grow fruit trees"
      },
      {
        "startTimeSec": 48.8,
        "endTimeSec": 52.8,
        "text": "Ba vào nhà máy ông bà vui cấy cày",
        "translation": "Father works in the factory, grandparents happily farm"
      },
      {
        "startTimeSec": 53,
        "endTimeSec": 57,
        "text": "La la la, là la la la!",
        "translation": "La la la, la la la la!"
      },
      {
        "startTimeSec": 72,
        "endTimeSec": 76,
        "text": "Cháu lên ba cháu đi mẫu giáo",
        "translation": "I am three years old, I go to kindergarten"
      },
      {
        "startTimeSec": 76.2,
        "endTimeSec": 80.2,
        "text": "Cô thương cháu vì cháu không khóc nhè",
        "translation": "Teacher loves me because I don't cry"
      },
      {
        "startTimeSec": 80.5,
        "endTimeSec": 84.5,
        "text": "Không khóc nhè để mẹ trồng cây trái",
        "translation": "I don't cry so mother can grow fruit trees"
      },
      {
        "startTimeSec": 84.8,
        "endTimeSec": 88.8,
        "text": "Ba vào nhà máy ông bà vui cấy cày",
        "translation": "Father works in the factory, grandparents happily farm"
      },
      {
        "startTimeSec": 89,
        "endTimeSec": 93,
        "text": "La la la, là la la la!",
        "translation": "La la la, la la la la!"
      }
    ],
    "lyricsData": [
      { "start": 14.8, "end": 19.0, "vi": "Cháu lên ba cháu đi mẫu giáo", "en": "I am three years old, I go to kindergarten" },
      { "start": 19.0, "end": 23.2, "vi": "Cô thương cháu vì cháu không khóc nhè", "en": "Teacher loves me because I don't cry" },
      { "start": 23.2, "end": 27.5, "vi": "Không khóc nhè để mẹ trồng cây trái", "en": "I don't cry so mother can grow fruit trees" },
      { "start": 27.5, "end": 31.8, "vi": "Ba vào nhà máy ông bà vui cấy cày", "en": "Father works in the factory, grandparents happily farm" },
      { "start": 31.8, "end": 36.0, "vi": "La la la, là la la la!", "en": "La la la, la la la la!" },
      { "start": 36.0, "end": 40.2, "vi": "Cháu lên ba cháu đi mẫu giáo", "en": "I am three years old, I go to kindergarten" },
      { "start": 40.2, "end": 44.5, "vi": "Cô thương cháu vì cháu không khóc nhè", "en": "Teacher loves me because I don't cry" },
      { "start": 44.5, "end": 48.8, "vi": "Không khóc nhè để mẹ trồng cây trái", "en": "I don't cry so mother can grow fruit trees" },
      { "start": 48.8, "end": 53.0, "vi": "Ba vào nhà máy ông bà vui cấy cày", "en": "Father works in the factory, grandparents happily farm" },
      { "start": 53.0, "end": 72.0, "vi": "La la la, là la la la!", "en": "La la la, la la la la!" },
      { "start": 72.0, "end": 76.2, "vi": "Cháu lên ba cháu đi mẫu giáo", "en": "I am three years old, I go to kindergarten" },
      { "start": 76.2, "end": 80.5, "vi": "Cô thương cháu vì cháu không khóc nhè", "en": "Teacher loves me because I don't cry" },
      { "start": 80.5, "end": 84.8, "vi": "Không khóc nhè để mẹ trồng cây trái", "en": "I don't cry so mother can grow fruit trees" },
      { "start": 84.8, "end": 89.0, "vi": "Ba vào nhà máy ông bà vui cấy cày", "en": "Father works in the factory, grandparents happily farm" },
      { "start": 89.0, "end": 93.0, "vi": "La la la, là la la la!", "en": "La la la, la la la la!" }
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
    "isVocalTrack": true,
    "englishTranslation": [
      "The very first day going to school",
      "Mother held my hand, I cried softly",
      "Teacher caressed my head comforting me",
      "Now grown up, I fondly remember that gentle day!"
    ],
    "audioUrl": "/assets/music/ngay-dau-tien-di-hoc.mp3"
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
    "englishTranslation": [
      "Sunny morning birds chirp in the branches",
      "I put on my backpack and walk to class",
      "Teacher welcomes me with open loving arms",
      "Preschool is my joyful second home!"
    ],
    "audioUrl": "/assets/music/em-di-mau-giao.mp3"
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
    "englishTranslation": [
      "Goodbye lovely doll, goodbye cute teddy bear",
      "Goodbye yellow birdie, now I enter grade one",
      "I will remember my dear kindergarten school",
      "Carrying sweet memories into grade one!"
    ],
    "audioUrl": "/assets/music/tam-biet-bup-be.mp3"
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
    "isVocalTrack": true,
    "englishTranslation": [
      "Star lantern with five colorful glowing points",
      "Holding lantern high on Mid-Autumn night",
      "Tung rinh rinh, drums beat under full moon",
      "Children singing and dancing under bright moonlight!"
    ],
    "audioUrl": "/assets/music/chiec-den-ong-sao.mp3"
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
    "englishTranslation": [
      "This earth belongs to all of us children",
      "Golden fruit of peace, shining sun of hope",
      "White doves flying across the blue sky",
      "Singing for a peaceful and loving world!"
    ],
    "audioUrl": "/assets/music/trai-dat-nay-la-cua-chung-minh.mp3"
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
        "startTimeSec": 1.8,
        "endTimeSec": 4.8,
        "text": "A - B - C - D - E - F - G",
        "translation": "Chữ cái A B C D E F G"
      },
      {
        "startTimeSec": 5,
        "endTimeSec": 8.5,
        "text": "H - I - J - K - L - M - N - O - P",
        "translation": "Chữ cái H I J K L M N O P"
      },
      {
        "startTimeSec": 8.8,
        "endTimeSec": 12.2,
        "text": "Q - R - S, T - U - V",
        "translation": "Chữ cái Q R S, T U V"
      },
      {
        "startTimeSec": 12.5,
        "endTimeSec": 16.5,
        "text": "W - X, Y and Z",
        "translation": "Chữ cái W X, Y và Z"
      },
      {
        "startTimeSec": 17,
        "endTimeSec": 22.5,
        "text": "Now I know my ABCs, next time won't you sing with me?",
        "translation": "Bây giờ bé đã thuộc bảng chữ cái rồi đấy!"
      },
      {
        "startTimeSec": 35.8,
        "endTimeSec": 39.5,
        "text": "A - B - C - D - E - F - G",
        "translation": "Chữ cái A B C D E F G"
      },
      {
        "startTimeSec": 40,
        "endTimeSec": 43.5,
        "text": "H - I - J - K - L - M - N - O - P",
        "translation": "Chữ cái H I J K L M N O P"
      },
      {
        "startTimeSec": 44,
        "endTimeSec": 47.5,
        "text": "Q - R - S, T - U - V",
        "translation": "Chữ cái Q R S, T U V"
      },
      {
        "startTimeSec": 48,
        "endTimeSec": 52,
        "text": "W - X, Y and Z",
        "translation": "Chữ cái W X, Y và Z"
      },
      {
        "startTimeSec": 52.5,
        "endTimeSec": 61.5,
        "text": "Now I know my ABCs, 26 letters from A to Z!",
        "translation": "26 chữ cái tiếng Anh bé đã thuộc làu!"
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
        "startTimeSec": 5.8,
        "endTimeSec": 10.2,
        "text": "Row, row, row your boat",
        "translation": "Chèo chèo chèo con thuyền nhỏ xuôi dòng êm ả"
      },
      {
        "startTimeSec": 10.3,
        "endTimeSec": 14.8,
        "text": "Gently down the stream,",
        "translation": "Thật nhẹ nhàng, thật dịu dàng, cuộc đời tựa giấc mơ"
      },
      {
        "startTimeSec": 14.9,
        "endTimeSec": 19.5,
        "text": "Merrily, merrily, merrily, merrily,",
        "translation": "Chèo chèo chèo con thuyền nhỏ ngắm nhìn dòng suối"
      },
      {
        "startTimeSec": 19.6,
        "endTimeSec": 24.8,
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
        "startTimeSec": 1,
        "endTimeSec": 5.5,
        "text": "Rain, rain, go away",
        "translation": "Mưa ơi mưa ơi xin hãy bay đi xa"
      },
      {
        "startTimeSec": 5.8,
        "endTimeSec": 10.5,
        "text": "Come again another day",
        "translation": "Hẹn ngày khác hãy quay lại đây nhé"
      },
      {
        "startTimeSec": 10.8,
        "endTimeSec": 15.5,
        "text": "Little Johnny wants to play",
        "translation": "Bé con Johnny đang muốn ra ngoài chơi đùa"
      },
      {
        "startTimeSec": 15.8,
        "endTimeSec": 20.8,
        "text": "Rain, rain, go away",
        "translation": "Mưa ơi mưa ơi xin hãy bay đi xa nhé"
      },
      {
        "startTimeSec": 23.8,
        "endTimeSec": 28.5,
        "text": "Rain, rain, go away",
        "translation": "Mưa ơi mưa ơi xin hãy bay đi xa"
      },
      {
        "startTimeSec": 28.8,
        "endTimeSec": 33.5,
        "text": "Come again another day",
        "translation": "Hẹn ngày khác hãy quay lại đây nhé"
      },
      {
        "startTimeSec": 33.8,
        "endTimeSec": 38.5,
        "text": "Little Johnny wants to play",
        "translation": "Bé con Johnny đang muốn ra ngoài chơi đùa"
      },
      {
        "startTimeSec": 38.8,
        "endTimeSec": 43.5,
        "text": "Rain, rain, go away",
        "translation": "Mưa ơi mưa ơi xin hãy bay đi xa nhé"
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
        "startTimeSec": 5.5,
        "endTimeSec": 9.2,
        "text": "Hickory, dickory, dock,",
        "translation": "Tích tắc tích tắc tiếng chuông đồng hồ reo"
      },
      {
        "startTimeSec": 9.5,
        "endTimeSec": 13.8,
        "text": "The mouse ran up the clock.",
        "translation": "Chú chuột nhắt tinh nghịch trèo lên đồng hồ"
      },
      {
        "startTimeSec": 14,
        "endTimeSec": 18.2,
        "text": "The clock struck one,",
        "translation": "Đồng hồ điểm đúng một giờ vang vang"
      },
      {
        "startTimeSec": 18.5,
        "endTimeSec": 22.5,
        "text": "The mouse ran down,",
        "translation": "Chú chuột vội vàng chạy thụt lùi xuống ngay"
      },
      {
        "startTimeSec": 22.8,
        "endTimeSec": 27.5,
        "text": "Hickory, dickory, dock.",
        "translation": "Tích tắc tích tắc đồng hồ gõ nhịp đều đều"
      },
      {
        "startTimeSec": 41.5,
        "endTimeSec": 45.2,
        "text": "Hickory, dickory, dock,",
        "translation": "Tích tắc tích tắc tiếng chuông đồng hồ reo"
      },
      {
        "startTimeSec": 45.5,
        "endTimeSec": 49.8,
        "text": "The mouse ran up the clock.",
        "translation": "Chú chuột nhắt tinh nghịch trèo lên đồng hồ"
      },
      {
        "startTimeSec": 50,
        "endTimeSec": 54.2,
        "text": "The clock struck two,",
        "translation": "Đồng hồ điểm đúng hai giờ reo vang"
      },
      {
        "startTimeSec": 54.5,
        "endTimeSec": 58.5,
        "text": "And down he flew,",
        "translation": "Chú chuột nhảy vọt xuống sàn thật nhanh"
      },
      {
        "startTimeSec": 58.8,
        "endTimeSec": 63.5,
        "text": "Hickory, dickory, dock.",
        "translation": "Tích tắc tích tắc nhịp gõ vui tai"
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
        "startTimeSec": 0.2,
        "endTimeSec": 4,
        "text": "Three little kittens, they lost their mittens",
        "translation": "Ba chú mèo con làm rơi mất đôi găng tay"
      },
      {
        "startTimeSec": 4.1,
        "endTimeSec": 7.2,
        "text": "And they began to cry,",
        "translation": "Và các bạn ấy bắt đầu khóc thút thít"
      },
      {
        "startTimeSec": 7.3,
        "endTimeSec": 11,
        "text": "\"Oh, mother dear, we sadly fear",
        "translation": "Mẹ yêu ơi, chúng con buồn bã sợ rằng"
      },
      {
        "startTimeSec": 11.1,
        "endTimeSec": 14.5,
        "text": "Our mittens we have lost!\"",
        "translation": "Đôi găng tay ấm đã rơi mất rồi!"
      },
      {
        "startTimeSec": 14.6,
        "endTimeSec": 18.2,
        "text": "\"What! Lost your mittens, you naughty kittens!",
        "translation": "Sao cơ! Mất găng tay à, mấy chú mèo con nghịch ngợm!"
      },
      {
        "startTimeSec": 18.3,
        "endTimeSec": 22,
        "text": "Then you shall have no pie!\"",
        "translation": "Thế thì các con sẽ không được thưởng bánh nướng đâu nhé!"
      },
      {
        "startTimeSec": 22.1,
        "endTimeSec": 26,
        "text": "\"Mee-ow, mee-ow, mee-ow, mee-ow!\"",
        "translation": "Meo meo, meo meo ngoan ngoãn xin lỗi mẹ!"
      },
      {
        "startTimeSec": 26.1,
        "endTimeSec": 29.2,
        "text": "\"Then you shall have no pie!\"",
        "translation": "Thế thì các con sẽ không được bánh đâu!"
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
        "startTimeSec": 0.9,
        "endTimeSec": 4.2,
        "text": "All around the mulberry bush",
        "translation": "Dạo quanh bụi dâu tằm râm mát"
      },
      {
        "startTimeSec": 4.3,
        "endTimeSec": 7.8,
        "text": "The monkey chased the weasel;",
        "translation": "Chú khỉ tinh nghịch đuổi theo chú chồn"
      },
      {
        "startTimeSec": 7.9,
        "endTimeSec": 11.2,
        "text": "The monkey thought 'twas all in fun,",
        "translation": "Khỉ con nghĩ rằng trò chơi thật vui nhộn"
      },
      {
        "startTimeSec": 11.3,
        "endTimeSec": 14.8,
        "text": "Pop! goes the weasel.",
        "translation": "Bốp! Chú chồn nhảy vọt qua rào!"
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
    "englishTranslation": [
      "Bánh nướng chữ thập thơm lừng, bánh nướng thơm lừng!",
      "Một đồng một chiếc, hai đồng một chiếc",
      "Nếu bạn không có con gái thì hãy mua cho con trai",
      "Bánh nướng chữ thập thơm ngon nóng hổi vừa ra lò!"
    ]
  }
];
