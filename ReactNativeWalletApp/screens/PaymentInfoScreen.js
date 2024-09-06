import React from "react";
import { View, Text, TouchableOpacity, StyleSheet , Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Feather'; 


const PaymentInfoScreen = () => {
  const navigation = useNavigation();

  const handleScanQRCode = () => {
    navigation.navigate("QRCodeScanner"); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
        <Icon name="chevron-left" size={24} color="#007bff" style={styles.backButtonIcon} />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
      <Text style={styles.title}>SafePay</Text>
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />
      <Text style={styles.titleInfo}>Payer avec votre Wallet</Text>
      <Text style={styles.infoText}>
        Pour payer vos achats, scannez le QR code généré par le magasin. Ce code permet de lier le montant de vos achats à votre compte pour un paiement rapide et sécurisé.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleScanQRCode}>
        <Text style={styles.buttonText}>Scanner le QR code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e9ecef',
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007bff',
    fontFamily: 'serif',
  },
  titleInfo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007bff',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: "justify",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default PaymentInfoScreen;