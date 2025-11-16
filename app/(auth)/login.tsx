// app/(auth)/login.tsx
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS, GRADIENTS, LAYOUT } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';
import React, { useState } from 'react';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { loginWithGoogle, loginWithEmail, isLoading, sendPasswordReset } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    const newErrors = { email: '', password: '' };
    if (!email.includes('@')) newErrors.email = t('auth.emailInvalid');
    if (password.length < 6) newErrors.password = t('auth.passwordShort');
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {

      let errorMessage = t('auth.wrongPasswordOrUserNotFound');

      if (err.code === 'auth/network-request-failed') {
        errorMessage = t('common.networkError');
      }

      Alert.alert(t('common.error'), errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    if (!loginWithGoogle) {
      Alert.alert(t('common.error'), 'Google Sign-In is not available on this device.');
      return;
    }

    try {
      await loginWithGoogle();
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('common.error'));
    }
  };

  const handlePasswordReset = async () => {
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email || !emailRegex.test(email)) {
      Alert.alert(t('auth.resetPassword'), t('auth.enterEmailToReset'));
      return;
    }

    try {
      setErrors({ email: '', password: '' });
      await sendPasswordReset(email);
      Alert.alert(t('auth.resetPassword'), t('auth.resetEmailSent'));
    } catch (err: any) {
      let errorMessage = err.message || t('common.error');

      if (err.code === 'auth/user-not-found') {
        errorMessage = t('auth.userNotFound');
      }

      Alert.alert(t('common.error'), errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.welcome')}</Text>

        {/* Google */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} disabled={isLoading}>
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
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* Password */}
        <TextInput
          style={[styles.input, errors.password ? styles.inputError : {}]}
          placeholder={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={COLORS.textSecondary}
          editable={!isLoading}
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <TouchableOpacity
          onPress={handlePasswordReset}
          disabled={isLoading}
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPasswordLink}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>

        {/* Entrance */}
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('auth.login')}</Text>
          )}
        </TouchableOpacity>

        {/* Registration */}
        <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={isLoading}>
          <Text style={styles.link}>{t('auth.noAccount')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.transparent,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
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
  title: {
    ...FONTS.headerTitle,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    color: '#fff',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  googleText: {
    ...FONTS.button,
    marginLeft: SPACING.sm,
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
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...FONTS.error,
    color: COLORS.error,
    marginBottom: SPACING.sm,
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: COLORS.accent,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  buttonText: {
    ...FONTS.button,
  },
  link: {
    ...FONTS.link,
    textAlign: 'center',
    color: '#fff',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  forgotPasswordLink: {
    ...FONTS.link,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
