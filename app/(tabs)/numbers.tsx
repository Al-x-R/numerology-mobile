// app/(tabs)/numbers.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'; // <-- 1. Импортируем RefreshControl
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ProfileButton } from '@/components/ui/ProfileButton';
import { UniversalForecastCard } from '@/components/UniversalForecastCard';

import { calculatePersonalYear, calculatePersonalMonth, calculatePersonalDay } from '@/lib/calculators/numerologyForecast';
import { useProfile } from '@/contexts/ProfileContext';
import { useForecasts } from '@/hooks/useForecasts';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { COLORS, GRADIENTS, LAYOUT, SPACING, RADIUS, FONTS } from '@/lib/constants/theme';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { AuthRequiredState } from '@/components/ui/AuthRequiredState';

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

  const [isRefreshing, setIsRefreshing] = useState(false); // <-- 2. Состояние для обновления

  const navigation = useNavigation();
  const { t, language } = useAppTranslation();
  const { user } = useProfile();

  const performCalculation = useCallback(() => {
    if (!user || !user.birthDate) return;
    try {
      const today = new Date();
      setPDay(calculatePersonalDay(user.birthDate, today));
      setPMonth(calculatePersonalMonth(user.birthDate, today));
      setPYear(calculatePersonalYear(user.birthDate, today));
    } catch (e) {
      console.error("Calculation error:", e);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { performCalculation(); }, [performCalculation]));

  const dayForecast = useForecasts('day', pDay) as ForecastResultWithRefetch;
  const monthForecast = useForecasts('month', pMonth) as ForecastResultWithRefetch;
  const yearForecast = useForecasts('year', pYear) as ForecastResultWithRefetch;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('numbersTitle') || 'Прогноз',
      headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
      headerLeft: () => null,
      headerShadowVisible: false,
      headerStyle: { backgroundColor: COLORS.headerBackground },
      tabBarStyle: { display: 'flex', backgroundColor: COLORS.background, borderTopColor: COLORS.background },
    });
  }, [navigation, language]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);

    let currentForecast = dayForecast;
    if (activeTab === 'month') {
      currentForecast = monthForecast;
    } else if (activeTab === 'year') {
      currentForecast = yearForecast;
    }

    if (currentForecast && currentForecast.refetch) {
      currentForecast.refetch();
    }

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);

  }, [activeTab, dayForecast, monthForecast, yearForecast]);


  // --- TABS ---
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {(['day', 'month', 'year'] as TabType[]).map((tab) => {
        const isActive = activeTab === tab;
        const labels: Record<string, string> = {
          day: language === 'ru' ? 'День' : 'Day',
          month: language === 'ru' ? 'Месяц' : 'Month',
          year: language === 'ru' ? 'Год' : 'Year'
        };

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {labels[tab]}
            </Text>
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

    return (
      <View>
        <UniversalForecastCard
          data={currentAI.data}
          loading={currentAI.loading}
          type={activeTab}
          number={currentNumber}
        />
        <View style={{ height: 20 }} />
      </View>
    );
  };

  // --- IF THERE IS NO USER ---
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

  // --- MAIN RENDER ---
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.mainContainer}>
        {renderTabs()}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          // 4. Добавляем RefreshControl
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#C4A484" // Цвет спиннера, как в дизайне
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
  background: { ...StyleSheet.absoluteFillObject, alignItems: 'center' },
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
  centeredContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
    marginTop: 0
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: '#C4A484' },
  tabText: { color: '#9CA3AF', fontWeight: '600', fontSize: 14 },
  activeTabText: { color: '#000', fontWeight: 'bold' },

  // Empty State
  emptyStateContainer: { alignItems: 'center', padding: SPACING.xl, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: RADIUS.xl, width: '100%' },
  emptyStateTitle: { ...FONTS.sectionTitle, color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.sm },
  emptyStateText: { ...FONTS.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 20 },
  actionButton: { width: '100%', borderRadius: RADIUS.lg, overflow: 'hidden' },
  buttonGradient: { paddingVertical: SPACING.md, alignItems: 'center' },
  buttonText: { ...FONTS.button, color: COLORS.blackText },
});
