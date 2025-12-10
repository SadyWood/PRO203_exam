package com.ruby.pro203_exam.group.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "staff_group_assignments", uniqueConstraints =
@UniqueConstraint(columnNames = {"staff_id", "group_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffGroupAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "staff_id", nullable = false)
    private UUID staffId;

    @Column(name = "group_id", nullable = false)
    private UUID groupId;

    @Column(name = "assigned_at", nullable = false)
    @Builder.Default
    private LocalDateTime assignedAt = LocalDateTime.now();

    @Column(name = "is_responsible", nullable = false)
    @Builder.Default
    private Boolean isResponsible = false;
}
