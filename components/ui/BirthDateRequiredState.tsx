// components/ui/BirthDateRequiredState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAppTranslation } from '@/contexts/LanguageContext';
import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { GoldButton } from '@/components/ui/GoldButton';
import { CardGlow } from '@/components/ui/CardGlow';

export const BirthDateRequiredState = () => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <CardGlow intensity={0.06} />
        <View style={styles.medallion}>
          <Ionicons name="calendar-outline" size={28} color={COLORS.textTertiary} />
        </View>

        <Text style={styles.title} numberOfLines={2}>{t('birthDateRequired.title')}</Text>
        <Text style={styles.description} numberOfLines={3}>{t('birthDateRequired.description')}</Text>

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
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    padding: SPACING.lg,
  },
  // Neutral: the button is the one gold element
  medallion: {
    width: LAYOUT.emblemHero,
    height: LAYOUT.emblemHero,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: { ...TYPE.headlineLg, fontFamily: FONT_FAMILY.serif.semibold, textAlign: 'center', marginBottom: SPACING.sm },
  description: { ...TYPE.bodyMd, textAlign: 'center', marginBottom: SPACING.lg },
  button: { alignSelf: 'stretch' },
});
