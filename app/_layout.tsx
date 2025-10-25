// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // 1. Импортируем

export default function RootLayout() {
  return (
    // 2. Оборачиваем всё в Провайдер
    <SafeAreaProvider>
      <Stack>
        {/* Скрываем стандартный заголовок */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
