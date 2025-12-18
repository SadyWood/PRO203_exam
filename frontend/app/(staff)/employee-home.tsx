import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { EmployeeHomeStyles, AdminStyles } from "@/styles";
import { Colors } from "@/constants/colors";
import { getCurrentUser } from "@/services/authApi";
import { UserResponseDto } from "@/services/types/auth";
import { staffApi, kindergartenApi, groupApi, childrenApi, calendarApi, StaffResponseDto, KindergartenResponseDto, GroupResponseDto, ChildResponseDto, CalendarEventResponseDto } from "@/services/staffApi";
import { checkerApi } from "@/services/checkerApi";
import type { CheckerResponseDto } from "@/services/types/checker";

export default function EmployeeHomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffResponseDto | null>(null);
  const [kindergarten, setKindergarten] = useState<KindergartenResponseDto | null>(null);
  const [activeCheckins, setActiveCheckins] = useState<CheckerResponseDto[]>([]);
  const [groups, setGroups] = useState<GroupResponseDto[]>([]);
  const [allChildren, setAllChildren] = useState<ChildResponseDto[]>([]);
  const [allStaff, setAllStaff] = useState<StaffResponseDto[]>([]);
  const [todayEvents, setTodayEvents] = useState<CalendarEventResponseDto[]>([]);
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

            // Fetch today's calendar events
            try {
              const today = new Date().toISOString().split("T")[0];
              const events = await calendarApi.getEventsByDateRange(staff.kindergartenId, today, today);
              setTodayEvents(events || []);
            } catch (calErr) {
              console.log("Feil ved uthenting av kalender:", calErr);
            }

            // Load boss-specific data
            if (currentUser.role === "BOSS") {
              try {
                const [groupsList, childrenList, staffList] = await Promise.all([
                  groupApi.getGroupsByKindergarten(staff.kindergartenId),
                  childrenApi.getAllChildren(),
                  staffApi.getAllStaffAtKindergarten(),
                ]);
                setGroups(groupsList || []);
                setAllChildren(childrenList || []);
                setAllStaff(staffList || []);
              } catch (bossErr) {
                console.log("Feil ved uthenting av boss-data:", bossErr);
              }
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

  // Boss dashboard calculations
  const totalChildren = allChildren.length;
  const totalStaff = allStaff.length;
  const todayDate = new Date().toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  // Calculate children per group with presence info
  const groupStats = groups.map(group => {
    const childrenInGroup = allChildren.filter(c => c.groupId === group.id);
    const presentInGroup = childrenInGroup.filter(c =>
      activeCheckins.some(checkin => checkin.childId === c.id)
    ).length;
    return {
      ...group,
      totalChildren: childrenInGroup.length,
      presentChildren: presentInGroup,
    };
  });

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

      {/* Boss-only: Quick access to administration menu */}
      {isBoss && (
        <Pressable
          style={AdminStyles.adminButton}
          onPress={() => router.push("/(staff)/admin/administration")}
        >
          <Ionicons name="settings-outline" size={20} color="#fff" />
          <Text style={AdminStyles.adminButtonText}>Administrer</Text>
        </Pressable>
      )}

      <View style={EmployeeHomeStyles.quickActionsRow}>
        {!isBoss && (
          <Pressable
            style={[EmployeeHomeStyles.primaryBtn, EmployeeHomeStyles.primaryBtnNeutral]}
            onPress={() => router.push("/(staff)/employee-diaper-nap")}
          >
            <Text style={EmployeeHomeStyles.primaryBtnText}>Bleieskift & søvn</Text>
          </Pressable>
        )}

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
          <Text style={EmployeeHomeStyles.primaryBtnText}>Avdelinger</Text>
        </Pressable>

        <Pressable
          style={[EmployeeHomeStyles.primaryBtn, EmployeeHomeStyles.primaryBtnPrimary]}
          onPress={() => router.push("/(staff)/employee-checkin")}
        >
          <Text style={EmployeeHomeStyles.primaryBtnText}>Sjekk inn / ut</Text>
        </Pressable>
      </View>

      {/* Boss sees Dashboard, Staff sees Dagens Status */}
      {isBoss ? (
        <>
          {/* Daily Summary Card */}
          <View style={EmployeeHomeStyles.statusCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text style={[EmployeeHomeStyles.statusTitle, { marginBottom: 0 }]}>Daglig sammendrag</Text>
              <Text style={{ fontSize: 11, color: Colors.textMuted, textTransform: "capitalize" }}>{todayDate}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 8 }}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "700", color: Colors.primaryBlue }}>{presentCount}</Text>
                <Text style={{ fontSize: 11, color: Colors.textMuted }}>Til stede</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "700", color: Colors.text }}>{totalChildren}</Text>
                <Text style={{ fontSize: 11, color: Colors.textMuted }}>Totalt barn</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "700", color: Colors.text }}>{totalStaff}</Text>
                <Text style={{ fontSize: 11, color: Colors.textMuted }}>Ansatte</Text>
              </View>
            </View>
          </View>

          {/* Groups Overview */}
          <View style={EmployeeHomeStyles.statusCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text style={[EmployeeHomeStyles.statusTitle, { marginBottom: 0 }]}>Avdelingsoversikt</Text>
              <Pressable onPress={() => router.push("/(staff)/admin/manage-groups")}>
                <Text style={{ fontSize: 11, color: Colors.primaryBlue, fontWeight: "600" }}>Administrer</Text>
              </Pressable>
            </View>

            {groupStats.length === 0 ? (
              <Text style={{ fontSize: 12, color: Colors.textMuted, fontStyle: "italic" }}>Ingen grupper opprettet</Text>
            ) : (
              groupStats.map((group) => (
                <View key={group.id} style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.primaryLightBlue,
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.text }}>{group.name}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={[EmployeeHomeStyles.statusPill, EmployeeHomeStyles.statusPillIn]}>
                      <Text style={[EmployeeHomeStyles.statusText, EmployeeHomeStyles.statusTextIn]}>
                        {group.presentChildren}/{group.totalChildren}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Today's Events - Always show card, with placeholder if empty */}
          <View style={EmployeeHomeStyles.statusCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text style={[EmployeeHomeStyles.statusTitle, { marginBottom: 0 }]}>Dagens hendelser</Text>
              <Pressable onPress={() => router.push("/(staff)/employee-calendar")}>
                <Ionicons name="add-circle-outline" size={22} color={Colors.primaryBlue} />
              </Pressable>
            </View>

            {todayEvents.length === 0 ? (
              <Text style={{ fontSize: 12, color: Colors.textMuted, fontStyle: "italic" }}>
                Ingen hendelser planlagt for i dag
              </Text>
            ) : (
              todayEvents.map((event) => (
                <View key={event.id} style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.primaryLightBlue,
                }}>
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginRight: 10,
                    backgroundColor: Colors.primaryBlue,
                  }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, color: Colors.text }}>{event.title}</Text>
                    {event.startTime && (
                      <Text style={{ fontSize: 11, color: Colors.textMuted }}>
                        {event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}
                        {event.groupName ? ` | ${event.groupName}` : ""}
                      </Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      ) : (
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
      )}


      {/* Staff sees daily events from calendar - always show with placeholder if empty */}
      {!isBoss && (
        <View style={EmployeeHomeStyles.agendaCard}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={EmployeeHomeStyles.agendaTitle}>Dagens hendelser</Text>
            <Pressable onPress={() => router.push("/(staff)/employee-calendar")}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.primaryBlue} />
            </Pressable>
          </View>
          <View style={EmployeeHomeStyles.agendaBox}>
            <Text style={EmployeeHomeStyles.agendaDate}>
              {new Date().toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit", year: "2-digit" })}
            </Text>
            {todayEvents.length === 0 ? (
              <Text style={[EmployeeHomeStyles.agendaItem, { fontStyle: "italic", color: Colors.textMuted }]}>
                Ingen hendelser planlagt for i dag
              </Text>
            ) : (
              todayEvents.map((event) => (
                <Text key={event.id} style={EmployeeHomeStyles.agendaItem}>
                  • {event.startTime ? `${event.startTime}: ` : ""}{event.title}
                  {event.groupName ? ` (${event.groupName})` : ""}
                </Text>
              ))
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
