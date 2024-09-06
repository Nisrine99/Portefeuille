package com.WalletApp.WalletApp.Controllers;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.WalletApp.WalletApp.DTO.RechargeRequestDTO;
import com.WalletApp.WalletApp.DTO.TransferRequestDTO;
import com.WalletApp.WalletApp.DTO.WalletResponseDTO;
import com.WalletApp.WalletApp.Entities.Agency;
import com.WalletApp.WalletApp.Entities.BankAccount;
import com.WalletApp.WalletApp.Entities.Transaction;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Entities.Wallet;
import com.WalletApp.WalletApp.Repositories.AgencyRepository;
import com.WalletApp.WalletApp.Repositories.TransactionRepository;
import com.WalletApp.WalletApp.Services.WalletService;



@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired 
    private TransactionRepository transactionRepository;

    @GetMapping("/infos")
    public ResponseEntity<WalletResponseDTO> getWalletDetailsForCurrentUser() {

        WalletResponseDTO walletResponseDTO = walletService.getWalletDetails();
        
        return ResponseEntity.ok(walletResponseDTO);
    }

    @GetMapping("/balance")
    public ResponseEntity<Double> getWalletBalance() {
        
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        double balance = walletService.getWalletBalanceByUser(currentUser);
        
        return ResponseEntity.ok(balance);
    }

    @PostMapping("/recharge/bank/prepare")
    public ResponseEntity<Long> prepareRechargeWithBankAccount(
        @RequestParam String bankAccountNumber,
        @RequestParam double amount) {
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();
            
            boolean hasError = false;
            String errorMessage = null;
            
            if (bankAccountNumber == null || bankAccountNumber.isEmpty()) {
                hasError = true;
                errorMessage = "Numéro de compte bancaire requis.";
            } else if (amount <= 0) {
                hasError = true;
                errorMessage = "Montant invalide.";
            } else if (!user.isBankMember()) {
                hasError = true;
                errorMessage = "Vous devez être membre de la banque pour effectuer cette opération.";
            } else if (!user.getBankAccount().getBankAccountNumber().equals(bankAccountNumber)) {
                hasError = true;
                errorMessage = "Le numero de compte bancaire ne correspond pas.";
            } else if (user.getBankAccount().getBalance() < amount) {
                hasError = true;
                errorMessage = "Solde insuffisant.";
            }

            if (hasError) {
                HttpHeaders headers = new HttpHeaders();
                headers.add("Error-Message", errorMessage);
                return ResponseEntity.badRequest().headers(headers).body(null);
            }
            
            Wallet wallet = user.getWallet();
            Transaction transaction = new Transaction();
            transaction.setUser(user);
            transaction.setAmount(amount);
            transaction.setDate(LocalDateTime.now());
            transaction.setStatus("PENDING");
            transaction.setWallet(wallet);
            transaction.setDescription("Recharge en attente de validation PIN");
            transactionRepository.save(transaction);
            
            return ResponseEntity.ok(transaction.getId()); 
    }
    @PostMapping("/recharge/bank/execute")
    public ResponseEntity<String> executeRechargeWithBankAccount(
        @RequestParam Long transactionId) {
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();
            
            Optional<Transaction> transactionOpt = transactionRepository.findById(transactionId);
            
            if (!transactionOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Transaction non trouvée.");
            }
            
            Transaction transaction = transactionOpt.get();
            
            if (!transaction.getUser().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body("Transaction non autorisée.");
            }
            
            if (!"PENDING".equals(transaction.getStatus())) {
                return ResponseEntity.badRequest().body("Transaction déjà traitée ou annulée.");
            }
            
            BankAccount bankAccount = user.getBankAccount();
            
            if (bankAccount == null || bankAccount.getBalance() < transaction.getAmount()) {
                return ResponseEntity.badRequest().body("Fonds insuffisants.");
            }
            
            boolean success = walletService.rechargeWithBankAccount(user, transaction.getAmount());
            
            if (success) {
                transaction.setStatus("CONFIRMED");
                transaction.setDescription("Recharge par compte bancaire");
                transactionRepository.save(transaction);
                return ResponseEntity.ok("Recharge réussie.");
            } else {
                return ResponseEntity.status(500).body("Erreur lors de la recharge.");
            }
        }
        
        @PostMapping("/recharge/agency")
        public ResponseEntity<String> requestRechargeInAgency(@RequestBody RechargeRequestDTO request) {
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();
            
            Optional<Agency> agencyOpt = agencyRepository.findById(request.getAgencyId());
            
            if (!agencyOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Agence non trouvée");
            }
            
            Long transactionId = walletService.rechargeInAgency(user, request.getAmount(), agencyOpt.get());
            
            if (transactionId != null) {
                return ResponseEntity.ok("Recharge réussie.");
            } else {
                return ResponseEntity.status(500).body("Erreur lors de la recharge.");
            }
        }
        
        @PostMapping("/transfer")
        public ResponseEntity<String> transferFunds(@RequestBody TransferRequestDTO transferRequest) {
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User sender = (User) authentication.getPrincipal();
            
            try {
                boolean success = walletService.transferFunds(sender, transferRequest.getRecipientPhoneNumber(), transferRequest.getAmount());
                if (success) {
                    return ResponseEntity.ok("Transfert réussi");
                } else {
                    return ResponseEntity.status(500).body("Erreur lors du transfert");
                }
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
    }


