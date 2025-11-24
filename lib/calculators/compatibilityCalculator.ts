// lib/calculators/compatibilityCalculator.ts

import { RU_NUMEROLOGY_CONTENT, EN_NUMEROLOGY_CONTENT, CompatibilityTexts } from '@/lib/constants/numerologyTexts';
import { getCurrentLocale, t } from '@/lib/constants/locales';

const getNumerologyContent = (): CompatibilityTexts => {
  const locale = getCurrentLocale();
  return locale === 'ru' ? RU_NUMEROLOGY_CONTENT : EN_NUMEROLOGY_CONTENT;
};

export type NumerologyPair = {
  p1: number;
  p2: number;
  pct: number;
};

export interface CompatibilityResult {
  lifePath1: number;
  lifePath2: number;
  destinyNumber: number; // Число союза
  totalPct: number;

  // Текстовые данные
  generalAnalysis: string;
  destinyInfo: {
    overview: string;
    mission: string;
    purpose: string;
    summary: string;
    challenges: string[];
    advice: string;
  };

  // Параметры психоматрицы
  energy: NumerologyPair;
  character: NumerologyPair;
  interest: NumerologyPair;

  // Премиум параметры
  karma?: NumerologyPair;
  family?: NumerologyPair;
  talent?: NumerologyPair;
  spirituality?: NumerologyPair;

  fullTotalPct?: number;
  recommendations?: string[];
}

const reduceToSingleDigit = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
};

export const calculateLifePath = (dateString: string): number => {
  if (!dateString || dateString.length !== 10) return 0;
  const parts = dateString.split('.');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  const monthReduced = reduceToSingleDigit(month);
  const dayReduced = reduceToSingleDigit(day);
  const yearSum = String(year).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const yearReduced = reduceToSingleDigit(yearSum);

  return reduceToSingleDigit(dayReduced + monthReduced + yearReduced);
};

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

const calculateWorkingNumbers = (dateString: string, lp: number): number[] => {
  const dateNum = dateString.replace(/\./g, '');
  const numSum = dateNum.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const day = parseInt(dateString.split('.')[0]);

  const P1 = numSum;
  const P2 = reduceToSingleDigit(P1);
  const firstDigitOfDay = day >= 10 ? parseInt(String(day)[0]) : day;
  const P3 = P1 - 2 * firstDigitOfDay;
  const P4 = reduceToSingleDigit(P3);

  return [P1, P2, P3, P4];
}

const calculatePsychomatrix = (dateString: string): { [key: number]: number } => {
  const lifePath = calculateLifePath(dateString);
  const [P1, P2, P3, P4] = calculateWorkingNumbers(dateString, lifePath);
  let allDigits = dateString.replace(/\./g, '') + String(P1) + String(P2) + String(P3) + String(P4);

  const matrix: { [key: number]: number } = {};
  for (let i = 1; i <= 9; i++) {
    matrix[i] = 0;
  }

  allDigits.split('').forEach(digitChar => {
    const digit = parseInt(digitChar);
    if (digit >= 1 && digit <= 9) {
      matrix[digit] = (matrix[digit] || 0) + 1;
    }
  });

  return matrix;
};

const calculatePct = (val1: number, val2: number): number => {
  const diff = Math.abs(val1 - val2);
  let basePct: number;
  if (diff === 0) basePct = 95;
  else if (diff === 1) basePct = 85;
  else if (diff === 2) basePct = 70;
  else if (diff >= 3) basePct = 40;
  else basePct = 20;

  if (val1 > 0 && val2 > 0) basePct += 5;
  return Math.min(100, Math.max(10, basePct));
};

// --- ПОЛУЧЕНИЕ ТЕКСТОВ ---

const getLifePathCompatibilityAnalysis = (lp1: number, lp2: number): string => {
  const content = getNumerologyContent();
  const [numA, numB] = lp1 < lp2 ? [lp1, lp2] : [lp2, lp1];
  const key = `${numA}-${numB}`;
  const analysis = content.lpAnalysis[key];

  if (analysis) {
    return `${analysis.title}\n\n` +
      `✅ ${analysis.strengths}\n\n` +
      `⚠️ ${analysis.challenges}\n\n` +
      `💡 ${analysis.focus}`;
  }
  return `Совместимость чисел ${numA} и ${numB} — анализ пока недоступен.`;
};

