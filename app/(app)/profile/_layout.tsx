// app/(app)/profile/_layout.tsx
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '@/lib/constants/locales';
import { COLORS } from '@/lib/constants/theme';

export default function ProfileLayout() {
  return (
    <Stack>
      {/* Главный экран профиля */}
      <Stack.Screen
        name="index"
        options={{
          title: t('profile.title'), // "Профиль"
          headerStyle: { backgroundColor: COLORS.headerBackground },
          headerTintColor: COLORS.accent,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 12 }}
            >
              <Ionicons name="chevron-back" size={28} color={COLORS.accent} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Экран редактирования */}
      <Stack.Screen
        name="edit"
        options={{
          title: t('profile.edit'), // "Редактировать"
          presentation: 'card',
          headerStyle: {
            backgroundColor: '#0d0d0d',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 12 }}
            >
              <Ionicons name="chevron-back" size={28} color={COLORS.accent} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
