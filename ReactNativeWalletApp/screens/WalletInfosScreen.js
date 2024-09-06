import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity , Image } from 'react-native';
import api from '../api'; 
import Icon from 'react-native-vector-icons/Feather'; 

const WalletInfosScreen = ({ navigation }) => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await api.get('/wallet/infos');
        setWalletData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de la wallet:', error);
        Alert.alert('Erreur', 'Impossible de récupérer les informations de la wallet.');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Chargement des informations de la wallet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
        <Icon name="chevron-left" size={24} color="#007bff" style={styles.backButtonIcon} />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Mon Portefeuille</Text>
        <View style={[styles.card, styles.accountCard]}>
          <Text style={styles.cardTitle}>Votre Numéro de Compte est :</Text>
          <Text style={styles.cardValue}>{walletData.walletAccountNumber}</Text>
        </View>
        <View style={[styles.card, styles.balanceCard]}>
          <Text style={styles.cardTitle}>Votre Solde est : </Text>
          <Text style={styles.cardValue}>{walletData.walletBalance} MAD</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    marginVertical: 30,
    position: 'relative',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  accountCard: {
    marginBottom: 20,
  },
  balanceCard: {
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
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

export default WalletInfosScreen;
