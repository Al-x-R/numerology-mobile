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
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useProfile } from '@/contexts/ProfileContext';
import { COLORS, SPACING, FONTS, RADIUS, GRADIENTS } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';
import { formatBirthDateFromDate } from '@/lib/utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUserProfile, activeProfile } = useProfile();

  const [name, setName] = useState(user?.displayName || activeProfile?.name || '');
  const [birthDate, setBirthDate] = useState<Date | null>(
    user?.birthDate ? new Date(user.birthDate) : activeProfile?.date ? new Date(activeProfile.date) : null
  );

  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    setName(user?.displayName || activeProfile?.name || '');
    if (user?.birthDate) {
      setBirthDate(new Date(user.birthDate));
    } else if (activeProfile?.date) {
      setBirthDate(new Date(activeProfile.date));
    }
  }, [user, activeProfile]);

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios' ? true : false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const saveChanges = async () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('profile.nameRequired'));
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName: name.trim(),
        birthDate: birthDate ? birthDate.toISOString().split('T')[0] : undefined,
      });


      setTimeout(() => {
        router.back();
      }, 500);

    } catch (err) {
      Alert.alert(t('common.error'), t('errors.tryAgain'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickImage = async () => {
    // TODO: Подключить expo-image-picker
    Alert.alert("Info", "Image Picker functionality needs expo-image-picker package.");
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
            await updateUserProfile({ photoURL: null });
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: -8, padding: 8 }}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Global background */}
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
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.avatarLarge} />
              ) : (
                <View style={styles.avatarPlaceholderLarge}>
                  <Ionicons name="person" size={50} color={COLORS.accent} />
                </View>
              )}

              {/* The edit button is on the avatar itself. */}
              <TouchableOpacity style={styles.editIconBadge} onPress={handlePickImage}>
                <Ionicons name="camera" size={18} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarActions}>
              <TouchableOpacity onPress={handlePickImage}>
                <Text style={styles.changePhotoText}>{t('profile.changePhoto')}</Text>
              </TouchableOpacity>

              {user?.photoURL && (
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
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
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
            style={styles.saveButtonContainer}
            onPress={saveChanges}
            disabled={isSaving}
          >
            <LinearGradient
              colors={isSaving ? [COLORS.card, COLORS.card] : GRADIENTS.button}
              style={styles.saveButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>{t('common.save')}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date modal for iOS */}
      {showPicker && Platform.OS === 'ios' ? (
        <Modal transparent animationType="fade" visible={showPicker}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => setShowPicker(false)}
            />
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.cancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.doneText}>{t('common.done')}</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={birthDate || new Date()}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                maximumDate={new Date()}
                style={{ backgroundColor: 'white', height: 200 }}
                textColor="black"
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.xl },

  // Avatar Styles
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

  // Form Styles
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
  input: {
    flex: 1,
    paddingVertical: 16,
    ...FONTS.body,
  },

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
  dateText: {
    ...FONTS.body
  },
  placeholderText: {
    ...FONTS.body
  },

  // Save Button
  saveButtonContainer: { marginTop: SPACING.sm },
  saveButton: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    ...FONTS.button,
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cancelText: { color: '#FF3B30', fontSize: 16 },
  doneText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
});
