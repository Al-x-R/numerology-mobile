// components/PremiumTeaserModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONT_FAMILY, LAYOUT, RADIUS, SHADOWS, SPACING, TYPE } from '@/lib/constants/theme';
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
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7} accessibilityRole="button">
            <Ionicons name="close" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed-outline" size={26} color={COLORS.textTertiary} />
          </View>

          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.description} numberOfLines={4}>{description}</Text>

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

          <TouchableOpacity onPress={onGetPremium} style={styles.premiumLink} activeOpacity={0.7}>
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
  // Gold in the dialog belongs to the primary button only
  modalContainer: {
    width: '100%',
    maxWidth: LAYOUT.formMaxWidth,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: LAYOUT.minTouch,
    height: LAYOUT.minTouch,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.glass,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: LAYOUT.emblemHero,
    height: LAYOUT.emblemHero,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: { ...TYPE.headlineLg, fontFamily: FONT_FAMILY.serif.semibold, textAlign: 'center', marginBottom: SPACING.sm },
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
  orText: { ...TYPE.labelSm, fontSize: TYPE.bodySm.fontSize, lineHeight: TYPE.bodySm.lineHeight },
  // Text link with a 44pt touch area
  premiumLink: { minHeight: LAYOUT.minTouch, justifyContent: 'center', paddingHorizontal: SPACING.md },
  premiumLinkText: TYPE.labelLg,
});
