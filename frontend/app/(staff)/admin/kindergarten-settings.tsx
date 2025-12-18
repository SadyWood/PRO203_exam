import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/colors";
import { getCurrentUser } from "@/services/authApi";
import { kindergartenApi, staffApi } from "@/services/staffApi";
import { AdminStyles } from "@/styles";
import type { KindergartenResponseDto, StaffResponseDto } from "@/services/types/staff";
import type { UserResponseDto } from "@/services/types/auth";

//  Kindergarten Settings Screen - update kindergarten information
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

        // Only BOSS can access this screen
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
            // Pre-fill form with current values
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

// Save updated kindergarten information
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
      <View style={[AdminStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <ScrollView style={AdminStyles.container}>
      {/* Header */}
      <View style={AdminStyles.header}>
        <Pressable onPress={() => router.replace("/(staff)/admin/administration")} style={AdminStyles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={AdminStyles.title}>Barnehageinnstillinger</Text>
        <View style={AdminStyles.headerSpacer} />
      </View>

      {/* Form Card */}
      <View style={AdminStyles.formCard}>
        <Text style={AdminStyles.formLabel}>Barnehagennavn *</Text>
        <TextInput
          style={AdminStyles.formInput}
          value={name}
          onChangeText={setName}
          placeholder="Skriv inn barnehagennavn"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={AdminStyles.formLabel}>Adresse</Text>
        <TextInput
          style={AdminStyles.formInput}
          value={address}
          onChangeText={setAddress}
          placeholder="Skriv inn adresse"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={AdminStyles.formLabel}>Telefon</Text>
        <TextInput
          style={AdminStyles.formInput}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Skriv inn telefonnummer"
          placeholderTextColor={Colors.textMuted}
          keyboardType="phone-pad"
        />

        <Text style={AdminStyles.formLabel}>E-post</Text>
        <TextInput
          style={AdminStyles.formInput}
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
        style={[AdminStyles.saveButton, saving && AdminStyles.saveButtonDisabled, { marginBottom: 20 }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={AdminStyles.saveButtonText}>Lagre endringer</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
