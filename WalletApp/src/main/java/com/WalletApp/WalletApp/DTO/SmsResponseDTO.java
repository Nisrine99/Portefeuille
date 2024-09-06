package com.WalletApp.WalletApp.DTO;

import com.WalletApp.WalletApp.Enums.OtpStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SmsResponseDTO {

    private OtpStatus status;
    
    private String message;
}
