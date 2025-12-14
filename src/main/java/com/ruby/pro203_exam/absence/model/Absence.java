package com.ruby.pro203_exam.absence.model;

import com.ruby.pro203_exam.checker.model.PersonType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "absences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Absence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private AbsenceType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private AbsenceStatus status = AbsenceStatus.PENDING;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "reported_by", nullable = false)
    private UUID reportedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "reported_by_type", nullable = false, length = 20)
    private PersonType reportedByType;

    @Column(name = "approved_by_staff")
    private UUID approvedByStaff;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();


}
