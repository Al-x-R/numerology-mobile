// components/ui/LanguageButton.tsx
import { t } from '@/lib/constants/locales';
import { COLORS, LAYOUT } from '@/lib/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export const LanguageButton = () => {
  const handleLanguageChange = () => {
    alert(t('changeLanguageAlert'));
  };

  return (
    <TouchableOpacity onPress={handleLanguageChange} style={{ marginRight: LAYOUT.languageButtonMarginRight }}>
      <Ionicons name="globe-outline" size={LAYOUT.iconSize} color={COLORS.accent} />
    </TouchableOpacity>
  );
};
