package com.ruby.pro203_exam.kindergarten.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for updating a kindergarten - all fields are optional only updates whats changed
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateKindergartenDto {

    @Size(min = 2, max = 255)
    private String name;

    @Size(max = 500)
    private String address;

    @Size(max = 20)
    private String phoneNumber;

    @Email
    @Size(max = 255)
    private String email;
}
