import { View,Text,StyleSheet, Image,TouchableOpacity, ScrollView,} from "react-native";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

  // TODO: Backend vil sende ekte barn etter hvert
  const children = [
    { id: "edith-id", name: "Edith Hansen", route: "/child/edith" },
  ];

  const coParent = { id: "kari-id", name: "Kari Mette Hansen" };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/boy/32.jpg" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{displayName}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kontaktinformasjon</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={Colors.text}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="call-outline"
              size={18}
              color={Colors.text}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="home-outline"
              size={18}
              color={Colors.text}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{address}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/edit-profile")}
        >
          <Text style={styles.editText}>Rediger info</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Barn</Text>

        {children.map((child) => (
          <TouchableOpacity
            key={child.id}
            style={styles.childItem}
            onPress={() => router.push(child.route as any)}
          >
            <Text style={styles.childName}>{child.name}</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medforelder</Text>

        <TouchableOpacity style={styles.childItem}>
          <Text style={styles.childName}>{coParent.name}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
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
          <Text style={styles.logoutText}>Logg ut</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  profileCard: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: Colors.text,
  },

  infoBox: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    marginRight: 8,
  },

  infoText: {
    fontSize: 14,
    color: Colors.text,
  },

  editButton: {
    marginTop: 10,
    backgroundColor: "#d4d4d4",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },

  editText: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 14,
  },

  childItem: {
    backgroundColor: Colors.primaryLightBlue,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  childName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },

  logoutButton: {
    backgroundColor: Colors.red,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },

  logoutText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
