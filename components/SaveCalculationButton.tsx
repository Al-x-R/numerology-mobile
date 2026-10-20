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
import { router } from 'expo-router';

import { useProfile } from '@/contexts/ProfileContext';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { CalculationInput, SAVED_LIMITS, useSavedCalculations } from '@/contexts/SavedCalculationsContext';
import { COLORS, RADIUS, SPACING, TYPE } from '@/lib/constants/theme';
import { GoldButton } from '@/components/ui/GoldButton';

interface SaveCalculationButtonProps {
  input: CalculationInput;
  style?: StyleProp<ViewStyle>;
}

export const SaveCalculationButton = ({ input, style }: SaveCalculationButtonProps) => {
  const { isPremium } = useProfile();
  const { t } = useAppTranslation();
  const { limit, canSave, findSaved, save, remove } = useSavedCalculations();

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
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={[styles.button, style]} onPress={handlePress} activeOpacity={0.7}>
        <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={COLORS.accent} />
      </TouchableOpacity>

      <Modal transparent animationType="fade" visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setIsModalVisible(false)} />
          <View style={styles.sheet}>
            <Text style={styles.title}>{t('storage.saveTitle')}</Text>
            <Text style={styles.hint}>{t('storage.labelHint')}</Text>

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
            <TouchableOpacity style={styles.cancel} onPress={() => setIsModalVisible(false)}>
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
    borderColor: COLORS.borderAccent,
  },
  title: { ...TYPE.headlineMd, textAlign: 'center' },
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
  cancel: { alignSelf: 'center', marginTop: SPACING.md, padding: SPACING.xs },
  cancelText: { ...TYPE.labelLg, color: COLORS.ghost },
});
