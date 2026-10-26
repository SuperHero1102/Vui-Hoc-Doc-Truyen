import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory LRU-like cache for synthesized TTS audio (avoids redundant calls)
const ttsAudioCache = new Map<string, { audioBase64: string; mimeType: string; createdAt: number }>();
const MAX_CACHE_ENTRIES = 500;

function setCacheEntry(key: string, audioBase64: string, mimeType: string) {
  if (ttsAudioCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = ttsAudioCache.keys().next().value;
    if (oldestKey) ttsAudioCache.delete(oldestKey);
  }
  ttsAudioCache.set(key, { audioBase64, mimeType, createdAt: Date.now() });
}

function normalizeVietnameseTtsText(rawText: string, lang: 'vi' | 'en'): string {
  let cleaned = rawText
    .replace(/(?<![\p{L}])bớ(?![\p{L}])/gu, 'bé')
    .replace(/(?<![\p{L}])Bớ(?![\p{L}])/gu, 'Bé')
    .replace(/bé yêu/gi, (m) => (m[0] === 'B' ? 'Bé ơi' : 'bé ơi'));
  if (lang === 'vi') {
    cleaned = cleaned.replace(/\([A-Za-z0-9\s,\-']+\)/g, '').replace(/\s{2,}/g, ' ');
  }
  return cleaned.trim();
}

function splitTextIntoTtsChunks(text: string, maxLen = 160): string[] {
  const clean = text.trim();
  if (clean.length <= maxLen) return [clean];

  // Split by sentence boundaries (. ! ? \n)
  const sentences = clean.split(/(?<=[.!?\n])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length <= maxLen) {
      current = (current + ' ' + sentence).trim();
    } else {
      if (current) chunks.push(current);
      if (sentence.length <= maxLen) {
        current = sentence;
      } else {
        // If a single sentence is longer than maxLen, split by commas or clauses
        const clauses = sentence.split(/(?<=[,;:])\s+/);
        let subCurrent = '';
        for (const clause of clauses) {
          if ((subCurrent + ' ' + clause).trim().length <= maxLen) {
            subCurrent = (subCurrent + ' ' + clause).trim();
          } else {
            if (subCurrent) chunks.push(subCurrent);
            if (clause.length <= maxLen) {
              subCurrent = clause;
            } else {
              // Word split fallback
              const words = clause.split(/\s+/);
              let wordCurrent = '';
              for (const w of words) {
                if ((wordCurrent + ' ' + w).trim().length <= maxLen) {
                  wordCurrent = (wordCurrent + ' ' + w).trim();
                } else {
                  if (wordCurrent) chunks.push(wordCurrent);
                  wordCurrent = w;
                }
              }
              if (wordCurrent) chunks.push(wordCurrent);
              subCurrent = '';
            }
          }
        }
        current = subCurrent;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.filter((c) => c.length > 0);
}

/**
 * Fetches genuine Vietnamese ('vi') female voice or native English ('en') audio
 * from Google Translate TTS stream on the server side.
 * Splits long paragraphs into chunks and concatenates audio frames so no words are skipped or truncated.
 */
async function fetchGoogleTranslateTtsBase64(
  text: string,
  lang: 'vi' | 'en',
  _speed: 'slow' | 'normal' | 'fast',
  englishAccent: 'en-US' | 'en-GB' = 'en-US'
): Promise<{ audioBase64: string; mimeType: string } | null> {
  try {
    const targetTag = lang === 'en' ? (englishAccent === 'en-GB' ? 'en-gb' : 'en-us') : 'vi';
    const chunks = splitTextIntoTtsChunks(text, 160);
    if (chunks.length === 0) return null;

    const audioBuffers: Buffer[] = [];
    for (const chunk of chunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetTag}&client=tw-ob&ttsspeed=1&q=${encodeURIComponent(
        chunk
      )}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      });
      if (!response.ok) continue;
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength > 50) {
        audioBuffers.push(Buffer.from(arrayBuffer));
      }
    }

    if (audioBuffers.length === 0) return null;
    const combinedBuffer = Buffer.concat(audioBuffers);
    const audioBase64 = combinedBuffer.toString('base64');
    return { audioBase64, mimeType: 'audio/mpeg' };
  } catch {
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Health & TTS cache status endpoint
  app.get('/api/tts/status', (_req, res) => {
    const hasApiKey = Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
      process.env.GEMINI_API_KEY.trim().length > 5
    );
    res.json({
      available: true,
      geminiConfigured: hasApiKey,
      cachedCount: ttsAudioCache.size,
      model: 'vi-VN-native-cloud-tts',
    });
  });

  // Server-side Segmented TTS endpoint (strictly separates 'vi' Northern Vietnamese female voice vs 'en' native English voice)
  app.post('/api/tts', async (req, res) => {
    try {
      const {
        text,
        lang = 'vi',
        voiceName = 'Kore',
        speed = 'slow',
        stylePrompt,
        englishAccent = 'en-US',
      } = req.body as {
        text?: string;
        lang?: 'vi' | 'en';
        voiceName?: string;
        speed?: 'slow' | 'normal' | 'fast';
        stylePrompt?: string;
        englishAccent?: 'en-US' | 'en-GB';
      };

      if (!text || typeof text !== 'string' || !text.trim()) {
        res.status(400).json({ error: 'Text is required for TTS synthesis.' });
        return;
      }

      const targetLang: 'vi' | 'en' = lang === 'en' ? 'en' : 'vi';
      const trimmedText = normalizeVietnameseTtsText(text, targetLang).slice(0, 2000);
      const allowedVoices = ['Kore', 'Zephyr', 'Puck', 'Charon', 'Fenrir'];
      const selectedVoice = allowedVoices.includes(voiceName) ? voiceName : 'Kore';
      const cacheKey = `v3:${targetLang}:${englishAccent}:${selectedVoice}:${speed}:${trimmedText}`;

      const cached = ttsAudioCache.get(cacheKey);
      if (cached) {
        res.json({
          audioBase64: cached.audioBase64,
          mimeType: cached.mimeType,
          cached: true,
          cacheSize: ttsAudioCache.size,
        });
        return;
      }

      // CRITICAL: For Vietnamese ('vi'), always use the native Vietnamese ('tl=vi') cloud TTS voice first!
      // Passing Vietnamese text to English-phoneme Gemini voices (Kore/Zephyr) causes "Bé" to be pronounced as "Bớ".
      if (targetLang === 'vi') {
        const viCloudTts = await fetchGoogleTranslateTtsBase64(trimmedText, 'vi', speed, englishAccent);
        if (viCloudTts) {
          setCacheEntry(cacheKey, viCloudTts.audioBase64, viCloudTts.mimeType);
          res.json({
            audioBase64: viCloudTts.audioBase64,
            mimeType: viCloudTts.mimeType,
            cached: false,
            cacheSize: ttsAudioCache.size,
          });
          return;
        }
      }

      // For English ('en') or fallback: try native cloud TTS first for fast, accurate pronunciation
      const cloudTts = await fetchGoogleTranslateTtsBase64(trimmedText, targetLang, speed, englishAccent);
      if (cloudTts) {
        setCacheEntry(cacheKey, cloudTts.audioBase64, cloudTts.mimeType);
        res.json({
          audioBase64: cloudTts.audioBase64,
          mimeType: cloudTts.mimeType,
          cached: false,
          cacheSize: ttsAudioCache.size,
        });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const hasValidGeminiKey = Boolean(
        apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5
      );

      if (hasValidGeminiKey && apiKey && targetLang === 'en') {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          });

          const englishTone =
            englishAccent === 'en-GB'
              ? 'warm, crystal-clear native British English (Received Pronunciation) teacher voice, slow and articulate pronunciation for young children.'
              : 'warm, crystal-clear native American English preschool teacher voice, slow and articulate pronunciation for young children.';

          const styleInstruction = stylePrompt || `Speak in a ${englishTone}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash-lite-tts',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: trimmedText,
                    // @ts-ignore - speechMetadata is supported by Gemini 3.8 TTS models
                    speechMetadata: {
                      style: styleInstruction,
                    },
                  },
                ],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: selectedVoice,
                  },
                },
              },
            },
          });

          const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
          const base64Audio = inlineData?.data;
          const mimeType = inlineData?.mimeType || 'audio/wav';

          if (base64Audio) {
            setCacheEntry(cacheKey, base64Audio, mimeType);
            res.json({
              audioBase64: base64Audio,
              mimeType,
              cached: false,
              cacheSize: ttsAudioCache.size,
            });
            return;
          }
        } catch {
          // Fall through
        }
      }

      res.status(503).json({
        error: 'TTS service temporarily unavailable',
        fallback: true,
      });
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : 'TTS generation error';
      res.status(500).json({
        error: errMessage,
        fallback: true,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
