package com.WalletApp.WalletApp.Services;

import org.springframework.stereotype.Service;

import com.WalletApp.WalletApp.Repositories.BankAccountRepository;

@Service
public class BankServiceImp implements BankService {

    private final BankAccountRepository bankAccountRepository;

    public BankServiceImp(BankAccountRepository bankAccountRepository) {
        this.bankAccountRepository = bankAccountRepository;
    }
    
    @Override
    public boolean isClient(String bankAccountNumber) {
        return bankAccountRepository.findByBankAccountNumber(bankAccountNumber).isPresent();
    }
}

