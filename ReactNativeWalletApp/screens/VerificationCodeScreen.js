import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import apiNoAuth from '../apiNoAuth'; 

const VerificationCodeScreen = () => {
  const [code, setCode] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;

  const handleCodeInput = (input) => {
    setCode(input);
  };

  const handleConfirm = async () => {
    if (!code) {
        Alert.alert('Veuillez entrer un code.');
        return;
    }

    if (code.length !== 6) {
        Alert.alert('Veuillez entrer un code valide.');
        return;
    }

    try {
        console.log('Sending verification request with:', { phoneNumber, code });
        const response = await apiNoAuth.post('/sms/verify-code', { phoneNumber, code });
        console.log('Received response:', response.data.message);
        if (response.data.success) {
            Alert.alert('Code confirmé!');
            navigation.navigate('Password', { phoneNumber });
        } else {
            Alert.alert(response.data.message);
        }
    } catch (error) {
        console.error('Failed to verify code:', error);
        Alert.alert('Une erreur est survenue. Veuillez réessayer.');
    }
};


  const handleCancel = () => {
    setCode('');
    navigation.navigate('Hello');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <Icon name="lock" size={50} color="#007bff" style={styles.icon} />
      <Text style={styles.instruction}>Entrez le code reçu sur votre téléphone</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        placeholder="Entrer le code"
        value={code}
        onChangeText={handleCodeInput}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Annuler</Text>
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
  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    color: '#007bff',
    marginBottom: 20,
  },
  icon: {
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    width: '80%',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default VerificationCodeScreen;
