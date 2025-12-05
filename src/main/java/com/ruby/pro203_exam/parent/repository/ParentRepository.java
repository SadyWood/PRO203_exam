package com.ruby.pro203_exam.parent.repository;

import com.ruby.pro203_exam.parent.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParentRepository extends JpaRepository<Parent, UUID> {

    Optional<Parent> findByEmail(String email);

    boolean existsByEmail(String email);
}
