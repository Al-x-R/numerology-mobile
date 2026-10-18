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
  const { status, load, show } = useInterstitialAd({
    adUnitId: INTERSTITIAL_ID,
    requestOptions: { requestNonPersonalizedAdsOnly: true },
    autoLoad: !isPremium,
  });
  const isLoaded = status === 'loaded';

  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(null);

  // autoLoad only loads the first ad, so reload after each one is dismissed
  useEffect(() => {
    if (status === 'closed') {
      if (onCloseCallback) {
        onCloseCallback();
        setOnCloseCallback(null);
      }
      if (!isPremium) {
        load();
      }
    }
  }, [status, onCloseCallback, load, isPremium]);

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
  const { status, load, show, earnedReward, error } = useRewardedAd({
    adUnitId: REWARDED_ID,
    requestOptions: { requestNonPersonalizedAdsOnly: true },
    autoLoad: !isPremium,
  });
  const isLoaded = status === 'loaded';

  const [onRewardCallback, setOnRewardCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (earnedReward && onRewardCallback) {
      console.log('User earned reward!');
      onRewardCallback();
      setOnRewardCallback(null);
    }
  }, [earnedReward, onRewardCallback]);

  // Reload after the ad is closed
  useEffect(() => {
    if (status === 'closed' && !isPremium) load();
  }, [status, load, isPremium]);

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
      // Rewarded ads show an alert, since the user explicitly asked for the content
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
