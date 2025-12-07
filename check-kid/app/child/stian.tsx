import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function StianProfile() {
  const router = useRouter();

  const [sharePhotos, setSharePhotos] = useState(true);
  const [tripPermission, setTripPermission] = useState(true);
  const [showNamePublic, setShowNamePublic] = useState(false);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/profile")}>
        <Ionicons name="chevron-back" size={26} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.headerCard}>
        <Image
          source={{ uri: "https://.../api/portraits/.jpg" }}
          style={styles.avatar}
        />

        <View style={styles.headerTextBox}>
          <Text style={styles.childName}>Stian Hansen</Text>

          <View style={styles.dateChip}>
          <Text style={{ fontSize: 14, marginRight: 4 }}>🎂</Text>
          <Text style={styles.dateText}>20.08.2021</Text>
        </View>

        </View>
      </View>

      <View style={styles.departmentBar}>
        <Text style={styles.departmentText}>Avdeling: Bjørn</Text>
      </View>

      <Text style={styles.sectionTitle}>Tillatelser</Text>

      <View style={styles.permissionRow}>
        <Text style={styles.permissionLabel}>Deling av bilder:</Text>
        <Switch value={sharePhotos} onValueChange={setSharePhotos} />
      </View>

      <View style={styles.permissionRow}>
        <Text style={styles.permissionLabel}>Bli med på turer:</Text>
        <Switch value={tripPermission} onValueChange={setTripPermission} />
      </View>

      <View style={styles.permissionRow}>
        <Text style={styles.permissionLabel}>Dele barnets navn offentlig</Text>
        <Switch value={showNamePublic} onValueChange={setShowNamePublic} />
      </View>


      <Text style={styles.sectionTitle}>Helsehensyn</Text>

      <View style={styles.healthCard}>

        <View style={styles.healthGroup}>
          <Text style={styles.healthHeaderText}>Matallergier:</Text>
          <View style={styles.healthRow}>
            <Text style={styles.healthRowText}>Ingen</Text>
          </View>
        </View>


        <View style={styles.healthGroup}>
          <Text style={styles.healthHeaderText}>Annet:</Text>
          <View style={styles.healthRow}>
            <Text style={styles.healthRowText}>Dårlig syn</Text>
          </View>
        </View>
      </View>


      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Rediger info</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  backButton: {
    marginBottom: 10,
  },

  /* HEADER: blå bakgrunn, bilde + tekst */
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },

  headerTextBox: {
    flex: 1,
    justifyContent: "center",
  },

  childName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: Colors.text,
  },

  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#ffffff",
  },

  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },


  departmentBar: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 18,
  },

  departmentText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },


  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 4,
    color: Colors.text,
  },

  permissionRow: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  permissionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },

  healthCard: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  healthGroup: {
    marginBottom: 14,
  },

  healthHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },

  healthRow: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  healthRowText: {
    fontSize: 14,
    color: Colors.text,
  },

  editButton: {
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#d4d4d4",
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
});