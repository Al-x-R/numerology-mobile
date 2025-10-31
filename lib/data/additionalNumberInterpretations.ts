// lib/data/additionalNumberInterpretations.ts
import { t } from '@/lib/constants/locales';
import { Interpretation } from '@/lib/types';

export const contextualInterpretations: Record<
  'working1' | 'working2' | 'working3' | 'working4' | 'destiny',
  Interpretation
> = {
  working1: {
    title: t('working1_title'),
    description: t('working1_desc'),
  },
  working2: {
    title: t('working2_title'),
    description: t('working2_desc'),
  },
  working3: {
    title: t('working3_title'),
    description: t('working3_desc'),
  },
  working4: {
    title: t('working4_title'),
    description: t('working4_desc'),
  },
  destiny: {
    title: t('destiny_title'),
    description: t('destiny_desc'),
  },
};
