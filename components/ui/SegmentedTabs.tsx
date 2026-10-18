// components/ui/SegmentedTabs.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';

interface SegmentedTabsProps<T extends string> {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}

export function SegmentedTabs<T extends string>({ tabs, active, onChange }: SegmentedTabsProps<T>) {
  return (
    <View style={styles.container}>
      {tabs.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            style={[styles.tab, isActive && styles.tabActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    padding: 4,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.surfaceSelected,
    borderColor: COLORS.borderAccent,
  },
  label: {
    ...TYPE.labelMd,
    color: COLORS.iconInactive,
  },
  labelActive: {
    color: COLORS.accent,
  },
});
