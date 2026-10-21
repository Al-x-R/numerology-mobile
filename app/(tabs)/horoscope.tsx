// app/(tabs)/horoscope.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useNavigation } from 'expo-router';

import { UniversalForecastCard } from '@/components/UniversalForecastCard';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { HeaderEmblem } from '@/components/ui/HeaderEmblem';
import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useZodiacForecast } from '@/hooks/useZodiacForecast';
import { getZodiacSign, getZodiacName } from '@/lib/calculators/zodiac';
import { COLORS, LAYOUT, SPACING } from '@/lib/constants/theme';
import { TAB_BAR_STYLE } from '@/lib/constants/navigation';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { LockedForecast } from '@/components/ui/LockedForecast';
import { BirthDateRequiredState } from '@/components/ui/BirthDateRequiredState';
import { useRewarded } from '@/hooks/useAdMob';
import { parseLocalDate } from '@/lib/utils/date';

type TabType = 'day' | 'month' | 'year';

interface ForecastResultWithRefetch {
  data: any;
  loading: boolean;
  refetch: () => void;
}

export default function HoroscopeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('day');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [unlockedDates, setUnlockedDates] = useState<{ day: string | null; month: string | null; year: string | null }>({
    day: null,
    month: null,
    year: null,
  });

  const navigation = useNavigation();
  const { activeProfile, isPremium } = useProfile();
  const birthDate = activeProfile?.date || null;
  const { t, language } = useAppTranslation();

  const { showRewarded } = useRewarded();

  const signKey = birthDate ? getZodiacSign(parseLocalDate(birthDate)) : null;
  const signName = signKey ? getZodiacName(signKey, language) : '';

  const dayData = useZodiacForecast('day', signKey) as ForecastResultWithRefetch;
  const monthData = useZodiacForecast('month', signKey) as ForecastResultWithRefetch;
  const yearData = useZodiacForecast('year', signKey) as ForecastResultWithRefetch;

  const getLocals = () => {
    const d = new Date();
    const dayStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const monthStr = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const yearStr = `${d.getFullYear()}`;
    return { dayStr, monthStr, yearStr };
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);

    let currentData = dayData;
    if (activeTab === 'month') currentData = monthData;
    else if (activeTab === 'year') currentData = yearData;

    if (currentData && typeof currentData.refetch === 'function') {
      currentData.refetch();
    }

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);

  }, [activeTab, dayData, monthData, yearData]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('horoscopeTitle'),
      headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
      headerLeft: () => <HeaderEmblem />,
      tabBarStyle: TAB_BAR_STYLE,
    });
  }, [navigation, language, t]);

  const handleUnlockCurrentTab = () => {
    showRewarded(() => {
      const { dayStr, monthStr, yearStr } = getLocals();

      setUnlockedDates(prev => ({
        ...prev,
        day: activeTab === 'day' ? dayStr : prev.day,
        month: activeTab === 'month' ? monthStr : prev.month,
        year: activeTab === 'year' ? yearStr : prev.year,
      }));
    });
  };

  const renderContent = () => {
    let currentData = dayData;
    if (activeTab === 'month') currentData = monthData;
    else if (activeTab === 'year') currentData = yearData;

    const { dayStr, monthStr, yearStr } = getLocals();
    let isUnlocked = false;

    if (activeTab === 'day') isUnlocked = unlockedDates.day === dayStr;
    if (activeTab === 'month') isUnlocked = unlockedDates.month === monthStr;
    if (activeTab === 'year') isUnlocked = unlockedDates.year === yearStr;

    const isLocked = !isPremium && !isUnlocked;

    if (isLocked) {
      const titles: Record<TabType, string> = {
        day: t('horoscope.dayTitle'),
        month: t('horoscope.monthTitle'),
        year: t('horoscope.yearTitle'),
      };

      const subtitles: Record<TabType, string> = {
        day: t('horoscope.daySubtitle'),
        month: t('horoscope.monthSubtitle'),
        year: t('horoscope.yearSubtitle'),
      };

      const unlockText = t('horoscope.watchAdToUnlock');
      const premiumText = t('horoscope.orGetPremium');

      return (
        <LockedForecast
          icon="moon-outline"
          title={titles[activeTab]}
          subtitle={subtitles[activeTab]}
          unlockText={unlockText}
          premiumText={premiumText}
          onUnlock={handleUnlockCurrentTab}
        />
      );
    }

    return (
      <View>
        <UniversalForecastCard
          data={currentData.data}
          loading={currentData.loading}
          type={activeTab}
          onRetry={currentData.refetch}
          zodiacSign={signKey || undefined}
          signName={signName}
        />
        {/*<View style={{ height: 20 }} />*/}
      </View>
    );
  };

  const renderTabs = () => (
    <SegmentedTabs
      tabs={[
        { key: 'day' as TabType, label: t('tabs.day') },
        { key: 'month' as TabType, label: t('tabs.month') },
        { key: 'year' as TabType, label: t('tabs.year') },
      ]}
      active={activeTab}
      onChange={setActiveTab}
    />
  );

  if (!birthDate) {
    return (
      <SafeAreaView style={styles.container} edges={[ 'left', 'right']}>
        <AuraBackground />
        <BirthDateRequiredState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[ 'left', 'right']}>
      <AuraBackground />

      <View style={styles.mainContainer}>
        {renderTabs()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.accent}
            />
          }
        >
          {renderContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mainContainer: { flex: 1, paddingHorizontal: LAYOUT.contentPadding, paddingTop: SPACING.md },
});
