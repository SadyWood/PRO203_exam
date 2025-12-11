package com.ruby.pro203_exam.child.controller;

import com.ruby.pro203_exam.child.dto.CreateParentChildDto;
import com.ruby.pro203_exam.child.dto.ParentChildDto;
import com.ruby.pro203_exam.child.service.ParentChildService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/relationships")
@RequiredArgsConstructor
@Slf4j
public class ParentChildController {
    private final ParentChildService parentChildService;

    @PostMapping
    public ResponseEntity<ParentChildDto> createStatus(@RequestBody CreateParentChildDto dto) {
        log.info("Creating new relationship status");
        return ResponseEntity.ok(parentChildService.createRelationship(dto));
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<ParentChildDto>> getRelatedToParent(@PathVariable UUID parentId) {
        log.info("Get related to parent relationship");
        return ResponseEntity.ok(parentChildService.getRelationshipsOfParent(parentId));

    }

    @GetMapping("/child/{childId}")
    public ResponseEntity<List<ParentChildDto>> getRelatedToChild(@PathVariable UUID childId) {
        log.info("Get related to child relationship");
        return ResponseEntity.ok(parentChildService.getRelationshipOfChild(childId));

    }

    @GetMapping("/{Id}")
    public ResponseEntity<ParentChildDto> getRelatedById(@PathVariable UUID Id) {
        log.info("Get specific relationship status.");
        return ResponseEntity.ok(parentChildService.getRelationshipById(Id));

    }

    @PutMapping("/{id}")
    public ResponseEntity<ParentChildDto> updateStatus(
            @PathVariable UUID id, @RequestBody CreateParentChildDto dto) {
        log.info("Updating relationship status");
        return ResponseEntity.ok(parentChildService.updateRelationshipStatus(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatus(@PathVariable UUID id) {
        log.info("Deleting relationship status: {}", id);
        parentChildService.deleteRelationshipById(id);
        return ResponseEntity.noContent().build();
    }
}
