package com.ruby.pro203_exam.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String employeeId;
    private String phoneNr;
    private String position;

}
