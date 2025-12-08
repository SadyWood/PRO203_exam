package com.ruby.pro203_exam.child.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

// Response DTO for child
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildResponseDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String groupName;
    private UUID kindergartenId;
    private String kindergartenName; // From kindergarten lookup
    private Boolean checkedIn;
}
