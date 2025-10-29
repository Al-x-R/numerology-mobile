// components/WorkingNumbersDisplay.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { workingMeanings } from '@/lib/data/workingNumberMeanings';
import { contextualInterpretations } from '@/lib/data/additionalNumberInterpretations';
import { Interpretation } from '@/lib/types';

interface WorkingNumbersDisplayProps {
  workingNumbers: number[];
  onPress: (data: Interpretation) => void;
  textAccentStyle: any;
}

function getFullWorkingInterpretation(id: string, value: number): Interpretation {
  const context = contextualInterpretations[id as keyof typeof contextualInterpretations];
  const meaning = workingMeanings[value];

  if (!context || !meaning) {
    return { title: 'Ошибка', description: 'Данные не найдены.' };
  }

  const fullDescription = `${context.description}\n\nИнтерпретация числа ${value}:\n${meaning}`;

  return {
    title: context.title,
    description: fullDescription
  };
}

export function WorkingNumbersDisplay({ workingNumbers, onPress, textAccentStyle }: WorkingNumbersDisplayProps) {
  return (
    <View style={styles.numbersSection}>
      <Text style={styles.sectionTitle}>Дополнительные числа</Text>
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
                {interpretationData.title.split(' ')[0]}-е раб. число
              </Text>
              <Text style={styles.numberValue}>{num}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.fateCardFinal}
          onPress={() => onPress(getFullWorkingInterpretation('destiny', workingNumbers[1]))}
        >
          <Text style={styles.numberLabel}>Число Судьбы</Text>
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
    color: '#FFFFFF',
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
