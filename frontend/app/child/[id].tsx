import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, ActivityIndicator} from "react-native";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {useLocalSearchParams, useRouter, useFocusEffect} from "expo-router";
import {useCallback, useState} from "react";
import {getHealthData} from "@/services/healthApi";
import {HealthDataResponseDto} from "@/services/types/health";
import {fetchCurrentUser} from "@/services/authApi";

export default function ChildProfile() {
  const router = useRouter();

  const {id} = useLocalSearchParams<{id: string}>();
  const [childData, setChildData] = useState<any>(null);
  const [healthData, setHealthData] = useState<HealthDataResponseDto | null>(null);
  const [sharePhotos, setSharePhotos] = useState(true);
  const [tripPermission, setTripPermission] = useState(true);
  const [showNamePublic, setShowNamePublic] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const childRes = await fetchCurrentUser(`/api/children/${id}`);

      if(childRes.ok){
        const child = await childRes.json();
        setChildData(child);
      }

      const health = await getHealthData(id);
      setHealthData(health);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Reload data when screen comes into focus (e.g., returning from edit)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const allergiesList: string[] = healthData?.allergies
    ? healthData.allergies.split(",").map((a: string) => a.trim()).filter(Boolean)
      : [];

  // Show loading state while fetching data
  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  // Show error state if no child data
  if (!childData) {
    return (
      <View style={styles.screen}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/profile")}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCard}>
          <Text style={styles.childName}>Kunne ikke laste barnedata</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/profile")}>
        <Ionicons name="chevron-back" size={26} color={Colors.text} />
      </TouchableOpacity>


      <View style={styles.headerCard}>
        <Image
          source={{ uri: "https://.../api/portraits/.jpg" }}
          style={styles.avatar}
        />

        <View style={styles.headerTextBox}>
          <Text style={styles.childName}>
            {childData?.firstName} {childData?.lastName}
          </Text>

          <View style={styles.dateChip}>
          <Text style={{ fontSize: 14, marginRight: 4 }}>🎂</Text>
          <Text style={styles.dateText}>
            {childData?.birthDate
            ? new Date(childData.birthDate).toLocaleDateString("no-NO")
            : "Ikke oppgitt"}
          </Text>
        </View>

        </View>
      </View>

      <View style={styles.departmentBar}>
        <Text style={styles.departmentText}>Avdeling: {childData?.groupName || "Ikke tildelt"}</Text>
      </View>

      <Text style={styles.sectionTitle}>Tillatelser</Text>

      <View style={styles.permissionRow}>
        <Text style={styles.permissionLabel}>Deling av bilder:</Text>
        <Switch value={sharePhotos} onValueChange={setSharePhotos} />
      </View>

      <View style={styles.permissionRow}>
        <Text style={styles.permissionLabel}>Bli med på turer:</Text>
        <Switch value={tripPermission} onValueChange={setTripPermission} />
      </View>

      <View style={styles.permissionRow}>
        <Text style={styles.permissionLabel}>Dele barnets navn offentlig</Text>
        <Switch value={showNamePublic} onValueChange={setShowNamePublic} />
      </View>

      <Text style={styles.sectionTitle}>Helsehensyn</Text>

      {loading ? (
          <ActivityIndicator size="large" color={Colors.primaryBlue}/>
      ): healthData ? (

      <View style={styles.healthCard}>

        {allergiesList.length > 0 && (
            <View style={styles.healthGroup}>
              <Text style={styles.healthHeaderText}>Matallergier:</Text>
              {allergiesList.map((allergy: string, index: number) => (
                  <View key={index} style={styles.healthRow}>
                    <Text style={styles.healthRowText}>{allergy}</Text>
                  </View>
              ))}
            </View>
        )}

        {healthData.medicalConditions && (
            <View style={styles.healthGroup}>
              <Text style={styles.healthHeaderText}>Medisinske tilstander:</Text>
                  <View style={styles.healthRow}>
                    <Text style={styles.healthRowText}>{healthData.medicalConditions}</Text>
                  </View>
            </View>
        )}

        {healthData.medications && (
            <View style={styles.healthGroup}>
              <Text style={styles.healthHeaderText}>Medisiner:</Text>
                  <View style={styles.healthRow}>
                    <Text style={styles.healthRowText}>{healthData.medications}</Text>
                  </View>
            </View>
        )}

        {healthData.dietaryRestrictions && (
            <View style={styles.healthGroup}>
              <Text style={styles.healthHeaderText}>Restriksjoner:</Text>
                  <View style={styles.healthRow}>
                    <Text style={styles.healthRowText}>{healthData.dietaryRestrictions}</Text>
                  </View>
            </View>
        )}

        {healthData.emergencyContact && (
            <View style={styles.healthGroup}>
              <Text style={styles.healthHeaderText}>Primærkontakt:</Text>
                  <View style={styles.healthRow}>
                    <Text style={styles.healthRowText}>{healthData.emergencyContact}</Text>
                  </View>
            </View>
        )}
      </View>
          ) : (
              <View style={styles.headerCard}>
                <Text style={styles.noDataTxt}>Ingenting av helsedata er registrert.</Text>
              </View>
          )}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push(`/child/edit/${id}`)}
      >
        <Text style={styles.editButtonText}>Rediger helseinformasjon</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  noDataTxt:{

  },

  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  backButton: {
    marginBottom: 10,
  },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },

  headerTextBox: {
    flex: 1,
    justifyContent: "center",
  },

  childName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: Colors.text,
  },

  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#ffffff",
  },

  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },

  departmentBar: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 18,
  },

  departmentText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 4,
    color: Colors.text,
  },

  permissionRow: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  permissionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },

  healthCard: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  healthGroup: {
    marginBottom: 14,
  },

  healthHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },

  healthRow: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },

  healthRowText: {
    fontSize: 14,
    color: Colors.text,
  },

  editButton: {
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#d4d4d4",
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
});