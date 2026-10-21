// app/profile/notifications.tsx
import React, { useState } from 'react';
import { Linking, Modal, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { formatReminderTime, hasActiveReminders, ReminderSettings } from '@/lib/notifications/forecastReminders';
import { COLORS, FONT_FAMILY, GRADIENTS, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { GoldButton } from '@/components/ui/GoldButton';
import { ProChip } from '@/components/ui/ProChip';

const PICKER_LOCALES: Record<string, string> = { ru: 'ru-RU', uk: 'uk-UA', en: 'en-US' };

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  hint: string;
  value: boolean;
  locked: boolean;
  // Saved settings are not read yet, so a toggle would save defaults over them
  disabled: boolean;
  onChange: (value: boolean) => void;
  isLast?: boolean;
}

const openUpgrade = () => router.push('/premium/upgrade');

const ToggleRow = ({ icon, title, hint, value, locked, disabled, onChange, isLast }: ToggleRowProps) => (
  <TouchableOpacity
    style={[styles.row, !isLast && styles.rowDivider]}
    onPress={() => (locked ? openUpgrade() : onChange(!value))}
    disabled={!locked && disabled}
    activeOpacity={0.7}
  >
    <View style={styles.medallion}>{icon}</View>
    <View style={styles.rowText}>
      <Text style={styles.rowTitle} numberOfLines={2}>{title}</Text>
      <Text style={styles.rowHint} numberOfLines={2}>{hint}</Text>
    </View>
    {locked ? (
      <ProChip />
    ) : (
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: COLORS.surfaceRaised, true: COLORS.accentAmber }}
        thumbColor={COLORS.text}
        ios_backgroundColor={COLORS.surfaceRaised}
      />
    )}
  </TouchableOpacity>
);

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { isPremium } = useProfile();
  const { t, language } = useAppTranslation();
  const { settings, permissionGranted, isLoaded, updateSettings } = useNotifications();

  const [showPicker, setShowPicker] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());
  const [refused, setRefused] = useState(false);

  const locked = !isPremium;
  const timeValue = new Date();
  timeValue.setHours(settings.hour, settings.minute, 0, 0);

  const remindersActive = hasActiveReminders(settings);

  const openTimePicker = () => {
    if (locked) return openUpgrade();
    if (!isLoaded) return;
    setTempTime(timeValue);
    setShowPicker(true);
  };

  const toggle = async (patch: Partial<ReminderSettings>) => {
    if (!(await updateSettings(patch))) setRefused(true);
  };

  const saveTime = (date: Date) => {
    setShowPicker(false);
    updateSettings({ hour: date.getHours(), minute: date.getMinutes() });
  };

  const onTimeChange = (_event: unknown, selected: Date) => {
    if (Platform.OS === 'ios') {
      setTempTime(selected);
    } else {
      saveTime(selected);
    }
  };

  // Shown after a refused permission prompt, or when notifications were later turned off in system settings
  const showDenied = !locked && permissionGranted === false && (refused || remindersActive);

  return (
    <View style={styles.container}>
      <AuraBackground />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>{t('notifications.eyebrow')}</Text>
        <Text style={styles.description}>{t('notifications.description')}</Text>

        {locked && (
          <View style={styles.proCard}>
            <LinearGradient colors={GRADIENTS.accentCard} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.proIcon}>
              <MaterialCommunityIcons name="crown-outline" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.proTitle} numberOfLines={2}>{t('notifications.proTitle')}</Text>
            <Text style={styles.proText} numberOfLines={4}>{t('notifications.proText')}</Text>
            <GoldButton title={t('notifications.proButton')} onPress={openUpgrade} />
          </View>
        )}

        {showDenied && (
          <View style={styles.deniedCard}>
            <Ionicons name="notifications-off-outline" size={22} color={COLORS.warningChipText} />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle} numberOfLines={2}>{t('notifications.deniedTitle')}</Text>
              <Text style={styles.rowHint} numberOfLines={3}>{t('notifications.deniedText')}</Text>
              <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.deniedLink} activeOpacity={0.7}>
                <Text style={styles.deniedLinkText}>{t('notifications.openSettings')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.module}>
          <ToggleRow
            icon={<Ionicons name="sparkles-outline" size={20} color={COLORS.textTertiary} />}
            title={t('notifications.dayNumber')}
            hint={t('notifications.dayNumberHint')}
            value={settings.dayNumber}
            locked={locked}
            disabled={!isLoaded}
            onChange={dayNumber => toggle({ dayNumber })}
          />
          <ToggleRow
            icon={<Ionicons name="moon-outline" size={20} color={COLORS.textTertiary} />}
            title={t('notifications.horoscope')}
            hint={t('notifications.horoscopeHint')}
            value={settings.horoscope}
            locked={locked}
            disabled={!isLoaded}
            onChange={horoscope => toggle({ horoscope })}
            isLast
          />
        </View>

        <View style={styles.module}>
          <TouchableOpacity style={styles.row} onPress={openTimePicker} activeOpacity={0.7}>
            <View style={styles.medallion}>
              <Ionicons name="time-outline" size={20} color={COLORS.textTertiary} />
            </View>
            <Text style={[styles.rowTitle, styles.rowText]} numberOfLines={1}>{t('notifications.time')}</Text>
            {locked ? (
              <ProChip />
            ) : (
              <>
                {/* Gold only while some reminder is on: the time is then actually in use */}
                <Text style={[styles.timeValue, remindersActive && styles.timeValueActive]}>{formatReminderTime(settings)}</Text>
                <Ionicons name="chevron-forward" size={18} color={COLORS.chevron} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showPicker && Platform.OS === 'ios' ? (
        <Modal transparent animationType="fade" visible={showPicker}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setShowPicker(false)} />
            <View style={[styles.pickerContainer, { paddingBottom: insets.bottom + SPACING.md }]}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker(false)} activeOpacity={0.7}>
                  <Text style={styles.cancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pickerButton} onPress={() => saveTime(tempTime)} activeOpacity={0.7}>
                  <Text style={styles.doneText}>{t('common.done')}</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                onValueChange={onTimeChange}
                themeVariant="dark"
                textColor={COLORS.text}
                style={styles.picker}
                locale={PICKER_LOCALES[language]}
              />
            </View>
          </View>
        </Modal>
      ) : showPicker && (
        <DateTimePicker
          value={timeValue}
          mode="time"
          is24Hour
          display="default"
          onValueChange={onTimeChange}
          onDismiss={() => setShowPicker(false)}
          themeVariant="dark"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingTop: SPACING.lg, paddingHorizontal: SPACING.margin },

  // Caption at 12pt, neutral: gold here is reserved for the PRO offer and active states
  eyebrow: { ...TYPE.labelMd, fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight, marginBottom: SPACING.sm },
  description: { ...TYPE.bodyMd, marginBottom: SPACING.lg },

  proCard: {
    overflow: 'hidden',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    marginBottom: SPACING.lg,
  },
  proIcon: {
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  proTitle: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.semibold, marginBottom: SPACING.sm },
  proText: { ...TYPE.bodyMd, color: COLORS.textTertiary, marginBottom: SPACING.lg },

  deniedCard: {
    flexDirection: 'row',
    gap: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.warningChip,
    marginBottom: SPACING.lg,
  },
  deniedLink: { alignSelf: 'flex-start', minHeight: LAYOUT.minTouch, justifyContent: 'center', marginTop: SPACING.xs },
  deniedLinkText: TYPE.labelLg,

  module: {
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, gap: SPACING.md },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  medallion: {
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: TYPE.titleMd,
  rowHint: { ...TYPE.bodyMd, marginTop: SPACING.xs },
  timeValue: { ...TYPE.titleMd, color: COLORS.textSecondary },
  timeValueActive: { color: COLORS.accent },

  modalOverlay: { flex: 1, backgroundColor: COLORS.modalBackdrop, justifyContent: 'flex-end' },
  modalDismiss: { flex: 1 },
  pickerContainer: {
    backgroundColor: COLORS.surfaceRaised,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    alignItems: 'center',
  },
  pickerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  // Text-only buttons get a 44pt touch area
  pickerButton: { minHeight: LAYOUT.minTouch, justifyContent: 'center', paddingHorizontal: SPACING.sm },
  picker: { backgroundColor: COLORS.surfaceRaised, height: 200, width: '100%' },
  cancelText: { ...TYPE.labelLg, color: COLORS.ghost },
  doneText: TYPE.labelLg,
});
