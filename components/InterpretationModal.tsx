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
import { COLORS } from '@/lib/constants/theme';

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
            <Ionicons name="close" size={24} color="#A0A0A0" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 550,
    maxHeight: '80%',
    backgroundColor: COLORS.headerBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 15,
    paddingRight: 30,
  },
  scrollContainer: {
    maxHeight: '100%',
  },
  description: {
    fontSize: 16,
    color: '#D0D0D0',
    lineHeight: 24,
  },
});
