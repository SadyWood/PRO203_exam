package com.ruby.pro203_exam.absence.dto;

import com.ruby.pro203_exam.absence.model.AbsenceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAbsenceDto {
    private UUID childId;
    private LocalDate startDate;
    private LocalDate endDate;
    private AbsenceType type;
    private String reason;
}