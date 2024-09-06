package com.WalletApp.WalletApp.Repositories;

import java.util.Optional;

import com.WalletApp.WalletApp.Entities.Wallet;

import org.springframework.data.jpa.repository.JpaRepository;

import com.WalletApp.WalletApp.Entities.User;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    
    boolean existsByWalletAccountNumber(String walletAccountNumber);
    
    Optional<Wallet> findByUser(User user);

}