const getCompatibilityRecommendations = (lp1: number, lp2: number): string[] => {
  const content = getNumerologyContent();
  const [numA, numB] = lp1 < lp2 ? [lp1, lp2] : [lp2, lp1];
  const key = `${numA}-${numB}`;
  return content.recommendations[key] || content.recommendations["default"] || [];
};

const DESTINY_FALLBACK_KEYS = {
  overview: 'compatibility.destinyFallback.overview',
  mission: 'compatibility.destinyFallback.mission',
  purpose: 'compatibility.destinyFallback.purpose',
  summary: 'compatibility.destinyFallback.summary',
  challenges: 'compatibility.destinyFallback.challenges',
  advice: 'compatibility.destinyFallback.advice',
};

const getDestinyInfo = (destinyNum: number): CompatibilityResult['destinyInfo'] => {
  const content = getNumerologyContent();

  const info = content.destinyAnalysis[String(destinyNum)];

  if (info) return info;

  return {
    overview: t(DESTINY_FALLBACK_KEYS.overview),
    mission: t(DESTINY_FALLBACK_KEYS.mission),
    purpose: t(DESTINY_FALLBACK_KEYS.purpose),
    summary: t(DESTINY_FALLBACK_KEYS.summary),
    challenges: [t(DESTINY_FALLBACK_KEYS.challenges)],
    advice: t(DESTINY_FALLBACK_KEYS.advice)
  };
};

/**
 * ГЛАВНЫЙ РАСЧЕТ
 */
export const calculateCompatibility = (
  date1: string,
  date2: string,
  isPremium: boolean = false
): CompatibilityResult => {
  const lifePath1 = calculateLifePath(date1);
  const lifePath2 = calculateLifePath(date2);

  // 1. Считаем Число Союза
  const destinyNumber = reduceToSingleDigit(lifePath1 + lifePath2);

  const matrix1 = calculatePsychomatrix(date1);
  const matrix2 = calculatePsychomatrix(date2);

  const characterPct = calculatePct(matrix1[1], matrix2[1]);
  const energyPct = calculatePct(matrix1[2], matrix2[2]);
  const interestPct = calculatePct(matrix1[3], matrix2[3]);

  const basicAvgPct = Math.round((energyPct + characterPct + interestPct) / 3);

  let result: CompatibilityResult = {
    lifePath1,
    lifePath2,
    destinyNumber,
    totalPct: basicAvgPct,

    // 2. Заполняем тексты из базы данных
    generalAnalysis: getLifePathCompatibilityAnalysis(lifePath1, lifePath2),
    destinyInfo: getDestinyInfo(destinyNumber), // <--- Текст берется отсюда

    energy: { p1: matrix1[2], p2: matrix2[2], pct: energyPct },
    character: { p1: matrix1[1], p2: matrix2[1], pct: characterPct },
    interest: { p1: matrix1[3], p2: matrix2[3], pct: interestPct },
  };

  if (isPremium) {
    const karmaPct = calculatePct(matrix1[6], matrix2[6]);
    const familyPct = calculatePct(matrix1[5], matrix2[5]);
    const talentPct = calculatePct(matrix1[4], matrix2[4]);
    const spiritualityPct = calculatePct(matrix1[7], matrix2[7]);

    const fullAvgPct = Math.round(
      (basicAvgPct * 3 + karmaPct + familyPct + talentPct + spiritualityPct) / 7
    );

    result = {
      ...result,
      karma: { p1: matrix1[6], p2: matrix2[6], pct: karmaPct },
      family: { p1: matrix1[5], p2: matrix2[5], pct: familyPct },
      talent: { p1: matrix1[4], p2: matrix2[4], pct: talentPct },
      spirituality: { p1: matrix1[7], p2: matrix2[7], pct: spiritualityPct },
      fullTotalPct: fullAvgPct,
      recommendations: getCompatibilityRecommendations(lifePath1, lifePath2),
    };
  }

  return result;
};
