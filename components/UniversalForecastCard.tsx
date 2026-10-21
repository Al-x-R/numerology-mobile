// components/UniversalForecastCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/constants/locales';
import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
import { withAlpha } from '@/src/theme/tokens';
import { GoldButton } from '@/components/ui/GoldButton';

export interface ForecastMeter {
  score: number;
  label: string;
}

export interface ForecastSection {
  title: string;
  summary: string;
  love: string;
  finance: string;
  health: string;
  warning: string;
  affirmation: string;
  // Added by the newer generator; older files have neither
  tags?: string[];
  meters?: {
    energy: ForecastMeter;
    love: ForecastMeter;
    finance: ForecastMeter;
    health: ForecastMeter;
  };
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
  // Localized moon line from daily files, e.g. "Луна в Водолее · растущая Луна, 76%"
  moon?: string | null;
  onRetry?: () => void;
}

type AspectKey = 'love' | 'finance' | 'health' | 'warning';

// Aspects are categories, so each gets its own hue (rules 2.5) plus a distinct icon
const ASPECT_STYLE: Record<AspectKey, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  love: { icon: 'heart', color: COLORS.categoryLove },
  finance: { icon: 'briefcase', color: COLORS.categoryWork },
  health: { icon: 'flash', color: COLORS.categoryHealth },
  warning: { icon: 'shield-half', color: COLORS.warning },
};

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
  moon,
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
          size={30}
          color={COLORS.accent}
        />
      );
    }
    return null;
  };

  const badgeContent = renderBadgeContent();
  const meters = data.meters;

  const aspects = ([
    { key: 'love', label: t('forecast.love'), text: data.love, meter: meters?.love },
    { key: 'finance', label: t('forecast.finance'), text: data.finance, meter: meters?.finance },
    { key: 'health', label: t('forecast.health'), text: data.health, meter: meters?.health },
    { key: 'warning', label: t('forecast.warning'), text: data.warning },
  ] as { key: AspectKey; label: string; text: string; meter?: ForecastMeter }[]).filter((aspect) => !!aspect.text);

  const aspectsTitles = {
    day: t('forecast.aspectsDay'),
    month: t('forecast.aspectsMonth'),
    year: t('forecast.aspectsYear'),
  };

  return (
    <>
    {/* --- HERO: the screen's main element --- */}
    <View style={styles.card}>
      <LinearGradient
        colors={[withAlpha(COLORS.accent, 0.14), withAlpha(COLORS.accent, 0)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        {badgeContent && (
          <View style={styles.numberBadge}>
            {badgeContent}
          </View>
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.dateTitle} numberOfLines={1}>{getLabel()} · {getHeaderTitle()}</Text>
          {!!moon && (
            <View style={styles.moonRow}>
              <Ionicons name="moon" size={12} color={COLORS.textSecondary} />
              <Text style={styles.moonText} numberOfLines={1}>{moon}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.mainTitle} numberOfLines={3}>{data.title}</Text>

      {!!data.tags?.length && (
        <View style={styles.tags}>
          {data.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.summary}>{data.summary}</Text>

      {meters?.energy && (
        <View style={styles.energy}>
          <View style={styles.energyHeader}>
            <Ionicons name="pulse" size={16} color={COLORS.accent} />
            <Text style={styles.energyLabel}>{t('forecast.energy')}</Text>
            <Text style={styles.energyValue}>{meters.energy.label} · {meters.energy.score}%</Text>
          </View>
          <Meter score={meters.energy.score} color={COLORS.accent} />
        </View>
      )}
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
        <AspectCard key={aspect.key} aspectKey={aspect.key} label={aspect.label} text={aspect.text} meter={aspect.meter} />
      ))}
    </View>

    {/* --- MANTRA --- */}
    {!!data.affirmation && (
      <View style={styles.mantra}>
        <LinearGradient
          colors={[withAlpha(COLORS.accent, 0.1), withAlpha(COLORS.accent, 0)]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.mantraHeader}>
          <MaterialCommunityIcons name="meditation" size={18} color={COLORS.accent} />
          <Text style={styles.mantraLabel}>{t('forecast.affirmation')}</Text>
        </View>
        <Text style={styles.mantraText}>«{data.affirmation}»</Text>
      </View>
    )}
    </>
  );
};

const Meter = ({ score, color }: { score: number; color: string }) => (
  <View style={styles.meterTrack}>
    <View style={[styles.meterFill, { width: `${Math.max(0, Math.min(100, score))}%`, backgroundColor: color }]} />
  </View>
);

// Collapsed cards show the opening lines; tapping reveals the full text
const AspectCard = ({ aspectKey, label, text, meter }: {
  aspectKey: AspectKey;
  label: string;
  text: string;
  meter?: ForecastMeter;
}) => {
  const [expanded, setExpanded] = useState(false);
  const { icon, color } = ASPECT_STYLE[aspectKey];

  return (
    <TouchableOpacity
      style={styles.aspectRow}
      onPress={() => setExpanded((v) => !v)}
      activeOpacity={0.7}
      accessibilityState={{ expanded }}
    >
      <LinearGradient
        colors={[withAlpha(color, 0.12), withAlpha(color, 0)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.aspectMedallion, { backgroundColor: withAlpha(color, 0.16) }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.aspectContent}>
        <View style={styles.aspectHeader}>
          <Text style={[styles.aspectLabel, { color }]} numberOfLines={2}>{label}</Text>
          {meter && (
            <View style={[styles.aspectChip, { backgroundColor: withAlpha(color, 0.08) }]}>
              <Text style={[styles.aspectChipText, { color }]} numberOfLines={1}>{meter.label} {meter.score}%</Text>
            </View>
          )}
        </View>
        <Text style={styles.aspectText} numberOfLines={expanded ? undefined : 3}>{text}</Text>
        {meter && <Meter score={meter.score} color={color} />}
      </View>
    </TouchableOpacity>
  );
};

// Captions at the 12pt minimum
const caption = { fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight };

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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  // The hero badge: the personal number or zodiac sign, with a soft gold aura
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
    ...SHADOWS.goldenButtonSoft,
  },
  numberText: { ...TYPE.heroNumber, fontVariant: ['tabular-nums'] },
  headerTextContainer: { flex: 1 },
  dateTitle: { ...TYPE.labelMd, ...caption, color: COLORS.accentLight },
  moonRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xs },
  moonText: { ...TYPE.bodySm, flexShrink: 1 },
  mainTitle: { ...TYPE.headlineLg, fontFamily: FONT_FAMILY.serif.semibold, marginBottom: SPACING.gutterSm },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.gutterSm },
  tag: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.gutterSm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
  },
  tagText: { ...TYPE.bodySm, color: COLORS.accentLight },

  summary: { ...TYPE.bodyLg, color: COLORS.textTertiary },

  energy: {
    marginTop: SPACING.md,
    padding: SPACING.gutterSm,
    borderRadius: RADIUS.md,
    backgroundColor: withAlpha(COLORS.background, 0.6),
    gap: SPACING.sm,
  },
  energyHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  energyLabel: { ...TYPE.labelMd, ...caption, flex: 1 },
  energyValue: { ...TYPE.labelMd, ...caption, color: COLORS.accentLight, fontVariant: ['tabular-nums'] },
  meterTrack: {
    height: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.hairline,
    overflow: 'hidden',
  },
  meterFill: { height: '100%', borderRadius: RADIUS.full },

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
    overflow: 'hidden',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  aspectContent: { flex: 1, gap: SPACING.sm },
  aspectHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  aspectLabel: { ...TYPE.labelMd, ...caption, flex: 1 },
  aspectChip: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm, borderRadius: RADIUS.full },
  aspectChipText: { ...TYPE.labelMd, ...caption, fontVariant: ['tabular-nums'] },
  aspectText: { ...TYPE.bodyMd, color: COLORS.textTertiary },

  // Mantra
  mantra: {
    overflow: 'hidden',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  mantraHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  mantraLabel: { ...TYPE.labelMd, ...caption, color: COLORS.accentLight, letterSpacing: 2 },
  mantraText: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.italic, color: COLORS.text, textAlign: 'center' },
});
