// app/(auth)/login.tsx
import { Stack, useLocalSearchParams, useRouter, Link } from "expo-router";
import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { mockLogin } from "../../services/mockAuth";
import { Colors } from "../../constants/colors";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

// Hvis backend kjører lokalt på 8080:
const API_BASE_URL = "http://localhost:8080";

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // Fyll inn dine faktiske IDer fra Google Cloud Console:
    clientId: "DIN_WEB_CLIENT_ID",
    iosClientId: "DIN_IOS_CLIENT_ID",
    androidClientId: "DIN_ANDROID_CLIENT_ID",
  });

  useEffect(() => {
    // Kalles når Google-login svarer
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const idToken = response.params?.id_token;

        if (!idToken) {
          setErrorMsg("Fant ikke ID-token fra Google.");
          setIsGoogleLoading(false);
          return;
        }

        try {
          setIsGoogleLoading(true);
          setErrorMsg(null);

          // Send ID-token til backend
          const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          const data = await res.json();
          if (!res.ok) {
            console.log("Google backend-feil:", data);
            setErrorMsg(data?.message || "Google-innlogging feilet.");
            return;
          }

          // Forventer LoginResponseDto { token, user, needsRegistration }
          console.log("Google login OK:", data);

          const user = data.user;
          // Her kan du evt. lagre JWT i AsyncStorage senere

          // Navigasjon basert på rolle (lik mockLogin)
          if (user?.role === "PARENT" || user?.role === "forelder") {
            router.replace("/home");
          } else if (user?.role === "STAFF" || user?.role === "ansatt") {
            router.replace("/");
          } else {
            router.replace("/");
          }
        } catch (err) {
          console.log("Feil ved Google-innlogging:", err);
          setErrorMsg("Noe gikk galt med Google-innloggingen.");
        } finally {
          setIsGoogleLoading(false);
        }
      } else if (response?.type === "error") {
        console.log("Google response error:", response.error);
        setErrorMsg("Google-innlogging avbrutt eller feilet.");
        setIsGoogleLoading(false);
      }
    };

    handleGoogleResponse();
  }, [response, router]);

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

      if (user.role === "forelder") {
        router.replace("/home");
      } else if (user.role === "ansatt") {
        router.replace("/");
      } else {
        router.replace("/");
      }
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

  async function handleGoogleLogin() {
    if (!request) {
      setErrorMsg("Google-innlogging er ikke klar enda. Prøv igjen om litt.");
      return;
    }
    setIsGoogleLoading(true);
    setErrorMsg(null);
    await promptAsync();
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
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Passord"
          placeholderTextColor={Colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <Pressable
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={isLoading || isGoogleLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Logger inn..." : "Logg inn"}
          </Text>
        </Pressable>

        {/* 🔵 Google-knapp under vanlig login */}
        <Pressable
          style={[
            styles.googleButton,
            (isGoogleLoading || !request) && { opacity: 0.7 },
          ]}
          onPress={handleGoogleLogin}
          disabled={isGoogleLoading || !request}
        >
          <Text style={styles.googleButtonText}>
            {isGoogleLoading ? "Logger inn med Google..." : "Logg inn med Google"}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Har du ikke bruker?</Text>
          <Link href={{ pathname: "/personvern" }} style={styles.link}>
            Les personvern og registrer deg
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.primaryLightBlue,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderColor: Colors.primaryLightBlue,
    color: Colors.text,
  },
  error: {
    color: Colors.red,
    marginTop: 4,
  },
  button: {
    marginTop: 8,
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
  },
  googleButton: {
    marginTop: 8,
    backgroundColor: "#1a73e8", // Google-blå-ish
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 12,
    flexWrap: "wrap",
  },
  footerText: {
    color: Colors.text,
  },
  link: {
    textDecorationLine: "underline",
    color: Colors.primaryBlue,
    fontWeight: "500",
  },
});