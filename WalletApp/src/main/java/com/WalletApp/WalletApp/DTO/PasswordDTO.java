package com.WalletApp.WalletApp.DTO;

import lombok.Data;

@Data
public class PasswordDTO {

    private String currentPassword;

    private String password;
    
    private String confirmPassword;
}
