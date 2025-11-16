// app/(auth)/register.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS, GRADIENTS, LAYOUT } from '@/lib/constants/theme';
import { t } from '@/lib/constants/locales';
import { useState } from 'react';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';

export default function RegisterScreen() {
  const { registerWithEmail, loginWithGoogle, isLoading } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', displayName: '' });

  const validate = () => {
    const newErrors = { email: '', password: '', displayName: '' };
    if (displayName.length < 3) newErrors.displayName = t('auth.displayNameShort');
    if (!email.includes('@')) newErrors.email = t('auth.emailInvalid');
    if (password.length < 6) newErrors.password = t('auth.passwordShort');
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password && !newErrors.displayName;;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await registerWithEmail(displayName, email, password);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        Alert.alert(
          t('common.error'),
          t('auth.emailUsedRedirectLogin'),
          [
            {
              text: t('auth.goToLogin'),
              onPress: () => router.replace('/(auth)/login'),
            },
            {
              text: t('common.cancel'),
              style: 'cancel',
            },
          ]
        );
        return;
      }

      Alert.alert(t('common.error'), err.message || t('common.error'));
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title}>{t('auth.register')}</Text>

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

        {/* Display name */}
        <TextInput
          style={[styles.input, errors.displayName ? styles.inputError : {}]}
          placeholder={t('auth.displayName')}
          value={displayName}
          onChangeText={setDisplayName}
          keyboardType="default"
          autoCapitalize="words"
          placeholderTextColor={COLORS.textSecondary}
          editable={!isLoading}
        />
        {errors.displayName ? <Text style={styles.errorText}>{errors.displayName}</Text> : null}

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

        {/* Создать аккаунт */}
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('auth.createAccount')}</Text>
          )}
        </TouchableOpacity>

        {/* Вход */}
        <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={isLoading}>
          <Text style={styles.link}>{t('auth.haveAccount')}</Text>
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
});
