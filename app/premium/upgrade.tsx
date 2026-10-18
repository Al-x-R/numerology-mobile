// app/premium/upgrade.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { COLORS, FONT_FAMILY, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
import { BackButton } from '@/components/ui/BackButton';
import { GoldButton } from '@/components/ui/GoldButton';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';

type PlanId = 'weekly' | 'monthly' | 'yearly';

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();
  const { isPremium, setPremiumStatus } = useProfile();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');
  const [isLoading, setIsLoading] = useState(false);


  const plansData = {
    weekly: {
      id: 'weekly',
      title: t('premium.planWeekly'),
      price: '$2.99',
      period: t('premium.planWeeklyPeriod'),
      subtitle: t('premium.planWeeklySubtitle'),
      subtext: '',
      save: null,
      bestValue: null
    },
    monthly: {
      id: 'monthly',
      title: t('premium.planMonthly'),
      price: '$6.99',
      period: t('premium.planMonthlyPeriod'),
      subtitle: '',
      subtext: '',
      save: t('premium.planMonthlySave'),
      bestValue: null
    },
    yearly: {
      id: 'yearly',
      title: t('premium.planYearly'),
      price: '$29.99',
      period: t('premium.planYearlyPeriod'),
      subtitle: '',
      subtext: t('premium.planYearlySubtext'),
      save: null,
      bestValue: t('premium.planYearlyBestValue')
    }
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(t('premium.success'), t('premium.subscriptionUpdated'), [
        { text: 'OK', onPress: async () => { await setPremiumStatus(true); router.back(); } }
      ]);
    }, 1500);
  };

  const handleManageSubscription = () => {
    const url = Platform.OS === 'ios'
      ? 'https://apps.apple.com/account/subscriptions'
      : 'https://play.google.com/store/account/subscriptions';
    Linking.openURL(url);
  };

  const handleRestore = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        t('premium.restoreTitle'),
        t('premium.restoreSuccess'),
        [{ text: 'OK', onPress: async () => { await setPremiumStatus(true); router.back(); } }]
      );
    }, 1500);
  };

  const openLink = (url: string) => Linking.openURL(url);

  const features = [
    { icon: 'grid-outline' as const, title: t('premium.featureAnalysis'), description: t('premium.featureAnalysisDesc') },
    { icon: 'sparkles-outline' as const, title: t('premium.featureForecasts'), description: t('premium.featureForecastsDesc') },
    { icon: 'infinite-outline' as const, title: t('premium.featureCompatibility'), description: t('premium.featureCompatibilityDesc') },
    { icon: 'ban-outline' as const, title: t('premium.featureAdFree'), description: t('premium.featureAdFreeDesc') },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <AuraBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + SPACING.sm, paddingBottom: insets.bottom + SPACING.lg }]}
      >
        <BackButton onPress={() => router.back()} icon="close" />

        {/* --- HERO --- */}
        <View style={styles.hero}>
          <View style={styles.heroMedallion}>
            <Ionicons name="diamond-outline" size={28} color={COLORS.accent} />
          </View>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="star-four-points" size={11} color={COLORS.accent} />
            <Text style={styles.chipText}>{t('premium.badge')}</Text>
          </View>
          <Text style={styles.heroTitle}>DESTINY CODE PRO</Text>
          <Text style={styles.heroSubtitle}>{t('premium.heroSubtitle')}</Text>
        </View>

        {/* --- FEATURES --- */}
        <View style={styles.module}>
          {features.map((feature, index) => (
            <View key={feature.title} style={[styles.featureRow, index < features.length - 1 && styles.featureDivider]}>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={14} color={COLORS.accent} />
              </View>
              <View style={styles.featureTextBlock}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* --- PLANS --- */}
        <View style={styles.plans}>
          {(['weekly', 'monthly', 'yearly'] as PlanId[]).map((id) => {
            const plan = plansData[id];
            const isSelected = selectedPlan === id;
            const badge = plan.bestValue || plan.save;

            return (
              <TouchableOpacity
                key={id}
                activeOpacity={0.9}
                style={[styles.planCard, isSelected && styles.planCardSelected]}
                onPress={() => setSelectedPlan(id)}
              >
                {badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{badge}</Text>
                  </View>
                )}

                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={14} color={COLORS.blackText} />}
                </View>

                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  {!!(plan.subtitle || plan.subtext) && (
                    <Text style={[styles.planSubtitle, isSelected && id === 'yearly' && styles.planSubtitleAccent]}>
                      {plan.subtitle || plan.subtext}
                    </Text>
                  )}
                </View>

                <View style={styles.priceBlock}>
                  <Text style={styles.price}>{plan.price}</Text>
                  <Text style={styles.period}>{plan.period}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* --- ACTION --- */}
        {!isPremium ? (
          <>
            <GoldButton
              title={isLoading ? t('premium.loading') : t('premium.continue')}
              onPress={handlePurchase}
              loading={isLoading}
              iconRight={<Ionicons name="arrow-forward" size={18} color={COLORS.blackText} />}
            />
            <Text style={styles.disclaimer}>{t('premium.subscriptionDisclaimer')}</Text>
          </>
        ) : (
          <TouchableOpacity style={styles.manageButton} onPress={handleManageSubscription}>
            <Text style={styles.manageButtonText}>{t('premium.manageSubscription')}</Text>
          </TouchableOpacity>
        )}

        {/* --- FOOTER --- */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => openLink('https://telegra.ph/Terms-of-Use-EULA-01-03')}>
            <Text style={styles.footerLink}>{t('premium.terms')}</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>·</Text>
          <TouchableOpacity onPress={() => openLink('https://telegra.ph/Privacy-Policy-for-Destiny-Code-01-03')}>
            <Text style={styles.footerLink}>{t('premium.privacy')}</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>·</Text>
          <TouchableOpacity onPress={handleRestore}>
            <Text style={[styles.footerLink, styles.footerLinkAccent]}>{t('premium.restore')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: SPACING.margin },

  // --- HERO ---
  hero: { alignItems: 'center', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  heroMedallion: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.goldenButtonSoft,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
    marginBottom: SPACING.md,
  },
  chipText: { ...TYPE.labelMd, color: COLORS.accent },
  heroTitle: { ...TYPE.displayLg, fontSize: 32, letterSpacing: 1.5, textAlign: 'center', marginBottom: SPACING.sm },
  heroSubtitle: { ...TYPE.bodyLg, color: COLORS.textTertiary, textAlign: 'center', paddingHorizontal: SPACING.md },

  // --- FEATURES ---
  module: {
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, paddingVertical: SPACING.md },
  featureDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  featureCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  featureTextBlock: { flex: 1 },
  featureTitle: { ...TYPE.titleMd },
  featureDescription: { ...TYPE.bodyMd, marginTop: 2 },

  // --- PLANS ---
  plans: { gap: SPACING.md, marginBottom: SPACING.lg },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md + 2,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  planCardSelected: {
    backgroundColor: COLORS.surfaceSelected,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    ...SHADOWS.goldenButtonSoft,
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: SPACING.md,
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentAmber,
  },
  planBadgeText: { ...TYPE.labelSm, fontFamily: FONT_FAMILY.sans.bold, color: COLORS.blackText },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  planInfo: { flex: 1 },
  planTitle: { ...TYPE.titleLg },
  planSubtitle: { ...TYPE.bodyMd, marginTop: 2 },
  planSubtitleAccent: { color: COLORS.accent },
  priceBlock: { alignItems: 'flex-end' },
  price: { ...TYPE.titleLg, fontSize: 20 },
  period: { ...TYPE.bodySm, marginTop: 2 },

  // --- ACTION ---
  disclaimer: { ...TYPE.bodySm, textAlign: 'center', marginTop: SPACING.md },
  manageButton: {
    height: 54,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageButtonText: { ...TYPE.labelLg },

  // --- FOOTER ---
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xl },
  footerLink: { ...TYPE.bodySm },
  footerLinkAccent: { color: COLORS.accent },
  footerDot: { ...TYPE.bodySm, color: COLORS.textMuted },
});
