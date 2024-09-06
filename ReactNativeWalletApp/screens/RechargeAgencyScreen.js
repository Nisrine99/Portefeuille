import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image , TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api';
import Icon from 'react-native-vector-icons/Feather';

const RechargeAgencyScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [selectedAgencyId, setSelectedAgencyId] = useState('');
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await api.get('/agencies');
        setAgencies(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des agences', error);
        Alert.alert('Erreur', 'Impossible de récupérer les agences');
      }
    };

    fetchAgencies();
  }, []);

  const handleNext = () => {
    if (amount === '' || selectedAgencyId === '') {
      Alert.alert('Erreur', 'Veuillez entrer un montant et choisir une agence.');
      return;
    }

    navigation.navigate('PinVerification', {
      agencyAmount: parseFloat(amount),
      agencyId: selectedAgencyId,
      transactionType: 'RECHARGE_AGENCY',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('RechargeOptions')}>
        <Icon name="chevron-left" size={24} color="#007bff" style={styles.backButtonIcon} />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <Text style={styles.title}>Recharge en agence</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Montant"
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAgencyId}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedAgencyId(itemValue)}>
          <Picker.Item label="Choisir une agence" value="" />
          {agencies.map((agency) => (
            <Picker.Item key={agency.id} label={agency.name} value={agency.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Suivant</Text>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
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
  pickerContainer: {
    width: '80%',
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  picker: {
    height: 45,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
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

export default RechargeAgencyScreen;
