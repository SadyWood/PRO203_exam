package com.ruby.pro203_exam.kindergarten.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for creating a new kindergarten - only staff can create a new kindergarten
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateKindergartenDto {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 255, message = "Name must be 2-255 characters")
    private String name;

    @Size(max = 500, message = "Address max 500 characters")
    private String address;

    @Size(max = 20, message = "Phone number max 20 characters")
    private String phoneNumber;

    @Email(message = "Email must be valid")
    @Size(max = 255)
    private String email;
}
