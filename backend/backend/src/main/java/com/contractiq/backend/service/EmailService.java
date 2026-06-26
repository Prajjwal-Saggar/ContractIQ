package com.contractiq.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail,
                             String name,
                             String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("ContractIQ — Your verification code");
            helper.setText(buildOtpEmailBody(name, otp), true);

            mailSender.send(message);
            log.info("OTP email sent to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send OTP email to {}: {}",
                    toEmail, e.getMessage());
            throw new RuntimeException(
                    "Failed to send verification email. " +
                            "Please try again.");
        }
    }

    private String buildOtpEmailBody(String name, String otp) {
        return """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif;
                             background: #f4f4f4; padding: 40px;">
                  <div style="max-width: 480px; margin: auto;
                              background: #ffffff; border-radius: 12px;
                              padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <h2 style="color: #1a1a2e; margin-bottom: 8px;">
                      ContractIQ
                    </h2>
                    <p style="color: #555; font-size: 15px;">
                      Hi %s,
                    </p>
                    <p style="color: #555; font-size: 15px;">
                      Your verification code is:
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                      <span style="font-size: 42px; font-weight: 700;
                                   letter-spacing: 12px; color: #26187D;">
                        %s
                      </span>
                    </div>
                    <p style="color: #888; font-size: 13px;">
                      This code expires in <strong>10 minutes</strong>.
                      Do not share it with anyone.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee;
                               margin: 24px 0;">
                    <p style="color: #bbb; font-size: 12px;">
                      If you did not request this code,
                      you can safely ignore this email.
                    </p>
                  </div>
                </body>
                </html>
                """.formatted(name, otp);
    }
}