import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { EmployeeHomeStyles } from "@/styles";
import { Colors } from "@/constants/colors";
import { getCurrentUser } from "@/services/authApi";
import { UserResponseDto } from "@/services/types/auth";
import { staffApi, kindergartenApi, StaffResponseDto, KindergartenResponseDto } from "@/services/staffApi";
import { checkerApi } from "@/services/checkerApi";
import type { CheckerResponseDto } from "@/services/types/checker";

type CheckStatus = "NONE" | "INN" | "HENTET" | "SYK" | "FERIE";

type ChildStatus = {
  status: CheckStatus;
  time?: string;
};

const MOCK_AGENDA = [
  {
    title: "Dagens plan",
    date: new Date().toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "2-digit" }),
    items: [
      "Felles oppstart: 08:45",
      "Tegne/puslespill: 09:00 - 10:00",
      "Leseøkt: 10:15 - 10:45",
      "Ryddetid: 10:45 - 11:00",
      "Lunsj: 11:00",
      "Sovetid: 11:30",
      "Stå opp og spise matpakke: 13:30",
      "Utelek: 14:30",
    ],
  },
];

export default function EmployeeHomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffResponseDto | null>(null);
  const [kindergarten, setKindergarten] = useState<KindergartenResponseDto | null>(null);
  const [activeCheckins, setActiveCheckins] = useState<CheckerResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser?.profileId) {
        try {
          const staff = await staffApi.getCurrentStaff(currentUser.profileId);
          setStaffProfile(staff);

          if (staff.kindergartenId) {
            try {
              const kg = await kindergartenApi.getKindergarten(staff.kindergartenId);
              setKindergarten(kg);
            } catch (kgErr) {
              console.log("Feil ved uthenting av barnehage:", kgErr);
            }
          }
        } catch (staffErr) {
          console.log("Feil ved uthenting av ansattprofil:", staffErr);
        }
      }

      // Get active check-ins
      try {
        const active = await checkerApi.getActive();
        setActiveCheckins(active);
      } catch (checkinErr) {
        console.log("Feil ved uthenting av innsjekking:", checkinErr);
      }
    } catch (err) {
      console.log("Feil ved lasting av data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Calculate counts from active check-ins
  const presentCount = activeCheckins.length;
  // These would need backend support for sick/vacation status
  const pickedUpCount = 0;
  const sickCount = 0;
  const vacationCount = 0;

  const staffName = staffProfile
    ? staffProfile.firstName
    : user?.fullName?.split(" ")[0] ?? "Ansatt";
  const kindergartenName = kindergarten?.name ?? "Barnehage";
  const isBoss = user?.role === "BOSS";

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={EmployeeHomeStyles.scrollContent}>
      <Text style={EmployeeHomeStyles.bhgTitle}>{kindergartenName}</Text>

      <View style={EmployeeHomeStyles.employeeCard}>
        <Text style={EmployeeHomeStyles.employeeGreeting}>Hei {staffName}!</Text>
        {isBoss && (
          <View style={{ backgroundColor: Colors.primaryBlue, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4, alignSelf: "flex-start" }}>
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>Daglig leder</Text>
          </View>
        )}
      </View>

      <View style={EmployeeHomeStyles.quickActionsRow}>
        <Pressable
          style={[EmployeeHomeStyles.primaryBtn, EmployeeHomeStyles.primaryBtnNeutral]}
          onPress={() => router.push("/(staff)/employee-diaper-nap")}
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
          Dagens status
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

      {/* Boss Admin Section */}
      {isBoss && (
        <View style={EmployeeHomeStyles.statusCard}>
          <Text style={EmployeeHomeStyles.statusTitle}>Admin-funksjoner</Text>

          <Pressable
            style={[EmployeeHomeStyles.primaryBtn, { marginBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }]}
            onPress={() => router.push("/(staff)/admin/kindergarten-settings")}
          >
            <Ionicons name="settings-outline" size={18} color={Colors.text} />
            <Text style={EmployeeHomeStyles.primaryBtnText}>Barnehageinnstillinger</Text>
          </Pressable>

          <Pressable
            style={[EmployeeHomeStyles.primaryBtn, { marginBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }]}
            onPress={() => router.push("/(staff)/admin/manage-groups")}
          >
            <Ionicons name="people-outline" size={18} color={Colors.text} />
            <Text style={EmployeeHomeStyles.primaryBtnText}>Administrer grupper</Text>
          </Pressable>

          <Pressable
            style={[EmployeeHomeStyles.primaryBtn, { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }]}
            onPress={() => router.push("/(staff)/admin/manage-staff")}
          >
            <Ionicons name="person-outline" size={18} color={Colors.text} />
            <Text style={EmployeeHomeStyles.primaryBtnText}>Administrer ansatte</Text>
          </Pressable>
        </View>
      )}

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
