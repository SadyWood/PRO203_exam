package com.ruby.pro203_exam.note.controller;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.checker.model.PersonType;
import com.ruby.pro203_exam.note.dto.CreateNoteDto;
import com.ruby.pro203_exam.note.dto.NoteResponseDto;
import com.ruby.pro203_exam.note.service.NoteService;
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
@RequestMapping("/api/notes")
@RequiredArgsConstructor
@Slf4j
public class NoteController {
    private final NoteService noteService;
    private final AuthorizationService authorizationService;
    private final SecurityUtils securityUtils;

    // Create a note
    @PostMapping
    public ResponseEntity<NoteResponseDto> createNote(@RequestBody CreateNoteDto dto) {
        User user = securityUtils.getCurrentUser();

        // Parents can only create notes for their own children
        if (user.getRole() == UserRole.PARENT) {
            if (dto.getChildId() == null) {
                throw new AccessDeniedException("Parents can only create notes for specific children");
            }
            if (!authorizationService.canViewChild(user.getId(), dto.getChildId())) {
                throw new AccessDeniedException("Cannot create note for this child");
            }
        } else {
            // Staff must be at the kindergarten
            if (!authorizationService.isStaffAt(user.getId(), dto.getKindergartenId())) {
                throw new AccessDeniedException("Cannot create notes for this kindergarten");
            }
        }

        PersonType personType = (user.getRole() == UserRole.PARENT) ? PersonType.Parent : PersonType.Staff;

        return ResponseEntity.ok(noteService.createNote(dto, user.getProfileId(), personType));
    }

    // Get notes for a child
    @GetMapping("/child/{childId}")
    public ResponseEntity<List<NoteResponseDto>> getNotesByChild(@PathVariable UUID childId) {
        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canViewChild(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot view notes for this child");
        }

        return ResponseEntity.ok(noteService.getNotesByChild(childId));
    }

    // Get notes for a child with date range
    @GetMapping("/child/{childId}/range")
    public ResponseEntity<List<NoteResponseDto>> getNotesByChildAndRange(
            @PathVariable UUID childId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        User user = securityUtils.getCurrentUser();

        if (!authorizationService.canViewChild(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot view notes for this child");
        }

        return ResponseEntity.ok(noteService.getNotesByChildAndDateRange(childId, start, end));
    }

    // View notes for a kindergarten
    @GetMapping("/kindergarten/{kindergartenId}")
    public ResponseEntity<List<NoteResponseDto>> getKindergartenNotes(@PathVariable UUID kindergartenId) {
        User user = securityUtils.getCurrentUser();

        // Staff or parents with children at this kindergarten can view
        // For simplicity, we allow all authenticated users to view kindergarten notes
        return ResponseEntity.ok(noteService.getKindergartenNotes(kindergartenId));
    }

    // View notes for a kindergarten with date range
    @GetMapping("/kindergarten/{kindergartenId}/range")
    public ResponseEntity<List<NoteResponseDto>> getKindergartenNotesByRange(
            @PathVariable UUID kindergartenId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        return ResponseEntity.ok(noteService.getKindergartenNotesByDateRange(kindergartenId, start, end));
    }

    // Delete a note
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();

        // Only boss can delete notes
        if (user.getRole() != UserRole.BOSS) {
            throw new AccessDeniedException("Only boss can delete notes");
        }

        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
}
