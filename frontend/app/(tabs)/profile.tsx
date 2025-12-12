import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ParentProfileStyles } from "@/styles";
import { AppButton } from "@/components/AppButton";
import { fetchCurrentUser, logout } from "../../services/authApi";

type CurrentUser = any;

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch((err) => {
        console.log("Klarte ikke hente innlogget bruker:", err);
      });
  }, []);

  // Fallback-verdier
  const displayName = user?.fullName ?? "Ola Hansen";
  const email = user?.email ?? "olahansen@gmail.com";
  const phone = user?.phoneNumber ?? "+47 123 45 678";
  const address = user?.address ?? "Adresse ikke registrert";

  // TODO (BACKEND): barna skal komme fra backend
  const children = [{ id: "edith-id", name: "Edith Hansen" }];

  // TODO (BACKEND): medforelder skal komme fra backend
  const coParent = { id: "kari-id", name: "Kari Mette Hansen" };

  return (
    <ScrollView style={ParentProfileStyles.container}>
      <View style={ParentProfileStyles.profileCard}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/boy/32.jpg" }}
          style={ParentProfileStyles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={ParentProfileStyles.name}>{displayName}</Text>
        </View>
      </View>

      {/* Kontaktinfo */}
      <View style={ParentProfileStyles.section}>
        <Text style={ParentProfileStyles.sectionTitle}>Kontaktinformasjon</Text>

        <View style={ParentProfileStyles.infoBox}>
          <View style={ParentProfileStyles.infoRow}>
            <Ionicons
              name="mail-outline"
              size={18}
              style={ParentProfileStyles.infoIcon}
            />
            <Text style={ParentProfileStyles.infoText}>{email}</Text>
          </View>

          <View style={ParentProfileStyles.infoRow}>
            <Ionicons
              name="call-outline"
              size={18}
              style={ParentProfileStyles.infoIcon}
            />
            <Text style={ParentProfileStyles.infoText}>{phone}</Text>
          </View>

          <View style={ParentProfileStyles.infoRow}>
            <Ionicons
              name="home-outline"
              size={18}
              style={ParentProfileStyles.infoIcon}
            />
            <Text style={ParentProfileStyles.infoText}>{address}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <AppButton
            label="Rediger info"
            variant="neutral"
            onPress={() => router.push("/edit-profile")}
          />
        </View>
      </View>

      {/* Barn */}
      <View style={ParentProfileStyles.section}>
        <Text style={ParentProfileStyles.sectionTitle}>Barn</Text>

        {children.map((child) => (
          <TouchableOpacity
            key={child.id}
            style={ParentProfileStyles.childItem}
            onPress={() => router.push(`/child/${child.id}`)}
          >
            <Text style={ParentProfileStyles.childName}>{child.name}</Text>
            <Ionicons name="arrow-forward" size={20} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Medforelder */}
      <View style={ParentProfileStyles.section}>
        <Text style={ParentProfileStyles.sectionTitle}>Medforelder</Text>

        <TouchableOpacity style={ParentProfileStyles.childItem}>
          <Text style={ParentProfileStyles.childName}>{coParent.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View style={ParentProfileStyles.section}>
        <AppButton
          label="Logg ut"
          variant="danger"
          onPress={async () => {
            try {
              await logout();
            } catch (err) {
              console.log("Feil ved logout:", err);
            } finally {
              router.replace("/");
            }
          }}
        />
      </View>
    </ScrollView>
  );
}
