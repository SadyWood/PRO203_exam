package com.ruby.pro203_exam.note.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateNoteDto {
    private UUID childId;  // NULL for kindergarten-wide
    private UUID kindergartenId;
    private String title;
    private String content;
    private LocalDate noteDate;
}