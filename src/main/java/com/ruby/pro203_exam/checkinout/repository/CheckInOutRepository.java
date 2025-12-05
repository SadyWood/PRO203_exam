package com.ruby.pro203_exam.checkinout.repository;

import com.ruby.pro203_exam.checkinout.model.CheckInOut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CheckInOutRepository extends JpaRepository<CheckInOut, UUID> {

    // Find active check-in - if no checkout time then child is currently in kindergarten
    Optional<CheckInOut> findByChildIdAndCheckOutTimeIsNull(UUID childId);

    // Find all check-ins for a child, newest first
    List<CheckInOut> findByChildIdOrderByCheckInTimeDesc(UUID childId);

    // Find check-ins within date range - used for reports and statistics
    List<CheckInOut> findByCheckInTimeBetween(LocalDateTime start, LocalDateTime end);

    // Find all currently checked-in children
    List<CheckInOut> findByCheckOutTimeIsNull();

    // Find check-ins by staff member - audit trail of staff actions
    @Query("SELECT c FROM CheckInOut c " +
            "WHERE c.checkInConfirmedByStaff = :staffId " +
            "OR c.checkOutApprovedByStaff = :staffId")
    List<CheckInOut> findByStaffMember(@Param("staffId") UUID staffId);
}
