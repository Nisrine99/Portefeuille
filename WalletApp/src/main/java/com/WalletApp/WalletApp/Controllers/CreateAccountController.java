package com.WalletApp.WalletApp.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WalletApp.WalletApp.DTO.AccountTypeDTO;
import com.WalletApp.WalletApp.DTO.BankAccountDTO;
import com.WalletApp.WalletApp.DTO.PasswordDTO;
import com.WalletApp.WalletApp.DTO.PhoneNumberDTO;
import com.WalletApp.WalletApp.DTO.PinDTO;
import com.WalletApp.WalletApp.DTO.UserFormDTO;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Exceptions.ApiResponse;
import com.WalletApp.WalletApp.Services.CreateAccountService;
import com.WalletApp.WalletApp.Services.SmsService;
import com.WalletApp.WalletApp.Services.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://192.168.1.5", allowCredentials = "true")
public class CreateAccountController {

    @Autowired
    private CreateAccountService createAccountService;

    @Autowired
    private SmsService smsService;

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {

        User user = userService.getUserById(userId);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/register-phone")
    public ResponseEntity<ApiResponse> registerPhoneNumber(@RequestBody PhoneNumberDTO phoneNumberDTO, HttpSession session) {
        
        String phoneNumber = phoneNumberDTO.getPhoneNumber();

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Numéro de téléphone invalide.", false));
        }

        if (userService.phoneNumberExists(phoneNumber)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Le numéro de téléphone existe déjà.", false));
        }

        createAccountService.savePhoneNumber(phoneNumber);
        session.setAttribute("phoneNumber", phoneNumber);

        return ResponseEntity.ok(new ApiResponse("Numéro de téléphone enregistré avec succès.", true));
    }

    @PostMapping("/complete-registration")
    public ResponseEntity<ApiResponse> completeRegistration(@RequestBody UserFormDTO userFormDTO, HttpSession session) {
        
        String phoneNumber = (String) session.getAttribute("phoneNumber");

        if (phoneNumber == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("User not authenticated", false));
        }
    
        User user = createAccountService.completeRegistration(userFormDTO, phoneNumber);
        smsService.sendVerificationCode(phoneNumber);
        session.setAttribute("userId", user.getId());
    
        return ResponseEntity.ok(new ApiResponse("Registration completed successfully. Verification code sent.", true));
    }

    @PostMapping("/verify-and-update-bank-account")
    public ResponseEntity<ApiResponse> verifyAndUpdateBankAccount(@RequestBody BankAccountDTO bankAccountDTO, HttpSession session) {
        
        String phoneNumber = (String) session.getAttribute("phoneNumber");

        if (phoneNumber == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("User not authenticated", false));
        }

        try {
            User user = createAccountService.updateUserWithBankAccountData(phoneNumber, bankAccountDTO.getBankAccountNumber());
            session.setAttribute("userId", user.getId());  
            return ResponseEntity.ok(new ApiResponse("Bank account verified and user information updated successfully.", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/set-account-type")
    public ResponseEntity<ApiResponse> setAccountType(@RequestBody AccountTypeDTO accountTypeDTO, HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("User not authenticated", false));
        }
        
        try {
            createAccountService.setAccountType(userId, accountTypeDTO.getAccountType());
            User user = userService.getUserById(userId);
            session.setAttribute("user", user);
            String phoneNumber = (String) session.getAttribute("phoneNumber");

            if (phoneNumber != null) {
                smsService.sendVerificationCode(phoneNumber);
            }
            return ResponseEntity.ok(new ApiResponse("Account type set successfully and verification code sent.", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/set-password")
    public ResponseEntity<ApiResponse> setPassword(@RequestBody PasswordDTO passwordDTO, HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("User ID not found in session", false));
        }

        if (passwordDTO.getPassword() == null || passwordDTO.getConfirmPassword() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("Password fields must not be empty", false));
        }

        if (!passwordDTO.getPassword().equals(passwordDTO.getConfirmPassword())) {    
            return ResponseEntity.badRequest().body(new ApiResponse("Passwords do not match", false));
        }

        createAccountService.setPassword(passwordDTO.getPassword(), userId);

        return ResponseEntity.ok(new ApiResponse("Password set successfully", true));
    }

    @PostMapping("/set-pin")
    public ResponseEntity<ApiResponse> setPin(@RequestBody PinDTO pinDTO, HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("User ID not found in session", false));
        }

        if (pinDTO.getPin() == null || pinDTO.getConfirmPin() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("PIN fields must not be empty", false));
        }

        if (!pinDTO.getPin().equals(pinDTO.getConfirmPin())) {
            return ResponseEntity.badRequest().body(new ApiResponse("PINs do not match", false));
        }

        createAccountService.setPin(pinDTO.getPin(), userId);
        session.removeAttribute("userId");
        
        return ResponseEntity.ok(new ApiResponse("PIN set successfully", true));
    }
}
