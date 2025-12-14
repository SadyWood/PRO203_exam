import { Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { fetchCurrentUser, UserResponseDto } from "../services/authApi";
import { EditProfileStyles } from "@/styles";

export default function EditProfileScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
     // TODO (BACKEND):
    // fetchCurrentUser() bør returnere oppdatert profil med feltene:
    // fullName, email (readonly), phoneNumber, address
    fetchCurrentUser()
      .then((user: UserResponseDto | null) => {
        if (!user) return;
        setFullName(user.fullName ?? "");
        setEmail(user.email ?? "");
        setPhoneNumber(user.phoneNumber ?? "");
        setAddress(user.address ?? "");
      })
      .catch((err) => console.log("Feil ved henting av bruker:", err));
  }, []);

  async function handleSave() {
    console.log("Profile update payload:", {
      fullName,
      phoneNumber,
      address,
    });
     // TODO (BACKEND):
    // Implementer update profile endpoint + client-kall:
    // - Lag en funksjon i authApi f.eks. updateProfile({ fullName, phoneNumber, address })
   // - Send PATCH/PUT til backend (email skal ikke endres her)
    // - Oppdater cached user / refetch fetchCurrentUser() etter lagring
    // - Håndter validering og feilmeldinger fra backend
    console.log("Profile update payload:", { fullName, phoneNumber, address });

    Alert.alert("Backend kommer", "Endringer lagres når backend er klar.");
    router.back();
  }

  return (
    <ScrollView
      style={EditProfileStyles.screen}
      contentContainerStyle={EditProfileStyles.container}
    >
      <Text style={EditProfileStyles.title}>Rediger profil</Text>

      <Text style={EditProfileStyles.label}>Fullt navn</Text>
      <TextInput
        style={EditProfileStyles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Fullt navn"
      />

      <Text style={EditProfileStyles.label}>E-post</Text>
      <TextInput
        style={[EditProfileStyles.input, EditProfileStyles.inputDisabled]}
        value={email}
        editable={false}
        selectTextOnFocus={false}
      />

      <Text style={EditProfileStyles.label}>Telefonnummer</Text>
      <TextInput
        style={EditProfileStyles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholder="Telefonnummer"
      />

      <Text style={EditProfileStyles.label}>Adresse</Text>
      <TextInput
        style={EditProfileStyles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Gate, postnummer, sted"
      />

      <Pressable
        style={[EditProfileStyles.btnBase, EditProfileStyles.btnPrimary]}
        onPress={handleSave}
      >
        <Text style={EditProfileStyles.btnTextDark}>Lagre endringer</Text>
      </Pressable>

      <Pressable
        style={[EditProfileStyles.btnBase, EditProfileStyles.btnDanger]}
        onPress={() => router.back()}
      >
        <Text style={EditProfileStyles.btnTextLight}>Avbryt</Text>
      </Pressable>
    </ScrollView>
  );
}
