package com.ruby.pro203_exam.child.service;

import com.ruby.pro203_exam.child.dto.CreateParentChildDto;
import com.ruby.pro203_exam.child.dto.ParentChildDto;
import com.ruby.pro203_exam.child.model.ParentChildRelationship;
import com.ruby.pro203_exam.child.repository.ParentChildRelationshipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class ParentChildService {
    private final ParentChildRelationshipRepository relationshipRepo;

    public ParentChildDto createRelationship(CreateParentChildDto createParentChildDto) {
        log.info("Create relationship status, child: {}, parent:{}", createParentChildDto.getChildId(), createParentChildDto.getParentId());

        if(relationshipRepo.existsByParentIdAndChildId(createParentChildDto.getParentId(), createParentChildDto.getChildId())) {
            throw new RuntimeException("Relationship status already exists");
        }

        ParentChildRelationship relationship = ParentChildRelationship.builder()
                .parentId(createParentChildDto.getParentId())
                .childId(createParentChildDto.getChildId())
                .relationshipType(createParentChildDto.getRelationStatus())
                .canPickup(createParentChildDto.getCanCheckOut() != null ? createParentChildDto.getCanCheckOut() : true)
                .canDropOff(createParentChildDto.getCanCheckIn() != null ? createParentChildDto.getCanCheckIn() : true)
                .isPrimaryContact(createParentChildDto.getIsPrimaryContact() != null ? createParentChildDto.getIsPrimaryContact() : true)
                .requiresIdVerification(createParentChildDto.getRequiredVerification() != null ? createParentChildDto.getRequiredVerification() : true)
                .build();

        ParentChildRelationship savedRelationship = relationshipRepo.save(relationship);
        log.info("Relationship created: {}", savedRelationship.getId());
        return toDto(savedRelationship);

    }

    public List<ParentChildDto> getRelationshipsOfParent(UUID parentId) {
        log.info("Get relationships of parent: {}", parentId);
        return relationshipRepo.findByParentId(parentId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());

    }

    public List<ParentChildDto> getRelationshipOfChild(UUID childId) {
        log.info("Get relationships of child: {}", childId);
        return relationshipRepo.findByParentId(childId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());

    }

    public ParentChildDto getRelationshipById(UUID id) {
        log.info("Get relationships status: {}", id);
        ParentChildRelationship relationship = relationshipRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Relationship not found"));
        return toDto(relationship);

    }

    public ParentChildDto updateRelationshipStatus(UUID id, CreateParentChildDto createParentChildDto) {
        log.info("Updating relationships status: {}", id);
        ParentChildRelationship relationship = relationshipRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Relationship not found"));

        if(createParentChildDto.getRelationStatus() != null) {
            relationship.setRelationshipType(createParentChildDto.getRelationStatus());
        }
        if(createParentChildDto.getCanCheckOut() != null) {
            relationship.setCanPickup(createParentChildDto.getCanCheckOut());
        }
        if(createParentChildDto.getCanCheckIn() != null) {
            relationship.setCanDropOff(createParentChildDto.getCanCheckIn());
        }
        if(createParentChildDto.getIsPrimaryContact() != null) {
            relationship.setIsPrimaryContact(createParentChildDto.getIsPrimaryContact());
        }
        if(createParentChildDto.getRequiredVerification() != null) {
            relationship.setRequiresIdVerification(createParentChildDto.getRequiredVerification());
        }

        ParentChildRelationship savedRelationship = relationshipRepo.save(relationship);
        log.info("Relationship updated: {}", savedRelationship.getId());
        return toDto(savedRelationship);

    }

    public void deleteRelationshipById(UUID id) {
        log.info("Deleting relationship: {}", id);
        if(!relationshipRepo.existsById(id)) {
            throw new RuntimeException("Relationship not found");
        }
        relationshipRepo.deleteById(id);
        log.info("Relationship deleted: {}", id);

    }


    private ParentChildDto toDto(ParentChildRelationship relationship) {
        return ParentChildDto.builder()
                .id(relationship.getId())
                .parentId(relationship.getParentId())
                .childId(relationship.getChildId())
                .RelationStatus(relationship.getRelationshipType())
                .canCheckOut(relationship.getCanPickup())
                .canCheckIn(relationship.getCanDropOff())
                .isPrimaryContact(relationship.getIsPrimaryContact())
                .requiredVerification(relationship.getRequiresIdVerification())
                .build();

    }

}
