package com.WalletApp.WalletApp.DTO;

import lombok.Data;

@Data
public class BankAccountUpdateRequest {

    private String phoneNumber;
    
    private String bankAccountNumber;
}
