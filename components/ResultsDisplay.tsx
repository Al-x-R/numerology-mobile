// components/ResultsDisplay.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { GridCell } from '@/components/GridCell';
import { InterpretationModal } from '@/components/InterpretationModal';
import { WorkingNumbersDisplay } from '@/components/WorkingNumbersDisplay';

import { CalculationResult, Interpretation } from '@/lib/types';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';

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

  const [selected, setSelected] = useState<Interpretation | null>(null);

  const handlePress = (interpretationData: Interpretation) => {
    setSelected(interpretationData);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. Psychomatrix (Pythagorean Square) */}
        <View style={styles.pythagorasSection}>
          <Text style={styles.sectionTitle}>Психоматрица (Квадрат Пифагора)</Text>
          <View style={[styles.grid, { gap: GAP }]}>
            {Object.entries(matrix).map(([id, value]) => {
              const interpretationData = getInterpretation(id, value);
              return (
                <GridCell
                  key={id}
                  id={id}
                  value={value}
                  cellSize={cellSize}
                  onPress={() => handlePress(interpretationData)}
                />
              );
            })}
          </View>
        </View>

        {/* 2. Additional numbers */}
        <WorkingNumbersDisplay
          workingNumbers={workingNumbers}
          onPress={handlePress}
          textAccentStyle={styles.textAccent}
        />
      </ScrollView>

      <InterpretationModal
        isVisible={selected !== null}
        onClose={() => setSelected(null)}
        interpretation={selected}
      />
    </>
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
});
