package com.ruby.pro203_exam.auth.dto;

import com.ruby.pro203_exam.auth.model.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

//DTO for complete user registration - After OpenID login, user selects their role and provides additional info
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompleteRegistrationDto {
    @NotNull(message = "Role is required")
    private UserRole role; // User chooses - PARENT or STAFF

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100)
    private String lastName;

    @Size(max = 20)
    private String phoneNumber;

    private String address; // For parents

    private UUID kindergartenId;
    private String employeeId; // For staff
    private String position; // For staff

    // Only required if registering as a boss
    private String kindergartenName;
    private String kindergartenAddress;
    private String kindergartenPhone;
    private String kindergartenEmail;
}
