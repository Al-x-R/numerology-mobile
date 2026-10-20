// app/profile/edit.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Modal, StyleSheet, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useProfile } from '@/contexts/ProfileContext';
import { COLORS, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { GoldButton } from '@/components/ui/GoldButton';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { formatBirthDateFromDate } from '@/lib/utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTranslation } from '@/contexts/LanguageContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateProfile, activeProfile } = useProfile();

  const [name, setName] = useState(activeProfile?.name || '');
  const [birthDate, setBirthDate] = useState<Date | null>(
    activeProfile?.date ? new Date(activeProfile.date) : null
  );

  const [tempDate, setTempDate] = useState<Date>(new Date('2000-01-01'));
  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { t, language } = useAppTranslation();

  // --- Date Picker Logic ---
  const openDatePicker = () => {
    setTempDate(birthDate || new Date('2000-01-01'));
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
    <View style={{ flex: 1 }}>
      <AuraBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        >

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name field */}
            <View style={styles.field}>
              <Text style={styles.label}>{t('profile.name')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={COLORS.accent} style={styles.inputIcon} />
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
              <TouchableOpacity style={styles.dateButton} onPress={openDatePicker}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="calendar-outline" size={18} color={COLORS.accent} style={styles.inputIcon} />
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
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={cancelIOSDate} />
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={cancelIOSDate}>
                  <Text style={styles.cancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmIOSDate}>
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
                textColor="white"
                style={{ backgroundColor: COLORS.surfaceRaised, height: 200, width: '100%' }}
                locale={getIOSLocale(language)}
              />
            </View>
          </View>
        </Modal>
      ) : showPicker && (
        <DateTimePicker
          value={birthDate || new Date('2000-01-01')}
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
  label: { ...TYPE.labelMd, marginBottom: SPACING.sm, marginLeft: SPACING.xs },
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
  dateText: TYPE.bodyLg,
  placeholderText: { ...TYPE.bodyLg, color: COLORS.placeholder },
  modalOverlay: { flex: 1, backgroundColor: COLORS.modalBackdrop, justifyContent: 'flex-end' },
  pickerContainer: {
    backgroundColor: COLORS.surfaceRaised,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    alignItems: 'center',
  },
  pickerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  cancelText: { ...TYPE.labelLg, color: COLORS.ghost },
  doneText: TYPE.labelLg,
});
