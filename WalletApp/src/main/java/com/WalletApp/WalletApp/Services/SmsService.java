package com.WalletApp.WalletApp.Services;

public interface SmsService {
    
    void sendSms(String toPhoneNumber, String messageBody);

    boolean verifyCode(String phoneNumber, String code);

    void sendVerificationCode(String phoneNumber);
}
