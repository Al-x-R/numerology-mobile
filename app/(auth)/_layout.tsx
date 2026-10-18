// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { COLORS } from '@/lib/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.transparent },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
