// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useProfile } from '@/contexts/ProfileContext';
import { COLORS, SPACING, FONTS, RADIUS, GRADIENTS, LAYOUT } from '@/lib/constants/theme';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { useAppTranslation } from '@/contexts/LanguageContext';

export default function LoginScreen() {
  const { loginWithEmail, loginWithGoogle, isLoading, sendPasswordResetEmail } = useProfile();
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { t } = useAppTranslation();

  const validate = () => {
    const newErrors = { email: '', password: '' };
    if (!email.includes('@')) newErrors.email = t('auth.emailInvalid');
    if (password.length < 6) newErrors.password = t('auth.passwordShort');
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLoginSuccess = () => {
    if (redirect) {
      router.replace(redirect as Href);
    } else {
      router.replace('/(tabs)/pythagoras');
    }
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await loginWithEmail(email.trim(), password);
      handleLoginSuccess();
    } catch (err: any) {
      let message = t('auth.wrongPasswordOrUserNotFound');
      if (err.code === 'auth/network-request-failed') {
        message = t('common.networkError');
      }
      Alert.alert(t('common.error'), message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      handleLoginSuccess();
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('common.error'));
    }
  };

  const goToRegister = () => {
    if (redirect) {
      router.push(`/(auth)/register?redirect=${redirect}`);
    } else {
      router.push('/(auth)/register');
    }
  };

  const handlePasswordReset = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert(t('auth.resetPassword'), t('auth.enterEmailToReset'));
      return;
    }
    try {
      await sendPasswordResetEmail(email.trim());
      Alert.alert(t('auth.resetPassword'), t('auth.resetEmailSent'));
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('common.error'));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.welcome')}</Text>

        {/* Google Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isLoading}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#1a73e8', '#0d47a1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.googleButtonGradient}
          />
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles.googleText}>{t('auth.google')}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Email */}
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : {}]}
          placeholder={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.textSecondary}
          editable={!isLoading}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={[styles.input, errors.password ? styles.inputError : {}]}
          placeholder={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={COLORS.textSecondary}
          editable={!isLoading}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TouchableOpacity onPress={handlePasswordReset} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordLink}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.goldenButtonContainer}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={GRADIENTS.goldenButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.goldenButton}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.goldenButtonText}>{t('auth.login')}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToRegister}>
          <Text style={styles.link}>{t('auth.noAccount')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.transparent },
  background: { ...StyleSheet.absoluteFillObject, alignItems: 'center' },
  logo: {
    width: '150%',
    maxWidth: LAYOUT.logoLarge,
    maxHeight: LAYOUT.logoLarge,
    opacity: 0.2,
    marginTop: LAYOUT.topMarginLarge,
  },
  content: {
    flex: 1,
    paddingHorizontal: LAYOUT.contentPadding,
    justifyContent: 'center',
  },
  title: { ...FONTS.headerTitle, fontSize: 32, textAlign: 'center', marginBottom: SPACING.xl, color: '#fff' },

  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1.5,
  },
  googleButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.lg,
  },
  googleText: {
    ...FONTS.button,
    marginLeft: SPACING.sm,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  input: {
    ...FONTS.body,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: { borderColor: COLORS.error },
  errorText: { ...FONTS.error, color: COLORS.error, marginBottom: SPACING.sm, alignSelf: 'flex-start' },

  forgotPasswordContainer: { alignSelf: 'flex-end', marginBottom: SPACING.md },
  forgotPasswordLink: { ...FONTS.link, fontSize: 14, color: COLORS.textSecondary },

  goldenButtonContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  goldenButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldenButtonText: {
    ...FONTS.button,
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
  },

  link: { ...FONTS.link, textAlign: 'center', color: '#fff' },
});
