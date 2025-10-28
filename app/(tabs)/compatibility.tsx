// app/(tabs)/compatibility.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';

export default function CompatibilityScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Image
          source={LOGO_IMAGE}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
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
  background: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    maxWidth: 600,
    maxHeight: 600,
    opacity: 1,
  },
});
