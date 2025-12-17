package com.ruby.pro203_exam.group.controller;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.service.AuthorizationService;
import com.ruby.pro203_exam.auth.util.SecurityUtils;
import com.ruby.pro203_exam.group.dto.AssignStaffDto;
import com.ruby.pro203_exam.group.dto.CreateGroupDto;
import com.ruby.pro203_exam.group.dto.GroupResponseDto;
import com.ruby.pro203_exam.group.dto.UpdateGroupDto;
import com.ruby.pro203_exam.group.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import com.ruby.pro203_exam.auth.exception.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
@Slf4j
public class GroupController {
    private final GroupService groupService;
    private final AuthorizationService authorizationService;
    private final SecurityUtils securityUtils;

    // Create a group
    @PostMapping
    public ResponseEntity<GroupResponseDto> createGroup(@RequestBody @Valid CreateGroupDto dto) {
        User user = securityUtils.getCurrentUser();

        // Only privileged staff can create groups
        if (!authorizationService.canManageGroups(user.getId(), dto.getKindergartenId())) {
            throw new AccessDeniedException("Cannot create groups in this kindergarten");
        }

        return ResponseEntity.ok(groupService.createGroup(dto));
    }

    // Get groups by kindergarten
    @GetMapping("/kindergarten/{kindergartenId}")
    public ResponseEntity<List<GroupResponseDto>> getGroupsByKindergarten(@PathVariable UUID kindergartenId) {
        // All authenticated users can view groups
        // TODO: Investigate if a authenticated user can view groups he isn't meant to see/see info inside a group
        return ResponseEntity.ok(groupService.getGroupsByKindergarten(kindergartenId));
    }

    // Get a single group by ID
    @GetMapping("/{id}")
    public ResponseEntity<GroupResponseDto> getGroup(@PathVariable UUID id) {
        return ResponseEntity.ok(groupService.getGroupById(id));
    }

    // Update a group
    @PutMapping("/{id}")
    public ResponseEntity<GroupResponseDto> updateGroup(
            @PathVariable UUID id,
            @RequestBody UpdateGroupDto dto) {

        User user = securityUtils.getCurrentUser();
        GroupResponseDto group = groupService.getGroupById(id);

        if (!authorizationService.canManageGroups(user.getId(), group.getKindergartenId())) {
            throw new AccessDeniedException("Cannot update this group");
        }

        return ResponseEntity.ok(groupService.updateGroup(id, dto));
    }

    // Delete a group
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable UUID id) {
        User user = securityUtils.getCurrentUser();
        GroupResponseDto group = groupService.getGroupById(id);

        if (!authorizationService.canManageGroups(user.getId(), group.getKindergartenId())) {
            throw new AccessDeniedException("Cannot delete this group");
        }

        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }

    // Assign staff to a group
    @PostMapping("/{groupId}/staff/{staffId}")
    public ResponseEntity<Void> assignStaff(
            @PathVariable UUID groupId,
            @PathVariable UUID staffId,
            @RequestBody AssignStaffDto dto) {

        User user = securityUtils.getCurrentUser();
        GroupResponseDto group = groupService.getGroupById(groupId);

        // Only boss can assign staff to groups
        // TODO: Boss can assign staff but anyone can create a group? Improve this logic
        if (!authorizationService.canAssignStaff(user.getId(), group.getKindergartenId())) {
            throw new AccessDeniedException("Only boss can assign staff to groups");
        }

        groupService.assignStaffToGroup(staffId, groupId, dto.isResponsible());
        return ResponseEntity.ok().build();
    }

    // Delete staff from groups
    @DeleteMapping("/{groupId}/staff/{staffId}")
    public ResponseEntity<Void> removeStaff(@PathVariable UUID groupId, @PathVariable UUID staffId) {
        User user = securityUtils.getCurrentUser();
        GroupResponseDto group = groupService.getGroupById(groupId);

        // Only boss can remove staff from groups
        if (!authorizationService.canAssignStaff(user.getId(), group.getKindergartenId())) {
            throw new AccessDeniedException("Only boss can remove staff from groups");
        }

        groupService.removeStaffFromGroup(staffId, groupId);
        return ResponseEntity.noContent().build();
    }

    // Get groups by staff
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<GroupResponseDto>> getGroupsByStaff(@PathVariable UUID staffId) {
        return ResponseEntity.ok(groupService.getGroupsByStaff(staffId));
    }
}
