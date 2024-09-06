package com.WalletApp.WalletApp.Enums;

public enum AccountType {

    BASIC("Basic", 200),

    SILVER("Silver", 50000),

    PREMIUM("Premium", 20000);

    private final String displayName;

    private final int plafond;

    AccountType(String displayName, int plafond) {
        this.displayName = displayName;
        this.plafond = plafond;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getPlafond() {
        return plafond;
    }

    public static AccountType fromString(String text) {
        for (AccountType type : AccountType.values()) {
            if (type.displayName.equalsIgnoreCase(text)) {
                return type;
            }
        }
        throw new IllegalArgumentException("No matching AccountType for " + text);
    }
}

