package com.ruby.pro203_exam.calendar.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

// DTO for updating calendar events - All fields are optional - only non-null fields will be updated.
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCalendarEventDto {
    private UUID groupId;  // NULL = kindergarten-wide event
    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private Boolean isSpecialOccasion;
}
