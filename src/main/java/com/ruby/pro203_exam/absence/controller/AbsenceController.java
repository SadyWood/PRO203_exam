package com.ruby.pro203_exam.absence.controller;

import com.ruby.pro203_exam.absence.dto.AbsenceResponseDto;
import com.ruby.pro203_exam.absence.dto.CreateAbsenceDto;
import com.ruby.pro203_exam.absence.service.AbsenceService;
import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.checker.model.PersonType;
import com.ruby.pro203_exam.child.repository.ChildRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/absences")
@RequiredArgsConstructor
@Slf4j
public class AbsenceController {

    private final AbsenceService absenceService;
    private final AuthorizationService authorizationService;
    private final SecurityUtils securityUtils;
    private final ChildRepository childRepository;

    // Report Absence for a child
    @PostMapping
    public ResponseEntity<AbsenceResponseDto> createAbsence(
            @RequestBody CreateAbsenceDto dto) {

        User user = securityUtils.getCurrentUser();

        // Check if user can view this child (parent of child or staff at kindergarten)
        if (!authorizationService.canViewChild(user.getId(), dto.getChildId())) {
            throw new AccessDeniedException("Cannot report absence for this child");
        }

        // Determine person type from role
        PersonType personType = (user.getRole() == UserRole.PARENT) ? PersonType.Parent : PersonType.Staff;

        return ResponseEntity.ok(absenceService.createAbsence(dto, user.getProfileId(), personType));
    }

    // Get absences for a child
    @GetMapping("/child/{childId}")
    public ResponseEntity<List<AbsenceResponseDto>> getAbsencesByChild(@PathVariable UUID childId) {
        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canViewChild(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot view absences for this child");
        }

        return ResponseEntity.ok(absenceService.getAbsencesByChild(childId));
    }

    // Get absence for a child with date range
    @GetMapping("/child/{childId}/range")
    public ResponseEntity<List<AbsenceResponseDto>> getAbsencesByChildAndRange(
            @PathVariable UUID childId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canViewChild(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot view absences for this child");
        }

        return ResponseEntity.ok(absenceService.getAbsencesByChildAndDateRange(childId, start, end));
    }

    // Approve absence
    @PostMapping("/{id}/approve")
    public ResponseEntity<AbsenceResponseDto> approveAbsence(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        // Only staff can approve
        if (user.getRole() == UserRole.PARENT) {
            throw new AccessDeniedException("Only staff can approve absences");
        }

        return ResponseEntity.ok(absenceService.approveAbsence(id, user.getProfileId()));
    }

    // Reject absence
    @PostMapping("/{id}/reject")
    public ResponseEntity<AbsenceResponseDto> rejectAbsence(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        // Only staff can reject
        if (user.getRole() == UserRole.PARENT) {
            throw new AccessDeniedException("Only staff can reject absences");
        }

        return ResponseEntity.ok(absenceService.rejectAbsence(id, user.getProfileId()));
    }

    // Delete an absence
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAbsence(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        // Only boss can delete absences
        if (user.getRole() != UserRole.BOSS) {
            throw new AccessDeniedException("Only boss can delete absences");
        }

        absenceService.deleteAbsence(id);
        return ResponseEntity.noContent().build();
    }
}
