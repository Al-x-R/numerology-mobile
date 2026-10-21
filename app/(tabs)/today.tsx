// app/(tabs)/today.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useForecasts } from '@/hooks/useForecasts';
import { useZodiacForecast } from '@/hooks/useZodiacForecast';
import { calculatePersonalDay } from '@/lib/calculators/numerologyForecast';
import { getZodiacName, getZodiacSign } from '@/lib/calculators/zodiac';
import { formatReminderTime, hasActiveReminders } from '@/lib/notifications/forecastReminders';
import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { BirthDateRequiredState } from '@/components/ui/BirthDateRequiredState';
import { TodayForecastCard } from '@/components/TodayForecastCard';

const DATE_LOCALES: Record<string, string> = { ru: 'ru-RU', uk: 'uk-UA', en: 'en-US' };

const getGreetingKey = (hour: number): string => {
  if (hour >= 5 && hour < 12) return 'today.greetingMorning';
  if (hour >= 12 && hour < 18) return 'today.greetingDay';
  if (hour >= 18 && hour < 23) return 'today.greetingEvening';
  return 'today.greetingNight';
};

interface SectionTileProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  onPress: () => void;
}

const SectionTile = ({ icon, title, text, onPress }: SectionTileProps) => (
  <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.tileIcon}>{icon}</View>
    <Text style={styles.tileTitle} numberOfLines={2}>{title}</Text>
    <Text style={styles.tileText} numberOfLines={3}>{text}</Text>
  </TouchableOpacity>
);

