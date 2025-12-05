// components/ui/AuthRequiredState.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { COLORS, GRADIENTS, FONTS, RADIUS, SPACING } from '@/lib/constants/theme';

export const AuthRequiredState = () => {
  const { user } = useProfile();
  const { t, language } = useAppTranslation();

  const isLoggedIn = !!user;
  const hasBirthDate = !!user?.birthDate;

  // Если залогинен и есть дата — ничего не показываем
  if (isLoggedIn && hasBirthDate) return null;

  const title = !isLoggedIn
    ? (language === 'ru' ? 'Требуется вход' : 'Login Required')
    : (language === 'ru' ? 'Дата рождения не указана' : 'Birth Date Missing');

  const description = !isLoggedIn
    ? (language === 'ru'
      ? 'Войдите в аккаунт, чтобы получить персональный прогноз.'
      : 'Log in to get your personal forecast.')
    : (language === 'ru'
      ? 'Укажите дату рождения в профиле для точных расчетов.'
      : 'Set your birth date in profile for accurate calculations.');

  const buttonText = !isLoggedIn
    ? (language === 'ru' ? 'Войти в аккаунт' : 'Log In')
    : (language === 'ru' ? 'Указать дату рождения' : 'Set Birth Date');

  const onPress = () => {
    router.push(!isLoggedIn ? '/(auth)/login' : '/profile');
  };

  const iconName = !isLoggedIn ? 'lock-outline' : 'calendar-alert';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialCommunityIcons name={iconName} size={64} color={COLORS.accent} />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <LinearGradient
            colors={GRADIENTS.goldenButton || ['#C4A484', '#A67C52']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    ...FONTS.sectionTitle,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  description: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS.button,
    color: '#000',
    fontWeight: '600',
  },
});
