package com.contractiq.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // is this account verified via OTP
    @Column(nullable = false)
    private boolean verified = false;

    // the OTP code — 6 digits
    private String otpCode;

    // when the OTP expires — 10 minutes from generation
    private LocalDateTime otpExpiresAt;
}