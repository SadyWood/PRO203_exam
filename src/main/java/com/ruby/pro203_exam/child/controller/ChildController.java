package com.ruby.pro203_exam.child.controller;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.child.dto.ChildResponseDto;
import com.ruby.pro203_exam.child.dto.CreateChildDto;
import com.ruby.pro203_exam.child.dto.UpdateChildDto;
import com.ruby.pro203_exam.child.service.ChildService;
import com.ruby.pro203_exam.staff.model.Staff;
import com.ruby.pro203_exam.staff.repository.StaffRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

// Rest Controller for child endpoints
@RestController
@RequestMapping("/api/children")
@RequiredArgsConstructor
@Slf4j
public class ChildController {

    private final ChildService childService;
    private final AuthorizationService authorizationService;
    private final SecurityUtils securityUtils;
    private final StaffRepository staffRepository;

    // Get all children - filtered by role
    @GetMapping
    public ResponseEntity<List<ChildResponseDto>> getAllChildren() {
        User user = securityUtils.getCurrentUser();

        // Parents see only their children
        if (user.getRole() == UserRole.PARENT) {
            return ResponseEntity.ok(childService.getChildrenByParent(user.getProfileId()));
        }

        // Staff and Boss see only children in their kindergarten
        if (user.getRole() == UserRole.STAFF || user.getRole() == UserRole.BOSS) {
            Staff staff = staffRepository.findById(user.getProfileId())
                    .orElseThrow(() -> new RuntimeException("Staff profile not found"));
            return ResponseEntity.ok(childService.getChildrenByKindergarten(staff.getKindergartenId()));
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Get one child
    @GetMapping("/{id}")
    public ResponseEntity<ChildResponseDto> getChildById(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canViewChild(user.getId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(childService.getChildById(id));
    }

    // Get children by parent - staff can look up which children belong to a parent
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<ChildResponseDto>> getChildrenByParent(@PathVariable UUID parentId) {
        User user = securityUtils.getCurrentUser();

        // Only staff/boss can use this endpoint to look up children by parent
        if (user.getRole() != UserRole.STAFF && user.getRole() != UserRole.BOSS) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Get staff's kindergarten to filter results
        Staff staff = staffRepository.findById(user.getProfileId())
                .orElseThrow(() -> new RuntimeException("Staff profile not found"));

        // Get children and filter to only those in staff's kindergarten
        List<ChildResponseDto> children = childService.getChildrenByParent(parentId).stream()
                .filter(child -> staff.getKindergartenId().equals(child.getKindergartenId()))
                .toList();

        return ResponseEntity.ok(children);
    }

    // Get children by kindergarten - only accessible by staff at that kindergarten
    @GetMapping("/kindergarten/{kindergartenId}")
    public ResponseEntity<List<ChildResponseDto>> getChildrenByKindergarten(@PathVariable UUID kindergartenId) {
        User user = securityUtils.getCurrentUser();

        // Only staff/boss at this kindergarten can view
        if (!authorizationService.isStaffAt(user.getId(), kindergartenId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(childService.getChildrenByKindergarten(kindergartenId));
    }

    // Create child - parent adds their child
    @PostMapping
    public ResponseEntity<ChildResponseDto> createChild(@Valid @RequestBody CreateChildDto dto) {
        User user = securityUtils.getCurrentUser();

        // Check if user can add a child to this kindergarten
        if (!authorizationService.canAddChild(user.getId(), dto.getKindergartenId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Use the parent's profile ID from JWT
        ChildResponseDto created = childService.createChild(dto, user.getProfileId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Update child
    @PutMapping("/{id}")
    public ResponseEntity<ChildResponseDto> updateChild(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateChildDto dto) {
        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canEditChild(user.getId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(childService.updateChild(id, dto));
    }

    // Delete child - only privileged staff (boss or admin staff) at the kindergarten
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChild(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canEditChild(user.getId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        log.info("DELETE /api/children/{}", id);
        childService.deleteChild(id);
        return ResponseEntity.noContent().build();
    }
}
