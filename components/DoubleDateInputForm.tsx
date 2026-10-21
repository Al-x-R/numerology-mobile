// components/DoubleDateInputForm.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { COLORS, FONT_FAMILY, FONTS, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { useProfile } from '@/contexts/ProfileContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { isValidRussianDate } from '@/lib/utils/validateDate';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { GoldButton } from '@/components/ui/GoldButton';
import { CardGlow } from '@/components/ui/CardGlow';

interface DoubleDateInputFormProps {
  onSubmit: () => void;
  date1: string;
  date2: string;
  setDate1: (date: string) => void;
  setDate2: (date: string) => void;
}

const formatRussianDate = (text: string): string => {
  let cleanedText = text.replace(/[^0-9]/g, '');
  if (cleanedText.length > 8) cleanedText = cleanedText.substring(0, 8);
  if (cleanedText.length > 2) cleanedText = cleanedText.substring(0, 2) + '.' + cleanedText.substring(2);
  if (cleanedText.length > 5) cleanedText = cleanedText.substring(0, 5) + '.' + cleanedText.substring(5);
  return cleanedText;
};

export function DoubleDateInputForm({
  onSubmit,
  date1,
  date2,
  setDate1,
  setDate2,
}: DoubleDateInputFormProps) {
  const { t } = useAppTranslation();
  const { activeProfile } = useProfile();
  const profileDate = activeProfile?.date ? activeProfile.date.split('-').reverse().join('.') : '';

  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [localError1, setLocalError1] = useState<string | null>(null);
  const [localError2, setLocalError2] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reanimated entering animations respect the system Reduce Motion setting

  const handleTextChange1 = (text: string) => {
    const formattedText = formatRussianDate(text);
    setLocalError1('');
    setDate1(formattedText);
  };

  const handleTextChange2 = (text: string) => {
    const formattedText = formatRussianDate(text);
    setLocalError2('');
    setDate2(formattedText);
  };

  const handleSubmit = () => {
    if (isLoading) return;
    setLocalError1(null);
    setLocalError2(null);

    let hasError = false;

    if (!date1) {
      setLocalError1(t('errorEmpty'));
      hasError = true;
    } else if (date1.length !== 10) {
      setLocalError1(t('errorFormat'));
      hasError = true;
    } else if (!isValidRussianDate(date1)) {
      setLocalError1(t('errorInvalid'));
      hasError = true;
    }

    if (!date2) {
      setLocalError2(t('errorEmpty'));
      hasError = true;
    } else if (date2.length !== 10) {
      setLocalError2(t('errorFormat'));
      hasError = true;
    } else if (!isValidRussianDate(date2)) {
      setLocalError2(t('errorInvalid'));
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSubmit();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.chip}>
        <MaterialCommunityIcons name="star-four-points" size={12} color={COLORS.textSecondary} />
        <Text style={styles.chipText}>{t('compatibility.eyebrow')}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{t('compatibility.heroTitle')}</Text>
      <Text style={styles.subtitle} numberOfLines={3}>{t('compatibility.subtitle')}</Text>

      {/* Partner 1 */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.card}>
        <CardGlow />
        <View style={styles.cardHeader}>
          <View style={styles.medallion}>
            <Ionicons name="person-outline" size={18} color={COLORS.textTertiary} />
          </View>
          <Text style={styles.cardLabel}>{t('compatibility.youLabel')}</Text>
          {!!profileDate && date1 === profileDate && (
            <Text style={styles.cardHint}>{t('compatibility.fromProfile')}</Text>
          )}
        </View>
        <Text style={styles.fieldLabel}>{t('profile.birthDate')}</Text>
          <View style={[styles.inputBox, isFocused1 && styles.inputFocused, !!localError1 && styles.inputError]}>
          <TextInput
            style={styles.input}
            placeholder={t('datePlaceholder')}
            placeholderTextColor={COLORS.placeholder}
            value={date1}
            onChangeText={handleTextChange1}
            keyboardType="number-pad"
            maxLength={10}
            onFocus={() => setIsFocused1(true)}
            onBlur={() => setIsFocused1(false)}
            cursorColor={COLORS.accent}
          />
            {isValidRussianDate(date1) ? (
              <MaterialCommunityIcons name="check-decagram-outline" size={22} color={COLORS.textTertiary} />
            ) : (
              <Ionicons name="calendar-clear-outline" size={20} color={COLORS.textMuted} />
            )}
          </View>
          {localError1 && (
            <Animated.Text entering={FadeInUp.duration(300)} style={styles.errorText}>
              {localError1}
            </Animated.Text>
          )}
      </Animated.View>

      <View style={styles.connector}>
        <MaterialCommunityIcons name="infinity" size={20} color={COLORS.textTertiary} />
      </View>

      {/* Partner 2 */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.card}>
        <CardGlow />
        <View style={styles.cardHeader}>
          <View style={styles.medallion}>
            <Ionicons name="heart" size={18} color={COLORS.textTertiary} />
          </View>
          <Text style={styles.cardLabel}>{t('compatibility.partnerLabel')}</Text>
        </View>
        <Text style={styles.fieldLabel}>{t('profile.birthDate')}</Text>
          <View style={[styles.inputBox, isFocused2 && styles.inputFocused, !!localError2 && styles.inputError]}>
          <TextInput
            style={styles.input}
            placeholder={t('datePlaceholder')}
            placeholderTextColor={COLORS.placeholder}
            value={date2}
            onChangeText={handleTextChange2}
            keyboardType="number-pad"
            maxLength={10}
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused2(false)}
            cursorColor={COLORS.accent}
          />
            {isValidRussianDate(date2) ? (
              <MaterialCommunityIcons name="check-decagram-outline" size={22} color={COLORS.textTertiary} />
            ) : (
              <Ionicons name="calendar-clear-outline" size={20} color={COLORS.textMuted} />
            )}
          </View>
          {localError2 && (
            <Animated.Text entering={FadeInUp.duration(300)} style={styles.errorText}>
              {localError2}
            </Animated.Text>
          )}
      </Animated.View>

      <View style={styles.tags}>
        {[t('compatibility.chipMatrix'), t('compatibility.chipUnion'), t('compatibility.chipKarma')].map((label) => (
          <View key={label} style={styles.tag}>
            <View style={styles.tagDot} />
            <Text style={styles.tagText}>{label}</Text>
          </View>
        ))}
      </View>

      <Animated.View entering={FadeInDown.delay(400).duration(300)} style={styles.buttonContainer}>
        <GoldButton
          title={t('compatibility.buttonText')}
          onPress={handleSubmit}
          loading={isLoading}
          loadingTitle={t('compatibility.loadingText')}
          icon={<Ionicons name="sparkles-outline" size={18} color={COLORS.blackText} />}
        />
      </Animated.View>

      <View style={styles.footer}>
        <Ionicons name="lock-closed-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.footerText} numberOfLines={2}>{t('compatibility.footer')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: LAYOUT.formWidth,
    maxWidth: LAYOUT.formMaxWidth,
    alignItems: 'center',
  },
  // Neutral: gold on the form belongs to the Calculate button and the focused field
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    marginBottom: SPACING.md,
  },
  chipText: { ...TYPE.labelMd, fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight, color: COLORS.textTertiary },
  title: { ...TYPE.displayLg, fontFamily: FONT_FAMILY.serif.semibold, textAlign: 'center' },
  subtitle: { ...TYPE.bodyMd, textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  card: {
    overflow: 'hidden',
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  medallion: {
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: { ...TYPE.labelLg, flex: 1 },
  cardHint: { ...TYPE.bodySm },
  fieldLabel: { ...TYPE.bodySm, marginBottom: SPACING.sm },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.transparent,
    paddingHorizontal: SPACING.margin,
  },
  input: {
    ...TYPE.headlineMd,
    fontFamily: FONT_FAMILY.sans.semibold,
    fontVariant: ['tabular-nums'],
    letterSpacing: 3,
    flex: 1,
    height: '100%',
  },
  inputFocused: { borderColor: COLORS.accent },
  inputError: { borderColor: COLORS.error },
  errorText: { ...FONTS.error, marginTop: SPACING.sm },
  // Overlaps both cards by 12pt to link them visually
  connector: {
    width: LAYOUT.minTouch,
    height: LAYOUT.minTouch,
    borderRadius: RADIUS.full,
    marginVertical: -SPACING.gutterSm,
    zIndex: 1,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.lg },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.gutterSm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  tagDot: { width: SPACING.sm, height: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.textSecondary },
  tagText: { ...TYPE.bodySm, color: COLORS.textTertiary },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.md },
  footerText: { ...TYPE.bodySm, textAlign: 'center', flexShrink: 1 },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.lg,
  },
});
