import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity , Image } from 'react-native';
import api from '../api';
import Icon from 'react-native-vector-icons/Feather'; 


const RechargeBankAccountScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');

  const handleRecharge = async () => {
    if (amount === '' || bankAccountNumber === '') {
      Alert.alert('Erreur', 'Veuillez entrer un montant et un numéro de compte.');
      return;
    }
  
    try {
      const response = await api.post('/wallet/recharge/bank/prepare', null, {
        params: {
          bankAccountNumber,
          amount: parseFloat(amount),
        },
      });
      const transactionId = response.data; 
  
      
      const transactionType = 'RECHARGE_BANK';
  
      navigation.navigate('PinVerification', { transactionId, transactionType });
  
    } catch (error) {
      let errorMessage = 'Erreur inconnue';
  
      if (error.response) {
        errorMessage = error.response.headers['error-message'] || 'Erreur inconnue';
      }
  
      Alert.alert('Erreur', errorMessage);
    }
  };
  
  
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('RechargeOptions')}>
        <Icon name="chevron-left" size={24} color="#007bff" style={styles.backButtonIcon} />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <Text style={styles.title}>Recharge par compte bancaire</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Montant"
        placeholderTextColor="#888"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro de compte bancaire"
        placeholderTextColor="#888"
        value={bankAccountNumber}
        onChangeText={setBankAccountNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleRecharge}>
        <Text style={styles.buttonText}>Recharger</Text>
      </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
  },
  appName: {
    fontSize: 24,
    color: '#007bff',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: 45,
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  backButtonIcon: {
    fontSize: 24,
    color: '#007bff',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    marginLeft: 8,
  },
});

export default RechargeBankAccountScreen;
