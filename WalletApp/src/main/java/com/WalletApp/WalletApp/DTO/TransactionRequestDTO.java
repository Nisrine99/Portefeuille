package com.WalletApp.WalletApp.DTO;

import lombok.Data;

@Data
public class TransactionRequestDTO {
  
        private Long userId;

        private double amount;
        
        private String description;
}
