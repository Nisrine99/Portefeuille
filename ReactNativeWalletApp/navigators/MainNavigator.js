import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerContent from './DrawerContent'; 
import DashboardScreen from '../screens/DashboardScreen';
import ChangeAccountTypeScreen from '../screens/ChangeAccountTypeScreen';
import ChangeEmailScreen from '../screens/ChangeEmailScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ChangePinScreen from '../screens/ChangePinScreen';
import HelloScreen from '../screens/HelloScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import CreateWalletFormScreen from '../screens/CreateWalletFormScreen';
import PinCodeScreen from '../screens/PinCodeScreen';
import CongratulationsScreen from '../screens/CongratulationsScreen';
import PasswordScreen from '../screens/PasswordScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import bankAccountNumberScreen from '../screens/bankAccountScreen';
import AccountTypeScreen from '../screens/AccountTypeScreen';
import LoginScreen from '../screens/LoginScreen';
import WalletAccountNumberScreen from '../screens/WalletAccountNumberScreen';
import RechargeOptionsScreen from '../screens/RechargeOptionsScreen';
import RechargeBankAccountScreen from '../screens/RechargeBankAccountScreen';
import RechargeAgencyScreen from '../screens/RechargeAgencyScreen';
import WalletInfosScreen from '../screens/WalletInfosScreen';
import TransferP2PScreen from '../screens/TransferP2PScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import WithdrawRequestScreen from '../screens/WithdrawRequestScreen';
import QRCodeScannerScreen from '../screens/QRCodeScannerScreen';
import PurchaseSummaryScreen from '../screens/PurchaseSummaryScreen';
import PaymentInfoScreen from '../screens/PaymentInfoScreen';
import PinVerificationScreen from '../screens/PinVerificationScreen';
import ForgotPasswordPhoneNumberScreen from '../screens/ForgotPasswordPhoneNumberScreen';
import ForgotPasswordVerificationCodeScreen from '../screens/ForgotPasswordVerificationCodeScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import OnlinePaymentScreen from '../screens/OnlinePaymentScreen'; 


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
    <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ drawerLabel: 'Tableau de Bord' }} />
    <Drawer.Screen name="Changer Mon Type de Compte" component={ChangeAccountTypeScreen} options={{ drawerLabel: 'Changer Mon Type de Compte' }} />
    <Drawer.Screen name="Changer Mon Email" component={ChangeEmailScreen} options={{ drawerLabel: 'Changer Mon Email' }} />
    <Drawer.Screen name="Changer Mon Mot de Passe" component={ChangePasswordScreen} options={{ drawerLabel: 'Changer Mon Mot de Passe' }} />
    <Drawer.Screen name="Changer Mon Code Pin" component={ChangePinScreen} options={{ drawerLabel: 'Changer Mon Code Pin' }} />
    <Drawer.Screen name="Mon Numéro de Compte" component={WalletAccountNumberScreen} options={{ drawerLabel: 'Mon Numéro de Compte' }} />
  </Drawer.Navigator>
);

const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Hello">
    <Stack.Screen name="Hello" component={HelloScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="CreateWalletForm" component={CreateWalletFormScreen} />
    <Stack.Screen name="bankAccountNumber" component={bankAccountNumberScreen} />
    <Stack.Screen name="AccountType" component={AccountTypeScreen} />
    <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
    <Stack.Screen name="Password" component={PasswordScreen} />
    <Stack.Screen name="PinCode" component={PinCodeScreen} />
    <Stack.Screen name="Congratulations" component={CongratulationsScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="RechargeOptions" component={RechargeOptionsScreen} />
    <Stack.Screen name="RechargeBankAccount" component={RechargeBankAccountScreen} />
    <Stack.Screen name="PinVerification" component={PinVerificationScreen} />
    <Stack.Screen name="RechargeAgency" component={RechargeAgencyScreen} />
    <Stack.Screen name="Wallet" component={WalletInfosScreen} />
    <Stack.Screen name="TransferP2P" component={TransferP2PScreen} />
    <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
    <Stack.Screen name="WithDrawRequest" component={WithdrawRequestScreen} />
    <Stack.Screen name="PaymentInfo" component={PaymentInfoScreen} />
    <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} />
    <Stack.Screen name="PurchaseSummary" component={PurchaseSummaryScreen} />
    <Stack.Screen name="ForgotPasswordPhoneNumber" component={ForgotPasswordPhoneNumberScreen} />
    <Stack.Screen name="ForgotPasswordVerificationCode" component={ForgotPasswordVerificationCodeScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    <Stack.Screen name="OnlinePayment" component={OnlinePaymentScreen} />
    <Stack.Screen name="Drawer" component={DrawerNavigator} />
  </Stack.Navigator>
);

const MainNavigator = () => (
  <StackNavigator />
);

export default MainNavigator;
