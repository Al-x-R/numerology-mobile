// app/index.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Text, // Нужен только для ResultsDisplay
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Импортируем компоненты
import { DateInputForm } from '@/components/DateInputForm';
// import { ResultsDisplay } from '../components/ResultsDisplay'; // Пока не создан

// Импортируем наши "мозги"
import { calculatePythagoreanSquare } from '@/lib/calculators/pythagoreanSquare';
import { CalculationResult } from '@/lib/types';


// --- (Заглушка ResultsDisplay остается пока здесь) ---
const ResultsDisplay = ({ results, onBack, date }: any) => (
  <ScrollView>
    <Text style={styles.title}>Мой Анализ</Text>
    <Text style={styles.subtitle}>{date}</Text>
    {/* ... (остальной код заглушки) ... */}
  </ScrollView>
);


export default function HomeScreen() {
  const [dateString, setDateString] = useState<string>('');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      setError('Введите дату в формате ГГГГ-ММ-ДД.');
      return;
    }

    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) {
        setError('Некорректная дата.');
        return;
      }

      const calcResults = calculatePythagoreanSquare(dateObj);
      setResults(calcResults);
      setError('');
    } catch (e) {
      setError('Ошибка при расчете.');
      console.error(e);
    }
  };

  const handleBack = () => {
    setResults(null);
    setDateString('');
    setError('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!results ? (
          <DateInputForm
            date={dateString}
            setDate={setDateString}
            onSubmit={handleCalculate}
            error={error}
          />
        ) : (
          <ResultsDisplay
            results={results}
            date={dateString}
            onBack={handleBack}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// --- Оставляем только базовые стили, остальные ушли в DateInputForm.tsx ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0F21',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20, // Используем paddingHorizontal вместо padding, чтобы не мешать центру
    justifyContent: 'center', // Центрируем форму ввода
    alignItems: 'center',
  },
  // ... (оставшиеся стили ResultsDisplay, которые мы уберем позже)
  title: { /* ... */ },
  subtitle: { /* ... */ },
  // ...
});
