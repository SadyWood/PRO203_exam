package com.ruby.pro203_exam.google.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.ruby.pro203_exam.google.dto.AuthRequest;
import com.ruby.pro203_exam.google.dto.AuthResponse;
import com.ruby.pro203_exam.google.dto.ErrorResponse;
import com.ruby.pro203_exam.google.service.AuthService;
import com.ruby.pro203_exam.google.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@Valid @RequestBody AuthRequest request) {
        try{
            log.info("Authenticating with Google");

            GoogleIdToken.Payload payload = authService.verifyToken(request.getIdToken());
            AuthService.UserInfoFromGoogle userInfo = authService.extractUserInfo(payload);

            if(!userInfo.isEmailVerified()){
                log.warn("User: {} is not verified", userInfo.getEmail());
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(ErrorResponse.builder()
                                .error("EMAILISNOTVERIFIED")
                                .message("User is not verified")
                                .timestamp(LocalDateTime.now())
                                .path("/api/auth/google")
                                .build());
            }

            // Temporary solution, i need to test it, and theres no db, but i need it.

            String role = "PARENT";
            Long mockUserId = null;

            String jwtToken = jwtService.generateToken(
                    userInfo.getEmail(),
                    role,
                    mockUserId
            );

            AuthResponse authResponse = AuthResponse.builder()
                    .token(jwtToken)
                    .email(userInfo.getEmail())
                    .name(userInfo.getName())
                    .profilePictureUrl(userInfo.getProfilePictureUrl())
                    .role(role)
                    .isUserNew(true)
                    .userId(mockUserId)
                    .build();

            log.info("User authenticated: {}", userInfo.getEmail());

            return ResponseEntity.ok(authResponse);

        } catch (GeneralSecurityException e) {
            log.error("Verification failed with {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ErrorResponse.builder()
                    .error("UNAUTHORIZED")
                            .message("Unauthorized or invalid credentials")
                            .timestamp(LocalDateTime.now())
                            .path("/api/auth/google")
                            .build());

        } catch (IOException e) {
            log.error("Verification failed because of an network error {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ErrorResponse.builder()
                            .error("NETWORKERROR")
                            .message("Failed to verify token")
                            .timestamp(LocalDateTime.now())
                            .path("/api/auth/google")
                            .build());

        } catch (Exception e) {
            log.error("Unexpected error on authentication. failed with {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ErrorResponse.builder()
                            .error("INTERNALERROR")
                            .message("Unexpected error")
                            .timestamp(LocalDateTime.now())
                            .path("/api/auth/google")
                            .build());
        }

    }

    // 2 methods for testing only, since theres no frontend as of now. one for health check, other to verify JWT generation.

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/testjwt")
    public ResponseEntity<String> testJwt() {
        String testToken = jwtService.generateToken("test@email.com", "PARENT", 1L);
        return ResponseEntity.ok(testToken);
    }

}
