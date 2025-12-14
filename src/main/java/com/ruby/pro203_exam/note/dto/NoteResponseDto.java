package com.ruby.pro203_exam.note.dto;

import com.ruby.pro203_exam.checker.model.PersonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteResponseDto {
    private UUID id;
    private UUID childId;
    private String childName;
    private UUID kindergartenId;
    private String title;
    private String content;
    private LocalDate noteDate;
    private UUID createdBy;
    private String createdByName;
    private PersonType createdByType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}