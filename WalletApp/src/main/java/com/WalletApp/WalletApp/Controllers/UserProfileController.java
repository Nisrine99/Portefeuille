package com.WalletApp.WalletApp.Controllers;

import java.util.Collections;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WalletApp.WalletApp.DTO.AccountTypeDTO;
import com.WalletApp.WalletApp.DTO.PasswordDTO;
import com.WalletApp.WalletApp.DTO.PhoneNumberDTO;
import com.WalletApp.WalletApp.DTO.PinDTO;
import com.WalletApp.WalletApp.DTO.ResetPasswordRequestDTO;
import com.WalletApp.WalletApp.DTO.VerifyCodeDTO;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Exceptions.ApiResponse;
import com.WalletApp.WalletApp.Repositories.UserRepository;
import com.WalletApp.WalletApp.Services.SmsService;
import com.WalletApp.WalletApp.Services.UserService;


@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://192.168.1.5", allowCredentials = "true")
public class UserProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private SmsService smsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/email")
    public ResponseEntity<Map<String, String>> getEmail() {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        String email = userService.getEmail(currentUser.getId());
        
        return ResponseEntity.ok(Collections.singletonMap("email", email));
    }

    @GetMapping("/account-type")
    public ResponseEntity<String> getAccountType() {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        User user = userService.getUserById(currentUser.getId());
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        String accountType = user.getAccountType() != null ? user.getAccountType().name() : "Non défini";

        return ResponseEntity.ok(accountType);
    }

    @GetMapping("/account-number")
    public ResponseEntity<String> getAccountNumber() {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        User user = userService.getUserById(currentUser.getId());
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        
        String accountNumber = (user.getWallet() != null && user.getWallet().getWalletAccountNumber() != null)
        ? user.getWallet().getWalletAccountNumber()
        : "Non défini";
        
        return ResponseEntity.ok(accountNumber);
    }
    
    @PutMapping("/update-account-type")
    public ResponseEntity<ApiResponse> updateAccountType(@RequestBody AccountTypeDTO accountTypeDTO) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        userService.updateAccountType(currentUser.getId(), accountTypeDTO.getAccountType());
        
        return ResponseEntity.ok(new ApiResponse("Account type updated successfully", true));
    }
    
    @PutMapping("/update-password")
    public ResponseEntity<ApiResponse> updatePassword(@RequestBody PasswordDTO passwordDTO) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        User user = userService.getUserById(currentUser.getId());
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("User not found", false));
        }
        
        if (!passwordEncoder.matches(passwordDTO.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Current password is incorrect", false));
        }
        
        if (!passwordDTO.getPassword().equals(passwordDTO.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Passwords do not match", false));
        }
        
        userService.updatePassword(user.getId(), passwordDTO.getPassword());
        
        return ResponseEntity.ok(new ApiResponse("Password updated successfully", true));
    }
    
    @PutMapping("/update-pin")
    public ResponseEntity<ApiResponse> updatePin(@RequestBody PinDTO pinDTO) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        User user = userService.getUserById(currentUser.getId());
        
        if (user == null || !passwordEncoder.matches(pinDTO.getCurrentPin(), user.getPin())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Current PIN is incorrect", false));
        }
        
        if (!pinDTO.getPin().equals(pinDTO.getConfirmPin())) {
            return ResponseEntity.badRequest().body(new ApiResponse("PINs do not match", false));
        }
        
        userService.updatePin(user.getId(), pinDTO.getPin());
        
        return ResponseEntity.ok(new ApiResponse("PIN updated successfully", true));
    }
    
    @PutMapping("/update-email")
    public ResponseEntity<ApiResponse> updateEmail(@RequestBody Map<String, String> request) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        String newEmail = request.get("newEmail");
        
        if (newEmail == null || !isValidEmail(newEmail)) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid email address", false));
        }
        try {
            userService.updateEmail(currentUser.getId(), newEmail);
            return ResponseEntity.ok(new ApiResponse("Email updated successfully", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Failed to update email", false));
        }
    }
    
    private boolean isValidEmail(String email) {

        String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        Pattern pattern = Pattern.compile(emailRegex);

        return pattern.matcher(email).matches();
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody PhoneNumberDTO phoneNumberDTO) {
        
        System.out.println("Vérification du numéro : " + phoneNumberDTO.getPhoneNumber());
        
        smsService.sendVerificationCode(phoneNumberDTO.getPhoneNumber());
        
        return ResponseEntity.ok("Code de vérification envoyé.");
    }
    
    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(@RequestBody VerifyCodeDTO verifyCodeDTO) {
        
        boolean isValid = smsService.verifyCode(verifyCodeDTO.getPhoneNumber(), verifyCodeDTO.getCode());
        
        if (isValid) {
            return ResponseEntity.ok("Code vérifié avec succès.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Code incorrect ou expiré.");
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequestDTO requestDTO) {
        
        User user = userRepository.findByPhoneNumber(requestDTO.getPhoneNumber())
        .orElseThrow(() -> new RuntimeException("Aucun compte associé à ce numéro"));
        
        if (!requestDTO.getPassword().equals(requestDTO.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Les mots de passe ne correspondent pas.");
        }
        
        String encodedPassword = passwordEncoder.encode(requestDTO.getPassword());
        user.setPassword(encodedPassword);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);
        
        return ResponseEntity.ok("Mot de passe réinitialisé avec succès.");
    }
}
