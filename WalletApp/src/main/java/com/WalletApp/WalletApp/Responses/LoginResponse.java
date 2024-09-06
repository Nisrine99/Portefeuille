package com.WalletApp.WalletApp.Responses;

import org.springframework.beans.factory.annotation.Value;

public class LoginResponse {

    @Value("${security.jwt.secret-key}")
    private String token;

    @Value("${security.jwt.expiration-time}")
    private long expiresIn;

    public String getToken() {
        return token;
    }

    public LoginResponse setToken(String token) {
        this.token = token;
        return this;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public LoginResponse setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
        return this;
    }
}