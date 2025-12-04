// app/(tabs)/horoscope.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'; // <-- Добавляем RefreshControl
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { UniversalForecastCard } from '@/components/UniversalForecastCard';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useZodiacForecast } from '@/hooks/useZodiacForecast';
import { getZodiacSign, getZodiacName } from '@/lib/calculators/zodiac';
import { COLORS, GRADIENTS, LAYOUT, FONTS, RADIUS, SPACING } from '@/lib/constants/theme';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';

type TabType = 'day' | 'month' | 'year';

interface ForecastResultWithRefetch {
  data: any;
  loading: boolean;
  refetch: () => void;
}

export default function HoroscopeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('day');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user } = useProfile();
  const { t, language } = useAppTranslation();

  const signKey = user?.birthDate ? getZodiacSign(new Date(user.birthDate)) : null;
  const signName = signKey ? getZodiacName(signKey, language) : '';

  const dayData = useZodiacForecast('day', signKey) as ForecastResultWithRefetch;
  const monthData = useZodiacForecast('month', signKey) as ForecastResultWithRefetch;
  const yearData = useZodiacForecast('year', signKey) as ForecastResultWithRefetch;

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);

    let currentData = dayData;
    if (activeTab === 'month') currentData = monthData;
    else if (activeTab === 'year') currentData = yearData;

    currentData.refetch();

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
  }, [navigation, language]);

  const renderContent = () => {
    let currentData = dayData;
    if (activeTab === 'month') currentData = monthData;
    else if (activeTab === 'year') currentData = yearData;

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

  if (!user || !user.birthDate) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <LinearGradient colors={GRADIENTS.background} style={styles.background} />
        <View style={styles.centeredContent}>
          <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons name="star-off-outline" size={64} color={COLORS.accent} />
            <Text style={styles.emptyStateTitle}>
              {language === 'ru' ? 'Знак не определен' : 'Sign Unknown'}
            </Text>
            <Text style={styles.emptyStateText}>
              {language === 'ru'
                ? 'Укажите дату рождения в профиле, чтобы узнать свой гороскоп.'
                : 'Please set your birth date in Profile to see your horoscope.'}
            </Text>
          </View>
        </View>
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
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabButton: { backgroundColor: '#C4A484' },
  tabText: { color: '#9CA3AF', fontWeight: '600', fontSize: 14 },
  activeTabText: { color: '#000', fontWeight: 'bold' },

  signTitle: { color: COLORS.accent, fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },

  centeredContent: {  justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  signHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(196, 164, 132, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'rgba(196, 164, 132, 0.3)'
  },
  iconContainer: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#C4A484',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15
  },
  textContainer: { flex: 1 },
  labelTitle: { color: '#9CA3AF', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },

  emptyStateContainer: { alignItems: 'center', padding: SPACING.xl, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: RADIUS.xl, width: '100%' },
  emptyStateTitle: { ...FONTS.sectionTitle, color: COLORS.text, marginTop: SPACING.md },
  emptyStateText: { ...FONTS.body, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
});
