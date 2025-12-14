import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";

const MOCK_PARENT = {
  name: "Ola",
  children: [{ id: "edith-id", name: "Edith" }],
};

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

  const child = MOCK_PARENT.children[0];

  const [status, setStatus] = useState<CheckStatus | null>(null);
  const [lastChange, setLastChange] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      const storedStatus = await AsyncStorage.getItem(
        statusKey(child.id)
      );
      const storedTime = await AsyncStorage.getItem(
        timeKey(child.id)
      );

      if (storedStatus === "INN" || storedStatus === "UT") {
        setStatus(storedStatus);
      } else {
        setStatus(null);
      }

      setLastChange(storedTime ?? null);
    } catch (err) {
      console.log("Klarte ikke lese status:", err);
    }
  }, [child.id]);

  useFocusEffect(
    useCallback(() => {
      loadStatus();
    }, [loadStatus])
  );

  const isIn = status === "INN";

  const statusText =
    status === "INN"
      ? `${child.name} er sjekket inn`
      : status === "UT"
      ? `${child.name} er sjekket ut`
      : "Ingen status registrert";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
     
        <Text style={styles.bhgTitle}>Eventyrhagen Barnehage</Text>

        <View style={styles.parentCard}>
          <Text style={styles.parentGreeting}>
            Hei {MOCK_PARENT.name}!
          </Text>
          <Text style={styles.parentSub}>
            Pappa til {child.name}
          </Text>
        </View>

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

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>
            Status for {child.name}
          </Text>

          <View style={styles.statusRow}>
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
                {statusText}
              </Text>
            </View>
          </View>

          {lastChange && (
            <Text style={styles.lastChangeText}>
              Sist oppdatert: {lastChange}
            </Text>
          )}
        </View>

        {MOCK_AGENDA.map((agenda) => (
          <View key={agenda.childName} style={styles.agendaCard}>
            <Text style={styles.agendaTitle}>
              Dagens agenda {agenda.childName}:
            </Text>
            <View style={styles.agendaBox}>
              <Text style={styles.agendaDate}>{agenda.date}</Text>
              {agenda.items.map((item) => (
                <Text key={item} style={styles.agendaItem}>
                  • {item}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

type ButtonVariant = "default" | "danger" | "brown";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
};

function PrimaryButton({
  label,
  onPress,
  variant = "default",
}: PrimaryButtonProps) {
  const backgroundColor =
    variant === "danger"
      ? Colors.red
      : variant === "brown"
      ? Colors.brown
      : Colors.primaryBlue;

  const textColor =
    variant === "danger" || variant === "brown"
      ? "#FFFFFF"
      : "#111827";

  return (
    <TouchableOpacity
      style={[styles.primaryBtn, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.primaryBtnText, { color: textColor }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
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
