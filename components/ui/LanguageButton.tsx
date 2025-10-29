// components/ui/LanguageButton.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const LanguageButton = () => {
  const handleLanguageChange = () => {
    alert('Сменить язык!');
  };

  return (
    <TouchableOpacity onPress={handleLanguageChange} style={{ marginRight: 15 }}>
      <Ionicons name="globe-outline" size={24} color="#E0B873" />
    </TouchableOpacity>
  );
};
