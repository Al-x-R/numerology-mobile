// components/ui/ProfileDrawer.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@/contexts/ProfileContext';
import { COLORS, SPACING, FONTS, RADIUS } from '@/lib/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '@/lib/constants/locales';
import { formatBirthDate } from '@/lib/utils/date';
import { useRouter } from 'expo-router';

type Props = {
  onClose: () => void;
};

export default function ProfileDrawer({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, activeProfile } = useProfile();

  const isGuest = !user;
  const displayName = isGuest
    ? t('profile.guest')
    : (user?.displayName || activeProfile?.name || t('profile.guest'));

  const isPremium = user?.isPremium;
  const photoURL = user?.photoURL;
  const birthDate = activeProfile?.date || null;

  const handleLogout = () => {
    Alert.alert(t('alerts.logout'), '', [
      { text: t('alerts.cancel'), style: 'cancel' },
      {
        text: t('alerts.logoutButton'),
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleUpgrade = () => {
    if (isGuest) {
      // Если гость хочет купить, сначала логиним его, потом шлем на апгрейд
      // handleLogin('/(app)/premium/upgrade');
      router.push('/premium/upgrade');
    } else {
      // Если свой, сразу на апгрейд
      router.push('/premium/upgrade');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/*<View style={styles.closeButtonWrapper}>*/}
      {/*  <TouchableOpacity onPress={onClose} style={styles.closeButtonTouchable}>*/}
      {/*    <Ionicons name="close" size={28} color="#fff" />*/}
      {/*  </TouchableOpacity>*/}
      {/*</View>*/}

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 60 },
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
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              router.push('/profile/edit');
            }}
          >
            <Ionicons name="person-outline" size={22} color={COLORS.accent} />
            <Text style={styles.menuText}>{t('profile.editProfile')}</Text>
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
            <TouchableOpacity style={styles.menuItem} onPress={handleUpgrade}>
              <Ionicons name="diamond-outline" size={22} color={COLORS.accent} />
              <Text style={styles.menuText}>{t('profile.getPremium')}</Text>
              <Ionicons name="chevron-forward" size={22} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.menu}>
          {isGuest && (
            <TouchableOpacity style={styles.menuItem} onPress={handleLogin}>
              <Ionicons name="log-in-outline" size={24} color={COLORS.accent} />
              <Text style={[styles.menuText, styles.accentText]}>
                {t('profile.loginOrRegister')}
              </Text>
              <Ionicons name="chevron-forward" size={22} color="#666" />
            </TouchableOpacity>
          )}

          {!isGuest && (
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <Text style={[styles.menuText, { color: '#FF3B30' }]}>
                {t('profile.logout')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!isGuest && (
          <TouchableOpacity style={styles.deleteItem}>
            <Text style={styles.deleteText}>{t('profile.deleteAccount')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  closeButtonWrapper: {
    position: 'absolute',
    top: 25,
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
  scrollContent: { paddingTop: 90, paddingHorizontal: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  photoContainer: { position: 'relative', marginBottom: SPACING.lg },
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
  greeting: { ...FONTS.body, color: '#BBBBBB', marginBottom: 4, fontSize: 16 },
  nameContainer: { flexDirection: 'row', alignItems: 'center' },
  name: { ...FONTS.title, color: '#FFFFFF', fontWeight: '700', fontSize: 26 },
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
  birthDate: { ...FONTS.body, color: '#888888', marginTop: SPACING.sm, fontSize: 15 },
  menu: { marginBottom: SPACING.lg },
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
  premiumActive: { color: COLORS.accent, fontWeight: '600' },
  accentText: { color: COLORS.accent },
  divider: { height: 1, backgroundColor: '#333333', marginVertical: SPACING.xl },
  deleteItem: { alignItems: 'center', marginTop: SPACING.xl, paddingVertical: SPACING.lg },
  deleteText: { color: '#FF3B30', fontSize: 15, fontWeight: '600' },
});
