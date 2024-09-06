import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import api from '../api'; 

const WalletAccountNumberScreen = () => {
  const [accountNumber, setAccountNumber] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountNumber = async () => {
      try {
        const response = await api.get('/profile/account-number');
        console.log('Response Data:', response.data);
        setAccountNumber(String(response.data));
      } catch (error) {
        console.error('Error fetching account number:', error.response || error.message);
        Alert.alert('Erreur', 'Échec de la récupération du numéro de compte');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountNumber();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <Text style={styles.title}>Votre Numéro de compte est:</Text>
      <Text style={styles.accountNumber}>{accountNumber !== null ? accountNumber : 'Non défini'}</Text>
      <Text style={styles.description}>
        Ce numéro de compte est unique et vous permet d'effectuer des transactions sécurisées. Veuillez le garder confidentiel.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
  },
  appName: {
    fontSize: 24,
    color: '#007bff',
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
  },
  accountNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default WalletAccountNumberScreen;
