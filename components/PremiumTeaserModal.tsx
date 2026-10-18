// components/PremiumTeaserModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONTS, RADIUS, SPACING } from '@/lib/constants/theme';
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={32} color={COLORS.accent} />
          </View>

          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.description}>
            {description}
          </Text>

          <TouchableOpacity
            style={styles.adButton}
            onPress={onWatchAd}
            activeOpacity={0.8}
          >
            <Ionicons name="play-circle" size={24} color={COLORS.blackText} style={{ marginRight: 8 }} />
            <Text style={styles.adButtonText}>
              {adButtonText}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>{orText}</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity onPress={onGetPremium}>
            <LinearGradient
              colors={['transparent', 'transparent']}
              style={styles.premiumLinkContainer}
            >
              <Text style={styles.premiumLinkText}>
                {premiumButtonText}
              </Text>
            </LinearGradient>
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
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.modalBackdrop,
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    padding: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    ...FONTS.subtitle,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontSize: 20,
  },
  description: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  adButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adButtonText: {
    ...FONTS.button,
    color: COLORS.blackText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: SPACING.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.hairline,
  },
  orText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.md,
    fontSize: 12,
  },
  premiumLinkContainer: {
    paddingVertical: 4,
  },
  premiumLinkText: {
    ...FONTS.button,
    color: COLORS.accent,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
