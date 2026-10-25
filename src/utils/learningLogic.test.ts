import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AGE_GROUPS,
  getAgeGroupConfig,
  buildSegmentedVocabularyScript,
  buildBilingualVocabularyScript,
  buildGentleTryAgainScript,
  getRotatedGamesForAge,
  getDailyRandomTopic,
  getWordsForSpacedRepetition,
  generateParentMathChallenge,
  verifyParentMathAnswer,
  verifyParentPassword,
  checkScreenTimeStatus,
} from './learningLogic';
import { sanitizeSegmentText } from './audioEngine';
import {
  COLORING_BOOK_TEMPLATES,
  STUDIO_COLOR_PALETTE,
  VIETNAMESE_LETTER_TRACES,
} from '../data/creativeArtData';
import type { VocabularyItem, TopicLesson } from '../types/learning';

const sampleCat: VocabularyItem = {
  id: 'cat',
  en: 'Cat',
  vi: 'Con mèo',
  phonetic: '/kæt/',
  emoji: '🐱',
  colorHex: '#FB923C',
  bgTint: '#FFF7ED',
  soundEffect: 'meow',
  soundLabelVi: 'Meo meo!',
  phrase2To3y: { en: 'Little white cat', vi: 'Chú mèo trắng nhỏ' },
  sentence3To4y: { en: 'I see a cute cat.', vi: 'Tớ thấy một chú mèo đáng yêu.' },
  phonics4To5y: {
    letter: 'C',
    sound: 'cờ',
    spelling: 'C - A - T',
    questionEn: 'Which word starts with C?',
    questionVi: 'Từ nào bắt đầu bằng chữ C?',
  },
};

const sampleDog: VocabularyItem = {
  ...sampleCat,
  id: 'dog',
  en: 'Dog',
  vi: 'Con chó',
  emoji: '🐶',
  soundEffect: 'woof',
  soundLabelVi: 'Gâu gâu!',
};

test('AGE_GROUPS defines all 6 age stages from 0-3m to 4-5y with under-2 notice', () => {
  assert.equal(AGE_GROUPS.length, 6);
  assert.equal(getAgeGroupConfig('0-3m').underTwoNotice, true);
  assert.equal(getAgeGroupConfig('4-12m').underTwoNotice, true);
  assert.equal(getAgeGroupConfig('1-2y').underTwoNotice, true);
  assert.equal(getAgeGroupConfig('2-3y').underTwoNotice, false);
  assert.equal(getAgeGroupConfig('4-5y').stageTitle, 'Bé sắp vào lớp 1');
});

test('buildSegmentedVocabularyScript strictly separates Vietnamese (vi) and English (en) segments', () => {
  const segs1y = buildSegmentedVocabularyScript(sampleCat, '1-2y');
  assert.equal(segs1y.length, 3);
  assert.equal(segs1y[0].lang, 'vi');
  assert.ok(segs1y[0].text.includes('Bé ơi nhìn nè! Đây là con mèo.'));
  assert.equal(segs1y[1].lang, 'en');
  assert.equal(segs1y[1].text, 'Cat! Cat!');
  assert.equal(segs1y[2].lang, 'vi');

  const segs4y = buildSegmentedVocabularyScript(sampleCat, '4-5y');
  assert.equal(segs4y[0].lang, 'vi');
  assert.equal(segs4y[1].lang, 'en');
  assert.ok(segs4y[1].text.includes('C, A, T. Cat!'));

  const script2y = buildBilingualVocabularyScript(sampleCat, '2-3y');
  assert.ok(script2y.includes('Little white cat!'));
});

test('buildGentleTryAgainScript is encouraging, says "Cố lên nào bé ơi!", and never uses negative/lose words or "bé yêu"', () => {
  const feedback = buildGentleTryAgainScript(sampleDog, sampleCat);
  assert.ok(feedback.startsWith('Cố lên nào bé ơi!'));
  assert.ok(!feedback.toLowerCase().includes('bé yêu'));
  assert.ok(!feedback.toLowerCase().includes('sai'));
  assert.ok(!feedback.toLowerCase().includes('thua'));
  assert.ok(feedback.includes('Dog'));
  assert.ok(feedback.includes('Cat'));
});

