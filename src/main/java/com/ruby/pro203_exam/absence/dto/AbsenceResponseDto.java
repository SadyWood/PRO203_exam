package com.ruby.pro203_exam.absence.dto;

import com.ruby.pro203_exam.absence.model.AbsenceStatus;
import com.ruby.pro203_exam.absence.model.AbsenceType;
import com.ruby.pro203_exam.checker.model.PersonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AbsenceResponseDto {
    private UUID id;
    private UUID childId;
    private String childName;
    private LocalDate startDate;
    private LocalDate endDate;
    private AbsenceType type;
    private AbsenceStatus status;
    private String reason;
    private UUID reportedBy;
    private String reportedByName;
    private PersonType reportedByType;
    private UUID approvedByStaff;
    private String approvedByStaffName;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
}