package com.ruby.pro203_exam.calendar.controller;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.calendar.dto.CalendarEventResponseDto;
import com.ruby.pro203_exam.calendar.dto.CreateCalendarEventDto;
import com.ruby.pro203_exam.calendar.service.CalendarEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import com.ruby.pro203_exam.auth.exception.AccessDeniedException;
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
    private final AuthorizationService authorizationService;
    private final SecurityUtils securityUtils;

    // Create an event
    @PostMapping
    public ResponseEntity<CalendarEventResponseDto> createEvent(@RequestBody CreateCalendarEventDto dto) {
        User user = securityUtils.getCurrentUser();

        // Only privileged staff can create events
        if (!authorizationService.isPrivilegedAt(user.getId(), dto.getKindergartenId())) {
            throw new AccessDeniedException("Only privileged staff can create events");
        }

        return ResponseEntity.ok(eventService.createEvent(dto, user.getProfileId()));
    }

    // Find events by kindergarten
    @GetMapping("/kindergarten/{kindergartenId}")
    public ResponseEntity<List<CalendarEventResponseDto>> getEventsByKindergarten(
            @PathVariable UUID kindergartenId) {

        // All authenticated users can view events (filtering happens elsewhere for parents)
        return ResponseEntity.ok(eventService.getEventsByKindergarten(kindergartenId));
    }

    // Find events by kindergarten and range
    @GetMapping("/kindergarten/{kindergartenId}/range")
    public ResponseEntity<List<CalendarEventResponseDto>> getEventsByKindergartenAndRange(
            @PathVariable UUID kindergartenId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        return ResponseEntity.ok(eventService.getEventsByKindergartenAndDateRange(kindergartenId, start, end));
    }

    // Delete an event for kindergarten
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        // Only boss can delete events
        if (user.getRole() != UserRole.BOSS && user.getRole() != UserRole.STAFF) {
            throw new AccessDeniedException("Only boss/staff can delete events");
        }

        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
