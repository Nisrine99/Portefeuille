package com.WalletApp.WalletApp.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WalletApp.WalletApp.DTO.VerifyCodeDTO;
import com.WalletApp.WalletApp.Exceptions.ApiResponse;
import com.WalletApp.WalletApp.Exceptions.InvalidCodeException;
import com.WalletApp.WalletApp.Services.SmsService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/sms")
public class SmsController {

    @Autowired 
    private SmsService smsService;

    @PostMapping("/send-verification-code")
    public ResponseEntity<ApiResponse> sendVerificationCode(HttpSession session) {
        
        String phoneNumber = (String) session.getAttribute("phoneNumber");

        if (phoneNumber == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse("User not authenticated", false));
        }

        try {
            smsService.sendVerificationCode(phoneNumber);
            return ResponseEntity.ok(new ApiResponse("Code sent successfully.", true));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Failed to send verification code. Please try again later.", false));
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse> verifyCode(@RequestBody VerifyCodeDTO verifyCodeDTO, HttpSession session) {

        if (verifyCodeDTO.getPhoneNumber() == null || verifyCodeDTO.getPhoneNumber().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Numéro de téléphone invalide", false));
        }

        if (verifyCodeDTO.getCode() == null || verifyCodeDTO.getCode().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Le code de vérification ne peut pas être vide", false));
        }

        if (verifyCodeDTO.getCode().length() != 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Le code de vérification doit être de 6 caractères", false));
        }

        try {
            boolean isCodeValid = smsService.verifyCode(verifyCodeDTO.getPhoneNumber(), verifyCodeDTO.getCode());
            if (isCodeValid) {
                session.setAttribute("codeVerified", true);
                return ResponseEntity.ok(new ApiResponse("Le code est valide.", true));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Code incorrect ou expiré. Veuillez réessayer.", false));
            }
        } catch (InvalidCodeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(e.getMessage(), false));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Une erreur est survenue lors de la vérification du code.", false));
        }
    }
}
