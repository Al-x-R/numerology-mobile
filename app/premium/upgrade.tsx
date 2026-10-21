// app/premium/upgrade.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';

import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
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

  const selectPlan = (id: PlanId) => {
    if (id === selectedPlan) return;
    Haptics.selectionAsync();
    setSelectedPlan(id);
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
            <Ionicons name="diamond-outline" size={28} color={COLORS.textTertiary} />
          </View>
          {/* For PRO members the chip states their status instead of the product name */}
          <View style={styles.chip}>
            <MaterialCommunityIcons name="star-four-points" size={12} color={COLORS.textSecondary} />
            <Text style={styles.chipText}>{isPremium ? t('premium.youArePro') : t('premium.badge')}</Text>
          </View>
          <Text style={styles.heroTitle} numberOfLines={2}>DESTINY CODE PRO</Text>
          <Text style={styles.heroSubtitle} numberOfLines={3}>{t('premium.heroSubtitle')}</Text>
        </View>

        {/* --- FEATURES --- */}
        <View style={styles.module}>
          {features.map((feature, index) => (
            <View key={feature.title} style={[styles.featureRow, index < features.length - 1 && styles.featureDivider]}>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={14} color={COLORS.textTertiary} />
              </View>
              <View style={styles.featureTextBlock}>
                <Text style={styles.featureTitle} numberOfLines={2}>{feature.title}</Text>
                <Text style={styles.featureDescription} numberOfLines={2}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* --- PLANS (only for those who can buy) --- */}
        {!isPremium && <View style={styles.plans}>
          {(['weekly', 'monthly', 'yearly'] as PlanId[]).map((id) => {
            const plan = plansData[id];
            const isSelected = selectedPlan === id;
            const badge = plan.bestValue || plan.save;

            return (
              <TouchableOpacity
                key={id}
                activeOpacity={0.7}
                style={[styles.planCard, isSelected && styles.planCardSelected]}
                onPress={() => selectPlan(id)}
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
                  <Text style={styles.planTitle} numberOfLines={1}>{plan.title}</Text>
                  {!!(plan.subtitle || plan.subtext) && (
                    <Text style={styles.planSubtitle} numberOfLines={1}>
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
        </View>}

        {/* --- ACTION --- */}
        {!isPremium ? (
          <>
            <GoldButton
              title={isLoading ? t('premium.loading') : t('premium.continue')}
              onPress={handlePurchase}
              loading={isLoading}
              iconRight={<Ionicons name="arrow-forward" size={18} color={COLORS.blackText} />}
            />
            <Text style={styles.disclaimer} numberOfLines={3}>{t('premium.subscriptionDisclaimer')}</Text>
          </>
        ) : (
          <TouchableOpacity style={styles.manageButton} onPress={handleManageSubscription} activeOpacity={0.7}>
            <Text style={styles.manageButtonText}>{t('premium.manageSubscription')}</Text>
          </TouchableOpacity>
        )}

        {/* --- FOOTER --- */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => openLink('https://telegra.ph/Terms-of-Use-EULA-01-03')} activeOpacity={0.7}>
            <Text style={styles.footerLink}>{t('premium.terms')}</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>·</Text>
          <TouchableOpacity style={styles.footerButton} onPress={() => openLink('https://telegra.ph/Privacy-Policy-for-Destiny-Code-01-03')} activeOpacity={0.7}>
            <Text style={styles.footerLink}>{t('premium.privacy')}</Text>
          </TouchableOpacity>
          {/* Restoring only makes sense before the subscription is active */}
          {!isPremium && (
            <>
              <Text style={styles.footerDot}>·</Text>
              <TouchableOpacity style={styles.footerButton} onPress={handleRestore} activeOpacity={0.7}>
                <Text style={styles.footerLink}>{t('premium.restore')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: SPACING.margin },

  // --- HERO ---
  // Neutral: gold on this screen marks the selected plan, the best-value badge and the CTA
  hero: { alignItems: 'center', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  heroMedallion: {
    width: LAYOUT.emblemHero,
    height: LAYOUT.emblemHero,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    marginBottom: SPACING.md,
  },
  chipText: { ...TYPE.labelMd, fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight, color: COLORS.textTertiary },
  heroTitle: {
    ...TYPE.displayLg,
    fontFamily: FONT_FAMILY.serif.semibold,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
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
    width: SPACING.lg,
    height: SPACING.lg,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextBlock: { flex: 1 },
  featureTitle: { ...TYPE.titleMd },
  featureDescription: { ...TYPE.bodyMd, marginTop: SPACING.xs },

  // --- PLANS ---
  plans: { gap: SPACING.md, marginBottom: SPACING.lg },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  planCardSelected: {
    backgroundColor: COLORS.surfaceSelected,
    borderColor: COLORS.accent,
  },
  // Sits on the card's top edge, half above it
  planBadge: {
    position: 'absolute',
    top: -SPACING.gutterSm,
    right: SPACING.md,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.gutterSm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentAmber,
  },
  planBadgeText: {
    ...TYPE.labelSm,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    fontFamily: FONT_FAMILY.sans.bold,
    color: COLORS.blackText,
  },
  // Unselected ring uses text4 so the control stays visible on the card (>= 3:1)
  radio: {
    width: SPACING.lg,
    height: SPACING.lg,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  planInfo: { flex: 1 },
  planTitle: { ...TYPE.titleLg },
  planSubtitle: { ...TYPE.bodyMd, marginTop: SPACING.xs },
  priceBlock: { alignItems: 'flex-end' },
  price: { ...TYPE.titleLg, fontVariant: ['tabular-nums'] },
  period: { ...TYPE.bodySm, marginTop: SPACING.xs },

  // --- ACTION ---
  disclaimer: { ...TYPE.bodySm, textAlign: 'center', marginTop: SPACING.md },
  manageButton: {
    height: LAYOUT.buttonHeight,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageButtonText: { ...TYPE.labelLg },

  // --- FOOTER ---
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: SPACING.xs,
    marginTop: SPACING.lg,
  },
  // Text links get a 44pt touch area
  footerButton: { minHeight: LAYOUT.minTouch, justifyContent: 'center', paddingHorizontal: SPACING.xs },
  footerLink: { ...TYPE.bodySm },
  footerDot: { ...TYPE.bodySm, color: COLORS.textMuted },
});
