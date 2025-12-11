package com.ruby.pro203_exam.auth.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.ruby.pro203_exam.auth.dto.*;
import com.ruby.pro203_exam.auth.service.AuthService;
import com.ruby.pro203_exam.auth.service.GoogleAuthService;
import com.ruby.pro203_exam.auth.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.UUID;

// Rest Controller for authentication
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService googleAuthService;
    private final JwtService jwtService;

    // Called by frontend with Google ID token - verifies token and handles user login/registration
    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@Valid @RequestBody GoogleAuthRequestDto request) {
        try {
            log.info("POST /api/auth/google - Authenticating with Google");

            // Verify Google token
            GoogleIdToken.Payload payload = googleAuthService.verifyToken(request.getIdToken());
            GoogleAuthService.UserInfoFromGoogle userInfo = googleAuthService.extractUserInfo(payload);

            // Check email verification
            if (!userInfo.isEmailVerified()) {
                log.warn("User email not verified: {}", userInfo.getEmail());
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponseDto("EMAIL_NOT_VERIFIED", "Email is not verified"));
            }

            // Create OpenID callback DTO
            OpenIdCallbackDto callbackDto = OpenIdCallbackDto.builder()
                    .openidSubject(userInfo.getGoogleId())
                    .email(userInfo.getEmail())
                    .name(userInfo.getName())
                    .profilePictureUrl(userInfo.getProfilePictureUrl())
                    .build();

            // Handle user login/registration
            UserResponseDto user = authService.handleOpenIdCallback(callbackDto);

            // Generate JWT token
            String jwtToken = jwtService.generateToken(
                    user.getEmail(),
                    user.getRole() != null ? user.getRole().toString() : null,
                    user.getId()
            );

            // Build response
            LoginResponseDto response = LoginResponseDto.builder()
                    .token(jwtToken)
                    .user(user)
                    .needsRegistration(user.getRole() == null || user.getProfileId() == null)
                    .build();

            log.info("User authenticated: {}", user.getEmail());
            return ResponseEntity.ok(response);

        } catch (GeneralSecurityException e) {
            log.error("Token verification failed: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponseDto("INVALID_TOKEN", "Invalid or expired token"));

        } catch (IOException e) {
            log.error("Network error during token verification: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("NETWORK_ERROR", "Failed to verify token"));

        } catch (Exception e) {
            log.error("Unexpected error during authentication: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("INTERNAL_ERROR", "Unexpected error occurred"));
        }
    }

    // Complete registration after first login - user selects role and provides additional information
    @PostMapping("/complete-registration/{userId}")
    public ResponseEntity<LoginResponseDto> completeRegistration(
            @PathVariable UUID userId,
            @Valid @RequestBody CompleteRegistrationDto dto) {

        log.info("POST /api/auth/complete-registration/{} - role: {}", userId, dto.getRole());

        UserResponseDto user = authService.completeRegistration(userId, dto);

        // Generate new JWT with updated role and profile
        String jwtToken = jwtService.generateToken(
                user.getEmail(),
                user.getRole().toString(),
                user.getId()
        );

        LoginResponseDto response = LoginResponseDto.builder()
                .token(jwtToken)
                .user(user)
                .needsRegistration(false)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser() {
        log.info("GET /api/auth/me");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        UserResponseDto user = authService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    // Get user by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable UUID id) {
        log.info("GET /api/auth/users/{}", id);
        return ResponseEntity.ok(authService.getUserById(id));
    }
}