package com.ruby.pro203_exam.checker.controller;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.checker.dto.CheckInDto;
import com.ruby.pro203_exam.checker.dto.CheckOutDto;
import com.ruby.pro203_exam.checker.dto.CheckerResponseDto;
import com.ruby.pro203_exam.checker.service.CheckerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ruby.pro203_exam.auth.exception.AccessDeniedException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/checker")
@RequiredArgsConstructor
@Slf4j
public class CheckerController {
    private final CheckerService checkerService;
    private final AuthorizationService authService;
    private final SecurityUtils securityUtils;

    @PostMapping("/check-in")
    public ResponseEntity<CheckerResponseDto> checkIn(@RequestBody CheckInDto dto) {
        User user = securityUtils.getCurrentUser();

        // Parents can check in their own children, staff can check in any child
        if (!authService.canCheckIn(user.getId(), dto.getChildId())) {
            throw new AccessDeniedException("Cannot check in this child");
        }

        boolean isStaff = user.getRole() == UserRole.STAFF || user.getRole() == UserRole.BOSS;
        return ResponseEntity.ok(checkerService.checkIn(dto, user.getProfileId(), isStaff));
    }

    @PostMapping("/confirm/{checkInId}")
    public ResponseEntity<CheckerResponseDto> confirmCheckIn(@PathVariable UUID checkInId) {
        User user = securityUtils.getCurrentUser();

        // Only staff can confirm check-ins
        if (user.getRole() == UserRole.PARENT) {
            throw new AccessDeniedException("Only staff can confirm check-ins");
        }

        return ResponseEntity.ok(checkerService.confirmCheckIn(checkInId, user.getProfileId()));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<CheckerResponseDto>> getPendingConfirmations() {
        User user = securityUtils.getCurrentUser();

        // Only staff can see pending check-ins
        if (user.getRole() == UserRole.PARENT) {
            throw new AccessDeniedException("Only staff can view pending check-ins");
        }

        // Get kindergarten ID from staff profile
        UUID kindergartenId = authService.getStaffKindergartenId(user.getProfileId());
        return ResponseEntity.ok(checkerService.getPendingConfirmations(kindergartenId));
    }

    @PostMapping("/check-out")
    public ResponseEntity<CheckerResponseDto> checkOut(@RequestBody CheckOutDto dto) {
        User user = securityUtils.getCurrentUser();

        // Only staff can check out
        if (!authService.canCheckOut(user.getId(), dto.getChildId())) {
            throw new AccessDeniedException("Only staff can check out children");
        }

        return ResponseEntity.ok(checkerService.checkOut(dto, user.getProfileId()));
    }

    @GetMapping("/active")
    public ResponseEntity<List<CheckerResponseDto>> getActiveChecker() {
        User user = securityUtils.getCurrentUser();

        // Only staff can see all active check-ins
        if (user.getRole() == UserRole.PARENT) {
            throw new AccessDeniedException("Only staff can view all active check-ins");
        }

        log.info("Checked in children");
        return ResponseEntity.ok(checkerService.getActiveCheckins());
    }

    @GetMapping("/history/{childId}")
    public ResponseEntity<List<CheckerResponseDto>> getChildHistory(@PathVariable UUID childId) {
        User user = securityUtils.getCurrentUser();

        // Parents can only see their own children's history
        if (!authService.canViewChild(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot view history for this child");
        }

        log.info("History for child: {}", childId);
        return ResponseEntity.ok(checkerService.getChildHistory(childId));
    }

    @GetMapping("/status/{childId}")
    public ResponseEntity<CheckerResponseDto> getChildStatus(@PathVariable UUID childId) {
        User user = securityUtils.getCurrentUser();

        // Parents can only see their own children's status
        if (!authService.canViewChild(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot view status for this child");
        }

        log.info("Status for child: {}", childId);
        CheckerResponseDto status = checkerService.getActiveCheckIn(childId);
        return ResponseEntity.ok(status);
    }
}
