import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Alert,
    ScrollView,
  } from "react-native";
  import { useEffect, useState } from "react";
  import { useRouter } from "expo-router";
  import { Colors } from "@/constants/colors";
  import { fetchCurrentUser, UserResponseDto } from "../services/authApi";
  
  export default function EditProfileScreen() {
    const router = useRouter();
  
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
  
    useEffect(() => {
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
  
    function handleSave() {
      // TODO: Når backend er klar, send dette til et endepunkt, f.eks. updateProfile(payload)
      const payload = {
        fullName,
        email,
        phoneNumber,
        address,
      };
      console.log("Profile update payload (frontend klar):", payload);
  
      Alert.alert(
        "Backend kommer",
        "Endringer blir lagret når backend-endepunktet er klart."
      );
  
      router.back();
    }
  
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Rediger profil</Text>
  
        <Text style={styles.label}>Fullt navn</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Fullt navn"
        />
  
        <Text style={styles.label}>E-post</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#f3f4f6" }]}
          value={email}
          onChangeText={setEmail}
          placeholder="E-post"
          autoCapitalize="none"
          keyboardType="email-address"
        />
  
        <Text style={styles.label}>Telefonnummer</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="Telefonnummer"
        />
  
        <Text style={styles.label}>Adresse</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Gate, postnummer, sted"
        />
  
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lagre endringer</Text>
        </Pressable>
  
        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Avbryt</Text>
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
    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 20,
      color: Colors.text,
    },
    label: {
      fontSize: 14,
      marginBottom: 4,
      color: Colors.textMuted,
    },
    input: {
      borderWidth: 1,
      borderColor: Colors.primaryLightBlue,
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 10,
      marginBottom: 14,
      fontSize: 15,
    },
    saveButton: {
      backgroundColor: Colors.primaryBlue,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
    },
    cancelButton: {
      marginTop: 16,
      alignItems: "center",
    },
    cancelButtonText: {
      color: Colors.red,
      fontSize: 16,
      fontWeight: "600",
    },
  });
  