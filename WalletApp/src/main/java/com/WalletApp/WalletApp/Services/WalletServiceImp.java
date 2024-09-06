package com.WalletApp.WalletApp.Services;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.WalletApp.WalletApp.DTO.WalletResponseDTO;
import com.WalletApp.WalletApp.Entities.Agency;
import com.WalletApp.WalletApp.Entities.BankAccount;
import com.WalletApp.WalletApp.Entities.Transaction;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Entities.Wallet;
import com.WalletApp.WalletApp.Repositories.BankAccountRepository;
import com.WalletApp.WalletApp.Repositories.TransactionRepository;
import com.WalletApp.WalletApp.Repositories.UserRepository;
import com.WalletApp.WalletApp.Repositories.WalletRepository;

import jakarta.transaction.Transactional;

@Service
public class WalletServiceImp implements WalletService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    @Override
    public WalletResponseDTO getWalletDetails() {

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Wallet wallet = walletRepository.findByUser(currentUser)
                .orElseThrow(() -> new RuntimeException("Portefeuille non trouvé pour l'utilisateur connecté"));

        WalletResponseDTO walletResponseDTO = new WalletResponseDTO();
        walletResponseDTO.setWalletAccountNumber(wallet.getWalletAccountNumber());
        walletResponseDTO.setWalletBalance(wallet.getWalletBalance());

        return walletResponseDTO;
    }

    @Override
    public double getWalletBalanceByUser(User user) {

        Wallet wallet = walletRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Wallet not found"));
        
        return wallet.getWalletBalance();
    }

    @Override
    public boolean rechargeWithBankAccount(User user, double amount) {

        BankAccount bankAccount = user.getBankAccount();
        
        if (bankAccount != null && bankAccount.getBalance() >= amount) {

            bankAccount.setBalance(bankAccount.getBalance() - amount);
            bankAccountRepository.save(bankAccount);

            Wallet wallet = user.getWallet();
            wallet.setWalletBalance(wallet.getWalletBalance() + amount);
            walletRepository.save(wallet);
    
            return true;
        }
        return false;
    }
    
    @Override
    public Long rechargeInAgency(User user, double amount, Agency agency) {

        Wallet wallet = user.getWallet();
        
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDate(LocalDateTime.now());
        transaction.setDescription("Recharge en agence: " + agency.getName());
        transaction.setUser(user);
        transaction.setAgency(agency);
        transaction.setStatus("PENDING");
        transaction.setWallet(wallet);
        
        transactionRepository.save(transaction);
        
        return transaction.getId();
    }
    
    @Override
    public boolean transferFunds(User sender, String recipientPhoneNumber, double amount) {
        
        Optional<User> recipientOpt = userRepository.findByPhoneNumber(recipientPhoneNumber);
        
        if (!recipientOpt.isPresent()) {
            throw new IllegalArgumentException("Le destinataire n'a pas été trouvé");
        }
        
        User recipient = recipientOpt.get();
        
        Optional<Wallet> senderWalletOpt = walletRepository.findByUser(sender);
        Optional<Wallet> recipientWalletOpt = walletRepository.findByUser(recipient);
        
        if (!senderWalletOpt.isPresent()) {
            throw new IllegalArgumentException("Le wallet de l'expéditeur n'a pas été trouvé");
        }
        
        if (!recipientWalletOpt.isPresent()) {
            throw new IllegalArgumentException("Le wallet du destinataire n'a pas été trouvé");
        }
        
        Wallet senderWallet = senderWalletOpt.get();
        Wallet recipientWallet = recipientWalletOpt.get();
        
        if (senderWallet.getWalletBalance() < amount) {
            throw new IllegalArgumentException("Solde insuffisant");
        }
        
        senderWallet.setWalletBalance(senderWallet.getWalletBalance() - amount);
        recipientWallet.setWalletBalance(recipientWallet.getWalletBalance() + amount);
        
        walletRepository.save(senderWallet);
        walletRepository.save(recipientWallet);
        
        Transaction senderTransaction = new Transaction();
        senderTransaction.setUser(sender);
        senderTransaction.setAmount(amount);
        senderTransaction.setDescription("Transfert de " + amount + " à " + recipient.getPhoneNumber());
        senderTransaction.setDate(LocalDateTime.now());
        senderTransaction.setWallet(senderWallet); 
        transactionRepository.save(senderTransaction);
        
        Transaction recipientTransaction = new Transaction();
        recipientTransaction.setUser(recipient);
        recipientTransaction.setAmount(amount);
        recipientTransaction.setDescription("Réception de " + amount + " de " + sender.getPhoneNumber());
        recipientTransaction.setDate(LocalDateTime.now());
        recipientTransaction.setStatus("COMPLETED");
        recipientTransaction.setWallet(recipientWallet); 
        transactionRepository.save(recipientTransaction);
        
        return true;
    }
}
