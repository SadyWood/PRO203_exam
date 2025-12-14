package com.ruby.pro203_exam.absence.service;

import com.ruby.pro203_exam.absence.dto.AbsenceResponseDto;
import com.ruby.pro203_exam.absence.dto.CreateAbsenceDto;
import com.ruby.pro203_exam.absence.model.Absence;
import com.ruby.pro203_exam.absence.model.AbsenceStatus;
import com.ruby.pro203_exam.absence.model.AbsenceType;
import com.ruby.pro203_exam.absence.repository.AbsenceRepository;
import com.ruby.pro203_exam.checker.model.PersonType;
import com.ruby.pro203_exam.child.repository.ChildRepository;
import com.ruby.pro203_exam.parent.repository.ParentRepository;
import com.ruby.pro203_exam.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class AbsenceService {

    private final AbsenceRepository absenceRepository;
    private final ChildRepository childRepository;
    private final ParentRepository parentRepository;
    private final StaffRepository staffRepository;


    // Register and absence
    public AbsenceResponseDto createAbsence(CreateAbsenceDto dto, UUID reportedBy, PersonType reportedByType) {
        log.info("Creating absence for child {} from {} to {}", dto.getChildId(), dto.getStartDate(), dto.getEndDate());

        if (!childRepository.existsById(dto.getChildId())) {
            throw new RuntimeException("Child not found");
        }

        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        // Auto-approve if staff reports or if it's unplanned
        AbsenceStatus status = AbsenceStatus.PENDING;
        if (reportedByType == PersonType.Staff || dto.getType() == AbsenceType.UNPLANNED) {
            status = AbsenceStatus.APPROVED;
        }

        Absence absence = Absence.builder()
                .childId(dto.getChildId())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .type(dto.getType())
                .status(status)
                .reason(dto.getReason())
                .reportedBy(reportedBy)
                .reportedByType(reportedByType)
                .build();

        Absence saved = absenceRepository.save(absence);
        return toResponseDto(saved);
    }

    // approve a planned absence - TODO: Define should staff be able to approve vacation for children? laws that support this?
    public AbsenceResponseDto approveAbsence(UUID absenceId, UUID staffId) {
        log.info("Approving absence {} by staff {}", absenceId, staffId);

        Absence absence = absenceRepository.findById(absenceId)
                .orElseThrow(() -> new RuntimeException("Absence not found"));

        absence.setStatus(AbsenceStatus.APPROVED);
        absence.setApprovedByStaff(staffId);
        absence.setApprovedAt(LocalDateTime.now());

        return toResponseDto(absenceRepository.save(absence));
    }

    // Reject registered absence/vacation
    public AbsenceResponseDto rejectAbsence(UUID absenceId, UUID staffId) {
        log.info("Rejecting absence {} by staff {}", absenceId, staffId);

        Absence absence = absenceRepository.findById(absenceId)
                .orElseThrow(() -> new RuntimeException("Absence not found"));

        absence.setStatus(AbsenceStatus.REJECTED);
        absence.setApprovedByStaff(staffId);
        absence.setApprovedAt(LocalDateTime.now());

        return toResponseDto(absenceRepository.save(absence));
    }

    public List<AbsenceResponseDto> getAbsencesByChild(UUID childId) {
        return absenceRepository.findByChildId(childId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<AbsenceResponseDto> getAbsencesByChildAndDateRange(UUID childId, LocalDate start, LocalDate end) {
        return absenceRepository.findByChildIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(childId, end, start)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public boolean isChildAbsentOnDate(UUID childId, LocalDate date) {
        return absenceRepository.existsByChildIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(childId, date, date);
    }

    public void deleteAbsence(UUID absenceId) {
        log.info("Deleting absence {}", absenceId);
        absenceRepository.deleteById(absenceId);
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //

    private AbsenceResponseDto toResponseDto(Absence absence) {
        String childName = childRepository.findById(absence.getChildId())
                .map(c -> c.getFirstName() + " " + c.getLastName())
                .orElse(null);

        String reportedByName = getPersonName(absence.getReportedBy(), absence.getReportedByType());

        String approvedByName = null;
        if (absence.getApprovedByStaff() != null) {
            approvedByName = staffRepository.findById(absence.getApprovedByStaff())
                    .map(s -> s.getFirstName() + " " + s.getLastName())
                    .orElse(null);
        }

        return AbsenceResponseDto.builder()
                .id(absence.getId())
                .childId(absence.getChildId())
                .childName(childName)
                .startDate(absence.getStartDate())
                .endDate(absence.getEndDate())
                .type(absence.getType())
                .status(absence.getStatus())
                .reason(absence.getReason())
                .reportedBy(absence.getReportedBy())
                .reportedByName(reportedByName)
                .reportedByType(absence.getReportedByType())
                .approvedByStaff(absence.getApprovedByStaff())
                .approvedByStaffName(approvedByName)
                .approvedAt(absence.getApprovedAt())
                .createdAt(absence.getCreatedAt())
                .build();
    }

    private String getPersonName(UUID personId, PersonType type) {
        if (type == PersonType.Parent) {
            return parentRepository.findById(personId)
                    .map(p -> p.getFirstName() + " " + p.getLastName())
                    .orElse(null);
        } else {
            return staffRepository.findById(personId)
                    .map(s -> s.getFirstName() + " " + s.getLastName())
                    .orElse(null);
        }
    }
}
