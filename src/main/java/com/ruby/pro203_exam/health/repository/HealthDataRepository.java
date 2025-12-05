package com.ruby.pro203_exam.health.repository;

import com.ruby.pro203_exam.health.model.HealthData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HealthDataRepository extends JpaRepository<HealthData, UUID> {

    // Find health data by child ID - one to one
    Optional<HealthData> findByChildId(UUID childId);

    // Check if health data exists for child
    boolean existsByChildId(UUID childId);

    // Delete health data for child - GDPR deletion
    void deleteByChildId(UUID childId);
}
