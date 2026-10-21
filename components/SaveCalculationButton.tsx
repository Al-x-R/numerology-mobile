// components/SaveCalculationButton.tsx
// Header bookmark on result screens: saves the calculation to storage or removes it from there
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StyleProp,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { CalculationInput, SAVED_LIMITS, useSavedCalculations } from '@/contexts/SavedCalculationsContext';
import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { GoldButton } from '@/components/ui/GoldButton';

interface SaveCalculationButtonProps {
  input: CalculationInput;
  style?: StyleProp<ViewStyle>;
}

// The 40pt button keeps its look while the touch area reaches 44pt
const BUTTON_SLOP = (LAYOUT.minTouch - LAYOUT.iconButton) / 2;

export const SaveCalculationButton = ({ input, style }: SaveCalculationButtonProps) => {
  const { isPremium } = useProfile();
  const { t } = useAppTranslation();
  const { writable, limit, canSave, findSaved, save, remove } = useSavedCalculations();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [label, setLabel] = useState('');

  const saved = findSaved(input);
  const fallbackLabel = input.kind === 'matrix' ? input.date : `${input.date1} + ${input.date2}`;
  const fill = (key: string, values: Record<string, string>) =>
    Object.entries(values).reduce((text, [name, value]) => text.split(`{${name}}`).join(value), t(key));

  const showLimitAlert = () => {
    if (!isPremium) {
      Alert.alert(t('storage.limitFreeTitle'), fill('storage.limitFreeText', { limit: String(SAVED_LIMITS.pro) }), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('storage.getPro'), onPress: () => router.push('/premium/upgrade') },
      ]);
      return;
    }
    Alert.alert(t('storage.limitProTitle'), fill('storage.limitProText', { limit: String(limit) }), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('storage.openStorage'), onPress: () => router.push('/profile/storage') },
    ]);
  };

  const handlePress = () => {
    if (!writable) {
      Alert.alert(t('common.error'), t('storage.loadError'));
      return;
    }
    if (saved) {
      Alert.alert(t('storage.removeTitle'), fill('storage.removeText', { label: saved.label }), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.remove'), style: 'destructive', onPress: () => remove(saved.id) },
      ]);
      return;
    }
    if (!canSave(input.kind)) {
      showLimitAlert();
      return;
    }
    setLabel('');
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    await save(input, label.trim() || fallbackLabel);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Gold only once saved: the filled bookmark is the active state */}
      <TouchableOpacity style={[styles.button, style]} onPress={handlePress} hitSlop={BUTTON_SLOP} activeOpacity={0.7}>
        <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={saved ? COLORS.accent : COLORS.text} />
      </TouchableOpacity>

      <Modal transparent animationType="fade" visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setIsModalVisible(false)} />
          <View style={styles.sheet}>
            <Text style={styles.title} numberOfLines={2}>{t('storage.saveTitle')}</Text>
            <Text style={styles.hint} numberOfLines={2}>{t('storage.labelHint')}</Text>

            <TextInput
              style={styles.input}
              value={label}
              onChangeText={setLabel}
              placeholder={t(input.kind === 'matrix' ? 'storage.placeholderMatrix' : 'storage.placeholderCompatibility')}
              placeholderTextColor={COLORS.placeholder}
              maxLength={40}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />

            <GoldButton title={t('common.save')} onPress={handleSave} />
            <TouchableOpacity style={styles.cancel} onPress={() => setIsModalVisible(false)} activeOpacity={0.7}>
              <Text style={styles.cancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: LAYOUT.iconButton,
    height: LAYOUT.iconButton,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.glass,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: { flex: 1, backgroundColor: COLORS.modalBackdrop, justifyContent: 'center', padding: SPACING.lg },
  sheet: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  title: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.semibold, textAlign: 'center' },
  hint: { ...TYPE.bodyMd, textAlign: 'center', marginTop: SPACING.xs, marginBottom: SPACING.lg },
  input: {
    ...TYPE.bodyLg,
    height: 52,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  cancel: {
    alignSelf: 'center',
    minHeight: LAYOUT.minTouch,
    justifyContent: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  cancelText: { ...TYPE.labelLg, color: COLORS.ghost },
});
