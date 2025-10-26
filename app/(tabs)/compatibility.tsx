// app/(tabs)/compatibility.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CompatibilityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Скоро: Совместимость</Text>
      <Text style={styles.subtitle}>
        Проверка нумерологической совместимости с партнером.
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
    color: '#E0B873',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
  },
});
