package com.ruby.pro203_exam.kindergarten.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

// Response DTO for kindergarten - what the API returns
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KindergartenResponseDto {
    private UUID id;
    private String name;
    private String address;
    private String phoneNumber;
    private String email;
}
