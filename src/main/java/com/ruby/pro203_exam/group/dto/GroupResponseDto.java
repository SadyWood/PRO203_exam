package com.ruby.pro203_exam.group.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class GroupResponseDto {
    private UUID id;

    private String name;

    private String description;

    private UUID kindergartenId;

    private String ageRange;

    private Integer maxCapacity;

    private Integer childCount;

    private Integer staffCount;
}
