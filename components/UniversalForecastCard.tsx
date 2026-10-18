// components/UniversalForecastCard.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/constants/locales';
import { COLORS, GRADIENTS } from '@/lib/constants/theme';

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
  signName
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
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('forecast.empty')}</Text>
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
          color={COLORS.blackText}
        />
      );
    }
    return null;
  };

  const badgeContent = renderBadgeContent();

  return (
    <LinearGradient
      colors={GRADIENTS.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
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

      <View style={styles.divider} />

      {/* Love */}
      <InfoSection
        icon="heart"
        color={COLORS.accent}
        title={t('forecast.love')}
        text={data.love}
      />

      {/* Finance */}
      <InfoSection
        icon="briefcase"
        color={COLORS.accent}
        title={t('forecast.finance')}
        text={data.finance}
      />

      {/* Health */}
      <InfoSection
        icon="flash"
        color={COLORS.accent}
        title={t('forecast.health')}
        text={data.health}
      />

      {/* --- WARNING --- */}
      <View style={styles.warningContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="warning" size={16} color={COLORS.highlightWeak} />
          <Text style={[styles.sectionTitle, { color: COLORS.highlightWeak }]}>{t('forecast.warning')}</Text>
        </View>
        <Text style={styles.warningText}>{data.warning}</Text>
      </View>

      {/*
      <LinearGradient
        colors={GRADIENTS.accentCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.affirmationContainer}
      >
        <Text style={styles.affirmationLabel}>{t('forecast.affirmation')}</Text>
        <Text style={styles.affirmationText}>{data.affirmation}</Text>
      </LinearGradient>
      */}
    </LinearGradient>
  );
};

const InfoSection = ({ icon, color, title, text }: { icon: any, color: string, title: string, text: string }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    </View>
    <Text style={styles.sectionBody}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  loadingContainer: { padding: 40, alignItems: 'center' },
  loadingText: { marginTop: 10, color: COLORS.textSecondary, fontSize: 12 },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: COLORS.textMuted, fontStyle: 'italic' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  numberBadge: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  numberText: { color: COLORS.blackText, fontWeight: '800', fontSize: 22 },
  headerTextContainer: { flex: 1 },
  dateTitle: { color: COLORS.textSecondary, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' },
  subTitle: { color: COLORS.accent, fontSize: 12, marginBottom: 2, fontWeight: '500' },
  mainTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', lineHeight: 24 },

  summary: { color: COLORS.text, fontSize: 15, lineHeight: 22, marginBottom: 20 },
  divider: { height: 1, backgroundColor: COLORS.hairline, marginBottom: 20 },

  // Sections
  sectionContainer: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionBody: { color: COLORS.textTertiary, fontSize: 14, lineHeight: 21, paddingLeft: 2 },

  // Warning
  warningContainer: {
    backgroundColor: COLORS.weakHighlightBackground,
    padding: 12,
    borderRadius: 12,
    marginTop: 5,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.highlightWeak
  },
  warningText: { color: COLORS.textTertiary, fontSize: 13, lineHeight: 19, fontStyle: 'italic', marginTop: 4 },

  // Affirmation
  affirmationContainer: { marginTop: 20, padding: 16, borderRadius: 16, alignItems: 'center' },
  affirmationLabel: { color: COLORS.textSecondary, fontSize: 10, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 2 },
  affirmationText: { color: COLORS.text, fontSize: 16, fontWeight: '600', fontStyle: 'italic', textAlign: 'center', lineHeight: 24 },
});
