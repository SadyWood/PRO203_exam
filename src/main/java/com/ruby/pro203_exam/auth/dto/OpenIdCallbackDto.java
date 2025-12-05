package com.ruby.pro203_exam.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for openId callback from provider - frontend sends this after openid redirect
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpenIdCallbackDto {
    private String openidSubject; // Unique ID from OpenID provider
    private String email; // User email from provider
    private String name; // Display name from provider
}
