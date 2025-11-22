// app/(tabs)/numbers.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, LAYOUT } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';
import MatrixOfDestiny from '@/components/Matrix/MatrixOfDestiny'

export default function NumbersScreen() {
  return (
    <View style={styles.container}>
      {/*<Text style={styles.title}>{t('numbersScreenTitle')}</Text>*/}
      {/*<Text style={styles.subtitle}>*/}
      {/*  {t('numbersDescription')}*/}
      {/*</Text>*/}
      <MatrixOfDestiny
        day={2}
        month={7}
        year={1985}
        name="Александр"
      />
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
});
