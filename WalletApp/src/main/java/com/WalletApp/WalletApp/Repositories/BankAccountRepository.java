package com.WalletApp.WalletApp.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.WalletApp.WalletApp.Entities.BankAccount;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    
    Optional<BankAccount> findByBankAccountNumber(String bankAccountNumber);
    
}
