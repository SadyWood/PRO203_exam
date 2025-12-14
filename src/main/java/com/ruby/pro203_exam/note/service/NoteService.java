package com.ruby.pro203_exam.note.service;

import com.ruby.pro203_exam.checker.model.PersonType;
import com.ruby.pro203_exam.child.repository.ChildRepository;
import com.ruby.pro203_exam.note.dto.CreateNoteDto;
import com.ruby.pro203_exam.note.dto.NoteResponseDto;
import com.ruby.pro203_exam.note.model.Note;
import com.ruby.pro203_exam.note.repository.NoteRepository;
import com.ruby.pro203_exam.parent.repository.ParentRepository;
import com.ruby.pro203_exam.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class NoteService {

    private final NoteRepository noteRepository;
    private final ChildRepository childRepository;
    private final ParentRepository parentRepository;
    private final StaffRepository staffRepository;

    public NoteResponseDto createNote(CreateNoteDto dto, UUID createdBy, PersonType createdByType) {
        log.info("Creating note for child {} in kindergarten {}", dto.getChildId(), dto.getKindergartenId());

        // Parents can only create child-specific notes
        if (createdByType == PersonType.Parent && dto.getChildId() == null) {
            throw new RuntimeException("Parents can only create notes for specific children");
        }

        Note note = Note.builder()
                .childId(dto.getChildId())
                .kindergartenId(dto.getKindergartenId())
                .title(dto.getTitle())
                .content(dto.getContent())
                .noteDate(dto.getNoteDate() != null ? dto.getNoteDate() : LocalDate.now())
                .createdBy(createdBy)
                .createdByType(createdByType)
                .build();

        Note saved = noteRepository.save(note);
        return toResponseDto(saved);
    }

    public List<NoteResponseDto> getNotesByChild(UUID childId) {
        return noteRepository.findByChildId(childId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<NoteResponseDto> getKindergartenNotes(UUID kindergartenId) {
        return noteRepository.findByKindergartenIdAndChildIdIsNull(kindergartenId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<NoteResponseDto> getNotesByChildAndDateRange(UUID childId, LocalDate start, LocalDate end) {
        return noteRepository.findByChildIdAndNoteDateBetween(childId, start, end).stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<NoteResponseDto> getKindergartenNotesByDateRange(UUID kindergartenId, LocalDate start, LocalDate end) {
        return noteRepository.findByKindergartenIdAndChildIdIsNullAndNoteDateBetween(kindergartenId, start, end)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public void deleteNote(UUID noteId) {
        log.info("Deleting note {}", noteId);
        noteRepository.deleteById(noteId);
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //

    private NoteResponseDto toResponseDto(Note note) {
        String childName = null;
        if (note.getChildId() != null) {
            childName = childRepository.findById(note.getChildId())
                    .map(c -> c.getFirstName() + " " + c.getLastName())
                    .orElse(null);
        }

        String createdByName = getPersonName(note.getCreatedBy(), note.getCreatedByType());

        return NoteResponseDto.builder()
                .id(note.getId())
                .childId(note.getChildId())
                .childName(childName)
                .kindergartenId(note.getKindergartenId())
                .title(note.getTitle())
                .content(note.getContent())
                .noteDate(note.getNoteDate())
                .createdBy(note.getCreatedBy())
                .createdByName(createdByName)
                .createdByType(note.getCreatedByType())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }

    private String getPersonName(UUID personId, PersonType type) {
        if (type == PersonType.Parent) {
            return parentRepository.findById(personId)
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(null);
        } else {
            return staffRepository.findById(personId)
                    .map(s -> s.getFirstName() + " " + s.getLastName())
                    .orElse(null);
        }
    }
}
