// components/ui/BirthDateRequiredState.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { useAppTranslation } from '@/contexts/LanguageContext';
import { COLORS, GRADIENTS, FONTS, RADIUS, SPACING } from '@/lib/constants/theme';

export const BirthDateRequiredState = () => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialCommunityIcons name="calendar-alert" size={64} color={COLORS.accent} />

        <Text style={styles.title}>{t('birthDateRequired.title')}</Text>
        <Text style={styles.description}>{t('birthDateRequired.description')}</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/profile/edit')}>
          <LinearGradient
            colors={GRADIENTS.goldenButton}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{t('birthDateRequired.button')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
// backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  title: {
    ...FONTS.sectionTitle,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  description: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS.button,
    color: COLORS.blackText,
    fontWeight: '600',
  },
});
