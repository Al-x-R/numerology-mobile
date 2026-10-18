// lib/api/forecasts.ts

// Static JSON forecasts from the CDN: `${FORECASTS_URL}/${collection}/${docId}.json`
// While the URL is not set, forecasts are simply unavailable
const FORECASTS_URL = process.env.EXPO_PUBLIC_FORECASTS_URL;

export const fetchForecastDoc = async <T>(collection: string, docId: string): Promise<T | null> => {
  if (!FORECASTS_URL) {
    console.log('EXPO_PUBLIC_FORECASTS_URL is not set, skipping forecast fetch');
    return null;
  }

  const res = await fetch(`${FORECASTS_URL}/${collection}/${docId}.json`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`);
  return (await res.json()) as T;
};
