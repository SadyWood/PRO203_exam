import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Switch,
  Pressable,
} from "react-native";
import { Calendar, toDateId, type CalendarTheme } from "@marceloterreiro/flash-calendar";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";
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

// Calendar theme matching parent calendar
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kalender</Text>
        {canManageEvents && (
          <TouchableOpacity onPress={() => setIsTemplateModalVisible(true)} style={styles.addButton}>
            <Ionicons name="add-circle" size={28} color={Colors.primaryBlue} />
          </TouchableOpacity>
        )}
      </View>

      {/* Month navigation */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={() => navigateMonth("prev")}>
          <Ionicons name="chevron-back" size={24} color={Colors.primaryBlue} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{monthName}</Text>
        <TouchableOpacity onPress={() => navigateMonth("next")}>
          <Ionicons name="chevron-forward" size={24} color={Colors.primaryBlue} />
        </TouchableOpacity>
      </View>

      {/* View mode toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === "grid" && styles.toggleButtonActive]}
          onPress={() => setViewMode("grid")}
        >
          <Text style={[styles.toggleButtonText, viewMode === "grid" && styles.toggleButtonTextActive]}>
            Kalender
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === "list" && styles.toggleButtonActive]}
          onPress={() => setViewMode("list")}
        >
          <Text style={[styles.toggleButtonText, viewMode === "list" && styles.toggleButtonTextActive]}>
            Liste
          </Text>
        </TouchableOpacity>
      </View>

      {/* Selected date events preview */}
      {viewMode === "grid" && (
        <View style={styles.selectedDateEvents}>
          <View style={styles.selectedDateHeader}>
            <Text style={styles.selectedDateTitle}>
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
            <Text style={styles.noEventsText}>Ingen hendelser denne dagen</Text>
          ) : (
            selectedDateEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventItem}
                onPress={() => canManageEvents && openEditEventModal(event)}
              >
                <View style={styles.eventItemLeft}>
                  {event.isSpecialOccasion && (
                    <Ionicons name="star" size={14} color={Colors.yellow} style={{ marginRight: 4 }} />
                  )}
                  <Text style={styles.eventItemTitle}>{event.title}</Text>
                </View>
                <Text style={styles.eventItemTime}>
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
        <ScrollView style={styles.listWrapper}>
          {monthDays.map((day) => {
            const dateId = day.id;
            const dayEvents = events.filter((e) => e.eventDate === dateId);
            const hasEvents = dayEvents.length > 0;
            const hasSpecial = dayEvents.some((e) => e.isSpecialOccasion);

            return (
              <TouchableOpacity
                key={dateId}
                style={[
                  styles.listRow,
                  hasEvents && styles.listRowWithEvents,
                  hasSpecial && styles.listRowSpecial,
                  dateId === selectedDate && styles.listRowSelected,
                ]}
                onPress={() => setSelectedDate(dateId)}
              >
                <Text style={styles.listDayNumber}>{day.label}</Text>
                <View style={styles.listContent}>
                  {dayEvents.map((event) => (
                    <View key={event.id} style={styles.listEventRow}>
                      {event.isSpecialOccasion && (
                        <Ionicons name="star" size={12} color={Colors.yellow} />
                      )}
                      <Text style={styles.listEventText} numberOfLines={1}>
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
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Velg mal eller lag ny</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {EVENT_TEMPLATES.map((template, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.templateItem}
                  onPress={() => applyTemplate(template)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {template.isSpecialOccasion && (
                      <Ionicons name="star" size={14} color={Colors.yellow} style={{ marginRight: 6 }} />
                    )}
                    <Text style={styles.templateTitle}>{template.title}</Text>
                  </View>
                  <Text style={styles.templateDesc}>{template.description}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.templateItem, { borderTopWidth: 1, borderTopColor: Colors.primaryBlue }]}
                onPress={() => {
                  setIsTemplateModalVisible(false);
                  openNewEventModal();
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="create-outline" size={14} color={Colors.primaryBlue} style={{ marginRight: 6 }} />
                  <Text style={[styles.templateTitle, { color: Colors.primaryBlue }]}>
                    Lag ny hendelse fra bunn
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsTemplateModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Lukk</Text>
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
        <View style={styles.modalBackdrop}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {editingEvent ? "Rediger hendelse" : "Ny hendelse"}
              </Text>
              <Text style={styles.modalSubtitle}>
                {new Date(selectedDate).toLocaleDateString("nb-NO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>

              <Text style={styles.inputLabel}>Tittel *</Text>
              <TextInput
                style={styles.input}
                value={eventTitle}
                onChangeText={setEventTitle}
                placeholder="F.eks. Turdag til skogen"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.inputLabel}>Beskrivelse</Text>
              <TextInput
                style={[styles.input, { minHeight: 60 }]}
                value={eventDescription}
                onChangeText={setEventDescription}
                placeholder="Valgfri beskrivelse"
                placeholderTextColor={Colors.textMuted}
                multiline
              />

              <View style={styles.timeRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Starttid</Text>
                  <TextInput
                    style={styles.input}
                    value={eventStartTime}
                    onChangeText={setEventStartTime}
                    placeholder="HH:mm"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Sluttid</Text>
                  <TextInput
                    style={styles.input}
                    value={eventEndTime}
                    onChangeText={setEventEndTime}
                    placeholder="HH:mm"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Sted</Text>
              <TextInput
                style={styles.input}
                value={eventLocation}
                onChangeText={setEventLocation}
                placeholder="Valgfritt"
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.inputLabel}>Gruppe</Text>
              <View style={styles.groupSelector}>
                <TouchableOpacity
                  style={[styles.groupOption, eventGroupId === null && styles.groupOptionSelected]}
                  onPress={() => setEventGroupId(null)}
                >
                  <Text style={styles.groupOptionText}>Alle grupper</Text>
                </TouchableOpacity>
                {groups.map((group) => (
                  <TouchableOpacity
                    key={group.id}
                    style={[styles.groupOption, eventGroupId === group.id && styles.groupOptionSelected]}
                    onPress={() => setEventGroupId(group.id)}
                  >
                    <Text style={styles.groupOptionText}>{group.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Spesiell anledning</Text>
                  <Text style={styles.switchHint}>Turer, bursdager, planleggingsdager osv.</Text>
                </View>
                <Switch
                  value={eventIsSpecial}
                  onValueChange={setEventIsSpecial}
                  trackColor={{ false: Colors.primaryLightBlue, true: Colors.yellow }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.modalButtonsRow}>
                {editingEvent && (
                  <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteEvent}>
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsEventModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Avbryt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEvent}>
                  <Text style={styles.saveButtonText}>Lagre</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  addButton: {
    padding: 4,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    textTransform: "capitalize",
    minWidth: 150,
    textAlign: "center",
  },
  toggleRow: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 99,
    padding: 4,
    marginBottom: 12,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 99,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primaryBlue,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textMuted,
  },
  toggleButtonTextActive: {
    color: Colors.text,
    fontWeight: "700",
  },
  selectedDateEvents: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectedDateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedDateTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    textTransform: "capitalize",
  },
  noEventsText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  eventItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBlue,
  },
  eventItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  eventItemTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text,
  },
  eventItemTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  listWrapper: {
    flex: 1,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLightBlue,
    backgroundColor: Colors.primaryBlue,
  },
  listRowWithEvents: {
    backgroundColor: Colors.green,
  },
  listRowSpecial: {
    backgroundColor: Colors.yellow,
  },
  listRowSelected: {
    borderWidth: 2,
    borderColor: Colors.text,
  },
  listDayNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    width: 30,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },
  listEventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listEventText: {
    fontSize: 12,
    color: Colors.text,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 16,
    textTransform: "capitalize",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  timeRow: {
    flexDirection: "row",
  },
  groupSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  groupOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
  },
  groupOptionSelected: {
    backgroundColor: Colors.primaryBlue,
  },
  groupOptionText: {
    fontSize: 12,
    color: Colors.text,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
  },
  switchHint: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: Colors.red,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primaryBlue,
  },
  cancelButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.green,
  },
  saveButtonText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  templateItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLightBlue,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  templateDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primaryBlue,
  },
  closeButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
});
