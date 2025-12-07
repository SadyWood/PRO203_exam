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
public class CheckInDto {
    private UUID childId;
    private UUID droppedOffBy;
    private PersonType droppedOffPersonType;
    private String droppedOffPersonName;
    private UUID droppedOffConfirmedBy;
    private String notes;


}
