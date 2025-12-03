import { Stack, useLocalSearchParams, useRouter,Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView,Platform, Pressable, StyleSheet, Text, TextInput, View, } from "react-native";
import { mockLogin } from "../../services/mockAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setErrorMsg("Fyll ut både e-post og passord!");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const user = await mockLogin(
        email,
        password,
        role === "ansatt" || role === "forelder" ? (role as any) : undefined
      );
      console.log("Innlogget:", user);
      // for nå sende den tilbake til tabs
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("Feil ved innlogging:", err);
      setErrorMsg(
        typeof err === "string"
          ? err
          : "Noe gikk galt. Sjekk e-post og passord."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const typeRole =
    role === "ansatt"
      ? "Ansatt"
      : role === "forelder"
      ? "Primærkontakt"
      : "bruker";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Stack.Screen options={{ title: "Logg inn" }} />

      <View style={styles.card}>
        <Text style={styles.title}>Logg inn som {typeRole}</Text>

        <TextInput
          style={styles.input}
          placeholder="E-post"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Passord"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <Pressable
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Logger inn." : "Logg inn"}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Text>Har du ikke bruker?</Text>
          <Link href="../personvern" style={styles.link}>
            Les personvern og registrer deg
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  error: {
    color: "#b91c1c",
    marginTop: 4,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#4ade80",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "black", fontWeight: "600", fontSize: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 12,
    flexWrap: "wrap",
  },
  link: {
    textDecorationLine: "underline",
  },
});