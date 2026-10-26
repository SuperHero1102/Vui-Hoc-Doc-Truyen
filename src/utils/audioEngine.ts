import type { ParentSettings, SoundEffectType, SpeechSegment } from '../types/learning';

// Client-side in-memory audio URL cache
const clientAudioUrlCache = new Map<string, string>();
let activeAudioElement: HTMLAudioElement | null = null;
let playbackGeneration = 0;
let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioContext) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      sharedAudioContext = new AudioCtx();
    }
  }
  if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

export function getClientAudioCacheSize(): number {
  return clientAudioUrlCache.size;
}

export function stopAllAudio(): void {
  playbackGeneration += 1;
  if (activeAudioElement) {
    activeAudioElement.pause();
    activeAudioElement.currentTime = 0;
    activeAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function sanitizeSegmentText(text: string, lang: 'vi' | 'en'): string {
  let cleaned = text
    .replace(/(?<![\p{L}])bớ(?![\p{L}])/gu, 'bé')
    .replace(/(?<![\p{L}])Bớ(?![\p{L}])/gu, 'Bé')
    .replace(/bé yêu/gi, (m) => (m[0] === 'B' ? 'Bé ơi' : 'bé ơi'));
  if (lang === 'vi') {
    cleaned = cleaned.replace(/\([A-Za-z0-9\s,\-']+\)/g, '').replace(/\s{2,}/g, ' ');
  }
  return cleaned.trim();
}

/**
 * Splits a mixed string into explicit ('vi' | 'en') segments if callers pass a single string,
 * ensuring English words/sentences are spoken by an English voice and Vietnamese by a Northern Vietnamese voice.
 */
export function parseTextToSpeechSegments(rawText: string): SpeechSegment[] {
  const cleaned = rawText.trim();
  if (!cleaned) return [];

  // Split by sentence boundaries while keeping punctuation
  const parts = cleaned
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const vietnameseDiacriticRegex =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

  const segments: SpeechSegment[] = [];
  for (const part of parts) {
    const lang: 'vi' | 'en' = vietnameseDiacriticRegex.test(part) ? 'vi' : 'en';
    const sanitized = sanitizeSegmentText(part, lang);
    if (!sanitized) continue;
    const last = segments[segments.length - 1];
    if (last && last.lang === lang) {
      last.text = `${last.text} ${sanitized}`;
    } else {
      segments.push({ text: sanitized, lang });
    }
  }
  return segments;
}

/**
 * Offline browser fallback for a single segment.
 * CRITICAL: Never allow an English voice to read a 'vi' segment!
 */
function speakSegmentWithBrowserFallback(
  segment: SpeechSegment,
  settings: ParentSettings,
  voiceStyle?: 'narrator' | 'elder' | 'hero' | 'child' | 'gentle' | 'wolf' | 'fox'
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    let pitchMod = 1.05;
    let rateMod = 1.0;

    if (voiceStyle === 'wolf') {
      pitchMod = 0.68;
      rateMod = 0.85;
    } else if (voiceStyle === 'child') {
      pitchMod = 1.35;
      rateMod = 1.02;
    } else if (voiceStyle === 'elder') {
      pitchMod = 0.82;
      rateMod = 0.88;
    } else if (voiceStyle === 'hero') {
      pitchMod = 0.95;
      rateMod = 0.95;
    } else if (voiceStyle === 'gentle') {
      pitchMod = 1.15;
      rateMod = 0.9;
    } else if (voiceStyle === 'fox') {
      pitchMod = 1.22;
      rateMod = 1.05;
    }

    if (segment.lang === 'vi') {
      const viVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('vi') &&
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('linh') ||
              v.name.toLowerCase().includes('hoai') ||
              v.name.toLowerCase().includes('mi'))
        ) || voices.find((v) => v.lang.toLowerCase().startsWith('vi'));

      // If the device has NO Vietnamese voice installed, do NOT let a Western English voice read Vietnamese!
      if (!viVoice) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = 'vi-VN';
      utterance.voice = viVoice;
      utterance.volume = Math.max(0.1, Math.min(1, settings.volume));
      const baseRate =
        settings.voiceSpeed === 'slow' ? 0.92 : settings.voiceSpeed === 'fast' ? 1.05 : 0.98;
      utterance.rate = baseRate * rateMod;
      utterance.pitch = pitchMod;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } else {
      const isBritish = settings.englishAccent === 'en-GB';
      const targetLangTag = isBritish ? 'en-GB' : 'en-US';
      const enVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().replace('_', '-').startsWith(targetLangTag.toLowerCase()) &&
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('serena') ||
              v.name.toLowerCase().includes('stephanie') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('google'))
        ) ||
        voices.find((v) =>
          v.lang.toLowerCase().replace('_', '-').startsWith(targetLangTag.toLowerCase())
        ) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('en'));

      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = targetLangTag;
      if (enVoice) utterance.voice = enVoice;
      utterance.volume = Math.max(0.1, Math.min(1, settings.volume));
      const baseRate =
        settings.voiceSpeed === 'slow' ? 0.88 : settings.voiceSpeed === 'fast' ? 1.02 : 0.95;
      utterance.rate = baseRate * rateMod;
      utterance.pitch = pitchMod;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    }
  });
}

