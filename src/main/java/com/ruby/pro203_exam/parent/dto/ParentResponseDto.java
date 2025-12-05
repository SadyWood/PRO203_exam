package com.ruby.pro203_exam.parent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

// DTO for sending parent data to frontend - what API returns
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentResponseDto {
    private UUID id; // Parent's UUID
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Boolean canPickup; // Can this parent pick up child
}
