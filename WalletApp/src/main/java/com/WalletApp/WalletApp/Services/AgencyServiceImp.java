package com.WalletApp.WalletApp.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.WalletApp.WalletApp.Entities.Agency;
import com.WalletApp.WalletApp.Repositories.AgencyRepository;

@Service
public class AgencyServiceImp implements AgencyService{

    @Autowired
    private AgencyRepository agencyRepository;

    @Override
    public List<Agency> getAllAgencies() {
        return agencyRepository.findAll();
    }
}
