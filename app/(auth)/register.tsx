// app/(auth)/register.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { COLORS, SPACING, FONTS, RADIUS, GRADIENTS, LAYOUT, SHADOWS } from '@/lib/constants/theme';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { useAppTranslation } from '@/contexts/LanguageContext';

export default function RegisterScreen() {
  const { registerWithEmail, loginWithGoogle, updateUserProfile, isLoading } = useProfile();
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect: string }>();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState({ displayName: '', email: '', password: '' });

  const { t } = useAppTranslation();

  const validate = () => {
    const newErrors = { displayName: '', email: '', password: '' };
    if (displayName.trim().length < 2) newErrors.displayName = t('auth.displayNameShort');
    if (!email.includes('@')) newErrors.email = t('auth.emailInvalid');
    if (password.length < 6) newErrors.password = t('auth.passwordShort');
    setErrors(newErrors);
    return Object.values(newErrors).every(x => x === '');
  };

  const handleLoginSuccess = () => {
    if (redirect) {
      router.replace(redirect as Href);
    } else {
      router.replace('/(tabs)/pythagoras');
    }
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await registerWithEmail(displayName.trim(), email.trim(), password);

      if (birthDate.trim()) {
        await updateUserProfile({ birthDate: birthDate.trim() });
      }

      handleLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        Alert.alert(
          t('common.error'),
          t('auth.emailUsedRedirectLogin'),
          [
            { text: t('auth.goToLogin'), onPress: () => router.replace('/(auth)/login') },
            { text: t('common.cancel'), style: 'cancel' },
          ]
        );
        return;
      }
      Alert.alert(t('common.error'), err.message || t('common.error'));
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
      handleLoginSuccess();
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('common.error'));
    }
  };

  const goToLogin = () => {
    if (redirect) {
      router.push(`/(auth)/login?redirect=${redirect}` as Href);
    } else {
      router.push('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.register')}</Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleRegister}
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

        <TextInput
          style={[styles.input, errors.displayName ? styles.inputError : {}]}
          placeholder={t('auth.displayName')}
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          placeholderTextColor={COLORS.textSecondary}
          editable={!isLoading}
        />
        {errors.displayName && <Text style={styles.errorText}>{errors.displayName}</Text>}

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

        <TextInput
          style={styles.input}
          placeholder={t('auth.birthDatePlaceholder')}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="numbers-and-punctuation"
          autoComplete="birthdate-full"
          editable={!isLoading}
        />

        <TouchableOpacity
          style={styles.goldenButtonContainer}
          onPress={handleRegister}
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
              <Text style={styles.goldenButtonText}>{t('auth.createAccount')}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.link}>{t('auth.haveAccount')}</Text>
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
  hintText: {
    ...FONTS.body,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    opacity: 0.8,
  },
  inputError: { borderColor: COLORS.error },
  errorText: { ...FONTS.error, color: COLORS.error, marginBottom: SPACING.sm, alignSelf: 'flex-start' },
  goldenButtonContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.goldenButtonSoft,
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
