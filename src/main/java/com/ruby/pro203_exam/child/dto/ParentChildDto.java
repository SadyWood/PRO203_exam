package com.ruby.pro203_exam.child.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentChildDto {
    private UUID id;
    private UUID parentId;
    private UUID childId;
    private String RelationStatus;
    private Boolean canCheckOut;
    private Boolean canCheckIn;
    private Boolean isPrimaryContact;
    private Boolean requiredVerification;

}
