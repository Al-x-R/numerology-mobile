/// <reference types="node" />
// scripts/forecasts/generate.ts
// Generates forecasts with Gemini and writes them as static files `<outDir>/<collection>/<id>.json`.
// Existing files are never regenerated (unless listed in FORCE), so the script is safe to run any number of times.
//
// Usage: GEMINI_API_KEY=... node scripts/forecasts/generate.ts [outDir]
//   FORCE="daily_zodiac/2026-10-21,daily_forecasts/2026-10-21"  regenerate these files even if they exist
//   ONLY="daily_zodiac/2026-10-21:ru"  dry run: generate one collection/id in one language and print it, write nothing

import { access, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Body, EclipticGeoMoon, Illumination, MakeTime, MoonPhase } from 'astronomy-engine';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const OUT_DIR = path.resolve(process.argv[2] || 'public');
const FORCE = new Set((process.env.FORCE || '').split(',').map(s => s.trim()).filter(Boolean));
const ONLY = process.env.ONLY;
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 15_000;
const MAX_RETRY_DELAY_MS = 120_000;
const KEEP_DAILY_DAYS = 30;

type Lang = 'ru' | 'en' | 'uk';
const LANGS: Lang[] = ['ru', 'en', 'uk'];
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

// The client uses its local date, which can differ from UTC by up to one day either way.
// Today goes first: with a tight daily quota it is the one users need right now
const TARGETS: Record<Period, string[]> = {
  day: [dayId(0), dayId(1), dayId(-1)],
  month: [monthId(0), monthId(1)],
  year: [yearId(0), yearId(1)],
};

// --- FACTS FOR THE PROMPT ---

const LOCALE: Record<Lang, string> = { ru: 'ru-RU', en: 'en-US', uk: 'uk-UA' };
const LANGUAGE_NAME: Record<Lang, string> = { ru: 'Russian', en: 'English', uk: 'Ukrainian' };

// "in <sign>" per language: Russian and Ukrainian decline the sign name
const MOON_IN_SIGN: Record<Lang, string[]> = {
  ru: ['Овне', 'Тельце', 'Близнецах', 'Раке', 'Льве', 'Деве', 'Весах', 'Скорпионе', 'Стрельце', 'Козероге', 'Водолее', 'Рыбах'],
  uk: ['Овні', 'Тельці', 'Близнюках', 'Раку', 'Леві', 'Діві', 'Терезах', 'Скорпіоні', 'Стрільці', 'Козерозі', 'Водолії', 'Рибах'],
  en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
};

const MOON_PHASES: Record<Lang, string[]> = {
  ru: ['новолуние', 'растущий серп', 'первая четверть', 'растущая Луна', 'полнолуние', 'убывающая Луна', 'последняя четверть', 'убывающий серп'],
  uk: ['молодик', 'зростаючий серп', 'перша чверть', 'зростаючий Місяць', 'повня', 'спадний Місяць', 'остання чверть', 'спадний серп'],
  en: ['new moon', 'waxing crescent', 'first quarter', 'waxing gibbous', 'full moon', 'waning gibbous', 'last quarter', 'waning crescent'],
};

const MOON_LABEL: Record<Lang, (sign: string, phase: string, lit: number) => string> = {
  ru: (sign, phase, lit) => `Луна в ${sign} · ${phase}, ${lit}%`,
  uk: (sign, phase, lit) => `Місяць у ${sign} · ${phase}, ${lit}%`,
  en: (sign, phase, lit) => `Moon in ${sign} · ${phase}, ${lit}%`,
};

interface MoonInfo {
  signIndex: number;
  phaseIndex: number;
  illumination: number;
}

// Moon at noon UTC of the given day: phase angle, lit fraction and the tropical sign it is in
const moonOn = (id: string): MoonInfo => {
  const date = new Date(`${id}T12:00:00Z`);
  const phaseAngle = MoonPhase(date);
  return {
    signIndex: Math.floor(EclipticGeoMoon(MakeTime(date)).lon / 30) % 12,
    phaseIndex: Math.floor(((phaseAngle + 22.5) % 360) / 45),
    illumination: Math.round(Illumination(Body.Moon, date).phase_fraction * 100),
  };
};

