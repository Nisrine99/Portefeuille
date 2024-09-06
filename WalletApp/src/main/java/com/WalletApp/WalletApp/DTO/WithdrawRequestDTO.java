package com.WalletApp.WalletApp.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class WithdrawRequestDTO {

    @NotNull(message = "Le montant est obligatoire.")
    @Positive(message = "Le montant doit être positif.")
    private Double amount;
}