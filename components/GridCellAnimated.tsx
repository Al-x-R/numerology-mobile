// components/GridCellAnimated.tsx
import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { getInterpretation } from '@/lib/data/pythagoreanInterpretations';
import { getHighlightType } from '@/lib/utils/highlight';


interface GridCellProps {
  id: string;
  value: string;
  cellSize: number;
  onPress: () => void;
  index: number;
}

export function GridCellAnimated({ id, value, cellSize, onPress, index }: GridCellProps) {
  const title = getInterpretation(id, value).title.split(' (')[0];

  // Анимационные значения
  const containerOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.8);
  const labelOpacity = useSharedValue(0);
  const labelY = useSharedValue(-10);
  const valueScale = useSharedValue(0.5);
  const valueOpacity = useSharedValue(0);
  const tooltipOpacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 80; // Каждая ячейка с задержкой

    // 1. Контейнер
    containerOpacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    containerScale.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
    );

    // 2. Заголовок
    labelOpacity.value = withDelay(delay + 200, withTiming(1, { duration: 300 }));
    labelY.value = withDelay(delay + 200, withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }));

    // 3. Значение
    valueOpacity.value = withDelay(delay + 300, withTiming(1, { duration: 400 }));
    valueScale.value = withDelay(
      delay + 300,
      withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      )
    );

    if (highlight !== 'none') {
      tooltipOpacity.value = withDelay(delay + 600, withTiming(1, { duration: 300 }));
    }
  }, [index]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ translateY: labelY.value }],
  }));

  const valueStyle = useAnimatedStyle(() => ({
    opacity: valueOpacity.value,
    transform: [{ scale: valueScale.value }],
  }));

  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
  }));

  const getTooltipText = (id: string, value: string): string => {
    const v = value || '—';

    // СЛАБЫЕ
    if (id === '1' && (v === '1' || v === '11')) return 'Слабая воля';
    if (v === '—' && id !== '7') {
      const labels: Record<string, string> = {
        '4': 'Слабое здоровье',
        '2': 'Нет энергии',
        '5': 'Слабая логика',
        '6': 'Лень',
        '8': 'Эгоизм',
        '9': 'Плохая память',
      };
      return labels[id] || 'Нужно развивать';
    }

    // СИЛЬНЫЕ
    if (v.includes('222')) return 'Экстрасенс';
    if (v.includes('333')) return 'Гениальность';
    if (v.includes('555')) return 'Ясновидение';
    if (v.includes('666')) return 'Темперамент';
    if (v.includes('888')) return 'Ответственность';
    if (v.includes('999')) return 'Пророк';

    return 'Суперсила!';
  };

  const highlight = getHighlightType(id, value);

  return (
    <Animated.View style={[containerStyle]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.cell,
          { width: cellSize },
          highlight === 'weak' && styles.cellWeak,
          highlight === 'strong' && styles.cellStrong,
        ]}
        activeOpacity={0.8}
      >

        <Animated.Text style={[styles.cellLabel, labelStyle]}>
          {title}
        </Animated.Text>

        <Animated.Text
          style={[
            styles.cellValue,
            valueStyle,
          ]}
        >
          {value || '—'}
        </Animated.Text>

        {/* Tooltip */}
        {highlight !== 'none' && (
          <Animated.View style={[styles.tooltipWrapper, tooltipStyle]}>
            <View style={[
              styles.tooltip,
              highlight === 'weak' ? styles.tooltipWeak : styles.tooltipStrong,
            ]}>
              <Text style={styles.tooltipText}>
                {getTooltipText(id, value)}
              </Text>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
    position: 'relative',
    // overflow: 'hidden',
  },
  cellAccent: {
    backgroundColor: 'rgba(122, 95, 255, 0.1)',
    borderColor: '#7A5FFF',
  },
  cellWeak: {
    borderColor: '#FF9500',
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
  },
  cellStrong: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  pulseOverlay: {
    backgroundColor: 'rgba(224, 184, 115, 0.15)',
    borderRadius: 10,
  },
  cellLabel: {
    fontSize: 12,
    color: '#E0B873',
    textAlign: 'center',
    paddingTop: 5
  },
  cellValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  textAccent: {
    color: '#E0B873',
  },
  // TOOLTIPS
  tooltipWrapper: {
    position: 'absolute',
    top: -8,
    alignItems: 'center',
    zIndex: 10,
  },
  tooltip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  tooltipWeak: {
    backgroundColor: '#FF9500',
  },
  tooltipStrong: {
    backgroundColor: '#8B5CF6',
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
});
