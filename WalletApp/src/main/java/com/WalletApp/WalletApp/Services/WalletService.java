package com.WalletApp.WalletApp.Services;

import com.WalletApp.WalletApp.DTO.WalletResponseDTO;
import com.WalletApp.WalletApp.Entities.Agency;
import com.WalletApp.WalletApp.Entities.User;

public interface WalletService {
    
    WalletResponseDTO getWalletDetails();

    double getWalletBalanceByUser(User user);

    boolean rechargeWithBankAccount(User user, double amount);

    Long rechargeInAgency(User user, double amount, Agency agency);

    boolean transferFunds(User sender, String recipientPhoneNumber, double amount);
}