const moonLabel = (moon: MoonInfo, lang: Lang) =>
  MOON_LABEL[lang](MOON_IN_SIGN[lang][moon.signIndex], MOON_PHASES[lang][moon.phaseIndex], moon.illumination);

const digitSum = (value: string): number => {
  let n = value.replace(/\D/g, '').split('').reduce((a, b) => a + Number(b), 0);
  while (n > 9) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
  return n;
};

const periodName = (period: Period, id: string, lang: Lang): string => {
  if (period === 'year') return id;
  if (period === 'month') {
    return new Date(`${id}-15T12:00:00Z`).toLocaleDateString(LOCALE[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  return new Date(`${id}T12:00:00Z`).toLocaleDateString(LOCALE[lang], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};

// Classic meanings of personal numbers, so forecasts for different numbers actually differ
const NUMBER_ARCHETYPES = `
  1 — beginnings, initiative, independence, leadership
  2 — partnership, patience, diplomacy, sensitivity
  3 — self-expression, creativity, social life, joy
  4 — work, structure, discipline, practical foundations
  5 — change, freedom, travel, the unexpected
  6 — family, home, responsibility, care, beauty
  7 — reflection, study, solitude, inner work
  8 — money, ambition, power, results
  9 — completion, letting go, generosity, closing cycles`;

const ZODIAC_TRAITS = `
  aries — fire, impulsive, brave; taurus — earth, steady, sensual; gemini — air, curious, talkative;
  cancer — water, caring, home-loving; leo — fire, proud, generous; virgo — earth, precise, helpful;
  libra — air, harmony-seeking, social; scorpio — water, intense, private; sagittarius — fire, free, optimistic;
  capricorn — earth, ambitious, disciplined; aquarius — air, independent, unconventional; pisces — water, dreamy, empathetic`;

// --- PROMPTS ---

const LENGTH: Record<Period, { summary: string; aspect: string }> = {
  day: { summary: '3-4 sentences', aspect: '2-3 sentences' },
  month: { summary: '5-6 sentences', aspect: '3-4 sentences' },
  year: { summary: '6-8 sentences', aspect: '4-5 sentences' },
};

const STYLE_RULES = `
  STYLE (CRITICAL):
  - Write natively in the target language, as a warm, witty columnist of a premium lifestyle magazine. Never translate from English in your head.
  - Concrete and situational: name moments of the day, small actions, typical situations ("in a meeting after lunch", "a message you keep postponing").
  - Every item must feel written for that sign/number only: use its traits and today's facts. No two items may share an opening, a structure or a key idea.
  - Second person, present/future tense, 0-1 exclamation marks per item.
  - BANNED clichés (and their equivalents in any language): "listen to your intuition", "be flexible", "stay open to new opportunities", "the stars favour you", "the universe", "harmony and balance", "drink more water", "take care of yourself", "avoid conflicts".
  - Astrology/numerology terms only in plain words, never jargon like "trine", "retrograde in the 2nd house".`;

const ITEM_FIELDS = (period: Period) => `
  FIELDS (for every item):
  - "title": 2-5 words, evocative and specific, no generic words like "day of opportunities".
  - "summary": ${LENGTH[period].summary}. The main theme and what to do with it.
  - "tags": exactly 3 short lowercase hashtag words without "#", e.g. "flexibility", "new_routes".
  - "energy": overall energy score 30-95 and a one-word "label" (e.g. "Dynamic", "Quiet", "Focused").
  - "love", "finance", "health": each ${LENGTH[period].aspect} of concrete advice, plus "score" 30-95 and a 1-2 word "label" describing the tone.
    Scores must vary between items and aspects; avoid giving everything 80+.
  - "warning": one sharp, specific caution sentence.
  - "affirmation": a short first-person mantra, max 12 words, not a cliché.`;

const EXAMPLE = `
  EXAMPLE of the expected quality (English, a daily item; do not copy it):
  { "title": "The Unsent Draft", "summary": "That message you have rewritten three times wants to go out today — send it before noon, while the wording still feels honest. The afternoon favours small repairs: a loose shelf, a stalled spreadsheet, a friendship that went quiet. By evening you will notice how much lighter the day got once one thing stopped waiting.", "tags": ["courage", "repairs", "clarity"], "energy": { "score": 72, "label": "Brisk" }, "love": { "text": "Say the thing you assumed was obvious. A two-line text beats a perfect speech you never give.", "score": 68, "label": "Candid" }, ... }`;

const buildPrompt = (kind: Kind, period: Period, id: string, lang: Lang, moon?: MoonInfo): string => {
  const facts = [
    `Period: ${period} forecast for ${periodName(period, id, lang)}.`,
    moon ? `Moon (use it naturally where it fits, at most once per item): ${moonLabel(moon, 'en')}.` : '',
    kind === 'numerology' && period === 'day' ? `Universal number of this date: ${digitSum(id)}.` : '',
  ].filter(Boolean).join('\n  ');

  const subject = kind === 'numerology'
    ? `numerology forecasts for ALL personal numbers 1-9. Each number's archetype must drive its text:${NUMBER_ARCHETYPES}`
    : `horoscopes for ALL 12 zodiac signs (${ZODIAC_KEYS.join(', ')}). Each sign's temperament must drive its text:${ZODIAC_TRAITS}`;

  return `
  TASK: Write ${period} ${subject}

  LANGUAGE: ${LANGUAGE_NAME[lang]} only (every text field).

  FACTS:
  ${facts}
  ${STYLE_RULES}
  ${ITEM_FIELDS(period)}
  ${EXAMPLE}

  OUTPUT: JSON object keyed by ${kind === 'numerology' ? '"1".."9"' : 'sign key'}, each value one item with the fields above.
`;
};

// Gemini structured output: guarantees valid JSON in the expected shape
const meterSchema = {
  type: 'OBJECT',
  properties: { score: { type: 'INTEGER' }, label: { type: 'STRING' } },
  required: ['score', 'label'],
};
const aspectSchema = {
  type: 'OBJECT',
  properties: { text: { type: 'STRING' }, score: { type: 'INTEGER' }, label: { type: 'STRING' } },
  required: ['text', 'score', 'label'],
};
const itemSchema = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    summary: { type: 'STRING' },
    tags: { type: 'ARRAY', items: { type: 'STRING' } },
    energy: meterSchema,
    love: aspectSchema,
    finance: aspectSchema,
    health: aspectSchema,
    warning: { type: 'STRING' },
    affirmation: { type: 'STRING' },
  },
  required: ['title', 'summary', 'tags', 'energy', 'love', 'finance', 'health', 'warning', 'affirmation'],
};
const responseSchema = (keys: string[]) => ({
  type: 'OBJECT',
  properties: Object.fromEntries(keys.map(key => [key, itemSchema])),
  required: keys,
});

// --- GEMINI ---

// Carries the delay Gemini asks for on 429 (RetryInfo.retryDelay, e.g. "37s")
class GeminiError extends Error {
  retryAfterMs?: number;
  // A per-day quota is gone: every further request fails for hours, so the run should stop
  dailyQuotaExhausted: boolean;

  constructor(message: string, retryAfterMs?: number, dailyQuotaExhausted = false) {
    super(message);
    this.retryAfterMs = retryAfterMs;
    this.dailyQuotaExhausted = dailyQuotaExhausted;
  }
}

const parseGeminiError = (status: number, body: string): GeminiError => {
  try {
    const error = JSON.parse(body).error;
    const retryDelay: string | undefined = error?.details?.find((d: any) => d.retryDelay)?.retryDelay;
    const retryAfterMs = retryDelay ? parseFloat(retryDelay) * 1000 : undefined;
    // On 429 QuotaFailure names the exhausted quota, e.g. "GenerateRequestsPerDayPerProjectPerModel-FreeTier"
    const violations: any[] = (error?.details ?? []).flatMap((d: any) => d.violations ?? []);
    const quotas = violations.map((v: any) => `${v.quotaId} (limit ${v.quotaValue})`);
    const quotaInfo = quotas.length ? ` [quota: ${quotas.join(', ')}; retry in ${retryDelay ?? '?'}]` : '';
    const dailyQuotaExhausted = status === 429 && violations.some((v: any) => String(v.quotaId).includes('PerDay'));
    return new GeminiError(`Gemini HTTP ${status}: ${error?.message ?? body}${quotaInfo}`, retryAfterMs, dailyQuotaExhausted);
  } catch {
    return new GeminiError(`Gemini HTTP ${status}: ${body.slice(0, 300)}`);
  }
};

const callGemini = async (prompt: string, keys: string[]): Promise<string> => {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY! },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: responseSchema(keys), temperature: 1 },
    }),
  });

  if (!res.ok) {
    throw parseGeminiError(res.status, await res.text());
  }

  const json: any = await res.json();
  const text: string = (json.candidates?.[0]?.content?.parts ?? []).map((p: any) => p.text ?? '').join('');
  if (!text) throw new Error(`Gemini returned no text (finishReason: ${json.candidates?.[0]?.finishReason})`);

  // In case the model still wraps the response in markdown
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

