// components/WorkingNumbersDisplay.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { workingMeanings } from '@/lib/data/workingNumberMeanings';
import { workingMeanings as workingMeaningsEn } from '@/lib/data/workingNumberMeanings.en';
import { contextualInterpretations } from '@/lib/data/additionalNumberInterpretations';
import { Interpretation } from '@/lib/types';
import { COLORS } from '@/lib/constants/theme';
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
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
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
  numberLabel: {
    fontSize: 12,
    color: COLORS.accent,
    marginBottom: 4,
  },
  numberValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  fateCardFinal: {
    width: '100%',
    backgroundColor: 'rgba(224, 184, 115, 0.1)',
    borderColor: COLORS.accent,
    borderRadius: 10,
    marginTop: 5,
    paddingVertical: 15,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fateValue: {
    fontSize: 30,
  },
});
