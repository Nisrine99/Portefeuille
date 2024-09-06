package com.WalletApp.WalletApp.DTO;

import lombok.Data;

@Data
public class VerifyCodeDTO {

    private String phoneNumber;
    
    private String code;
}
