package com.ruby.pro203_exam.group.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateGroupDto {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    private UUID kindergartenId;

    private String ageRange;

    private Integer maxCapacity;
}
