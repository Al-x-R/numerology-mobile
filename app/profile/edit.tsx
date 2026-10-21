// app/profile/edit.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Modal, StyleSheet, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Expo Router ships its own React Navigation, so the header height comes from its copy
import { useHeaderHeight } from 'expo-router/react-navigation';

import { useProfile } from '@/contexts/ProfileContext';
import { COLORS, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { GoldButton } from '@/components/ui/GoldButton';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { formatBirthDateFromDate, parseLocalDate } from '@/lib/utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTranslation } from '@/contexts/LanguageContext';

// Where the picker opens when no birth date is set yet
const DEFAULT_PICKER_DATE = new Date(2000, 0, 1);

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { updateProfile, activeProfile } = useProfile();

  const [name, setName] = useState(activeProfile?.name || '');
  const [birthDate, setBirthDate] = useState<Date | null>(
    activeProfile?.date ? parseLocalDate(activeProfile.date) : null
  );

  const [tempDate, setTempDate] = useState<Date>(DEFAULT_PICKER_DATE);
  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { t, language } = useAppTranslation();

  // --- Date Picker Logic ---
  const openDatePicker = () => {
    setTempDate(birthDate || DEFAULT_PICKER_DATE);
    setShowPicker(true);
  };

  const onDateChange = (_event: unknown, selectedDate: Date) => {
    if (Platform.OS === 'ios') {
      setTempDate(selectedDate);
    } else {
      setShowPicker(false);
      setBirthDate(selectedDate);
    }
  };

  const confirmIOSDate = () => {
    setBirthDate(tempDate);
    setShowPicker(false);
  };

  const cancelIOSDate = () => {
    setShowPicker(false);
  };
  // ---------------------------


  const saveChanges = async () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('profile.nameRequired'));
      return;
    }

    setIsSaving(true);
    try {
      let dateString = undefined;
      if (birthDate) {
        const year = birthDate.getFullYear();
        const month = String(birthDate.getMonth() + 1).padStart(2, '0');
        const day = String(birthDate.getDate()).padStart(2, '0');
        dateString = `${year}-${month}-${day}`;
      }

      await updateProfile({
        name: name.trim(),
        date: dateString,
      });

      setTimeout(() => {
        router.back();
      }, 500);

    } catch (err: any) {
      console.error(err);
      Alert.alert(t('common.error'), t('errors.tryAgain'));
    } finally {
      setIsSaving(false);
    }
  };

  const getIOSLocale = (lang: string) => {
    switch (lang) {
      case 'ru': return 'ru-RU';
      case 'uk': return 'uk-UA';
      default: return 'en-US';
    }
  };

  return (
    <View style={styles.container}>
      <AuraBackground />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + SPACING.margin }]}
          showsVerticalScrollIndicator={false}
        >

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name field */}
            <View style={styles.field}>
              <Text style={styles.label}>{t('profile.name')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder={t('profile.enterName')}
                  placeholderTextColor={COLORS.placeholder}
                  autoCapitalize="words"
                  maxLength={30}
                />
              </View>
            </View>

            {/* Date of birth field */}
            <View style={styles.field}>
              <Text style={styles.label}>{t('profile.birthDate')}</Text>
              <TouchableOpacity style={styles.dateButton} onPress={openDatePicker} activeOpacity={0.7}>
                <View style={styles.dateValue}>
                  <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <Text style={birthDate ? styles.dateText : styles.placeholderText}>
                    {birthDate ? formatBirthDateFromDate(birthDate) : t('profile.selectDate')}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color={COLORS.chevron} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Save button */}
          <GoldButton title={t('common.save')} onPress={saveChanges} loading={isSaving} />

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Modal (iOS) */}
      {showPicker && Platform.OS === 'ios' ? (
        <Modal transparent animationType="fade" visible={showPicker}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.container} activeOpacity={1} onPress={cancelIOSDate} />
            <View style={[styles.pickerContainer, { paddingBottom: insets.bottom + SPACING.md }]}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity style={styles.pickerButton} onPress={cancelIOSDate} activeOpacity={0.7}>
                  <Text style={styles.cancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pickerButton} onPress={confirmIOSDate} activeOpacity={0.7}>
                  <Text style={styles.doneText}>{t('common.done')}</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onValueChange={onDateChange}
                maximumDate={new Date()}
                themeVariant="dark"
                textColor={COLORS.text}
                style={styles.picker}
                locale={getIOSLocale(language)}
              />
            </View>
          </View>
        </Modal>
      ) : showPicker && (
        <DateTimePicker
          value={birthDate || DEFAULT_PICKER_DATE}
          mode="date"
          display="default"
          onValueChange={onDateChange}
          onDismiss={() => setShowPicker(false)}
          maximumDate={new Date()}
          themeVariant="dark"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: SPACING.margin, paddingTop: SPACING.lg },
  formContainer: { marginBottom: SPACING.lg },
  field: { marginBottom: SPACING.lg },
  // Visible field labels at 12pt, the caption minimum
  label: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { ...TYPE.bodyLg, flex: 1, height: '100%' },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  dateValue: { flexDirection: 'row', alignItems: 'center' },
  dateText: TYPE.bodyLg,
  placeholderText: { ...TYPE.bodyLg, color: COLORS.placeholder },
  modalOverlay: { flex: 1, backgroundColor: COLORS.modalBackdrop, justifyContent: 'flex-end' },
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
