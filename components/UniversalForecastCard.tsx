// components/UniversalForecastCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/constants/locales';
import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
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
  // A failed load; shown apart from "not ready yet" so it never looks like an empty forecast
  error?: boolean;
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
  error,
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
        <ActivityIndicator size="small" color={COLORS.textTertiary} />
        <Text style={styles.loadingText}>{t('forecast.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyRing}>
          <View style={styles.emptyMedallion}>
            <Ionicons name="cloud-offline-outline" size={26} color={COLORS.error} />
          </View>
        </View>
        <Text style={styles.emptyText} numberOfLines={3}>{t('common.networkError')}</Text>
        {onRetry && (
          <GoldButton
            title={t('forecast.retry')}
            onPress={onRetry}
            icon={<Ionicons name="refresh" size={18} color={COLORS.blackText} />}
            style={styles.emptyButton}
          />
        )}
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
        <View style={styles.emptyRing}>
          <View style={styles.emptyMedallion}>
            <Ionicons name="hourglass" size={26} color={COLORS.textTertiary} />
          </View>
        </View>
        <Text style={styles.emptyEyebrow}>
          {zodiacSign ? t('forecast.emptyEyebrowAstro') : t('forecast.emptyEyebrow')}
        </Text>
        <Text style={styles.emptyTitle} numberOfLines={2}>{emptyTitles[type]}</Text>
        <Text style={styles.emptyText} numberOfLines={3}>{t('forecast.emptyText')}</Text>

        <View style={styles.emptyChip}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.emptyChipDate}>{t('forecast.today')}, {today}</Text>
          {!!identity && (
            <>
              <View style={styles.emptyChipDot} />
              <Text style={[styles.emptyChipText, styles.emptyChipAccent]}>{identity}</Text>
              {zodiacIcon && <MaterialCommunityIcons name={zodiacIcon} size={14} color={COLORS.textSecondary} />}
            </>
          )}
        </View>

        {/* Secondary: the forecast is simply not ready, refreshing is rarely needed */}
        {onRetry && (
          <TouchableOpacity style={styles.secondaryButton} onPress={onRetry} activeOpacity={0.7}>
            <Ionicons name="sparkles-outline" size={18} color={COLORS.accentLight} />
            <Text style={styles.secondaryButtonText}>{t('forecast.retry')}</Text>
          </TouchableOpacity>
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
    { key: 'warning', icon: 'shield-half-outline' as const, label: t('forecast.warning'), text: data.warning },
  ].filter((aspect) => !!aspect.text);

  const aspectsTitles = {
    day: t('forecast.aspectsDay'),
    month: t('forecast.aspectsMonth'),
    year: t('forecast.aspectsYear'),
  };

  return (
    <>
    <View style={styles.card}>
      {/* --- CARD HEADER --- */}
      <View style={styles.header}>
        {badgeContent && (
          <View style={styles.numberBadge}>
            {badgeContent}
          </View>
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.dateTitle} numberOfLines={1}>{getLabel()}</Text>
          <Text style={styles.subTitle} numberOfLines={1}>{getHeaderTitle()}</Text>
          <Text style={styles.mainTitle} numberOfLines={3}>{data.title}</Text>
        </View>
      </View>

      {/* Summary */}
      <Text style={styles.summary}>{data.summary}</Text>

    </View>

    {/* --- ASPECTS --- */}
    <View style={styles.aspectsHeader}>
      <Text style={styles.aspectsTitle} numberOfLines={2}>{aspectsTitles[type]}</Text>
      <View style={styles.countPill}>
        <Text style={styles.countText}>{t('forecast.aspectsCount').replace('{count}', String(aspects.length))}</Text>
      </View>
    </View>
    <View style={styles.aspectsList}>
      {aspects.map((aspect) => (
        <AspectRow key={aspect.key} icon={aspect.icon} label={aspect.label} text={aspect.text} />
      ))}
    </View>
    </>
  );
};

// Collapsed rows show the opening lines; tapping reveals the full text.
// Neutral: the icon tells the aspects apart, gold stays on the number/sign badge
const AspectRow = ({ icon, label, text }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  text: string;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.aspectRow}
      onPress={() => setExpanded((v) => !v)}
      activeOpacity={0.7}
      accessibilityState={{ expanded }}
    >
      <View style={styles.aspectMedallion}>
        <Ionicons name={icon} size={20} color={COLORS.textTertiary} />
      </View>
      <View style={styles.aspectContent}>
        <Text style={styles.aspectLabel}>{label}</Text>
        <Text style={styles.aspectText} numberOfLines={expanded ? undefined : 2}>{text}</Text>
      </View>
      <View style={styles.aspectChevron}>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

// Captions at the 12pt minimum
const caption = { fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight };

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  loadingContainer: { padding: SPACING.lg, alignItems: 'center' },
  loadingText: { ...TYPE.bodySm, marginTop: SPACING.sm },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  emptyRing: {
    width: LAYOUT.emblemHero + SPACING.gutterSm * 2,
    height: LAYOUT.emblemHero + SPACING.gutterSm * 2,
    borderRadius: RADIUS.full,
    borderWidth: SPACING.gutterSm,
    borderColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyMedallion: {
    width: LAYOUT.emblemHero,
    height: LAYOUT.emblemHero,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEyebrow: { ...TYPE.labelMd, ...caption, letterSpacing: 2, marginBottom: SPACING.sm },
  emptyTitle: { ...TYPE.headlineLg, fontFamily: FONT_FAMILY.serif.semibold, textAlign: 'center', marginBottom: SPACING.sm },
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
  emptyChipDate: { ...TYPE.labelSm, ...caption, color: COLORS.textTertiary },
  emptyChipAccent: { color: COLORS.text, fontVariant: ['tabular-nums'] },
  emptyChipDot: { width: SPACING.xs, height: SPACING.xs, borderRadius: RADIUS.full, backgroundColor: COLORS.textMuted },
  emptyButton: { alignSelf: 'stretch' },
  // Secondary action: outlined, gold text (rules §4)
  secondaryButton: {
    alignSelf: 'stretch',
    height: LAYOUT.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: { ...TYPE.labelLg, color: COLORS.accentLight },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  // The screen's hero: the personal number or zodiac sign
  numberBadge: {
    width: LAYOUT.emblemHero,
    height: LAYOUT.emblemHero,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  numberText: { ...TYPE.heroNumber, fontVariant: ['tabular-nums'] },
  headerTextContainer: { flex: 1 },
  dateTitle: { ...TYPE.labelSm, ...caption },
  subTitle: { ...TYPE.labelMd, ...caption, color: COLORS.textTertiary, marginTop: SPACING.xs, marginBottom: SPACING.xs },
  mainTitle: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.semibold },

  summary: { ...TYPE.bodyLg, color: COLORS.textTertiary },

  // Aspects
  aspectsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  aspectsTitle: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.semibold, flex: 1 },
  countPill: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.gutterSm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
  },
  countText: { ...TYPE.labelSm, ...caption, color: COLORS.textTertiary },
  aspectsList: { gap: SPACING.gutterSm, marginBottom: SPACING.lg },
  aspectRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.gutterSm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  aspectMedallion: {
    width: LAYOUT.minTouch,
    height: LAYOUT.minTouch,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aspectContent: { flex: 1 },
  aspectLabel: { ...TYPE.labelSm, ...caption, color: COLORS.textTertiary, marginBottom: SPACING.xs },
  aspectText: { ...TYPE.bodyMd, color: COLORS.textTertiary },
  aspectChevron: {
    width: SPACING.lg,
    height: SPACING.lg,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },


  // Affirmation
  affirmationContainer: { marginTop: SPACING.lg, padding: SPACING.md, borderRadius: RADIUS.lg, alignItems: 'center' },
  affirmationLabel: { ...TYPE.labelSm, marginBottom: SPACING.sm },
  affirmationText: { fontFamily: FONT_FAMILY.serif.italic, fontSize: 20, lineHeight: 28, color: COLORS.accent, textAlign: 'center' },
});
