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
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calendarApi, CalendarEventResponseDto } from "@/services/staffApi";

const API_BASE_URL = Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export default function HomeScreen() {
    const router = useRouter();

    const [userName, setUserName] = useState<string>("");
    const [children, setChildren] = useState<any[]>([]);
    const [kindergartenName, setKindergartenName] = useState<string>("");
    const [todayEvents, setTodayEvents] = useState<CalendarEventResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkInStatus, setCheckInStatus] = useState<"INN" | "UT" | null>(null);
    const [lastStatusChange, setLastStatusChange] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const userStr = await AsyncStorage.getItem("currentUser");
            if (!userStr) return;

            const user = JSON.parse(userStr);
            if (!user.profileId || user.role !== "PARENT") return;

            const token = await AsyncStorage.getItem("authToken");

            // Fetch parent profile
            const parentRes = await fetch(`${API_BASE_URL}/api/parents/${user.profileId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (parentRes.ok) {
                const parentData = await parentRes.json();
                setUserName(parentData.firstName || "");
            }

            // Fetch children
            const childrenRes = await fetch(`${API_BASE_URL}/api/children/parent/${user.profileId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (childrenRes.ok) {
                const childrenData = await childrenRes.json();
                setChildren(childrenData);

                if (childrenData.length > 0) {
                    const firstChild = childrenData[0];
                    setKindergartenName(firstChild.kindergartenName || "");

                    // Load check-in status
                    const storedStatus = await AsyncStorage.getItem(`checkin_status_${firstChild.id}`);
                    const storedTime = await AsyncStorage.getItem(`checkin_time_${firstChild.id}`);
                    if (storedStatus === "INN" || storedStatus === "UT") {
                        setCheckInStatus(storedStatus);
                    }
                    setLastStatusChange(storedTime ?? null);

                    // Fetch today's calendar events
                    if (firstChild.kindergartenId) {
                        const today = new Date().toISOString().split("T")[0];
                        try {
                            const events = await calendarApi.getEventsForParent(
                                firstChild.kindergartenId,
                                today,
                                today
                            );
                            setTodayEvents(events || []);
                        } catch (err) {
                            console.log("Kalender feil:", err);
                        }
                    }
                }
            }
        } catch (error) {
            console.log("Feil ved lasting:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

    const firstChild = children.length > 0 ? children[0] : null;
    const isCheckedIn = checkInStatus === "INN";

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primaryBlue} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header with app name */}
                <View style={styles.headerWrapper}>
                    <Text style={styles.appButtonText}>CHECK KID</Text>
                </View>

                {/* Kindergarten name */}
                {kindergartenName && (
                    <Text style={styles.bhgTitle}>{kindergartenName}</Text>
                )}

                {/* Parent greeting with inbox button */}
                <View style={styles.greetingRow}>
                    <View>
                        <Text style={styles.parentGreeting}>Hei {userName}!</Text>
                        {children.length > 0 && (
                            <Text style={styles.parentSub}>
                                Forelder til {children.map((c) => c.firstName).join(" og ")}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.inboxButton}
                        onPress={() => router.push("/messages")}
                    >
                        <Ionicons name="mail-outline" size={24} color={Colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Primary action: Check in/out */}
                {firstChild ? (
                    <TouchableOpacity
                        style={[styles.checkinCard, isCheckedIn ? styles.checkinCardIn : styles.checkinCardOut]}
                        onPress={() => router.push("/checkin")}
                        activeOpacity={0.85}
                    >
                        <View style={styles.checkinContent}>
                            <Ionicons
                                name={isCheckedIn ? "checkmark-circle" : "ellipse-outline"}
                                size={40}
                                color={isCheckedIn ? "#16A34A" : "#DC2626"}
                            />
                            <View style={styles.checkinTextContent}>
                                <Text style={styles.checkinTitle}>
                                    {isCheckedIn
                                        ? `${firstChild.firstName} er sjekket inn`
                                        : `${firstChild.firstName} er ikke sjekket inn`}
                                </Text>
                                {lastStatusChange && (
                                    <Text style={styles.checkinSubtext}>Sist oppdatert: {lastStatusChange}</Text>
                                )}
                            </View>
                        </View>
                        <Text style={styles.checkinAction}>
                            {isCheckedIn ? "Sjekk ut" : "Sjekk inn"} →
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.noChildCard}>
                        <Text style={styles.noChildText}>Ingen barn registrert</Text>
                        <TouchableOpacity
                            style={styles.addChildButton}
                            onPress={() => router.push("/profile")}
                        >
                            <Text style={styles.addChildButtonText}>Legg til barn</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Secondary actions row */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonDanger]}
                        onPress={() => {}}
                    >
                        <Ionicons name="close-circle-outline" size={20} color="#fff" />
                        <Text style={styles.actionButtonTextLight}>Registrer fravær</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonNeutral]}
                        onPress={() => router.push("/day-summary")}
                    >
                        <Ionicons name="document-text-outline" size={20} color={Colors.text} />
                        <Text style={styles.actionButtonText}>Dagens sammendrag</Text>
                    </TouchableOpacity>
                </View>

                {/* Today's events from calendar */}
                <View style={styles.agendaCard}>
                    <View style={styles.agendaHeader}>
                        <Text style={styles.agendaTitle}>Dagens hendelser</Text>
                        <TouchableOpacity onPress={() => router.push("/calendar")}>
                            <Ionicons name="calendar-outline" size={20} color={Colors.primaryBlue} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.agendaBox}>
                        <Text style={styles.agendaDate}>
                            {new Date().toLocaleDateString("nb-NO", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            })}
                        </Text>
                        {todayEvents.length === 0 ? (
                            <Text style={styles.noEventsText}>Ingen hendelser planlagt for i dag</Text>
                        ) : (
                            todayEvents.map((event) => (
                                <View key={event.id} style={styles.eventRow}>
                                    {event.isSpecialOccasion && (
                                        <Ionicons name="star" size={12} color={Colors.yellow} />
                                    )}
                                    <Text style={styles.agendaItem}>
                                        {event.startTime ? `${event.startTime}: ` : "• "}
                                        {event.title}
                                        {event.groupName ? ` (${event.groupName})` : ""}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        marginBottom: 16,
    },
    appButtonText: {
        fontWeight: "700",
        fontSize: 18,
        letterSpacing: 0.5,
        color: Colors.text,
    },
    bhgTitle: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 16,
        color: Colors.textMuted,
    },
    greetingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.primaryLightBlue,
        marginBottom: 16,
    },
    parentGreeting: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.text,
    },
    parentSub: {
        fontSize: 13,
        color: Colors.textMuted,
        marginTop: 2,
    },
    inboxButton: {
        padding: 10,
        backgroundColor: Colors.primaryLightBlue,
        borderRadius: 12,
    },
    checkinCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    checkinCardIn: {
        backgroundColor: "#DCFCE7",
        borderWidth: 2,
        borderColor: "#16A34A",
    },
    checkinCardOut: {
        backgroundColor: "#FEE2E2",
        borderWidth: 2,
        borderColor: "#DC2626",
    },
    checkinContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    checkinTextContent: {
        flex: 1,
    },
    checkinTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.text,
    },
    checkinSubtext: {
        fontSize: 11,
        color: Colors.textMuted,
        marginTop: 2,
    },
    checkinAction: {
        textAlign: "right",
        fontSize: 14,
        fontWeight: "600",
        color: Colors.text,
        marginTop: 8,
    },
    noChildCard: {
        backgroundColor: Colors.primaryLightBlue,
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        marginBottom: 16,
    },
    noChildText: {
        fontSize: 14,
        color: Colors.textMuted,
        marginBottom: 12,
    },
    addChildButton: {
        backgroundColor: Colors.primaryBlue,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    addChildButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.text,
    },
    actionsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionButtonDanger: {
        backgroundColor: Colors.red,
    },
    actionButtonNeutral: {
        backgroundColor: Colors.primaryBlue,
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.text,
    },
    actionButtonTextLight: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
    },
    agendaCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.primaryLightBlue,
        padding: 16,
    },
    agendaHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    agendaTitle: {
        fontWeight: "700",
        fontSize: 15,
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
        marginBottom: 8,
        color: Colors.text,
        textTransform: "capitalize",
    },
    noEventsText: {
        fontSize: 12,
        color: Colors.textMuted,
        fontStyle: "italic",
    },
    eventRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 4,
    },
    agendaItem: {
        fontSize: 12,
        color: Colors.text,
    },
});
