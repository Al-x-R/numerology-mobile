import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { defineSecret } from "firebase-functions/params";

// import { onRequest } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

const geminiApiKey = defineSecret("GEMINI_API_KEY");

// --- ХЕЛПЕРЫ ДАТ ---

// "2025-12-05" (сдвиг в днях)
const getDateString = (shiftDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + shiftDays);
  return d.toISOString().split("T")[0];
};

// "2025-12" (сдвиг в месяцах)
const getMonthString = (shiftMonths: number = 0): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + shiftMonths);
  // Формат YYYY-MM
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// "2026" (сдвиг в годах)
const getYearString = (shiftYears: number = 0): string => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + shiftYears);
  return `${d.getFullYear()}`;
};

// --- УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ГЕНЕРАЦИИ ---

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

  logger.info(`🚀 Generating for ${collectionName}/${docId}...`);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    // Общая часть промпта
    const basePrompt = `
      ACT AS: Modern, practical Numerologist and Life Coach.
      TONE: Concise, grounded, professional, supportive.
      STYLE: Direct, essentialist, no fluff. Focus on actionable advice.
      
      TASK: Generate Forecasts for ALL Personal Numbers (1 through 9).
      CONTEXT: ${promptContext}
      
      CONTENT REQUIREMENTS (for each number, in "ru" and "en"):
      1. "title": 3-5 words. Strong header.
      2. "summary": Essence of the period (2-3 sentences).
      3. "love": Relationship focus.
      4. "finance": Career/money focus.
      5. "health": Energy/well-being focus.
      6. "warning": What to watch out for.
      7. "affirmation": Short empowering statement.

      OUTPUT FORMAT: JSON ONLY. No markdown.
      Structure: { "1": { "ru": {...}, "en": {...} }, ..., "9": {...} }
    `;

    const result = await model.generateContent(basePrompt);
    let txt = result.response.text();

    // Чистка JSON
    if (txt.includes("```json")) txt = txt.replace(/```json/g, "").replace(/```/g, "");
    else if (txt.includes("```")) txt = txt.replace(/```/g, "");
    txt = txt.trim();

    const data = JSON.parse(txt);

    // Проверка
    if (!data["1"] || !data["9"]) throw new Error("Incomplete data");

    await docRef.set(data);
    logger.info(`🎉 Saved ${collectionName}/${docId}`);

  } catch (e) {
    logger.error(`🔥 Error in ${collectionName}:`, e);
  }
}

// --- 1. ЕЖЕДНЕВНЫЙ ПРОГНОЗ ---
// Запуск: Каждую ночь в 00:00. Генерируем на ЗАВТРА.
export const generateDaily = onSchedule(
  {
    schedule: "every day 00:00",
    timeZone: "Etc/UTC",
    secrets: [geminiApiKey],
    timeoutSeconds: 60,
  },
  async () => {
    const targetDate = getDateString(1); // Завтра
    await generateGenericForecast(
      "daily_forecasts",
      targetDate,
      `Period: DAILY forecast for Date: ${targetDate}. Focus on immediate energy and daily tasks.`,
      geminiApiKey.value()
    );
  }
);

// --- 2. ЕЖЕМЕСЯЧНЫЙ ПРОГНОЗ ---
// Запуск: 28-го числа каждого месяца в 00:00. Генерируем на СЛЕДУЮЩИЙ месяц.
export const generateMonthly = onSchedule(
  {
    schedule: "28 of month 00:00",
    timeZone: "Etc/UTC",
    secrets: [geminiApiKey],
    timeoutSeconds: 120, // Чуть больше времени, тексты сложнее
  },
  async () => {
    const targetMonth = getMonthString(1); // Следующий месяц (2025-12)
    await generateGenericForecast(
      "monthly_forecasts",
      targetMonth,
      `Period: MONTHLY forecast for Month: ${targetMonth}. Focus on trends, evolution over 4 weeks, and broader themes.`,
      geminiApiKey.value()
    );
  }
);

// --- 3. ГОДОВОЙ ПРОГНОЗ ---
// Запуск: 1 декабря каждого года. Генерируем на СЛЕДУЮЩИЙ год.
export const generateYearly = onSchedule(
  {
    schedule: "1 of dec 00:00",
    timeZone: "Etc/UTC",
    secrets: [geminiApiKey],
    timeoutSeconds: 300, // Даем 5 минут, тут нужно подумать
  },
  async () => {
    const targetYear = getYearString(1); // Следующий год (2026)
    await generateGenericForecast(
      "yearly_forecasts",
      targetYear,
      `Period: YEARLY forecast for Year: ${targetYear}. Focus on global strategy, major life lessons, and the "big picture" for the whole 12 months.`,
      geminiApiKey.value()
    );
  }
);

// --- 4. РУЧНОЙ ЗАПУСК (SEED) ---
// Эта функция нужна, чтобы один раз заполнить базу данными "прямо сейчас".
// После использования её можно удалить или закомментировать.
// export const seedDatabase = onRequest(
//   {
//     secrets: [geminiApiKey],
//     timeoutSeconds: 300, // Даем 5 минут, работы много
//   },
//   async (req, res) => {
//     const apiKey = geminiApiKey.value();
//
//     // 1. Генерируем ДЕНЬ (на сегодня)
//     const today = getDateString(0);
//     await generateGenericForecast(
//       "daily_forecasts",
//       today,
//       `Period: DAILY forecast for Date: ${today}. Focus on immediate energy.`,
//       apiKey
//     );
//
//     // 2. Генерируем МЕСЯЦ (на текущий)
//     const thisMonth = getMonthString(0);
//     await generateGenericForecast(
//       "monthly_forecasts",
//       thisMonth,
//       `Period: MONTHLY forecast for Month: ${thisMonth}. Focus on trends.`,
//       apiKey
//     );
//
//     // 3. Генерируем ГОД (на текущий)
//     const thisYear = getYearString(0);
//     await generateGenericForecast(
//       "yearly_forecasts",
//       thisYear,
//       `Period: YEARLY forecast for Year: ${thisYear}. Focus on global strategy.`,
//       apiKey
//     );
//
//     res.send(`✅ Database seeded for: ${today}, ${thisMonth}, ${thisYear}`);
//   }
// );
