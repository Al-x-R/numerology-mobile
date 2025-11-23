// app/(tabs)/numbers.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Компоненты
import { ForecastDisplay } from '@/components/ForecastDisplay';
import { ProfileButton } from '@/components/ui/ProfileButton';

// Логика
import {
  calculatePersonalYear,
  calculatePersonalMonth,
  calculatePersonalDay
} from '@/lib/calculators/numerologyForecast';

// Контекст профиля (предполагаем, что он у нас есть и хранит дату)
import { useProfile } from '@/contexts/ProfileContext';

// Константы
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { t } from '@/lib/constants/locales';
import { COLORS, FONTS, GRADIENTS, SPACING, LAYOUT, RADIUS, SHADOWS } from '@/lib/constants/theme';

interface ForecastResult {
  personalYear: number;
  personalMonth: number;
  personalDay: number;
}

export default function NumbersScreen() {
  const [results, setResults] = useState<ForecastResult | null>(null);
  const navigation = useNavigation();

  // Достаем данные пользователя из контекста
  // Предполагаем, что user содержит поле birthDate (или date)
  const { user, isLoading: isProfileLoading } = useProfile();

  // Функция расчета (вынесена, чтобы вызывать при фокусе)
  const performCalculation = useCallback(() => {
    // 1. Если пользователя нет или нет даты — сбрасываем результат
    if (!user || !user.birthDate) {
      setResults(null);
      return;
    }

    // 2. Если дата есть — считаем автоматически
    try {
      const today = new Date();
      // user.birthDate должен быть строкой "DD.MM.YYYY" или Date объектом
      // Если у вас в базе YYYY-MM-DD, нужно будет конвертировать
      const pYear = calculatePersonalYear(user.birthDate, today);
      const pMonth = calculatePersonalMonth(user.birthDate, today);
      const pDay = calculatePersonalDay(user.birthDate, today);

      setResults({
        personalYear: pYear,
        personalMonth: pMonth,
        personalDay: pDay
      });
    } catch (e) {
      console.error("Error calculating forecast:", e);
    }
  }, [user]);

  // Используем useFocusEffect, чтобы пересчитывать, если юзер обновил профиль и вернулся сюда
  useFocusEffect(
    useCallback(() => {
      performCalculation();
    }, [performCalculation])
  );

  // Настройка хедера
  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('numbersTitle'),
      headerLeft: () => null,
      headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
      // Таббар показываем всегда, так как это главный экран раздела
      tabBarStyle: {
        display: 'flex',
        backgroundColor: COLORS.background,
        borderTopColor: COLORS.background
      },
    });
  }, [navigation]);

  // --- Рендер содержимого в зависимости от состояния ---
  const renderContent = () => {
    // 1. Если не авторизован (Гость)
    if (!user) {
      return (
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons name="lock-outline" size={64} color={COLORS.accent} />
          <Text style={styles.emptyStateTitle}>Доступно после входа</Text>
          <Text style={styles.emptyStateText}>
            Войдите в аккаунт, чтобы получить персональный нумерологический прогноз на каждый день.
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <LinearGradient colors={GRADIENTS.button} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>{t('auth.login')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }

    // 2. Если авторизован, но НЕТ ДАТЫ РОЖДЕНИЯ
    if (user && !user.birthDate) {
      return (
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons name="calendar-alert" size={64} color={COLORS.error} />
          <Text style={styles.emptyStateTitle}>Дата не указана</Text>
          <Text style={styles.emptyStateText}>
            Чтобы рассчитать ваши Личные Числа, нам нужно знать дату вашего рождения.
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/profile')} // Ведем в профиль для редактирования
          >
            <LinearGradient colors={GRADIENTS.button} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Указать дату</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }

    // 3. Если все ок — показываем прогноз
    if (results && user.birthDate) {
      return (
        <ForecastDisplay
          result={results}
          date={user.birthDate}
        />
      );
    }

    return null; // Загрузка или ошибка
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.transparent,
  },
  content: {
    flex: 1,
    paddingHorizontal: LAYOUT.contentPadding,
    alignItems: 'center',
    justifyContent: 'center', // Центруем контент (важно для пустых состояний)
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  logo: {
    width: '150%',
    maxWidth: LAYOUT.logoLarge,
    maxHeight: LAYOUT.logoLarge,
    opacity: 0.1, // Чуть прозрачнее, чтобы не мешал тексту
    position: 'absolute',
    top: 50,
  },
  // Стили для Empty State
  emptyStateContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: 'rgba(0,0,0,0.5)', // Полупрозрачная подложка
    borderRadius: RADIUS.xl,
    width: '100%',
  },
  emptyStateTitle: {
    ...FONTS.sectionTitle,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  actionButton: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.button,
  },
  buttonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...FONTS.button,
    color: COLORS.text,
  },
});
