package com.ruby.pro203_exam.kindergarten.controller;

// Rest Controller for Kindergarten endpoints

import com.ruby.pro203_exam.kindergarten.dto.KindergartenResponseDto;
import com.ruby.pro203_exam.kindergarten.dto.UpdateKindergartenDto;
import com.ruby.pro203_exam.kindergarten.service.KindergartenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kindergartens")
@RequiredArgsConstructor
@Slf4j
public class KindergartenController {
    private final KindergartenService kindergartenService;

    // Get all kindergartens
    @GetMapping
    public ResponseEntity<List<KindergartenResponseDto>> getAllKindergarten() {
        return ResponseEntity.ok(kindergartenService.getAllKindergartens());
    }

    // Get one kindergarten by id
    @GetMapping("/{id}")
    public ResponseEntity<KindergartenResponseDto> getKindergartenById(@PathVariable UUID id) {
        return ResponseEntity.ok(kindergartenService.getKindergartenById(id));
    }

    // Update kindergarten
    @PutMapping("/{id}")
    public ResponseEntity<KindergartenResponseDto> updateKindergarten(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateKindergartenDto dto) {
        return ResponseEntity.ok(kindergartenService.updateKindergarten(id, dto));
    }

    // Delete kindergarten
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKindergarten(@PathVariable UUID id) {
        kindergartenService.deleteKindergarten(id);
        return ResponseEntity.noContent().build();
    }
}
