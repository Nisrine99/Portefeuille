import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api';
import { format, parseISO } from 'date-fns';

const TransactionItem = ({ transaction }) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionContent}>
      <Text style={styles.transactionTime}>{format(parseISO(transaction.date), 'HH:mm')}</Text>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>{transaction.description}</Text>
        <Text style={[styles.transactionAmount, { color: transaction.amount > 0 ? '#4CAF50' : '#E57373' }]}>
          {transaction.description.includes('Recharge') || transaction.description.includes('Réception')? 
          `+ ${transaction.amount.toFixed(2)} MAD` : 
          `- ${Math.abs(transaction.amount).toFixed(2)} MAD`}
        </Text>
      </View>
    </View>
    <View style={styles.transactionStatus}>
      <Text style={styles.transactionStatusText}>VALIDÉ</Text>
    </View>
  </View>
);

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

const TransactionHistoryScreen = () => {
  const [balance, setBalance] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const balanceResponse = await api.get('/wallet/balance');
        const transactionCountResponse = await api.get('/transactions/count');

        setBalance(balanceResponse.data);
        setTransactionCount(transactionCountResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la wallet', error);
      }
    };
    fetchWalletDetails();

    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions/history');
        setTransactions(groupTransactionsByDate(response.data));
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const groupTransactionsByDate = (transactions) => {
    return transactions.reduce((groups, transaction) => {
      const date = format(parseISO(transaction.date), 'dd/MM/yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  const sections = Object.keys(transactions).map(date => ({
    title: date,
    data: transactions[date] || [],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Historique de Transactions</Text>
        <Text style={styles.balance}>{balance.toFixed(2)} MAD</Text>
        <Text style={styles.transactionsCount}>{transactionCount} transactions</Text>
      </View>
      <View style={styles.transactionsContainer}>
        <SectionList
          sections={sections}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.transactionsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B0E0E6',
  },
  headerContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', 
    textAlign: 'center',
    marginTop: 50,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E90FF', 
    marginTop: 10,
  },
  transactionsCount: {
    fontSize: 16,
    color: '#000000',
    marginTop: 10,
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -5, 
  },
  transactionsList: {
    paddingBottom: 20,
  },
  transactionItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  transactionContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionTime: {
    fontSize: 16,
    color: '#8F8F8F',
  },
  transactionDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  transactionType: {
    fontSize: 18,
    color: '#2E3192',
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionStatus: {
    backgroundColor: '#B0E0E6', 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  transactionStatusText: {
    fontSize: 16,
    color: '#1E90FF', 
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E90FF', 
    paddingLeft: 10,
  },
});

export default TransactionHistoryScreen;
