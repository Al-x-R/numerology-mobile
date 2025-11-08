// components/ui/ProfileCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDailyNumber } from '@/hooks/useDailyNumber';
import { COLORS, SPACING, FONTS, RADIUS } from '@/lib/constants/theme';

interface ProfileCardProps {
  profile: any;
  isActive: boolean;
  onPress: () => void;
}

export default function ProfileCard({ profile, isActive, onPress }: ProfileCardProps) {
  const daily = useDailyNumber(profile);

  return (
    <TouchableOpacity style={[styles.card, isActive && styles.active]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{profile.name}</Text>
        {isActive && <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />}
      </View>

      <Text style={styles.date}>{profile.date}</Text>

      {daily && (
        <View style={styles.daily}>
          <Text style={styles.dailyLabel}>Число дня:</Text>
          <Text style={styles.dailyNumber}>{daily.number}</Text>
        </View>
      )}

      {profile.isPremium && (
        <View style={styles.premiumBadge}>
          <Ionicons name="star" size={14} color={COLORS.accent} />
          <Text style={styles.premiumText}>Премиум</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  active: { borderColor: COLORS.accent, borderWidth: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...FONTS.sectionTitle, fontSize: 18, color: COLORS.text },
  date: { ...FONTS.cardDescription, color: COLORS.textSecondary, marginTop: 4 },
  daily: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  dailyLabel: { ...FONTS.batteryLabel, color: COLORS.textSecondary },
  dailyNumber: { ...FONTS.fateValue, fontSize: 18, marginLeft: 6, color: COLORS.accent },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  premiumText: { ...FONTS.batteryLabel, color: COLORS.accent, marginLeft: 4 },
});
