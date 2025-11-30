// app/premium/upgrade.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, GRADIENTS } from '@/lib/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTranslation } from '@/contexts/LanguageContext';

export default function PremiumUpgradeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();

  const handlePurchase = () => {
    // Тут будет логика RevenueCat или IAP
    console.log("Purchase initiated");
  };

  // Формируем список преимуществ через локализацию
  const benefits = [
    t('premium.benefits.compatibility'),
    t('premium.benefits.horoscope'),
    t('premium.benefits.karma'),
    t('premium.benefits.ads')
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1F1D36', '#000000']} style={StyleSheet.absoluteFill} />

      {/* Кнопка закрытия */}
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 10 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 60, paddingBottom: 40, alignItems: 'center' }}>

        {/* Заголовок и иконка */}
        <View style={styles.header}>
          <LinearGradient colors={GRADIENTS.button} style={styles.iconContainer}>
            <MaterialCommunityIcons name="crown" size={40} color="black" />
          </LinearGradient>

          <Text style={styles.title}>
            Destiny Code <Text style={{color: COLORS.accent}}>{t('premium.title')}</Text>
          </Text>
          <Text style={styles.subtitle}>{t('premium.subtitle')}</Text>
        </View>

        {/* Список преимуществ */}
        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.accent} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Карточки тарифов */}
        {/* План: ГОД */}
        <TouchableOpacity style={styles.planCard} onPress={handlePurchase}>
          <View style={styles.planInfo}>
            <Text style={styles.planTitle}>{t('premium.plans.year')}</Text>
            <Text style={styles.planPrice}>{t('premium.plans.priceYear')}</Text>
            <Text style={styles.saveBadge}>{t('premium.plans.save')}</Text>
          </View>
          <View style={styles.radioCircle} />
        </TouchableOpacity>

        {/* План: МЕСЯЦ (Активный) */}
        <TouchableOpacity style={[styles.planCard, styles.planCardActive]} onPress={handlePurchase}>
          <LinearGradient colors={['rgba(255, 215, 0, 0.1)', 'transparent']} style={StyleSheet.absoluteFill} />
          <View style={styles.planInfo}>
            <Text style={[styles.planTitle, {color: COLORS.accent}]}>{t('premium.plans.month')}</Text>
            <Text style={styles.planPrice}>{t('premium.plans.priceMonth')}</Text>
          </View>
          <Ionicons name="checkmark-circle" size={28} color={COLORS.accent} />
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          {t('premium.disclaimer')}
        </Text>

      </ScrollView>

      {/* Кнопка действия */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.ctaButton} onPress={handlePurchase}>
          <LinearGradient colors={GRADIENTS.button} style={styles.ctaGradient}>
            <Text style={styles.ctaText}>{t('premium.ctaTry')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      '#000'
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    padding: 5
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    ...FONTS.title,
    fontSize: 32,
    color: 'white'
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 10
  },
  benefitsContainer: {
    paddingHorizontal: 30,
    marginBottom: 40
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  benefitText: {
    ...FONTS.body,
    color: 'white',
    marginLeft: 15, fontSize: 16
  },
  planCard: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333'
  },
  planCardActive: {
    borderColor:
    COLORS.accent
  },
  planInfo: {

  },
  planTitle: {
    ...FONTS.subtitle,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  planPrice: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  saveBadge: {
    color: COLORS.battery.full,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666'
  },
  footer: {
    paddingHorizontal: 20 },
  ctaButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden'
  },
  ctaGradient: {
    paddingVertical: 18,
    alignItems: 'center'
  },
  ctaText: {
    ...FONTS.button,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold'
  },
  disclaimer: {
    width: '80%',
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 20
  },
});
