import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert , Image , TouchableOpacity} from 'react-native';
import api from '../api';
import Icon from 'react-native-vector-icons/Feather'; 


const TransferP2PScreen = ({ navigation }) => {
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    if (recipientPhoneNumber === '' || amount === '') {
      Alert.alert('Erreur', 'Veuillez entrer le numéro de téléphone du destinataire et le montant.');
      return;
    }
      navigation.navigate('PinVerification', {
        recipientPhoneNumber,
        transferAmount: parseFloat(amount),
        transactionType: 'TRANSFER_P2P',
      });
  };

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
        <Icon name="chevron-left" size={24} color="#007bff" style={styles.backButtonIcon} />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
        <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
        <Text style={styles.appName}>SAFE PAY</Text>
      <Text style={styles.title}>Transfert d'argent</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Numéro de téléphone du destinataire"
        value={recipientPhoneNumber}
        onChangeText={setRecipientPhoneNumber}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Montant"
        value={amount}
        onChangeText={setAmount}
      />
       <TouchableOpacity style={styles.button} onPress={handleTransfer}>
        <Text style={styles.buttonText}>Recharger</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
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

export default TransferP2PScreen;
