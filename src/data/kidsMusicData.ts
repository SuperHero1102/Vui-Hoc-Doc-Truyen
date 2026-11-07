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
      "Cô thương cháu vì không khóc nhè.",
      "Không khóc nhè để mẹ trồng cây trái.",
      "Ba vào nhà máy, ông bà vui cấy cày.",
      "La la la la la la la la la.",
      "Cháu lên ba, cháu đi mẫu giáo.",
      "Cô thương cháu vì không khóc nhè.",
      "Không khóc nhè để mẹ trồng cây trái.",
      "Ba vào nhà máy, ông bà vui cấy cày. La la la la la la la la la.",
      "Cháu lên ba, cháu đi mẫu giáo.",
      "Cô thương cháu vì không khóc nhè.",
      "Không khóc nhè để mẹ trồng cây trái.",
      "Ba vào nhà máy, ông bà vui cấy cày.",
      "La la la la la la la la la.",
      "Cháu lên ba, cháu đi mẫu giáo.",
      "Cô thương cháu vì không khóc nhè.",
      "Không khóc nhè để mẹ trồng cây trái.",
      "Ba vào nhà máy, ông bà vui cấy cày. La la la la la la la la la."
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
        "vi": "Cô thương cháu vì không khóc nhè.",
        "en": "The teacher loves me because I don't cry."
      },
      {
        "start": 19.85,
        "end": 24.2,
        "vi": "Không khóc nhè để mẹ trồng cây trái.",
        "en": "I do not cry so mother can plant fruit trees."
      },
      {
        "start": 24.05,
        "end": 28.5,
        "vi": "Ba vào nhà máy, ông bà vui cấy cày.",
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
        "vi": "Cô thương cháu vì không khóc nhè.",
        "en": "The teacher loves me because I don't cry."
      },
      {
        "start": 41.65,
        "end": 46.0,
        "vi": "Không khóc nhè để mẹ trồng cây trái.",
        "en": "I do not cry so mother can plant fruit trees."
      },
      {
        "start": 45.85,
        "end": 53.4,
        "vi": "Ba vào nhà máy, ông bà vui cấy cày. La la la la la la la la la.",
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
        "vi": "Cô thương cháu vì không khóc nhè.",
        "en": "The teacher loves me because I don't cry."
      },
      {
        "start": 73.85,
        "end": 78.2,
        "vi": "Không khóc nhè để mẹ trồng cây trái.",
        "en": "I do not cry so mother can plant fruit trees."
      },
      {
        "start": 78.05,
        "end": 82.5,
        "vi": "Ba vào nhà máy, ông bà vui cấy cày.",
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
        "vi": "Cô thương cháu vì không khóc nhè.",
        "en": "The teacher loves me because I don't cry."
      },
      {
        "start": 95.65,
        "end": 100.0,
        "vi": "Không khóc nhè để mẹ trồng cây trái.",
        "en": "I do not cry so mother can plant fruit trees."
      },
      {
        "start": 99.85,
        "end": 107.4,
        "vi": "Ba vào nhà máy, ông bà vui cấy cày. La la la la la la la la la.",
        "en": "Dad goes to the factory, grandparents are happy farming. La la la la la la la la la."
      }
    ],
    "englishTranslation": [
      "I go to kindergarten when I am three years old.",
      "The teacher loves me because I don't cry.",
      "I do not cry so mother can plant fruit trees.",
      "Dad goes to the factory, grandparents are happy farming.",
      "La la la la la la la la la.",
      "I go to kindergarten when I am three years old.",
      "The teacher loves me because I don't cry.",
      "I do not cry so mother can plant fruit trees.",
      "Dad goes to the factory, grandparents are happy farming. La la la la la la la la la.",
      "I go to kindergarten when I am three years old.",
      "The teacher loves me because I don't cry.",
      "I do not cry so mother can plant fruit trees.",
      "Dad goes to the factory, grandparents are happy farming.",
      "La la la la la la la la la.",
      "I go to kindergarten when I am three years old.",
      "The teacher loves me because I don't cry.",
      "I do not cry so mother can plant fruit trees.",
      "Dad goes to the factory, grandparents are happy farming. La la la la la la la la la."
    ],
    "funFactVi": "Bé ba tuổi tự tin, vui tươi đi mẫu giáo ngoan không khóc nhè.",
    "audioUrl": "./assets/music/chau-len-ba.mp3",
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
    "cover": "./assets/music/covers/music_cover_chau-len-ba.webp",
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
      "(Nhạc dạo)",
      "Meo meo meo, rửa mặt như mèo.",
      "Xấu xấu lắm chẳng được mẹ yêu.",
      "Khăn mặt đâu mà ngồi liếm láp.",
      "Đau mắt rồi lại khóc meo meo.",
      "(Nhạc dạo)",
      "Meo meo meo, rửa mặt như mèo.",
      "Xấu xấu lắm chẳng được mẹ yêu.",
      "Khăn mặt đâu mà ngồi liếm láp.",
      "Đau mắt rồi lại khóc meo meo.",
      "(Nhạc dạo)",
      "Meo meo meo, rửa mặt như mèo.",
      "Xấu xấu lắm chẳng được mẹ yêu.",
      "Khăn mặt đâu mà ngồi liếm láp.",
      "Đau mắt rồi lại khóc meo meo.",
      "(Nhạc dạo)",
      "Meo meo meo, rửa mặt như mèo.",
      "Xấu xấu lắm chẳng được mẹ yêu.",
      "Khăn mặt đâu mà ngồi liếm láp.",
      "Đau mắt rồi lại khóc meo meo.",
      "(Nhạc dạo)",
      "Meo meo meo, rửa mặt như mèo.",
      "Xấu xấu lắm chẳng được mẹ yêu.",
      "Khăn mặt đâu mà ngồi liếm láp.",
      "Đau mắt rồi lại khóc meo meo.",
      "(Nhạc dạo)",
      "Meo meo meo, rửa mặt như mèo.",
      "Xấu xấu lắm chẳng được mẹ yêu.",
      "Khăn mặt đâu mà ngồi liếm láp.",
      "Đau mắt rồi lại khóc meo meo."
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 36.4,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 36.25,
        "end": 40.4,
        "vi": "Meo meo meo, rửa mặt như mèo.",
        "en": "Meow meow meow, washing your face like a cat."
      },
      {
        "start": 40.25,
        "end": 44.8,
        "vi": "Xấu xấu lắm chẳng được mẹ yêu.",
        "en": "So very bad, mother doesn't love you."
      },
      {
        "start": 44.65,
        "end": 49.2,
        "vi": "Khăn mặt đâu mà ngồi liếm láp.",
        "en": "Where is the washcloth that you sit licking your face."
      },
      {
        "start": 49.05,
        "end": 54.4,
        "vi": "Đau mắt rồi lại khóc meo meo.",
        "en": "With sore eyes, crying meow meow again."
      },
      {
        "start": 54.25,
        "end": 58.2,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 58.05,
        "end": 62.1,
        "vi": "Meo meo meo, rửa mặt như mèo.",
        "en": "Meow meow meow, washing your face like a cat."
      },
      {
        "start": 61.95,
        "end": 66.6,
        "vi": "Xấu xấu lắm chẳng được mẹ yêu.",
        "en": "So very bad, mother doesn't love you."
      },
      {
        "start": 66.45,
        "end": 71.1,
        "vi": "Khăn mặt đâu mà ngồi liếm láp.",
        "en": "Where is the washcloth that you sit licking your face."
      },
      {
        "start": 70.95,
        "end": 76.1,
        "vi": "Đau mắt rồi lại khóc meo meo.",
        "en": "With sore eyes, crying meow meow again."
      },
      {
        "start": 75.95,
        "end": 80.5,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 80.35,
        "end": 84.4,
        "vi": "Meo meo meo, rửa mặt như mèo.",
        "en": "Meow meow meow, washing your face like a cat."
      },
      {
        "start": 84.25,
        "end": 88.9,
        "vi": "Xấu xấu lắm chẳng được mẹ yêu.",
        "en": "So very bad, mother doesn't love you."
      },
      {
        "start": 88.75,
        "end": 93.4,
        "vi": "Khăn mặt đâu mà ngồi liếm láp.",
        "en": "Where is the washcloth that you sit licking your face."
      },
      {
        "start": 93.25,
        "end": 98.2,
        "vi": "Đau mắt rồi lại khóc meo meo.",
        "en": "With sore eyes, crying meow meow again."
      },
      {
        "start": 98.05,
        "end": 138.0,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 137.85,
        "end": 142.2,
        "vi": "Meo meo meo, rửa mặt như mèo.",
        "en": "Meow meow meow, washing your face like a cat."
      },
      {
        "start": 142.05,
        "end": 146.7,
        "vi": "Xấu xấu lắm chẳng được mẹ yêu.",
        "en": "So very bad, mother doesn't love you."
      },
      {
        "start": 146.55,
        "end": 151.2,
        "vi": "Khăn mặt đâu mà ngồi liếm láp.",
        "en": "Where is the washcloth that you sit licking your face."
      },
      {
        "start": 151.05,
        "end": 156.1,
        "vi": "Đau mắt rồi lại khóc meo meo.",
        "en": "With sore eyes, crying meow meow again."
      },
      {
        "start": 155.95,
        "end": 160.2,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 160.05,
        "end": 164.2,
        "vi": "Meo meo meo, rửa mặt như mèo.",
        "en": "Meow meow meow, washing your face like a cat."
      },
      {
        "start": 164.05,
        "end": 168.8,
        "vi": "Xấu xấu lắm chẳng được mẹ yêu.",
        "en": "So very bad, mother doesn't love you."
      },
      {
        "start": 168.65,
        "end": 173.3,
        "vi": "Khăn mặt đâu mà ngồi liếm láp.",
        "en": "Where is the washcloth that you sit licking your face."
      },
      {
        "start": 173.15,
        "end": 178.2,
        "vi": "Đau mắt rồi lại khóc meo meo.",
        "en": "With sore eyes, crying meow meow again."
      },
      {
        "start": 178.05,
        "end": 182.2,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 182.05,
        "end": 186.3,
        "vi": "Meo meo meo, rửa mặt như mèo.",
        "en": "Meow meow meow, washing your face like a cat."
      },
      {
        "start": 186.15,
        "end": 190.9,
        "vi": "Xấu xấu lắm chẳng được mẹ yêu.",
        "en": "So very bad, mother doesn't love you."
      },
      {
        "start": 190.75,
        "end": 195.3,
        "vi": "Khăn mặt đâu mà ngồi liếm láp.",
        "en": "Where is the washcloth that you sit licking your face."
      },
      {
        "start": 195.15,
        "end": 205.0,
        "vi": "Đau mắt rồi lại khóc meo meo.",
        "en": "With sore eyes, crying meow meow again."
      }
    ],
    "englishTranslation": [
      "(Instrumental)",
      "Meow meow meow, washing your face like a cat.",
      "So very bad, mother doesn't love you.",
      "Where is the washcloth that you sit licking your face.",
      "With sore eyes, crying meow meow again.",
      "(Instrumental)",
      "Meow meow meow, washing your face like a cat.",
      "So very bad, mother doesn't love you.",
      "Where is the washcloth that you sit licking your face.",
      "With sore eyes, crying meow meow again.",
      "(Instrumental)",
      "Meow meow meow, washing your face like a cat.",
      "So very bad, mother doesn't love you.",
      "Where is the washcloth that you sit licking your face.",
      "With sore eyes, crying meow meow again.",
      "(Instrumental)",
      "Meow meow meow, washing your face like a cat.",
      "So very bad, mother doesn't love you.",
      "Where is the washcloth that you sit licking your face.",
      "With sore eyes, crying meow meow again.",
      "(Instrumental)",
      "Meow meow meow, washing your face like a cat.",
      "So very bad, mother doesn't love you.",
      "Where is the washcloth that you sit licking your face.",
      "With sore eyes, crying meow meow again.",
      "(Instrumental)",
      "Meow meow meow, washing your face like a cat.",
      "So very bad, mother doesn't love you.",
      "Where is the washcloth that you sit licking your face.",
      "With sore eyes, crying meow meow again."
    ],
    "funFactVi": "Rửa mặt bằng khăn sạch mỗi sớm giúp bé tươi vui, mắt sáng.",
    "audioUrl": "./assets/music/rua-mat-nhu-meo.mp3",
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
    "cover": "./assets/music/covers/music_cover_rua-mat-nhu-meo.webp",
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
      "Hôm qua em tới trường, mẹ dắt tay từng bước.",
      "Hôm nay mẹ lên nương, một mình em tới lớp.",
      "Chim đùa theo trong lá, cá dưới khe thì thào.",
      "Hương rừng chen hương cốm, em tới trường hương theo.",
      "Trường của em be bé, nằm lặng giữa rừng cây.",
      "Cô giáo em tre trẻ, dạy em hát rất hay.",
      "Hương rừng thơm đồi vắng, nước suối trong thầm thì.",
      "Cọ xòe ô che nắng, râm mát đường em đi.",
      "Trường của em be bé, nằm lặng giữa rừng cây.",
      "Cô giáo em tre trẻ, dạy em hát rất hay.",
      "Hương rừng thơm đồi vắng, nước suối trong thầm thì.",
      "Cọ xòe ô che nắng, râm mát đường em đi."
    ],
    "lyricsData": [
      {
        "start": 16.65,
        "end": 24.4,
        "vi": "Hôm qua em tới trường, mẹ dắt tay từng bước.",
        "en": "Yesterday I went to school, mother held my hand step by step."
      },
      {
        "start": 24.25,
        "end": 33.7,
        "vi": "Hôm nay mẹ lên nương, một mình em tới lớp.",
        "en": "Today mother goes to the fields, I go to class alone."
      },
      {
        "start": 33.55,
        "end": 41.9,
        "vi": "Chim đùa theo trong lá, cá dưới khe thì thào.",
        "en": "Birds play in the leaves, fish whisper in the stream."
      },
      {
        "start": 41.75,
        "end": 50.9,
        "vi": "Hương rừng chen hương cốm, em tới trường hương theo.",
        "en": "Forest scent mingles with green rice aroma, fragrance follows me to school."
      },
      {
        "start": 59.65,
        "end": 67.7,
        "vi": "Trường của em be bé, nằm lặng giữa rừng cây.",
        "en": "My little school lies quietly amid the forest trees."
      },
      {
        "start": 67.55,
        "end": 77.1,
        "vi": "Cô giáo em tre trẻ, dạy em hát rất hay.",
        "en": "My young teacher teaches me to sing very well."
      },
      {
        "start": 76.95,
        "end": 85.1,
        "vi": "Hương rừng thơm đồi vắng, nước suối trong thầm thì.",
        "en": "Forest fragrance fills the quiet hills, stream water whispers softly."
      },
      {
        "start": 84.95,
        "end": 94.1,
        "vi": "Cọ xòe ô che nắng, râm mát đường em đi.",
        "en": "Palm leaves spread like umbrellas to block the sun, shading the road I walk."
      },
      {
        "start": 103.45,
        "end": 111.6,
        "vi": "Trường của em be bé, nằm lặng giữa rừng cây.",
        "en": "My little school lies quietly amid the forest trees."
      },
      {
        "start": 111.45,
        "end": 120.6,
        "vi": "Cô giáo em tre trẻ, dạy em hát rất hay.",
        "en": "My young teacher teaches me to sing very well."
      },
      {
        "start": 120.45,
        "end": 128.5,
        "vi": "Hương rừng thơm đồi vắng, nước suối trong thầm thì.",
        "en": "Forest fragrance fills the quiet hills, stream water whispers softly."
      },
      {
        "start": 128.35,
        "end": 149.6,
        "vi": "Cọ xòe ô che nắng, râm mát đường em đi.",
        "en": "Palm leaves spread like umbrellas to block the sun, shading the road I walk."
      }
    ],
    "englishTranslation": [
      "Yesterday I went to school, mother held my hand step by step.",
      "Today mother goes to the fields, I go to class alone.",
      "Birds play in the leaves, fish whisper in the stream.",
      "Forest scent mingles with green rice aroma, fragrance follows me to school.",
      "My little school lies quietly amid the forest trees.",
      "My young teacher teaches me to sing very well.",
      "Forest fragrance fills the quiet hills, stream water whispers softly.",
      "Palm leaves spread like umbrellas to block the sun, shading the road I walk.",
      "My little school lies quietly amid the forest trees.",
      "My young teacher teaches me to sing very well.",
      "Forest fragrance fills the quiet hills, stream water whispers softly.",
      "Palm leaves spread like umbrellas to block the sun, shading the road I walk."
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
    "cover": "./assets/music/covers/music_cover_di-hoc.webp",
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
      "Ai hỏi cháu, cháu học trường nào đấy?",
      "Bé mà ngoan lại múa hát thật hay.",
      "Cô là mẹ và các cháu là con.",
      "Trường của cháu đây là trường mầm non."
    ],
    "lyricsData": [
      { "start": 16.35, "end": 20.5, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks grandchild, which school do you attend?" },
      { "start": 20.35, "end": 24.7, "vi": "Bé mà ngoan lại múa hát thật hay.", "en": "A well-behaved child dances and sings so beautifully." },
      { "start": 24.55, "end": 29.0, "vi": "Cô là mẹ và các cháu là con.", "en": "The teacher is the mother and we are the children." },
      { "start": 28.85, "end": 34.0, "vi": "Trường của cháu đây là trường mầm non.", "en": "This school of ours is a kindergarten." },
      { "start": 33.85, "end": 37.8, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks grandchild, which school do you attend?" },
      { "start": 37.65, "end": 42.2, "vi": "Bé mà ngoan lại múa hát thật hay.", "en": "A well-behaved child dances and sings so beautifully." },
      { "start": 42.05, "end": 46.5, "vi": "Cô là mẹ và các cháu là con.", "en": "The teacher is the mother and we are the children." },
      { "start": 46.35, "end": 51.5, "vi": "Trường của cháu đây là trường mầm non.", "en": "This school of ours is a kindergarten." },
      { "start": 59.85, "end": 64.0, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks grandchild, which school do you attend?" },
      { "start": 63.85, "end": 68.2, "vi": "Bé mà ngoan lại múa hát thật hay.", "en": "A well-behaved child dances and sings so beautifully." },
      { "start": 68.05, "end": 72.7, "vi": "Cô là mẹ và các cháu là con.", "en": "The teacher is the mother and we are the children." },
      { "start": 72.55, "end": 77.3, "vi": "Trường của cháu đây là trường mầm non.", "en": "This school of ours is a kindergarten." },
      { "start": 77.15, "end": 81.3, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks grandchild, which school do you attend?" },
      { "start": 81.15, "end": 85.6, "vi": "Bé mà ngoan lại múa hát thật hay.", "en": "A well-behaved child dances and sings so beautifully." },
      { "start": 85.45, "end": 89.9, "vi": "Cô là mẹ và các cháu là con.", "en": "The teacher is the mother and we are the children." },
      { "start": 89.75, "end": 95.0, "vi": "Trường của cháu đây là trường mầm non.", "en": "This school of ours is a kindergarten." },
      { "start": 103.45, "end": 107.4, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks grandchild, which school do you attend?" },
      { "start": 107.25, "end": 111.6, "vi": "Bé mà ngoan lại múa hát thật hay.", "en": "A well-behaved child dances and sings so beautifully." },
      { "start": 111.45, "end": 116.0, "vi": "Cô là mẹ và các cháu là con.", "en": "The teacher is the mother and we are the children." },
      { "start": 115.85, "end": 120.8, "vi": "Trường của cháu đây là trường mầm non.", "en": "This school of ours is a kindergarten." },
      { "start": 120.65, "end": 124.8, "vi": "Ai hỏi cháu, cháu học trường nào đấy?", "en": "Who asks grandchild, which school do you attend?" },
      { "start": 124.65, "end": 129.1, "vi": "Bé mà ngoan lại múa hát thật hay.", "en": "A well-behaved child dances and sings so beautifully." },
      { "start": 128.95, "end": 133.4, "vi": "Cô là mẹ và các cháu là con.", "en": "The teacher is the mother and we are the children." },
      { "start": 133.25, "end": 138.5, "vi": "Trường của cháu đây là trường mầm non.", "en": "This school of ours is a kindergarten." }
    ],
    "funFactVi": "Trường mầm non rực rỡ tiếng cười của bạn bè và cô giáo hiền.",
    "audioUrl": "./assets/music/truong-chung-chau-la-truong-mam-non.mp3",
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
    "cover": "./assets/music/covers/music_cover_truong-chung-chau-la-truong-mam-non.webp",
    "isVocalTrack": true,
    "englishTranslation": [
      "Who asks grandchild, which school do you attend?",
      "A well-behaved child dances and sings so beautifully.",
      "The teacher is the mother and we are the children.",
      "This school of ours is a kindergarten."
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
      "(Nhạc dạo)",
      "Con cò bé bé, nó đậu cành tre.",
      "Đi không hỏi mẹ, biết đi đường nào?",
      "Khi đi em hỏi, khi về em chào.",
      "Miệng em chúm chím, mẹ có yêu không nào?",
      "Con cò bé bé, nó đậu cành tre.",
      "Đi không hỏi mẹ, biết đi đường nào?",
      "Khi đi em hỏi, khi về em chào.",
      "Miệng em chúm chím, mẹ có yêu không nào?",
      "(Nhạc dạo)",
      "Con cò bé bé, nó đậu cành tre.",
      "Đi không hỏi mẹ, biết đi đường nào?",
      "Khi đi em hỏi, khi về em chào.",
      "Miệng em chúm chím, mẹ có yêu không nào?",
      "Con cò bé bé, nó đậu cành tre.",
      "Miệng em chúm chím, mẹ có yêu không nào?",
      "(Nhạc kết)"
    ],
    "lyricsData": [
      {
        "start": 26.35,
        "end": 32.4,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 32.25,
        "end": 37.3,
        "vi": "Con cò bé bé, nó đậu cành tre.",
        "en": "The little stork sits on the bamboo branch."
      },
      {
        "start": 37.15,
        "end": 43.0,
        "vi": "Đi không hỏi mẹ, biết đi đường nào?",
        "en": "Leaving without asking mother, which way to go?"
      },
      {
        "start": 42.85,
        "end": 48.3,
        "vi": "Khi đi em hỏi, khi về em chào.",
        "en": "When leaving I ask, when returning I greet."
      },
      {
        "start": 53.25,
        "end": 58.7,
        "vi": "Miệng em chúm chím, mẹ có yêu không nào?",
        "en": "My mouth smiles sweetly, mother do you love me?"
      },
      {
        "start": 58.55,
        "end": 63.9,
        "vi": "Con cò bé bé, nó đậu cành tre.",
        "en": "The little stork sits on the bamboo branch."
      },
      {
        "start": 63.75,
        "end": 69.3,
        "vi": "Đi không hỏi mẹ, biết đi đường nào?",
        "en": "Leaving without asking mother, which way to go?"
      },
      {
        "start": 69.15,
        "end": 74.6,
        "vi": "Khi đi em hỏi, khi về em chào.",
        "en": "When leaving I ask, when returning I greet."
      },
      {
        "start": 103.55,
        "end": 109.5,
        "vi": "Miệng em chúm chím, mẹ có yêu không nào?",
        "en": "My mouth smiles sweetly, mother do you love me?"
      },
      {
        "start": 109.35,
        "end": 114.6,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 114.45,
        "end": 120.1,
        "vi": "Con cò bé bé, nó đậu cành tre.",
        "en": "The little stork sits on the bamboo branch."
      },
      {
        "start": 119.95,
        "end": 124.9,
        "vi": "Đi không hỏi mẹ, biết đi đường nào?",
        "en": "Leaving without asking mother, which way to go?"
      },
      {
        "start": 130.35,
        "end": 136.3,
        "vi": "Khi đi em hỏi, khi về em chào.",
        "en": "When leaving I ask, when returning I greet."
      },
      {
        "start": 136.15,
        "end": 141.0,
        "vi": "Miệng em chúm chím, mẹ có yêu không nào?",
        "en": "My mouth smiles sweetly, mother do you love me?"
      },
      {
        "start": 140.85,
        "end": 146.5,
        "vi": "Con cò bé bé, nó đậu cành tre.",
        "en": "The little stork sits on the bamboo branch."
      },
      {
        "start": 146.35,
        "end": 150.5,
        "vi": "Miệng em chúm chím, mẹ có yêu không nào?",
        "en": "My mouth smiles sweetly, mother do you love me?"
      },
      {
        "start": 150.35,
        "end": 156.1,
        "vi": "(Nhạc kết)",
        "en": "(Outro)"
      }
    ],
    "englishTranslation": [
      "(Instrumental)",
      "The little stork sits on the bamboo branch.",
      "Leaving without asking mother, which way to go?",
      "When leaving I ask, when returning I greet.",
      "My mouth smiles sweetly, mother do you love me?",
      "The little stork sits on the bamboo branch.",
      "Leaving without asking mother, which way to go?",
      "When leaving I ask, when returning I greet.",
      "My mouth smiles sweetly, mother do you love me?",
      "(Instrumental)",
      "The little stork sits on the bamboo branch.",
      "Leaving without asking mother, which way to go?",
      "When leaving I ask, when returning I greet.",
      "My mouth smiles sweetly, mother do you love me?",
      "The little stork sits on the bamboo branch.",
      "My mouth smiles sweetly, mother do you love me?",
      "(Outro)"
    ],
    "funFactVi": "Bé ngoan luôn lễ phép chào hỏi người lớn khi đi và về.",
    "audioUrl": "./assets/music/con-co-be-be.mp3",
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
    "cover": "./assets/music/covers/music_cover_con-co-be-be.webp",
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
    "audioUrl": "./assets/music/ca-nha-thuong-nhau.mp3",
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
    "cover": "./assets/music/covers/music_cover_ca-nha-thuong-nhau.webp",
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
      "(Nhạc dạo)",
      "Bà ơi bà, cháu yêu bà lắm.",
      "Tóc bà trắng, màu trắng như mây.",
      "Cháu yêu bà, cháu nắm bàn tay.",
      "Khi cháu vâng lời, cháu biết bà vui.",
      "Khi cháu vâng lời, cháu biết bà vui.",
      "(Nhạc dạo)",
      "Bà ơi bà, cháu yêu bà lắm.",
      "Tóc bà trắng, màu trắng như mây.",
      "Cháu yêu bà, cháu nắm bàn tay.",
      "Khi cháu vâng lời, cháu biết bà vui.",
      "Khi cháu vâng lời, cháu biết bà vui."
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 28.9,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 28.75,
        "end": 37.8,
        "vi": "Bà ơi bà, cháu yêu bà lắm.",
        "en": "Grandma, oh Grandma, I love you so much."
      },
      {
        "start": 37.65,
        "end": 46.8,
        "vi": "Tóc bà trắng, màu trắng như mây.",
        "en": "Grandma's hair is white, white like clouds."
      },
      {
        "start": 46.65,
        "end": 51.0,
        "vi": "Cháu yêu bà, cháu nắm bàn tay.",
        "en": "I love Grandma, I hold your hands."
      },
      {
        "start": 50.85,
        "end": 60.0,
        "vi": "Khi cháu vâng lời, cháu biết bà vui.",
        "en": "When I obey, I know Grandma is happy."
      },
      {
        "start": 59.85,
        "end": 68.8,
        "vi": "Khi cháu vâng lời, cháu biết bà vui.",
        "en": "When I obey, I know Grandma is happy."
      },
      {
        "start": 68.65,
        "end": 118.3,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 118.15,
        "end": 126.9,
        "vi": "Bà ơi bà, cháu yêu bà lắm.",
        "en": "Grandma, oh Grandma, I love you so much."
      },
      {
        "start": 126.75,
        "end": 135.5,
        "vi": "Tóc bà trắng, màu trắng như mây.",
        "en": "Grandma's hair is white, white like clouds."
      },
      {
        "start": 135.35,
        "end": 140.1,
        "vi": "Cháu yêu bà, cháu nắm bàn tay.",
        "en": "I love Grandma, I hold your hands."
      },
      {
        "start": 139.95,
        "end": 148.9,
        "vi": "Khi cháu vâng lời, cháu biết bà vui.",
        "en": "When I obey, I know Grandma is happy."
      },
      {
        "start": 148.75,
        "end": 166.9,
        "vi": "Khi cháu vâng lời, cháu biết bà vui.",
        "en": "When I obey, I know Grandma is happy."
      }
    ],
    "englishTranslation": [
      "(Instrumental)",
      "Grandma, oh Grandma, I love you so much.",
      "Grandma's hair is white, white like clouds.",
      "I love Grandma, I hold your hands.",
      "When I obey, I know Grandma is happy.",
      "When I obey, I know Grandma is happy.",
      "(Instrumental)",
      "Grandma, oh Grandma, I love you so much.",
      "Grandma's hair is white, white like clouds.",
      "I love Grandma, I hold your hands.",
      "When I obey, I know Grandma is happy.",
      "When I obey, I know Grandma is happy."
    ],
    "funFactVi": "Lòng hiếu thảo, cử chỉ âu yếm bé dành cho người bà tóc bạc.",
    "audioUrl": "./assets/music/chau-yeu-ba.mp3",
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
    "cover": "./assets/music/covers/music_cover_chau-yeu-ba.webp",
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
    "audioUrl": "./assets/music/mot-con-vit.mp3",
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
    "cover": "./assets/music/covers/music_cover_mot-con-vit.webp",
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
      "(Nhạc dạo)",
      "Hai vây xinh xinh, cá vàng bơi trong bể nước.",
      "Ngoi lên lặn xuống, cá vàng múa tung tăng.",
      "Cá vàng bắt bọ gậy cho nước thêm sạch trong.",
      "Hai vây xinh xinh, cá vàng bơi trong bể nước.",
      "Ngoi lên lặn xuống, cá vàng múa tung tăng.",
      "Cá vàng bắt bọ gậy cho nước thêm sạch trong.",
      "(Nhạc dạo)",
      "Hai vây xinh xinh, cá vàng bơi trong bể nước.",
      "Ngoi lên lặn xuống, cá vàng múa tung tăng.",
      "Cá vàng bắt bọ gậy cho nước thêm sạch trong.",
      "Hai vây xinh xinh, cá vàng bơi trong bể nước.",
      "Ngoi lên lặn xuống, cá vàng múa tung tăng.",
      "Cá vàng bắt bọ gậy cho nước thêm sạch trong.",
      "Hai vây xinh xinh, cá vàng bơi trong bể nước.",
      "Ngoi lên lặn xuống, cá vàng múa tung tăng.",
      "Cá vàng bắt bọ gậy cho nước thêm sạch trong.",
      "(Nhạc kết)"
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 24.4,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 24.25,
        "end": 34.0,
        "vi": "Hai vây xinh xinh, cá vàng bơi trong bể nước.",
        "en": "Two pretty fins, the goldfish swims in the fish tank."
      },
      {
        "start": 33.85,
        "end": 43.7,
        "vi": "Ngoi lên lặn xuống, cá vàng múa tung tăng.",
        "en": "Floating up and diving down, the goldfish dances happily."
      },
      {
        "start": 43.55,
        "end": 50.5,
        "vi": "Cá vàng bắt bọ gậy cho nước thêm sạch trong.",
        "en": "The goldfish catches mosquito larvae to keep the water clean and clear."
      },
      {
        "start": 50.35,
        "end": 60.3,
        "vi": "Hai vây xinh xinh, cá vàng bơi trong bể nước.",
        "en": "Two pretty fins, the goldfish swims in the fish tank."
      },
      {
        "start": 60.15,
        "end": 70.0,
        "vi": "Ngoi lên lặn xuống, cá vàng múa tung tăng.",
        "en": "Floating up and diving down, the goldfish dances happily."
      },
      {
        "start": 69.85,
        "end": 76.8,
        "vi": "Cá vàng bắt bọ gậy cho nước thêm sạch trong.",
        "en": "The goldfish catches mosquito larvae to keep the water clean and clear."
      },
      {
        "start": 76.65,
        "end": 126.0,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 125.85,
        "end": 135.9,
        "vi": "Hai vây xinh xinh, cá vàng bơi trong bể nước.",
        "en": "Two pretty fins, the goldfish swims in the fish tank."
      },
      {
        "start": 135.75,
        "end": 145.5,
        "vi": "Ngoi lên lặn xuống, cá vàng múa tung tăng.",
        "en": "Floating up and diving down, the goldfish dances happily."
      },
      {
        "start": 145.35,
        "end": 152.4,
        "vi": "Cá vàng bắt bọ gậy cho nước thêm sạch trong.",
        "en": "The goldfish catches mosquito larvae to keep the water clean and clear."
      },
      {
        "start": 152.25,
        "end": 162.2,
        "vi": "Hai vây xinh xinh, cá vàng bơi trong bể nước.",
        "en": "Two pretty fins, the goldfish swims in the fish tank."
      },
      {
        "start": 162.05,
        "end": 171.9,
        "vi": "Ngoi lên lặn xuống, cá vàng múa tung tăng.",
        "en": "Floating up and diving down, the goldfish dances happily."
      },
      {
        "start": 171.75,
        "end": 179.0,
        "vi": "Cá vàng bắt bọ gậy cho nước thêm sạch trong.",
        "en": "The goldfish catches mosquito larvae to keep the water clean and clear."
      },
      {
        "start": 178.85,
        "end": 188.8,
        "vi": "Hai vây xinh xinh, cá vàng bơi trong bể nước.",
        "en": "Two pretty fins, the goldfish swims in the fish tank."
      },
      {
        "start": 188.65,
        "end": 198.5,
        "vi": "Ngoi lên lặn xuống, cá vàng múa tung tăng.",
        "en": "Floating up and diving down, the goldfish dances happily."
      },
      {
        "start": 198.35,
        "end": 209.8,
        "vi": "Cá vàng bắt bọ gậy cho nước thêm sạch trong.",
        "en": "The goldfish catches mosquito larvae to keep the water clean and clear."
      },
      {
        "start": 209.65,
        "end": 221.0,
        "vi": "(Nhạc kết)",
        "en": "(Outro)"
      }
    ],
    "englishTranslation": [
      "(Instrumental)",
      "Two pretty fins, the goldfish swims in the fish tank.",
      "Floating up and diving down, the goldfish dances happily.",
      "The goldfish catches mosquito larvae to keep the water clean and clear.",
      "Two pretty fins, the goldfish swims in the fish tank.",
      "Floating up and diving down, the goldfish dances happily.",
      "The goldfish catches mosquito larvae to keep the water clean and clear.",
      "(Instrumental)",
      "Two pretty fins, the goldfish swims in the fish tank.",
      "Floating up and diving down, the goldfish dances happily.",
      "The goldfish catches mosquito larvae to keep the water clean and clear.",
      "Two pretty fins, the goldfish swims in the fish tank.",
      "Floating up and diving down, the goldfish dances happily.",
      "The goldfish catches mosquito larvae to keep the water clean and clear.",
      "Two pretty fins, the goldfish swims in the fish tank.",
      "Floating up and diving down, the goldfish dances happily.",
      "The goldfish catches mosquito larvae to keep the water clean and clear.",
      "(Outro)"
    ],
    "funFactVi": "Đàn cá vàng tung tăng bơi lội bắt bọ gậy giữ sạch nước.",
    "audioUrl": "./assets/music/ca-vang-boi.mp3",
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
    "cover": "./assets/music/covers/music_cover_ca-vang-boi.webp",
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
      "Kìa con bướm vàng, kìa con bướm vàng.",
      "Xòe đôi cánh, xòe đôi cánh.",
      "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng.",
      "Em ngồi xem, em ngồi xem.",
      "Good bye teacher, good bye teacher.",
      "See you again, see you again.",
      "And see you tomorrow, and see you tomorrow.",
      "Bye, good bye! Bye, good bye!",
      "Kìa con bướm vàng, kìa con bướm vàng.",
      "Xòe đôi cánh, xòe đôi cánh.",
      "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng.",
      "Em ngồi xem, em ngồi xem.",
      "Good bye teacher, good bye teacher.",
      "See you again, see you again.",
      "And see you tomorrow, and see you tomorrow.",
      "Bye, good bye! Bye, good bye!",
      "Kìa con bướm vàng, kìa con bướm vàng.",
      "Xòe đôi cánh, xòe đôi cánh.",
      "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng.",
      "Em ngồi xem, em ngồi xem.",
      "Good bye teacher, good bye teacher.",
      "See you again, see you again.",
      "And see you tomorrow, and see you tomorrow.",
      "Bye, good bye! Bye, good bye!"
    ],
    "lyricsData": [
      {
        "start": 10.95,
        "end": 15.1,
        "vi": "Kìa con bướm vàng, kìa con bướm vàng.",
        "en": "Look at the yellow butterfly, look at the yellow butterfly."
      },
      {
        "start": 14.95,
        "end": 18.1,
        "vi": "Xòe đôi cánh, xòe đôi cánh.",
        "en": "Spread your wings, spread your wings."
      },
      {
        "start": 17.95,
        "end": 21.9,
        "vi": "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng.",
        "en": "Butterfly flies two or three rounds, butterfly flies two or three rounds."
      },
      {
        "start": 21.75,
        "end": 25.9,
        "vi": "Em ngồi xem, em ngồi xem.",
        "en": "I sit and watch, I sit and watch."
      },
      {
        "start": 26.35,
        "end": 30.2,
        "vi": "Good bye teacher, good bye teacher.",
        "en": "Tạm biệt cô giáo, tạm biệt cô giáo."
      },
      {
        "start": 30.35,
        "end": 33.8,
        "vi": "See you again, see you again.",
        "en": "Hẹn gặp lại cô, hẹn gặp lại cô."
      },
      {
        "start": 33.65,
        "end": 37.4,
        "vi": "And see you tomorrow, and see you tomorrow.",
        "en": "Và hẹn gặp lại cô vào ngày mai."
      },
      {
        "start": 37.25,
        "end": 41.7,
        "vi": "Bye, good bye! Bye, good bye!",
        "en": "Tạm biệt, tạm biệt cô nhé!"
      },
      {
        "start": 42.05,
        "end": 46.2,
        "vi": "Kìa con bướm vàng, kìa con bướm vàng.",
        "en": "Look at the yellow butterfly, look at the yellow butterfly."
      },
      {
        "start": 46.05,
        "end": 49.1,
        "vi": "Xòe đôi cánh, xòe đôi cánh.",
        "en": "Spread your wings, spread your wings."
      },
      {
        "start": 48.95,
        "end": 53.0,
        "vi": "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng.",
        "en": "Butterfly flies two or three rounds, butterfly flies two or three rounds."
      },
      {
        "start": 52.85,
        "end": 57.1,
        "vi": "Em ngồi xem, em ngồi xem.",
        "en": "I sit and watch, I sit and watch."
      },
      {
        "start": 65.85,
        "end": 69.9,
        "vi": "Good bye teacher, good bye teacher.",
        "en": "Tạm biệt cô giáo, tạm biệt cô giáo."
      },
      {
        "start": 69.85,
        "end": 73.3,
        "vi": "See you again, see you again.",
        "en": "Hẹn gặp lại cô, hẹn gặp lại cô."
      },
      {
        "start": 73.15,
        "end": 77.0,
        "vi": "And see you tomorrow, and see you tomorrow.",
        "en": "Và hẹn gặp lại cô vào ngày mai."
      },
      {
        "start": 76.85,
        "end": 81.1,
        "vi": "Bye, good bye! Bye, good bye!",
        "en": "Tạm biệt, tạm biệt cô nhé!"
      },
      {
        "start": 81.25,
        "end": 85.6,
        "vi": "Kìa con bướm vàng, kìa con bướm vàng.",
        "en": "Look at the yellow butterfly, look at the yellow butterfly."
      },
      {
        "start": 85.45,
        "end": 88.4,
        "vi": "Xòe đôi cánh, xòe đôi cánh.",
        "en": "Spread your wings, spread your wings."
      },
      {
        "start": 88.25,
        "end": 92.4,
        "vi": "Bướm bướm bay hai ba vòng, bướm bướm bay hai ba vòng.",
        "en": "Butterfly flies two or three rounds, butterfly flies two or three rounds."
      },
      {
        "start": 92.25,
        "end": 96.5,
        "vi": "Em ngồi xem, em ngồi xem.",
        "en": "I sit and watch, I sit and watch."
      },
      {
        "start": 96.85,
        "end": 100.8,
        "vi": "Good bye teacher, good bye teacher.",
        "en": "Tạm biệt cô giáo, tạm biệt cô giáo."
      },
      {
        "start": 100.65,
        "end": 104.2,
        "vi": "See you again, see you again.",
        "en": "Hẹn gặp lại cô, hẹn gặp lại cô."
      },
      {
        "start": 104.05,
        "end": 107.9,
        "vi": "And see you tomorrow, and see you tomorrow.",
        "en": "Và hẹn gặp lại cô vào ngày mai."
      },
      {
        "start": 107.75,
        "end": 112.4,
        "vi": "Bye, good bye! Bye, good bye!",
        "en": "Tạm biệt, tạm biệt cô nhé!"
      }
    ],
    "englishTranslation": [
      "Look at the yellow butterfly, look at the yellow butterfly.",
      "Spread your wings, spread your wings.",
      "Butterfly flies two or three rounds, butterfly flies two or three rounds.",
      "I sit and watch, I sit and watch.",
      "Tạm biệt cô giáo, tạm biệt cô giáo.",
      "Hẹn gặp lại cô, hẹn gặp lại cô.",
      "Và hẹn gặp lại cô vào ngày mai.",
      "Tạm biệt, tạm biệt cô nhé!",
      "Look at the yellow butterfly, look at the yellow butterfly.",
      "Spread your wings, spread your wings.",
      "Butterfly flies two or three rounds, butterfly flies two or three rounds.",
      "I sit and watch, I sit and watch.",
      "Tạm biệt cô giáo, tạm biệt cô giáo.",
      "Hẹn gặp lại cô, hẹn gặp lại cô.",
      "Và hẹn gặp lại cô vào ngày mai.",
      "Tạm biệt, tạm biệt cô nhé!",
      "Look at the yellow butterfly, look at the yellow butterfly.",
      "Spread your wings, spread your wings.",
      "Butterfly flies two or three rounds, butterfly flies two or three rounds.",
      "I sit and watch, I sit and watch.",
      "Tạm biệt cô giáo, tạm biệt cô giáo.",
      "Hẹn gặp lại cô, hẹn gặp lại cô.",
      "Và hẹn gặp lại cô vào ngày mai.",
      "Tạm biệt, tạm biệt cô nhé!"
    ],
    "funFactVi": "Đôi bướm vàng rực rỡ chao liệng đón gió xuân rộn ràng.",
    "audioUrl": "./assets/music/kia-con-buom-vang.mp3",
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
    "cover": "./assets/music/covers/music_cover_kia-con-buom-vang.webp",
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
    "audioUrl": "./assets/music/ba-ngon-nen-lung-linh.mp3",
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
    "cover": "./assets/music/covers/music_cover_ba-ngon-nen-lung-linh.webp",
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
      "Bố là thuyền nan cho em vượt sóng",
      "Bố là sông rộng cho thuyền em bơi",
      "Bố! Bố là bờ đê cho em nằm ngủ",
      "Bố! Bố là phi thuyền cho em bay vào không gian",
      "Bố! Bố là bờ đê cho em nằm ngủ",
      "Bố! Bố là phi thuyền cho em bay vào không gian",
      "Bố! Bố là tất cả, bố ơi! Bố ơi!",
      "Bố là tất cả, nhưng lúc bố mệt, bố là bố thôi",
      "Bố là tàu lửa, bố là xe hơi",
      "Bố là con ngựa em cưỡi em chơi",
      "Bố là thuyền nan cho em vượt sóng",
      "Bố là sông rộng cho thuyền em bơi",
      "Bố! Bố là bờ đê cho em nằm ngủ",
      "Bố! Bố là phi thuyền cho em bay vào không gian",
      "Bố! Bố là bờ đê cho em nằm ngủ",
      "Bố! Bố là phi thuyền cho em bay vào không gian",
      "Bố! Bố là tất cả, bố ơi! Bố ơi!",
      "Bố! Bố là tất cả, bố ơi! Bố ơi!",
      "Bố là tất cả, nhưng lúc bố mệt, bố là bố thôi"
    ],
    "lyricsData": [
      {
        "start": 22.55,
        "end": 26.5,
        "vi": "Bố là tàu lửa, bố là xe hơi",
        "en": "Dad is a train, dad is a car"
      },
      {
        "start": 26.35,
        "end": 30.3,
        "vi": "Bố là con ngựa em cưỡi em chơi",
        "en": "Dad is a horse for me to ride and play"
      },
      {
        "start": 30.15,
        "end": 34.2,
        "vi": "Bố là thuyền nan cho em vượt sóng",
        "en": "Dad is a wooden boat for me to ride the waves"
      },
      {
        "start": 34.05,
        "end": 38.8,
        "vi": "Bố là sông rộng cho thuyền em bơi",
        "en": "Dad is a wide river for my boat to float"
      },
      {
        "start": 38.65,
        "end": 44.6,
        "vi": "Bố! Bố là bờ đê cho em nằm ngủ",
        "en": "Dad! Dad is an embankment for me to lie and sleep"
      },
      {
        "start": 44.45,
        "end": 51.3,
        "vi": "Bố! Bố là phi thuyền cho em bay vào không gian",
        "en": "Dad! Dad is a spaceship for me to fly into outer space"
      },
      {
        "start": 51.15,
        "end": 57.1,
        "vi": "Bố! Bố là bờ đê cho em nằm ngủ",
        "en": "Dad! Dad is an embankment for me to lie and sleep"
      },
      {
        "start": 56.95,
        "end": 64.5,
        "vi": "Bố! Bố là phi thuyền cho em bay vào không gian",
        "en": "Dad! Dad is a spaceship for me to fly into outer space"
      },
      {
        "start": 64.35,
        "end": 72.1,
        "vi": "Bố! Bố là tất cả, bố ơi! Bố ơi!",
        "en": "Dad! Dad is everything, oh daddy! Oh daddy!"
      },
      {
        "start": 71.95,
        "end": 81.0,
        "vi": "Bố là tất cả, nhưng lúc bố mệt, bố là bố thôi",
        "en": "Dad is everything, but when dad is tired, dad is just dad"
      },
      {
        "start": 102.15,
        "end": 106.3,
        "vi": "Bố là tàu lửa, bố là xe hơi",
        "en": "Dad is a train, dad is a car"
      },
      {
        "start": 106.15,
        "end": 109.8,
        "vi": "Bố là con ngựa em cưỡi em chơi",
        "en": "Dad is a horse for me to ride and play"
      },
      {
        "start": 109.65,
        "end": 113.7,
        "vi": "Bố là thuyền nan cho em vượt sóng",
        "en": "Dad is a wooden boat for me to ride the waves"
      },
      {
        "start": 113.55,
        "end": 118.3,
        "vi": "Bố là sông rộng cho thuyền em bơi",
        "en": "Dad is a wide river for my boat to float"
      },
      {
        "start": 118.15,
        "end": 124.3,
        "vi": "Bố! Bố là bờ đê cho em nằm ngủ",
        "en": "Dad! Dad is an embankment for me to lie and sleep"
      },
      {
        "start": 124.15,
        "end": 131.0,
        "vi": "Bố! Bố là phi thuyền cho em bay vào không gian",
        "en": "Dad! Dad is a spaceship for me to fly into outer space"
      },
      {
        "start": 130.85,
        "end": 136.8,
        "vi": "Bố! Bố là bờ đê cho em nằm ngủ",
        "en": "Dad! Dad is an embankment for me to lie and sleep"
      },
      {
        "start": 136.65,
        "end": 144.3,
        "vi": "Bố! Bố là phi thuyền cho em bay vào không gian",
        "en": "Dad! Dad is a spaceship for me to fly into outer space"
      },
      {
        "start": 144.15,
        "end": 151.9,
        "vi": "Bố! Bố là tất cả, bố ơi! Bố ơi!",
        "en": "Dad! Dad is everything, oh daddy! Oh daddy!"
      },
      {
        "start": 151.75,
        "end": 160.8,
        "vi": "Bố! Bố là tất cả, bố ơi! Bố ơi!",
        "en": "Dad! Dad is everything, oh daddy! Oh daddy!"
      },
      {
        "start": 160.65,
        "end": 178.4,
        "vi": "Bố là tất cả, nhưng lúc bố mệt, bố là bố thôi",
        "en": "Dad is everything, but when dad is tired, dad is just dad"
      }
    ],
    "englishTranslation": [
      "Dad is a train, dad is a car",
      "Dad is a horse for me to ride and play",
      "Dad is a wooden boat for me to ride the waves",
      "Dad is a wide river for my boat to float",
      "Dad! Dad is an embankment for me to lie and sleep",
      "Dad! Dad is a spaceship for me to fly into outer space",
      "Dad! Dad is an embankment for me to lie and sleep",
      "Dad! Dad is a spaceship for me to fly into outer space",
      "Dad! Dad is everything, oh daddy! Oh daddy!",
      "Dad is everything, but when dad is tired, dad is just dad",
      "Dad is a train, dad is a car",
      "Dad is a horse for me to ride and play",
      "Dad is a wooden boat for me to ride the waves",
      "Dad is a wide river for my boat to float",
      "Dad! Dad is an embankment for me to lie and sleep",
      "Dad! Dad is a spaceship for me to fly into outer space",
      "Dad! Dad is an embankment for me to lie and sleep",
      "Dad! Dad is a spaceship for me to fly into outer space",
      "Dad! Dad is everything, oh daddy! Oh daddy!",
      "Dad! Dad is everything, oh daddy! Oh daddy!",
      "Dad is everything, but when dad is tired, dad is just dad"
    ],
    "funFactVi": "Người cha luôn là điểm tựa chở che vững chãi cho con.",
    "audioUrl": "./assets/music/bo-la-tat-ca.mp3",
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
    "cover": "./assets/music/covers/music_cover_bo-la-tat-ca.webp",
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
      "Lúc ở nhà mẹ cũng là cô giáo.",
      "Khi đến trường cô giáo như mẹ hiền.",
      "Cô và mẹ là hai cô giáo.",
      "Mẹ và cô là hai mẹ hiền.",
      "Lúc ở nhà mẹ cũng là cô giáo.",
      "Khi đến trường cô giáo như mẹ hiền.",
      "Cô và mẹ là hai cô giáo.",
      "Mẹ và cô là hai mẹ hiền."
    ],
    "lyricsData": [
      {
        "start": 14.15,
        "end": 23.5,
        "vi": "Lúc ở nhà mẹ cũng là cô giáo.",
        "en": "When at home, mother is also a teacher."
      },
      {
        "start": 23.35,
        "end": 32.4,
        "vi": "Khi đến trường cô giáo như mẹ hiền.",
        "en": "When going to school, the teacher is like a gentle mother."
      },
      {
        "start": 32.25,
        "end": 41.1,
        "vi": "Cô và mẹ là hai cô giáo.",
        "en": "Teacher and mother are two teachers."
      },
      {
        "start": 40.95,
        "end": 50.0,
        "vi": "Mẹ và cô là hai mẹ hiền.",
        "en": "Mother and teacher are two gentle mothers."
      },
      {
        "start": 59.95,
        "end": 68.9,
        "vi": "Lúc ở nhà mẹ cũng là cô giáo.",
        "en": "When at home, mother is also a teacher."
      },
      {
        "start": 68.75,
        "end": 78.0,
        "vi": "Khi đến trường cô giáo như mẹ hiền.",
        "en": "When going to school, the teacher is like a gentle mother."
      },
      {
        "start": 77.85,
        "end": 86.7,
        "vi": "Cô và mẹ là hai cô giáo.",
        "en": "Teacher and mother are two teachers."
      },
      {
        "start": 86.55,
        "end": 96.5,
        "vi": "Mẹ và cô là hai mẹ hiền.",
        "en": "Mother and teacher are two gentle mothers."
      }
    ],
    "englishTranslation": [
      "When at home, mother is also a teacher.",
      "When going to school, the teacher is like a gentle mother.",
      "Teacher and mother are two teachers.",
      "Mother and teacher are two gentle mothers.",
      "When at home, mother is also a teacher.",
      "When going to school, the teacher is like a gentle mother.",
      "Teacher and mother are two teachers.",
      "Mother and teacher are two gentle mothers."
    ],
    "funFactVi": "Cô giáo và người mẹ là hai vầng sáng dịu hiền bên con.",
    "audioUrl": "./assets/music/co-va-me.mp3",
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
    "cover": "./assets/music/covers/music_cover_co-va-me.webp",
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
      "Mẹ mua cho em con heo đất, mẹ mua cho em con heo đất, í à í a.",
      "Ngày hôm nay em vui lắm, cầm heo trên tay em ngắm, í à í a.",
      "Làm sao cho heo mau lớn, làm sao cho heo mau lớn, í à í a.",
      "Heo không đòi ăn cơm, heo không đòi ăn cá, heo chỉ cần em bế trên tay ầu ơ.",
      "Em không thèm mua kem, em không thèm mua bánh, em để dành cho heo.",
      "Em lì xì heo đất hai trăm mỗi ngày.",
      "Này heo ơi, ngoan nhé, í à.",
      "Này heo con ơi, mau lớn, í a í à, í a í à.",
      "Mẹ mua cho em con heo đất, mẹ mua cho em con heo đất, í à í a.",
      "Ngày hôm nay em vui lắm, cầm heo trên tay em ngắm, í à í a.",
      "Làm sao cho heo mau lớn, làm sao cho heo mau lớn, í à í a.",
      "Heo không đòi ăn cơm, heo không đòi ăn cá, heo chỉ cần em bế trên tay ầu ơ.",
      "Em không thèm mua kem, em không thèm mua bánh, em để dành cho heo.",
      "Em lì xì heo đất hai trăm mỗi ngày. Í à í a!"
    ],
    "lyricsData": [
      {
        "start": 18.75,
        "end": 25.4,
        "vi": "Mẹ mua cho em con heo đất, mẹ mua cho em con heo đất, í à í a.",
        "en": "Mother buys me a piggy bank, mother buys me a piggy bank, ee-ah ee-ah."
      },
      {
        "start": 25.25,
        "end": 31.9,
        "vi": "Ngày hôm nay em vui lắm, cầm heo trên tay em ngắm, í à í a.",
        "en": "Today I am so happy, holding the piggy bank in my hands and admiring it, ee-ah ee-ah."
      },
      {
        "start": 31.75,
        "end": 38.2,
        "vi": "Làm sao cho heo mau lớn, làm sao cho heo mau lớn, í à í a.",
        "en": "How can the pig grow up quickly, how can the pig grow up quickly, ee-ah ee-ah."
      },
      {
        "start": 42.35,
        "end": 50.5,
        "vi": "Heo không đòi ăn cơm, heo không đòi ăn cá, heo chỉ cần em bế trên tay ầu ơ.",
        "en": "The pig does not ask for rice, does not ask for fish, it only needs me to cradle it in my arms."
      },
      {
        "start": 50.35,
        "end": 56.9,
        "vi": "Em không thèm mua kem, em không thèm mua bánh, em để dành cho heo.",
        "en": "I do not crave ice cream, I do not crave cake, I save up for the pig."
      },
      {
        "start": 56.75,
        "end": 64.4,
        "vi": "Em lì xì heo đất hai trăm mỗi ngày.",
        "en": "I gift the piggy bank two hundred every day."
      },
      {
        "start": 64.25,
        "end": 70.9,
        "vi": "Này heo ơi, ngoan nhé, í à.",
        "en": "Hey little pig, be good, ee-ah."
      },
      {
        "start": 70.75,
        "end": 77.3,
        "vi": "Này heo con ơi, mau lớn, í a í à, í a í à.",
        "en": "Hey little piglet, grow up fast, ee-ah ee-ah."
      },
      {
        "start": 86.15,
        "end": 92.8,
        "vi": "Mẹ mua cho em con heo đất, mẹ mua cho em con heo đất, í à í a.",
        "en": "Mother buys me a piggy bank, mother buys me a piggy bank, ee-ah ee-ah."
      },
      {
        "start": 92.65,
        "end": 98.9,
        "vi": "Ngày hôm nay em vui lắm, cầm heo trên tay em ngắm, í à í a.",
        "en": "Today I am so happy, holding the piggy bank in my hands and admiring it, ee-ah ee-ah."
      },
      {
        "start": 98.75,
        "end": 105.6,
        "vi": "Làm sao cho heo mau lớn, làm sao cho heo mau lớn, í à í a.",
        "en": "How can the pig grow up quickly, how can the pig grow up quickly, ee-ah ee-ah."
      },
      {
        "start": 109.35,
        "end": 117.4,
        "vi": "Heo không đòi ăn cơm, heo không đòi ăn cá, heo chỉ cần em bế trên tay ầu ơ.",
        "en": "The pig does not ask for rice, does not ask for fish, it only needs me to cradle it in my arms."
      },
      {
        "start": 117.25,
        "end": 124.1,
        "vi": "Em không thèm mua kem, em không thèm mua bánh, em để dành cho heo.",
        "en": "I do not crave ice cream, I do not crave cake, I save up for the pig."
      },
      {
        "start": 123.95,
        "end": 131.7,
        "vi": "Em lì xì heo đất hai trăm mỗi ngày. Í à í a!",
        "en": "I gift the piggy bank two hundred every day. Ee-ah ee-ah!"
      }
    ],
    "englishTranslation": [
      "Mother buys me a piggy bank, mother buys me a piggy bank, ee-ah ee-ah.",
      "Today I am so happy, holding the piggy bank in my hands and admiring it, ee-ah ee-ah.",
      "How can the pig grow up quickly, how can the pig grow up quickly, ee-ah ee-ah.",
      "The pig does not ask for rice, does not ask for fish, it only needs me to cradle it in my arms.",
      "I do not crave ice cream, I do not crave cake, I save up for the pig.",
      "I gift the piggy bank two hundred every day.",
      "Hey little pig, be good, ee-ah.",
      "Hey little piglet, grow up fast, ee-ah ee-ah.",
      "Mother buys me a piggy bank, mother buys me a piggy bank, ee-ah ee-ah.",
      "Today I am so happy, holding the piggy bank in my hands and admiring it, ee-ah ee-ah.",
      "How can the pig grow up quickly, how can the pig grow up quickly, ee-ah ee-ah.",
      "The pig does not ask for rice, does not ask for fish, it only needs me to cradle it in my arms.",
      "I do not crave ice cream, I do not crave cake, I save up for the pig.",
      "I gift the piggy bank two hundred every day. Ee-ah ee-ah!"
    ],
    "funFactVi": "Thói quen tiết kiệm tiền lẻ nuôi heo đất giúp bé tự lập.",
    "audioUrl": "./assets/music/con-heo-dat.mp3",
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
    "cover": "./assets/music/covers/music_cover_con-heo-dat.webp",
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
      "Kìa chú là chú ếch con, có hai là hai mắt tròn.",
      "Chú ngồi học bài một mình bên hố bom kề vườn xoan.",
      "Bao cô cá trê non cùng bao chú cá rô ron.",
      "Tung tăng chiếc vây son, nhịp theo tiếng ếch vang giòn.",
      "Kìa chú là chú ếch con, bé ngoan là ngoan nhất nhà.",
      "Chú học thuộc bài xong rồi chú hát thi cùng họa mi.",
      "Bao nhiêu chú chim ri cùng bao cô cá rô phi.",
      "Nghe tiếng hát mê ly cùng vui thích chí cười khì.",
      "Kìa chú là chú ếch con, có hai là hai mắt tròn.",
      "Chú ngồi học bài một mình bên hố bom kề vườn xoan.",
      "Bao cô cá trê non cùng bao chú cá rô ron.",
      "Tung tăng chiếc vây son, nhịp theo tiếng ếch vang giòn.",
      "Kìa chú là chú ếch con, bé ngoan là ngoan nhất nhà.",
      "Chú học thuộc bài xong rồi chú hát thi cùng họa mi.",
      "Bao nhiêu chú chim ri cùng bao cô cá rô phi.",
      "Nghe tiếng hát mê ly cùng vui thích chí cười khì.",
      "Kìa chú là chú ếch con, có hai là hai mắt tròn.",
      "Chú ngồi học bài một mình bên hố bom kề vườn xoan.",
      "Bao cô cá trê non cùng bao chú cá rô ron.",
      "Tung tăng chiếc vây son, nhịp theo tiếng ếch vang giòn.",
      "Kìa chú là chú ếch con, bé ngoan là ngoan nhất nhà.",
      "Chú học thuộc bài xong rồi chú hát thi cùng họa mi.",
      "Bao nhiêu chú chim ri cùng bao cô cá rô phi.",
      "Nghe tiếng hát mê ly cùng vui thích chí cười khì.",
      "Kìa chú là chú ếch con, có hai là hai mắt tròn.",
      "Chú ngồi học bài một mình bên hố bom kề vườn xoan.",
      "Bao cô cá trê non cùng bao chú cá rô ron.",
      "Tung tăng chiếc vây son, nhịp theo tiếng ếch vang giòn.",
      "Kìa chú là chú ếch con, bé ngoan là ngoan nhất nhà.",
      "Chú học thuộc bài xong rồi chú hát thi cùng họa mi.",
      "Bao nhiêu chú chim ri cùng bao cô cá rô phi.",
      "Nghe tiếng hát mê ly cùng vui thích chí cười khì.",
      "Nghe tiếng hát mê ly cùng vui thích chí cười khì."
    ],
    "lyricsData": [
      {
        "start": 16.65,
        "end": 20.9,
        "vi": "Kìa chú là chú ếch con, có hai là hai mắt tròn.",
        "en": "Look at the little frog, with two round eyes."
      },
      {
        "start": 20.75,
        "end": 25.5,
        "vi": "Chú ngồi học bài một mình bên hố bom kề vườn xoan.",
        "en": "He sits studying alone beside the bomb crater near the chinaberry garden."
      },
      {
        "start": 25.35,
        "end": 29.8,
        "vi": "Bao cô cá trê non cùng bao chú cá rô ron.",
        "en": "Young catfish and little climbing perch."
      },
      {
        "start": 29.65,
        "end": 34.4,
        "vi": "Tung tăng chiếc vây son, nhịp theo tiếng ếch vang giòn.",
        "en": "Playfully flutter red fins, swaying to the frog's bright crisp rhythm."
      },
      {
        "start": 34.25,
        "end": 38.8,
        "vi": "Kìa chú là chú ếch con, bé ngoan là ngoan nhất nhà.",
        "en": "Look at the little frog, the best-behaved child in the family."
      },
      {
        "start": 38.65,
        "end": 43.3,
        "vi": "Chú học thuộc bài xong rồi chú hát thi cùng họa mi.",
        "en": "After finishing his lessons, he sings in contest with the nightingale."
      },
      {
        "start": 43.15,
        "end": 47.7,
        "vi": "Bao nhiêu chú chim ri cùng bao cô cá rô phi.",
        "en": "Many little finches together with tilapia fish."
      },
      {
        "start": 47.55,
        "end": 52.4,
        "vi": "Nghe tiếng hát mê ly cùng vui thích chí cười khì.",
        "en": "Listening to the enchanting singing, joyfully laughing together."
      },
      {
        "start": 56.05,
        "end": 60.3,
        "vi": "Kìa chú là chú ếch con, có hai là hai mắt tròn.",
        "en": "Look at the little frog, with two round eyes."
      },
      {
        "start": 60.15,
        "end": 64.7,
        "vi": "Chú ngồi học bài một mình bên hố bom kề vườn xoan.",
        "en": "He sits studying alone beside the bomb crater near the chinaberry garden."
      },
      {
        "start": 64.55,
        "end": 69.1,
        "vi": "Bao cô cá trê non cùng bao chú cá rô ron.",
        "en": "Young catfish and little climbing perch."
      },
      {
        "start": 68.95,
        "end": 73.6,
        "vi": "Tung tăng chiếc vây son, nhịp theo tiếng ếch vang giòn.",
        "en": "Playfully flutter red fins, swaying to the frog's bright crisp rhythm."
      },
      {
        "start": 73.45,
        "end": 78.0,
        "vi": "Kìa chú là chú ếch con, bé ngoan là ngoan nhất nhà.",
        "en": "Look at the little frog, the best-behaved child in the family."
      },
      {
        "start": 77.85,
        "end": 82.5,
        "vi": "Chú học thuộc bài xong rồi chú hát thi cùng họa mi.",
        "en": "After finishing his lessons, he sings in contest with the nightingale."
      },
      {
        "start": 82.35,
        "end": 86.9,
        "vi": "Bao nhiêu chú chim ri cùng bao cô cá rô phi.",
        "en": "Many little finches together with tilapia fish."
      },
      {
        "start": 86.75,
        "end": 91.5,
        "vi": "Nghe tiếng hát mê ly cùng vui thích chí cười khì.",
        "en": "Listening to the enchanting singing, joyfully laughing together."
      },
      {
        "start": 110.55,
        "end": 114.8,
        "vi": "Kìa chú là chú ếch con, có hai là hai mắt tròn.",
        "en": "Look at the little frog, with two round eyes."
      },
      {
        "start": 114.65,
        "end": 119.3,
        "vi": "Chú ngồi học bài một mình bên hố bom kề vườn xoan.",
        "en": "He sits studying alone beside the bomb crater near the chinaberry garden."
      },
      {
        "start": 119.15,
        "end": 123.6,
        "vi": "Bao cô cá trê non cùng bao chú cá rô ron.",
        "en": "Young catfish and little climbing perch."
      },
      {
        "start": 123.45,
        "end": 128.2,
        "vi": "Tung tăng chiếc vây son, nhịp theo tiếng ếch vang giòn.",
        "en": "Playfully flutter red fins, swaying to the frog's bright crisp rhythm."
      },
      {
        "start": 128.05,
        "end": 132.6,
        "vi": "Kìa chú là chú ếch con, bé ngoan là ngoan nhất nhà.",
        "en": "Look at the little frog, the best-behaved child in the family."
      },
      {
        "start": 132.45,
        "end": 137.0,
        "vi": "Chú học thuộc bài xong rồi chú hát thi cùng họa mi.",
        "en": "After finishing his lessons, he sings in contest with the nightingale."
      },
      {
        "start": 136.85,
        "end": 141.5,
        "vi": "Bao nhiêu chú chim ri cùng bao cô cá rô phi.",
        "en": "Many little finches together with tilapia fish."
      },
      {
        "start": 141.35,
        "end": 146.0,
        "vi": "Nghe tiếng hát mê ly cùng vui thích chí cười khì.",
        "en": "Listening to the enchanting singing, joyfully laughing together."
      },
      {
        "start": 149.95,
        "end": 154.2,
        "vi": "Kìa chú là chú ếch con, có hai là hai mắt tròn.",
        "en": "Look at the little frog, with two round eyes."
      },
      {
        "start": 154.05,
        "end": 158.7,
        "vi": "Chú ngồi học bài một mình bên hố bom kề vườn xoan.",
        "en": "He sits studying alone beside the bomb crater near the chinaberry garden."
      },
      {
        "start": 158.55,
        "end": 163.0,
        "vi": "Bao cô cá trê non cùng bao chú cá rô ron.",
        "en": "Young catfish and little climbing perch."
      },
      {
        "start": 162.85,
        "end": 167.6,
        "vi": "Tung tăng chiếc vây son, nhịp theo tiếng ếch vang giòn.",
        "en": "Playfully flutter red fins, swaying to the frog's bright crisp rhythm."
      },
      {
        "start": 167.45,
        "end": 172.0,
        "vi": "Kìa chú là chú ếch con, bé ngoan là ngoan nhất nhà.",
        "en": "Look at the little frog, the best-behaved child in the family."
      },
      {
        "start": 171.85,
        "end": 176.5,
        "vi": "Chú học thuộc bài xong rồi chú hát thi cùng họa mi.",
        "en": "After finishing his lessons, he sings in contest with the nightingale."
      },
      {
        "start": 176.35,
        "end": 180.9,
        "vi": "Bao nhiêu chú chim ri cùng bao cô cá rô phi.",
        "en": "Many little finches together with tilapia fish."
      },
      {
        "start": 180.75,
        "end": 185.4,
        "vi": "Nghe tiếng hát mê ly cùng vui thích chí cười khì.",
        "en": "Listening to the enchanting singing, joyfully laughing together."
      },
      {
        "start": 185.25,
        "end": 189.9,
        "vi": "Nghe tiếng hát mê ly cùng vui thích chí cười khì.",
        "en": "Listening to the enchanting singing, joyfully laughing together."
      }
    ],
    "englishTranslation": [
      "Look at the little frog, with two round eyes.",
      "He sits studying alone beside the bomb crater near the chinaberry garden.",
      "Young catfish and little climbing perch.",
      "Playfully flutter red fins, swaying to the frog's bright crisp rhythm.",
      "Look at the little frog, the best-behaved child in the family.",
      "After finishing his lessons, he sings in contest with the nightingale.",
      "Many little finches together with tilapia fish.",
      "Listening to the enchanting singing, joyfully laughing together.",
      "Look at the little frog, with two round eyes.",
      "He sits studying alone beside the bomb crater near the chinaberry garden.",
      "Young catfish and little climbing perch.",
      "Playfully flutter red fins, swaying to the frog's bright crisp rhythm.",
      "Look at the little frog, the best-behaved child in the family.",
      "After finishing his lessons, he sings in contest with the nightingale.",
      "Many little finches together with tilapia fish.",
      "Listening to the enchanting singing, joyfully laughing together.",
      "Look at the little frog, with two round eyes.",
      "He sits studying alone beside the bomb crater near the chinaberry garden.",
      "Young catfish and little climbing perch.",
      "Playfully flutter red fins, swaying to the frog's bright crisp rhythm.",
      "Look at the little frog, the best-behaved child in the family.",
      "After finishing his lessons, he sings in contest with the nightingale.",
      "Many little finches together with tilapia fish.",
      "Listening to the enchanting singing, joyfully laughing together.",
      "Look at the little frog, with two round eyes.",
      "He sits studying alone beside the bomb crater near the chinaberry garden.",
      "Young catfish and little climbing perch.",
      "Playfully flutter red fins, swaying to the frog's bright crisp rhythm.",
      "Look at the little frog, the best-behaved child in the family.",
      "After finishing his lessons, he sings in contest with the nightingale.",
      "Many little finches together with tilapia fish.",
      "Listening to the enchanting singing, joyfully laughing together.",
      "Listening to the enchanting singing, joyfully laughing together."
    ],
    "funFactVi": "Chú ếch con chăm ngoan ngồi học bài bên bờ ao xanh.",
    "audioUrl": "./assets/music/chu-ech-con.mp3",
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
    "cover": "./assets/music/covers/music_cover_chu-ech-con.webp",
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
      "(Nhạc dạo)",
      "Trông kìa đàn gà con lông vàng.",
      "Đi theo mẹ tìm ăn trong vườn.",
      "Cùng tìm mồi ăn ngon ngon.",
      "Đàn gà con đi lon ton.",
      "Thóc vãi rồi nhặt ăn cho nhiều.",
      "Uống nước vào là no căng diều.",
      "Rồi cùng nhau ta đi chơi.",
      "Đàn gà con xinh kia ơi!",
      "(Nhạc dạo)",
      "Trông kìa đàn gà con lông vàng.",
      "Đi theo mẹ tìm ăn trong vườn.",
      "Cùng tìm mồi ăn ngon ngon.",
      "Đàn gà con đi lon ton.",
      "Thóc vãi rồi nhặt ăn cho nhiều.",
      "Uống nước vào là no căng diều.",
      "Rồi cùng nhau ta đi chơi.",
      "Đàn gà con xinh kia ơi!",
      "(Nhạc dạo)",
      "Trông kìa đàn gà con lông vàng.",
      "Đi theo mẹ tìm ăn trong vườn.",
      "Cùng tìm mồi ăn ngon ngon.",
      "Đàn gà con đi lon ton.",
      "Thóc vãi rồi nhặt ăn cho nhiều.",
      "Uống nước vào là no căng diều.",
      "(Nhạc kết)"
    ],
    "lyricsData": [
      {
        "start": 44.75,
        "end": 47.3,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 47.75,
        "end": 50.5,
        "vi": "Trông kìa đàn gà con lông vàng.",
        "en": "Look at the flock of golden-feathered chicks."
      },
      {
        "start": 50.95,
        "end": 54.0,
        "vi": "Đi theo mẹ tìm ăn trong vườn.",
        "en": "Following mother hen to find food in the garden."
      },
      {
        "start": 53.95,
        "end": 57.0,
        "vi": "Cùng tìm mồi ăn ngon ngon.",
        "en": "Searching together for tasty food."
      },
      {
        "start": 60.45,
        "end": 63.0,
        "vi": "Đàn gà con đi lon ton.",
        "en": "The little chicks toddle along."
      },
      {
        "start": 63.15,
        "end": 66.0,
        "vi": "Thóc vãi rồi nhặt ăn cho nhiều.",
        "en": "Scattered grain, pick and eat plenty."
      },
      {
        "start": 66.45,
        "end": 69.1,
        "vi": "Uống nước vào là no căng diều.",
        "en": "Drinking water until their crops are full."
      },
      {
        "start": 68.95,
        "end": 72.7,
        "vi": "Rồi cùng nhau ta đi chơi.",
        "en": "Then together we go out to play."
      },
      {
        "start": 78.75,
        "end": 81.4,
        "vi": "Đàn gà con xinh kia ơi!",
        "en": "Oh pretty little chicks!"
      },
      {
        "start": 81.65,
        "end": 84.4,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 84.85,
        "end": 87.7,
        "vi": "Trông kìa đàn gà con lông vàng.",
        "en": "Look at the flock of golden-feathered chicks."
      },
      {
        "start": 87.95,
        "end": 91.7,
        "vi": "Đi theo mẹ tìm ăn trong vườn.",
        "en": "Following mother hen to find food in the garden."
      },
      {
        "start": 139.25,
        "end": 141.8,
        "vi": "Cùng tìm mồi ăn ngon ngon.",
        "en": "Searching together for tasty food."
      },
      {
        "start": 142.15,
        "end": 145.0,
        "vi": "Đàn gà con đi lon ton.",
        "en": "The little chicks toddle along."
      },
      {
        "start": 145.35,
        "end": 148.2,
        "vi": "Thóc vãi rồi nhặt ăn cho nhiều.",
        "en": "Scattered grain, pick and eat plenty."
      },
      {
        "start": 148.35,
        "end": 151.5,
        "vi": "Uống nước vào là no căng diều.",
        "en": "Drinking water until their crops are full."
      },
      {
        "start": 154.75,
        "end": 157.4,
        "vi": "Rồi cùng nhau ta đi chơi.",
        "en": "Then together we go out to play."
      },
      {
        "start": 157.65,
        "end": 160.4,
        "vi": "Đàn gà con xinh kia ơi!",
        "en": "Oh pretty little chicks!"
      },
      {
        "start": 160.85,
        "end": 163.7,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 163.85,
        "end": 167.3,
        "vi": "Trông kìa đàn gà con lông vàng.",
        "en": "Look at the flock of golden-feathered chicks."
      },
      {
        "start": 173.25,
        "end": 175.8,
        "vi": "Đi theo mẹ tìm ăn trong vườn.",
        "en": "Following mother hen to find food in the garden."
      },
      {
        "start": 176.05,
        "end": 179.0,
        "vi": "Cùng tìm mồi ăn ngon ngon.",
        "en": "Searching together for tasty food."
      },
      {
        "start": 179.45,
        "end": 182.4,
        "vi": "Đàn gà con đi lon ton.",
        "en": "The little chicks toddle along."
      },
      {
        "start": 182.25,
        "end": 185.4,
        "vi": "Thóc vãi rồi nhặt ăn cho nhiều.",
        "en": "Scattered grain, pick and eat plenty."
      },
      {
        "start": 185.35,
        "end": 188.3,
        "vi": "Uống nước vào là no căng diều.",
        "en": "Drinking water until their crops are full."
      },
      {
        "start": 188.35,
        "end": 195.5,
        "vi": "(Nhạc kết)",
        "en": "(Outro)"
      }
    ],
    "englishTranslation": [
      "(Instrumental)",
      "Look at the flock of golden-feathered chicks.",
      "Following mother hen to find food in the garden.",
      "Searching together for tasty food.",
      "The little chicks toddle along.",
      "Scattered grain, pick and eat plenty.",
      "Drinking water until their crops are full.",
      "Then together we go out to play.",
      "Oh pretty little chicks!",
      "(Instrumental)",
      "Look at the flock of golden-feathered chicks.",
      "Following mother hen to find food in the garden.",
      "Searching together for tasty food.",
      "The little chicks toddle along.",
      "Scattered grain, pick and eat plenty.",
      "Drinking water until their crops are full.",
      "Then together we go out to play.",
      "Oh pretty little chicks!",
      "(Instrumental)",
      "Look at the flock of golden-feathered chicks.",
      "Following mother hen to find food in the garden.",
      "Searching together for tasty food.",
      "The little chicks toddle along.",
      "Scattered grain, pick and eat plenty.",
      "Drinking water until their crops are full.",
      "(Outro)"
    ],
    "funFactVi": "Đàn gà con lông vàng óng ả theo mẹ kiếm mồi vui vẻ.",
    "audioUrl": "./assets/music/dan-ga-con.mp3",
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
    "cover": "./assets/music/covers/music_cover_dan-ga-con.webp",
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
      "(Nhạc dạo)",
      "Chú voi con ở Bản Đôn, chưa có ngà nên còn trẻ con.",
      "Từ rừng già chú đến với người, vẫn ham ăn với lại ham chơi.",
      "Voi con ơi! Voi con ơi! Mau lớn nhanh có đôi ngà to.",
      "Có sức đi khắp miền rừng xa, kéo gỗ cho buôn làng của ta.",
      "Chú voi con thật là khôn, quen thiếu nhi khắp vùng Bản Đôn.",
      "Đầu gật gù lúc lắc cái vòi, khéo đung đưa theo nhịp chiêng vui.",
      "Voi con ơi! Voi con ơi! Mau lớn nhanh có thân mình to.",
      "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi.",
      "Voi ơi! Voi ơi!",
      "(Nhạc dạo)",
      "Chú voi con ở Bản Đôn, chưa có ngà nên còn trẻ con.",
      "Từ rừng già chú đến với người, vẫn ham ăn với lại ham chơi.",
      "Voi con ơi! Voi con ơi! Mau lớn nhanh có đôi ngà to.",
      "Có sức đi khắp miền rừng xa, kéo gỗ cho buôn làng của ta.",
      "Chú voi con thật là khôn, quen thiếu nhi khắp vùng Bản Đôn.",
      "Đầu gật gù lúc lắc cái vòi, khéo đung đưa theo nhịp chiêng vui.",
      "Voi con ơi! Voi con ơi! Mau lớn nhanh có thân mình to.",
      "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi.",
      "Voi ơi! Voi ơi!",
      "Chú voi con thật là khôn, quen thiếu nhi khắp vùng Bản Đôn.",
      "Đầu gật gù lúc lắc cái vòi, khéo đung đưa theo nhịp chiêng vui.",
      "Voi con ơi! Voi con ơi! Mau lớn nhanh có thân mình to.",
      "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi.",
      "Voi ơi! Voi ơi!"
    ],
    "lyricsData": [
      {
        "start": 37.15,
        "end": 41.5,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 41.35,
        "end": 44.2,
        "vi": "Chú voi con ở Bản Đôn, chưa có ngà nên còn trẻ con.",
        "en": "The little elephant in Ban Don village has no tusks yet, so he is still a child."
      },
      {
        "start": 44.05,
        "end": 47.4,
        "vi": "Từ rừng già chú đến với người, vẫn ham ăn với lại ham chơi.",
        "en": "From the deep forest he comes to live with people, still eager to eat and play."
      },
      {
        "start": 49.65,
        "end": 54.0,
        "vi": "Voi con ơi! Voi con ơi! Mau lớn nhanh có đôi ngà to.",
        "en": "Oh little elephant! Grow up fast to have big tusks."
      },
      {
        "start": 53.85,
        "end": 55.3,
        "vi": "Có sức đi khắp miền rừng xa, kéo gỗ cho buôn làng của ta.",
        "en": "Have the strength to traverse far forests and haul timber for our village."
      },
      {
        "start": 55.15,
        "end": 60.0,
        "vi": "Chú voi con thật là khôn, quen thiếu nhi khắp vùng Bản Đôn.",
        "en": "The little elephant is very clever, familiar with all children across Ban Don."
      },
      {
        "start": 61.65,
        "end": 66.3,
        "vi": "Đầu gật gù lúc lắc cái vòi, khéo đung đưa theo nhịp chiêng vui.",
        "en": "Nodding his head and swinging his trunk, gracefully swaying to the joyful gong beat."
      },
      {
        "start": 66.15,
        "end": 71.8,
        "vi": "Voi con ơi! Voi con ơi! Mau lớn nhanh có thân mình to.",
        "en": "Oh little elephant! Grow up fast to have a large body."
      },
      {
        "start": 74.15,
        "end": 78.9,
        "vi": "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi.",
        "en": "All across the Central Highlands need many elephants to help build beautiful prosperous villages."
      },
      {
        "start": 78.75,
        "end": 84.4,
        "vi": "Voi ơi! Voi ơi!",
        "en": "Oh elephant! Oh elephant!"
      },
      {
        "start": 118.15,
        "end": 122.5,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 122.35,
        "end": 125.3,
        "vi": "Chú voi con ở Bản Đôn, chưa có ngà nên còn trẻ con.",
        "en": "The little elephant in Ban Don village has no tusks yet, so he is still a child."
      },
      {
        "start": 125.15,
        "end": 128.3,
        "vi": "Từ rừng già chú đến với người, vẫn ham ăn với lại ham chơi.",
        "en": "From the deep forest he comes to live with people, still eager to eat and play."
      },
      {
        "start": 130.65,
        "end": 135.1,
        "vi": "Voi con ơi! Voi con ơi! Mau lớn nhanh có đôi ngà to.",
        "en": "Oh little elephant! Grow up fast to have big tusks."
      },
      {
        "start": 134.95,
        "end": 136.3,
        "vi": "Có sức đi khắp miền rừng xa, kéo gỗ cho buôn làng của ta.",
        "en": "Have the strength to traverse far forests and haul timber for our village."
      },
      {
        "start": 136.15,
        "end": 141.0,
        "vi": "Chú voi con thật là khôn, quen thiếu nhi khắp vùng Bản Đôn.",
        "en": "The little elephant is very clever, familiar with all children across Ban Don."
      },
      {
        "start": 142.65,
        "end": 147.4,
        "vi": "Đầu gật gù lúc lắc cái vòi, khéo đung đưa theo nhịp chiêng vui.",
        "en": "Nodding his head and swinging his trunk, gracefully swaying to the joyful gong beat."
      },
      {
        "start": 147.25,
        "end": 152.8,
        "vi": "Voi con ơi! Voi con ơi! Mau lớn nhanh có thân mình to.",
        "en": "Oh little elephant! Grow up fast to have a large body."
      },
      {
        "start": 155.25,
        "end": 159.9,
        "vi": "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi.",
        "en": "All across the Central Highlands need many elephants to help build beautiful prosperous villages."
      },
      {
        "start": 159.75,
        "end": 165.5,
        "vi": "Voi ơi! Voi ơi!",
        "en": "Oh elephant! Oh elephant!"
      },
      {
        "start": 166.65,
        "end": 171.3,
        "vi": "Chú voi con thật là khôn, quen thiếu nhi khắp vùng Bản Đôn.",
        "en": "The little elephant is very clever, familiar with all children across Ban Don."
      },
      {
        "start": 171.15,
        "end": 177.1,
        "vi": "Đầu gật gù lúc lắc cái vòi, khéo đung đưa theo nhịp chiêng vui.",
        "en": "Nodding his head and swinging his trunk, gracefully swaying to the joyful gong beat."
      },
      {
        "start": 178.05,
        "end": 182.8,
        "vi": "Voi con ơi! Voi con ơi! Mau lớn nhanh có thân mình to.",
        "en": "Oh little elephant! Grow up fast to have a large body."
      },
      {
        "start": 182.65,
        "end": 188.5,
        "vi": "Khắp chốn Tây Nguyên cần nhiều voi, góp sức xây buôn làng đẹp tươi.",
        "en": "All across the Central Highlands need many elephants to help build beautiful prosperous villages."
      },
      {
        "start": 189.85,
        "end": 191.8,
        "vi": "Voi ơi! Voi ơi!",
        "en": "Oh elephant! Oh elephant!"
      }
    ],
    "englishTranslation": [
      "(Instrumental)",
      "The little elephant in Ban Don village has no tusks yet, so he is still a child.",
      "From the deep forest he comes to live with people, still eager to eat and play.",
      "Oh little elephant! Grow up fast to have big tusks.",
      "Have the strength to traverse far forests and haul timber for our village.",
      "The little elephant is very clever, familiar with all children across Ban Don.",
      "Nodding his head and swinging his trunk, gracefully swaying to the joyful gong beat.",
      "Oh little elephant! Grow up fast to have a large body.",
      "All across the Central Highlands need many elephants to help build beautiful prosperous villages.",
      "Oh elephant! Oh elephant!",
      "(Instrumental)",
      "The little elephant in Ban Don village has no tusks yet, so he is still a child.",
      "From the deep forest he comes to live with people, still eager to eat and play.",
      "Oh little elephant! Grow up fast to have big tusks.",
      "Have the strength to traverse far forests and haul timber for our village.",
      "The little elephant is very clever, familiar with all children across Ban Don.",
      "Nodding his head and swinging his trunk, gracefully swaying to the joyful gong beat.",
      "Oh little elephant! Grow up fast to have a large body.",
      "All across the Central Highlands need many elephants to help build beautiful prosperous villages.",
      "Oh elephant! Oh elephant!",
      "The little elephant is very clever, familiar with all children across Ban Don.",
      "Nodding his head and swinging his trunk, gracefully swaying to the joyful gong beat.",
      "Oh little elephant! Grow up fast to have a large body.",
      "All across the Central Highlands need many elephants to help build beautiful prosperous villages.",
      "Oh elephant! Oh elephant!"
    ],
    "funFactVi": "Chú voi con Tây Nguyên ngộ nghĩnh, hiền lành được buôn làng yêu quý.",
    "audioUrl": "./assets/music/chu-voi-con-o-ban-don.mp3",
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
    "cover": "./assets/music/covers/music_cover_chu-voi-con-o-ban-don.webp",
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
      "(Nhạc dạo)",
      "Bắc kim thang cà lang bí rợ.",
      "Cột qua kèo là kèo qua cột.",
      "Chú bán dầu qua cầu mà té.",
      "Chú bán ếch ở lại làm chi.",
      "Con le le đánh trống thổi kèn.",
      "Con bìm bịp thổi tò tí te tò te.",
      "Bắc kim thang cà lang bí rợ.",
      "Cột qua kèo là kèo qua cột.",
      "Chú bán dầu qua cầu mà té.",
      "Chú bán ếch ở lại làm chi.",
      "Con le le đánh trống thổi kèn.",
      "Con bìm bịp thổi tò tí te tò te.",
      "Bắc kim thang cà lang bí rợ.",
      "Cột qua kèo là kèo qua cột.",
      "Chú bán dầu qua cầu mà té.",
      "Chú bán ếch ở lại làm chi.",
      "Con le le đánh trống thổi kèn.",
      "Con bìm bịp thổi tò tí te tò te.",
      "Bắc kim thang cà lang bí rợ.",
      "Cột qua kèo là kèo qua cột.",
      "Chú bán dầu qua cầu mà té.",
      "Chú bán ếch ở lại làm chi.",
      "Con le le đánh trống thổi kèn."
    ],
    "lyricsData": [
      {
        "start": 10.35,
        "end": 14.3,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 14.35,
        "end": 18.4,
        "vi": "Bắc kim thang cà lang bí rợ.",
        "en": "Bac kim thang, sweet potato and pumpkin."
      },
      {
        "start": 18.45,
        "end": 22.5,
        "vi": "Cột qua kèo là kèo qua cột.",
        "en": "The post crosses the rafter, rafter crosses the post."
      },
      {
        "start": 22.55,
        "end": 27.1,
        "vi": "Chú bán dầu qua cầu mà té.",
        "en": "The oil vendor crosses the bridge and slips."
      },
      {
        "start": 27.05,
        "end": 31.7,
        "vi": "Chú bán ếch ở lại làm chi.",
        "en": "Why should the frog vendor stay behind."
      },
      {
        "start": 31.65,
        "end": 37.3,
        "vi": "Con le le đánh trống thổi kèn.",
        "en": "The whistling duck beats drums and blows trumpets."
      },
      {
        "start": 37.85,
        "end": 41.8,
        "vi": "Con bìm bịp thổi tò tí te tò te.",
        "en": "The coucal bird plays to-ti-te-to-te."
      },
      {
        "start": 41.75,
        "end": 46.0,
        "vi": "Bắc kim thang cà lang bí rợ.",
        "en": "Bac kim thang, sweet potato and pumpkin."
      },
      {
        "start": 46.05,
        "end": 50.0,
        "vi": "Cột qua kèo là kèo qua cột.",
        "en": "The post crosses the rafter, rafter crosses the post."
      },
      {
        "start": 50.05,
        "end": 54.6,
        "vi": "Chú bán dầu qua cầu mà té.",
        "en": "The oil vendor crosses the bridge and slips."
      },
      {
        "start": 54.55,
        "end": 59.3,
        "vi": "Chú bán ếch ở lại làm chi.",
        "en": "Why should the frog vendor stay behind."
      },
      {
        "start": 59.25,
        "end": 64.4,
        "vi": "Con le le đánh trống thổi kèn.",
        "en": "The whistling duck beats drums and blows trumpets."
      },
      {
        "start": 75.35,
        "end": 79.4,
        "vi": "Con bìm bịp thổi tò tí te tò te.",
        "en": "The coucal bird plays to-ti-te-to-te."
      },
      {
        "start": 79.35,
        "end": 83.6,
        "vi": "Bắc kim thang cà lang bí rợ.",
        "en": "Bac kim thang, sweet potato and pumpkin."
      },
      {
        "start": 83.55,
        "end": 87.7,
        "vi": "Cột qua kèo là kèo qua cột.",
        "en": "The post crosses the rafter, rafter crosses the post."
      },
      {
        "start": 87.75,
        "end": 92.2,
        "vi": "Chú bán dầu qua cầu mà té.",
        "en": "The oil vendor crosses the bridge and slips."
      },
      {
        "start": 92.15,
        "end": 96.9,
        "vi": "Chú bán ếch ở lại làm chi.",
        "en": "Why should the frog vendor stay behind."
      },
      {
        "start": 96.85,
        "end": 102.1,
        "vi": "Con le le đánh trống thổi kèn.",
        "en": "The whistling duck beats drums and blows trumpets."
      },
      {
        "start": 102.65,
        "end": 106.8,
        "vi": "Con bìm bịp thổi tò tí te tò te.",
        "en": "The coucal bird plays to-ti-te-to-te."
      },
      {
        "start": 106.75,
        "end": 111.0,
        "vi": "Bắc kim thang cà lang bí rợ.",
        "en": "Bac kim thang, sweet potato and pumpkin."
      },
      {
        "start": 110.95,
        "end": 115.2,
        "vi": "Cột qua kèo là kèo qua cột.",
        "en": "The post crosses the rafter, rafter crosses the post."
      },
      {
        "start": 115.15,
        "end": 119.7,
        "vi": "Chú bán dầu qua cầu mà té.",
        "en": "The oil vendor crosses the bridge and slips."
      },
      {
        "start": 119.65,
        "end": 124.3,
        "vi": "Chú bán ếch ở lại làm chi.",
        "en": "Why should the frog vendor stay behind."
      },
      {
        "start": 124.25,
        "end": 129.9,
        "vi": "Con le le đánh trống thổi kèn.",
        "en": "The whistling duck beats drums and blows trumpets."
      }
    ],
    "englishTranslation": [
      "(Instrumental)",
      "Bac kim thang, sweet potato and pumpkin.",
      "The post crosses the rafter, rafter crosses the post.",
      "The oil vendor crosses the bridge and slips.",
      "Why should the frog vendor stay behind.",
      "The whistling duck beats drums and blows trumpets.",
      "The coucal bird plays to-ti-te-to-te.",
      "Bac kim thang, sweet potato and pumpkin.",
      "The post crosses the rafter, rafter crosses the post.",
      "The oil vendor crosses the bridge and slips.",
      "Why should the frog vendor stay behind.",
      "The whistling duck beats drums and blows trumpets.",
      "The coucal bird plays to-ti-te-to-te.",
      "Bac kim thang, sweet potato and pumpkin.",
      "The post crosses the rafter, rafter crosses the post.",
      "The oil vendor crosses the bridge and slips.",
      "Why should the frog vendor stay behind.",
      "The whistling duck beats drums and blows trumpets.",
      "The coucal bird plays to-ti-te-to-te.",
      "Bac kim thang, sweet potato and pumpkin.",
      "The post crosses the rafter, rafter crosses the post.",
      "The oil vendor crosses the bridge and slips.",
      "Why should the frog vendor stay behind.",
      "The whistling duck beats drums and blows trumpets."
    ],
    "funFactVi": "Giai điệu dân ca đồng dao Nam Bộ rộn ràng tiếng vỗ tay.",
    "audioUrl": "./assets/music/bac-kim-thang.mp3",
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
    "cover": "./assets/music/covers/music_cover_bac-kim-thang.webp",
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
      "Ngày đầu tiên đi học, mẹ dắt tay đến trường.",
      "Em vừa đi vừa khóc, mẹ dỗ dành bên em.",
      "Ngày đầu tiên đi học, em mắt ướt nhạt nhòa.",
      "Cô vỗ về an ủi, chao ôi sao thiết tha!",
      "Ngày đầu như thế đó, cô giáo như mẹ hiền.",
      "Em bây giờ cứ ngỡ, cô giáo là cô tiên.",
      "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
      "Ngày đầu tiên đi học, mẹ cô cùng vỗ về.",
      "Ngày đầu như thế đó, cô giáo như mẹ hiền.",
      "Em bây giờ cứ ngỡ, cô giáo là cô tiên.",
      "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
      "Ngày đầu tiên đi học, mẹ cô cùng vỗ về.",
      "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
      "Ngày đầu tiên đi học, mẹ cô cùng vỗ về."
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 31.9,
        "vi": "Ngày đầu tiên đi học, mẹ dắt tay đến trường.",
        "en": "On the first day of school, mother led me by hand to school."
      },
      {
        "start": 31.75,
        "end": 43.7,
        "vi": "Em vừa đi vừa khóc, mẹ dỗ dành bên em.",
        "en": "I cried as I walked, mother consoled me by my side."
      },
      {
        "start": 43.55,
        "end": 56.5,
        "vi": "Ngày đầu tiên đi học, em mắt ướt nhạt nhòa.",
        "en": "On the first day of school, my eyes were teary."
      },
      {
        "start": 56.35,
        "end": 69.1,
        "vi": "Cô vỗ về an ủi, chao ôi sao thiết tha!",
        "en": "The teacher comforted me, oh so tenderly!"
      },
      {
        "start": 68.95,
        "end": 84.0,
        "vi": "Ngày đầu như thế đó, cô giáo như mẹ hiền.",
        "en": "The first day was like that, teacher was like a gentle mother."
      },
      {
        "start": 83.85,
        "end": 96.4,
        "vi": "Em bây giờ cứ ngỡ, cô giáo là cô tiên.",
        "en": "Now I always feel as if teacher was a fairy."
      },
      {
        "start": 96.25,
        "end": 109.1,
        "vi": "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
        "en": "Now that I am grown, I still remember the days of old."
      },
      {
        "start": 108.95,
        "end": 121.8,
        "vi": "Ngày đầu tiên đi học, mẹ cô cùng vỗ về.",
        "en": "On the first day of school, mother and teacher comforted me together."
      },
      {
        "start": 121.65,
        "end": 135.0,
        "vi": "Ngày đầu như thế đó, cô giáo như mẹ hiền.",
        "en": "The first day was like that, teacher was like a gentle mother."
      },
      {
        "start": 134.85,
        "end": 166.4,
        "vi": "Em bây giờ cứ ngỡ, cô giáo là cô tiên.",
        "en": "Now I always feel as if teacher was a fairy."
      },
      {
        "start": 166.25,
        "end": 178.8,
        "vi": "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
        "en": "Now that I am grown, I still remember the days of old."
      },
      {
        "start": 178.65,
        "end": 191.7,
        "vi": "Ngày đầu tiên đi học, mẹ cô cùng vỗ về.",
        "en": "On the first day of school, mother and teacher comforted me together."
      },
      {
        "start": 191.55,
        "end": 204.5,
        "vi": "Em bây giờ khôn lớn, vẫn nhớ về ngày xưa.",
        "en": "Now that I am grown, I still remember the days of old."
      },
      {
        "start": 204.35,
        "end": 282.0,
        "vi": "Ngày đầu tiên đi học, mẹ cô cùng vỗ về.",
        "en": "On the first day of school, mother and teacher comforted me together."
      }
    ],
    "englishTranslation": [
      "On the first day of school, mother led me by hand to school.",
      "I cried as I walked, mother consoled me by my side.",
      "On the first day of school, my eyes were teary.",
      "The teacher comforted me, oh so tenderly!",
      "The first day was like that, teacher was like a gentle mother.",
      "Now I always feel as if teacher was a fairy.",
      "Now that I am grown, I still remember the days of old.",
      "On the first day of school, mother and teacher comforted me together.",
      "The first day was like that, teacher was like a gentle mother.",
      "Now I always feel as if teacher was a fairy.",
      "Now that I am grown, I still remember the days of old.",
      "On the first day of school, mother and teacher comforted me together.",
      "Now that I am grown, I still remember the days of old.",
      "On the first day of school, mother and teacher comforted me together."
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
    "cover": "./assets/music/covers/music_cover_ngay-dau-tien-di-hoc.webp",
    "isVocalTrack": true,
    "audioUrl": "./assets/music/ngay-dau-tien-di-hoc.mp3"
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
      "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhớ đi học đều.",
      "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
      "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
      "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
      "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhớ đi học đều.",
      "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
      "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
      "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
      "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhớ đi học đều.",
      "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
      "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
      "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
      "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhớ đi học đều.",
      "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui."
    ],
    "lyricsData": [
      {
        "start": 27.95,
        "end": 34.9,
        "vi": "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
        "en": "The morning sun rises as I go to kindergarten, birds flit across branches chirping to greet us."
      },
      {
        "start": 34.75,
        "end": 41.8,
        "vi": "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
        "en": "The teacher praises me for being studious, happily welcoming me to school."
      },
      {
        "start": 42.15,
        "end": 52.2,
        "vi": "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhớ đi học đều.",
        "en": "I enjoy singing happily, my teacher teaches so many good things, a good child remembers to attend school regularly."
      },
      {
        "start": 52.05,
        "end": 58.7,
        "vi": "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
        "en": "Our beloved kindergarten, our kindergarten brings so much joy."
      },
      {
        "start": 61.15,
        "end": 67.4,
        "vi": "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
        "en": "The morning sun rises as I go to kindergarten, birds flit across branches chirping to greet us."
      },
      {
        "start": 67.25,
        "end": 74.3,
        "vi": "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
        "en": "The teacher praises me for being studious, happily welcoming me to school."
      },
      {
        "start": 74.75,
        "end": 84.4,
        "vi": "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhớ đi học đều.",
        "en": "I enjoy singing happily, my teacher teaches so many good things, a good child remembers to attend school regularly."
      },
      {
        "start": 84.25,
        "end": 90.9,
        "vi": "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
        "en": "Our beloved kindergarten, our kindergarten brings so much joy."
      },
      {
        "start": 121.35,
        "end": 127.6,
        "vi": "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
        "en": "The morning sun rises as I go to kindergarten, birds flit across branches chirping to greet us."
      },
      {
        "start": 127.45,
        "end": 134.5,
        "vi": "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
        "en": "The teacher praises me for being studious, happily welcoming me to school."
      },
      {
        "start": 134.95,
        "end": 144.7,
        "vi": "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhớ đi học đều.",
        "en": "I enjoy singing happily, my teacher teaches so many good things, a good child remembers to attend school regularly."
      },
      {
        "start": 144.55,
        "end": 150.8,
        "vi": "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
        "en": "Our beloved kindergarten, our kindergarten brings so much joy."
      },
      {
        "start": 153.75,
        "end": 160.0,
        "vi": "Nắng vừa lên em đi mẫu giáo, chim chuyền cành hót chào chúng em.",
        "en": "The morning sun rises as I go to kindergarten, birds flit across branches chirping to greet us."
      },
      {
        "start": 159.85,
        "end": 166.9,
        "vi": "Cô giáo khen em chăm học, mừng vui đón em vào trường.",
        "en": "The teacher praises me for being studious, happily welcoming me to school."
      },
      {
        "start": 167.25,
        "end": 177.1,
        "vi": "Em được vui hát ca, cô giáo em dạy bao điều hay, bé chăm ngoan nhớ đi học đều.",
        "en": "I enjoy singing happily, my teacher teaches so many good things, a good child remembers to attend school regularly."
      },
      {
        "start": 176.95,
        "end": 191.7,
        "vi": "Trường mẫu giáo chúng em mến yêu, trường mẫu giáo chúng em rất vui.",
        "en": "Our beloved kindergarten, our kindergarten brings so much joy."
      }
    ],
    "englishTranslation": [
      "The morning sun rises as I go to kindergarten, birds flit across branches chirping to greet us.",
      "The teacher praises me for being studious, happily welcoming me to school.",
      "I enjoy singing happily, my teacher teaches so many good things, a good child remembers to attend school regularly.",
      "Our beloved kindergarten, our kindergarten brings so much joy.",
      "The morning sun rises as I go to kindergarten, birds flit across branches chirping to greet us.",
      "The teacher praises me for being studious, happily welcoming me to school.",
      "I enjoy singing happily, my teacher teaches so many good things, a good child remembers to attend school regularly.",
      "Our beloved kindergarten, our kindergarten brings so much joy.",
      "The morning sun rises as I go to kindergarten, birds flit across branches chirping to greet us.",
      "The teacher praises me for being studious, happily welcoming me to school.",
      "I enjoy singing happily, my teacher teaches so many good things, a good child remembers to attend school regularly.",
      "Our beloved kindergarten, our kindergarten brings so much joy.",
      "The morning sun rises as I go to kindergarten, birds flit across branches chirping to greet us.",
      "The teacher praises me for being studious, happily welcoming me to school.",
      "I enjoy singing happily, my teacher teaches so many good things, a good child remembers to attend school regularly.",
      "Our beloved kindergarten, our kindergarten brings so much joy."
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
    "cover": "./assets/music/covers/music_cover_em-di-mau-giao.webp",
    "isVocalTrack": true,
    "audioUrl": "./assets/music/em-di-mau-giao.mp3"
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
      "Em yêu trường em, với bao bạn thân và cô giáo hiền.",
      "Như yêu quê hương, cắp sách đến trường trong muôn vàn yêu thương.",
      "Nào bàn, nào ghế, nào sách, nào vở.",
      "Nào mực, nào bút, nào phấn, nào bảng.",
      "Cả tiếng chim vui trên cành cây cao.",
      "Cả lá cờ sao trong nắng thu vàng.",
      "Yêu sao yêu thế, trường của chúng em!",
      "Em yêu trường em, với bao bạn thân và cô giáo hiền.",
      "Như yêu quê hương, cắp sách đến trường trong muôn vàn yêu thương.",
      "Mùa phượng phượng thắm, mùa cúc vàng nở.",
      "Mùa huệ huệ trắng, đào thắm hồng đỏ.",
      "Trường chúng em đây như vườn hoa tươi.",
      "Người tốt việc hay là cháu Bác Hồ.",
      "Yêu sao yêu thế, trường của chúng em!",
      "Yêu sao yêu thế, trường của chúng em!",
      "Em yêu trường em, với bao bạn thân và cô giáo hiền.",
      "Như yêu quê hương, cắp sách đến trường trong muôn vàn yêu thương.",
      "Nào bàn, nào ghế, nào sách, nào vở.",
      "Nào mực, nào bút, nào phấn, nào bảng.",
      "Cả tiếng chim vui trên cành cây cao.",
      "Cả lá cờ sao trong nắng thu vàng.",
      "Yêu sao yêu thế, trường của chúng em!",
      "Em yêu trường em, với bao bạn thân và cô giáo hiền.",
      "Như yêu quê hương, cắp sách đến trường trong muôn vàn yêu thương.",
      "Mùa phượng phượng thắm, mùa cúc vàng nở.",
      "Mùa huệ huệ trắng, đào thắm hồng đỏ.",
      "Trường chúng em đây như vườn hoa tươi.",
      "Người tốt việc hay là cháu Bác Hồ.",
      "Yêu sao yêu thế, trường của chúng em!",
      "Yêu sao yêu thế, trường của chúng em!"
    ],
    "lyricsData": [
      {
        "start": 35.25,
        "end": 38.0,
        "vi": "Em yêu trường em, với bao bạn thân và cô giáo hiền.",
        "en": "I love my school, with so many close friends and gentle teacher."
      },
      {
        "start": 37.95,
        "end": 41.2,
        "vi": "Như yêu quê hương, cắp sách đến trường trong muôn vàn yêu thương.",
        "en": "Like loving my homeland, carrying books to school in countless love."
      },
      {
        "start": 41.15,
        "end": 44.3,
        "vi": "Nào bàn, nào ghế, nào sách, nào vở.",
        "en": "Here are desks, chairs, books, and notebooks."
      },
      {
        "start": 44.25,
        "end": 47.0,
        "vi": "Nào mực, nào bút, nào phấn, nào bảng.",
        "en": "Here is ink, pen, chalk, and blackboard."
      },
      {
        "start": 46.95,
        "end": 52.7,
        "vi": "Cả tiếng chim vui trên cành cây cao.",
        "en": "Even the cheerful birds singing on high tree branches."
      },
      {
        "start": 63.35,
        "end": 66.0,
        "vi": "Cả lá cờ sao trong nắng thu vàng.",
        "en": "Even the starry flag in golden autumn sunlight."
      },
      {
        "start": 65.95,
        "end": 69.1,
        "vi": "Yêu sao yêu thế, trường của chúng em!",
        "en": "How wonderful and beloved, this school of ours!"
      },
      {
        "start": 69.05,
        "end": 72.1,
        "vi": "Em yêu trường em, với bao bạn thân và cô giáo hiền.",
        "en": "I love my school, with so many close friends and gentle teacher."
      },
      {
        "start": 72.05,
        "end": 75.0,
        "vi": "Như yêu quê hương, cắp sách đến trường trong muôn vàn yêu thương.",
        "en": "Like loving my homeland, carrying books to school in countless love."
      },
      {
        "start": 74.95,
        "end": 81.3,
        "vi": "Mùa phượng phượng thắm, mùa cúc vàng nở.",
        "en": "Season of red flamboyant flowers, season of yellow chrysanthemums blooming."
      },
      {
        "start": 125.35,
        "end": 128.1,
        "vi": "Mùa huệ huệ trắng, đào thắm hồng đỏ.",
        "en": "Season of white lilies, radiant pink and red peach blossoms."
      },
      {
        "start": 128.05,
        "end": 131.1,
        "vi": "Trường chúng em đây như vườn hoa tươi.",
        "en": "This school of ours is like a fresh flower garden."
      },
      {
        "start": 131.05,
        "end": 134.2,
        "vi": "Người tốt việc hay là cháu Bác Hồ.",
        "en": "Good people, good deeds, children of Uncle Ho."
      },
      {
        "start": 134.15,
        "end": 137.0,
        "vi": "Yêu sao yêu thế, trường của chúng em!",
        "en": "How wonderful and beloved, this school of ours!"
      },
      {
        "start": 136.95,
        "end": 142.9,
        "vi": "Yêu sao yêu thế, trường của chúng em!",
        "en": "How wonderful and beloved, this school of ours!"
      },
      {
        "start": 153.55,
        "end": 156.4,
        "vi": "Em yêu trường em, với bao bạn thân và cô giáo hiền.",
        "en": "I love my school, with so many close friends and gentle teacher."
      },
      {
        "start": 156.35,
        "end": 159.4,
        "vi": "Như yêu quê hương, cắp sách đến trường trong muôn vàn yêu thương.",
        "en": "Like loving my homeland, carrying books to school in countless love."
      },
      {
        "start": 159.35,
        "end": 162.5,
        "vi": "Nào bàn, nào ghế, nào sách, nào vở.",
        "en": "Here are desks, chairs, books, and notebooks."
      },
      {
        "start": 162.45,
        "end": 165.3,
        "vi": "Nào mực, nào bút, nào phấn, nào bảng.",
        "en": "Here is ink, pen, chalk, and blackboard."
      },
      {
        "start": 165.25,
        "end": 171.3,
        "vi": "Cả tiếng chim vui trên cành cây cao.",
        "en": "Even the cheerful birds singing on high tree branches."
      },
      {
        "start": 215.95,
        "end": 218.9,
        "vi": "Cả lá cờ sao trong nắng thu vàng.",
        "en": "Even the starry flag in golden autumn sunlight."
      },
      {
        "start": 218.85,
        "end": 221.9,
        "vi": "Yêu sao yêu thế, trường của chúng em!",
        "en": "How wonderful and beloved, this school of ours!"
      },
      {
        "start": 221.85,
        "end": 225.0,
        "vi": "Em yêu trường em, với bao bạn thân và cô giáo hiền.",
        "en": "I love my school, with so many close friends and gentle teacher."
      },
      {
        "start": 224.95,
        "end": 227.8,
        "vi": "Như yêu quê hương, cắp sách đến trường trong muôn vàn yêu thương.",
        "en": "Like loving my homeland, carrying books to school in countless love."
      },
      {
        "start": 227.75,
        "end": 233.6,
        "vi": "Mùa phượng phượng thắm, mùa cúc vàng nở.",
        "en": "Season of red flamboyant flowers, season of yellow chrysanthemums blooming."
      },
      {
        "start": 244.05,
        "end": 246.9,
        "vi": "Mùa huệ huệ trắng, đào thắm hồng đỏ.",
        "en": "Season of white lilies, radiant pink and red peach blossoms."
      },
      {
        "start": 246.85,
        "end": 249.9,
        "vi": "Trường chúng em đây như vườn hoa tươi.",
        "en": "This school of ours is like a fresh flower garden."
      },
      {
        "start": 249.85,
        "end": 253.0,
        "vi": "Người tốt việc hay là cháu Bác Hồ.",
        "en": "Good people, good deeds, children of Uncle Ho."
      },
      {
        "start": 252.95,
        "end": 255.8,
        "vi": "Yêu sao yêu thế, trường của chúng em!",
        "en": "How wonderful and beloved, this school of ours!"
      },
      {
        "start": 255.75,
        "end": 262.0,
        "vi": "Yêu sao yêu thế, trường của chúng em!",
        "en": "How wonderful and beloved, this school of ours!"
      }
    ],
    "englishTranslation": [
      "I love my school, with so many close friends and gentle teacher.",
      "Like loving my homeland, carrying books to school in countless love.",
      "Here are desks, chairs, books, and notebooks.",
      "Here is ink, pen, chalk, and blackboard.",
      "Even the cheerful birds singing on high tree branches.",
      "Even the starry flag in golden autumn sunlight.",
      "How wonderful and beloved, this school of ours!",
      "I love my school, with so many close friends and gentle teacher.",
      "Like loving my homeland, carrying books to school in countless love.",
      "Season of red flamboyant flowers, season of yellow chrysanthemums blooming.",
      "Season of white lilies, radiant pink and red peach blossoms.",
      "This school of ours is like a fresh flower garden.",
      "Good people, good deeds, children of Uncle Ho.",
      "How wonderful and beloved, this school of ours!",
      "How wonderful and beloved, this school of ours!",
      "I love my school, with so many close friends and gentle teacher.",
      "Like loving my homeland, carrying books to school in countless love.",
      "Here are desks, chairs, books, and notebooks.",
      "Here is ink, pen, chalk, and blackboard.",
      "Even the cheerful birds singing on high tree branches.",
      "Even the starry flag in golden autumn sunlight.",
      "How wonderful and beloved, this school of ours!",
      "I love my school, with so many close friends and gentle teacher.",
      "Like loving my homeland, carrying books to school in countless love.",
      "Season of red flamboyant flowers, season of yellow chrysanthemums blooming.",
      "Season of white lilies, radiant pink and red peach blossoms.",
      "This school of ours is like a fresh flower garden.",
      "Good people, good deeds, children of Uncle Ho.",
      "How wonderful and beloved, this school of ours!",
      "How wonderful and beloved, this school of ours!"
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
    "cover": "./assets/music/covers/music_cover_em-yeu-truong-em.webp",
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
      "Tạm biệt búp bê thân yêu,",
      "tạm biệt gấu Mi-sa nhé.",
      "Tạm biệt thỏ trắng xinh xinh,",
      "mai tôi vào lớp một rồi.",
      "Nhớ lắm, quên sao được",
      "trường mầm non thân yêu."
    ],
    "lyricsData": [
      {
        "start": 35.0,
        "end": 37.5,
        "vi": "Tạm biệt búp bê thân yêu,",
        "en": "Farewell beloved doll,"
      },
      {
        "start": 37.8,
        "end": 40.8,
        "vi": "tạm biệt gấu Mi-sa nhé.",
        "en": "farewell Misa bear."
      },
      {
        "start": 41.0,
        "end": 44.2,
        "vi": "Tạm biệt thỏ trắng xinh xinh,",
        "en": "Farewell pretty white bunny,"
      },
      {
        "start": 44.3,
        "end": 47.0,
        "vi": "mai tôi vào lớp một rồi.",
        "en": "tomorrow I enter first grade."
      },
      {
        "start": 47.2,
        "end": 49.5,
        "vi": "Nhớ lắm, quên sao được",
        "en": "I will miss you so much, how could I forget"
      },
      {
        "start": 49.6,
        "end": 52.8,
        "vi": "trường mầm non thân yêu.",
        "en": "my beloved kindergarten."
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
    "cover": "./assets/music/covers/music_cover_tam-biet-bup-be.webp",
    "isVocalTrack": true,
    "englishTranslation": [
      "Goodbye beloved doll, goodbye cute Misa bear",
      "Goodbye pretty white bunny, now I enter grade one",
      "I will miss it so much, how could I forget",
      "My beloved kindergarten school!"
    ],
    "audioUrl": "./assets/music/tam-biet-bup-be.mp3"
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
      "Một hai ba bốn, hít thở, hít thở, hít thở.",
      "Một! Tay đưa cao lên trời.",
      "Hai! Tay dang ngang bờ vai.",
      "Ba! Tay song song trước mặt.",
      "Bốn! Buông cả hai tay.",
      "Một hai ba bốn, hít mạnh thở ra, hít mạnh thở ra.",
      "Cô dạy em bài thể dục buổi sáng.",
      "Một hai ba bốn, hít thở, hít thở, hít thở.",
      "Một! Tay đưa cao lên trời.",
      "Hai! Tay dang ngang bờ vai.",
      "Ba! Tay song song trước mặt.",
      "Bốn! Buông cả hai tay.",
      "Một hai ba bốn, hít mạnh thở ra, hít mạnh thở ra.",
      "Cô dạy em bài thể dục buổi sáng.",
      "Một hai ba bốn, hít thở, hít thở, hít thở.",
      "Một! Tay đưa cao lên trời.",
      "Hai! Tay dang ngang bờ vai.",
      "Ba! Tay song song trước mặt.",
      "Bốn! Buông cả hai tay.",
      "Một hai ba bốn, hít mạnh thở ra, hít mạnh thở ra.",
      "Cô dạy em bài thể dục buổi sáng.",
      "Một hai ba bốn, hít thở, hít thở, hít thở.",
      "Một! Tay đưa cao lên trời.",
      "Hai! Tay dang ngang bờ vai."
    ],
    "lyricsData": [
      {
        "start": 13.75,
        "end": 18.0,
        "vi": "Cô dạy em bài thể dục buổi sáng.",
        "en": "Teacher teaches me morning gymnastics."
      },
      {
        "start": 17.85,
        "end": 22.0,
        "vi": "Một hai ba bốn, hít thở, hít thở, hít thở.",
        "en": "One two three four, inhale exhale, inhale exhale."
      },
      {
        "start": 21.85,
        "end": 24.4,
        "vi": "Một! Tay đưa cao lên trời.",
        "en": "One! Raise hands high towards the sky."
      },
      {
        "start": 24.25,
        "end": 26.5,
        "vi": "Hai! Tay dang ngang bờ vai.",
        "en": "Two! Stretch hands across the shoulders."
      },
      {
        "start": 26.35,
        "end": 28.9,
        "vi": "Ba! Tay song song trước mặt.",
        "en": "Three! Hands parallel in front."
      },
      {
        "start": 28.75,
        "end": 31.0,
        "vi": "Bốn! Buông cả hai tay.",
        "en": "Four! Drop both hands down."
      },
      {
        "start": 30.85,
        "end": 35.1,
        "vi": "Một hai ba bốn, hít mạnh thở ra, hít mạnh thở ra.",
        "en": "One two three four, inhale deeply and exhale."
      },
      {
        "start": 34.95,
        "end": 39.1,
        "vi": "Cô dạy em bài thể dục buổi sáng.",
        "en": "Teacher teaches me morning gymnastics."
      },
      {
        "start": 38.95,
        "end": 41.5,
        "vi": "Một hai ba bốn, hít thở, hít thở, hít thở.",
        "en": "One two three four, inhale exhale, inhale exhale."
      },
      {
        "start": 41.35,
        "end": 43.5,
        "vi": "Một! Tay đưa cao lên trời.",
        "en": "One! Raise hands high towards the sky."
      },
      {
        "start": 43.35,
        "end": 46.0,
        "vi": "Hai! Tay dang ngang bờ vai.",
        "en": "Two! Stretch hands across the shoulders."
      },
      {
        "start": 45.85,
        "end": 48.0,
        "vi": "Ba! Tay song song trước mặt.",
        "en": "Three! Hands parallel in front."
      },
      {
        "start": 77.55,
        "end": 81.8,
        "vi": "Bốn! Buông cả hai tay.",
        "en": "Four! Drop both hands down."
      },
      {
        "start": 81.65,
        "end": 85.7,
        "vi": "Một hai ba bốn, hít mạnh thở ra, hít mạnh thở ra.",
        "en": "One two three four, inhale deeply and exhale."
      },
      {
        "start": 85.55,
        "end": 88.1,
        "vi": "Cô dạy em bài thể dục buổi sáng.",
        "en": "Teacher teaches me morning gymnastics."
      },
      {
        "start": 87.95,
        "end": 90.1,
        "vi": "Một hai ba bốn, hít thở, hít thở, hít thở.",
        "en": "One two three four, inhale exhale, inhale exhale."
      },
      {
        "start": 89.95,
        "end": 92.4,
        "vi": "Một! Tay đưa cao lên trời.",
        "en": "One! Raise hands high towards the sky."
      },
      {
        "start": 92.25,
        "end": 94.5,
        "vi": "Hai! Tay dang ngang bờ vai.",
        "en": "Two! Stretch hands across the shoulders."
      },
      {
        "start": 111.15,
        "end": 115.4,
        "vi": "Ba! Tay song song trước mặt.",
        "en": "Three! Hands parallel in front."
      },
      {
        "start": 115.25,
        "end": 119.5,
        "vi": "Bốn! Buông cả hai tay.",
        "en": "Four! Drop both hands down."
      },
      {
        "start": 119.35,
        "end": 121.8,
        "vi": "Một hai ba bốn, hít mạnh thở ra, hít mạnh thở ra.",
        "en": "One two three four, inhale deeply and exhale."
      },
      {
        "start": 121.65,
        "end": 123.9,
        "vi": "Cô dạy em bài thể dục buổi sáng.",
        "en": "Teacher teaches me morning gymnastics."
      },
      {
        "start": 123.75,
        "end": 126.2,
        "vi": "Một hai ba bốn, hít thở, hít thở, hít thở.",
        "en": "One two three four, inhale exhale, inhale exhale."
      },
      {
        "start": 126.05,
        "end": 128.5,
        "vi": "Một! Tay đưa cao lên trời.",
        "en": "One! Raise hands high towards the sky."
      },
      {
        "start": 128.35,
        "end": 133.4,
        "vi": "Hai! Tay dang ngang bờ vai.",
        "en": "Two! Stretch hands across the shoulders."
      }
    ],
    "englishTranslation": [
      "Teacher teaches me morning gymnastics.",
      "One two three four, inhale exhale, inhale exhale.",
      "One! Raise hands high towards the sky.",
      "Two! Stretch hands across the shoulders.",
      "Three! Hands parallel in front.",
      "Four! Drop both hands down.",
      "One two three four, inhale deeply and exhale.",
      "Teacher teaches me morning gymnastics.",
      "One two three four, inhale exhale, inhale exhale.",
      "One! Raise hands high towards the sky.",
      "Two! Stretch hands across the shoulders.",
      "Three! Hands parallel in front.",
      "Four! Drop both hands down.",
      "One two three four, inhale deeply and exhale.",
      "Teacher teaches me morning gymnastics.",
      "One two three four, inhale exhale, inhale exhale.",
      "One! Raise hands high towards the sky.",
      "Two! Stretch hands across the shoulders.",
      "Three! Hands parallel in front.",
      "Four! Drop both hands down.",
      "One two three four, inhale deeply and exhale.",
      "Teacher teaches me morning gymnastics.",
      "One two three four, inhale exhale, inhale exhale.",
      "One! Raise hands high towards the sky.",
      "Two! Stretch hands across the shoulders."
    ],
    "funFactVi": "Thể dục buổi sáng rèn luyện thể chất dẻo dai cho bé khỏe mạnh.",
    "audioUrl": "./assets/music/tap-the-duc-buoi-sang.mp3",
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
    "cover": "./assets/music/covers/music_cover_tap-the-duc-buoi-sang.webp",
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
      "Chiếc đèn ông sao sao năm cánh tươi màu.",
      "Cán đây rất dài cán cao quá đầu, em cầm đèn sao em hát vang vang, đèn sao tươi màu của đêm rằm liên hoan.",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa sáng ngời.",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao Bác Hồ tỏa sáng nơi nơi.",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa sáng ngời.",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao Bác Hồ tỏa sáng nơi nơi.",
      "Đây đèn ông sao sao năm cánh tươi vàng.",
      "Ánh sao sáng ngời chiếu miền non ngàn, em cầm đèn sao em hát vang vang.",
      "Đây ánh hòa bình đuổi xua loài xâm lăng.",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa sáng ngời.",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao Bác Hồ tỏa sáng nơi nơi.",
      "Chiếc đèn ông sao sao năm cánh tươi màu.",
      "Cán đây rất dài cán cao quá đầu, em cầm đèn sao em hát vang vang.",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa sáng ngời.",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao Bác Hồ tỏa sáng nơi nơi.",
      "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa sáng ngời.",
      "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao Bác Hồ tỏa sáng nơi nơi."
    ],
    "lyricsData": [
      {
        "start": 27.35,
        "end": 32.8,
        "vi": "Chiếc đèn ông sao sao năm cánh tươi màu.",
        "en": "The star lantern with five brightly colored points."
      },
      {
        "start": 32.65,
        "end": 38.9,
        "vi": "Cán đây rất dài cán cao quá đầu, em cầm đèn sao em hát vang vang, đèn sao tươi màu của đêm rằm liên hoan.",
        "en": "The handle is very long reaching above head, holding my star lantern I sing out loud, bright star lantern of the festival night."
      },
      {
        "start": 39.75,
        "end": 45.3,
        "vi": "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa sáng ngời.",
        "en": "Tung rinh rinh, tung tung tung rinh rinh, here joyful starlight shines far and bright."
      },
      {
        "start": 45.15,
        "end": 50.8,
        "vi": "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao Bác Hồ tỏa sáng nơi nơi.",
        "en": "Tung rinh rinh rinh rinh tung rinh rinh, Uncle Ho's star shines everywhere."
      },
      {
        "start": 50.65,
        "end": 56.2,
        "vi": "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa sáng ngời.",
        "en": "Tung rinh rinh, tung tung tung rinh rinh, here joyful starlight shines far and bright."
      },
      {
        "start": 56.05,
        "end": 61.8,
        "vi": "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao Bác Hồ tỏa sáng nơi nơi.",
        "en": "Tung rinh rinh rinh rinh tung rinh rinh, Uncle Ho's star shines everywhere."
      },
      {
        "start": 62.15,
        "end": 67.7,
        "vi": "Đây đèn ông sao sao năm cánh tươi vàng.",
        "en": "Here is the star lantern with five golden points."
      },
      {
        "start": 67.55,
        "end": 73.9,
        "vi": "Ánh sao sáng ngời chiếu miền non ngàn, em cầm đèn sao em hát vang vang.",
        "en": "Radiant starlight illuminates mountains, holding my star lantern I sing out loud."
      },
      {
        "start": 73.75,
        "end": 79.5,
        "vi": "Đây ánh hòa bình đuổi xua loài xâm lăng.",
        "en": "Here the light of peace drives away invaders."
      },
      {
        "start": 79.35,
        "end": 85.2,
        "vi": "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa sáng ngời.",
        "en": "Tung rinh rinh, tung tung tung rinh rinh, here joyful starlight shines far and bright."
      },
      {
        "start": 85.05,
        "end": 96.7,
        "vi": "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao Bác Hồ tỏa sáng nơi nơi.",
        "en": "Tung rinh rinh rinh rinh tung rinh rinh, Uncle Ho's star shines everywhere."
      },
      {
        "start": 154.75,
        "end": 160.4,
        "vi": "Chiếc đèn ông sao sao năm cánh tươi màu.",
        "en": "The star lantern with five brightly colored points."
      },
      {
        "start": 160.25,
        "end": 166.4,
        "vi": "Cán đây rất dài cán cao quá đầu, em cầm đèn sao em hát vang vang.",
        "en": "The handle is very long reaching above head, holding my star lantern I sing out loud."
      },
      {
        "start": 166.25,
        "end": 172.4,
        "vi": "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa sáng ngời.",
        "en": "Tung rinh rinh, tung tung tung rinh rinh, here joyful starlight shines far and bright."
      },
      {
        "start": 172.25,
        "end": 177.9,
        "vi": "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao Bác Hồ tỏa sáng nơi nơi.",
        "en": "Tung rinh rinh rinh rinh tung rinh rinh, Uncle Ho's star shines everywhere."
      },
      {
        "start": 177.75,
        "end": 183.5,
        "vi": "Tùng rinh rinh tùng tùng tùng rinh rinh, đây ánh sao vui chiếu xa sáng ngời.",
        "en": "Tung rinh rinh, tung tung tung rinh rinh, here joyful starlight shines far and bright."
      },
      {
        "start": 183.35,
        "end": 202.5,
        "vi": "Tùng rinh rinh rinh rinh tùng rinh rinh, ánh sao Bác Hồ tỏa sáng nơi nơi.",
        "en": "Tung rinh rinh rinh rinh tung rinh rinh, Uncle Ho's star shines everywhere."
      }
    ],
    "englishTranslation": [
      "The star lantern with five brightly colored points.",
      "The handle is very long reaching above head, holding my star lantern I sing out loud, bright star lantern of the festival night.",
      "Tung rinh rinh, tung tung tung rinh rinh, here joyful starlight shines far and bright.",
      "Tung rinh rinh rinh rinh tung rinh rinh, Uncle Ho's star shines everywhere.",
      "Tung rinh rinh, tung tung tung rinh rinh, here joyful starlight shines far and bright.",
      "Tung rinh rinh rinh rinh tung rinh rinh, Uncle Ho's star shines everywhere.",
      "Here is the star lantern with five golden points.",
      "Radiant starlight illuminates mountains, holding my star lantern I sing out loud.",
      "Here the light of peace drives away invaders.",
      "Tung rinh rinh, tung tung tung rinh rinh, here joyful starlight shines far and bright.",
      "Tung rinh rinh rinh rinh tung rinh rinh, Uncle Ho's star shines everywhere.",
      "The star lantern with five brightly colored points.",
      "The handle is very long reaching above head, holding my star lantern I sing out loud.",
      "Tung rinh rinh, tung tung tung rinh rinh, here joyful starlight shines far and bright.",
      "Tung rinh rinh rinh rinh tung rinh rinh, Uncle Ho's star shines everywhere.",
      "Tung rinh rinh, tung tung tung rinh rinh, here joyful starlight shines far and bright.",
      "Tung rinh rinh rinh rinh tung rinh rinh, Uncle Ho's star shines everywhere."
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
    "cover": "./assets/music/covers/music_cover_chiec-den-ong-sao.webp",
    "isVocalTrack": true,
    "audioUrl": "./assets/music/chiec-den-ong-sao.mp3"
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
      "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quý,",
      "ngát tỏa hương thơm, mang sắc màu tươi thắm, màu hoa nào",
      "Cũng quý cũng thơm, màu da nào",
      "Cũng quý cũng thơm.",
      "Trái đất này là của chúng mình, cùng siết tay,",
      "môi thắm cười xinh. Bình minh ơi,",
      "khúc ca này êm ấm, học chăm ngoan,",
      "đắp xây đời tươi sáng, hành tinh này.",
      "Là ngôi nhà chung, hành tinh này.",
      "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
      "Bồ câu ơi, cánh chim gù thương mến.",
      "Hải âu ơi, cánh chim vờn trên sóng,",
      "cùng bay nào.",
      "Cho trái đất quay, cùng bay nào.",
      "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
      "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quý,",
      "ngát tỏa hương thơm, mang sắc màu tươi thắm, màu hoa nào",
      "Cũng quý cũng thơm, màu da nào",
      "Cũng quý cũng thơm.",
      "Trái đất này là của chúng mình, cùng siết tay,",
      "môi thắm cười xinh. Bình minh ơi,",
      "khúc ca này êm ấm, học chăm ngoan,",
      "đắp xây đời tươi sáng, hành tinh này.",
      "Là ngôi nhà chung, hành tinh này.",
      "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
      "Bồ câu ơi, cánh chim gù thương mến.",
      "Hải âu ơi, cánh chim vờn trên sóng,",
      "cùng bay nào.",
      "Cho trái đất quay, cùng bay nào.",
      "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
      "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quý,",
      "ngát tỏa hương thơm, mang sắc màu tươi thắm, màu hoa nào",
      "Cũng quý cũng thơm, màu da nào",
      "Cũng quý cũng thơm.",
      "Trái đất này là của chúng mình, cùng siết tay,",
      "môi thắm cười xinh. Bình minh ơi,",
      "khúc ca này êm ấm, học chăm ngoan,",
      "đắp xây đời tươi sáng, hành tinh này.",
      "Là ngôi nhà chung, hành tinh này.",
      "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
      "Bồ câu ơi, cánh chim gù thương mến.",
      "Hải âu ơi, cánh chim vờn trên sóng,",
      "cùng bay nào.",
      "Cho trái đất quay, cùng bay nào.",
      "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
      "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quý,",
      "ngát tỏa hương thơm, mang sắc màu tươi thắm, màu hoa nào",
      "Cũng quý cũng thơm, màu da nào",
      "Cũng quý cũng thơm.",
      "Trái đất này là của chúng mình, cùng siết tay,",
      "môi thắm cười xinh. Bình minh ơi,",
      "khúc ca này êm ấm, học chăm ngoan,",
      "đắp xây đời tươi sáng, hành tinh này.",
      "Là ngôi nhà chung, hành tinh này."
    ],
    "lyricsData": [
      {
        "start": 18.55,
        "end": 26.5,
        "vi": "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
        "en": "This Earth belongs to us, a blue ball floating in the blue sky."
      },
      {
        "start": 26.35,
        "end": 30.4,
        "vi": "Bồ câu ơi, cánh chim gù thương mến.",
        "en": "Oh sweet doves, dear cooing wings."
      },
      {
        "start": 30.25,
        "end": 34.9,
        "vi": "Hải âu ơi, cánh chim vờn trên sóng,",
        "en": "Oh sea gulls, graceful wings riding the waves,"
      },
      {
        "start": 34.75,
        "end": 37.3,
        "vi": "cùng bay nào.",
        "en": "let us fly together."
      },
      {
        "start": 38.05,
        "end": 43.0,
        "vi": "Cho trái đất quay, cùng bay nào.",
        "en": "Make the Earth spin, let us fly together."
      },
      {
        "start": 43.75,
        "end": 52.4,
        "vi": "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
        "en": "Make the Earth spin! This Earth belongs to us, yellow, white, black,"
      },
      {
        "start": 52.25,
        "end": 58.3,
        "vi": "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quý,",
        "en": "though having different skin tones. Dear friends, we are precious flowers,"
      },
      {
        "start": 58.65,
        "end": 64.5,
        "vi": "ngát tỏa hương thơm, mang sắc màu tươi thắm, màu hoa nào",
        "en": "spreading sweet fragrance and bright colors, whichever flower color"
      },
      {
        "start": 66.15,
        "end": 70.7,
        "vi": "Cũng quý cũng thơm, màu da nào",
        "en": "Is also precious and fragrant, whichever skin color"
      },
      {
        "start": 72.15,
        "end": 77.3,
        "vi": "Cũng quý cũng thơm.",
        "en": "Is also precious and fragrant."
      },
      {
        "start": 79.25,
        "end": 85.1,
        "vi": "Trái đất này là của chúng mình, cùng siết tay,",
        "en": "This Earth belongs to us, holding hands tightly,"
      },
      {
        "start": 84.95,
        "end": 89.8,
        "vi": "môi thắm cười xinh. Bình minh ơi,",
        "en": "with lovely smiling lips. Oh gentle dawn,"
      },
      {
        "start": 89.65,
        "end": 95.3,
        "vi": "khúc ca này êm ấm, học chăm ngoan,",
        "en": "this song is so warm, studying hard and well,"
      },
      {
        "start": 95.15,
        "end": 100.8,
        "vi": "đắp xây đời tươi sáng, hành tinh này.",
        "en": "to build a bright future, this planet of ours."
      },
      {
        "start": 100.65,
        "end": 107.3,
        "vi": "Là ngôi nhà chung, hành tinh này.",
        "en": "Is our shared home, this planet."
      },
      {
        "start": 124.95,
        "end": 133.0,
        "vi": "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
        "en": "This Earth belongs to us, a blue ball floating in the blue sky."
      },
      {
        "start": 132.85,
        "end": 137.0,
        "vi": "Bồ câu ơi, cánh chim gù thương mến.",
        "en": "Oh sweet doves, dear cooing wings."
      },
      {
        "start": 136.85,
        "end": 142.0,
        "vi": "Hải âu ơi, cánh chim vờn trên sóng,",
        "en": "Oh sea gulls, graceful wings riding the waves,"
      },
      {
        "start": 141.85,
        "end": 144.4,
        "vi": "cùng bay nào.",
        "en": "let us fly together."
      },
      {
        "start": 144.85,
        "end": 149.0,
        "vi": "Cho trái đất quay, cùng bay nào.",
        "en": "Make the Earth spin, let us fly together."
      },
      {
        "start": 150.75,
        "end": 159.1,
        "vi": "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
        "en": "Make the Earth spin! This Earth belongs to us, yellow, white, black,"
      },
      {
        "start": 158.95,
        "end": 164.4,
        "vi": "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quý,",
        "en": "though having different skin tones. Dear friends, we are precious flowers,"
      },
      {
        "start": 165.15,
        "end": 171.0,
        "vi": "ngát tỏa hương thơm, mang sắc màu tươi thắm, màu hoa nào",
        "en": "spreading sweet fragrance and bright colors, whichever flower color"
      },
      {
        "start": 172.55,
        "end": 177.1,
        "vi": "Cũng quý cũng thơm, màu da nào",
        "en": "Is also precious and fragrant, whichever skin color"
      },
      {
        "start": 178.55,
        "end": 183.6,
        "vi": "Cũng quý cũng thơm.",
        "en": "Is also precious and fragrant."
      },
      {
        "start": 185.55,
        "end": 191.4,
        "vi": "Trái đất này là của chúng mình, cùng siết tay,",
        "en": "This Earth belongs to us, holding hands tightly,"
      },
      {
        "start": 191.25,
        "end": 196.1,
        "vi": "môi thắm cười xinh. Bình minh ơi,",
        "en": "with lovely smiling lips. Oh gentle dawn,"
      },
      {
        "start": 195.95,
        "end": 201.6,
        "vi": "khúc ca này êm ấm, học chăm ngoan,",
        "en": "this song is so warm, studying hard and well,"
      },
      {
        "start": 201.45,
        "end": 207.1,
        "vi": "đắp xây đời tươi sáng, hành tinh này.",
        "en": "to build a bright future, this planet of ours."
      },
      {
        "start": 206.95,
        "end": 213.6,
        "vi": "Là ngôi nhà chung, hành tinh này.",
        "en": "Is our shared home, this planet."
      },
      {
        "start": 218.85,
        "end": 226.8,
        "vi": "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
        "en": "This Earth belongs to us, a blue ball floating in the blue sky."
      },
      {
        "start": 226.65,
        "end": 230.8,
        "vi": "Bồ câu ơi, cánh chim gù thương mến.",
        "en": "Oh sweet doves, dear cooing wings."
      },
      {
        "start": 230.65,
        "end": 235.3,
        "vi": "Hải âu ơi, cánh chim vờn trên sóng,",
        "en": "Oh sea gulls, graceful wings riding the waves,"
      },
      {
        "start": 235.15,
        "end": 237.7,
        "vi": "cùng bay nào.",
        "en": "let us fly together."
      },
      {
        "start": 238.35,
        "end": 243.4,
        "vi": "Cho trái đất quay, cùng bay nào.",
        "en": "Make the Earth spin, let us fly together."
      },
      {
        "start": 244.05,
        "end": 252.7,
        "vi": "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
        "en": "Make the Earth spin! This Earth belongs to us, yellow, white, black,"
      },
      {
        "start": 252.55,
        "end": 258.6,
        "vi": "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quý,",
        "en": "though having different skin tones. Dear friends, we are precious flowers,"
      },
      {
        "start": 258.95,
        "end": 264.8,
        "vi": "ngát tỏa hương thơm, mang sắc màu tươi thắm, màu hoa nào",
        "en": "spreading sweet fragrance and bright colors, whichever flower color"
      },
      {
        "start": 266.45,
        "end": 271.0,
        "vi": "Cũng quý cũng thơm, màu da nào",
        "en": "Is also precious and fragrant, whichever skin color"
      },
      {
        "start": 272.45,
        "end": 277.6,
        "vi": "Cũng quý cũng thơm.",
        "en": "Is also precious and fragrant."
      },
      {
        "start": 279.45,
        "end": 285.3,
        "vi": "Trái đất này là của chúng mình, cùng siết tay,",
        "en": "This Earth belongs to us, holding hands tightly,"
      },
      {
        "start": 285.15,
        "end": 290.0,
        "vi": "môi thắm cười xinh. Bình minh ơi,",
        "en": "with lovely smiling lips. Oh gentle dawn,"
      },
      {
        "start": 289.85,
        "end": 295.5,
        "vi": "khúc ca này êm ấm, học chăm ngoan,",
        "en": "this song is so warm, studying hard and well,"
      },
      {
        "start": 295.35,
        "end": 301.0,
        "vi": "đắp xây đời tươi sáng, hành tinh này.",
        "en": "to build a bright future, this planet of ours."
      },
      {
        "start": 300.85,
        "end": 307.5,
        "vi": "Là ngôi nhà chung, hành tinh này.",
        "en": "Is our shared home, this planet."
      },
      {
        "start": 325.55,
        "end": 333.5,
        "vi": "Trái đất này là của chúng mình, quả bóng xanh, bay giữa trời xanh.",
        "en": "This Earth belongs to us, a blue ball floating in the blue sky."
      },
      {
        "start": 333.35,
        "end": 337.5,
        "vi": "Bồ câu ơi, cánh chim gù thương mến.",
        "en": "Oh sweet doves, dear cooing wings."
      },
      {
        "start": 337.35,
        "end": 342.0,
        "vi": "Hải âu ơi, cánh chim vờn trên sóng,",
        "en": "Oh sea gulls, graceful wings riding the waves,"
      },
      {
        "start": 341.85,
        "end": 344.4,
        "vi": "cùng bay nào.",
        "en": "let us fly together."
      },
      {
        "start": 345.05,
        "end": 350.1,
        "vi": "Cho trái đất quay, cùng bay nào.",
        "en": "Make the Earth spin, let us fly together."
      },
      {
        "start": 350.75,
        "end": 359.4,
        "vi": "Cho trái đất quay, Trái đất này là của chúng mình, vàng, trắng, đen,",
        "en": "Make the Earth spin! This Earth belongs to us, yellow, white, black,"
      },
      {
        "start": 359.25,
        "end": 365.3,
        "vi": "tuy khác màu da. Bạn yêu ơi, chúng ta là hoa quý,",
        "en": "though having different skin tones. Dear friends, we are precious flowers,"
      },
      {
        "start": 365.65,
        "end": 371.5,
        "vi": "ngát tỏa hương thơm, mang sắc màu tươi thắm, màu hoa nào",
        "en": "spreading sweet fragrance and bright colors, whichever flower color"
      },
      {
        "start": 373.15,
        "end": 377.7,
        "vi": "Cũng quý cũng thơm, màu da nào",
        "en": "Is also precious and fragrant, whichever skin color"
      },
      {
        "start": 379.15,
        "end": 384.3,
        "vi": "Cũng quý cũng thơm.",
        "en": "Is also precious and fragrant."
      },
      {
        "start": 386.15,
        "end": 392.0,
        "vi": "Trái đất này là của chúng mình, cùng siết tay,",
        "en": "This Earth belongs to us, holding hands tightly,"
      },
      {
        "start": 391.85,
        "end": 396.7,
        "vi": "môi thắm cười xinh. Bình minh ơi,",
        "en": "with lovely smiling lips. Oh gentle dawn,"
      },
      {
        "start": 396.55,
        "end": 402.2,
        "vi": "khúc ca này êm ấm, học chăm ngoan,",
        "en": "this song is so warm, studying hard and well,"
      },
      {
        "start": 402.05,
        "end": 407.7,
        "vi": "đắp xây đời tươi sáng, hành tinh này.",
        "en": "to build a bright future, this planet of ours."
      },
      {
        "start": 407.55,
        "end": 414.4,
        "vi": "Là ngôi nhà chung, hành tinh này.",
        "en": "Is our shared home, this planet."
      }
    ],
    "englishTranslation": [
      "This Earth belongs to us, a blue ball floating in the blue sky.",
      "Oh sweet doves, dear cooing wings.",
      "Oh sea gulls, graceful wings riding the waves,",
      "let us fly together.",
      "Make the Earth spin, let us fly together.",
      "Make the Earth spin! This Earth belongs to us, yellow, white, black,",
      "though having different skin tones. Dear friends, we are precious flowers,",
      "spreading sweet fragrance and bright colors, whichever flower color",
      "Is also precious and fragrant, whichever skin color",
      "Is also precious and fragrant.",
      "This Earth belongs to us, holding hands tightly,",
      "with lovely smiling lips. Oh gentle dawn,",
      "this song is so warm, studying hard and well,",
      "to build a bright future, this planet of ours.",
      "Is our shared home, this planet.",
      "This Earth belongs to us, a blue ball floating in the blue sky.",
      "Oh sweet doves, dear cooing wings.",
      "Oh sea gulls, graceful wings riding the waves,",
      "let us fly together.",
      "Make the Earth spin, let us fly together.",
      "Make the Earth spin! This Earth belongs to us, yellow, white, black,",
      "though having different skin tones. Dear friends, we are precious flowers,",
      "spreading sweet fragrance and bright colors, whichever flower color",
      "Is also precious and fragrant, whichever skin color",
      "Is also precious and fragrant.",
      "This Earth belongs to us, holding hands tightly,",
      "with lovely smiling lips. Oh gentle dawn,",
      "this song is so warm, studying hard and well,",
      "to build a bright future, this planet of ours.",
      "Is our shared home, this planet.",
      "This Earth belongs to us, a blue ball floating in the blue sky.",
      "Oh sweet doves, dear cooing wings.",
      "Oh sea gulls, graceful wings riding the waves,",
      "let us fly together.",
      "Make the Earth spin, let us fly together.",
      "Make the Earth spin! This Earth belongs to us, yellow, white, black,",
      "though having different skin tones. Dear friends, we are precious flowers,",
      "spreading sweet fragrance and bright colors, whichever flower color",
      "Is also precious and fragrant, whichever skin color",
      "Is also precious and fragrant.",
      "This Earth belongs to us, holding hands tightly,",
      "with lovely smiling lips. Oh gentle dawn,",
      "this song is so warm, studying hard and well,",
      "to build a bright future, this planet of ours.",
      "Is our shared home, this planet.",
      "This Earth belongs to us, a blue ball floating in the blue sky.",
      "Oh sweet doves, dear cooing wings.",
      "Oh sea gulls, graceful wings riding the waves,",
      "let us fly together.",
      "Make the Earth spin, let us fly together.",
      "Make the Earth spin! This Earth belongs to us, yellow, white, black,",
      "though having different skin tones. Dear friends, we are precious flowers,",
      "spreading sweet fragrance and bright colors, whichever flower color",
      "Is also precious and fragrant, whichever skin color",
      "Is also precious and fragrant.",
      "This Earth belongs to us, holding hands tightly,",
      "with lovely smiling lips. Oh gentle dawn,",
      "this song is so warm, studying hard and well,",
      "to build a bright future, this planet of ours.",
      "Is our shared home, this planet."
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
    "cover": "./assets/music/covers/music_cover_trai-dat-nay-la-cua-chung-minh.webp",
    "isVocalTrack": true,
    "audioUrl": "./assets/music/trai-dat-nay-la-cua-chung-minh.mp3"
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
      "(Nhạc không lời)",
      "Trên cành cao chim hót mời em chơi giữa vườn xuân.",
      "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
      "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
      "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
      "(Nhạc không lời)",
      "Trên cành cao chim hót mời em chơi giữa vườn xuân.",
      "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
      "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
      "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
      "(Nhạc không lời)",
      "Trên cành cao chim hót mời em chơi giữa vườn xuân.",
      "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
      "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
      "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
      "(Nhạc không lời)",
      "Trên cành cao chim hót mời em chơi giữa vườn xuân.",
      "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
      "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
      "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu."
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 14.2,
        "vi": "(Nhạc không lời)",
        "en": "(Instrumental)"
      },
      {
        "start": 14.05,
        "end": 21.0,
        "vi": "Trên cành cao chim hót mời em chơi giữa vườn xuân.",
        "en": "High on tree branches birds sing inviting me to play in the spring garden."
      },
      {
        "start": 20.85,
        "end": 28.0,
        "vi": "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
        "en": "Many close friends peek out calling me to romp around the yard."
      },
      {
        "start": 27.85,
        "end": 35.4,
        "vi": "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
        "en": "Playing soccer, shuttlecock, jumping rope, marbles, and hide-and-seek."
      },
      {
        "start": 35.25,
        "end": 43.9,
        "vi": "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
        "en": "Oh so wonderfully enticing, but I don't dare."
      },
      {
        "start": 43.75,
        "end": 49.8,
        "vi": "(Nhạc không lời)",
        "en": "(Instrumental)"
      },
      {
        "start": 49.65,
        "end": 56.8,
        "vi": "Trên cành cao chim hót mời em chơi giữa vườn xuân.",
        "en": "High on tree branches birds sing inviting me to play in the spring garden."
      },
      {
        "start": 56.65,
        "end": 64.2,
        "vi": "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
        "en": "Many close friends peek out calling me to romp around the yard."
      },
      {
        "start": 64.05,
        "end": 71.8,
        "vi": "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
        "en": "Playing soccer, shuttlecock, jumping rope, marbles, and hide-and-seek."
      },
      {
        "start": 71.65,
        "end": 79.4,
        "vi": "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
        "en": "Oh so wonderfully enticing, but I don't dare."
      },
      {
        "start": 79.25,
        "end": 99.9,
        "vi": "(Nhạc không lời)",
        "en": "(Instrumental)"
      },
      {
        "start": 99.75,
        "end": 106.6,
        "vi": "Trên cành cao chim hót mời em chơi giữa vườn xuân.",
        "en": "High on tree branches birds sing inviting me to play in the spring garden."
      },
      {
        "start": 106.45,
        "end": 114.1,
        "vi": "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
        "en": "Many close friends peek out calling me to romp around the yard."
      },
      {
        "start": 113.95,
        "end": 121.3,
        "vi": "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
        "en": "Playing soccer, shuttlecock, jumping rope, marbles, and hide-and-seek."
      },
      {
        "start": 121.15,
        "end": 129.6,
        "vi": "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
        "en": "Oh so wonderfully enticing, but I don't dare."
      },
      {
        "start": 129.45,
        "end": 135.5,
        "vi": "(Nhạc không lời)",
        "en": "(Instrumental)"
      },
      {
        "start": 135.35,
        "end": 142.7,
        "vi": "Trên cành cao chim hót mời em chơi giữa vườn xuân.",
        "en": "High on tree branches birds sing inviting me to play in the spring garden."
      },
      {
        "start": 142.55,
        "end": 150.1,
        "vi": "Bao bạn thân lấp ló gọi em tung tăng sân nhà.",
        "en": "Many close friends peek out calling me to romp around the yard."
      },
      {
        "start": 149.95,
        "end": 156.9,
        "vi": "Đá bóng với đá cầu, nhảy dây bắn bi trốn tìm.",
        "en": "Playing soccer, shuttlecock, jumping rope, marbles, and hide-and-seek."
      },
      {
        "start": 156.75,
        "end": 188.0,
        "vi": "Ôi hấp dẫn tuyệt vời nhưng mà em không dám đâu.",
        "en": "Oh so wonderfully enticing, but I don't dare."
      }
    ],
    "englishTranslation": [
      "(Instrumental)",
      "High on tree branches birds sing inviting me to play in the spring garden.",
      "Many close friends peek out calling me to romp around the yard.",
      "Playing soccer, shuttlecock, jumping rope, marbles, and hide-and-seek.",
      "Oh so wonderfully enticing, but I don't dare.",
      "(Instrumental)",
      "High on tree branches birds sing inviting me to play in the spring garden.",
      "Many close friends peek out calling me to romp around the yard.",
      "Playing soccer, shuttlecock, jumping rope, marbles, and hide-and-seek.",
      "Oh so wonderfully enticing, but I don't dare.",
      "(Instrumental)",
      "High on tree branches birds sing inviting me to play in the spring garden.",
      "Many close friends peek out calling me to romp around the yard.",
      "Playing soccer, shuttlecock, jumping rope, marbles, and hide-and-seek.",
      "Oh so wonderfully enticing, but I don't dare.",
      "(Instrumental)",
      "High on tree branches birds sing inviting me to play in the spring garden.",
      "Many close friends peek out calling me to romp around the yard.",
      "Playing soccer, shuttlecock, jumping rope, marbles, and hide-and-seek.",
      "Oh so wonderfully enticing, but I don't dare."
    ],
    "funFactVi": "Bé chăm chỉ học bài đầy đủ trước khi cùng bạn ra chơi.",
    "audioUrl": "./assets/music/hong-dam-dau.mp3",
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
    "cover": "./assets/music/covers/music_cover_hong-dam-dau.webp",
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
        "en": "A B C D E F G H I J K L M N O P Q R S T U V W X Y và Z"
      },
      {
        "start": 17.85,
        "end": 26.5,
        "vi": "Now you know your ABCs, next time won't you sing with me?",
        "en": "Bây giờ bạn đã biết bảng chữ cái ABC rồi, lần tới hãy cùng hát với tôi nhé!"
      },
      {
        "start": 35.25,
        "end": 51.6,
        "vi": "A B C D E F G H I J K L M N O P Q R S T U V W X Y and Z",
        "en": "A B C D E F G H I J K L M N O P Q R S T U V W X Y và Z"
      },
      {
        "start": 51.85,
        "end": 60.6,
        "vi": "Now you know your ABCs, next time won't you sing with me?",
        "en": "Bây giờ bạn đã biết bảng chữ cái ABC rồi, lần tới hãy cùng hát với tôi nhé!"
      }
    ],
    "englishTranslation": [
      "A B C D E F G H I J K L M N O P Q R S T U V W X Y và Z",
      "Bây giờ bạn đã biết bảng chữ cái ABC rồi, lần tới hãy cùng hát với tôi nhé!",
      "A B C D E F G H I J K L M N O P Q R S T U V W X Y và Z",
      "Bây giờ bạn đã biết bảng chữ cái ABC rồi, lần tới hãy cùng hát với tôi nhé!"
    ],
    "funFactVi": "Bài ca kinh điển giúp bé ghi nhớ trọn vẹn 26 chữ cái.",
    "audioUrl": "./assets/music/abc-alphabet-song.mp3",
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
    "cover": "./assets/music/covers/music_cover_abc-alphabet-song.webp",
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
      "Catch a falling star and put it in your pocket and never let it fade away. Catch a falling star and put it in your pocket save it for a rainy day.",
      "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky. Twinkle twinkle little star how I wonder what you are and oh how wonderful you are"
    ],
    "lyricsData": [
      {
        "start": 8.35,
        "end": 12.7,
        "vi": "Reach way up into the sky",
        "en": "Vươn cao tay lên tận bầu trời"
      },
      {
        "start": 12.55,
        "end": 20.9,
        "vi": "Catch a falling star and put it in your pocket and never let it fade away",
        "en": "Hãy đón lấy ngôi sao băng bỏ vào túi và đừng để nó phai nhạt đi"
      },
      {
        "start": 20.75,
        "end": 31.7,
        "vi": "Catch a falling star and put it in your pocket never let it fade away",
        "en": "Hãy đón lấy ngôi sao băng bỏ vào túi đừng để nó phai nhạt đi"
      },
      {
        "start": 31.55,
        "end": 44.8,
        "vi": "Catch a falling star and put it in your pocket save it for a rainy day",
        "en": "Hãy đón lấy ngôi sao băng bỏ vào túi để dành cho những ngày mưa"
      },
      {
        "start": 44.65,
        "end": 66.6,
        "vi": "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky",
        "en": "Lấp lánh lấp lánh ngôi sao nhỏ, em tự hỏi bạn là gì, ở tít trên cao thế giới, như viên kim cương trên trời"
      },
      {
        "start": 66.45,
        "end": 77.4,
        "vi": "Twinkle twinkle little star how I wonder what you are",
        "en": "Lấp lánh lấp lánh ngôi sao nhỏ, em tự hỏi bạn là gì"
      },
      {
        "start": 77.25,
        "end": 102.5,
        "vi": "Catch a falling star and put it in your pocket and never let it fade away. Catch a falling star and put it in your pocket save it for a rainy day.",
        "en": "Đón lấy ngôi sao băng bỏ vào túi đừng để phai tàn, đón lấy ngôi sao băng bỏ vào túi để dành cho ngày mưa."
      },
      {
        "start": 102.35,
        "end": 146.0,
        "vi": "Twinkle twinkle little star how I wonder what you are up above the world so high like a diamond in the sky. Twinkle twinkle little star how I wonder what you are and oh how wonderful you are",
        "en": "Lấp lánh ngôi sao nhỏ trên bầu trời cao như viên kim cương, lấp lánh ngôi sao nhỏ ôi bạn thật tuyệt vời biết bao"
      }
    ],
    "englishTranslation": [
      "Vươn cao tay lên tận bầu trời",
      "Hãy đón lấy ngôi sao băng bỏ vào túi và đừng để nó phai nhạt đi",
      "Hãy đón lấy ngôi sao băng bỏ vào túi đừng để nó phai nhạt đi",
      "Hãy đón lấy ngôi sao băng bỏ vào túi để dành cho những ngày mưa",
      "Lấp lánh lấp lánh ngôi sao nhỏ, em tự hỏi bạn là gì, ở tít trên cao thế giới, như viên kim cương trên trời",
      "Lấp lánh lấp lánh ngôi sao nhỏ, em tự hỏi bạn là gì",
      "Đón lấy ngôi sao băng bỏ vào túi đừng để phai tàn, đón lấy ngôi sao băng bỏ vào túi để dành cho ngày mưa.",
      "Lấp lánh ngôi sao nhỏ trên bầu trời cao như viên kim cương, lấp lánh ngôi sao nhỏ ôi bạn thật tuyệt vời biết bao"
    ],
    "funFactVi": "Ngôi sao nhỏ soi sáng màn đêm khơi gợi trí tò mò của bé.",
    "audioUrl": "./assets/music/twinkle-twinkle-little-star.mp3",
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
    "cover": "./assets/music/covers/music_cover_twinkle-twinkle-little-star.webp",
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
      "(Nhạc dạo)",
      "(Nhạc dạo)",
      "(Nhạc dạo)",
      "Old MacDonald had a farm, E-I-E-I-O",
      "And on his farm he had a cow, E-I-E-I-O, With a moo-moo here and a moo-moo there, Here a moo, there a moo, everywhere a moo-moo, Old MacDonald had a farm, E-I-E-I-O",
      "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a duck, E-I-E-I-O, With a quack-quack here and a quack-quack there, Here a quack, there a quack, everywhere a quack-quack, Old MacDonald had a farm, E-I-E-I-O",
      "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had some sheep, E-I-E-I-O, With a baa-baa here and a baa-baa there, Here a baa, there a baa, everywhere a baa-baa, Old MacDonald had a farm, E-I-E-I-O",
      "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a pig, E-I-E-I-O, With an oink-oink here and an oink-oink there, Here an oink, there an oink, everywhere an oink-oink, Old MacDonald had a farm, E-I-E-I-O",
      "And on his farm he had an elephant. An elephant? Yes, an elephant! With an elephant sound here and there, Old MacDonald had a farm, E-I-E-I-O"
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 4.5,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 4.35,
        "end": 20.0,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 19.85,
        "end": 34.9,
        "vi": "(Nhạc dạo)",
        "en": "(Instrumental)"
      },
      {
        "start": 34.75,
        "end": 55.7,
        "vi": "Old MacDonald had a farm, E-I-E-I-O",
        "en": "Bác MacDonald có một trang trại, E-I-E-I-O"
      },
      {
        "start": 55.55,
        "end": 77.6,
        "vi": "And on his farm he had a cow, E-I-E-I-O, With a moo-moo here and a moo-moo there, Here a moo, there a moo, everywhere a moo-moo, Old MacDonald had a farm, E-I-E-I-O",
        "en": "Và trong trang trại bác có một chú bò, tiếng kêu ùm bò nơi nơi"
      },
      {
        "start": 77.45,
        "end": 106.0,
        "vi": "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a duck, E-I-E-I-O, With a quack-quack here and a quack-quack there, Here a quack, there a quack, everywhere a quack-quack, Old MacDonald had a farm, E-I-E-I-O",
        "en": "Trong trang trại bác có một chú vịt, tiếng kêu cạp cạp rộn ràng"
      },
      {
        "start": 105.85,
        "end": 132.1,
        "vi": "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had some sheep, E-I-E-I-O, With a baa-baa here and a baa-baa there, Here a baa, there a baa, everywhere a baa-baa, Old MacDonald had a farm, E-I-E-I-O",
        "en": "Trong trang trại bác có những chú cừu, tiếng be be khắp chốn"
      },
      {
        "start": 131.95,
        "end": 162.1,
        "vi": "Old MacDonald had a farm, E-I-E-I-O, And on his farm he had a pig, E-I-E-I-O, With an oink-oink here and an oink-oink there, Here an oink, there an oink, everywhere an oink-oink, Old MacDonald had a farm, E-I-E-I-O",
        "en": "Trong trang trại bác có một chú lợn, tiếng ủn ỉn vui tai"
      },
      {
        "start": 161.95,
        "end": 206.0,
        "vi": "And on his farm he had an elephant. An elephant? Yes, an elephant! With an elephant sound here and there, Old MacDonald had a farm, E-I-E-I-O",
        "en": "Và trong trang trại bác có cả một chú voi to lớn, E-I-E-I-O"
      }
    ],
    "englishTranslation": [
      "(Instrumental)",
      "(Instrumental)",
      "(Instrumental)",
      "Bác MacDonald có một trang trại, E-I-E-I-O",
      "Và trong trang trại bác có một chú bò, tiếng kêu ùm bò nơi nơi",
      "Trong trang trại bác có một chú vịt, tiếng kêu cạp cạp rộn ràng",
      "Trong trang trại bác có những chú cừu, tiếng be be khắp chốn",
      "Trong trang trại bác có một chú lợn, tiếng ủn ỉn vui tai",
      "Và trong trang trại bác có cả một chú voi to lớn, E-I-E-I-O"
    ],
    "funFactVi": "Làm quen tên gọi và tiếng kêu các loài động vật nông trại.",
    "audioUrl": "./assets/music/old-macdonald-had-a-farm.mp3",
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
    "cover": "./assets/music/covers/music_cover_old-macdonald-had-a-farm.webp",
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
      "The wheels on the bus go round and round, round and round, round and round.",
      "The wheels on the bus go round and round, all through the town.",
      "We'd better wait for the music.",
      "Listen, everybody, here comes the bus.",
      "The wheels on the bus go round and round, round and round, round and round.",
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
      "Here we go. The wheels on the bus go all through the town.",
      "Oh, oh, this bus is starting to go pretty fast.",
      "Hold on, here we go.",
      "The wheels on the bus go round and round, round and round, round and round, the wheels on the bus go round and round,",
      "all through the town, all through the town."
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 8.5,
        "vi": "The wheels on the bus go round and round, round and round, round and round.",
        "en": "Bánh xe buýt quay tròn tròn, tròn tròn, tròn tròn."
      },
      {
        "start": 8.5,
        "end": 9.6,
        "vi": "The wheels on the bus go round and round, all through the town.",
        "en": "Bánh xe buýt quay tròn tròn đi khắp phố phường."
      },
      {
        "start": 9.85,
        "end": 11.8,
        "vi": "We'd better wait for the music.",
        "en": "Chúng ta hãy chờ nhạc một chút nào."
      },
      {
        "start": 12.15,
        "end": 14.6,
        "vi": "Listen, everybody, here comes the bus.",
        "en": "Mọi người hãy lắng nghe xem, xe buýt đang tới rồi."
      },
      {
        "start": 19.25,
        "end": 24.0,
        "vi": "The wheels on the bus go round and round, round and round, round and round.",
        "en": "Bánh xe buýt quay tròn tròn, tròn tròn, tròn tròn."
      },
      {
        "start": 23.95,
        "end": 29.3,
        "vi": "The wheels on the bus go round and round, all through the town.",
        "en": "Bánh xe buýt quay tròn tròn đi khắp phố phường."
      },
      {
        "start": 33.25,
        "end": 43.9,
        "vi": "The door on the bus goes open and shut, open and shut, open and shut, the door on the bus goes open and shut, all through the town.",
        "en": "Cửa xe buýt mở ra rồi đóng vào đi khắp phố phường."
      },
      {
        "start": 47.65,
        "end": 58.2,
        "vi": "The money on the bus goes clink clink clink, clink clink clink, clink clink clink, the money on the bus goes clink clink clink, all through the town.",
        "en": "Tiền xu trên xe kêu leng keng keng đi khắp phố phường."
      },
      {
        "start": 61.95,
        "end": 72.3,
        "vi": "The horn on the bus goes beep beep beep, beep beep beep, beep beep beep, the horn on the bus goes beep beep beep, all through the town.",
        "en": "Còi xe buýt kêu bíp bíp bíp vang khắp phố phường."
      },
      {
        "start": 76.65,
        "end": 86.9,
        "vi": "The wipers on the bus go whoosh, whoosh, whoosh, the wipers on the bus go whoosh, whoosh, whoosh, all through the town.",
        "en": "Cần gạt nước trên xe kêu roẹt roẹt roẹt khắp phố phường."
      },
      {
        "start": 87.95,
        "end": 91.9,
        "vi": "I see that old driver.",
        "en": "Tôi nhìn thấy bác tài xế kìa."
      },
      {
        "start": 91.85,
        "end": 101.3,
        "vi": "The driver on the bus says move on back, move on back, move on back, the driver on the bus says move on back, all through the town.",
        "en": "Bác tài xế trên xe bảo xin mời lùi về sau đi khắp phố phường."
      },
      {
        "start": 105.15,
        "end": 115.7,
        "vi": "The windows on the bus go up and down, up and down, up and down, the windows on the bus go up and down, all through the town.",
        "en": "Cửa sổ trên xe kéo lên kéo xuống đi khắp phố phường."
      },
      {
        "start": 116.85,
        "end": 119.8,
        "vi": "Who else is on this bus? Oh, I see some people.",
        "en": "Còn ai trên xe buýt nữa nhỉ? Ồ, tôi thấy hành khách kìa."
      },
      {
        "start": 119.75,
        "end": 130.0,
        "vi": "People on the bus go bumpety bump, bumpety bump, bumpety bump, the people on the bus go bumpety bump, all through the town.",
        "en": "Hành khách trên xe nhấp nhô nhấp nhô đi khắp phố phường."
      },
      {
        "start": 132.55,
        "end": 144.0,
        "vi": "There the babies are. The babies on the bus go wail, wail, wail, wail, wail, wail, the babies on the bus go wail, wail, wail, all through the town.",
        "en": "Các em bé trên xe khóc oa oa oa khắp phố phường."
      },
      {
        "start": 147.95,
        "end": 159.1,
        "vi": "So the grown-ups on the bus say I love you, I love you. Yes, I do. The grown-ups on the bus say I love you, all through the town.",
        "en": "Người lớn trên xe dỗ dành yêu thương bé khắp phố phường."
      },
      {
        "start": 162.35,
        "end": 167.3,
        "vi": "Let's look around. Who else is on this bus today? Oh, I see some kitties.",
        "en": "Hãy nhìn quanh xem hôm nay còn ai trên xe nữa? Ồ, những chú mèo con."
      },
      {
        "start": 167.55,
        "end": 178.5,
        "vi": "The kitties on the bus go meow meow meow, meow meow meow, the kitties on the bus go meow meow meow, all through the town.",
        "en": "Mèo con trên xe kêu meo meo meo đi khắp phố phường."
      },
      {
        "start": 179.65,
        "end": 182.1,
        "vi": "Who else is on this bus? A doggie!",
        "en": "Còn ai trên xe nữa? Một chú cún con!"
      },
      {
        "start": 182.05,
        "end": 192.9,
        "vi": "I see a puppy! Doggie's on the bus go woof woof woof, woof woof woof, doggie's on the bus go woof woof woof, all through the town.",
        "en": "Cún con trên xe sủa gâu gâu gâu đi khắp phố phường."
      },
      {
        "start": 194.15,
        "end": 196.8,
        "vi": "Is your favorite animal riding on this bus today?",
        "en": "Động vật yêu thích của bạn có đi xe buýt hôm nay không?"
      },
      {
        "start": 197.25,
        "end": 199.4,
        "vi": "Good, let's sing about it.",
        "en": "Tuyệt lắm, hãy cùng hát lên nào."
      },
      {
        "start": 199.65,
        "end": 211.9,
        "vi": "Here we go. The wheels on the bus go all through the town.",
        "en": "Bắt đầu nào, xe buýt chạy bon bon khắp phố phường."
      },
      {
        "start": 213.25,
        "end": 217.3,
        "vi": "Oh, oh, this bus is starting to go pretty fast.",
        "en": "Ồ, xe buýt bắt đầu chạy khá nhanh rồi đấy."
      },
      {
        "start": 217.25,
        "end": 218.2,
        "vi": "Hold on, here we go.",
        "en": "Bám chắc vào nhé, đi thôi."
      },
      {
        "start": 218.25,
        "end": 225.3,
        "vi": "The wheels on the bus go round and round, round and round, round and round, the wheels on the bus go round and round,",
        "en": "Bánh xe buýt quay tròn tròn, tròn tròn, tròn tròn, bánh xe buýt quay tròn,"
      },
      {
        "start": 225.25,
        "end": 230.1,
        "vi": "all through the town, all through the town.",
        "en": "đi khắp phố phường, đi khắp phố phường."
      }
    ],
    "englishTranslation": [
      "Bánh xe buýt quay tròn tròn, tròn tròn, tròn tròn.",
      "Bánh xe buýt quay tròn tròn đi khắp phố phường.",
      "Chúng ta hãy chờ nhạc một chút nào.",
      "Mọi người hãy lắng nghe xem, xe buýt đang tới rồi.",
      "Bánh xe buýt quay tròn tròn, tròn tròn, tròn tròn.",
      "Bánh xe buýt quay tròn tròn đi khắp phố phường.",
      "Cửa xe buýt mở ra rồi đóng vào đi khắp phố phường.",
      "Tiền xu trên xe kêu leng keng keng đi khắp phố phường.",
      "Còi xe buýt kêu bíp bíp bíp vang khắp phố phường.",
      "Cần gạt nước trên xe kêu roẹt roẹt roẹt khắp phố phường.",
      "Tôi nhìn thấy bác tài xế kìa.",
      "Bác tài xế trên xe bảo xin mời lùi về sau đi khắp phố phường.",
      "Cửa sổ trên xe kéo lên kéo xuống đi khắp phố phường.",
      "Còn ai trên xe buýt nữa nhỉ? Ồ, tôi thấy hành khách kìa.",
      "Hành khách trên xe nhấp nhô nhấp nhô đi khắp phố phường.",
      "Các em bé trên xe khóc oa oa oa khắp phố phường.",
      "Người lớn trên xe dỗ dành yêu thương bé khắp phố phường.",
      "Hãy nhìn quanh xem hôm nay còn ai trên xe nữa? Ồ, những chú mèo con.",
      "Mèo con trên xe kêu meo meo meo đi khắp phố phường.",
      "Còn ai trên xe nữa? Một chú cún con!",
      "Cún con trên xe sủa gâu gâu gâu đi khắp phố phường.",
      "Động vật yêu thích của bạn có đi xe buýt hôm nay không?",
      "Tuyệt lắm, hãy cùng hát lên nào.",
      "Bắt đầu nào, xe buýt chạy bon bon khắp phố phường.",
      "Ồ, xe buýt bắt đầu chạy khá nhanh rồi đấy.",
      "Bám chắc vào nhé, đi thôi.",
      "Bánh xe buýt quay tròn tròn, tròn tròn, tròn tròn, bánh xe buýt quay tròn,",
      "đi khắp phố phường, đi khắp phố phường."
    ],
    "funFactVi": "Nhịp điệu sôi động mô phỏng chuyến xe buýt vui vẻ đến trường.",
    "audioUrl": "./assets/music/the-wheels-on-the-bus.mp3",
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
    "cover": "./assets/music/covers/music_cover_the-wheels-on-the-bus.webp",
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
        "en": "Be be, cừu hồng ơi, bạn có lông cừu không?"
      },
      {
        "start": 3.75,
        "end": 6.9,
        "vi": "No, it's not pink, sheep.",
        "en": "Không, không phải cừu hồng đâu."
      },
      {
        "start": 6.75,
        "end": 8.5,
        "vi": "It's not pink?",
        "en": "Không phải màu hồng ư?"
      },
      {
        "start": 8.35,
        "end": 10.8,
        "vi": "No. Oh, okay.",
        "en": "Không phải. Ồ, được rồi."
      },
      {
        "start": 10.65,
        "end": 15.1,
        "vi": "Baa, baa, yellow sheep, have you any wool?",
        "en": "Be be, cừu vàng ơi, bạn có lông cừu không?"
      },
      {
        "start": 14.95,
        "end": 16.8,
        "vi": "Did I mess up again?",
        "en": "Mình lại nhầm nữa rồi à?"
      },
      {
        "start": 16.65,
        "end": 20.9,
        "vi": "It's not yellow. It's black or white.",
        "en": "Không phải màu vàng. Là cừu đen hoặc cừu trắng."
      },
      {
        "start": 20.75,
        "end": 22.0,
        "vi": "Oh.",
        "en": "Ồ."
      },
      {
        "start": 21.85,
        "end": 31.9,
        "vi": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
        "en": "Cừu đen ơi có lông cừu không? Có chứ, có chứ, đầy ba túi lớn."
      },
      {
        "start": 31.75,
        "end": 36.5,
        "vi": "One for my master, one for my dame.",
        "en": "Một túi cho ông chủ, một túi cho bà chủ."
      },
      {
        "start": 36.35,
        "end": 41.2,
        "vi": "One for the boy and girl that live down the lane.",
        "en": "Một túi cho cậu bé và cô bé sống dưới con đường kia."
      },
      {
        "start": 41.05,
        "end": 50.1,
        "vi": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
        "en": "Cừu đen ơi có lông cừu không? Có chứ, có chứ, đầy ba túi lớn."
      },
      {
        "start": 63.25,
        "end": 72.3,
        "vi": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full.",
        "en": "Cừu đen ơi có lông cừu không? Có chứ, có chứ, đầy ba túi lớn."
      },
      {
        "start": 72.15,
        "end": 77.0,
        "vi": "One for my master, one for my dame.",
        "en": "Một túi cho ông chủ, một túi cho bà chủ."
      },
      {
        "start": 76.85,
        "end": 81.8,
        "vi": "One for the boy and girl that live down the lane.",
        "en": "Một túi cho cậu bé và cô bé sống dưới con đường kia."
      },
      {
        "start": 81.65,
        "end": 96.9,
        "vi": "Baa, baa, black sheep, have you any wool? Yes, sir, yes, sir, three bags full. Yes, sir, yes, sir, three bags full.",
        "en": "Cừu đen ơi có lông cừu không? Vâng ạ, vâng ạ, đầy ba túi lớn."
      }
    ],
    "englishTranslation": [
      "Be be, cừu hồng ơi, bạn có lông cừu không?",
      "Không, không phải cừu hồng đâu.",
      "Không phải màu hồng ư?",
      "Không phải. Ồ, được rồi.",
      "Be be, cừu vàng ơi, bạn có lông cừu không?",
      "Mình lại nhầm nữa rồi à?",
      "Không phải màu vàng. Là cừu đen hoặc cừu trắng.",
      "Ồ.",
      "Cừu đen ơi có lông cừu không? Có chứ, có chứ, đầy ba túi lớn.",
      "Một túi cho ông chủ, một túi cho bà chủ.",
      "Một túi cho cậu bé và cô bé sống dưới con đường kia.",
      "Cừu đen ơi có lông cừu không? Có chứ, có chứ, đầy ba túi lớn.",
      "Cừu đen ơi có lông cừu không? Có chứ, có chứ, đầy ba túi lớn.",
      "Một túi cho ông chủ, một túi cho bà chủ.",
      "Một túi cho cậu bé và cô bé sống dưới con đường kia.",
      "Cừu đen ơi có lông cừu không? Vâng ạ, vâng ạ, đầy ba túi lớn."
    ],
    "funFactVi": "Bài học chia sẻ len ấm áp cho mọi người xung quanh.",
    "audioUrl": "./assets/music/baa-baa-black-sheep.mp3",
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
    "cover": "./assets/music/covers/music_cover_baa-baa-black-sheep.webp",
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
        "en": "Nếu bạn vui và biết điều đó, hãy vỗ tay nào"
      },
      {
        "start": 4.95,
        "end": 7.7,
        "vi": "If you're happy and you know it, clap your hands",
        "en": "Nếu bạn vui và biết điều đó, hãy vỗ tay nào"
      },
      {
        "start": 8.15,
        "end": 14.3,
        "vi": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, clap your hands",
        "en": "Nếu bạn vui khuôn mặt bạn sẽ rạng rỡ, hãy vỗ tay nào"
      },
      {
        "start": 15.15,
        "end": 17.9,
        "vi": "If you're happy and you know it, pat your knees",
        "en": "Nếu bạn vui và biết điều đó, hãy vỗ nhẹ đầu gối"
      },
      {
        "start": 18.35,
        "end": 21.3,
        "vi": "If you're happy and you know it, pat your knees",
        "en": "Nếu bạn vui và biết điều đó, hãy vỗ nhẹ đầu gối"
      },
      {
        "start": 21.65,
        "end": 28.1,
        "vi": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, pat your knees",
        "en": "Nếu bạn vui khuôn mặt bạn sẽ rạng rỡ, hãy vỗ nhẹ đầu gối"
      },
      {
        "start": 28.65,
        "end": 29.8,
        "vi": "clap your hands",
        "en": "vỗ tay nào"
      },
      {
        "start": 29.75,
        "end": 32.7,
        "vi": "If you're mad and you know it, stomp your feet",
        "en": "Nếu bạn bực bội và nhận ra điều đó, hãy giậm chân"
      },
      {
        "start": 33.15,
        "end": 36.1,
        "vi": "If you're mad and you know it, stomp your feet",
        "en": "Nếu bạn bực bội và nhận ra điều đó, hãy giậm chân"
      },
      {
        "start": 36.45,
        "end": 43.3,
        "vi": "If you're mad and you know it, your face will surely show it. If you're mad and you know it, stomp your feet",
        "en": "Khuôn mặt bạn sẽ thể hiện ra, hãy giậm chân"
      },
      {
        "start": 43.55,
        "end": 44.7,
        "vi": "pat your knees",
        "en": "vỗ nhẹ đầu gối"
      },
      {
        "start": 44.55,
        "end": 46.4,
        "vi": "clap your hands",
        "en": "vỗ tay nào"
      },
      {
        "start": 47.15,
        "end": 50.0,
        "vi": "If you're happy and you know it, beep your nose, beep beep",
        "en": "Nếu bạn vui và biết điều đó, hãy bóp mũi kêu bíp bíp"
      },
      {
        "start": 50.35,
        "end": 53.4,
        "vi": "If you're happy and you know it, beep your nose, beep beep",
        "en": "Nếu bạn vui và biết điều đó, hãy bóp mũi kêu bíp bíp"
      },
      {
        "start": 53.75,
        "end": 60.6,
        "vi": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, beep your nose, beep beep",
        "en": "Nếu bạn vui hãy bóp mũi kêu bíp bíp"
      },
      {
        "start": 60.55,
        "end": 62.5,
        "vi": "stomp your feet, stomp stomp",
        "en": "giậm chân nào, rầm rầm"
      },
      {
        "start": 62.35,
        "end": 63.9,
        "vi": "pat your knees, pat pat",
        "en": "vỗ đầu gối, bộp bộp"
      },
      {
        "start": 63.75,
        "end": 65.5,
        "vi": "clap your hands",
        "en": "vỗ tay nào"
      },
      {
        "start": 65.85,
        "end": 72.3,
        "vi": "If you're happy and you know it, shout hooray, hooray!",
        "en": "Nếu bạn vui và biết điều đó, hãy hô to hoan hô!"
      },
      {
        "start": 72.25,
        "end": 78.9,
        "vi": "If you're happy and you know it, shout hooray, hooray!",
        "en": "Nếu bạn vui và biết điều đó, hãy hô to hoan hô!"
      },
      {
        "start": 78.9,
        "end": 79.0,
        "vi": "If you're happy and you know it, your face will surely show it. If you're happy and you know it, shout hooray, hooray!",
        "en": "Nếu bạn vui hãy hô to hoan hô, hoan hô!"
      },
      {
        "start": 79.25,
        "end": 81.0,
        "vi": "beep your nose, beep beep",
        "en": "bóp mũi bíp bíp"
      },
      {
        "start": 80.85,
        "end": 82.5,
        "vi": "stomp your feet, stomp stomp",
        "en": "giậm chân rầm rầm"
      },
      {
        "start": 82.35,
        "end": 83.9,
        "vi": "pat your knees",
        "en": "vỗ nhẹ đầu gối"
      },
      {
        "start": 83.75,
        "end": 85.8,
        "vi": "clap your hands",
        "en": "vỗ tay nào"
      },
      {
        "start": 85.95,
        "end": 87.7,
        "vi": "shout hooray, hooray!",
        "en": "hô vang hoan hô!"
      }
    ],
    "englishTranslation": [
      "Nếu bạn vui và biết điều đó, hãy vỗ tay nào",
      "Nếu bạn vui và biết điều đó, hãy vỗ tay nào",
      "Nếu bạn vui khuôn mặt bạn sẽ rạng rỡ, hãy vỗ tay nào",
      "Nếu bạn vui và biết điều đó, hãy vỗ nhẹ đầu gối",
      "Nếu bạn vui và biết điều đó, hãy vỗ nhẹ đầu gối",
      "Nếu bạn vui khuôn mặt bạn sẽ rạng rỡ, hãy vỗ nhẹ đầu gối",
      "vỗ tay nào",
      "Nếu bạn bực bội và nhận ra điều đó, hãy giậm chân",
      "Nếu bạn bực bội và nhận ra điều đó, hãy giậm chân",
      "Khuôn mặt bạn sẽ thể hiện ra, hãy giậm chân",
      "vỗ nhẹ đầu gối",
      "vỗ tay nào",
      "Nếu bạn vui và biết điều đó, hãy bóp mũi kêu bíp bíp",
      "Nếu bạn vui và biết điều đó, hãy bóp mũi kêu bíp bíp",
      "Nếu bạn vui hãy bóp mũi kêu bíp bíp",
      "giậm chân nào, rầm rầm",
      "vỗ đầu gối, bộp bộp",
      "vỗ tay nào",
      "Nếu bạn vui và biết điều đó, hãy hô to hoan hô!",
      "Nếu bạn vui và biết điều đó, hãy hô to hoan hô!",
      "Nếu bạn vui hãy hô to hoan hô, hoan hô!",
      "bóp mũi bíp bíp",
      "giậm chân rầm rầm",
      "vỗ nhẹ đầu gối",
      "vỗ tay nào",
      "hô vang hoan hô!"
    ],
    "funFactVi": "Khích lệ bé bộc lộ cảm xúc vui tươi bằng cử chỉ tay chân.",
    "audioUrl": "./assets/music/if-youre-happy-and-you-know-it.mp3",
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
    "cover": "./assets/music/covers/music_cover_if-youre-happy-and-you-know-it.webp",
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
      { "start": 4.95, "end": 8.8, "vi": "Row, row, row your boat gently down the stream", "en": "Chèo, chèo, chèo thuyền nhẹ trôi theo dòng suối" },
      { "start": 8.95, "end": 13.0, "vi": "Merrily, merrily, merrily, merrily, life is but a dream", "en": "Vui tươi, vui tươi, vui tươi, vui tươi, cuộc đời tựa giấc mơ" },
      { "start": 17.25, "end": 21.0, "vi": "Row, row, row your boat gently down the stream", "en": "Chèo, chèo, chèo thuyền nhẹ trôi theo dòng suối" },
      { "start": 21.25, "end": 25.5, "vi": "Merrily, merrily, merrily, merrily, life is but a dream", "en": "Vui tươi, vui tươi, vui tươi, vui tươi, cuộc đời tựa giấc mơ" }
    ],
    "englishTranslation": [
      "Chèo, chèo, chèo thuyền nhẹ trôi theo dòng suối. Vui tươi, vui tươi, vui tươi, vui tươi, cuộc đời tựa giấc mơ.",
      "Chèo, chèo, chèo thuyền nhẹ trôi theo dòng suối. Vui tươi, vui tươi, vui tươi, vui tươi, cuộc đời tựa giấc mơ."
    ],
    "funFactVi": "Giai điệu êm đềm dạy bé vượt qua dòng nước nhẹ nhàng.",
    "audioUrl": "./assets/music/row-row-row-your-boat.mp3",
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
    "cover": "./assets/music/covers/music_cover_row-row-row-your-boat.webp",
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
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 6.45,
        "end": 11.3,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 12.85,
        "end": 18.9,
        "vi": "Eyes and ears and mouth and nose",
        "en": "Mắt và tai và miệng và mũi"
      },
      {
        "start": 19.25,
        "end": 23.9,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 26.15,
        "end": 30.4,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 32.25,
        "end": 37.0,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 38.65,
        "end": 44.7,
        "vi": "Eyes and ears and mouth and nose",
        "en": "Mắt và tai và miệng và mũi"
      },
      {
        "start": 45.15,
        "end": 49.8,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 81.75,
        "end": 87.7,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 90.35,
        "end": 95.8,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 97.85,
        "end": 103.7,
        "vi": "Eyes and ears and mouth and nose",
        "en": "Mắt và tai và miệng và mũi"
      },
      {
        "start": 104.15,
        "end": 108.8,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 109.95,
        "end": 114.6,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 115.45,
        "end": 120.0,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      },
      {
        "start": 120.65,
        "end": 125.7,
        "vi": "Eyes and ears and mouth and nose",
        "en": "Mắt và tai và miệng và mũi"
      },
      {
        "start": 126.35,
        "end": 131.8,
        "vi": "Head, shoulders, knees and toes",
        "en": "Đầu, vai, đầu gối và ngón chân"
      }
    ],
    "englishTranslation": [
      "Đầu, vai, đầu gối và ngón chân",
      "Đầu, vai, đầu gối và ngón chân",
      "Mắt và tai và miệng và mũi",
      "Đầu, vai, đầu gối và ngón chân",
      "Đầu, vai, đầu gối và ngón chân",
      "Đầu, vai, đầu gối và ngón chân",
      "Mắt và tai và miệng và mũi",
      "Đầu, vai, đầu gối và ngón chân",
      "Đầu, vai, đầu gối và ngón chân",
      "Đầu, vai, đầu gối và ngón chân",
      "Mắt và tai và miệng và mũi",
      "Đầu, vai, đầu gối và ngón chân",
      "Đầu, vai, đầu gối và ngón chân",
      "Đầu, vai, đầu gối và ngón chân",
      "Mắt và tai và miệng và mũi",
      "Đầu, vai, đầu gối và ngón chân"
    ],
    "funFactVi": "Vừa hát vừa chạm đúng bộ phận cơ thể để tăng phản xạ.",
    "audioUrl": "./assets/music/head-shoulders-knees-and-toes.mp3",
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
    "cover": "./assets/music/covers/music_cover_head-shoulders-knees-and-toes.webp",
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
        "en": "Năm chú khỉ con nhảy nhót trên giường"
      },
      {
        "start": 7.25,
        "end": 11.1,
        "vi": "One fell off and bumped his head",
        "en": "Một chú ngã xuống và cộc đầu"
      },
      {
        "start": 14.65,
        "end": 22.5,
        "vi": "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
        "en": "Mẹ gọi bác sĩ và bác sĩ bảo: Không cho khỉ con nhảy trên giường nữa"
      },
      {
        "start": 25.65,
        "end": 29.4,
        "vi": "Four little monkeys jumping on the bed",
        "en": "Bốn chú khỉ con nhảy nhót trên giường"
      },
      {
        "start": 29.25,
        "end": 32.8,
        "vi": "One fell off and bumped his head",
        "en": "Một chú ngã xuống và cộc đầu"
      },
      {
        "start": 36.55,
        "end": 43.7,
        "vi": "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
        "en": "Mẹ gọi bác sĩ và bác sĩ bảo: Không cho khỉ con nhảy trên giường nữa"
      },
      {
        "start": 47.65,
        "end": 51.3,
        "vi": "Three little monkeys jumping on the bed",
        "en": "Ba chú khỉ con nhảy nhót trên giường"
      },
      {
        "start": 51.15,
        "end": 55.1,
        "vi": "One fell off and bumped his head",
        "en": "Một chú ngã xuống và cộc đầu"
      },
      {
        "start": 58.65,
        "end": 66.1,
        "vi": "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
        "en": "Mẹ gọi bác sĩ và bác sĩ bảo: Không cho khỉ con nhảy trên giường nữa"
      },
      {
        "start": 69.75,
        "end": 73.6,
        "vi": "Two little monkeys jumping on the bed",
        "en": "Hai chú khỉ con nhảy nhót trên giường"
      },
      {
        "start": 73.45,
        "end": 77.4,
        "vi": "One fell off and bumped his head",
        "en": "Một chú ngã xuống và cộc đầu"
      },
      {
        "start": 80.85,
        "end": 88.1,
        "vi": "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
        "en": "Mẹ gọi bác sĩ và bác sĩ bảo: Không cho khỉ con nhảy trên giường nữa"
      },
      {
        "start": 91.75,
        "end": 95.6,
        "vi": "One little monkey jumping on the bed",
        "en": "Một chú khỉ con nhảy nhót trên giường"
      },
      {
        "start": 95.45,
        "end": 99.4,
        "vi": "He fell off and bumped his head",
        "en": "Chú ngã xuống và cộc đầu"
      },
      {
        "start": 106.75,
        "end": 114.6,
        "vi": "Mama called the doctor and the doctor said No more monkeys jumping on the bed",
        "en": "Mẹ gọi bác sĩ và bác sĩ bảo: Không cho khỉ con nhảy trên giường nữa"
      }
    ],
    "englishTranslation": [
      "Năm chú khỉ con nhảy nhót trên giường",
      "Một chú ngã xuống và cộc đầu",
      "Mẹ gọi bác sĩ và bác sĩ bảo: Không cho khỉ con nhảy trên giường nữa",
      "Bốn chú khỉ con nhảy nhót trên giường",
      "Một chú ngã xuống và cộc đầu",
      "Mẹ gọi bác sĩ và bác sĩ bảo: Không cho khỉ con nhảy trên giường nữa",
      "Ba chú khỉ con nhảy nhót trên giường",
      "Một chú ngã xuống và cộc đầu",
      "Mẹ gọi bác sĩ và bác sĩ bảo: Không cho khỉ con nhảy trên giường nữa",
      "Hai chú khỉ con nhảy nhót trên giường",
      "Một chú ngã xuống và cộc đầu",
      "Mẹ gọi bác sĩ và bác sĩ bảo: Không cho khỉ con nhảy trên giường nữa",
      "Một chú khỉ con nhảy nhót trên giường",
      "Chú ngã xuống và cộc đầu",
      "Mẹ gọi bác sĩ và bác sĩ bảo: Không cho khỉ con nhảy trên giường nữa"
    ],
    "funFactVi": "Dạy bé đếm lùi số lượng và nhắc nhở an toàn khi chơi.",
    "audioUrl": "./assets/music/five-little-monkeys.mp3",
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
    "cover": "./assets/music/covers/music_cover_five-little-monkeys.webp",
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
        "en": "Cá mập con, đu-đu đu-đu-đu-đu"
      },
      {
        "start": 35.95,
        "end": 44.3,
        "vi": "Mommy shark, doo-doo, doo-doo-doo-doo",
        "en": "Cá mập mẹ, đu-đu đu-đu-đu-đu"
      },
      {
        "start": 44.35,
        "end": 52.7,
        "vi": "Daddy shark, doo-doo, doo-doo-doo-doo",
        "en": "Cá mập bố, đu-đu đu-đu-đu-đu"
      },
      {
        "start": 52.75,
        "end": 60.9,
        "vi": "Grandma shark, doo-doo, doo-doo-doo-doo",
        "en": "Cá mập bà, đu-đu đu-đu-đu-đu"
      },
      {
        "start": 61.15,
        "end": 69.5,
        "vi": "Grandpa shark, doo-doo, doo-doo-doo-doo",
        "en": "Cá mập ông, đu-đu đu-đu-đu-đu"
      },
      {
        "start": 69.75,
        "end": 77.9,
        "vi": "Let's go hunt, doo-doo, doo-doo-doo-doo",
        "en": "Đi săn mồi nào, đu-đu đu-đu-đu-đu"
      },
      {
        "start": 78.05,
        "end": 86.5,
        "vi": "Run away, doo-doo, doo-doo-doo-doo",
        "en": "Chạy mau thôi, đu-đu đu-đu-đu-đu"
      },
      {
        "start": 87.55,
        "end": 95.7,
        "vi": "Safe at last, doo-doo, doo-doo-doo-doo",
        "en": "An toàn rồi, đu-đu đu-đu-đu-đu"
      },
      {
        "start": 95.85,
        "end": 104.4,
        "vi": "It's the end, doo-doo, doo-doo-doo-doo",
        "en": "Hết bài rồi, đu-đu đu-đu-đu-đu"
      },
      {
        "start": 108.15,
        "end": 117.7,
        "vi": "Twinkle, twinkle little star, how I wonder what you are",
        "en": "Lấp lánh lấp lánh ngôi sao nhỏ, em tự hỏi bạn là ai"
      }
    ],
    "englishTranslation": [
      "Cá mập con, đu-đu đu-đu-đu-đu",
      "Cá mập mẹ, đu-đu đu-đu-đu-đu",
      "Cá mập bố, đu-đu đu-đu-đu-đu",
      "Cá mập bà, đu-đu đu-đu-đu-đu",
      "Cá mập ông, đu-đu đu-đu-đu-đu",
      "Đi săn mồi nào, đu-đu đu-đu-đu-đu",
      "Chạy mau thôi, đu-đu đu-đu-đu-đu",
      "An toàn rồi, đu-đu đu-đu-đu-đu",
      "Hết bài rồi, đu-đu đu-đu-đu-đu",
      "Lấp lánh lấp lánh ngôi sao nhỏ, em tự hỏi bạn là ai"
    ],
    "funFactVi": "Vũ điệu cá mập sôi động cả nhà cùng nhún nhảy theo nhịp.",
    "audioUrl": "./assets/music/baby-shark.mp3",
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
    "cover": "./assets/music/covers/music_cover_baby-shark.webp",
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
        "en": "Có một bác nông dân nuôi chú chó tên là Bingo."
      },
      {
        "start": 12.65,
        "end": 19.8,
        "vi": "B-I-N-G-O, B-I-N-G-O, B-I-N-G-O and Bingo was his name o.",
        "en": "B-I-N-G-O, B-I-N-G-O, B-I-N-G-O và tên chú chó là Bingo."
      },
      {
        "start": 24.25,
        "end": 28.9,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "Có một bác nông dân nuôi chú chó tên là Bingo."
      },
      {
        "start": 29.65,
        "end": 36.8,
        "vi": "(clap)-I-N-G-O, (clap)-I-N-G-O, (clap)-I-N-G-O and Bingo was his name o.",
        "en": "(vỗ tay)-I-N-G-O và tên chú chó là Bingo."
      },
      {
        "start": 41.05,
        "end": 45.9,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "Có một bác nông dân nuôi chú chó tên là Bingo."
      },
      {
        "start": 46.65,
        "end": 53.6,
        "vi": "(clap)-(clap)-N-G-O, (clap)-(clap)-N-G-O, (clap)-(clap)-N-G-O and Bingo was his name o.",
        "en": "(vỗ tay)-(vỗ tay)-N-G-O và tên chú chó là Bingo."
      },
      {
        "start": 57.55,
        "end": 62.1,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "Có một bác nông dân nuôi chú chó tên là Bingo."
      },
      {
        "start": 62.95,
        "end": 70.0,
        "vi": "(clap)-(clap)-(clap)-G-O, (clap)-(clap)-(clap)-G-O, (clap)-(clap)-(clap)-G-O and Bingo was his name o.",
        "en": "(vỗ tay 3 lần)-G-O và tên chú chó là Bingo."
      },
      {
        "start": 74.15,
        "end": 78.7,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "Có một bác nông dân nuôi chú chó tên là Bingo."
      },
      {
        "start": 79.65,
        "end": 86.6,
        "vi": "(clap)-(clap)-(clap)-(clap)-O, (clap)-(clap)-(clap)-(clap)-O, (clap)-(clap)-(clap)-(clap)-O and Bingo was his name o.",
        "en": "(vỗ tay 4 lần)-O và tên chú chó là Bingo."
      },
      {
        "start": 90.65,
        "end": 95.3,
        "vi": "There was a farmer had a dog and Bingo was his name o.",
        "en": "Có một bác nông dân nuôi chú chó tên là Bingo."
      }
    ],
    "englishTranslation": [
      "Có một bác nông dân nuôi chú chó tên là Bingo.",
      "B-I-N-G-O, B-I-N-G-O, B-I-N-G-O và tên chú chó là Bingo.",
      "Có một bác nông dân nuôi chú chó tên là Bingo.",
      "(vỗ tay)-I-N-G-O và tên chú chó là Bingo.",
      "Có một bác nông dân nuôi chú chó tên là Bingo.",
      "(vỗ tay)-(vỗ tay)-N-G-O và tên chú chó là Bingo.",
      "Có một bác nông dân nuôi chú chó tên là Bingo.",
      "(vỗ tay 3 lần)-G-O và tên chú chó là Bingo.",
      "Có một bác nông dân nuôi chú chó tên là Bingo.",
      "(vỗ tay 4 lần)-O và tên chú chó là Bingo.",
      "Có một bác nông dân nuôi chú chó tên là Bingo."
    ],
    "funFactVi": "Học đánh vần từng chữ cái vui nhộn cùng chú cún Bingo.",
    "audioUrl": "./assets/music/bingo-dog-song.mp3",
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
    "cover": "./assets/music/covers/music_cover_bingo-dog-song.webp",
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
      "(Music Interlude)",
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
        "en": "Mary có một chú cừu non, bộ lông cừu trắng như tuyết."
      },
      {
        "start": 12.85,
        "end": 27.9,
        "vi": "(Music Interlude)",
        "en": "(Đoạn nhạc chuyển tiếp)"
      },
      {
        "start": 27.75,
        "end": 41.2,
        "vi": "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow.",
        "en": "Mary có một chú cừu non, bộ lông cừu trắng như tuyết."
      },
      {
        "start": 41.05,
        "end": 57.6,
        "vi": "Everywhere that Mary went, Mary went, Mary went. Everywhere that Mary went, that lamb was sure to go.",
        "en": "Bất cứ nơi nào Mary đi, chú cừu non đều đi theo sau."
      },
      {
        "start": 57.45,
        "end": 73.5,
        "vi": "Followed her to school one day, school one day, school one day. Followed her to school one day, which was against the rule.",
        "en": "Một hôm cừu theo Mary tới trường, điều đó trái với nội quy."
      },
      {
        "start": 73.35,
        "end": 89.6,
        "vi": "Made the children laugh and play, laugh and play, laugh and play. Made the children laugh and play, to see a lamb at school.",
        "en": "Khiến lũ trẻ cười đùa thích thú khi thấy cừu ở trường."
      },
      {
        "start": 89.45,
        "end": 106.5,
        "vi": "And so the teacher turned it out, turned it out, turned it out, and so the teacher turned it out, it was against the rule.",
        "en": "Và cô giáo phải dắt cừu ra ngoài vì trái nội quy."
      },
      {
        "start": 106.35,
        "end": 121.3,
        "vi": "Why does a lamb love Mary so? Mary so, Mary so? Why does a lamb love Mary so? The eager children cry.",
        "en": "Tại sao cừu lại yêu Mary đến thế? Lũ trẻ háo hức hỏi."
      },
      {
        "start": 121.15,
        "end": 138.8,
        "vi": "Because Mary loves a lamb you know, lamb you know, lamb you know, because Mary loves the lamb you know that teacher did reply.",
        "en": "Vì Mary rất yêu chú cừu non, cô giáo dịu dàng trả lời."
      },
      {
        "start": 138.65,
        "end": 162.0,
        "vi": "Mary had a little lamb, little lamb, little lamb. Mary had a little lamb, its fleece was white as snow. Its fleece was white as snow.",
        "en": "Mary có một chú cừu non với bộ lông trắng như tuyết."
      }
    ],
    "englishTranslation": [
      "Mary có một chú cừu non, bộ lông cừu trắng như tuyết.",
      "(Đoạn nhạc chuyển tiếp)",
      "Mary có một chú cừu non, bộ lông cừu trắng như tuyết.",
      "Bất cứ nơi nào Mary đi, chú cừu non đều đi theo sau.",
      "Một hôm cừu theo Mary tới trường, điều đó trái với nội quy.",
      "Khiến lũ trẻ cười đùa thích thú khi thấy cừu ở trường.",
      "Và cô giáo phải dắt cừu ra ngoài vì trái nội quy.",
      "Tại sao cừu lại yêu Mary đến thế? Lũ trẻ háo hức hỏi.",
      "Vì Mary rất yêu chú cừu non, cô giáo dịu dàng trả lời.",
      "Mary có một chú cừu non với bộ lông trắng như tuyết."
    ],
    "funFactVi": "Tình bạn gắn bó thân thiết giữa cô bé Mary và chú cừu.",
    "audioUrl": "./assets/music/mary-had-a-little-lamb.mp3",
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
    "cover": "./assets/music/covers/music_cover_mary-had-a-little-lamb.webp",
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
        "en": "Mưa ơi hãy đi đi, hôm khác lại đến nhé, các bạn của Barney muốn vui chơi, mưa ơi hãy đi đi."
      },
      {
        "start": 16.65,
        "end": 26.5,
        "vi": "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away.",
        "en": "Mưa ơi hãy đi đi, hôm khác lại đến nhé, các bạn của Barney muốn vui chơi, mưa ơi hãy đi đi."
      },
      {
        "start": 31.25,
        "end": 40.9,
        "vi": "Rain, rain, go away, come again another day, Barney's friends all want to play, rain, rain, go away.",
        "en": "Mưa ơi hãy đi đi, hôm khác lại đến nhé, các bạn của Barney muốn vui chơi, mưa ơi hãy đi đi."
      }
    ],
    "englishTranslation": [
      "Mưa ơi hãy đi đi, hôm khác lại đến nhé, các bạn của Barney muốn vui chơi, mưa ơi hãy đi đi.",
      "Mưa ơi hãy đi đi, hôm khác lại đến nhé, các bạn của Barney muốn vui chơi, mưa ơi hãy đi đi.",
      "Mưa ơi hãy đi đi, hôm khác lại đến nhé, các bạn của Barney muốn vui chơi, mưa ơi hãy đi đi."
    ],
    "funFactVi": "Lời ước ngày nắng ấm để bé được ra sân chơi đùa.",
    "audioUrl": "./assets/music/rain-rain-go-away.mp3",
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
    "cover": "./assets/music/covers/music_cover_rain-rain-go-away.webp",
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
        "en": "Hickory, dickory, dock, chú chuột chạy lên đồng hồ, đồng hồ điểm một tiếng, chú chuột chạy tót xuống."
      },
      {
        "start": 28.25,
        "end": 37.3,
        "vi": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, And down he run, Hickory, dickory, dock.",
        "en": "Hickory, dickory, dock, chú chuột chạy lên đồng hồ, đồng hồ điểm một tiếng, chú liền chạy xuống."
      },
      {
        "start": 42.35,
        "end": 50.0,
        "vi": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, The mouse ran down, Hickory, dickory, dock.",
        "en": "Hickory, dickory, dock, chú chuột chạy lên đồng hồ, đồng hồ điểm một tiếng, chú chuột chạy tót xuống."
      },
      {
        "start": 64.75,
        "end": 73.3,
        "vi": "Hickory, dickory, dock, The mouse ran up the clock, The clock struck one, And down he run, Hickory, dickory, dock.",
        "en": "Hickory, dickory, dock, chú chuột chạy lên đồng hồ, đồng hồ điểm một tiếng, chú liền chạy xuống."
      }
    ],
    "englishTranslation": [
      "Hickory, dickory, dock, chú chuột chạy lên đồng hồ, đồng hồ điểm một tiếng, chú chuột chạy tót xuống.",
      "Hickory, dickory, dock, chú chuột chạy lên đồng hồ, đồng hồ điểm một tiếng, chú liền chạy xuống.",
      "Hickory, dickory, dock, chú chuột chạy lên đồng hồ, đồng hồ điểm một tiếng, chú chuột chạy tót xuống.",
      "Hickory, dickory, dock, chú chuột chạy lên đồng hồ, đồng hồ điểm một tiếng, chú liền chạy xuống."
    ],
    "funFactVi": "Làm quen với mặt đồng hồ và nhịp tích tắc thời gian.",
    "audioUrl": "./assets/music/hickory-dickory-dock.mp3",
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
    "cover": "./assets/music/covers/music_cover_hickory-dickory-dock.webp",
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
        "en": "Em là ánh nắng của anh, là ánh nắng duy nhất."
      },
      {
        "start": 27.95,
        "end": 33.7,
        "vi": "You make me happy, when skies are grey.",
        "en": "Em khiến anh hạnh phúc khi bầu trời u xám."
      },
      {
        "start": 33.55,
        "end": 39.5,
        "vi": "You'll never know, dear, how much I love you.",
        "en": "Em yêu ơi, em sẽ chẳng bao giờ biết anh yêu em nhiều thế nào."
      },
      {
        "start": 39.35,
        "end": 44.8,
        "vi": "Please don't take my sunshine away.",
        "en": "Xin đừng mang ánh nắng của anh đi mất."
      },
      {
        "start": 44.65,
        "end": 55.9,
        "vi": "The other night, dear, when I lay sleeping,",
        "en": "Đêm nọ em yêu ơi, khi anh đang say ngủ,"
      },
      {
        "start": 55.75,
        "end": 67.1,
        "vi": "I dreamed I held you in my arms, when I awoke, dear, I was mistaken,",
        "en": "Anh mơ thấy mình ôm em trong tay, khi tỉnh giấc anh mới hay mình lầm,"
      },
      {
        "start": 66.95,
        "end": 72.7,
        "vi": "So I hung my head and cried.",
        "en": "Nên anh đã cúi đầu và bật khóc."
      },
      {
        "start": 72.55,
        "end": 78.2,
        "vi": "You are my sunshine, my only sunshine.",
        "en": "Em là ánh nắng của anh, là ánh nắng duy nhất."
      },
      {
        "start": 78.05,
        "end": 83.9,
        "vi": "You make me happy, when skies are grey.",
        "en": "Em khiến anh hạnh phúc khi bầu trời u xám."
      },
      {
        "start": 83.75,
        "end": 89.3,
        "vi": "You'll never know, dear, how much I love you.",
        "en": "Em yêu ơi, em sẽ chẳng bao giờ biết anh yêu em nhiều thế nào."
      },
      {
        "start": 89.15,
        "end": 133.6,
        "vi": "Please don't take my sunshine away.",
        "en": "Xin đừng mang ánh nắng của anh đi mất."
      },
      {
        "start": 133.45,
        "end": 161.0,
        "vi": "Please don't take my sunshine away.",
        "en": "Xin đừng mang ánh nắng của anh đi mất."
      }
    ],
    "englishTranslation": [
      "Em là ánh nắng của anh, là ánh nắng duy nhất.",
      "Em khiến anh hạnh phúc khi bầu trời u xám.",
      "Em yêu ơi, em sẽ chẳng bao giờ biết anh yêu em nhiều thế nào.",
      "Xin đừng mang ánh nắng của anh đi mất.",
      "Đêm nọ em yêu ơi, khi anh đang say ngủ,",
      "Anh mơ thấy mình ôm em trong tay, khi tỉnh giấc anh mới hay mình lầm,",
      "Nên anh đã cúi đầu và bật khóc.",
      "Em là ánh nắng của anh, là ánh nắng duy nhất.",
      "Em khiến anh hạnh phúc khi bầu trời u xám.",
      "Em yêu ơi, em sẽ chẳng bao giờ biết anh yêu em nhiều thế nào.",
      "Xin đừng mang ánh nắng của anh đi mất.",
      "Xin đừng mang ánh nắng của anh đi mất."
    ],
    "funFactVi": "Bày tỏ tình thương yêu vô bờ bến cha mẹ dành cho con.",
    "audioUrl": "./assets/music/you-are-my-sunshine.mp3",
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
    "cover": "./assets/music/covers/music_cover_you-are-my-sunshine.webp",
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
      "(Nhạc không lời)",
      "(Nhạc không lời)"
    ],
    "lyricsData": [
      {
        "start": 0.0,
        "end": 17.3,
        "vi": "(Nhạc không lời)",
        "en": "(Instrumental)"
      },
      {
        "start": 17.15,
        "end": 30.0,
        "vi": "(Nhạc không lời)",
        "en": "(Instrumental)"
      }
    ],
    "englishTranslation": [
      "(Instrumental)",
      "(Instrumental)"
    ],
    "funFactVi": "Ba chú mèo con biết nhận lỗi và tìm lại găng tay.",
    "audioUrl": "./assets/music/three-little-kittens.ogg",
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
    "cover": "./assets/music/covers/music_cover_three-little-kittens.webp",
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
      { "start": 0.65, "end": 3.45, "en": "Nửa cân gạo hai xu,", "vi": "Half a pound of tuppenny rice," },
      { "start": 3.41, "end": 6.35, "en": "Nửa cân mật mía,", "vi": "Half a pound of treacle," },
      { "start": 6.30, "end": 9.90, "en": "Tiền cứ thế mà bay đi,", "vi": "That's the way the money goes," },
      { "start": 10.45, "end": 13.20, "en": "Bụp! Chồn cầy nhảy ra.", "vi": "Pop! Goes the weasel." }
    ],
    "englishTranslation": [
      "Nửa cân gạo hai xu,",
      "Nửa cân mật mía,",
      "Tiền cứ thế mà bay đi,",
      "Bụp! Chồn cầy nhảy ra."
    ],
    "funFactVi": "Trò chơi hộp nhạc bất ngờ mang lại tiếng cười sảng khoái.",
    "audioUrl": "./assets/music/pop-goes-the-weasel.mp3",
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
    "cover": "./assets/music/covers/music_cover_pop-goes-the-weasel.webp",
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
        "en": "Bánh chữ thập nóng hổi, bánh chữ thập nóng hổi"
      },
      {
        "start": 13.25,
        "end": 17.8,
        "vi": "One a penny, two a penny, hot cross buns",
        "en": "Một xu một chiếc, một xu hai chiếc, bánh chữ thập"
      },
      {
        "start": 17.85,
        "end": 22.0,
        "vi": "Hot cross buns, hot cross buns",
        "en": "Bánh chữ thập nóng hổi, bánh chữ thập nóng hổi"
      },
      {
        "start": 21.95,
        "end": 26.5,
        "vi": "One a penny, two a penny, hot cross buns",
        "en": "Một xu một chiếc, một xu hai chiếc, bánh chữ thập"
      },
      {
        "start": 27.25,
        "end": 35.3,
        "vi": "If you have no daughter, if you have no son, then give them to your son",
        "en": "Nếu bạn không có con gái, hãy chia cho con trai"
      },
      {
        "start": 35.25,
        "end": 43.7,
        "vi": "If you have no daughter, if you have no son, then give them to your son",
        "en": "Nếu bạn không có con gái, hãy chia cho con trai"
      },
      {
        "start": 44.05,
        "end": 51.3,
        "vi": "But if you ain't got a sweet surprise, then you must eat them all at once",
        "en": "Nhưng nếu không có bất ngờ ngọt ngào nào, bạn phải ăn hết một lượt"
      },
      {
        "start": 53.15,
        "end": 56.9,
        "vi": "Hot cross buns, hot cross buns",
        "en": "Bánh chữ thập nóng hổi, bánh chữ thập nóng hổi"
      },
      {
        "start": 56.85,
        "end": 60.8,
        "vi": "One a penny, two a penny, hot cross buns",
        "en": "Một xu một chiếc, một xu hai chiếc, bánh chữ thập"
      },
      {
        "start": 60.75,
        "end": 64.9,
        "vi": "Hot cross buns, hot cross buns",
        "en": "Bánh chữ thập nóng hổi, bánh chữ thập nóng hổi"
      },
      {
        "start": 64.95,
        "end": 69.6,
        "vi": "One a penny, two a penny, hot cross buns",
        "en": "Một xu một chiếc, một xu hai chiếc, bánh chữ thập"
      },
      {
        "start": 70.35,
        "end": 78.4,
        "vi": "If you have no daughter, if you have no son, then give them to your son",
        "en": "Nếu bạn không có con gái, hãy chia cho con trai"
      },
      {
        "start": 78.35,
        "end": 86.9,
        "vi": "If you have no daughter, if you have no son, then give them to your son",
        "en": "Nếu bạn không có con gái, hãy chia cho con trai"
      },
      {
        "start": 87.25,
        "end": 94.9,
        "vi": "But if you ain't got a sweet surprise, then you must eat them all at once",
        "en": "Nhưng nếu không có bất ngờ ngọt ngào nào, bạn phải ăn hết một lượt"
      },
      {
        "start": 105.15,
        "end": 112.7,
        "vi": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
        "en": "Bò, bò, bò, bò, lách cách, meo meo meo bò"
      },
      {
        "start": 112.65,
        "end": 120.4,
        "vi": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
        "en": "Bò, bò, bò, bò, lách cách, meo meo meo bò"
      },
      {
        "start": 121.15,
        "end": 130.5,
        "vi": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
        "en": "Điệp khúc đồng dao vui nhộn rộn rã"
      },
      {
        "start": 130.95,
        "end": 140.1,
        "vi": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
        "en": "Điệp khúc đồng dao vui nhộn rộn rã"
      },
      {
        "start": 140.35,
        "end": 146.9,
        "vi": "Ginny-gaga-gribbles, happy-china-bone, power-Pistol-buy-a-little-tow",
        "en": "Điệp khúc đồng dao vui nhộn rộn rã"
      },
      {
        "start": 148.25,
        "end": 155.8,
        "vi": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
        "en": "Bò, bò, bò, bò, lách cách, meo meo meo bò"
      },
      {
        "start": 155.95,
        "end": 164.8,
        "vi": "Cow, cow, cow, cow, rattle-tattle, meow, meow, meow, cow",
        "en": "Bò, bò, bò, bò, lách cách, meo meo meo bò"
      },
      {
        "start": 165.15,
        "end": 174.0,
        "vi": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
        "en": "Điệp khúc đồng dao vui nhộn rộn rã"
      },
      {
        "start": 174.25,
        "end": 183.4,
        "vi": "Jimmy-jump-a-jingles, happy-chappy-boney, Millie-Gilly-Barley, Chully-bowl-pot-cow",
        "en": "Điệp khúc đồng dao vui nhộn rộn rã"
      },
      {
        "start": 183.75,
        "end": 190.0,
        "vi": "Ginny-gaga-gribbles, happy-china-bone, power-Pistol-buy-a-little-tow",
        "en": "Điệp khúc đồng dao vui nhộn rộn rã"
      }
    ],
    "englishTranslation": [
      "Bánh chữ thập nóng hổi, bánh chữ thập nóng hổi",
      "Một xu một chiếc, một xu hai chiếc, bánh chữ thập",
      "Bánh chữ thập nóng hổi, bánh chữ thập nóng hổi",
      "Một xu một chiếc, một xu hai chiếc, bánh chữ thập",
      "Nếu bạn không có con gái, hãy chia cho con trai",
      "Nếu bạn không có con gái, hãy chia cho con trai",
      "Nhưng nếu không có bất ngờ ngọt ngào nào, bạn phải ăn hết một lượt",
      "Bánh chữ thập nóng hổi, bánh chữ thập nóng hổi",
      "Một xu một chiếc, một xu hai chiếc, bánh chữ thập",
      "Bánh chữ thập nóng hổi, bánh chữ thập nóng hổi",
      "Một xu một chiếc, một xu hai chiếc, bánh chữ thập",
      "Nếu bạn không có con gái, hãy chia cho con trai",
      "Nếu bạn không có con gái, hãy chia cho con trai",
      "Nhưng nếu không có bất ngờ ngọt ngào nào, bạn phải ăn hết một lượt",
      "Bò, bò, bò, bò, lách cách, meo meo meo bò",
      "Bò, bò, bò, bò, lách cách, meo meo meo bò",
      "Điệp khúc đồng dao vui nhộn rộn rã",
      "Điệp khúc đồng dao vui nhộn rộn rã",
      "Điệp khúc đồng dao vui nhộn rộn rã",
      "Bò, bò, bò, bò, lách cách, meo meo meo bò",
      "Bò, bò, bò, bò, lách cách, meo meo meo bò",
      "Điệp khúc đồng dao vui nhộn rộn rã",
      "Điệp khúc đồng dao vui nhộn rộn rã",
      "Điệp khúc đồng dao vui nhộn rộn rã"
    ],
    "funFactVi": "Giai điệu đồng dao về món bánh nướng thơm lừng truyền thống.",
    "audioUrl": "./assets/music/hot-cross-buns.mp3",
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
    "cover": "./assets/music/covers/music_cover_hot-cross-buns.webp",
    "isVocalTrack": true
  }
];
