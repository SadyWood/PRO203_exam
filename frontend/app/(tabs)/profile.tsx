import { View, Text,StyleSheet,Image,TouchableOpacity, ScrollView, } from "react-native";
  import { Colors } from "@/constants/colors";
  import { Ionicons } from "@expo/vector-icons";
  import { useRouter } from "expo-router";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  export default function ProfileScreen() {
    const router = useRouter();

    async function handleLogout(){
      try {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("currentUser");

        console.log("Logged out");
        router.replace("/");
      }catch (error){
        console.log(error);
      }
    }
  
    return (
      <ScrollView style={styles.container}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/boy/32.jpg" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Ola Hansen</Text>
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
              <Text style={styles.infoText}>olahansen@gmail.com</Text>
            </View>
  
            <View style={styles.infoRow}>
              <Ionicons
                name="call-outline"
                size={18}
                color={Colors.text}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>+47 123 45 678</Text>
            </View>
  
            
          </View>
  
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Rediger info</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Barn</Text>
  
          <TouchableOpacity
            style={styles.childItem}
            onPress={() => router.push("/child/edith")}
          >
            <Text style={styles.childName}>Edith Hansen</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.childItem}
            onPress={() => router.push("/child/stian")}
          >
            <Text style={styles.childName}>Stian Hansen</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medforelder</Text>
  
          <TouchableOpacity style={styles.childItem}>
            <Text style={styles.childName}>Kari Mette Hansen</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
  
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
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
  
    // Kontaktkort
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
  