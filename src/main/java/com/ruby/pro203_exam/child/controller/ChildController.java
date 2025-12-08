package com.ruby.pro203_exam.child.controller;

import com.ruby.pro203_exam.child.dto.ChildResponseDto;
import com.ruby.pro203_exam.child.dto.CreateChildDto;
import com.ruby.pro203_exam.child.dto.UpdateChildDto;
import com.ruby.pro203_exam.child.service.ChildService;
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

    // Get all children - STAFF ONLY
    @GetMapping
    public ResponseEntity<List<ChildResponseDto>> getAllChildren() {
        return ResponseEntity.ok(childService.getAllChildren());
    }

    // Get one child
    @GetMapping("/{id}")
    public ResponseEntity<ChildResponseDto> getChildById(@PathVariable UUID id) {
        return ResponseEntity.ok(childService.getChildById(id));
    }

    // Get children by parent
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<ChildResponseDto>> getChildrenByParent(@PathVariable UUID parentId) {
        return ResponseEntity.ok(childService.getChildrenByParent(parentId));
    }

    // Get children by kindergarten
    @GetMapping("/kindergarten/{kindergartenId}")
    public ResponseEntity<List<ChildResponseDto>> getChildrenByKindergarten(@PathVariable UUID kindergartenId) {
        return ResponseEntity.ok(childService.getChildrenByKindergarten(kindergartenId));
    }

    // Create child - parent adds their child - TODO: Get parentId from JWT token instead of request parameter
    @PostMapping
    public ResponseEntity<ChildResponseDto> createChild(
            @Valid @RequestBody CreateChildDto dto,
            @RequestParam UUID parentId) { // TODO: Get from JWT
        ChildResponseDto created = childService.createChild(dto, parentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Update child
    @PutMapping("/{id}")
    public ResponseEntity<ChildResponseDto> updateChild(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateChildDto dto) {
        return ResponseEntity.ok(childService.updateChild(id, dto));
    }

    // Delete child
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChild(@PathVariable UUID id) {
        log.info("DELETE /api/children/{}", id);
        childService.deleteChild(id);
        return ResponseEntity.noContent().build();
    }
}
