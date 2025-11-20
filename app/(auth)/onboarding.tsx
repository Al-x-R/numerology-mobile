// app/(auth)/onboarding.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useProfile } from '@/contexts/ProfileContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS, SPACING } from '@/lib/constants/theme';

export default function Onboarding() {
  const { isLoading, activeProfile, completeOnboarding } = useProfile();
  const router = useRouter();
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);

  // Показываем красивый лоадер минимум 1.8 секунды
  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingTimePassed(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Автопереход в приложение, если онбординг уже пройден
  useEffect(() => {
    if (!isLoading && minLoadingTimePassed && activeProfile) {
      router.replace('/(tabs)/pythagoras');
    }
  }, [isLoading, minLoadingTimePassed, activeProfile, router]);

  // Пока ждём — красивый лоадер
  const showLoader = isLoading || !minLoadingTimePassed;

  if (showLoader) {
    return (
      <LinearGradient colors={['#1a1a1a', '#0d0d0d', '#000']} style={styles.container}>
        <View style={styles.loaderContent}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Раскрываем тайны судьбы...</Text>
          <Text style={styles.subLoadingText}>Подождите немного</Text>
        </View>
      </LinearGradient>
    );
  }

  // Если уже есть activeProfile — значит онбординг пройден → useEffect выше уже уведёт
  if (activeProfile) {
    return null;
  }

  // Первый запуск — показываем онбординг
  const handleContinueAsGuest = async () => {
    await completeOnboarding();
    router.replace('/(tabs)/pythagoras');
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#000']} style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="sparkles" size={80} color={COLORS.accent} />
        <Text style={styles.title}>Код Даты</Text>
        <Text style={styles.subtitle}>
          Узнайте свою матрицу судьбы{'\n'}и раскройте потенциал
        </Text>

        <View style={styles.buttons}>
          {/* Главная кнопка — продолжить как гость */}
          <TouchableOpacity onPress={handleContinueAsGuest} activeOpacity={0.8}>
            <LinearGradient
              colors={GRADIENTS.background}
              style={styles.mainButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.mainButtonText}>Продолжить как гость</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Вход в аккаунт */}
          <Text
            style={styles.loginText}
            onPress={() => router.push('/(auth)/login')}
          >
            У меня уже есть аккаунт
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Нажимая «Продолжить», вы соглашаетесь{'\n'}с условиями использования
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.title,
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: SPACING.xl,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body,
    fontSize: 18,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: SPACING.lg,
    lineHeight: 26,
  },
  buttons: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  mainButton: {
    paddingVertical: SPACING.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  mainButtonText: {
    ...FONTS.title,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loginText: {
    ...FONTS.body,
    color: COLORS.accent,
    textAlign: 'center',
    marginTop: SPACING.xl,
    fontSize: 16,
  },
  loaderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.lg,
    ...FONTS.body,
  },
  subLoadingText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    color: '#666666',
  },
  footer: {
    ...FONTS.body,
    color: '#666666',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },
});
