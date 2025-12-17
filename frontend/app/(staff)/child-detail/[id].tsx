import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import {
  childrenApi,
  healthApi,
  parentApi,
  relationshipApi,
  ChildResponseDto,
  HealthDataResponseDto,
  ParentResponseDto,
  ParentChildDto,
} from "@/services/staffApi";

type ParentWithRelationship = ParentResponseDto & {
  relationship?: ParentChildDto;
};

export default function ChildDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [child, setChild] = useState<ChildResponseDto | null>(null);
  const [healthData, setHealthData] = useState<HealthDataResponseDto | null>(null);
  const [parents, setParents] = useState<ParentWithRelationship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      // Fetch child info
      const childData = await childrenApi.getChildById(id!);
      setChild(childData);

      // Fetch health data
      try {
        const health = await healthApi.getHealthDataByChild(id!);
        setHealthData(health);
      } catch {
        setHealthData(null);
      }

      // Fetch parent relationships
      try {
        const relationships = await relationshipApi.getRelationshipsByChild(id!);

        // Fetch parent details for each relationship
        const parentPromises = relationships.map(async (rel): Promise<ParentWithRelationship | null> => {
          try {
            const parent = await parentApi.getParentById(rel.parentId);
            return { ...parent, relationship: rel };
          } catch {
            return null;
          }
        });

        const parentResults = await Promise.all(parentPromises);
        const validParents = parentResults.filter((p): p is ParentWithRelationship => p !== null);
        setParents(validParents);
      } catch {
        setParents([]);
      }

    } catch (err) {
      console.log("Feil ved lasting av data:", err);
    } finally {
      setLoading(false);
    }
  }

  const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return "Ukjent alder";
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    if (today.getDate() < birth.getDate()) {
      months--;
    }

    if (years === 0) {
      return `${months} måneder`;
    }
    return `${years} år${months > 0 ? ` og ${months} mnd` : ""}`;
  };

  const formatBirthDate = (birthDate?: string): string => {
    if (!birthDate) return "Ukjent";
    return new Date(birthDate).toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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

  if (!child) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.errorText}>Kunne ikke finne barnet</Text>
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
        <Text style={styles.headerTitle}>Barneprofil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Child Info Card */}
        <View style={styles.card}>
          <View style={styles.childHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {child.firstName.charAt(0)}{child.lastName.charAt(0)}
              </Text>
            </View>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.firstName} {child.lastName}</Text>
              <Text style={styles.childAge}>{calculateAge(child.birthDate)}</Text>
              <View style={[
                styles.statusBadge,
                child.checkedIn ? styles.statusBadgeIn : styles.statusBadgeOut
              ]}>
                <Text style={[
                  styles.statusBadgeText,
                  child.checkedIn ? styles.statusBadgeTextIn : styles.statusBadgeTextOut
                ]}>
                  {child.checkedIn ? "Inne i barnehagen" : "Ikke innsjekket"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fødselsdato</Text>
            <Text style={styles.infoValue}>{formatBirthDate(child.birthDate)}</Text>
          </View>

          {child.groupName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Avdeling</Text>
              <Text style={styles.infoValue}>{child.groupName}</Text>
            </View>
          )}
        </View>

        {/* Health & Medical Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="medical-outline" size={20} color={Colors.primaryBlue} />
            <Text style={styles.cardTitle}>Helseinformasjon</Text>
          </View>

          {healthData ? (
            <>
              {healthData.allergies && (
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Allergier</Text>
                  <Text style={styles.healthValue}>{healthData.allergies}</Text>
                </View>
              )}

              {healthData.medicalConditions && (
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Medisinske tilstander</Text>
                  <Text style={styles.healthValue}>{healthData.medicalConditions}</Text>
                </View>
              )}

              {healthData.medications && (
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Medisiner</Text>
                  <Text style={styles.healthValue}>{healthData.medications}</Text>
                </View>
              )}

              {healthData.dietaryRestrictions && (
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Kostholdsbegrensninger</Text>
                  <Text style={styles.healthValue}>{healthData.dietaryRestrictions}</Text>
                </View>
              )}

              {healthData.emergencyContact && (
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Nødkontakt</Text>
                  <Text style={styles.healthValue}>{healthData.emergencyContact}</Text>
                </View>
              )}

              {!healthData.allergies && !healthData.medicalConditions && !healthData.medications && !healthData.dietaryRestrictions && (
                <Text style={styles.noDataText}>Ingen helseinformasjon registrert</Text>
              )}
            </>
          ) : (
            <Text style={styles.noDataText}>Ingen helseinformasjon registrert</Text>
          )}
        </View>

        {/* Parents / Contacts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people-outline" size={20} color={Colors.primaryBlue} />
            <Text style={styles.cardTitle}>Foresatte</Text>
          </View>

          {parents.length === 0 ? (
            <Text style={styles.noDataText}>Ingen foresatte registrert</Text>
          ) : (
            parents.map((parent) => (
              <View key={parent.id} style={styles.parentCard}>
                <View style={styles.parentInfo}>
                  <Text style={styles.parentName}>
                    {parent.firstName} {parent.lastName}
                  </Text>
                  {parent.relationship?.isPrimaryContact && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>Hovedkontakt</Text>
                    </View>
                  )}
                  {parent.relationship?.relationStatus && (
                    <Text style={styles.relationText}>
                      {parent.relationship.relationStatus}
                    </Text>
                  )}
                </View>

                <View style={styles.parentActions}>
                  {parent.phoneNumber && (
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleCall(parent.phoneNumber)}
                    >
                      <Ionicons name="call-outline" size={20} color={Colors.primaryBlue} />
                      <Text style={styles.actionButtonText}>Ring</Text>
                    </Pressable>
                  )}

                  {parent.email && (
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleEmail(parent.email)}
                    >
                      <Ionicons name="mail-outline" size={20} color={Colors.primaryBlue} />
                      <Text style={styles.actionButtonText}>E-post</Text>
                    </Pressable>
                  )}
                </View>

                {parent.phoneNumber && (
                  <Text style={styles.contactDetail}>{parent.phoneNumber}</Text>
                )}
                {parent.email && (
                  <Text style={styles.contactDetail}>{parent.email}</Text>
                )}

                {parent.relationship?.canCheckOut === false && (
                  <View style={styles.warningBadge}>
                    <Ionicons name="warning-outline" size={14} color="#B45309" />
                    <Text style={styles.warningText}>Kan ikke hente barnet</Text>
                  </View>
                )}
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
  childHeader: {
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
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  childAge: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 6,
  },
  statusBadgeIn: {
    backgroundColor: "#DCFCE7",
  },
  statusBadgeOut: {
    backgroundColor: "#FEE2E2",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadgeTextIn: {
    color: "#15803D",
  },
  statusBadgeTextOut: {
    color: "#B91C1C",
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
  healthRow: {
    marginBottom: 12,
  },
  healthLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  healthValue: {
    fontSize: 14,
    color: Colors.text,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  parentCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLightBlue,
  },
  parentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  parentName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  primaryBadge: {
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  relationText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  parentActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primaryLightBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primaryBlue,
  },
  contactDetail: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  warningText: {
    fontSize: 11,
    color: "#B45309",
    fontWeight: "500",
  },
});
