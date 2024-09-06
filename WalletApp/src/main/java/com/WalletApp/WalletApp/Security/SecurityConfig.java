package com.WalletApp.WalletApp.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.WalletApp.WalletApp.Configuration.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final AuthenticationProvider authenticationProvider;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
        JwtAuthenticationFilter jwtAuthenticationFilter,
        AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**", "/api/users/register-phone", "/api/account-types", "/api/users/complete-registration", "/api/users/verify-and-update-bank-account", "/api/users/set-account-type","/api/users/set-password", "/api/users/set-pin", "/api/sms/send-verification-code", "/api/sms/verify-code" ).permitAll()
        .requestMatchers("/agent/dashboard" , "/agent/confirm" , "/agent/reject" , "/agent/hello" ,"/GAB/gab" , "/GAB/validateWithdrawal").permitAll()
        .requestMatchers("/api/profile/forgot-password" , "/api/profile/verify-reset-code" , "/api/profile/reset-password" , "/online-payment").permitAll()
        .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .authenticationProvider(authenticationProvider)
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
} 
}
