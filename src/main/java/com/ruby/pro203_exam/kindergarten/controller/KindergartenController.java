package com.ruby.pro203_exam.kindergarten.controller;

// Rest Controller for Kindergarten endpoints

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.kindergarten.dto.KindergartenResponseDto;
import com.ruby.pro203_exam.kindergarten.dto.UpdateKindergartenDto;
import com.ruby.pro203_exam.kindergarten.service.KindergartenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kindergartens")
@RequiredArgsConstructor
@Slf4j
public class KindergartenController {
    private final KindergartenService kindergartenService;
    private final AuthorizationService authorizationService;
    private final SecurityUtils securityUtils;

    // Get all kindergartens
    @GetMapping
    public ResponseEntity<List<KindergartenResponseDto>> getAllKindergartens() {
        // All authenticated users can see kindergartens
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

        User user = securityUtils.getCurrentUser();

        // Only boss of the kindergarten can update it
        if (!authorizationService.canEditKindergarten(user.getId(), id)) {
            throw new AccessDeniedException("Only boss can edit kindergarten settings");
        }

        return ResponseEntity.ok(kindergartenService.updateKindergarten(id, dto));
    }
    // Delete kindergarten
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKindergarten(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        // Only boss of the kindergarten can delete it
        if (!authorizationService.canEditKindergarten(user.getId(), id)) {
            throw new AccessDeniedException("Only boss can delete kindergarten");
        }

        kindergartenService.deleteKindergarten(id);
        return ResponseEntity.noContent().build();
    }
}
