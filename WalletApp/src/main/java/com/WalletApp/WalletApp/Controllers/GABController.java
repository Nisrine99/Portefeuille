package com.WalletApp.WalletApp.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.WalletApp.WalletApp.Services.TransactionService;


@Controller
@RequestMapping("/GAB")
public class GABController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/gab")
    public String showGABPage() {

        return "GAB"; 
        
    }

    @PostMapping("/validateWithdrawal")
    public ResponseEntity<String> validateWithdrawal(@RequestParam("withdrawalCode") String withdrawalCode,
                                                     @RequestParam("amount") Double amount) {
        try {
            transactionService.validateWithdrawal(amount , withdrawalCode);
            return ResponseEntity.ok("Retrait validé avec succès.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
