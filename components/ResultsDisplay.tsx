// components/ResultsDisplay.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { CalculationResult } from '@/lib/types';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';

// --- (Заглушка GridCell) ---
// В будущем это будет отдельный компонент, пока оставим его здесь
const GridCell = ({ id, value }: { id: string; value: string }) => {
  const isAccent = ['1', '6'].includes(id); // Выделяем Характер и Труд
  const title = getInterpretation(id, value).title.split(' (')[0];

  return (
    <TouchableOpacity style={[styles.cell, isAccent ? styles.cellAccent : {}]}>
      <Text style={styles.cellLabel}>{title}</Text>
      <Text style={[styles.cellValue, isAccent ? styles.textAccent : {}]}>
        {value || '—'}
      </Text>
    </TouchableOpacity>
  );
};
// ----------------------------

interface ResultsDisplayProps {
  results: CalculationResult;
  date: string;
  onBack: () => void;
}

export function ResultsDisplay({ results, date, onBack }: ResultsDisplayProps) {
  const { matrix, workingNumbers } = results;

  // Форматируем дату (просто для вида)
  const formattedDate = new Date(date).toLocaleDateString('ru-RU');

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Шапка с Назад */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Мой Анализ</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>&lt; Назад</Text>
        </TouchableOpacity>
      </View>

      {/* 1. Психоматрица (Квадрат Пифагора) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Психоматрица (Квадрат Пифагора)</Text>
        <View style={styles.grid}>
          {Object.entries(matrix).map(([id, value]) => (
            <GridCell key={id} id={id} value={value} />
          ))}
        </View>
      </View>

      {/* 2. Дополнительные числа */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Дополнительные числа</Text>
        <View style={styles.numbersGrid}>
          {/* Рабочие числа */}
          {workingNumbers.map((num, index) => (
            <View
              key={index}
              style={[
                styles.numberCard,
                index === 1 ? styles.numberCardAccent : styles.numberCard,
                //index === 1 ? styles.fateCard : {}, // Число Судьбы - особое
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

          {/* Число Судьбы (2-е рабочее число, но выделено) */}
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
    padding: 20,
    backgroundColor: '#0D0F21',
  },
  // --- Шапка ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#A0A0A0',
  },
  // --- Секции ---
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  // --- Сетка Пифагора ---
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    width: '31.5%',
    aspectRatio: 1,
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
    position: 'absolute',
    top: 5,
  },
  cellValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  textAccent: {
    color: '#E0B873',
  },
  // --- Доп. числа ---
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  numberCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  numberCardAccent: {
    // Для 2-го рабочего числа (Число Судьбы)
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fateValue: {
    fontSize: 30,
    color: '#E0B873',
  },
});
