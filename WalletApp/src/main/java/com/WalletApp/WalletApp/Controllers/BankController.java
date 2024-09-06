package com.WalletApp.WalletApp.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.WalletApp.WalletApp.Services.BankService;

@RestController
@RequestMapping("/api")
public class BankController {

    private final BankService bankService;

    public BankController(BankService bankService) {
        this.bankService = bankService;
    }

    @PostMapping("/verify-bank-account")
    public ResponseEntity<String> verifyBankAccountNumber(@RequestParam String bankAccountNumber) {
        
        boolean isClient = bankService.isClient(bankAccountNumber);
        
        if (isClient) {
            return ResponseEntity.ok("Bank account number is valid. Proceed to enter the PIN code.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid bank account number.");
        }
    }
}

