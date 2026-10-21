// app/profile/index.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { useNavigation, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useSavedCalculations } from '@/contexts/SavedCalculationsContext';
import { formatReminderTime, hasActiveReminders } from '@/lib/notifications/forecastReminders';
import { COLORS, FONT_FAMILY, GRADIENTS, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { CapsLabel } from '@/components/ui/CapsLabel';
import { formatBirthDate } from '@/lib/utils/date';
import { toRoman } from '@/lib/utils/roman';
import { pluralize } from '@/lib/utils/plural';
import { tArray } from '@/lib/constants/locales';
import { getZodiacName, getZodiacSign } from '@/lib/calculators/zodiac';
import { calculatePythagoreanSquare } from '@/lib/calculators/pythagoreanSquare';

const PRIVACY_URL = 'https://telegra.ph/Privacy-Policy-for-Destiny-Code-01-03';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English (EN)',
  ru: 'Русский (RU)',
  uk: 'Українська (UK)',
};

interface MenuRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: React.ReactNode;
  onPress: () => void;
  isLast?: boolean;
}

const MenuRow = ({ icon, title, value, onPress, isLast }: MenuRowProps) => (
  <TouchableOpacity style={[styles.row, !isLast && styles.rowDivider]} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.medallion}>
      <Ionicons name={icon} size={18} color={COLORS.textTertiary} />
    </View>
    <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
    {typeof value === 'string' ? <Text style={styles.rowValue} numberOfLines={1}>{value}</Text> : value}
    <Ionicons name="chevron-forward" size={18} color={COLORS.chevron} />
  </TouchableOpacity>
);

