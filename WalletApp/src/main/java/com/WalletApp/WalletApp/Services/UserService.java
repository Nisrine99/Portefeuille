package com.WalletApp.WalletApp.Services;

import java.util.Optional;

import com.WalletApp.WalletApp.DTO.LoginRequestDTO;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Enums.AccountType;

public interface UserService {

    Optional<User> findUserByPhoneNumber(String phoneNumber);

    boolean phoneNumberExists(String phoneNumber);

    User getUserById(Long userId);

    User getUserByPhoneNumber(String phoneNumber);

    User createUser(User user);

    User authenticate(LoginRequestDTO input);

    void updateAccountType(Long userId, AccountType newAccountType);

    void updatePassword(Long userId, String newPassword);

    void updatePin(Long userId, String newPin);

    void updateEmail(Long userId, String newEmail);

    String getEmail(Long userId);
}
