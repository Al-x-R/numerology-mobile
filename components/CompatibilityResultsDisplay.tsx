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
import { COLORS, FONT_FAMILY, GRADIENTS, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { PremiumTeaserModal } from '@/components/PremiumTeaserModal';
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
      <LinearGradient colors={GRADIENTS.accentCard} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
      <Text style={styles.datesText}>
        {date1}  ⇄  {date2}
      </Text>

      <Text style={styles.analysisTitleLabel}>
        {t('compatibility.lpTitle')}
      </Text>
      <Text style={styles.analysisTitleValues}>
        {lifePath1} + {lifePath2}
      </Text>

      <Text style={styles.destinyNumber}>{destinyNumber}</Text>
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
    if (pct >= 70) return COLORS.accent;
    if (pct >= 50) return COLORS.primaryDark;
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
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: percentageColor }]} />
          </View>
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
      <View style={styles.totalCard}>
        <LinearGradient colors={GRADIENTS.accentCard} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
        <Text style={styles.totalLabel}>{label}</Text>
        <Text style={[styles.totalValue, { color }]}>{value}%</Text>
      </View>
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

      <View style={styles.labelRow}>
        <Ionicons name="compass-outline" size={18} color={COLORS.accent} />
        <Text style={styles.destinyMissionLabel}>{t('compatibility.missionLabel')}</Text>
      </View>
      <Text style={styles.missionText}>{destinyInfo.mission}</Text>

      {destinyInfo.purpose && (
        <View>
          <View style={styles.labelRow}>
            <Ionicons name="flag-outline" size={18} color={COLORS.accent} />
            <Text style={styles.destinyPurposeLabel}>{t('compatibility.purposeLabel')}</Text>
          </View>
          <Text style={styles.purposeTextBody}>{destinyInfo.purpose}</Text>
        </View>
      )}

      {destinyInfo.challenges && destinyInfo.challenges.length > 0 && (
        <View style={styles.challengesList}>
          <View style={styles.labelRow}>
            <Ionicons name="warning-outline" size={18} color={COLORS.error} />
            <Text style={styles.challengesListTitle}>{t('compatibility.challengesLabel')}</Text>
          </View>
          {destinyInfo.challenges.map((challenge, i) => (
            <View key={i} style={styles.challengeItem}>
              <View style={styles.challengeIcon}>
                <Ionicons name="remove" size={12} color={COLORS.error} />
              </View>
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
          <View style={styles.labelRow}>
            <Ionicons name="bulb-outline" size={18} color={COLORS.accent} />
            <Text style={styles.recommendationsListTitle}>{t('compatibility.recommendations')}</Text>
          </View>
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

  const getTotalColor = (pct: number) => {
    if (pct >= 85) return COLORS.battery.full;
    if (pct >= 70) return COLORS.accent;
    if (pct >= 50) return COLORS.primaryDark;
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
    router.push('/premium/upgrade');
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
    paddingBottom: SPACING.xl * 2,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPE.headlineLg,
    marginBottom: SPACING.md,
  },

  // --- Union hero card ---
  analysisCard: {
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  datesText: { ...TYPE.labelMd, color: COLORS.text, letterSpacing: 1.6 },
  analysisTitleLabel: { ...TYPE.labelSm, marginTop: SPACING.md },
  analysisTitleValues: { ...TYPE.headlineMd, color: COLORS.accent, marginTop: SPACING.xs },
  destinyNumber: {
    fontFamily: FONT_FAMILY.serif.medium,
    fontSize: 72,
    lineHeight: 80,
    color: COLORS.accent,
    marginTop: SPACING.sm,
  },
  destinyTitle: { ...TYPE.headlineMd, textAlign: 'center', marginBottom: SPACING.md },
  destinyOverviewText: { ...TYPE.bodyMd, color: COLORS.textTertiary, textAlign: 'center' },

  // --- Parameter cards ---
  paramCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.gutterSm,
  },
  paramTitle: { ...TYPE.titleMd, marginBottom: SPACING.sm },
  paramValues: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  partnerValue: { alignItems: 'center', minWidth: 64 },
  partnerLabel: { ...TYPE.labelSm, marginBottom: 2 },
  partnerNumber: { ...TYPE.titleLg },
  percentageContainer: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.md },
  percentage: { fontFamily: FONT_FAMILY.sans.bold, fontSize: 18, marginBottom: 6 },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.surfaceRaised,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },

  // --- Total ---
  totalContainer: { marginBottom: SPACING.xl },
  totalCard: {
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSelected,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.goldenButtonSoft,
  },
  totalLabel: { ...TYPE.labelMd, color: COLORS.accent },
  totalValue: { fontFamily: FONT_FAMILY.serif.medium, fontSize: 56, lineHeight: 64, marginTop: SPACING.xs },

  // --- Free conclusion ---
  lpAnalysisTextSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  analysisTextTitle: { ...TYPE.headlineMd, marginBottom: SPACING.sm },
  analysisTextBody: { ...TYPE.bodyLg, color: COLORS.textTertiary },

  // --- Premium conclusion ---
  premiumConclusionSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md + 4,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  destinyMissionLabel: { ...TYPE.titleMd, color: COLORS.accent },
  destinyPurposeLabel: { ...TYPE.titleMd, color: COLORS.accent },
  missionText: { ...TYPE.bodyLg, color: COLORS.textTertiary },
  purposeTextBody: { ...TYPE.bodyLg, color: COLORS.textTertiary },
  summaryTextBody: { ...TYPE.bodyLg, color: COLORS.textTertiary },
  challengesList: {},
  challengesListTitle: { ...TYPE.titleMd, color: COLORS.error },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.gutterSm,
    marginBottom: SPACING.sm,
  },
  challengeIcon: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.warningChip,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  challengeItemText: { ...TYPE.bodyMd, color: COLORS.textTertiary, flex: 1 },
  adviceContainer: {
    marginTop: SPACING.lg,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.accent,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  adviceMotto: {
    fontFamily: FONT_FAMILY.serif.italic,
    fontSize: 22,
    lineHeight: 30,
    color: COLORS.accent,
    textAlign: 'center',
  },
  recommendationsList: {},
  recommendationsListTitle: { ...TYPE.titleMd, color: COLORS.accent },
  recommendationItem: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  recommendationBullet: { ...TYPE.bodyLg, color: COLORS.accent },
  recommendationItemText: { ...TYPE.bodyMd, color: COLORS.textTertiary, flex: 1 },
});
