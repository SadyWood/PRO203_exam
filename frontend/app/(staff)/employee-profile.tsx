import {
  View,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchCurrentUser, logout } from "../../services/authApi";
import { useEffect, useState } from "react";
import { EmployeeProfileStyles } from "@/styles";
import { AppButton } from "@/components/AppButton";

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

  return (
    <ScrollView style={EmployeeProfileStyles.container}>

      {/* Header */}
      <View style={EmployeeProfileStyles.headerCard}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
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
      <AppButton
        label="Rediger info"
        variant="neutral"
        onPress={() => router.push("/edit-profile")}
      />

      <View style={{ height: 14 }} />

      <AppButton
        label="Timeliste"
        variant="neutral"
        onPress={() => router.push("/edit-profile")}
      />

      <View style={{ height: 24 }} />

      <AppButton
        label="Logg ut"
        variant="danger"
        onPress={async () => {
          try {
            await logout();
          } finally {
            router.replace("/");
          }
        }}
      />
    </ScrollView>
  );
}
