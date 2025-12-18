import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/services/authApi";
import { getHealthData, updateHealthData, createHealthData } from "@/services/healthApi";
import { HealthDataResponseDto } from "@/services/types/health";

export default function EditChildProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [childData, setChildData] = useState<any>(null);
  const [hasExistingHealth, setHasExistingHealth] = useState(false);

  // Form fields
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Fetch child data
        const childRes = await fetchCurrentUser(`/api/children/${id}`);
        if (childRes.ok) {
          const child = await childRes.json();
          setChildData(child);
        }

        // Fetch health data
        const health = await getHealthData(id);
        if (health) {
          setHasExistingHealth(true);
          setAllergies(health.allergies || "");
          setMedicalConditions(health.medicalConditions || "");
          setMedications(health.medications || "");
          setDietaryRestrictions(health.dietaryRestrictions || "");
          setEmergencyContact(health.emergencyContact || "");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      const healthData = {
        allergies: allergies.trim() || undefined,
        medicalConditions: medicalConditions.trim() || undefined,
        medications: medications.trim() || undefined,
        dietaryRestrictions: dietaryRestrictions.trim() || undefined,
        emergencyContact: emergencyContact.trim() || undefined,
      };

      let result: HealthDataResponseDto | null = null;

      // Always try update first (in case data exists but wasn't loaded properly)
      try {
        result = await updateHealthData(id, healthData);
      } catch (updateError: any) {
        // If update fails because no data exists, try create
        if (updateError.message?.includes("not found") || updateError.message?.includes("404")) {
          result = await createHealthData(id, healthData);
        } else {
          throw updateError;
        }
      }

      // If update returned null but no error, try create as fallback
      if (!result && !hasExistingHealth) {
        result = await createHealthData(id, healthData);
      }

      if (result) {
        // Navigate back immediately - the child profile will reload data on focus
        router.back();
      } else {
        Alert.alert("Feil", "Kunne ikke lagre endringene. Prøv igjen.");
      }
    } catch (error: any) {
      console.error("Error saving:", error);
      // If it's "already exists" error, the data was saved, just go back
      if (error.message?.includes("already exists")) {
        router.back();
      } else {
        Alert.alert("Feil", "Kunne ikke lagre endringene. Prøv igjen.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color={Colors.text} />
      </TouchableOpacity>

      <Text style={styles.title}>Rediger helseinformasjon</Text>
      {childData && (
        <Text style={styles.subtitle}>
          For {childData.firstName} {childData.lastName}
        </Text>
      )}

      <Text style={styles.sectionTitle}>Allergier</Text>
      <TextInput
        style={styles.input}
        value={allergies}
        onChangeText={setAllergies}
        placeholder="F.eks. nøtter, melk, egg (skill med komma)"
        placeholderTextColor={Colors.textMuted}
        multiline
      />

      <Text style={styles.sectionTitle}>Medisinske tilstander</Text>
      <TextInput
        style={styles.input}
        value={medicalConditions}
        onChangeText={setMedicalConditions}
        placeholder="F.eks. astma, diabetes"
        placeholderTextColor={Colors.textMuted}
        multiline
      />

      <Text style={styles.sectionTitle}>Medisiner</Text>
      <TextInput
        style={styles.input}
        value={medications}
        onChangeText={setMedications}
        placeholder="Medisiner barnet tar regelmessig"
        placeholderTextColor={Colors.textMuted}
        multiline
      />

      <Text style={styles.sectionTitle}>Kostholdsrestriksjoner</Text>
      <TextInput
        style={styles.input}
        value={dietaryRestrictions}
        onChangeText={setDietaryRestrictions}
        placeholder="F.eks. vegetar, halal, glutenfri"
        placeholderTextColor={Colors.textMuted}
        multiline
      />

      <Text style={styles.sectionTitle}>Nødkontakt</Text>
      <TextInput
        style={styles.input}
        value={emergencyContact}
        onChangeText={setEmergencyContact}
        placeholder="Navn og telefonnummer"
        placeholderTextColor={Colors.textMuted}
      />

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? "Lagrer..." : "Lagre endringer"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Avbryt</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 48,
  },
  saveButton: {
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#E5E7EB",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});
