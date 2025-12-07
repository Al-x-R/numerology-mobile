// hooks/useForecasts.ts
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ForecastDataMap {
  [key: string]: { ru: ForecastSection; en: ForecastSection };
}

export const useForecasts = (
  type: 'day' | 'month' | 'year',
  personalNumber: number
) => {
  const [data, setData] = useState<ForecastSection | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchForecast = useCallback(async (forceUpdate = false) => {
    if (!personalNumber) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      let collectionName = '';
      let docId = '';
      const today = new Date();

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

      const cacheKey = `@forecast_${type}_${docId}_${personalNumber}_${language}`;

      if (!forceUpdate) {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          console.log(`📦 Loaded from cache: ${cacheKey}`);
          setData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }

      console.log(`📡 Fetching ${collectionName}/${docId} for number ${personalNumber}...`);

      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fullData = docSnap.data() as ForecastDataMap;
        const numberData = fullData[String(personalNumber)];

        if (numberData) {
          const localized = numberData[language];
          const finalData = localized || numberData['ru'] || Object.values(numberData)[0];

          if (finalData) {
            setData(finalData);
            await AsyncStorage.setItem(cacheKey, JSON.stringify(finalData));
          } else {
            setData(null);
          }
        } else {
          console.log('Number data not found in document');
          setData(null);
        }
      } else {
        console.log('Document not found in Firebase');
        setData(null);
      }
    } catch (e) {
      console.error('Error fetching forecast:', e);
    } finally {
      setLoading(false);
    }
  }, [type, personalNumber, language]);

  useEffect(() => {
    fetchForecast(false);
  }, [fetchForecast, refreshKey]);

  const refetch = useCallback(() => {

    fetchForecast(true);
  }, [fetchForecast]);

  return { data, loading, refetch };
};
