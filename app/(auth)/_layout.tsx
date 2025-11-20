// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { COLORS } from '@/lib/constants/theme';

export default function AuthLayout() {
  return (
    <ProfileProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.transparent },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </ProfileProvider>
  );
}
