// components/GridCell.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';

import { COLORS, FONTS, GRADIENTS, SPACING } from '@/lib/constants/theme';

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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // backgroundColor: 'rgba(122, 95, 255, 0.1)',
    // borderColor: '#7A5FFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
  },
  cellAccent: {
    backgroundColor: 'rgba(122, 95, 255, 0.1)',
    borderColor: '#7A5FFF',
  },
  cellLabel: {
    ...FONTS.cellLabel,
    textAlign: 'center' as const,
  },
  cellValue: {
    ...FONTS.cellValue,
    fontSize: 32,
  },
  textAccent: {
    color: COLORS.accent,
  },
});
