import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView,Platform,Pressable,StyleSheet,Text, TextInput,View,} from "react-native";
import { mockRegister } from "@/services/mockAuth";

export default function RegisterScreen() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    if (!displayName || !email || !password) {
      setErrorMsg("Fyll ut alle felt.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Passord må være minst 6 tegn.");
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      await mockRegister(email, password, "forelder");
      // Etter registrering  sendes til login som forelder
      router.replace("/(auth)/login?role=forelder");
    } catch (err: any) {
      console.log("Feil ved registrering:", err);
      setErrorMsg(
        typeof err === "string"
          ? err
          : "Kunne ikke registrere bruker. Sjekk e-post og prøv igjen."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Stack.Screen options={{ title: "Registrer deg" }} />

      <View style={styles.card}>
        <Text style={styles.title}>Opprett ny bruker</Text>

        <TextInput
          style={styles.input}
          placeholder="Navn"
          value={displayName}
          onChangeText={setDisplayName}
        />

        <TextInput
          style={styles.input}
          placeholder="E-post"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Passord"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <Pressable
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Oppretter bruker." : "Registrer"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
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
  buttonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
});
