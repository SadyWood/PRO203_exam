import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
  } from "react-native";
  import { useRouter } from "expo-router";
  import { Ionicons } from "@expo/vector-icons";
  import { Colors } from "@/constants/colors";
  import { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  type CheckStatus = "NONE" | "INN" | "HENTET" | "SYK" | "FERIE";
  
  type Child = {
    id: string;
    name: string;
  };
  
  type ChildStatus = {
    status: CheckStatus;
    time?: string; 
  };
  
  const CHILDREN: Child[] = [
    { id: "ella", name: "ELLA" },
    { id: "omar", name: "OMAR" },
    { id: "sander", name: "SANDER" },
    { id: "isa", name: "ISA" },
    { id: "stian", name: "STIAN" },
    { id: "theodor", name: "THEODOR" },
    { id: "lucia", name: "LUCIA" },
    { id: "farah", name: "FARAH" },
    { id: "hakon", name: "HÅKON" },
  ];
  
  const STORAGE_KEY = "employee_checkin_statuses_bjorn";
  
  function formatNow(): string {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  
  export default function EmployeeCheckinScreen() {
    const router = useRouter();
  
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [statuses, setStatuses] = useState<Record<string, ChildStatus>>({});
  
    // Load lagret status fra AsyncStorage når skjermen åpnes
    useEffect(() => {
      const loadStatuses = async () => {
        try {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed: Record<string, ChildStatus> = JSON.parse(stored);
            setStatuses(parsed);
          }
        } catch (err) {
          console.log("Klarte ikke lese checkin-status fra storage:", err);
        }
      };
  
      loadStatuses();
    }, []);
  
    async function handleSetStatus(childId: string, status: CheckStatus) {
      const isTimed = status === "INN" || status === "HENTET";
      const time = isTimed ? formatNow() : undefined;
  
      const updated: Record<string, ChildStatus> = {
        ...statuses,
        [childId]: { status, time },
      };
  
      setStatuses(updated);
      setSelectedChild(null);
  
      // Lagre lokalt 
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.log("Klarte ikke lagre checkin-status til storage:", err);
      }
  
      // TODO: Når backend er klar:
      //  - Send status til server, f.eks:
      //    await attendanceApi.register({
      //      childId,
      //      status,   // "INN" | "HENTET" | "SYK" | "FERIE"
      //      time,     // kun for INN/HENTET
      //    });
    }
  
    function statusLabel(childId: string): string {
      const s = statuses[childId];
  
      if (!s || s.status === "NONE") {
        return "Ingen registrering enda";
      }
  
      switch (s.status) {
        case "INN":
          return s.time ? `Ankom kl. ${s.time}` : "Ankom registrert";
        case "HENTET":
          return s.time ? `Hentet kl. ${s.time}` : "Hentet registrert";
        case "SYK":
          return "Registrert syk";
        case "FERIE":
          return "Registrert på ferie";
        default:
          return "Ingen registrering";
      }
    }
  
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* TOPPTEKST */}
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>AVDELING BJØRN</Text>
            <View style={{ width: 24 }} />
          </View>
  
          {/* GRID MED BARN */}
          <ScrollView contentContainerStyle={styles.grid}>
            {CHILDREN.map((child) => (
              <TouchableOpacity
                key={child.id}
                style={styles.childCard}
                activeOpacity={0.9}
                onPress={() => setSelectedChild(child)}
              >
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>
                    {child.name.charAt(0)}
                  </Text>
                </View>
  
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.statusLabel}>{statusLabel(child.id)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
  
          {/* POPUP-KORT  VALGT BARN */}
          {selectedChild && (
            <View style={styles.overlay}>
              <View style={styles.popupCard}>
                <View style={styles.popupHeaderRow}>
                  <Text style={styles.popupName}>{selectedChild.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedChild(null)}>
                    <Ionicons name="close" size={22} color={Colors.text} />
                  </TouchableOpacity>
                </View>
  
                <View style={styles.popupAvatarCircle}>
                  <Text style={styles.popupAvatarInitial}>
                    {selectedChild.name.charAt(0)}
                  </Text>
                </View>
  
                <View style={styles.popupButtons}>
                  <TouchableOpacity
                    style={styles.popupButton}
                    onPress={() => handleSetStatus(selectedChild.id, "INN")}
                  >
                    <Text style={styles.popupButtonText}>Registrer ankomst</Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    style={styles.popupButton}
                    onPress={() => handleSetStatus(selectedChild.id, "SYK")}
                  >
                    <Text style={styles.popupButtonText}>Registrer syk</Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    style={styles.popupButton}
                    onPress={() => handleSetStatus(selectedChild.id, "HENTET")}
                  >
                    <Text style={styles.popupButtonText}>Registrer hentet</Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    style={styles.popupButton}
                    onPress={() => handleSetStatus(selectedChild.id, "FERIE")}
                  >
                    <Text style={styles.popupButtonText}>Registrer ferie</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
  
  const CARD_BG = "#BACEFF";
  
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#FFF2F2",
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    backButton: {
      padding: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.text,
    },
  
    grid: {
      paddingBottom: 32,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
  
    childCard: {
      width: "30%",
      backgroundColor: CARD_BG,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 6,
      alignItems: "center",
      marginBottom: 12,
    },
  
    avatarCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 6,
    },
    avatarInitial: {
      fontSize: 24,
      fontWeight: "700",
      color: Colors.text,
    },
  
    childName: {
      fontSize: 12,
      fontWeight: "700",
      color: Colors.text,
      textAlign: "center",
      marginBottom: 2,
    },
  
    statusLabel: {
      fontSize: 10,
      color: Colors.textMuted,
      textAlign: "center",
    },
  
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.15)",
      justifyContent: "center",
      alignItems: "center",
    },
  
    popupCard: {
      width: "80%",
      backgroundColor: CARD_BG,
      borderRadius: 16,
      padding: 16,
    },
  
    popupHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
  
    popupName: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.text,
    },
  
    popupAvatarCircle: {
      alignSelf: "center",
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
  
    popupAvatarInitial: {
      fontSize: 32,
      fontWeight: "700",
      color: Colors.text,
    },
  
    popupButtons: {
      gap: 8,
    },
  
    popupButton: {
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      paddingVertical: 8,
      alignItems: "center",
    },
  
    popupButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.text,
    },
  });
  