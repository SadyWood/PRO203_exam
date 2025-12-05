package com.ruby.pro203_exam.staff.repository;

import com.ruby.pro203_exam.staff.model.Staff;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StaffRepository extends CrudRepository<Staff, UUID> {

    // Find staff by email
    Optional<Staff> findByEmail(String email);

    // Find by employee ID
    Optional<Staff> findByEmployeeId(String employeeID);

    // Check if employee id exists
    boolean existsByEmployeeId(String employeeID);
}
