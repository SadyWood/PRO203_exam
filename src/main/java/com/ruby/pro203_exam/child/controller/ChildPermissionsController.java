package com.ruby.pro203_exam.child.controller;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.child.dto.ChildPermissionsResponseDto;
import com.ruby.pro203_exam.child.dto.CreateChildPermissionsDto;
import com.ruby.pro203_exam.child.dto.UpdateChildPermissionsDto;
import com.ruby.pro203_exam.child.service.ChildPermissionsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/child-permissions")
@RequiredArgsConstructor
@Slf4j
public class ChildPermissionsController {
    private final ChildPermissionsService permissionsService;
    private final AuthorizationService authService;
    private final SecurityUtils securityUtils;

    // Get permissions for a child
    @GetMapping("/child/{childId}")
    public ResponseEntity<ChildPermissionsResponseDto> getPermissions(@PathVariable UUID childId) {
        User user = securityUtils.getCurrentUser();

        if (!authService.canViewChild(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot view permissions for this child");
        }

        return ResponseEntity.ok(permissionsService.getPermissionsByChild(childId));
    }

    // Create permissions for a child
    @PostMapping("/child/{childId}")
    public ResponseEntity<ChildPermissionsResponseDto> createPermissions(
            @PathVariable UUID childId,
            @RequestBody CreateChildPermissionsDto dto) {

        User user = securityUtils.getCurrentUser();

        // Only parents of this child can set permissions
        if (user.getRole() != UserRole.PARENT) {
            throw new AccessDeniedException("Only parents can set child permissions");
        }

        if (!authService.canViewChild(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot set permissions for this child");
        }

        return ResponseEntity.ok(permissionsService.createPermissions(childId, dto, user.getProfileId()));
    }

    // Update permissions for a child
    @PutMapping("/child/{childId}")
    public ResponseEntity<ChildPermissionsResponseDto> updatePermissions(
            @PathVariable UUID childId,
            @RequestBody UpdateChildPermissionsDto dto) {

        User user = securityUtils.getCurrentUser();

        // Only parents of this child can update permissions
        if (user.getRole() != UserRole.PARENT) {
            throw new AccessDeniedException("Only parents can update child permissions");
        }

        if (!authService.canViewChild(user.getId(), childId)) {
            throw new AccessDeniedException("Cannot update permissions for this child");
        }

        return ResponseEntity.ok(permissionsService.updatePermissions(childId, dto, user.getProfileId()));
    }

    // Delete permissions for a child
    @DeleteMapping("/child/{childId}")
    public ResponseEntity<Void> deletePermissions(@PathVariable UUID childId) {
        User user = securityUtils.getCurrentUser();

        // Only boss can delete permissions
        if (user.getRole() != UserRole.PARENT) {
            throw new AccessDeniedException("Only Parent can delete permissions");
        }

        permissionsService.deletePermissions(childId);
        return ResponseEntity.noContent().build();
    }
}
