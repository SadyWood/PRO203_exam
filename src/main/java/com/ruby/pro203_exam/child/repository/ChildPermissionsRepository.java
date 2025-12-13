package com.ruby.pro203_exam.child.repository;

import com.ruby.pro203_exam.child.model.ChildPermissions;
import org.hibernate.boot.models.JpaAnnotations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChildPermissionsRepository extends JpaRepository<ChildPermissions, UUID> {
    Optional<ChildPermissions> findByChildId(UUID childId);

    boolean existsByChildId(UUID childId);

    void deleteByChildId(UUID childId);
}
