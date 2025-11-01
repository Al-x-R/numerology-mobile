// app/(tabs)/compatibility.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { COLORS, SPACING, FONT_SIZES, FONTS, LAYOUT } from '@/lib/constants/theme';
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
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: LAYOUT.contentPadding,
  },
  title: {
    fontSize: FONT_SIZES.screenTitle,
    fontWeight: '700' as const,
    color: COLORS.accent,
    marginBottom: SPACING.titleMarginBottom,
  },
  subtitle: {
    fontSize: FONT_SIZES.screenSubtitle,
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
    maxWidth: LAYOUT.logoMedium,
    maxHeight: LAYOUT.logoMedium,
    opacity: 1,
  },
});
