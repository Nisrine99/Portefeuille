import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather'; 


const RechargeOptionsScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const response = await api.get('/profile/me');
          console.log('Données utilisateur:', response.data);  
          setUser(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur', error);
          Alert.alert('Erreur', 'Échec de la récupération des informations utilisateur');
        }
      };

      fetchUserData();
    }, [])
  );

  if (!user) {
    return <Text style={styles.loading}>Chargement...</Text>;
  }
  console.log('BankMember:', user.bankMember);

  const BankMember = user.bankMember === true || user.bankMember === 1 || user.bankMember === '1';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
        <Icon name="chevron-left" size={24} color="#007bff" style={styles.backButtonIcon} />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
        <Text style={styles.appName}>SAFE PAY</Text>
        <Text style={styles.title}>Options d'alimentation</Text>
        {BankMember ? (
          <>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RechargeBankAccount')}
            >
              <MaterialCommunityIcons name="bank" size={24} color="white" />
              <Text style={styles.cardText}>Recharge par compte bancaire</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RechargeAgency')}
            >
              <MaterialCommunityIcons name="store" size={24} color="white" />
              <Text style={styles.cardText}>Recharge en agence</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RechargeAgency')}
          >
            <MaterialCommunityIcons name="store" size={24} color="white" />
            <Text style={styles.cardText}>Recharge en agence</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
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
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#3399FF',
    borderRadius: 10,
    padding: 16,
    margin: 20,
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
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

export default RechargeOptionsScreen;
