package com.contractiq.backend.service;

import com.contractiq.backend.model.User;
import com.contractiq.backend.repository.UserRepository;
import com.contractiq.backend.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final UserRepository userRepository;
    private final OtpUtil otpUtil;
    private final EmailService emailService;

    @Value("${otp.expiry.minutes}")
    private int otpExpiryMinutes;

    @Transactional
    public void generateAndSendOtp(User user) {

        // generate fresh OTP
        String otp = otpUtil.generateOtp();

        // save OTP and expiry to user record
        user.setOtpCode(otp);
        user.setOtpExpiresAt(
                LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        userRepository.save(user);

        // send email
        emailService.sendOtpEmail(
                user.getEmail(),
                user.getName(),
                otp);

        log.info("OTP generated and sent for user: {}",
                user.getEmail());
    }

    @Transactional
    public void verifyOtp(User user, String submittedOtp) {

        // check OTP exists
        if (user.getOtpCode() == null) {
            throw new RuntimeException(
                    "No OTP found. Please request a new one.");
        }

        // check OTP not expired
        if (LocalDateTime.now().isAfter(user.getOtpExpiresAt())) {
            // clear expired OTP
            clearOtp(user);
            throw new RuntimeException(
                    "OTP has expired. Please request a new one.");
        }

        // check OTP matches
        if (!user.getOtpCode().equals(submittedOtp)) {
            throw new RuntimeException(
                    "Incorrect OTP. Please try again.");
        }

        // OTP is valid — verify the user and clear OTP
        user.setVerified(true);
        clearOtp(user);
        userRepository.save(user);

        log.info("User verified successfully: {}", user.getEmail());
    }

    // clears OTP fields — called after successful verify or expiry
    @Transactional
    public void clearOtp(User user) {
        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);
    }
}