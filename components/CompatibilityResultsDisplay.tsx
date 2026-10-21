// components/CompatibilityResultsDisplay.tsx

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
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
import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { PremiumTeaserModal } from '@/components/PremiumTeaserModal';
import { ProChip } from '@/components/ui/ProChip';
import { CardGlow } from '@/components/ui/CardGlow';
import { useAppTranslation } from '@/contexts/LanguageContext';

// --- INTERFACES ---

interface CompatibilityResultsDisplayProps {
  result: CompatibilityResult;
  date1: string;
  date2: string;
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
      <CardGlow intensity={0.05} />
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

  // The level reads from the number and the bar length, so no colour tiers (red would read as an error)
  return (
    <Animated.View style={[styles.paramCard, animatedStyle]}>
      <Text style={styles.paramTitle} numberOfLines={1}>{title}</Text>
      <View style={styles.paramValues}>
        <View style={styles.partnerValue}>
          <Text style={styles.partnerLabel}>{t('compatibility.partner1')}</Text>
          <Text style={styles.partnerNumber}>{p1}</Text>
        </View>

        <View style={styles.percentageContainer}>
          <Text style={styles.percentage}>
            {pct}%
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
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
  index: number;
}

// The screen's hero: the compatibility percentage people came for
function AnimatedTotalCard({ label, value, index }: AnimatedTotalCardProps) {
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
        <CardGlow intensity={0.1} />
        <Text style={styles.totalLabel} numberOfLines={2}>{label}</Text>
        <Text style={styles.totalValue}>{value}%</Text>
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
        <Ionicons name="compass-outline" size={18} color={COLORS.textTertiary} />
        <Text style={styles.destinyMissionLabel}>{t('compatibility.missionLabel')}</Text>
      </View>
      <Text style={styles.missionText}>{destinyInfo.mission}</Text>

      {destinyInfo.purpose && (
        <View>
          <View style={styles.labelRow}>
            <Ionicons name="flag-outline" size={18} color={COLORS.textTertiary} />
            <Text style={styles.destinyPurposeLabel}>{t('compatibility.purposeLabel')}</Text>
          </View>
          <Text style={styles.purposeTextBody}>{destinyInfo.purpose}</Text>
        </View>
      )}

      {destinyInfo.challenges && destinyInfo.challenges.length > 0 && (
        <View style={styles.challengesList}>
          <View style={styles.labelRow}>
            <Ionicons name="warning-outline" size={18} color={COLORS.textTertiary} />
            <Text style={styles.challengesListTitle}>{t('compatibility.challengesLabel')}</Text>
          </View>
          {destinyInfo.challenges.map((challenge, i) => (
            <View key={i} style={styles.challengeItem}>
              <View style={styles.challengeIcon}>
                <Ionicons name="remove" size={12} color={COLORS.textTertiary} />
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
            <Ionicons name="bulb-outline" size={18} color={COLORS.textTertiary} />
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

  const showFullTotal = result.fullTotalPct !== undefined;
  const finalTotal = result.fullTotalPct ?? result.totalPct;
  const finalTotalLabel = showFullTotal ? t('compatibility.fullTotal') : t('compatibility.baseTotal');

  const paramSectionTitle = t('compatibility.paramsSectionTitle');

  // Opened from the locked-analysis card only, never on a timer while the user reads
  const [isTeaserVisible, setIsTeaserVisible] = useState(false);

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
    // The screen's ScrollView scrolls this content
    <View style={styles.content}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} numberOfLines={2}>{t('compatibility.lpAnalysisSection')}</Text>
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
        <Text style={styles.sectionTitle} numberOfLines={2}>{paramSectionTitle}</Text>

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

        {!showFullTotal && (
          <TouchableOpacity style={styles.lockedCard} onPress={() => setIsTeaserVisible(true)} activeOpacity={0.7}>
            <View style={styles.lockedIcon}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.textTertiary} />
            </View>
            <View style={styles.lockedText}>
              <Text style={styles.paramTitle} numberOfLines={2}>{t('premiumTeaser.title')}</Text>
              <Text style={styles.lockedDescription} numberOfLines={3}>{t('premiumTeaser.description')}</Text>
            </View>
            <ProChip />
          </TouchableOpacity>
        )}
      </View>

      <AnimatedTotalCard
        label={finalTotalLabel}
        value={finalTotal}
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
    </View>
  );
}

// --- STYLES ---

// Captions at the 12pt minimum
const caption = { fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight };

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPE.headlineLg,
    fontFamily: FONT_FAMILY.serif.semibold,
    marginBottom: SPACING.md,
  },

  // --- Union card (neutral; the total below is the hero) ---
  analysisCard: {
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    padding: SPACING.lg,
  },
  datesText: { ...TYPE.labelMd, ...caption, color: COLORS.text, letterSpacing: 1.6, fontVariant: ['tabular-nums'] },
  analysisTitleLabel: { ...TYPE.labelSm, ...caption, marginTop: SPACING.md },
  analysisTitleValues: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.semibold, marginTop: SPACING.xs, fontVariant: ['tabular-nums'] },
  destinyNumber: {
    ...TYPE.heroNumber,
    fontSize: 56,
    lineHeight: 64,
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
    marginTop: SPACING.sm,
  },
  destinyTitle: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.semibold, textAlign: 'center', marginBottom: SPACING.md },
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
  partnerValue: { alignItems: 'center', minWidth: LAYOUT.emblemHero },
  partnerLabel: { ...TYPE.labelSm, ...caption, marginBottom: SPACING.xs },
  partnerNumber: { ...TYPE.titleLg, fontVariant: ['tabular-nums'] },
  percentageContainer: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.md },
  percentage: { ...TYPE.titleLg, fontFamily: FONT_FAMILY.sans.bold, fontVariant: ['tabular-nums'], marginBottom: SPACING.sm },
  progressTrack: {
    width: '100%',
    height: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: RADIUS.full, backgroundColor: COLORS.accent },

  // --- Locked full analysis (free users) ---
  lockedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gutterSm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.hairline,
    padding: SPACING.md,
  },
  lockedIcon: {
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: { flex: 1 },
  lockedDescription: TYPE.bodyMd,

  // --- Total: the hero ---
  totalContainer: { marginBottom: SPACING.lg },
  totalCard: {
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSelected,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  totalLabel: { ...TYPE.labelMd, ...caption, color: COLORS.textTertiary, textAlign: 'center' },
  totalValue: { ...TYPE.heroNumber, fontSize: 56, lineHeight: 64, fontVariant: ['tabular-nums'], marginTop: SPACING.xs },

  // --- Free conclusion ---
  lpAnalysisTextSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  analysisTextTitle: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.semibold, marginBottom: SPACING.sm },
  analysisTextBody: { ...TYPE.bodyLg, color: COLORS.textTertiary },

  // --- Premium conclusion ---
  premiumConclusionSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.margin,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  destinyMissionLabel: TYPE.titleMd,
  destinyPurposeLabel: TYPE.titleMd,
  missionText: { ...TYPE.bodyLg, color: COLORS.textTertiary },
  purposeTextBody: { ...TYPE.bodyLg, color: COLORS.textTertiary },
  summaryTextBody: { ...TYPE.bodyLg, color: COLORS.textTertiary },
  challengesList: {},
  // Challenges are content, not an error: neutral, marked by the warning icon
  challengesListTitle: TYPE.titleMd,
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
    width: SPACING.margin,
    height: SPACING.margin,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeItemText: { ...TYPE.bodyMd, color: COLORS.textTertiary, flex: 1 },
  adviceContainer: {
    marginTop: SPACING.lg,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.hairline,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  adviceMotto: {
    ...TYPE.headlineMd,
    fontFamily: FONT_FAMILY.serif.italic,
    lineHeight: 30,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  recommendationsList: {},
  recommendationsListTitle: TYPE.titleMd,
  recommendationItem: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  recommendationBullet: { ...TYPE.bodyLg, color: COLORS.textSecondary },
  recommendationItemText: { ...TYPE.bodyMd, color: COLORS.textTertiary, flex: 1 },
});
