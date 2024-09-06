package com.WalletApp.WalletApp.Services;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.WalletApp.WalletApp.Configuration.TwilioConfig;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Exceptions.InvalidCodeException;
import com.WalletApp.WalletApp.Repositories.UserRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import jakarta.annotation.PostConstruct;

@Service
public class SmsServiceImp implements SmsService {

    @Autowired
    private TwilioConfig twilioConfig;

    @Autowired
    private UserRepository userRepository;

    private static final String CODE_CHARACTERS = "0123456789";

    private static final int CODE_LENGTH = 6;

    private final SecureRandom random = new SecureRandom();

    @PostConstruct
    public void init() {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
    }

    @Override
    public void sendSms(String toPhoneNumber, String messageBody) {

        Message message = Message.creator(
                new PhoneNumber(toPhoneNumber),
                new PhoneNumber(twilioConfig.getTrialNumber()),
                messageBody
        ).create();

        System.out.println("SMS sent with SID: " + message.getSid());

        System.out.println("Message status: " + message.getStatus());

        System.out.println("Message body: " + message.getBody());
    }

    @Override
    public boolean verifyCode(String phoneNumber, String code) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getVerificationCode() == null || user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidCodeException("Code is invalid or expired");
        }

        return code.equals(user.getVerificationCode());
    }

    @Override
    public void sendVerificationCode(String phoneNumber) {

        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String verificationCode = generateUniqueCode();

        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        sendSms(user.getPhoneNumber(), "Votre code de vérification est : " + verificationCode);
    }

    private String generateUniqueCode() {

        StringBuilder code = new StringBuilder(CODE_LENGTH);

        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = random.nextInt(CODE_CHARACTERS.length());
            code.append(CODE_CHARACTERS.charAt(index));
        }
        
        return code.toString();
    }
}
