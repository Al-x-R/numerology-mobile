import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface DateInputFormProps {
  onSubmit: () => void;
  date: string;
  setDate: (date: string) => void;
  error: string;
}

const formatRussianDate = (text: string): string => {
  let cleanedText = text.replace(/[^0-9]/g, '');

  if (cleanedText.length > 8) {
    cleanedText = cleanedText.substring(0, 8);
  }

  if (cleanedText.length > 2) {
    cleanedText = cleanedText.substring(0, 2) + '.' + cleanedText.substring(2);
  }

  if (cleanedText.length > 5) {
    cleanedText = cleanedText.substring(0, 5) + '.' + cleanedText.substring(5);
  }

  return cleanedText;
};

export function DateInputForm({
  onSubmit,
  date,
  setDate,
  error,
}: DateInputFormProps) {
  const handleTextChange = (text: string) => {
    const formattedText = formatRussianDate(text);
    setDate(formattedText);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Код Даты</Text>
      <Text style={styles.subtitle}>Рассчитайте свой Квадрат Пифагора</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error ? styles.inputError : {}]}
          placeholder="Введите дату рождения (ДД.ММ.ГГГГ)"
          placeholderTextColor="#A0A0A0"
          value={date}
          onChangeText={handleTextChange}
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
    maxWidth: 450,
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: 'transparent', // Added to ensure transparency
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
    color: '#E0B873',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 40,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 35,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
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
    backgroundColor: '#7A5FFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#7A5FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
