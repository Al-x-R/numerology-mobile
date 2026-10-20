// lib/utils/roman.ts
const NUMERALS: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

export const toRoman = (value: number): string => {
  let rest = Math.floor(value);
  let result = '';
  for (const [arabic, roman] of NUMERALS) {
    while (rest >= arabic) {
      result += roman;
      rest -= arabic;
    }
  }
  return result;
};
