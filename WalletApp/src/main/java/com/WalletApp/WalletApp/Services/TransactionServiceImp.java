package com.WalletApp.WalletApp.Services;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.WalletApp.WalletApp.Entities.Transaction;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Entities.Wallet;
import com.WalletApp.WalletApp.Repositories.TransactionRepository;
import com.WalletApp.WalletApp.Repositories.WalletRepository;

@Service
public class TransactionServiceImp implements TransactionService{

    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SmsService smsService;

    private static final String CODE_CHARACTERS = "0123456789";

    private final SecureRandom random = new SecureRandom();

    @Override
    public List<Transaction> getPendingTransactions() {
        return transactionRepository.findByStatus("PENDING");
    }

    @Override
    public List<Transaction> getTransactionsByUser(User user) {
        return transactionRepository.findByUserOrderByDateDesc(user);
    }

    @Override
    public boolean verifyPin(User user, String pinCode) {
        return passwordEncoder.matches(pinCode, user.getPin());
    }

    @Override
    public long getTransactionCountByUser(User user) {

        Wallet wallet = walletRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Wallet not found"));

        return transactionRepository.countByWallet(wallet);
    }

    @Override
    public boolean confirmTransaction(Long transactionId) {
        
        Optional<Transaction> optionalTransaction = transactionRepository.findById(transactionId);
        
        if (optionalTransaction.isPresent()) {
            
            Transaction transaction = optionalTransaction.get();
            
            if ("PENDING".equals(transaction.getStatus())) {
                
                User user = transaction.getUser();
                
                Wallet wallet = user.getWallet();
                wallet.setWalletBalance(wallet.getWalletBalance() + transaction.getAmount());
                
                transaction.setStatus("CONFIRMED");
                
                walletRepository.save(wallet);

                transactionRepository.save(transaction);
                
                return true;
            }
        }
        
        return false;
    }

    @Override
    public boolean rejectTransaction(Long transactionId) {
        
        Optional<Transaction> optionalTransaction = transactionRepository.findById(transactionId);
        
        if (optionalTransaction.isPresent()) {

            Transaction transaction = optionalTransaction.get();

            transaction.setStatus("REJECTED");
            transactionRepository.save(transaction);
            
            return true;
        }
        return false;
    }
    
    @Override
    public void processWithdrawal(Double amount) {
        
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (currentUser == null) {
            throw new IllegalStateException("L'utilisateur n'est pas authentifié.");
        }
        
        Wallet currentWallet = currentUser.getWallet();
        
        if (currentWallet == null) {
            throw new IllegalStateException("Aucun portefeuille n'est associé à l'utilisateur.");
        }
        
        String withdrawalCode = generateEightDigitCode();
        
        smsService.sendSms(currentUser.getPhoneNumber(), "Votre code de retrait est : " + withdrawalCode);
        
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setUser(currentUser);
        transaction.setWallet(currentWallet);
        transaction.setWithdrawalCode(withdrawalCode);
        transaction.setDate(LocalDateTime.now());
        transaction.setStatus("PENDING");
        transaction.setDescription("Retrait Par GAB");
        
        transactionRepository.save(transaction);
    }

    @Override
    public String generateEightDigitCode() {
        
        StringBuilder code = new StringBuilder(8);
        
        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(CODE_CHARACTERS.length());
            code.append(CODE_CHARACTERS.charAt(index));
        }

        return code.toString();
    }

    @Override
    public void validateWithdrawal(Double amount , String withdrawalCode) {
        
        Optional<Transaction> optionalTransaction = transactionRepository.findByWithdrawalCode(withdrawalCode);
        
        if (!optionalTransaction.isPresent()) {
            throw new IllegalArgumentException("Transaction non trouvée.");
        }

        Transaction transaction = optionalTransaction.get();

        if (!transaction.getStatus().equals("PENDING")) {
            throw new IllegalStateException("La transaction a déjà été traitée.");
        }

        if (!transaction.getAmount().equals(amount)) {
            throw new IllegalArgumentException("Montant incorrect.");
        }

        Wallet wallet = transaction.getWallet();

        if (wallet.getWalletBalance() < amount) {
            throw new IllegalArgumentException("Solde insuffisant.");
        }

        wallet.setWalletBalance(wallet.getWalletBalance() - amount);
        walletRepository.save(wallet);

        transaction.setStatus("COMPLETED");
        transaction.setDate(LocalDateTime.now()); 
        transactionRepository.save(transaction);
    }

    @Override
    public String processPayment(User user, Double amount) {
        
        if (user == null) {
            return "User Not Found";
        }

        Wallet wallet = user.getWallet();
        
        if (wallet.getWalletBalance() < amount) {
            return "Insufficient funds";
        }

        wallet.setWalletBalance(wallet.getWalletBalance() - amount);
        walletRepository.save(wallet);

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(amount);
        transaction.setWallet(wallet);
        transaction.setDescription("Payment Magasin");
        transaction.setStatus("COMPLETED");
        transaction.setDate(LocalDateTime.now());
        transactionRepository.save(transaction);

        return "Payment successful";
    }
}
    


    


