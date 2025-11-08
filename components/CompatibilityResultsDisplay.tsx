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
import { COLORS, FONTS, GRADIENTS, RADIUS, SHADOWS, SPACING } from '@/lib/constants/theme';

interface CompatibilityResultsDisplayProps {
  result: CompatibilityResult;
  date1: string;
  date2: string;
  onBack?: () => void;
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
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const delay = index * 100; // Каждая карточка появляется с задержкой

    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 450, easing: Easing.out(Easing.quad) })
    );
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 450, easing: Easing.out(Easing.quad) })
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const getColorForPercentage = (pct: number) => {
    if (pct >= 80) return COLORS.battery.full;
    if (pct >= 60) return '#FFD700'; // gold
    if (pct >= 40) return '#FFA500'; // orange
    return COLORS.error;
  };

  const percentageColor = getColorForPercentage(pct);

  return (
    <Animated.View style={[styles.paramCard, animatedStyle]}>
      <Text style={styles.paramTitle}>{title}</Text>
      <View style={styles.paramValues}>
        <View style={styles.partnerValue}>
          <Text style={styles.partnerLabel}>{t('compatibilityPartner1')}</Text>
          <Text style={styles.partnerNumber}>{p1}</Text>
        </View>
        <View style={styles.percentageContainer}>
          <Text style={[styles.percentage, { color: percentageColor }]}>
            {pct}%
          </Text>
        </View>
        <View style={styles.partnerValue}>
          <Text style={styles.partnerLabel}>{t('compatibilityPartner2')}</Text>
          <Text style={styles.partnerNumber}>{p2}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export function CompatibilityResultsDisplay({ 
  result, 
  date1, 
  date2 
}: CompatibilityResultsDisplayProps) {
  const getTotalColor = (pct: number) => {
    if (pct >= 80) return COLORS.battery.full;
    if (pct >= 60) return '#FFD700';
    if (pct >= 40) return '#FFA500';
    return COLORS.error;
  };

  const totalColor = getTotalColor(result.totalPct);
  const fullTotalColor = result.fullTotalPct ? getTotalColor(result.fullTotalPct) : null;

  // Анимации для заголовка
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-10);
  const datesOpacity = useSharedValue(0);
  const datesTranslateY = useSharedValue(10);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 400 });
    titleTranslateY.value = withTiming(0, { duration: 450, easing: Easing.out(Easing.quad) });
    datesOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    datesTranslateY.value = withDelay(200, withTiming(0, { duration: 450, easing: Easing.out(Easing.quad) }));
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const datesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: datesOpacity.value,
    transform: [{ translateY: datesTranslateY.value }],
  }));

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Animated.Text style={[styles.title, titleAnimatedStyle]}>
        {t('compatibilityResultsTitle')}
      </Animated.Text>

      <Animated.View style={[styles.datesContainer, datesAnimatedStyle]}>
        <Text style={styles.dateText}>{date1}</Text>
        <Text style={styles.ampersand}>&</Text>
        <Text style={styles.dateText}>{date2}</Text>
      </Animated.View>

      {/* Basic Compatibility Parameters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('compatibilityTotal')}</Text>
        
        <CompatibilityParamCard
          title={t('compatibilityEnergy')}
          p1={result.energy.p1}
          p2={result.energy.p2}
          pct={result.energy.pct}
          index={0}
        />
        
        <CompatibilityParamCard
          title={t('compatibilityCharacter')}
          p1={result.character.p1}
          p2={result.character.p2}
          pct={result.character.pct}
          index={1}
        />
        
        <CompatibilityParamCard
          title={t('compatibilityInterest')}
          p1={result.interest.p1}
          p2={result.interest.p2}
          pct={result.interest.pct}
          index={2}
        />
      </View>

      {/* Total Compatibility */}
      <AnimatedTotalCard
        label={t('compatibilityTotal')}
        value={result.totalPct}
        color={totalColor}
        index={3}
      />

      {/* Premium Parameters */}
      {result.karma && result.family && result.talent && result.spirituality && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('compatibilityFullTotal')}</Text>
          
          <CompatibilityParamCard
            title={t('compatibilityKarma')}
            p1={result.karma.p1}
            p2={result.karma.p2}
            pct={result.karma.pct}
            index={4}
          />
          
          <CompatibilityParamCard
            title={t('compatibilityFamily')}
            p1={result.family.p1}
            p2={result.family.p2}
            pct={result.family.pct}
            index={5}
          />
          
          <CompatibilityParamCard
            title={t('compatibilityTalent')}
            p1={result.talent.p1}
            p2={result.talent.p2}
            pct={result.talent.pct}
            index={6}
          />
          
          <CompatibilityParamCard
            title={t('compatibilitySpirituality')}
            p1={result.spirituality.p1}
            p2={result.spirituality.p2}
            pct={result.spirituality.pct}
            index={7}
          />
        </View>
      )}

      {/* Full Total (Premium) */}
      {result.fullTotalPct && (
        <AnimatedTotalCard
          label={t('compatibilityFullTotal')}
          value={result.fullTotalPct}
          color={fullTotalColor || COLORS.text}
          index={8}
        />
      )}

      {/* Recommendations (Premium) */}
      {result.recommendations && result.recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('compatibilityRecommendations')}</Text>
          {result.recommendations.map((rec, index) => (
            <AnimatedRecommendationCard
              key={index}
              text={rec}
              index={9 + index}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// Анимированная карточка общей совместимости
interface AnimatedTotalCardProps {
  label: string;
  value: number;
  color: string;
  index: number;
}

function AnimatedTotalCard({ label, value, color, index }: AnimatedTotalCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const delay = index * 100;

    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) })
    );
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) })
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.totalContainer, animatedStyle]}>
      <LinearGradient colors={GRADIENTS.button} style={styles.totalCard}>
        <Text style={styles.totalLabel}>{label}</Text>
        <Text style={[styles.totalValue, { color }]}>
          {value}%
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

// Анимированная карточка рекомендации
interface AnimatedRecommendationCardProps {
  text: string;
  index: number;
}

function AnimatedRecommendationCard({ text, index }: AnimatedRecommendationCardProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  useEffect(() => {
    const delay = index * 100;

    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateX.value = withDelay(
      delay,
      withTiming(0, { duration: 450, easing: Easing.out(Easing.quad) })
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.recommendationCard, animatedStyle]}>
      <Text style={styles.recommendationText}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    width: '100%',
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  title: {
    ...FONTS.sectionTitle,
    fontSize: 24,
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: COLORS.accent,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  dateText: {
    ...FONTS.button,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  ampersand: {
    ...FONTS.button,
    fontSize: 18,
    color: COLORS.accent,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...FONTS.sectionTitle,
    fontSize: 20,
    marginBottom: SPACING.md,
    color: COLORS.accent,
  },
  paramCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  paramTitle: {
    ...FONTS.sectionTitle,
    fontSize: 16,
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  paramValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerValue: {
    flex: 1,
    alignItems: 'center',
  },
  partnerLabel: {
    ...FONTS.batteryLabel,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  partnerNumber: {
    ...FONTS.workingValue,
    fontSize: 20,
    color: COLORS.text,
  },
  percentageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  percentage: {
    ...FONTS.fateValue,
    fontSize: 28,
    fontWeight: '700',
  },
  totalContainer: {
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.xs,
  },
  totalCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  totalLabel: {
    ...FONTS.sectionTitle,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  totalValue: {
    ...FONTS.fateValue,
    fontSize: 48,
    fontWeight: '700',
  },
  recommendationCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  recommendationText: {
    ...FONTS.cardDescription,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
