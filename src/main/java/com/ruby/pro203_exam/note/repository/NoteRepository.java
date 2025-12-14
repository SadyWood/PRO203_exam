package com.ruby.pro203_exam.note.repository;

import com.ruby.pro203_exam.note.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {

    List<Note> findByChildId(UUID childId);

    List<Note> findByKindergartenIdAndChildIdIsNull(UUID kindergartenId);

    List<Note> findByChildIdAndNoteDateBetween(UUID childId, LocalDate start, LocalDate end);

    List<Note> findByKindergartenIdAndChildIdIsNullAndNoteDateBetween(
            UUID kindergartenId, LocalDate start, LocalDate end);
}