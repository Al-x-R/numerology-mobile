import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';

import { DateInputForm } from '@/components/DateInputForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { calculatePythagoreanSquare } from '@/lib/calculators/pythagoreanSquare';
import { CalculationResult } from '@/lib/types/calculation';
import { ProfileButton } from '@/components/ui/ProfileButton';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { COLORS, FONTS, GRADIENTS, LAYOUT } from '@/lib/constants/theme';
import { BackButton } from '@/components/ui/BackButton';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useInterstitial, useRewarded } from '@/hooks/useAdMob';

export default function HomeScreen() {
  const [dateString, setDateString] = useState<string>('');
  const [results, setResults] = useState<CalculationResult | null>(null);

  const navigation = useNavigation();
  const { t, language } = useAppTranslation();
  const { showInterstitial } = useInterstitial();
  const { showRewarded } = useRewarded();

  const handleCalculate = () => {
    // DATE CONVERSION: DD.MM.YYYY -> YYYY-MM-DD
    const parts = dateString.split('.');
    const isoDateString = `${parts[2]}-${parts[1]}-${parts[0]}`;

    showInterstitial(() => {
      try {
        const dateObj = new Date(isoDateString);
        if (isNaN(dateObj.getTime())) {
          return;
        }

        const calcResults = calculatePythagoreanSquare(dateObj);
        setResults(calcResults);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const handleBack = useCallback(() => {
    setResults(null);
    setDateString('');
  }, []);

  const contentStyle: StyleProp<ViewStyle> = results ?
    { justifyContent: 'flex-start', alignItems: 'stretch' } :
    {  alignItems: 'center', marginTop: LAYOUT.topMarginLarge };

  useEffect(() => {
    if (results) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={{ alignItems: 'center' }}>
            <Text style={FONTS.headerTitle}>{t('analysisTitle')}</Text>
            <Text style={FONTS.headerSubtitle}>{dateString}</Text>
          </View>
        ),
        headerLeft: () => <BackButton onPress={handleBack} style={{ marginLeft: 20 }} />,
        headerRight: () => (
          <View style={{ alignItems: 'center' }} />
        ),
        tabBarStyle: { display: 'none' },
      });
    } else {
      navigation.setOptions({
        headerTitle: t('tabs.pythagoras'),
        headerLeft: () => null,
        headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
        tabBarStyle: {
          display: 'flex',
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.background
        },
      });
    }

  }, [navigation, results, handleBack, dateString, language]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom', 'left', 'right']}
    >
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>
      <View style={[styles.content, contentStyle]}>
        {!results ? (
          <DateInputForm
            date={dateString}
            setDate={setDateString}
            onSubmit={handleCalculate}
          />
        ) : (
          <ResultsDisplay results={results} date={dateString} onBack={handleBack} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.transparent,
    paddingTop: 20
  },
  content: {
    flex: 1,
    paddingHorizontal: LAYOUT.contentPadding,
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  logo: {
    width: '150%',
    maxWidth: LAYOUT.logoLarge,
    maxHeight: LAYOUT.logoLarge,
    opacity: 0.2,
  },
});
