// lib/data/additionalNumberInterpretations.en.ts
import { Interpretation } from '@/lib/types';

export const contextualInterpretations: Record<
  'working1' | 'working2' | 'working3' | 'working4' | 'destiny',
  Interpretation
> = {
  working1: {
    title: '1st Working Number',
    description:
      'This is the “raw” life potential you bring into the world.',
  },
  working2: {
    title: '2nd Working Number (Life Path Number)',
    description:
      'It reveals your main life task and mission.',
  },
  working3: {
    title: '3rd Working Number',
    description:
      'This is the “karmic adjustment” – the lesson you must work through.',
  },
  working4: {
    title: '4th Working Number',
    description:
      'It is the practical “key” to solving the karmic tasks.',
  },
  destiny: {
    title: 'Life Path Number',
    description:
      'It is your guiding star throughout life.',
  },
};
