package com.WalletApp.WalletApp.DTO;

import com.WalletApp.WalletApp.Enums.AccountType;

import lombok.Data;

@Data
public class AccountTypeDTO {
    
    private AccountType accountType;

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
}
