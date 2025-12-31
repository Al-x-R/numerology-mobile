// components/AdditionalParamsDisplay.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { AdditionalParams } from '@/lib/types/calculation';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING, GRADIENTS } from '@/lib/constants/theme';
import { useProfile } from '@/contexts/ProfileContext';
import { useRewarded } from '@/hooks/useAdMob';
import { useAppTranslation } from '@/contexts/LanguageContext';

interface AdditionalParamsProps {
  params: AdditionalParams;
}

export function AdditionalParamsDisplay({ params }: AdditionalParamsProps) {
  const { user } = useProfile();
  const { t } = useAppTranslation();
  const { showRewarded, isLoaded } = useRewarded();

  // Локальное состояние разблокировки для этой сессии
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Если у пользователя Премиум, контент открыт всегда
  useEffect(() => {
    if (user?.isPremium) {
      setIsUnlocked(true);
    }
  }, [user?.isPremium]);

  const handleUnlock = () => {
    if (user?.isPremium) return;

    showRewarded(() => {
      // Этот код выполнится только после просмотра рекламы
      setIsUnlocked(true);
    });
  };

  // Список параметров для отображения
  const paramItems = [
    { key: 'destinyNumber', label: t('params.destiny'), value: params.destinyNumber, highlight: true },
    { key: 'temperament', label: t('params.temperament'), value: params.temperament },
    { key: 'goal', label: t('params.goal'), value: params.goal },
    { key: 'family', label: t('params.family'), value: params.family },
    { key: 'habits', label: t('params.habits'), value: params.habits },
    { key: 'energy', label: t('params.energy'), value: params.utilityMoney }, // Быт/Деньги часто utilityMoney
    { key: 'talent', label: t('params.talent'), value: params.talent },
    { key: 'spirituality', label: t('params.spirituality'), value: params.spirituality },
    { key: 'selfEsteem', label: t('params.selfEsteem'), value: params.selfEsteem },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('section_additional') || 'Глубокий Анализ'}</Text>

      <View style={styles.grid}>
        {paramItems.map((item, index) => (
          <View
            key={item.key}
            style={[
              styles.card,
              item.highlight && styles.highlightCard,
              !isUnlocked && styles.blurredCard // Визуальный эффект закрытия
            ]}
          >
            <Text style={[styles.label, item.highlight && styles.highlightText]}>
              {item.label}
            </Text>

            {/* Если закрыто - показываем звездочки или размытие */}
            <Text style={[styles.value, item.highlight && styles.highlightText]}>
              {isUnlocked ? item.value : '**'}
            </Text>
          </View>
        ))}

        {/* Слой блокировки (Overlay) */}
        {!isUnlocked && (
          <View style={styles.lockOverlay}>
            <LinearGradient
              colors={['rgba(13, 15, 33, 0.6)', 'rgba(13, 15, 33, 0.95)']}
              style={styles.gradientOverlay}
            >
              <Ionicons name="lock-closed" size={32} color={COLORS.accent} style={{ marginBottom: 10 }} />
              <Text style={styles.lockText}>
                {t('unlockFullAnalysis') || 'Открыть полный анализ'}
              </Text>

              <TouchableOpacity
                style={styles.unlockButton}
                onPress={handleUnlock}
              >
                <LinearGradient
                  colors={GRADIENTS.goldenButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="play-circle" size={20} color={COLORS.blackText} style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>
                    {isLoaded ? (t('watchAd') || 'Смотреть видео') : (t('loading') || 'Загрузка...')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xl,
    width: '100%',
  },
  title: {
    ...FONTS.sectionTitle,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    position: 'relative', // Важно для overlay
  },
  card: {
    width: '31%', // 3 колонки
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 80,
  },
  highlightCard: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  blurredCard: {
    opacity: 0.3,
  },
  label: {
    ...FONTS.headerTitle,
    fontSize: 10,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    ...FONTS.subtitle,
    color: '#fff',
  },
  highlightText: {
    color: COLORS.accent,
  },
  // Блокировка
  lockOverlay: {
    ...StyleSheet.absoluteFillObject, // Перекрывает весь grid
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    zIndex: 10,
  },
  gradientOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lockText: {
    ...FONTS.body,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  unlockButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.goldenButtonSoft,
  },
  buttonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS.button,
    color: COLORS.blackText,
    fontSize: 14,
  },
});
