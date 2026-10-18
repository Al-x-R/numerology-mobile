// app/(auth)/onboarding.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { COLORS, SPACING, TYPE } from '@/lib/constants/theme';
import { GoldButton } from '@/components/ui/GoldButton';
import { Ionicons } from '@expo/vector-icons';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { t } = useAppTranslation();
  const { completeOnboarding } = useProfile();

  const handleStart = async () => {
    await completeOnboarding();
    router.replace('/(tabs)/pythagoras');
  };

  return (
    <View style={styles.container}>
      <AuraBackground />

      <SafeAreaView style={styles.content}>

        <View style={styles.topSection}>
          <Animated.View
            entering={FadeInDown.delay(100).duration(800).springify()}
            style={styles.logoContainer}
          >
            <Image
              source={LOGO_IMAGE}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(800)}>
            <Text style={styles.title}>{t('title')}</Text>
            <Text style={styles.subtitle}>
              {t('onboarding.subtitle')}
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInUp.delay(600).duration(800)}
          style={styles.bottomSection}
        >
          <GoldButton
            title={t('onboarding.startButton')}
            onPress={handleStart}
            icon={<Ionicons name="arrow-forward" size={18} color={COLORS.blackText} />}
            style={styles.mainButton}
          />

          <Text style={styles.legalText}>
            {t('onboarding.legal')}
          </Text>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.margin,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logo: {
    width: width * 0.55,
    height: width * 0.55,
  },
  title: {
    ...TYPE.displayLg,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPE.bodyLg,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
  mainButton: {
    alignSelf: 'stretch',
    marginBottom: SPACING.lg,
  },
  legalText: {
    ...TYPE.bodySm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
