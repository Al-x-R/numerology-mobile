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
    { code: 'en' as const, name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'ru' as const, name: 'Russian', native: 'Русский', flag: '🇷🇺' },
    { code: 'uk' as const, name: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
    { code: 'zh-TW' as const, name: 'Traditional Chinese', native: '繁體中文', flag: '🇹🇼' },
  ];

  const handleSelect = async (lang: 'ru' | 'en' | 'uk' | 'zh-TW') => {
    if (lang === language) return;
    await setLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={GRADIENTS.background}
        style={StyleSheet.absoluteFillObject}
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
                    colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}

                <View style={styles.row}>
                  <Text style={styles.flag}>{item.flag}</Text>

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
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  flag: {
    fontSize: 32,
    marginRight: SPACING.lg,
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
