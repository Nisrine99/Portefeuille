import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import api from '../api'; 
import { Picker } from '@react-native-picker/picker';

const ChangeAccountTypeScreen = () => {
  const [accountType, setAccountType] = useState('');
  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchAccountTypes = async () => {
      setLoading(true);
      try {
        const response = await api.get('/account-types');
        console.log('Account types fetched:', response.data); 
        setAccountTypes(response.data);
      } catch (error) {
        console.error('Error fetching account types:', error);
        Alert.alert('Error', 'Failed to fetch account types.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserAccountType = async () => {
      try {
        const response = await api.get('/profile/account-type');
        console.log('User account type fetched:', response.data); 
        setAccountType(response.data); 
      } catch (error) {
        console.error('Error fetching user account type:', error);
        Alert.alert('Error', 'Failed to fetch user account type.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAccountTypes();
    fetchUserAccountType();
  }, []);

  const handleUpdate = async () => {
    if (!accountType) {
      Alert.alert('Error', 'Please select an account type.');
      return;
    }

    setLoading(true);
    try {
      await api.put('/profile/update-account-type', { accountType }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      Alert.alert('Success', 'Account type updated successfully.');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to update account type.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
        <Text style={styles.appName}>SAFE PAY</Text>
      </View>
      <Text style={styles.title}>Changer le type de compte</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <View style={styles.pickerContainer}>
          <Text style={styles.infoText}>Type de compte actuel: {accountType || 'Non défini'}</Text>
          <Picker
            selectedValue={accountType}
            style={styles.picker}
            onValueChange={(itemValue) => setAccountType(itemValue)}
          >
            <Picker.Item label="Choisir un type" value="" />
            {accountTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Mettre à jour</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 5,
    marginBottom: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
  },
  pickerContainer: {
    width: '90%',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  picker: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChangeAccountTypeScreen;
