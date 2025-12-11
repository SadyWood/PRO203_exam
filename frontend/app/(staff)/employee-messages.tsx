import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// TODO: Hent fra backend senere
const THREADS = [
  {
    id: "1",
    name: "Ola Hansen",
    subtitle: "Far til Stian i avdeling Bjørn",
    unreadCount: 1,
  },
  {
    id: "2",
    name: "Simon",
    subtitle: "",
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Pia",
    subtitle: "",
    unreadCount: 0,
  },
];

export default function EmployeeMessages() {
  const router = useRouter();

  return (
    <View style={styles.container}>
        
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={26} color={Colors.text} />
      </TouchableOpacity>

      <Text style={styles.title}>Meldinger</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {THREADS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.threadBox}
            onPress={() =>
              router.push({
                pathname: "/(staff)/employee-messages/[id]",
                params: { id: t.id },
              })
            }
          >
            <View>
              <Text style={styles.threadName}>{t.name}</Text>
              {t.subtitle ? (
                <Text style={styles.threadSubtitle}>{t.subtitle}</Text>
              ) : null}
            </View>

            {t.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{t.unreadCount}</Text>
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
    backgroundColor: "#FFF2F2",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  backButton: {
    marginBottom: 10,
  },

  headerBox: {
    backgroundColor: "#BACEFF",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  scroll: {
    paddingBottom: 40,
  },

  threadBox: {
    backgroundColor: "#BACEFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  threadName: {
    fontSize: 16,
    fontWeight: "700",
  },

  threadSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },

  unreadBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.red,
    justifyContent: "center",
    alignItems: "center",
  },

  unreadText: {
    color: "white",
    fontWeight: "700",
  },
});
