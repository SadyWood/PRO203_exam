package com.ruby.pro203_exam.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleAuthRequestDto {
    @NotBlank(message = "ID token is required")
    private String idToken;
}
