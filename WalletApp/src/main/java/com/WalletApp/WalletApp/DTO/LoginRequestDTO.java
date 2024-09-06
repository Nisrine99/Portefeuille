package com.WalletApp.WalletApp.DTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginRequestDTO {
    
    @NotEmpty(message = "Le numéro de téléphone est requis")
    private String phoneNumber;

    @NotEmpty(message = "Le mot de passe est requis")
    private String password;
}
