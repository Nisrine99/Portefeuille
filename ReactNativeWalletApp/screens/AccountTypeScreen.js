import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import logo from '../assets/images/logo.webp';
import apiNoAuth from '../apiNoAuth';

const AccountTypeScreen = () => {
  const [accountType, setAccountType] = useState('');
  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;

  useEffect(() => {
    const fetchAccountTypes = async () => {
      setLoading(true);
      try {
        const response = await api.get('/account-types'); 
        setAccountTypes(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch account types.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountTypes();
  }, []);

  const handleSubmit = async () => {
    if (!accountType) {
      Alert.alert('Error', 'Please select your account type.');
      return;
    }

    setLoading(true);
    try {
      await apiNoAuth.post('/users/set-account-type', { accountType }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      navigation.navigate('VerificationCode', { phoneNumber });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to process request.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafePay</Text>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.appName}>SAFE PAY</Text>
      <Text style={styles.message}>Veuillez sélectionner le type de compte pour compléter la configuration de votre wallet.</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={accountType}
            style={styles.picker}
            onValueChange={(itemValue) => setAccountType(itemValue)}
            accessibilityLabel="Select account type"
          >
            <Picker.Item label="Choisir un type" value="" />
            {accountTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Suivant</Text>
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
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007bff',
    fontFamily: 'serif',
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    color: '#007bff',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  pickerContainer: {
    width: '90%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AccountTypeScreen;
