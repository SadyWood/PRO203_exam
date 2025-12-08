package com.ruby.pro203_exam.child.service;

import com.ruby.pro203_exam.child.dto.ChildResponseDto;
import com.ruby.pro203_exam.child.dto.CreateChildDto;
import com.ruby.pro203_exam.child.dto.UpdateChildDto;
import com.ruby.pro203_exam.child.model.Child;
import com.ruby.pro203_exam.child.model.ParentChildRelationship;
import com.ruby.pro203_exam.child.repository.ChildRepository;
import com.ruby.pro203_exam.child.repository.ParentChildRelationshipRepository;
import com.ruby.pro203_exam.kindergarten.model.Kindergarten;
import com.ruby.pro203_exam.kindergarten.repository.KindergartenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// Service for child operations - handles CRUD and parent-child linkage
@Service
@RequiredArgsConstructor
@Slf4j
public class ChildService {

    private final ChildRepository childRepository;
    private final ParentChildRelationshipRepository relationshipRepository;
    private final KindergartenRepository kindergartenRepository;

    // Get all children - staff view
    public List<ChildResponseDto> getAllChildren() {
        log.info("Fetching all children");
        return childRepository.findAll().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }


    // Get child by ID
    public ChildResponseDto getChildById(UUID id) {
        log.info("Fetching child: {}", id);
        Child child = childRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        return toResponseDto(child);
    }

    // Get child by parent ID - parents only see their child
    public List<ChildResponseDto> getChildrenByParent(UUID parentId) {
        log.info("Fetching children for parent: {}", parentId);
        List<Child> children = childRepository.findByParentId(parentId);
        return children.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    // Get children by kindergarten - for staff at specific kindergartens
    public List<ChildResponseDto> getChildrenByKindergarten(UUID kindergartenId) {
        log.info("Fetching children for kindergarten: {}", kindergartenId);
        List<Child> children = childRepository.findByKindergartenId(kindergartenId);
        return children.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    // Create a child and link to parent
    @Transactional(transactionManager = "appTransactionManager")
    public ChildResponseDto createChild(CreateChildDto dto, UUID parentId) {
        log.info("Creating child: {} for parent: {}", dto.getFirstName(), parentId);

        // Verify kindergarten exists
        if (!kindergartenRepository.existsById(dto.getKindergartenId())) {
            throw new RuntimeException("Kindergarten not found");
        }

        // Create child
        Child child = Child.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .birthDate(dto.getBirthDate())
                .groupName(dto.getGroupName())
                .kindergartenId(dto.getKindergartenId())
                .checkedIn(false)
                .build();

        Child savedChild = childRepository.save(child);
        log.info("Created child with id: {}", savedChild.getId());

        // Create parent-child relationship
        ParentChildRelationship relationship = ParentChildRelationship.builder()
                .parentId(parentId)
                .childId(savedChild.getId())
                .relationshipType("PARENT") // Default
                .canPickup(true)
                .canDropOff(true)
                .isPrimaryContact(true) // First parent is primary by default
                .requiresIdVerification(false)
                .build();

        relationshipRepository.save(relationship);
        log.info("Linked child {} to parent {}", savedChild.getId(), parentId);

        return toResponseDto(savedChild);
    }

    // Update child
    @Transactional(transactionManager = "appTransactionManager")
    public ChildResponseDto updateChild(UUID id, UpdateChildDto dto) {
        log.info("Updating child: {}", id);

        Child child = childRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Child not found"));

        // Update only provided fields
        if (dto.getFirstName() != null) {
            child.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            child.setLastName(dto.getLastName());
        }
        if (dto.getBirthDate() != null) {
            child.setBirthDate(dto.getBirthDate());
        }
        if (dto.getGroupName() != null) {
            child.setGroupName(dto.getGroupName());
        }
        if (dto.getKindergartenId() != null) {
            // Verify new kindergarten exists
            if (!kindergartenRepository.existsById(dto.getKindergartenId())) {
                throw new RuntimeException("Kindergarten not found");
            }
            child.setKindergartenId(dto.getKindergartenId());
        }

        Child updated = childRepository.save(child);
        log.info("Updated child: {}", id);

        return toResponseDto(updated);
    }

    // Delete child
    @Transactional(transactionManager = "appTransactionManager")
    public void deleteChild(UUID id) {
        log.info("Deleting child: {}", id);

        if (!childRepository.existsById(id)) {
            throw new RuntimeException("Child not found");
        }

        // Delete relationships first
        List<ParentChildRelationship> relationships = relationshipRepository.findByChildId(id);
        relationshipRepository.deleteAll(relationships);

        // Delete child
        childRepository.deleteById(id);
        log.info("Deleted child: {}", id);
    }


    // ------------------------------------- HELPER METHODS ------------------------------------- //
    // Entity -> DTO
    private ChildResponseDto toResponseDto(Child child) {
        // Lookup kindergarten name if exists
        String kindergartenName = null;
        if (child.getKindergartenId() != null) {
            kindergartenName = kindergartenRepository.findById(child.getKindergartenId())
                    .map(Kindergarten::getName)
                    .orElse(null);
        }

        return ChildResponseDto.builder()
                .id(child.getId())
                .firstName(child.getFirstName())
                .lastName(child.getLastName())
                .birthDate(child.getBirthDate())
                .groupName(child.getGroupName())
                .kindergartenId(child.getKindergartenId())
                .kindergartenName(kindergartenName)
                .checkedIn(child.getCheckedIn())
                .build();
    }
}
