import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const DashboardScreen = () => {
  const navigation = useNavigation();

  const features = [
    { name: 'Alimenter mon Portefeuilles', image: require('../assets/images/Alimenter.png'), screen: 'RechargeOptions' }, 
    { name: 'Transfert argent P2P', image: require('../assets/images/TransfertArgent.png'), screen: 'TransferP2P' },
    { name: 'Historique Transactions', image: require('../assets/images/Historique.png'), screen: 'TransactionHistory' },
    { name: 'Retrait Argent', image: require('../assets/images/Agence.png'), screen: 'WithDrawRequest' },
    { name: 'Payer En ligne', image: require('../assets/images/PaiementEnLigne.png'), screen: 'OnlinePayment' },
    { name: 'Payement magasin', image: require('../assets/images/PaiementMagasin.png'), screen: 'PaymentInfo' },
    { name: 'Recharges téléphones', image: require('../assets/images/Tel.png'), screen: 'Recharge' },
    { name: 'Payement factures', image: require('../assets/images/Factures.png'), screen: 'Bills' },
    { name: 'Virement', image: require('../assets/images/Virement.png'), screen: 'Transfer' },
    { name: 'Trouver agences', image: require('../assets/images/Gps.jpg'), screen: 'FindAgencies' }
  ];

  const goToWalletScreen = () => {
    navigation.navigate('Wallet'); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerIconLeft}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Icon color="#6495ED" name="user" size={40} />
        </TouchableOpacity>
        <LottieView
          source={require('../assets/animations/wallet1.json')}
          autoPlay
          loop
          style={styles.logo}
        />
        <Icon name="bell" size={35} color="#6495ED" style={styles.headerIconRight} />
      </View>
      <TouchableOpacity style={styles.sloganButton} onPress={goToWalletScreen}>
      <Text style={styles.sloganSubText}>Aller à mon Portefeuille</Text>
    </TouchableOpacity>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <TouchableOpacity key={index} style={styles.featureItem} onPress={() => navigation.navigate(feature.screen)}>
            <Image source={feature.image} style={styles.featureImage} />
            <Text style={styles.featureText}>{feature.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
  },
  headerIconLeft: {
    marginLeft: 20,
  },
  headerIconRight: {
    marginRight: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  greeting: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
  },
  sloganButton: {
    backgroundColor: '#6495ED',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  sloganText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  sloganSubText: {
    fontSize: 14,
    color: '#fff',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  featureImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  featureText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  
});

export default DashboardScreen;
