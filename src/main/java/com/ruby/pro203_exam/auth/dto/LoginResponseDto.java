package com.ruby.pro203_exam.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Dto returned after a successful login - contains JWT token and user info
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    private String token; // JWT token for subsequent requests
    private String tokenType; // Always "Bearer"
    private UserResponseDto user; // User details
}
