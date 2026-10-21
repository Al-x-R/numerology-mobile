// components/GridCellAnimated.tsx
import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';
import { getHighlightType } from '@/lib/utils/highlight';
import { getTooltipText } from '@/lib/utils/tooltip';
import { COLORS, FONTS, FONT_FAMILY, SPACING, RADIUS, FONT_SIZES, TYPE } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';


interface GridCellProps {
  id: string;
  value: string;
  cellSize: number;
  onPress: () => void;
  index: number;
  maxLength: number;
}

export function GridCellAnimated({ id, value, cellSize, onPress, index, maxLength }: GridCellProps) {
  const title = getInterpretation(id, value).title.split(' (')[0];

  const containerOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.8);
  const labelOpacity = useSharedValue(0);
  const labelY = useSharedValue(-10);
  const valueScale = useSharedValue(0.5);
  const valueOpacity = useSharedValue(0);
  const tooltipOpacity = useSharedValue(0);

  const highlight = getHighlightType(id, value);

  useEffect(() => {
    const delay = index * 80; // Each cell with a delay

    // 1. Container
    containerOpacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    containerScale.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
    );

    // 2. Headline
    labelOpacity.value = withDelay(delay + 200, withTiming(1, { duration: 300 }));
    labelY.value = withDelay(delay + 200, withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }));

    // 3. Meaning
    valueOpacity.value = withDelay(delay + 300, withTiming(1, { duration: 400 }));
    valueScale.value = withDelay(
      delay + 300,
      withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      )
    );

    if (highlight !== 'none') {
      tooltipOpacity.value = withDelay(delay + 600, withTiming(1, { duration: 300 }));
    }
  }, [index]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ translateY: labelY.value }],
  }));

  const valueStyle = useAnimatedStyle(() => ({
    opacity: valueOpacity.value,
    transform: [{ scale: valueScale.value }],
  }));

  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
  }));

  const displayValue = value && value.length > 6 ? value.slice(0, 6) : (value || '—');
  const valueFontSize = maxLength > 4 ? FONT_SIZES.cellValueMedium : FONT_SIZES.cellValueLarge;
  const level = value ? Math.min(value.length, 6) : 0;

  return (
    <Animated.View style={[containerStyle]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.cell,
          { width: cellSize, minHeight: cellSize * 0.95 },
          highlight === 'strong' && styles.cellStrong,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.labelRow}>
          <Animated.Text style={[styles.cellLabel, labelStyle]} numberOfLines={1}>
            {title}
          </Animated.Text>
          <View style={[styles.dot, highlight === 'strong' && styles.dotStrong]} />
        </View>

        <Animated.Text
          style={[styles.cellValue, valueStyle, { fontSize: valueFontSize }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {displayValue}
        </Animated.Text>

        <Text style={styles.caption}>{level} / 6 {t('cellLevel')}</Text>

        {highlight !== 'none' && (
          <Animated.View style={[styles.tooltipWrapper, tooltipStyle]}>
            <View style={[styles.tooltip, highlight === 'weak' ? styles.tooltipWeak : styles.tooltipStrong]}>
              <Text numberOfLines={1} style={[styles.tooltipText, highlight === 'weak' ? styles.tooltipTextWeak : styles.tooltipTextStrong]}>
                {highlight === 'weak' ? t('chipAttention') : getTooltipText(id, value)}
              </Text>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// Labels and chips at the 12pt caption minimum
const caption = { fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight };

const styles = StyleSheet.create({
  cell: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.transparent,
    borderRadius: RADIUS.lg,
    padding: SPACING.gutterSm,
    justifyContent: 'space-between',
    position: 'relative',
  },
  // Gold marks a strong trait: a meaning, not decoration
  cellStrong: {
    backgroundColor: COLORS.surfaceSelected,
    borderColor: COLORS.borderAccent,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cellLabel: {
    ...FONTS.cellLabel,
    ...caption,
    flex: 1,
  },
  dot: {
    width: SPACING.xs,
    height: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.textMuted,
  },
  dotStrong: {
    backgroundColor: COLORS.accent,
  },
  cellValue: {
    ...FONTS.cellValue,
    fontFamily: FONT_FAMILY.serif.semibold,
    fontVariant: ['tabular-nums'],
    marginVertical: SPACING.xs,
  },
  caption: TYPE.bodySm,
  // TOOLTIPS: chips centred on the top border (half of the 24pt chip above it)
  tooltipWrapper: {
    position: 'absolute',
    top: -SPACING.gutterSm,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  tooltip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  tooltipWeak: {
    backgroundColor: COLORS.warningChip,
  },
  tooltipStrong: {
    backgroundColor: COLORS.accent,
  },
  tooltipText: {
    ...TYPE.labelSm,
    ...caption,
    fontFamily: FONT_FAMILY.sans.bold,
  },
  tooltipTextWeak: {
    color: COLORS.warningChipText,
  },
  tooltipTextStrong: {
    color: COLORS.blackText,
  },
});
