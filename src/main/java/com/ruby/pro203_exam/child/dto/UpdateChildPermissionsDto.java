package com.ruby.pro203_exam.child.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateChildPermissionsDto {
    private Boolean allowPhotography;
    private Boolean allowPictureSharing;
    private Boolean allowSocialMediaPosts;
    private Boolean allowTrips;
    private Boolean allowPublicNameSharing;
}
