// components/TodayForecastCard.tsx
// Compact daily forecast preview for the Today screen; the full forecast lives in its own tab
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTranslation } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';
import { COLORS, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';

interface TodayForecastCardProps {
  emblem: React.ReactNode;
  eyebrow: string;
  heading: string;
  data: ForecastSection | null;
  loading: boolean;
  locked: boolean;
  onPress: () => void;
}

export const TodayForecastCard = ({ emblem, eyebrow, heading, data, loading, locked, onPress }: TodayForecastCardProps) => {
  const { t } = useAppTranslation();

  const renderBody = () => {
    if (locked) {
      return (
        <View style={styles.lockedRow}>
          <Ionicons name="lock-closed" size={14} color={COLORS.accent} />
          <Text style={styles.lockedText}>{t('today.locked')}</Text>
        </View>
      );
    }
    if (loading) return <ActivityIndicator size="small" color={COLORS.accent} style={styles.loader} />;
    if (!data) return <Text style={styles.summary}>{t('today.empty')}</Text>;

    return (
      <>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.summary} numberOfLines={4}>{data.summary}</Text>
      </>
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.emblem}>{emblem}</View>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.heading}>{heading}</Text>
        </View>
      </View>

      {renderBody()}

      <View style={styles.footer}>
        <Text style={styles.readMore}>{t('today.readMore')}</Text>
        <Ionicons name="arrow-forward" size={16} color={COLORS.accent} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  emblem: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { flex: 1 },
  eyebrow: { ...TYPE.labelMd, color: COLORS.accent },
  heading: { ...TYPE.headlineMd, marginTop: 2 },
  title: { ...TYPE.titleLg, marginBottom: SPACING.xs },
  summary: { ...TYPE.bodyMd, color: COLORS.textTertiary },
  lockedRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  lockedText: { ...TYPE.bodyMd, flex: 1 },
  loader: { alignSelf: 'flex-start', marginVertical: SPACING.sm },
  footer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.md },
  readMore: TYPE.labelLg,
});
