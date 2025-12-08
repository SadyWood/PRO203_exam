package com.ruby.pro203_exam.kindergarten.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

// Kindergarten entity representing a physical kindergarten location and its information
@Entity
@Table(name = "kindergartens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Kindergarten {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 255)
    private String name;

    @Column(length = 500)
    private String address; // Location

    @Column(name = "phone_number", length = 20)
    private String phoneNumber; // Contact number

    @Column(length = 255)
    private String email; // Contact email

}
