import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import apiNoAuth from '../apiNoAuth';

const CreateWalletFormScreen = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [accountType, setAccountType] = useState('');
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber: userPhoneNumber } = route.params; 

  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const response = await apiNoAuth.get('/account-types');
        console.log('Response from API:', response.data); 
        setAccountTypes(response.data); 
      } catch (error) {
        console.error('Error fetching account types:', error);
        Alert.alert('Erreur', 'Échec de la récupération des types de compte');
      }
    };

    fetchAccountTypes();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!accountType) newErrors.accountType = 'Veuillez choisir un type de compte.';
    if (!title) newErrors.title = 'Veuillez choisir un titre.';
    if (!firstName) newErrors.firstName = 'Veuillez entrer votre prénom.';
    if (!lastName) newErrors.lastName = 'Veuillez entrer votre nom.';
    if (!email) {
      newErrors.email = 'Veuillez entrer votre email.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Veuillez entrer un email valide.';
    }
    if (!birthDate) newErrors.birthDate = 'Veuillez entrer votre date de naissance.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const userData = {
      accountType,
      title,
      firstName,
      lastName,
      email,
      birthDate: birthDate.toISOString().split('T')[0], 
      phoneNumber: userPhoneNumber 
    };
    console.log(userData);

    try {
      const response = await api.post('/users/complete-registration', userData);
      Alert.alert('Succès', response.data.message);
      navigation.navigate('VerificationCode', { phoneNumber: userPhoneNumber });
    } catch (error) {
      if (error.response.data.message) {
        Alert.alert('Erreur', `Échec de la finalisation de l'inscription : ${error.response.data.message}`);
      } else {
        Alert.alert('Erreur', 'Échec de la finalisation de l\'inscription');
      }
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
        <Text style={styles.appName}>SAFE PAY</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Type de compte</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={accountType}
              style={styles.picker}
              onValueChange={(itemValue) => setAccountType(itemValue)}
            >
              <Picker.Item label="Choisir un type" value="" />
              {accountTypes && accountTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
          {errors.accountType && <Text style={styles.errorText}>{errors.accountType}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Titre</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={title}
              style={styles.picker}
              onValueChange={(itemValue) => setTitle(itemValue)}
            >
              <Picker.Item label="Mme" value="Mme" />
              <Picker.Item label="Mr" value="Mr" />
              <Picker.Item label="Mlle" value="Mlle" />
            </Picker>
          </View>
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date de naissance</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
            <Text>{birthDate ? birthDate.toLocaleDateString() : 'jj/mm/aaaa'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  form: {
    width: '100%',
    maxWidth: 500,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  dateInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default CreateWalletFormScreen;
