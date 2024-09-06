import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiNoAuth from '../apiNoAuth';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setPhoneNumber('');
      setPassword('');
    }, [])
  );

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (phoneNumber === '' || password === '') {
      Alert.alert('Erreur', 'Veuillez saisir votre numéro de téléphone et mot de passe.');
      return;
    }
  
    try {
      const response = await apiNoAuth.post('/auth/login', { phoneNumber, password });
      
      const { token, expiresIn } = response.data;
  
      await AsyncStorage.setItem('userToken', token);
  
      Alert.alert('Succès', 'Connexion réussie!');
      navigation.navigate('Drawer', { screen: 'Dashboard' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Échec de la connexion. Veuillez réessayer.';
      Alert.alert('Erreur', errorMessage);
    }
  };
  

  const handleCancel = () => {
    setPhoneNumber('');
    setPassword('');
    navigation.navigate('Hello');
  };

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <Text style={styles.description}>Login</Text>

      <TextInput
        style={styles.phoneNumberInput}
        keyboardType="phone-pad"
        placeholder="Numéro de téléphone"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mot de passe"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.eyeIcon}>
          <Icon name={secureTextEntry ? 'eye' : 'eye-off'} size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
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
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    color: '#007bff',
    marginBottom: 20,
  },
  description: {
    fontSize: 30,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  phoneNumberInput: {
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
    marginLeft: 0,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
