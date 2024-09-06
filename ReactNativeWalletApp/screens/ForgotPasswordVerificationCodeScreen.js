import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert , Image } from 'react-native';
import apiNoAuth from '../apiNoAuth'; 
import Icon from 'react-native-vector-icons/Feather';


const ForgotPasswordVerificationCodeScreen = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Erreur', 'Veuillez entrer le code de vérification.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiNoAuth.post('/profile/verify-reset-code', {
        phoneNumber,
        code
      });

      if (response.status === 200) {
        navigation.navigate('ResetPassword', { phoneNumber });
      } else {
        Alert.alert('Erreur', 'Code de vérification invalide ou expiré.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de vérifier le code. Veuillez réessayer.');
    } finally {
      setLoading(false);
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
      <Text style={styles.title}>Vérification du Code</Text>
      <Text style={styles.description}>
        Un code a été envoyé à votre numéro de téléphone. Veuillez entrer ce code pour continuer.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Code de vérification"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyCode}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Vérification...' : 'Vérifier'}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
    paddingHorizontal: 20,
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
    paddingHorizontal: 25,
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

export default ForgotPasswordVerificationCodeScreen;
