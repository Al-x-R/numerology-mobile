// components/DoubleDateInputForm.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { COLORS, FONT_FAMILY, FONTS, GRADIENTS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
import { useProfile } from '@/contexts/ProfileContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { isValidRussianDate } from '@/lib/utils/validateDate';
import { useAppTranslation } from '@/contexts/LanguageContext';

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

  const [input1Opacity] = useState(() => new Animated.Value(0));
  const [input1Y] = useState(() => new Animated.Value(30));
  const [input2Opacity] = useState(() => new Animated.Value(0));
  const [input2Y] = useState(() => new Animated.Value(30));
  const [buttonOpacity] = useState(() => new Animated.Value(0));
  const [buttonY] = useState(() => new Animated.Value(20));
  const [buttonScale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.spring(input1Y, { toValue: 0, friction: 8, tension: 100, useNativeDriver: true }),
        Animated.timing(input1Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(input2Y, { toValue: 0, friction: 8, tension: 100, useNativeDriver: true }),
        Animated.timing(input2Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(buttonY, { toValue: 0, friction: 8, tension: 100, useNativeDriver: true }),
        Animated.timing(buttonOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

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

  const [error1Opacity] = useState(() => new Animated.Value(0));
  const [error1Y] = useState(() => new Animated.Value(-10));
  const [error2Opacity] = useState(() => new Animated.Value(0));
  const [error2Y] = useState(() => new Animated.Value(-10));

  useEffect(() => {
    if (localError1) {
      Animated.parallel([
        Animated.timing(error1Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(error1Y, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      error1Opacity.setValue(0);
      error1Y.setValue(-10);
    }
  }, [error1Opacity, error1Y, localError1]);

  useEffect(() => {
    if (localError2) {
      Animated.parallel([
        Animated.timing(error2Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(error2Y, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      error2Opacity.setValue(0);
      error2Y.setValue(-10);
    }
  }, [error2Opacity, error2Y, localError2]);

  return (
    <View style={styles.container}>
      <View style={styles.chip}>
        <MaterialCommunityIcons name="star-four-points" size={11} color={COLORS.accent} />
        <Text style={styles.chipText}>{t('compatibility.eyebrow')}</Text>
      </View>
      <Text style={styles.title}>{t('compatibility.heroTitle')}</Text>
      <Text style={styles.subtitle}>{t('compatibility.subtitle')}</Text>

      {/* Partner 1 */}
      <Animated.View style={[styles.card, { opacity: input1Opacity, transform: [{ translateY: input1Y }] }]}>
        <View style={styles.cardHeader}>
          <View style={styles.medallion}>
            <Ionicons name="person-outline" size={18} color={COLORS.accent} />
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
              <MaterialCommunityIcons name="check-decagram-outline" size={22} color={COLORS.accent} />
            ) : (
              <Ionicons name="calendar-clear-outline" size={20} color={COLORS.textMuted} />
            )}
          </View>
          {localError1 && (
            <Animated.Text style={[styles.errorText, { opacity: error1Opacity, transform: [{ translateY: error1Y }] }]}>
              {localError1}
            </Animated.Text>
          )}
      </Animated.View>

      <View style={styles.connector}>
        <MaterialCommunityIcons name="infinity" size={20} color={COLORS.accent} />
      </View>

      {/* Partner 2 */}
      <Animated.View style={[styles.card, { opacity: input2Opacity, transform: [{ translateY: input2Y }] }]}>
        <View style={styles.cardHeader}>
          <View style={styles.medallion}>
            <Ionicons name="heart" size={18} color={COLORS.accent} />
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
              <MaterialCommunityIcons name="check-decagram-outline" size={22} color={COLORS.accent} />
            ) : (
              <Ionicons name="calendar-clear-outline" size={20} color={COLORS.textMuted} />
            )}
          </View>
          {localError2 && (
            <Animated.Text style={[styles.errorText, { opacity: error2Opacity, transform: [{ translateY: error2Y }] }]}>
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

      <Animated.View
        style={[
          styles.buttonContainer,
          { opacity: buttonOpacity, transform: [{ translateY: buttonY }, { scale: buttonScale }] },
        ]}
      >
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
              <View style={styles.loadingContent}>
                <ActivityIndicator size="small" color={COLORS.blackText} />
                <Text style={styles.loadingText}>{t('compatibility.loadingText')}</Text>
              </View>
            ) : (
              <View style={styles.loadingContent}>
                <Ionicons name="sparkles-outline" size={18} color={COLORS.blackText} />
                <Text style={styles.buttonText}>{t('compatibility.buttonText')}</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.footer}>
        <Ionicons name="lock-closed-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.footerText}>{t('compatibility.footer')}</Text>
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
    marginBottom: SPACING.md,
  },
  chipText: { ...TYPE.labelMd, color: COLORS.accent },
  title: { ...TYPE.displayLg, textAlign: 'center' },
  subtitle: { ...TYPE.bodyMd, textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  medallion: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    paddingHorizontal: SPACING.md + 4,
  },
  input: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.sans.medium, letterSpacing: 3, flex: 1, height: '100%' },
  inputFocused: { borderColor: COLORS.accent },
  inputError: { borderColor: COLORS.error },
  errorText: { ...FONTS.error, marginTop: SPACING.sm },
  connector: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginVertical: -10,
    zIndex: 1,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.goldenButtonSoft,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.lg },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: SPACING.gutterSm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  tagDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.accent },
  tagText: { ...TYPE.bodySm, color: COLORS.textTertiary },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.md },
  footerText: { ...TYPE.bodySm, textAlign: 'center', flexShrink: 1 },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...SHADOWS.button,
  },
  button: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  buttonGradient: {
    height: LAYOUT.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: FONTS.button,
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  loadingText: { ...FONTS.button },
});
