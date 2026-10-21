// components/ui/LockedForecast.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
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
      <Ionicons name={icon} size={28} color={COLORS.textTertiary} />
    </View>
    <Text style={styles.title} numberOfLines={2}>{title}</Text>
    <Text style={styles.subtitle} numberOfLines={3}>{subtitle}</Text>

    <GoldButton
      title={unlockText}
      onPress={onUnlock}
      icon={<Ionicons name="play-circle-outline" size={20} color={COLORS.blackText} />}
      style={styles.button}
    />

    <TouchableOpacity style={styles.link} onPress={() => router.push('/premium/upgrade')} activeOpacity={0.7}>
      <Text style={styles.linkText}>{premiumText}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  // Fills the scroll area; gold here is the unlock button only
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  medallion: {
    width: LAYOUT.emblemHero,
    height: LAYOUT.emblemHero,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: { ...TYPE.headlineLg, fontFamily: FONT_FAMILY.serif.semibold, textAlign: 'center', marginBottom: SPACING.sm },
  subtitle: { ...TYPE.bodyMd, textAlign: 'center', marginBottom: SPACING.lg },
  button: { alignSelf: 'stretch' },
  // Text link with a 44pt touch area
  link: { marginTop: SPACING.md, minHeight: LAYOUT.minTouch, justifyContent: 'center', paddingHorizontal: SPACING.md },
  linkText: TYPE.labelLg,
});
