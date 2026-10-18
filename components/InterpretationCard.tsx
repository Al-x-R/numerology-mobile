// components/InterpretationCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Interpretation } from '@/lib/types/calculation';
import { COLORS, SPACING, RADIUS, LAYOUT, SHADOWS, TYPE } from '@/lib/constants/theme';
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
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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

      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.card,
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
    flex: 1,
  },
  closeButton: {
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: LAYOUT.iconButton / 2,
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
  potentialLabel: TYPE.labelMd,
  potentialValue: { ...TYPE.labelMd, color: COLORS.accent },
  potentialValueEmpty: { color: COLORS.error },
  segments: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.surfaceRaised,
  },
  segmentFilled: {
    backgroundColor: COLORS.accentLight,
  },
  description: {
    ...TYPE.bodyLg,
    color: COLORS.textTertiary,
  },
});
