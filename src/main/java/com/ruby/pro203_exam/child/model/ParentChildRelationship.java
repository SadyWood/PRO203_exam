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

    @Column(name = "relationship_type", length = 50)
    private String relationshipType; // "MOTHER", "FATHER", etc.

    @Column(name = "can_pickup", nullable = false)
    @Builder.Default
    private Boolean canPickup = true;

    @Column(name = "can_drop_off", nullable = false)
    @Builder.Default
    private Boolean canDropOff = true;

    @Column(name = "is_primary_contact", nullable = false)
    @Builder.Default
    private Boolean isPrimaryContact = false;

    @Column(name = "requires_id_verification", nullable = false)
    @Builder.Default
    private Boolean requiresIdVerification = false;
}