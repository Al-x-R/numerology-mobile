// lib/calculators/numerologyForecast.ts

/**
 * Repeatedly sums digits down to a single digit (1-9).
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
 * Extracts day and month from any supported date format:
 * - "YYYY-MM-DD" (stored: "1985-07-02")
 * - "DD.MM.YYYY" (Input: "02.07.1985")
 * - Date object
 */
const getDayAndMonth = (date: string | Date): { day: number, month: number } => {
  try {
    if (date instanceof Date) {
      return { day: date.getDate(), month: date.getMonth() + 1 };
    }

    if (typeof date === 'string') {
      // Stored format "1985-07-02"
      if (date.includes('-')) {
        const parts = date.split('-'); // ["1985", "07", "02"]
        return {
          day: Number(parts[2]),
          month: Number(parts[1])
        };
      }

      // Input format "02.07.1985"
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

  return { day: 0, month: 0 };
};

/**
 * Personal Year number.
 * Formula: birth day + birth month + current year.
 */
export const calculatePersonalYear = (birthDate: string | Date, targetDate: Date = new Date()): number => {
  const { day, month } = getDayAndMonth(birthDate);

  if (!day || !month) return 0;

  const currentYear = targetDate.getFullYear();
  const rawSum = day + month + currentYear;

  return reduceSum(rawSum);
};

/**
 * Personal Month number.
 * Formula: Personal Year + current month.
 */
export const calculatePersonalMonth = (birthDate: string | Date, targetDate: Date = new Date()): number => {
  const personalYear = calculatePersonalYear(birthDate, targetDate);
  if (personalYear === 0) return 0;

  const currentMonth = targetDate.getMonth() + 1;

  return reduceSum(personalYear + currentMonth);
};

/**
 * Personal Day number.
 * Formula: Personal Month + current day.
 */
export const calculatePersonalDay = (birthDate: string | Date, targetDate: Date = new Date()): number => {
  const personalMonth = calculatePersonalMonth(birthDate, targetDate);
  if (personalMonth === 0) return 0;

  const currentDay = targetDate.getDate();

  return reduceSum(personalMonth + currentDay);
};
