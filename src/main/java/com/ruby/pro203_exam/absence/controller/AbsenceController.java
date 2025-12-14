package com.ruby.pro203_exam.absence.controller;

import com.ruby.pro203_exam.absence.dto.AbsenceResponseDto;
import com.ruby.pro203_exam.absence.dto.CreateAbsenceDto;
import com.ruby.pro203_exam.absence.service.AbsenceService;
import com.ruby.pro203_exam.checker.model.PersonType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<AbsenceResponseDto> createAbsence(
            @RequestBody CreateAbsenceDto dto,
            @RequestParam UUID reportedBy,
            @RequestParam PersonType reportedByType) {
        // TODO: Get reportedBy from JWT token
        return ResponseEntity.ok(absenceService.createAbsence(dto, reportedBy, reportedByType));
    }

    @GetMapping("/child/{childId}")
    public ResponseEntity<List<AbsenceResponseDto>> getAbsencesByChild(@PathVariable UUID childId) {
        return ResponseEntity.ok(absenceService.getAbsencesByChild(childId));
    }

    @GetMapping("/child/{childId}/range")
    public ResponseEntity<List<AbsenceResponseDto>> getAbsencesByChildAndRange(
            @PathVariable UUID childId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(absenceService.getAbsencesByChildAndDateRange(childId, start, end));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<AbsenceResponseDto> approveAbsence(
            @PathVariable UUID id,
            @RequestParam UUID staffId) {
        // TODO: Get staffId from JWT token
        return ResponseEntity.ok(absenceService.approveAbsence(id, staffId));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<AbsenceResponseDto> rejectAbsence(
            @PathVariable UUID id,
            @RequestParam UUID staffId) {
        // TODO: Get staffId from JWT token
        return ResponseEntity.ok(absenceService.rejectAbsence(id, staffId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAbsence(@PathVariable UUID id) {
        // TODO: Authorization check
        absenceService.deleteAbsence(id);
        return ResponseEntity.noContent().build();
    }
}
