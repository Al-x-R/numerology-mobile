// app/index.tsx (главный вход)
import { Redirect } from 'expo-router';
import React from 'react';

// Здесь мы можем использовать логику, чтобы проверить,
// загрузились ли шрифты, данные и т.д.

// Для начала просто перенаправляем на вкладки:
export default function InitialLoadScreen() {
  return <Redirect href="/pythagoras" />;
}
