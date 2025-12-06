// app/profile/edit.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

import { useProfile } from '@/contexts/ProfileContext';
import { COLORS, SPACING, FONTS, RADIUS, GRADIENTS, SHADOWS } from '@/lib/constants/theme';
import { formatBirthDateFromDate } from '@/lib/utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTranslation } from '@/contexts/LanguageContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUserProfile, activeProfile } = useProfile();

  const [name, setName] = useState(user?.displayName || activeProfile?.name || '');
  const [birthDate, setBirthDate] = useState<Date | null>(
    user?.birthDate ? new Date(user.birthDate) : activeProfile?.date ? new Date(activeProfile.date) : null
  );

  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Add a local state for photos to show previews immediately
  const [localImage, setLocalImage] = useState<string | null>(null);
  const { t } = useAppTranslation();

  useEffect(() => {
    setName(user?.displayName || activeProfile?.name || '');
    if (user?.birthDate) {
      setBirthDate(new Date(user.birthDate));
    } else if (activeProfile?.date) {
      setBirthDate(new Date(activeProfile.date));
    }
  }, [user, activeProfile]);

  // --- Date Picker Logic ---
  const openDatePicker = () => {
    setTempDate(birthDate || new Date());
    setShowPicker(true);
  };

  const onDateChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'ios') {
      if (selectedDate) setTempDate(selectedDate);
    } else {
      setShowPicker(false);
      if (selectedDate) setBirthDate(selectedDate);
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
    // 1. ask for permission (on newer iOS this is often not necessary, but for reliability)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(t('common.error'), "Permission to access camera roll is required!");
      return;
    }

    // 2. Opening the gallery
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

  const uploadImageAsync = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = `avatars/${user?.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (e) {
      console.error("Upload failed", e);
      throw e;
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
      let photoURL = user?.photoURL;

      if (localImage) {
        photoURL = await uploadImageAsync(localImage);
      }

      await updateUserProfile({
        displayName: name.trim(),
        birthDate: birthDate ? birthDate.toISOString().split('T')[0] : undefined,
        photoURL: photoURL,
      });

      // A slight delay for UX
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
            await updateUserProfile({ photoURL: null });
          }
        }
      ]
    );
  };

  // Determine which image to show (Local > Server > Placeholder)
  const currentAvatar = localImage || user?.photoURL;

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={GRADIENTS.background} style={StyleSheet.absoluteFillObject} />

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
                  <Ionicons name="person" size={50} color={COLORS.accent} />
                </View>
              )}

              <TouchableOpacity style={styles.editIconBadge} onPress={handlePickImage}>
                <Ionicons name="camera" size={18} color="#000" />
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
                <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder={t('profile.enterName')}
                  placeholderTextColor={COLORS.textSecondary}
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
                  <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <Text style={birthDate ? styles.dateText : styles.placeholderText}>
                    {birthDate ? formatBirthDateFromDate(birthDate) : t('profile.selectDate')}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={styles.goldenButtonContainer}
            onPress={saveChanges}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={GRADIENTS.goldenButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.goldenButton}
            >
              {isSaving ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.goldenButtonText}>{t('common.save')}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

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
                onChange={onDateChange}
                maximumDate={new Date()}
                themeVariant="dark"
                textColor="white"
                style={{ backgroundColor: '#1A1A1A', height: 200, width: '100%' }}
                locale={t('localeCode') || 'ru'}
              />
            </View>
          </View>
        </Modal>
      ) : showPicker && (
        <DateTimePicker
          value={birthDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
          themeVariant="dark"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.xl },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative' },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  avatarPlaceholderLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderStyle: 'dashed',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  avatarActions: { marginTop: SPACING.md, alignItems: 'center' },
  changePhotoText: { ...FONTS.button, color: COLORS.accent, fontSize: 16 },
  removePhotoText: { ...FONTS.body, color: '#FF3B30', fontSize: 14 },
  formContainer: { marginBottom: 30 },
  field: { marginBottom: SPACING.lg },
  label: { ...FONTS.body, color: COLORS.textSecondary, marginBottom: 8, fontSize: 14, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.md,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, paddingVertical: 16, ...FONTS.body },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 16,
  },
  dateText: { ...FONTS.body },
  placeholderText: { ...FONTS.body, color: COLORS.textSecondary },
  goldenButtonContainer: {
    marginTop: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden' as const,
    ...SHADOWS.goldenButtonSoft,
  },
  goldenButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldenButtonText: {
    ...FONTS.button,
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  pickerContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  pickerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cancelText: { color: '#FF453A', fontSize: 17, fontWeight: '600' },
  doneText: { color: COLORS.accent, fontSize: 17, fontWeight: '600' },
});
