// app/(tabs)/numbers.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
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

type TabType = 'day' | 'month' | 'year';

export default function NumbersScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('day');

  // Calculated numbers
  const [pDay, setPDay] = useState(0);
  const [pMonth, setPMonth] = useState(0);
  const [pYear, setPYear] = useState(0);

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

  const dayForecast = useForecasts('day', pDay);
  const monthForecast = useForecasts('month', pMonth);
  const yearForecast = useForecasts('year', pYear);

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
        <LinearGradient colors={GRADIENTS.background} style={styles.background} />
        <View style={styles.centeredContent}>
          <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons name={!user ? "lock-outline" : "calendar-alert"} size={64} color={COLORS.accent} />
            <Text style={styles.emptyStateTitle}>
              {!user ? "Требуется вход" : "Нет даты рождения"}
            </Text>
            <Text style={styles.emptyStateText}>
              {!user
                ? "Войдите в аккаунт, чтобы получить прогноз."
                : "Укажите дату рождения в профиле для расчета."}
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(!user ? '/(auth)/login' : '/profile')}
            >
              <LinearGradient colors={GRADIENTS.button} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>{!user ? "Войти" : "Указать дату"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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
  buttonText: { ...FONTS.button, color: COLORS.text },
});
