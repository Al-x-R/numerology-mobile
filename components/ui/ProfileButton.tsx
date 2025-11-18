// components/ui/ProfileButton.tsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@/contexts/ProfileContext';
import { COLORS, SPACING } from '@/lib/constants/theme';

export const ProfileButton = () => {
  const { user, setDrawerVisible } = useProfile();
  const photoURL = user?.photoURL;

  return (
    <TouchableOpacity
      onPress={() => setDrawerVisible(true)}
      style={styles.headerButton}
    >
      {photoURL ? (
        <Image source={{ uri: photoURL }} style={styles.headerAvatar} />
      ) : (
        <Ionicons
          name="person-circle-outline"
          size={32}
          color={COLORS.accent}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    marginRight: SPACING.md,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
});
