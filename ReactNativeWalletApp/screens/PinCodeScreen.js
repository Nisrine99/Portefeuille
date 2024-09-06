import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import apiNoAuth from '../apiNoAuth';

const PinCodeScreen = () => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;

  const handleConfirm = async () => {
    if (!pin || !confirmPin) {
      Alert.alert('Erreur', 'Veuillez entrer le code PIN dans les deux champs.');
      return;
    }
    if (pin.length !== 4 || confirmPin.length !== 4) {
      Alert.alert('Erreur', 'Le code PIN doit être composé de 4 chiffres.');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert('Erreur', 'Les codes PIN ne correspondent pas.');
      return;
    }

    try {
      await apiNoAuth.post('/users/set-pin', { pin, confirmPin });
      Alert.alert('Succès', 'Le code PIN a été confirmé avec succès!');
      navigation.navigate('Congratulations');
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert('Erreur', error.response.data.message || 'Échec de la confirmation du code PIN');
      } else {
        Alert.alert('Erreur', 'Échec de la confirmation du code PIN');
      }
    }
  };

  const handleCancel = () => {
    setPin('');
    setConfirmPin('');
    navigation.navigate('Hello');
  };

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <Text style={styles.description}>Merci d'entrer votre code PIN pour synchroniser vos transactions</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={4}
          placeholder="Entrer le code PIN"
          secureTextEntry={secureTextEntry}
          value={pin}
          onChangeText={setPin}
        />
        <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.eyeIcon}>
          <Icon name={secureTextEntry ? 'eye' : 'eye-off'} size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={4}
          placeholder="Confirmer le code PIN"
          secureTextEntry={secureTextEntry}
          value={confirmPin}
          onChangeText={setConfirmPin}
        />
        <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.eyeIcon}>
          <Icon name={secureTextEntry ? 'eye' : 'eye-off'} size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

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
  },
  appName: {
    fontSize: 24,
    color: '#007bff',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  eyeIcon: {
    marginLeft: 10,
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
    marginHorizontal: 10,
    marginLeft: 0,
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

export default PinCodeScreen;
