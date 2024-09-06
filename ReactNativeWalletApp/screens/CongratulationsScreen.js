import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native'; 

const CongratulationsScreen = ({ navigation }) => {
  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <LottieView
        source={require('../assets/animations/congratulations.json')} 
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.congratulationsText}>Félicitations !</Text>
      <Text style={styles.description}>Vous avez créé votre wallet avec succès.</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoToLogin}>
        <Text style={styles.buttonText}>Se Connecter</Text>
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
    width: 170,
    height: 170,
  },
  appName: {
    fontSize: 24,
    color: '#007bff',
    marginBottom: 20,
  },
  animation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  congratulationsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CongratulationsScreen;
