package com.WalletApp.WalletApp.DTO;

import lombok.Data;

@Data
public class TransferRequestDTO {

    private String recipientPhoneNumber;
    
    private double amount;
}

