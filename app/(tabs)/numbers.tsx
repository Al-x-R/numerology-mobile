// app/(tabs)/numbers.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ProfileButton } from '@/components/ui/ProfileButton';
import { UniversalForecastCard } from '@/components/UniversalForecastCard';

import { calculatePersonalYear, calculatePersonalMonth, calculatePersonalDay } from '@/lib/calculators/numerologyForecast';
import { useProfile } from '@/contexts/ProfileContext';
import { useForecasts } from '@/hooks/useForecasts';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { COLORS, GRADIENTS, LAYOUT, SPACING, RADIUS, FONTS } from '@/lib/constants/theme';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { BirthDateRequiredState } from '@/components/ui/BirthDateRequiredState';
import { useRewarded } from '@/hooks/useAdMob';

type TabType = 'day' | 'month' | 'year';

interface ForecastResultWithRefetch {
  data: any;
  loading: boolean;
  refetch: () => void;
}

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

  const dayForecast = useForecasts('day', pDay) as ForecastResultWithRefetch;
  const monthForecast = useForecasts('month', pMonth) as ForecastResultWithRefetch;
  const yearForecast = useForecasts('year', pYear) as ForecastResultWithRefetch;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('numbers.title'),
      headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
      headerLeft: () => null,
      headerShadowVisible: false,
      headerStyle: { backgroundColor: COLORS.headerBackground },
      tabBarStyle: { display: 'flex', backgroundColor: COLORS.background, borderTopColor: COLORS.background },
    });
  }, [navigation, language, t]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    let currentForecast = dayForecast;
    if (activeTab === 'month') currentForecast = monthForecast;
    if (activeTab === 'year') currentForecast = yearForecast;

    if (currentForecast && currentForecast.refetch) {
      currentForecast.refetch();
    }
    setTimeout(() => { setIsRefreshing(false); }, 1500);
  }, [activeTab, dayForecast, monthForecast, yearForecast]);

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
    <View style={styles.tabsContainer}>
      {(['day', 'month', 'year'] as TabType[]).map((tab) => {
        const isActive = activeTab === tab;
        const labels: Record<string, string> = {
          day: t('tabs.day'),
          month: t('tabs.month'),
          year: t('tabs.year')
        };

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {labels[tab]}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // --- CONTENT ---
  const renderContent = () => {
    let currentAI = dayForecast;
    let currentNumber = pDay;

    if (activeTab === 'month') {
      currentAI = monthForecast;
      currentNumber = pMonth;
    } else if (activeTab === 'year') {
      currentAI = yearForecast;
      currentNumber = pYear;
    }

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
        <View style={styles.lockedContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name={"sparkles"} size={32} color={COLORS.accent} />
          </View>

          <Text style={styles.lockedTitle}>
            {titles[activeTab]}
          </Text>
          <Text style={styles.lockedSubtitle}>
            {subtitles[activeTab]}
          </Text>

          {/* Advertising Button */}
          <TouchableOpacity
            style={styles.unlockButton}
            onPress={handleUnlockCurrentTab}
          >
            <Ionicons name="play-circle" size={24} color={COLORS.blackText} style={{ marginRight: 8 }} />
            <Text style={styles.unlockButtonText}>
              {unlockText}
            </Text>
          </TouchableOpacity>

          {/* Premium Button */}
          <TouchableOpacity
            style={styles.premiumButtonLink}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.premiumLinkText}>
              {premiumText}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <UniversalForecastCard
          data={currentAI.data}
          loading={currentAI.loading}
          type={activeTab}
          number={currentNumber}
        />
      </View>
    );
  };

  if (!birthDate) {
    return (
      <SafeAreaView style={styles.container} edges={[ 'left', 'right']}>
        <LinearGradient colors={GRADIENTS.background} style={styles.background}>
          <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
        </LinearGradient>
        <BirthDateRequiredState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[ 'left', 'right']}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

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
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  background: { ...StyleSheet.absoluteFill, alignItems: 'center' },
  logo: {
    width: '150%',
    maxWidth: LAYOUT.logoLarge,
    maxHeight: LAYOUT.logoLarge,
    opacity: 0.1,
    position: 'absolute',
    top: 50
  },

  mainContainer: {
    flex: 1,
    paddingHorizontal: LAYOUT.contentPadding,
    paddingTop: 10
  },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
    marginTop: 0
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: COLORS.accent },
  tabText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 14 },
  activeTabText: { color: COLORS.blackText, fontWeight: 'bold' },

  // --- Styles for Locked State ---
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
// backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    minHeight: 350,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  lockedTitle: {
    ...FONTS.subtitle,
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  lockedSubtitle: {
    ...FONTS.body,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  unlockButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  unlockButtonText: {
    ...FONTS.button,
    color: COLORS.blackText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumButtonLink: {
    marginTop: SPACING.lg,
    padding: SPACING.sm,
  },
  premiumLinkText: {
    ...FONTS.body,
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
});
