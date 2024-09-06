package com.WalletApp.WalletApp.DTO;

import java.util.Set;

import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Enums.AccountType;
import com.WalletApp.WalletApp.Enums.Role;

import lombok.Data;

@Data
public class UserProfileDTO {

    private String phoneNumber;

    private AccountType accountType;

    private String email;
    
    private Set<Role> roles;

    public UserProfileDTO(User user) {
        this.accountType = user.getAccountType();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.roles = user.getRoles(); 
    }
}
