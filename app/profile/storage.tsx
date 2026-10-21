// app/profile/storage.tsx
import React from 'react';
import { ActivityIndicator, Alert, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import {
  CalculationKind,
  SAVED_LIMITS,
  SavedCalculation,
  useSavedCalculations,
} from '@/contexts/SavedCalculationsContext';
import { COLORS, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { CapsLabel } from '@/components/ui/CapsLabel';

interface Section {
  kind: CalculationKind;
  title: string;
  empty: string;
  data: SavedCalculation[];
}

// `open` is a one-time token, so opening the same entry twice recalculates it again
const openEntry = (item: SavedCalculation) => {
  const open = Date.now().toString();
  if (item.kind === 'matrix') {
    router.navigate({ pathname: '/(tabs)/pythagoras', params: { date: item.date, open } });
  } else {
    router.navigate({ pathname: '/(tabs)/compatibility', params: { date1: item.date1, date2: item.date2, open } });
  }
};

export default function StorageScreen() {
  const insets = useSafeAreaInsets();
  const { isPremium } = useProfile();
  const { t } = useAppTranslation();
  const { items, isLoaded, loadError, limit, remove } = useSavedCalculations();

  const fill = (key: string, values: Record<string, string>) =>
    Object.entries(values).reduce((text, [name, value]) => text.split(`{${name}}`).join(value), t(key));

  const sections: Section[] = [
    {
      kind: 'matrix',
      title: t('storage.matrices'),
      empty: t('storage.emptyMatrices'),
      data: items.filter(item => item.kind === 'matrix'),
    },
    {
      kind: 'compatibility',
      title: t('storage.compatibility'),
      empty: t('storage.emptyCompatibility'),
      data: items.filter(item => item.kind === 'compatibility'),
    },
  ];

  const confirmRemove = (item: SavedCalculation) => {
    Alert.alert(t('storage.removeTitle'), fill('storage.removeText', { label: item.label }), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.remove'), style: 'destructive', onPress: () => remove(item.id) },
    ]);
  };

  const renderItem = ({ item, index, section }: { item: SavedCalculation; index: number; section: Section }) => {
    const isFirst = index === 0;
    const isLast = index === section.data.length - 1;

    return (
      <TouchableOpacity
        style={[styles.row, isFirst && styles.rowFirst, isLast && styles.rowLast, !isLast && styles.rowDivider]}
        onPress={() => openEntry(item)}
        activeOpacity={0.7}
      >
        <View style={styles.medallion}>
          {item.kind === 'matrix' ? (
            <Ionicons name="grid-outline" size={18} color={COLORS.textTertiary} />
          ) : (
            <MaterialCommunityIcons name="infinity" size={18} color={COLORS.textTertiary} />
          )}
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle} numberOfLines={1}>{item.label}</Text>
          <Text style={styles.rowDates} numberOfLines={1}>
            {item.kind === 'matrix' ? item.date : `${item.date1}  •  ${item.date2}`}
          </Text>
        </View>
        <TouchableOpacity onPress={() => confirmRemove(item)} hitSlop={12} style={styles.removeButton} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Loading and a failed read must not look like an empty storage
  if (!isLoaded || loadError) {
    return (
      <View style={styles.container}>
        <AuraBackground />
        <View style={styles.state}>
          {loadError ? (
            <>
              <Ionicons name="alert-circle-outline" size={24} color={COLORS.error} />
              <Text style={styles.stateText}>{t('storage.loadError')}</Text>
            </>
          ) : (
            <ActivityIndicator color={COLORS.textTertiary} />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AuraBackground />

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + SPACING.lg }]}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <CapsLabel style={styles.sectionLabel}>{section.title}</CapsLabel>
            <Text style={styles.sectionCount}>{section.data.length} / {limit}</Text>
          </View>
        )}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? <Text style={styles.empty}>{section.empty}</Text> : null
        }
        ListFooterComponent={
          isPremium ? null : (
            <TouchableOpacity style={styles.upsell} onPress={() => router.push('/premium/upgrade')} activeOpacity={0.7}>
              <MaterialCommunityIcons name="crown-outline" size={20} color={COLORS.accent} />
              <Text style={styles.upsellText} numberOfLines={2}>{fill('storage.proUpsell', { limit: String(SAVED_LIMITS.pro) })}</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.accent} />
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingTop: SPACING.sm, paddingHorizontal: SPACING.margin },

  state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.lg },
  stateText: { ...TYPE.bodyMd, textAlign: 'center' },

  // 24pt between sections; the first header sits closer to the top
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    marginHorizontal: SPACING.xs,
  },
  sectionLabel: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    color: COLORS.textMuted,
    letterSpacing: 2.2,
  },
  sectionCount: { ...TYPE.bodySm, fontVariant: ['tabular-nums'] },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.gutterSm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.divider,
  },
  rowFirst: { borderTopWidth: 1, borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg },
  rowLast: { borderBottomWidth: 1, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  medallion: {
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: TYPE.bodyLg,
  rowDates: { ...TYPE.bodyMd, marginTop: SPACING.xs },
  removeButton: { padding: SPACING.xs },

  empty: {
    ...TYPE.bodyMd,
    color: COLORS.textMuted,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.hairline,
    textAlign: 'center',
  },

  // The screen's only gold element: the PRO offer for free users
  upsell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceSelected,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  upsellText: { ...TYPE.bodyMd, color: COLORS.textTertiary, flex: 1 },
});
