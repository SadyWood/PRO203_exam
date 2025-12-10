package com.ruby.pro203_exam.health.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthDataResponseDto {
    private UUID id;
    private UUID childId;
    private String childName;
    private String medicalConditions;
    private String allergies;
    private String medications;
    private String emergencyContact;
    private String dietaryRestrictions;
    private UUID lastEditedBy;
    private LocalDateTime lastEditedAt;
}
