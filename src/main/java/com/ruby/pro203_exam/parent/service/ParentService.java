package com.ruby.pro203_exam.parent.service;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.repository.UserRepository;
import com.ruby.pro203_exam.child.model.Child;
import com.ruby.pro203_exam.child.model.ParentChildRelationship;
import com.ruby.pro203_exam.child.repository.ChildRepository;
import com.ruby.pro203_exam.child.repository.ParentChildRelationshipRepository;
import com.ruby.pro203_exam.kindergarten.model.Kindergarten;
import com.ruby.pro203_exam.kindergarten.repository.KindergartenRepository;
import com.ruby.pro203_exam.parent.dto.ChildSummaryDto;
import com.ruby.pro203_exam.parent.dto.CoParentDto;
import com.ruby.pro203_exam.parent.dto.ParentProfileResponseDto;
import com.ruby.pro203_exam.parent.dto.ParentResponseDto;
import com.ruby.pro203_exam.parent.model.Parent;
import com.ruby.pro203_exam.parent.repository.ParentRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


// Service for Parent business logic - Handles CRUD operations and data transformation
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class ParentService {

    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final ParentChildRelationshipRepository parentChildRepo;
    private final KindergartenRepository kindergartenRepository;

    // Get all parents
    public List<ParentResponseDto> getAllParents() {
        log.info("Fetching all parents");
        return parentRepository.findAll().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    // Get parent by ID
    public ParentResponseDto getParentById(UUID id) {
        log.info("Fetching parent: {}", id);
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        return toResponseDto(parent);
    }

    public ParentProfileResponseDto getParentProfile(UUID parentId) {
        log.info("Fetching full profile for parent: {}", parentId);

        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent not found"));

        // Get profile picture from User entity
        String profilePictureUrl = userRepository.findByProfileId(parentId)
                .map(User::getProfilePictureUrl)
                .orElse(null);

        // Get all children
        List<Child> children = childRepository.findByParentId(parentId);
        List<ChildSummaryDto> childSummaries = children.stream()
                .map(this::toChildSummary)
                .toList();

        // Get co-parents for the same child
        List<CoParentDto> coParents = findCoParents(parentId, children);

        return ParentProfileResponseDto.builder()
                .id(parent.getId())
                .firstName(parent.getFirstName())
                .lastName(parent.getLastName())
                .email(parent.getEmail())
                .phoneNumber(parent.getPhoneNumber())
                .address(parent.getAddress())
                .profilePictureUrl(profilePictureUrl)
                .children(childSummaries)
                .coParents(coParents)
                .build();
    }

    private List<CoParentDto> findCoParents(UUID parentId, List<Child> children) {
        // Find all parent-child relationships for the children
        Map<UUID, List<ChildSummaryDto>> coParentChildren = new HashMap<>();

        for (Child child : children) {
            List<ParentChildRelationship> relationships =
                    parentChildRepo.findByChildId(child.getId());

            for (ParentChildRelationship rel : relationships) {
                if (!rel.getParentId().equals(parentId)) {
                    coParentChildren
                            .computeIfAbsent(rel.getParentId(), k -> new ArrayList<>())
                            .add(toChildSummary(child));
                }
            }
        }

        // Build co-parent DTOs
        return coParentChildren.entrySet().stream()
                .map(entry -> {
                    Parent coParent = parentRepository.findById(entry.getKey()).orElse(null);
                    if (coParent == null) return null;

                    return CoParentDto.builder()
                            .id(coParent.getId())
                            .firstName(coParent.getFirstName())
                            .lastName(coParent.getLastName())
                            .email(coParent.getEmail())
                            .phoneNumber(coParent.getPhoneNumber())
                            .sharedChildren(entry.getValue())
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //

    // Convert entity to DTO
    private ParentResponseDto toResponseDto(Parent parent) {
        return ParentResponseDto.builder()
                .id(parent.getId())
                .firstName(parent.getFirstName())
                .lastName(parent.getLastName())
                .email(parent.getEmail())
                .phoneNumber(parent.getPhoneNumber())
                .canPickup(parent.getCanPickup())
                .build();
    }

    private ChildSummaryDto toChildSummary(Child child) {
        String kindergartenName = null;
        if (child.getKindergartenId() != null) {
            kindergartenName = kindergartenRepository.findById(child.getKindergartenId())
                    .map(Kindergarten::getName)
                    .orElse(null);
        }

        return ChildSummaryDto.builder()
                .id(child.getId())
                .firstName(child.getFirstName())
                .lastName(child.getLastName())
                .birthDate(child.getBirthDate())
                .groupName(child.getGroupName())
                .kindergartenName(kindergartenName)
                .checkedIn(child.getCheckedIn())
                .build();
    }
}
