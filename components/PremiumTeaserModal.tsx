// components/PremiumTeaserModal.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { t } from '@/lib/constants/locales';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '@/lib/constants/theme';

interface PremiumTeaserModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function PremiumTeaserModal({ visible, onClose, onUpgrade }: PremiumTeaserModalProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(100, withTiming(1, { duration: 400 }));
      scale.value = withDelay(100, withTiming(1, { duration: 450, easing: Easing.out(Easing.quad) }));
      translateY.value = withDelay(100, withTiming(0, { duration: 450, easing: Easing.out(Easing.quad) }));
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.95, { duration: 300 });
      translateY.value = withTiming(20, { duration: 300 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modal, animatedStyle]}>
              <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.gradient}>
                <MaterialIcons name="lock" size={32} color="#FFF" style={styles.lock} />
                <Text style={styles.title}>{t('premiumTeaserTitle')}</Text>
                <Text style={styles.text}>{t('premiumTeaserText')}</Text>
                <TouchableOpacity style={styles.button} onPress={onUpgrade}>
                  <Text style={styles.buttonText}>{t('premiumTeaserCTA')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.close} onPress={onClose}>
                  <Text style={styles.closeText}>{t('later')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  gradient: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  lock: {
    marginBottom: SPACING.sm,
  },
  title: {
    ...FONTS.sectionTitle,
    fontSize: 20,
    color: '#FFF',
    marginBottom: SPACING.xs,
  },
  text: {
    ...FONTS.cardDescription,
    fontSize: 15,
    color: '#E0C3FC',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#FFF',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.modal,
    marginBottom: SPACING.sm,
  },
  buttonText: {
    ...FONTS.button,
    color: '#6D28D9',
    fontWeight: '700',
  },
  close: {
    marginTop: SPACING.xs,
  },
  closeText: {
    ...FONTS.cardDescription,
    color: '#E0C3FC',
    fontSize: 14,
  },
});
