// app/(tabs)/compatibility.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { COLORS } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';

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
      <Text style={styles.title}>{t('compatibilityComingSoon')}</Text>
      <Text style={styles.subtitle}>
        {t('compatibilityDescription')}
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
