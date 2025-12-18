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
import { AdminStyles } from "@/styles";
import type { StaffResponseDto } from "@/services/types/staff";
import type { UserResponseDto } from "@/services/types/auth";

// Manage Staff Screen - Allows boss to promote, demote staff

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

// Load staff data
  async function loadData() {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Only BOSS can access this screen
      if (currentUser?.role !== "BOSS") {
        Alert.alert("Ingen tilgang", "Du har ikke tilgang til denne siden.");
        router.back();
        return;
      }

      if (currentUser?.profileId) {
        const staff = await staffApi.getCurrentStaff(currentUser.profileId);
        setCurrentStaff(staff);

        // Get all staff at kindergarten and filter out BOSS
        const allStaff = await staffApi.getAllStaffAtKindergarten();
        // Exclude BOSS user - no reason to show them in the list
        const filteredStaff = allStaff.filter(s => s.id !== currentUser.profileId);
        setStaffList(filteredStaff);
      }
    } catch (err) {
      console.log("Feil ved lasting av data:", err);
      Alert.alert("Feil", "Kunne ikke laste ansatte.");
    } finally {
      setLoading(false);
    }
  }

// Promote a staff member to admin with confirmation
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

// Demote a staff member from admin with confirmation
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
      <View style={[AdminStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={AdminStyles.container}>
      {/* Header */}
      <View style={AdminStyles.header}>
        <Pressable onPress={() => router.replace("/(staff)/admin/administration")} style={AdminStyles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={AdminStyles.title}>Administrer ansatte</Text>
        <View style={AdminStyles.headerSpacer} />
      </View>

      {/* Staff List */}
      <ScrollView style={AdminStyles.listContainer}>
        {staffList.length === 0 ? (
          <View style={AdminStyles.emptyState}>
            <Ionicons name="person-outline" size={48} color={Colors.textMuted} />
            <Text style={AdminStyles.emptyText}>Ingen ansatte funnet</Text>
          </View>
        ) : (
          staffList.map((staff) => {
            const isLoading = actionLoading === staff.id;

            return (
              <View key={staff.id} style={AdminStyles.card}>
                <View style={AdminStyles.staffAvatar}>
                  <Text style={AdminStyles.staffInitial}>
                    {staff.firstName.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={AdminStyles.cardInfo}>
                  <View style={AdminStyles.staffNameRow}>
                    <Text style={AdminStyles.cardTitle}>
                      {staff.firstName} {staff.lastName}
                    </Text>
                    {staff.isAdmin && (
                      <View style={AdminStyles.adminBadge}>
                        <Text style={AdminStyles.adminBadgeText}>Admin</Text>
                      </View>
                    )}
                  </View>
                  <Text style={AdminStyles.cardSubtitle}>
                    {staff.position || "Ansatt"}
                  </Text>
                  {staff.email && (
                    <Text style={styles.staffEmail}>{staff.email}</Text>
                  )}
                </View>

                <View style={styles.staffActions}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primaryBlue} />
                  ) : staff.isAdmin ? (
                    <Pressable
                      onPress={() => handleDemote(staff)}
                      style={AdminStyles.actionButton}
                    >
                      <Ionicons name="remove-circle-outline" size={22} color="#B91C1C" />
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => handlePromote(staff)}
                      style={AdminStyles.actionButton}
                    >
                      <Ionicons name="add-circle-outline" size={22} color={Colors.primaryBlue} />
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Legend explaining the action icons */}
      <View style={AdminStyles.legend}>
        <View style={AdminStyles.legendItem}>
          <Ionicons name="add-circle-outline" size={18} color={Colors.primaryBlue} />
          <Text style={AdminStyles.legendText}>Gi admin-rettigheter</Text>
        </View>
        <View style={AdminStyles.legendItem}>
          <Ionicons name="remove-circle-outline" size={18} color="#B91C1C" />
          <Text style={AdminStyles.legendText}>Fjern admin-rettigheter</Text>
        </View>
      </View>
    </View>
  );
}

// Local styles for elements not in shared AdminStyles
const styles = StyleSheet.create({
  staffEmail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  staffActions: {
    paddingLeft: 8,
  },
});