async function fetchOrGetCachedSegmentUrl(
  segment: SpeechSegment,
  settings: ParentSettings
): Promise<{ url: string | null; fromCache: boolean }> {
  const accentKey = settings.englishAccent || 'en-US';
  const cacheKey = `v3:${segment.lang}:${accentKey}:${settings.voicePersona}:${settings.voiceSpeed}:${segment.text.trim()}`;
  const cached = clientAudioUrlCache.get(cacheKey);
  if (cached) {
    return { url: cached, fromCache: true };
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { url: null, fromCache: false };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: segment.text,
        lang: segment.lang,
        voiceName: settings.voicePersona,
        speed: settings.voiceSpeed,
        englishAccent: settings.englishAccent || 'en-US',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = (await response.json()) as {
        audioBase64?: string;
        mimeType?: string;
        cached?: boolean;
      };
      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/mpeg' });
        const objectUrl = URL.createObjectURL(blob);
        clientAudioUrlCache.set(cacheKey, objectUrl);
        return { url: objectUrl, fromCache: Boolean(data.cached) };
      }
    }
  } catch {
    // Fall through
  }

  return { url: null, fromCache: false };
}

function playAudioUrl(
  url: string,
  volume: number,
  speed: 'slow' | 'normal' | 'fast',
  gen: number
): Promise<boolean> {
  return new Promise((resolve) => {
    if (gen !== playbackGeneration) {
      resolve(false);
      return;
    }
    const audio = new Audio(url);
    audio.volume = Math.max(0.1, Math.min(1, volume));
    audio.playbackRate = speed === 'slow' ? 0.94 : speed === 'fast' ? 1.06 : 1.0;
    activeAudioElement = audio;
    audio.onended = () => resolve(true);
    audio.onerror = () => resolve(false);
    audio.play().catch(() => resolve(false));
  });
}

/**
 * Plays an array of language-separated segments (`SpeechSegment[]`) or a text string
 * so Vietnamese is spoken by a Northern Vietnamese female voice and English by a native English voice.
 */
export async function speakSegments(
  rawSegments: SpeechSegment[],
  settings: ParentSettings,
  onEnd?: () => void
): Promise<{ usedServerTts: boolean; fromCache: boolean }> {
  stopAllAudio();
  const currentGen = playbackGeneration;

  const segments = rawSegments
    .map((s) => ({
      lang: s.lang,
      text: sanitizeSegmentText(s.text, s.lang),
    }))
    .filter((s) => s.text.length > 0);

  // Prefetch all segments in parallel for gapless playback
  const fetched = await Promise.all(
    segments.map((seg) => fetchOrGetCachedSegmentUrl(seg, settings))
  );

  let usedServerTts = false;
  let allFromCache = fetched.length > 0;

  for (let i = 0; i < segments.length; i++) {
    if (currentGen !== playbackGeneration) break;
    const seg = segments[i];
    const { url, fromCache } = fetched[i];
    if (!fromCache) allFromCache = false;

    if (url) {
      usedServerTts = true;
      const ok = await playAudioUrl(url, settings.volume, settings.voiceSpeed, currentGen);
      if (!ok && currentGen === playbackGeneration) {
        await speakSegmentWithBrowserFallback(seg, settings);
      }
    } else {
      await speakSegmentWithBrowserFallback(seg, settings);
    }
  }

  if (currentGen === playbackGeneration) {
    onEnd?.();
  }
  return { usedServerTts, fromCache: allFromCache };
}

