package com.WalletApp.WalletApp.DTO;

import java.time.LocalDate;

import lombok.Data;

@Data
public class BankAccountDTO {

    private String bankAccountNumber;

    private String firstName;

    private String lastName;

    private String email;

    private LocalDate dateOfBirth;
    
    private String title; 
}
