// components/PremiumTeaserModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
import { GoldButton } from '@/components/ui/GoldButton';
import { useAppTranslation } from '@/contexts/LanguageContext';

interface PremiumTeaserModalProps {
  visible: boolean;
  onClose: () => void;
  onGetPremium: () => void;
  onWatchAd: () => void;
}

export function PremiumTeaserModal({ visible, onClose, onGetPremium, onWatchAd }: PremiumTeaserModalProps) {
  const { t } = useAppTranslation();

  const title = t('premiumTeaser.title');
  const description = t('premiumTeaser.description');
  const adButtonText = t('premiumTeaser.watchAd');
  const orText = t('premiumTeaser.or');
  const premiumButtonText = t('premiumTeaser.getPremium');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed-outline" size={26} color={COLORS.accent} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <GoldButton
            title={adButtonText}
            onPress={onWatchAd}
            icon={<Ionicons name="play-circle-outline" size={20} color={COLORS.blackText} />}
            style={styles.adButton}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>{orText}</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity onPress={onGetPremium} style={styles.premiumLink}>
            <Text style={styles.premiumLinkText}>{premiumButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.modalBackdrop,
    padding: SPACING.margin,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    ...SHADOWS.card,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.glass,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.goldenButtonSoft,
  },
  title: { ...TYPE.headlineLg, textAlign: 'center', marginBottom: SPACING.sm },
  description: { ...TYPE.bodyMd, textAlign: 'center', marginBottom: SPACING.lg },
  adButton: { alignSelf: 'stretch' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginVertical: SPACING.lg,
    alignSelf: 'stretch',
  },
  line: { flex: 1, height: 1, backgroundColor: COLORS.hairline },
  orText: TYPE.labelSm,
  premiumLink: { paddingVertical: SPACING.sm },
  premiumLinkText: TYPE.labelLg,
});
