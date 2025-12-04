// hooks/useForecasts.ts
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';

interface ForecastDataMap {
  [key: string]: { ru: ForecastSection; en: ForecastSection };
}

export const useForecasts = (
  type: 'day' | 'month' | 'year',
  personalNumber: number
) => {
  const [data, setData] = useState<ForecastSection | null>(null);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const [refreshKey, setRefreshKey] = useState(0);

  const fetchForecast = useCallback(async () => {
    if (!personalNumber) {
      setData(null);
      return;
    }

    setLoading(true);
    try {
      let collectionName = '';
      let docId = '';
      const today = new Date();

      if (type === 'day') {
        collectionName = 'daily_forecasts';
        docId = today.toLocaleDateString('en-CA');
      } else if (type === 'month') {
        collectionName = 'monthly_forecasts';
        const month = String(today.getMonth() + 1).padStart(2, '0');
        docId = `${today.getFullYear()}-${month}`;
      } else if (type === 'year') {
        collectionName = 'yearly_forecasts';
        docId = `${today.getFullYear()}`;
      }

      console.log(`📡 Fetching ${collectionName}/${docId} for number ${personalNumber}...`);

      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fullData = docSnap.data() as ForecastDataMap;
        const numberData = fullData[String(personalNumber)];

        if (numberData) {
          const localized = numberData[language];
          const fallbackData = localized || numberData['ru'] || Object.values(numberData)[0];

          setData(fallbackData as ForecastSection || null);
        } else {
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
  }, [type, personalNumber, language, refreshKey]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return { data, loading, refetch };
};
