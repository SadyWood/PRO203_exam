package com.ruby.pro203_exam.calendar.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarEventResponseDto {
    private UUID id;
    private UUID kindergartenId;
    private UUID groupId;
    private String groupName;
    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private UUID createdBy;
    private String createdByName;
    private LocalDateTime createdAt;
}