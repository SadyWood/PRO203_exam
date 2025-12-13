package com.ruby.pro203_exam.child.controller;

import com.ruby.pro203_exam.child.dto.ChildPermissionsResponseDto;
import com.ruby.pro203_exam.child.dto.CreateChildPermissionsDto;
import com.ruby.pro203_exam.child.dto.UpdateChildPermissionsDto;
import com.ruby.pro203_exam.child.service.ChildPermissionsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/child-permissions")
@RequiredArgsConstructor
@Slf4j
public class ChildPermissionsController {
    private final ChildPermissionsService permissionsService;

    @GetMapping("/child/{childId}")
    public ResponseEntity<ChildPermissionsResponseDto> getPermissions(@PathVariable UUID childId) {
        // TODO: Add authorization - canViewChild
        return ResponseEntity.ok(permissionsService.getPermissionsByChild(childId));
    }

    @PostMapping("/child/{childId}")
    public ResponseEntity<ChildPermissionsResponseDto> createPermissions(
            @PathVariable UUID childId,
            @RequestBody CreateChildPermissionsDto dto,
            @RequestParam UUID parentId) {  // TODO: Get from JWT token instead
        // TODO: Add authorization - parent of child only
        return ResponseEntity.ok(permissionsService.createPermissions(childId, dto, parentId));
    }

    @PutMapping("/child/{childId}")
    public ResponseEntity<ChildPermissionsResponseDto> updatePermissions(
            @PathVariable UUID childId,
            @RequestBody UpdateChildPermissionsDto dto,
            @RequestParam UUID parentId) {  // TODO: Get from JWT token instead
        // TODO: Add authorization - parent of child only
        return ResponseEntity.ok(permissionsService.updatePermissions(childId, dto, parentId));
    }

    @DeleteMapping("/child/{childId}")
    public ResponseEntity<Void> deletePermissions(@PathVariable UUID childId) {
        // TODO: Add authorization - BOSS and parents only
        permissionsService.deletePermissions(childId);
        return ResponseEntity.noContent().build();
    }
}
