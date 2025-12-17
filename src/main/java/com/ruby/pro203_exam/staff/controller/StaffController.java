package com.ruby.pro203_exam.staff.controller;

import com.ruby.pro203_exam.auth.exception.AccessDeniedException;
import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.staff.dto.ResponseDto;
import com.ruby.pro203_exam.staff.service.StaffService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@Slf4j
public class StaffController {
    private final StaffService staffService;
    private final AuthorizationService authService;
    private final SecurityUtils securityUtils;

    // Get all staff at the user's kindergarten
    @GetMapping
    public ResponseEntity<List<ResponseDto>> getAllStaff() {
        User user = securityUtils.getCurrentUser();

        // Only staff/boss can view staff list
        if (user.getRole() == UserRole.PARENT) {
            throw new AccessDeniedException("Parents cannot view staff list");
        }

        // Get staff's kindergarten and filter by it
        ResponseDto currentStaff = staffService.getStaffById(user.getProfileId());

        log.info("Get all staff for kindergarten: {}", currentStaff.getKindergartenId());
        return ResponseEntity.ok(staffService.getStaffByKindergarten(currentStaff.getKindergartenId()));
    }

    // Get Staff by their ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto> getStaffById(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        // Parents cannot view staff details
        if (user.getRole() == UserRole.PARENT) {
            throw new AccessDeniedException("Parents cannot view staff details");
        }

        // Staff can only view other staff from the same kindergarten
        ResponseDto currentStaff = staffService.getStaffById(user.getProfileId());
        ResponseDto targetStaff = staffService.getStaffById(id);

        if (!currentStaff.getKindergartenId().equals(targetStaff.getKindergartenId())) {
            throw new AccessDeniedException("Cannot view staff from other kindergartens");
        }

        log.info("Get staff by id: {}", id);
        return ResponseEntity.ok(targetStaff);
    }

    // Get staff at a kindergarten
    @GetMapping("/kindergarten/{kindergartenId}")
    public ResponseEntity<List<ResponseDto>> getStaffByKindergarten(@PathVariable UUID kindergartenId) {
        User user = securityUtils.getCurrentUser();

        // Only boss of this kindergarten can see all staff
        if (!authService.isBossAt(user.getId(), kindergartenId)) {
            throw new AccessDeniedException("Only boss can view all staff at kindergarten");
        }

        log.info("Get staff by kindergarten: {}", kindergartenId);
        return ResponseEntity.ok(staffService.getStaffByKindergarten(kindergartenId));
    }

    // Add admin privileges to staff
    @PostMapping("/{staffId}/promote")
    public ResponseEntity<Void> promoteToAdmin(@PathVariable UUID staffId) {
        User user = securityUtils.getCurrentUser();

        // Get staff's kindergarten to check authorization
        ResponseDto staff = staffService.getStaffById(staffId);

        if (!authService.canManageStaff(user.getId(), staff.getKindergartenId())) {
            throw new AccessDeniedException("Only boss can promote staff");
        }

        staffService.promoteToAdmin(staffId);
        log.info("Promoted staff {} to admin", staffId);
        return ResponseEntity.ok().build();
    }

    // Remove admin privileges from staff
    @PostMapping("/{staffId}/demote")
    public ResponseEntity<Void> demoteFromAdmin(@PathVariable UUID staffId) {
        User user = securityUtils.getCurrentUser();

        ResponseDto staff = staffService.getStaffById(staffId);

        if (!authService.canManageStaff(user.getId(), staff.getKindergartenId())) {
            throw new AccessDeniedException("Only boss can demote staff");
        }

        staffService.demoteFromAdmin(staffId);
        log.info("Demoted staff {} from admin", staffId);
        return ResponseEntity.ok().build();
    }
}
