// components/ui/LanguageButton.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from '@/lib/constants/locales';

export const LanguageButton = () => {
  const handleLanguageChange = () => {
    alert(t('changeLanguageAlert'));
  };

  return (
    <TouchableOpacity onPress={handleLanguageChange} style={{ marginRight: 15 }}>
      <Ionicons name="globe-outline" size={24} color="#E0B873" />
    </TouchableOpacity>
  );
};
