import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function StartScreen() {
  return (
    <View style={styles.screen}>
      {/* CHECK-KID øverst */}
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>CHECK-KID ✅</Text>
      </View>

      {/* Knapper og registrering */}
      <View style={styles.content}>
        <Pressable style={styles.bigButton}>
          <Link
            href={{ pathname: "/login", params: { role: "ansatt" } }}
            style={styles.bigButtonText}
          >
            Logg inn Ansatt
          </Link>
        </Pressable>

        <Pressable style={styles.bigButton}>
          <Link
            href={{ pathname: "/login", params: { role: "forelder" } }}
            style={styles.bigButtonText}
          >
            Logg inn Primærkontakt
          </Link>
        </Pressable>

        <Pressable style={styles.registerBox}>
          <Link href={{ pathname: "/personvern" }} style={styles.registerText}>
            Ikke registrert? Registrer deg her nå
          </Link>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 150,
  },

  logoBox: {
    width: "85%",
    paddingVertical: 24,
    borderRadius: 16,
    backgroundColor: "#bfdbfe",
    alignItems: "center",
    marginBottom: 40,
  },

  logoText: {
    fontSize: 24,
    fontWeight: "800",
  },

  content: {
    width: "85%",
    gap: 20,
  },

  bigButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: "#bfdbfe",
    alignItems: "center",
  },

  bigButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },

  registerBox: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fecaca",
    alignItems: "center",
  },

  registerText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
