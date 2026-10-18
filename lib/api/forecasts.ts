// lib/api/forecasts.ts

// Static JSON forecasts from GitHub Pages: `${FORECASTS_URL}/${collection}/${docId}.json`
// EXPO_PUBLIC_FORECASTS_URL overrides it, e.g. for a local server during development
const FORECASTS_URL = process.env.EXPO_PUBLIC_FORECASTS_URL || 'https://al-x-r.github.io/numerology-mobile';

export const fetchForecastDoc = async <T>(collection: string, docId: string): Promise<T | null> => {
  const res = await fetch(`${FORECASTS_URL}/${collection}/${docId}.json`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`);
  return (await res.json()) as T;
};
