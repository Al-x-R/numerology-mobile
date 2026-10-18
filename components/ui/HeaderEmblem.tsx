// components/ui/HeaderEmblem.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/lib/constants/theme';

export const HeaderEmblem = () => (
  <View style={styles.ring}>
    <MaterialCommunityIcons name="star-four-points-outline" size={16} color={COLORS.accent} />
  </View>
);

const styles = StyleSheet.create({
  ring: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.margin,
  },
});
