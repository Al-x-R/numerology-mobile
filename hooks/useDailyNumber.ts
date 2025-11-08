// hooks/useDailyNumber.ts
import { useProfile } from '@/contexts/ProfileContext';
import { calculateDayNumber } from '@/lib/calculators/dayNumber';

export const useDailyNumber = (profile: any) => {
  const { isPremium } = useProfile();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  if (!profile) return null;

  const last = profile.lastDayNumberDate;

  // Если не премиум — проверяем, прошло ли 7 дней
  if (!isPremium && last) {
    const lastDate = new Date(last);
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return null; // ещё не пора
  }

  const number = calculateDayNumber(profile.date, todayStr);
  return { number, isNew: true };
};
