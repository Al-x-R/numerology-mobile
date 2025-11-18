// lib/utils/date.ts
import { tArray, getCurrentLocale } from '@/lib/constants/locales';

export const formatBirthDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '—';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  const day = date.getDate();
  const year = date.getFullYear();
  const months = tArray('date.months');

  if (months.length === 0) return `${day}.${date.getMonth() + 1}.${year}`; // fallback

  const monthName = months[date.getMonth()] || '';
  const suffix = getCurrentLocale() === 'ru' ? ' г.' : '';

  return `${day} ${monthName}${suffix ? ` ${year}${suffix}` : `, ${year}`}`;
};
