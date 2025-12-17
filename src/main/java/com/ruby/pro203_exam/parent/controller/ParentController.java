package com.ruby.pro203_exam.parent.controller;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.parent.dto.ParentProfileResponseDto;
import com.ruby.pro203_exam.parent.dto.ParentResponseDto;
import com.ruby.pro203_exam.parent.service.ParentService;
import com.ruby.pro203_exam.staff.model.Staff;
import com.ruby.pro203_exam.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
@Slf4j
public class ParentController {
    private final ParentService parentService;
    private final SecurityUtils securityUtils;
    private final StaffRepository staffRepository;

    @GetMapping
    public ResponseEntity<List<ParentResponseDto>> getAllParents() {
        User user = securityUtils.getCurrentUser();

        // Parents cannot view other parents
        if (user.getRole() == UserRole.PARENT) {
            throw new AccessDeniedException("Parents cannot view other parents");
        }

        // Staff can only see parents from their own kindergarten
        Staff staff = staffRepository.findById(user.getProfileId())
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));

        return ResponseEntity.ok(parentService.getParentsByKindergarten(staff.getKindergartenId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParentResponseDto> getParentById(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        // Parents can only view themselves
        if (user.getRole() == UserRole.PARENT) {
            if (!user.getProfileId().equals(id)) {
                throw new AccessDeniedException("Cannot view other parents");
            }
        } else {
            // Staff can only view parents from their kindergarten
            if (!isParentInStaffKindergarten(user.getProfileId(), id)) {
                throw new AccessDeniedException("Cannot view parents from other kindergartens");
            }
        }

        return ResponseEntity.ok(parentService.getParentById(id));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<ParentProfileResponseDto> getParentProfile(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        // Parents can only view their own profile
        if (user.getRole() == UserRole.PARENT) {
            if (!user.getProfileId().equals(id)) {
                throw new AccessDeniedException("Cannot view other parent profiles");
            }
        } else {
            // Staff can only view parents from their kindergarten
            if (!isParentInStaffKindergarten(user.getProfileId(), id)) {
                throw new AccessDeniedException("Cannot view parent profiles from other kindergartens");
            }
        }

        return ResponseEntity.ok(parentService.getParentProfile(id));
    }

    // Check if a parent has children in the staff's kindergarten
    private boolean isParentInStaffKindergarten(UUID staffProfileId, UUID parentId) {
        Staff staff = staffRepository.findById(staffProfileId)
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));

        return parentService.isParentInKindergarten(parentId, staff.getKindergartenId());
    }
}
