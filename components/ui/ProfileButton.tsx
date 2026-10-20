// components/ui/ProfileButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useProfile } from '@/contexts/ProfileContext';
import { COLORS, SPACING, TYPE } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';

type Props = {
  onPress?: () => void;
};

export const ProfileButton = ({ onPress }: Props) => {
  const { activeProfile } = useProfile();

  const displayName = activeProfile?.name || t('profile.guest');

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      <View style={styles.avatarFallback}>
        <Text style={styles.initial}>
          {displayName.charAt(0).toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SPACING.margin,
    padding: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(242, 202, 80, 0.3)',
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    ...TYPE.headlineMd,
    fontSize: 17,
    lineHeight: 20,
    color: COLORS.accent,
  },
});
