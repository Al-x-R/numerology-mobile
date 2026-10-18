// scripts/forecasts/generate.ts
// Generates forecasts with Gemini and writes them as static files `<outDir>/<collection>/<id>.json`.
// Existing files are never regenerated, so the script is safe to run any number of times.
//
// Usage: GEMINI_API_KEY=... node scripts/forecasts/generate.ts [outDir]

import { access, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const OUT_DIR = path.resolve(process.argv[2] || 'public');
const MAX_RETRIES = 3;
const KEEP_DAILY_DAYS = 30;

const LANGS = ['ru', 'en', 'uk', 'zh-TW'];
const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ZODIAC_KEYS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

type Period = 'day' | 'month' | 'year';
type Kind = 'numerology' | 'zodiac';

// Collection names match the paths requested by hooks/useForecasts.ts and hooks/useZodiacForecast.ts
const COLLECTIONS: Record<Kind, Record<Period, string>> = {
  numerology: { day: 'daily_forecasts', month: 'monthly_forecasts', year: 'yearly_forecasts' },
  zodiac: { day: 'daily_zodiac', month: 'monthly_zodiac', year: 'yearly_zodiac' },
};

// --- DATES (UTC) ---

const pad = (n: number) => String(n).padStart(2, '0');

const dayId = (shiftDays: number): string => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + shiftDays);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};

const monthId = (shiftMonths: number): string => {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + shiftMonths);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
};

const yearId = (shiftYears: number): string => `${new Date().getUTCFullYear() + shiftYears}`;

// The client uses its local date, which can differ from UTC by up to one day either way
const TARGETS: Record<Period, string[]> = {
  day: [dayId(-1), dayId(0), dayId(1)],
  month: [monthId(0), monthId(1)],
  year: [yearId(0), yearId(1)],
};

// --- PROMPTS ---

const CONTENT_STRUCTURE = `
  - "title": Short, catchy theme (3-5 words).
  - "summary": 2-3 sentences. Focus on actionable advice, not theory.
  - "love": Practical relationship advice.
  - "finance": Career/money tip.
  - "health": Energy/well-being tip.
  - "warning": A gentle caution (1 sentence).
  - "affirmation": Short, positive mantra.`;

const LANGUAGES_BLOCK = `
  LANGUAGES REQUIRED (every item MUST have all 4):
  - "ru": Russian
  - "en": English
  - "uk": Ukrainian
  - "zh-TW": Traditional Chinese (Taiwan style)`;

const NUMEROLOGY_FOCUS: Record<Period, string> = {
  day: 'Immediate energy and daily tasks.',
  month: 'General trends and month-long goals.',
  year: 'Big picture, strategy, major life changes.',
};

const ZODIAC_FOCUS: Record<Period, string> = {
  day: 'Mood, interactions, small events.',
  month: 'Themes of the month, career shifts, relationship dynamics.',
  year: 'Major growth, challenges, and long-term success.',
};

const PERIOD_LABEL: Record<Period, string> = { day: 'DAILY', month: 'MONTHLY', year: 'YEARLY' };

const buildPrompt = (kind: Kind, period: Period, id: string): string => {
  if (kind === 'numerology') {
    return `
  ACT AS: Modern, empathetic Life Coach & Numerologist.
  TONE: Inspiring, clear, practical. Avoid mystical jargon. Speak simply.

  TASK: Generate Forecasts for ALL Personal Numbers (1 through 9).
  CONTEXT: Period: ${PERIOD_LABEL[period]} forecast for ${id}. Focus: ${NUMEROLOGY_FOCUS[period]}
  ${LANGUAGES_BLOCK}

  CONTENT STRUCTURE (for each number, in all 4 languages):${CONTENT_STRUCTURE}

  OUTPUT FORMAT: JSON ONLY. Keys "1" to "9".
  Structure: { "1": { "ru": { "title": "...", "summary": "...", ... }, "en": {...}, "uk": {...}, "zh-TW": {...} }, ... }
`;
  }

  return `
  ACT AS: Friendly, practical Astrologer.
  TASK: Generate Forecasts for ALL 12 Zodiac Signs.
  KEYS: ${ZODIAC_KEYS.join(', ')}.
  CONTEXT: Period: ${PERIOD_LABEL[period]} Horoscope for ${id}. Focus: ${ZODIAC_FOCUS[period]}

  STYLE GUIDELINES (CRITICAL):
  1. SIMPLE LANGUAGE: Do NOT use complex terms like "retrograde Mars in 2nd house" or "trine aspect".
  2. FOCUS ON LIFE: Translate astrology into real advice. Instead of "Mars is aggressive", say "You might feel a burst of energy today".
  3. WARM TONE: Be supportive and helpful, like a wise friend.
  ${LANGUAGES_BLOCK}

  CONTENT STRUCTURE (for each sign, in all 4 languages):${CONTENT_STRUCTURE}

  OUTPUT FORMAT: JSON ONLY.
  Structure: { "aries": { "ru": {...}, "en": {...}, "uk": {...}, "zh-TW": {...} }, ... }
`;
};

