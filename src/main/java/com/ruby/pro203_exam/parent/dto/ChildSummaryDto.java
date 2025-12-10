package com.ruby.pro203_exam.parent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildSummaryDto {

        private UUID id;

        private String firstName;

        private String lastName;

        private LocalDate birthDate;

        private String groupName;

        private String kindergartenName;

        private Boolean checkedIn;
}
