package com.ruby.pro203_exam.auth.repository;

import com.ruby.pro203_exam.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository  extends JpaRepository<User, UUID> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Check if email exists
    boolean existsByEmail(String email);

    // Find by Open ID subject
    Optional<User> findByOpenIdSubject(String openIdSubject);

    // Find by profile ID - to get auth info when you have parent/staff UUID
    Optional<User> findByProfileID(UUID profileID);
}
