// hooks/useZodiacForecast.ts
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';

type PeriodType = 'day' | 'month' | 'year';

export const useZodiacForecast = (type: PeriodType, sign: string | null) => {
  const [data, setData] = useState<ForecastSection | null>(null);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    if (!sign) return;

    setLoading(true);
    try {
      const d = new Date();

      let docId = '';
      if (type === 'day') docId = d.toISOString().split('T')[0];
      else if (type === 'month') docId = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      else if (type === 'year') docId = `${d.getFullYear()}`;

      const collectionName = `${type === 'day' ? 'daily' : type === 'month' ? 'monthly' : 'yearly'}_zodiac`;

      const docRef = doc(db, collectionName, docId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const raw = snapshot.data();
        const signData = raw[sign];

        if (signData) {
          const localized = signData[language];
          const fallbackData = localized || signData['ru'] || Object.values(signData).find(d => d);

          setData(fallbackData || null);
        } else {
          setData(null);
        }
      } else {
        console.log(`No zodiac doc found for ${collectionName}/${docId}`);
        setData(null);
      }
    } catch (e) {
      console.error("Zodiac fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [type, sign, language, refreshKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return { data, loading, refetch };
};
