// HelloPage.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LottieView from 'lottie-react-native';

const HelloPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/welcome.json')}
        autoPlay
        loop
        style={styles.welcomeAnimation}
      />
      <LottieView
        source={require('../assets/animations/wallet.json')}
        autoPlay
        loop
        style={styles.walletAnimation}
      />
      <Text style={styles.title}>Bienvenue sur SAFE PAY</Text>
      <Text style={styles.description}>Vous avez déjà un compte ? Connectez-vous ou créez un nouveau compte.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Se Connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.signUpButton]}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Créer mon Portefeuille</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPasswordPhoneNumber')}
        style={styles.forgotPasswordLink}
      >
        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
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
  welcomeAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  walletAnimation: {
    width: 230,
    height: 230,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  signUpButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  forgotPasswordLink: {
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default HelloPage;
