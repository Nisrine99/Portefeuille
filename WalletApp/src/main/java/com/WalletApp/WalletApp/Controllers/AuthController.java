package com.WalletApp.WalletApp.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.WalletApp.WalletApp.DTO.LoginRequestDTO;
import com.WalletApp.WalletApp.Entities.User;
import com.WalletApp.WalletApp.Responses.LoginResponse;
import com.WalletApp.WalletApp.Services.JwtService;
import com.WalletApp.WalletApp.Services.UserService;


@RequestMapping("/api/auth")
@RestController
public class AuthController {
    
    private final JwtService jwtService;
    
    private final UserService userService;

    public AuthController(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginRequestDTO loginRequestDto) {
        
        User authenticatedUser = userService.authenticate(loginRequestDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse().setToken(jwtToken).setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }
}

