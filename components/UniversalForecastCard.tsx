// components/UniversalForecastCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/constants/locales';
import { COLORS, FONT_FAMILY, GRADIENTS, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
import { GoldButton } from '@/components/ui/GoldButton';

export interface ForecastSection {
  title: string;
  summary: string;
  love: string;
  finance: string;
  health: string;
  warning: string;
  affirmation: string;
}

interface Props {
  data: ForecastSection | null;
  loading: boolean;
  type: 'day' | 'month' | 'year';
  number?: number;
  zodiacSign?: string;
  signName?: string;
  onRetry?: () => void;
}

const ZODIAC_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  aries: 'zodiac-aries',
  taurus: 'zodiac-taurus',
  gemini: 'zodiac-gemini',
  cancer: 'zodiac-cancer',
  leo: 'zodiac-leo',
  virgo: 'zodiac-virgo',
  libra: 'zodiac-libra',
  scorpio: 'zodiac-scorpio',
  sagittarius: 'zodiac-sagittarius',
  capricorn: 'zodiac-capricorn',
  aquarius: 'zodiac-aquarius',
  pisces: 'zodiac-pisces',
};

const getIntlLocale = (locale: Locale): string => {
  switch (locale) {
    case 'ru': return 'ru-RU';
    case 'uk': return 'uk-UA';
    default: return 'en-US';
  }
};

export const UniversalForecastCard: React.FC<Props> = ({
  data,
  loading,
  type,
  number,
  zodiacSign,
  signName,
  onRetry,
}) => {
  const { t, language } = useAppTranslation();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.accent} />
        <Text style={styles.loadingText}>{t('forecast.loading')}</Text>
      </View>
    );
  }

  if (!data) {
    const emptyTitles = {
      day: t('forecast.emptyTitleDay'),
      month: t('forecast.emptyTitleMonth'),
      year: t('forecast.emptyTitleYear'),
    };
    const today = new Date().toLocaleDateString(getIntlLocale(language as Locale), { day: 'numeric', month: 'long' });
    const identity = typeof number === 'number' ? `${t('forecast.yourNumber')}: ${number}` : signName;
    const zodiacIcon = zodiacSign ? ZODIAC_ICONS[zodiacSign] : undefined;

    return (
      <View style={styles.emptyContainer}>
        <LinearGradient colors={GRADIENTS.accentCard} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 0.7 }} style={StyleSheet.absoluteFill} />
        <View style={styles.emptyRing}>
          <View style={styles.emptyMedallion}>
            <Ionicons name="hourglass" size={26} color={COLORS.accent} />
          </View>
        </View>
        <Text style={styles.emptyEyebrow}>
          {zodiacSign ? t('forecast.emptyEyebrowAstro') : t('forecast.emptyEyebrow')}
        </Text>
        <Text style={styles.emptyTitle}>{emptyTitles[type]}</Text>
        <Text style={styles.emptyText}>{t('forecast.emptyText')}</Text>

        <View style={styles.emptyChip}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.accent} />
          <Text style={styles.emptyChipDate}>{t('forecast.today')}, {today}</Text>
          {!!identity && (
            <>
              <View style={styles.emptyChipDot} />
              <Text style={[styles.emptyChipText, styles.emptyChipAccent]}>{identity}</Text>
              {zodiacIcon && <MaterialCommunityIcons name={zodiacIcon} size={14} color={COLORS.accent} />}
            </>
          )}
        </View>

        {onRetry && (
          <GoldButton
            title={t('forecast.retry')}
            onPress={onRetry}
            icon={<Ionicons name="sparkles-outline" size={18} color={COLORS.blackText} />}
            style={styles.emptyButton}
          />
        )}
      </View>
    );
  }

  const getHeaderTitle = () => {
    const d = new Date();
    const localeCode = getIntlLocale(language as Locale);

    try {
      switch (type) {
        case 'day': return d.toLocaleDateString(localeCode, { day: 'numeric', month: 'long' });
        case 'month': return d.toLocaleDateString(localeCode, { month: 'long', year: 'numeric' });
        case 'year': return d.getFullYear().toString();
        default: return '';
      }
    } catch (e) {
      return d.toDateString();
    }
  };

  const getLabel = () => {
    if (signName) {
      return signName.toUpperCase();
    }

    switch (type) {
      case 'day': return t('forecast.day');
      case 'month': return t('forecast.month');
      case 'year': return t('forecast.year');
      default: return t('forecast.titleDefault');
    }
  };

  const renderBadgeContent = () => {
    if (typeof number === 'number') {
      return <Text style={styles.numberText}>{number}</Text>;
    }

    if (zodiacSign && ZODIAC_ICONS[zodiacSign]) {
      return (
        <MaterialCommunityIcons
          name={ZODIAC_ICONS[zodiacSign]}
          size={28}
          color={COLORS.accent}
        />
      );
    }
    return null;
  };

  const badgeContent = renderBadgeContent();

  const aspects = [
    { key: 'love', icon: 'heart-outline' as const, label: t('forecast.love'), text: data.love },
    { key: 'finance', icon: 'briefcase-outline' as const, label: t('forecast.finance'), text: data.finance },
    { key: 'health', icon: 'flash-outline' as const, label: t('forecast.health'), text: data.health },
    { key: 'warning', icon: 'shield-half-outline' as const, label: t('forecast.warning'), text: data.warning, warning: true },
  ].filter((aspect) => !!aspect.text);

  const aspectsTitles = {
    day: t('forecast.aspectsDay'),
    month: t('forecast.aspectsMonth'),
    year: t('forecast.aspectsYear'),
  };

  return (
    <>
    <View style={styles.card}>
      <LinearGradient colors={GRADIENTS.accentCard} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 0.6 }} style={StyleSheet.absoluteFill} />
      {/* --- CARD HEADER --- */}
      <View style={styles.header}>
        {badgeContent && (
          <View style={styles.numberBadge}>
            {badgeContent}
          </View>
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.dateTitle}>{getLabel()}</Text>
          <Text style={styles.subTitle}>{getHeaderTitle()}</Text>
          <Text style={styles.mainTitle}>{data.title}</Text>
        </View>
      </View>

      {/* Summary */}
      <Text style={styles.summary}>{data.summary}</Text>

    </View>

    {/* --- ASPECTS --- */}
    <View style={styles.aspectsHeader}>
      <Text style={styles.aspectsTitle}>{aspectsTitles[type]}</Text>
      <View style={styles.countPill}>
        <Text style={styles.countText}>{t('forecast.aspectsCount').replace('{count}', String(aspects.length))}</Text>
      </View>
    </View>
    <View style={styles.aspectsList}>
      {aspects.map((aspect) => (
        <AspectRow key={aspect.key} icon={aspect.icon} label={aspect.label} text={aspect.text} warning={aspect.warning} />
      ))}
    </View>
    </>
  );
};

