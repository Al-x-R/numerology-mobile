// components/ui/PremiumTeaserModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, GRADIENTS, RADIUS } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';

interface PremiumTeaserModalProps {
  visible: boolean;
  onClose: () => void;
  onAction: () => void;
}

export default function PremiumTeaserModal({ visible, onClose, onAction }: PremiumTeaserModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Ionicons name="diamond" size={48} color={COLORS.accent} style={styles.icon} />

          <Text style={styles.title}>{t('premium.title')}</Text>
          <Text style={styles.subtitle}>{t('premium.subtitle')}</Text>

          <View style={styles.features}>
            <Text style={styles.feature}>• Несколько профилей</Text>
            <Text style={styles.feature}>• Число дня каждый день</Text>
            <Text style={styles.feature}>• Уведомления</Text>
            <Text style={styles.feature}>• Без рекламы</Text>
          </View>

          <TouchableOpacity onPress={onUnlock}>
            <LinearGradient colors={GRADIENTS.button} style={styles.button}>
              <Text style={styles.buttonText}>Разблокировать за 4.99$</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: COLORS.cardBackground, padding: SPACING.xl, borderRadius: RADIUS.xl, width: '85%', alignItems: 'center' },
  close: { position: 'absolute', top: SPACING.sm, right: SPACING.sm },
  icon: { marginBottom: SPACING.md },
  title: { ...FONTS.sectionTitle, fontSize: 24, color: COLORS.accent, textAlign: 'center' },
  subtitle: { ...FONTS.cardDescription, color: COLORS.textSecondary, textAlign: 'center', marginVertical: SPACING.md },
  features: { alignSelf: 'flex-start', marginBottom: SPACING.lg },
  feature: { ...FONTS.cardDescription, color: COLORS.text, marginVertical: 2 },
  button: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: RADIUS.lg },
  buttonText: { ...FONTS.button, color: '#fff', fontWeight: '700' },
});
