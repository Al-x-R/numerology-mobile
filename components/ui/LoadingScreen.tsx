// components/ui/LoadingScreen.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Destiny Code</Text>
      <ActivityIndicator size="large" color="#E0B873" style={{ marginTop: 20 }} />
      <Text style={styles.loadingText}>Loading Data...</Text>
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
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  loadingText: {
    color: '#A0A0A0',
    marginTop: 10,
    fontSize: 16,
  },
});