// Collapsed rows show the opening lines; tapping reveals the full text
const AspectRow = ({ icon, label, text, warning }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  text: string;
  warning?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const tint = warning ? COLORS.warningChipText : COLORS.accent;

  return (
    <TouchableOpacity style={styles.aspectRow} onPress={() => setExpanded((v) => !v)} activeOpacity={0.85}>
      <View style={styles.aspectMedallion}>
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <View style={styles.aspectContent}>
        <Text style={[styles.aspectLabel, { color: tint }]}>{label}</Text>
        <Text style={styles.aspectText} numberOfLines={expanded ? undefined : 2}>{text}</Text>
      </View>
      <View style={styles.aspectChevron}>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  loadingContainer: { padding: SPACING.xl, alignItems: 'center' },
  loadingText: { ...TYPE.bodySm, marginTop: SPACING.sm },
  emptyContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  emptyRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 10,
    borderColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
  },
  emptyMedallion: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEyebrow: { ...TYPE.labelMd, color: COLORS.accent, letterSpacing: 2, marginBottom: SPACING.sm },
  emptyTitle: { ...TYPE.headlineLg, textAlign: 'center', marginBottom: SPACING.sm },
  emptyText: { ...TYPE.bodyMd, color: COLORS.textTertiary, textAlign: 'center', marginBottom: SPACING.lg },
  emptyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    marginBottom: SPACING.lg,
  },
  emptyChipText: { ...TYPE.bodySm, color: COLORS.textTertiary },
  emptyChipDate: { ...TYPE.labelSm, color: COLORS.textTertiary },
  emptyChipAccent: { color: COLORS.accent },
  emptyChipDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.textMuted },
  emptyButton: { alignSelf: 'stretch' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  numberBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.goldenButtonSoft,
  },
  numberText: { fontFamily: FONT_FAMILY.serif.medium, fontSize: 30, lineHeight: 36, color: COLORS.accent },
  headerTextContainer: { flex: 1 },
  dateTitle: TYPE.labelSm,
  subTitle: { ...TYPE.labelMd, color: COLORS.accent, marginTop: 2, marginBottom: SPACING.xs },
  mainTitle: { ...TYPE.headlineMd },

  summary: { ...TYPE.bodyLg, color: COLORS.textTertiary },

  // Aspects
  aspectsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  aspectsTitle: { ...TYPE.headlineMd, flex: 1 },
  countPill: {
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
  },
  countText: { ...TYPE.labelSm, color: COLORS.accent },
  aspectsList: { gap: SPACING.gutterSm, marginBottom: SPACING.lg },
  aspectRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.gutterSm + 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  aspectMedallion: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aspectContent: { flex: 1 },
  aspectLabel: { ...TYPE.labelSm, marginBottom: 4 },
  aspectText: { ...TYPE.bodyMd, color: COLORS.textTertiary },
  aspectChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },


  // Affirmation
  affirmationContainer: { marginTop: SPACING.lg, padding: SPACING.md, borderRadius: RADIUS.lg, alignItems: 'center' },
  affirmationLabel: { ...TYPE.labelSm, marginBottom: SPACING.sm },
  affirmationText: { fontFamily: FONT_FAMILY.serif.italic, fontSize: 20, lineHeight: 28, color: COLORS.accent, textAlign: 'center' },
});
