package com.ruby.pro203_exam.calendar.service;

import com.ruby.pro203_exam.calendar.dto.CalendarEventResponseDto;
import com.ruby.pro203_exam.calendar.dto.CreateCalendarEventDto;
import com.ruby.pro203_exam.calendar.model.CalendarEvent;
import com.ruby.pro203_exam.calendar.repository.CalendarEventRepository;
import com.ruby.pro203_exam.group.repository.GroupRepository;
import com.ruby.pro203_exam.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(transactionManager = "appTransactionManager")
public class CalendarEventService {

    private final CalendarEventRepository eventRepository;
    private final GroupRepository groupRepository;
    private final StaffRepository staffRepository;


    public CalendarEventResponseDto createEvent(CreateCalendarEventDto dto, UUID createdBy) {
        log.info("Creating calendar event {} for kindergarten {}", dto.getTitle(), dto.getKindergartenId());

        CalendarEvent event = CalendarEvent.builder()
                .kindergartenId(dto.getKindergartenId())
                .groupId(dto.getGroupId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .eventDate(dto.getEventDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .location(dto.getLocation())
                .createdBy(createdBy)
                .build();

        CalendarEvent saved = eventRepository.save(event);
        return toResponseDto(saved);
    }

    public List<CalendarEventResponseDto> getEventsByKindergarten(UUID kindergartenId) {
        return eventRepository.findByKindergartenId(kindergartenId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<CalendarEventResponseDto> getEventsByKindergartenAndDateRange(UUID kindergartenId, LocalDate start, LocalDate end) {
        return eventRepository.findByKindergartenIdAndEventDateBetween(kindergartenId, start, end).stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<CalendarEventResponseDto> getEventsForGroups(List<UUID> groupIds, LocalDate start, LocalDate end) {
        // Get group-specific events
        List<CalendarEvent> events = eventRepository.findByGroupIdInAndEventDateBetween(groupIds, start, end);
        return events.stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<CalendarEventResponseDto> getEventsForParent(UUID kindergartenId, List<UUID> childGroupIds, LocalDate start, LocalDate end) {
        // Get kindergarten-wide events (groupId is null) + group-specific events
        List<CalendarEventResponseDto> result = new ArrayList<>();

        // Kindergarten-wide events
        result.addAll(eventRepository.findByKindergartenIdAndGroupIdIsNullAndEventDateBetween(kindergartenId, start, end)
                .stream()
                .map(this::toResponseDto)
                .toList());

        // Group-specific events
        if (!childGroupIds.isEmpty()) {
            result.addAll(eventRepository.findByGroupIdInAndEventDateBetween(childGroupIds, start, end)
                    .stream()
                    .map(this::toResponseDto)
                    .toList());
        }

        return result;
    }

    public void deleteEvent(UUID eventId) {
        log.info("Deleting calendar event {}", eventId);
        eventRepository.deleteById(eventId);
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //
    private CalendarEventResponseDto toResponseDto(CalendarEvent event) {
        String groupName = null;
        if (event.getGroupId() != null) {
            groupName = groupRepository.findById(event.getGroupId())
                    .map(g -> g.getName())
                    .orElse(null);
        }

        String createdByName = staffRepository.findById(event.getCreatedBy())
                .map(s -> s.getFirstName() + " " + s.getLastName())
                .orElse(null);

        return CalendarEventResponseDto.builder()
                .id(event.getId())
                .kindergartenId(event.getKindergartenId())
                .groupId(event.getGroupId())
                .groupName(groupName)
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .location(event.getLocation())
                .createdBy(event.getCreatedBy())
                .createdByName(createdByName)
                .createdAt(event.getCreatedAt())
                .build();
    }
}
