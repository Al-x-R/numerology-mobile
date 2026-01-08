import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const MAX_RETRIES = 3;

// --- ХЕЛПЕРЫ ДАТ ---

const getDateString = (shiftDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + shiftDays);
  return d.toISOString().split("T")[0];
};

const getMonthString = (shiftMonths: number = 0): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + shiftMonths);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const getYearString = (shiftYears: number = 0): string => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + shiftYears);
  return `${d.getFullYear()}`;
};

// --- ВАЛИДАТОРЫ ДАННЫХ ---
// Теперь проверяем наличие 4 языков: RU, EN, UK, ZH-TW

function isValidNumerologyData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  const requiredKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const requiredLangs = ['ru', 'en', 'uk', 'zh-TW'];

  for (const key of requiredKeys) {
    if (!data[key]) return false;
    for (const lang of requiredLangs) {
      if (!data[key][lang] || !data[key][lang].title) return false;
    }
  }
  return true;
}

function isValidZodiacData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  const zodiacKeys = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  const requiredLangs = ['ru', 'en', 'uk', 'zh-TW'];

  for (const key of zodiacKeys) {
    if (!data[key]) return false;
    for (const lang of requiredLangs) {
      if (!data[key][lang] || !data[key][lang].title) return false;
    }
  }
  return true;
}

// --- 1. ГЕНЕРАТОР НУМЕРОЛОГИИ (ЦИФРЫ 1-9) ---