export default function TodayScreen() {
  const { activeProfile, isPremium } = useProfile();
  const { t, language } = useAppTranslation();
  const { settings: reminders } = useNotifications();

  const birthDate = activeProfile?.date || null;
  const now = new Date();

  const dayNumber = birthDate ? calculatePersonalDay(birthDate, now) : 0;
  const sign = birthDate ? getZodiacSign(new Date(birthDate)) : null;

  // Free users see daily forecasts in their tabs after a rewarded ad, so here they get only a teaser
  const locked = !isPremium;
  const dayForecast = useForecasts('day', locked ? 0 : dayNumber);
  const zodiacForecast = useZodiacForecast('day', locked ? null : sign);

  const name = activeProfile?.name;
  const greeting = `${t(getGreetingKey(now.getHours()))}${name ? `, ${name}` : ''}`;
  const dateLabel = now.toLocaleDateString(DATE_LOCALES[language], { weekday: 'long', day: 'numeric', month: 'long' });

  const remindersOn = isPremium && hasActiveReminders(reminders);

  if (!birthDate || !sign) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <AuraBackground />
        <BirthDateRequiredState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <AuraBackground />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.date}>{dateLabel}</Text>
        <Text style={styles.greeting} numberOfLines={2}>{greeting}</Text>
        <View style={styles.meta}>
          <MaterialCommunityIcons name={`zodiac-${sign}`} size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText} numberOfLines={1}>
            {getZodiacName(sign, language)}
            {'  ·  '}
            {t('today.dayNumberEyebrow')} <Text style={styles.metaValue}>{dayNumber}</Text>
          </Text>
        </View>

        <TodayForecastCard
          emblem={<Text style={styles.dayNumber}>{dayNumber}</Text>}
          eyebrow={t('today.dayNumberEyebrow')}
          heading={t('today.dayNumberHeading').replace('{number}', String(dayNumber))}
          data={dayForecast.data}
          loading={dayForecast.loading}
          error={dayForecast.error}
          locked={locked}
          hero
          onPress={() => router.navigate('/(tabs)/numbers')}
        />

        <TodayForecastCard
          emblem={<MaterialCommunityIcons name={`zodiac-${sign}`} size={26} color={COLORS.textTertiary} />}
          eyebrow={t('today.horoscopeEyebrow')}
          heading={getZodiacName(sign, language)}
          data={zodiacForecast.data}
          loading={zodiacForecast.loading}
          error={zodiacForecast.error}
          locked={locked}
          onPress={() => router.navigate('/(tabs)/horoscope')}
        />

        <TouchableOpacity
          style={[styles.reminders, remindersOn && styles.remindersOn]}
          onPress={() => router.push('/profile/notifications')}
          activeOpacity={0.7}
        >
          <View style={[styles.remindersIcon, remindersOn && styles.remindersIconOn]}>
            <Ionicons name={remindersOn ? 'notifications' : 'notifications-outline'} size={20} color={remindersOn ? COLORS.accent : COLORS.textTertiary} />
          </View>
          <View style={styles.remindersText}>
            <Text style={styles.tileTitle} numberOfLines={1}>
              {remindersOn
                ? t('today.remindersOn').replace('{time}', formatReminderTime(reminders))
                : t('today.remindersTitle')}
            </Text>
            {!remindersOn && <Text style={styles.remindersHint} numberOfLines={2}>{t('today.remindersText')}</Text>}
          </View>
          {/* The whole row is the touch target; a chevron leaves the text room to fit, free users see what unlocks it */}
          {isPremium ? (
            <Ionicons name="chevron-forward" size={18} color={COLORS.chevron} />
          ) : (
            <View style={styles.remindersAction}>
              <Text style={styles.remindersActionText}>PRO</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>{t('today.sectionsLabel')}</Text>
        <View style={styles.tiles}>
          <SectionTile
            icon={<Ionicons name="grid-outline" size={20} color={COLORS.textTertiary} />}
            title={t('today.pythagorasTitle')}
            text={t('today.pythagorasText')}
            onPress={() => router.navigate('/(tabs)/pythagoras')}
          />
          <SectionTile
            icon={<MaterialCommunityIcons name="infinity" size={20} color={COLORS.textTertiary} />}
            title={t('today.compatibilityTitle')}
            text={t('today.compatibilityText')}
            onPress={() => router.navigate('/(tabs)/compatibility')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: {
    paddingHorizontal: LAYOUT.contentPadding,
    paddingTop: SPACING.md,
    paddingBottom: LAYOUT.tabBarHeight + SPACING.lg,
  },

  // Captions at 12pt, the minimum for labels
  date: { ...TYPE.labelMd, fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight },
  greeting: { ...TYPE.displayLg, fontFamily: FONT_FAMILY.serif.semibold, marginTop: SPACING.xs },
  // Sign and day number at a glance, neutral so the gold stays on the hero card
  meta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xs, marginBottom: SPACING.lg },
  metaText: { ...TYPE.bodyMd, flexShrink: 1 },
  metaValue: { fontFamily: FONT_FAMILY.sans.semibold, color: COLORS.text, fontVariant: ['tabular-nums'] },
  // The day number is the screen's hero, so it is the only gold glyph besides active states
  dayNumber: { ...TYPE.heroNumber, fontVariant: ['tabular-nums'] },

  reminders: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gutterSm,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.md,
  },
  remindersOn: { borderColor: COLORS.borderAccent },
  // Round emblem in the same language as the forecast cards above
  remindersIcon: {
    width: LAYOUT.emblemSm,
    height: LAYOUT.emblemSm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remindersIconOn: { borderColor: COLORS.border },
  remindersText: { flex: 1 },
  remindersHint: { ...TYPE.bodyMd, marginTop: SPACING.xs },
  remindersAction: {
    minWidth: LAYOUT.iconButton,
    minHeight: LAYOUT.iconButton,
    paddingHorizontal: SPACING.gutterSm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remindersActionText: { ...TYPE.labelMd, fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight, color: COLORS.accent },

  sectionLabel: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    // Cards above end with a 16pt margin, this tops it up to the 24pt section gap
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  tiles: { flexDirection: 'row', gap: SPACING.md },
  tile: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  tileIcon: {
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tileTitle: TYPE.titleMd,
  tileText: { ...TYPE.bodyMd, marginTop: SPACING.xs },
});
