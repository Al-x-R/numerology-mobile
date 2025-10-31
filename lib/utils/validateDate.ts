// lib/utils/validateDate.ts
export const isValidRussianDate = (dateStr: string): boolean => {
  if (!dateStr || dateStr.length !== 10) return false;

  const parts = dateStr.split('.');
  if (parts.length !== 3) return false;

  const [day, month, year] = parts.map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000 || year > 9999) return false;

  const testDate = new Date(year, month - 1, day);
  return (
    testDate.getFullYear() === year &&
    testDate.getMonth() === month - 1 &&
    testDate.getDate() === day
  );
};
