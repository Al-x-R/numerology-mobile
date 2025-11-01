// components/GridCell.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';

import { COLORS, FONTS, GRADIENTS, SPACING, RADIUS } from '@/lib/constants/theme';

interface GridCellProps {
  id: string;
  value: string;
  cellSize: number;
  onPress: () => void;
}

export function GridCell({ id, value, cellSize, onPress }: GridCellProps) {
  const isAccent = ['1', '6'].includes(id); // We emphasize Character and Work
  const title = getInterpretation(id, value).title.split(' (')[0];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.cell,
        { width: cellSize },
        // isAccent ? styles.cellAccent : {}
      ]}
    >
      <Text style={styles.cellLabel}>{title}</Text>
      <Text style={[styles.cellValue, isAccent ? styles.textAccent : {}]}>
        {value || '—'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    padding: SPACING.xs,
  },
  cellAccent: {
    backgroundColor: COLORS.accentCardBorder,
    borderColor: COLORS.primary,
  },
  cellLabel: {
    ...FONTS.cellLabel,
    textAlign: 'center' as const,
  },
  cellValue: {
    ...FONTS.cellValue,
  },
  textAccent: {
    color: COLORS.accent,
  },
});
