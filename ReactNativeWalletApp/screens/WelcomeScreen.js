import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation , useRoute} from '@react-navigation/native';


const WelcomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur SAFE PAY</Text>
      <Text style={styles.description}>
        Choisissez une option ci-dessous pour continuer.
      </Text>

      <View style={[styles.buttonContainer, styles.firstButtonContainer]}>
        <Text style={styles.buttonDescription}>
          Accédez à vos services Safe Pay si vous êtes déjà client de CIH BANK.
        </Text>
        <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate('bankAccountNumber', { phoneNumber })}>
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.buttonDescription}>
          Créez un nouveau compte Safe Pay si vous êtes un nouveau client.
        </Text>
        <TouchableOpacity style={styles.button}
         onPress={() => navigation.navigate('CreateWalletForm', { phoneNumber })}>
          <Text style={styles.buttonText}>Créer mon Portefeuille</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007bff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '90%',
    marginVertical: 10,
    alignItems: 'center',
  },
  firstButtonContainer: {
    marginBottom: 30, 
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonDescription: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'serif',
  },
});

export default WelcomeScreen;
