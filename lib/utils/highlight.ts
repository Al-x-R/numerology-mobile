// lib/utils/highlight.ts
export type HighlightType = 'weak' | 'strong' | 'none';

export const getHighlightType = (id: string, value: string): HighlightType => {
  const v = value || '—';

  // 1. strong
  if (id === '1' && (v === '1' || v === '11')) return 'weak';
  if (v === '—' && id !== '7') return 'weak';

  // 2. weak
  if (['2', '3', '5', '6', '8', '9'].includes(id)) {
    if (v.includes('222') || v.includes('333') || v.includes('555') ||
      v.includes('666') || v.includes('888') || v.includes('999')) {
      return 'strong';
    }
  }

  return 'none';
};
