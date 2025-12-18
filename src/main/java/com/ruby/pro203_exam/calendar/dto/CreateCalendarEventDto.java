package com.ruby.pro203_exam.calendar.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCalendarEventDto {
    private UUID kindergartenId;
    private UUID groupId;  // NULL for note for everyone
    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private Boolean isSpecialOccasion;  // Flag for trips, special days, etc.
}