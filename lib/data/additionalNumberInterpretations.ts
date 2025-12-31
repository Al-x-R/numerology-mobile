// lib/data/additionalNumberInterpretations.ts
import { Interpretation } from '@/lib/types/calculation';

export const getContextualInterpretations = (
  t: (key: string) => string
): Record<'working1' | 'working2' | 'working3' | 'working4' | 'destiny', Interpretation> => ({
  working1: {
    title: t('working1_title'),
    description: t('working1_desc'),
    type: 'additional',
  },
  working2: {
    title: t('working2_title'),
    description: t('working2_desc'),
    type: 'additional',
  },
  working3: {
    title: t('working3_title'),
    description: t('working3_desc'),
    type: 'additional',
  },
  working4: {
    title: t('working4_title'),
    description: t('working4_desc'),
    type: 'additional',
  },
  destiny: {
    title: t('destiny_title'),
    description: t('destiny_desc'),
    type: 'destiny',
  },
});
