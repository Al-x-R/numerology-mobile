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

import { CompatibilityResult } from '@/lib/calculators/compatibilityCalculator';
import { PremiumTeaserModal } from '@/components/PremiumTeaserModal';


import { t } from '@/lib/constants/locales';
import { COLORS, FONTS, GRADIENTS, RADIUS, SHADOWS, SPACING } from '@/lib/constants/theme';

interface CompatibilityResultsDisplayProps {
  result: CompatibilityResult;
  date1: string;
  date2: string;
  isPremium: boolean;
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

/**
 * Возвращает ключ локализации для параметра по его индексу
 * @param index — позиция в массиве displayParams
 * @param isPremium — показываем ли премиум-параметры
 */
const getParamKey = (index: number, isPremium: boolean): string => {
  if (!isPremium) {
    const basic = ['compatibilityEnergy', 'compatibilityCharacter', 'compatibilityInterest'];
    return basic[index]!;
  }

  const full = [
    'compatibilityEnergy',
    'compatibilityCharacter',
    'compatibilityInterest',
    'compatibilityKarma',
    'compatibilityFamily',
    'compatibilityTalent',
    'compatibilitySpirituality',
  ];
  return full[index]!;
};

/**
 * Цветовая шкала: красный → оранжевый → золото → зелёный
 */
const getTotalColor = (pct: number): string => {
  if (pct >= 80) return COLORS.battery.full;        // #34C759 — зелёный
  if (pct >= 60) return '#FFD700';                  // золото
  if (pct >= 40) return '#FFA500';                  // оранжевый
  return COLORS.error;                              // #FF3B30 — красный
};

export function CompatibilityResultsDisplay({
  result,
  isPremium = false,
}: CompatibilityResultsDisplayProps) {
  const displayPct = isPremium ? result.fullCompatibilityPct : result.baseCompatibilityPct;

  const displayParams = isPremium
    ? [result.energy, result.character, result.interest, result.karma, result.family, result.talent, result.spirituality]
    : [result.energy, result.character, result.interest];

  const [showTeaser, setShowTeaser] = useState(false);

  useEffect(() => {
    if (!isPremium) {
      const timer = setTimeout(() => {
        setShowTeaser(true);
      }, 7000); // 7 сек
      return () => clearTimeout(timer);
    }
  }, [isPremium]);

  const handleUpgrade = () => {
    setShowTeaser(false);
    // TODO: открыть покупку
  };

  const handleClose = () => {
    setShowTeaser(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t(isPremium ? 'compatibilityFull' : 'compatibilityBasic')}
          </Text>

          {displayParams.map((param, i) => (
            <CompatibilityParamCard
              key={i}
              title={t(getParamKey(i, isPremium))}
              p1={param.p1}
              p2={param.p2}
              pct={param.pct}
              index={i}
            />
          ))}
        </View>

        <AnimatedTotalCard
          label={t(isPremium ? 'compatibilityFull' : 'compatibilityBasic')}
          value={displayPct}
          color={getTotalColor(displayPct)}
          index={displayParams.length}
        />

        {/* Замануха */}
        {!isPremium && (
          <PremiumTeaserModal
            visible={showTeaser}
            onClose={handleClose}
            onUpgrade={handleUpgrade}
          />
        )}

        {/* Рекомендации */}
        {isPremium && result.recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('compatibilityRecommendations')}</Text>
            {result.recommendations.map((rec, i) => (
              <AnimatedRecommendationCard key={i} text={rec} index={i} />
            ))}
          </View>
        )}
      </ScrollView>
    </>
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
