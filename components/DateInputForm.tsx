// components/DateInputForm.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
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

  // Reanimated respects the system Reduce Motion setting; entering animations live on the views below
  const buttonScale = useSharedValue(1);
  const buttonPressStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));

  const handleTextChange = (text: string) => {
    const formattedText = formatRussianDate(text);
    setLocalError('');
    setDate(formattedText);
  };

  const handlePressIn = () => {
    if (isLoading) return;
    buttonScale.set(withSpring(0.97));
  };

  const handlePressOut = () => {
    if (isLoading) return;
    buttonScale.set(withSpring(1));
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
          <MaterialCommunityIcons name="hexagram-outline" size={28} color={COLORS.textTertiary} />
        </View>
      </View>
      <Text style={styles.eyebrow}>{t('matrixForm.eyebrow')}</Text>
      <Text style={styles.title} numberOfLines={2}>{t('subtitle')}</Text>
      <Text style={styles.description} numberOfLines={3}>{t('matrixForm.description')}</Text>

      {!!profileDate && (
        <View style={styles.chips}>
          <TouchableOpacity
            style={[styles.chip, date === profileDate && styles.chipActive]}
            onPress={() => handleTextChange(profileDate)}
            activeOpacity={0.7}
          >
            <View style={styles.chipDot} />
            <Text style={styles.chipText}>{t('matrixForm.you')}: {profileDate}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- FORM CARD --- */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.formCard}>
        <View style={styles.formHeader}>
          <Text style={styles.fieldLabel}>{t('profile.birthDate')}</Text>
          <View style={styles.formHeaderRight}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
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
            <Ionicons name="calendar-clear-outline" size={20} color={COLORS.textSecondary} />
          </View>
        </View>

        <View style={styles.helperRow}>
          {localError ? (
            <Animated.Text entering={FadeInUp.duration(300)} style={styles.errorText}>
              {localError}
            </Animated.Text>
          ) : (
            <Text style={styles.helperText}>{t('matrixForm.formatHint')}</Text>
          )}
          {isValid && !localError && (
            <View style={styles.validBadge}>
              <MaterialCommunityIcons name="check-decagram-outline" size={14} color={COLORS.textTertiary} />
              <Text style={styles.validText}>{t('matrixForm.valid')}</Text>
            </View>
          )}
        </View>

        <Animated.View entering={FadeInDown.delay(200).duration(300)} style={[styles.buttonContainer, buttonPressStyle]}>
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
              <Ionicons name={item.icon} size={18} color={COLORS.textTertiary} />
            </View>
            <View style={styles.learnText}>
              <Text style={styles.learnRowTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.learnRowText} numberOfLines={2}>{item.text}</Text>
            </View>
            <Text style={styles.learnTag}>{item.tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Ionicons name="lock-closed-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.footerText} numberOfLines={2}>{t('matrixForm.footer')}</Text>
      </View>
    </ScrollView>
  );
}

// Captions on this screen use the 12pt minimum
const caption = { ...TYPE.labelMd, fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight };

const styles = StyleSheet.create({
  scroll: { width: '100%' },
  container: {
    alignItems: 'center',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },

  // --- HERO ---
  // Neutral: on this screen gold belongs to the Calculate button and the focused field
  emblem: {
    width: LAYOUT.emblemHero,
    height: LAYOUT.emblemHero,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emblemInner: {
    width: LAYOUT.emblem,
    height: LAYOUT.emblem,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyebrow: { ...caption, letterSpacing: 2.4, marginBottom: SPACING.md },
  title: { ...TYPE.displayLg, fontFamily: FONT_FAMILY.serif.semibold, textAlign: 'center' },
  description: { ...TYPE.bodyMd, textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, alignSelf: 'stretch', marginBottom: SPACING.lg },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    minHeight: LAYOUT.minTouch,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.transparent,
  },
  chipActive: { borderColor: COLORS.borderAccent },
  chipDot: { width: SPACING.sm, height: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.textSecondary },
  chipText: { ...TYPE.bodyMd, color: COLORS.text, fontVariant: ['tabular-nums'] },

  // --- FORM CARD ---
  formCard: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.margin,
    marginBottom: SPACING.lg,
  },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.gutterSm },
  fieldLabel: { ...caption, color: COLORS.textTertiary },
  formHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  formHeaderText: TYPE.bodySm,
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.transparent,
    paddingLeft: SPACING.margin,
    paddingRight: SPACING.sm,
  },
  inputFocused: { borderColor: COLORS.accent },
  inputError: { borderColor: COLORS.error },
  input: {
    ...TYPE.headlineMd,
    fontFamily: FONT_FAMILY.sans.semibold,
    fontVariant: ['tabular-nums'],
    letterSpacing: 4,
    flex: 1,
    height: '100%',
  },
  inputIcon: {
    width: LAYOUT.minTouch,
    height: LAYOUT.minTouch,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // minHeight keeps the layout from jumping when the hint swaps for an error
  helperRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm, minHeight: SPACING.md },
  helperText: { ...TYPE.bodySm, flex: 1 },
  errorText: { ...TYPE.bodySm, color: COLORS.error, flex: 1 },
  validBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  validText: { ...TYPE.bodySm, color: COLORS.textTertiary },
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
    padding: SPACING.margin,
    gap: SPACING.gutterSm,
  },
  learnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  learnTitle: { ...caption, color: COLORS.textTertiary, flex: 1 },
  countPill: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.gutterSm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
  },
  countText: { ...TYPE.bodySm, color: COLORS.textTertiary },
  learnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gutterSm,
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  learnIcon: {
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnText: { flex: 1 },
  learnRowTitle: { ...TYPE.titleMd },
  learnRowText: { ...TYPE.bodyMd, marginTop: SPACING.xs },
  learnTag: caption,

  footer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.lg },
  footerText: { ...TYPE.bodySm, flexShrink: 1 },
});
