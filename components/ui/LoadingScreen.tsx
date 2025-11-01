// components/LoadingScreen.tsx
import { t } from '@/lib/constants/locales';
import { COLORS, FONTS, LAYOUT, SPACING } from '@/lib/constants/theme';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import LOGO_IMAGE from '../../assets/images/NumericalCompass.png';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
      <ActivityIndicator size="large" color={COLORS.loading} style={styles.spinner} />
      <Text style={{ color: COLORS.textSecondary, marginTop: SPACING.md, fontFamily: FONTS.loading.fontFamily }}>
        {t('loadingNumerology')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: LAYOUT.logoSmall,
    height: LAYOUT.logoSmall,
    marginBottom: LAYOUT.logoMarginBottom,
  },
  spinner: {
    marginTop: LAYOUT.spinnerMarginTop,
  },
});
