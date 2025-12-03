// hooks/useZodiacForecast.ts
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';

type PeriodType = 'day' | 'month' | 'year';

export const useZodiacForecast = (type: PeriodType, sign: string | null) => {
  const [data, setData] = useState<ForecastSection | null>(null);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (!sign) return;

    const fetchData = async () => {
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
          // raw[sign] = { ru: {...}, en: {...} }
          const signData = raw[sign];
          if (signData && signData[language]) {
            setData(signData[language]);
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
    };

    fetchData();
  }, [type, sign, language]);

  return { data, loading };
};
