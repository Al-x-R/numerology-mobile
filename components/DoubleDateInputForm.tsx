// components/DoubleDateInputForm.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { t } from '@/lib/constants/locales';
import {
  COLORS,
  FONTS,
  FORM_STYLES,
  GRADIENTS,
  LAYOUT,
  RADIUS,
  SHADOWS,
  SPACING
} from '@/lib/constants/theme';
import { isValidRussianDate } from '@/lib/utils/validateDate';
import { PremiumTeaserModal } from '@/components/PremiumTeaserModal';

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
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [localError1, setLocalError1] = useState<string | null>(null);
  const [localError2, setLocalError2] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const input1Opacity = useRef(new Animated.Value(0)).current;
  const input1Y = useRef(new Animated.Value(30)).current;
  const input2Opacity = useRef(new Animated.Value(0)).current;
  const input2Y = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonY = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

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

  const error1Opacity = useRef(new Animated.Value(0)).current;
  const error1Y = useRef(new Animated.Value(-10)).current;
  const error2Opacity = useRef(new Animated.Value(0)).current;
  const error2Y = useRef(new Animated.Value(-10)).current;

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
      <Text style={styles.subtitle}>{t('compatibilitySubtitle')}</Text>

      {/* Partner 1 */}
      <Animated.View style={[styles.inputContainer, { opacity: input1Opacity, transform: [{ translateY: input1Y }] }]}>
        <Text style={styles.label}>{t('partner1Label')}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isFocused1 && styles.inputFocused, localError1 && styles.inputError]}
            placeholder={t('partner1Placeholder')}
            placeholderTextColor={COLORS.textSecondary}
            value={date1}
            onChangeText={handleTextChange1}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            onFocus={() => setIsFocused1(true)}
            onBlur={() => setIsFocused1(false)}
          />
        </View>

        {localError1 && (
          <Animated.Text
            style={[
              styles.errorText,
              {
                opacity: error1Opacity,
                transform: [{ translateY: error1Y }],
              },
            ]}
          >
            {localError1}
          </Animated.Text>
        )}
      </Animated.View>

      {/* Partner 2 */}
      <Animated.View style={[styles.inputContainer, { opacity: input2Opacity, transform: [{ translateY: input2Y }] }]}>
        <Text style={styles.label}>{t('partner2Label')}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isFocused2 && styles.inputFocused, localError2 && styles.inputError]}
            placeholder={t('partner2Placeholder')}
            placeholderTextColor={COLORS.textSecondary}
            value={date2}
            onChangeText={handleTextChange2}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused2(false)}
          />
        </View>

        {localError2 && (
          <Animated.Text
            style={[
              styles.errorText,
              {
                opacity: error2Opacity,
                transform: [{ translateY: error2Y }],
              },
            ]}
          >
            {localError2}
          </Animated.Text>
        )}
      </Animated.View>

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
          <LinearGradient
            colors={isLoading ? GRADIENTS.buttonLoading : GRADIENTS.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {isLoading ? (
              <View style={styles.loadingContent}>
                <ActivityIndicator size="small" color={COLORS.text} />
                <Text style={styles.loadingText}>{t('compatibilityLoadingText')}</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>{t('compatibilityButtonText')}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: LAYOUT.formWidth,
    maxWidth: LAYOUT.formMaxWidth,
    alignItems: 'center',
    backgroundColor: COLORS.transparent,
  },
  title: {
    ...FONTS.title,
    color: COLORS.accent,
  },
  subtitle: {
    ...FORM_STYLES.subtitle,
    marginTop: SPACING.subtitleMargin,
    marginBottom: SPACING.subtitleMarginBottom,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative' as const,
    marginBottom: SPACING.lg,
  },
  label: {
    ...FONTS.button,
    fontSize: 16,
    color: COLORS.accent,
    marginBottom: SPACING.sm,
    alignSelf: 'flex-start',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 0,
  },
  input: {
    ...FONTS.input,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.card,
  },
  inputFocused: {
    borderColor: COLORS.borderFocused,
    borderWidth: 2,
    backgroundColor: COLORS.cardFocused,
    ...SHADOWS.inputFocused,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  errorText: {
    ...FONTS.error,
    position: 'absolute' as const,
    bottom: -24,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.formGap,
  },
  button: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden' as const,
    ...SHADOWS.button,
  },
  buttonGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...FONTS.button,
    textShadowColor: COLORS.textShadow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.loadingContentGap,
  },
  loadingText: {
    ...FONTS.loading,
  },
});


