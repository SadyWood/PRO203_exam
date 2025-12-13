package com.ruby.pro203_exam.parent.controller;

import com.ruby.pro203_exam.parent.dto.ParentProfileResponseDto;
import com.ruby.pro203_exam.parent.dto.ParentResponseDto;
import com.ruby.pro203_exam.parent.service.ParentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
@Slf4j
public class ParentController {
    private final ParentService parentService;

    // All parents
    @GetMapping
    public ResponseEntity<List<ParentResponseDto>> GEtAllParents() {
        log.info("GET /api/parents");
        return ResponseEntity.ok(parentService.getAllParents());
    }

    // Get one parent
    @GetMapping("/{id}")
    public ResponseEntity<ParentResponseDto> getParentById(@PathVariable UUID id) {
        log.info("GET /api/parents/{}", id);
        return ResponseEntity.ok(parentService.getParentById(id));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<ParentProfileResponseDto> getParentProfile(@PathVariable UUID id) {
        log.info("GET /api/parents/{}/profile", id);
        return ResponseEntity.ok(parentService.getParentProfile(id));
    }
}
