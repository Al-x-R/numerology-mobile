// components/ui/SegmentedTabs.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';

interface SegmentedTabsProps<T extends string> {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}

export function SegmentedTabs<T extends string>({ tabs, active, onChange }: SegmentedTabsProps<T>) {
  const select = (key: T) => {
    if (key === active) return;
    Haptics.selectionAsync();
    onChange(key);
  };

  return (
    <View style={styles.container} accessibilityRole="tablist">
      {tabs.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => select(key)}
            style={[styles.tab, isActive && styles.tabActive]}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>{label}</Text>
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
    padding: SPACING.xs,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    height: LAYOUT.minTouch,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Gold marks the active tab only
  tabActive: {
    backgroundColor: COLORS.surfaceSelected,
    borderColor: COLORS.borderAccent,
  },
  label: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    color: COLORS.textSecondary,
  },
  labelActive: {
    color: COLORS.accent,
  },
});
