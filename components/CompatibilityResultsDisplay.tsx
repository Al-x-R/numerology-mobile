// components/CompatibilityResultsDisplay.tsx

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';

import { CompatibilityResult } from '@/lib/calculators/compatibilityCalculator';
import { COLORS, FONT_FAMILY, FONTS, GRADIENTS, RADIUS, SHADOWS, SPACING } from '@/lib/constants/theme';
import { PremiumTeaserModal } from '@/components/PremiumTeaserModal';
import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';

// --- INTERFACES ---

interface CompatibilityResultsDisplayProps {
  result: CompatibilityResult;
  date1: string;
  date2: string;
  onBack?: () => void;
  onUnlockRequest: () => void;
}

interface DestinyInfo {
  overview: string;
  mission: string;
  purpose: string;
  summary: string;
  challenges: string[];
  advice: string;
}

interface GeneralAnalysisCardProps {
  lifePath1: number;
  lifePath2: number;
  destinyNumber: number;
  destinyInfo: DestinyInfo;
  date1: string;
  date2: string;
  index: number;
}

// --- SUB-COMPONENTS ---

function GeneralAnalysisCard({
  lifePath1,
  lifePath2,
  destinyNumber,
  destinyInfo,
  date1,
  date2,
  index,
}: GeneralAnalysisCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const { t } = useAppTranslation();

  useEffect(() => {
    const delay = index * 120;
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 650, easing: Easing.out(Easing.quad) }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.analysisCard, animatedStyle]}>
      <Text style={styles.datesText}>
        {date1}  ↔  {date2}
      </Text>

      <Text style={styles.analysisTitleLabel}>
        {t('compatibility.lpTitle')}
      </Text>
      <Text style={styles.analysisTitleValues}>
        {lifePath1} + {lifePath2}
      </Text>


      <Text style={styles.destinyTitle}>
        {t('compatibility.destinyTitle')} {destinyNumber}
      </Text>

      <Text style={styles.destinyOverviewText}>
        {destinyInfo.overview}
      </Text>
    </Animated.View>
  );
}

interface CompatibilityParamCardProps {
  title: string;
  p1: number;
  p2: number;
  pct: number;
  index: number;
}

function CompatibilityParamCard({ title, p1, p2, pct, index }: CompatibilityParamCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.95);
  const { t } = useAppTranslation();

  useEffect(() => {
    const delay = index * 90;
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 550, easing: Easing.out(Easing.quad) }));
    scale.value = withDelay(delay, withTiming(1, { duration: 550, easing: Easing.out(Easing.quad) }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const getColorForPercentage = (pct: number) => {
    if (pct >= 85) return COLORS.battery.full;
    if (pct >= 70) return '#FFD700';
    if (pct >= 50) return '#FFA500';
    return COLORS.error;
  };

  const percentageColor = getColorForPercentage(pct);

  return (
    <Animated.View style={[styles.paramCard, animatedStyle]}>
      <Text style={styles.paramTitle}>{title}</Text>
      <View style={styles.paramValues}>
        <View style={styles.partnerValue}>
          <Text style={styles.partnerLabel}>{t('compatibility.partner1')}</Text>
          <Text style={styles.partnerNumber}>{p1}</Text>
        </View>

        <View style={styles.percentageContainer}>
          <Text style={[styles.percentage, { color: percentageColor }]}>
            {pct}%
          </Text>
        </View>

        <View style={styles.partnerValue}>
          <Text style={styles.partnerLabel}>{t('compatibility.partner2')}</Text>
          <Text style={styles.partnerNumber}>{p2}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

interface AnimatedTotalCardProps {
  label: string;
  value: number;
  color: string;
  index: number;
}

function AnimatedTotalCard({ label, value, color, index }: AnimatedTotalCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(40);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const delay = index * 120;
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 700, easing: Easing.out(Easing.quad) }));
    scale.value = withDelay(delay, withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.totalContainer, animatedStyle]}>
      <LinearGradient colors={GRADIENTS.button} style={styles.totalCard}>
        <Text style={styles.totalLabel}>{label}</Text>
        <Text style={[styles.totalValue, { color }]}>{value}%</Text>
      </LinearGradient>
    </Animated.View>
  );
}

interface PremiumConclusionCardProps {
  destinyInfo: DestinyInfo;
  recommendations: string[];
}

