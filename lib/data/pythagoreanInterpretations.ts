// lib/data/pythagoreanInterpretations.ts
import { t } from '@/lib/constants/locales';
import { Interpretation } from '@/lib/types/calculation';

export const getInterpretation = (
  cellId: string,
  cellValue: string
): Interpretation => {
  const title = t(`cell_${cellId}_title`);

  if (!cellValue || cellValue === '—') {
    const description = t(`${cellId}_empty`);
    return { title, description, type: 'matrix' };
  }

  const normalizedValue = cellValue.length > 6 ? cellValue.slice(0, 6) : cellValue;

  const key = `${cellId}_${normalizedValue}`;

  let description = t(key);

  if (description === key) {
    const fallbackKey = `${cellId}_${normalizedValue[0].repeat(6)}`;
    description = t(fallbackKey);
  }

  if (description === key) {
    description = t('interpretation_unavailable');
  }

  return { title, description, type: 'matrix' };
};
