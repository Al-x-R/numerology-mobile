// components/ui/LockedForecast.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
import { GoldButton } from '@/components/ui/GoldButton';

interface LockedForecastProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  unlockText: string;
  premiumText: string;
  onUnlock: () => void;
}

export const LockedForecast = ({ icon, title, subtitle, unlockText, premiumText, onUnlock }: LockedForecastProps) => (
  <View style={styles.card}>
    <View style={styles.medallion}>
      <Ionicons name={icon} size={28} color={COLORS.accent} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>

    <GoldButton
      title={unlockText}
      onPress={onUnlock}
      icon={<Ionicons name="play-circle-outline" size={20} color={COLORS.blackText} />}
      style={styles.button}
    />

    <TouchableOpacity style={styles.link} onPress={() => router.push('/premium/upgrade')}>
      <Text style={styles.linkText}>{premiumText}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 360,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  medallion: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.goldenButtonSoft,
  },
  title: { ...TYPE.headlineLg, textAlign: 'center', marginBottom: SPACING.sm },
  subtitle: { ...TYPE.bodyMd, textAlign: 'center', marginBottom: SPACING.xl },
  button: { alignSelf: 'stretch' },
  link: { marginTop: SPACING.lg, padding: SPACING.sm },
  linkText: TYPE.labelLg,
});