// --- VALIDATION / SHAPE ---

const isValidItem = (item: any): boolean =>
  !!item?.title && !!item?.summary && Array.isArray(item?.tags) &&
  ['love', 'finance', 'health'].every(a => item?.[a]?.text && Number.isFinite(item?.[a]?.score)) &&
  Number.isFinite(item?.energy?.score);

const clampScore = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

// Stored shape stays backward compatible: love/finance/health are strings as before,
// scores and labels go to `meters`, which older app versions simply ignore
const toStoredItem = (item: any) => ({
  title: item.title,
  summary: item.summary,
  love: item.love.text,
  finance: item.finance.text,
  health: item.health.text,
  warning: item.warning,
  affirmation: item.affirmation,
  tags: item.tags.slice(0, 3).map((t: string) => t.replace(/^#/, '').trim()).filter(Boolean),
  meters: {
    energy: { score: clampScore(item.energy.score), label: item.energy.label },
    love: { score: clampScore(item.love.score), label: item.love.label },
    finance: { score: clampScore(item.finance.score), label: item.finance.label },
    health: { score: clampScore(item.health.score), label: item.health.label },
  },
});

// --- GENERATION ---

const fileExists = async (file: string) => access(file).then(() => true, () => false);

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

// One language of one file; throws GeminiError with dailyQuotaExhausted to stop the whole run
const generateLanguage = async (kind: Kind, period: Period, id: string, lang: Lang, moon?: MoonInfo) => {
  const collection = COLLECTIONS[kind][period];
  const keys = kind === 'numerology' ? NUMBER_KEYS : ZODIAC_KEYS;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const data = JSON.parse(await callGemini(buildPrompt(kind, period, id, lang, moon), keys));
      const invalid = keys.filter(key => !isValidItem(data?.[key]));
      if (invalid.length) throw new Error(`Validation failed for: ${invalid.join(', ')}`);
      return Object.fromEntries(keys.map(key => [key, toStoredItem(data[key])]));
    } catch (e: any) {
      console.warn(`⚠️ Attempt ${attempt}/${MAX_RETRIES} failed for ${collection}/${id} [${lang}]: ${e.message}`);
      // Retrying cannot help until the quota resets; let main stop the run
      if (e instanceof GeminiError && e.dailyQuotaExhausted) throw e;
      if (attempt < MAX_RETRIES) {
        // Gemini is often overloaded (503) or rate limited (429), so back off exponentially
        const delay = Math.min(e.retryAfterMs ?? BASE_RETRY_DELAY_MS * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS);
        await sleep(delay);
      }
    }
  }
  return null;
};

