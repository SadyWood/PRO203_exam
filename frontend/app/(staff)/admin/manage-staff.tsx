import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/colors";
import { getCurrentUser } from "@/services/authApi";
import { staffApi } from "@/services/staffApi";
import type { StaffResponseDto } from "@/services/types/staff";
import type { UserResponseDto } from "@/services/types/auth";

export default function ManageStaffScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [currentStaff, setCurrentStaff] = useState<StaffResponseDto | null>(null);
  const [staffList, setStaffList] = useState<StaffResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Check if user is BOSS
      if (currentUser?.role !== "BOSS") {
        Alert.alert("Ingen tilgang", "Du har ikke tilgang til denne siden.");
        router.back();
        return;
      }

      if (currentUser?.profileId) {
        const staff = await staffApi.getCurrentStaff(currentUser.profileId);
        setCurrentStaff(staff);

        // Get all staff at kindergarten
        const allStaff = await staffApi.getAllStaffAtKindergarten();
        setStaffList(allStaff);
      }
    } catch (err) {
      console.log("Feil ved lasting av data:", err);
      Alert.alert("Feil", "Kunne ikke laste ansatte.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePromote(staff: StaffResponseDto) {
    Alert.alert(
      "Gi admin-rettigheter",
      `Vil du gi ${staff.firstName} ${staff.lastName} admin-rettigheter?`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Gi rettigheter",
          onPress: async () => {
            setActionLoading(staff.id);
            try {
              await staffApi.promoteToAdmin(staff.id);
              Alert.alert("Suksess", `${staff.firstName} har nå admin-rettigheter.`);
              loadData();
            } catch (err: any) {
              Alert.alert("Feil", err?.message || "Kunne ikke gi admin-rettigheter.");
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  }

  async function handleDemote(staff: StaffResponseDto) {
    Alert.alert(
      "Fjern admin-rettigheter",
      `Vil du fjerne admin-rettigheter fra ${staff.firstName} ${staff.lastName}?`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Fjern rettigheter",
          style: "destructive",
          onPress: async () => {
            setActionLoading(staff.id);
            try {
              await staffApi.demoteFromAdmin(staff.id);
              Alert.alert("Suksess", `Admin-rettigheter er fjernet fra ${staff.firstName}.`);
              loadData();
            } catch (err: any) {
              Alert.alert("Feil", err?.message || "Kunne ikke fjerne admin-rettigheter.");
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Administrer ansatte</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Staff List */}
      <ScrollView style={styles.listContainer}>
        {staffList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="person-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Ingen ansatte funnet</Text>
          </View>
        ) : (
          staffList.map((staff) => {
            const isCurrentUser = staff.id === currentStaff?.id;
            const isLoading = actionLoading === staff.id;

            return (
              <View key={staff.id} style={styles.staffCard}>
                <View style={styles.staffAvatar}>
                  <Text style={styles.staffInitial}>
                    {staff.firstName.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.staffInfo}>
                  <View style={styles.staffNameRow}>
                    <Text style={styles.staffName}>
                      {staff.firstName} {staff.lastName}
                    </Text>
                    {staff.isAdmin && (
                      <View style={styles.adminBadge}>
                        <Text style={styles.adminBadgeText}>Admin</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.staffPosition}>
                    {staff.position || "Ansatt"}
                  </Text>
                  {staff.email && (
                    <Text style={styles.staffEmail}>{staff.email}</Text>
                  )}
                </View>

                {!isCurrentUser && (
                  <View style={styles.staffActions}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color={Colors.primaryBlue} />
                    ) : staff.isAdmin ? (
                      <Pressable
                        onPress={() => handleDemote(staff)}
                        style={styles.demoteButton}
                      >
                        <Ionicons name="remove-circle-outline" size={22} color="#B91C1C" />
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => handlePromote(staff)}
                        style={styles.promoteButton}
                      >
                        <Ionicons name="add-circle-outline" size={22} color={Colors.primaryBlue} />
                      </Pressable>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <Ionicons name="add-circle-outline" size={18} color={Colors.primaryBlue} />
          <Text style={styles.legendText}>Gi admin-rettigheter</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="remove-circle-outline" size={18} color="#B91C1C" />
          <Text style={styles.legendText}>Fjern admin-rettigheter</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  listContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 12,
  },
  staffCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  staffAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLightBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  staffInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primaryBlue,
  },
  staffInfo: {
    flex: 1,
  },
  staffNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  staffName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  adminBadge: {
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  staffPosition: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  staffEmail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  staffActions: {
    paddingLeft: 8,
  },
  promoteButton: {
    padding: 8,
  },
  demoteButton: {
    padding: 8,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
