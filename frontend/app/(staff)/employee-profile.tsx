import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchCurrentUser, logout } from "../../services/authApi";
import { useEffect, useState } from "react";
import { EmployeeProfileStyles } from "@/styles";

// TODO (BACKEND):
// Erstatt faktisk bruker når backend-kontrakt er klar
export default function EmployeeProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch((err) => console.log("Feil ved uthenting av bruker:", err));
  }, []);

  // Fallback
  const name = user?.fullName ?? "Maiken";
  const email = user?.email ?? "maiken@eventyrhagen.no";
  const phone = user?.phoneNumber ?? "+47 987 65 432";
  const address = user?.address ?? "Lokasjon 5b";

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };
  return (
    <ScrollView style={EmployeeProfileStyles.container}>
  
      {/* Header */}
      <View style={EmployeeProfileStyles.headerCard}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/womn/44.jpg" }}
          style={EmployeeProfileStyles.avatar}
        />
  
        <View style={EmployeeProfileStyles.headerRight}>
          <Text style={EmployeeProfileStyles.name}>{name}</Text>
        </View>
      </View>
  
      {/* Kontaktinfo */}
      <Text style={EmployeeProfileStyles.sectionTitle}>
        Kontaktinformasjon
      </Text>
  
      <View style={EmployeeProfileStyles.infoBox}>
        <View style={EmployeeProfileStyles.infoRow}>
          <Ionicons name="mail-outline" size={20} />
          <Text style={EmployeeProfileStyles.infoText}>{email}</Text>
        </View>
  
        <View style={EmployeeProfileStyles.infoRow}>
          <Ionicons name="call-outline" size={20} />
          <Text style={EmployeeProfileStyles.infoText}>{phone}</Text>
        </View>
  
        <View style={EmployeeProfileStyles.infoRow}>
          <Ionicons name="location-outline" size={20} />
          <Text style={EmployeeProfileStyles.infoText}>{address}</Text>
        </View>
      </View>
  
      {/* Actions */}
      <Pressable
        style={[
          EmployeeProfileStyles.primaryBtn,
          EmployeeProfileStyles.primaryBtnPrimary
        ]}
        onPress={() => router.push("/(staff)/employee-edit-profile")}
      >
        <Text style={EmployeeProfileStyles.primaryBtnText}>
          Rediger profil
        </Text>
      </Pressable>
  
      <Pressable
        style={[
          EmployeeProfileStyles.primaryBtn,
          EmployeeProfileStyles.primaryBtnDanger
        ]}
        onPress={handleLogout}
      >
        <Text
          style={[
            EmployeeProfileStyles.primaryBtnText,
            EmployeeProfileStyles.primaryBtnTextDanger
          ]}
        >
          Logg ut
        </Text>
      </Pressable>
  
    </ScrollView>
  );
  
}
  