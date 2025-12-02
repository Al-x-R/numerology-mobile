// components/UniversalForecastCard.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/contexts/LanguageContext'; // Импортируем, чтобы знать язык

// Типы данных
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
  number: number;
}

// Словарик для заголовков секций
const SECTION_TITLES = {
  ru: {
    love: 'Любовь и Отношения',
    finance: 'Работа и Финансы',
    health: 'Здоровье и Энергия',
    warning: 'Предостережение',
    affirmation: 'МАНТРА',
    day: 'Энергия Дня',
    month: 'Тема Месяца',
    year: 'Стратегия Года',
    loading: 'Загрузка прогноза...',
    empty: 'Данные еще не сформированы'
  },
  en: {
    love: 'Love & Relationships',
    finance: 'Career & Finance',
    health: 'Health & Energy',
    warning: 'Warning',
    affirmation: 'MANTRA',
    day: 'Daily Vibration',
    month: 'Monthly Theme',
    year: 'Yearly Strategy',
    loading: 'Loading forecast...',
    empty: 'No forecast data available'
  }
};

export const UniversalForecastCard: React.FC<Props> = ({ data, loading, type, number }) => {
  const { language } = useLanguage();
  // Выбираем тексты на нужном языке (или дефолт en)
  const labels = SECTION_TITLES[language] || SECTION_TITLES.en;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#C4A484" />
        <Text style={styles.loadingText}>{labels.loading}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{labels.empty}</Text>
      </View>
    );
  }

  // Динамические заголовки шапки
  const getHeaderTitle = () => {
    const d = new Date();
    const locale = language === 'ru' ? 'ru-RU' : 'en-US';

    switch (type) {
      case 'day': return d.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
      case 'month': return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
      case 'year': return d.getFullYear().toString();
      default: return '';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'day': return labels.day;
      case 'month': return labels.month;
      case 'year': return labels.year;
      default: return 'Forecast';
    }
  };

  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* --- ШАПКА КАРТОЧКИ --- */}
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{number}</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.dateTitle}>{getLabel()}</Text>
          <Text style={styles.subTitle}>{getHeaderTitle()}</Text>
          <Text style={styles.mainTitle}>{data.title}</Text>
        </View>
      </View>

      {/* Основное саммари */}
      <Text style={styles.summary}>{data.summary}</Text>

      <View style={styles.divider} />

      {/* --- СЕКЦИИ С ЗАГОЛОВКАМИ --- */}

      {/* Любовь */}
      <InfoSection
        icon="heart"
        color="#F87171"
        title={labels.love}
        text={data.love}
      />

      {/* Финансы */}
      <InfoSection
        icon="briefcase" // или "cash"
        color="#34D399"
        title={labels.finance}
        text={data.finance}
      />

      {/* Здоровье */}
      <InfoSection
        icon="flash" // или "fitness"
        color="#60A5FA"
        title={labels.health}
        text={data.health}
      />

      {/* --- ПРЕДУПРЕЖДЕНИЕ --- */}
      <View style={styles.warningContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="warning" size={16} color="#FBBF24" />
          <Text style={[styles.sectionTitle, { color: '#FBBF24' }]}>{labels.warning}</Text>
        </View>
        <Text style={styles.warningText}>{data.warning}</Text>
      </View>

      {/* --- МАНТРА --- */}
      <LinearGradient
        colors={['#4C1D95', '#6D28D9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.affirmationContainer}
      >
        <Text style={styles.affirmationLabel}>{labels.affirmation}</Text>
        <Text style={styles.affirmationText}>{data.affirmation}</Text>
      </LinearGradient>
    </LinearGradient>
  );
};

// --- Компонент одной секции ---
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

  // Sections (New Style)
  sectionContainer: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionBody: { color: '#D1D5DB', fontSize: 14, lineHeight: 21, paddingLeft: 2 }, // Небольшой отступ текста

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
