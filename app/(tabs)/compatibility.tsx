// app/(tabs)/compatibility.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DoubleDateInputForm } from '@/components/DoubleDateInputForm';
import { CompatibilityResultsDisplay } from '@/components/CompatibilityResultsDisplay';
import { calculateCompatibility, CompatibilityResult } from '@/lib/calculators/compatibilityCalculator';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { COLORS, FONTS, GRADIENTS, LAYOUT } from '@/lib/constants/theme';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { useProfile } from '@/contexts/ProfileContext';
import { BackButton } from '@/components/ui/BackButton';
import { useAppTranslation } from '@/contexts/LanguageContext';

export default function CompatibilityScreen() {
  const [dateString1, setDateString1] = useState<string>('');
  const [dateString2, setDateString2] = useState<string>('');
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);

  const navigation = useNavigation();
  const { user } = useProfile();
  const { t, language } = useAppTranslation();

  const handleCalculate = () => {
    try {
      // calculateCompatibility expects format DD.MM.YYYY
      const result = calculateCompatibility(dateString1, dateString2, user?.isPremium);
      setCompatibilityResult(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBack = useCallback(() => {
    setCompatibilityResult(null);
    setDateString1('');
    setDateString2('');
  }, []);

  const hasResults = compatibilityResult !== null;

  const contentStyle: StyleProp<ViewStyle> = hasResults ?
    { justifyContent: 'flex-start', alignItems: 'stretch' } :
    { alignItems: 'center', marginTop: LAYOUT.topMarginLarge };

  useEffect(() => {
    if (hasResults) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={{ alignItems: 'center' }}>
            <Text style={FONTS.headerTitle}>{t('compatibility.compatibilityResultsTitle')}</Text>
            {/*<Text style={FONTS.headerSubtitle}>{dateString1} & {dateString2}</Text>*/}
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
        headerTitle: t('compatibilityTitle'),
        headerLeft: () => null,
        headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
        tabBarStyle: {
          display: 'flex',
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.background
        },
      });
    }

  }, [navigation, hasResults, handleBack, dateString1, dateString2, language]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>
      <View style={[styles.content, contentStyle]}>
        {!hasResults ? (
          <DoubleDateInputForm
            date1={dateString1}
            date2={dateString2}
            setDate1={setDateString1}
            setDate2={setDateString2}
            onSubmit={handleCalculate}
          />
        ) : (
          <CompatibilityResultsDisplay 
            result={compatibilityResult}
            date1={dateString1}
            date2={dateString2}
            onBack={handleBack}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.transparent, // Match the gradient background
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
    width: '150%', // Adjusted for better fit
    maxWidth: LAYOUT.logoLarge,
    maxHeight: LAYOUT.logoLarge,
    opacity: 0.2,
  },
});
