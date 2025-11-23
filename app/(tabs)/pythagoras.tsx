import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DateInputForm } from '@/components/DateInputForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { calculatePythagoreanSquare } from '@/lib/calculators/pythagoreanSquare';
import { CalculationResult } from '@/lib/types/calculation';
import { ProfileButton } from '@/components/ui/ProfileButton';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';
import { t } from '@/lib/constants/locales';
import { COLORS, FONTS, GRADIENTS, SPACING, LAYOUT } from '@/lib/constants/theme';

const HeaderBackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: SPACING.md,
    }}
  >
    <MaterialCommunityIcons
      name="arrow-left-thick"
      size={LAYOUT.iconSize}
      color={COLORS.textSecondary}
      style={{ marginRight: SPACING.sm }}
    />
    <Text style={FONTS.button}>
      {t('back')}
    </Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [dateString, setDateString] = useState<string>('');
  const [results, setResults] = useState<CalculationResult | null>(null);

  const navigation = useNavigation();

  const handleCalculate = () => {
    // DATE CONVERSION: DD.MM.YYYY -> YYYY-MM-DD
    const parts = dateString.split('.'); // ['02', '07', '1985']
    // new Date() in JavaScript doesn't work well with DD/MM/YYYY,
    // but works well with YYYY-MM-DD
    const isoDateString = `${parts[2]}-${parts[1]}-${parts[0]}`;

    try {
      const dateObj = new Date(isoDateString);
      if (isNaN(dateObj.getTime())) {
        return;
      }

      const calcResults = calculatePythagoreanSquare(dateObj);
      setResults(calcResults);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBack = useCallback(() => {
    setResults(null);
    setDateString('');
  }, []);

  const contentStyle: StyleProp<ViewStyle> = results ?
    { justifyContent: 'flex-start', alignItems: 'stretch' } :
    {  alignItems: 'center', marginTop: LAYOUT.topMarginLarge };

  useEffect(() => {
    if (results) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={{ alignItems: 'center' }}>
            <Text style={FONTS.headerTitle}>{t('analysisTitle')}</Text>
            <Text style={FONTS.headerSubtitle}>{dateString}</Text>
          </View>
        ),
        headerLeft: () => <HeaderBackButton onPress={handleBack} />,
        headerRight: () => (
          <View style={{ alignItems: 'center' }} />
        ),
        tabBarStyle: { display: 'none' },
      });
    } else {
      navigation.setOptions({
        headerTitle: t('pythagorasTitle'),
        headerLeft: () => null,
        headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
        tabBarStyle: {
          display: 'flex',
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.background
        },
      });
    }

  }, [navigation, results, handleBack, dateString]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={GRADIENTS.background} style={styles.background}>
        <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      </LinearGradient>
      <View style={[styles.content, contentStyle]}>
        {!results ? (
          <DateInputForm
            date={dateString}
            setDate={setDateString}
            onSubmit={handleCalculate}
          />
        ) : (
          <ResultsDisplay results={results} date={dateString} onBack={handleBack} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.transparent, // Match the gradient background
  },
  content: {
    flex: 1,
    paddingHorizontal: LAYOUT.contentPadding,
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  logo: {
    width: '150%', // Adjusted for better fit
    maxWidth: LAYOUT.logoLarge,
    maxHeight: LAYOUT.logoLarge,
    opacity: 0.2,
  },
});
