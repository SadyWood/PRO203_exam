package com.ruby.pro203_exam.child.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "child_permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildPermissions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "child_id", nullable = false, unique = true)
    private UUID childId;

    @Column(name = "allow_photography", nullable = false)
    @Builder.Default
    private Boolean allowPhotography = false;

    @Column(name = "allow_picture_sharing", nullable = false)
    @Builder.Default
    private Boolean allowPictureSharing = false;

    @Column(name = "allow_social_media_posts", nullable = false)
    @Builder.Default
    private Boolean allowSocialMediaPosts = false;

    @Column(name = "allow_trips", nullable = false)
    @Builder.Default
    private Boolean allowTrips = true;

    @Column(name = "allow_public_name_sharing", nullable = false)
    @Builder.Default
    private Boolean allowPublicNameSharing = false;

    @Column(name = "consent_given_by")
    private UUID consentGivenBy;

    @Column(name = "consent_given_at")
    private LocalDateTime consentGivenAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
