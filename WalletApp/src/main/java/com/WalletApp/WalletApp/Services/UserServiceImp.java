package com.WalletApp.WalletApp.Services;

import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.WalletApp.WalletApp.DTO.LoginRequestDTO;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Enums.AccountType;
import com.WalletApp.WalletApp.Exceptions.CustomAuthenticationException;
import com.WalletApp.WalletApp.Repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    
    private final PasswordEncoder passwordEncoder;

    public UserServiceImp (
        UserRepository userRepository,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<User> findUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    @Override
    public boolean phoneNumberExists(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber).isPresent();
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    @Override
    public User getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found with phone number: " + phoneNumber));
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User authenticate(LoginRequestDTO input) {

        User user = userRepository.findByPhoneNumber(input.getPhoneNumber())
                .orElseThrow(() -> new CustomAuthenticationException("Numéro de téléphone incorrect"));
    
        boolean passwordMatches = passwordEncoder.matches(input.getPassword(), user.getPassword());

        if (!passwordMatches) {
            throw new CustomAuthenticationException("Mot de passe incorrect");
        }
        
        return user;
    }
    
    @Override
    public void updateAccountType(Long userId, AccountType accountType) {

        User user = getUserById(userId);

        if (user != null) {
            user.setAccountType(accountType);
            userRepository.save(user);
        }
    }

    @Override
    public void updatePassword(Long userId, String newPassword) {

        User user = getUserById(userId);

        if (user != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        }
    }

    @Override
    public void updatePin(Long userId, String newPin) {

        User user = getUserById(userId);

        if (user != null) {
            user.setPin(passwordEncoder.encode(newPin));
            userRepository.save(user);
        }
    }

    @Override
    public void updateEmail(Long userId, String newEmail) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(newEmail);
        userRepository.save(user);
    }

    @Override
    public String getEmail(Long userId) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        return user.getEmail();
    } 
}
