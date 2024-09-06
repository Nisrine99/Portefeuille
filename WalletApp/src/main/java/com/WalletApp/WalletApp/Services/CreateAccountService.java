package com.WalletApp.WalletApp.Services;

import com.WalletApp.WalletApp.DTO.UserFormDTO;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Enums.AccountType;

public interface CreateAccountService {
    
    void savePhoneNumber(String phoneNumber);

    User completeRegistration(UserFormDTO userFormDTO, String phoneNumber);

    void setPassword(String password, Long userId);

    void setPin(String pin, Long userId);

    void setAccountType(Long userId, AccountType accountType);

    User updateUserWithBankAccountData(String phoneNumber, String bankAccountNumber) throws Exception;

    String generateUniqueWalletAccountNumber();
}
