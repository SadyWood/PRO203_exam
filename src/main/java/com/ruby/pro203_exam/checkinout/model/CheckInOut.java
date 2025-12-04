package com.ruby.pro203_exam.checkinout.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "check_in_out_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckInOut {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "checked_in_by")
    private UUID checkedInBy;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "checked_out_by")
    private UUID checkedOutBy;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    protected void onCreate() {
        if (checkInTime == null) {
            checkInTime = LocalDateTime.now();
        }
    }
}