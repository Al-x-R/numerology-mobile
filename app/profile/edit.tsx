// app/profile/edit.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Modal, StyleSheet, KeyboardAvoidingView, ScrollView, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { getAvatarUri, useProfile } from '@/contexts/ProfileContext';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
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

  const [localImage, setLocalImage] = useState<string | null>(null);
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

  // --- PHOTO UPLOADING LOGIC ---
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(t('common.error'), "Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalImage(uri);
    }
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
        ...(localImage ? { photoUri: localImage } : {}),
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

  const handleRemovePhoto = () => {
    Alert.alert(
      t('profile.removePhoto'),
      t('profile.removePhotoConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.remove'),
          style: 'destructive',
          onPress: async () => {
            setLocalImage(null);
            await updateProfile({ photoUri: null });
          }
        }
      ]
    );
  };

  const currentAvatar = localImage || getAvatarUri(activeProfile);

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

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {currentAvatar ? (
                <Image source={{ uri: currentAvatar }} style={styles.avatarLarge} />
              ) : (
                <View style={styles.avatarPlaceholderLarge}>
                  <Ionicons name="person-outline" size={44} color={COLORS.accent} />
                </View>
              )}

              <TouchableOpacity style={styles.editIconBadge} onPress={handlePickImage}>
                <Ionicons name="camera-outline" size={16} color={COLORS.accent} />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarActions}>
              <TouchableOpacity onPress={handlePickImage}>
                <Text style={styles.changePhotoText}>{t('profile.changePhoto')}</Text>
              </TouchableOpacity>

              {currentAvatar && (
                <TouchableOpacity onPress={handleRemovePhoto} style={{ marginTop: 10 }}>
                  <Text style={styles.removePhotoText}>{t('profile.removePhoto')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

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
  avatarSection: { alignItems: 'center', marginBottom: SPACING.xl },
  avatarContainer: {
    position: 'relative',
    padding: 3,
    borderRadius: 64,
    borderWidth: 1.5,
    borderColor: COLORS.borderSelected,
    ...SHADOWS.goldenButtonSoft,
  },
  avatarLarge: { width: 112, height: 112, borderRadius: 56 },
  avatarPlaceholderLarge: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.borderSelected,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarActions: { marginTop: SPACING.md, alignItems: 'center', gap: SPACING.sm },
  changePhotoText: TYPE.labelLg,
  removePhotoText: { ...TYPE.labelMd, color: COLORS.error },
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
