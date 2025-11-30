// components/ResultsDisplay.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  SlideOutDown,
  SlideInDown,
} from 'react-native-reanimated';

import { GridCellAnimated } from '@/components/GridCellAnimated';
import { WorkingNumbersDisplayAnimated } from '@/components/WorkingNumbersDisplayAnimated';

import { CalculationResult, Interpretation } from '@/lib/types/calculation';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';
import { InterpretationCard } from '@/components/InterpretationCard';
import { COLORS, SPACING, FONTS } from '@/lib/constants/theme';
import { useAppTranslation } from '@/contexts/LanguageContext';

interface ResultsDisplayProps {
  results: CalculationResult;
  date: string;
  onBack: () => void;
}

export function ResultsDisplay({ results, date, onBack }: ResultsDisplayProps) {
  const { t } = useAppTranslation();

  const { matrix, workingNumbers } = results;
  const { width } = useWindowDimensions();
  const PADDING_HORIZONTAL = 20;
  const GAP = 10;

  const availableWidth = width - PADDING_HORIZONTAL * 2 - GAP * 2;
  const cellSize = Math.floor(availableWidth / 3);

  const [selected, setSelected] = useState<Interpretation | null>(null);

  const handlePress = (interpretationData: Interpretation) => {
    if (selected) {
      return;
    }
    setSelected(interpretationData);
  };

  const maxLength = Math.max(
    ...Object.values(results.matrix).map(v => v?.length || 0)
  );
  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. Psychomatrix (Pythagorean Square) */}
        <View style={styles.pythagorasSection}>
          <Text style={styles.sectionTitle}>{t('section_psychomatrix')}</Text>
          <View style={[styles.grid, { gap: GAP }]}>
            {Object.entries(matrix).map(([id, value], index) => {
              const interpretationData = getInterpretation(id, value);
              const interpretationDataFull = {
                ...interpretationData,
                value,
                type: 'matrix' as const,
              };

              return (
                <GridCellAnimated
                  key={id}
                  id={id}
                  value={value}
                  cellSize={cellSize}
                  index={index}
                  onPress={() => handlePress(interpretationDataFull)}
                  maxLength={maxLength}
                />
              );
            })}
          </View>
        </View>

        {selected && (

          <Animated.View
            entering={SlideInDown.duration(400).springify()}
            exiting={SlideOutDown.duration(300).springify()}
            style={styles.floatingCard}
          >
            <InterpretationCard
              interpretation={selected}
              onClose={() => setSelected(null)}
              // showBattery={!selected.value}
            />
          </Animated.View>
        )}

        {/* 2. Additional numbers */}
        <WorkingNumbersDisplayAnimated
          workingNumbers={workingNumbers}
          onPress={handlePress}
          textAccentStyle={styles.textAccent}
        />
      </ScrollView>
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
    ...FONTS.sectionTitle,
    marginBottom: SPACING.md,
  },
  // --- Pythagorean grid ---
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  textAccent: {
    color: COLORS.accent,
  },
  floatingCard: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1000,
    elevation: 10,
  },
});