const ProBadge = () => (
  <View style={styles.proChip}>
    <CapsLabel style={styles.proChipText}>PRO</CapsLabel>
  </View>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const { activeProfile, isPremium, resetAppData } = useProfile();
  const { t, language } = useAppTranslation();
  const { settings: reminders } = useNotifications();
  const { items: savedItems, clear: clearSaved } = useSavedCalculations();

  const displayName = activeProfile?.name || t('profile.guest');
  const birthDate = activeProfile?.date || null;
  const zodiacSign = birthDate ? getZodiacSign(new Date(birthDate)) : null;
  const destinyNumber = birthDate
    ? calculatePythagoreanSquare(new Date(birthDate)).additionalParams.destinyNumber
    : null;

  const remindersValue = !isPremium
    ? <ProBadge />
    : hasActiveReminders(reminders) ? formatReminderTime(reminders) : t('notifications.statusOff');

  const storageValue = savedItems.length
    ? `${savedItems.length} ${pluralize(savedItems.length, tArray('storage.countForms', language), language)}`
    : t('storage.empty');

  useEffect(() => {
    navigation.setOptions({ headerTitle: t('profile.title').toUpperCase() });
  }, [language, navigation, t]);

  const handleResetData = () => {
    Alert.alert(t('alerts.resetDataTitle'), t('alerts.resetData'), [
      { text: t('alerts.cancel'), style: 'cancel' },
      {
        text: t('alerts.resetButton'),
        style: 'destructive',
        onPress: async () => {
          await Promise.all([resetAppData(), clearSaved()]);
          if (router.canDismiss()) router.dismissAll();
          router.replace('/(auth)/onboarding');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <AuraBackground />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* --- IDENTITY --- */}
        <View style={styles.identity}>
          {destinyNumber ? (
            <View style={styles.destinyChip}>
              <View style={styles.destinyDot} />
              <CapsLabel style={styles.destinyText}>
                {`${t('profile.destinyCode')}: ${toRoman(destinyNumber)}`}
              </CapsLabel>
            </View>
          ) : null}

          <Text style={styles.name} numberOfLines={2}>{displayName}</Text>

          {birthDate && zodiacSign && (
            <View style={styles.metaRow}>
              <Text style={styles.meta}>{formatBirthDate(birthDate)}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={[styles.meta, styles.metaAccent]}>{getZodiacName(zodiacSign, language)}</Text>
              <MaterialCommunityIcons name={`zodiac-${zodiacSign}`} size={16} color={COLORS.textSecondary} />
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile/edit')} activeOpacity={0.7}>
          <Ionicons name="pencil-outline" size={16} color={COLORS.accent} />
          <CapsLabel style={styles.editButtonText}>{t('profile.editProfile')}</CapsLabel>
        </TouchableOpacity>

        {/* --- MEMBERSHIP --- */}
        <TouchableOpacity
          style={[styles.proCard, isPremium && styles.proCardActive]}
          onPress={() => router.push('/premium/upgrade')}
          activeOpacity={0.7}
        >
          <LinearGradient colors={GRADIENTS.proCard} style={StyleSheet.absoluteFill} />

          <View style={styles.proHeader}>
            <View style={styles.proLabelRow}>
              <View style={styles.proIcon}>
                <MaterialCommunityIcons name="crown-outline" size={16} color={COLORS.accent} />
              </View>
              <CapsLabel style={styles.proLabel}>{t('profile.proCardLabel')}</CapsLabel>
            </View>
            {isPremium && (
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>{t('profile.proActiveBadge')}</Text>
              </View>
            )}
          </View>

          <Text style={styles.proTitle} numberOfLines={2}>
            {isPremium ? t('profile.proActiveTitle') : t('profile.proUpsellTitle')}
          </Text>
          <Text style={styles.proDescription} numberOfLines={3}>
            {isPremium ? t('profile.proActiveDescription') : t('profile.proUpsellDescription')}
          </Text>

          <View style={styles.proArrow}>
            <Ionicons name="arrow-forward" size={16} color={COLORS.accent} />
          </View>
        </TouchableOpacity>

        {/* --- SETTINGS --- */}
        <CapsLabel style={styles.sectionLabel}>{t('profile.sectionSettings')}</CapsLabel>
        <View style={styles.module}>
          <MenuRow
            icon="globe-outline"
            title={t('profile.changeLanguage')}
            value={LANGUAGE_LABELS[language]}
            onPress={() => router.push('/profile/language')}
          />
          <MenuRow
            icon="notifications-outline"
            title={t('notifications.title')}
            value={remindersValue}
            onPress={() => router.push('/profile/notifications')}
          />
          <MenuRow
            icon="archive-outline"
            title={t('storage.title')}
            value={storageValue}
            onPress={() => router.push('/profile/storage')}
          />
          <MenuRow
            icon="shield-checkmark-outline"
            title={t('profile.privacy')}
            onPress={() => Linking.openURL(PRIVACY_URL)}
            isLast
          />
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleResetData} activeOpacity={0.7}>
          <Text style={styles.resetText}>{t('profile.resetData')}</Text>
        </TouchableOpacity>

        <Text style={styles.version}>
          {t('profile.version')}: {Constants.expoConfig?.version}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingTop: SPACING.sm, paddingHorizontal: SPACING.margin },

  // --- IDENTITY ---
  // Neutral by design: the PRO card below is the screen's single gold element
  identity: { alignItems: 'center', marginBottom: SPACING.lg },
  destinyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.gutterSm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: SPACING.md,
  },
  destinyDot: { width: SPACING.sm, height: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.textSecondary },
  destinyText: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    color: COLORS.textTertiary,
    letterSpacing: 2.2,
  },
  name: { ...TYPE.displayLg, fontFamily: FONT_FAMILY.serif.semibold, textAlign: 'center' },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  meta: TYPE.bodyMd,
  metaAccent: { color: COLORS.textTertiary },
  metaDot: TYPE.bodyMd,

  editButton: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: SPACING.lg,
  },
  editButtonText: { ...TYPE.labelLg, letterSpacing: 2.4 },

  // --- MEMBERSHIP ---
  proCard: {
    overflow: 'hidden',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  proCardActive: { borderColor: COLORS.borderAccent },
  proHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  proLabelRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  proIcon: {
    width: LAYOUT.iconBadge,
    height: LAYOUT.iconBadge,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSelected,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proLabel: { ...TYPE.labelLg, letterSpacing: 2.6 },
  proBadge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.gutterSm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
  },
  proBadgeText: { ...TYPE.bodySm, color: COLORS.accent },
  proTitle: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.semibold, marginBottom: SPACING.sm },
  proDescription: { ...TYPE.bodyMd, paddingRight: SPACING.lg },
  proArrow: {
    alignSelf: 'flex-end',
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- SETTINGS ---
  sectionLabel: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    color: COLORS.textMuted,
    letterSpacing: 2.2,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  module: {
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.gutterSm, gap: SPACING.md },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  medallion: {
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTitle: { ...TYPE.bodyLg, flex: 1 },
  // A long value (e.g. "Українська (UK)") truncates instead of pushing the title out
  rowValue: { ...TYPE.bodyMd, flexShrink: 1, maxWidth: '50%' },
  proChip: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  proChipText: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    color: COLORS.accent,
    letterSpacing: 1,
  },

  // Destructive action: danger color, confirmed by an alert
  resetButton: {
    alignSelf: 'center',
    minHeight: LAYOUT.minTouch,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  resetText: { ...TYPE.bodyMd, color: COLORS.error, letterSpacing: 0.6 },
  version: { ...TYPE.bodySm, color: COLORS.textMuted, textAlign: 'center' },
});
