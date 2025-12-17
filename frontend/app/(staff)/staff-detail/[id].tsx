import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import {
  staffApi,
  groupApi,
  StaffResponseDto,
  GroupResponseDto,
} from "@/services/staffApi";

export default function StaffDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [staffMember, setStaffMember] = useState<StaffResponseDto | null>(null);
  const [groups, setGroups] = useState<GroupResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      // Fetch staff info
      const staff = await staffApi.getCurrentStaff(id!);
      setStaffMember(staff);

      // Fetch groups this staff belongs to
      try {
        const staffGroups = await groupApi.getGroupsByStaff(id!);
        setGroups(staffGroups || []);
      } catch {
        setGroups([]);
      }

    } catch (err) {
      console.log("Feil ved lasting av data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCall = (phoneNumber?: string) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleEmail = (email?: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  if (!staffMember) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.errorText}>Kunne ikke finne ansatt</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Gå tilbake</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Ansattprofil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Staff Info Card */}
        <View style={styles.card}>
          <View style={styles.staffHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {staffMember.firstName.charAt(0)}{staffMember.lastName.charAt(0)}
              </Text>
            </View>
            <View style={styles.staffInfo}>
              <Text style={styles.staffName}>
                {staffMember.firstName} {staffMember.lastName}
              </Text>
              <Text style={styles.staffPosition}>
                {staffMember.position || "Ansatt"}
              </Text>
              {staffMember.isAdmin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>Administrator</Text>
                </View>
              )}
            </View>
          </View>

          {staffMember.employeeId && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ansattnummer</Text>
              <Text style={styles.infoValue}>{staffMember.employeeId}</Text>
            </View>
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="call-outline" size={20} color={Colors.primaryBlue} />
            <Text style={styles.cardTitle}>Kontaktinformasjon</Text>
          </View>

          <View style={styles.contactActions}>
            {staffMember.phoneNumber && (
              <Pressable
                style={styles.contactButton}
                onPress={() => handleCall(staffMember.phoneNumber)}
              >
                <Ionicons name="call" size={20} color="#fff" />
                <Text style={styles.contactButtonText}>Ring</Text>
              </Pressable>
            )}

            {staffMember.email && (
              <Pressable
                style={[styles.contactButton, styles.contactButtonSecondary]}
                onPress={() => handleEmail(staffMember.email)}
              >
                <Ionicons name="mail" size={20} color={Colors.primaryBlue} />
                <Text style={[styles.contactButtonText, styles.contactButtonTextSecondary]}>
                  E-post
                </Text>
              </Pressable>
            )}
          </View>

          {staffMember.phoneNumber && (
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={18} color={Colors.textMuted} />
              <Text style={styles.contactText}>{staffMember.phoneNumber}</Text>
            </View>
          )}

          {staffMember.email && (
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
              <Text style={styles.contactText}>{staffMember.email}</Text>
            </View>
          )}
        </View>

        {/* Groups */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people-outline" size={20} color={Colors.primaryBlue} />
            <Text style={styles.cardTitle}>Avdelinger</Text>
          </View>

          {groups.length === 0 ? (
            <Text style={styles.noDataText}>Ikke tilknyttet noen avdelinger</Text>
          ) : (
            groups.map((group) => (
              <View key={group.id} style={styles.groupRow}>
                <View style={styles.groupIcon}>
                  <Ionicons name="people" size={16} color={Colors.primaryBlue} />
                </View>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupStats}>
                    {group.childCount} barn, {group.staffCount} ansatte
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  backLink: {
    marginTop: 16,
  },
  backLinkText: {
    color: Colors.primaryBlue,
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    padding: 16,
    marginBottom: 16,
  },
  staffHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  staffPosition: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  adminBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 6,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B45309",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryLightBlue,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  contactActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 12,
    borderRadius: 999,
  },
  contactButtonSecondary: {
    backgroundColor: Colors.primaryLightBlue,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  contactButtonTextSecondary: {
    color: Colors.primaryBlue,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  contactText: {
    fontSize: 14,
    color: Colors.text,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLightBlue,
  },
  groupIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  groupStats: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
