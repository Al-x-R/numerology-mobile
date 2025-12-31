// components/WorkingNumbersDisplayAnimated.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { workingMeanings } from '@/lib/data/workingNumberMeanings';
import { workingMeanings as workingMeaningsEn } from '@/lib/data/workingNumberMeanings.en';
import { getContextualInterpretations } from '@/lib/data/additionalNumberInterpretations';
import { Interpretation } from '@/lib/types/calculation';
import { FONTS, SPACING, COLORS, RADIUS } from '@/lib/constants/theme';
import { getCurrentLocale } from '@/lib/constants/locales';
import { useAppTranslation } from '@/contexts/LanguageContext';

interface WorkingNumbersDisplayProps {
  workingNumbers: number[];
  onPress: (data: Interpretation) => void;
  textAccentStyle: any;
}

function getFullWorkingInterpretation(
  id: string,
  value: number,
  t: (key: string) => string,
): Interpretation {
  const contextMap = getContextualInterpretations(t);
  const context = contextMap[id as keyof typeof contextMap];

  const locale = getCurrentLocale();

  const meanings = locale === 'en' ? workingMeaningsEn : workingMeanings;
  const meaning = meanings[value];

  if (!context || !meaning) {
    return { title: t('errorNotFound'), description: t('errorDataNotFound'), type: 'working' };
  }

  const fullDescription = `${context.description}\n\n${t('workingNumberInterpretation').replace('{value}', value.toString())}\n${meaning}`;
  return {
    title: context.title,
    description: fullDescription,
    type: 'working'
  };
}

export function WorkingNumbersDisplayAnimated({
  workingNumbers,
  onPress,
  textAccentStyle,
}: WorkingNumbersDisplayProps) {
  const { t } = useAppTranslation();

  return (
    <View style={styles.numbersSection}>
      <Text style={styles.sectionTitle}>{t('section_workingNumbers')}</Text>
      <View style={styles.numbersGrid}>
        {workingNumbers.map((num, index) => (
          <WorkingNumberCard
            key={index}
            index={index}
            num={num}
            numberId={`working${index + 1}`}
            onPress={onPress}
          />
        ))}

        <FateCard value={workingNumbers[1]} onPress={onPress} textAccentStyle={textAccentStyle} />
      </View>
    </View>
  );
}

// === WORKING NUMBER ===
const WorkingNumberCard: React.FC<{
  index: number;
  num: number;
  numberId: string;
  onPress: (data: Interpretation) => void;
}> = ({ index, num, numberId, onPress }) => {
  const { t } = useAppTranslation();
  const interpretationData = getFullWorkingInterpretation(numberId, num, t);

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
      <TouchableOpacity style={styles.numberCard} onPress={() => onPress(interpretationData)}>
        <Text style={styles.numberLabel}>
          {t('workingNumberLabel').replace('{number}', (index + 1).toString())}
        </Text>
        <Text style={styles.numberValue}>{num}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// === NUMBER OF DESTINY ===
const FateCard: React.FC<{
  value: number;
  onPress: (data: Interpretation) => void;
  textAccentStyle: any;
}> = ({ value, onPress, textAccentStyle }) => {
  const { t } = useAppTranslation();
  const interpretationData = getFullWorkingInterpretation('destiny', value, t);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const delay = 900;

    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.08, { duration: 300 }),
        withTiming(1, { duration: 300 })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, { width: '100%' }]}>
      <TouchableOpacity
        style={styles.fateCardFinal}
        onPress={() => onPress(interpretationData)}
      >
        <Text style={styles.numberLabel}>{t('destinyNumberLabel')}</Text>
        <Text style={[styles.numberValue, styles.fateValue, textAccentStyle]}>
          {value}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  numbersSection: { marginTop: SPACING.xl, },
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
  fateCardFinal: {
    width: '100%',
    backgroundColor: COLORS.accentCardBackground,
    borderColor: COLORS.borderAccent,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    marginTop: SPACING.numberCardGap,
    paddingVertical: SPACING.cardPadding,
    alignItems: 'center',
    paddingHorizontal: SPACING.contentPadding,
  },
  fateValue: {
    ...FONTS.fateValue,
  },
});
