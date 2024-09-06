import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import api from '../api'; 

const ChangeEmailScreen = () => {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const fetchEmail = async () => {
      setLoading(true);
      try {
        const response = await api.get('/profile/email');
        console.log('Fetched email:', response.data);
        if (response.data && response.data.email) {
          setEmail(response.data.email);
        } 
      } catch (error) {
        console.log('Fetch email error:', error); 
        Alert.alert('Error', 'Failed to fetch user email.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, []);


  const handleUpdate = async () => {
    if (!newEmail) {
      Alert.alert('Error', 'Please enter your new email.');
      return;
    }

    if (!isValidEmail(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await api.put('/profile/update-email', { newEmail }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setEmail(newEmail);
      setNewEmail('');
      Alert.alert('Success', 'Email updated successfully.');
    } catch (error) {
      console.log('Update email error:', error); 
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', error.response.data.message || 'Invalid email.');
      } else {
        Alert.alert('Error', 'Failed to update email.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
        <Text style={styles.appName}>SAFE PAY</Text>
      </View>
      <Text style={styles.title}>Changer mon email</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <Text style={styles.currentEmail}>Email actuel: {email}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nouveau email"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            accessibilityLabel="New email input"
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Mettre à jour</Text>
          </TouchableOpacity>
        </>
      )}
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
  currentEmail: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: '90%',
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

export default ChangeEmailScreen;
