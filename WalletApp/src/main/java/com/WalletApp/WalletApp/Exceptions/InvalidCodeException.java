package com.WalletApp.WalletApp.Exceptions;

public class InvalidCodeException extends RuntimeException{
    
    public InvalidCodeException(String message) {
        super(message);
    }
}
