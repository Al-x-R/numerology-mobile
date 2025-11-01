// components/ui/DateInputForm.tsx
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
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputOpacity = useRef(new Animated.Value(0)).current;
  const inputY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonY = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

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

  const errorOpacity = useRef(new Animated.Value(0)).current;
  const errorY = useRef(new Animated.Value(-10)).current;

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

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{t('subtitle')}</Text>

      <Animated.View style={[styles.inputContainer, { opacity: inputOpacity, transform: [{ translateY: inputY }] }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused, localError && styles.inputError]}
            placeholder={t('inputPlaceholder')}
            placeholderTextColor={COLORS.textSecondary}
            value={date}
            onChangeText={handleTextChange}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        {localError && (
          <Animated.Text
            style={[
              styles.errorText,
              {
                opacity: errorOpacity,
                transform: [{ translateY: errorY }],
              },
            ]}
          >
            {localError}
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
                <Text style={styles.loadingText}>{t('loadingText')}</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>{t('buttonText')}</Text>
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
    paddingVertical: LAYOUT.containerPadding,
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
