package com.ruby.pro203_exam.auth.util;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SecurityUtils {
    private final UserRepository userRepository;

    // Get current authenticated user from JWT token
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Not authenticated");
        }

        // Principal is the email set by JwtAuthFilter
        String email = auth.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get current user's profile ID (Parent or Staff UUID)
    public UUID getCurrentProfileId() {
        return getCurrentUser().getProfileId();
    }

    // Get current user's ID
    public UUID getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
