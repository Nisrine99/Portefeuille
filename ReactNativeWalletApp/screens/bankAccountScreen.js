import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import logo from '../assets/images/logo.webp';
import apiNoAuth from '../apiNoAuth';

const BankAccountScreen = () => {
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;  

  const handleSubmit = async () => {
    try {
      const bankResponse = await apiNoAuth.post('/users/verify-and-update-bank-account', { phoneNumber , bankAccountNumber });

      navigation.navigate('AccountType', { phoneNumber });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to process request.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafePay</Text>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <Text style={styles.message}>Créez votre wallet pour gérer vos transactions en toute simplicité.</Text>
      <TextInput
        style={styles.input}
        placeholder="Numéro de compte bancaire"
        keyboardType="numeric"
        value={bankAccountNumber}
        onChangeText={setBankAccountNumber}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Hello')}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007bff',
    fontFamily: 'serif',
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    color: '#007bff',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BankAccountScreen;
