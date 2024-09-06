package com.WalletApp.WalletApp.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.WalletApp.WalletApp.Entities.Agency;

@Repository
public interface AgencyRepository extends JpaRepository<Agency, Long> {
   
}
