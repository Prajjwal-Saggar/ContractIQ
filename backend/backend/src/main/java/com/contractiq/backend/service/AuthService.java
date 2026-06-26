package com.contractiq.backend.service;

import com.contractiq.backend.dto.*;
import com.contractiq.backend.model.User;
import com.contractiq.backend.model.Role;
import com.contractiq.backend.model.User;
import com.contractiq.backend.repository.UserRepository;
import com.contractiq.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    @Transactional
    public Map<String, String> register(RegisterRequest request) {

        // check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "Email already registered: "
                            + request.getEmail());
        }

        // parse role — default USER
        Role role;
        try {
            role = request.getRole() != null
                    ? Role.valueOf(request.getRole()
                    .toUpperCase(java.util.Locale.ENGLISH))
                    : Role.USER;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(
                    "Invalid role: " + request.getRole());
        }

        // build user — unverified until OTP confirmed
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(
                        request.getPassword()))
                .role(role)
                .verified(false)
                .build();

        User saved = userRepository.save(user);
        log.info("New user registered (unverified): {}",
                saved.getEmail());

        // generate OTP and send email
        otpService.generateAndSendOtp(saved);

        // return simple message — no JWT yet
        // JWT only issued after OTP verification
        return java.util.Map.of(
                "message",
                "Registration successful. " +
                        "Please check your email for the OTP.",
                "email", saved.getEmail()
        );
    }

    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest request) {

        // find user
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(
                        "No account found with email: "
                                + request.getEmail()));

        // already verified
        if (user.isVerified()) {
            throw new RuntimeException(
                    "Account already verified. Please login.");
        }

        // verify OTP — throws if wrong or expired
        otpService.verifyOtp(user, request.getOtp());

        log.info("OTP verified for user: {}", user.getEmail());

        // NOW issue JWT — only after successful verification
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getName());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .verified(true)
                .message("Email verified successfully. Welcome!")
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        // find user
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(
                        "No account found with email: "
                                + request.getEmail()));

        // must be verified before login
        if (!user.isVerified()) {
            throw new RuntimeException(
                    "Please verify your email before logging in.");
        }

        // check password
        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password.");
        }

        log.info("User logged in: {}", user.getEmail());

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getName());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .verified(true)
                .message("Login successful.")
                .build();
    }

    @Transactional
    public Map<String, String> resendOtp(
            ResendOtpRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(
                        "No account found with email: "
                                + request.getEmail()));

        if (user.isVerified()) {
            throw new RuntimeException(
                    "Account already verified. Please login.");
        }

        // generate new OTP and resend
        otpService.generateAndSendOtp(user);

        return java.util.Map.of(
                "message",
                "New OTP sent to " + request.getEmail()
        );
    }
}