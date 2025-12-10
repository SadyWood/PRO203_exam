package com.ruby.pro203_exam.health.service;

import com.ruby.pro203_exam.child.model.Child;
import com.ruby.pro203_exam.child.repository.ChildRepository;
import com.ruby.pro203_exam.health.dto.CreateHealthDataDto;
import com.ruby.pro203_exam.health.dto.HealthDataResponseDto;
import com.ruby.pro203_exam.health.dto.UpdateHealthDataDto;
import com.ruby.pro203_exam.health.model.HealthData;
import com.ruby.pro203_exam.health.repository.HealthDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class HealthDataService {
    private final HealthDataRepository healthDataRepository;
    private final ChildRepository childRepository;

    public HealthDataResponseDto getHealthDataByChild(UUID childId) {
        log.info("Fetching health data for child: {}", childId);

        HealthData healthData = healthDataRepository.findByChildId(childId)
                .orElseThrow(() -> new RuntimeException("Health data not found"));

        return toResponseDto(healthData);
    }

    public HealthDataResponseDto createHealthData(UUID childId, CreateHealthDataDto dto) {
        log.info("Creating health data for child: {}", childId);

        if (!childRepository.existsById(childId)) {
            throw new RuntimeException("Child not found");
        }

        if (healthDataRepository.existsByChildId(childId)) {
            throw new RuntimeException("Health data already exists for this child");
        }

        HealthData healthData = HealthData.builder()
                .childId(childId)
                .medicalConditions(dto.getMedicalConditions())
                .allergies(dto.getAllergies())
                .medications(dto.getMedications())
                .emergencyContact(dto.getEmergencyContact())
                .dietaryRestrictions(dto.getDietaryRestrictions())
                .build();

        HealthData saved = healthDataRepository.save(healthData);

        // Link to child
        Child child = childRepository.findById(childId).orElseThrow();
        child.setHealthDataId(saved.getId());
        childRepository.save(child);

        return toResponseDto(saved);
    }

    public HealthDataResponseDto updateHealthData(UUID childId, UpdateHealthDataDto dto) {
        log.info("Updating health data for child: {}", childId);

        HealthData healthData = healthDataRepository.findByChildId(childId)
                .orElseThrow(() -> new RuntimeException("Health data not found"));

        if (dto.getMedicalConditions() != null) {
            healthData.setMedicalConditions(dto.getMedicalConditions());
        }
        if (dto.getAllergies() != null) {
            healthData.setAllergies(dto.getAllergies());
        }
        if (dto.getMedications() != null) {
            healthData.setMedications(dto.getMedications());
        }
        if (dto.getEmergencyContact() != null) {
            healthData.setEmergencyContact(dto.getEmergencyContact());
        }
        if (dto.getDietaryRestrictions() != null) {
            healthData.setDietaryRestrictions(dto.getDietaryRestrictions());
        }

        return toResponseDto(healthDataRepository.save(healthData));
    }

    public void deleteHealthData(UUID childId) {
        log.info("Deleting health data for child: {}", childId);

        if (!healthDataRepository.existsByChildId(childId)) {
            throw new RuntimeException("Health data not found");
        }

        // Remove link from child
        Child child = childRepository.findById(childId).orElse(null);
        if (child != null) {
            child.setHealthDataId(null);
            childRepository.save(child);
        }

        healthDataRepository.deleteByChildId(childId);
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //

    private HealthDataResponseDto toResponseDto(HealthData data) {
        String childName = childRepository.findById(data.getChildId())
                .map(c -> c.getFirstName() + " " + c.getLastName())
                .orElse(null);

        return HealthDataResponseDto.builder()
                .id(data.getId())
                .childId(data.getChildId())
                .childName(childName)
                .medicalConditions(data.getMedicalConditions())
                .allergies(data.getAllergies())
                .medications(data.getMedications())
                .emergencyContact(data.getEmergencyContact())
                .dietaryRestrictions(data.getDietaryRestrictions())
                .build();
    }
}
