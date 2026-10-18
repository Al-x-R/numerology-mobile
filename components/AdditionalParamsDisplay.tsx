// components/AdditionalParamsDisplay.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { AdditionalParams, Interpretation } from '@/lib/types/calculation';
import { COLORS, FONTS, RADIUS, SPACING } from '@/lib/constants/theme';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';

interface AdditionalParamsProps {
  params: AdditionalParams;
  onPress: (data: Interpretation) => void;
}

// Maps parameters to matrix cells for interpretation
const PARAM_TO_CELL_MAP: Record<string, { cellId: string; useMatrix?: boolean }> = {
  goal: { cellId: '1' },
  family: { cellId: '6' },
  habits: { cellId: '5' },
  talent: { cellId: '3' },
  spirituality: { cellId: '3' },
  selfEsteem: { cellId: '7' },
};

function getAdditionalParamInterpretation(
  key: string,
  value: number | string,
  label: string,
  t: (key: string) => string,
): Interpretation {
  // Parameters that correspond to matrix cells
  const cellMapping = PARAM_TO_CELL_MAP[key];
  if (cellMapping && typeof value === 'number') {
    // Convert the count into a string of repeated digits (e.g. 3 -> "111", 4 -> "2222")
    const digit = cellMapping.cellId;
    const valueString = value === 0 ? '' : digit.repeat(value);
    const matrixInterpretation = getInterpretation(cellMapping.cellId, valueString);
    return {
      title: label,
      description: matrixInterpretation.description,
      type: 'matrix',
      value: valueString || '—',
    };
  }

  // Other parameters (e.g. temperament) just show the value
  return {
    title: label,
    description: `${label}: ${value}`,
    type: 'additional',
    value: String(value),
  };
}

export function AdditionalParamsDisplay({ params, onPress }: AdditionalParamsProps) {
  const { t } = useAppTranslation();

  const paramItems = [
    { key: 'temperament', label: t('params.temperament'), value: params.temperament },
    { key: 'goal', label: t('params.goal'), value: params.goal },
    { key: 'family', label: t('params.family'), value: params.family },
    { key: 'habits', label: t('params.habits'), value: params.habits },
    { key: 'talent', label: t('params.talent'), value: params.talent },
    { key: 'spirituality', label: t('params.spirituality'), value: params.spirituality },
    { key: 'selfEsteem', label: t('params.selfEsteem'), value: params.selfEsteem },
  ];

  return (
    <View style={styles.numbersSection}>
      <Text style={styles.sectionTitle}>{t('section_additional')}</Text>
      <View style={styles.numbersGrid}>
        {paramItems.map((item, index) => (
          <AdditionalParamCard
            key={item.key}
            index={index}
            item={item}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  );
}

const AdditionalParamCard: React.FC<{
  index: number;
  item: { key: string; label: string; value: number };
  onPress: (data: Interpretation) => void;
}> = ({ index, item, onPress }) => {
  const { t } = useAppTranslation();
  const interpretationData = getAdditionalParamInterpretation(item.key, item.value, item.label, t);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(15);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const delay = index * 100 + 400;

    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 450, easing: Easing.out(Easing.quad) }));
    scale.value = withDelay(delay, withTiming(1, { duration: 450 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.numberCard}
        onPress={() => onPress(interpretationData)}
        activeOpacity={0.7}
      >
        <Text style={styles.numberLabel}>{item.label}</Text>
        <Text style={styles.numberValue}>{item.value}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  numbersSection: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    ...FONTS.sectionTitle,
    marginBottom: SPACING.md,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.numberCardGap,
  },
  numberCard: {
    width: (Dimensions.get('window').width - 48) / 2,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.cardPadding,
    alignItems: 'center',
  },
  numberLabel: {
    ...FONTS.workingLabel,
    marginBottom: SPACING.xs,
  },
  numberValue: {
    ...FONTS.workingValue,
  },
});
