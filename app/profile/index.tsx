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
import { getAvatarUri, useProfile } from '@/contexts/ProfileContext';
import { COLORS, SPACING, FONTS, RADIUS, GRADIENTS } from '@/lib/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { t } from '@/lib/constants/locales';
import { formatBirthDate } from '@/lib/utils/date';
import { useNavigation, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTranslation } from '@/contexts/LanguageContext';

type Props = {
  onClose: () => void;
};

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  onPress?: () => void;
  color?: string;
  isPremiumAction?: boolean;
}

const MenuItem = ({
  icon,
  text,
  onPress,
  color = COLORS.text,
  isPremiumAction = false
}: MenuItemProps) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    disabled={!onPress && !isPremiumAction}
  >
    <Ionicons name={icon} size={22} color={isPremiumAction ? COLORS.accent : COLORS.accent} />

    <Text style={[styles.menuText, { color }]}>{text}</Text>

    {isPremiumAction ? (
      <LinearGradient
        colors={GRADIENTS.button}
        style={styles.upgradeButton}
      >

        <MaterialCommunityIcons name="crown" size={16} color={COLORS.blackText} />
      </LinearGradient>
    ) : (
      <Ionicons name="chevron-forward" size={22} color={COLORS.textSecondary} />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { activeProfile, isPremium, resetAppData } = useProfile();
  const { t, language } = useAppTranslation();

  const displayName = activeProfile?.name || t('profile.guest');
  const photoURL = getAvatarUri(activeProfile);
  const birthDate = activeProfile?.date || null;

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('profile.title'),
    });
  }, [language, navigation]);

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

  const handleUpgrade = () => {
    router.push('/premium/upgrade');
  };

  return (
    <View style={[styles.container]}>

      <LinearGradient colors={GRADIENTS.background} style={StyleSheet.absoluteFill} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <View style={styles.photoContainer}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoFallback]}>
                <Ionicons name="person" size={56} color={COLORS.accent} />
              </View>
            )}

          </View>

          {/*<Text style={styles.greeting}>{t('profile.hello')}</Text>*/}

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{displayName}</Text>
            {isPremium && (
              <View style={styles.premiumBadgeContainer}>
                <Text style={styles.premiumBadgeText}>PRO</Text>
              </View>
            )}
          </View>

          {birthDate && (
            <Text style={styles.birthDate}>{formatBirthDate(birthDate)}</Text>
          )}
        </View>

        {/* --- MENU --- */}
        <View style={styles.menu}>
          <MenuItem
            icon="person-outline"
            text={t('profile.editProfile')}
            onPress={() => router.push('/profile/edit')}
          />

          <MenuItem
            icon="globe-outline"
            text={t('profile.changeLanguage')}
            onPress={() => router.push('/profile/language')}
          />

          {isPremium ? (
            <MenuItem
              icon="diamond"
              text={t('profile.premiumActive')}
              color={COLORS.accent}
              onPress={() => { router.push('/premium/upgrade'); }}
            />
          ) : (
            <MenuItem
              icon="diamond-outline"
              text={t('profile.getPremium')}
              onPress={handleUpgrade}
              isPremiumAction={true}
            />
          )}
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.deleteItem} onPress={handleResetData}>
          <Text style={styles.deleteText}>{t('profile.resetData')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingTop: 60, paddingHorizontal: SPACING.xl },

  // --- HEADER ---
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  photoContainer: { position: 'relative', marginBottom: SPACING.lg },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  photoFallback: {
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  greeting: { ...FONTS.body, color: COLORS.textSecondary, marginBottom: 4, fontSize: 14 },
  nameContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { ...FONTS.title, color: COLORS.text, fontWeight: '700', fontSize: 24 },

  premiumBadgeContainer: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  premiumBadgeText: {
    color: COLORS.blackText,
    fontWeight: '800',
    fontSize: 10,
  },
  birthDate: { ...FONTS.body, color: COLORS.textSecondary, marginTop: SPACING.sm, fontSize: 14 },

  // --- MENU ---
  menu: { marginBottom: SPACING.lg },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  menuText: {
    ...FONTS.body,
    color: COLORS.text,
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: 16,
    fontWeight: '500',
  },

  // Upgrade button (Gradient)
  upgradeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: { height: 1, backgroundColor: COLORS.hairline, marginVertical: SPACING.lg },

  deleteItem: { alignItems: 'center', marginTop: SPACING.md, paddingVertical: SPACING.md },
  deleteText: { color: COLORS.error, fontSize: 14, fontWeight: '500', opacity: 0.8 },
});
