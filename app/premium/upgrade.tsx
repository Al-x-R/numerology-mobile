// app/premium/upgrade.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { COLORS, FONTS, GRADIENTS, RADIUS, SPACING } from '@/lib/constants/theme';
import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';

type PlanId = 'weekly' | 'monthly' | 'yearly';

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();
  const { isPremium, setPremiumStatus } = useProfile();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('weekly');
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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={GRADIENTS.background} style={styles.background} />

      <View style={[styles.mainWrapper, { paddingTop: insets.top }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.closeButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('premium.headerTitle')}</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="diamond" size={48} color={COLORS.accent} />
            </View>
            <Text style={styles.heroSubtitle}>
              {t('premium.heroSubtitle')}
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {[
              t('premium.featureCompatibility'),
              t('premium.featureForecasts'),
              t('premium.featureAnalysis'),
              t('premium.featureAdFree'),
            ].map((feat, index) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} style={{ marginRight: 12 }} />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>

          {/* Plans Selection */}
          <View style={styles.plansContainer}>
            {(['weekly', 'monthly', 'yearly'] as PlanId[]).map((id) => {
              const plan = plansData[id];
              const isSelected = selectedPlan === id;

              return (
                <TouchableOpacity
                  key={id}
                  activeOpacity={0.9}
                  style={[styles.planCard, isSelected && styles.selectedCard]}
                  onPress={() => setSelectedPlan(id)}
                >
                  {plan.save && <View style={styles.badgeContainer}><Text style={styles.badgeText}>{plan.save}</Text></View>}
                  {id === 'yearly' && plan.bestValue && (
                    <View style={[styles.badgeContainer, { backgroundColor: COLORS.accent }]}>
                      <Text style={[styles.badgeText, { color: COLORS.blackText }]}>{plan.bestValue}</Text>
                    </View>
                  )}

                  <View style={styles.planInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.planTitle, isSelected && styles.selectedText]}>{plan.title}</Text>
                      {isSelected && <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} style={{ marginLeft: 8 }} />}
                    </View>
                    <Text style={styles.planSubtitle}>{plan.subtitle || plan.subtext}</Text>
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={[styles.priceText, isSelected && styles.selectedText]}>{plan.price}</Text>
                    <Text style={styles.periodText}>{plan.period}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Button */}
          <View style={styles.actionSection}>
            {!isPremium ? (
              <>
                <TouchableOpacity style={styles.ctaButton} onPress={handlePurchase} disabled={isLoading}>
                  <LinearGradient colors={GRADIENTS.goldenButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaGradient}>
                    <Text style={styles.ctaText}>{isLoading ? t('premium.loading') : t('premium.continue')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.disclaimer}>
                  {t('premium.subscriptionDisclaimer')}
                </Text>
              </>
            ) : (
              <TouchableOpacity style={styles.manageButton} onPress={handleManageSubscription}>
                <Text style={styles.manageButtonText}>{t('premium.manageSubscription')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer Links */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => openLink('https://telegra.ph/Terms-of-Use-EULA-01-03')}>
              <Text style={styles.footerLink}>{t('premium.terms')}</Text>
            </TouchableOpacity>

            <Text style={styles.footerDivider}>|</Text>

            <TouchableOpacity onPress={handleRestore}>
              <Text style={styles.footerLink}>{t('premium.restore')}</Text>
            </TouchableOpacity>

            <Text style={styles.footerDivider}>|</Text>

            <TouchableOpacity onPress={() => openLink('https://telegra.ph/Privacy-Policy-for-Destiny-Code-01-03')}>
              <Text style={styles.footerLink}>{t('premium.privacy')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainWrapper: { flex: 1 },
  background: { ...StyleSheet.absoluteFill },
  scrollContent: { paddingHorizontal: 0 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    height: 50,
  },
  closeButton: {
    padding: 8,
    width: 40,
    height: 40,
    backgroundColor: COLORS.hairline,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { ...FONTS.button, color: COLORS.accent, letterSpacing: 2, fontSize: 14 },
  heroSection: { alignItems: 'center', marginVertical: SPACING.lg, paddingHorizontal: SPACING.lg },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.accentCardBorder,
  },
  heroTitle: { ...FONTS.title, fontSize: 24, color: COLORS.text, textAlign: 'center', marginBottom: SPACING.xs, fontWeight: 'bold' },
  heroSubtitle: { ...FONTS.body, color: COLORS.textSecondary, textAlign: 'center', fontSize: 14, lineHeight: 20 },
  featuresContainer: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureText: { ...FONTS.body, color: COLORS.text, fontSize: 15 },
  plansContainer: { paddingHorizontal: SPACING.md, gap: 10, marginBottom: SPACING.xl },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    position: 'relative',
    overflow: 'hidden'
  },
  selectedCard: { borderColor: COLORS.accent, backgroundColor: COLORS.accentSoft },
  planInfo: { flex: 1 },
  planTitle: { ...FONTS.subtitle, color: COLORS.text, fontSize: 17, fontWeight: 'bold' },
  planSubtitle: { ...FONTS.body, color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  priceContainer: { alignItems: 'flex-end' },
  priceText: { ...FONTS.subtitle, color: COLORS.text, fontSize: 19, fontWeight: 'bold' },
  selectedText: { color: COLORS.accent },
  periodText: { ...FONTS.body, color: COLORS.textSecondary, fontSize: 11 },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomLeftRadius: 8
  },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: COLORS.text },
  actionSection: { paddingHorizontal: SPACING.xl },
  ctaButton: { borderRadius: RADIUS.xl, overflow: 'hidden' },
  ctaGradient: { paddingVertical: 16, alignItems: 'center' },
  ctaText: { ...FONTS.button, color: COLORS.blackText, fontSize: 17, fontWeight: 'bold' },
  disclaimer: { textAlign: 'center', color: COLORS.textSecondary, fontSize: 11, marginTop: SPACING.sm, marginBottom: SPACING.md },
  manageButton: { paddingVertical: 16, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.accent, alignItems: 'center' },
  manageButtonText: { ...FONTS.button, color: COLORS.accent, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.lg },
  footerLink: { color: COLORS.textSecondary, fontSize: 12, textDecorationLine: 'underline' },
  footerDivider: { color: COLORS.textSecondary, marginHorizontal: 10, fontSize: 12 },
});
