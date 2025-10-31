// app/(tabs)/numbers.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/lib/constants/theme';

export default function NumbersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Числа Судьбы</Text>
      <Text style={styles.subtitle}>
        Здесь будет расчет номера телефона и номера автомобиля. (PRO-функция)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F21',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
