package com.contractiq.backend.controller;

import com.contractiq.backend.dto.*;
import com.contractiq.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    // Step 1 — register and trigger OTP email
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @Valid @RequestBody RegisterRequest request) {

        log.info("Register request for: {}",
                request.getEmail());
        Map<String, String> response =
                authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Step 2 — verify OTP and receive JWT
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(
            @Valid @RequestBody OtpVerifyRequest request) {

        log.info("OTP verify request for: {}",
                request.getEmail());
        AuthResponse response =
                authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    // Step 3 — login (only after verified)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        log.info("Login request for: {}",
                request.getEmail());
        AuthResponse response =
                authService.login(request);
        return ResponseEntity.ok(response);
    }

    // resend OTP if expired or lost
    @PostMapping("/resend-otp")
    public ResponseEntity<Map<String, String>> resendOtp(
            @Valid @RequestBody ResendOtpRequest request) {

        log.info("Resend OTP request for: {}",
                request.getEmail());
        Map<String, String> response =
                authService.resendOtp(request);
        return ResponseEntity.ok(response);
    }

    // health check
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "contractiq-backend"
        ));
    }
}