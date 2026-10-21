// lib/api/forecasts.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Static JSON forecasts from GitHub Pages: `${FORECASTS_URL}/${collection}/${docId}.json`
// EXPO_PUBLIC_FORECASTS_URL overrides it, e.g. for a local server during development
const FORECASTS_URL = process.env.EXPO_PUBLIC_FORECASTS_URL || 'https://al-x-r.github.io/numerology-mobile';

export const fetchForecastDoc = async <T>(collection: string, docId: string): Promise<T | null> => {
  const res = await fetch(`${FORECASTS_URL}/${collection}/${docId}.json`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Forecast fetch failed: ${res.status}`);
  return (await res.json()) as T;
};

// Files can be regenerated after a device cached them, so a cached copy is shown at once and then
// checked against the server in the background; onUpdate runs only when the server copy differs
export const revalidateForecastDoc = async <T>(
  collection: string,
  docId: string,
  cacheKey: string,
  cachedJson: string,
  onUpdate: (doc: T) => void,
): Promise<void> => {
  try {
    const fresh = await fetchForecastDoc<T>(collection, docId);
    if (!fresh) return;
    const freshJson = JSON.stringify(fresh);
    if (freshJson === cachedJson) return;
    await AsyncStorage.setItem(cacheKey, freshJson);
    onUpdate(fresh);
  } catch (e) {
    // Offline or a server hiccup: the cached copy stays, nothing to show the user
    console.warn(`Forecast revalidation failed for ${collection}/${docId}:`, e);
  }
};
