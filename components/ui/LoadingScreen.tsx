// components/LoadingScreen.tsx
import { View, Image, StyleSheet, Text, ActivityIndicator } from 'react-native';
import LOGO_IMAGE from '../../assets/images/NumericalCompass.png';
import { SPACING } from '@/lib/constants/theme';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      <ActivityIndicator size="large" color="#FFD700" style={styles.spinner} />
      <Text style={{ color: '#A0A0A0', marginTop: SPACING.md, fontFamily: 'Manrope-Regular' }}>
        Загрузка нумерологии...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  spinner: {
    marginTop: 20,
  },
});
