// components/ResultsDisplay.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native';

import { CalculationResult } from '@/lib/types';
import { GridCell } from '@/components/GridCell';

interface ResultsDisplayProps {
  results: CalculationResult;
  date: string;
  onBack: () => void;
}

export function ResultsDisplay({ results, date, onBack }: ResultsDisplayProps) {
  const { matrix, workingNumbers } = results;
  const { width } = useWindowDimensions();
  const PADDING = 20;
  const GAP = 10;

  const gridWidth = width - (PADDING * 2);

  const cellSize = (gridWidth - (GAP * 2)) / 3;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* 1. Psychomatrix (Pythagorean Square) */}
      <View style={styles.pythagorasSection}>
        <Text style={styles.sectionTitle}>Психоматрица (Квадрат Пифагора)</Text>
        <View style={styles.grid}>
          {Object.entries(matrix).map(([id, value]) => (
            <GridCell key={id} id={id} value={value} cellSize={cellSize} />
          ))}
        </View>
      </View>

      {/* 2. Additional numbers*/}
      <View style={styles.numbersSection}>
        <Text style={styles.sectionTitle}>Дополнительные числа</Text>
        <View style={styles.numbersGrid}>
          {/* Working numbers */}
          {workingNumbers.map((num, index) => (
            <View
              key={index}
              style={[
                styles.numberCard,
                index === 1 ? styles.numberCardAccent : styles.numberCard,
                //index === 1 ? styles.fateCard : {}, // Destiny Number is special
              ]}
            >
              <Text style={styles.numberLabel}>
                {index + 1}-е раб. число
              </Text>
              <Text
                style={[
                  styles.numberValue,
                  index === 1 ? styles.textAccent : {},
                ]}
              >
                {num}
              </Text>
            </View>
          ))}

          {/* Destiny Number (2nd working number, but highlighted) */}
          <View style={[styles.numberCard, styles.fateCardFinal]}>
            <Text style={styles.numberLabel}>Число Судьбы</Text>
            <Text style={[styles.numberValue, styles.fateValue]}>
              {workingNumbers[1]}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    width: '100%',
  },
  // --- Sections ---
  section: {
    marginBottom: 0,
  },
  pythagorasSection: {

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  // --- Pythagorean grid ---
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  textAccent: {
    color: '#E0B873',
  },
  // --- Additional numbers ---
  numbersSection: {
    marginTop: 30,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 5
  },
  numberCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  numberCardAccent: {
    // For the 2nd working number (Destiny Number)
  },
  numberLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 4,
  },
  numberValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fateCardFinal: {
    width: '100%',
    backgroundColor: 'rgba(224, 184, 115, 0.1)',
    borderColor: '#E0B873',
    marginTop: 5,
    alignItems: 'center',
  },
  fateValue: {
    fontSize: 30,
    color: '#E0B873',
  },
});
