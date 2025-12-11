import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
  import { Colors } from "@/constants/colors";
  import { Ionicons } from "@expo/vector-icons";
  import { useRouter } from "expo-router";
  import { fetchCurrentUser, logout } from "../../services/authApi";
  import { useEffect, useState } from "react";
  
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
      <ScrollView style={styles.container}>
        {/* HEADER CARD */}
        <View style={styles.headerCard}>
          <Image
            source={{
              uri: "https://randomuser.me/api/portraits/women/44.jpg",
            }}
            style={styles.avatar}
          />
  
          <View style={styles.headerRight}>
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>
  
        {/* HEADER TITLE */}
        <Text style={styles.sectionTitle}>Kontaktinformasjon</Text>
  
        {/* CONTACT INFO BOX */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={Colors.text} />
            <Text style={styles.infoText}>{email}</Text>
          </View>
  
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={Colors.text} />
            <Text style={styles.infoText}>{phone}</Text>
          </View>
  
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={Colors.text} />
            <Text style={styles.infoText}>{address}</Text>
          </View>
        </View>
  
        {/* EDIT BUTTON */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Rediger info</Text>
        </TouchableOpacity>
  
        {/* TIMELIST */}
        <TouchableOpacity style={styles.timelisteButton}>
          <Text style={styles.timelisteText}>Timeliste</Text>
        </TouchableOpacity>
  
        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await logout();
            } finally {
              router.replace("/");
            }
          }}
        >
          <Text style={styles.logoutText}>Logg ut</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF2F2", 
      padding: 20,
    },
  
    headerCard: {
      backgroundColor: "#ffffff",
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 18,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
      borderWidth: 1,
      borderColor: "#D8D8D8",
    },
  
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: 20,
    },
  
    headerRight: {
      flex: 1,
    },
  
    name: {
      fontSize: 22,
      fontWeight: "700",
      color: Colors.text,
    },
  
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 12,
      color: Colors.text,
    },
  
    infoBox: {
      backgroundColor: "#BACEFF",
      borderRadius: 14,
      padding: 16,
      marginBottom: 24,
    },
  
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
  
    infoText: {
      fontSize: 16,
      marginLeft: 10,
      color: Colors.text,
    },
  
    editButton: {
      backgroundColor: "#D4D4D4",
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 14,
    },
  
    editButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
    },
  
    timelisteButton: {
      backgroundColor: "#E5E5E5",
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 24,
    },
  
    timelisteText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
    },
  
    logoutButton: {
      backgroundColor: Colors.red,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 40,
    },
  
    logoutText: {
      color: "white",
      fontSize: 16,
      fontWeight: "700",
    },
  });
  