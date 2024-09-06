package com.WalletApp.WalletApp.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WalletApp.WalletApp.Enums.AccountType;

@RestController
@RequestMapping("/api")
public class AccountTypeController {

    @GetMapping("/account-types")
    public ResponseEntity<AccountType[]> getAccountTypes() {
        return ResponseEntity.ok(AccountType.values());
    }

}
