package com.WalletApp.WalletApp.Repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.WalletApp.WalletApp.Entities.Transaction;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Entities.Wallet;

import jakarta.transaction.Transactional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Transactional
    List<Transaction> findByUserId(Long userId);

    @Transactional
    List<Transaction> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Transactional
    List<Transaction> findByAmount(double amount);

    @Transactional
    List<Transaction> findByDescriptionContaining(String description);

    @Transactional
    List<Transaction> findByStatus(String status);

    List<Transaction> findByUserOrderByDateDesc(User user);

    long countByWallet(Wallet wallet);

    Optional<Transaction> findByWithdrawalCode(String withdrawalCode);
    
}
