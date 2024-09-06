package com.WalletApp.WalletApp.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WalletApp.WalletApp.Entities.Agency;
import com.WalletApp.WalletApp.Services.AgencyService;

@RestController
@RequestMapping("/api")
public class AgencyController {

    @Autowired
    private AgencyService agencyService;

    @GetMapping("/agencies")
    public List<Agency> getAgencies() {
        return agencyService.getAllAgencies();
    }
}
