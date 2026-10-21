import React, { useState, useEffect, useCallback } from 'react';
import { Alert, StyleProp, StyleSheet, View, ViewStyle, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';

import { DateInputForm } from '@/components/DateInputForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { calculatePythagoreanSquare } from '@/lib/calculators/pythagoreanSquare';
import { CalculationResult } from '@/lib/types/calculation';
import { ProfileButton } from '@/components/ui/ProfileButton';
import { HeaderEmblem } from '@/components/ui/HeaderEmblem';
import { COLORS, FONT_FAMILY, LAYOUT, SPACING, TYPE } from '@/lib/constants/theme';
import { TAB_BAR_STYLE } from '@/lib/constants/navigation';
import { AuraBackground } from '@/components/ui/AuraBackground';
import { BackButton } from '@/components/ui/BackButton';
import { SaveCalculationButton } from '@/components/SaveCalculationButton';
import { useAppTranslation } from '@/contexts/LanguageContext';
import { useInterstitial } from '@/hooks/useAdMob';
import { parseLocalDate } from '@/lib/utils/date';

// DD.MM.YYYY -> Date, or null if the date is invalid
const parseFormDate = (dateString: string): Date | null => {
  const [day, month, year] = dateString.split('.');
  const date = parseLocalDate(`${year}-${month}-${day}`);
  return isNaN(date.getTime()) ? null : date;
};

export default function HomeScreen() {
  const [dateString, setDateString] = useState<string>('');
  const [results, setResults] = useState<CalculationResult | null>(null);
  // Set when a saved matrix is opened from storage
  const { date: savedDate, open: openToken } = useLocalSearchParams<{ date?: string; open?: string }>();
  const [handledOpenToken, setHandledOpenToken] = useState<string>();

  // Saved entries open without an interstitial: the user has already calculated them once
  if (openToken && openToken !== handledOpenToken) {
    setHandledOpenToken(openToken);
    const dateObj = savedDate ? parseFormDate(savedDate) : null;
    if (savedDate && dateObj) {
      setDateString(savedDate);
      setResults(calculatePythagoreanSquare(dateObj));
    }
  }

  const navigation = useNavigation();
  const { t, language } = useAppTranslation();
  const { showInterstitial } = useInterstitial();

  const handleCalculate = () => {
    showInterstitial(() => {
      try {
        const dateObj = parseFormDate(dateString);
        if (!dateObj) return;

        setResults(calculatePythagoreanSquare(dateObj));
      } catch (e) {
        console.error(e);
        Alert.alert(t('common.error'), t('errors.calculationFailed'));
      }
    });
  };

  const handleBack = useCallback(() => {
    setResults(null);
    setDateString('');
  }, []);

  const contentStyle: StyleProp<ViewStyle> = results ?
    { justifyContent: 'flex-start', alignItems: 'stretch' } :
    { alignItems: 'stretch' };

  useEffect(() => {
    if (results) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle} numberOfLines={1}>{t('analysisTitle')}</Text>
            <View style={styles.resultDateRow}>
              <View style={styles.resultDot} />
              <Text style={styles.resultDate}>{dateString}</Text>
            </View>
          </View>
        ),
        headerLeft: () => <BackButton onPress={handleBack} style={styles.headerLeft} />,
        headerRight: () => (
          <SaveCalculationButton input={{ kind: 'matrix', date: dateString }} style={styles.headerRight} />
        ),
        tabBarStyle: { display: 'none' },
      });
    } else {
      navigation.setOptions({
        headerTitle: t('tabs.pythagoras'),
        headerLeft: () => <HeaderEmblem />,
        headerRight: () => <ProfileButton onPress={() => router.push('/profile')} />,
        tabBarStyle: TAB_BAR_STYLE,
      });
    }

  }, [navigation, results, handleBack, dateString, language]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={results ? ['bottom', 'left', 'right'] : ['left', 'right']}
    >
      <AuraBackground />
      <View style={[styles.content, contentStyle]}>
        {!results ? (
          <DateInputForm
            date={dateString}
            setDate={setDateString}
            onSubmit={handleCalculate}
          />
        ) : (
          <ResultsDisplay results={results} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  resultHeader: { alignItems: 'center' },
  resultTitle: { ...TYPE.headlineMd, fontFamily: FONT_FAMILY.serif.semibold },
  resultDateRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  resultDot: { width: SPACING.xs, height: SPACING.xs, borderRadius: SPACING.xs / 2, backgroundColor: COLORS.textSecondary },
  resultDate: {
    ...TYPE.labelMd,
    fontSize: TYPE.bodySm.fontSize,
    lineHeight: TYPE.bodySm.lineHeight,
    color: COLORS.textTertiary,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  headerLeft: { marginLeft: LAYOUT.contentPadding },
  headerRight: { marginRight: LAYOUT.contentPadding },
  container: {
    flex: 1,
    backgroundColor: COLORS.transparent,
  },
  content: {
    flex: 1,
    paddingHorizontal: LAYOUT.contentPadding,
    alignItems: 'center',
  },
});