export async function speakTeacherVoice(
  textOrSegments: string | SpeechSegment[],
  settings: ParentSettings,
  onEnd?: () => void
): Promise<{ usedGemini: boolean; fromCache: boolean }> {
  const segments =
    typeof textOrSegments === 'string'
      ? parseTextToSpeechSegments(textOrSegments)
      : textOrSegments;
  const res = await speakSegments(segments, settings, onEnd);
  return { usedGemini: res.usedServerTts, fromCache: res.fromCache };
}

let backgroundKeepAliveAudio: HTMLAudioElement | null = null;

export function startBackgroundAudioKeepAlive(): void {
  if (typeof window === 'undefined') return;
  try {
    if (!backgroundKeepAliveAudio) {
      // 1-second inaudible silent wave base64
      const silentWav =
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      backgroundKeepAliveAudio = new Audio(silentWav);
      backgroundKeepAliveAudio.loop = true;
      backgroundKeepAliveAudio.volume = 0.01;
    }
    backgroundKeepAliveAudio.play().catch(() => {});
  } catch {
    // ignore
  }
}

export function stopBackgroundAudioKeepAlive(): void {
  if (backgroundKeepAliveAudio) {
    try {
      backgroundKeepAliveAudio.pause();
      backgroundKeepAliveAudio.currentTime = 0;
    } catch {
      // ignore
    }
  }
}

export async function speakStoryNarration(
  segments: StorySegmentToSpeak[],
  settings: ParentSettings,
  onSegmentStart?: (idx: number) => void,
  onEnd?: () => void
): Promise<void> {
  stopAllAudio();
  startBackgroundAudioKeepAlive();
  const currentGen = playbackGeneration;

  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    try {
      navigator.mediaSession.playbackState = 'playing';
    } catch {
      // ignore
    }
  }

  // Pre-fetch segment audios in parallel (from server TTS or client cache) for gapless playback
  const prefetched = await Promise.all(
    segments.map((s) =>
      fetchOrGetCachedSegmentUrl(
        { text: sanitizeSegmentText(s.text, s.lang), lang: s.lang },
        settings
      )
    )
  );

  for (let i = 0; i < segments.length; i++) {
    if (currentGen !== playbackGeneration) break;
    onSegmentStart?.(i);
    const seg = segments[i];
    const sanitizedText = sanitizeSegmentText(seg.text, seg.lang);
    if (!sanitizedText) continue;

    const { url } = prefetched[i] || { url: null };
    let playedOk = false;

    // First attempt: HTMLAudioElement with server/cached TTS (works in background & screen-off!)
    if (url) {
      playedOk = await playAudioUrl(url, settings.volume, settings.voiceSpeed, currentGen);
    }

    // Fallback: Browser speech synthesis (seamless offline)
    if (!playedOk && currentGen === playbackGeneration) {
      const effectiveVoiceStyle =
        settings.characterVoices !== false ? seg.voiceStyle : 'narrator';
      await speakSegmentWithBrowserFallback(
        { text: sanitizedText, lang: seg.lang },
        settings,
        effectiveVoiceStyle
      );
    }

    if (currentGen === playbackGeneration && i < segments.length - 1) {
      await new Promise((r) => setTimeout(r, 260));
    }
  }

  if (currentGen === playbackGeneration) {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = 'none';
      } catch {
        // ignore
      }
    }
    onEnd?.();
  }
}

/**
 * Procedural Web Audio synthesizer for playful animal sounds, UI chimes, bubbles, and lullabies.
 */
