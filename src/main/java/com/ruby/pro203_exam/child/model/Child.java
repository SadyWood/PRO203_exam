package com.ruby.pro203_exam.child.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "children")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Child {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column(length = 50)
    private String groupName;

    // Link to health data
    @Column(name = "health_data_id")
    private UUID healthDataId;

    // Is currently in kindergarten?
    @Column(nullable = false)
    @Builder.Default
    private Boolean checkedIn = false;
}