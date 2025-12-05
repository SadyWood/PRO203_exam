package com.ruby.pro203_exam.child.repository;

import com.ruby.pro203_exam.child.model.ParentChildRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParentChildRelationshipRepository extends JpaRepository<ParentChildRelationship, UUID> {

    // Find all children for a parent
    List<ParentChildRelationship> findByParentId(UUID parentId);

    // Find all parents for a child
    List<ParentChildRelationship> findByChildId(UUID childId);

    // Check if specific parent-child relationship exists
    boolean existsByParentIdAndChildId(UUID parentId, UUID childId);

    // Find specific relationship between parent and child
    Optional<ParentChildRelationship> findByParentIdAndChildId(UUID parentId, UUID childId);

    // Find all relationships where parent can pick up - authorization checks
    List<ParentChildRelationship> findByChildIdAndCanPickupTrue(UUID childId);

}
