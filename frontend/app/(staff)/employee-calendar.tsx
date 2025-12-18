import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { Calendar, toDateId, type CalendarTheme } from "@marceloterreiro/flash-calendar";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";
import { CalendarStyles } from "@/styles";
import { getCurrentUser } from "@/services/authApi";
import { UserResponseDto } from "@/services/types/auth";
import {
  staffApi,
  calendarApi,
  groupApi,
  StaffResponseDto,
  GroupResponseDto,
  CalendarEventResponseDto,
  CreateCalendarEventDto,
} from "@/services/staffApi";

// Calendar theme for flash-calendar component
const calendarTheme: CalendarTheme = {
  itemDay: {
    idle: ({ isPressed }) => ({
      container: {
        borderRadius: 1,
        backgroundColor: Colors.primaryBlue,
        borderWidth: 3,
        borderColor: Colors.primaryLightBlue,
        opacity: isPressed ? 0.3 : 1,
      },
      content: {
        fontSize: 12,
        color: Colors.text,
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderRadius: 1,
        backgroundColor: Colors.tabBackground,
        borderWidth: 3,
        borderColor: Colors.primaryBlue,
        opacity: isPressed ? 0.6 : 1,
      },
      content: {
        color: Colors.text,
        fontWeight: "700",
      },
    }),
    active: ({ isPressed }) => ({
      container: {
        borderRadius: 1,
        backgroundColor: Colors.green,
        borderWidth: 3,
        borderColor: "#22c55e",
        opacity: isPressed ? 0.3 : 1,
      },
      content: {
        fontSize: 12,
        color: Colors.text,
        fontWeight: "700",
      },
    }),
  },
};

// Helper to get all days in a month
const getMonthDays = (dateId: string) => {
  const [yearStr, monthStr] = dateId.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const daysInMonth = new Date(year, month, 0).getDate();

  const result: { id: string; label: number }[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, "0");
    result.push({
      id: `${yearStr}-${monthStr}-${dayStr}`,
      label: day,
    });
  }
  return result;
};

// Event templates for quick creation
const EVENT_TEMPLATES = [
  { title: "Turdag", description: "Vi drar på tur!", isSpecialOccasion: true },
  { title: "Bursdag", description: "Vi feirer bursdag!", isSpecialOccasion: true },
  { title: "Dugnad", description: "Felles dugnad", isSpecialOccasion: false },
  { title: "Foreldremøte", description: "Møte med foresatte", isSpecialOccasion: false },
  { title: "Planleggingsdag", description: "Barnehagen holder stengt", isSpecialOccasion: true },
];

