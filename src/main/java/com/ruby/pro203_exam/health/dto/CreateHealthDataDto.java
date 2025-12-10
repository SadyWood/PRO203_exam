package com.ruby.pro203_exam.health.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateHealthDataDto {
    private String medicalConditions;
    private String allergies;
    private String medications;
    private String emergencyContact;
    private String dietaryRestrictions;
}
