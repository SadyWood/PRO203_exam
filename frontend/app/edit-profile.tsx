import {
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { fetchCurrentUser, UserResponseDto } from "../services/authApi";
import {
  AppStyles,
  InputStyles,
  ButtonStyles,
} from "@/styles";

export default function EditProfileScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    /**
     * TODO (BACKEND):
     * - Erstatt fetchCurrentUser med profileApi.getProfile() hvis ønskelig
     * - email skal alltid komme fra auth/token og være read-only
     */
    fetchCurrentUser()
      .then((user: UserResponseDto | null) => {
        if (!user) return;
        setFullName(user.fullName ?? "");
        setEmail(user.email ?? "");
        setPhoneNumber(user.phoneNumber ?? "");
        setAddress(user.address ?? "");
      })
      .catch((err) =>
        console.log("Feil ved henting av bruker:", err),
      );
  }, []);

  async function handleSave() {
    /**
     * TODO (BACKEND):
     * PUT /api/profile
     * Payload:
     * {
     *   fullName: string;
     *   phoneNumber: string;
     *   address: string;
     * }
     * email skal IKKE kunne endres
     */

    console.log("Profile update payload:", {
      fullName,
      phoneNumber,
      address,
    });

    Alert.alert(
      "Backend kommer",
      "Endringer lagres når backend er klar.",
    );

    router.back();
  }

  return (
    <ScrollView style={AppStyles.container}>
      <Text style={AppStyles.title}>Rediger profil</Text>

      <Text style={AppStyles.textMuted}>Fullt navn</Text>
      <TextInput
        style={InputStyles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Fullt navn"
      />

      <Text style={AppStyles.textMuted}>E-post</Text>
      <TextInput
        style={[InputStyles.input, InputStyles.disabled]}
        value={email}
        editable={false}
        selectTextOnFocus={false}
      />

      <Text style={AppStyles.textMuted}>Telefonnummer</Text>
      <TextInput
        style={InputStyles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholder="Telefonnummer"
      />

      <Text style={AppStyles.textMuted}>Adresse</Text>
      <TextInput
        style={InputStyles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Gate, postnummer, sted"
      />

      <Pressable
        style={[ButtonStyles.base, ButtonStyles.primary]}
        onPress={handleSave}
      >
        <Text style={ButtonStyles.textDark}>Lagre endringer</Text>
      </Pressable>

      <Pressable
        style={[ButtonStyles.base, ButtonStyles.danger]}
        onPress={() => router.back()}
      >
        <Text style={ButtonStyles.textLight}>Avbryt</Text>
      </Pressable>
    </ScrollView>
  );
}


