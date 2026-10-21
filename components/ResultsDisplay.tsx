// components/ResultsDisplay.tsx
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GridCellAnimated } from '@/components/GridCellAnimated';
import { WorkingNumbersDisplayAnimated } from '@/components/WorkingNumbersDisplayAnimated';

import { CalculationResult, Interpretation } from '@/lib/types/calculation';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';
import { InterpretationCard } from '@/components/InterpretationCard';
import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { useAppTranslation } from '@/contexts/LanguageContext';

interface ResultsDisplayProps {
  results: CalculationResult;
}

const GRID_GAP = SPACING.gutterSm;

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { t } = useAppTranslation();
  const insets = useSafeAreaInsets();

  const { matrix, workingNumbers } = results;
  const { width, height } = useWindowDimensions();

  const availableWidth = width - LAYOUT.contentPadding * 2 - GRID_GAP * 2;
  const cellSize = Math.floor(availableWidth / 3);

  const [selected, setSelected] = useState<Interpretation | null>(null);

  const handlePress = (interpretationData: Interpretation) => {
    if (selected) {
      return;
    }
    setSelected(interpretationData);
  };

  const handleClose = () => {
    setSelected(null);
  };

  const maxLength = Math.max(
    ...Object.values(results.matrix).map(v => v?.length || 0)
  );
  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Psychomatrix (Pythagorean Square), the screen's hero */}
        <Text style={styles.sectionTitle} numberOfLines={2}>{t('pythagorasTitle')}</Text>
        <Text style={styles.sectionEyebrow} numberOfLines={1}>{t('matrixEyebrow')}</Text>
        <View style={styles.grid}>
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

        {/* 2. Additional numbers */}
        <WorkingNumbersDisplayAnimated
          workingNumbers={workingNumbers}
          onPress={handlePress}
          textAccentStyle={styles.textAccent}
        />
      </ScrollView>

      {/* Interpretation as a bottom sheet over the whole screen, so it never opens off screen */}
      <Modal transparent visible={!!selected} animationType="fade" onRequestClose={handleClose}>
        <View style={styles.sheetOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
          {selected && (
            <Animated.View
              entering={SlideInDown.duration(300)}
              style={[styles.sheet, { maxHeight: height * 0.8, paddingBottom: insets.bottom + SPACING.md }]}
            >
              <InterpretationCard interpretation={selected} onClose={handleClose} />
            </Animated.View>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    width: '100%',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPE.headlineLg,
    fontFamily: FONT_FAMILY.serif.semibold,
  },
  sectionEyebrow: {
    ...TYPE.labelSm,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  // --- Pythagorean grid ---
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: SPACING.md,
  },
  textAccent: {
    color: COLORS.accent,
    fontVariant: ['tabular-nums'],
  },
  // --- Interpretation sheet ---
  sheetOverlay: { flex: 1, backgroundColor: COLORS.modalBackdrop, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.surfaceRaised,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
});
