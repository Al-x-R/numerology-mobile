// components/UniversalForecastCard.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { Locale } from '@/lib/constants/locales';

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
    case 'zh-TW': return 'zh-TW';
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
        <ActivityIndicator size="small" color="#C4A484" />
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
          color="#1F2937"
        />
      );
    }
    return null;
  };

  const badgeContent = renderBadgeContent();

  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* --- ШАПКА КАРТОЧКИ --- */}
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

      {/* Основное саммари */}
      <Text style={styles.summary}>{data.summary}</Text>

      <View style={styles.divider} />

      {/* Любовь */}
      <InfoSection
        icon="heart"
        color="#F87171"
        title={t('forecast.love')}
        text={data.love}
      />

      {/* Финансы */}
      <InfoSection
        icon="briefcase"
        color="#34D399"
        title={t('forecast.finance')}
        text={data.finance}
      />

      {/* Здоровье */}
      <InfoSection
        icon="flash"
        color="#60A5FA"
        title={t('forecast.health')}
        text={data.health}
      />

      {/* --- ПРЕДУПРЕЖДЕНИЕ --- */}
      <View style={styles.warningContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="warning" size={16} color="#FBBF24" />
          <Text style={[styles.sectionTitle, { color: '#FBBF24' }]}>{t('forecast.warning')}</Text>
        </View>
        <Text style={styles.warningText}>{data.warning}</Text>
      </View>

      {/*
      <LinearGradient
        colors={['#4C1D95', '#6D28D9']}
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
    borderColor: '#374151',
  },
  loadingContainer: { padding: 40, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#9CA3AF', fontSize: 12 },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#6B7280', fontStyle: 'italic' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  numberBadge: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#C4A484', justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  numberText: { color: '#000', fontWeight: '800', fontSize: 22 },
  headerTextContainer: { flex: 1 },
  dateTitle: { color: '#9CA3AF', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' },
  subTitle: { color: '#C4A484', fontSize: 12, marginBottom: 2, fontWeight: '500' },
  mainTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', lineHeight: 24 },

  summary: { color: '#E5E7EB', fontSize: 15, lineHeight: 22, marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#374151', marginBottom: 20 },

  // Sections
  sectionContainer: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionBody: { color: '#D1D5DB', fontSize: 14, lineHeight: 21, paddingLeft: 2 },

  // Warning
  warningContainer: {
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    padding: 12,
    borderRadius: 12,
    marginTop: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#FBBF24'
  },
  warningText: { color: '#D1D5DB', fontSize: 13, lineHeight: 19, fontStyle: 'italic', marginTop: 4 },

  // Affirmation
  affirmationContainer: { marginTop: 20, padding: 16, borderRadius: 16, alignItems: 'center' },
  affirmationLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 2 },
  affirmationText: { color: '#FFF', fontSize: 16, fontWeight: '600', fontStyle: 'italic', textAlign: 'center', lineHeight: 24 },
});
