// compatibilityCalculator.ts
import { t } from '@/lib/constants/locales';

export interface PythagoreanSquare {
  1: number; 2: number; 3: number;
  4: number; 5: number; 6: number;
  7: number; 8: number; 9: number;
}

type Param = {
  p1: number;
  p2: number;
  pct: number
};

export interface CompatibilityResult {
  energy: Param;
  character: Param;
  interest: Param;
  karma: Param;
  family: Param;
  talent: Param;
  spirituality: Param;

  baseCompatibilityPct: number;  // ← 3 параметра
  fullCompatibilityPct: number;  // ← 7 параметров
  recommendations: string[];
}

// Вспомогательная: сумма цифр в строке/столбце
const sumLine = (square: PythagoreanSquare, cells: number[]): number => {
  return cells.reduce((sum, cell) => sum + (square[cell as keyof PythagoreanSquare] || 0), 0);
};

// Процент совместимости: min / max * 100 (избегаем деления на 0)
const calcPct = (a: number, b: number): number => {
  if (a === 0 && b === 0) return 100;
  if (a === 0 || b === 0) return 0;
  return Math.round((Math.min(a, b) / Math.max(a, b)) * 100);
};

/**
 * Рассчитывает совместимость двух дат
 * Всегда возвращает полный результат
 */
export const calculateCompatibility = (
  date1: string, // "12.12.2022"
  date2: string
): CompatibilityResult => {
  // 1. Получаем квадраты Пифагора
  const sq1 = calculatePythagoreanSquare(date1);
  const sq2 = calculatePythagoreanSquare(date2);

  // 2. Базовые параметры
  const energy1 = sumLine(sq1, [2, 5, 8]);
  const energy2 = sumLine(sq2, [2, 5, 8]);
  const char1 = sumLine(sq1, [1, 4, 7]);
  const char2 = sumLine(sq2, [1, 4, 7]);
  const interest1 = sumLine(sq1, [3, 6, 9]);
  const interest2 = sumLine(sq2, [3, 6, 9]);

  // 3. Премиум параметры
  const karma1 = sumLine(sq1, [4, 5, 6]);
  const karma2 = sumLine(sq2, [4, 5, 6]);
  const family1 = sumLine(sq1, [4, 5, 6, 7, 8, 9]);
  const family2 = sumLine(sq2, [4, 5, 6, 7, 8, 9]);
  const talent1 = sumLine(sq1, [3, 6, 9]);
  const talent2 = sumLine(sq2, [3, 6, 9]);
  const spirit1 = sumLine(sq1, [7, 8, 9]);
  const spirit2 = sumLine(sq2, [7, 8, 9]);

  // 4. Формируем результат
  const result: CompatibilityResult = {
    energy: { p1: energy1, p2: energy2, pct: calcPct(energy1, energy2) },
    character: { p1: char1, p2: char2, pct: calcPct(char1, char2) },
    interest: { p1: interest1, p2: interest2, pct: calcPct(interest1, interest2) },
    karma: { p1: karma1, p2: karma2, pct: calcPct(karma1, karma2) },
    family: { p1: family1, p2: family2, pct: calcPct(family1, family2) },
    talent: { p1: talent1, p2: talent2, pct: calcPct(talent1, talent2) },
    spirituality: { p1: spirit1, p2: spirit2, pct: calcPct(spirit1, spirit2) },

    baseCompatibilityPct: 0,
    fullCompatibilityPct: 0,
    recommendations: [],
  };

  // 5. Рассчитываем проценты
  result.baseCompatibilityPct = Math.round(
    (result.energy.pct + result.character.pct + result.interest.pct) / 3
  );

  result.fullCompatibilityPct = Math.round(
    (result.energy.pct +
      result.character.pct +
      result.interest.pct +
      result.karma.pct +
      result.family.pct +
      result.talent.pct +
      result.spirituality.pct) / 7
  );

  // 6. Генерируем рекомендации (всегда, но показываем только в премиум)
  result.recommendations = generateRecommendations(result);

  return result;
};

export const calculatePythagoreanSquare = (dateStr: string): PythagoreanSquare => {
  const cleaned = dateStr.replace(/\D/g, '');
  if (cleaned.length !== 8) throw new Error('Invalid date format');

  const day = parseInt(cleaned.slice(0, 2), 10);
  const month = parseInt(cleaned.slice(2, 4), 10);
  const year = parseInt(cleaned.slice(4, 8), 10);

  const numbers = [day, month, year];
  // Рабочие числа
  const work1 = numbers.reduce((a, b) => a + b, 0);
  const work2 = work1
    .toString()
    .split('')
    .reduce((a, b) => a + parseInt(b, 10), 0);
  const work3 = Math.abs(work1 - 2 * day);
  const work4 = work3
    .toString()
    .split('')
    .reduce((a, b) => a + parseInt(b, 10), 0);

  const allDigits = [
    ...numbers,
    ...work1.toString().split('').map(Number),
    ...work2.toString().split('').map(Number),
    ...work3.toString().split('').map(Number),
    ...work4.toString().split('').map(Number),
  ].filter(d => d !== 0);

  const square: PythagoreanSquare = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  allDigits.forEach(d => {
    if (d >= 1 && d <= 9) square[d as keyof PythagoreanSquare]++;
  });

  return square;
};

const generateRecommendations = (result: CompatibilityResult): string[] => {
  const recs: string[] = [];

  if (result.energy.pct < 50) recs.push(t('recEnergyLow'));
  if (result.character.pct < 50) recs.push(t('recCharacterDiff'));
  if (result.interest.pct < 50) recs.push(t('recFindHobby'));
  if (result.karma.pct > 80) recs.push(t('recKarmaHigh'));
  if (result.family.pct > 70) recs.push(t('recFamilyStrong'));
  if (result.talent.pct > 80) recs.push(t('recTalentSynergy'));

  return recs.length > 0
    ? recs
    : [t('recHarmony')];
};
