import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { DateInputForm } from '@/components/DateInputForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { calculatePythagoreanSquare } from '@/lib/calculators/pythagoreanSquare';
import { CalculationResult } from '@/lib/types';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';

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
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1A1C33', '#0D0F21']} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>
      <View style={styles.content}>
        {!results ? (
          <DateInputForm
            date={dateString}
            setDate={setDateString}
            onSubmit={handleCalculate}
            error={error}
          />
        ) : (
          <ResultsDisplay results={results} date={dateString} onBack={handleBack} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Match the gradient background
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 80,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  logo: {
    width: '150%', // Adjusted for better fit
    maxWidth: 700,
    maxHeight: 700,
    opacity: 0.4,
  },
});
