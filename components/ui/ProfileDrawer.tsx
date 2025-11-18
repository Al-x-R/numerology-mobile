// components/ui/ProfileDrawer.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@/contexts/ProfileContext';
import { COLORS, SPACING, FONTS, RADIUS } from '@/lib/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '@/lib/constants/locales'; // ← у тебя уже есть

// const formatBirthDate = (dateString: string | null | undefined): string => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return '';
//   const monthsRu = [
//     'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
//     'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
//   ];
//   const monthsEn = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];
//   const months = t('currentLanguage') === "ru" ? monthsRu : monthsEn');
//
//   // Лучше — вынести в локали:
//   // return t('dateFormat', { day: date.getDate(), month: months[date.getMonth()], year: date.getFullYear() })
//   const day = date.getDate();
//   const month = months[date.getMonth()];
//   const year = date.getFullYear();
//   return `${day} ${month} ${year} г.`;
// };

const formatBirthDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year} г.`;
};

export default function ProfileDrawer({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { user, logout, isPremium, activeProfile } = useProfile();

  const displayName = user?.displayName || t('profile.guest');
  const photoURL = user?.photoURL;
  const birthDate = activeProfile?.date || null;

  const handleLogout = () => {
    Alert.alert(
      t('alerts.logout'),
      '',
      [
        { text: t('alerts.cancel'), style: 'cancel' },
        {
          text: t('alerts.logoutButton'),
          style: 'destructive',
          onPress: () => {
            onClose();
            logout();
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('alerts.deleteAccountTitle'),
      t('alerts.deleteAccount'),
      [
        { text: t('alerts.cancel'), style: 'cancel' },
        { text: t('alerts.deleteButton'), style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.closeButtonWrapper}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButtonTouchable}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 60 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.photoContainer}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoFallback]}>
                <Ionicons name="person" size={56} color={COLORS.accent} />
              </View>
            )}
            <TouchableOpacity style={styles.cameraIcon}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.greeting}>{t('profile.hello')}</Text>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{displayName}</Text>
            {isPremium && <Text style={styles.premiumBadge}> Premium</Text>}
          </View>

          {birthDate && (
            <Text style={styles.birthDate}>{formatBirthDate(birthDate)}</Text>
          )}
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={22} color={COLORS.accent} />
            <Text style={styles.menuText}>{t('profile.editProfile')}</Text>
            <Ionicons name="chevron-forward" size={22} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="calendar-outline" size={22} color={COLORS.accent} />
            <Text style={styles.menuText}>{t('profile.changeBirthDate')}</Text>
            <Ionicons name="chevron-forward" size={22} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="globe-outline" size={22} color={COLORS.accent} />
            <Text style={styles.menuText}>{t('profile.changeLanguage')}</Text>
            <Ionicons name="chevron-forward" size={22} color="#666" />
          </TouchableOpacity>

          {isPremium ? (
            <View style={styles.menuItem}>
              <Ionicons name="diamond" size={22} color={COLORS.accent} />
              <Text style={[styles.menuText, styles.premiumActive]}>
                {t('profile.premiumActive')}
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="diamond-outline" size={22} color={COLORS.accent} />
              <Text style={styles.menuText}>{t('profile.getPremium')}</Text>
              <Ionicons name="chevron-forward" size={22} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="add-circle-outline" size={24} color={COLORS.accent} />
            <Text style={[styles.menuText, styles.accentText]}>
              {t('profile.addAccount')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={[styles.menuText, { color: '#FF3B30' }]}>
              {t('profile.logout')}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteItem} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>{t('profile.deleteAccount')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },

  closeButtonWrapper: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'center',
    paddingLeft: SPACING.md,
    zIndex: 10,
  },
  closeButtonTouchable: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 22,
  },

  scrollContent: {
    paddingTop: 90,
    paddingHorizontal: SPACING.xl,
  },

  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  photoFallback: {
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: COLORS.accent,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#121212',
  },
  greeting: {
    ...FONTS.body,
    color: '#BBBBBB',
    marginBottom: 4,
    fontSize: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...FONTS.title,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 26,
  },
  premiumBadge: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
    backgroundColor: 'rgba(224, 184, 115, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  birthDate: {
    ...FONTS.body,
    color: '#888888',
    marginTop: SPACING.sm,
    fontSize: 15,
  },
  menu: {
    marginBottom: SPACING.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xs,
  },
  menuText: {
    ...FONTS.body,
    color: '#DDDDDD',
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: 16,
  },
  premiumActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  accentText: {
    color: COLORS.accent,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: SPACING.xl,
  },
  deleteItem: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '600',
  },
});
