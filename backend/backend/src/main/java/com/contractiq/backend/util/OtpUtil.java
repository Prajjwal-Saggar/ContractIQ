package com.contractiq.backend.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class OtpUtil {

    // cryptographically secure random — not Math.random()
    private static final SecureRandom secureRandom = new SecureRandom();

    public String generateOtp() {
        // generates a 6-digit OTP between 100000 and 999999
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }
}