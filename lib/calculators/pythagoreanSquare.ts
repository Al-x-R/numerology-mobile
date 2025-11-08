// lib/calculators/pythagoreanSquare.ts
import { CalculationResult, MatrixData, AdditionalParams } from '@/lib/types/calculation';

function sumDigits(n: number | string): number {
  return String(n)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}

// Вспомогательная функция для подсчета количества цифр в ячейке
function countMatrixDigits(matrix: MatrixData, digitKey: keyof MatrixData): number {
  // В отличие от string.length, этот метод корректно вернет 0, если ячейка пуста ('')
  return matrix[digitKey].length;
}

export function calculatePythagoreanSquare(date: Date): CalculationResult {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dStr = String(day).padStart(2, '0');
  const mStr = String(month).padStart(2, '0');
  const yStr = String(year);

  const fullDateStr = dStr + mStr + yStr;

  // --- Расчет Дополнительных Чисел (Рабочие числа) ---
  const sum1 = sumDigits(fullDateStr);
  const sum2 = sumDigits(sum1);

  // Берем ПЕРВУЮ НЕ-НУЛЕВУЮ цифру дня рождения для классического Д3
  const nonZeroFirstDayDigit = parseInt(dStr.replace(/^0+/,'')[0], 10);
  const sum3 = sum1 - 2 * nonZeroFirstDayDigit;

  const sum4 = sumDigits(sum3);

  const workingNumbers = [sum1, sum2, sum3, sum4];

  // --- Формирование и Заполнение Матрицы ---
  const fullNumberSeries = fullDateStr + workingNumbers.map(String).join('');

  const matrix: MatrixData = {
    '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': '',
  };

  for (const digit of fullNumberSeries) {
    if (digit !== '0' && digit in matrix) {
      matrix[digit as keyof MatrixData] += digit;
    }
  }

  // --- Расчет Дополнительных Параметров ---

  // Количество цифр в каждой ячейке:
  const C1 = countMatrixDigits(matrix, '1');
  const C2 = countMatrixDigits(matrix, '2');
  const C3 = countMatrixDigits(matrix, '3');
  const C4 = countMatrixDigits(matrix, '4');
  const C5 = countMatrixDigits(matrix, '5');
  const C6 = countMatrixDigits(matrix, '6');
  const C7 = countMatrixDigits(matrix, '7');
  const C8 = countMatrixDigits(matrix, '8');
  const C9 = countMatrixDigits(matrix, '9');

  const additionalParams: AdditionalParams = {
    // Ячейка 1
    character: C1,
    goal: C1,
    // Ячейка 2
    energy: matrix['2'],
    utilityMoney: C2,
    // Ячейка 3
    interest: matrix['3'],
    talent: C3,
    spirituality: C3,
    // Ячейка 4
    health: C4,
    // Ячейка 5
    logic: C5,
    habits: C5,
    // Ячейка 6
    labor: C6,
    family: C6,
    // Ячейка 7
    luck: C7,
    selfEsteem: C7,
    // Ячейка 8
    duty: matrix['8'],
    // Ячейка 9
    memory: C9,
    // Дополнительные вычисляемые параметры
    temperament: C3 + C5 + C7,
    destinyNumber: sum2,
  };

  console.log('additionalParams', additionalParams);
  return {
    matrix,
    workingNumbers,
    additionalParams,
  };
}
