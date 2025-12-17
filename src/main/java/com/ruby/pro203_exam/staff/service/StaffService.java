package com.ruby.pro203_exam.staff.service;

import com.ruby.pro203_exam.staff.dto.ResponseDto;
import com.ruby.pro203_exam.staff.model.Staff;
import com.ruby.pro203_exam.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class StaffService {
    private final StaffRepository staffRepository;

    public List<ResponseDto> getAllStaff() {
        log.info("Get all staff");
        return StreamSupport.stream(staffRepository.findAll().spliterator(), false)
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public ResponseDto getStaffById(UUID id){
        log.info("Get staff by id: {}", id);
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No staff found with id: " + id));
        return toResponseDto(staff);
    }

    public List<ResponseDto> getStaffByKindergarten(UUID kindergartenId) {
        log.info("Get staff by kindergarten: {}", kindergartenId);
        return staffRepository.findByKindergartenId(kindergartenId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public void promoteToAdmin(UUID staffId) {
        log.info("Promoting staff {} to admin", staffId);
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId));
        staff.setIsAdmin(true);
        staffRepository.save(staff);
    }

    public void demoteFromAdmin(UUID staffId) {
        log.info("Demoting staff {} from admin", staffId);
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId));
        staff.setIsAdmin(false);
        staffRepository.save(staff);
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //
    private ResponseDto toResponseDto(Staff staff) {
        return ResponseDto.builder()
                .id(staff.getId())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .email(staff.getEmail())
                .employeeId(staff.getEmployeeId())
                .phoneNr(staff.getPhoneNumber())
                .position(staff.getPosition())
                .kindergartenId(staff.getKindergartenId())
                .isAdmin(staff.getIsAdmin())
                .build();
    }
}
