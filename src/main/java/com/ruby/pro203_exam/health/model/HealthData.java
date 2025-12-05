package com.ruby.pro203_exam.health.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "health_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthData {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "child_id", nullable = false, unique = true)
    private UUID childId;

    @Column(columnDefinition = "TEXT")
    private String medicalConditions;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(columnDefinition = "TEXT")
    private String medications;

    @Column(columnDefinition = "TEXT")
    private String emergencyContact;

    @Column(columnDefinition = "TEXT")
    private String dietaryRestrictions;
}