// app/(app)/profile/edit.tsx
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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProfile } from '@/contexts/ProfileContext';
import { COLORS, SPACING, FONTS, RADIUS } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';
import { formatBirthDateFromDate } from '@/lib/utils/date';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUserProfile, activeProfile } = useProfile();

  const [name, setName] = useState(user?.displayName || activeProfile?.name || '');
  const [birthDate, setBirthDate] = useState<Date | null>(
    user?.birthDate ? new Date(user.birthDate) : activeProfile?.date ? new Date(activeProfile.date) : null
  );
  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Синхронизация при открытии
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
      Alert.alert(t('errors.error'), t('profile.nameRequired'));
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName: name.trim(),
        birthDate: birthDate ? birthDate.toISOString().split('T')[0] : undefined,
      });

      Alert.alert(t('common.success'), t('profile.saved'), [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert(t('errors.error'), t('errors.tryAgain'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickImage = async () => {
    // Здесь будет ImagePicker (ниже код)
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* АВАТАРКА С ВОЗМОЖНОСТЬЮ ДОБАВИТЬ / УДАЛИТЬ */}
        <View style={styles.avatarSection}>
          <Text style={styles.label}>{t('profile.avatar')}</Text>

          <View style={styles.avatarWrapper}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatarLarge} />
            ) : (
              <View style={styles.avatarPlaceholderLarge}>
                <Ionicons name="person" size={60} color="#666" />
              </View>
            )}

            <View style={styles.avatarButtons}>
              <TouchableOpacity style={styles.avatarBtn} onPress={handlePickImage}>
                <Ionicons name="camera-outline" size={20} color="#fff" />
                <Text style={styles.avatarBtnText}>{t('profile.changePhoto')}</Text>
              </TouchableOpacity>

              {user?.photoURL && (
                <TouchableOpacity style={[styles.avatarBtn, styles.deleteBtn]} onPress={handleRemovePhoto}>
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                  <Text style={styles.avatarBtnText}>{t('profile.removePhoto')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Имя */}
        <View style={styles.field}>
          <Text style={styles.label}>{t('profile.name')}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t('profile.enterName')}
            placeholderTextColor="#666"
            autoCapitalize="words"
            maxLength={30}
          />
        </View>

        {/* Дата рождения */}
        <View style={styles.field}>
          <Text style={styles.label}>{t('profile.birthDate')}</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
            <Text style={birthDate ? styles.dateText : styles.placeholderText}>
              {birthDate ? formatBirthDateFromDate(birthDate) : t('profile.selectDate')}
            </Text>
            <Ionicons name="calendar-outline" size={22} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        {/* Кнопка сохранения */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={saveChanges}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? t('common.saving') : t('common.save')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showPicker && Platform.OS === 'ios' ? (
        <Modal transparent animationType="slide" visible={showPicker}>
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
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.doneText}>{t('common.done')}</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={birthDate || new Date()}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                maximumDate={new Date()}
                style={{ backgroundColor: 'white' }}
                textColor="black"
                locale="ru_RU"
              />
            </View>
          </View>
        </Modal>
      ) : showPicker ? (
        <DateTimePicker
          value={birthDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: SPACING.xl, paddingTop: SPACING.lg },
  field: { marginBottom: SPACING.xl },
  label: { ...FONTS.body, color: '#ccc', marginBottom: SPACING.sm, fontSize: 16 },
  input: {
    ...FONTS.body,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    fontSize: 17,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  dateText: { ...FONTS.body, color: '#fff', fontSize: 17 },
  placeholderText: { ...FONTS.body, color: '#666', fontSize: 17 },
  saveButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { ...FONTS.body, color: '#fff', fontWeight: '600', fontSize: 18 },

  // iOS Picker Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: '#f2f2f7',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cancelText: { fontSize: 17, color: '#007AFF', fontWeight: '600' },
  doneText: { fontSize: 17, color: '#007AFF', fontWeight: '600' },
  avatarSection: { marginBottom: SPACING.xl, alignItems: 'center' },
  avatarWrapper: { alignItems: 'center', marginTop: SPACING.lg },
  avatarLarge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: COLORS.accent,
  },
  avatarPlaceholderLarge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.accent,
    borderStyle: 'dashed',
  },
  avatarButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg
  },
  avatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  deleteBtn: { backgroundColor: '#c42b1c' },
  avatarBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
