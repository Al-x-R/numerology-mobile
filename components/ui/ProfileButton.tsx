// components/ui/ProfileButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { getAvatarUri, useProfile } from '@/contexts/ProfileContext';
import { COLORS } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';

type Props = {
  onPress?: () => void;
};

export const ProfileButton = ({ onPress }: Props) => {
  const { activeProfile } = useProfile();

  const displayName = activeProfile?.name || t('profile.guest');
  const photoURL = getAvatarUri(activeProfile);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      {photoURL ? (
        <Image source={{ uri: photoURL }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.initial}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    padding: 4, // enlarges the touch area
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  initial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
