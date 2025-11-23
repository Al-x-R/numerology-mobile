// lib/calculators/numerologyForecast.ts

/**
 * Recursive reduction to a single digit (1-9).
 * Master numbers (11, 22, 33) are reduced here for simplicity in daily forecasts.
 *
 * Рекурсивное сведение к одной цифре (1-9).
 * Мастер-числа (11, 22, 33) здесь редуцируются для простоты ежедневных прогнозов.
 */
const reduceSum = (num: number): number => {
  let sum = num;
  while (sum > 9) {
    sum = String(sum)
      .split('')
      .reduce((acc, curr) => acc + parseInt(curr), 0);
  }
  return sum;
};

/**
 * Calculates Personal Year Number.
 * Formula: Birth Day + Birth Month + Current Year.
 *
 * Расчет Числа Персонального Года.
 * Формула: День рождения + Месяц рождения + Текущий год.
 */
export const calculatePersonalYear = (birthDate: string, targetDate: Date = new Date()): number => {
  const [day, month] = birthDate.split('.').map(Number);
  const currentYear = targetDate.getFullYear();

  // Sum: Day + Month + Current Year
  const rawSum = day + month + currentYear;

  return reduceSum(rawSum);
};

/**
 * Calculates Personal Month Number.
 * Formula: Personal Year + Current Month.
 *
 * Расчет Числа Персонального Месяца.
 * Формула: Персональный Год + Текущий Месяц.
 */
export const calculatePersonalMonth = (birthDate: string, targetDate: Date = new Date()): number => {
  const personalYear = calculatePersonalYear(birthDate, targetDate);
  const currentMonth = targetDate.getMonth() + 1; // JS months are 0-11

  return reduceSum(personalYear + currentMonth);
};

/**
 * Calculates Personal Day Number (Key metric for Daily Forecast).
 * Formula: Personal Month + Current Day.
 *
 * Расчет Числа Персонального Дня (ключевая метрика для прогнозов на день).
 * Формула: Персональный Месяц + Текущий День.
 */
export const calculatePersonalDay = (birthDate: string, targetDate: Date = new Date()): number => {
  const personalMonth = calculatePersonalMonth(birthDate, targetDate);
  const currentDay = targetDate.getDate();

  return reduceSum(personalMonth + currentDay);
};

// Example usage / Пример использования:
// const pDay = calculatePersonalDay("02.07.1985", new Date());
// Returns a number from 1 to 9. / Возвращает число от 1 до 9.
// Then we fetch the text for this number and date from the DB. / Затем мы берем текст для этого числа на эту дату из БД.
