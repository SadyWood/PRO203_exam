package com.ruby.pro203_exam.child.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

// DTO for creating a child
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateChildDto {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100)
    private String lastName;

    @NotNull(message = "Birth date is required")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @Size(max = 50)
    private String groupName;

    @NotNull(message = "Kindergarten is required")
    private UUID kindergartenId; // Which kindergarten child attends

    private UUID groupId;
}
