// lib/api/forecasts.ts

// Статичные JSON-прогнозы с CDN: `${FORECASTS_URL}/${collection}/${docId}.json`
// Пока URL не задан, прогнозы просто недоступны (как и с неподключённым Firebase)
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
