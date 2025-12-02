// hooks/useForecasts.ts
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';

interface ForecastDataMap {
  [key: string]: { ru: ForecastSection; en: ForecastSection };
}

export const useForecasts = (
  // Принимаем дату рождения, но фактически нам нужно только рассчитанное число
  type: 'day' | 'month' | 'year',
  personalNumber: number
) => {
  const [data, setData] = useState<ForecastSection | null>(null);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (!personalNumber) {
      setData(null);
      return;
    }

    const fetchForecast = async () => {
      setLoading(true);
      try {
        let collectionName = '';
        let docId = '';
        const today = new Date();

        // 1. Определяем, в какую коллекцию стучаться
        if (type === 'day') {
          collectionName = 'daily_forecasts';
          // Используем локальную дату YYYY-MM-DD
          docId = today.toLocaleDateString('en-CA');
        } else if (type === 'month') {
          collectionName = 'monthly_forecasts';
          // YYYY-MM
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
          // 2. Достаем данные для конкретного числа и языка
          const localized = fullData[String(personalNumber)]?.[language];
          setData(localized || null);
        } else {
          console.log('Document not found in Firebase');
          setData(null);
        }
      } catch (e) {
        console.error('Error fetching forecast:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [type, personalNumber, language]);

  return { data, loading };
};
