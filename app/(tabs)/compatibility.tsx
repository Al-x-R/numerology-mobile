import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet, View, Text, Alert, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';

import { DoubleDateInputForm } from '@/components/DoubleDateInputForm';
import { CompatibilityResultsDisplay } from '@/components/CompatibilityResultsDisplay';
import { calculateCompatibility, CompatibilityResult } from '@/lib/calculators/compatibilityCalculator';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { COLORS, FONTS, GRADIENTS, LAYOUT } from '@/lib/constants/theme';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { useProfile } from '@/contexts/ProfileContext';
import { BackButton } from '@/components/ui/BackButton';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useInterstitial, useRewarded } from '@/hooks/useAdMob';

export default function CompatibilityScreen() {
  const [dateString1, setDateString1] = useState<string>('');
  const [dateString2, setDateString2] = useState<string>('');
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);
  const [isAdUnlocked, setIsAdUnlocked] = useState(false);

  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { isPremium } = useProfile();
  const { t, language } = useAppTranslation();
  const { showRewarded } = useRewarded();
  const { showInterstitial } = useInterstitial();

  const hasResults = compatibilityResult !== null;

  const handleBack = useCallback(() => {
    setCompatibilityResult(null);
    setDateString1('');
    setDateString2('');
    setIsAdUnlocked(false);
  }, []);

  useEffect(() => {
    if (hasResults) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={{ alignItems: 'center' }}>
            <Text style={FONTS.headerTitle}>{t('compatibility.compatibilityResultsTitle')}</Text>
          </View>
        ),
        headerLeft: () => <BackButton onPress={handleBack} style={{ marginLeft: 20 }} />,
        headerRight: () => <View />,
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
  }, [navigation, hasResults, handleBack, language]);

  const calculateResult = (d1: string, d2: string, unlocked: boolean) => {
    try {
      const effectivePremium = isPremium || unlocked;
      const result = calculateCompatibility(d1, d2, effectivePremium);
      setCompatibilityResult(result);
    } catch (e) {
      Alert.alert(t('common.error'), t('errors.calculationFailed'));
    }
  };

  const handleCalculate = () => {
    if (!dateString1 || !dateString2 || dateString1.length < 10 || dateString2.length < 10) return;
    setIsAdUnlocked(false);
    showInterstitial(() => calculateResult(dateString1, dateString2, false));
  };

  const paddingTop = hasResults ? LAYOUT.topMarginLarge / 2 : LAYOUT.topMarginLarge;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            !hasResults && { paddingBottom: tabBarHeight + 40 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { paddingTop }]}>
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
                onUnlockRequest={() => showRewarded(() => calculateResult(dateString1, dateString2, true))}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: LAYOUT.contentPadding,
    alignItems: 'center',
    // paddingTop: LAYOUT.topMarginLarge,
  },
  logo: {
    width: '150%',
    maxWidth: LAYOUT.logoLarge,
    maxHeight: LAYOUT.logoLarge,
    opacity: 0.1,
    position: 'absolute',
    top: -50,
  },
});
