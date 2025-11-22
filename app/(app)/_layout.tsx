// app/(app)/_layout.tsx
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/lib/constants/theme';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.transparent },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="(app)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
