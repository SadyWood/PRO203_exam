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

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "group_name", length = 50)
    private String groupName;

    @Column(name = "group_id")
    private UUID groupId;

    // Link to health data
    @Column(name = "health_data_id")
    private UUID healthDataId;

    @Column(name = "kindergarten_id")
    private UUID kindergartenId;

    // Is currently in kindergarten?
    @Column(name = "checked_in", nullable = false)
    @Builder.Default
    private Boolean checkedIn = false;
}