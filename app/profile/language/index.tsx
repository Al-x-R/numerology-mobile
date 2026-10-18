// app/profile/language/index.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTranslation, useLanguage } from '@/contexts/LanguageContext';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPE } from '@/lib/constants/theme';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { GoldButton } from '@/components/ui/GoldButton';

type LanguageCode = 'en' | 'ru' | 'uk';

const LANGUAGES: { code: LanguageCode; native: string; english: string }[] = [
  { code: 'en', native: 'English', english: 'English • International' },
  { code: 'ru', native: 'Русский', english: 'Russian' },
  { code: 'uk', native: 'Українська', english: 'Ukrainian' },
];

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useLanguage();
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<LanguageCode>(language);

  const handleSave = async () => {
    if (selected !== language) {
      await setLanguage(selected);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <AuraBackground />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* --- INTRO --- */}
        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <MaterialIcons name="translate" size={20} color={COLORS.accent} />
          </View>
          <Text style={styles.eyebrow}>{t('language.eyebrow')}</Text>
          <Text style={styles.description}>{t('language.description')}</Text>
        </View>

        {/* --- INFO --- */}
        <View style={styles.infoCard}>
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>{t('language.infoLabel')}</Text>
            <Text style={styles.infoTitle}>{t('language.infoTitle')}</Text>
            <Text style={styles.infoBody}>{t('language.infoText')}</Text>
          </View>
          <Ionicons name="sparkles-outline" size={20} color={COLORS.textMuted} />
        </View>

        {/* --- LANGUAGES --- */}
        <View style={styles.list} accessibilityRole="radiogroup">
          {LANGUAGES.map((item) => {
            const isSelected = selected === item.code;
            const isCurrent = language === item.code;

            return (
              <TouchableOpacity
                key={item.code}
                style={[styles.card, isSelected && styles.cardActive]}
                onPress={() => setSelected(item.code)}
                activeOpacity={0.85}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
              >
                <View style={styles.monogram}>
                  <Text style={[styles.monogramText, isSelected && styles.accentText]}>
                    {item.code.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={[styles.languageName, isSelected && styles.accentText]} numberOfLines={1}>
                    {item.native}
                  </Text>
                  <Text style={styles.languageSubtitle} numberOfLines={1}>
                    {isCurrent ? `${item.english} • ${t('language.current')}` : item.english}
                  </Text>
                </View>

                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <GoldButton
          title={t('language.save')}
          onPress={handleSave}
          icon={<Ionicons name="checkmark" size={18} color={COLORS.blackText} />}
          style={styles.saveButton}
        />
        <Text style={styles.hint}>{t('language.hint')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.margin,
    paddingTop: SPACING.md,
  },

  // --- INTRO ---
  intro: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  introIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  eyebrow: {
    ...TYPE.labelMd,
    color: COLORS.accent,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  description: {
    ...TYPE.bodyMd,
    textAlign: 'center',
    maxWidth: 300,
  },

  // --- INFO ---
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  infoText: { flex: 1 },
  infoLabel: { ...TYPE.labelSm, color: COLORS.accent, marginBottom: 2 },
  infoTitle: { ...TYPE.titleMd },
  infoBody: { ...TYPE.bodySm, marginTop: 2 },

  // --- LANGUAGES ---
  list: {
    gap: SPACING.gutterSm + 2,
    marginBottom: SPACING.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 74,
    gap: SPACING.gutterSm + 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.gutterSm + 2,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.transparent,
  },
  cardActive: {
    backgroundColor: COLORS.surfaceSelected,
    borderColor: COLORS.borderAccent,
    ...SHADOWS.goldenButtonSoft,
  },
  monogram: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monogramText: {
    ...TYPE.labelLg,
    color: COLORS.textSecondary,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    ...TYPE.titleLg,
  },
  languageSubtitle: {
    ...TYPE.bodySm,
    marginTop: 2,
  },
  accentText: {
    color: COLORS.accent,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    ...SHADOWS.goldenButtonSoft,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },

  saveButton: {
    marginBottom: SPACING.md,
  },
  hint: {
    ...TYPE.bodySm,
    textAlign: 'center',
  },
});
