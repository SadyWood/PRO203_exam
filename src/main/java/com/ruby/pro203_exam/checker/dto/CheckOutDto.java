package com.ruby.pro203_exam.checker.dto;

import com.ruby.pro203_exam.checker.model.PersonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckOutDto {
    private UUID childId;
    private UUID pickedUpBy;
    private PersonType pickedUpPersonType;
    private String pickedUpPersonName;
    private UUID pickedUpConfirmedBy;
    private boolean pickedUpConfirmed;
    private String notes;

}
