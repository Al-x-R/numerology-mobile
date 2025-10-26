// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        {/*
          ИЗМЕНЕНИЕ: Используем 'screen' для настройки всех экранов Stack
          Заголовок скрывается глобально для всего приложения.
        */}
        <Stack.Screen
          name="(tabs)" // Указываем, что наша основная группа - это (tabs)
          options={{
            headerShown: false,
            title: 'Главная', // Это для дебага, но не показывается
          }}
        />
        {/*
          УБРАТЬ Stack.Screen name="index"
          Потому что index.tsx теперь должен быть только для Redirect,
          и Stack сам поймет, что его нужно обработать.
        */}
      </Stack>
    </SafeAreaProvider>
  );
}
