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
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTranslation, useLanguage } from '@/contexts/LanguageContext';
import { COLORS, LAYOUT, SPACING, RADIUS, TYPE } from '@/lib/constants/theme';
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

  const select = (code: LanguageCode) => {
    if (code === selected) return;
    Haptics.selectionAsync();
    setSelected(code);
  };

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
            <MaterialIcons name="translate" size={20} color={COLORS.textTertiary} />
          </View>
          <Text style={styles.eyebrow}>{t('language.eyebrow')}</Text>
          <Text style={styles.description} numberOfLines={3}>{t('language.description')}</Text>
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
                onPress={() => select(item.code)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
              >
                <View style={styles.monogram}>
                  <Text style={styles.monogramText}>
                    {item.code.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.languageName} numberOfLines={1}>
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
        <Text style={styles.hint} numberOfLines={2}>{t('language.hint')}</Text>
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
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  // Caption at 12pt, neutral: gold marks only the selection and the save button
  eyebrow: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  description: {
    ...TYPE.bodyMd,
    textAlign: 'center',
  },

  // --- LANGUAGES ---
  list: {
    gap: SPACING.gutterSm,
    marginBottom: SPACING.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gutterSm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.transparent,
  },
  cardActive: {
    backgroundColor: COLORS.surfaceSelected,
    borderColor: COLORS.borderAccent,
  },
  monogram: {
    width: LAYOUT.minTouch,
    height: LAYOUT.minTouch,
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
    ...TYPE.bodyMd,
    marginTop: SPACING.xs,
  },
  // Unselected ring uses text4 so the control stays visible on the card (>= 3:1)
  radio: {
    width: SPACING.lg,
    height: SPACING.lg,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.accent,
  },
  radioInner: {
    width: SPACING.gutterSm,
    height: SPACING.gutterSm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },

  saveButton: {
    marginBottom: SPACING.md,
  },
  hint: {
    ...TYPE.bodyMd,
    textAlign: 'center',
  },
});
