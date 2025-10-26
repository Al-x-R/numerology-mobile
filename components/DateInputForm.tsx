// components/DateInputForm.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity, // use it for a custom button
  StyleSheet,
} from 'react-native';

interface DateInputFormProps {
  onSubmit: () => void;
  date: string;
  setDate: (date: string) => void;
  error: string;
}

export function DateInputForm({
  onSubmit,
  date,
  setDate,
  error,
}: DateInputFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>#</Text>
      </View>

      <Text style={styles.title}>Код Даты</Text>
      <Text style={styles.subtitle}>Рассчитайте свой Квадрат Пифагора</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error ? styles.inputError : {}]}
          placeholder="Введите дату рождения (ГГГГ-ММ-ДД)"
          placeholderTextColor="#A0A0A0"
          value={date}
          onChangeText={setDate}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Рассчитать</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 50,
    padding: 8,
  },
  icon: {
    fontSize: 32,
    color: '#E0B873',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 40,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 25,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  button: {
    width: '100%',
    backgroundColor: '#7A5FFF', // Accent-bg
    paddingVertical: 16,
    borderRadius: 10,
    shadowColor: '#7A5FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6, // Android shadow
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
