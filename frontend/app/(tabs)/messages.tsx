// app/(tabs)/messages.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/colors";
import { useRouter } from "expo-router";

const MOCK_THREADS = [
  {
    id: "1",
    name: "Karoline",
    subtitle: "Lærer i Stian avdeling Bjørn",
    unreadCount: 1,
    lastMessage:
      "Hei Olai! Stian skal på tur i morgen til slottet. Husk ekstra sokker ...",
  },
  {
    id: "2",
    name: "Simon",
    subtitle: "Lærer i Edith avdeling Loppe",
    unreadCount: 0,
    lastMessage: "Takk for at du leverte lappen til turen i dag!",
  },
  {
    id: "3",
    name: "Pia",
    subtitle: "Rektor Eventyrhagen Barnehage",
    unreadCount: 0,
    lastMessage: "Ny månedsplan ligger nå i appen under kalender.",
  },
];

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Tittel */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meldinger</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {MOCK_THREADS.map((thread) => (
          <TouchableOpacity
            key={thread.id}
            style={styles.threadCard}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/messages/[id]",
                params: { id: thread.id },
              })
            }
          >
            <View>
              <Text style={styles.threadName}>{thread.name}</Text>
              <Text style={styles.threadSubtitle}>{thread.subtitle}</Text>
              <Text style={styles.threadPreview} numberOfLines={1}>
                {thread.lastMessage}
              </Text>
            </View>

            {thread.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{thread.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  threadCard: {
    backgroundColor: Colors.primaryLightBlue,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  threadName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  threadSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  threadPreview: {
    fontSize: 12,
    color: Colors.text,
    maxWidth: 230,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
});
