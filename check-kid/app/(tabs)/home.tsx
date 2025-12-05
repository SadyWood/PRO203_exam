import {
    View, 
    Text, 
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colors";

const MOCK_PARENT = {
name: "Ola",
children: ["Edith", "Stian"],
};

const MOCK_AGENDA = [
    {
        childName: "Edith",
        date: "09.01.26",
        absentRegistered: true,
        items: [
            "Felles oppstart: 08:45",
            "tegne/puslespill: 09:00 - 10:00",
            "Leseøkt: 10:15 - 10:45",
            "Ryddetid: 10.45 - 11:00",
            "Lunsj: 11:00, dagens varmmat: Pasta",
            "Sovetid: 11:30",
            "Stå opp og spise matpakke: 13:30",
            "Leke ute i snøen kl 14:30",
        ],
    },
    {
        childName: "Stian",
        date: "09.01.26",
        absentRegistered: false,
        items: [
            "Felles oppstart: 08:45",
            "tegne/puslespill: 09:00 - 10:00",
            "Leseøkt: 10:15 - 10:45",
            "Ryddetid: 10.45 - 11:00",
            "Lunsj: 11:00, dagens varmmat: Pasta",
            "På tur til slottet: 12:15",
            "Spise matpakke: 13:00",
            "Komme tilbake: 14:30",
        ],
        note: "Vi skal på tur, husk ekstra mat!"
    },
];

export default function HomeScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.ScrollContent}>
                {/*CHECK KID!*/}
                <View style={styles.headerWrapper}>
                    <Text style={styles.appButtonText}>CHECK KID ✅</Text>
                </View>

                {/*Eventyrhagen Barnehage*/}
                <Text style={styles.bhgTitle}>Eventyrhagen Barnehage</Text>

                {/*foreldre kort*/}
                <View style={styles.parentCard}>
                    <View>
                        <Text style={styles.parentGreeting}>Hei {MOCK_PARENT.name}!</Text>
                        <Text style={styles.parentSub}>
                            Pappa til {MOCK_PARENT.children.join(" og ")}
                        </Text>
                    </View>
                </View>
                {/* HurtigKnapper */}
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

                    {/* Agenda for hvert barn */}
                    {MOCK_AGENDA.map ((agenda) => (
                        <View key={agenda.childName} style={styles.agendaCard}>
                            <Text style={styles.agendaTitle}>
                                Dagens agenda {agenda.childName}:
                            </Text>
                            {agenda.absentRegistered && (
                                <Text style={styles.absenceText}>Registert fravær ❌</Text>
                            )}
                            <View style={styles.agendaBox}>
                                <Text style={styles.agendaDate}>{agenda.date}</Text>
                                {agenda.items.map((item) => (
                                    <Text key={item} style={styles.agendaItem}>
                                        * {item}
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
                    </View>
            </ScrollView>
        </View>
    );
}

type ButtonVariant = "default" | "danger" | "brown";

type ButtonProps = {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
};

function PrimaryButton({ label, onPress, variant = "default"}: ButtonProps) {
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
        style={[styles.primaryBtn, { backgroundColor}]}
        onPress={onPress}
        activeOpacity={0.85}
        >
            <Text style={[styles.primaryBtnText, { color : textColor}]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.background,
    },
    ScrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24, 
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
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 16,
        color: Colors.text,
    },
    parentCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: Colors.primaryLightBlue,
    },
    parentGreeting: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.text,
    },
    parentSub: {
        fontSize: 13,
        color: Colors.textMuted,
        marginTop: 2,
    },
    quickActionsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 24,
    },
    primaryBtn: {
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    primaryBtnText: {
        fontSize: 13,
        fontWeight: "600",
    },
    agendaCard: {
        marginBottom: 18,
    },
    agendaTitle: {
        fontWeight: "700",
        marginBottom: 4,
        color: Colors.text,
    },
    absenceText: {
        fontSize: 12,
        color: Colors.red,
        marginBottom: 6,
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
});
