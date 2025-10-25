// lib/calculators/pythagoreanSquare.ts
import { CalculationResult, MatrixData } from '@/lib/types';

// Вспомогательная функция для суммирования цифр числа
function sumDigits(n: number | string): number {
  return String(n)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit), 0);
}

export function calculatePythagoreanSquare(date: Date): CalculationResult {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dStr = String(day).padStart(2, '0');
  const mStr = String(month).padStart(2, '0');
  const yStr = String(year);

  const fullDateStr = dStr + mStr + yStr;

  const sum1 = sumDigits(fullDateStr);
  const sum2 = sumDigits(sum1);

  let sum3: number;
  if (year >= 2000) {
    sum3 = sum1 + 19;
  } else {
    const firstDayDigit = parseInt(dStr[0] === '0' ? dStr[1] : dStr[0]);
    sum3 = Math.abs(sum1 - 2 * firstDayDigit);
  }

  const sum4 = sumDigits(sum3);

  const workingNumbers = [sum1, sum2, sum3, sum4];
  const fullNumberSeries =
    fullDateStr + workingNumbers.map(String).join('');

  const matrix: MatrixData = {
    '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': '',
  };

  for (const digit of fullNumberSeries) {
    if (digit !== '0' && digit in matrix) {
      matrix[digit as keyof MatrixData] += digit;
    }
  }

  return {
    matrix,
    workingNumbers,
  };
}
