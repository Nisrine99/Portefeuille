package com.WalletApp.WalletApp.DTO;

import lombok.Data;

@Data
public class RechargeRequestDTO{

    private double amount;

    private Long agencyId;
}