export default function EmployeeCalendarScreen() {
  const router = useRouter();
  const todayId = toDateId(new Date());

  // User and staff state
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffResponseDto | null>(null);
  const [groups, setGroups] = useState<GroupResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDate, setSelectedDate] = useState<string>(todayId);
  const [currentMonth, setCurrentMonth] = useState<string>(todayId);
  const [events, setEvents] = useState<CalendarEventResponseDto[]>([]);

  // Modal state
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventResponseDto | null>(null);

  // Event form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventGroupId, setEventGroupId] = useState<string | null>(null);
  const [eventIsSpecial, setEventIsSpecial] = useState(false);

  // Load user data and events
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser?.profileId) {
        const staff = await staffApi.getCurrentStaff(currentUser.profileId);
        setStaffProfile(staff);

        if (staff.kindergartenId) {
          // Load groups for the group selector
          const groupsList = await groupApi.getGroupsByKindergarten(staff.kindergartenId);
          setGroups(groupsList || []);

          // Load all events for this month
          const [yearStr, monthStr] = currentMonth.split("-");
          const year = Number(yearStr);
          const month = Number(monthStr);
          const startDate = `${yearStr}-${monthStr}-01`;
          const lastDay = new Date(year, month, 0).getDate();
          const endDate = `${yearStr}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

          const monthEvents = await calendarApi.getEventsByDateRange(
            staff.kindergartenId,
            startDate,
            endDate
          );
          setEvents(monthEvents || []);
        }
      }
    } catch (err) {
      console.log("Feil ved lasting av data:", err);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Check if user can create/edit events (BOSS or admin staff)
  const canManageEvents = user?.role === "BOSS" || staffProfile?.isAdmin;

  // Get events for selected date
  const selectedDateEvents = events
    .filter((e) => e.eventDate === selectedDate)
    .sort((a, b) => {
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });

  // Get dates that have events (for calendar highlighting)
  const eventDates = [...new Set(events.map((e) => e.eventDate))];
  const activeDateRanges = eventDates.map((date) => ({
    startId: date,
    endId: date,
  }));

  // Reset form fields
  const resetForm = () => {
    setEventTitle("");
    setEventDescription("");
    setEventStartTime("");
    setEventEndTime("");
    setEventLocation("");
    setEventGroupId(null);
    setEventIsSpecial(false);
    setEditingEvent(null);
  };

  // Open modal for new event
  const openNewEventModal = () => {
    resetForm();
    setIsEventModalVisible(true);
  };

  // Open modal to edit existing event
  const openEditEventModal = (event: CalendarEventResponseDto) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description || "");
    setEventStartTime(event.startTime || "");
    setEventEndTime(event.endTime || "");
    setEventLocation(event.location || "");
    setEventGroupId(event.groupId || null);
    setEventIsSpecial(event.isSpecialOccasion || false);
    setIsEventModalVisible(true);
  };

  // Apply template
  const applyTemplate = (template: typeof EVENT_TEMPLATES[0]) => {
    setEventTitle(template.title);
    setEventDescription(template.description);
    setEventIsSpecial(template.isSpecialOccasion);
    setIsTemplateModalVisible(false);
    setIsEventModalVisible(true);
  };

  // Save event (create or update)
  const handleSaveEvent = async () => {
    if (!eventTitle.trim()) {
      Alert.alert("Feil", "Tittel er påkrevd");
      return;
    }
    if (!staffProfile?.kindergartenId) {
      Alert.alert("Feil", "Kunne ikke finne barnehage");
      return;
    }

    try {
      if (editingEvent) {
        // Update existing event
        await calendarApi.updateEvent(editingEvent.id, {
          title: eventTitle.trim(),
          description: eventDescription.trim() || undefined,
          startTime: eventStartTime || undefined,
          endTime: eventEndTime || undefined,
          location: eventLocation.trim() || undefined,
          groupId: eventGroupId || undefined,
          isSpecialOccasion: eventIsSpecial,
        });
      } else {
        // Create new event
        const newEvent: CreateCalendarEventDto = {
          kindergartenId: staffProfile.kindergartenId,
          title: eventTitle.trim(),
          description: eventDescription.trim() || undefined,
          eventDate: selectedDate,
          startTime: eventStartTime || undefined,
          endTime: eventEndTime || undefined,
          location: eventLocation.trim() || undefined,
          groupId: eventGroupId || undefined,
          isSpecialOccasion: eventIsSpecial,
        };
        await calendarApi.createEvent(newEvent);
      }

      // Reload events
      await loadData();
      setIsEventModalVisible(false);
      resetForm();
    } catch (err) {
      console.error("Feil ved lagring av hendelse:", err);
      Alert.alert("Feil", "Kunne ikke lagre hendelse");
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (!editingEvent) return;

    Alert.alert("Slett hendelse", "Er du sikker på at du vil slette denne hendelsen?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Slett",
        style: "destructive",
        onPress: async () => {
          try {
            await calendarApi.deleteEvent(editingEvent.id);
            await loadData();
            setIsEventModalVisible(false);
            resetForm();
          } catch (err) {
            console.error("Feil ved sletting av hendelse:", err);
            Alert.alert("Feil", "Kunne ikke slette hendelse");
          }
        },
      },
    ]);
  };

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    const [yearStr, monthStr] = currentMonth.split("-");
    let year = Number(yearStr);
    let month = Number(monthStr);

    if (direction === "prev") {
      month--;
      if (month < 1) {
        month = 12;
        year--;
      }
    } else {
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }

    const newMonth = `${year}-${String(month).padStart(2, "0")}-01`;
    setCurrentMonth(newMonth);
  };

  const monthDays = getMonthDays(currentMonth);
  const monthName = new Date(currentMonth).toLocaleDateString("nb-NO", {
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <View style={CalendarStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={CalendarStyles.container}>
      {/* Header */}
      <View style={CalendarStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={CalendarStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={CalendarStyles.headerTitle}>Kalender</Text>
        {canManageEvents && (
          <TouchableOpacity onPress={() => setIsTemplateModalVisible(true)} style={CalendarStyles.addButton}>
            <Ionicons name="add-circle" size={28} color={Colors.primaryBlue} />
          </TouchableOpacity>
        )}
      </View>

      {/* Month navigation */}
      <View style={CalendarStyles.monthNav}>
        <TouchableOpacity onPress={() => navigateMonth("prev")}>
          <Ionicons name="chevron-back" size={24} color={Colors.primaryBlue} />
        </TouchableOpacity>
        <Text style={CalendarStyles.monthText}>{monthName}</Text>
        <TouchableOpacity onPress={() => navigateMonth("next")}>
          <Ionicons name="chevron-forward" size={24} color={Colors.primaryBlue} />
        </TouchableOpacity>
      </View>

      {/* View mode toggle */}
      <View style={CalendarStyles.toggleRow}>
        <TouchableOpacity
          style={[CalendarStyles.toggleButton, viewMode === "grid" && CalendarStyles.toggleButtonActive]}
          onPress={() => setViewMode("grid")}
        >
          <Text style={[CalendarStyles.toggleButtonText, viewMode === "grid" && CalendarStyles.toggleButtonTextActive]}>
            Kalender
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[CalendarStyles.toggleButton, viewMode === "list" && CalendarStyles.toggleButtonActive]}
          onPress={() => setViewMode("list")}
        >
          <Text style={[CalendarStyles.toggleButtonText, viewMode === "list" && CalendarStyles.toggleButtonTextActive]}>
            Liste
          </Text>
        </TouchableOpacity>
      </View>

      {/* Selected date events preview */}
      {viewMode === "grid" && (
        <View style={CalendarStyles.selectedDateEvents}>
          <View style={CalendarStyles.selectedDateHeader}>
            <Text style={CalendarStyles.selectedDateTitle}>
              {new Date(selectedDate).toLocaleDateString("nb-NO", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
            {canManageEvents && (
              <TouchableOpacity onPress={openNewEventModal}>
                <Ionicons name="add-circle-outline" size={22} color={Colors.primaryBlue} />
              </TouchableOpacity>
            )}
          </View>
          {selectedDateEvents.length === 0 ? (
            <Text style={CalendarStyles.noEventsText}>Ingen hendelser denne dagen</Text>
          ) : (
            selectedDateEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={CalendarStyles.eventItem}
                onPress={() => canManageEvents && openEditEventModal(event)}
              >
                <View style={CalendarStyles.eventItemLeft}>
                  {event.isSpecialOccasion && (
                    <Ionicons name="star" size={14} color={Colors.yellow} style={{ marginRight: 4 }} />
                  )}
                  <Text style={CalendarStyles.eventItemTitle}>{event.title}</Text>
                </View>
                <Text style={CalendarStyles.eventItemTime}>
                  {event.startTime || ""} {event.groupName ? `| ${event.groupName}` : "| Alle"}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Calendar view */}
      {viewMode === "grid" ? (
        <Calendar
          calendarMonthId={currentMonth}
          calendarActiveDateRanges={activeDateRanges}
          onCalendarDayPress={(dateId) => setSelectedDate(dateId)}
          calendarFirstDayOfWeek="monday"
          calendarDayHeight={40}
          calendarRowHorizontalSpacing={4}
          calendarRowVerticalSpacing={4}
          theme={calendarTheme}
        />
      ) : (
        <ScrollView style={CalendarStyles.listWrapper}>
          {monthDays.map((day) => {
            const dateId = day.id;
            const dayEvents = events.filter((e) => e.eventDate === dateId);
            const hasEvents = dayEvents.length > 0;
            const hasSpecial = dayEvents.some((e) => e.isSpecialOccasion);

            return (
              <TouchableOpacity
                key={dateId}
                style={[
                  CalendarStyles.listRow,
                  hasEvents && CalendarStyles.listRowWithEvents,
                  hasSpecial && CalendarStyles.listRowSpecial,
                  dateId === selectedDate && CalendarStyles.listRowSelected,
                ]}
                onPress={() => setSelectedDate(dateId)}
              >
                <Text style={CalendarStyles.listDayNumber}>{day.label}</Text>
                <View style={CalendarStyles.listContent}>
                  {dayEvents.map((event) => (
                    <View key={event.id} style={CalendarStyles.listEventRow}>
                      {event.isSpecialOccasion && (
                        <Ionicons name="star" size={12} color={Colors.yellow} />
                      )}
                      <Text style={CalendarStyles.listEventText} numberOfLines={1}>
                        {event.startTime ? `${event.startTime} - ` : ""}
                        {event.title}
                      </Text>
                    </View>
                  ))}
                </View>
                {canManageEvents && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDate(dateId);
                      openNewEventModal();
                    }}
                  >
                    <Ionicons name="add-circle-outline" size={18} color={Colors.primaryBlue} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Template selection modal */}
      <Modal
        visible={isTemplateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsTemplateModalVisible(false)}
      >
        <View style={CalendarStyles.modalBackdrop}>
          <View style={CalendarStyles.modalCard}>
            <Text style={CalendarStyles.modalTitle}>Velg mal eller lag ny</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {EVENT_TEMPLATES.map((template, index) => (
                <TouchableOpacity
                  key={index}
                  style={CalendarStyles.templateItem}
                  onPress={() => applyTemplate(template)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {template.isSpecialOccasion && (
                      <Ionicons name="star" size={14} color={Colors.yellow} style={{ marginRight: 6 }} />
                    )}
                    <Text style={CalendarStyles.templateTitle}>{template.title}</Text>
                  </View>
                  <Text style={CalendarStyles.templateDesc}>{template.description}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[CalendarStyles.templateItem, { borderTopWidth: 1, borderTopColor: Colors.primaryBlue }]}
                onPress={() => {
                  setIsTemplateModalVisible(false);
                  openNewEventModal();
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="create-outline" size={14} color={Colors.primaryBlue} style={{ marginRight: 6 }} />
                  <Text style={[CalendarStyles.templateTitle, { color: Colors.primaryBlue }]}>
                    Lag ny hendelse fra bunn
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={CalendarStyles.closeButton}
              onPress={() => setIsTemplateModalVisible(false)}
            >
              <Text style={CalendarStyles.closeButtonText}>Lukk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Event create/edit modal */}
      <Modal
        visible={isEventModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEventModalVisible(false)}
      >
        <View style={CalendarStyles.modalBackdrop}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
            <View style={CalendarStyles.modalCard}>
              <Text style={CalendarStyles.modalTitle}>
                {editingEvent ? "Rediger hendelse" : "Ny hendelse"}
              </Text>
              <Text style={CalendarStyles.modalSubtitle}>
                {new Date(selectedDate).toLocaleDateString("nb-NO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>

              <Text style={CalendarStyles.inputLabel}>Tittel *</Text>
              <TextInput
                style={CalendarStyles.input}
                value={eventTitle}
                onChangeText={setEventTitle}
                placeholder="F.eks. Turdag til skogen"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={CalendarStyles.inputLabel}>Beskrivelse</Text>
              <TextInput
                style={[CalendarStyles.input, { minHeight: 60 }]}
                value={eventDescription}
                onChangeText={setEventDescription}
                placeholder="Valgfri beskrivelse"
                placeholderTextColor={Colors.textMuted}
                multiline
              />

              <View style={CalendarStyles.timeRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={CalendarStyles.inputLabel}>Starttid</Text>
                  <TextInput
                    style={CalendarStyles.input}
                    value={eventStartTime}
                    onChangeText={setEventStartTime}
                    placeholder="HH:mm"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={CalendarStyles.inputLabel}>Sluttid</Text>
                  <TextInput
                    style={CalendarStyles.input}
                    value={eventEndTime}
                    onChangeText={setEventEndTime}
                    placeholder="HH:mm"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>

              <Text style={CalendarStyles.inputLabel}>Sted</Text>
              <TextInput
                style={CalendarStyles.input}
                value={eventLocation}
                onChangeText={setEventLocation}
                placeholder="Valgfritt"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={CalendarStyles.inputLabel}>Gruppe</Text>
              <View style={CalendarStyles.groupSelector}>
                <TouchableOpacity
                  style={[CalendarStyles.groupOption, eventGroupId === null && CalendarStyles.groupOptionSelected]}
                  onPress={() => setEventGroupId(null)}
                >
                  <Text style={CalendarStyles.groupOptionText}>Alle grupper</Text>
                </TouchableOpacity>
                {groups.map((group) => (
                  <TouchableOpacity
                    key={group.id}
                    style={[CalendarStyles.groupOption, eventGroupId === group.id && CalendarStyles.groupOptionSelected]}
                    onPress={() => setEventGroupId(group.id)}
                  >
                    <Text style={CalendarStyles.groupOptionText}>{group.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={CalendarStyles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={CalendarStyles.inputLabel}>Spesiell anledning</Text>
                  <Text style={CalendarStyles.switchHint}>Turer, bursdager, planleggingsdager osv.</Text>
                </View>
                <Switch
                  value={eventIsSpecial}
                  onValueChange={setEventIsSpecial}
                  trackColor={{ false: Colors.primaryLightBlue, true: Colors.yellow }}
                  thumbColor="#fff"
                />
              </View>

              <View style={CalendarStyles.modalButtonsRow}>
                {editingEvent && (
                  <TouchableOpacity style={CalendarStyles.deleteButton} onPress={handleDeleteEvent}>
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={CalendarStyles.cancelButton}
                  onPress={() => {
                    setIsEventModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={CalendarStyles.cancelButtonText}>Avbryt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={CalendarStyles.saveButton} onPress={handleSaveEvent}>
                  <Text style={CalendarStyles.saveButtonText}>Lagre</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
