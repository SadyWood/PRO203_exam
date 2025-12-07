package com.ruby.pro203_exam.staff.controller;

import com.ruby.pro203_exam.staff.dto.ResponseDto;
import com.ruby.pro203_exam.staff.service.StaffService;
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
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@Slf4j
public class StaffController {
    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<List<ResponseDto>> getAllStaff() {
        log.info("Get all staff");
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto> getStaffById(@PathVariable UUID id) {
        log.info("Get staff by id: {}", id);
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

}
