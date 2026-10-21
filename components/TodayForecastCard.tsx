// components/TodayForecastCard.tsx
// Compact daily forecast preview for the Today screen; the full forecast lives in its own tab
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTranslation } from '@/contexts/LanguageContext';
import { ForecastSection } from '@/components/UniversalForecastCard';
import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';

interface TodayForecastCardProps {
  emblem: React.ReactNode;
  eyebrow: string;
  heading: string;
  data: ForecastSection | null;
  loading: boolean;
  error: boolean;
  locked: boolean;
  // The screen's main card gets a larger emblem; only one card per screen should set it
  hero?: boolean;
  onPress: () => void;
}

export const TodayForecastCard = ({ emblem, eyebrow, heading, data, loading, error, locked, hero = false, onPress }: TodayForecastCardProps) => {
  const { t } = useAppTranslation();

  const renderBody = () => {
    if (locked) {
      return (
        <View style={styles.noticeRow}>
          <Ionicons name="lock-closed" size={14} color={COLORS.textTertiary} />
          <Text style={styles.lockedText}>{t('today.locked')}</Text>
        </View>
      );
    }
    if (loading) return <ActivityIndicator size="small" color={COLORS.textTertiary} style={styles.loader} />;
    if (error) {
      return (
        <View style={styles.noticeRow}>
          <Ionicons name="cloud-offline-outline" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{t('common.networkError')}</Text>
        </View>
      );
    }
    if (!data) return <Text style={styles.summary}>{t('today.empty')}</Text>;

    return (
      <>
        <Text style={styles.title} numberOfLines={2}>{data.title}</Text>
        <Text style={styles.summary} numberOfLines={4}>{data.summary}</Text>
      </>
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.emblem, hero && styles.emblemHero]}>{emblem}</View>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow} numberOfLines={1}>{eyebrow}</Text>
          <Text style={styles.heading} numberOfLines={2}>{heading}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.gutterSm },
  emblem: {
    width: LAYOUT.emblem,
    height: LAYOUT.emblem,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemHero: { width: LAYOUT.emblemHero, height: LAYOUT.emblemHero, borderColor: COLORS.border },
  headerText: { flex: 1 },
  // Caption at 12pt, the minimum for labels
  eyebrow: { ...TYPE.labelMd, fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight },
  heading: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.semibold, marginTop: SPACING.xs },
  title: { ...TYPE.titleLg, marginBottom: SPACING.xs },
  summary: { ...TYPE.bodyMd, color: COLORS.textTertiary },
  noticeRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  lockedText: { ...TYPE.bodyMd, flex: 1 },
  errorText: { ...TYPE.bodyMd, flex: 1, color: COLORS.error },
  loader: { alignSelf: 'flex-start', marginVertical: SPACING.sm },
  footer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.gutterSm },
  readMore: TYPE.labelLg,
});
