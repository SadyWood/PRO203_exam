package com.ruby.pro203_exam.group.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGroupDto {
    private String name;

    private String description;

    private String ageRange;

    private Integer maxCapacity;
}
