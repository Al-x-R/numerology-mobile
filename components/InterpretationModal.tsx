// components/InterpretationModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Interpretation } from '@/lib/types';
import { COLORS, SPACING, RADIUS, FONT_SIZES, FONTS, LAYOUT } from '@/lib/constants/theme';

interface InterpretationModalProps {
  isVisible: boolean;
  onClose: () => void;
  interpretation: Interpretation | null;
}

export function InterpretationModal({
  isVisible,
  onClose,
  interpretation,
}: InterpretationModalProps) {
  if (!interpretation) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={LAYOUT.closeIconSize} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.title}>{interpretation.title}</Text>

          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.description}>{interpretation.description}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.modalBackdrop,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.contentPadding,
  },
  modalCard: {
    width: '100%',
    maxWidth: LAYOUT.modalMaxWidth,
    maxHeight: '80%',
    backgroundColor: COLORS.headerBackground,
    borderRadius: RADIUS.modal,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.contentPadding,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.cardPadding,
    right: SPACING.cardPadding,
    zIndex: 1,
  },
  title: {
    ...FONTS.cardTitle,
    marginBottom: SPACING.cardPadding,
    paddingRight: LAYOUT.paddingRightMedium,
  },
  scrollContainer: {
    maxHeight: '100%',
  },
  description: {
    ...FONTS.cardDescription,
  },
});
