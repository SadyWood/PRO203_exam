import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Calendar, toDateId, type CalendarTheme } from "@marceloterreiro/flash-calendar";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "@/constants/colors";
import { calendarApi, CalendarEventResponseDto } from "@/services/staffApi";

const API_BASE_URL = Platform.OS === "android"
  ? "http://10.0.2.2:8080"
  : "http://localhost:8080";

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

// Calendar theme
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
    // Active dates show events
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

export default function CalendarScreen() {
  const todayId = toDateId(new Date());

  // State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDate, setSelectedDate] = useState<string>(todayId);
  const [currentMonth, setCurrentMonth] = useState<string>(todayId);
  const [events, setEvents] = useState<CalendarEventResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [kindergartenId, setKindergartenId] = useState<string | null>(null);
  const [childGroupName, setChildGroupName] = useState<string>("");

  // Load events when screen comes into focus
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Get user data to find kindergartenId
      const userStr = await AsyncStorage.getItem("currentUser");
      if (!userStr) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      if (!user.profileId || user.role !== "PARENT") {
        setLoading(false);
        return;
      }

      // Fetch children to get kindergartenId and group name
      const token = await AsyncStorage.getItem("authToken");
      const childrenRes = await fetch(`${API_BASE_URL}/api/children/parent/${user.profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (childrenRes.ok) {
        const children = await childrenRes.json();
        if (children.length > 0) {
          const firstChild = children[0];
          const kgId = firstChild.kindergartenId;
          setKindergartenId(kgId);
          setChildGroupName(firstChild.groupName || "");

          if (kgId) {
            // Calculate date range for the current month
            const [yearStr, monthStr] = currentMonth.split("-");
            const year = Number(yearStr);
            const month = Number(monthStr);
            const startDate = `${yearStr}-${monthStr}-01`;
            const lastDay = new Date(year, month, 0).getDate();
            const endDate = `${yearStr}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

            // Use the parent-specific endpoint to get filtered events
            const monthEvents = await calendarApi.getEventsForParent(kgId, startDate, endDate);
            setEvents(monthEvents || []);
          }
        }
      }
    } catch (err) {
      console.log("Feil ved lasting av kalenderdata:", err);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Get events for selected date, sorted by time
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
      <View style={styles.headerWrapper}>
        <Text style={styles.depText}>
          {childGroupName ? `Avdeling ${childGroupName}` : "Kalender"}
        </Text>
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
          style={[styles.toggleButton, viewMode === "grid" && styles.toggleButtonActivate]}
          onPress={() => setViewMode("grid")}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleButtonText, viewMode === "grid" && styles.toggleButtonTextActivate]}>
            Kalender
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, viewMode === "list" && styles.toggleButtonActivate]}
          onPress={() => setViewMode("list")}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleButtonText, viewMode === "list" && styles.toggleButtonTextActivate]}>
            Liste
          </Text>
        </TouchableOpacity>
      </View>

      {/* Selected date events preview (grid view only) */}
      {viewMode === "grid" && (
        <View style={styles.eventPreview}>
          <Text style={styles.eventPreviewTitle}>
            {new Date(selectedDate).toLocaleDateString("nb-NO", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
          {selectedDateEvents.length === 0 ? (
            <Text style={styles.noEventsText}>Ingen hendelser denne dagen</Text>
          ) : (
            selectedDateEvents.map((event) => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventItemRow}>
                  {event.isSpecialOccasion && (
                    <Ionicons name="star" size={14} color={Colors.yellow} style={{ marginRight: 4 }} />
                  )}
                  <Text style={styles.eventItemTitle}>{event.title}</Text>
                </View>
                {(event.startTime || event.groupName) && (
                  <Text style={styles.eventItemTime}>
                    {event.startTime || ""}{event.startTime && event.endTime ? ` - ${event.endTime}` : ""}
                    {event.groupName ? ` | ${event.groupName}` : " | Alle"}
                  </Text>
                )}
                {event.description && (
                  <Text style={styles.eventItemDesc} numberOfLines={2}>{event.description}</Text>
                )}
              </View>
            ))
          )}
        </View>
      )}

      {/* Calendar/List view */}
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
                activeOpacity={0.7}
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
                        {event.groupName ? ` (${event.groupName})` : ""}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 26,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  headerWrapper: {
    alignItems: "center",
    marginBottom: 8,
  },
  depText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
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
  toggleButtonActivate: {
    backgroundColor: Colors.primaryBlue,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textMuted,
  },
  toggleButtonTextActivate: {
    color: Colors.text,
    fontWeight: "700",
  },
  eventPreview: {
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.primaryLightBlue,
  },
  eventPreviewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
    textTransform: "capitalize",
  },
  noEventsText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  eventItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBlue,
  },
  eventItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
  },
  eventItemTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  eventItemDesc: {
    fontSize: 11,
    color: Colors.text,
    marginTop: 2,
  },
  listWrapper: {
    flex: 1,
    marginTop: 4,
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
    borderWidth: 1,
    borderColor: Colors.text,
  },
  listDayNumber: {
    fontSize: 12,
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
});