// --- GEMINI ---

const callGemini = async (prompt: string): Promise<string> => {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY! },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const json: any = await res.json();
  const text: string = (json.candidates?.[0]?.content?.parts ?? []).map((p: any) => p.text ?? '').join('');
  if (!text) throw new Error(`Gemini returned no text (finishReason: ${json.candidates?.[0]?.finishReason})`);

  // In case the model still wraps the response in markdown
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

// --- VALIDATION ---

const isValidData = (data: any, keys: string[]): boolean => {
  if (!data || typeof data !== 'object') return false;
  return keys.every(key =>
    LANGS.every(lang => data[key]?.[lang]?.title && data[key]?.[lang]?.summary)
  );
};

// --- GENERATION ---

const fileExists = async (file: string) => access(file).then(() => true, () => false);

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

// Returns false if generation failed after all retries
const generate = async (kind: Kind, period: Period, id: string): Promise<boolean> => {
  const collection = COLLECTIONS[kind][period];
  const file = path.join(OUT_DIR, collection, `${id}.json`);

  if (await fileExists(file)) {
    console.log(`✅ ${collection}/${id} already exists. Skipping.`);
    return true;
  }

  console.log(`🚀 Generating ${collection}/${id}...`);
  const keys = kind === 'numerology' ? NUMBER_KEYS : ZODIAC_KEYS;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const data = JSON.parse(await callGemini(buildPrompt(kind, period, id)));

      if (!isValidData(data, keys)) {
        throw new Error(`Validation Failed: missing keys or languages (${LANGS.join('/')})`);
      }

      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, JSON.stringify(data));
      console.log(`🎉 Saved ${collection}/${id} (attempt ${attempt})`);
      return true;
    } catch (e: any) {
      console.warn(`⚠️ Attempt ${attempt}/${MAX_RETRIES} failed for ${collection}/${id}: ${e.message}`);
      if (attempt < MAX_RETRIES) await sleep(3000);
    }
  }

  console.error(`🔥 FATAL: Could not generate ${collection}/${id} after ${MAX_RETRIES} attempts.`);
  return false;
};

// The client no longer needs old daily forecasts
const pruneDaily = async () => {
  const cutoff = dayId(-KEEP_DAILY_DAYS);

  for (const kind of Object.keys(COLLECTIONS) as Kind[]) {
    const dir = path.join(OUT_DIR, COLLECTIONS[kind].day);
    const files = await readdir(dir).catch(() => [] as string[]);

    for (const name of files) {
      if (name.endsWith('.json') && name.replace('.json', '') < cutoff) {
        await rm(path.join(dir, name));
        console.log(`🧹 Removed ${COLLECTIONS[kind].day}/${name}`);
      }
    }
  }
};

const main = async () => {
  if (!API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  // Without this GitHub Pages runs the branch through Jekyll
  await writeFile(path.join(OUT_DIR, '.nojekyll'), '');

  let failed = 0;
  for (const kind of Object.keys(COLLECTIONS) as Kind[]) {
    for (const period of Object.keys(TARGETS) as Period[]) {
      for (const id of TARGETS[period]) {
        if (!(await generate(kind, period, id))) failed++;
      }
    }
  }

  await pruneDaily();

  if (failed > 0) {
    console.error(`❌ ${failed} forecast(s) failed`);
    process.exitCode = 1;
  }
};

main();
