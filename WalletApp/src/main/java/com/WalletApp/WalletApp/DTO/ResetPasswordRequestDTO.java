package com.WalletApp.WalletApp.DTO;

import lombok.Data;

@Data
public class ResetPasswordRequestDTO {

    private String phoneNumber;

    private String password;

    private String confirmPassword;
}