// app/(auth)/onboarding.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { COLORS, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import * as Linking from 'expo-linking';
import { GoldButton } from '@/components/ui/GoldButton';
import { Ionicons } from '@expo/vector-icons';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';

const { width } = Dimensions.get('window');
const EMBLEM_SIZE = width * 0.6;
const TERMS_URL = 'https://telegra.ph/Terms-of-Use-EULA-01-03';

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
            {/* Soft gold glow behind the emblem */}
            <Svg style={styles.glow} pointerEvents="none">
              <Defs>
                <RadialGradient id="emblemGlow" cx="50%" cy="50%" r="50%">
                  <Stop offset="0" stopColor={COLORS.accentLight} stopOpacity={0.35} />
                  <Stop offset="0.45" stopColor={COLORS.accent} stopOpacity={0.12} />
                  <Stop offset="1" stopColor={COLORS.accent} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#emblemGlow)" />
            </Svg>
            <Image
              source={LOGO_IMAGE}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.textBlock}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>{t('onboarding.badge')}</Text>
            </View>
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

          <Text style={styles.legalText}>{t('onboarding.legalPrefix')}</Text>
          <Text style={[styles.legalText, styles.legalLink]} onPress={() => Linking.openURL(TERMS_URL)}>
            {t('onboarding.legalLink')}
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
    width: EMBLEM_SIZE,
    height: EMBLEM_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  glow: {
    position: 'absolute',
    width: EMBLEM_SIZE * 1.5,
    height: EMBLEM_SIZE * 1.5,
  },
  logo: {
    width: EMBLEM_SIZE,
    height: EMBLEM_SIZE,
  },
  textBlock: {
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.lg,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.accent },
  badgeText: { ...TYPE.labelMd, color: COLORS.textTertiary, letterSpacing: 2.4 },
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
  legalLink: {
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});
