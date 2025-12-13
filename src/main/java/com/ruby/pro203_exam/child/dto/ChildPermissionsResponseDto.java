package com.ruby.pro203_exam.child.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildPermissionsResponseDto {
    private UUID id;
    private UUID childId;
    private String childName;
    private Boolean allowPhotography;
    private Boolean allowPictureSharing;
    private Boolean allowSocialMediaPosts;
    private Boolean allowTrips;
    private Boolean allowPublicNameSharing;
    private UUID consentGivenBy;
    private String consentGivenByName;
    private LocalDateTime consentGivenAt;
    private LocalDateTime updatedAt;
}
