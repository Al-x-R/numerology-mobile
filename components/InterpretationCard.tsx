// components/InterpretationCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Interpretation } from '@/lib/types/calculation';
import { COLORS, FONT_FAMILY, SPACING, RADIUS, LAYOUT, TYPE } from '@/lib/constants/theme';
import { getCurrentLocale, t } from '@/lib/constants/locales';

interface InterpretationCardProps {
  interpretation: Interpretation;
  onClose: () => void;
}

export function InterpretationCard({ interpretation, onClose }: InterpretationCardProps) {
  const { title, description, value, type } = interpretation;

  const showBattery = type === 'matrix';

  const strength = (() => {
    if (!value || value === '—') return 0;
    const locale = getCurrentLocale();
    // Check for "empty" patterns in both languages
    const emptyPatterns = locale === 'en' 
      ? ['no ', 'No ', 'none', 'None'] 
      : ['нет', 'Нет', 'отсутств'];
    if (emptyPatterns.some(pattern => description.includes(pattern))) return 0;
    const match = value.match(/(\d+)/);
    if (!match) return 0;
    return Math.min(match[0].length, 6);
  })();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={3}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7} accessibilityRole="button">
          <Ionicons name="close" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {showBattery && (
        <View style={styles.potential}>
          <View style={styles.potentialHeader}>
            <Text style={styles.potentialLabel}>{t('potentialLabel')}</Text>
            <Text style={[styles.potentialValue, strength === 0 && styles.potentialValueEmpty]}>{strength} / 6</Text>
          </View>
          <View style={styles.segments}>
            {Array.from({ length: 6 }, (_, i) => (
              <View key={i} style={[styles.segment, i < strength && styles.segmentFilled]} />
            ))}
          </View>
        </View>
      )}

      {/* Long interpretations scroll inside the sheet instead of running off screen */}
      <ScrollView style={styles.descriptionScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>{description}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // The surrounding sheet provides background, radius and padding
  card: {
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPE.headlineLg,
    fontFamily: FONT_FAMILY.serif.semibold,
    flex: 1,
  },
  closeButton: {
    width: LAYOUT.minTouch,
    height: LAYOUT.minTouch,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.glass,
    justifyContent: 'center',
    alignItems: 'center',
  },
  potential: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.gutterSm,
    marginBottom: SPACING.md,
  },
  potentialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  potentialLabel: { ...TYPE.labelMd, fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight },
  potentialValue: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    color: COLORS.accent,
    fontVariant: ['tabular-nums'],
  },
  potentialValueEmpty: { color: COLORS.error },
  segments: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  segment: {
    flex: 1,
    height: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
  },
  segmentFilled: {
    backgroundColor: COLORS.accentLight,
  },
  descriptionScroll: { flexShrink: 1 },
  description: {
    ...TYPE.bodyLg,
    color: COLORS.textTertiary,
  },
});
