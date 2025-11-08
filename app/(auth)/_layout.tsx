// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { COLORS } from '@/lib/constants/theme';

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerTitle: '',
          contentStyle: { backgroundColor: COLORS.transparent },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="login"      options={{ headerTitle: '' }} />
        <Stack.Screen name="register"   options={{ title: '' }} />
        <Stack.Screen name="onboarding" options={{ title: '' }} />
      </Stack>
    </AuthProvider>
  );
}
