// lib/utils/tooltip.ts
import { getHighlightType } from './highlight';
import { t } from '@/lib/constants/locales';

export const getTooltipText = (id: string, value: string): string => {
  const v = value || '';
  const highlight = getHighlightType(id, v);

  if (highlight === 'weak') {
    const weakTooltips: Record<string, string> = {
      '1': t('tooltip_weak_character'),
      '2': t('tooltip_weak_energy'),
      '4': t('tooltip_weak_health'),
      '5': t('tooltip_weak_logic'),
      '6': t('tooltip_weak_laziness'),
      '8': t('tooltip_weak_responsibility'),
      '9': t('tooltip_weak_memory'),
    };
    return weakTooltips[id] || t('tooltip_develop');
  }

  if (highlight === 'strong') {
    const match = v.match(/(\d)\1{2,}/);
    if (match) {
      const count = match[0].length;
      if (count >= 6) return t('tooltip_godlike');
      if (count >= 4) return t('tooltip_genius');
      if (count >= 3) return t('tooltip_superpower');
    }

    const strongTooltips: Record<string, string> = {
      '1': t('tooltip_strong_character'),
      '2': t('tooltip_strong_energy'),
      '3': t('tooltip_strong_creativity'),
      '5': t('tooltip_strong_logic'),
      '6': t('tooltip_strong_temperament'),
      '7': t('tooltip_strong_luck'),
      '8': t('tooltip_strong_responsibility'),
      '9': t('tooltip_strong_memory'),
    };
    return strongTooltips[id] || t('tooltip_superpower');
  }

  return '';
};
