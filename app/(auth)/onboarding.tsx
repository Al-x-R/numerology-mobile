// app/(auth)/onboarding.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import * as Linking from 'expo-linking';
import { GoldButton } from '@/components/ui/GoldButton';
import { Ionicons } from '@expo/vector-icons';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';

const TERMS_URL = 'https://telegra.ph/Terms-of-Use-EULA-01-03';

export default function OnboardingScreen() {
  const { t } = useAppTranslation();
  const { completeOnboarding } = useProfile();
  const { width, height } = useWindowDimensions();
  const [isStarting, setIsStarting] = useState(false);

  // 60% of the width, capped by height so short screens keep room for the text and button
  const emblemSize = Math.min(width * 0.6, height * 0.3);
  const glowSize = emblemSize * 1.5;

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await completeOnboarding();
      router.replace('/(tabs)/today');
    } catch (e) {
      console.error('Error completing onboarding:', e);
      Alert.alert(t('common.error'), t('errors.tryAgain'));
      setIsStarting(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuraBackground />

      <SafeAreaView style={styles.container}>
        {/* Scrolls only when the content does not fit: small screens or a large text size */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.topSection}>
            <Animated.View
              entering={FadeInDown.delay(100).duration(800).springify()}
              style={[styles.logoContainer, { width: emblemSize, height: emblemSize }]}
            >
              {/* Soft gold glow behind the emblem, the screen's hero */}
              <Svg style={[styles.glow, { width: glowSize, height: glowSize }]} pointerEvents="none">
                <Defs>
                  <RadialGradient id="emblemGlow" cx="50%" cy="50%" r="50%">
                    <Stop offset="0" stopColor={COLORS.accentLight} stopOpacity={0.35} />
                    <Stop offset="0.45" stopColor={COLORS.accent} stopOpacity={0.12} />
                    <Stop offset="1" stopColor={COLORS.accent} stopOpacity={0} />
                  </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#emblemGlow)" />
              </Svg>
              <Image source={LOGO_IMAGE} style={{ width: emblemSize, height: emblemSize }} contentFit="contain" />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.textBlock}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText} numberOfLines={1}>{t('onboarding.badge')}</Text>
              </View>
              <Text style={styles.title} numberOfLines={2}>{t('title')}</Text>
              <Text style={styles.subtitle} numberOfLines={3}>
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
              loading={isStarting}
              icon={<Ionicons name="arrow-forward" size={18} color={COLORS.blackText} />}
              style={styles.mainButton}
            />

            <Text style={styles.legalText}>{t('onboarding.legalPrefix')}</Text>
            <TouchableOpacity style={styles.legalButton} onPress={() => Linking.openURL(TERMS_URL)} activeOpacity={0.7}>
              <Text style={[styles.legalText, styles.legalLink]}>{t('onboarding.legalLink')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
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
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.margin,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  glow: {
    position: 'absolute',
  },
  textBlock: {
    alignItems: 'center',
  },
  // Neutral chip: gold on this screen belongs to the emblem and the CTA
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.lg,
  },
  badgeDot: { width: SPACING.sm, height: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.textSecondary },
  badgeText: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    color: COLORS.textTertiary,
    letterSpacing: 2.4,
  },
  title: {
    ...TYPE.displayLg,
    fontFamily: FONT_FAMILY.serif.semibold,
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
  // The link line gets a 44pt touch area
  legalButton: {
    minHeight: LAYOUT.minTouch,
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  legalLink: {
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});
