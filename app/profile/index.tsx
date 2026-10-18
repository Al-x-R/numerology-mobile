// app/profile/index.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { useNavigation, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getAvatarUri, useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { COLORS, GRADIENTS, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { formatBirthDate } from '@/lib/utils/date';
import { getZodiacName, getZodiacSign } from '@/lib/calculators/zodiac';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English (EN)',
  ru: 'Русский (RU)',
  uk: 'Українська (UK)',
};

interface MenuRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress: () => void;
  isLast?: boolean;
}

const MenuRow = ({ icon, title, value, onPress, isLast }: MenuRowProps) => (
  <TouchableOpacity style={[styles.row, !isLast && styles.rowDivider]} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.medallion}>
      <Ionicons name={icon} size={20} color={COLORS.accent} />
    </View>
    <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
    {value ? <Text style={styles.rowValue}>{value}</Text> : null}
    <Ionicons name="chevron-forward" size={18} color={COLORS.chevron} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const { activeProfile, isPremium, resetAppData } = useProfile();
  const { t, language } = useAppTranslation();

  const displayName = activeProfile?.name || t('profile.guest');
  const photoURL = getAvatarUri(activeProfile);
  const birthDate = activeProfile?.date || null;
  const zodiac = birthDate ? getZodiacName(getZodiacSign(new Date(birthDate)), language) : null;

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
          await resetAppData();
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + SPACING.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* --- IDENTITY --- */}
        <View style={styles.identity}>
          <View style={styles.avatarRing}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>{displayName.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            {isPremium && (
              <View style={styles.avatarBadge}>
                <MaterialCommunityIcons name="star-four-points" size={12} color={COLORS.accent} />
              </View>
            )}
          </View>

          <Text style={styles.name}>{displayName}</Text>
          {birthDate && (
            <Text style={styles.meta}>
              {formatBirthDate(birthDate)}{zodiac ? `  •  ${zodiac}` : ''}
            </Text>
          )}

          {isPremium && (
            <View style={styles.memberChip}>
              <View style={styles.memberDot} />
              <Text style={styles.memberText}>{t('profile.memberPro')}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile/edit')} activeOpacity={0.8}>
          <Ionicons name="create-outline" size={18} color={COLORS.accent} />
          <Text style={styles.editButtonText}>{t('profile.editProfile')}</Text>
        </TouchableOpacity>

        {/* --- MEMBERSHIP --- */}
        <TouchableOpacity
          style={[styles.proCard, isPremium && styles.proCardActive]}
          onPress={() => router.push('/premium/upgrade')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={GRADIENTS.accentCard} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={styles.proHeader}>
            <View style={styles.proLabelRow}>
              <View style={styles.proIcon}>
                <MaterialCommunityIcons name="crown-outline" size={18} color={COLORS.accent} />
              </View>
              <Text style={styles.proLabel}>{t('profile.proCardLabel')}</Text>
            </View>
            {isPremium && (
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>{t('profile.proActiveBadge')}</Text>
              </View>
            )}
          </View>
          <Text style={styles.proTitle}>
            {isPremium ? t('profile.proActiveTitle') : t('profile.proUpsellTitle')}
          </Text>
          <Text style={styles.proDescription}>
            {isPremium ? t('profile.proActiveDescription') : t('profile.proUpsellDescription')}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.accent} style={styles.proArrow} />
        </TouchableOpacity>

        {/* --- SETTINGS --- */}
        <Text style={styles.sectionLabel}>{t('profile.sectionSettings')}</Text>
        <View style={styles.module}>
          <MenuRow
            icon="globe-outline"
            title={t('profile.changeLanguage')}
            value={LANGUAGE_LABELS[language]}
            onPress={() => router.push('/profile/language')}
          />
          <MenuRow
            icon="diamond-outline"
            title={t('profile.subscription')}
            value={isPremium ? 'PRO' : t('profile.subscriptionFree')}
            onPress={() => router.push('/premium/upgrade')}
            isLast
          />
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleResetData} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={16} color={COLORS.error} />
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
  scrollContent: { paddingTop: SPACING.lg, paddingHorizontal: SPACING.margin },

  // --- IDENTITY ---
  identity: { alignItems: 'center', marginBottom: SPACING.lg },
  avatarRing: {
    padding: 3,
    borderRadius: 64,
    borderWidth: 1.5,
    borderColor: COLORS.borderSelected,
    marginBottom: SPACING.md,
    ...SHADOWS.goldenButtonSoft,
  },
  avatar: { width: 112, height: 112, borderRadius: 56 },
  avatarFallback: {
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { ...TYPE.displayLg, fontSize: 44, lineHeight: 52, color: COLORS.accent },
  avatarBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.borderSelected,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { ...TYPE.displayLg, textAlign: 'center' },
  meta: { ...TYPE.bodyMd, marginTop: SPACING.xs, textAlign: 'center' },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
  },
  memberDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.accent },
  memberText: { ...TYPE.labelMd, color: COLORS.accent },

  editButton: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.lg,
  },
  editButtonText: { ...TYPE.labelLg },

  // --- MEMBERSHIP ---
  proCard: {
    overflow: 'hidden',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  proCardActive: { borderColor: COLORS.borderAccent },
  proHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  proLabelRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  proIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proLabel: { ...TYPE.labelLg },
  proBadge: {
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentSoft,
  },
  proBadgeText: { ...TYPE.bodySm, color: COLORS.accent },
  proTitle: { ...TYPE.headlineLg, marginBottom: SPACING.sm },
  proDescription: { ...TYPE.bodyMd, color: COLORS.textTertiary, paddingRight: SPACING.lg },
  proArrow: { alignSelf: 'flex-end', marginTop: SPACING.sm },

  // --- SETTINGS ---
  sectionLabel: { ...TYPE.labelMd, marginBottom: SPACING.sm, marginLeft: SPACING.xs },
  module: {
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, gap: SPACING.md },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  medallion: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTitle: { ...TYPE.titleMd, flex: 1 },
  rowValue: { ...TYPE.bodyMd },

  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: 54,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  resetText: { ...TYPE.labelLg, color: COLORS.error },
  version: { ...TYPE.bodySm, color: COLORS.textMuted, textAlign: 'center' },
});
