import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";

import { EmployeeHomeStyles } from "@/styles";

const CHECKIN_STORAGE_KEY = "employee_checkin_statuses_bjorn";

type CheckStatus = "NONE" | "INN" | "HENTET" | "SYK" | "FERIE";

type ChildStatus = {
  status: CheckStatus;
  time?: string;
};

const MOCK_EMPLOYEE = {
  name: "Maiken",
  department: "Avdeling Bjørn",
};

const MOCK_AGENDA = [
  {
    title: "Dagens plan - Avdeling Bjørn",
    date: "09.01.26",
    items: [
      "Felles oppstart: 08:45",
      "Tegne/puslespill: 09:00 - 10:00",
      "Leseøkt: 10:15 - 10:45",
      "Ryddetid: 10:45 - 11:00",
      "Lunsj: 11:00, dagens varmmat: Pasta",
      "Sovetid: 11:30",
      "Stå opp og spise matpakke: 13:30",
      "Leke ute i snøen kl. 14:30",
    ],
  },
];

export default function EmployeeHomeScreen() {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, ChildStatus>>({});

  /**
   * TODO (BACKEND):
   * - Erstatt AsyncStorage med API-kall
   * - Endepunkt bør returnere status per barn for avdelingen
   * - Fjern CHECKIN_STORAGE_KEY når backend er koblet
   */
  const loadStatuses = useCallback(async () => {
    const stored = await AsyncStorage.getItem(CHECKIN_STORAGE_KEY);
    setStatuses(stored ? JSON.parse(stored) : {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStatuses();
    }, [loadStatuses])
  );

  const presentCount = Object.values(statuses).filter((s) => s.status === "INN").length;
  const pickedUpCount = Object.values(statuses).filter((s) => s.status === "HENTET").length;
  const sickCount = Object.values(statuses).filter((s) => s.status === "SYK").length;
  const vacationCount = Object.values(statuses).filter((s) => s.status === "FERIE").length;

  return (
    <ScrollView contentContainerStyle={EmployeeHomeStyles.scrollContent}>
      <Text style={EmployeeHomeStyles.bhgTitle}>Eventyrhagen Barnehage</Text>

      <View style={EmployeeHomeStyles.employeeCard}>
        <Text style={EmployeeHomeStyles.employeeGreeting}>Hei {MOCK_EMPLOYEE.name}!</Text>
        <Text style={EmployeeHomeStyles.employeeSub}>{MOCK_EMPLOYEE.department}</Text>
      </View>

      <View style={EmployeeHomeStyles.quickActionsRow}>
        <Pressable
          style={[EmployeeHomeStyles.primaryBtn, EmployeeHomeStyles.primaryBtnNeutral]}
        >
          <Text style={EmployeeHomeStyles.primaryBtnText}>Bleieskift & søvn</Text>
        </Pressable>

        <Pressable
          style={[EmployeeHomeStyles.primaryBtn, EmployeeHomeStyles.primaryBtnPrimary]}
          onPress={() => router.push("/(staff)/employee-messages")}
        >
          <Text style={EmployeeHomeStyles.primaryBtnText}>Meldinger</Text>
        </Pressable>

        <Pressable
          style={[EmployeeHomeStyles.primaryBtn, EmployeeHomeStyles.primaryBtnPrimary]}
          onPress={() => router.push("/(staff)/employee-children")}
        >
          <Text style={EmployeeHomeStyles.primaryBtnText}>Se avdelingen liste</Text>
        </Pressable>

        <Pressable
          style={[EmployeeHomeStyles.primaryBtn, EmployeeHomeStyles.primaryBtnPrimary]}
          onPress={() => router.push("/(staff)/employee-checkin")}
        >
          <Text style={EmployeeHomeStyles.primaryBtnText}>Sjekk inn / ut</Text>
        </Pressable>
      </View>

      <View style={EmployeeHomeStyles.statusCard}>
        <Text style={EmployeeHomeStyles.statusTitle}>
          Status for {MOCK_EMPLOYEE.department}
        </Text>

        <View style={EmployeeHomeStyles.statusRow}>
          <View style={[EmployeeHomeStyles.statusPill, EmployeeHomeStyles.statusPillIn]}>
            <View style={[EmployeeHomeStyles.statusDot, EmployeeHomeStyles.statusDotIn]} />
            <Text style={[EmployeeHomeStyles.statusText, EmployeeHomeStyles.statusTextIn]}>
              Til stede: {presentCount}
            </Text>
          </View>
        </View>

        <View style={EmployeeHomeStyles.statusRow}>
          <View style={[EmployeeHomeStyles.statusPill, EmployeeHomeStyles.statusPillOut]}>
            <View style={[EmployeeHomeStyles.statusDot, EmployeeHomeStyles.statusDotOut]} />
            <Text style={[EmployeeHomeStyles.statusText, EmployeeHomeStyles.statusTextOut]}>
              Hentet: {pickedUpCount}
            </Text>
          </View>
        </View>

        <View style={EmployeeHomeStyles.statusRow}>
          <View style={[EmployeeHomeStyles.statusPill, EmployeeHomeStyles.statusPillSick]}>
            <View style={[EmployeeHomeStyles.statusDot, EmployeeHomeStyles.statusDotSick]} />
            <Text style={[EmployeeHomeStyles.statusText, EmployeeHomeStyles.statusTextSick]}>
              Syke: {sickCount}
            </Text>
          </View>
        </View>

        <View style={EmployeeHomeStyles.statusRow}>
          <View style={[EmployeeHomeStyles.statusPill, EmployeeHomeStyles.statusPillVacation]}>
            <View style={[EmployeeHomeStyles.statusDot, EmployeeHomeStyles.statusDotVacation]} />
            <Text style={[EmployeeHomeStyles.statusText, EmployeeHomeStyles.statusTextVacation]}>
              På ferie: {vacationCount}
            </Text>
          </View>
        </View>
      </View>

      {MOCK_AGENDA.map((agenda) => (
        <View key={agenda.title} style={EmployeeHomeStyles.agendaCard}>
          <Text style={EmployeeHomeStyles.agendaTitle}>{agenda.title}</Text>
          <View style={EmployeeHomeStyles.agendaBox}>
            <Text style={EmployeeHomeStyles.agendaDate}>{agenda.date}</Text>
            {agenda.items.map((item) => (
              <Text key={item} style={EmployeeHomeStyles.agendaItem}>
                • {item}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
