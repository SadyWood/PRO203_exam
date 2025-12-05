package com.ruby.pro203_exam.staff.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(unique = true, length = 50)
    private String employeeId;

    @Column(length = 20)
    private String phoneNumber;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 100)
    private String position;
}