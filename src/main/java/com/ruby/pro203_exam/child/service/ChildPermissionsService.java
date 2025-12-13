package com.ruby.pro203_exam.child.service;

import com.ruby.pro203_exam.child.dto.ChildPermissionsResponseDto;
import com.ruby.pro203_exam.child.dto.CreateChildPermissionsDto;
import com.ruby.pro203_exam.child.dto.UpdateChildPermissionsDto;
import com.ruby.pro203_exam.child.model.ChildPermissions;
import com.ruby.pro203_exam.child.repository.ChildPermissionsRepository;
import com.ruby.pro203_exam.child.repository.ChildRepository;
import com.ruby.pro203_exam.parent.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class ChildPermissionsService {
    private final ChildPermissionsRepository permissionsRepository;
    private final ChildRepository childRepository;
    private final ParentRepository parentRepository;

    // Find a child's permissions
    public ChildPermissionsResponseDto getPermissionsByChild(UUID childId) {
        log.info("Fetching permissions for child: {}", childId);

        ChildPermissions permissions = permissionsRepository.findByChildId(childId)
                .orElseThrow(() -> new RuntimeException("Permissions not found for child"));

        return toResponseDto(permissions);
    }

    // Create permissions for a child
    public ChildPermissionsResponseDto createPermissions(UUID childId, CreateChildPermissionsDto dto, UUID parentId) {
        log.info("Creating permissions for child: {}", childId);

        if (!childRepository.existsById(childId)) {
            throw new RuntimeException("Child not found");
        }

        if (permissionsRepository.existsByChildId(childId)) {
            throw new RuntimeException("Permissions already exist for this child");
        }

        ChildPermissions permissions = ChildPermissions.builder()
                .childId(childId)
                .allowPhotography(dto.getAllowPhotography() != null ? dto.getAllowPhotography() : false)
                .allowPictureSharing(dto.getAllowPictureSharing() != null ? dto.getAllowPictureSharing() : false)
                .allowSocialMediaPosts(dto.getAllowSocialMediaPosts() != null ? dto.getAllowSocialMediaPosts() : false)
                .allowTrips(dto.getAllowTrips() != null ? dto.getAllowTrips() : true)
                .allowPublicNameSharing(dto.getAllowPublicNameSharing() != null ? dto.getAllowPublicNameSharing() : false)
                .consentGivenBy(parentId)
                .consentGivenAt(LocalDateTime.now())
                .build();

        ChildPermissions saved = permissionsRepository.save(permissions);
        return toResponseDto(saved);
    }

    // Update permissions for a child
    public ChildPermissionsResponseDto updatePermissions(UUID childId, UpdateChildPermissionsDto dto, UUID parentId) {
        log.info("Updating permissions for child: {}", childId);

        ChildPermissions permissions = permissionsRepository.findByChildId(childId)
                .orElseThrow(() -> new RuntimeException("Permissions not found for child"));

        if (dto.getAllowPhotography() != null) {
            permissions.setAllowPhotography(dto.getAllowPhotography());
        }
        if (dto.getAllowPictureSharing() != null) {
            permissions.setAllowPictureSharing(dto.getAllowPictureSharing());
        }
        if (dto.getAllowSocialMediaPosts() != null) {
            permissions.setAllowSocialMediaPosts(dto.getAllowSocialMediaPosts());
        }
        if (dto.getAllowTrips() != null) {
            permissions.setAllowTrips(dto.getAllowTrips());
        }
        if (dto.getAllowPublicNameSharing() != null) {
            permissions.setAllowPublicNameSharing(dto.getAllowPublicNameSharing());
        }

        // Update consent info
        permissions.setConsentGivenBy(parentId);
        permissions.setConsentGivenAt(LocalDateTime.now());

        ChildPermissions saved = permissionsRepository.save(permissions);
        return toResponseDto(saved);
    }

    public void deletePermissions(UUID childId) {
        log.info("Deleting permissions for child: {}", childId);

        if (!permissionsRepository.existsByChildId(childId)) {
            throw new RuntimeException("Permissions not found for child");
        }

        permissionsRepository.deleteByChildId(childId);
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //

    private ChildPermissionsResponseDto toResponseDto(ChildPermissions permissions) {
        String childName = childRepository.findById(permissions.getChildId())
                .map(c -> c.getFirstName() + " " + c.getLastName())
                .orElse(null);

        String consentGivenByName = null;
        if (permissions.getConsentGivenBy() != null) {
            consentGivenByName = parentRepository.findById(permissions.getConsentGivenBy())
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(null);
        }

        return ChildPermissionsResponseDto.builder()
                .id(permissions.getId())
                .childId(permissions.getChildId())
                .childName(childName)
                .allowPhotography(permissions.getAllowPhotography())
                .allowPictureSharing(permissions.getAllowPictureSharing())
                .allowSocialMediaPosts(permissions.getAllowSocialMediaPosts())
                .allowTrips(permissions.getAllowTrips())
                .allowPublicNameSharing(permissions.getAllowPublicNameSharing())
                .consentGivenBy(permissions.getConsentGivenBy())
                .consentGivenByName(consentGivenByName)
                .consentGivenAt(permissions.getConsentGivenAt())
                .updatedAt(permissions.getUpdatedAt())
                .build();
    }
}
