// components/GridCell.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';

interface GridCellProps {
  id: string;
  value: string;
  cellSize: number;
}

export function GridCell({ id, value, cellSize }: GridCellProps) {
  const isAccent = ['1', '6'].includes(id); // We emphasize Character and Work
  const title = getInterpretation(id, value).title.split(' (')[0];

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { width: cellSize },
        isAccent ? styles.cellAccent : {}
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
  },
  cellValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  textAccent: {
    color: '#E0B873',
  },
});
