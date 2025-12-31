import { t } from '@/lib/constants/locales';
import { Interpretation, CellKey } from '@/lib/types/calculation';

// Helper function to get interpretation from locales.ts using the t() function
export function getInterpretation(
  cellId: string,
  cellValue: string
): Interpretation {
  const id = cellId as CellKey;

  // Normalize value: empty strings become 'empty' for lookup, '—' is handled
  const normalizedValue = (!cellValue || cellValue === '—' || cellValue === '0') ? 'empty' : cellValue;

  // Construct the key for locales (e.g., 'cell_1_title')
  const titleKey = `cell_${id}_title`;
  const title = t(titleKey);

  // Construct the key for description (e.g., '1_111' or '1_empty')
  // We strictly follow the keys in locales.ts
  const descKey = `${id}_${normalizedValue}`;

  let description = t(descKey);

  // If translation is missing (returns key) and value is just dashes, try generic unavailable message
  if (description === descKey) {
    if (normalizedValue === 'empty') {
      // Fallback for empty if the specific key (e.g. '1_empty') is missing
      description = t('interpretation_unavailable');
    } else {
      // Try finding the closest key if exact match fails (e.g. user has 7 ones but we only have 6)
      // Note: simpler approach here is just returning unavailable if exact match fails,
      // but for robustness we can just check if it returned the key.
      description = t('interpretation_unavailable');
    }
  }

  return {
    title,
    description,
    type: 'matrix'
  };
}
