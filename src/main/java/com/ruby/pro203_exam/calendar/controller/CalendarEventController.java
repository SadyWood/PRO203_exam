package com.ruby.pro203_exam.calendar.controller;

import com.ruby.pro203_exam.calendar.dto.CalendarEventResponseDto;
import com.ruby.pro203_exam.calendar.dto.CreateCalendarEventDto;
import com.ruby.pro203_exam.calendar.service.CalendarEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@Slf4j
public class CalendarEventController {
    private final CalendarEventService eventService;

    @PostMapping
    public ResponseEntity<CalendarEventResponseDto> createEvent(
            @RequestBody CreateCalendarEventDto dto,
            @RequestParam UUID createdBy) {
        // TODO: Get createdBy from JWT token, verify is staff
        return ResponseEntity.ok(eventService.createEvent(dto, createdBy));
    }

    @GetMapping("/kindergarten/{kindergartenId}")
    public ResponseEntity<List<CalendarEventResponseDto>> getEventsByKindergarten(
            @PathVariable UUID kindergartenId) {
        return ResponseEntity.ok(eventService.getEventsByKindergarten(kindergartenId));
    }

    @GetMapping("/kindergarten/{kindergartenId}/range")
    public ResponseEntity<List<CalendarEventResponseDto>> getEventsByKindergartenAndRange(
            @PathVariable UUID kindergartenId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(eventService.getEventsByKindergartenAndDateRange(kindergartenId, start, end));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        // TODO: Authorization check - staff only
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
