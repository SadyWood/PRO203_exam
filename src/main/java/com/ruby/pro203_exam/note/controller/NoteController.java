package com.ruby.pro203_exam.note.controller;

import com.ruby.pro203_exam.checker.model.PersonType;
import com.ruby.pro203_exam.note.dto.CreateNoteDto;
import com.ruby.pro203_exam.note.dto.NoteResponseDto;
import com.ruby.pro203_exam.note.service.NoteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<NoteResponseDto> createNote(
            @RequestBody CreateNoteDto dto,
            @RequestParam UUID createdBy,
            @RequestParam PersonType createdByType) {
        // TODO: Get createdBy from JWT token
        return ResponseEntity.ok(noteService.createNote(dto, createdBy, createdByType));
    }

    @GetMapping("/child/{childId}")
    public ResponseEntity<List<NoteResponseDto>> getNotesByChild(@PathVariable UUID childId) {
        return ResponseEntity.ok(noteService.getNotesByChild(childId));
    }

    @GetMapping("/child/{childId}/range")
    public ResponseEntity<List<NoteResponseDto>> getNotesByChildAndRange(
            @PathVariable UUID childId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(noteService.getNotesByChildAndDateRange(childId, start, end));
    }

    @GetMapping("/kindergarten/{kindergartenId}")
    public ResponseEntity<List<NoteResponseDto>> getKindergartenNotes(@PathVariable UUID kindergartenId) {
        return ResponseEntity.ok(noteService.getKindergartenNotes(kindergartenId));
    }

    @GetMapping("/kindergarten/{kindergartenId}/range")
    public ResponseEntity<List<NoteResponseDto>> getKindergartenNotesByRange(
            @PathVariable UUID kindergartenId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(noteService.getKindergartenNotesByDateRange(kindergartenId, start, end));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable UUID id) {
        // TODO: Authorization check
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
}
