package com.ruby.pro203_exam.group.repository;

import com.ruby.pro203_exam.group.model.StaffGroupAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StaffGroupAssignmentRepository extends JpaRepository<StaffGroupAssignment, UUID> {
    List<StaffGroupAssignment> findByStaffId(UUID staffId);

    List<StaffGroupAssignment> findByGroupId(UUID groupId);

    boolean existsByStaffIdAndGroupId(UUID staffId, UUID groupId);

    Optional<StaffGroupAssignment> findByStaffIdAndGroupId(UUID staffId, UUID groupId);

    void deleteByStaffIdAndGroupId(UUID staffId, UUID groupId);

    List<StaffGroupAssignment> findByStaffIdAndIsResponsibleTrue(UUID staffId);
}
