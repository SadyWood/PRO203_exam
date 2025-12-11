package com.ruby.pro203_exam.kindergarten.service;

import com.ruby.pro203_exam.kindergarten.dto.KindergartenResponseDto;
import com.ruby.pro203_exam.kindergarten.dto.UpdateKindergartenDto;
import com.ruby.pro203_exam.kindergarten.model.Kindergarten;
import com.ruby.pro203_exam.kindergarten.repository.KindergartenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// Service for Kindergarten operations - Handles the CRUD for kindergartens - staff creates parents select
@Service
@RequiredArgsConstructor
@Slf4j
public class KindergartenService {

    private final KindergartenRepository kindergartenRepository;

    // Get all kindergartens - for parents when selecting
    public List<KindergartenResponseDto> getAllKindergartens() {
        log.info("Fetching all kindergartens");
        return kindergartenRepository.findAll().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    // Get kindergarten by id
    public KindergartenResponseDto getKindergartenById(UUID id) {
        log.info("Fetching kindergarten: {}", id);
        Kindergarten kindergarten = kindergartenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kindergarten not found"));
        return toResponseDto(kindergarten);
    }

    // Update kindergarten - STAFF ONLY
    @Transactional(transactionManager = "appTransactionManager")
    public KindergartenResponseDto updateKindergarten(UUID id, UpdateKindergartenDto dto) {
        log.info("Updating Kindergarten with id: {}", id);

        // Find existing
        Kindergarten kindergarten = kindergartenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kindergarten not found"));

        // Update only fields provided
        if (dto.getName() != null) {
            // Check if the new name has any conflicts
            if (!dto.getName().equals(kindergarten.getName()) &&
                    kindergartenRepository.existsByName(dto.getName())) {
                throw new RuntimeException("Kindergarten with name " + dto.getName() + " already exists");
            }
            kindergarten.setName(dto.getName());
        }
        if (dto.getAddress() != null) {
            kindergarten.setAddress(dto.getAddress());
        }
        if (dto.getPhoneNumber() != null) {
            kindergarten.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getEmail() != null) {
            kindergarten.setEmail(dto.getEmail());
        }

        // Save
        Kindergarten updated = kindergartenRepository.save(kindergarten);
        log.info("Updated Kindergarten with id: {}", id);

        return toResponseDto(updated);
    }

    // Delete kindergarten
    @Transactional(transactionManager = "appTransactionManager")
    public void deleteKindergarten(UUID id) {
        log.info("Deleting kindergarten: {}", id);

        if (!kindergartenRepository.existsById(id)) {
            throw new RuntimeException("Kindergarten not found");
        }

        // TODO: Check if kindergarten has children/staff before deleting
        kindergartenRepository.deleteById(id);
        log.info("Deleted kindergarten: {}", id);
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //
    // Entity -> DTO
    private KindergartenResponseDto toResponseDto(Kindergarten kindergarten) {
        return KindergartenResponseDto.builder()
                .id(kindergarten.getId())
                .name(kindergarten.getName())
                .address(kindergarten.getAddress())
                .phoneNumber(kindergarten.getPhoneNumber())
                .email(kindergarten.getEmail())
                .build();
    }

}
