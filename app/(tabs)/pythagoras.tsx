import React, { useState, useEffect, useCallback } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DateInputForm } from '@/components/DateInputForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { calculatePythagoreanSquare } from '@/lib/calculators/pythagoreanSquare';
import { CalculationResult } from '@/lib/types';
import { LanguageButton } from '@/components/ui/LanguageButton';
import LOGO_IMAGE from '@/assets/images/NumericalCompass.png';

const HeaderBackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    }}
  >
    <MaterialCommunityIcons
      name="arrow-left-thick"
      size={24}
      color="#A0A0A0"
      style={{ marginRight: 6 }}
    />
    <Text
      style={{
        color: '#A0A0A0',
        fontSize: 18,
        marginLeft: -3,
      }}
    >
      Back
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
    {  alignItems: 'center', marginTop: 80 };

  useEffect(() => {
    if (results) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Анализ Даты</Text>
            <Text style={styles.headerSubtitle}>{dateString}</Text>
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
        headerTitle: 'Психоматрица',
        headerLeft: () => null,
        headerRight: () => <LanguageButton />,
      });
    }

  }, [navigation, results, handleBack, dateString]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1A1C33', '#0D0F21']} style={styles.background}>
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
    backgroundColor: 'transparent', // Match the gradient background
  },
  headerTitle: {
    color: '#E0B873',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  logo: {
    width: '150%', // Adjusted for better fit
    maxWidth: 700,
    maxHeight: 700,
    opacity: 0.2,
  },
});
