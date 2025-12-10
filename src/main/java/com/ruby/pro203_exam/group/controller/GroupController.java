package com.ruby.pro203_exam.group.controller;

import com.ruby.pro203_exam.group.dto.AssignStaffDto;
import com.ruby.pro203_exam.group.dto.CreateGroupDto;
import com.ruby.pro203_exam.group.dto.GroupResponseDto;
import com.ruby.pro203_exam.group.dto.UpdateGroupDto;
import com.ruby.pro203_exam.group.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
@Slf4j
public class GroupController {
    private final GroupService groupService;
    // TODO: Add AuthorizationService checks when JWT is implemented

    @PostMapping
    public ResponseEntity<GroupResponseDto> createGroup(@RequestBody @Valid CreateGroupDto dto) {
        // TODO: Verify caller is ADMIN of kindergarten
        return ResponseEntity.ok(groupService.createGroup(dto));
    }

    @GetMapping("/kindergarten/{kindergartenId}")
    public ResponseEntity<List<GroupResponseDto>> getGroupsByKindergarten(@PathVariable UUID kindergartenId) {
        return ResponseEntity.ok(groupService.getGroupsByKindergarten(kindergartenId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupResponseDto> getGroup(@PathVariable UUID id) {
        return ResponseEntity.ok(groupService.getGroupById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupResponseDto> updateGroup(
            @PathVariable UUID id,
            @RequestBody UpdateGroupDto dto) {
        // TODO: Add authorization check - isPrivilegedAtKindergarten
        return ResponseEntity.ok(groupService.updateGroup(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable UUID id) {
        // TODO: Verify caller is BOSS
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{groupId}/staff/{staffId}")
    public ResponseEntity<Void> assignStaff(
            @PathVariable UUID groupId,
            @PathVariable UUID staffId,
            @RequestBody AssignStaffDto dto) {
        // TODO: Verify caller is ADMIN
        groupService.assignStaffToGroup(staffId, groupId, dto.isResponsible());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{groupId}/staff/{staffId}")
    public ResponseEntity<Void> removeStaff(@PathVariable UUID groupId, @PathVariable UUID staffId) {
        // TODO: Verify caller is ADMIN
        groupService.removeStaffFromGroup(staffId, groupId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<GroupResponseDto>> getGroupsByStaff(@PathVariable UUID staffId) {
        return ResponseEntity.ok(groupService.getGroupsByStaff(staffId));
    }
}
