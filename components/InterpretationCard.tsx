// components/InterpretationCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Interpretation } from '@/lib/types';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS, LAYOUT } from '@/lib/constants/theme';
import { getCurrentLocale } from '@/lib/constants/locales';

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

  const fillPercent = (strength / 6) * 100;

  const getFillColor = () => {
    if (strength === 0) return COLORS.battery.empty;
    // if (strength < 2) return COLORS.highlightWeak;
    return COLORS.battery.full;
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={LAYOUT.closeIconSize} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {showBattery && strength !== null && (
        <View style={styles.batteryContainer}>
          <View style={[
            styles.batteryOutline,
            { borderColor: strength === 0 ? COLORS.battery.empty : COLORS.border }
          ]}>
            <View
              style={[
                styles.batteryFill,
                { width: fillPercent, backgroundColor: getFillColor() }
              ]}
            />
            <View style={styles.batteryCap} />
          </View>
          <Text style={styles.batteryLabel}>{strength}/6</Text>
        </View>
      )}


      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.headerBackground,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.borderFocused,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    zIndex: 1,
  },
  title: {
    ...FONTS.cardTitle,
    marginBottom: SPACING.sm,
    paddingRight: LAYOUT.paddingRightLarge,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  batteryOutline: {
    width: LAYOUT.batteryWidth,
    height: LAYOUT.batteryHeight,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.transparent,
    position: 'relative',
    overflow: 'hidden',
    marginRight: SPACING.xs,
  },
  batteryFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.battery,
  },
  batteryCap: {
    position: 'absolute',
    right: -6,
    top: '50%',
    transform: [{ translateY: -6 }],
    width: LAYOUT.batteryCapWidth,
    height: LAYOUT.batteryCapHeight,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.batteryCap,
  },
  batteryLabel: {
    ...FONTS.batteryLabel,
  },
  description: {
    ...FONTS.cardDescription,
  },
});
