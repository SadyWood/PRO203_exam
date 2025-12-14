package com.ruby.pro203_exam.absence.repository;

import com.ruby.pro203_exam.absence.model.Absence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, UUID> {

    List<Absence> findByChildId(UUID childId);

    List<Absence> findByChildIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            UUID childId, LocalDate endDate, LocalDate startDate);

    List<Absence> findByChildIdInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            List<UUID> childIds, LocalDate endDate, LocalDate startDate);

    boolean existsByChildIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            UUID childId, LocalDate date, LocalDate date2);
}