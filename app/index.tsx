// app/index.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Platform, // Для определения платформы (iOS/Android)
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Импортируем наши "мозги"
import { calculatePythagoreanSquare } from '@/lib/calculators/pythagoreanSquare';
import { CalculationResult } from '@/lib/types';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';

interface DateInputFormProps {
  onSubmit: () => void;
  date: string;
  setDate: (date: string) => void;
  error: string;
}

// Типы для экрана результатов
interface ResultsDisplayProps {
  results: CalculationResult; // Мы используем тип из /lib
  onBack: () => void;
  date: string;
}



// --- (Пока просто заглушки, мы их позже заменим на красивые) ---
// Вместо DateInputForm.tsx
const DateInputForm = ({ onSubmit, date, setDate, error }: DateInputFormProps) => (
  <View style={styles.formContainer}>
    <Text style={styles.title}>Код Даты</Text>
    <Text style={styles.subtitle}>Рассчитайте свой Квадрат Пифагора</Text>
    <TextInput
      style={styles.input}
      placeholder="YYYY-MM-DD"
      placeholderTextColor="#A0A0A0"
      value={date}
      onChangeText={setDate}
      keyboardType="numeric"
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
    <Button title="Рассчитать" onPress={onSubmit} color="#7A5FFF" />
  </View>
);

// Вместо ResultsDisplay.tsx
const ResultsDisplay = ({ results, onBack, date }: ResultsDisplayProps) => (
  <ScrollView>
    <Text style={styles.title}>Мой Анализ</Text>
    <Text style={styles.subtitle}>{date}</Text>
    <Button title="Назад" onPress={onBack} color="#7A5FFF" />

    <Text style={styles.sectionTitle}>Психоматрица</Text>
    <View style={styles.grid}>
      {Object.entries(results.matrix).map(([id, value]) => (
        <View key={id} style={styles.cell}>
          <Text style={styles.cellValue}>{value || '—'}</Text>
          <Text style={styles.cellLabel}>{getInterpretation(id, value).title.split(' (')[0]}</Text>
        </View>
      ))}
    </View>

    <Text style={styles.sectionTitle}>Дополнительные числа</Text>
    <View style={styles.infoCard}>
      <Text style={styles.infoText}>1-е раб. число: {results.workingNumbers[0]}</Text>
      <Text style={styles.infoText}>2-е раб. число: {results.workingNumbers[1]}</Text>
      <Text style={styles.infoText}>3-е раб. число: {results.workingNumbers[2]}</Text>
      <Text style={styles.infoText}>4-е раб. число: {results.workingNumbers[3]}</Text>
    </View>
  </ScrollView>
);
// --- (Конец заглушек) ---

export default function HomeScreen() {
  // Логика управления состоянием (та же, что и в Next.js)
  const [dateString, setDateString] = useState<string>('');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    // Простая валидация даты (позже улучшим)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      setError('Введите дату в формате YYYY-MM-DD');
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

// --- СТИЛИ ---
// Это замена Tailwind и CSS.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0F21',
  },
  container: {
    flex: 1,
    padding: 20, // Отступы по бокам
    justifyContent: 'center', // Центрируем форму ввода
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12, // React Native не использует 'py-3'
    borderRadius: 8,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    // На iOS нужен 'padding', на Android 'height'
    height: Platform.OS === 'android' ? 50 : undefined,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  // Стили для экрана результатов
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row', // Располагаем ячейки в ряд
    flexWrap: 'wrap',     // Позволяем переноситься на новую строку
    justifyContent: 'space-between', // Распределяем по ширине
  },
  cell: {
    width: '31%', // Чуть меньше 1/3 для отступов
    aspectRatio: 1, // Делает ячейку квадратной
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 4,
  },
  cellValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0B873', // Акцентный цвет
  },
  cellLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
});
