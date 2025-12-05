package com.ruby.pro203_exam.auth.controller;

import com.ruby.pro203_exam.auth.dto.*;
import com.ruby.pro203_exam.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

// Rest Controller for authentication
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    // Called by frontend after OpenID Authentication
    @PostMapping("/openid-callback")
    public ResponseEntity<UserResponseDto> handleOpenIdCallback(
            @Valid @RequestBody OpenIdCallbackDto dto) {

        log.info("POST /api/auth/openid-callback - email: {}", dto.getEmail());

        UserResponseDto user = authService.handleOpenIdCallback(dto);

        // Check if user needs to complete registration
        if (user.getRole() == null || user.getProfileId() == null) {
            log.info("User needs to complete registration: {}", user.getId());
            // Frontend will show registration form
        }

        return ResponseEntity.ok(user);
    }

    // Complete registration after first login - user selects role and provides additional information
    @PostMapping("/complete-registration/{userId}")
    public ResponseEntity<UserResponseDto> completeRegistration(
            @PathVariable UUID userId,
            @Valid @RequestBody CompleteRegistrationDto dto) {

        log.info("POST /api/auth/complete-registration/{} - role: {}", userId, dto.getRole());

        UserResponseDto user = authService.completeRegistration(userId, dto);

        return ResponseEntity.ok(user);
    }

    // Get current user info when we add JWT authentication - TODO: Add @AuthenticationPrincipal when JWT implemented
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser() {
        // TODO: Get userId from JWT token
        log.info("GET /api/auth/me");

        // Returns placeholder for now
        throw new RuntimeException("Not implemented - add JWT authentication first");
    }

    // Get user by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable UUID id) {
        log.info("GET /api/auth/users/{}", id);
        return ResponseEntity.ok(authService.getUserById(id));
    }
}