test('sanitizeSegmentText converts any "Bớ" or "bớ" to "Bé" / "bé" and "bé yêu" to "bé ơi"', () => {
  assert.equal(
    sanitizeSegmentText('Cố lên nào bớ yêu! Bớ chọn lại nhé!', 'vi'),
    'Cố lên nào bé ơi! Bé chọn lại nhé!'
  );
  assert.equal(
    sanitizeSegmentText('Giỏi quá bớ ơi!', 'vi'),
    'Giỏi quá bé ơi!'
  );
});

test('verifyParentPassword checks custom parent PIN when set and falls back to math challenge when empty', () => {
  const challenge = generateParentMathChallenge(42);
  // When custom PIN is set, only exact PIN matches (math answer is rejected)
  assert.equal(verifyParentPassword('2468', '2468', challenge), true);
  assert.equal(verifyParentPassword('2468', '9999', challenge), false);
  assert.equal(verifyParentPassword('2468', String(challenge.a + challenge.b), challenge), false);

  // When custom PIN is empty, fallback math challenge is used
  assert.equal(verifyParentPassword('', String(challenge.a + challenge.b), challenge), true);
  assert.equal(verifyParentPassword(undefined, 'wrong', challenge), false);
});

test('creativeArtData provides 12 colors, multi-stroke letter traces, and 20+ multi-region coloring templates', () => {
  assert.equal(STUDIO_COLOR_PALETTE.length, 12);
  assert.ok(VIETNAMESE_LETTER_TRACES.length >= 9);
  assert.equal(VIETNAMESE_LETTER_TRACES[0].letter, 'A');
  assert.equal(VIETNAMESE_LETTER_TRACES[0].strokes.length, 3);
  assert.ok(COLORING_BOOK_TEMPLATES.length >= 20);
  assert.equal(COLORING_BOOK_TEMPLATES[0].id, 'happy-puppy');
  assert.ok(COLORING_BOOK_TEMPLATES[0].regions.length >= 12);
});

test('buildSegmentedVocabularyScript spells full words of >5 letters without truncation', () => {
  const sampleElephant: VocabularyItem = {
    ...sampleCat,
    id: 'elephant',
    en: 'Elephant',
    vi: 'Con voi',
    phonics4To5y: {
      letter: 'E',
      sound: 'e',
      spelling: 'E - L - E - P - H - A - N - T',
      questionEn: 'Which word starts with E?',
      questionVi: 'Từ nào bắt đầu bằng chữ E?',
    },
  };
  const segs4y = buildSegmentedVocabularyScript(sampleElephant, '4-5y');
  assert.equal(segs4y[1].lang, 'en');
  assert.ok(segs4y[1].text.includes('E, L, E, P, H, A, N, T. Elephant!'));
});

test('getRotatedGamesForAge rotates game order deterministically without losing games', () => {
  const g0 = getRotatedGamesForAge('2-3y', 0);
  const g1 = getRotatedGamesForAge('2-3y', 1);
  assert.equal(g0.length, g1.length);
  assert.equal(g0[1], g1[0]);
});

test('generateParentMathChallenge and verifyParentMathAnswer validate correctly', () => {
  const challenge = generateParentMathChallenge(42);
  assert.equal(verifyParentMathAnswer(challenge, String(challenge.a + challenge.b)), true);
  assert.equal(verifyParentMathAnswer(challenge, challenge.a + challenge.b + 1), false);
  assert.equal(verifyParentMathAnswer(challenge, 'abc'), false);
});

test('checkScreenTimeStatus respects autoOffEnabled toggle and custom limits', () => {
  const statusNormal = checkScreenTimeStatus(6, 15, true);
  assert.equal(statusNormal.isLimitReached, false);
  assert.equal(statusNormal.remainingMinutes, 9);
  assert.equal(statusNormal.shouldRemindEyeRest, false);

  const statusEyeRest = checkScreenTimeStatus(10, 20, true);
  assert.equal(statusEyeRest.shouldRemindEyeRest, true);

  const statusLimit = checkScreenTimeStatus(15, 15, true);
  assert.equal(statusLimit.isLimitReached, true);

  // When autoOffEnabled is false, limit and eye-rest reminders are disabled
  const statusDisabled = checkScreenTimeStatus(25, 15, false);
  assert.equal(statusDisabled.isLimitReached, false);
  assert.equal(statusDisabled.shouldRemindEyeRest, false);
});

