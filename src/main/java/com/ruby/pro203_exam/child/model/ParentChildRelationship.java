package com.ruby.pro203_exam.child.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "parent_child_relationships",
        uniqueConstraints = @UniqueConstraint(columnNames = {"parent_id", "child_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentChildRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "parent_id", nullable = false)
    private UUID parentId;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(length = 50)
    private String relationshipType; // "MOTHER", "FATHER", etc.

    @Column(nullable = false)
    @Builder.Default
    private Boolean canPickup = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isPrimaryContact = false;
}