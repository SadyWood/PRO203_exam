package com.ruby.pro203_exam.auth.dto;

import com.ruby.pro203_exam.auth.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

// DTO for returning user data to frontend - contains auth info and links to profile
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private UUID id;
    private String email;
    private String name;
    private UserRole role; // PARENT, STAFF, ADMIN
    private UUID profileId; // Links to Parent or Staff entity
    private Boolean active;
}
