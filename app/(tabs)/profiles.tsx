// app/(tabs)/profiles.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@/contexts/ProfileContext';
import ProfileCard from '@/components/ui/ProfileCard';
import PremiumTeaserModal from '@/components/ui/PremiumTeaserModal';
import { COLORS, SPACING, FONTS, RADIUS } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';

export default function ProfilesScreen() {
  const router = useRouter();
  const { profiles, activeProfile, saveProfile, setActiveProfile, isPremium, unlockPremium } = useProfile();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // const handleAddProfile = () => {
    // if (!isPremium && profiles.length >= 1) {
    //   setShowPremiumModal(true);
    // } else {
    //   router.push('/pythagoras');
    // }
  // };

  const handleAddProfile = () => {
    if (!user && profiles.length >= 1) {
      router.push('/(auth)/login');
    } else if (!isPremium && profiles.length >= 1) {
      setShowPremiumModal(true);
    } else {
      router.push('/pythagoras');
    }
  };

  const handleSelectProfile = (profile: any) => {
    setActiveProfile(profile.id);
    router.push('/pythagoras');
  };

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <Text style={styles.title}>{t('profiles.title')}</Text>

      {/* Кнопка + */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddProfile}>
        <Ionicons
          name={isPremium || profiles.length === 0 ? "add" : "lock-closed"}
          size={28}
          color={isPremium ? COLORS.accent : COLORS.textSecondary}
        />
        <Text style={[styles.addText, { color: isPremium ? COLORS.accent : COLORS.textSecondary }]}>
          {t('profiles.add')}
        </Text>
      </TouchableOpacity>

      {/* Список профилей */}
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            isActive={activeProfile?.id === item.id}
            onPress={() => handleSelectProfile(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t('profiles.empty')}</Text>
        }
        contentContainerStyle={styles.list}
      />

      {/* Премиум-модал */}
      <PremiumTeaserModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUnlock={() => {
          unlockPremium();
          setShowPremiumModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
  title: { ...FONTS.sectionTitle, fontSize: 24, color: COLORS.accent, marginBottom: SPACING.lg },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
    justifyContent: 'center',
  },
  addText: { ...FONTS.button, marginLeft: SPACING.sm },
  list: { paddingBottom: SPACING.xl },
  emptyText: { ...FONTS.cardDescription, textAlign: 'center', color: COLORS.textSecondary, marginTop: 50 },
});
