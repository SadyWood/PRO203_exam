package com.ruby.pro203_exam.parent.service;

import com.ruby.pro203_exam.parent.dto.ParentResponseDto;
import com.ruby.pro203_exam.parent.model.Parent;
import com.ruby.pro203_exam.parent.repository.ParentRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


// Service for Parent business logic - Handles CRUD operations and data transformation
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class ParentService {

    private final ParentRepository parentRepository;

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
}
