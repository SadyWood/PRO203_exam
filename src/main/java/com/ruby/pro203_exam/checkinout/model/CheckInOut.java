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

    // Which child
    @Column(name = "child_id", nullable = false)
    private UUID childId;

    // When the child arrived
    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    // WHO dropped off the child
    @Column(name = "dropped_off_by")
    private UUID droppedOffBy;

    // Type of person dropped of the child // Parent, other
    @Enumerated
    @Column(name = "dropped_off_by_type", length = 20)
    private PersonType droppedOffByType;

    // Staff who confirmed check inn
    @Column(name = "check_in_confirmed_by_staff")
    private UUID checkInConfirmedByStaff;

    // Name of person if person not in system
    @Column(name = "dropped_off_by_name", length = 255)
    private String droppedOffByName;

    // When child left
    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    // WHO picked up the child
    @Column(name = "picked_up_by")
    private UUID pickedUpBy;

    // Type of person who picked up
    @Enumerated
    @Column(name = "picked_up_by_type", length = 20)
    private PersonType pickedUpByType;

    @Column(name = "check_out_approved_by_staff")
    private UUID checkOutApprovedByStaff;

    @Column(name = "picked_up_by_name", length = 255)
    private String pickedUpByName;

    @Column(name = "id_verified")
    @Builder.Default
    private boolean idVerified = false;


    // Notes about check-in/out - "early pickup due to doctor appointment" etc
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (checkInTime == null) {
            checkInTime = LocalDateTime.now();
        }
    }
}