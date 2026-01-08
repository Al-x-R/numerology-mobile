// hooks/useZodiacForecast.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PeriodType = 'day' | 'month' | 'year';

export const useZodiacForecast = (type: PeriodType, sign: string | null) => {
  const [data, setData] = useState<ForecastSection | null>(null);

  const [fullDoc, setFullDoc] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const loadedDocIdRef = useRef<string | null>(null);

  const fetchMasterData = useCallback(async (forceUpdate = false) => {
    if (!sign) return;

    const d = new Date();
    let docId = '';

    if (type === 'day') {
      docId = d.toISOString().split('T')[0];
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
        console.log(`📡 Firebase fetch: ${collectionName}/${docId}`);
        const docRef = doc(db, collectionName, docId);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          fetchedData = snapshot.data();

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

  return { data, loading, refetch };
};