test('getDailyRandomTopic and getWordsForSpacedRepetition return valid items', () => {
  const mockTopic: TopicLesson = {
    id: 'farm',
    order: 1,
    titleVi: 'Động vật nông trại',
    titleEn: 'Farm Animals',
    isCompleteSample: true,
    worldTheme: {
      bgGradient: 'from-amber-100 to-sky-100',
      cardBg: '#FFFBEB',
      borderColor: '#FDE68A',
      accentHex: '#F59E0B',
      iconEmoji: '🐮',
    },
    narrator: {
      id: 'cutin',
      name: 'Gà con Cu Tin',
      species: 'Gà con',
      emoji: '🐥',
      avatarBg: '#FEF08A',
      greetingVi: 'Chíp chíp!',
    },
    storyIntroVi: 'Chú gà con Cu Tin đang đi tìm mẹ.',
    parentRealLifeTipVi: 'Bố mẹ giả tiếng kêu con vật cùng bé.',
    rewardSticker: { id: 's1', nameVi: 'Gà Vàng', emoji: '🐥' },
    rhyme: { title: 'Old MacDonald', melodyStyle: 'macdonald', lines: [] },
    vocabulary: [sampleCat, sampleDog],
  };

  const picked = getDailyRandomTopic([mockTopic], '2026-10-23');
  assert.equal(picked.id, 'farm');

  const srsFallback = getWordsForSpacedRepetition({}, [mockTopic], 2);
  assert.equal(srsFallback.length, 2);
  assert.equal(srsFallback[0].en, 'Cat');
});

test('lessonsData.json contains all 32 topics, 256 accurate vocabulary items, full spelling, and zero "bé yêu" distortion', async () => {
  const fs = await import('node:fs');
  const raw = fs.readFileSync('src/data/lessonsData.json', 'utf8');
  assert.equal(raw.toLowerCase().includes('bé yêu'), false, 'lessonsData.json must not contain "bé yêu"');
  assert.equal(raw.includes('Bòòò'), false, 'lessonsData.json must not contain "Bòòò"');

  const parsed = JSON.parse(raw) as { topics: TopicLesson[] };
  assert.ok(parsed.topics.length >= 32);

  for (const topic of parsed.topics) {
    assert.ok(
      topic.vocabulary.length >= 16,
      `Topic ${topic.id} should have at least 16 vocabulary items, got ${topic.vocabulary.length}`
    );
    assert.ok(topic.storyIntroVi.length > 15);
    assert.ok(topic.rhyme.lines.length >= 4);

    for (const item of topic.vocabulary) {
      const expectedSpelling = item.en
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .split('')
        .join(' - ');
      assert.equal(
        item.phonics4To5y.spelling,
        expectedSpelling,
        `Item ${item.id} (${item.en}) spelling must match full word`
      );
      assert.equal(
        item.phonics4To5y.letter,
        item.en.trim()[0].toUpperCase(),
        `Item ${item.id} (${item.en}) phonics letter must match first letter`
      );
    }
  }
});

test('BRAIN_GAME_SECTIONS contains 6 categories and 31 unique interactive games matching Little-Brain layout', async () => {
  const { BRAIN_GAME_SECTIONS, ALL_BRAIN_GAMES } = await import('../data/brainGamesData');
  assert.equal(BRAIN_GAME_SECTIONS.length, 6);
  assert.equal(ALL_BRAIN_GAMES.length, 31);
  const uniqueIds = new Set(ALL_BRAIN_GAMES.map((g) => g.id));
  assert.equal(uniqueIds.size, 31);
  for (const g of ALL_BRAIN_GAMES) {
    assert.equal(
      /\([A-Za-z]/.test(g.promptVi),
      false,
      `Game ${g.id} promptVi should not embed English in parentheses: ${g.promptVi}`
    );
  }
});



