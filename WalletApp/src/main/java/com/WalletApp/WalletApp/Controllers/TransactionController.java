package com.WalletApp.WalletApp.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.WalletApp.WalletApp.DTO.StorePaymentDTO;
import com.WalletApp.WalletApp.DTO.WithdrawRequestDTO;
import com.WalletApp.WalletApp.Entities.Transaction;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Services.TransactionService;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/history")
    public ResponseEntity<List<Transaction>> getTransactionHistory() {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        List<Transaction> transactions = transactionService.getTransactionsByUser(user);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTransactionCount() {
        
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        long transactionCount = transactionService.getTransactionCountByUser(currentUser);
        return ResponseEntity.ok(transactionCount);
    }

    @PostMapping("/verifyPin")
    public ResponseEntity<String> verifyPin(@RequestParam String pinCode) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
    
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non authentifié.");
        }
    
        boolean isPinValid = transactionService.verifyPin(user, pinCode);
        if (isPinValid) {
            return ResponseEntity.ok("Code PIN valide");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Code PIN invalide");
        }
    }
    
    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@RequestBody WithdrawRequestDTO request) {
        
        try {
            transactionService.processWithdrawal(request.getAmount());
            return ResponseEntity.ok("Retrait demandé avec succès. Un code de retrait vous a été envoyé.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PostMapping("/storePayment")
    public ResponseEntity<String> storePayment(@RequestBody StorePaymentDTO request) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        String result = transactionService.processPayment(user, request.getAmount());

        if ("Payment successful".equals(result)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}
