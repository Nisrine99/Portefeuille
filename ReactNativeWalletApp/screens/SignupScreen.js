import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/images/logo.webp';
import apiNoAuth from '../apiNoAuth';

const SignupScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (phoneNumber.trim() === '') {
      Alert.alert('Erreur', 'Veuillez saisir un numéro de téléphone.');
      return;
    }

    try {
      const response = await apiNoAuth.post('/users/register-phone', { phoneNumber });
      Alert.alert('Succès', response.data.message);
      navigation.navigate('Welcome', { phoneNumber });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Erreur', error.response.data.message);
      } else {
        Alert.alert('Erreur', 'Échec de l\'enregistrement du numéro de téléphone.');
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
        placeholder="Numéro de téléphone"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
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

export default SignupScreen;
