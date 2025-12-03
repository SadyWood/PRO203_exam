package com.ruby.pro203_exam.google.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String profilePictureUrl;
    private String role;
    private boolean isUserNew;
    private Long userId;

}
