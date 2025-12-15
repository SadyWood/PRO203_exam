import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/colors";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

const MOCK_AGENDA = [
    {
        childName: "Edith",
        date: "09.01.26",
        absentRegistered: true,
        items: [
            "Felles oppstart: 08:45",
            "Tegne/puslespill: 09:00 - 10:00",
            "Leseøkt: 10:15 - 10:45",
            "Ryddetid: 10:45 - 11:00",
            "Lunsj: 11:00, dagens varmmat: Pasta",
            "Sovetid: 11:30",
            "Stå opp og spise matpakke: 13:30",
            "Leke ute i snøen kl 14:30",
        ],
        note: "Vi skal på tur, husk ekstra mat!",
    },
];

type CheckStatus = "INN" | "UT";

function statusKey(childId: string) {
    return `checkin_status_${childId}`;
}
function timeKey(childId: string) {
    return `checkin_time_${childId}`;
}

export default function HomeScreen() {
    const router = useRouter();

    const [userName, setUserName] = useState<string>("");
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Check-in status for first child (can be expanded for multiple children)
    const [checkInStatus, setCheckInStatus] = useState<CheckStatus | null>(null);
    const [lastStatusChange, setLastStatusChange] = useState<string | null>(null);

    useEffect(() => {
        async function loadUserData() {
            try {
                const userStr = await AsyncStorage.getItem("currentUser");

                if (userStr) {
                    const user = JSON.parse(userStr);

                    if (user.profileId && user.role === "PARENT") {
                        await fetchParentProfile(user.profileId);
                        await fetchChildren(user.profileId);
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        loadUserData();
    }, []);

    // Load check-in status when screen comes into focus
    const loadCheckInStatus = useCallback(async () => {
        if (children.length > 0) {
            const childId = children[0].id;
            try {
                const storedStatus = await AsyncStorage.getItem(statusKey(childId));
                const storedTime = await AsyncStorage.getItem(timeKey(childId));

                if (storedStatus === "INN" || storedStatus === "UT") {
                    setCheckInStatus(storedStatus);
                } else {
                    setCheckInStatus(null);
                }

                setLastStatusChange(storedTime ?? null);
            } catch (err) {
                console.log("Klarte ikke lese status:", err);
            }
        }
    }, [children]);

    useFocusEffect(
        useCallback(() => {
            loadCheckInStatus();
        }, [loadCheckInStatus])
    );

    async function fetchParentProfile(parentId: string) {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const res = await fetch(`${API_BASE_URL}/api/parents/${parentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const parentData = await res.json();
                setUserName(parentData.firstName || "");
                console.log("Parent profile:", parentData);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchChildren(parentId: string) {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const res = await fetch(`${API_BASE_URL}/api/children/parent/${parentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setChildren(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const isCheckedIn = checkInStatus === "INN";
    const firstChild = children.length > 0 ? children[0] : null;

    const statusText = firstChild
        ? checkInStatus === "INN"
            ? `${firstChild.firstName} er sjekket inn`
            : checkInStatus === "UT"
                ? `${firstChild.firstName} er sjekket ut`
                : "Ingen status registrert"
        : "Ingen barn registrert";

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.headerWrapper}>
                    <Text style={styles.appButtonText}>CHECK KID ✅</Text>
                </View>

                {/* Kindergarten Title */}
                <Text style={styles.bhgTitle}>Eventyrhagen Barnehage</Text>

                {/* Parent Card */}
                {loading ? (
                    <View style={styles.parentCard}>
                        <ActivityIndicator size="small" color={Colors.primaryBlue} />
                    </View>
                ) : (
                    <View style={styles.parentCard}>
                        <View>
                            <Text style={styles.parentGreeting}>Hei {userName}!</Text>
                            {children.length > 0 && (
                                <Text style={styles.parentSub}>
                                    Forelder til {children.map((c) => c.firstName).join(" og ")}
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                {/* Quick Actions */}
                <View style={styles.quickActionsRow}>
                    <PrimaryButton
                        label="Registrer fravær"
                        onPress={() => {}}
                        variant="danger"
                    />
                    <PrimaryButton
                        label="Bleieskift & søvn"
                        onPress={() => {}}
                        variant="brown"
                    />
                    <PrimaryButton
                        label="Meldinger"
                        onPress={() => router.push("/messages")}
                    />
                    <PrimaryButton
                        label="Sjekk inn / ut"
                        onPress={() => router.push("/checkin")}
                    />
                </View>

                {/* Check-in Status Card */}
                {firstChild && (
                    <View style={styles.statusCard}>
                        <Text style={styles.statusTitle}>
                            Status for {firstChild.firstName}
                        </Text>

                        <View style={styles.statusRow}>
                            <View
                                style={[
                                    styles.statusPill,
                                    isCheckedIn ? styles.statusPillIn : styles.statusPillOut,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.statusDot,
                                        isCheckedIn ? styles.statusDotIn : styles.statusDotOut,
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.statusText,
                                        isCheckedIn ? styles.statusTextIn : styles.statusTextOut,
                                    ]}
                                >
                                    {statusText}
                                </Text>
                            </View>
                        </View>

                        {lastStatusChange && (
                            <Text style={styles.lastChangeText}>
                                Sist oppdatert: {lastStatusChange}
                            </Text>
                        )}
                    </View>
                )}

                {/* Agenda for each child */}
                {MOCK_AGENDA.map((agenda) => (
                    <View key={agenda.childName} style={styles.agendaCard}>
                        <Text style={styles.agendaTitle}>
                            Dagens agenda {agenda.childName}:
                        </Text>
                        {agenda.absentRegistered && (
                            <Text style={styles.absenceText}>Registrert fravær ❌</Text>
                        )}
                        <View style={styles.agendaBox}>
                            <Text style={styles.agendaDate}>{agenda.date}</Text>
                            {agenda.items.map((item) => (
                                <Text key={item} style={styles.agendaItem}>
                                    • {item}
                                </Text>
                            ))}

                            {agenda.note && (
                                <View style={styles.noteBox}>
                                    <Text style={styles.noteTitle}>NB!</Text>
                                    <Text style={styles.noteText}>{agenda.note}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

type ButtonVariant = "default" | "danger" | "brown";

type ButtonProps = {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
};

function PrimaryButton({ label, onPress, variant = "default" }: ButtonProps) {
    const backgroundColor =
        variant === "danger"
            ? Colors.red
            : variant === "brown"
                ? Colors.brown
                : Colors.primaryBlue;

    const textColor =
        variant === "danger" || variant === "brown" ? "#FFFFFF" : "#111827";

    return (
        <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor }]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Text style={[styles.primaryBtnText, { color: textColor }]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
    absenceText: {
        fontSize: 12,
        color: Colors.red,
        marginBottom: 6,
    },
    noteBox: {
        marginTop: 10,
        backgroundColor: Colors.yellow,
        borderRadius: 8,
        padding: 8,
    },
    noteTitle: {
        fontWeight: "700",
        fontSize: 12,
    },
    noteText: {
        fontSize: 11,
    },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  headerWrapper: {
    alignSelf: "center",
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 24,
  },
  appButtonText: {
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.5,
  },

  bhgTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: Colors.text,
  },

  parentCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  parentGreeting: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  parentSub: {
    fontSize: 13,
    color: Colors.textMuted,
  },

  quickActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  primaryBtn: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexBasis: "48%",
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: Colors.text,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
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
  },

  agendaCard: {
    marginBottom: 18,
  },
  agendaTitle: {
    fontWeight: "700",
    marginBottom: 4,
    color: Colors.text,
  },
  agendaBox: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  agendaDate: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    color: Colors.text,
  },
  agendaItem: {
    fontSize: 12,
    marginBottom: 2,
    color: Colors.text,
  },
});
