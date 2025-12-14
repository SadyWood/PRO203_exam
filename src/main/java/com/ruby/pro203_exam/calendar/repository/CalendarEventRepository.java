package com.ruby.pro203_exam.calendar.repository;

import com.ruby.pro203_exam.calendar.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, UUID> {

    List<CalendarEvent> findByKindergartenId(UUID kindergartenId);

    List<CalendarEvent> findByGroupId(UUID groupId);

    List<CalendarEvent> findByKindergartenIdAndEventDateBetween(
            UUID kindergartenId, LocalDate start, LocalDate end);

    List<CalendarEvent> findByGroupIdInAndEventDateBetween(
            List<UUID> groupIds, LocalDate start, LocalDate end);

    List<CalendarEvent> findByKindergartenIdAndGroupIdIsNullAndEventDateBetween(
            UUID kindergartenId, LocalDate start, LocalDate end);
}