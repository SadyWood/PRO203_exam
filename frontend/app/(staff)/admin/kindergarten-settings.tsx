import {
  View,
  Text,
  ScrollView,
  TextInput,
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
import { kindergartenApi, staffApi } from "@/services/staffApi";
import type { KindergartenResponseDto, StaffResponseDto } from "@/services/types/staff";
import type { UserResponseDto } from "@/services/types/auth";

export default function KindergartenSettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffResponseDto | null>(null);
  const [kindergarten, setKindergarten] = useState<KindergartenResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
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
          setStaffProfile(staff);

          if (staff.kindergartenId) {
            const kg = await kindergartenApi.getKindergarten(staff.kindergartenId);
            setKindergarten(kg);
            // Pre-fill form
            setName(kg.name || "");
            setAddress(kg.address || "");
            setPhoneNumber(kg.phoneNumber || "");
            setEmail(kg.email || "");
          }
        }
      } catch (err) {
        console.log("Feil ved lasting av data:", err);
        Alert.alert("Feil", "Kunne ikke laste barnehageinnstillinger.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleSave() {
    if (!kindergarten?.id) return;

    if (!name.trim()) {
      Alert.alert("Feil", "Barnehagennavn er påkrevd.");
      return;
    }

    setSaving(true);
    try {
      const updated = await kindergartenApi.updateKindergarten(kindergarten.id, {
        name: name.trim(),
        address: address.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        email: email.trim() || undefined,
      });
      setKindergarten(updated);
      Alert.alert("Suksess", "Barnehageinnstillinger er oppdatert.");
    } catch (err: any) {
      console.log("Feil ved lagring:", err);
      Alert.alert("Feil", err?.message || "Kunne ikke lagre endringer.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Barnehageinnstillinger</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form */}
      <View style={styles.card}>
        <Text style={styles.label}>Barnehagennavn *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Skriv inn barnehagennavn"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.label}>Adresse</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Skriv inn adresse"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.label}>Telefon</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Skriv inn telefonnummer"
          placeholderTextColor={Colors.textMuted}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>E-post</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Skriv inn e-post"
          placeholderTextColor={Colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Save Button */}
      <Pressable
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Lagre endringer</Text>
        )}
      </Pressable>
    </ScrollView>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: Colors.background,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
