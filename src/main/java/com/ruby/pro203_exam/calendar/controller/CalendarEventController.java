package com.ruby.pro203_exam.calendar.controller;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.calendar.dto.CalendarEventResponseDto;
import com.ruby.pro203_exam.calendar.dto.CreateCalendarEventDto;
import com.ruby.pro203_exam.calendar.dto.UpdateCalendarEventDto;
import com.ruby.pro203_exam.calendar.service.CalendarEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import com.ruby.pro203_exam.auth.exception.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import com.ruby.pro203_exam.child.model.Child;
import com.ruby.pro203_exam.child.repository.ChildRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@Slf4j
public class CalendarEventController {
    private final CalendarEventService eventService;
    private final AuthorizationService authorizationService;
    private final SecurityUtils securityUtils;
    private final ChildRepository childRepository;

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

    // Get a single event by ID
    @GetMapping("/{id}")
    public ResponseEntity<CalendarEventResponseDto> getEventById(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // Update an event - privileged staff only
    @PutMapping("/{id}")
    public ResponseEntity<CalendarEventResponseDto> updateEvent(
            @PathVariable UUID id,
            @RequestBody UpdateCalendarEventDto dto) {
        User user = securityUtils.getCurrentUser();

        // Only boss/staff can update events (more specific auth would check kindergarten)
        if (user.getRole() != UserRole.BOSS && user.getRole() != UserRole.STAFF) {
            throw new AccessDeniedException("Only boss/staff can update events");
        }

        return ResponseEntity.ok(eventService.updateEvent(id, dto));
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

// Get events for a parent - returns kindergarten-wide events plus events for groups their children belong to.
    @GetMapping("/parent/{kindergartenId}/range")
    public ResponseEntity<List<CalendarEventResponseDto>> getEventsForParent(
            @PathVariable UUID kindergartenId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        User user = securityUtils.getCurrentUser();

        // Must be a parent
        if (user.getRole() != UserRole.PARENT) {
            throw new AccessDeniedException("Only parents can access this endpoint");
        }

        // Get the parent's children's group IDs
        List<UUID> childGroupIds = childRepository.findByParentId(user.getProfileId())
                .stream()
                .map(Child::getGroupId)
                .filter(groupId -> groupId != null)
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(eventService.getEventsForParent(kindergartenId, childGroupIds, start, end));
    }
}
