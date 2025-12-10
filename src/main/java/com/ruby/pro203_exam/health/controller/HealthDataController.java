package com.ruby.pro203_exam.health.controller;

import com.ruby.pro203_exam.health.dto.CreateHealthDataDto;
import com.ruby.pro203_exam.health.dto.HealthDataResponseDto;
import com.ruby.pro203_exam.health.dto.UpdateHealthDataDto;
import com.ruby.pro203_exam.health.service.HealthDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/health-data")
@RequiredArgsConstructor
@Slf4j
public class HealthDataController {

    private final HealthDataService healthDataService;

    @GetMapping("/child/{childId}")
    public ResponseEntity<HealthDataResponseDto> getHealthData(@PathVariable UUID childId) {
        // TODO: Add authorization - canViewHealthData
        return ResponseEntity.ok(healthDataService.getHealthDataByChild(childId));
    }

    @PostMapping("/child/{childId}")
    public ResponseEntity<HealthDataResponseDto> createHealthData(
            @PathVariable UUID childId,
            @RequestBody CreateHealthDataDto dto) {
        // TODO: Add authorization - canEditHealthData (Parent own child or BOSS)
        return ResponseEntity.ok(healthDataService.createHealthData(childId, dto));
    }

    @PutMapping("/child/{childId}")
    public ResponseEntity<HealthDataResponseDto> updateHealthData(
            @PathVariable UUID childId,
            @RequestBody UpdateHealthDataDto dto) {
        // TODO: Add authorization - canEditHealthData (Parent own child or BOSS)
        return ResponseEntity.ok(healthDataService.updateHealthData(childId, dto));
    }

    @DeleteMapping("/child/{childId}")
    public ResponseEntity<Void> deleteHealthData(@PathVariable UUID childId) {
        // TODO: Add authorization - BOSS only
        healthDataService.deleteHealthData(childId);
        return ResponseEntity.noContent().build();
    }
}