export function playSoundEffect(effect: SoundEffectType, volume = 0.7): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(Math.max(0.05, Math.min(0.9, volume * 0.45)), now);
  master.connect(ctx.destination);

  switch (effect) {
    case 'meow': {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(410, now + 0.42);
      master.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(master);
      osc.start(now);
      osc.stop(now + 0.45);
      break;
    }
    case 'woof': {
      [0, 0.18].forEach((offset) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now + offset);
        osc.frequency.exponentialRampToValueAtTime(340, now + offset + 0.05);
        osc.frequency.exponentialRampToValueAtTime(130, now + offset + 0.13);
        g.gain.setValueAtTime(0.35, now + offset);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);
        osc.connect(g);
        g.connect(master);
        osc.start(now + offset);
        osc.stop(now + offset + 0.14);
      });
      break;
    }
    case 'moo': {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.linearRampToValueAtTime(175, now + 0.25);
      osc.frequency.linearRampToValueAtTime(135, now + 0.55);
      master.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      osc.connect(master);
      osc.start(now);
      osc.stop(now + 0.58);
      break;
    }
    case 'quack':
    case 'oink':
    case 'baa': {
      const baseFreq = effect === 'quack' ? 390 : effect === 'oink' ? 250 : 310;
      [0, 0.16].forEach((offset) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(baseFreq, now + offset);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + offset + 0.07);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + offset + 0.13);
        g.gain.setValueAtTime(0.25, now + offset);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);
        osc.connect(g);
        g.connect(master);
        osc.start(now + offset);
        osc.stop(now + offset + 0.14);
      });
      break;
    }
    case 'cluck':
    case 'chirp': {
      [0, 0.11, 0.22].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900 + idx * 140, now + offset);
        osc.frequency.exponentialRampToValueAtTime(1450, now + offset + 0.08);
        g.gain.setValueAtTime(0.3, now + offset);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);
        osc.connect(g);
        g.connect(master);
        osc.start(now + offset);
        osc.stop(now + offset + 0.09);
      });
      break;
    }
    case 'pop':
    case 'crunch':
    case 'splash': {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
      master.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.connect(master);
      osc.start(now);
      osc.stop(now + 0.11);
      break;
    }
    default: {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        g.gain.setValueAtTime(0.28, now + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);
        osc.connect(g);
        g.connect(master);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.18);
      });
      break;
    }
  }
}

export function playCelebrationChime(volume = 0.8): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const chord = [523.25, 659.25, 783.99, 1046.5];
  chord.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.07);
    gain.gain.setValueAtTime(Math.min(0.35, volume * 0.35), now + i * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.07);
    osc.stop(now + i * 0.07 + 0.35);
  });
}

export function playGentleEncourageTone(volume = 0.7): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  [392.0, 440.0].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.11);
    gain.gain.setValueAtTime(Math.min(0.25, volume * 0.25), now + i * 0.11);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.11);
    osc.stop(now + i * 0.11 + 0.22);
  });
}

export function playMelodyNotes(
  style: 'twinkle' | 'macdonald' | 'happy' | 'lullaby',
  volume = 0.3
): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const melodies: Record<string, number[]> = {
    twinkle: [261.63, 261.63, 392.0, 392.0, 440.0, 440.0, 392.0],
    macdonald: [392.0, 392.0, 392.0, 293.66, 329.63, 329.63, 293.66],
    happy: [261.63, 293.66, 329.63, 349.23, 392.0, 392.0],
    lullaby: [329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 261.63],
  };

  const seq = melodies[style] || melodies.twinkle;
  const noteDuration = style === 'lullaby' ? 0.45 : 0.28;

  seq.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * noteDuration);
    gain.gain.setValueAtTime(Math.min(0.25, volume * 0.35), now + idx * noteDuration);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 0.95) * noteDuration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * noteDuration);
    osc.stop(now + (idx + 0.98) * noteDuration);
  });
}

export function playXylophoneNote(frequency: number, volume = 0.85): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Fundamental tone
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(frequency, now);
  gain1.gain.setValueAtTime(Math.min(0.45, volume * 0.45), now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.56);

  // Harmonic overtone for bright xylophone/marimba chime
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(frequency * 3, now);
  gain2.gain.setValueAtTime(Math.min(0.16, volume * 0.16), now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.15);
}

