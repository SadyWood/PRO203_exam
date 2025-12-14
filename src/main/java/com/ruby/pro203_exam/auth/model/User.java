package com.ruby.pro203_exam.auth.model;

// User entity - Stores Authentication and credentials separate from business data

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users") // Table name
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    // Primary key is UUID
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Auto generate UUID
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    // ----------------------------------------- OPENID Fields ----------------------------------------- //
    //OpenID identifier (Google ID)
    @Column(name = "openid_subject", unique = true, nullable = false, length = 255)
    private String openIdSubject;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "name", length = 255)
    private String name;

    // URL to user's profile picture from Google
    @Column(name = "profile_picture_url", length = 500)
    private String profilePictureUrl;

    @Column(name = "tos_accepted", nullable = false)
    @Builder.Default
    private Boolean tosAccepted = false;

    @Column(name = "tos_accepted_at")
    private LocalDateTime tosAcceptedAt;

    @Column(name = "tos_version", length = 20)
    private String tosVersion;

    // ----------------------------------------- System Fields ----------------------------------------- //
    // Role for authorization
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role;

    // UUID link to Parent or Staff in app database
    @Column(name = "profile_id")
    private UUID profileId;
}
