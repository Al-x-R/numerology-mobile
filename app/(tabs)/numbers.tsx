// app/(tabs)/numbers.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useNavigation } from 'expo-router';

import { ProfileButton } from '@/components/ui/ProfileButton';
import { HeaderEmblem } from '@/components/ui/HeaderEmblem';
import { UniversalForecastCard } from '@/components/UniversalForecastCard';

import { calculatePersonalYear, calculatePersonalMonth, calculatePersonalDay } from '@/lib/calculators/numerologyForecast';
import { useProfile } from '@/contexts/ProfileContext';
import { useForecasts } from '@/hooks/useForecasts';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { COLORS, LAYOUT, SPACING } from '@/lib/constants/theme';
import { TAB_BAR_STYLE } from '@/lib/constants/navigation';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { LockedForecast } from '@/components/ui/LockedForecast';
import { BirthDateRequiredState } from '@/components/ui/BirthDateRequiredState';
import { useRewarded } from '@/hooks/useAdMob';

type TabType = 'day' | 'month' | 'year';

export default function NumbersScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('day');

  // Calculated numbers
  const [pDay, setPDay] = useState(0);
  const [pMonth, setPMonth] = useState(0);
  const [pYear, setPYear] = useState(0);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [unlockedDates, setUnlockedDates] = useState<{ day: string | null; month: string | null; year: string | null }>({
    day: null,
    month: null,
    year: null,
  });

  const navigation = useNavigation();
  const { language, t } = useAppTranslation();
  const { activeProfile, isPremium } = useProfile();
  const birthDate = activeProfile?.date || null;
  const { showRewarded } = useRewarded();

  const getLocals = () => {
    const d = new Date();
    const dayStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const monthStr = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const yearStr = `${d.getFullYear()}`;
    return { dayStr, monthStr, yearStr };
  };

  const performCalculation = useCallback(() => {
    if (!birthDate) return;
    try {
      const today = new Date();
      setPDay(calculatePersonalDay(birthDate, today));
      setPMonth(calculatePersonalMonth(birthDate, today));
      setPYear(calculatePersonalYear(birthDate, today));
    } catch (e) {
      console.error("Calculation error:", e);
    }
  }, [birthDate]);

  useFocusEffect(useCallback(() => { performCalculation(); }, [performCalculation]));

  const dayForecast = useForecasts('day', pDay);
  const monthForecast = useForecasts('month', pMonth);
  const yearForecast = useForecasts('year', pYear);

  const forecasts = { day: dayForecast, month: monthForecast, year: yearForecast };
  const currentForecast = forecasts[activeTab];

  // The pull-to-refresh spinner stays until the refetch actually finishes (state adjusted during render)
  if (isRefreshing && !currentForecast.loading) setIsRefreshing(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('numbers.title'),
      headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
      headerLeft: () => <HeaderEmblem />,
      tabBarStyle: TAB_BAR_STYLE,
    });
  }, [navigation, language, t]);

  const onRefresh = () => {
    setIsRefreshing(true);
    currentForecast.refetch();
  };

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

  // --- TABS ---
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

  // --- CONTENT ---
  const renderContent = () => {
    const numbers = { day: pDay, month: pMonth, year: pYear };
    const currentNumber = numbers[activeTab];

    const { dayStr, monthStr, yearStr } = getLocals();
    let isUnlocked = false;

    if (activeTab === 'day') isUnlocked = unlockedDates.day === dayStr;
    if (activeTab === 'month') isUnlocked = unlockedDates.month === monthStr;
    if (activeTab === 'year') isUnlocked = unlockedDates.year === yearStr;

    const isLocked = !isPremium && !isUnlocked;

    if (isLocked) {
      const titles: Record<TabType, string> = {
        day: t('numbers.dayTitle'),
        month: t('numbers.monthTitle'),
        year: t('numbers.yearTitle'),
      };

      const subtitles: Record<TabType, string> = {
        day: t('numbers.daySubtitle'),
        month: t('numbers.monthSubtitle'),
        year: t('numbers.yearSubtitle'),
      };

      const unlockText = t('numbers.watchAdToUnlock');
      const premiumText = t('numbers.orGetPremium');

      return (
        <LockedForecast
          icon="sparkles-outline"
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
          data={currentForecast.data}
          loading={currentForecast.loading}
          error={currentForecast.error}
          moon={currentForecast.moon}
          type={activeTab}
          onRetry={currentForecast.refetch}
          number={currentNumber}
        />
      </View>
    );
  };

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
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.textTertiary}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  mainContainer: {
    flex: 1,
    paddingHorizontal: LAYOUT.contentPadding,
    paddingTop: SPACING.md
  },
  scrollContent: { flexGrow: 1 },
});
