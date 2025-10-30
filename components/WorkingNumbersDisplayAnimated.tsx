// components/WorkingNumbersDisplayAnimated.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { workingMeanings } from '@/lib/data/workingNumberMeanings';
import { contextualInterpretations } from '@/lib/data/additionalNumberInterpretations';
import { Interpretation } from '@/lib/types';

interface WorkingNumbersDisplayProps {
  workingNumbers: number[];
  onPress: (data: Interpretation) => void;
  textAccentStyle: any;
}

function getFullWorkingInterpretation(id: string, value: number): Interpretation {
  const context = contextualInterpretations[id as keyof typeof contextualInterpretations];
  const meaning = workingMeanings[value];

  if (!context || !meaning) {
    return { title: 'Ошибка', description: 'Данные не найдены.' };
  }

  const fullDescription = `${context.description}\n\nИнтерпретация числа ${value}:\n${meaning}`;

  return {
    title: context.title,
    description: fullDescription,
  };
}

export function WorkingNumbersDisplayAnimated({
  workingNumbers,
  onPress,
  textAccentStyle,
}: WorkingNumbersDisplayProps) {
  return (
    <View style={styles.numbersSection}>
      <Text style={styles.sectionTitle}>Дополнительные числа</Text>
      <View style={styles.numbersGrid}>
        {workingNumbers.map((num, index) => (
          <WorkingNumberCard
            key={index}
            index={index}
            num={num}
            numberId={`working${index + 1}`}
            onPress={onPress}
          />
        ))}

        <FateCard value={workingNumbers[1]} onPress={onPress} textAccentStyle={textAccentStyle} />
      </View>
    </View>
  );
}

// === WORKING NUMBER ===
const WorkingNumberCard: React.FC<{
  index: number;
  num: number;
  numberId: string;
  onPress: (data: Interpretation) => void;
}> = ({ index, num, numberId, onPress }) => {
  const interpretationData = getFullWorkingInterpretation(numberId, num);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(15);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const delay = index * 100 + 400;

    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 450, easing: Easing.out(Easing.quad) }));
    scale.value = withDelay(delay, withTiming(1, { duration: 450 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity style={styles.numberCard} onPress={() => onPress(interpretationData)}>
        <Text style={styles.numberLabel}>
          {interpretationData.title.split(' ')[0]} раб. число
        </Text>
        <Text style={styles.numberValue}>{num}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// === NUMBER OF DESTINY ===
const FateCard: React.FC<{
  value: number;
  onPress: (data: Interpretation) => void;
  textAccentStyle: any;
}> = ({ value, onPress, textAccentStyle }) => {
  const interpretationData = getFullWorkingInterpretation('destiny', value);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const delay = 900;

    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.08, { duration: 300 }),
        withTiming(1, { duration: 300 })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, { width: '100%' }]}>
      <TouchableOpacity
        style={styles.fateCardFinal}
        onPress={() => onPress(interpretationData)}
      >
        <Text style={styles.numberLabel}>Число Судьбы</Text>
        <Text style={[styles.numberValue, styles.fateValue, textAccentStyle]}>
          {value}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  numbersSection: { marginTop: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 5,
  },
  numberCard: {
    width: (Dimensions.get('window').width - 48) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  numberLabel: {
    fontSize: 12,
    color: '#E0B873',
    marginBottom: 4,
  },
  numberValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fateCardFinal: {
    width: '100%',
    backgroundColor: 'rgba(224, 184, 115, 0.1)',
    borderColor: '#7A5FFF',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    paddingVertical: 15,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fateValue: {
    fontSize: 30,
  },
});
