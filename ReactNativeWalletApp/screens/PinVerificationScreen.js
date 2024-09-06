import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';

const PinVerificationScreen = ({ route }) => {
  const { storeAmount , withdrawAmount , transferAmount, recipientPhoneNumber, agencyAmount,agencyId, transactionId, transactionType} = route.params;
  const [pinCode, setPinCode] = useState(['', '', '', '']); 
  const navigation = useNavigation();

  
  const inputRefs = useRef([]);

  const handleValidatePin = async () => {
    const pin = pinCode.join('');
    if (pin.length !== 4) {
      Alert.alert('Erreur', 'Veuillez entrer un code PIN complet de 4 chiffres.');
      return;
    }
  
    try {
      const pinResponse = await api.post('/transactions/verifyPin', null, {
        params: { pinCode: pin },
      });
  
      console.log('Réponse de la validation du PIN:', pinResponse.data);
  
      if (pinResponse.data === 'Code PIN valide') {
        let transactionResponse;
  
        switch (transactionType) {
          case 'RECHARGE_BANK':
            if (!transactionId) {
              throw new Error('ID de transaction manquant');
            }
            console.log('Transaction ID pour RECHARGE_BANK:', transactionId);
            transactionResponse = await api.post('/wallet/recharge/bank/execute', null, {
              params: { transactionId: transactionId },
            });
            if (transactionResponse.data) {
              Alert.alert('Succès', 'Votre compte bancaire a été rechargé avec succès.');
              navigation.navigate("Dashboard");
            }
            break;
  
          case 'RECHARGE_AGENCY':
            if (!agencyAmount || !agencyId) {
              throw new Error('Paramètres manquants');
            }
            console.log('Montant et ID d’agence pour RECHARGE_AGENCY:', { agencyAmount, agencyId });
            transactionResponse = await api.post('/wallet/recharge/agency', {
              amount: agencyAmount,
              agencyId: agencyId,
            });
            if (transactionResponse.data) {
              Alert.alert('Succès', `Votre compte a été rechargé de ${agencyAmount} MAD via l'agence.`);
              navigation.navigate("Dashboard");
            }
            break;
  
          case 'TRANSFER_P2P':
            if (!transferAmount || !recipientPhoneNumber) {
              throw new Error('Paramètres manquants');
            }
            console.log('Montant pour P2P:', { transferAmount, recipientPhoneNumber });
            transactionResponse = await api.post('/wallet/transfer', {
              amount: transferAmount,
              recipientPhoneNumber: recipientPhoneNumber,
            });
            if (transactionResponse.data) {
              Alert.alert('Succès', 'Transfert réussi!');
              navigation.navigate("Dashboard");
            }
            break;
  
          case 'WITHDRAW':
            if (!withdrawAmount) {
              throw new Error('Paramètres manquants');
            }
            console.log('Montant pour WITHDRAW:', { withdrawAmount });
            transactionResponse = await api.post('/transactions/withdraw', {
              amount: withdrawAmount,
            });
            if (transactionResponse.data) {
              Alert.alert('Succès', 'Demande de retrait réussie. Un code de retrait vous a été envoyé. Utilisez ce code pour effectuer votre retrait.');
              navigation.navigate("Dashboard");            
            }
            break;
  
          case 'STORE_PAYMENT':
            if (!storeAmount) {
              throw new Error('Paramètres manquants');
            }
            console.log('Montant pour STORE_PAYMENT:', { storeAmount });
            transactionResponse = await api.post('/transactions/storePayment', {
              amount: storeAmount,
            });
            if (transactionResponse.data) {
              Alert.alert('Succès', `Le paiement de ${storeAmount} MAD a été effectué avec succès.`);
              navigation.navigate("Dashboard");
            }
            break;
  
          default:
            throw new Error('Type de transaction non valide');
        }
  
        if (!transactionResponse.data) {
          Alert.alert('Erreur', 'Échec de la transaction.');
        }
      } else {
        Alert.alert('Erreur', 'Code PIN incorrect.');
      }
    } catch (error) {
      console.error('Erreur lors de la validation du PIN', error);
      Alert.alert('Erreur', 'Échec de la validation du code PIN');
    }
  };

  const handleChange = (text, index) => {
    const newPinCode = [...pinCode];
    newPinCode[index] = text;
    setPinCode(newPinCode);

    if (text.length === 1 && index < 3) {
      const nextInput = index + 1;
      if (inputRefs.current[nextInput]) {
        inputRefs.current[nextInput].focus();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <Text style={styles.label}>Entrez votre code PIN</Text>
      <Text style={styles.description}>Merci d'entrer votre code pin pour sécuriser votre transaction</Text>
      <View style={styles.inputContainer}>
        {pinCode.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => inputRefs.current[index] = ref}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            maxLength={1}
            keyboardType="numeric"
            style={styles.input}
            textAlign="center"
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleValidatePin}>
        <Text style={styles.buttonText}>Valider votre transaction</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    color: '#007bff',
    marginBottom: 20,
    textAlign: 'center', 
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#007bff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%', 
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    fontSize: 18,
    borderRadius: 10,
    width: 60, 
    marginHorizontal: 10,
    textAlign: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    backgroundColor: '#007bff', 
    paddingVertical: 15, 
    paddingHorizontal: 25, 
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PinVerificationScreen;
