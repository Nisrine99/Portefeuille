package com.WalletApp.WalletApp.Services;

import java.util.List;

import com.WalletApp.WalletApp.Entities.Transaction;
import com.WalletApp.WalletApp.Entities.User;

public interface TransactionService {

    boolean confirmTransaction(Long userId);

    List<Transaction> getPendingTransactions();

    long getTransactionCountByUser(User user);

    boolean rejectTransaction(Long transactionId);

    List<Transaction> getTransactionsByUser(User user);

    void processWithdrawal(Double amount);

    String generateEightDigitCode();

    void validateWithdrawal(Double amount, String withdrawalCode);

    boolean verifyPin(User user, String pinCode);

    String processPayment(User user , Double amount);
}

