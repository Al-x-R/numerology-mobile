import { useEffect, useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import {
  TestIds,
  useInterstitialAd,
  useRewardedAd,
} from 'react-native-google-mobile-ads';
import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';

const INTERSTITIAL_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
  ios: process.env.EXPO_PUBLIC_AD_INTERSTITIAL_IOS,
  android: process.env.EXPO_PUBLIC_AD_INTERSTITIAL_ANDROID,
}) || '';

const REWARDED_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
  ios: process.env.EXPO_PUBLIC_AD_REWARDED_IOS,
  android: process.env.EXPO_PUBLIC_AD_REWARDED_ANDROID,
}) || '';

export const useInterstitial = () => {
  const { isPremium } = useProfile();
  const { isLoaded, isClosed, load, show } = useInterstitialAd(INTERSTITIAL_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(null);

  // Авто-загрузка
  useEffect(() => {
    if (!isPremium && !isLoaded) {
      load();
    }
  }, [isPremium, load, isLoaded]);

  // Обработка закрытия
  useEffect(() => {
    if (isClosed) {
      if (onCloseCallback) {
        onCloseCallback();
        setOnCloseCallback(null);
      }
      if (!isPremium) {
        load();
      }
    }
  }, [isClosed, onCloseCallback, load, isPremium]);

  const showInterstitial = (nextAction: () => void) => {
    if (isPremium) {
      nextAction();
      return;
    }

    if (isLoaded) {
      setOnCloseCallback(() => nextAction);
      show();
    } else {
      console.log('Interstitial Ad not ready, skipping...');
      nextAction();
      load();
    }
  };

  return { showInterstitial, isLoaded };
};

export const useRewarded = () => {
  const { isPremium } = useProfile();
  const { t } = useAppTranslation();
  const { isLoaded, load, show, isEarnedReward, isClosed, error } = useRewardedAd(REWARDED_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  const [onRewardCallback, setOnRewardCallback] = useState<(() => void) | null>(null);

  // Авто-загрузка
  useEffect(() => {
    if (!isPremium && !isLoaded) {
      load();
    }
  }, [isPremium, isLoaded, load]);

  // Обработка награды
  useEffect(() => {
    if (isEarnedReward && onRewardCallback) {
      console.log('User earned reward!');
      onRewardCallback();
      setOnRewardCallback(null);
    }
  }, [isEarnedReward, onRewardCallback]);

  // Перезагрузка после закрытия
  useEffect(() => {
    if (isClosed) {
      if (!isPremium) load();
    }
  }, [isClosed, load, isPremium]);

  // Логирование ошибок
  useEffect(() => {
    if (error) {
      console.log('Rewarded Ad failed to load: ', error);
    }
  }, [error]);

  const showRewarded = useCallback((onReward: () => void) => {
    if (isPremium) {
      onReward();
      return;
    }

    if (isLoaded) {
      setOnRewardCallback(() => onReward);
      show();
    } else {
      // Для Rewarded показываем алерт, так как контент ценный
      Alert.alert(
        t('common.error') || 'Error',
        t('ads.notReady') || 'Ad is loading, please try again in a moment.',
        [
          { text: 'OK', onPress: () => load() }
        ]
      );
    }
  }, [isLoaded, isPremium, show, load, t]);

  return { showRewarded, isLoaded };
};
