import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LogoutButton from '../components/LogoutButton'; 

const DrawerContent = (props) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const isActive = (screenName) => {
    return props.state.routeNames[props.state.index] === screenName;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.item, isActive('Dashboard') && styles.activeItem]}
        onPress={() => props.navigation.navigate('Dashboard')}
      >
        <Text style={[styles.label, isActive('Dashboard') && styles.activeLabel]}>Tableau de Bord</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item, isActive('Changer Mon Type de Compte') && styles.activeItem]}
        onPress={() => props.navigation.navigate('Changer Mon Type de Compte')}
      >
        <Text style={[styles.label, isActive('Changer Mon Type de Compte') && styles.activeLabel]}>Changer Mon Type de Compte</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item, isActive('Changer Mon Email') && styles.activeItem]}
        onPress={() => props.navigation.navigate('Changer Mon Email')}
      >
        <Text style={[styles.label, isActive('Changer Mon Email') && styles.activeLabel]}>Changer Mon Email</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item, isActive('Changer Mon Mot de Passe') && styles.activeItem]}
        onPress={() => props.navigation.navigate('Changer Mon Mot de Passe')}
      >
        <Text style={[styles.label, isActive('Changer Mon Mot de Passe') && styles.activeLabel]}>Changer Mon Mot de Passe</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item, isActive('Changer Mon Code Pin') && styles.activeItem]}
        onPress={() => props.navigation.navigate('Changer Mon Code Pin')}
      >
        <Text style={[styles.label, isActive('Changer Mon Code Pin') && styles.activeLabel]}>Changer Mon Code Pin</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item, isActive('Mon Numéro de Compte') && styles.activeItem]}
        onPress={() => props.navigation.navigate('Mon Numéro de Compte')}
      >
        <Text style={[styles.label, isActive('Mon Numéro de Compte') && styles.activeLabel]}>Mon Numéro de Compte</Text>
      </TouchableOpacity>

      <View style={styles.logoutContainer}>
        <LogoutButton navigation={props.navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  activeItem: {
    backgroundColor: '#6666CC', 
  },
  label: {
    fontSize: 16,
    color: '#333',
    paddingTop: 10, 
  },
  activeLabel: {
    fontWeight: 'bold',
    color: '#FFF', 
  },
  logoutContainer: {
    marginTop: 'auto', 
    padding: 20,
  },
});

export default DrawerContent;
