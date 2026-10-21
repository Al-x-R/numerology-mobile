// components/WorkingNumbersDisplayAnimated.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { getContextualInterpretations } from '@/lib/data/additionalNumberInterpretations';
import { Interpretation } from '@/lib/types/calculation';
import { FONTS, FONT_FAMILY, SPACING, COLORS, RADIUS, LAYOUT, TYPE } from '@/lib/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getCurrentLocale } from '@/lib/constants/locales';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { getWorkingMeanings } from '@/lib/data/workingMeanings';

interface WorkingNumbersDisplayProps {
  workingNumbers: number[];
  onPress: (data: Interpretation) => void;
  textAccentStyle: StyleProp<TextStyle>;
}

function getFullWorkingInterpretation(
  id: string,
  value: number,
  t: (key: string) => string,
): Interpretation {
  const contextMap = getContextualInterpretations(t);
  const context = contextMap[id as keyof typeof contextMap];

  const locale = getCurrentLocale();

  const meanings = getWorkingMeanings(locale);
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
    <Animated.View style={[animatedStyle, styles.numberCell]}>
      <TouchableOpacity style={styles.numberCard} onPress={() => onPress(interpretationData)} activeOpacity={0.7}>
        <Text style={styles.numberLabel} numberOfLines={2}>
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
  textAccentStyle: StyleProp<TextStyle>;
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
        activeOpacity={0.7}
      >
        <View style={styles.fateMedallion}>
          <MaterialCommunityIcons name="infinity" size={26} color={COLORS.textTertiary} />
        </View>
        <View style={styles.fateTextBlock}>
          <Text style={styles.fateEyebrow} numberOfLines={1}>{t('fateEyebrow')}</Text>
          <Text style={styles.fateTitle} numberOfLines={2}>
            {t('destinyNumberLabel')}: <Text style={textAccentStyle}>{value}</Text>
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.chevron} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  numbersSection: { marginTop: SPACING.lg },
  sectionTitle: {
    ...FONTS.sectionTitle,
    fontFamily: FONT_FAMILY.serif.semibold,
    marginBottom: SPACING.md,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.gutterSm,
  },
  // Two per row whatever the window width
  numberCell: { flexBasis: '45%', flexGrow: 1 },
  numberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.gutterSm,
  },
  numberLabel: {
    ...FONTS.workingLabel,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    flex: 1,
  },
  // Neutral: the grid is the screen's hero, gold stays on strong cells and the destiny number
  numberValue: {
    ...FONTS.workingValue,
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  fateCardFinal: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  fateMedallion: {
    width: LAYOUT.emblem,
    height: LAYOUT.emblem,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fateTextBlock: { flex: 1 },
  fateEyebrow: { ...TYPE.labelSm, fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight, marginBottom: SPACING.xs },
  fateTitle: { ...TYPE.titleLg },
});
