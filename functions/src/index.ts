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
// Эти функции спасут базу от неполных данных (например, если нет EN языка)

function isValidNumerologyData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  const requiredKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  for (const key of requiredKeys) {
    if (!data[key]) return false;
    // Обязательно проверяем наличие обоих языков
    if (!data[key].ru || !data[key].en) return false;
    // Можно добавить проверку полей, например title
    if (!data[key].ru.title || !data[key].en.title) return false;
  }
  return true;
}

function isValidZodiacData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  const zodiacKeys = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

  for (const key of zodiacKeys) {
    if (!data[key]) return false;
    // Обязательно проверяем наличие обоих языков
    if (!data[key].ru || !data[key].en) return false;
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
        model: "gemini-2.5-flash", // Используем правильную модель
        generationConfig: { responseMimeType: "application/json" },
      });

      const basePrompt = `
        ACT AS: Modern, practical Numerologist and Life Coach.
        TONE: Concise, grounded, professional.
        
        TASK: Generate Forecasts for ALL Personal Numbers (1 through 9).
        CONTEXT: ${promptContext}
        
        REQUIREMENTS:
        1. JSON Format ONLY. keys "1" to "9".
        2. EACH number MUST have "ru" AND "en" objects inside.
        
        CONTENT STRUCTURE (for each number, in "ru" and "en"):
        - "title": 3-5 words.
        - "summary": 2-3 sentences.
        - "love": Relationship focus.
        - "finance": Career/money focus.
        - "health": Energy/well-being focus.
        - "warning": What to watch out for.
        - "affirmation": Short empowering mantra.

        Output: { "1": { "ru": {...}, "en": {...} }, ..., "9": {...} }
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
        throw new Error("Validation Failed: Missing keys or translation (ru/en)");
      }

      await docRef.set(data);
      logger.info(`🎉 Saved NUMEROLOGY ${collectionName}/${docId} (Attempt ${attempt})`);
      success = true;

    } catch (e: any) {
      logger.warn(`⚠️ Attempt ${attempt}/${MAX_RETRIES} failed for ${collectionName}: ${e.message}`);
      if (attempt === MAX_RETRIES) {
        logger.error(`🔥 FATAL: Could not generate ${collectionName}/${docId} after ${MAX_RETRIES} attempts.`);
      } else {
        // Ждем 1 секунду перед повтором
        await new Promise(res => setTimeout(res, 1000));
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
        model: "gemini-2.5-flash", // Используем правильную модель
        generationConfig: { responseMimeType: "application/json" },
      });

      const basePrompt = `
        ACT AS: Professional Astrologer.
        TASK: Generate Forecasts for ALL 12 Zodiac Signs.
        KEYS: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces.
        CONTEXT: ${promptContext}
        
        CRITICAL INSTRUCTIONS:
        1. REALISM: Use actual planetary transits.
        2. TRANSLATION: "ru" MUST be Russian, "en" MUST be English.
        3. COMPLETENESS: Do NOT skip any sign or language.
        
        CONTENT STRUCTURE (for each sign, in "ru" and "en"):
        - "title": Short cosmic theme.
        - "summary": Main astrological influence.
        - "love": Relationships advice.
        - "finance": Career/Money advice.
        - "health": Vitality advice.
        - "warning": Retrogrades/aspects to watch.
        - "affirmation": Mantra.

        OUTPUT FORMAT: JSON ONLY.
        Structure: { "aries": { "ru": {...}, "en": {...} }, "taurus": {...}, ... }
      `;

      const result = await model.generateContent(basePrompt);
      let txt = result.response.text();

      if (txt.includes("```json")) txt = txt.replace(/```json/g, "").replace(/```/g, "");
      else if (txt.includes("```")) txt = txt.replace(/```/g, "");
      txt = txt.trim();

      const data = JSON.parse(txt);

      // --- ВАЛИДАЦИЯ ---
      if (!isValidZodiacData(data)) {
        throw new Error("Validation Failed: Missing signs or translations (ru/en)");
      }

      await docRef.set(data);
      logger.info(`🎉 Saved ZODIAC ${collectionName}/${docId} (Attempt ${attempt})`);
      success = true;

    } catch (e: any) {
      logger.warn(`⚠️ Attempt ${attempt}/${MAX_RETRIES} failed for ${collectionName}: ${e.message}`);
      if (attempt === MAX_RETRIES) {
        logger.error(`🔥 FATAL: Could not generate ${collectionName}/${docId} after ${MAX_RETRIES} attempts.`);
      } else {
        // Ждем 2 секунды перед повтором, чтобы API "остыло"
        await new Promise(res => setTimeout(res, 2000));
      }
    }
  }
}

// --- 3. SCHEDULED FUNCTIONS (НУМЕРОЛОГИЯ) ---
// Увеличили timeoutSeconds до 300 (5 минут), так как возможны повторы

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
      `Period: DAILY forecast for Date: ${targetDate}. Focus on immediate energy.`,
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
      `Period: MONTHLY forecast for Month: ${targetMonth}. Focus on trends.`,
      geminiApiKey.value()
    );
  }
);

export const generateYearly = onSchedule(
  {
    schedule: "1 of dec 00:00",
    timeZone: "Etc/UTC",
    secrets: [geminiApiKey],
    timeoutSeconds: 540, // 9 минут для годового (он сложнее)
  },
  async () => {
    const targetYear = getYearString(1);
    await generateGenericForecast(
      "yearly_forecasts",
      targetYear,
      `Period: YEARLY forecast for Year: ${targetYear}. Focus on global strategy.`,
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
      `Period: DAILY Horoscope for ${targetDate}. Focus on planetary transits of the day.`,
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
      `Period: MONTHLY Horoscope for ${targetMonth}. Focus on major planetary shifts.`,
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
      `Period: YEARLY Horoscope for ${targetYear}. Focus on Jupiter, Saturn, Pluto movements.`,
      geminiApiKey.value()
    );
  }
);

// --- 5. SEED DATABASE (РУЧНОЙ ЗАПУСК) ---

export const seedDatabase = onRequest(
  {
    secrets: [geminiApiKey],
    timeoutSeconds: 600, // 10 минут, так как задач много и могут быть повторы
  },
  async (req, res) => {
    const apiKey = geminiApiKey.value();

    // 1. Нумерология (День, Месяц, Год - текущие)
    // await generateGenericForecast("daily_forecasts", getDateString(0), `Period: DAILY (Seed) ${getDateString(0)}`, apiKey);
    // await generateGenericForecast("monthly_forecasts", getMonthString(0), `Period: MONTHLY (Seed) ${getMonthString(0)}`, apiKey);
    // await generateGenericForecast("yearly_forecasts", getYearString(0), `Period: YEARLY (Seed) ${getYearString(0)}`, apiKey);

    // 2. Зодиак (День, Месяц, Год - текущие)
    await generateZodiacForecast("daily_zodiac", getDateString(0), `Period: DAILY ZODIAC (Seed) ${getDateString(0)}`, apiKey);
    // await generateZodiacForecast("monthly_zodiac", getMonthString(0), `Period: MONTHLY ZODIAC (Seed) ${getMonthString(0)}`, apiKey);
    // await generateZodiacForecast("yearly_zodiac", getYearString(0), `Period: YEARLY ZODIAC (Seed) ${getYearString(0)}`, apiKey);

    res.send(`✅ Database SEEDED completely (Numerology + Zodiac) for NOW.`);
  }
);