// Returns false if generation failed after all retries
const generate = async (kind: Kind, period: Period, id: string): Promise<boolean> => {
  const collection = COLLECTIONS[kind][period];
  const name = `${collection}/${id}`;
  const file = path.join(OUT_DIR, collection, `${id}.json`);

  if (!FORCE.has(name) && await fileExists(file)) {
    console.log(`✅ ${name} already exists. Skipping.`);
    return true;
  }

  console.log(`🚀 Generating ${name}...`);
  const keys = kind === 'numerology' ? NUMBER_KEYS : ZODIAC_KEYS;
  const moon = period === 'day' ? moonOn(id) : undefined;

  // One request per language: a single multilingual answer squeezes every text to a line
  const byLang: Partial<Record<Lang, Record<string, any>>> = {};
  for (const lang of LANGS) {
    const result = await generateLanguage(kind, period, id, lang, moon);
    if (!result) {
      console.error(`🔥 FATAL: Could not generate ${name} [${lang}] after ${MAX_RETRIES} attempts.`);
      return false;
    }
    byLang[lang] = result;
  }

  const doc: Record<string, any> = Object.fromEntries(
    keys.map(key => [key, Object.fromEntries(LANGS.map(lang => [lang, byLang[lang]![key]]))]),
  );
  // Shared facts for the whole file, keyed outside the 1-9 / sign keys the app reads
  if (moon) {
    doc._meta = { moon: { ...moon, label: Object.fromEntries(LANGS.map(lang => [lang, moonLabel(moon, lang)])) } };
  }

  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(doc));
  console.log(`🎉 Saved ${name}`);
  return true;
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

