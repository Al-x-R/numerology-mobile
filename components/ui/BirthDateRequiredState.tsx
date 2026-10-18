// components/ui/BirthDateRequiredState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAppTranslation } from '@/contexts/LanguageContext';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
import { GoldButton } from '@/components/ui/GoldButton';

export const BirthDateRequiredState = () => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.medallion}>
          <Ionicons name="calendar-outline" size={28} color={COLORS.accent} />
        </View>

        <Text style={styles.title}>{t('birthDateRequired.title')}</Text>
        <Text style={styles.description}>{t('birthDateRequired.description')}</Text>

        <GoldButton
          title={t('birthDateRequired.button')}
          onPress={() => router.push('/profile/edit')}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.margin,
  },
  card: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: SPACING.lg,
  },
  medallion: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.goldenButtonSoft,
  },
  title: { ...TYPE.headlineLg, textAlign: 'center', marginBottom: SPACING.sm },
  description: { ...TYPE.bodyMd, textAlign: 'center', marginBottom: SPACING.lg },
  button: { alignSelf: 'stretch' },
});