function PremiumConclusionCard({ destinyInfo, recommendations }: PremiumConclusionCardProps) {
  const { t } = useAppTranslation();

  return (
    <View style={[styles.section, styles.premiumConclusionSection]}>
      <Text style={styles.sectionTitle}>{t('compatibility.conclusionTitle')}</Text>

      <Text style={styles.destinyMissionLabel}>{t('compatibility.missionLabel')}</Text>
      <Text style={styles.missionText}>{destinyInfo.mission}</Text>

      {destinyInfo.purpose && (
        <View>
          <Text style={styles.destinyPurposeLabel}>{t('compatibility.purposeLabel')}</Text>
          <Text style={styles.purposeTextBody}>{destinyInfo.purpose}</Text>
        </View>
      )}

      {destinyInfo.challenges && destinyInfo.challenges.length > 0 && (
        <View style={styles.challengesList}>
          <Text style={styles.challengesListTitle}>{t('compatibility.challengesLabel')}</Text>
          {destinyInfo.challenges.map((challenge, i) => (
            <View key={i} style={styles.challengeItem}>
              <Text style={styles.challengeItemText}>{challenge}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.destinyMissionLabel}>{t('compatibility.summaryLabel')}</Text>
      <Text style={styles.summaryTextBody}>{destinyInfo.summary}</Text>

      {destinyInfo.advice && (
        <View style={styles.adviceContainer}>
          <Text style={styles.adviceMotto}>{destinyInfo.advice}</Text>
        </View>
      )}

      {recommendations.length > 0 && (
        <View style={styles.recommendationsList}>
          <Text style={styles.recommendationsListTitle}>{t('compatibility.recommendations')}:</Text>
          {recommendations.map((rec, i) => (
            <View key={i} style={styles.recommendationItem}>
              <Text style={styles.recommendationBullet}>•</Text>
              <Text style={styles.recommendationItemText}>{rec}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// --- MAIN COMPONENT ---

export function CompatibilityResultsDisplay({
  result,
  date1,
  date2,
  onUnlockRequest,
}: CompatibilityResultsDisplayProps) {
  const { t } = useAppTranslation();
  const { user } = useProfile();

  const getTotalColor = (pct: number) => {
    if (pct >= 85) return COLORS.battery.full;
    if (pct >= 70) return '#FFD700';
    if (pct >= 50) return '#FFA500';
    return COLORS.error;
  };

  const showFullTotal = result.fullTotalPct !== undefined;
  const finalTotal = result.fullTotalPct ?? result.totalPct;
  const finalTotalLabel = showFullTotal ? t('compatibility.fullTotal') : t('compatibility.baseTotal');
  const finalTotalColor = getTotalColor(finalTotal);

  const paramSectionTitle = t('compatibility.paramsSectionTitle');

  const [isTeaserVisible, setIsTeaserVisible] = useState(false);

  // Teaser display logic
  useEffect(() => {
    if (!showFullTotal) {
      const timer = setTimeout(() => {
        setIsTeaserVisible(true);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [showFullTotal]);

  const handleGetPremium = () => {
    setIsTeaserVisible(false);
    if (user) {
      router.push('/premium/upgrade');
    } else {
      router.push('/(auth)/register?redirect=/premium/upgrade');
    }
  };

  const handleWatchAd = () => {
    setIsTeaserVisible(false);

    setTimeout(() => {
      onUnlockRequest();
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('compatibility.lpAnalysisSection')}</Text>
        <GeneralAnalysisCard
          lifePath1={result.lifePath1}
          lifePath2={result.lifePath2}
          destinyNumber={result.destinyNumber}
          destinyInfo={result.destinyInfo}
          date1={date1}
          date2={date2}
          index={0}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{paramSectionTitle}</Text>

        <CompatibilityParamCard title={t('compatibility.energy')}   p1={result.energy.p1}    p2={result.energy.p2}    pct={result.energy.pct}    index={1} />
        <CompatibilityParamCard title={t('compatibility.character')} p1={result.character.p1} p2={result.character.p2} pct={result.character.pct} index={2} />
        <CompatibilityParamCard title={t('compatibility.interest')}  p1={result.interest.p1}  p2={result.interest.p2}  pct={result.interest.pct}  index={3} />

        {showFullTotal && result.karma && result.family && result.talent && result.spirituality && (
          <>
            <CompatibilityParamCard title={t('compatibility.karma')}       p1={result.karma.p1}       p2={result.karma.p2}       pct={result.karma.pct}       index={5} />
            <CompatibilityParamCard title={t('compatibility.family')}      p1={result.family.p1}      p2={result.family.p2}      pct={result.family.pct}      index={6} />
            <CompatibilityParamCard title={t('compatibility.talent')}      p1={result.talent.p1}      p2={result.talent.p2}      pct={result.talent.pct}      index={7} />
            <CompatibilityParamCard title={t('compatibility.spirituality')} p1={result.spirituality.p1} p2={result.spirituality.p2} pct={result.spirituality.pct} index={8} />
          </>
        )}
      </View>

      <AnimatedTotalCard
        label={finalTotalLabel}
        value={finalTotal}
        color={finalTotalColor}
        index={showFullTotal ? 9 : 4}
      />

      {!showFullTotal && (
        <View style={[styles.section, styles.lpAnalysisTextSection]}>
          <Text style={styles.analysisTextTitle}>{t('compatibility.conclusionTitle')}</Text>
          <Text style={styles.analysisTextBody}>{result.generalAnalysis}</Text>
        </View>
      )}

      {showFullTotal && result.recommendations && (
        <PremiumConclusionCard
          destinyInfo={result.destinyInfo}
          recommendations={result.recommendations}
        />
      )}

      <PremiumTeaserModal
        visible={isTeaserVisible}
        onClose={() => setIsTeaserVisible(false)}
        onGetPremium={handleGetPremium}
        onWatchAd={handleWatchAd}
      />
    </ScrollView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  scrollContent: {
    padding: SPACING.xs,
    paddingBottom: SPACING.xl * 2
  },
  section: {
    marginBottom: SPACING.xl
  },
  sectionTitle: {
    ...FONTS.sectionTitle,
    fontSize: 20,
    marginBottom: SPACING.md,
  },

  // --- GENERAL ANALYSIS CARD STYLES ---
  analysisCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.card,
  },
  datesText: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  analysisTitleLabel: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 22,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs * 0.5,
  },
  analysisTitleValues: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 26,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  destinyTitle: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 28,
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  destinyOverviewText: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 24,
  },

  // --- LP ANALYSIS TEXT SECTION ---
  lpAnalysisTextSection: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  analysisTextTitle: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  analysisTextBody: {
    ...FONTS.body,
    lineHeight: 26,
  },

  // --- PREMIUM CONCLUSION STYLES ---
  premiumConclusionSection: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  destinyMissionLabel: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 16,
    color: COLORS.accent,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
    textAlign: 'left',
  },
  destinyPurposeLabel: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 16,
    color: COLORS.accent,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
    textAlign: 'left',
  },
  missionText: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontStyle: 'italic',
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  purposeTextBody: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontStyle: 'italic',
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  summaryTextBody: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  recommendationsList: {
    marginTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: SPACING.md,
  },
  recommendationsListTitle: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  recommendationBullet: {
    fontFamily: FONT_FAMILY.manrope.bold,
    color: COLORS.accent,
    marginRight: SPACING.xs,
    fontSize: 18,
    lineHeight: 22,
  },
  recommendationItemText: {
    ...FONTS.body,
    flex: 1,
    color: COLORS.text,
    lineHeight: 22,
  },
  challengesList: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  challengesListTitle: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 18,
    color: COLORS.error,
    marginBottom: SPACING.md,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  challengeItemText: {
    ...FONTS.body,
    flex: 1,
    color: COLORS.text,
    lineHeight: 22,
    marginLeft: SPACING.sm,
  },

  // --- ADVICE STYLES ---
  adviceContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    ...SHADOWS.card,
  },
  adviceMotto: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontStyle: 'italic',
    fontSize: 18,
    color: COLORS.accent,
    textAlign: 'center',
    lineHeight: 26,
  },

  // --- PARAMETER CARD STYLES ---
  paramCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  paramTitle: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 17,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  paramValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerValue: {
    alignItems: 'center',
    flex: 1,
  },
  partnerLabel: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  partnerNumber: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 28,
    color: COLORS.primary,
  },
  percentageContainer: {
    alignItems: 'center',
    minWidth: 90,
  },
  percentage: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 40,
    fontWeight: '800',
  },

  // --- TOTAL CARD STYLES ---
  totalContainer: {
    marginBottom: SPACING.xl,
  },
  totalCard: {
    width: '100%',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.button,
  },
  totalLabel: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    opacity: 0.9,
  },
  totalValue: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
