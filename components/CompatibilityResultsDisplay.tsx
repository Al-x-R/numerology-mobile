// components/CompatibilityResultsDisplay.tsx

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
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

import { CompatibilityResult } from '@/lib/calculators/compatibilityCalculator';
import { t } from '@/lib/constants/locales';
import { COLORS, FONT_FAMILY, FONTS, GRADIENTS, RADIUS, SHADOWS, SPACING } from '@/lib/constants/theme';

interface CompatibilityResultsDisplayProps {
  result: CompatibilityResult;
  date1: string;
  date2: string;
  onBack?: () => void;
}

interface GeneralAnalysisCardProps {
  lifePath1: number;
  lifePath2: number;
  destinyNumber: number;
  destinyInfo: {
    mission: string;
    purpose: string;
  };
  generalAnalysis: string;
  date1: string;
  date2: string;
  index: number;
}

function GeneralAnalysisCard({
  lifePath1,
  lifePath2,
  destinyNumber,
  destinyInfo,
  generalAnalysis,
  date1,
  date2,
  index,
}: GeneralAnalysisCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

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

      <Text style={styles.analysisTitle}>
        {t('compatibility.lpTitle')} {lifePath1} + {lifePath2}
      </Text>

      <Text style={styles.destinyTitle}>
        {t('compatibility.destinyTitle')} {destinyNumber}
      </Text>

      <Text style={styles.destinyMission}>
        {destinyInfo.mission}
      </Text>

      <View style={styles.separator} />

      <Text style={styles.analysisText}>{generalAnalysis}</Text>
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

interface AnimatedRecommendationCardProps {
  text: string;
  index: number;
}

function AnimatedRecommendationCard({ text, index }: AnimatedRecommendationCardProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-30);

  useEffect(() => {
    const delay = index * 80;
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateX.value = withDelay(delay, withTiming(0, { duration: 550, easing: Easing.out(Easing.quad) }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.recommendationCard, animatedStyle]}>
      <Text style={styles.recommendationText}>• {text}</Text>
    </Animated.View>
  );
}

export function CompatibilityResultsDisplay({
  result,
  date1,
  date2,
}: CompatibilityResultsDisplayProps) {
  const getTotalColor = (pct: number) => {
    if (pct >= 85) return COLORS.battery.full;
    if (pct >= 70) return '#FFD700';
    if (pct >= 50) return '#FFA500';
    return COLORS.error;
  };

  const totalColor = getTotalColor(result.totalPct);
  const fullTotalColor = result.fullTotalPct ? getTotalColor(result.fullTotalPct) : COLORS.text;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Главный анализ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('compatibility.lpAnalysisSection')}</Text>
        <GeneralAnalysisCard
          lifePath1={result.lifePath1}
          lifePath2={result.lifePath2}
          destinyNumber={result.destinyNumber}
          destinyInfo={result.destinyInfo}
          generalAnalysis={result.generalAnalysis}
          date1={date1}
          date2={date2}
          index={0}
        />
      </View>

      {/* Базовые параметры */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('compatibility.baseParamsSection')}</Text>

        <CompatibilityParamCard title={t('compatibility.energy')}   p1={result.energy.p1}    p2={result.energy.p2}    pct={result.energy.pct}    index={1} />
        <CompatibilityParamCard title={t('compatibility.character')} p1={result.character.p1} p2={result.character.p2} pct={result.character.pct} index={2} />
        <CompatibilityParamCard title={t('compatibility.interest')}  p1={result.interest.p1}  p2={result.interest.p2}  pct={result.interest.pct}  index={3} />
      </View>

      <AnimatedTotalCard label={t('compatibility.baseTotal')} value={result.totalPct} color={totalColor} index={4} />

      {/* Премиум-параметры */}
      {result.karma && result.family && result.talent && result.spirituality &&  (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('compatibility.premiumParamsSection')}</Text>
          <CompatibilityParamCard title={t('compatibility.karma')}       p1={result.karma.p1}       p2={result.karma.p2}       pct={result.karma.pct}       index={5} />
          <CompatibilityParamCard title={t('compatibility.family')}      p1={result.family.p1}      p2={result.family.p2}      pct={result.family.pct}      index={6} />
          <CompatibilityParamCard title={t('compatibility.talent')}      p1={result.talent.p1}      p2={result.talent.p2}      pct={result.talent.pct}      index={7} />
          <CompatibilityParamCard title={t('compatibility.spirituality')} p1={result.spirituality.p1} p2={result.spirituality.p2} pct={result.spirituality.pct} index={8} />
        </View>
      )}

      {result.fullTotalPct && (
        <AnimatedTotalCard label={t('compatibility.fullTotal')} value={result.fullTotalPct} color={fullTotalColor} index={9} />
      )}

      {/* Рекомендации */}
      {result.recommendations && result.recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('compatibility.recommendations')}</Text>
          {result.recommendations.map((rec, i) => (
            <AnimatedRecommendationCard key={i} text={rec} index={10 + i} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: SPACING.xs, paddingBottom: SPACING.xl },
  section: { marginBottom: SPACING.xl },
  sectionTitle: {
    ...FONTS.sectionTitle,
    fontSize: 20,
    marginBottom: SPACING.md,
  },

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

  analysisTitle: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 22,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },

  destinyTitle: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 28,
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },

  destinyMission: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontStyle: 'italic',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },

  analysisText: {
    ...FONTS.body,
    lineHeight: 26,
  },

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

  // === Итоговая карточка ===
  totalContainer: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },

  totalCard: {
    width: '100%',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
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

  // === Рекомендации ===
  recommendationCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },

  recommendationText: {
    ...FONTS.body,
    lineHeight: 24,
    color: COLORS.text,
  },
});
