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
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, FONT_FAMILY } from '@/lib/constants/theme';

interface PremiumTeaserModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

// ИЗМЕНЕНИЕ: export default function вместо export function
export function PremiumTeaserModal({ visible, onClose, onUpgrade, isLoggedIn, onLogin }: PremiumTeaserModalProps) {
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

  const titleKey = isLoggedIn ? 'premiumTeaserTitle' : 'premiumTeaserTitleGuest';
  const textKey = isLoggedIn ? 'premiumTeaserText' : 'premiumTeaserTextGuest';
  const ctaKey = isLoggedIn ? 'premiumTeaserCTAUpgrade' : 'premiumTeaserCTARegister';
  const secondaryCtaKey = isLoggedIn ? 'later' : 'alreadyHaveAccount';

  const handleMainAction = isLoggedIn ? onUpgrade : onLogin;
  const handleSecondaryAction = isLoggedIn ? onClose : onLogin;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modal, animatedStyle]}>

              <LinearGradient colors={[COLORS.background, '#1A1A1A']} style={styles.gradient}>
                <MaterialIcons name="lock" size={32} color={COLORS.accent} style={styles.lock} />

                <Text style={styles.title}>{t(titleKey)}</Text>
                <Text style={styles.text}>{t(textKey)}</Text>

                <TouchableOpacity style={styles.button} onPress={handleMainAction}>
                  <LinearGradient
                    colors={['#FFD700', COLORS.primary]}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>{t(ctaKey)}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.close} onPress={handleSecondaryAction}>
                  <Text style={styles.closeText}>{t(secondaryCtaKey)}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.card,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  gradient: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  lock: {
    marginBottom: SPACING.sm,
    color: COLORS.accent,
  },
  title: {
    fontFamily: FONT_FAMILY.manrope.bold,
    fontSize: 22,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  text: {
    ...FONTS.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    borderRadius: RADIUS.modal,
    marginBottom: SPACING.sm,
    ...SHADOWS.button,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...FONTS.button,
    color: '#000',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  close: {
    marginTop: SPACING.xs,
  },
  closeText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
