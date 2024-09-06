package com.WalletApp.WalletApp.Services;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.WalletApp.WalletApp.DTO.UserFormDTO;
import com.WalletApp.WalletApp.Entities.BankAccount;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Entities.Wallet;
import com.WalletApp.WalletApp.Enums.AccountType;
import com.WalletApp.WalletApp.Enums.Role;
import com.WalletApp.WalletApp.Repositories.BankAccountRepository;
import com.WalletApp.WalletApp.Repositories.UserRepository;
import com.WalletApp.WalletApp.Repositories.WalletRepository;

@Service
public class CreateAccountServiceImp implements CreateAccountService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserService userService;

    @Override
    public void savePhoneNumber(String phoneNumber) {

        User user = new User();
        user.setPhoneNumber(phoneNumber);
        userRepository.save(user);
    }

    @Override
    public String generateUniqueWalletAccountNumber() {

        Random random = new Random();

        String walletAccountNumber;

        boolean exists;

        do {
            walletAccountNumber = String.format("%08d", random.nextInt(100000000)); 
            exists = walletRepository.existsByWalletAccountNumber(walletAccountNumber);
        } while (exists);
        return walletAccountNumber;
    }

    @Override
    public User completeRegistration(UserFormDTO userFormDTO, String phoneNumber) {

        Optional<User> optionalUser = userService.findUserByPhoneNumber(phoneNumber);

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();
            user.setAccountType(userFormDTO.getAccountType());
            user.setTitle(userFormDTO.getTitle());
            user.setFirstName(userFormDTO.getFirstName());
            user.setLastName(userFormDTO.getLastName());
            user.setEmail(userFormDTO.getEmail());
            user.setDateOfBirth(userFormDTO.getBirthDate());
            
            String walletAccountNumber = generateUniqueWalletAccountNumber(); 
            
            Wallet wallet = new Wallet();
            wallet.setWalletAccountNumber(walletAccountNumber);
            wallet.setWalletBalance(0.0);
            wallet.setUser(user);
            user.setWallet(wallet);
            
            user.setBankMember(false);
            user.getRoles().clear(); 
            if (user.isBankMember()) {
                user.getRoles().add(Role.ROLE_CLIENT_DE_LA_BANQUE);
            } else {
                user.getRoles().add(Role.ROLE_UTILISATEUR_NORMAL);
            }

            userRepository.save(user);
            return user;
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Override
    public void setAccountType(Long userId, AccountType accountType) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountType(accountType);
        
        String walletAccountNumber = generateUniqueWalletAccountNumber(); 

        Wallet wallet = new Wallet();
        wallet.setWalletAccountNumber(walletAccountNumber);
        wallet.setWalletBalance(0.0);
        wallet.setUser(user);

        user.setWallet(wallet);

        userRepository.save(user);
    }

    @Override
    public User updateUserWithBankAccountData(String phoneNumber, String bankAccountNumber) throws Exception {

        Optional<BankAccount> bankAccountOpt = bankAccountRepository.findByBankAccountNumber(bankAccountNumber);
        
        if (!bankAccountOpt.isPresent()) {
            throw new Exception("Numéro de compte bancaire invalide.");
        }

        BankAccount bankAccount = bankAccountOpt.get();

        Optional<User> userOpt = userRepository.findByPhoneNumber(phoneNumber);

        if (!userOpt.isPresent()) {
            throw new Exception("Utilisateur non trouvé.");
        }
        
        User user = userOpt.get();

        user.setFirstName(bankAccount.getFirstName());
        user.setLastName(bankAccount.getLastName());
        user.setEmail(bankAccount.getEmail());
        user.setDateOfBirth(bankAccount.getDateOfBirth());
        user.setTitle(bankAccount.getTitle());
        user.setBankAccount(bankAccount);

        bankAccount.setUser(user); 
        
        user.setBankMember(!false);
        user.getRoles().clear();
        if (user.isBankMember()) {
            user.getRoles().add(Role.ROLE_CLIENT_DE_LA_BANQUE);
        } else {
            user.getRoles().add(Role.ROLE_UTILISATEUR_NORMAL);
        }
        
        return userRepository.save(user);
    }

    @Override
    public void setPassword(String password, Long userId) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(password)); 

        userRepository.save(user);
    }

    @Override
    public void setPin(String pin, Long userId) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPin(passwordEncoder.encode(pin));
        
        userRepository.save(user);
    }
}
