package com.ruby.pro203_exam.checker.dto;

import com.ruby.pro203_exam.checker.model.PersonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckerResponseDto {
    private UUID id;
    private UUID childId;
    private LocalDateTime checkInDate;
    private UUID droppedOffBy;
    private PersonType droppedOffPersonType;
    private String droppedOffPersonName;
    private UUID droppedOffConfirmedBy;
    private LocalDateTime checkOutDate;
    private UUID pickedUpBy;
    private PersonType pickedUpPersonType;
    private String pickedUpPersonName;
    private UUID pickedUpConfirmedBy;
    private boolean pickedUpConfirmed;
    private String notes;
    private LocalDateTime initializedOn;

}
