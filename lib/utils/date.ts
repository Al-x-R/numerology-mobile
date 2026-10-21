// lib/utils/date.ts
import { tArray, getCurrentLocale } from '@/lib/constants/locales';

// 'YYYY-MM-DD' -> local midnight. new Date('YYYY-MM-DD') is UTC midnight, which is still the
// previous day west of UTC. Impossible dates (e.g. 2000-02-31) give an Invalid Date instead of rolling over
export const parseLocalDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const matches = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return matches ? date : new Date(NaN);
};

export const formatBirthDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '—';

  const date = parseLocalDate(dateString);
  if (isNaN(date.getTime())) return '—';

  const day = date.getDate();
  const year = date.getFullYear();
  const months = tArray('date.months');

  if (months.length === 0) return `${day}.${date.getMonth() + 1}.${year}`; // fallback

  const monthName = months[date.getMonth()] || '';
  const suffix = getCurrentLocale() === 'ru' ? ' г.' : '';

  return `${day} ${monthName}${suffix ? ` ${year}${suffix}` : `, ${year}`}`;
};

export const formatBirthDateFromDate = (date: Date): string => {
  const day = date.getDate();
  const year = date.getFullYear();
  const months = tArray('date.months');

  if (months.length === 0) return `${day}.${date.getMonth() + 1}.${year}`;

  const monthName = months[date.getMonth()] || '';
  const suffix = getCurrentLocale() === 'ru' ? ' г.' : '';

  return `${day} ${monthName}${suffix ? ` ${year}${suffix}` : `, ${year}`}`;
};
