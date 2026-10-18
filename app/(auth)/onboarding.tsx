// app/(auth)/onboarding.tsx

import React, {  } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { COLORS, FONTS, GRADIENTS, RADIUS, SPACING } from '@/lib/constants/theme';
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
      <LinearGradient colors={GRADIENTS.background} style={styles.background} />

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
          <TouchableOpacity
            style={styles.mainButtonContainer}
            activeOpacity={0.8}
            onPress={handleStart}
          >
            <LinearGradient
              colors={GRADIENTS.goldenButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainButton}
            >
              <Text style={styles.mainButtonText}>{t('onboarding.startButton')}</Text>
            </LinearGradient>
          </TouchableOpacity>

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
    backgroundColor: COLORS.background, // Fallback color
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },

  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
  },
  title: {
    ...FONTS.headerTitle,
    fontSize: 42,
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...FONTS.body,
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.textSecondary,
    lineHeight: 24,
  },

  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
  mainButtonContainer: {
    width: '100%',
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.lg,
  },
  mainButton: {
    paddingVertical: 18,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonText: {
    ...FONTS.button,
    fontSize: 18,
    color: COLORS.blackText,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  legalText: {
    ...FONTS.tooltip,
    marginTop: 10,
    textAlign: 'center',
    color: COLORS.textSecondary,
    opacity: 0.5,
    fontSize: 10,
  },
});
