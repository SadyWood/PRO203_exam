package com.ruby.pro203_exam.checker.service;

import com.ruby.pro203_exam.checker.dto.CheckInDto;
import com.ruby.pro203_exam.checker.dto.CheckOutDto;
import com.ruby.pro203_exam.checker.dto.CheckerResponseDto;
import com.ruby.pro203_exam.checker.model.CheckInOut;
import com.ruby.pro203_exam.checker.repository.CheckerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class CheckerService {

    private final CheckerRepository checkerRepository;

    public CheckerResponseDto checkIn(CheckInDto dto, UUID confirmedByStaff) {
        log.info("Child for checking in: {}", dto.getChildId());

        // Check if already checked in
        checkerRepository.findByChildIdAndCheckOutTimeIsNull(dto.getChildId())
                .ifPresent(existingChecker -> {
                    throw new RuntimeException("Child is already checked in");
                });

        CheckInOut checkIn = CheckInOut.builder()
                .childId(dto.getChildId())
                .checkInTime(LocalDateTime.now())
                .droppedOffBy(dto.getDroppedOffBy())
                .droppedOffByType(dto.getDroppedOffPersonType())
                .droppedOffByName(dto.getDroppedOffPersonName())
                .checkInConfirmedByStaff(confirmedByStaff) // Use passed-in staff ID
                .notes(dto.getNotes())
                .build();

        CheckInOut savedCheckIn = checkerRepository.save(checkIn);
        log.info("Saved checkIn: {}", savedCheckIn.getId());
        return toResponseDto(savedCheckIn);
    }

    public CheckerResponseDto checkOut(CheckOutDto dto, UUID approvedByStaff) {
        log.info("Child for checking out: {}", dto.getChildId());
        CheckInOut checkIn = checkerRepository.findByChildIdAndCheckOutTimeIsNull(dto.getChildId())
                .orElseThrow(() -> new RuntimeException("Child is not checked in"));

        checkIn.setCheckOutTime(LocalDateTime.now());
        checkIn.setPickedUpBy(dto.getPickedUpBy());
        checkIn.setPickedUpByType(dto.getPickedUpPersonType());
        checkIn.setPickedUpByName(dto.getPickedUpPersonName());
        checkIn.setCheckOutApprovedByStaff(approvedByStaff); // Use passed-in staff ID
        checkIn.setIdVerified(dto.isPickedUpConfirmed());

        if (dto.getNotes() != null && !dto.getNotes().isEmpty()) {
            String existingNotes = checkIn.getNotes() != null ? checkIn.getNotes() : "";
            checkIn.setNotes(existingNotes + (existingNotes.isEmpty() ? "" : " | ") + dto.getNotes());
        }

        CheckInOut savedCheckIn = checkerRepository.save(checkIn);
        log.info("Saved checkout: {}", savedCheckIn.getId());
        return toResponseDto(savedCheckIn);
    }

    public List<CheckerResponseDto> getActiveCheckins() {
        log.info("Finding active checkins");
        return checkerRepository.findByCheckOutTimeIsNull().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<CheckerResponseDto> getChildHistory(UUID childId) {
        log.info("Finding history for child: {}", childId);
        return checkerRepository.findByChildIdOrderByCheckInTimeDesc(childId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());

    }

    private CheckerResponseDto toResponseDto(CheckInOut savedCheckers) {
        return CheckerResponseDto.builder()
                .id(savedCheckers.getId())
                .childId(savedCheckers.getChildId())
                .checkInDate(savedCheckers.getCheckInTime())
                .droppedOffBy(savedCheckers.getDroppedOffBy())
                .droppedOffPersonType(savedCheckers.getDroppedOffByType())
                .droppedOffPersonName(savedCheckers.getDroppedOffByName())
                .droppedOffConfirmedBy(savedCheckers.getCheckInConfirmedByStaff())
                .checkOutDate(savedCheckers.getCheckOutTime())
                .pickedUpBy(savedCheckers.getPickedUpBy())
                .pickedUpPersonType(savedCheckers.getPickedUpByType())
                .pickedUpPersonName(savedCheckers.getPickedUpByName())
                .pickedUpConfirmedBy(savedCheckers.getCheckOutApprovedByStaff())
                .pickedUpConfirmed(savedCheckers.isIdVerified())
                .notes(savedCheckers.getNotes())
                .initializedOn(savedCheckers.getCreatedAt())
                .build();
    }


}
