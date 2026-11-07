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
  durationSec?: number; // Thời lượng bài hát tính bằng giây
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
  // Bài không có bản thu audioUrl hoặc bản thu chỉ có nhạc cụ không lời: hiển thị lời tĩnh, không tích, không hiệu ứng
  if (!song.audioUrl || song.id === 'three-little-kittens') {
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

  if (song.lyricsData && song.lyricsData.length > 0) {
    const hasReal = song.lyricsData.some((l) => l.start > 0 || l.end > 0);
    const distinctStarts = new Set(song.lyricsData.map((l) => l.start));
    if (hasReal && distinctStarts.size > 1) {
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
    const distinctStarts = new Set(song.timedLyrics.map((l) => l.startTimeSec));
    if (hasReal && distinctStarts.size > 1) {
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

  // Bài chưa có mốc thật hoặc các mốc trùng nhau / đều bằng 0: hiển thị lời tĩnh, hasRealTimestamps = false
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
    "durationSec": 120,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Cháu lên ba, cháu đi mẫu giáo.",
      "Cô thương lắm, chứ không khóc nhè.",
      "Không khóc nhè, để mẹ trong tay trái.",
      "Ba vào nhà máy, ông bà vui cấy cây.",
      "La la la la la la la la la.",
      "Cháu lên ba, cháu đi mẫu giáo.",
      "Cô thương lắm, chứ không khóc nhè.",
      "Không khóc nhè, để mẹ trong tay trái.",
      "Ba vào nhà máy, ông bà vui cấy cây. La la la la la la la la la.",
      "Cháu lên ba, cháu đi mẫu giáo.",
      "Cô thương lắm, chứ không khóc nhè.",
      "Không khóc nhè, để mẹ trong tay trái.",
      "Ba vào nhà máy, ông bà vui cấy cây.",
      "La la la la la la la la la.",
      "Cháu lên ba, cháu đi mẫu giáo.",
      "Cô thương lắm, chứ không khóc nhè.",
      "Không khóc nhè, để mẹ trong tay trái.",
      "Ba vào nhà máy, ông bà vui cấy cây. La la la la la la la la la."
    ],
    "lyricsData": [
      {
        "start": 10.95,
        "end": 15.5,
        "vi": "Cháu lên ba, cháu đi mẫu giáo.",
        "en": "I go to kindergarten when I am three years old."
      },
      {
        "start": 15.35,
        "end": 20.0,
        "vi": "Cô thương lắm, chứ không khóc nhè.",
        "en": "The teacher loves me so much, and I don't cry."
      },
      {
        "start": 19.85,
        "end": 24.2,
        "vi": "Không khóc nhè, để mẹ trong tay trái.",
        "en": "I don't cry, so my mom can hold my left hand."
      },
      {
        "start": 24.05,
        "end": 28.5,
        "vi": "Ba vào nhà máy, ông bà vui cấy cây.",
        "en": "Dad goes to the factory, grandparents are happy farming."
      },
      {
        "start": 28.35,
        "end": 32.9,
        "vi": "La la la la la la la la la.",
        "en": "La la la la la la la la la."
      },
      {
        "start": 32.75,
        "end": 37.4,
        "vi": "Cháu lên ba, cháu đi mẫu giáo.",
        "en": "I go to kindergarten when I am three years old."
      },
      {
        "start": 37.25,
        "end": 41.8,
        "vi": "Cô thương lắm, chứ không khóc nhè.",
        "en": "The teacher loves me so much, and I don't cry."
      },
      {
        "start": 41.65,
        "end": 46.0,
        "vi": "Không khóc nhè, để mẹ trong tay trái.",
        "en": "I don't cry, so my mom can hold my left hand."
      },
      {
        "start": 45.85,
        "end": 53.4,
        "vi": "Ba vào nhà máy, ông bà vui cấy cây. La la la la la la la la la.",
        "en": "Dad goes to the factory, grandparents are happy farming. La la la la la la la la la."
      },
      {
        "start": 64.95,
        "end": 69.6,
        "vi": "Cháu lên ba, cháu đi mẫu giáo.",
        "en": "I go to kindergarten when I am three years old."
      },
      {
        "start": 69.45,
        "end": 74.0,
        "vi": "Cô thương lắm, chứ không khóc nhè.",
        "en": "The teacher loves me so much, and I don't cry."
      },
      {
        "start": 73.85,
        "end": 78.2,
        "vi": "Không khóc nhè, để mẹ trong tay trái.",
        "en": "I don't cry, so my mom can hold my left hand."
      },
      {
        "start": 78.05,
        "end": 82.5,
        "vi": "Ba vào nhà máy, ông bà vui cấy cây.",
        "en": "Dad goes to the factory, grandparents are happy farming."
      },
      {
        "start": 82.35,
        "end": 86.9,
        "vi": "La la la la la la la la la.",
        "en": "La la la la la la la la la."
      },
      {
        "start": 86.75,
        "end": 91.4,
        "vi": "Cháu lên ba, cháu đi mẫu giáo.",
        "en": "I go to kindergarten when I am three years old."
      },
      {
        "start": 91.25,
        "end": 95.8,
        "vi": "Cô thương lắm, chứ không khóc nhè.",
        "en": "The teacher loves me so much, and I don't cry."
      },
      {
        "start": 95.65,
        "end": 100.0,
        "vi": "Không khóc nhè, để mẹ trong tay trái.",
        "en": "I don't cry, so my mom can hold my left hand."
      },
      {
        "start": 99.85,
        "end": 107.4,
        "vi": "Ba vào nhà máy, ông bà vui cấy cây. La la la la la la la la la.",
        "en": "Dad goes to the factory, grandparents are happy farming. La la la la la la la la la."
      }
    ],
    "englishTranslation": [
      "I go to kindergarten when I am three years old.",
      "The teacher loves me so much, and I don't cry.",
      "I don't cry, so my mom can hold my left hand.",
      "Dad goes to the factory, grandparents are happy farming.",
      "La la la la la la la la la.",
      "I go to kindergarten when I am three years old.",
      "The teacher loves me so much, and I don't cry.",
      "I don't cry, so my mom can hold my left hand.",
      "Dad goes to the factory, grandparents are happy farming. La la la la la la la la la.",
      "I go to kindergarten when I am three years old.",
      "The teacher loves me so much, and I don't cry.",
      "I don't cry, so my mom can hold my left hand.",
      "Dad goes to the factory, grandparents are happy farming.",
      "La la la la la la la la la.",
      "I go to kindergarten when I am three years old.",
      "The teacher loves me so much, and I don't cry.",
      "I don't cry, so my mom can hold my left hand.",
      "Dad goes to the factory, grandparents are happy farming. La la la la la la la la la."
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
    "isVocalTrack": true
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
    "durationSec": 206,
    "melodyStyle": "playful",
    "lyrics": [
      "nhạc",
      "Leo trèo rồi mang nón mèo",
      "Sâu sâu lắm chẳng được mẹ yêu",
      "Thân măng đẩu mà ngồi liêm la",
      "Đâu mang rồi lại không meo meo",
      "nhạc",
      "Leo trèo rồi mang nón mèo",
      "Sâu sâu lắm chẳng được mẹ yêu",
      "Thân măng đẩu mà ngồi liêm la",
      "Đâu mang rồi lại không meo meo",
      "nhạc",
      "Leo trèo rồi mang nón mèo",
      "Sâu sâu lắm chẳng được mẹ yêu",
      "Thân măng đẩu mà ngồi liêm la",
      "Đâu mang rồi lại không meo meo",
      "nhạc",
      "Leo trèo rồi mang nón mèo",
      "Sâu sâu lắm chẳng được mẹ yêu",
      "Thân măng đẩu mà ngồi liêm la",
      "Đâu mang rồi lại không meo meo",
      "nhạc",
      "Leo trèo rồi mang nón mèo",
      "Sâu sâu lắm chẳng được mẹ yêu",
      "Thân măng đẩu mà ngồi liêm la",
      "Đâu mang rồi lại không meo meo",
      "nhạc",
      "Leo trèo rồi mang nón mèo",
      "Sâu sâu lắm chẳng được mẹ yêu",
      "Thân măng đẩu mà ngồi liêm la",
      "Đâu mang rồi lại không meo meo"
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 36.4,
        "vi": "nhạc",
        "en": "music"
      },
      {
        "start": 36.25,
        "end": 40.4,
        "vi": "Leo trèo rồi mang nón mèo",
        "en": "Climbing up, wearing cat hat"
      },
      {
        "start": 40.25,
        "end": 44.8,
        "vi": "Sâu sâu lắm chẳng được mẹ yêu",
        "en": "So very deep, mother doesn't love"
      },
      {
        "start": 44.65,
        "end": 49.2,
        "vi": "Thân măng đẩu mà ngồi liêm la",
        "en": "Bamboo stem body sitting secretly"
      },
      {
        "start": 49.05,
        "end": 54.4,
        "vi": "Đâu mang rồi lại không meo meo",
        "en": "Where did it go, then not meow meow"
      },
      {
        "start": 54.25,
        "end": 58.2,
        "vi": "nhạc",
        "en": "music"
      },
      {
        "start": 58.05,
        "end": 62.1,
        "vi": "Leo trèo rồi mang nón mèo",
        "en": "Climbing up, wearing cat hat"
      },
      {
        "start": 61.95,
        "end": 66.6,
        "vi": "Sâu sâu lắm chẳng được mẹ yêu",
        "en": "So very deep, mother doesn't love"
      },
      {
        "start": 66.45,
        "end": 71.1,
        "vi": "Thân măng đẩu mà ngồi liêm la",
        "en": "Bamboo stem body sitting secretly"
      },
      {
        "start": 70.95,
        "end": 76.1,
        "vi": "Đâu mang rồi lại không meo meo",
        "en": "Where did it go, then not meow meow"
      },
      {
        "start": 75.95,
        "end": 80.5,
        "vi": "nhạc",
        "en": "music"
      },
      {
        "start": 80.35,
        "end": 84.4,
        "vi": "Leo trèo rồi mang nón mèo",
        "en": "Climbing up, wearing cat hat"
      },
      {
        "start": 84.25,
        "end": 88.9,
        "vi": "Sâu sâu lắm chẳng được mẹ yêu",
        "en": "So very deep, mother doesn't love"
      },
      {
        "start": 88.75,
        "end": 93.4,
        "vi": "Thân măng đẩu mà ngồi liêm la",
        "en": "Bamboo stem body sitting secretly"
      },
      {
        "start": 93.25,
        "end": 98.2,
        "vi": "Đâu mang rồi lại không meo meo",
        "en": "Where did it go, then not meow meow"
      },
      {
        "start": 98.05,
        "end": 138.0,
        "vi": "nhạc",
        "en": "music"
      },
      {
        "start": 137.85,
        "end": 142.2,
        "vi": "Leo trèo rồi mang nón mèo",
        "en": "Climbing up, wearing cat hat"
      },
      {
        "start": 142.05,
        "end": 146.7,
        "vi": "Sâu sâu lắm chẳng được mẹ yêu",
        "en": "So very deep, mother doesn't love"
      },
      {
        "start": 146.55,
        "end": 151.2,
        "vi": "Thân măng đẩu mà ngồi liêm la",
        "en": "Bamboo stem body sitting secretly"
      },
      {
        "start": 151.05,
        "end": 156.1,
        "vi": "Đâu mang rồi lại không meo meo",
        "en": "Where did it go, then not meow meow"
      },
      {
        "start": 155.95,
        "end": 160.2,
        "vi": "nhạc",
        "en": "music"
      },
      {
        "start": 160.05,
        "end": 164.2,
        "vi": "Leo trèo rồi mang nón mèo",
        "en": "Climbing up, wearing cat hat"
      },
      {
        "start": 164.05,
        "end": 168.8,
        "vi": "Sâu sâu lắm chẳng được mẹ yêu",
        "en": "So very deep, mother doesn't love"
      },
      {
        "start": 168.65,
        "end": 173.3,
        "vi": "Thân măng đẩu mà ngồi liêm la",
        "en": "Bamboo stem body sitting secretly"
      },
      {
        "start": 173.15,
        "end": 178.2,
        "vi": "Đâu mang rồi lại không meo meo",
        "en": "Where did it go, then not meow meow"
      },
      {
        "start": 178.05,
        "end": 182.2,
        "vi": "nhạc",
        "en": "music"
      },
      {
        "start": 182.05,
        "end": 186.3,
        "vi": "Leo trèo rồi mang nón mèo",
        "en": "Climbing up, wearing cat hat"
      },
      {
        "start": 186.15,
        "end": 190.9,
        "vi": "Sâu sâu lắm chẳng được mẹ yêu",
        "en": "So very deep, mother doesn't love"
      },
      {
        "start": 190.75,
        "end": 195.3,
        "vi": "Thân măng đẩu mà ngồi liêm la",
        "en": "Bamboo stem body sitting secretly"
      },
      {
        "start": 195.15,
        "end": 205.0,
        "vi": "Đâu mang rồi lại không meo meo",
        "en": "Where did it go, then not meow meow"
      }
    ],
    "englishTranslation": [
      "music",
      "Climbing up, wearing cat hat",
      "So very deep, mother doesn't love",
      "Bamboo stem body sitting secretly",
      "Where did it go, then not meow meow",
      "music",
      "Climbing up, wearing cat hat",
      "So very deep, mother doesn't love",
      "Bamboo stem body sitting secretly",
      "Where did it go, then not meow meow",
      "music",
      "Climbing up, wearing cat hat",
      "So very deep, mother doesn't love",
      "Bamboo stem body sitting secretly",
      "Where did it go, then not meow meow",
      "music",
      "Climbing up, wearing cat hat",
      "So very deep, mother doesn't love",
      "Bamboo stem body sitting secretly",
      "Where did it go, then not meow meow",
      "music",
      "Climbing up, wearing cat hat",
      "So very deep, mother doesn't love",
      "Bamboo stem body sitting secretly",
      "Where did it go, then not meow meow",
      "music",
      "Climbing up, wearing cat hat",
      "So very deep, mother doesn't love",
      "Bamboo stem body sitting secretly",
      "Where did it go, then not meow meow"
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
    "isVocalTrack": true
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
    "durationSec": 150,
    "melodyStyle": "gentle",
    "lyrics": [
      "Ai hỏi cháu, cháu học trường nào đây?",
      "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
      "Ai hỏi cháu, cháu học trường nào đây?",
      "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
      "Ai hỏi cháu, cháu học trường nào đây?",
      "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
      "Ai hỏi cháu, cháu học trường nào đây?",
      "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
      "Ai hỏi cháu, cháu học trường nào đây?",
      "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
      "Ai hỏi cháu, cháu học trường nào đây?",
      "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non."
    ],
    "lyricsData": [
      {
        "start": 16.65,
        "end": 24.4,
        "vi": "Ai hỏi cháu, cháu học trường nào đây?",
        "en": "Who asks grandchild, which school do you study at?"
      },
      {
        "start": 24.25,
        "end": 33.7,
        "vi": "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
        "en": "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten."
      },
      {
        "start": 33.55,
        "end": 41.9,
        "vi": "Ai hỏi cháu, cháu học trường nào đây?",
        "en": "Who asks grandchild, which school do you study at?"
      },
      {
        "start": 41.75,
        "end": 50.9,
        "vi": "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
        "en": "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten."
      },
      {
        "start": 59.65,
        "end": 67.7,
        "vi": "Ai hỏi cháu, cháu học trường nào đây?",
        "en": "Who asks grandchild, which school do you study at?"
      },
      {
        "start": 67.55,
        "end": 77.1,
        "vi": "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
        "en": "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten."
      },
      {
        "start": 76.95,
        "end": 85.1,
        "vi": "Ai hỏi cháu, cháu học trường nào đây?",
        "en": "Who asks grandchild, which school do you study at?"
      },
      {
        "start": 84.95,
        "end": 94.1,
        "vi": "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
        "en": "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten."
      },
      {
        "start": 103.45,
        "end": 111.6,
        "vi": "Ai hỏi cháu, cháu học trường nào đây?",
        "en": "Who asks grandchild, which school do you study at?"
      },
      {
        "start": 111.45,
        "end": 120.6,
        "vi": "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
        "en": "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten."
      },
      {
        "start": 120.45,
        "end": 128.5,
        "vi": "Ai hỏi cháu, cháu học trường nào đây?",
        "en": "Who asks grandchild, which school do you study at?"
      },
      {
        "start": 128.35,
        "end": 149.6,
        "vi": "Bé vừa ngoan lại múa hát thật hay. Cô là mẹ và các cháu là con, trường của cháu đây là trường mầm non.",
        "en": "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten."
      }
    ],
    "englishTranslation": [
      "Who asks grandchild, which school do you study at?",
      "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten.",
      "Who asks grandchild, which school do you study at?",
      "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten.",
      "Who asks grandchild, which school do you study at?",
      "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten.",
      "Who asks grandchild, which school do you study at?",
      "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten.",
      "Who asks grandchild, which school do you study at?",
      "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten.",
      "Who asks grandchild, which school do you study at?",
      "The baby is both good and dances and sings very well. The teacher is the mother and the grandchildren are the children, this school of mine is a kindergarten."
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
    "isVocalTrack": false
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
    "lyricsData": [
      { "start": 16.35, "end": 20.5, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks me which school I go to?" },
      { "start": 20.35, "end": 24.7, "vi": "Bé vừa ngoan lại múa hát thật hay.", "en": "I'm well-behaved and sing and dance so well." },
      { "start": 24.55, "end": 29.0, "vi": "Cô là mẹ và các cháu là con.", "en": "Teacher is like a mother and we are her children." },
      { "start": 28.85, "end": 34.0, "vi": "Trường của cháu đây là trường mầm non.", "en": "My school here is kindergarten." },
      { "start": 33.85, "end": 37.8, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks me which school I go to?" },
      { "start": 37.65, "end": 42.2, "vi": "Bé vừa ngoan lại múa hát thật hay.", "en": "I'm well-behaved and sing and dance so well." },
      { "start": 42.05, "end": 46.5, "vi": "Cô là mẹ và các cháu là con.", "en": "Teacher is like a mother and we are her children." },
      { "start": 46.35, "end": 51.5, "vi": "Trường của cháu đây là trường mầm non.", "en": "My school here is kindergarten." },
      { "start": 59.85, "end": 64.0, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks me which school I go to?" },
      { "start": 63.85, "end": 68.2, "vi": "Bé vừa ngoan lại múa hát thật hay.", "en": "I'm well-behaved and sing and dance so well." },
      { "start": 68.05, "end": 72.7, "vi": "Cô là mẹ và các cháu là con.", "en": "Teacher is like a mother and we are her children." },
      { "start": 72.55, "end": 77.3, "vi": "Trường của cháu đây là trường mầm non.", "en": "My school here is kindergarten." },
      { "start": 77.15, "end": 81.3, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks me which school I go to?" },
      { "start": 81.15, "end": 85.6, "vi": "Bé vừa ngoan lại múa hát thật hay.", "en": "I'm well-behaved and sing and dance so well." },
      { "start": 85.45, "end": 89.9, "vi": "Cô là mẹ và các cháu là con.", "en": "Teacher is like a mother and we are her children." },
      { "start": 89.75, "end": 95.0, "vi": "Trường của cháu đây là trường mầm non.", "en": "My school here is kindergarten." },
      { "start": 103.45, "end": 107.4, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks me which school I go to?" },
      { "start": 107.25, "end": 111.6, "vi": "Bé vừa ngoan lại múa hát thật hay.", "en": "I'm well-behaved and sing and dance so well." },
      { "start": 111.45, "end": 116.0, "vi": "Cô là mẹ và các cháu là con.", "en": "Teacher is like a mother and we are her children." },
      { "start": 115.85, "end": 120.8, "vi": "Trường của cháu đây là trường mầm non.", "en": "My school here is kindergarten." },
      { "start": 120.65, "end": 124.8, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks me which school I go to?" },
      { "start": 124.65, "end": 129.1, "vi": "Bé vừa ngoan lại múa hát thật hay.", "en": "I'm well-behaved and sing and dance so well." },
      { "start": 128.95, "end": 133.4, "vi": "Cô là mẹ và các cháu là con.", "en": "Teacher is like a mother and we are her children." },
      { "start": 133.25, "end": 138.5, "vi": "Trường của cháu đây là trường mầm non.", "en": "My school here is kindergarten." }
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
    "durationSec": 167,
    "melodyStyle": "playful",
    "lyrics": [
      "Con cò bé bé, nó đậu cành tre.",
      "Đi thăm hỏi mẹ, biết đây đường nào?",
      "Hết đây em hỏi, hết về em chào.",
      "Miền em chim chíp, mẹ có yêu không nào?",
      "Con cò bé bé, nó đậu cành tre.",
      "Đi thăm hỏi mẹ, biết đây đường nào?",
      "Hết đây em hỏi, hết về em chào.",
      "Miền em chim chíp, mẹ có yêu không nào?",
      "Con cò bé bé, nó đậu cành tre.",
      "Đi thăm hỏi mẹ, biết đây đường nào?",
      "Hết đây em hỏi, hết về em chào.",
      "Miền em chim chíp, mẹ có yêu không nào?",
      "Con cò bé bé, nó đậu cành tre.",
      "Đi thăm hỏi mẹ, biết đây đường nào?",
      "Hết đây em hỏi, hết về em chào.",
      "Miền em chim chíp, mẹ có yêu không nào?",
      "Miền em chim chíp, mẹ có yêu không nào?"
    ],
    "lyricsData": [
      {
        "start": 26.35,
        "end": 32.4,
        "vi": "Con cò bé bé, nó đậu cành tre.",
        "en": "Little stork, it lands on a bamboo branch."
      },
      {
        "start": 32.25,
        "end": 37.3,
        "vi": "Đi thăm hỏi mẹ, biết đây đường nào?",
        "en": "Visiting and asking about mother, do you know the way here?"
      },
      {
        "start": 37.15,
        "end": 43.0,
        "vi": "Hết đây em hỏi, hết về em chào.",
        "en": "Done here I ask, done going I greet."
      },
      {
        "start": 42.85,
        "end": 48.3,
        "vi": "Miền em chim chíp, mẹ có yêu không nào?",
        "en": "My little birds chirp, does mother love them?"
      },
      {
        "start": 53.25,
        "end": 58.7,
        "vi": "Con cò bé bé, nó đậu cành tre.",
        "en": "Little stork, it lands on a bamboo branch."
      },
      {
        "start": 58.55,
        "end": 63.9,
        "vi": "Đi thăm hỏi mẹ, biết đây đường nào?",
        "en": "Visiting and asking about mother, do you know the way here?"
      },
      {
        "start": 63.75,
        "end": 69.3,
        "vi": "Hết đây em hỏi, hết về em chào.",
        "en": "Done here I ask, done going I greet."
      },
      {
        "start": 69.15,
        "end": 74.6,
        "vi": "Miền em chim chíp, mẹ có yêu không nào?",
        "en": "My little birds chirp, does mother love them?"
      },
      {
        "start": 103.55,
        "end": 109.5,
        "vi": "Con cò bé bé, nó đậu cành tre.",
        "en": "Little stork, it lands on a bamboo branch."
      },
      {
        "start": 109.35,
        "end": 114.6,
        "vi": "Đi thăm hỏi mẹ, biết đây đường nào?",
        "en": "Visiting and asking about mother, do you know the way here?"
      },
      {
        "start": 114.45,
        "end": 120.1,
        "vi": "Hết đây em hỏi, hết về em chào.",
        "en": "Done here I ask, done going I greet."
      },
      {
        "start": 119.95,
        "end": 124.9,
        "vi": "Miền em chim chíp, mẹ có yêu không nào?",
        "en": "My little birds chirp, does mother love them?"
      },
      {
        "start": 130.35,
        "end": 136.3,
        "vi": "Con cò bé bé, nó đậu cành tre.",
        "en": "Little stork, it lands on a bamboo branch."
      },
      {
        "start": 136.15,
        "end": 141.0,
        "vi": "Đi thăm hỏi mẹ, biết đây đường nào?",
        "en": "Visiting and asking about mother, do you know the way here?"
      },
      {
        "start": 140.85,
        "end": 146.5,
        "vi": "Hết đây em hỏi, hết về em chào.",
        "en": "Done here I ask, done going I greet."
      },
      {
        "start": 146.35,
        "end": 150.5,
        "vi": "Miền em chim chíp, mẹ có yêu không nào?",
        "en": "My little birds chirp, does mother love them?"
      },
      {
        "start": 150.35,
        "end": 156.1,
        "vi": "Miền em chim chíp, mẹ có yêu không nào?",
        "en": "My little birds chirp, does mother love them?"
      }
    ],
    "englishTranslation": [
      "Little stork, it lands on a bamboo branch.",
      "Visiting and asking about mother, do you know the way here?",
      "Done here I ask, done going I greet.",
      "My little birds chirp, does mother love them?",
      "Little stork, it lands on a bamboo branch.",
      "Visiting and asking about mother, do you know the way here?",
      "Done here I ask, done going I greet.",
      "My little birds chirp, does mother love them?",
      "Little stork, it lands on a bamboo branch.",
      "Visiting and asking about mother, do you know the way here?",
      "Done here I ask, done going I greet.",
      "My little birds chirp, does mother love them?",
      "Little stork, it lands on a bamboo branch.",
      "Visiting and asking about mother, do you know the way here?",
      "Done here I ask, done going I greet.",
      "My little birds chirp, does mother love them?",
      "My little birds chirp, does mother love them?"
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
    "isVocalTrack": true
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
    "durationSec": 190,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Ba thương con vì con giống mẹ",
      "Mẹ thương con vì con giống ba",
      "Cả nhà ta cùng thương yêu nhau",
      "Xa là nhớ, gần nhau là cười",
      "Ba thương con vì con giống mẹ",
      "Mẹ thương con vì con giống ba",
      "Cả nhà ta cùng thương yêu nhau",
      "Xa là nhớ, gần nhau là cười",
      "Ba thương con vì con giống mẹ",
      "Mẹ thương con vì con giống ba",
      "Cả nhà ta cùng thương yêu nhau",
      "Xa là nhớ, gần nhau là cười",
      "Ba thương con vì con giống mẹ",
      "Mẹ thương con vì con giống ba",
      "Cả nhà ta cùng thương yêu nhau",
      "Xa là nhớ, gần nhau là cười",
      "Ba thương con vì con giống mẹ",
      "Mẹ thương con vì con giống ba",
      "Cả nhà ta cùng thương yêu nhau",
      "Xa là nhớ, gần nhau là cười",
      "Ba thương con vì con giống mẹ",
      "Mẹ thương con vì con giống ba",
      "Cả nhà ta cùng thương yêu nhau",
      "Xa là nhớ, gần nhau là cười",
      "Cả nhà ta cùng thương yêu nhau",
      "Xa là nhớ, gần nhau là cười"
    ],
    "lyricsData": [
      {
        "start": 34.05,
        "end": 37.8,
        "vi": "Ba thương con vì con giống mẹ",
        "en": "Daddy loves me because I look like mommy"
      },
      {
        "start": 38.05,
        "end": 41.8,
        "vi": "Mẹ thương con vì con giống ba",
        "en": "Mommy loves me because I look like daddy"
      },
      {
        "start": 42.05,
        "end": 46.0,
        "vi": "Cả nhà ta cùng thương yêu nhau",
        "en": "Our whole family loves one another"
      },
      {
        "start": 46.05,
        "end": 50.0,
        "vi": "Xa là nhớ, gần nhau là cười",
        "en": "Far apart we miss each other, close together we smile"
      },
      {
        "start": 50.05,
        "end": 53.8,
        "vi": "Ba thương con vì con giống mẹ",
        "en": "Daddy loves me because I look like mommy"
      },
      {
        "start": 54.05,
        "end": 57.8,
        "vi": "Mẹ thương con vì con giống ba",
        "en": "Mommy loves me because I look like daddy"
      },
      {
        "start": 58.05,
        "end": 62.0,
        "vi": "Cả nhà ta cùng thương yêu nhau",
        "en": "Our whole family loves one another"
      },
      {
        "start": 62.05,
        "end": 66.0,
        "vi": "Xa là nhớ, gần nhau là cười",
        "en": "Far apart we miss each other, close together we smile"
      },
      {
        "start": 82.05,
        "end": 85.8,
        "vi": "Ba thương con vì con giống mẹ",
        "en": "Daddy loves me because I look like mommy"
      },
      {
        "start": 86.05,
        "end": 89.8,
        "vi": "Mẹ thương con vì con giống ba",
        "en": "Mommy loves me because I look like daddy"
      },
      {
        "start": 90.05,
        "end": 94.0,
        "vi": "Cả nhà ta cùng thương yêu nhau",
        "en": "Our whole family loves one another"
      },
      {
        "start": 94.05,
        "end": 98.0,
        "vi": "Xa là nhớ, gần nhau là cười",
        "en": "Far apart we miss each other, close together we smile"
      },
      {
        "start": 130.05,
        "end": 133.8,
        "vi": "Ba thương con vì con giống mẹ",
        "en": "Daddy loves me because I look like mommy"
      },
      {
        "start": 134.05,
        "end": 137.8,
        "vi": "Mẹ thương con vì con giống ba",
        "en": "Mommy loves me because I look like daddy"
      },
      {
        "start": 138.05,
        "end": 142.0,
        "vi": "Cả nhà ta cùng thương yêu nhau",
        "en": "Our whole family loves one another"
      },
      {
        "start": 142.05,
        "end": 145.8,
        "vi": "Xa là nhớ, gần nhau là cười",
        "en": "Far apart we miss each other, close together we smile"
      },
      {
        "start": 146.05,
        "end": 149.8,
        "vi": "Ba thương con vì con giống mẹ",
        "en": "Daddy loves me because I look like mommy"
      },
      {
        "start": 150.05,
        "end": 153.8,
        "vi": "Mẹ thương con vì con giống ba",
        "en": "Mommy loves me because I look like daddy"
      },
      {
        "start": 154.05,
        "end": 157.8,
        "vi": "Cả nhà ta cùng thương yêu nhau",
        "en": "Our whole family loves one another"
      },
      {
        "start": 158.05,
        "end": 161.8,
        "vi": "Xa là nhớ, gần nhau là cười",
        "en": "Far apart we miss each other, close together we smile"
      },
      {
        "start": 162.05,
        "end": 165.8,
        "vi": "Ba thương con vì con giống mẹ",
        "en": "Daddy loves me because I look like mommy"
      },
      {
        "start": 166.05,
        "end": 169.8,
        "vi": "Mẹ thương con vì con giống ba",
        "en": "Mommy loves me because I look like daddy"
      },
      {
        "start": 170.05,
        "end": 173.8,
        "vi": "Cả nhà ta cùng thương yêu nhau",
        "en": "Our whole family loves one another"
      },
      {
        "start": 174.05,
        "end": 177.8,
        "vi": "Xa là nhớ, gần nhau là cười",
        "en": "Far apart we miss each other, close together we smile"
      },
      {
        "start": 178.05,
        "end": 181.8,
        "vi": "Cả nhà ta cùng thương yêu nhau",
        "en": "Our whole family loves one another"
      },
      {
        "start": 182.05,
        "end": 187.8,
        "vi": "Xa là nhớ, gần nhau là cười",
        "en": "Far apart we miss each other, close together we smile"
      }
    ],
    "englishTranslation": [
      "Daddy loves me because I look like mommy",
      "Mommy loves me because I look like daddy",
      "Our whole family loves one another",
      "Far apart we miss each other, close together we smile",
      "Daddy loves me because I look like mommy",
      "Mommy loves me because I look like daddy",
      "Our whole family loves one another",
      "Far apart we miss each other, close together we smile",
      "Daddy loves me because I look like mommy",
      "Mommy loves me because I look like daddy",
      "Our whole family loves one another",
      "Far apart we miss each other, close together we smile",
      "Daddy loves me because I look like mommy",
      "Mommy loves me because I look like daddy",
      "Our whole family loves one another",
      "Far apart we miss each other, close together we smile",
      "Daddy loves me because I look like mommy",
      "Mommy loves me because I look like daddy",
      "Our whole family loves one another",
      "Far apart we miss each other, close together we smile",
      "Daddy loves me because I look like mommy",
      "Mommy loves me because I look like daddy",
      "Our whole family loves one another",
      "Far apart we miss each other, close together we smile",
      "Our whole family loves one another",
      "Far apart we miss each other, close together we smile"
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
    "isVocalTrack": true
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
    "durationSec": 168,
    "melodyStyle": "gentle",
    "lyrics": [
      "nhạc",
      "Bà ơi bà, cháu yêu bà lắm",
      "Tóc bà trắng, màu trắng như mây",
      "Cháu yêu bà, chớ năm bàn tay",
      "Bà ơi bà, cháu yêu bà lắm",
      "Tóc bà trắng, màu trắng như mây",
      "nhạc",
      "Bà ơi bà, cháu yêu bà lắm",
      "Tóc bà trắng, màu trắng như mây",
      "Cháu yêu bà, chớ năm bàn tay",
      "Bà ơi bà, cháu yêu bà lắm",
      "Tóc bà trắng, màu trắng như mây"
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 28.9,
        "vi": "nhạc",
        "en": "music"
      },
      {
        "start": 28.75,
        "end": 37.8,
        "vi": "Bà ơi bà, cháu yêu bà lắm",
        "en": "Grandma, oh Grandma, I love you so much"
      },
      {
        "start": 37.65,
        "end": 46.8,
        "vi": "Tóc bà trắng, màu trắng như mây",
        "en": "Grandma's hair is white, white like clouds"
      },
      {
        "start": 46.65,
        "end": 51.0,
        "vi": "Cháu yêu bà, chớ năm bàn tay",
        "en": "I love Grandma, hold my five fingers"
      },
      {
        "start": 50.85,
        "end": 60.0,
        "vi": "Bà ơi bà, cháu yêu bà lắm",
        "en": "Grandma, oh Grandma, I love you so much"
      },
      {
        "start": 59.85,
        "end": 68.8,
        "vi": "Tóc bà trắng, màu trắng như mây",
        "en": "Grandma's hair is white, white like clouds"
      },
      {
        "start": 68.65,
        "end": 118.3,
        "vi": "nhạc",
        "en": "music"
      },
      {
        "start": 118.15,
        "end": 126.9,
        "vi": "Bà ơi bà, cháu yêu bà lắm",
        "en": "Grandma, oh Grandma, I love you so much"
      },
      {
        "start": 126.75,
        "end": 135.5,
        "vi": "Tóc bà trắng, màu trắng như mây",
        "en": "Grandma's hair is white, white like clouds"
      },
      {
        "start": 135.35,
        "end": 140.1,
        "vi": "Cháu yêu bà, chớ năm bàn tay",
        "en": "I love Grandma, hold my five fingers"
      },
      {
        "start": 139.95,
        "end": 148.9,
        "vi": "Bà ơi bà, cháu yêu bà lắm",
        "en": "Grandma, oh Grandma, I love you so much"
      },
      {
        "start": 148.75,
        "end": 166.9,
        "vi": "Tóc bà trắng, màu trắng như mây",
        "en": "Grandma's hair is white, white like clouds"
      }
    ],
    "englishTranslation": [
      "music",
      "Grandma, oh Grandma, I love you so much",
      "Grandma's hair is white, white like clouds",
      "I love Grandma, hold my five fingers",
      "Grandma, oh Grandma, I love you so much",
      "Grandma's hair is white, white like clouds",
      "music",
      "Grandma, oh Grandma, I love you so much",
      "Grandma's hair is white, white like clouds",
      "I love Grandma, hold my five fingers",
      "Grandma, oh Grandma, I love you so much",
      "Grandma's hair is white, white like clouds"
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
    "isVocalTrack": true
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
    "durationSec": 171,
    "melodyStyle": "playful",
    "lyrics": [
      "Một con vịt xòe ra hai cái cánh",
      "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
      "Gặp hồ nước nó bì bà bì bõm",
      "Lúc lên bờ vẫy cái cánh cho khô",
      "Một con vịt xòe ra hai cái cánh",
      "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
      "Gặp hồ nước nó bì bà bì bõm",
      "Lúc lên bờ vẫy cái cánh cho khô",
      "Một con vịt xòe ra hai cái cánh",
      "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
      "Gặp hồ nước nó bì bà bì bõm",
      "Lúc lên bờ vẫy cái cánh cho khô",
      "Một con vịt xòe ra hai cái cánh",
      "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
      "Gặp hồ nước nó bì bà bì bõm",
      "Lúc lên bờ vẫy cái cánh cho khô",
      "Một con vịt xòe ra hai cái cánh",
      "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
      "Gặp hồ nước nó bì bà bì bõm",
      "Lúc lên bờ vẫy cái cánh cho khô",
      "Một con vịt xòe ra hai cái cánh",
      "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
      "Gặp hồ nước nó bì bà bì bõm",
      "Lúc lên bờ vẫy cái cánh cho khô"
    ],
    "lyricsData": [
      {
        "start": 16.35,
        "end": 20.1,
        "vi": "Một con vịt xòe ra hai cái cánh",
        "en": "One duck spread its two wings"
      },
      {
        "start": 19.95,
        "end": 23.9,
        "vi": "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
        "en": "It quacks like quack quack quack quack quack quack"
      },
      {
        "start": 23.75,
        "end": 27.4,
        "vi": "Gặp hồ nước nó bì bà bì bõm",
        "en": "Meeting the pond, it paddles splashingly"
      },
      {
        "start": 27.25,
        "end": 31.2,
        "vi": "Lúc lên bờ vẫy cái cánh cho khô",
        "en": "When coming ashore, it flaps its wings to dry"
      },
      {
        "start": 36.45,
        "end": 40.2,
        "vi": "Một con vịt xòe ra hai cái cánh",
        "en": "One duck spread its two wings"
      },
      {
        "start": 40.05,
        "end": 44.0,
        "vi": "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
        "en": "It quacks like quack quack quack quack quack quack"
      },
      {
        "start": 43.85,
        "end": 47.5,
        "vi": "Gặp hồ nước nó bì bà bì bõm",
        "en": "Meeting the pond, it paddles splashingly"
      },
      {
        "start": 47.35,
        "end": 51.3,
        "vi": "Lúc lên bờ vẫy cái cánh cho khô",
        "en": "When coming ashore, it flaps its wings to dry"
      },
      {
        "start": 56.85,
        "end": 60.6,
        "vi": "Một con vịt xòe ra hai cái cánh",
        "en": "One duck spread its two wings"
      },
      {
        "start": 60.45,
        "end": 64.3,
        "vi": "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
        "en": "It quacks like quack quack quack quack quack quack"
      },
      {
        "start": 64.15,
        "end": 67.8,
        "vi": "Gặp hồ nước nó bì bà bì bõm",
        "en": "Meeting the pond, it paddles splashingly"
      },
      {
        "start": 67.65,
        "end": 71.6,
        "vi": "Lúc lên bờ vẫy cái cánh cho khô",
        "en": "When coming ashore, it flaps its wings to dry"
      },
      {
        "start": 105.15,
        "end": 108.8,
        "vi": "Một con vịt xòe ra hai cái cánh",
        "en": "One duck spread its two wings"
      },
      {
        "start": 108.65,
        "end": 112.5,
        "vi": "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
        "en": "It quacks like quack quack quack quack quack quack"
      },
      {
        "start": 112.35,
        "end": 116.1,
        "vi": "Gặp hồ nước nó bì bà bì bõm",
        "en": "Meeting the pond, it paddles splashingly"
      },
      {
        "start": 115.95,
        "end": 119.8,
        "vi": "Lúc lên bờ vẫy cái cánh cho khô",
        "en": "When coming ashore, it flaps its wings to dry"
      },
      {
        "start": 125.15,
        "end": 128.9,
        "vi": "Một con vịt xòe ra hai cái cánh",
        "en": "One duck spread its two wings"
      },
      {
        "start": 128.75,
        "end": 132.7,
        "vi": "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
        "en": "It quacks like quack quack quack quack quack quack"
      },
      {
        "start": 132.55,
        "end": 136.2,
        "vi": "Gặp hồ nước nó bì bà bì bõm",
        "en": "Meeting the pond, it paddles splashingly"
      },
      {
        "start": 136.05,
        "end": 140.0,
        "vi": "Lúc lên bờ vẫy cái cánh cho khô",
        "en": "When coming ashore, it flaps its wings to dry"
      },
      {
        "start": 145.25,
        "end": 149.0,
        "vi": "Một con vịt xòe ra hai cái cánh",
        "en": "One duck spread its two wings"
      },
      {
        "start": 148.85,
        "end": 152.8,
        "vi": "Nó kêu rằng cạp cạp cạp cạp cạp cạp",
        "en": "It quacks like quack quack quack quack quack quack"
      },
      {
        "start": 152.65,
        "end": 156.4,
        "vi": "Gặp hồ nước nó bì bà bì bõm",
        "en": "Meeting the pond, it paddles splashingly"
      },
      {
        "start": 156.25,
        "end": 160.1,
        "vi": "Lúc lên bờ vẫy cái cánh cho khô",
        "en": "When coming ashore, it flaps its wings to dry"
      }
    ],
    "englishTranslation": [
      "One duck spread its two wings",
      "It quacks like quack quack quack quack quack quack",
      "Meeting the pond, it paddles splashingly",
      "When coming ashore, it flaps its wings to dry",
      "One duck spread its two wings",
      "It quacks like quack quack quack quack quack quack",
      "Meeting the pond, it paddles splashingly",
      "When coming ashore, it flaps its wings to dry",
      "One duck spread its two wings",
      "It quacks like quack quack quack quack quack quack",
      "Meeting the pond, it paddles splashingly",
      "When coming ashore, it flaps its wings to dry",
      "One duck spread its two wings",
      "It quacks like quack quack quack quack quack quack",
      "Meeting the pond, it paddles splashingly",
      "When coming ashore, it flaps its wings to dry",
      "One duck spread its two wings",
      "It quacks like quack quack quack quack quack quack",
      "Meeting the pond, it paddles splashingly",
      "When coming ashore, it flaps its wings to dry",
      "One duck spread its two wings",
      "It quacks like quack quack quack quack quack quack",
      "Meeting the pond, it paddles splashingly",
      "When coming ashore, it flaps its wings to dry"
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
    "isVocalTrack": true
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
    "durationSec": 221,
    "melodyStyle": "cheerful",
    "lyrics": [
      "(Music)",
      "Hai vây xinh xinh cá vàng bơi trong bể nước",
      "Ngồi lên lặn xuống cá vàng múa tung tăng",
      "Cá vàng bắt bồ gậy cho nước thêm sạch trong.",
      "Hai vây xinh xinh cá vàng bơi trong bể nước",
      "Ngồi lên lặn xuống cá vàng múa tung tăng",
      "Cá vàng bắt bồ gậy cho nước thêm sạch trong.",
      "(Music)",
      "Hai vây xinh xinh cá vàng bơi trong bể nước",
      "Ngồi lên lặn xuống cá vàng múa tung tăng",
      "Cá vàng bắt bồ gậy cho nước thêm sạch trong.",
      "Hai vây xinh xinh cá vàng bơi trong bể nước",
      "Ngồi lên lặn xuống cá vàng múa tung tăng",
      "Cá vàng bắt bồ gậy cho nước thêm sạch trong.",
      "Hai vây xinh xinh cá vàng bơi trong bể nước",
      "Ngồi lên lặn xuống cá vàng múa tung tăng",
      "Cá vàng bắt bồ gậy cho nước thêm sạch trong.",
      "(Music)"
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 24.4,
        "vi": "(Music)",
        "en": "(Music)"
      },
      {
        "start": 24.25,
        "end": 34.0,
        "vi": "Hai vây xinh xinh cá vàng bơi trong bể nước",
        "en": "Two pretty fins, the little goldfish swims in the fish tank,"
      },
      {
        "start": 33.85,
        "end": 43.7,
        "vi": "Ngồi lên lặn xuống cá vàng múa tung tăng",
        "en": "Floating up and diving down, the goldfish dances happily."
      },
      {
        "start": 43.55,
        "end": 50.5,
        "vi": "Cá vàng bắt bồ gậy cho nước thêm sạch trong.",
        "en": "The goldfish catches mosquito larvae to keep the water clean and clear."
      },
      {
        "start": 50.35,
        "end": 60.3,
        "vi": "Hai vây xinh xinh cá vàng bơi trong bể nước",
        "en": "Two pretty fins, the little goldfish swims in the fish tank,"
      },
      {
        "start": 60.15,
        "end": 70.0,
        "vi": "Ngồi lên lặn xuống cá vàng múa tung tăng",
        "en": "Floating up and diving down, the goldfish dances happily."
      },
      {
        "start": 69.85,
        "end": 76.8,
        "vi": "Cá vàng bắt bồ gậy cho nước thêm sạch trong.",
        "en": "The goldfish catches mosquito larvae to keep the water clean and clear."
      },
      {
        "start": 76.65,
        "end": 126.0,
        "vi": "(Music)",
        "en": "(Music)"
      },
      {
        "start": 125.85,
        "end": 135.9,
        "vi": "Hai vây xinh xinh cá vàng bơi trong bể nước",
        "en": "Two pretty fins, the little goldfish swims in the fish tank,"
      },
      {
        "start": 135.75,
        "end": 145.5,
        "vi": "Ngồi lên lặn xuống cá vàng múa tung tăng",
        "en": "Floating up and diving down, the goldfish dances happily."
      },
      {
        "start": 145.35,
        "end": 152.4,
        "vi": "Cá vàng bắt bồ gậy cho nước thêm sạch trong.",
        "en": "The goldfish catches mosquito larvae to keep the water clean and clear."
      },
      {
        "start": 152.25,
        "end": 162.2,
        "vi": "Hai vây xinh xinh cá vàng bơi trong bể nước",
        "en": "Two pretty fins, the little goldfish swims in the fish tank,"
      },
      {
        "start": 162.05,
        "end": 171.9,
        "vi": "Ngồi lên lặn xuống cá vàng múa tung tăng",
        "en": "Floating up and diving down, the goldfish dances happily."
      },
      {
        "start": 171.75,
        "end": 179.0,
        "vi": "Cá vàng bắt bồ gậy cho nước thêm sạch trong.",
        "en": "The goldfish catches mosquito larvae to keep the water clean and clear."
      },
      {
        "start": 178.85,
        "end": 188.8,
        "vi": "Hai vây xinh xinh cá vàng bơi trong bể nước",
        "en": "Two pretty fins, the little goldfish swims in the fish tank,"
      },
      {
        "start": 188.65,
        "end": 198.5,
        "vi": "Ngồi lên lặn xuống cá vàng múa tung tăng",
        "en": "Floating up and diving down, the goldfish dances happily."
      },
      {
        "start": 198.35,
        "end": 209.8,
        "vi": "Cá vàng bắt bồ gậy cho nước thêm sạch trong.",
        "en": "The goldfish catches mosquito larvae to keep the water clean and clear."
      },
      {
        "start": 209.65,
        "end": 221.0,
        "vi": "(Music)",
        "en": "(Music)"
      }
    ],
    "englishTranslation": [
      "(Music)",
      "Two pretty fins, the little goldfish swims in the fish tank,",
      "Floating up and diving down, the goldfish dances happily.",
      "The goldfish catches mosquito larvae to keep the water clean and clear.",
      "Two pretty fins, the little goldfish swims in the fish tank,",
      "Floating up and diving down, the goldfish dances happily.",
      "The goldfish catches mosquito larvae to keep the water clean and clear.",
      "(Music)",
      "Two pretty fins, the little goldfish swims in the fish tank,",
      "Floating up and diving down, the goldfish dances happily.",
      "The goldfish catches mosquito larvae to keep the water clean and clear.",
      "Two pretty fins, the little goldfish swims in the fish tank,",
      "Floating up and diving down, the goldfish dances happily.",
      "The goldfish catches mosquito larvae to keep the water clean and clear.",
      "Two pretty fins, the little goldfish swims in the fish tank,",
      "Floating up and diving down, the goldfish dances happily.",
      "The goldfish catches mosquito larvae to keep the water clean and clear.",
      "(Music)"
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
    "isVocalTrack": true
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
    "durationSec": 124,
    "melodyStyle": "playful",
    "lyrics": [
      "Kìa con bướm vàng, kìa con bướm vàng",
      "Xòe đôi cánh, xòe đôi cánh",
      "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng",
      "Em ngồi xem, em ngồi xem",
      "Good bye, kiss you. Good bye, kiss you.",
      "See you again. See you again.",
      "Bắt tay nhau chưa mờ rơ, bắt tay nhau chưa mờ rơ",
      "Bye goodbye, bye goodbye",
      "Kìa con bướm vàng, kìa con bướm vàng",
      "Xòe đôi cánh, xòe đôi cánh",
      "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng",
      "Em ngồi xem, em ngồi xem",
      "Good bye, kiss you. Good bye, kiss you.",
      "See you again. See you again.",
      "Bắt tay nhau chưa mờ rơ, bắt tay nhau chưa mờ rơ",
      "Bye goodbye, bye goodbye",
      "Kìa con bướm vàng, kìa con bướm vàng",
      "Xòe đôi cánh, xòe đôi cánh",
      "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng",
      "Em ngồi xem, em ngồi xem",
      "Good bye, kiss you. Good bye, kiss you.",
      "See you again. See you again.",
      "Bắt tay nhau chưa mờ rơ, bắt tay nhau chưa mờ rơ",
      "Bye goodbye, bye goodbye"
    ],
    "lyricsData": [
      {
        "start": 10.95,
        "end": 15.1,
        "vi": "Kìa con bướm vàng, kìa con bướm vàng",
        "en": "Look at the yellow butterfly, look at the yellow butterfly"
      },
      {
        "start": 14.95,
        "end": 18.1,
        "vi": "Xòe đôi cánh, xòe đôi cánh",
        "en": "Spread your wings, spread your wings"
      },
      {
        "start": 17.95,
        "end": 21.9,
        "vi": "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng",
        "en": "Butterflies fly two or three rounds, butterflies fly two or three rounds"
      },
      {
        "start": 21.75,
        "end": 25.9,
        "vi": "Em ngồi xem, em ngồi xem",
        "en": "I sit and watch, I sit and watch"
      },
      {
        "start": 26.35,
        "end": 30.2,
        "vi": "Good bye, kiss you. Good bye, kiss you.",
        "en": "Good bye, kiss you. Good bye, kiss you."
      },
      {
        "start": 30.35,
        "end": 33.8,
        "vi": "See you again. See you again.",
        "en": "See you again. See you again."
      },
      {
        "start": 33.65,
        "end": 37.4,
        "vi": "Bắt tay nhau chưa mờ rơ, bắt tay nhau chưa mờ rơ",
        "en": "Shake hands before parting, shake hands before parting"
      },
      {
        "start": 37.25,
        "end": 41.7,
        "vi": "Bye goodbye, bye goodbye",
        "en": "Bye goodbye, bye goodbye"
      },
      {
        "start": 42.05,
        "end": 46.2,
        "vi": "Kìa con bướm vàng, kìa con bướm vàng",
        "en": "Look at the yellow butterfly, look at the yellow butterfly"
      },
      {
        "start": 46.05,
        "end": 49.1,
        "vi": "Xòe đôi cánh, xòe đôi cánh",
        "en": "Spread your wings, spread your wings"
      },
      {
        "start": 48.95,
        "end": 53.0,
        "vi": "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng",
        "en": "Butterflies fly two or three rounds, butterflies fly two or three rounds"
      },
      {
        "start": 52.85,
        "end": 57.1,
        "vi": "Em ngồi xem, em ngồi xem",
        "en": "I sit and watch, I sit and watch"
      },
      {
        "start": 65.85,
        "end": 69.9,
        "vi": "Good bye, kiss you. Good bye, kiss you.",
        "en": "Good bye, kiss you. Good bye, kiss you."
      },
      {
        "start": 69.85,
        "end": 73.3,
        "vi": "See you again. See you again.",
        "en": "See you again. See you again."
      },
      {
        "start": 73.15,
        "end": 77.0,
        "vi": "Bắt tay nhau chưa mờ rơ, bắt tay nhau chưa mờ rơ",
        "en": "Shake hands before parting, shake hands before parting"
      },
      {
        "start": 76.85,
        "end": 81.1,
        "vi": "Bye goodbye, bye goodbye",
        "en": "Bye goodbye, bye goodbye"
      },
      {
        "start": 81.25,
        "end": 85.6,
        "vi": "Kìa con bướm vàng, kìa con bướm vàng",
        "en": "Look at the yellow butterfly, look at the yellow butterfly"
      },
      {
        "start": 85.45,
        "end": 88.4,
        "vi": "Xòe đôi cánh, xòe đôi cánh",
        "en": "Spread your wings, spread your wings"
      },
      {
        "start": 88.25,
        "end": 92.4,
        "vi": "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng",
        "en": "Butterflies fly two or three rounds, butterflies fly two or three rounds"
      },
      {
        "start": 92.25,
        "end": 96.5,
        "vi": "Em ngồi xem, em ngồi xem",
        "en": "I sit and watch, I sit and watch"
      },
      {
        "start": 96.85,
        "end": 100.8,
        "vi": "Good bye, kiss you. Good bye, kiss you.",
        "en": "Good bye, kiss you. Good bye, kiss you."
      },
      {
        "start": 100.65,
        "end": 104.2,
        "vi": "See you again. See you again.",
        "en": "See you again. See you again."
      },
      {
        "start": 104.05,
        "end": 107.9,
        "vi": "Bắt tay nhau chưa mờ rơ, bắt tay nhau chưa mờ rơ",
        "en": "Shake hands before parting, shake hands before parting"
      },
      {
        "start": 107.75,
        "end": 112.4,
        "vi": "Bye goodbye, bye goodbye",
        "en": "Bye goodbye, bye goodbye"
      }
    ],
    "englishTranslation": [
      "Look at the yellow butterfly, look at the yellow butterfly",
      "Spread your wings, spread your wings",
      "Butterflies fly two or three rounds, butterflies fly two or three rounds",
      "I sit and watch, I sit and watch",
      "Good bye, kiss you. Good bye, kiss you.",
      "See you again. See you again.",
      "Shake hands before parting, shake hands before parting",
      "Bye goodbye, bye goodbye",
      "Look at the yellow butterfly, look at the yellow butterfly",
      "Spread your wings, spread your wings",
      "Butterflies fly two or three rounds, butterflies fly two or three rounds",
      "I sit and watch, I sit and watch",
      "Good bye, kiss you. Good bye, kiss you.",
      "See you again. See you again.",
      "Shake hands before parting, shake hands before parting",
      "Bye goodbye, bye goodbye",
      "Look at the yellow butterfly, look at the yellow butterfly",
      "Spread your wings, spread your wings",
      "Butterflies fly two or three rounds, butterflies fly two or three rounds",
      "I sit and watch, I sit and watch",
      "Good bye, kiss you. Good bye, kiss you.",
      "See you again. See you again.",
      "Shake hands before parting, shake hands before parting",
      "Bye goodbye, bye goodbye"
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
    "isVocalTrack": true
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
    "durationSec": 283,
    "melodyStyle": "gentle",
    "lyrics": [
      "Happy birthday to you",
      "Happy birthday",
      "Happy birthday",
      "Happy birthday to you",
      "Happy birthday to you",
      "Happy birthday to you",
      "Ba là cây nến vàng",
      "Mẹ là cây nến xanh",
      "Con là cây nến hồng",
      "Ba ngọn nến lung linh",
      "Thắp sáng một gia đình",
      "Ba là cây nến vàng",
      "Mẹ là cây nến xanh",
      "Con là cây nến hồng",
      "Ba ngọn nến lung linh",
      "Thắp sáng một gia đình",
      "Gia đình, gia đình",
      "Ôm ấp ta như ngày thơ, cho ta bao nhiêu niềm thương mến",
      "Gia đình, gia đình",
      "Vương vấn bước chân ra đi",
      "Ấm áp trái tim quay về",
      "Gia đình, gia đình",
      "Ôm ấp ta như ngày thơ, cho ta bao nhiêu niềm thương mến",
      "Gia đình, gia đình",
      "Bên nhau mỗi khi đớn đau",
      "Bên nhau đến suốt cuộc đời",
      "Lung linh lung linh tình mẹ tình cha",
      "Lung linh lung linh cùng một mái nhà",
      "Lung linh lung linh cùng buồn cùng vui",
      "Lung linh lung linh hai tiếng gia đình",
      "Lung linh lung linh tình mẹ tình cha",
      "Lung linh lung linh cùng một mái nhà",
      "Lung linh lung linh cùng buồn cùng vui",
      "Lung linh lung linh hai tiếng gia đình",
      "Ba là cây nến vàng",
      "Mẹ là cây nến xanh",
      "Con là cây nến hồng",
      "Ba ngọn nến lung linh",
      "Thắp sáng một gia đình",
      "Gia đình, gia đình",
      "Ôm ấp ta như ngày thơ, cho ta bao nhiêu niềm thương mến, gia đình gia đình",
      "Vương vấn bước chân ra đi",
      "Ấm áp trái tim quay về",
      "Gia đình, gia đình",
      "Ôm ấp ta như ngày thơ, cho ta bao nhiêu niềm thương mến, gia đình gia đình",
      "Bên nhau mỗi khi đớn đau",
      "Bên nhau đến suốt cuộc đời",
      "Lung linh lung linh tình mẹ tình cha",
      "Lung linh lung linh cùng một mái nhà",
      "Lung linh lung linh cùng buồn cùng vui",
      "Lung linh lung linh hai tiếng gia đình",
      "Lung linh lung linh tình mẹ tình cha",
      "Lung linh lung linh cùng một mái nhà",
      "Lung linh lung linh cùng buồn cùng vui",
      "Lung linh lung linh hai tiếng gia đình",
      "Lung linh lung linh hai tiếng gia đình",
      "Ba là cây nến vàng",
      "Mẹ là cây nến xanh",
      "Con là cây nến hồng",
      "Ba ngọn nến lung linh",
      "Thắp sáng một gia đình"
    ],
    "lyricsData": [
      {
        "start": 5.95,
        "end": 9.1,
        "vi": "Happy birthday to you",
        "en": "Happy birthday to you"
      },
      {
        "start": 8.95,
        "end": 11.8,
        "vi": "Happy birthday",
        "en": "Happy birthday"
      },
      {
        "start": 11.65,
        "end": 14.2,
        "vi": "Happy birthday",
        "en": "Happy birthday"
      },
      {
        "start": 14.05,
        "end": 16.8,
        "vi": "Happy birthday to you",
        "en": "Happy birthday to you"
      },
      {
        "start": 16.65,
        "end": 19.4,
        "vi": "Happy birthday to you",
        "en": "Happy birthday to you"
      },
      {
        "start": 19.25,
        "end": 26.5,
        "vi": "Happy birthday to you",
        "en": "Happy birthday to you"
      },
      {
        "start": 28.25,
        "end": 30.9,
        "vi": "Ba là cây nến vàng",
        "en": "Dad is a yellow candle"
      },
      {
        "start": 30.75,
        "end": 33.8,
        "vi": "Mẹ là cây nến xanh",
        "en": "Mom is a green candle"
      },
      {
        "start": 33.65,
        "end": 36.7,
        "vi": "Con là cây nến hồng",
        "en": "I am a pink candle"
      },
      {
        "start": 36.55,
        "end": 41.1,
        "vi": "Ba ngọn nến lung linh",
        "en": "Three flickering candles"
      },
      {
        "start": 42.85,
        "end": 46.3,
        "vi": "Thắp sáng một gia đình",
        "en": "Illuminate a family"
      },
      {
        "start": 62.75,
        "end": 65.1,
        "vi": "Ba là cây nến vàng",
        "en": "Dad is a yellow candle"
      },
      {
        "start": 64.95,
        "end": 68.1,
        "vi": "Mẹ là cây nến xanh",
        "en": "Mom is a green candle"
      },
      {
        "start": 67.95,
        "end": 70.8,
        "vi": "Con là cây nến hồng",
        "en": "I am a pink candle"
      },
      {
        "start": 70.65,
        "end": 74.2,
        "vi": "Ba ngọn nến lung linh",
        "en": "Three flickering candles"
      },
      {
        "start": 77.15,
        "end": 80.4,
        "vi": "Thắp sáng một gia đình",
        "en": "Illuminate a family"
      },
      {
        "start": 81.65,
        "end": 85.5,
        "vi": "Gia đình, gia đình",
        "en": "Family, family"
      },
      {
        "start": 85.35,
        "end": 90.8,
        "vi": "Ôm ấp ta như ngày thơ, cho ta bao nhiêu niềm thương mến",
        "en": "Embracing us like childhood days, giving us so much love and affection"
      },
      {
        "start": 90.65,
        "end": 93.7,
        "vi": "Gia đình, gia đình",
        "en": "Family, family"
      },
      {
        "start": 93.55,
        "end": 96.4,
        "vi": "Vương vấn bước chân ra đi",
        "en": "Lingering steps of departure"
      },
      {
        "start": 96.25,
        "end": 99.0,
        "vi": "Ấm áp trái tim quay về",
        "en": "Warm heart returning home"
      },
      {
        "start": 98.85,
        "end": 102.1,
        "vi": "Gia đình, gia đình",
        "en": "Family, family"
      },
      {
        "start": 101.95,
        "end": 107.3,
        "vi": "Ôm ấp ta như ngày thơ, cho ta bao nhiêu niềm thương mến",
        "en": "Embracing us like childhood days, giving us so much love and affection"
      },
      {
        "start": 107.15,
        "end": 110.4,
        "vi": "Gia đình, gia đình",
        "en": "Family, family"
      },
      {
        "start": 110.25,
        "end": 113.3,
        "vi": "Bên nhau mỗi khi đớn đau",
        "en": "Being together through every pain"
      },
      {
        "start": 113.15,
        "end": 116.8,
        "vi": "Bên nhau đến suốt cuộc đời",
        "en": "Being together for a lifetime"
      },
      {
        "start": 116.65,
        "end": 119.8,
        "vi": "Lung linh lung linh tình mẹ tình cha",
        "en": "Flickering, flickering, mother's and father's love"
      },
      {
        "start": 119.65,
        "end": 122.8,
        "vi": "Lung linh lung linh cùng một mái nhà",
        "en": "Flickering, flickering under the same roof"
      },
      {
        "start": 122.65,
        "end": 125.9,
        "vi": "Lung linh lung linh cùng buồn cùng vui",
        "en": "Flickering, flickering sharing sadness and joy"
      },
      {
        "start": 125.75,
        "end": 129.3,
        "vi": "Lung linh lung linh hai tiếng gia đình",
        "en": "Flickering, flickering, the word 'family'"
      },
      {
        "start": 129.15,
        "end": 132.3,
        "vi": "Lung linh lung linh tình mẹ tình cha",
        "en": "Flickering, flickering, mother's and father's love"
      },
      {
        "start": 132.15,
        "end": 135.3,
        "vi": "Lung linh lung linh cùng một mái nhà",
        "en": "Flickering, flickering under the same roof"
      },
      {
        "start": 135.15,
        "end": 138.4,
        "vi": "Lung linh lung linh cùng buồn cùng vui",
        "en": "Flickering, flickering sharing sadness and joy"
      },
      {
        "start": 138.25,
        "end": 142.0,
        "vi": "Lung linh lung linh hai tiếng gia đình",
        "en": "Flickering, flickering, the word 'family'"
      },
      {
        "start": 156.25,
        "end": 159.1,
        "vi": "Ba là cây nến vàng",
        "en": "Dad is a yellow candle"
      },
      {
        "start": 158.95,
        "end": 162.0,
        "vi": "Mẹ là cây nến xanh",
        "en": "Mom is a green candle"
      },
      {
        "start": 161.85,
        "end": 164.7,
        "vi": "Con là cây nến hồng",
        "en": "I am a pink candle"
      },
      {
        "start": 164.55,
        "end": 168.3,
        "vi": "Ba ngọn nến lung linh",
        "en": "Three flickering candles"
      },
      {
        "start": 170.65,
        "end": 173.9,
        "vi": "Thắp sáng một gia đình",
        "en": "Illuminate a family"
      },
      {
        "start": 175.55,
        "end": 177.6,
        "vi": "Gia đình, gia đình",
        "en": "Family, family"
      },
      {
        "start": 177.45,
        "end": 184.2,
        "vi": "Ôm ấp ta như ngày thơ, cho ta bao nhiêu niềm thương mến, gia đình gia đình",
        "en": "Embracing us like childhood days, giving us so much love and affection, family family"
      },
      {
        "start": 186.95,
        "end": 189.7,
        "vi": "Vương vấn bước chân ra đi",
        "en": "Lingering steps of departure"
      },
      {
        "start": 189.55,
        "end": 192.4,
        "vi": "Ấm áp trái tim quay về",
        "en": "Warm heart returning home"
      },
      {
        "start": 192.25,
        "end": 195.8,
        "vi": "Gia đình, gia đình",
        "en": "Family, family"
      },
      {
        "start": 195.65,
        "end": 202.1,
        "vi": "Ôm ấp ta như ngày thơ, cho ta bao nhiêu niềm thương mến, gia đình gia đình",
        "en": "Embracing us like childhood days, giving us so much love and affection, family family"
      },
      {
        "start": 204.85,
        "end": 207.7,
        "vi": "Bên nhau mỗi khi đớn đau",
        "en": "Being together through every pain"
      },
      {
        "start": 207.55,
        "end": 211.0,
        "vi": "Bên nhau đến suốt cuộc đời",
        "en": "Being together for a lifetime"
      },
      {
        "start": 210.85,
        "end": 214.1,
        "vi": "Lung linh lung linh tình mẹ tình cha",
        "en": "Flickering, flickering, mother's and father's love"
      },
      {
        "start": 213.95,
        "end": 217.0,
        "vi": "Lung linh lung linh cùng một mái nhà",
        "en": "Flickering, flickering under the same roof"
      },
      {
        "start": 216.85,
        "end": 220.1,
        "vi": "Lung linh lung linh cùng buồn cùng vui",
        "en": "Flickering, flickering sharing sadness and joy"
      },
      {
        "start": 219.95,
        "end": 223.1,
        "vi": "Lung linh lung linh hai tiếng gia đình",
        "en": "Flickering, flickering, the word 'family'"
      },
      {
        "start": 222.95,
        "end": 226.0,
        "vi": "Lung linh lung linh tình mẹ tình cha",
        "en": "Flickering, flickering, mother's and father's love"
      },
      {
        "start": 225.85,
        "end": 229.0,
        "vi": "Lung linh lung linh cùng một mái nhà",
        "en": "Flickering, flickering under the same roof"
      },
      {
        "start": 228.85,
        "end": 232.3,
        "vi": "Lung linh lung linh cùng buồn cùng vui",
        "en": "Flickering, flickering sharing sadness and joy"
      },
      {
        "start": 232.15,
        "end": 235.7,
        "vi": "Lung linh lung linh hai tiếng gia đình",
        "en": "Flickering, flickering, the word 'family'"
      },
      {
        "start": 235.55,
        "end": 248.5,
        "vi": "Lung linh lung linh hai tiếng gia đình",
        "en": "Flickering, flickering, the word 'family'"
      },
      {
        "start": 250.55,
        "end": 253.1,
        "vi": "Ba là cây nến vàng",
        "en": "Dad is a yellow candle"
      },
      {
        "start": 252.95,
        "end": 256.8,
        "vi": "Mẹ là cây nến xanh",
        "en": "Mom is a green candle"
      },
      {
        "start": 256.65,
        "end": 259.7,
        "vi": "Con là cây nến hồng",
        "en": "I am a pink candle"
      },
      {
        "start": 259.55,
        "end": 263.7,
        "vi": "Ba ngọn nến lung linh",
        "en": "Three flickering candles"
      },
      {
        "start": 265.55,
        "end": 269.8,
        "vi": "Thắp sáng một gia đình",
        "en": "Illuminate a family"
      }
    ],
    "englishTranslation": [
      "Happy birthday to you",
      "Happy birthday",
      "Happy birthday",
      "Happy birthday to you",
      "Happy birthday to you",
      "Happy birthday to you",
      "Dad is a yellow candle",
      "Mom is a green candle",
      "I am a pink candle",
      "Three flickering candles",
      "Illuminate a family",
      "Dad is a yellow candle",
      "Mom is a green candle",
      "I am a pink candle",
      "Three flickering candles",
      "Illuminate a family",
      "Family, family",
      "Embracing us like childhood days, giving us so much love and affection",
      "Family, family",
      "Lingering steps of departure",
      "Warm heart returning home",
      "Family, family",
      "Embracing us like childhood days, giving us so much love and affection",
      "Family, family",
      "Being together through every pain",
      "Being together for a lifetime",
      "Flickering, flickering, mother's and father's love",
      "Flickering, flickering under the same roof",
      "Flickering, flickering sharing sadness and joy",
      "Flickering, flickering, the word 'family'",
      "Flickering, flickering, mother's and father's love",
      "Flickering, flickering under the same roof",
      "Flickering, flickering sharing sadness and joy",
      "Flickering, flickering, the word 'family'",
      "Dad is a yellow candle",
      "Mom is a green candle",
      "I am a pink candle",
      "Three flickering candles",
      "Illuminate a family",
      "Family, family",
      "Embracing us like childhood days, giving us so much love and affection, family family",
      "Lingering steps of departure",
      "Warm heart returning home",
      "Family, family",
      "Embracing us like childhood days, giving us so much love and affection, family family",
      "Being together through every pain",
      "Being together for a lifetime",
      "Flickering, flickering, mother's and father's love",
      "Flickering, flickering under the same roof",
      "Flickering, flickering sharing sadness and joy",
      "Flickering, flickering, the word 'family'",
      "Flickering, flickering, mother's and father's love",
      "Flickering, flickering under the same roof",
      "Flickering, flickering sharing sadness and joy",
      "Flickering, flickering, the word 'family'",
      "Flickering, flickering, the word 'family'",
      "Dad is a yellow candle",
      "Mom is a green candle",
      "I am a pink candle",
      "Three flickering candles",
      "Illuminate a family"
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
    "isVocalTrack": true
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
    "durationSec": 186,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Bố là tàu lửa, bố là xe hơi",
      "Bố là con ngựa em cưỡi em chơi",
      "Bố là thuyền nan cho em vươn khắp sóng",
      "Bố là sông rộng cho thuyền em bơi",
      "Bố! Bố là bờ đê cho em nằm ngủ",
      "Bố! Bố là phi thuyền cho em bay vào không gian",
      "Bố! Bố là bờ đê cho em nằm ngủ",
      "Bố! Bố là phi thuyền cho em bay vào không gian",
      "Bố! Bố là tất cả, bố ơi! Bố ơi!",
      "Bố là tất cả, những lúc bố mệt, bố là bố thôi",
      "Bố là tàu lửa, bố là xe hơi",
      "Bố là con ngựa em cưỡi em chơi",
      "Bố là thuyền nan cho em vươn khắp sóng",
      "Bố là sông rộng cho thuyền em bơi",
      "Bố! Bố là bờ đê cho em nằm ngủ",
      "Bố! Bố là phi thuyền cho em bay vào không gian",
      "Bố! Bố là bờ đê cho em nằm ngủ",
      "Bố! Bố là phi thuyền cho em bay vào không gian",
      "Bố! Bố là tất cả, bố ơi! Bố ơi!",
      "Bố là tất cả, những lúc bố mệt, bố là bố thôi",
      "Bố! Bố là tất cả, bố ơi! Bố ơi! Bố là tất cả, những lúc bố mệt, bố là bố thôi"
    ],
    "lyricsData": [
      {
        "start": 22.55,
        "end": 26.5,
        "vi": "Bố là tàu lửa, bố là xe hơi",
        "en": "Daddy is a train, daddy is a car"
      },
      {
        "start": 26.35,
        "end": 30.3,
        "vi": "Bố là con ngựa em cưỡi em chơi",
        "en": "Daddy is a horse for me to ride and play"
      },
      {
        "start": 30.15,
        "end": 34.2,
        "vi": "Bố là thuyền nan cho em vươn khắp sóng",
        "en": "Daddy is a boat for me to sail the waves"
      },
      {
        "start": 34.05,
        "end": 38.8,
        "vi": "Bố là sông rộng cho thuyền em bơi",
        "en": "Daddy is a wide river for my boat to swim"
      },
      {
        "start": 38.65,
        "end": 44.6,
        "vi": "Bố! Bố là bờ đê cho em nằm ngủ",
        "en": "Daddy! Daddy is the dike for me to sleep on"
      },
      {
        "start": 44.45,
        "end": 51.3,
        "vi": "Bố! Bố là phi thuyền cho em bay vào không gian",
        "en": "Daddy! Daddy is a spaceship for me to fly into space"
      },
      {
        "start": 51.15,
        "end": 57.1,
        "vi": "Bố! Bố là bờ đê cho em nằm ngủ",
        "en": "Daddy! Daddy is the dike for me to sleep on"
      },
      {
        "start": 56.95,
        "end": 64.5,
        "vi": "Bố! Bố là phi thuyền cho em bay vào không gian",
        "en": "Daddy! Daddy is a spaceship for me to fly into space"
      },
      {
        "start": 64.35,
        "end": 72.1,
        "vi": "Bố! Bố là tất cả, bố ơi! Bố ơi!",
        "en": "Daddy! Daddy is everything, daddy! Daddy!"
      },
      {
        "start": 71.95,
        "end": 81.0,
        "vi": "Bố là tất cả, những lúc bố mệt, bố là bố thôi",
        "en": "Daddy is everything, whenever daddy is tired, daddy is just daddy"
      },
      {
        "start": 102.15,
        "end": 106.3,
        "vi": "Bố là tàu lửa, bố là xe hơi",
        "en": "Daddy is a train, daddy is a car"
      },
      {
        "start": 106.15,
        "end": 109.8,
        "vi": "Bố là con ngựa em cưỡi em chơi",
        "en": "Daddy is a horse for me to ride and play"
      },
      {
        "start": 109.65,
        "end": 113.7,
        "vi": "Bố là thuyền nan cho em vươn khắp sóng",
        "en": "Daddy is a boat for me to sail the waves"
      },
      {
        "start": 113.55,
        "end": 118.3,
        "vi": "Bố là sông rộng cho thuyền em bơi",
        "en": "Daddy is a wide river for my boat to swim"
      },
      {
        "start": 118.15,
        "end": 124.3,
        "vi": "Bố! Bố là bờ đê cho em nằm ngủ",
        "en": "Daddy! Daddy is the dike for me to sleep on"
      },
      {
        "start": 124.15,
        "end": 131.0,
        "vi": "Bố! Bố là phi thuyền cho em bay vào không gian",
        "en": "Daddy! Daddy is a spaceship for me to fly into space"
      },
      {
        "start": 130.85,
        "end": 136.8,
        "vi": "Bố! Bố là bờ đê cho em nằm ngủ",
        "en": "Daddy! Daddy is the dike for me to sleep on"
      },
      {
        "start": 136.65,
        "end": 144.3,
        "vi": "Bố! Bố là phi thuyền cho em bay vào không gian",
        "en": "Daddy! Daddy is a spaceship for me to fly into space"
      },
      {
        "start": 144.15,
        "end": 151.9,
        "vi": "Bố! Bố là tất cả, bố ơi! Bố ơi!",
        "en": "Daddy! Daddy is everything, daddy! Daddy!"
      },
      {
        "start": 151.75,
        "end": 160.8,
        "vi": "Bố là tất cả, những lúc bố mệt, bố là bố thôi",
        "en": "Daddy is everything, whenever daddy is tired, daddy is just daddy"
      },
      {
        "start": 160.65,
        "end": 178.4,
        "vi": "Bố! Bố là tất cả, bố ơi! Bố ơi! Bố là tất cả, những lúc bố mệt, bố là bố thôi",
        "en": "Daddy! Daddy is everything, daddy! Daddy! Daddy is everything, whenever daddy is tired, daddy is just daddy"
      }
    ],
    "englishTranslation": [
      "Daddy is a train, daddy is a car",
      "Daddy is a horse for me to ride and play",
      "Daddy is a boat for me to sail the waves",
      "Daddy is a wide river for my boat to swim",
      "Daddy! Daddy is the dike for me to sleep on",
      "Daddy! Daddy is a spaceship for me to fly into space",
      "Daddy! Daddy is the dike for me to sleep on",
      "Daddy! Daddy is a spaceship for me to fly into space",
      "Daddy! Daddy is everything, daddy! Daddy!",
      "Daddy is everything, whenever daddy is tired, daddy is just daddy",
      "Daddy is a train, daddy is a car",
      "Daddy is a horse for me to ride and play",
      "Daddy is a boat for me to sail the waves",
      "Daddy is a wide river for my boat to swim",
      "Daddy! Daddy is the dike for me to sleep on",
      "Daddy! Daddy is a spaceship for me to fly into space",
      "Daddy! Daddy is the dike for me to sleep on",
      "Daddy! Daddy is a spaceship for me to fly into space",
      "Daddy! Daddy is everything, daddy! Daddy!",
      "Daddy is everything, whenever daddy is tired, daddy is just daddy",
      "Daddy! Daddy is everything, daddy! Daddy! Daddy is everything, whenever daddy is tired, daddy is just daddy"
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
    "isVocalTrack": true
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
    "durationSec": 107,
    "melodyStyle": "gentle",
    "lyrics": [
      "Lúc ở nhà, em cũng là cô giáo, hay đến trường, cô giáo như mẹ hiền.",
      "Cô và mẹ là hai cô giáo, mẹ và cô ấy hai mẹ hiền.",
      "Lúc ở nhà, em cũng là cô giáo, hay đến trường, cô giáo như mẹ hiền.",
      "Cô và mẹ là hai cô giáo, mẹ và cô ấy hai mẹ hiền.",
      "Lúc ở nhà, em cũng là cô giáo, hay đến trường, cô giáo như mẹ hiền.",
      "Cô và mẹ là hai cô giáo, mẹ và cô ấy hai mẹ hiền.",
      "Lúc ở nhà, em cũng là cô giáo, hay đến trường, cô giáo như mẹ hiền.",
      "Cô và mẹ là hai cô giáo, mẹ và cô ấy hai mẹ hiền."
    ],
    "lyricsData": [
      {
        "start": 14.15,
        "end": 23.5,
        "vi": "Lúc ở nhà, em cũng là cô giáo, hay đến trường, cô giáo như mẹ hiền.",
        "en": "At home, I am also a teacher, going to school, the teacher is like a gentle mother."
      },
      {
        "start": 23.35,
        "end": 32.4,
        "vi": "Cô và mẹ là hai cô giáo, mẹ và cô ấy hai mẹ hiền.",
        "en": "Teacher and mother are two teachers, mother and she are two gentle mothers."
      },
      {
        "start": 32.25,
        "end": 41.1,
        "vi": "Lúc ở nhà, em cũng là cô giáo, hay đến trường, cô giáo như mẹ hiền.",
        "en": "At home, I am also a teacher, going to school, the teacher is like a gentle mother."
      },
      {
        "start": 40.95,
        "end": 50.0,
        "vi": "Cô và mẹ là hai cô giáo, mẹ và cô ấy hai mẹ hiền.",
        "en": "Teacher and mother are two teachers, mother and she are two gentle mothers."
      },
      {
        "start": 59.95,
        "end": 68.9,
        "vi": "Lúc ở nhà, em cũng là cô giáo, hay đến trường, cô giáo như mẹ hiền.",
        "en": "At home, I am also a teacher, going to school, the teacher is like a gentle mother."
      },
      {
        "start": 68.75,
        "end": 78.0,
        "vi": "Cô và mẹ là hai cô giáo, mẹ và cô ấy hai mẹ hiền.",
        "en": "Teacher and mother are two teachers, mother and she are two gentle mothers."
      },
      {
        "start": 77.85,
        "end": 86.7,
        "vi": "Lúc ở nhà, em cũng là cô giáo, hay đến trường, cô giáo như mẹ hiền.",
        "en": "At home, I am also a teacher, going to school, the teacher is like a gentle mother."
      },
      {
        "start": 86.55,
        "end": 96.5,
        "vi": "Cô và mẹ là hai cô giáo, mẹ và cô ấy hai mẹ hiền.",
        "en": "Teacher and mother are two teachers, mother and she are two gentle mothers."
      }
    ],
    "englishTranslation": [
      "At home, I am also a teacher, going to school, the teacher is like a gentle mother.",
      "Teacher and mother are two teachers, mother and she are two gentle mothers.",
      "At home, I am also a teacher, going to school, the teacher is like a gentle mother.",
      "Teacher and mother are two teachers, mother and she are two gentle mothers.",
      "At home, I am also a teacher, going to school, the teacher is like a gentle mother.",
      "Teacher and mother are two teachers, mother and she are two gentle mothers.",
      "At home, I am also a teacher, going to school, the teacher is like a gentle mother.",
      "Teacher and mother are two teachers, mother and she are two gentle mothers."
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
    "isVocalTrack": true
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
    "durationSec": 158,
    "melodyStyle": "playful",
    "lyrics": [
      "Mẹ mua trăm con heo đất Mẹ mua trăm con heo đất E à e a",
      "Này hôm nay em vui lắm Cầm heo trên tay em nhắm E à e a",
      "Làm sao cho heo mau lớn Làm sao cho heo mau lớn E à e a",
      "Heo không đòi ăn cơm Heo không đòi ăn cá Heo chỉ cần em bé trên tay ầu ơ",
      "Em không thèm mua kem Em không thèm mua bánh Em để dành cho heo",
      "Em lì xì heo đất hai trăm mỗi ngày",
      "Này heo ơi mau lớn ê a",
      "Này heo con ơi mau lớn ê a",
      "Mẹ mua trăm con heo đất Mẹ mua trăm con heo đất E à e a",
      "Này hôm nay em vui lắm Cầm heo trên tay em nhắm E à e a",
      "Làm sao cho heo mau lớn Làm sao cho heo mau lớn E à e a",
      "Heo không đòi ăn cơm Heo không đòi ăn cá Heo chỉ cần em bé trên tay ầu ơ",
      "Em không thèm mua kem Em không thèm mua bánh Em để dành cho heo",
      "Em lì xì heo đất hai trăm mỗi ngày"
    ],
    "lyricsData": [
      {
        "start": 18.75,
        "end": 25.4,
        "vi": "Mẹ mua trăm con heo đất Mẹ mua trăm con heo đất E à e a",
        "en": "Mom bought a hundred clay pigs, Mom bought a hundred clay pigs, E a e a"
      },
      {
        "start": 25.25,
        "end": 31.9,
        "vi": "Này hôm nay em vui lắm Cầm heo trên tay em nhắm E à e a",
        "en": "Today I am so happy, Holding the pig in my hand and aiming, E a e a"
      },
      {
        "start": 31.75,
        "end": 38.2,
        "vi": "Làm sao cho heo mau lớn Làm sao cho heo mau lớn E à e a",
        "en": "How to make the pig grow up fast, How to make the pig grow up fast, E a e a"
      },
      {
        "start": 42.35,
        "end": 50.5,
        "vi": "Heo không đòi ăn cơm Heo không đòi ăn cá Heo chỉ cần em bé trên tay ầu ơ",
        "en": "The pig doesn't ask for rice, The pig doesn't ask for fish, The pig just needs the baby in hand, a-oh"
      },
      {
        "start": 50.35,
        "end": 56.9,
        "vi": "Em không thèm mua kem Em không thèm mua bánh Em để dành cho heo",
        "en": "I don't crave ice cream, I don't crave sweets, I save them for the pig"
      },
      {
        "start": 56.75,
        "end": 64.4,
        "vi": "Em lì xì heo đất hai trăm mỗi ngày",
        "en": "I give lucky money to the clay pig two hundred everyday"
      },
      {
        "start": 64.25,
        "end": 70.9,
        "vi": "Này heo ơi mau lớn ê a",
        "en": "Hey pig, grow up fast, e a"
      },
      {
        "start": 70.75,
        "end": 77.3,
        "vi": "Này heo con ơi mau lớn ê a",
        "en": "Hey little pig, grow up fast, e a"
      },
      {
        "start": 86.15,
        "end": 92.8,
        "vi": "Mẹ mua trăm con heo đất Mẹ mua trăm con heo đất E à e a",
        "en": "Mom bought a hundred clay pigs, Mom bought a hundred clay pigs, E a e a"
      },
      {
        "start": 92.65,
        "end": 98.9,
        "vi": "Này hôm nay em vui lắm Cầm heo trên tay em nhắm E à e a",
        "en": "Today I am so happy, Holding the pig in my hand and aiming, E a e a"
      },
      {
        "start": 98.75,
        "end": 105.6,
        "vi": "Làm sao cho heo mau lớn Làm sao cho heo mau lớn E à e a",
        "en": "How to make the pig grow up fast, How to make the pig grow up fast, E a e a"
      },
      {
        "start": 109.35,
        "end": 117.4,
        "vi": "Heo không đòi ăn cơm Heo không đòi ăn cá Heo chỉ cần em bé trên tay ầu ơ",
        "en": "The pig doesn't ask for rice, The pig doesn't ask for fish, The pig just needs the baby in hand, a-oh"
      },
      {
        "start": 117.25,
        "end": 124.1,
        "vi": "Em không thèm mua kem Em không thèm mua bánh Em để dành cho heo",
        "en": "I don't crave ice cream, I don't crave sweets, I save them for the pig"
      },
      {
        "start": 123.95,
        "end": 131.7,
        "vi": "Em lì xì heo đất hai trăm mỗi ngày",
        "en": "I give lucky money to the clay pig two hundred everyday"
      }
    ],
    "englishTranslation": [
      "Mom bought a hundred clay pigs, Mom bought a hundred clay pigs, E a e a",
      "Today I am so happy, Holding the pig in my hand and aiming, E a e a",
      "How to make the pig grow up fast, How to make the pig grow up fast, E a e a",
      "The pig doesn't ask for rice, The pig doesn't ask for fish, The pig just needs the baby in hand, a-oh",
      "I don't crave ice cream, I don't crave sweets, I save them for the pig",
      "I give lucky money to the clay pig two hundred everyday",
      "Hey pig, grow up fast, e a",
      "Hey little pig, grow up fast, e a",
      "Mom bought a hundred clay pigs, Mom bought a hundred clay pigs, E a e a",
      "Today I am so happy, Holding the pig in my hand and aiming, E a e a",
      "How to make the pig grow up fast, How to make the pig grow up fast, E a e a",
      "The pig doesn't ask for rice, The pig doesn't ask for fish, The pig just needs the baby in hand, a-oh",
      "I don't crave ice cream, I don't crave sweets, I save them for the pig",
      "I give lucky money to the clay pig two hundred everyday"
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
    "isVocalTrack": true
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
    "durationSec": 208,
    "melodyStyle": "playful",
    "lyrics": [
      "Kìa chú là chú ếch con có hai là hai mắt tròn",
      "Chú ngồi học bài một mình bên hố sâu cạn vươn xoang",
      "Bao cô cá trên non cùng bao chú cá rô nương",
      "Tung tăng chiếc vây xong nhịp theo chấm anh vang ròn",
      "Kìa chú là chú ếch con bé ngoan là ngoan nhất nhà",
      "Chú học thuộc bài xong rồi chú hát thi cùng họa mi",
      "Bao nhiêu chú chim ri cùng bao cô cá rô phi",
      "Nghe tiếng hát mê ly cùng bút thích chí cười khì",
      "Kìa chú là chú ếch con có hai là hai mắt tròn",
      "Chú ngồi học bài một mình bên hố sâu cạn vươn xoang",
      "Bao cô cá trên non cùng bao chú cá rô nương",
      "Tung tăng chiếc vây xong nhịp theo chấm anh vang ròn",
      "Kìa chú là chú ếch con bé ngoan là ngoan nhất nhà",
      "Chú học thuộc bài xong rồi chú hát thi cùng họa mi",
      "Bao nhiêu chú chim ri cùng bao cô cá rô phi",
      "Nghe tiếng hát mê ly cùng bút thích chí cười khì",
      "Kìa chú là chú ếch con có hai là hai mắt tròn",
      "Chú ngồi học bài một mình bên hố sâu cạn vươn xoang",
      "Bao cô cá trên non cùng bao chú cá rô nương",
      "Tung tăng chiếc vây xong nhịp theo chấm anh vang ròn",
      "Kìa chú là chú ếch con bé ngoan là ngoan nhất nhà",
      "Chú học thuộc bài xong rồi chú hát thi cùng họa mi",
      "Bao nhiêu chú chim ri cùng bao cô cá rô phi",
      "Nghe tiếng hát mê ly cùng bút thích chí cười khì",
      "Kìa chú là chú ếch con có hai là hai mắt tròn",
      "Chú ngồi học bài một mình bên hố sâu cạn vươn xoang",
      "Bao cô cá trên non cùng bao chú cá rô nương",
      "Tung tăng chiếc vây xong nhịp theo chấm anh vang ròn",
      "Kìa chú là chú ếch con bé ngoan là ngoan nhất nhà",
      "Chú học thuộc bài xong rồi chú hát thi cùng họa mi",
      "Bao nhiêu chú chim ri cùng bao cô cá rô phi",
      "Nghe tiếng hát mê ly cùng bút thích chí cười khì",
      "Nghe tiếng hát mê ly cùng bút thích chí cười khì"
    ],
    "lyricsData": [
      {
        "start": 16.65,
        "end": 20.9,
        "vi": "Kìa chú là chú ếch con có hai là hai mắt tròn",
        "en": "Here is a little frog, with two round eyes."
      },
      {
        "start": 20.75,
        "end": 25.5,
        "vi": "Chú ngồi học bài một mình bên hố sâu cạn vươn xoang",
        "en": "He sits alone studying by the shallow, soaring sinkhole."
      },
      {
        "start": 25.35,
        "end": 29.8,
        "vi": "Bao cô cá trên non cùng bao chú cá rô nương",
        "en": "All the fish up on the hill, and the climbing perch together."
      },
      {
        "start": 29.65,
        "end": 34.4,
        "vi": "Tung tăng chiếc vây xong nhịp theo chấm anh vang ròn",
        "en": "Flapping their fins cheerfully, keeping time with the bright beat."
      },
      {
        "start": 34.25,
        "end": 38.8,
        "vi": "Kìa chú là chú ếch con bé ngoan là ngoan nhất nhà",
        "en": "Here is a little frog, the best-behaved boy in the house."
      },
      {
        "start": 38.65,
        "end": 43.3,
        "vi": "Chú học thuộc bài xong rồi chú hát thi cùng họa mi",
        "en": "After finishing his lessons, he sings a contest with the nightingale."
      },
      {
        "start": 43.15,
        "end": 47.7,
        "vi": "Bao nhiêu chú chim ri cùng bao cô cá rô phi",
        "en": "So many little sparrows, along with the tilapia fish."
      },
      {
        "start": 47.55,
        "end": 52.4,
        "vi": "Nghe tiếng hát mê ly cùng bút thích chí cười khì",
        "en": "Listening to the mesmerizing song, and joyfully chuckling."
      },
      {
        "start": 56.05,
        "end": 60.3,
        "vi": "Kìa chú là chú ếch con có hai là hai mắt tròn",
        "en": "Here is a little frog, with two round eyes."
      },
      {
        "start": 60.15,
        "end": 64.7,
        "vi": "Chú ngồi học bài một mình bên hố sâu cạn vươn xoang",
        "en": "He sits alone studying by the shallow, soaring sinkhole."
      },
      {
        "start": 64.55,
        "end": 69.1,
        "vi": "Bao cô cá trên non cùng bao chú cá rô nương",
        "en": "All the fish up on the hill, and the climbing perch together."
      },
      {
        "start": 68.95,
        "end": 73.6,
        "vi": "Tung tăng chiếc vây xong nhịp theo chấm anh vang ròn",
        "en": "Flapping their fins cheerfully, keeping time with the bright beat."
      },
      {
        "start": 73.45,
        "end": 78.0,
        "vi": "Kìa chú là chú ếch con bé ngoan là ngoan nhất nhà",
        "en": "Here is a little frog, the best-behaved boy in the house."
      },
      {
        "start": 77.85,
        "end": 82.5,
        "vi": "Chú học thuộc bài xong rồi chú hát thi cùng họa mi",
        "en": "After finishing his lessons, he sings a contest with the nightingale."
      },
      {
        "start": 82.35,
        "end": 86.9,
        "vi": "Bao nhiêu chú chim ri cùng bao cô cá rô phi",
        "en": "So many little sparrows, along with the tilapia fish."
      },
      {
        "start": 86.75,
        "end": 91.5,
        "vi": "Nghe tiếng hát mê ly cùng bút thích chí cười khì",
        "en": "Listening to the mesmerizing song, and joyfully chuckling."
      },
      {
        "start": 110.55,
        "end": 114.8,
        "vi": "Kìa chú là chú ếch con có hai là hai mắt tròn",
        "en": "Here is a little frog, with two round eyes."
      },
      {
        "start": 114.65,
        "end": 119.3,
        "vi": "Chú ngồi học bài một mình bên hố sâu cạn vươn xoang",
        "en": "He sits alone studying by the shallow, soaring sinkhole."
      },
      {
        "start": 119.15,
        "end": 123.6,
        "vi": "Bao cô cá trên non cùng bao chú cá rô nương",
        "en": "All the fish up on the hill, and the climbing perch together."
      },
      {
        "start": 123.45,
        "end": 128.2,
        "vi": "Tung tăng chiếc vây xong nhịp theo chấm anh vang ròn",
        "en": "Flapping their fins cheerfully, keeping time with the bright beat."
      },
      {
        "start": 128.05,
        "end": 132.6,
        "vi": "Kìa chú là chú ếch con bé ngoan là ngoan nhất nhà",
        "en": "Here is a little frog, the best-behaved boy in the house."
      },
      {
        "start": 132.45,
        "end": 137.0,
        "vi": "Chú học thuộc bài xong rồi chú hát thi cùng họa mi",
        "en": "After finishing his lessons, he sings a contest with the nightingale."
      },
      {
        "start": 136.85,
        "end": 141.5,
        "vi": "Bao nhiêu chú chim ri cùng bao cô cá rô phi",
        "en": "So many little sparrows, along with the tilapia fish."
      },
      {
        "start": 141.35,
        "end": 146.0,
        "vi": "Nghe tiếng hát mê ly cùng bút thích chí cười khì",
        "en": "Listening to the mesmerizing song, and joyfully chuckling."
      },
      {
        "start": 149.95,
        "end": 154.2,
        "vi": "Kìa chú là chú ếch con có hai là hai mắt tròn",
        "en": "Here is a little frog, with two round eyes."
      },
      {
        "start": 154.05,
        "end": 158.7,
        "vi": "Chú ngồi học bài một mình bên hố sâu cạn vươn xoang",
        "en": "He sits alone studying by the shallow, soaring sinkhole."
      },
      {
        "start": 158.55,
        "end": 163.0,
        "vi": "Bao cô cá trên non cùng bao chú cá rô nương",
        "en": "All the fish up on the hill, and the climbing perch together."
      },
      {
        "start": 162.85,
        "end": 167.6,
        "vi": "Tung tăng chiếc vây xong nhịp theo chấm anh vang ròn",
        "en": "Flapping their fins cheerfully, keeping time with the bright beat."
      },
      {
        "start": 167.45,
        "end": 172.0,
        "vi": "Kìa chú là chú ếch con bé ngoan là ngoan nhất nhà",
        "en": "Here is a little frog, the best-behaved boy in the house."
      },
      {
        "start": 171.85,
        "end": 176.5,
        "vi": "Chú học thuộc bài xong rồi chú hát thi cùng họa mi",
        "en": "After finishing his lessons, he sings a contest with the nightingale."
      },
      {
        "start": 176.35,
        "end": 180.9,
        "vi": "Bao nhiêu chú chim ri cùng bao cô cá rô phi",
        "en": "So many little sparrows, along with the tilapia fish."
      },
      {
        "start": 180.75,
        "end": 185.4,
        "vi": "Nghe tiếng hát mê ly cùng bút thích chí cười khì",
        "en": "Listening to the mesmerizing song, and joyfully chuckling."
      },
      {
        "start": 185.25,
        "end": 189.9,
        "vi": "Nghe tiếng hát mê ly cùng bút thích chí cười khì",
        "en": "Listening to the mesmerizing song, and joyfully chuckling."
      }
    ],
    "englishTranslation": [
      "Here is a little frog, with two round eyes.",
      "He sits alone studying by the shallow, soaring sinkhole.",
      "All the fish up on the hill, and the climbing perch together.",
      "Flapping their fins cheerfully, keeping time with the bright beat.",
      "Here is a little frog, the best-behaved boy in the house.",
      "After finishing his lessons, he sings a contest with the nightingale.",
      "So many little sparrows, along with the tilapia fish.",
      "Listening to the mesmerizing song, and joyfully chuckling.",
      "Here is a little frog, with two round eyes.",
      "He sits alone studying by the shallow, soaring sinkhole.",
      "All the fish up on the hill, and the climbing perch together.",
      "Flapping their fins cheerfully, keeping time with the bright beat.",
      "Here is a little frog, the best-behaved boy in the house.",
      "After finishing his lessons, he sings a contest with the nightingale.",
      "So many little sparrows, along with the tilapia fish.",
      "Listening to the mesmerizing song, and joyfully chuckling.",
      "Here is a little frog, with two round eyes.",
      "He sits alone studying by the shallow, soaring sinkhole.",
      "All the fish up on the hill, and the climbing perch together.",
      "Flapping their fins cheerfully, keeping time with the bright beat.",
      "Here is a little frog, the best-behaved boy in the house.",
      "After finishing his lessons, he sings a contest with the nightingale.",
      "So many little sparrows, along with the tilapia fish.",
      "Listening to the mesmerizing song, and joyfully chuckling.",
      "Here is a little frog, with two round eyes.",
      "He sits alone studying by the shallow, soaring sinkhole.",
      "All the fish up on the hill, and the climbing perch together.",
      "Flapping their fins cheerfully, keeping time with the bright beat.",
      "Here is a little frog, the best-behaved boy in the house.",
      "After finishing his lessons, he sings a contest with the nightingale.",
      "So many little sparrows, along with the tilapia fish.",
      "Listening to the mesmerizing song, and joyfully chuckling.",
      "Listening to the mesmerizing song, and joyfully chuckling."
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
    "isVocalTrack": true
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
    "durationSec": 197,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Dạ không biết ki là con gà con",
      "Dạ mào cây sắn là con gà cha",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Dạ nhắm mắt cục tặc là mẹ gà con",
      "Dạ nhắm mắt cục tặc là bố gà cha",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Dạ không biết ki là con gà con",
      "Dạ mào cây sắn là con gà cha",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Dạ không biết ki là con gà con",
      "Dạ mào cây sắn là con gà cha",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Dạ nhắm mắt cục tặc là mẹ gà con",
      "Dạ nhắm mắt cục tặc là bố gà cha",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Dạ không biết ki là con gà con",
      "Dạ mào cây sắn là con gà cha",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Đi lên thang chong chóng, có con gà có con gà",
      "Đi lên thang chong chóng, có con gà có con gà"
    ],
    "lyricsData": [
      {
        "start": 44.75,
        "end": 47.3,
        "vi": "Dạ không biết ki là con gà con",
        "en": "I don't know if it's a little chick"
      },
      {
        "start": 47.75,
        "end": 50.5,
        "vi": "Dạ mào cây sắn là con gà cha",
        "en": "Yes, the cassava-shaped comb is the father rooster"
      },
      {
        "start": 50.95,
        "end": 54.0,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 53.95,
        "end": 57.0,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 60.45,
        "end": 63.0,
        "vi": "Dạ nhắm mắt cục tặc là mẹ gà con",
        "en": "Yes, closing eyes and clucking is the mother hen"
      },
      {
        "start": 63.15,
        "end": 66.0,
        "vi": "Dạ nhắm mắt cục tặc là bố gà cha",
        "en": "Yes, closing eyes and clucking is the father rooster"
      },
      {
        "start": 66.45,
        "end": 69.1,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 68.95,
        "end": 72.7,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 78.75,
        "end": 81.4,
        "vi": "Dạ không biết ki là con gà con",
        "en": "I don't know if it's a little chick"
      },
      {
        "start": 81.65,
        "end": 84.4,
        "vi": "Dạ mào cây sắn là con gà cha",
        "en": "Yes, the cassava-shaped comb is the father rooster"
      },
      {
        "start": 84.85,
        "end": 87.7,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 87.95,
        "end": 91.7,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 139.25,
        "end": 141.8,
        "vi": "Dạ không biết ki là con gà con",
        "en": "I don't know if it's a little chick"
      },
      {
        "start": 142.15,
        "end": 145.0,
        "vi": "Dạ mào cây sắn là con gà cha",
        "en": "Yes, the cassava-shaped comb is the father rooster"
      },
      {
        "start": 145.35,
        "end": 148.2,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 148.35,
        "end": 151.5,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 154.75,
        "end": 157.4,
        "vi": "Dạ nhắm mắt cục tặc là mẹ gà con",
        "en": "Yes, closing eyes and clucking is the mother hen"
      },
      {
        "start": 157.65,
        "end": 160.4,
        "vi": "Dạ nhắm mắt cục tặc là bố gà cha",
        "en": "Yes, closing eyes and clucking is the father rooster"
      },
      {
        "start": 160.85,
        "end": 163.7,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 163.85,
        "end": 167.3,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 173.25,
        "end": 175.8,
        "vi": "Dạ không biết ki là con gà con",
        "en": "I don't know if it's a little chick"
      },
      {
        "start": 176.05,
        "end": 179.0,
        "vi": "Dạ mào cây sắn là con gà cha",
        "en": "Yes, the cassava-shaped comb is the father rooster"
      },
      {
        "start": 179.45,
        "end": 182.4,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 182.25,
        "end": 185.4,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 185.35,
        "end": 188.3,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      },
      {
        "start": 188.35,
        "end": 195.5,
        "vi": "Đi lên thang chong chóng, có con gà có con gà",
        "en": "Going up the pinwheel ladder, there are chickens"
      }
    ],
    "englishTranslation": [
      "I don't know if it's a little chick",
      "Yes, the cassava-shaped comb is the father rooster",
      "Going up the pinwheel ladder, there are chickens",
      "Going up the pinwheel ladder, there are chickens",
      "Yes, closing eyes and clucking is the mother hen",
      "Yes, closing eyes and clucking is the father rooster",
      "Going up the pinwheel ladder, there are chickens",
      "Going up the pinwheel ladder, there are chickens",
      "I don't know if it's a little chick",
      "Yes, the cassava-shaped comb is the father rooster",
      "Going up the pinwheel ladder, there are chickens",
      "Going up the pinwheel ladder, there are chickens",
      "I don't know if it's a little chick",
      "Yes, the cassava-shaped comb is the father rooster",
      "Going up the pinwheel ladder, there are chickens",
      "Going up the pinwheel ladder, there are chickens",
      "Yes, closing eyes and clucking is the mother hen",
      "Yes, closing eyes and clucking is the father rooster",
      "Going up the pinwheel ladder, there are chickens",
      "Going up the pinwheel ladder, there are chickens",
      "I don't know if it's a little chick",
      "Yes, the cassava-shaped comb is the father rooster",
      "Going up the pinwheel ladder, there are chickens",
      "Going up the pinwheel ladder, there are chickens",
      "Going up the pinwheel ladder, there are chickens",
      "Going up the pinwheel ladder, there are chickens"
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
    "isVocalTrack": true
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
    "durationSec": 192,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Chú voi con ở Bản Đôn",
      "Chưa có ngà nên còn trẻ con",
      "Từ rừng già chú đến với người, vẫn ham ăn với lại ham chơi",
      "Voi con ơi, voi con ơi",
      "Mau lớn nhanh có đôi ngà to",
      "Có sức đi học miền gần xa, kéo gỗ cho buôn làng của ta",
      "Chú vắt con thật là khôn",
      "Quen chứ nhỉ học cùng bản đôn",
      "Voi con ơi, voi con ơi, mau lớn nhanh có thân mình to",
      "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi",
      "Chú voi con ở Bản Đôn",
      "Chưa có ngà nên còn trẻ con",
      "Từ rừng già chú đến với người, vẫn ham ăn với lại ham chơi",
      "Voi con ơi, voi con ơi",
      "Mau lớn nhanh có đôi ngà to",
      "Có sức đi học miền gần xa, kéo gỗ cho buôn làng của ta",
      "Chú vắt con thật là khôn",
      "Quen chứ nhỉ học cùng bản đôn",
      "Voi con ơi, voi con ơi, mau lớn nhanh có thân hình to",
      "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi",
      "Voi con ơi, voi con ơi, mau lớn nhanh có thân hình to",
      "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi",
      "Voi con ơi, voi con ơi, mau lớn nhanh có thân hình to",
      "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi",
      "Voi con ơi"
    ],
    "lyricsData": [
      {
        "start": 37.15,
        "end": 41.5,
        "vi": "Chú voi con ở Bản Đôn",
        "en": "The little elephant in Ban Don"
      },
      {
        "start": 41.35,
        "end": 44.2,
        "vi": "Chưa có ngà nên còn trẻ con",
        "en": "Doesn't have tusks yet so it's still a baby"
      },
      {
        "start": 44.05,
        "end": 47.4,
        "vi": "Từ rừng già chú đến với người, vẫn ham ăn với lại ham chơi",
        "en": "From the deep forest it comes to people, still loves eating and playing"
      },
      {
        "start": 49.65,
        "end": 54.0,
        "vi": "Voi con ơi, voi con ơi",
        "en": "Oh little elephant, oh little elephant"
      },
      {
        "start": 53.85,
        "end": 55.3,
        "vi": "Mau lớn nhanh có đôi ngà to",
        "en": "Grow up fast to have big tusks"
      },
      {
        "start": 55.15,
        "end": 60.0,
        "vi": "Có sức đi học miền gần xa, kéo gỗ cho buôn làng của ta",
        "en": "Have the strength to study far and near, pull wood for our village"
      },
      {
        "start": 61.65,
        "end": 66.3,
        "vi": "Chú vắt con thật là khôn",
        "en": "The little baby elephant is so smart"
      },
      {
        "start": 66.15,
        "end": 71.8,
        "vi": "Quen chứ nhỉ học cùng bản đôn",
        "en": "Getting used to studying with Ban Don"
      },
      {
        "start": 74.15,
        "end": 78.9,
        "vi": "Voi con ơi, voi con ơi, mau lớn nhanh có thân mình to",
        "en": "Oh little elephant, oh little elephant, grow up fast to have a big body"
      },
      {
        "start": 78.75,
        "end": 84.4,
        "vi": "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi",
        "en": "All over the Central Highlands need many elephants, contributing to building a beautiful village"
      },
      {
        "start": 118.15,
        "end": 122.5,
        "vi": "Chú voi con ở Bản Đôn",
        "en": "The little elephant in Ban Don"
      },
      {
        "start": 122.35,
        "end": 125.3,
        "vi": "Chưa có ngà nên còn trẻ con",
        "en": "Doesn't have tusks yet so it's still a baby"
      },
      {
        "start": 125.15,
        "end": 128.3,
        "vi": "Từ rừng già chú đến với người, vẫn ham ăn với lại ham chơi",
        "en": "From the deep forest it comes to people, still loves eating and playing"
      },
      {
        "start": 130.65,
        "end": 135.1,
        "vi": "Voi con ơi, voi con ơi",
        "en": "Oh little elephant, oh little elephant"
      },
      {
        "start": 134.95,
        "end": 136.3,
        "vi": "Mau lớn nhanh có đôi ngà to",
        "en": "Grow up fast to have big tusks"
      },
      {
        "start": 136.15,
        "end": 141.0,
        "vi": "Có sức đi học miền gần xa, kéo gỗ cho buôn làng của ta",
        "en": "Have the strength to study far and near, pull wood for our village"
      },
      {
        "start": 142.65,
        "end": 147.4,
        "vi": "Chú vắt con thật là khôn",
        "en": "The little baby elephant is so smart"
      },
      {
        "start": 147.25,
        "end": 152.8,
        "vi": "Quen chứ nhỉ học cùng bản đôn",
        "en": "Getting used to studying with Ban Don"
      },
      {
        "start": 155.25,
        "end": 159.9,
        "vi": "Voi con ơi, voi con ơi, mau lớn nhanh có thân hình to",
        "en": "Oh little elephant, oh little elephant, grow up fast to have a big body"
      },
      {
        "start": 159.75,
        "end": 165.5,
        "vi": "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi",
        "en": "All over the Central Highlands need many elephants, contributing to building a beautiful village"
      },
      {
        "start": 166.65,
        "end": 171.3,
        "vi": "Voi con ơi, voi con ơi, mau lớn nhanh có thân hình to",
        "en": "Oh little elephant, oh little elephant, grow up fast to have a big body"
      },
      {
        "start": 171.15,
        "end": 177.1,
        "vi": "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi",
        "en": "All over the Central Highlands need many elephants, contributing to building a beautiful village"
      },
      {
        "start": 178.05,
        "end": 182.8,
        "vi": "Voi con ơi, voi con ơi, mau lớn nhanh có thân hình to",
        "en": "Oh little elephant, oh little elephant, grow up fast to have a big body"
      },
      {
        "start": 182.65,
        "end": 188.5,
        "vi": "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi",
        "en": "All over the Central Highlands need many elephants, contributing to building a beautiful village"
      },
      {
        "start": 189.85,
        "end": 191.8,
        "vi": "Voi con ơi",
        "en": "Oh little elephant"
      }
    ],
    "englishTranslation": [
      "The little elephant in Ban Don",
      "Doesn't have tusks yet so it's still a baby",
      "From the deep forest it comes to people, still loves eating and playing",
      "Oh little elephant, oh little elephant",
      "Grow up fast to have big tusks",
      "Have the strength to study far and near, pull wood for our village",
      "The little baby elephant is so smart",
      "Getting used to studying with Ban Don",
      "Oh little elephant, oh little elephant, grow up fast to have a big body",
      "All over the Central Highlands need many elephants, contributing to building a beautiful village",
      "The little elephant in Ban Don",
      "Doesn't have tusks yet so it's still a baby",
      "From the deep forest it comes to people, still loves eating and playing",
      "Oh little elephant, oh little elephant",
      "Grow up fast to have big tusks",
      "Have the strength to study far and near, pull wood for our village",
      "The little baby elephant is so smart",
      "Getting used to studying with Ban Don",
      "Oh little elephant, oh little elephant, grow up fast to have a big body",
      "All over the Central Highlands need many elephants, contributing to building a beautiful village",
      "Oh little elephant, oh little elephant, grow up fast to have a big body",
      "All over the Central Highlands need many elephants, contributing to building a beautiful village",
      "Oh little elephant, oh little elephant, grow up fast to have a big body",
      "All over the Central Highlands need many elephants, contributing to building a beautiful village",
      "Oh little elephant"
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
    "isVocalTrack": true
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
    "durationSec": 141,
    "melodyStyle": "playful",
    "lyrics": [
      "Bắc Kim Thang, Cà Lang Bí Rợ",
      "Cột qua kèo, là kèo qua cột",
      "Chú ban dầu, qua cầu mà té",
      "Chú bán ếch, ở lại làm chi?",
      "Con le le đánh trống thổi kèn",
      "Con bìm bịp thổi tót tì te tò te",
      "Bắc Kim Thang, Cà Lang Bí Rợ",
      "Cột qua kèo, là kèo qua cột",
      "Chú ban dầu, qua cầu mà té",
      "Chú bán ếch, ở lại làm chi?",
      "Con le le đánh trống thổi kèn",
      "Con bìm bịp thổi tót tì te tò te",
      "Bắc Kim Thang, Cà Lang Bí Rợ",
      "Cột qua kèo, là kèo qua cột",
      "Chú ban dầu, qua cầu mà té",
      "Chú bán ếch, ở lại làm chi?",
      "Con le le đánh trống thổi kèn",
      "Con bìm bịp thổi tót tì te tò te",
      "Bắc Kim Thang, Cà Lang Bí Rợ",
      "Cột qua kèo, là kèo qua cột",
      "Chú ban dầu, qua cầu mà té",
      "Chú bán ếch, ở lại làm chi?",
      "Con le le đánh trống thổi kèn",
      "Con bìm bịp thổi tót tì te tò te"
    ],
    "lyricsData": [
      {
        "start": 10.35,
        "end": 14.3,
        "vi": "Bắc Kim Thang, Cà Lang Bí Rợ",
        "en": "Bac Kim Thang, Pumpkin and Gourd"
      },
      {
        "start": 14.35,
        "end": 18.4,
        "vi": "Cột qua kèo, là kèo qua cột",
        "en": "Tie the beam to the pillar, the pillar to the beam"
      },
      {
        "start": 18.45,
        "end": 22.5,
        "vi": "Chú ban dầu, qua cầu mà té",
        "en": "Uncle oil vendor, crossing the bridge and falling"
      },
      {
        "start": 22.55,
        "end": 27.1,
        "vi": "Chú bán ếch, ở lại làm chi?",
        "en": "Uncle frog vendor, why stay behind?"
      },
      {
        "start": 27.05,
        "end": 31.7,
        "vi": "Con le le đánh trống thổi kèn",
        "en": "The whistling duck beats the drum and blows the horn"
      },
      {
        "start": 31.65,
        "end": 37.3,
        "vi": "Con bìm bịp thổi tót tì te tò te",
        "en": "The greater coucal toots with a toot-ti-te-to-te"
      },
      {
        "start": 37.85,
        "end": 41.8,
        "vi": "Bắc Kim Thang, Cà Lang Bí Rợ",
        "en": "Bac Kim Thang, Pumpkin and Gourd"
      },
      {
        "start": 41.75,
        "end": 46.0,
        "vi": "Cột qua kèo, là kèo qua cột",
        "en": "Tie the beam to the pillar, the pillar to the beam"
      },
      {
        "start": 46.05,
        "end": 50.0,
        "vi": "Chú ban dầu, qua cầu mà té",
        "en": "Uncle oil vendor, crossing the bridge and falling"
      },
      {
        "start": 50.05,
        "end": 54.6,
        "vi": "Chú bán ếch, ở lại làm chi?",
        "en": "Uncle frog vendor, why stay behind?"
      },
      {
        "start": 54.55,
        "end": 59.3,
        "vi": "Con le le đánh trống thổi kèn",
        "en": "The whistling duck beats the drum and blows the horn"
      },
      {
        "start": 59.25,
        "end": 64.4,
        "vi": "Con bìm bịp thổi tót tì te tò te",
        "en": "The greater coucal toots with a toot-ti-te-to-te"
      },
      {
        "start": 75.35,
        "end": 79.4,
        "vi": "Bắc Kim Thang, Cà Lang Bí Rợ",
        "en": "Bac Kim Thang, Pumpkin and Gourd"
      },
      {
        "start": 79.35,
        "end": 83.6,
        "vi": "Cột qua kèo, là kèo qua cột",
        "en": "Tie the beam to the pillar, the pillar to the beam"
      },
      {
        "start": 83.55,
        "end": 87.7,
        "vi": "Chú ban dầu, qua cầu mà té",
        "en": "Uncle oil vendor, crossing the bridge and falling"
      },
      {
        "start": 87.75,
        "end": 92.2,
        "vi": "Chú bán ếch, ở lại làm chi?",
        "en": "Uncle frog vendor, why stay behind?"
      },
      {
        "start": 92.15,
        "end": 96.9,
        "vi": "Con le le đánh trống thổi kèn",
        "en": "The whistling duck beats the drum and blows the horn"
      },
      {
        "start": 96.85,
        "end": 102.1,
        "vi": "Con bìm bịp thổi tót tì te tò te",
        "en": "The greater coucal toots with a toot-ti-te-to-te"
      },
      {
        "start": 102.65,
        "end": 106.8,
        "vi": "Bắc Kim Thang, Cà Lang Bí Rợ",
        "en": "Bac Kim Thang, Pumpkin and Gourd"
      },
      {
        "start": 106.75,
        "end": 111.0,
        "vi": "Cột qua kèo, là kèo qua cột",
        "en": "Tie the beam to the pillar, the pillar to the beam"
      },
      {
        "start": 110.95,
        "end": 115.2,
        "vi": "Chú ban dầu, qua cầu mà té",
        "en": "Uncle oil vendor, crossing the bridge and falling"
      },
      {
        "start": 115.15,
        "end": 119.7,
        "vi": "Chú bán ếch, ở lại làm chi?",
        "en": "Uncle frog vendor, why stay behind?"
      },
      {
        "start": 119.65,
        "end": 124.3,
        "vi": "Con le le đánh trống thổi kèn",
        "en": "The whistling duck beats the drum and blows the horn"
      },
      {
        "start": 124.25,
        "end": 129.9,
        "vi": "Con bìm bịp thổi tót tì te tò te",
        "en": "The greater coucal toots with a toot-ti-te-to-te"
      }
    ],
    "englishTranslation": [
      "Bac Kim Thang, Pumpkin and Gourd",
      "Tie the beam to the pillar, the pillar to the beam",
      "Uncle oil vendor, crossing the bridge and falling",
      "Uncle frog vendor, why stay behind?",
      "The whistling duck beats the drum and blows the horn",
      "The greater coucal toots with a toot-ti-te-to-te",
      "Bac Kim Thang, Pumpkin and Gourd",
      "Tie the beam to the pillar, the pillar to the beam",
      "Uncle oil vendor, crossing the bridge and falling",
      "Uncle frog vendor, why stay behind?",
      "The whistling duck beats the drum and blows the horn",
      "The greater coucal toots with a toot-ti-te-to-te",
      "Bac Kim Thang, Pumpkin and Gourd",
      "Tie the beam to the pillar, the pillar to the beam",
      "Uncle oil vendor, crossing the bridge and falling",
      "Uncle frog vendor, why stay behind?",
      "The whistling duck beats the drum and blows the horn",
      "The greater coucal toots with a toot-ti-te-to-te",
      "Bac Kim Thang, Pumpkin and Gourd",
      "Tie the beam to the pillar, the pillar to the beam",
      "Uncle oil vendor, crossing the bridge and falling",
      "Uncle frog vendor, why stay behind?",
      "The whistling duck beats the drum and blows the horn",
      "The greater coucal toots with a toot-ti-te-to-te"
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
    "isVocalTrack": true
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
    "durationSec": 282,
    "melodyStyle": "gentle",
    "lyrics": [
      "Music Interlude",
      "Ngày đầu tiên đi học, mẹ dắt tay đến trường.",
      "Em vừa đi vừa khóc, mẹ dỗ dành yêu thương.",
      "Ngày đầu như thế đó, cô giáo như mẹ hiền.",
      "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
      "Ngày đầu tiên đi học, mẹ dắt tay đến trường.",
      "Em vừa đi vừa khóc, mẹ dỗ dành yêu thương.",
      "Ngày đầu như thế đó, cô giáo như mẹ hiền.",
      "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
      "Music Interlude",
      "Ngày đầu tiên đi học, mẹ dắt tay đến trường.",
      "Em vừa đi vừa khóc, mẹ dỗ dành yêu thương.",
      "Ngày đầu như thế đó, cô giáo như mẹ hiền.",
      "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa."
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 31.9,
        "vi": "Music Interlude",
        "en": "Music Interlude"
      },
      {
        "start": 31.75,
        "end": 43.7,
        "vi": "Ngày đầu tiên đi học, mẹ dắt tay đến trường.",
        "en": "On the first day of school, Mom holds my hand to school."
      },
      {
        "start": 43.55,
        "end": 56.5,
        "vi": "Em vừa đi vừa khóc, mẹ dỗ dành yêu thương.",
        "en": "I walked while crying, Mom comforted me with love."
      },
      {
        "start": 56.35,
        "end": 69.1,
        "vi": "Ngày đầu như thế đó, cô giáo như mẹ hiền.",
        "en": "That's how the first day was, the teacher is like a gentle mother."
      },
      {
        "start": 68.95,
        "end": 84.0,
        "vi": "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
        "en": "Now that I've grown up, I still remember the old days."
      },
      {
        "start": 83.85,
        "end": 96.4,
        "vi": "Ngày đầu tiên đi học, mẹ dắt tay đến trường.",
        "en": "On the first day of school, Mom holds my hand to school."
      },
      {
        "start": 96.25,
        "end": 109.1,
        "vi": "Em vừa đi vừa khóc, mẹ dỗ dành yêu thương.",
        "en": "I walked while crying, Mom comforted me with love."
      },
      {
        "start": 108.95,
        "end": 121.8,
        "vi": "Ngày đầu như thế đó, cô giáo như mẹ hiền.",
        "en": "That's how the first day was, the teacher is like a gentle mother."
      },
      {
        "start": 121.65,
        "end": 135.0,
        "vi": "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
        "en": "Now that I've grown up, I still remember the old days."
      },
      {
        "start": 134.85,
        "end": 166.4,
        "vi": "Music Interlude",
        "en": "Music Interlude"
      },
      {
        "start": 166.25,
        "end": 178.8,
        "vi": "Ngày đầu tiên đi học, mẹ dắt tay đến trường.",
        "en": "On the first day of school, Mom holds my hand to school."
      },
      {
        "start": 178.65,
        "end": 191.7,
        "vi": "Em vừa đi vừa khóc, mẹ dỗ dành yêu thương.",
        "en": "I walked while crying, Mom comforted me with love."
      },
      {
        "start": 191.55,
        "end": 204.5,
        "vi": "Ngày đầu như thế đó, cô giáo như mẹ hiền.",
        "en": "That's how the first day was, the teacher is like a gentle mother."
      },
      {
        "start": 204.35,
        "end": 282.0,
        "vi": "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
        "en": "Now that I've grown up, I still remember the old days."
      }
    ],
    "englishTranslation": [
      "Music Interlude",
      "On the first day of school, Mom holds my hand to school.",
      "I walked while crying, Mom comforted me with love.",
      "That's how the first day was, the teacher is like a gentle mother.",
      "Now that I've grown up, I still remember the old days.",
      "On the first day of school, Mom holds my hand to school.",
      "I walked while crying, Mom comforted me with love.",
      "That's how the first day was, the teacher is like a gentle mother.",
      "Now that I've grown up, I still remember the old days.",
      "Music Interlude",
      "On the first day of school, Mom holds my hand to school.",
      "I walked while crying, Mom comforted me with love.",
      "That's how the first day was, the teacher is like a gentle mother.",
      "Now that I've grown up, I still remember the old days."
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
    "durationSec": 195,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
      "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
      "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhé đi học đều.",
      "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
      "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
      "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
      "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhé đi học đều.",
      "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
      "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
      "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
      "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhé đi học đều.",
      "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
      "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
      "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
      "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhé đi học đều.",
      "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui, trường mẫu giáo chúng em rất vui."
    ],
    "lyricsData": [
      {
        "start": 27.95,
        "end": 34.9,
        "vi": "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
        "en": "The sun is up, I go to kindergarten, birds chirp on the branches to welcome us."
      },
      {
        "start": 34.75,
        "end": 41.8,
        "vi": "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
        "en": "The teacher praises me for studying hard, happily welcoming me to school."
      },
      {
        "start": 42.15,
        "end": 52.2,
        "vi": "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhé đi học đều.",
        "en": "I am happy to sing, my teacher teaches me many good things, be a good child and go to school regularly."
      },
      {
        "start": 52.05,
        "end": 58.7,
        "vi": "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
        "en": "Our kindergarten is beloved, our kindergarten makes us very happy."
      },
      {
        "start": 61.15,
        "end": 67.4,
        "vi": "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
        "en": "The sun is up, I go to kindergarten, birds chirp on the branches to welcome us."
      },
      {
        "start": 67.25,
        "end": 74.3,
        "vi": "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
        "en": "The teacher praises me for studying hard, happily welcoming me to school."
      },
      {
        "start": 74.75,
        "end": 84.4,
        "vi": "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhé đi học đều.",
        "en": "I am happy to sing, my teacher teaches me many good things, be a good child and go to school regularly."
      },
      {
        "start": 84.25,
        "end": 90.9,
        "vi": "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
        "en": "Our kindergarten is beloved, our kindergarten makes us very happy."
      },
      {
        "start": 121.35,
        "end": 127.6,
        "vi": "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
        "en": "The sun is up, I go to kindergarten, birds chirp on the branches to welcome us."
      },
      {
        "start": 127.45,
        "end": 134.5,
        "vi": "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
        "en": "The teacher praises me for studying hard, happily welcoming me to school."
      },
      {
        "start": 134.95,
        "end": 144.7,
        "vi": "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhé đi học đều.",
        "en": "I am happy to sing, my teacher teaches me many good things, be a good child and go to school regularly."
      },
      {
        "start": 144.55,
        "end": 150.8,
        "vi": "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
        "en": "Our kindergarten is beloved, our kindergarten makes us very happy."
      },
      {
        "start": 153.75,
        "end": 160.0,
        "vi": "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
        "en": "The sun is up, I go to kindergarten, birds chirp on the branches to welcome us."
      },
      {
        "start": 159.85,
        "end": 166.9,
        "vi": "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
        "en": "The teacher praises me for studying hard, happily welcoming me to school."
      },
      {
        "start": 167.25,
        "end": 177.1,
        "vi": "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhé đi học đều.",
        "en": "I am happy to sing, my teacher teaches me many good things, be a good child and go to school regularly."
      },
      {
        "start": 176.95,
        "end": 191.7,
        "vi": "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui, trường mẫu giáo chúng em rất vui.",
        "en": "Our kindergarten is beloved, our kindergarten makes us very happy, our kindergarten makes us very happy."
      }
    ],
    "englishTranslation": [
      "The sun is up, I go to kindergarten, birds chirp on the branches to welcome us.",
      "The teacher praises me for studying hard, happily welcoming me to school.",
      "I am happy to sing, my teacher teaches me many good things, be a good child and go to school regularly.",
      "Our kindergarten is beloved, our kindergarten makes us very happy.",
      "The sun is up, I go to kindergarten, birds chirp on the branches to welcome us.",
      "The teacher praises me for studying hard, happily welcoming me to school.",
      "I am happy to sing, my teacher teaches me many good things, be a good child and go to school regularly.",
      "Our kindergarten is beloved, our kindergarten makes us very happy.",
      "The sun is up, I go to kindergarten, birds chirp on the branches to welcome us.",
      "The teacher praises me for studying hard, happily welcoming me to school.",
      "I am happy to sing, my teacher teaches me many good things, be a good child and go to school regularly.",
      "Our kindergarten is beloved, our kindergarten makes us very happy.",
      "The sun is up, I go to kindergarten, birds chirp on the branches to welcome us.",
      "The teacher praises me for studying hard, happily welcoming me to school.",
      "I am happy to sing, my teacher teaches me many good things, be a good child and go to school regularly.",
      "Our kindergarten is beloved, our kindergarten makes us very happy, our kindergarten makes us very happy."
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
    "durationSec": 277,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Tạm biệt búp bê thân yêu,",
      "tạm biệt gấu mi-sa nhé.",
      "Tạm biệt thỏ trắng xinh xinh,",
      "mai tôi vào lớp một rồi.",
      "Nhớ lắm, quên sao được trường mầm non thân yêu.",
      "Tạm biệt búp bê thân yêu,",
      "tạm biệt gấu mi-sa nhé.",
      "Tạm biệt thỏ trắng xinh xinh,",
      "mai tôi vào lớp một rồi.",
      "Nhớ lắm, quên sao được trường mầm non thân yêu.",
      "Tạm biệt búp bê thân yêu,",
      "tạm biệt gấu mi-sa nhé.",
      "Tạm biệt thỏ trắng xinh xinh,",
      "mai tôi vào lớp một rồi.",
      "Nhớ lắm, quên sao được trường mầm non thân yêu.",
      "Tạm biệt búp bê thân yêu,",
      "tạm biệt gấu mi-sa nhé.",
      "Tạm biệt thỏ trắng xinh xinh,",
      "mai tôi vào lớp một rồi.",
      "Nhớ lắm, quên sao được trường mầm non thân yêu.",
      "Tạm biệt búp bê thân yêu,",
      "tạm biệt gấu mi-sa nhé.",
      "Tạm biệt thỏ trắng xinh xinh,",
      "mai tôi vào lớp một rồi.",
      "Nhớ lắm, quên sao được trường mầm non thân yêu.",
      "Tạm biệt búp bê thân yêu,",
      "tạm biệt gấu mi-sa nhé.",
      "Tạm biệt thỏ trắng xinh xinh,",
      "mai tôi vào lớp một rồi.",
      "Nhớ lắm, quên sao được trường mầm non thân yêu."
    ],
    "lyricsData": [
      {
        "start": 35.25,
        "end": 38.0,
        "vi": "Tạm biệt búp bê thân yêu,",
        "en": "Goodbye beloved doll,"
      },
      {
        "start": 37.95,
        "end": 41.2,
        "vi": "tạm biệt gấu mi-sa nhé.",
        "en": "goodbye Misha bear."
      },
      {
        "start": 41.15,
        "end": 44.3,
        "vi": "Tạm biệt thỏ trắng xinh xinh,",
        "en": "Goodbye cute little white rabbit,"
      },
      {
        "start": 44.25,
        "end": 47.0,
        "vi": "mai tôi vào lớp một rồi.",
        "en": "tomorrow I'm going to first grade."
      },
      {
        "start": 46.95,
        "end": 52.7,
        "vi": "Nhớ lắm, quên sao được trường mầm non thân yêu.",
        "en": "I'll miss it so much, how can I forget the dear kindergarten."
      },
      {
        "start": 63.35,
        "end": 66.0,
        "vi": "Tạm biệt búp bê thân yêu,",
        "en": "Goodbye beloved doll,"
      },
      {
        "start": 65.95,
        "end": 69.1,
        "vi": "tạm biệt gấu mi-sa nhé.",
        "en": "goodbye Misha bear."
      },
      {
        "start": 69.05,
        "end": 72.1,
        "vi": "Tạm biệt thỏ trắng xinh xinh,",
        "en": "Goodbye cute little white rabbit,"
      },
      {
        "start": 72.05,
        "end": 75.0,
        "vi": "mai tôi vào lớp một rồi.",
        "en": "tomorrow I'm going to first grade."
      },
      {
        "start": 74.95,
        "end": 81.3,
        "vi": "Nhớ lắm, quên sao được trường mầm non thân yêu.",
        "en": "I'll miss it so much, how can I forget the dear kindergarten."
      },
      {
        "start": 125.35,
        "end": 128.1,
        "vi": "Tạm biệt búp bê thân yêu,",
        "en": "Goodbye beloved doll,"
      },
      {
        "start": 128.05,
        "end": 131.1,
        "vi": "tạm biệt gấu mi-sa nhé.",
        "en": "goodbye Misha bear."
      },
      {
        "start": 131.05,
        "end": 134.2,
        "vi": "Tạm biệt thỏ trắng xinh xinh,",
        "en": "Goodbye cute little white rabbit,"
      },
      {
        "start": 134.15,
        "end": 137.0,
        "vi": "mai tôi vào lớp một rồi.",
        "en": "tomorrow I'm going to first grade."
      },
      {
        "start": 136.95,
        "end": 142.9,
        "vi": "Nhớ lắm, quên sao được trường mầm non thân yêu.",
        "en": "I'll miss it so much, how can I forget the dear kindergarten."
      },
      {
        "start": 153.55,
        "end": 156.4,
        "vi": "Tạm biệt búp bê thân yêu,",
        "en": "Goodbye beloved doll,"
      },
      {
        "start": 156.35,
        "end": 159.4,
        "vi": "tạm biệt gấu mi-sa nhé.",
        "en": "goodbye Misha bear."
      },
      {
        "start": 159.35,
        "end": 162.5,
        "vi": "Tạm biệt thỏ trắng xinh xinh,",
        "en": "Goodbye cute little white rabbit,"
      },
      {
        "start": 162.45,
        "end": 165.3,
        "vi": "mai tôi vào lớp một rồi.",
        "en": "tomorrow I'm going to first grade."
      },
      {
        "start": 165.25,
        "end": 171.3,
        "vi": "Nhớ lắm, quên sao được trường mầm non thân yêu.",
        "en": "I'll miss it so much, how can I forget the dear kindergarten."
      },
      {
        "start": 215.95,
        "end": 218.9,
        "vi": "Tạm biệt búp bê thân yêu,",
        "en": "Goodbye beloved doll,"
      },
      {
        "start": 218.85,
        "end": 221.9,
        "vi": "tạm biệt gấu mi-sa nhé.",
        "en": "goodbye Misha bear."
      },
      {
        "start": 221.85,
        "end": 225.0,
        "vi": "Tạm biệt thỏ trắng xinh xinh,",
        "en": "Goodbye cute little white rabbit,"
      },
      {
        "start": 224.95,
        "end": 227.8,
        "vi": "mai tôi vào lớp một rồi.",
        "en": "tomorrow I'm going to first grade."
      },
      {
        "start": 227.75,
        "end": 233.6,
        "vi": "Nhớ lắm, quên sao được trường mầm non thân yêu.",
        "en": "I'll miss it so much, how can I forget the dear kindergarten."
      },
      {
        "start": 244.05,
        "end": 246.9,
        "vi": "Tạm biệt búp bê thân yêu,",
        "en": "Goodbye beloved doll,"
      },
      {
        "start": 246.85,
        "end": 249.9,
        "vi": "tạm biệt gấu mi-sa nhé.",
        "en": "goodbye Misha bear."
      },
      {
        "start": 249.85,
        "end": 253.0,
        "vi": "Tạm biệt thỏ trắng xinh xinh,",
        "en": "Goodbye cute little white rabbit,"
      },
      {
        "start": 252.95,
        "end": 255.8,
        "vi": "mai tôi vào lớp một rồi.",
        "en": "tomorrow I'm going to first grade."
      },
      {
        "start": 255.75,
        "end": 262.0,
        "vi": "Nhớ lắm, quên sao được trường mầm non thân yêu.",
        "en": "I'll miss it so much, how can I forget the dear kindergarten."
      }
    ],
    "englishTranslation": [
      "Goodbye beloved doll,",
      "goodbye Misha bear.",
      "Goodbye cute little white rabbit,",
      "tomorrow I'm going to first grade.",
      "I'll miss it so much, how can I forget the dear kindergarten.",
      "Goodbye beloved doll,",
      "goodbye Misha bear.",
      "Goodbye cute little white rabbit,",
      "tomorrow I'm going to first grade.",
      "I'll miss it so much, how can I forget the dear kindergarten.",
      "Goodbye beloved doll,",
      "goodbye Misha bear.",
      "Goodbye cute little white rabbit,",
      "tomorrow I'm going to first grade.",
      "I'll miss it so much, how can I forget the dear kindergarten.",
      "Goodbye beloved doll,",
      "goodbye Misha bear.",
      "Goodbye cute little white rabbit,",
      "tomorrow I'm going to first grade.",
      "I'll miss it so much, how can I forget the dear kindergarten.",
      "Goodbye beloved doll,",
      "goodbye Misha bear.",
      "Goodbye cute little white rabbit,",
      "tomorrow I'm going to first grade.",
      "I'll miss it so much, how can I forget the dear kindergarten.",
      "Goodbye beloved doll,",
      "goodbye Misha bear.",
      "Goodbye cute little white rabbit,",
      "tomorrow I'm going to first grade.",
      "I'll miss it so much, how can I forget the dear kindergarten."
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
    "isVocalTrack": false
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
    "lyricsData": [
      {
        "start": 35.0,
        "end": 37.5,
        "vi": "Tạm biệt búp bê thân yêu",
        "en": "Goodbye lovely doll, goodbye cute teddy bear"
      },
      {
        "start": 37.8,
        "end": 40.8,
        "vi": "Tạm biệt gấu mi-sa nhé",
        "en": "Goodbye yellow birdie, now I enter grade one"
      },
      {
        "start": 41.0,
        "end": 44.2,
        "vi": "Tạm biệt thỏ trắng mắt tròn",
        "en": "I will remember my dear kindergarten school"
      },
      {
        "start": 44.3,
        "end": 47.0,
        "vi": "Mai tôi vào lớp một rồi!",
        "en": "Carrying sweet memories into grade one!"
      },
      {
        "start": 47.2,
        "end": 49.5,
        "vi": "Nhớ lắm quên sao được",
        "en": "Goodbye lovely doll, goodbye cute teddy bear"
      },
      {
        "start": 49.6,
        "end": 52.8,
        "vi": "Trường mầm non thân yêu!",
        "en": "Goodbye yellow birdie, now I enter grade one"
      }
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
    "durationSec": 139,
    "melodyStyle": "playful",
    "lyrics": [
      "Cô dạy em bài thể dục buổi sáng.",
      "1, 2, 3, 4 hít thở, hít thở, hít thở.",
      "Một, tay đưa cao lên trời.",
      "Hai, tay dang ngang bờ vai.",
      "Ba, tay song song trước mặt.",
      "Bốn, buông thả hai tay.",
      "Cô dạy em bài thể dục buổi sáng.",
      "1, 2, 3, 4 hít thở, hít thở, hít thở.",
      "Một, tay đưa cao lên trời.",
      "Hai, tay dang ngang bờ vai.",
      "Ba, tay song song trước mặt.",
      "Bốn, buông thả hai tay.",
      "Cô dạy em bài thể dục buổi sáng.",
      "1, 2, 3, 4 hít thở, hít thở, hít thở.",
      "Một, tay đưa cao lên trời.",
      "Hai, tay dang ngang bờ vai.",
      "Ba, tay song song trước mặt.",
      "Bốn, buông thả hai tay.",
      "Cô dạy em bài thể dục buổi sáng.",
      "1, 2, 3, 4 hít thở, hít thở, hít thở.",
      "Một, tay đưa cao lên trời.",
      "Hai, tay dang ngang bờ vai.",
      "Ba, tay song song trước mặt.",
      "Bốn, buông thả hai tay.",
      "1, 2, 3, 4 hít mạnh thở ra, hít mạnh thở ra."
    ],
    "lyricsData": [
      {
        "start": 13.75,
        "end": 18.0,
        "vi": "Cô dạy em bài thể dục buổi sáng.",
        "en": "Teacher teaches me morning exercises."
      },
      {
        "start": 17.85,
        "end": 22.0,
        "vi": "1, 2, 3, 4 hít thở, hít thở, hít thở.",
        "en": "1, 2, 3, 4 breathe in, breathe out, breathe in."
      },
      {
        "start": 21.85,
        "end": 24.4,
        "vi": "Một, tay đưa cao lên trời.",
        "en": "One, hands raised high to the sky."
      },
      {
        "start": 24.25,
        "end": 26.5,
        "vi": "Hai, tay dang ngang bờ vai.",
        "en": "Two, hands outstretched at shoulder level."
      },
      {
        "start": 26.35,
        "end": 28.9,
        "vi": "Ba, tay song song trước mặt.",
        "en": "Three, hands parallel in front."
      },
      {
        "start": 28.75,
        "end": 31.0,
        "vi": "Bốn, buông thả hai tay.",
        "en": "Four, drop both arms down."
      },
      {
        "start": 30.85,
        "end": 35.1,
        "vi": "Cô dạy em bài thể dục buổi sáng.",
        "en": "Teacher teaches me morning exercises."
      },
      {
        "start": 34.95,
        "end": 39.1,
        "vi": "1, 2, 3, 4 hít thở, hít thở, hít thở.",
        "en": "1, 2, 3, 4 breathe in, breathe out, breathe in."
      },
      {
        "start": 38.95,
        "end": 41.5,
        "vi": "Một, tay đưa cao lên trời.",
        "en": "One, hands raised high to the sky."
      },
      {
        "start": 41.35,
        "end": 43.5,
        "vi": "Hai, tay dang ngang bờ vai.",
        "en": "Two, hands outstretched at shoulder level."
      },
      {
        "start": 43.35,
        "end": 46.0,
        "vi": "Ba, tay song song trước mặt.",
        "en": "Three, hands parallel in front."
      },
      {
        "start": 45.85,
        "end": 48.0,
        "vi": "Bốn, buông thả hai tay.",
        "en": "Four, drop both arms down."
      },
      {
        "start": 77.55,
        "end": 81.8,
        "vi": "Cô dạy em bài thể dục buổi sáng.",
        "en": "Teacher teaches me morning exercises."
      },
      {
        "start": 81.65,
        "end": 85.7,
        "vi": "1, 2, 3, 4 hít thở, hít thở, hít thở.",
        "en": "1, 2, 3, 4 breathe in, breathe out, breathe in."
      },
      {
        "start": 85.55,
        "end": 88.1,
        "vi": "Một, tay đưa cao lên trời.",
        "en": "One, hands raised high to the sky."
      },
      {
        "start": 87.95,
        "end": 90.1,
        "vi": "Hai, tay dang ngang bờ vai.",
        "en": "Two, hands outstretched at shoulder level."
      },
      {
        "start": 89.95,
        "end": 92.4,
        "vi": "Ba, tay song song trước mặt.",
        "en": "Three, hands parallel in front."
      },
      {
        "start": 92.25,
        "end": 94.5,
        "vi": "Bốn, buông thả hai tay.",
        "en": "Four, drop both arms down."
      },
      {
        "start": 111.15,
        "end": 115.4,
        "vi": "Cô dạy em bài thể dục buổi sáng.",
        "en": "Teacher teaches me morning exercises."
      },
      {
        "start": 115.25,
        "end": 119.5,
        "vi": "1, 2, 3, 4 hít thở, hít thở, hít thở.",
        "en": "1, 2, 3, 4 breathe in, breathe out, breathe in."
      },
      {
        "start": 119.35,
        "end": 121.8,
        "vi": "Một, tay đưa cao lên trời.",
        "en": "One, hands raised high to the sky."
      },
      {
        "start": 121.65,
        "end": 123.9,
        "vi": "Hai, tay dang ngang bờ vai.",
        "en": "Two, hands outstretched at shoulder level."
      },
      {
        "start": 123.75,
        "end": 126.2,
        "vi": "Ba, tay song song trước mặt.",
        "en": "Three, hands parallel in front."
      },
      {
        "start": 126.05,
        "end": 128.5,
        "vi": "Bốn, buông thả hai tay.",
        "en": "Four, drop both arms down."
      },
      {
        "start": 128.35,
        "end": 133.4,
        "vi": "1, 2, 3, 4 hít mạnh thở ra, hít mạnh thở ra.",
        "en": "1, 2, 3, 4 breathe in deeply and breathe out, breathe in deeply and breathe out."
      }
    ],
    "englishTranslation": [
      "Teacher teaches me morning exercises.",
      "1, 2, 3, 4 breathe in, breathe out, breathe in.",
      "One, hands raised high to the sky.",
      "Two, hands outstretched at shoulder level.",
      "Three, hands parallel in front.",
      "Four, drop both arms down.",
      "Teacher teaches me morning exercises.",
      "1, 2, 3, 4 breathe in, breathe out, breathe in.",
      "One, hands raised high to the sky.",
      "Two, hands outstretched at shoulder level.",
      "Three, hands parallel in front.",
      "Four, drop both arms down.",
      "Teacher teaches me morning exercises.",
      "1, 2, 3, 4 breathe in, breathe out, breathe in.",
      "One, hands raised high to the sky.",
      "Two, hands outstretched at shoulder level.",
      "Three, hands parallel in front.",
      "Four, drop both arms down.",
      "Teacher teaches me morning exercises.",
      "1, 2, 3, 4 breathe in, breathe out, breathe in.",
      "One, hands raised high to the sky.",
      "Two, hands outstretched at shoulder level.",
      "Three, hands parallel in front.",
      "Four, drop both arms down.",
      "1, 2, 3, 4 breathe in deeply and breathe out, breathe in deeply and breathe out."
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
    "isVocalTrack": true
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
    "durationSec": 214,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Chiếc đèn ông sao sao năm cánh tươi màu",
      "Cân đây dâng dài can cào qua đầu, em cầm đèn sao em hát vang vang, để dâu tươi màu của đêm rằm liên hoan",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa non ngàn",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao bác hồ tỏa sáng nơi nơi",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa non ngàn",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao bác hồ tỏa sáng nơi nơi",
      "Đây đèn ông sao sao năm cánh tươi vàng",
      "Ánh sao sáng ngời chiêu miền non ngàn, em cầm đèn sao em hát vang vang",
      "Để ánh hoa bình đuổi xuôn lại xâm lang",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa non ngàn",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao bác hồ tỏa sáng nơi nơi",
      "Chiếc đèn ông sao sao năm cánh tươi màu",
      "Căn đây dâng dài can cào qua đầu, em cầm đèn sao em hát vang vang",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa non ngàn",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao bác hồ tỏa sáng nơi nơi",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa non ngàn",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao bác hồ tỏa sáng nơi nơi"
    ],
    "lyricsData": [
      {
        "start": 27.35,
        "end": 32.8,
        "vi": "Chiếc đèn ông sao sao năm cánh tươi màu",
        "en": "Star lantern with five bright petals"
      },
      {
        "start": 32.65,
        "end": 38.9,
        "vi": "Cân đây dâng dài can cào qua đầu, em cầm đèn sao em hát vang vang, để dâu tươi màu của đêm rằm liên hoan",
        "en": "Balanced long pole high above head, I hold the star lantern singing loudly, to keep the bright color of the Mid-Autumn festival party"
      },
      {
        "start": 39.75,
        "end": 45.3,
        "vi": "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa non ngàn",
        "en": "Tùng rinh rinh tùng tùng tùng rinh rinh, this happy star light shines far over mountains and forests"
      },
      {
        "start": 45.15,
        "end": 50.8,
        "vi": "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao bác hồ tỏa sáng nơi nơi",
        "en": "Tùng rinh rinh rinh rinh tùng rinh rinh, Uncle Ho's star shines everywhere"
      },
      {
        "start": 50.65,
        "end": 56.2,
        "vi": "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa non ngàn",
        "en": "Tùng rinh rinh tùng tùng tùng rinh rinh, this happy star light shines far over mountains and forests"
      },
      {
        "start": 56.05,
        "end": 61.8,
        "vi": "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao bác hồ tỏa sáng nơi nơi",
        "en": "Tùng rinh rinh rinh rinh tùng rinh rinh, Uncle Ho's star shines everywhere"
      },
      {
        "start": 62.15,
        "end": 67.7,
        "vi": "Đây đèn ông sao sao năm cánh tươi vàng",
        "en": "This is the star lantern with five golden petals"
      },
      {
        "start": 67.55,
        "end": 73.9,
        "vi": "Ánh sao sáng ngời chiêu miền non ngàn, em cầm đèn sao em hát vang vang",
        "en": "The brilliant star shines across mountains and forests, I hold the star lantern singing loudly"
      },
      {
        "start": 73.75,
        "end": 79.5,
        "vi": "Để ánh hoa bình đuổi xuôn lại xâm lang",
        "en": "To let the light of peace drive away invaders"
      },
      {
        "start": 79.35,
        "end": 85.2,
        "vi": "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa non ngàn",
        "en": "Tùng rinh rinh tùng tùng tùng rinh rinh, this happy star light shines far over mountains and forests"
      },
      {
        "start": 85.05,
        "end": 96.7,
        "vi": "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao bác hồ tỏa sáng nơi nơi",
        "en": "Tùng rinh rinh rinh rinh tùng rinh rinh, Uncle Ho's star shines everywhere"
      },
      {
        "start": 154.75,
        "end": 160.4,
        "vi": "Chiếc đèn ông sao sao năm cánh tươi màu",
        "en": "Star lantern with five bright petals"
      },
      {
        "start": 160.25,
        "end": 166.4,
        "vi": "Căn đây dâng dài can cào qua đầu, em cầm đèn sao em hát vang vang",
        "en": "Balanced long pole high above head, I hold the star lantern singing loudly"
      },
      {
        "start": 166.25,
        "end": 172.4,
        "vi": "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa non ngàn",
        "en": "Tùng rinh rinh tùng tùng tùng rinh rinh, this happy star light shines far over mountains and forests"
      },
      {
        "start": 172.25,
        "end": 177.9,
        "vi": "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao bác hồ tỏa sáng nơi nơi",
        "en": "Tùng rinh rinh rinh rinh tùng rinh rinh, Uncle Ho's star shines everywhere"
      },
      {
        "start": 177.75,
        "end": 183.5,
        "vi": "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa non ngàn",
        "en": "Tùng rinh rinh tùng tùng tùng rinh rinh, this happy star light shines far over mountains and forests"
      },
      {
        "start": 183.35,
        "end": 202.5,
        "vi": "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao bác hồ tỏa sáng nơi nơi",
        "en": "Tùng rinh rinh rinh rinh tùng rinh rinh, Uncle Ho's star shines everywhere"
      }
    ],
    "englishTranslation": [
      "Star lantern with five bright petals",
      "Balanced long pole high above head, I hold the star lantern singing loudly, to keep the bright color of the Mid-Autumn festival party",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, this happy star light shines far over mountains and forests",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, Uncle Ho's star shines everywhere",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, this happy star light shines far over mountains and forests",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, Uncle Ho's star shines everywhere",
      "This is the star lantern with five golden petals",
      "The brilliant star shines across mountains and forests, I hold the star lantern singing loudly",
      "To let the light of peace drive away invaders",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, this happy star light shines far over mountains and forests",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, Uncle Ho's star shines everywhere",
      "Star lantern with five bright petals",
      "Balanced long pole high above head, I hold the star lantern singing loudly",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, this happy star light shines far over mountains and forests",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, Uncle Ho's star shines everywhere",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, this happy star light shines far over mountains and forests",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, Uncle Ho's star shines everywhere"
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
    "durationSec": 421,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
      "Bồ câu ơi, cánh chim gù thương mến.",
      "Hải âu ơi, cánh chim vờn trên sóng,",
      "cùng bay nào.",
      "Cho trái đất quay, cùng bay nào.",
      "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
      "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quê,",
      "tình thương thơm, ngát toả màu tươi thắm, màu da nào.",
      "Cùng vẫy vùng thơm, màu da nào.",
      "Cùng vẫy vùng thơm.",
      "Trái đất này là của chúng mình, cùng siết tay,",
      "môi thắm cười xinh. Bình minh ơi,",
      "phúc ca này êm ấm, học chăm ngoan,",
      "đắp xây đời tươi sáng, hành tinh này.",
      "Là ngôi nhà chung, hành tinh này.",
      "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
      "Bồ câu ơi, cánh chim gù thương mến.",
      "Hải âu ơi, cánh chim vờn trên sóng,",
      "cùng bay nào.",
      "Cho trái đất quay, cùng bay nào.",
      "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
      "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quê,",
      "tình thương thơm, ngát toả màu tươi thắm, màu da nào.",
      "Cùng vẫy vùng thơm, màu da nào.",
      "Cùng vẫy vùng thơm.",
      "Trái đất này là của chúng mình, cùng siết tay,",
      "môi thắm cười xinh. Bình minh ơi,",
      "phúc ca này êm ấm, học chăm ngoan,",
      "đắp xây đời tươi sáng, hành tinh này.",
      "Là ngôi nhà chung, hành tinh này.",
      "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
      "Bồ câu ơi, cánh chim gù thương mến.",
      "Hải âu ơi, cánh chim vờn trên sóng,",
      "cùng bay nào.",
      "Cho trái đất quay, cùng bay nào.",
      "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
      "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quê,",
      "tình thương thơm, ngát toả màu tươi thắm, màu da nào.",
      "Cùng vẫy vùng thơm, màu da nào.",
      "Cùng vẫy vùng thơm.",
      "Trái đất này là của chúng mình, cùng siết tay,",
      "môi thắm cười xinh. Bình minh ơi,",
      "phúc ca này êm ấm, học chăm ngoan,",
      "đắp xây đời tươi sáng, hành tinh này.",
      "Là ngôi nhà chung, hành tinh này.",
      "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
      "Bồ câu ơi, cánh chim gù thương mến.",
      "Hải âu ơi, cánh chim vờn trên sóng,",
      "cùng bay nào.",
      "Cho trái đất quay, cùng bay nào.",
      "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
      "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quê,",
      "tình thương thơm, ngát toả màu tươi thắm, màu da nào.",
      "Cùng vẫy vùng thơm, màu da nào.",
      "Cùng vẫy vùng thơm.",
      "Trái đất này là của chúng mình, cùng siết tay,",
      "môi thắm cười xinh. Bình minh ơi,",
      "phúc ca này êm ấm, học chăm ngoan,",
      "đắp xây đời tươi sáng, hành tinh này.",
      "Là ngôi nhà chung, hành tinh này."
    ],
    "lyricsData": [
      {
        "start": 18.55,
        "end": 26.5,
        "vi": "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
        "en": "This Earth belongs to us, the green globe, flying in the blue sky."
      },
      {
        "start": 26.35,
        "end": 30.4,
        "vi": "Bồ câu ơi, cánh chim gù thương mến.",
        "en": "Oh dove, the cooing wings of love."
      },
      {
        "start": 30.25,
        "end": 34.9,
        "vi": "Hải âu ơi, cánh chim vờn trên sóng,",
        "en": "Oh seagull, the wings hovering over the waves,"
      },
      {
        "start": 34.75,
        "end": 37.3,
        "vi": "cùng bay nào.",
        "en": "let's fly together."
      },
      {
        "start": 38.05,
        "end": 43.0,
        "vi": "Cho trái đất quay, cùng bay nào.",
        "en": "Make the Earth spin, let's fly together."
      },
      {
        "start": 43.75,
        "end": 52.4,
        "vi": "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
        "en": "Make the Earth spin, This Earth belongs to us, yellow, white, black,"
      },
      {
        "start": 52.25,
        "end": 58.3,
        "vi": "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quê,",
        "en": "despite different skin colors. Dear friends, we are flowers of the countryside,"
      },
      {
        "start": 58.65,
        "end": 64.5,
        "vi": "tình thương thơm, ngát toả màu tươi thắm, màu da nào.",
        "en": "fragrant love spreading fresh colors, whatever skin color."
      },
      {
        "start": 66.15,
        "end": 70.7,
        "vi": "Cùng vẫy vùng thơm, màu da nào.",
        "en": "Waving and spreading fragrance, whatever skin color."
      },
      {
        "start": 72.15,
        "end": 77.3,
        "vi": "Cùng vẫy vùng thơm.",
        "en": "Waving and spreading fragrance together."
      },
      {
        "start": 79.25,
        "end": 85.1,
        "vi": "Trái đất này là của chúng mình, cùng siết tay,",
        "en": "This Earth belongs to us, holding hands together,"
      },
      {
        "start": 84.95,
        "end": 89.8,
        "vi": "môi thắm cười xinh. Bình minh ơi,",
        "en": "smiling brightly. Oh dawn,"
      },
      {
        "start": 89.65,
        "end": 95.3,
        "vi": "phúc ca này êm ấm, học chăm ngoan,",
        "en": "this song of blessing is peaceful and warm, studying diligently,"
      },
      {
        "start": 95.15,
        "end": 100.8,
        "vi": "đắp xây đời tươi sáng, hành tinh này.",
        "en": "building a bright life, this planet."
      },
      {
        "start": 100.65,
        "end": 107.3,
        "vi": "Là ngôi nhà chung, hành tinh này.",
        "en": "It's a common home, this planet."
      },
      {
        "start": 124.95,
        "end": 133.0,
        "vi": "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
        "en": "This Earth belongs to us, the green globe, flying in the blue sky."
      },
      {
        "start": 132.85,
        "end": 137.0,
        "vi": "Bồ câu ơi, cánh chim gù thương mến.",
        "en": "Oh dove, the cooing wings of love."
      },
      {
        "start": 136.85,
        "end": 142.0,
        "vi": "Hải âu ơi, cánh chim vờn trên sóng,",
        "en": "Oh seagull, the wings hovering over the waves,"
      },
      {
        "start": 141.85,
        "end": 144.4,
        "vi": "cùng bay nào.",
        "en": "let's fly together."
      },
      {
        "start": 144.85,
        "end": 149.0,
        "vi": "Cho trái đất quay, cùng bay nào.",
        "en": "Make the Earth spin, let's fly together."
      },
      {
        "start": 150.75,
        "end": 159.1,
        "vi": "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
        "en": "Make the Earth spin, This Earth belongs to us, yellow, white, black,"
      },
      {
        "start": 158.95,
        "end": 164.4,
        "vi": "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quê,",
        "en": "despite different skin colors. Dear friends, we are flowers of the countryside,"
      },
      {
        "start": 165.15,
        "end": 171.0,
        "vi": "tình thương thơm, ngát toả màu tươi thắm, màu da nào.",
        "en": "fragrant love spreading fresh colors, whatever skin color."
      },
      {
        "start": 172.55,
        "end": 177.1,
        "vi": "Cùng vẫy vùng thơm, màu da nào.",
        "en": "Waving and spreading fragrance, whatever skin color."
      },
      {
        "start": 178.55,
        "end": 183.6,
        "vi": "Cùng vẫy vùng thơm.",
        "en": "Waving and spreading fragrance together."
      },
      {
        "start": 185.55,
        "end": 191.4,
        "vi": "Trái đất này là của chúng mình, cùng siết tay,",
        "en": "This Earth belongs to us, holding hands together,"
      },
      {
        "start": 191.25,
        "end": 196.1,
        "vi": "môi thắm cười xinh. Bình minh ơi,",
        "en": "smiling brightly. Oh dawn,"
      },
      {
        "start": 195.95,
        "end": 201.6,
        "vi": "phúc ca này êm ấm, học chăm ngoan,",
        "en": "this song of blessing is peaceful and warm, studying diligently,"
      },
      {
        "start": 201.45,
        "end": 207.1,
        "vi": "đắp xây đời tươi sáng, hành tinh này.",
        "en": "building a bright life, this planet."
      },
      {
        "start": 206.95,
        "end": 213.6,
        "vi": "Là ngôi nhà chung, hành tinh này.",
        "en": "It's a common home, this planet."
      },
      {
        "start": 218.85,
        "end": 226.8,
        "vi": "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
        "en": "This Earth belongs to us, the green globe, flying in the blue sky."
      },
      {
        "start": 226.65,
        "end": 230.8,
        "vi": "Bồ câu ơi, cánh chim gù thương mến.",
        "en": "Oh dove, the cooing wings of love."
      },
      {
        "start": 230.65,
        "end": 235.3,
        "vi": "Hải âu ơi, cánh chim vờn trên sóng,",
        "en": "Oh seagull, the wings hovering over the waves,"
      },
      {
        "start": 235.15,
        "end": 237.7,
        "vi": "cùng bay nào.",
        "en": "let's fly together."
      },
      {
        "start": 238.35,
        "end": 243.4,
        "vi": "Cho trái đất quay, cùng bay nào.",
        "en": "Make the Earth spin, let's fly together."
      },
      {
        "start": 244.05,
        "end": 252.7,
        "vi": "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
        "en": "Make the Earth spin, This Earth belongs to us, yellow, white, black,"
      },
      {
        "start": 252.55,
        "end": 258.6,
        "vi": "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quê,",
        "en": "despite different skin colors. Dear friends, we are flowers of the countryside,"
      },
      {
        "start": 258.95,
        "end": 264.8,
        "vi": "tình thương thơm, ngát toả màu tươi thắm, màu da nào.",
        "en": "fragrant love spreading fresh colors, whatever skin color."
      },
      {
        "start": 266.45,
        "end": 271.0,
        "vi": "Cùng vẫy vùng thơm, màu da nào.",
        "en": "Waving and spreading fragrance, whatever skin color."
      },
      {
        "start": 272.45,
        "end": 277.6,
        "vi": "Cùng vẫy vùng thơm.",
        "en": "Waving and spreading fragrance together."
      },
      {
        "start": 279.45,
        "end": 285.3,
        "vi": "Trái đất này là của chúng mình, cùng siết tay,",
        "en": "This Earth belongs to us, holding hands together,"
      },
      {
        "start": 285.15,
        "end": 290.0,
        "vi": "môi thắm cười xinh. Bình minh ơi,",
        "en": "smiling brightly. Oh dawn,"
      },
      {
        "start": 289.85,
        "end": 295.5,
        "vi": "phúc ca này êm ấm, học chăm ngoan,",
        "en": "this song of blessing is peaceful and warm, studying diligently,"
      },
      {
        "start": 295.35,
        "end": 301.0,
        "vi": "đắp xây đời tươi sáng, hành tinh này.",
        "en": "building a bright life, this planet."
      },
      {
        "start": 300.85,
        "end": 307.5,
        "vi": "Là ngôi nhà chung, hành tinh này.",
        "en": "It's a common home, this planet."
      },
      {
        "start": 325.55,
        "end": 333.5,
        "vi": "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
        "en": "This Earth belongs to us, the green globe, flying in the blue sky."
      },
      {
        "start": 333.35,
        "end": 337.5,
        "vi": "Bồ câu ơi, cánh chim gù thương mến.",
        "en": "Oh dove, the cooing wings of love."
      },
      {
        "start": 337.35,
        "end": 342.0,
        "vi": "Hải âu ơi, cánh chim vờn trên sóng,",
        "en": "Oh seagull, the wings hovering over the waves,"
      },
      {
        "start": 341.85,
        "end": 344.4,
        "vi": "cùng bay nào.",
        "en": "let's fly together."
      },
      {
        "start": 345.05,
        "end": 350.1,
        "vi": "Cho trái đất quay, cùng bay nào.",
        "en": "Make the Earth spin, let's fly together."
      },
      {
        "start": 350.75,
        "end": 359.4,
        "vi": "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
        "en": "Make the Earth spin, This Earth belongs to us, yellow, white, black,"
      },
      {
        "start": 359.25,
        "end": 365.3,
        "vi": "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quê,",
        "en": "despite different skin colors. Dear friends, we are flowers of the countryside,"
      },
      {
        "start": 365.65,
        "end": 371.5,
        "vi": "tình thương thơm, ngát toả màu tươi thắm, màu da nào.",
        "en": "fragrant love spreading fresh colors, whatever skin color."
      },
      {
        "start": 373.15,
        "end": 377.7,
        "vi": "Cùng vẫy vùng thơm, màu da nào.",
        "en": "Waving and spreading fragrance, whatever skin color."
      },
      {
        "start": 379.15,
        "end": 384.3,
        "vi": "Cùng vẫy vùng thơm.",
        "en": "Waving and spreading fragrance together."
      },
      {
        "start": 386.15,
        "end": 392.0,
        "vi": "Trái đất này là của chúng mình, cùng siết tay,",
        "en": "This Earth belongs to us, holding hands together,"
      },
      {
        "start": 391.85,
        "end": 396.7,
        "vi": "môi thắm cười xinh. Bình minh ơi,",
        "en": "smiling brightly. Oh dawn,"
      },
      {
        "start": 396.55,
        "end": 402.2,
        "vi": "phúc ca này êm ấm, học chăm ngoan,",
        "en": "this song of blessing is peaceful and warm, studying diligently,"
      },
      {
        "start": 402.05,
        "end": 407.7,
        "vi": "đắp xây đời tươi sáng, hành tinh này.",
        "en": "building a bright life, this planet."
      },
      {
        "start": 407.55,
        "end": 414.4,
        "vi": "Là ngôi nhà chung, hành tinh này.",
        "en": "It's a common home, this planet."
      }
    ],
    "englishTranslation": [
      "This Earth belongs to us, the green globe, flying in the blue sky.",
      "Oh dove, the cooing wings of love.",
      "Oh seagull, the wings hovering over the waves,",
      "let's fly together.",
      "Make the Earth spin, let's fly together.",
      "Make the Earth spin, This Earth belongs to us, yellow, white, black,",
      "despite different skin colors. Dear friends, we are flowers of the countryside,",
      "fragrant love spreading fresh colors, whatever skin color.",
      "Waving and spreading fragrance, whatever skin color.",
      "Waving and spreading fragrance together.",
      "This Earth belongs to us, holding hands together,",
      "smiling brightly. Oh dawn,",
      "this song of blessing is peaceful and warm, studying diligently,",
      "building a bright life, this planet.",
      "It's a common home, this planet.",
      "This Earth belongs to us, the green globe, flying in the blue sky.",
      "Oh dove, the cooing wings of love.",
      "Oh seagull, the wings hovering over the waves,",
      "let's fly together.",
      "Make the Earth spin, let's fly together.",
      "Make the Earth spin, This Earth belongs to us, yellow, white, black,",
      "despite different skin colors. Dear friends, we are flowers of the countryside,",
      "fragrant love spreading fresh colors, whatever skin color.",
      "Waving and spreading fragrance, whatever skin color.",
      "Waving and spreading fragrance together.",
      "This Earth belongs to us, holding hands together,",
      "smiling brightly. Oh dawn,",
      "this song of blessing is peaceful and warm, studying diligently,",
      "building a bright life, this planet.",
      "It's a common home, this planet.",
      "This Earth belongs to us, the green globe, flying in the blue sky.",
      "Oh dove, the cooing wings of love.",
      "Oh seagull, the wings hovering over the waves,",
      "let's fly together.",
      "Make the Earth spin, let's fly together.",
      "Make the Earth spin, This Earth belongs to us, yellow, white, black,",
      "despite different skin colors. Dear friends, we are flowers of the countryside,",
      "fragrant love spreading fresh colors, whatever skin color.",
      "Waving and spreading fragrance, whatever skin color.",
      "Waving and spreading fragrance together.",
      "This Earth belongs to us, holding hands together,",
      "smiling brightly. Oh dawn,",
      "this song of blessing is peaceful and warm, studying diligently,",
      "building a bright life, this planet.",
      "It's a common home, this planet.",
      "This Earth belongs to us, the green globe, flying in the blue sky.",
      "Oh dove, the cooing wings of love.",
      "Oh seagull, the wings hovering over the waves,",
      "let's fly together.",
      "Make the Earth spin, let's fly together.",
      "Make the Earth spin, This Earth belongs to us, yellow, white, black,",
      "despite different skin colors. Dear friends, we are flowers of the countryside,",
      "fragrant love spreading fresh colors, whatever skin color.",
      "Waving and spreading fragrance, whatever skin color.",
      "Waving and spreading fragrance together.",
      "This Earth belongs to us, holding hands together,",
      "smiling brightly. Oh dawn,",
      "this song of blessing is peaceful and warm, studying diligently,",
      "building a bright life, this planet.",
      "It's a common home, this planet."
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
    "durationSec": 188,
    "melodyStyle": "playful",
    "lyrics": [
      "nhạc không lời",
      "Trang cành ca chim hót mời em chơi giữa vườn xuân.",
      "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
      "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
      "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
      "nhạc không lời",
      "Trang cành ca chim hót mời em chơi giữa vườn xuân.",
      "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
      "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
      "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
      "nhạc không lời",
      "Trang cành ca chim hót mời em chơi giữa vườn xuân.",
      "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
      "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
      "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
      "nhạc không lời",
      "Trang cành ca chim hót mời em chơi giữa vườn xuân.",
      "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
      "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
      "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu."
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 14.2,
        "vi": "nhạc không lời",
        "en": "Instrumental music"
      },
      {
        "start": 14.05,
        "end": 21.0,
        "vi": "Trang cành ca chim hót mời em chơi giữa vườn xuân.",
        "en": "On the branches, singing birds invite me to play in the spring garden."
      },
      {
        "start": 20.85,
        "end": 28.0,
        "vi": "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
        "en": "Many close friends peek out, calling me to run around the yard."
      },
      {
        "start": 27.85,
        "end": 35.4,
        "vi": "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
        "en": "Playing soccer and shuttlecock, jumping rope, shooting marbles, playing hide and seek."
      },
      {
        "start": 35.25,
        "end": 43.9,
        "vi": "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
        "en": "Oh, so wonderful, but I dare not."
      },
      {
        "start": 43.75,
        "end": 49.8,
        "vi": "nhạc không lời",
        "en": "Instrumental music"
      },
      {
        "start": 49.65,
        "end": 56.8,
        "vi": "Trang cành ca chim hót mời em chơi giữa vườn xuân.",
        "en": "On the branches, singing birds invite me to play in the spring garden."
      },
      {
        "start": 56.65,
        "end": 64.2,
        "vi": "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
        "en": "Many close friends peek out, calling me to run around the yard."
      },
      {
        "start": 64.05,
        "end": 71.8,
        "vi": "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
        "en": "Playing soccer and shuttlecock, jumping rope, shooting marbles, playing hide and seek."
      },
      {
        "start": 71.65,
        "end": 79.4,
        "vi": "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
        "en": "Oh, so wonderful, but I dare not."
      },
      {
        "start": 79.25,
        "end": 99.9,
        "vi": "nhạc không lời",
        "en": "Instrumental music"
      },
      {
        "start": 99.75,
        "end": 106.6,
        "vi": "Trang cành ca chim hót mời em chơi giữa vườn xuân.",
        "en": "On the branches, singing birds invite me to play in the spring garden."
      },
      {
        "start": 106.45,
        "end": 114.1,
        "vi": "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
        "en": "Many close friends peek out, calling me to run around the yard."
      },
      {
        "start": 113.95,
        "end": 121.3,
        "vi": "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
        "en": "Playing soccer and shuttlecock, jumping rope, shooting marbles, playing hide and seek."
      },
      {
        "start": 121.15,
        "end": 129.6,
        "vi": "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
        "en": "Oh, so wonderful, but I dare not."
      },
      {
        "start": 129.45,
        "end": 135.5,
        "vi": "nhạc không lời",
        "en": "Instrumental music"
      },
      {
        "start": 135.35,
        "end": 142.7,
        "vi": "Trang cành ca chim hót mời em chơi giữa vườn xuân.",
        "en": "On the branches, singing birds invite me to play in the spring garden."
      },
      {
        "start": 142.55,
        "end": 150.1,
        "vi": "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
        "en": "Many close friends peek out, calling me to run around the yard."
      },
      {
        "start": 149.95,
        "end": 156.9,
        "vi": "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
        "en": "Playing soccer and shuttlecock, jumping rope, shooting marbles, playing hide and seek."
      },
      {
        "start": 156.75,
        "end": 188.0,
        "vi": "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
        "en": "Oh, so wonderful, but I dare not."
      }
    ],
    "englishTranslation": [
      "Instrumental music",
      "On the branches, singing birds invite me to play in the spring garden.",
      "Many close friends peek out, calling me to run around the yard.",
      "Playing soccer and shuttlecock, jumping rope, shooting marbles, playing hide and seek.",
      "Oh, so wonderful, but I dare not.",
      "Instrumental music",
      "On the branches, singing birds invite me to play in the spring garden.",
      "Many close friends peek out, calling me to run around the yard.",
      "Playing soccer and shuttlecock, jumping rope, shooting marbles, playing hide and seek.",
      "Oh, so wonderful, but I dare not.",
      "Instrumental music",
      "On the branches, singing birds invite me to play in the spring garden.",
      "Many close friends peek out, calling me to run around the yard.",
      "Playing soccer and shuttlecock, jumping rope, shooting marbles, playing hide and seek.",
      "Oh, so wonderful, but I dare not.",
      "Instrumental music",
      "On the branches, singing birds invite me to play in the spring garden.",
      "Many close friends peek out, calling me to run around the yard.",
      "Playing soccer and shuttlecock, jumping rope, shooting marbles, playing hide and seek.",
      "Oh, so wonderful, but I dare not."
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
    "isVocalTrack": true
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
    "durationSec": 64,
    "melodyStyle": "cheerful",
    "lyrics": [
      "A B C D E F G H I J K L M N O P Q R S T U V W X Y and Z",
      "Now you know your ABCs, next time won't you sing with me?",
      "A B C D E F G H I J K L M N O P Q R S T U V W X Y and Z",
      "Now you know your ABCs, next time won't you sing with me?"
    ],
    "lyricsData": [
      {
        "start": 1.15,
        "end": 17.8,
        "vi": "A B C D E F G H I J K L M N O P Q R S T U V W X Y and Z",
        "en": "A B C D E F G H I J K L M N O P Q R S T U V W X Y and Z"
      },
      {
        "start": 17.85,
        "end": 26.5,
        "vi": "Now you know your ABCs, next time won't you sing with me?",
        "en": "Now you know your ABCs, next time won't you sing with me?"
      },
      {
        "start": 35.25,
        "end": 51.6,
        "vi": "A B C D E F G H I J K L M N O P Q R S T U V W X Y and Z",
        "en": "A B C D E F G H I J K L M N O P Q R S T U V W X Y and Z"
      },
      {
        "start": 51.85,
        "end": 60.6,
        "vi": "Now you know your ABCs, next time won't you sing with me?",
        "en": "Now you know your ABCs, next time won't you sing with me?"
      }
    ],
    "englishTranslation": [
      "A B C D E F G H I J K L M N O P Q R S T U V W X Y and Z",
      "Now you know your ABCs, next time won't you sing with me?",
      "A B C D E F G H I J K L M N O P Q R S T U V W X Y and Z",
      "Now you know your ABCs, next time won't you sing with me?"
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
    "isVocalTrack": true
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
    "durationSec": 146,
    "melodyStyle": "gentle",
    "lyrics": [
      "Reach way up into the sky",
      "Catch a falling star and put it in your pocket and never let it fade away",
      "Catch a falling star and put it in your pocket never let it fade away",
      "Catch a falling star and put it in your pocket save it for a rainy day",
      "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky",
      "Twinkle twinkle little star how I wonder what you are",
      "Catch a falling star and put it in your pocket and never let it fade away\nCatch a falling star and put it in your pocket save it for a rainy day\nCatch a falling star and put it in your pocket save it for a rainy day",
      "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky\nTwinkle twinkle little star how I wonder what you are and oh how wonderful you are"
    ],
    "lyricsData": [
      {
        "start": 8.35,
        "end": 12.7,
        "vi": "Reach way up into the sky",
        "en": "Reach way up into the sky"
      },
      {
        "start": 12.55,
        "end": 20.9,
        "vi": "Catch a falling star and put it in your pocket and never let it fade away",
        "en": "Catch a falling star and put it in your pocket and never let it fade away"
      },
      {
        "start": 20.75,
        "end": 31.7,
        "vi": "Catch a falling star and put it in your pocket never let it fade away",
        "en": "Catch a falling star and put it in your pocket never let it fade away"
      },
      {
        "start": 31.55,
        "end": 44.8,
        "vi": "Catch a falling star and put it in your pocket save it for a rainy day",
        "en": "Catch a falling star and put it in your pocket save it for a rainy day"
      },
      {
        "start": 44.65,
        "end": 66.6,
        "vi": "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky",
        "en": "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky"
      },
      {
        "start": 66.45,
        "end": 77.4,
        "vi": "Twinkle twinkle little star how I wonder what you are",
        "en": "Twinkle twinkle little star how I wonder what you are"
      },
      {
        "start": 77.25,
        "end": 102.5,
        "vi": "Catch a falling star and put it in your pocket and never let it fade away\nCatch a falling star and put it in your pocket save it for a rainy day\nCatch a falling star and put it in your pocket save it for a rainy day",
        "en": "Catch a falling star and put it in your pocket and never let it fade away\nCatch a falling star and put it in your pocket save it for a rainy day\nCatch a falling star and put it in your pocket save it for a rainy day"
      },
      {
        "start": 102.35,
        "end": 146.0,
        "vi": "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky\nTwinkle twinkle little star how I wonder what you are and oh how wonderful you are",
        "en": "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky\nTwinkle twinkle little star how I wonder what you are and oh how wonderful you are"
      }
    ],
    "englishTranslation": [
      "Reach way up into the sky",
      "Catch a falling star and put it in your pocket and never let it fade away",
      "Catch a falling star and put it in your pocket never let it fade away",
      "Catch a falling star and put it in your pocket save it for a rainy day",
      "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky",
      "Twinkle twinkle little star how I wonder what you are",
      "Catch a falling star and put it in your pocket and never let it fade away\nCatch a falling star and put it in your pocket save it for a rainy day\nCatch a falling star and put it in your pocket save it for a rainy day",
      "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky\nTwinkle twinkle little star how I wonder what you are and oh how wonderful you are"
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
    "isVocalTrack": true
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
    "durationSec": 207,
    "melodyStyle": "playful",
    "lyrics": [
      "...",
      "...",
      "...",
      "Old MacDonald had a farm, E-I-E-I-O",
      "And on his farm he had a cow, E-I-E-I-O, With a moo-moo here and a moo-moo there, Here a moo, there a moo, everywhere a moo-moo, Old MacDonald had a farm, E-I-E-I-O",
      "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a duck, E-I-E-I-O, With a quack-quack here and a quack-quack there, Here a quack, there a quack, everywhere a quack-quack, Old MacDonald had a farm, E-I-E-I-O",
      "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had some sheep, E-I-E-I-O, With a baa-baa here and a baa-baa there, Here a baa, there a baa, everywhere a baa-baa, Old MacDonald had a farm, E-I-E-I-O",
      "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a pig, E-I-E-I-O, With an oink-oink here and an oink-oink there, Here an oink, there an oink, everywhere an oink-oink, Old MacDonald had a farm, E-I-E-I-O",
      "And on his farm he had an elephant. An elephant? Yeah, an elephant. It was a peanut farm! E-I-E-I-O"
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 4.5,
        "vi": "...",
        "en": "..."
      },
      {
        "start": 4.35,
        "end": 20.0,
        "vi": "...",
        "en": "..."
      },
      {
        "start": 19.85,
        "end": 34.9,
        "vi": "...",
        "en": "..."
      },
      {
        "start": 34.75,
        "end": 55.7,
        "vi": "Old MacDonald had a farm, E-I-E-I-O",
        "en": "Old MacDonald had a farm, E-I-E-I-O"
      },
      {
        "start": 55.55,
        "end": 77.6,
        "vi": "And on his farm he had a cow, E-I-E-I-O, With a moo-moo here and a moo-moo there, Here a moo, there a moo, everywhere a moo-moo, Old MacDonald had a farm, E-I-E-I-O",
        "en": "And on his farm he had a cow, E-I-E-I-O, With a moo-moo here and a moo-moo there, Here a moo, there a moo, everywhere a moo-moo, Old MacDonald had a farm, E-I-E-I-O"
      },
      {
        "start": 77.45,
        "end": 106.0,
        "vi": "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a duck, E-I-E-I-O, With a quack-quack here and a quack-quack there, Here a quack, there a quack, everywhere a quack-quack, Old MacDonald had a farm, E-I-E-I-O",
        "en": "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a duck, E-I-E-I-O, With a quack-quack here and a quack-quack there, Here a quack, there a quack, everywhere a quack-quack, Old MacDonald had a farm, E-I-E-I-O"
      },
      {
        "start": 105.85,
        "end": 132.1,
        "vi": "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had some sheep, E-I-E-I-O, With a baa-baa here and a baa-baa there, Here a baa, there a baa, everywhere a baa-baa, Old MacDonald had a farm, E-I-E-I-O",
        "en": "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had some sheep, E-I-E-I-O, With a baa-baa here and a baa-baa there, Here a baa, there a baa, everywhere a baa-baa, Old MacDonald had a farm, E-I-E-I-O"
      },
      {
        "start": 131.95,
        "end": 162.1,
        "vi": "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a pig, E-I-E-I-O, With an oink-oink here and an oink-oink there, Here an oink, there an oink, everywhere an oink-oink, Old MacDonald had a farm, E-I-E-I-O",
        "en": "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a pig, E-I-E-I-O, With an oink-oink here and an oink-oink there, Here an oink, there an oink, everywhere an oink-oink, Old MacDonald had a farm, E-I-E-I-O"
      },
      {
        "start": 161.95,
        "end": 206.0,
        "vi": "And on his farm he had an elephant. An elephant? Yeah, an elephant. It was a peanut farm! E-I-E-I-O",
        "en": "And on his farm he had an elephant. An elephant? Yeah, an elephant. It was a peanut farm! E-I-E-I-O"
      }
    ],
    "englishTranslation": [
      "...",
      "...",
      "...",
      "Old MacDonald had a farm, E-I-E-I-O",
      "And on his farm he had a cow, E-I-E-I-O, With a moo-moo here and a moo-moo there, Here a moo, there a moo, everywhere a moo-moo, Old MacDonald had a farm, E-I-E-I-O",
      "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a duck, E-I-E-I-O, With a quack-quack here and a quack-quack there, Here a quack, there a quack, everywhere a quack-quack, Old MacDonald had a farm, E-I-E-I-O",
      "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had some sheep, E-I-E-I-O, With a baa-baa here and a baa-baa there, Here a baa, there a baa, everywhere a baa-baa, Old MacDonald had a farm, E-I-E-I-O",
      "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a pig, E-I-E-I-O, With an oink-oink here and an oink-oink there, Here an oink, there an oink, everywhere an oink-oink, Old MacDonald had a farm, E-I-E-I-O",
      "And on his farm he had an elephant. An elephant? Yeah, an elephant. It was a peanut farm! E-I-E-I-O"
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
    "isVocalTrack": true
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
    "durationSec": 233,
    "melodyStyle": "cheerful",
    "lyrics": [
      "the wheels on the bus go round and round, round and round, round and round",
      "the wheels on the bus go round and round all through town",
      "We've better wait for the music.",
      "Listen, everybody, here comes the bus.",
      "The wheels on the bus go round and round, round and round, round and round",
      "The wheels on the bus go round and round, all through the town.",
      "The door on the bus goes open and shut, open and shut, open and shut, the door on the bus goes open and shut, all through the town.",
      "The money on the bus goes clink clink clink, clink clink clink, clink clink clink, the money on the bus goes clink clink clink, all through the town.",
      "The horn on the bus goes beep beep beep, beep beep beep, beep beep beep, the horn on the bus goes beep beep beep, all through the town.",
      "The wipers on the bus go whoosh, whoosh, whoosh, the wipers on the bus go whoosh, whoosh, whoosh, all through the town.",
      "I see that old driver.",
      "The driver on the bus says move on back, move on back, move on back, the driver on the bus says move on back, all through the town.",
      "The windows on the bus go up and down, up and down, up and down, the windows on the bus go up and down, all through the town.",
      "Who else is on this bus? Oh, I see some people.",
      "People on the bus go bumpety bump, bumpety bump, bumpety bump, the people on the bus go bumpety bump, all through the town.",
      "There the babies are. The babies on the bus go wail, wail, wail, wail, wail, wail, the babies on the bus go wail, wail, wail, all through the town.",
      "So the grown-ups on the bus say I love you, I love you. Yes, I do. The grown-ups on the bus say I love you, all through the town.",
      "Let's look around. Who else is on this bus today? Oh, I see some kitties.",
      "The kitties on the bus go meow meow meow, meow meow meow, the kitties on the bus go meow meow meow, all through the town.",
      "Who else is on this bus? A doggie!",
      "I see a puppy! Doggie's on the bus go woof woof woof, woof woof woof, doggie's on the bus go woof woof woof, all through the town.",
      "Is your favorite animal riding on this bus today?",
      "Good, let's sing about it.",
      "Here we go. The [music] on the bus goes [music] the on the bus goes all through the town.",
      "Oh, oh, this bus is starting to go pretty fast.",
      "Hold on, here we go.",
      "The wheels on the bus go round and round, round and round, round and round, the wheels on the bus go round and round,",
      "all through the town, all through the town."
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 8.5,
        "vi": "the wheels on the bus go round and round, round and round, round and round",
        "en": "the wheels on the bus go round and round, round and round, round and round"
      },
      {
        "start": 8.5,
        "end": 9.6,
        "vi": "the wheels on the bus go round and round all through town",
        "en": "the wheels on the bus go round and round all through town"
      },
      {
        "start": 9.85,
        "end": 11.8,
        "vi": "We've better wait for the music.",
        "en": "We've better wait for the music."
      },
      {
        "start": 12.15,
        "end": 14.6,
        "vi": "Listen, everybody, here comes the bus.",
        "en": "Listen, everybody, here comes the bus."
      },
      {
        "start": 19.25,
        "end": 24.0,
        "vi": "The wheels on the bus go round and round, round and round, round and round",
        "en": "The wheels on the bus go round and round, round and round, round and round"
      },
      {
        "start": 23.95,
        "end": 29.3,
        "vi": "The wheels on the bus go round and round, all through the town.",
        "en": "The wheels on the bus go round and round, all through the town."
      },
      {
        "start": 33.25,
        "end": 43.9,
        "vi": "The door on the bus goes open and shut, open and shut, open and shut, the door on the bus goes open and shut, all through the town.",
        "en": "The door on the bus goes open and shut, open and shut, open and shut, the door on the bus goes open and shut, all through the town."
      },
      {
        "start": 47.65,
        "end": 58.2,
        "vi": "The money on the bus goes clink clink clink, clink clink clink, clink clink clink, the money on the bus goes clink clink clink, all through the town.",
        "en": "The money on the bus goes clink clink clink, clink clink clink, clink clink clink, the money on the bus goes clink clink clink, all through the town."
      },
      {
        "start": 61.95,
        "end": 72.3,
        "vi": "The horn on the bus goes beep beep beep, beep beep beep, beep beep beep, the horn on the bus goes beep beep beep, all through the town.",
        "en": "The horn on the bus goes beep beep beep, beep beep beep, beep beep beep, the horn on the bus goes beep beep beep, all through the town."
      },
      {
        "start": 76.65,
        "end": 86.9,
        "vi": "The wipers on the bus go whoosh, whoosh, whoosh, the wipers on the bus go whoosh, whoosh, whoosh, all through the town.",
        "en": "The wipers on the bus go whoosh, whoosh, whoosh, the wipers on the bus go whoosh, whoosh, whoosh, all through the town."
      },
      {
        "start": 87.95,
        "end": 91.9,
        "vi": "I see that old driver.",
        "en": "I see that old driver."
      },
      {
        "start": 91.85,
        "end": 101.3,
        "vi": "The driver on the bus says move on back, move on back, move on back, the driver on the bus says move on back, all through the town.",
        "en": "The driver on the bus says move on back, move on back, move on back, the driver on the bus says move on back, all through the town."
      },
      {
        "start": 105.15,
        "end": 115.7,
        "vi": "The windows on the bus go up and down, up and down, up and down, the windows on the bus go up and down, all through the town.",
        "en": "The windows on the bus go up and down, up and down, up and down, the windows on the bus go up and down, all through the town."
      },
      {
        "start": 116.85,
        "end": 119.8,
        "vi": "Who else is on this bus? Oh, I see some people.",
        "en": "Who else is on this bus? Oh, I see some people."
      },
      {
        "start": 119.75,
        "end": 130.0,
        "vi": "People on the bus go bumpety bump, bumpety bump, bumpety bump, the people on the bus go bumpety bump, all through the town.",
        "en": "People on the bus go bumpety bump, bumpety bump, bumpety bump, the people on the bus go bumpety bump, all through the town."
      },
      {
        "start": 132.55,
        "end": 144.0,
        "vi": "There the babies are. The babies on the bus go wail, wail, wail, wail, wail, wail, the babies on the bus go wail, wail, wail, all through the town.",
        "en": "There the babies are. The babies on the bus go wail, wail, wail, wail, wail, wail, the babies on the bus go wail, wail, wail, all through the town."
      },
      {
        "start": 147.95,
        "end": 159.1,
        "vi": "So the grown-ups on the bus say I love you, I love you. Yes, I do. The grown-ups on the bus say I love you, all through the town.",
        "en": "So the grown-ups on the bus say I love you, I love you. Yes, I do. The grown-ups on the bus say I love you, all through the town."
      },
      {
        "start": 162.35,
        "end": 167.3,
        "vi": "Let's look around. Who else is on this bus today? Oh, I see some kitties.",
        "en": "Let's look around. Who else is on this bus today? Oh, I see some kitties."
      },
      {
        "start": 167.55,
        "end": 178.5,
        "vi": "The kitties on the bus go meow meow meow, meow meow meow, the kitties on the bus go meow meow meow, all through the town.",
        "en": "The kitties on the bus go meow meow meow, meow meow meow, the kitties on the bus go meow meow meow, all through the town."
      },
      {
        "start": 179.65,
        "end": 182.1,
        "vi": "Who else is on this bus? A doggie!",
        "en": "Who else is on this bus? A doggie!"
      },
      {
        "start": 182.05,
        "end": 192.9,
        "vi": "I see a puppy! Doggie's on the bus go woof woof woof, woof woof woof, doggie's on the bus go woof woof woof, all through the town.",
        "en": "I see a puppy! Doggie's on the bus go woof woof woof, woof woof woof, doggie's on the bus go woof woof woof, all through the town."
      },
      {
        "start": 194.15,
        "end": 196.8,
        "vi": "Is your favorite animal riding on this bus today?",
        "en": "Is your favorite animal riding on this bus today?"
      },
      {
        "start": 197.25,
        "end": 199.4,
        "vi": "Good, let's sing about it.",
        "en": "Good, let's sing about it."
      },
      {
        "start": 199.65,
        "end": 211.9,
        "vi": "Here we go. The [music] on the bus goes [music] the on the bus goes all through the town.",
        "en": "Here we go. The [music] on the bus goes [music] the on the bus goes all through the town."
      },
      {
        "start": 213.25,
        "end": 217.3,
        "vi": "Oh, oh, this bus is starting to go pretty fast.",
        "en": "Oh, oh, this bus is starting to go pretty fast."
      },
      {
        "start": 217.25,
        "end": 218.2,
        "vi": "Hold on, here we go.",
        "en": "Hold on, here we go."
      },
      {
        "start": 218.25,
        "end": 225.3,
        "vi": "The wheels on the bus go round and round, round and round, round and round, the wheels on the bus go round and round,",
        "en": "The wheels on the bus go round and round, round and round, round and round, the wheels on the bus go round and round,"
      },
      {
        "start": 225.25,
        "end": 230.1,
        "vi": "all through the town, all through the town.",
        "en": "all through the town, all through the town."
      }
    ],
    "englishTranslation": [
      "the wheels on the bus go round and round, round and round, round and round",
      "the wheels on the bus go round and round all through town",
      "We've better wait for the music.",
      "Listen, everybody, here comes the bus.",
      "The wheels on the bus go round and round, round and round, round and round",
      "The wheels on the bus go round and round, all through the town.",
      "The door on the bus goes open and shut, open and shut, open and shut, the door on the bus goes open and shut, all through the town.",
      "The money on the bus goes clink clink clink, clink clink clink, clink clink clink, the money on the bus goes clink clink clink, all through the town.",
      "The horn on the bus goes beep beep beep, beep beep beep, beep beep beep, the horn on the bus goes beep beep beep, all through the town.",
      "The wipers on the bus go whoosh, whoosh, whoosh, the wipers on the bus go whoosh, whoosh, whoosh, all through the town.",
      "I see that old driver.",
      "The driver on the bus says move on back, move on back, move on back, the driver on the bus says move on back, all through the town.",
      "The windows on the bus go up and down, up and down, up and down, the windows on the bus go up and down, all through the town.",
      "Who else is on this bus? Oh, I see some people.",
      "People on the bus go bumpety bump, bumpety bump, bumpety bump, the people on the bus go bumpety bump, all through the town.",
      "There the babies are. The babies on the bus go wail, wail, wail, wail, wail, wail, the babies on the bus go wail, wail, wail, all through the town.",
      "So the grown-ups on the bus say I love you, I love you. Yes, I do. The grown-ups on the bus say I love you, all through the town.",
      "Let's look around. Who else is on this bus today? Oh, I see some kitties.",
      "The kitties on the bus go meow meow meow, meow meow meow, the kitties on the bus go meow meow meow, all through the town.",
      "Who else is on this bus? A doggie!",
      "I see a puppy! Doggie's on the bus go woof woof woof, woof woof woof, doggie's on the bus go woof woof woof, all through the town.",
      "Is your favorite animal riding on this bus today?",
      "Good, let's sing about it.",
      "Here we go. The [music] on the bus goes [music] the on the bus goes all through the town.",
      "Oh, oh, this bus is starting to go pretty fast.",
      "Hold on, here we go.",
      "The wheels on the bus go round and round, round and round, round and round, the wheels on the bus go round and round,",
      "all through the town, all through the town."
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
    "isVocalTrack": true
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
    "durationSec": 105,
    "melodyStyle": "gentle",
    "lyrics": [
      "Baa, baa, pink sheep, have you any wool?",
      "No, it's not pink, sheep.",
      "It's not pink?",
      "No. Oh, okay.",
      "Baa, baa, yellow sheep, have you any wool?",
      "Did I mess up again?",
      "It's not yellow. It's black or white.",
      "Oh.",
      "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
      "One for my master, one for my dame.",
      "One for the boy and girl that live down the lane.",
      "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
      "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
      "One for my master, one for my dame.",
      "One for the boy and girl that live down the lane.",
      "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full. Yes, sir, yes, sir, three bags full."
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 3.9,
        "vi": "Baa, baa, pink sheep, have you any wool?",
        "en": "Baa, baa, pink sheep, have you any wool?"
      },
      {
        "start": 3.75,
        "end": 6.9,
        "vi": "No, it's not pink, sheep.",
        "en": "No, it's not pink, sheep."
      },
      {
        "start": 6.75,
        "end": 8.5,
        "vi": "It's not pink?",
        "en": "It's not pink?"
      },
      {
        "start": 8.35,
        "end": 10.8,
        "vi": "No. Oh, okay.",
        "en": "No. Oh, okay."
      },
      {
        "start": 10.65,
        "end": 15.1,
        "vi": "Baa, baa, yellow sheep, have you any wool?",
        "en": "Baa, baa, yellow sheep, have you any wool?"
      },
      {
        "start": 14.95,
        "end": 16.8,
        "vi": "Did I mess up again?",
        "en": "Did I mess up again?"
      },
      {
        "start": 16.65,
        "end": 20.9,
        "vi": "It's not yellow. It's black or white.",
        "en": "It's not yellow. It's black or white."
      },
      {
        "start": 20.75,
        "end": 22.0,
        "vi": "Oh.",
        "en": "Oh."
      },
      {
        "start": 21.85,
        "end": 31.9,
        "vi": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
        "en": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full."
      },
      {
        "start": 31.75,
        "end": 36.5,
        "vi": "One for my master, one for my dame.",
        "en": "One for my master, one for my dame."
      },
      {
        "start": 36.35,
        "end": 41.2,
        "vi": "One for the boy and girl that live down the lane.",
        "en": "One for the boy and girl that live down the lane."
      },
      {
        "start": 41.05,
        "end": 50.1,
        "vi": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
        "en": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full."
      },
      {
        "start": 63.25,
        "end": 72.3,
        "vi": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
        "en": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full."
      },
      {
        "start": 72.15,
        "end": 77.0,
        "vi": "One for my master, one for my dame.",
        "en": "One for my master, one for my dame."
      },
      {
        "start": 76.85,
        "end": 81.8,
        "vi": "One for the boy and girl that live down the lane.",
        "en": "One for the boy and girl that live down the lane."
      },
      {
        "start": 81.65,
        "end": 96.9,
        "vi": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full. Yes, sir, yes, sir, three bags full.",
        "en": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full. Yes, sir, yes, sir, three bags full."
      }
    ],
    "englishTranslation": [
      "Baa, baa, pink sheep, have you any wool?",
      "No, it's not pink, sheep.",
      "It's not pink?",
      "No. Oh, okay.",
      "Baa, baa, yellow sheep, have you any wool?",
      "Did I mess up again?",
      "It's not yellow. It's black or white.",
      "Oh.",
      "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
      "One for my master, one for my dame.",
      "One for the boy and girl that live down the lane.",
      "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
      "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
      "One for my master, one for my dame.",
      "One for the boy and girl that live down the lane.",
      "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full. Yes, sir, yes, sir, three bags full."
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
    "isVocalTrack": true
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
    "durationSec": 94,
    "melodyStyle": "playful",
    "lyrics": [
      "If you're happy and you know it, clap your hands",
      "If you're happy and you know it, clap your hands",
      "If you're happy and you know it, your face will surely show it. If you're happy and you know it, clap your hands",
      "If you're happy and you know it, pat your knees",
      "If you're happy and you know it, pat your knees",
      "If you're happy and you know it, your face will surely show it. If you're happy and you know it, pat your knees",
      "clap your hands",
      "If you're mad and you know it, stomp your feet",
      "If you're mad and you know it, stomp your feet",
      "If you're mad and you know it, your face will surely show it. If you're mad and you know it, stomp your feet",
      "pat your knees",
      "clap your hands",
      "If you're happy and you know it, beep your nose, beep beep",
      "If you're happy and you know it, beep your nose, beep beep",
      "If you're happy and you know it, your face will surely show it. If you're happy and you know it, beep your nose, beep beep",
      "stomp your feet, stomp stomp",
      "pat your knees, pat pat",
      "clap your hands",
      "If you're happy and you know it, shout hooray, hooray!",
      "If you're happy and you know it, shout hooray, hooray!",
      "If you're happy and you know it, your face will surely show it. If you're happy and you know it, shout hooray, hooray!",
      "beep your nose, beep beep",
      "stomp your feet, stomp stomp",
      "pat your knees",
      "clap your hands",
      "shout hooray, hooray!"
    ],
    "lyricsData": [
      {
        "start": 1.55,
        "end": 4.5,
        "vi": "If you're happy and you know it, clap your hands",
        "en": "If you're happy and you know it, clap your hands"
      },
      {
        "start": 4.95,
        "end": 7.7,
        "vi": "If you're happy and you know it, clap your hands",
        "en": "If you're happy and you know it, clap your hands"
      },
      {
        "start": 8.15,
        "end": 14.3,
        "vi": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, clap your hands",
        "en": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, clap your hands"
      },
      {
        "start": 15.15,
        "end": 17.9,
        "vi": "If you're happy and you know it, pat your knees",
        "en": "If you're happy and you know it, pat your knees"
      },
      {
        "start": 18.35,
        "end": 21.3,
        "vi": "If you're happy and you know it, pat your knees",
        "en": "If you're happy and you know it, pat your knees"
      },
      {
        "start": 21.65,
        "end": 28.1,
        "vi": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, pat your knees",
        "en": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, pat your knees"
      },
      {
        "start": 28.65,
        "end": 29.8,
        "vi": "clap your hands",
        "en": "clap your hands"
      },
      {
        "start": 29.75,
        "end": 32.7,
        "vi": "If you're mad and you know it, stomp your feet",
        "en": "If you're mad and you know it, stomp your feet"
      },
      {
        "start": 33.15,
        "end": 36.1,
        "vi": "If you're mad and you know it, stomp your feet",
        "en": "If you're mad and you know it, stomp your feet"
      },
      {
        "start": 36.45,
        "end": 43.3,
        "vi": "If you're mad and you know it, your face will surely show it. If you're mad and you know it, stomp your feet",
        "en": "If you're mad and you know it, your face will surely show it. If you're mad and you know it, stomp your feet"
      },
      {
        "start": 43.55,
        "end": 44.7,
        "vi": "pat your knees",
        "en": "pat your knees"
      },
      {
        "start": 44.55,
        "end": 46.4,
        "vi": "clap your hands",
        "en": "clap your hands"
      },
      {
        "start": 47.15,
        "end": 50.0,
        "vi": "If you're happy and you know it, beep your nose, beep beep",
        "en": "If you're happy and you know it, beep your nose, beep beep"
      },
      {
        "start": 50.35,
        "end": 53.4,
        "vi": "If you're happy and you know it, beep your nose, beep beep",
        "en": "If you're happy and you know it, beep your nose, beep beep"
      },
      {
        "start": 53.75,
        "end": 60.6,
        "vi": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, beep your nose, beep beep",
        "en": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, beep your nose, beep beep"
      },
      {
        "start": 60.55,
        "end": 62.5,
        "vi": "stomp your feet, stomp stomp",
        "en": "stomp your feet, stomp stomp"
      },
      {
        "start": 62.35,
        "end": 63.9,
        "vi": "pat your knees, pat pat",
        "en": "pat your knees, pat pat"
      },
      {
        "start": 63.75,
        "end": 65.5,
        "vi": "clap your hands",
        "en": "clap your hands"
      },
      {
        "start": 65.85,
        "end": 72.3,
        "vi": "If you're happy and you know it, shout hooray, hooray!",
        "en": "If you're happy and you know it, shout hooray, hooray!"
      },
      {
        "start": 72.25,
        "end": 78.9,
        "vi": "If you're happy and you know it, shout hooray, hooray!",
        "en": "If you're happy and you know it, shout hooray, hooray!"
      },
      {
        "start": 78.9,
        "end": 79.0,
        "vi": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, shout hooray, hooray!",
        "en": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, shout hooray, hooray!"
      },
      {
        "start": 79.25,
        "end": 81.0,
        "vi": "beep your nose, beep beep",
        "en": "beep your nose, beep beep"
      },
      {
        "start": 80.85,
        "end": 82.5,
        "vi": "stomp your feet, stomp stomp",
        "en": "stomp your feet, stomp stomp"
      },
      {
        "start": 82.35,
        "end": 83.9,
        "vi": "pat your knees",
        "en": "pat your knees"
      },
      {
        "start": 83.75,
        "end": 85.8,
        "vi": "clap your hands",
        "en": "clap your hands"
      },
      {
        "start": 85.95,
        "end": 87.7,
        "vi": "shout hooray, hooray!",
        "en": "shout hooray, hooray!"
      }
    ],
    "englishTranslation": [
      "If you're happy and you know it, clap your hands",
      "If you're happy and you know it, clap your hands",
      "If you're happy and you know it, your face will surely show it. If you're happy and you know it, clap your hands",
      "If you're happy and you know it, pat your knees",
      "If you're happy and you know it, pat your knees",
      "If you're happy and you know it, your face will surely show it. If you're happy and you know it, pat your knees",
      "clap your hands",
      "If you're mad and you know it, stomp your feet",
      "If you're mad and you know it, stomp your feet",
      "If you're mad and you know it, your face will surely show it. If you're mad and you know it, stomp your feet",
      "pat your knees",
      "clap your hands",
      "If you're happy and you know it, beep your nose, beep beep",
      "If you're happy and you know it, beep your nose, beep beep",
      "If you're happy and you know it, your face will surely show it. If you're happy and you know it, beep your nose, beep beep",
      "stomp your feet, stomp stomp",
      "pat your knees, pat pat",
      "clap your hands",
      "If you're happy and you know it, shout hooray, hooray!",
      "If you're happy and you know it, shout hooray, hooray!",
      "If you're happy and you know it, your face will surely show it. If you're happy and you know it, shout hooray, hooray!",
      "beep your nose, beep beep",
      "stomp your feet, stomp stomp",
      "pat your knees",
      "clap your hands",
      "shout hooray, hooray!"
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
    "isVocalTrack": true
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
    "durationSec": 33,
    "melodyStyle": "gentle",
    "lyrics": [
      "Row, row, row your boat gently down the stream. Merrily, merrily, merrily, merrily, life is but a dream.",
      "Row, row, row your boat gently down the stream. Merrily, merrily, merrily, merrily, life is but a dream."
    ],
    "lyricsData": [
      { "start": 4.95, "end": 8.8, "vi": "Chèo thuyền chèo thuyền nhẹ trôi theo dòng nước", "en": "Row, row, row your boat gently down the stream" },
      { "start": 8.95, "end": 13.0, "vi": "Vui tươi vui tươi vui tươi vui tươi, cuộc đời tựa giấc mơ", "en": "Merrily, merrily, merrily, merrily, life is but a dream" },
      { "start": 17.25, "end": 21.0, "vi": "Chèo thuyền chèo thuyền nhẹ trôi theo dòng nước", "en": "Row, row, row your boat gently down the stream" },
      { "start": 21.25, "end": 25.5, "vi": "Vui tươi vui tươi vui tươi vui tươi, cuộc đời tựa giấc mơ", "en": "Merrily, merrily, merrily, merrily, life is but a dream" }
    ],
    "englishTranslation": [
      "Row, row, row your boat gently down the stream. Merrily, merrily, merrily, merrily, life is but a dream.",
      "Row, row, row your boat gently down the stream. Merrily, merrily, merrily, merrily, life is but a dream."
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
    "isVocalTrack": true
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
    "durationSec": 135,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Eyes and ears and mouth and nose",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Eyes and ears and mouth and nose",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Eyes and ears and mouth and nose",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Eyes and ears and mouth and nose",
      "Head, shoulders, knees and toes"
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 4.9,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 6.45,
        "end": 11.3,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 12.85,
        "end": 18.9,
        "vi": "Eyes and ears and mouth and nose",
        "en": "Eyes and ears and mouth and nose"
      },
      {
        "start": 19.25,
        "end": 23.9,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 26.15,
        "end": 30.4,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 32.25,
        "end": 37.0,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 38.65,
        "end": 44.7,
        "vi": "Eyes and ears and mouth and nose",
        "en": "Eyes and ears and mouth and nose"
      },
      {
        "start": 45.15,
        "end": 49.8,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 81.75,
        "end": 87.7,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 90.35,
        "end": 95.8,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 97.85,
        "end": 103.7,
        "vi": "Eyes and ears and mouth and nose",
        "en": "Eyes and ears and mouth and nose"
      },
      {
        "start": 104.15,
        "end": 108.8,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 109.95,
        "end": 114.6,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 115.45,
        "end": 120.0,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      },
      {
        "start": 120.65,
        "end": 125.7,
        "vi": "Eyes and ears and mouth and nose",
        "en": "Eyes and ears and mouth and nose"
      },
      {
        "start": 126.35,
        "end": 131.8,
        "vi": "Head, shoulders, knees and toes",
        "en": "Head, shoulders, knees and toes"
      }
    ],
    "englishTranslation": [
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Eyes and ears and mouth and nose",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Eyes and ears and mouth and nose",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Eyes and ears and mouth and nose",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Head, shoulders, knees and toes",
      "Eyes and ears and mouth and nose",
      "Head, shoulders, knees and toes"
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
    "isVocalTrack": true
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
    "durationSec": 116,
    "melodyStyle": "playful",
    "lyrics": [
      "Five little monkeys jumping on the bed",
      "One fell off and bumped his head",
      "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
      "Four little monkeys jumping on the bed",
      "One fell off and bumped his head",
      "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
      "Three little monkeys jumping on the bed",
      "One fell off and bumped his head",
      "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
      "Two little monkeys jumping on the bed",
      "One fell off and bumped his head",
      "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
      "One little monkey jumping on the bed",
      "He fell off and bumped his head",
      "Mama called the doctor and the doctor said No more monkeys jumping on the bed"
    ],
    "lyricsData": [
      {
        "start": 3.75,
        "end": 7.4,
        "vi": "Five little monkeys jumping on the bed",
        "en": "Five little monkeys jumping on the bed"
      },
      {
        "start": 7.25,
        "end": 11.1,
        "vi": "One fell off and bumped his head",
        "en": "One fell off and bumped his head"
      },
      {
        "start": 14.65,
        "end": 22.5,
        "vi": "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
        "en": "Mama called the doctor and the doctor said No more monkeys jumping on the bed"
      },
      {
        "start": 25.65,
        "end": 29.4,
        "vi": "Four little monkeys jumping on the bed",
        "en": "Four little monkeys jumping on the bed"
      },
      {
        "start": 29.25,
        "end": 32.8,
        "vi": "One fell off and bumped his head",
        "en": "One fell off and bumped his head"
      },
      {
        "start": 36.55,
        "end": 43.7,
        "vi": "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
        "en": "Mama called the doctor and the doctor said No more monkeys jumping on the bed"
      },
      {
        "start": 47.65,
        "end": 51.3,
        "vi": "Three little monkeys jumping on the bed",
        "en": "Three little monkeys jumping on the bed"
      },
      {
        "start": 51.15,
        "end": 55.1,
        "vi": "One fell off and bumped his head",
        "en": "One fell off and bumped his head"
      },
      {
        "start": 58.65,
        "end": 66.1,
        "vi": "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
        "en": "Mama called the doctor and the doctor said No more monkeys jumping on the bed"
      },
      {
        "start": 69.75,
        "end": 73.6,
        "vi": "Two little monkeys jumping on the bed",
        "en": "Two little monkeys jumping on the bed"
      },
      {
        "start": 73.45,
        "end": 77.4,
        "vi": "One fell off and bumped his head",
        "en": "One fell off and bumped his head"
      },
      {
        "start": 80.85,
        "end": 88.1,
        "vi": "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
        "en": "Mama called the doctor and the doctor said No more monkeys jumping on the bed"
      },
      {
        "start": 91.75,
        "end": 95.6,
        "vi": "One little monkey jumping on the bed",
        "en": "One little monkey jumping on the bed"
      },
      {
        "start": 95.45,
        "end": 99.4,
        "vi": "He fell off and bumped his head",
        "en": "He fell off and bumped his head"
      },
      {
        "start": 106.75,
        "end": 114.6,
        "vi": "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
        "en": "Mama called the doctor and the doctor said No more monkeys jumping on the bed"
      }
    ],
    "englishTranslation": [
      "Five little monkeys jumping on the bed",
      "One fell off and bumped his head",
      "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
      "Four little monkeys jumping on the bed",
      "One fell off and bumped his head",
      "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
      "Three little monkeys jumping on the bed",
      "One fell off and bumped his head",
      "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
      "Two little monkeys jumping on the bed",
      "One fell off and bumped his head",
      "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
      "One little monkey jumping on the bed",
      "He fell off and bumped his head",
      "Mama called the doctor and the doctor said No more monkeys jumping on the bed"
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
    "isVocalTrack": true
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
    "durationSec": 138,
    "melodyStyle": "playful",
    "lyrics": [
      "Baby shark, doo-doo, doo-doo-doo-doo",
      "Mommy shark, doo-doo, doo-doo-doo-doo",
      "Daddy shark, doo-doo, doo-doo-doo-doo",
      "Grandma shark, doo-doo, doo-doo-doo-doo",
      "Grandpa shark, doo-doo, doo-doo-doo-doo",
      "Let's go hunt, doo-doo, doo-doo-doo-doo",
      "Run away, doo-doo, doo-doo-doo-doo",
      "Safe at last, doo-doo, doo-doo-doo-doo",
      "It's the end, doo-doo, doo-doo-doo-doo",
      "Twinkle, twinkle little star, how I wonder what you are"
    ],
    "lyricsData": [
      {
        "start": 27.55,
        "end": 35.8,
        "vi": "Baby shark, doo-doo, doo-doo-doo-doo",
        "en": "Baby shark, doo-doo, doo-doo-doo-doo"
      },
      {
        "start": 35.95,
        "end": 44.3,
        "vi": "Mommy shark, doo-doo, doo-doo-doo-doo",
        "en": "Mommy shark, doo-doo, doo-doo-doo-doo"
      },
      {
        "start": 44.35,
        "end": 52.7,
        "vi": "Daddy shark, doo-doo, doo-doo-doo-doo",
        "en": "Daddy shark, doo-doo, doo-doo-doo-doo"
      },
      {
        "start": 52.75,
        "end": 60.9,
        "vi": "Grandma shark, doo-doo, doo-doo-doo-doo",
        "en": "Grandma shark, doo-doo, doo-doo-doo-doo"
      },
      {
        "start": 61.15,
        "end": 69.5,
        "vi": "Grandpa shark, doo-doo, doo-doo-doo-doo",
        "en": "Grandpa shark, doo-doo, doo-doo-doo-doo"
      },
      {
        "start": 69.75,
        "end": 77.9,
        "vi": "Let's go hunt, doo-doo, doo-doo-doo-doo",
        "en": "Let's go hunt, doo-doo, doo-doo-doo-doo"
      },
      {
        "start": 78.05,
        "end": 86.5,
        "vi": "Run away, doo-doo, doo-doo-doo-doo",
        "en": "Run away, doo-doo, doo-doo-doo-doo"
      },
      {
        "start": 87.55,
        "end": 95.7,
        "vi": "Safe at last, doo-doo, doo-doo-doo-doo",
        "en": "Safe at last, doo-doo, doo-doo-doo-doo"
      },
      {
        "start": 95.85,
        "end": 104.4,
        "vi": "It's the end, doo-doo, doo-doo-doo-doo",
        "en": "It's the end, doo-doo, doo-doo-doo-doo"
      },
      {
        "start": 108.15,
        "end": 117.7,
        "vi": "Twinkle, twinkle little star, how I wonder what you are",
        "en": "Twinkle, twinkle little star, how I wonder what you are"
      }
    ],
    "englishTranslation": [
      "Baby shark, doo-doo, doo-doo-doo-doo",
      "Mommy shark, doo-doo, doo-doo-doo-doo",
      "Daddy shark, doo-doo, doo-doo-doo-doo",
      "Grandma shark, doo-doo, doo-doo-doo-doo",
      "Grandpa shark, doo-doo, doo-doo-doo-doo",
      "Let's go hunt, doo-doo, doo-doo-doo-doo",
      "Run away, doo-doo, doo-doo-doo-doo",
      "Safe at last, doo-doo, doo-doo-doo-doo",
      "It's the end, doo-doo, doo-doo-doo-doo",
      "Twinkle, twinkle little star, how I wonder what you are"
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
    "isVocalTrack": true
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
    "durationSec": 122,
    "melodyStyle": "cheerful",
    "lyrics": [
      "There was a farmer had a dog and Bingo was his name o.",
      "B-I-N-G-O, B-I-N-G-O, B-I-N-G-O and Bingo was his name o.",
      "There was a farmer had a dog and Bingo was his name o.",
      "(clap)-I-N-G-O, (clap)-I-N-G-O, (clap)-I-N-G-O and Bingo was his name o.",
      "There was a farmer had a dog and Bingo was his name o.",
      "(clap)-(clap)-N-G-O, (clap)-(clap)-N-G-O, (clap)-(clap)-N-G-O and Bingo was his name o.",
      "There was a farmer had a dog and Bingo was his name o.",
      "(clap)-(clap)-(clap)-G-O, (clap)-(clap)-(clap)-G-O, (clap)-(clap)-(clap)-G-O and Bingo was his name o.",
      "There was a farmer had a dog and Bingo was his name o.",
      "(clap)-(clap)-(clap)-(clap)-O, (clap)-(clap)-(clap)-(clap)-O, (clap)-(clap)-(clap)-(clap)-O and Bingo was his name o.",
      "There was a farmer had a dog and Bingo was his name o."
    ],
    "lyricsData": [
      {
        "start": 8.05,
        "end": 12.8,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "There was a farmer had a dog and Bingo was his name o."
      },
      {
        "start": 12.65,
        "end": 19.8,
        "vi": "B-I-N-G-O, B-I-N-G-O, B-I-N-G-O and Bingo was his name o.",
        "en": "B-I-N-G-O, B-I-N-G-O, B-I-N-G-O and Bingo was his name o."
      },
      {
        "start": 24.25,
        "end": 28.9,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "There was a farmer had a dog and Bingo was his name o."
      },
      {
        "start": 29.65,
        "end": 36.8,
        "vi": "(clap)-I-N-G-O, (clap)-I-N-G-O, (clap)-I-N-G-O and Bingo was his name o.",
        "en": "(clap)-I-N-G-O, (clap)-I-N-G-O, (clap)-I-N-G-O and Bingo was his name o."
      },
      {
        "start": 41.05,
        "end": 45.9,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "There was a farmer had a dog and Bingo was his name o."
      },
      {
        "start": 46.65,
        "end": 53.6,
        "vi": "(clap)-(clap)-N-G-O, (clap)-(clap)-N-G-O, (clap)-(clap)-N-G-O and Bingo was his name o.",
        "en": "(clap)-(clap)-N-G-O, (clap)-(clap)-N-G-O, (clap)-(clap)-N-G-O and Bingo was his name o."
      },
      {
        "start": 57.55,
        "end": 62.1,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "There was a farmer had a dog and Bingo was his name o."
      },
      {
        "start": 62.95,
        "end": 70.0,
        "vi": "(clap)-(clap)-(clap)-G-O, (clap)-(clap)-(clap)-G-O, (clap)-(clap)-(clap)-G-O and Bingo was his name o.",
        "en": "(clap)-(clap)-(clap)-G-O, (clap)-(clap)-(clap)-G-O, (clap)-(clap)-(clap)-G-O and Bingo was his name o."
      },
      {
        "start": 74.15,
        "end": 78.7,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "There was a farmer had a dog and Bingo was his name o."
      },
      {
        "start": 79.65,
        "end": 86.6,
        "vi": "(clap)-(clap)-(clap)-(clap)-O, (clap)-(clap)-(clap)-(clap)-O, (clap)-(clap)-(clap)-(clap)-O and Bingo was his name o.",
        "en": "(clap)-(clap)-(clap)-(clap)-O, (clap)-(clap)-(clap)-(clap)-O, (clap)-(clap)-(clap)-(clap)-O and Bingo was his name o."
      },
      {
        "start": 90.65,
        "end": 95.3,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "There was a farmer had a dog and Bingo was his name o."
      }
    ],
    "englishTranslation": [
      "There was a farmer had a dog and Bingo was his name o.",
      "B-I-N-G-O, B-I-N-G-O, B-I-N-G-O and Bingo was his name o.",
      "There was a farmer had a dog and Bingo was his name o.",
      "(clap)-I-N-G-O, (clap)-I-N-G-O, (clap)-I-N-G-O and Bingo was his name o.",
      "There was a farmer had a dog and Bingo was his name o.",
      "(clap)-(clap)-N-G-O, (clap)-(clap)-N-G-O, (clap)-(clap)-N-G-O and Bingo was his name o.",
      "There was a farmer had a dog and Bingo was his name o.",
      "(clap)-(clap)-(clap)-G-O, (clap)-(clap)-(clap)-G-O, (clap)-(clap)-(clap)-G-O and Bingo was his name o.",
      "There was a farmer had a dog and Bingo was his name o.",
      "(clap)-(clap)-(clap)-(clap)-O, (clap)-(clap)-(clap)-(clap)-O, (clap)-(clap)-(clap)-(clap)-O and Bingo was his name o.",
      "There was a farmer had a dog and Bingo was his name o."
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
    "isVocalTrack": true
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
    "durationSec": 165,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow.",
      "Music Interlude",
      "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow.",
      "Everywhere that Mary went, Mary went, Mary went. Everywhere that Mary went, that lamb was sure to go.",
      "Followed her to school one day, school one day, school one day. Followed her to school one day, which was against the rule.",
      "Made the children laugh and play, laugh and play, laugh and play. Made the children laugh and play, to see a lamb at school.",
      "And so the teacher turned it out, turned it out, turned it out, and so the teacher turned it out, it was against the rule.",
      "Why does a lamb love Mary so? Mary so, Mary so? Why does a lamb love Mary so? The eager children cry.",
      "Because Mary loves a lamb you know, lamb you know, lamb you know, because Mary loves the lamb you know that teacher did reply.",
      "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow. Its fleece was white as snow."
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 13.0,
        "vi": "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow.",
        "en": "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow."
      },
      {
        "start": 12.85,
        "end": 27.9,
        "vi": "Music Interlude",
        "en": "Music Interlude"
      },
      {
        "start": 27.75,
        "end": 41.2,
        "vi": "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow.",
        "en": "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow."
      },
      {
        "start": 41.05,
        "end": 57.6,
        "vi": "Everywhere that Mary went, Mary went, Mary went. Everywhere that Mary went, that lamb was sure to go.",
        "en": "Everywhere that Mary went, Mary went, Mary went. Everywhere that Mary went, that lamb was sure to go."
      },
      {
        "start": 57.45,
        "end": 73.5,
        "vi": "Followed her to school one day, school one day, school one day. Followed her to school one day, which was against the rule.",
        "en": "Followed her to school one day, school one day, school one day. Followed her to school one day, which was against the rule."
      },
      {
        "start": 73.35,
        "end": 89.6,
        "vi": "Made the children laugh and play, laugh and play, laugh and play. Made the children laugh and play, to see a lamb at school.",
        "en": "Made the children laugh and play, laugh and play, laugh and play. Made the children laugh and play, to see a lamb at school."
      },
      {
        "start": 89.45,
        "end": 106.5,
        "vi": "And so the teacher turned it out, turned it out, turned it out, and so the teacher turned it out, it was against the rule.",
        "en": "And so the teacher turned it out, turned it out, turned it out, and so the teacher turned it out, it was against the rule."
      },
      {
        "start": 106.35,
        "end": 121.3,
        "vi": "Why does a lamb love Mary so? Mary so, Mary so? Why does a lamb love Mary so? The eager children cry.",
        "en": "Why does a lamb love Mary so? Mary so, Mary so? Why does a lamb love Mary so? The eager children cry."
      },
      {
        "start": 121.15,
        "end": 138.8,
        "vi": "Because Mary loves a lamb you know, lamb you know, lamb you know, because Mary loves the lamb you know that teacher did reply.",
        "en": "Because Mary loves a lamb you know, lamb you know, lamb you know, because Mary loves the lamb you know that teacher did reply."
      },
      {
        "start": 138.65,
        "end": 162.0,
        "vi": "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow. Its fleece was white as snow.",
        "en": "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow. Its fleece was white as snow."
      }
    ],
    "englishTranslation": [
      "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow.",
      "Music Interlude",
      "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow.",
      "Everywhere that Mary went, Mary went, Mary went. Everywhere that Mary went, that lamb was sure to go.",
      "Followed her to school one day, school one day, school one day. Followed her to school one day, which was against the rule.",
      "Made the children laugh and play, laugh and play, laugh and play. Made the children laugh and play, to see a lamb at school.",
      "And so the teacher turned it out, turned it out, turned it out, and so the teacher turned it out, it was against the rule.",
      "Why does a lamb love Mary so? Mary so, Mary so? Why does a lamb love Mary so? The eager children cry.",
      "Because Mary loves a lamb you know, lamb you know, lamb you know, because Mary loves the lamb you know that teacher did reply.",
      "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow. Its fleece was white as snow."
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
    "isVocalTrack": true
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
    "durationSec": 46,
    "melodyStyle": "playful",
    "lyrics": [
      "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away.",
      "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away.",
      "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away."
    ],
    "lyricsData": [
      {
        "start": 4.25,
        "end": 14.3,
        "vi": "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away.",
        "en": "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away."
      },
      {
        "start": 16.65,
        "end": 26.5,
        "vi": "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away.",
        "en": "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away."
      },
      {
        "start": 31.25,
        "end": 40.9,
        "vi": "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away.",
        "en": "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away."
      }
    ],
    "englishTranslation": [
      "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away.",
      "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away.",
      "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away."
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
    "isVocalTrack": true
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
    "durationSec": 76,
    "melodyStyle": "playful",
    "lyrics": [
      "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, The mouse ran down, Hickory, dickory, dock.",
      "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, And down he run, Hickory, dickory, dock.",
      "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, The mouse ran down, Hickory, dickory, dock.",
      "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, And down he run, Hickory, dickory, dock."
    ],
    "lyricsData": [
      {
        "start": 5.65,
        "end": 13.4,
        "vi": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, The mouse ran down, Hickory, dickory, dock.",
        "en": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, The mouse ran down, Hickory, dickory, dock."
      },
      {
        "start": 28.25,
        "end": 37.3,
        "vi": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, And down he run, Hickory, dickory, dock.",
        "en": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, And down he run, Hickory, dickory, dock."
      },
      {
        "start": 42.35,
        "end": 50.0,
        "vi": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, The mouse ran down, Hickory, dickory, dock.",
        "en": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, The mouse ran down, Hickory, dickory, dock."
      },
      {
        "start": 64.75,
        "end": 73.3,
        "vi": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, And down he run, Hickory, dickory, dock.",
        "en": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, And down he run, Hickory, dickory, dock."
      }
    ],
    "englishTranslation": [
      "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, The mouse ran down, Hickory, dickory, dock.",
      "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, And down he run, Hickory, dickory, dock.",
      "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, The mouse ran down, Hickory, dickory, dock.",
      "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, And down he run, Hickory, dickory, dock."
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
    "isVocalTrack": true
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
    "durationSec": 163,
    "melodyStyle": "gentle",
    "lyrics": [
      "You are my sunshine, my only sunshine.",
      "You make me happy, when skies are grey.",
      "You'll never know, dear, how much I love you.",
      "Please don't take my sunshine away.",
      "The other night, dear, when I lay sleeping,",
      "I dreamed I held you in my arms, when I awoke, dear, I was mistaken,",
      "So I hung my head and cried.",
      "You are my sunshine, my only sunshine.",
      "You make me happy, when skies are grey.",
      "You'll never know, dear, how much I love you.",
      "Please don't take my sunshine away.",
      "Please don't take my sunshine away."
    ],
    "lyricsData": [
      {
        "start": 22.35,
        "end": 28.1,
        "vi": "You are my sunshine, my only sunshine.",
        "en": "You are my sunshine, my only sunshine."
      },
      {
        "start": 27.95,
        "end": 33.7,
        "vi": "You make me happy, when skies are grey.",
        "en": "You make me happy, when skies are grey."
      },
      {
        "start": 33.55,
        "end": 39.5,
        "vi": "You'll never know, dear, how much I love you.",
        "en": "You'll never know, dear, how much I love you."
      },
      {
        "start": 39.35,
        "end": 44.8,
        "vi": "Please don't take my sunshine away.",
        "en": "Please don't take my sunshine away."
      },
      {
        "start": 44.65,
        "end": 55.9,
        "vi": "The other night, dear, when I lay sleeping,",
        "en": "The other night, dear, when I lay sleeping,"
      },
      {
        "start": 55.75,
        "end": 67.1,
        "vi": "I dreamed I held you in my arms, when I awoke, dear, I was mistaken,",
        "en": "I dreamed I held you in my arms, when I awoke, dear, I was mistaken,"
      },
      {
        "start": 66.95,
        "end": 72.7,
        "vi": "So I hung my head and cried.",
        "en": "So I hung my head and cried."
      },
      {
        "start": 72.55,
        "end": 78.2,
        "vi": "You are my sunshine, my only sunshine.",
        "en": "You are my sunshine, my only sunshine."
      },
      {
        "start": 78.05,
        "end": 83.9,
        "vi": "You make me happy, when skies are grey.",
        "en": "You make me happy, when skies are grey."
      },
      {
        "start": 83.75,
        "end": 89.3,
        "vi": "You'll never know, dear, how much I love you.",
        "en": "You'll never know, dear, how much I love you."
      },
      {
        "start": 89.15,
        "end": 133.6,
        "vi": "Please don't take my sunshine away.",
        "en": "Please don't take my sunshine away."
      },
      {
        "start": 133.45,
        "end": 161.0,
        "vi": "Please don't take my sunshine away.",
        "en": "Please don't take my sunshine away."
      }
    ],
    "englishTranslation": [
      "You are my sunshine, my only sunshine.",
      "You make me happy, when skies are grey.",
      "You'll never know, dear, how much I love you.",
      "Please don't take my sunshine away.",
      "The other night, dear, when I lay sleeping,",
      "I dreamed I held you in my arms, when I awoke, dear, I was mistaken,",
      "So I hung my head and cried.",
      "You are my sunshine, my only sunshine.",
      "You make me happy, when skies are grey.",
      "You'll never know, dear, how much I love you.",
      "Please don't take my sunshine away.",
      "Please don't take my sunshine away."
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
    "isVocalTrack": true
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
    "durationSec": 0,
    "melodyStyle": "playful",
    "lyrics": [
      "(nhạc cụ)",
      "(nhạc cụ)"
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 17.3,
        "vi": "(nhạc cụ)",
        "en": "(instrumental)"
      },
      {
        "start": 17.15,
        "end": 30.0,
        "vi": "(nhạc cụ)",
        "en": "(instrumental)"
      }
    ],
    "englishTranslation": [
      "(instrumental)",
      "(instrumental)"
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
    "isVocalTrack": true
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
    "durationSec": 16,
    "melodyStyle": "cheerful",
    "lyrics": [
      "Half a pound of tuppenny rice,",
      "Half a pound of treacle,",
      "That's the way the money goes,",
      "Pop! Goes the weasel."
    ],
    "lyricsData": [
      { "start": 0.65, "end": 3.45, "en": "Half a pound of tuppenny rice,", "vi": "Nửa pound gạo hai xu," },
      { "start": 3.41, "end": 6.35, "en": "Half a pound of treacle,", "vi": "Nửa pound mật mía," },
      { "start": 6.30, "end": 9.90, "en": "That's the way the money goes,", "vi": "Tiền cứ thế mà bay đi," },
      { "start": 10.45, "end": 13.20, "en": "Pop! Goes the weasel.", "vi": "Bụp! Chồn cầy nhảy ra." }
    ],
    "englishTranslation": [
      "Half a pound of tuppenny rice,",
      "Half a pound of treacle,",
      "That's the way the money goes,",
      "Pop! Goes the weasel."
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
    "isVocalTrack": true
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
    "durationSec": 193,
    "melodyStyle": "gentle",
    "lyrics": [
      "Hot cross buns, hot cross buns",
      "One a penny, two a penny, hot cross buns",
      "Hot cross buns, hot cross buns",
      "One a penny, two a penny, hot cross buns",
      "If you have no daughter, if you have no son, then give them to your son",
      "If you have no daughter, if you have no son, then give them to your son",
      "But if you ain't got a sweet surprise, then you must eat them all at once",
      "Hot cross buns, hot cross buns",
      "One a penny, two a penny, hot cross buns",
      "Hot cross buns, hot cross buns",
      "One a penny, two a penny, hot cross buns",
      "If you have no daughter, if you have no son, then give them to your son",
      "If you have no daughter, if you have no son, then give them to your son",
      "But if you ain't got a sweet surprise, then you must eat them all at once",
      "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
      "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
      "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
      "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
      "Ginny-gaga-gribbles, happy-china-bone, power-Pistol-buy-a-little-tow",
      "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
      "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
      "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
      "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
      "Ginny-gaga-gribbles, happy-china-bone, power-Pistol-buy-a-little-tow"
    ],
    "lyricsData": [
      {
        "start": 9.65,
        "end": 13.4,
        "vi": "Hot cross buns, hot cross buns",
        "en": "Hot cross buns, hot cross buns"
      },
      {
        "start": 13.25,
        "end": 17.8,
        "vi": "One a penny, two a penny, hot cross buns",
        "en": "One a penny, two a penny, hot cross buns"
      },
      {
        "start": 17.85,
        "end": 22.0,
        "vi": "Hot cross buns, hot cross buns",
        "en": "Hot cross buns, hot cross buns"
      },
      {
        "start": 21.95,
        "end": 26.5,
        "vi": "One a penny, two a penny, hot cross buns",
        "en": "One a penny, two a penny, hot cross buns"
      },
      {
        "start": 27.25,
        "end": 35.3,
        "vi": "If you have no daughter, if you have no son, then give them to your son",
        "en": "If you have no daughter, if you have no son, then give them to your son"
      },
      {
        "start": 35.25,
        "end": 43.7,
        "vi": "If you have no daughter, if you have no son, then give them to your son",
        "en": "If you have no daughter, if you have no son, then give them to your son"
      },
      {
        "start": 44.05,
        "end": 51.3,
        "vi": "But if you ain't got a sweet surprise, then you must eat them all at once",
        "en": "But if you ain't got a sweet surprise, then you must eat them all at once"
      },
      {
        "start": 53.15,
        "end": 56.9,
        "vi": "Hot cross buns, hot cross buns",
        "en": "Hot cross buns, hot cross buns"
      },
      {
        "start": 56.85,
        "end": 60.8,
        "vi": "One a penny, two a penny, hot cross buns",
        "en": "One a penny, two a penny, hot cross buns"
      },
      {
        "start": 60.75,
        "end": 64.9,
        "vi": "Hot cross buns, hot cross buns",
        "en": "Hot cross buns, hot cross buns"
      },
      {
        "start": 64.95,
        "end": 69.6,
        "vi": "One a penny, two a penny, hot cross buns",
        "en": "One a penny, two a penny, hot cross buns"
      },
      {
        "start": 70.35,
        "end": 78.4,
        "vi": "If you have no daughter, if you have no son, then give them to your son",
        "en": "If you have no daughter, if you have no son, then give them to your son"
      },
      {
        "start": 78.35,
        "end": 86.9,
        "vi": "If you have no daughter, if you have no son, then give them to your son",
        "en": "If you have no daughter, if you have no son, then give them to your son"
      },
      {
        "start": 87.25,
        "end": 94.9,
        "vi": "But if you ain't got a sweet surprise, then you must eat them all at once",
        "en": "But if you ain't got a sweet surprise, then you must eat them all at once"
      },
      {
        "start": 105.15,
        "end": 112.7,
        "vi": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
        "en": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow"
      },
      {
        "start": 112.65,
        "end": 120.4,
        "vi": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
        "en": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow"
      },
      {
        "start": 121.15,
        "end": 130.5,
        "vi": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
        "en": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow"
      },
      {
        "start": 130.95,
        "end": 140.1,
        "vi": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
        "en": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow"
      },
      {
        "start": 140.35,
        "end": 146.9,
        "vi": "Ginny-gaga-gribbles, happy-china-bone, power-Pistol-buy-a-little-tow",
        "en": "Ginny-gaga-gribbles, happy-china-bone, power-Pistol-buy-a-little-tow"
      },
      {
        "start": 148.25,
        "end": 155.8,
        "vi": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
        "en": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow"
      },
      {
        "start": 155.95,
        "end": 164.8,
        "vi": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
        "en": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow"
      },
      {
        "start": 165.15,
        "end": 174.0,
        "vi": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
        "en": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow"
      },
      {
        "start": 174.25,
        "end": 183.4,
        "vi": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
        "en": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow"
      },
      {
        "start": 183.75,
        "end": 190.0,
        "vi": "Ginny-gaga-gribbles, happy-china-bone, power-Pistol-buy-a-little-tow",
        "en": "Ginny-gaga-gribbles, happy-china-bone, power-Pistol-buy-a-little-tow"
      }
    ],
    "englishTranslation": [
      "Hot cross buns, hot cross buns",
      "One a penny, two a penny, hot cross buns",
      "Hot cross buns, hot cross buns",
      "One a penny, two a penny, hot cross buns",
      "If you have no daughter, if you have no son, then give them to your son",
      "If you have no daughter, if you have no son, then give them to your son",
      "But if you ain't got a sweet surprise, then you must eat them all at once",
      "Hot cross buns, hot cross buns",
      "One a penny, two a penny, hot cross buns",
      "Hot cross buns, hot cross buns",
      "One a penny, two a penny, hot cross buns",
      "If you have no daughter, if you have no son, then give them to your son",
      "If you have no daughter, if you have no son, then give them to your son",
      "But if you ain't got a sweet surprise, then you must eat them all at once",
      "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
      "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
      "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
      "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
      "Ginny-gaga-gribbles, happy-china-bone, power-Pistol-buy-a-little-tow",
      "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
      "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
      "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
      "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
      "Ginny-gaga-gribbles, happy-china-bone, power-Pistol-buy-a-little-tow"
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
    "isVocalTrack": true
  }
];
