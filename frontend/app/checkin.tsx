import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
  } from "react-native";
  import { useEffect, useState } from "react";
  import { useRouter } from "expo-router";
  import { Ionicons } from "@expo/vector-icons";
  import { Colors } from "@/constants/colors";
  import { fetchCurrentUser } from "../services/authApi";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  type CheckStatus = "INN" | "UT";
  
  type ChildCheckState = {
    id: string;
    name: string;
    status: CheckStatus;
    lastChange?: string;
  };
  
  export default function CheckinScreen() {
    const router = useRouter();
    const [children, setChildren] = useState<ChildCheckState[]>([]);
    const [parentName, setParentName] = useState<string | null>(null);
  
    useEffect(() => {
      const init = async () => {
        // TODO BACKEND:
      // Når API for innsjekk er klart:
      // 1) Hent barn + status fra backend i stedet for AsyncStorage,
      //    f.eks. GET /api/parent/checkin-status
      // 2) Bruk responsen til å fylle `children`-state.

        try {
          const storedStatus = await AsyncStorage.getItem("edithStatus");
          const storedTime = await AsyncStorage.getItem("edithLastChange");
  
          const initialStatus: CheckStatus =
            storedStatus === "INN" || storedStatus === "UT"
              ? storedStatus
              : "UT";
  
          const mockKids: ChildCheckState[] = [
            {
              id: "edith-id",
              name: "Edith Hansen",
              status: initialStatus,
              lastChange: storedTime ?? undefined,
            },
          ];
  
          setChildren(mockKids);
        } catch (err) {
          console.log("Feil ved henting av lagret status:", err);
          setChildren([
            { id: "edith-id", name: "Edith Hansen", status: "UT" },
          ]);
        }
        
      // Denne delen er allerede koblet mot auth-backend
        try {
          const user = await fetchCurrentUser();
          if (user?.fullName) setParentName(user.fullName);
        } catch (err) {
          console.log("Feil ved henting av bruker:", err);
        }
      };
  
      init();
    }, []);
  
    function toggleStatus(childId: string) {
      let newStatusForStorage: CheckStatus | null = null;
      let newTimestampForStorage: string | null = null;
  
      setChildren((prev) =>
        prev.map((child) => {
          if (child.id !== childId) return child;
  
          const newStatus: CheckStatus =
            child.status === "INN" ? "UT" : "INN";
  
          const now = new Date();
          const timeString = now.toLocaleTimeString("nb-NO", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const dateString = now.toLocaleDateString("nb-NO", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          });
  
          const timestamp = `${dateString} kl. ${timeString}`;
  
          newStatusForStorage = newStatus;
          newTimestampForStorage = timestamp;
  
          // TODO: Backend-kall, f.eks:
          // await checkinApi.requestStatusChange(child.id, newStatus);
  
          return {
            ...child,
            status: newStatus,
            lastChange: timestamp,
          };
        })
      );
  
      if (newStatusForStorage) {
        AsyncStorage.setItem("edithStatus", newStatusForStorage).catch((err) =>
          console.log("Klarte ikke lagre status:", err)
        );
      }
      if (newTimestampForStorage) {
        AsyncStorage.setItem("edithLastChange", newTimestampForStorage).catch(
          (err) => console.log("Klarte ikke lagre tidspunkt:", err)
        );
      }
    }
  
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={26} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sjekk inn / ut</Text>
            <View style={{ width: 26 }} />
          </View>
  
          <Text style={styles.subtitle}>
            {parentName
              ? `Her kan ${parentName} gi beskjed om at Edith har kommet eller dratt.`
              : "Her kan du gi beskjed om at barnet ditt har kommet eller dratt."}
          </Text>
  
          {/* Kort for hvert barn*/}
          {children.map((child) => {
            const isIn = child.status === "INN";
            const btnLabel = isIn ? "Sjekk ut" : "Sjekk inn";
            const statusLabel = isIn ? "Sjekket inn" : "Ikke sjekket inn";
  
            return (
              <View key={child.id} style={styles.childCard}>
                <Text style={styles.childTitle}>Barn</Text>
  
                <View style={styles.childHeaderRow}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      isIn ? styles.statusPillIn : styles.statusPillOut,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        isIn ? styles.statusDotIn : styles.statusDotOut,
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        isIn ? styles.statusTextIn : styles.statusTextOut,
                      ]}
                    >
                      {statusLabel}
                    </Text>
                  </View>
                </View>
  
                {child.lastChange && (
                  <Text style={styles.lastChangeText}>
                    Sist oppdatert: {child.lastChange}
                  </Text>
                )}
  
                <TouchableOpacity
                  style={[
                    styles.checkButton,
                    isIn ? styles.checkButtonOut : styles.checkButtonIn,
                  ]}
                  onPress={() => toggleStatus(child.id)}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      styles.checkButtonText,
                      isIn
                        ? styles.checkButtonTextOut
                        : styles.checkButtonTextIn,
                    ]}
                  >
                    {btnLabel}
                  </Text>
                </TouchableOpacity>
  
                <Text style={styles.infoText}>
                  Når du bekrefter, sendes dette til de ansatte som kan bruke
                  informasjonen i sin løsning og i oppmøtelista.
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 32,
      width: "100%",
      maxWidth: 500,
      alignSelf: "center",
    },
  
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.text,
    },
    subtitle: {
      fontSize: 13,
      color: Colors.textMuted,
      marginBottom: 16,
    },
  
    childCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.primaryLightBlue,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    childTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: Colors.textMuted,
      marginBottom: 6,
    },
    childHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    childName: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
    },
  
    statusPill: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    statusPillIn: {
      backgroundColor: "#DCFCE7",
    },
    statusPillOut: {
      backgroundColor: "#FEE2E2",
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusDotIn: {
      backgroundColor: "#16A34A",
    },
    statusDotOut: {
      backgroundColor: "#DC2626",
    },
    statusText: {
      fontSize: 11,
      fontWeight: "600",
    },
    statusTextIn: {
      color: "#15803D",
    },
    statusTextOut: {
      color: "#B91C1C",
    },
  
    lastChangeText: {
      fontSize: 11,
      color: Colors.textMuted,
      marginTop: 6,
      marginBottom: 10,
    },
  
    checkButton: {
      borderRadius: 999,
      paddingVertical: 11,
      alignItems: "center",
      marginBottom: 8,
    },
    checkButtonIn: {
      backgroundColor: Colors.primaryBlue,
    },
    checkButtonOut: {
      backgroundColor: Colors.red,
    },
    checkButtonText: {
      fontSize: 14,
      fontWeight: "700",
    },
    checkButtonTextIn: {
      color: "#111827",
    },
    checkButtonTextOut: {
      color: "#FFFFFF",
    },
  
    infoText: {
      fontSize: 11,
      color: Colors.textMuted,
      marginTop: 4,
    },
  });
  