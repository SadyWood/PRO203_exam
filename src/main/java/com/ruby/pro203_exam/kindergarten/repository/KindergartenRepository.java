package com.ruby.pro203_exam.kindergarten.repository;


import com.ruby.pro203_exam.kindergarten.model.Kindergarten;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface KindergartenRepository extends JpaRepository<Kindergarten, UUID> {

    // Finds by name
    Optional<Kindergarten> findByName(String name);

    // Check if name exists - used for validation before creating
    boolean existsByName(String name);
}
