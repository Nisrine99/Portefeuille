import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import api from '../api';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChangePinScreen = () => {
  const [currentPin, setCurrentPin] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleUpdate = async () => {
    if (!currentPin || !pin || !confirmPin) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'Pins do not match.');
      return;
    }

    try {
      await api.put('/profile/update-pin', { currentPin, pin, confirmPin }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      Alert.alert('Success', 'Pin updated successfully.');
      clearFields();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to update pin.');
      }
    }
  };

  const clearFields = () => {
    setCurrentPin('');
    setPin('');
    setConfirmPin('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
        <Text style={styles.appName}>SAFE PAY</Text>
      </View>
      <Text style={styles.title}>Modifier votre code PIN</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ancien code PIN"
          value={currentPin}
          onChangeText={setCurrentPin}
          keyboardType="numeric"
          secureTextEntry={!showCurrentPin}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowCurrentPin(!showCurrentPin)}
        >
          <Icon name={showCurrentPin ? 'eye' : 'eye-slash'} size={20} color="#007bff" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nouveau code PIN"
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          secureTextEntry={!showPin}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPin(!showPin)}
        >
          <Icon name={showPin ? 'eye' : 'eye-slash'} size={20} color="#007bff" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirmer le code PIN"
          value={confirmPin}
          onChangeText={setConfirmPin}
          keyboardType="numeric"
          secureTextEntry={!showConfirmPin}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPin(!showConfirmPin)}
        >
          <Icon name={showConfirmPin ? 'eye' : 'eye-slash'} size={20} color="#007bff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Mettre à jour</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 5,
    marginBottom: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
  },
  inputContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChangePinScreen;
