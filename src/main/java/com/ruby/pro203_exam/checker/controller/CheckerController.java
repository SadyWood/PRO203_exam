package com.ruby.pro203_exam.checker.controller;

import com.ruby.pro203_exam.checker.dto.CheckInDto;
import com.ruby.pro203_exam.checker.dto.CheckOutDto;
import com.ruby.pro203_exam.checker.dto.CheckerResponseDto;
import com.ruby.pro203_exam.checker.service.CheckerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/checker")
@RequiredArgsConstructor
@Slf4j
public class CheckerController {
    private final CheckerService checkerService;

    @PostMapping("/checkin")
    public ResponseEntity<CheckerResponseDto> checkin(@RequestBody CheckInDto checker) {
        log.info("Checkin for child: {}", checker.getChildId());
        return ResponseEntity.ok(checkerService.checkIn(checker));
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckerResponseDto> checkout(@RequestBody CheckOutDto checker) {
        log.info("Checkout for child: {}", checker.getChildId());
        return ResponseEntity.ok(checkerService.checkOut(checker));
    }

    @GetMapping("/active")
    public ResponseEntity<List<CheckerResponseDto>> getActiveChecker() {
        log.info("Checked in children");
        return ResponseEntity.ok(checkerService.getActiveCheckins());
    }

    @GetMapping("/history/{childId}")
    public ResponseEntity<List<CheckerResponseDto>> getChildHistory(@PathVariable UUID childId) {
        log.info("History for child: {}", childId);
        return ResponseEntity.ok(checkerService.getChildHistory(childId));
    }

}
