// hooks/useZodiacForecast.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchForecastDoc } from '@/lib/api/forecasts';
import { useLanguage } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PeriodType = 'day' | 'month' | 'year';

export const useZodiacForecast = (type: PeriodType, sign: string | null) => {
  const [data, setData] = useState<ForecastSection | null>(null);

  const [fullDoc, setFullDoc] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  // Set when the fetch fails, so screens can tell a load error apart from a missing forecast
  const [error, setError] = useState(false);
  const { language } = useLanguage();

  const loadedDocIdRef = useRef<string | null>(null);

  const fetchMasterData = useCallback(async (forceUpdate = false) => {
    if (!sign) return;

    const d = new Date();
    let docId = '';

    if (type === 'day') {
      docId = d.toLocaleDateString('en-CA'); // local YYYY-MM-DD, same as useForecasts
    } else if (type === 'month') {
      docId = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    } else if (type === 'year') {
      docId = `${d.getFullYear()}`;
    }

    if (!forceUpdate && loadedDocIdRef.current === docId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    const collectionName = `${type === 'day' ? 'daily' : type === 'month' ? 'monthly' : 'yearly'}_zodiac`;
    const cacheKey = `@zodiac_full_${collectionName}_${docId}`;

    try {
      let fetchedData = null;

      if (!forceUpdate) {
        const cachedJson = await AsyncStorage.getItem(cacheKey);
        if (cachedJson) {
          console.log(`📦 Cache hit: ${cacheKey}`);
          fetchedData = JSON.parse(cachedJson);
        }
      }

      if (!fetchedData) {
        console.log(`📡 CDN fetch: ${collectionName}/${docId}`);
        fetchedData = await fetchForecastDoc<any>(collectionName, docId);

        if (fetchedData) {
          await AsyncStorage.setItem(cacheKey, JSON.stringify(fetchedData));
        }
      }

      if (fetchedData) {
        setFullDoc(fetchedData);
        loadedDocIdRef.current = docId;
      } else {
        setFullDoc(null);
      }

    } catch (e) {
      console.error("Master fetch error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [type, sign]);

  useEffect(() => {
    if (!fullDoc || !sign) {
      if (!loading) setData(null);
      return;
    }

    const signData = fullDoc[sign];
    if (signData) {
      const localized = signData[language];
      const fallback = localized || signData['en'] || signData['ru'] || Object.values(signData)[0];

      setData(fallback);
    } else {
      setData(null);
    }
  }, [fullDoc, sign, language]);

  useEffect(() => {
    fetchMasterData(false);
  }, [fetchMasterData]);

  const refetch = useCallback(() => {
    fetchMasterData(true);
  }, [fetchMasterData]);

  // e.g. "Луна в Водолее · растущая Луна, 76%"; null for older files and monthly/yearly ones
  const moon: string | null = fullDoc?._meta?.moon?.label?.[language] ?? null;

  return { data, loading, error, refetch, moon };
};
