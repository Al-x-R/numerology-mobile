// components/WorkingNumbersDisplay.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { workingMeanings } from '@/lib/data/workingNumberMeanings';
import { workingMeanings as workingMeaningsEn } from '@/lib/data/workingNumberMeanings.en';
import { contextualInterpretations } from '@/lib/data/additionalNumberInterpretations';
import { Interpretation } from '@/lib/types';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONTS } from '@/lib/constants/theme';
import { t, getCurrentLocale } from '@/lib/constants/locales';

interface WorkingNumbersDisplayProps {
  workingNumbers: number[];
  onPress: (data: Interpretation) => void;
  textAccentStyle: any;
}

function getFullWorkingInterpretation(id: string, value: number): Interpretation {
  const context = contextualInterpretations[id as keyof typeof contextualInterpretations];
  const locale = getCurrentLocale();
  const meanings = locale === 'en' ? workingMeaningsEn : workingMeanings;
  const meaning = meanings[value];

  if (!context || !meaning) {
    return { title: t('errorNotFound'), description: t('errorDataNotFound'), type: 'working' };
  }

  const fullDescription = `${context.description}\n\n${t('workingNumberInterpretation').replace('{value}', value.toString())}\n${meaning}`;

  return {
    title: context.title,
    description: fullDescription,
    type: 'working'
  };
}

export function WorkingNumbersDisplay({ workingNumbers, onPress, textAccentStyle }: WorkingNumbersDisplayProps) {
  return (
    <View style={styles.numbersSection}>
      <Text style={styles.sectionTitle}>{t('section_workingNumbers')}</Text>
      <View style={styles.numbersGrid}>
        {workingNumbers.map((num, index) => {

          const numberId = `working${index + 1}`;
          const interpretationData = getFullWorkingInterpretation(numberId, num);

          return (
            <TouchableOpacity
              key={index}
              style={[styles.numberCard]}
              onPress={() => onPress(interpretationData)}
            >
              <Text style={styles.numberLabel}>
                {t('workingNumberLabel').replace('{number}', (index + 1).toString())}
              </Text>
              <Text style={styles.numberValue}>{num}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.fateCardFinal}
          onPress={() => onPress(getFullWorkingInterpretation('destiny', workingNumbers[1]))}
        >
          <Text style={styles.numberLabel}>{t('destinyNumberLabel')}</Text>
          <Text style={[styles.numberValue, styles.fateValue, textAccentStyle]}>
            {workingNumbers[1]}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  numbersSection: {
    marginTop: SPACING.sectionMarginTop,
  },
  sectionTitle: {
    ...FONTS.sectionTitle,
    marginBottom: SPACING.cardPadding,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.numberCardGap
  },
  numberCard: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.cardPadding,
    alignItems: 'center',
  },
  numberLabel: {
    ...FONTS.workingLabel,
    marginBottom: SPACING.xs,
  },
  numberValue: {
    ...FONTS.workingValue,
  },
  fateCardFinal: {
    width: '100%',
    backgroundColor: COLORS.accentCardBackground,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.md,
    marginTop: SPACING.numberCardGap,
    paddingVertical: SPACING.cardPadding,
    alignItems: 'center',
    paddingHorizontal: SPACING.contentPadding,
  },
  fateValue: {
    ...FONTS.fateValue,
  },
});