async function generateGenericForecast(
  collectionName: string,
  docId: string,
  promptContext: string,
  apiKey: string
) {
  const docRef = db.collection(collectionName).doc(docId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    logger.info(`✅ ${collectionName}/${docId} already exists. Skipping.`);
    return;
  }

  logger.info(`🚀 Generating NUMEROLOGY for ${collectionName}/${docId}...`);

  let attempt = 0;
  let success = false;

  while (attempt < MAX_RETRIES && !success) {
    attempt++;
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const basePrompt = `
        ACT AS: Modern, empathetic Life Coach & Numerologist.
        TONE: Inspiring, clear, practical. Avoid mystical jargon. Speak simply.
        
        TASK: Generate Forecasts for ALL Personal Numbers (1 through 9).
        CONTEXT: ${promptContext}
        
        REQUIREMENTS:
        1. JSON Format ONLY. keys "1" to "9".
        2. EACH number MUST have 4 languages: "ru", "en", "uk", "zh-TW".
        3. "zh-TW" MUST be Traditional Chinese (Taiwan style).
        
        CONTENT STRUCTURE (for each number, in all 4 languages):
        - "title": Short, catchy theme (3-5 words).
        - "summary": 2-3 sentences. Focus on actionable advice, not theory.
        - "love": Practical relationship advice.
        - "finance": Career/money tip.
        - "health": Energy/well-being tip.
        - "warning": A gentle caution (1 sentence).
        - "affirmation": Short, positive mantra.

        Output structure example: 
        { 
          "1": { 
             "ru": { "title": "...", "summary": "...", ... }, 
             "en": {...}, 
             "uk": {...}, 
             "zh-TW": {...} 
          }, 
          ... 
        }
      `;

      const result = await model.generateContent(basePrompt);
      let txt = result.response.text();

      // Очистка от маркдауна
      if (txt.includes("```json")) txt = txt.replace(/```json/g, "").replace(/```/g, "");
      else if (txt.includes("```")) txt = txt.replace(/```/g, "");
      txt = txt.trim();

      const data = JSON.parse(txt);

      // --- ВАЛИДАЦИЯ ---
      if (!isValidNumerologyData(data)) {
        throw new Error("Validation Failed: Missing keys or languages (ru/en/uk/zh-TW)");
      }

      await docRef.set(data);
      logger.info(`🎉 Saved NUMEROLOGY ${collectionName}/${docId} (Attempt ${attempt})`);
      success = true;

    } catch (e: any) {
      logger.warn(`⚠️ Attempt ${attempt}/${MAX_RETRIES} failed for ${collectionName}: ${e.message}`);
      if (attempt === MAX_RETRIES) {
        logger.error(`🔥 FATAL: Could not generate ${collectionName}/${docId} after ${MAX_RETRIES} attempts.`);
      } else {
        await new Promise(res => setTimeout(res, 2000)); // Ждем 2 сек
      }
    }
  }
}

// --- 2. ГЕНЕРАТОР ЗОДИАКА (ЗНАКИ) ---

async function generateZodiacForecast(
  collectionName: string,
  docId: string,
  promptContext: string,
  apiKey: string
) {
  const docRef = db.collection(collectionName).doc(docId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    logger.info(`✅ ${collectionName}/${docId} already exists. Skipping.`);
    return;
  }

  logger.info(`✨ Generating ZODIAC for ${collectionName}/${docId}...`);

  let attempt = 0;
  let success = false;

  while (attempt < MAX_RETRIES && !success) {
    attempt++;
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const basePrompt = `
        ACT AS: Friendly, practical Astrologer.
        TASK: Generate Forecasts for ALL 12 Zodiac Signs.
        KEYS: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces.
        CONTEXT: ${promptContext}
        
        STYLE GUIDELINES (CRITICAL):
        1. SIMPLE LANGUAGE: Do NOT use complex terms like "retrograde Mars in 2nd house" or "trine aspect". 
        2. FOCUS ON LIFE: Translate astrology into real advice. Instead of "Mars is aggressive", say "You might feel a burst of energy today".
        3. WARM TONE: Be supportive and helpful, like a wise friend.
        
        LANGUAGES REQUIRED:
        - "ru": Russian
        - "en": English
        - "uk": Ukrainian
        - "zh-TW": Traditional Chinese
        
        CONTENT STRUCTURE (for each sign, in all 4 languages):
        - "title": Short theme of the period.
        - "summary": Main advice. What to do? What to expect? (2-3 sentences).
        - "love": Simple advice for singles and couples.
        - "finance": Practical money/work tip.
        - "health": Vitality/rest tip.
        - "warning": One specific thing to avoid.
        - "affirmation": Positive thought for the day.

        OUTPUT FORMAT: JSON ONLY.
        Structure: 
        { 
          "aries": { 
            "ru": {...}, 
            "en": {...}, 
            "uk": {...}, 
            "zh-TW": {...} 
          }, 
          ... 
        }
      `;

      const result = await model.generateContent(basePrompt);
      let txt = result.response.text();

      if (txt.includes("```json")) txt = txt.replace(/```json/g, "").replace(/```/g, "");
      else if (txt.includes("```")) txt = txt.replace(/```/g, "");
      txt = txt.trim();

      const data = JSON.parse(txt);

      // --- ВАЛИДАЦИЯ ---
      if (!isValidZodiacData(data)) {
        throw new Error("Validation Failed: Missing signs or languages (ru/en/uk/zh-TW)");
      }

      await docRef.set(data);
      logger.info(`🎉 Saved ZODIAC ${collectionName}/${docId} (Attempt ${attempt})`);
      success = true;

    } catch (e: any) {
      logger.warn(`⚠️ Attempt ${attempt}/${MAX_RETRIES} failed for ${collectionName}: ${e.message}`);
      if (attempt === MAX_RETRIES) {
        logger.error(`🔥 FATAL: Could not generate ${collectionName}/${docId} after ${MAX_RETRIES} attempts.`);
      } else {
        await new Promise(res => setTimeout(res, 3000)); // Ждем 3 сек (контента больше)
      }
    }
  }
}

// --- 3. SCHEDULED FUNCTIONS (НУМЕРОЛОГИЯ) ---

export const generateDaily = onSchedule(
  {
    schedule: "every day 00:00",
    timeZone: "Etc/UTC",
    secrets: [geminiApiKey],
    timeoutSeconds: 300,
  },
  async () => {
    const targetDate = getDateString(1);
    await generateGenericForecast(
      "daily_forecasts",
      targetDate,
      `Period: DAILY forecast for Date: ${targetDate}. Focus: Immediate energy and daily tasks.`,
      geminiApiKey.value()
    );
  }
);

export const generateMonthly = onSchedule(
  {
    schedule: "28 of month 00:00",
    timeZone: "Etc/UTC",
    secrets: [geminiApiKey],
    timeoutSeconds: 300,
  },
  async () => {
    const targetMonth = getMonthString(1);
    await generateGenericForecast(
      "monthly_forecasts",
      targetMonth,
      `Period: MONTHLY forecast for Month: ${targetMonth}. Focus: General trends and month-long goals.`,
      geminiApiKey.value()
    );
  }
);

export const generateYearly = onSchedule(
  {
    schedule: "1 of dec 00:00",
    timeZone: "Etc/UTC",
    secrets: [geminiApiKey],
    timeoutSeconds: 540,
  },
  async () => {
    const targetYear = getYearString(1);
    await generateGenericForecast(
      "yearly_forecasts",
      targetYear,
      `Period: YEARLY forecast for Year: ${targetYear}. Focus: Big picture, strategy, major life changes.`,
      geminiApiKey.value()
    );
  }
);

// --- 4. SCHEDULED FUNCTIONS (ЗОДИАК) ---

export const generateDailyZodiac = onSchedule(
  {
    schedule: "every day 00:05",
    timeZone: "Etc/UTC",
    secrets: [geminiApiKey],
    timeoutSeconds: 300,
  },
  async () => {
    const targetDate = getDateString(1);
    await generateZodiacForecast(
      "daily_zodiac",
      targetDate,
      `Period: DAILY Horoscope for ${targetDate}. Focus: Mood, interactions, small events.`,
      geminiApiKey.value()
    );
  }
);

export const generateMonthlyZodiac = onSchedule(
  {
    schedule: "28 of month 00:05",
    timeZone: "Etc/UTC",
    secrets: [geminiApiKey],
    timeoutSeconds: 300,
  },
  async () => {
    const targetMonth = getMonthString(1);
    await generateZodiacForecast(
      "monthly_zodiac",
      targetMonth,
      `Period: MONTHLY Horoscope for ${targetMonth}. Focus: Themes of the month, career shifts, relationship dynamics.`,
      geminiApiKey.value()
    );
  }
);

export const generateYearlyZodiac = onSchedule(
  {
    schedule: "1 of dec 00:05",
    timeZone: "Etc/UTC",
    secrets: [geminiApiKey],
    timeoutSeconds: 540,
  },
  async () => {
    const targetYear = getYearString(1);
    await generateZodiacForecast(
      "yearly_zodiac",
      targetYear,
      `Period: YEARLY Horoscope for ${targetYear}. Focus: Major growth, challenges, and long-term success.`,
      geminiApiKey.value()
    );
  }
);

// --- 5. SEED DATABASE (РУЧНОЙ ЗАПУСК) ---

export const seedDatabase = onRequest(
  {
    secrets: [geminiApiKey],
    timeoutSeconds: 600,
  },
  async (req, res) => {
    const apiKey = geminiApiKey.value();


    // 1. Нумерология
    await generateGenericForecast("daily_forecasts", getDateString(0), `Period: DAILY (Seed) ${getDateString(0)}`, apiKey);
    await generateGenericForecast("monthly_forecasts", getMonthString(0), `Period: MONTHLY (Seed) ${getMonthString(0)}`, apiKey);
    await generateGenericForecast("yearly_forecasts", getYearString(0), `Period: YEARLY (Seed) ${getYearString(0)}`, apiKey);

    // 2. Зодиак
    await generateZodiacForecast("daily_zodiac", getDateString(0), `Period: DAILY ZODIAC (Seed) ${getDateString(0)}`, apiKey);
    await generateZodiacForecast("monthly_zodiac", getMonthString(0), `Period: MONTHLY ZODIAC (Seed) ${getMonthString(0)}`, apiKey);
    await generateZodiacForecast("yearly_zodiac", getYearString(0), `Period: YEARLY ZODIAC (Seed) ${getYearString(0)}`, apiKey);

    res.send(`✅ Database SEEDED completely (Numerology + Zodiac) with 4 languages & Simple Style.`);
  }
);
