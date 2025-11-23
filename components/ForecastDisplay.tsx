// components/ForecastDisplay.tsx

import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { t } from '@/lib/constants/locales';
import { COLORS, FONTS, GRADIENTS, RADIUS, SHADOWS, SPACING, FONT_FAMILY } from '@/lib/constants/theme';

interface ForecastResult {
  personalYear: number;
  personalMonth: number;
  personalDay: number;
}

interface ForecastDisplayProps {
  result: ForecastResult;
  date: string; // Дата рождения пользователя
}

// Вспомогательный компонент карточки числа
const NumberCard = ({
  label,
  value,
  icon,
  description,
  index
}: {
  label: string;
  value: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  description: string;
  index: number;
}) => (
  <Animated.View
    entering={FadeInDown.delay(index * 150).duration(600).springify()}
    style={styles.card}
  >
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={COLORS.accent} />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>

    <View style={styles.contentRow}>
      <Text style={styles.cardValue}>{value}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.descriptionText}>
          {description}
        </Text>
        {/* Заглушка для будущего текста от ИИ */}
        <Text style={styles.readMoreText}>Нажмите, чтобы читать подробнее...</Text>
      </View>
    </View>
  </Animated.View>
);

export function ForecastDisplay({ result, date }: ForecastDisplayProps) {
  // Форматируем сегодняшнюю дату
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.delay(0).duration(500)}>
        <Text style={styles.headerDate}>{todayFormatted}</Text>
        <Text style={styles.subHeader}>Ваш персональный нумерологический ритм</Text>
      </Animated.View>

      {/* 1. Личный День (Самое важное сегодня) */}
      <NumberCard
        label="Личный День"
        value={result.personalDay}
        icon="weather-sunny"
        description={`Энергия числа ${result.personalDay}. Сегодняшний день задает тон вашим действиям.`}
        index={1}
      />

      {/* 2. Личный Месяц */}
      <NumberCard
        label="Личный Месяц"
        value={result.personalMonth}
        icon="calendar-month"
        description={`Фон месяца под числом ${result.personalMonth}. Общая атмосфера и возможности этого периода.`}
        index={2}
      />

      {/* 3. Личный Год */}
      <NumberCard
        label="Личный Год"
        value={result.personalYear}
        icon="calendar-blank" // или star-face
        description={`Ваш глобальный цикл (Число ${result.personalYear}). Главная тема и уроки этого года.`}
        index={3}
      />

      {/* 4. Тизер Премиум-Гороскопа */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(600)}
        style={styles.premiumContainer}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={() => console.log('Open Premium Horoscope')}>
          <LinearGradient
            colors={['#1a2a6c', '#b21f1f', '#fdbb2d']} // Пример "Мистического" градиента
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumBanner}
          >
            <View style={styles.premiumContent}>
              <MaterialCommunityIcons name="zodiac-leo" size={32} color="#FFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.premiumTitle}>Персональный Гороскоп</Text>
                <Text style={styles.premiumSubtitle}>Астрологический прогноз на сегодня</Text>
              </View>
              <MaterialCommunityIcons name="lock" size={24} color="rgba(255,255,255,0.8)" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    width: '100%',
    paddingBottom: SPACING.xl,
  },
  headerDate: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 20,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subHeader: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },

  // Карточка
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)', // Очень легкая обводка
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // Полупрозрачный золотой фон для иконки
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    ...FONTS.sectionTitle,
    fontSize: 18,
    color: COLORS.text,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cardValue: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 56,
    color: COLORS.primary, // Основной золотой цвет
    minWidth: 60,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  descriptionText: {
    ...FONTS.body,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  readMoreText: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },

  // Премиум баннер
  premiumContainer: {
    marginTop: SPACING.sm,
  },
  premiumBanner: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.button,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  premiumTitle: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 18,
    color: '#FFF',
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontFamily: FONT_FAMILY.manrope.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});
