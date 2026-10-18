// app/profile/language/index.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAppTranslation, useLanguage } from '@/contexts/LanguageContext';
import { COLORS, FONTS, SPACING, RADIUS, GRADIENTS } from '@/lib/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function LanguageScreen() {
  const { language, setLanguage } = useLanguage();
  const { t } = useAppTranslation();

  const languages = [
    { code: 'en' as const, name: 'English', native: 'English' },
    { code: 'ru' as const, name: 'Russian', native: 'Русский' },
    { code: 'uk' as const, name: 'Ukrainian', native: 'Українська' },
  ];

  const handleSelect = async (lang: 'ru' | 'en' | 'uk') => {
    if (lang === language) return;
    await setLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={GRADIENTS.background}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.list}>
          {languages.map((item) => {
            const isSelected = language === item.code;

            return (
              <TouchableOpacity
                key={item.code}
                style={[styles.card, isSelected && styles.cardActive]}
                onPress={() => handleSelect(item.code)}
                activeOpacity={0.8}
              >
                {isSelected && (
                  <LinearGradient
                    colors={GRADIENTS.accentCard}
                    style={StyleSheet.absoluteFill}
                  />
                )}

                <View style={styles.row}>
                  <View style={[styles.monogram, isSelected && styles.monogramSelected]}>
                    <Text style={styles.monogramText}>{item.code.toUpperCase()}</Text>
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={[styles.languageName, isSelected && styles.textSelected]}>
                      {item.native}
                    </Text>
                    <Text style={styles.nativeName}>{item.name}</Text>
                  </View>

                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: 'transparent',
  },
  headerLeft: { width: 50 },
  headerRight: { width: 50 },
  headerTitle: {
    ...FONTS.headerTitle,
    fontSize: 20,
    textAlign: 'center',
  },
  content: {
    padding: SPACING.xl,
  },
  description: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  list: {
    gap: SPACING.md,
  },
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentSoft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  monogram: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  monogramSelected: {
    borderColor: COLORS.accent,
  },
  monogramText: {
    ...FONTS.cellLabel,
    fontSize: 11,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    ...FONTS.subtitle,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  textSelected: {
    color: COLORS.accent,
  },
  nativeName: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.accent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
  },
});
