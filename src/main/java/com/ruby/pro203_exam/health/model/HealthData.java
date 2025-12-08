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

    @Column(name = "medical_conditions", columnDefinition = "TEXT")
    private String medicalConditions;

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "medications", columnDefinition = "TEXT")
    private String medications;

    @Column(name = "emergency_contact", columnDefinition = "TEXT")
    private String emergencyContact;

    @Column(name = "dietary_restrictions", columnDefinition = "TEXT")
    private String dietaryRestrictions;
}