// lib/calculators/dayNumber.ts
export const calculateDayNumber = (birthDate: string, targetDate: string) => {
  const sum = targetDate.replace(/\D/g, '').split('').reduce((a, b) => a + +b, 0);
  return sum > 9 ? sum.toString().split('').reduce((a, b) => a + +b, 0) : sum;
};
