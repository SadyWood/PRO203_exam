package com.ruby.pro203_exam.group.service;

import com.ruby.pro203_exam.child.repository.ChildRepository;
import com.ruby.pro203_exam.group.dto.CreateGroupDto;
import com.ruby.pro203_exam.group.dto.GroupResponseDto;
import com.ruby.pro203_exam.group.dto.UpdateGroupDto;
import com.ruby.pro203_exam.group.model.Group;
import com.ruby.pro203_exam.group.model.StaffGroupAssignment;
import com.ruby.pro203_exam.group.repository.GroupRepository;
import com.ruby.pro203_exam.group.repository.StaffGroupAssignmentRepository;
import com.ruby.pro203_exam.kindergarten.repository.KindergartenRepository;
import com.ruby.pro203_exam.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class GroupService {
    private final GroupRepository groupRepository;
    private final StaffGroupAssignmentRepository assignmentRepository;
    private final KindergartenRepository kindergartenRepository;
    private final StaffRepository staffRepository;
    private final ChildRepository childRepository;

    // Create group - Admin only function
    public GroupResponseDto createGroup(CreateGroupDto dto) {
        log.info("Creating group: {} in kindergarten: {}", dto.getName(), dto.getKindergartenId());

        if (!kindergartenRepository.existsById(dto.getKindergartenId())) {
            throw new RuntimeException("Kindergarten not found");
        }

        if (groupRepository.existsByNameAndKindergartenId(dto.getName(), dto.getKindergartenId())) {
            throw new RuntimeException("Group name already exists in this kindergarten");
        }

        Group group = Group.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .kindergartenId(dto.getKindergartenId())
                .ageRange(dto.getAgeRange())
                .maxCapacity(dto.getMaxCapacity())
                .build();

        Group saved = groupRepository.save(group);
        return toResponseDto(saved);
    }

    // Get all groups for a kindergarten
    public List<GroupResponseDto> getGroupsByKindergarten(UUID kindergartenId) {
        return groupRepository.findByKindergartenId(kindergartenId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    // Assign staff to group - Admin only
    public void assignStaffToGroup(UUID staffId, UUID groupId, boolean isResponsible) {
        log.info("Assigning staff {} to group {} (responsible: {})", staffId, groupId, isResponsible);

        if (!staffRepository.existsById(staffId)) {
            throw new RuntimeException("Staff not found");
        }
        if (!groupRepository.existsById(groupId)) {
            throw new RuntimeException("Group not found");
        }
        if (assignmentRepository.existsByStaffIdAndGroupId(staffId, groupId)) {
            throw new RuntimeException("Staff already assigned to this group");
        }

        StaffGroupAssignment assignment = StaffGroupAssignment.builder()
                .staffId(staffId)
                .groupId(groupId)
                .isResponsible(isResponsible)
                .build();

        assignmentRepository.save(assignment);
    }

    // Remove staff from group - Admin only
    public void removeStaffFromGroup(UUID staffId, UUID groupId) {
        log.info("Removing staff {} from group {}", staffId, groupId);
        assignmentRepository.deleteByStaffIdAndGroupId(staffId, groupId);
    }

    // Get staff assigned to a group
    public List<UUID> getStaffByGroup(UUID groupId) {
        return assignmentRepository.findByGroupId(groupId).stream()
                .map(StaffGroupAssignment::getStaffId)
                .toList();
    }

    // Get groups a staff member is assigned to
    public List<GroupResponseDto> getGroupsByStaff(UUID staffId) {
        List<UUID> groupIds = assignmentRepository.findByStaffId(staffId).stream()
                .map(StaffGroupAssignment::getGroupId)
                .toList();

        return groupRepository.findAllById(groupIds).stream()
                .map(this::toResponseDto)
                .toList();
    }

    // Assign child to group
    public void assignChildToGroup(UUID childId, UUID groupId) {
        log.info("Assigning child {} to group {}", childId, groupId);

        var child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));

        if (!groupRepository.existsById(groupId)) {
            throw new RuntimeException("Group not found");
        }

        child.setGroupId(groupId);
        childRepository.save(child);
    }

    // Remove child from group
    public void removeChildFromGroup(UUID childId) {
        log.info("Removing child {} from group", childId);

        var child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));

        child.setGroupId(null);
        childRepository.save(child);
    }

    // Get children assigned to a group
    public List<UUID> getChildrenByGroup(UUID groupId) {
        return childRepository.findByGroupId(groupId).stream()
                .map(child -> child.getId())
                .toList();
    }

    // Delete group - Admin only and must be empty
    public void deleteGroup(UUID groupId) {
        log.info("Deleting group: {}", groupId);

        long childCount = childRepository.countByGroupId(groupId);
        if (childCount > 0) {
            throw new RuntimeException("Cannot delete group with assigned children");
        }

        // Remove all staff assignments first
        assignmentRepository.deleteAll(assignmentRepository.findByGroupId(groupId));

        groupRepository.deleteById(groupId);
    }

    // Get single group by ID
    public GroupResponseDto getGroupById(UUID groupId) {
        log.info("Fetching group: {}", groupId);

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        return toResponseDto(group);
    }

    // Update group - Privileged Staff or Boss only
    public GroupResponseDto updateGroup(UUID groupId, UpdateGroupDto dto) {
        log.info("Updating group: {}", groupId);

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (dto.getName() != null) {
            // Check for duplicate name in same kindergarten
            if (!group.getName().equals(dto.getName()) &&
                    groupRepository.existsByNameAndKindergartenId(dto.getName(), group.getKindergartenId())) {
                throw new RuntimeException("Group name already exists in this kindergarten");
            }
            group.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            group.setDescription(dto.getDescription());
        }
        if (dto.getAgeRange() != null) {
            group.setAgeRange(dto.getAgeRange());
        }
        if (dto.getMaxCapacity() != null) {
            group.setMaxCapacity(dto.getMaxCapacity());
        }

        Group saved = groupRepository.save(group);
        return toResponseDto(saved);
    }

    public List<GroupResponseDto> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(this::toResponseDto)
                .toList();
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //
    private GroupResponseDto toResponseDto(Group group) {
        long childCount = childRepository.countByGroupId(group.getId());
        long staffCount = assignmentRepository.findByGroupId(group.getId()).size();

        return GroupResponseDto.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .kindergartenId(group.getKindergartenId())
                .ageRange(group.getAgeRange())
                .maxCapacity(group.getMaxCapacity())
                .childCount((int) childCount)
                .staffCount((int) staffCount)
                .build();
    }
}
