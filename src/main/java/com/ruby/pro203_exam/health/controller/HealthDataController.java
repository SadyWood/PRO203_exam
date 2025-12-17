package com.ruby.pro203_exam.health.controller;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.health.dto.CreateHealthDataDto;
import com.ruby.pro203_exam.health.dto.HealthDataResponseDto;
import com.ruby.pro203_exam.health.dto.UpdateHealthDataDto;
import com.ruby.pro203_exam.health.service.HealthDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/health-data")
@RequiredArgsConstructor
@Slf4j
public class HealthDataController {

    private final HealthDataService healthDataService;
    private final AuthorizationService authorizationService;
    private final SecurityUtils securityUtils;

    // Get health data for a child
    @GetMapping("/child/{childId}")
    public ResponseEntity<HealthDataResponseDto> getHealthData(@PathVariable UUID childId) {
        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canViewHealthData(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot view health data for this child");
        }

        return ResponseEntity.ok(healthDataService.getHealthDataByChild(childId));
    }

    // Create health data for a child
    @PostMapping("/child/{childId}")
    public ResponseEntity<HealthDataResponseDto> createHealthData(
            @PathVariable UUID childId,
            @RequestBody CreateHealthDataDto dto) {

        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canEditHealthData(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot create health data for this child");
        }

        return ResponseEntity.ok(healthDataService.createHealthData(childId, dto, user.getProfileId()));
    }

    // Update health data for a child
    @PutMapping("/child/{childId}")
    public ResponseEntity<HealthDataResponseDto> updateHealthData(
            @PathVariable UUID childId,
            @RequestBody UpdateHealthDataDto dto) {

        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canEditHealthData(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot update health data for this child");
        }

        return ResponseEntity.ok(healthDataService.updateHealthData(childId, dto, user.getProfileId()));
    }

    // Delete health data for a child
    @DeleteMapping("/child/{childId}")
    public ResponseEntity<Void> deleteHealthData(@PathVariable UUID childId) {
        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canEditHealthData(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot delete health data for this child");
        }

        healthDataService.deleteHealthData(childId);
        return ResponseEntity.noContent().build();
    }
}