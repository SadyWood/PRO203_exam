import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { ParentProfileStyles } from "@/styles";
import { fetchCurrentUser, logout } from "../../services/authApi";

// TODO (BACKEND):
// Erstatt `any` med faktisk bruker-type når backend-kontrakt er klar
// f.eks. interface CurrentUser { id, fullName, email, phoneNumber, address, children, coParent }
type CurrentUser = any;

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
     // TODO (BACKEND):
    // fetchCurrentUser() skal hente komplett profil:
    // - personlig info
    // - barn
    // - medforelder
    fetchCurrentUser()
      .then(setUser)
      .catch((err) => {
        console.log("Klarte ikke hente innlogget bruker:", err);
      });
  }, []);

// TODO (BACKEND):
  // Fjern fallback-verdier når backend alltid returnerer disse feltene
  const displayName = user?.fullName ?? "Ola Hansen";
  const email = user?.email ?? "olahansen@gmail.com";
  const phone = user?.phoneNumber ?? "+47 123 45 678";
  const address = user?.address ?? "Adresse ikke registrert";

  // TODO (BACKEND):
  // children og coParent skal komme fra backend (f.eks. user.children / user.coParent)
  // Disse mockene skal slettes når API er klart
  const children = [{ id: "edith-id", name: "Edith Hansen" }];
  const coParent = { id: "kari-id", name: "Kari Mette Hansen" };

  return (
    <ScrollView style={ParentProfileStyles.container}>
      {/* Profilkort */}
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
        <Text style={ParentProfileStyles.sectionTitle}>
          Kontaktinformasjon
        </Text>

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
          <Pressable
            style={[
              ParentProfileStyles.primaryBtn,
              ParentProfileStyles.primaryBtnNeutral,
            ]}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={ParentProfileStyles.primaryBtnText}>
              Rediger info
            </Text>
          </Pressable>
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
          <Text style={ParentProfileStyles.childName}>
            {coParent.name}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logg ut */}
      <View style={ParentProfileStyles.section}>
        <Pressable
          style={[
            ParentProfileStyles.primaryBtn,
            ParentProfileStyles.primaryBtnDanger,
          ]}
          onPress={async () => {
            try {
              await logout();
            } catch (err) {
              console.log("Feil ved logout:", err);
            } finally {
              router.replace("/");
            }
          }}
        >
          <Text
            style={[
              ParentProfileStyles.primaryBtnText,
              ParentProfileStyles.primaryBtnTextDanger,
            ]}
          >
            Logg ut
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
