// hooks/useForecasts.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchForecastDoc } from '@/lib/api/forecasts';
import { useLanguage } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ForecastDataMap {
  [key: string]: { [lang: string]: ForecastSection };
}

// Shared facts written by the generator next to the 1-9 keys (daily files only)
interface ForecastDocMeta {
  _meta?: { moon?: { label?: { [lang: string]: string } } };
}

export const useForecasts = (
  type: 'day' | 'month' | 'year',
  personalNumber: number
) => {
  const [data, setData] = useState<ForecastSection | null>(null);

  const [fullDoc, setFullDoc] = useState<(ForecastDataMap & ForecastDocMeta) | null>(null);

  const [loading, setLoading] = useState(true);
  // Set when the fetch fails, so screens can tell a load error apart from a missing forecast
  const [error, setError] = useState(false);
  const { language } = useLanguage();

  const loadedDocIdRef = useRef<string | null>(null);

  const fetchMasterData = useCallback(async (forceUpdate = false) => {
    if (!personalNumber) {
      setLoading(false);
      return;
    }

    const today = new Date();
    let collectionName = '';
    let docId = '';

    if (type === 'day') {
      collectionName = 'daily_forecasts';
      docId = today.toLocaleDateString('en-CA'); // YYYY-MM-DD
    } else if (type === 'month') {
      collectionName = 'monthly_forecasts';
      const month = String(today.getMonth() + 1).padStart(2, '0');
      docId = `${today.getFullYear()}-${month}`;
    } else if (type === 'year') {
      collectionName = 'yearly_forecasts';
      docId = `${today.getFullYear()}`;
    }

    if (!forceUpdate && loadedDocIdRef.current === docId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    const cacheKey = `@forecast_full_${collectionName}_${docId}`;

    try {
      let fetchedData: ForecastDataMap | null = null;

      if (!forceUpdate) {
        const cachedJson = await AsyncStorage.getItem(cacheKey);
        if (cachedJson) {
          console.log(`📦 Cache hit (forecast): ${cacheKey}`);
          fetchedData = JSON.parse(cachedJson);
        }
      }

      if (!fetchedData) {
        console.log(`📡 CDN fetch: ${collectionName}/${docId}`);
        fetchedData = await fetchForecastDoc<ForecastDataMap>(collectionName, docId);

        if (fetchedData) {
          await AsyncStorage.setItem(cacheKey, JSON.stringify(fetchedData));
        } else {
          console.log(`Forecast doc not found: ${collectionName}/${docId}`);
        }
      }

      if (fetchedData) {
        setFullDoc(fetchedData);
        loadedDocIdRef.current = docId;
      } else {
        setFullDoc(null);
      }

    } catch (e) {
      console.error('Error fetching forecast master data:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [type, personalNumber]);

  useEffect(() => {
    if (!fullDoc || !personalNumber) {
      if (!loading) setData(null);
      return;
    }

    const numberData = fullDoc[String(personalNumber)];

    if (numberData) {
      const localized = numberData[language];
      const fallback = localized || numberData['en'] || numberData['ru'] || Object.values(numberData)[0];

      setData(fallback || null);
    } else {
      setData(null);
    }
  }, [fullDoc, personalNumber, language]);

  useEffect(() => {
    fetchMasterData(false);
  }, [fetchMasterData]);

  const refetch = useCallback(() => {
    fetchMasterData(true);
  }, [fetchMasterData]);

  // e.g. "Луна в Водолее · растущая Луна, 76%"; null for older files and monthly/yearly ones
  const moon = fullDoc?._meta?.moon?.label?.[language] ?? null;

  return { data, loading, error, refetch, moon };
};