// Dry run of one language of one file, printed instead of written; for tuning the prompt
const runOnly = async (spec: string) => {
  const [name, lang = 'ru'] = spec.split(':');
  const [collection, id] = name.split('/');
  const entry = Object.entries(COLLECTIONS).flatMap(([kind, periods]) =>
    Object.entries(periods).map(([period, c]) => ({ kind: kind as Kind, period: period as Period, c })),
  ).find(e => e.c === collection);
  if (!entry || !id) throw new Error(`Unknown ONLY target: ${spec}`);

  const moon = entry.period === 'day' ? moonOn(id) : undefined;
  if (moon) console.log(`🌙 ${moonLabel(moon, lang as Lang)}`);
  const result = await generateLanguage(entry.kind, entry.period, id, lang as Lang, moon);
  console.log(JSON.stringify(result, null, 2));
};

const main = async () => {
  if (!API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    process.exit(1);
  }

  if (ONLY) return runOnly(ONLY);

  await mkdir(OUT_DIR, { recursive: true });
  // Without this GitHub Pages runs the branch through Jekyll
  await writeFile(path.join(OUT_DIR, '.nojekyll'), '');

  // Period first, so daily forecasts of both kinds are made before the less urgent monthly/yearly ones
  const jobs = (Object.keys(TARGETS) as Period[]).flatMap(period =>
    TARGETS[period].flatMap(id => (Object.keys(COLLECTIONS) as Kind[]).map(kind => ({ kind, period, id }))),
  );

  let failed = 0;
  for (const [index, { kind, period, id }] of jobs.entries()) {
    try {
      if (!(await generate(kind, period, id))) failed++;
    } catch (e: any) {
      if (!(e instanceof GeminiError && e.dailyQuotaExhausted)) throw e;
      const left = jobs.length - index;
      console.error(`⛔ Daily Gemini quota exhausted, stopping. ${left} forecast(s) left for the next run.`);
      failed += left;
      break;
    }
  }

  await pruneDaily();

  if (failed > 0) {
    console.error(`❌ ${failed} forecast(s) failed`);
    process.exitCode = 1;
  }
};

main();
