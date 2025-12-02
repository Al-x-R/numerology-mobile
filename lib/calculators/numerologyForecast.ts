// lib/calculators/numerologyForecast.ts

/**
 * Рекурсивное сведение к одной цифре (1-9).
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
 * Хелпер для получения Дня и Месяца из любого формата даты.
 * Поддерживает:
 * - "YYYY-MM-DD" (Firestore: "1985-07-02")
 * - "DD.MM.YYYY" (Input: "02.07.1985")
 * - Date object
 */
const getDayAndMonth = (date: string | Date): { day: number, month: number } => {
  try {
    if (date instanceof Date) {
      return { day: date.getDate(), month: date.getMonth() + 1 };
    }

    if (typeof date === 'string') {
      // Вариант 1: Формат базы данных "1985-07-02"
      if (date.includes('-')) {
        const parts = date.split('-'); // ["1985", "07", "02"]
        // Обратите внимание: год-месяц-день
        return {
          day: Number(parts[2]),
          month: Number(parts[1])
        };
      }

      // Вариант 2: Формат ввода "02.07.1985"
      if (date.includes('.')) {
        const parts = date.split('.'); // ["02", "07", "1985"]
        return {
          day: Number(parts[0]),
          month: Number(parts[1])
        };
      }
    }
  } catch (e) {
    console.error("Error parsing date:", date, e);
  }

  return { day: 0, month: 0 }; // Fallback на случай ошибки
};

/**
 * Расчет Числа Персонального Года.
 * Формула: День рождения + Месяц рождения + Текущий год.
 */
export const calculatePersonalYear = (birthDate: string | Date, targetDate: Date = new Date()): number => {
  const { day, month } = getDayAndMonth(birthDate);

  // Если дата кривая — возвращаем 0
  if (!day || !month) return 0;

  const currentYear = targetDate.getFullYear();
  const rawSum = day + month + currentYear;

  return reduceSum(rawSum);
};

/**
 * Расчет Числа Персонального Месяца.
 * Формула: Персональный Год + Текущий Месяц.
 */
export const calculatePersonalMonth = (birthDate: string | Date, targetDate: Date = new Date()): number => {
  const personalYear = calculatePersonalYear(birthDate, targetDate);
  if (personalYear === 0) return 0;

  const currentMonth = targetDate.getMonth() + 1;

  return reduceSum(personalYear + currentMonth);
};

/**
 * Расчет Числа Персонального Дня.
 * Формула: Персональный Месяц + Текущий День.
 */
export const calculatePersonalDay = (birthDate: string | Date, targetDate: Date = new Date()): number => {
  const personalMonth = calculatePersonalMonth(birthDate, targetDate);
  if (personalMonth === 0) return 0;

  const currentDay = targetDate.getDate();

  return reduceSum(personalMonth + currentDay);
};
