package com.WalletApp.WalletApp.DTO;

import lombok.Data;

@Data
public class PinDTO {

    private String currentPin;

    private String pin;
    
    private String confirmPin;
}
