// app/(tabs)/horoscope.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { UniversalForecastCard } from '@/components/UniversalForecastCard';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useZodiacForecast } from '@/hooks/useZodiacForecast';
import { getZodiacSign, getZodiacName } from '@/lib/calculators/zodiac';
import { COLORS, GRADIENTS, LAYOUT, FONTS, RADIUS, SPACING } from '@/lib/constants/theme';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { AuthRequiredState } from '@/components/ui/AuthRequiredState';
import { useRewarded } from '@/hooks/useAdMob';

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
  const { user } = useProfile();
  const { t, language } = useAppTranslation();

  const { showRewarded } = useRewarded();

  const signKey = user?.birthDate ? getZodiacSign(new Date(user.birthDate)) : null;
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
      headerLeft: () => null,
      headerShadowVisible: false,
      headerStyle: { backgroundColor: COLORS.headerBackground },
      tabBarStyle: { display: 'flex', backgroundColor: COLORS.background, borderTopColor: COLORS.background },
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

    const isLocked = !user?.isPremium && !isUnlocked;

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
        <View style={styles.lockedContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name={"moon"} size={32} color={COLORS.accent} />
          </View>

          <Text style={styles.lockedTitle}>{titles[activeTab]}</Text>
          <Text style={styles.lockedSubtitle}>{subtitles[activeTab]}</Text>

          {/* Advertising Button */}
          <TouchableOpacity style={styles.unlockButton} onPress={handleUnlockCurrentTab}>
            <Ionicons name="play-circle" size={24} color={COLORS.blackText} style={{ marginRight: 8 }} />
            <Text style={styles.unlockButtonText}>{unlockText}</Text>
          </TouchableOpacity>

          {/* Premium Button */}
          <TouchableOpacity style={styles.premiumButtonLink} onPress={() => router.push('/profile')}>
            <Text style={styles.premiumLinkText}>{premiumText}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <UniversalForecastCard
          data={currentData.data}
          loading={currentData.loading}
          type={activeTab}
          zodiacSign={signKey || undefined}
          signName={signName}
        />
        <View style={{ height: 20 }} />
      </View>
    );
  };

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

  if (!user || !user.birthDate) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <LinearGradient colors={GRADIENTS.background} style={styles.background}>
          <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
        </LinearGradient>
        <AuthRequiredState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.mainContainer}>
        {renderTabs()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#C4A484"
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
  background: { ...StyleSheet.absoluteFillObject, alignItems: 'center' },
  logo: { width: '150%', maxWidth: LAYOUT.logoLarge, maxHeight: LAYOUT.logoLarge, opacity: 0.1, position: 'absolute', top: 50 },
  mainContainer: { flex: 1, paddingHorizontal: LAYOUT.contentPadding, paddingTop: 10 },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 10
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: '#C4A484' },
  tabText: { color: '#9CA3AF', fontWeight: '600', fontSize: 14 },
  activeTabText: { color: '#000', fontWeight: 'bold' },

  // --- Styles for Locked State (Copied from NumbersScreen for consistency) ---
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.6)',
    // backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 350,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(196, 164, 132, 0.15)',
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
