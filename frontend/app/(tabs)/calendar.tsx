import React, { useState } from "react";
import { View, 
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
 } from "react-native";
 import { Calendar, toDateId, type CalendarTheme } from "@marceloterreiro/flash-calendar";
 import { styles } from "../../styles/calendar-styles";
 import { Colors } from "@/constants/colors";

 const getMonthDays = (dateId: string) => {
  //som "2025-12-11"
  const [yearStr, monthStr] = dateId.split("-"); 
  const year = Number(yearStr);
  const month = Number(monthStr);
  const daysInMonth = new Date(year, month, 0).getDate();

  const result: { id: string; label: number}[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, "0");
    result.push({
      id: `${yearStr}-${monthStr}-${dayStr}`,
      label: day,
    });
  }
  return result;
 };

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
    //aktive datoer er fraværsdager 
    active: ({ isPressed }) => ({
      container: {
        borderRadius: 1,
        backgroundColor: Colors.red,
        borderWidth: 3,
        borderColor: "#a63838ff",
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
  const todayId = toDateId(new Date())
  //toggle for kalender, enten grid eller liste :p
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  //dato som er valgt (pressed on)
  const [selectedDate, setSelectedDate] = useState<string>(todayId);

  //alle fraværsdager
  const [absentIds, setAbsentIds] = useState<string[]>([]);

  //notater for kalender altså turdager, bursdag osv
  const [events, setEvents] = useState<Record<string, string>>({});

  //modaler
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isEventVisible, setIsEventVisible] = useState(false);

  const [eventText, setEventText] = useState("");

  const isSelectedAbsent = absentIds.includes(selectedDate);

  //gjør fraværsdagene om til ranges som kalenderen forstår
  const activateRange = absentIds.map((id) => ({
    startId: id,
    endId: id,
  }));

  // alle dagene i måneden (bruker den i listevisning)
  const monthDays = getMonthDays(todayId)

  //fravær knapp
  const handleAbsenceButtonPress = () => {
    if (isSelectedAbsent) {
      setAbsentIds((prev) => prev.filter((id) => id !== selectedDate));
      console.log("fjernet fravær for denne dato:", selectedDate);
    } else {
      setIsConfirmVisible(true);
    }
  };

  const handleConfirmAbsence = () => {
    setAbsentIds((prev) => 
    prev.includes(selectedDate) ? prev : [...prev, selectedDate]
  );
  console.log("registrer fravær for denne dato:", selectedDate);
  setIsConfirmVisible(false);

  //TODO backend her
  //await api.regostrerAbsence({ childi, date: selectedDate })
  };

  const openEventModal = () => {
    setEventText(events[selectedDate] ?? "");
    setIsEventVisible(true);
  };

  const handleSaveEvent = () => {
    setEvents((prev) => {
      const trimmed = eventText.trim();
      if (!trimmed) {
        const { [selectedDate]: _removed, ...rest } = prev;
        return rest;
      }
      return {...prev, [selectedDate]: trimmed };
    });
    setIsEventVisible(false);

    //TODO backend her
    //await api.savedaynote eller noe ({ date: selectedDate, text: eventText })
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.headerWrapper}>
        <Text style={styles.depText}>Avdeling Bjørn</Text>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
        style={[styles.toggleButton, 
        viewMode === "grid" && styles.toggleButtonActivate,]}
        onPress={() => setViewMode("grid")}
        activeOpacity={0.7}>
          <Text style={[styles.toggleButtonText, 
            viewMode === "grid" && styles.toggleButtonTextActivate,]}>
              Kalender</Text>
              </TouchableOpacity>

        <TouchableOpacity style={[styles.toggleButton, 
          viewMode === "list" && styles.toggleButtonActivate,]}
          onPress={() => setViewMode("list")}
          activeOpacity={0.7}>
            <Text style={[styles.toggleButtonText,
              viewMode === "list" && styles.toggleButtonTextActivate,]}>
                Liste</Text>
          </TouchableOpacity>
          
          </View>
          {viewMode === "grid" && events[selectedDate] && (
                  <View style={styles.eventPreview}>
                    <Text style={styles.eventPreviewTitle}>Notat for valgt dag</Text>
                    <Text style={styles.eventPreviewBody}>{events[selectedDate]}</Text>
                  </View>
                )}

      {viewMode === "grid" ? (
        <Calendar
        calendarMonthId={todayId}
        calendarActiveDateRanges={activateRange}
        onCalendarDayPress={(dateId) => {
          setSelectedDate(dateId);
        }}
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
            const isAbsent = absentIds.includes(dateId);
            const hasEvent = Boolean(events[dateId]);

            return (
              <TouchableOpacity
              key={dateId}
              style={[styles.listRow, isAbsent && styles.listRowAbsent,
                dateId === selectedDate && styles.listRowSelected,
              ]}
              onPress={() => setSelectedDate(dateId)}
              activeOpacity={0.7}>
                <Text style={styles.listDayNumber}>{day.label}</Text>
                <View style={styles.listContent}>
                  {hasEvent && (
                    <Text style={styles.listEventText}
                    numberOfLines={2}>{events[dateId]}</Text>
                  )}
                  {isAbsent && (
                    <Text style={styles.listAbsenceLabel}>Fravær</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <TouchableOpacity
      style={styles.absenceButton}
      onPress={handleAbsenceButtonPress}
      activeOpacity={0.6}
      >
        <Text style={styles.absenceButtonText}>{isSelectedAbsent ? "Fjern fravær" : "Registrer fravær her"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton}
      onPress={openEventModal}
      activeOpacity={0.6}>
        <Text style={styles.secondaryButtonText}>{events[selectedDate] ? "Rediger Tekst" : "Legg til tekst"}</Text>
      </TouchableOpacity>

      
      <Modal 
      visible={isConfirmVisible}
      transparent 
      animationType="fade"
      onRequestClose={() => setIsConfirmVisible(false)}
      >
      <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>Register fravær</Text>
        <Text style={styles.modalBody}>
          Du er nå i ferd med å registrere fravær. trykk på godkjenn ikonet nedenfor hvis 
          du har valgt riktig dag eller klikk på kryss ikonet dersom du ikke er sikker enda.
        </Text>
        <View style={styles.modalButtonsRow}>

          <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]}
          onPress={handleConfirmAbsence}
          activeOpacity={0.7}>
            <Text style={styles.modalButtonIcon}>✅</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]}
          onPress={() => setIsConfirmVisible(false)}
          activeOpacity={0.7}>
            <Text style={styles.modalButtonIcon}>❌</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
      </Modal>

      <Modal 
      visible={isEventVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsEventVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Notat for valgt dag</Text>
            <TextInput style={styles.eventInput}
              placeholder="skriv inn bursdager, turdager m.m her!"
              placeholderTextColor={Colors.textMuted}
              multiline value={eventText}
              onChangeText={setEventText}/>
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleSaveEvent}
                activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonIcon}>✅</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsEventVisible(false)}
                activeOpacity={0.7}>
                  <Text style={styles.modalButtonIcon}>❌</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>
      </View>
  );
 };