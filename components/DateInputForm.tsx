// components/DateInputForm.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, FONT_FAMILY, FONTS, GRADIENTS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
import { useProfile } from '@/contexts/ProfileContext';
import { isValidRussianDate } from '@/lib/utils/validateDate';
import { useAppTranslation } from '@/contexts/LanguageContext';

interface DateInputFormProps {
  onSubmit: () => void;
  date: string;
  setDate: (date: string) => void;
}

const formatRussianDate = (text: string): string => {
  let cleanedText = text.replace(/[^0-9]/g, '');
  if (cleanedText.length > 8) cleanedText = cleanedText.substring(0, 8);
  if (cleanedText.length > 2) cleanedText = cleanedText.substring(0, 2) + '.' + cleanedText.substring(2);
  if (cleanedText.length > 5) cleanedText = cleanedText.substring(0, 5) + '.' + cleanedText.substring(5);
  return cleanedText;
};

export function DateInputForm({
  onSubmit,
  date,
  setDate,
}: DateInputFormProps) {
  const { t } = useAppTranslation();
  const { activeProfile } = useProfile();

  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [inputOpacity] = useState(() => new Animated.Value(0));
  const [inputY] = useState(() => new Animated.Value(30));
  const [buttonOpacity] = useState(() => new Animated.Value(0));
  const [buttonY] = useState(() => new Animated.Value(20));
  const [buttonScale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.spring(inputY, { toValue: 0, friction: 8, tension: 100, useNativeDriver: true }),
        Animated.timing(inputOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(buttonY, { toValue: 0, friction: 8, tension: 100, useNativeDriver: true }),
        Animated.timing(buttonOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleTextChange = (text: string) => {
    const formattedText = formatRussianDate(text);
    setLocalError('');
    setDate(formattedText);
  };

  const handlePressIn = () => {
    if (isLoading) return;
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    if (isLoading) return;
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleSubmit = () => {
    if (isLoading) return;
    setLocalError(null);

    if (!date) {
      setLocalError(t('errorEmpty'));
      return;
    }
    if (date.length !== 10) {
      setLocalError(t('errorFormat'));
      return;
    }
    if (!isValidRussianDate(date)) {
      setLocalError(t('errorInvalid'));
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSubmit();
    }, 2000);
  };

  const [errorOpacity] = useState(() => new Animated.Value(0));
  const [errorY] = useState(() => new Animated.Value(-10));

  useEffect(() => {
    if (localError) {
      Animated.parallel([
        Animated.timing(errorOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(errorY, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      errorOpacity.setValue(0);
      errorY.setValue(-10);
    }
  }, [errorOpacity, errorY, localError]);

  const isValid = isValidRussianDate(date);
  const profileDate = activeProfile?.date ? activeProfile.date.split('-').reverse().join('.') : '';

  const learnItems = [
    { icon: 'person-outline' as const, title: t('matrixForm.item1Title'), text: t('matrixForm.item1Text'), tag: t('matrixForm.item1Tag') },
    { icon: 'flash-outline' as const, title: t('matrixForm.item2Title'), text: t('matrixForm.item2Text'), tag: t('matrixForm.item2Tag') },
    { icon: 'infinite-outline' as const, title: t('matrixForm.item3Title'), text: t('matrixForm.item3Text'), tag: t('matrixForm.item3Tag') },
  ];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* --- HERO --- */}
      <View style={styles.emblem}>
        <View style={styles.emblemInner}>
          <MaterialCommunityIcons name="hexagram-outline" size={30} color={COLORS.accent} />
        </View>
      </View>
      <Text style={styles.eyebrow}>{t('matrixForm.eyebrow')}</Text>
      <Text style={styles.title}>{t('subtitle')}</Text>
      <Text style={styles.description}>{t('matrixForm.description')}</Text>

      {!!profileDate && (
        <View style={styles.chips}>
          <TouchableOpacity
            style={[styles.chip, date === profileDate && styles.chipActive]}
            onPress={() => handleTextChange(profileDate)}
            activeOpacity={0.8}
          >
            <View style={styles.chipDot} />
            <Text style={styles.chipText}>{t('matrixForm.you')}: {profileDate}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- FORM CARD --- */}
      <Animated.View style={[styles.formCard, { opacity: inputOpacity, transform: [{ translateY: inputY }] }]}>
        <View style={styles.formHeader}>
          <Text style={styles.fieldLabel}>{t('profile.birthDate')}</Text>
          <View style={styles.formHeaderRight}>
            <Ionicons name="calendar-outline" size={13} color={COLORS.accent} />
            <Text style={styles.formHeaderText}>{t('matrixForm.calendar')}</Text>
          </View>
        </View>

        <View style={[styles.inputBox, isFocused && styles.inputFocused, !!localError && styles.inputError]}>
          <TextInput
            style={styles.input}
            placeholder={t('datePlaceholder')}
            placeholderTextColor={COLORS.placeholder}
            value={date}
            onChangeText={handleTextChange}
            keyboardType="number-pad"
            maxLength={10}
            cursorColor={COLORS.accent}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <View style={styles.inputIcon}>
            <Ionicons name="calendar-clear-outline" size={20} color={COLORS.accent} />
          </View>
        </View>

        <View style={styles.helperRow}>
          {localError ? (
            <Animated.Text style={[styles.errorText, { opacity: errorOpacity, transform: [{ translateY: errorY }] }]}>
              {localError}
            </Animated.Text>
          ) : (
            <Text style={styles.helperText}>{t('matrixForm.formatHint')}</Text>
          )}
          {isValid && !localError && (
            <View style={styles.validBadge}>
              <MaterialCommunityIcons name="check-decagram-outline" size={14} color={COLORS.accent} />
              <Text style={styles.validText}>{t('matrixForm.valid')}</Text>
            </View>
          )}
        </View>

        <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity, transform: [{ translateY: buttonY }, { scale: buttonScale }] }]}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleSubmit}
            style={styles.button}
            disabled={isLoading}
          >
            <LinearGradient colors={GRADIENTS.goldenButton} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.buttonGradient}>
              {isLoading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color={COLORS.blackText} />
                  <Text style={styles.buttonText}>{t('loadingText')}</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>{t('matrixForm.button')}</Text>
                  <Ionicons name="arrow-forward" size={18} color={COLORS.blackText} />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* --- WHAT YOU LEARN --- */}
      <View style={styles.learnCard}>
        <View style={styles.learnHeader}>
          <Text style={styles.learnTitle}>{t('matrixForm.learnTitle')}</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{t('matrixForm.learnCount')}</Text>
          </View>
        </View>
        {learnItems.map((item) => (
          <View key={item.title} style={styles.learnRow}>
            <View style={styles.learnIcon}>
              <Ionicons name={item.icon} size={18} color={COLORS.accent} />
            </View>
            <View style={styles.learnText}>
              <Text style={styles.learnRowTitle}>{item.title}</Text>
              <Text style={styles.learnRowText}>{item.text}</Text>
            </View>
            <Text style={styles.learnTag}>{item.tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Ionicons name="lock-closed-outline" size={14} color={COLORS.accent} />
        <Text style={styles.footerText}>{t('matrixForm.footer')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { width: '100%' },
  container: {
    alignItems: 'center',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  // --- HERO ---
  emblem: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emblemInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyebrow: { ...TYPE.labelMd, color: COLORS.accent, letterSpacing: 2.4, marginBottom: SPACING.md },
  title: { ...TYPE.displayLg, textAlign: 'center' },
  description: { ...TYPE.bodyMd, textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, alignSelf: 'stretch', marginBottom: SPACING.lg },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.transparent,
  },
  chipActive: { borderColor: COLORS.borderAccent },
  chipDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.accent },
  chipText: { ...TYPE.bodySm, color: COLORS.text },

  // --- FORM CARD ---
  formCard: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 4,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.gutterSm },
  fieldLabel: { ...TYPE.labelMd, color: COLORS.textTertiary },
  formHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  formHeaderText: { ...TYPE.bodySm, color: COLORS.accent },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.transparent,
    paddingLeft: SPACING.md + 4,
    paddingRight: SPACING.sm,
  },
  inputFocused: { borderColor: COLORS.accent },
  inputError: { borderColor: COLORS.error },
  input: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.sans.medium, letterSpacing: 4, flex: 1, height: '100%' },
  inputIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm, minHeight: 18 },
  helperText: { ...TYPE.bodySm, flex: 1 },
  errorText: { ...TYPE.bodySm, color: COLORS.error, flex: 1 },
  validBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  validText: { ...TYPE.bodySm, color: COLORS.accent },
  buttonContainer: { marginTop: SPACING.lg, borderRadius: RADIUS.lg, ...SHADOWS.button },
  button: { borderRadius: RADIUS.lg, overflow: 'hidden' },
  buttonGradient: { height: LAYOUT.buttonHeight, justifyContent: 'center', alignItems: 'center' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  buttonText: FONTS.button,

  // --- WHAT YOU LEARN ---
  learnCard: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 4,
    gap: SPACING.gutterSm,
  },
  learnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  learnTitle: { ...TYPE.labelMd, color: COLORS.textTertiary, flex: 1 },
  countPill: { paddingVertical: 3, paddingHorizontal: SPACING.sm + 2, borderRadius: RADIUS.full, backgroundColor: COLORS.accentSoft },
  countText: { ...TYPE.bodySm, color: COLORS.accent },
  learnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gutterSm,
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  learnIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnText: { flex: 1 },
  learnRowTitle: { ...TYPE.titleMd },
  learnRowText: { ...TYPE.bodySm, marginTop: 2 },
  learnTag: { ...TYPE.labelSm, fontFamily: FONT_FAMILY.sans.bold, color: COLORS.accent },

  footer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.lg },
  footerText: { ...TYPE.bodySm },
});
