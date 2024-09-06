package com.WalletApp.WalletApp.DTO;

import java.time.LocalDate;

import com.WalletApp.WalletApp.Enums.AccountType;

import lombok.Data;

@Data
public class UserFormDTO {

    private AccountType accountType; 

    private String title; 

    private String firstName;

    private String lastName;

    private String email;

    private LocalDate birthDate;
    
    private String walletAccountNumber;
}
