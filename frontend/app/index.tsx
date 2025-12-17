import { useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Colors } from "@/constants/colors";
import { useState, useEffect } from "react";
import { loginWithGoogle } from "@/services/authApi";
import { authRefresh } from "./_layout";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function StartScreen() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "231817845094-em6lk0v2d6ndnrfdcsngv8rf5k8poiju.apps.googleusercontent.com",
    iosClientId: "231817845094-tm3a42ql593rlkch0af5iq9m1j8pd1aq.apps.googleusercontent.com",
    androidClientId: "231817845094-uosrqoegm0dtt60n18iso1u533h2noau.apps.googleusercontent.com",
    selectAccount: true,
  });

  useEffect(() => {
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

          const loginResponse = await loginWithGoogle(idToken);
          console.log("Google login OK:", loginResponse);

          if (loginResponse.needsRegistration) {
            router.push({
              pathname: "/personvern",
              params: { userId: loginResponse.user.id },
            });
            return;
          }

          await authRefresh();

          const user = loginResponse.user;

          // Role-based navigation
          const userRole = user?.role;

          if (userRole === "PARENT") {
            router.replace("/(tabs)/home");
          } else if (userRole === "STAFF") {
            router.replace("/(staff)/employee-home");
          } else if (userRole === "BOSS" || userRole === "ADMIN") {
            router.replace("/(staff)/employee-home");
          } else {
            router.replace("/(tabs)/home");
          }
        } catch (err: any) {
          console.log("Feil ved Google-innlogging:", err);
          setErrorMsg(err.message || "Innlogging feilet");
        } finally {
          setIsGoogleLoading(false);
        }
      } else if (response?.type === "error") {
        console.log("Google response error:", response.error);
        setErrorMsg("Google-innlogging avbrutt eller feilet.");
        setIsGoogleLoading(false);
      }
    };

    void handleGoogleResponse();
  }, [response, router]);

  async function handleStartPress() {
    if (!request) {
      setErrorMsg("Google-innlogging er ikke klar enda. Prøv igjen om litt.");
      return;
    }
    setIsGoogleLoading(true);
    setErrorMsg(null);
    await promptAsync();
  }

  return (
      <View style={styles.screen}>
        <View style={styles.logoBox}>
          <Image
              source={require('@/assets/images/Startpage.jpg')}
              style={styles.logoImage}
              resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

          <Pressable
              style={[styles.bigButton, (isGoogleLoading || !request) && { opacity: 0.7 }]}
              onPress={handleStartPress}
              disabled={isGoogleLoading || !request}
          >
            <Text style={styles.bigButtonText}>
              {isGoogleLoading ? "Logger inn..." : "Start"}
            </Text>
          </Pressable>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    paddingTop: 150,
  },

  logoBox: {
    width: "85%",
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 40,
  },

  logoImage: {
    width: '60%',
    height: undefined,
    aspectRatio: 1,
  },

  logoText: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },

  content: {
    width: "45%",
    gap: 20,
  },

  bigButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: Colors.primaryLightBlue,
    alignItems: "center",
  },

  bigButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },

  error: {
    color: Colors.red,
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 16,
  },

  registerBox: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.red,
    alignItems: "center",
  },

  registerText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
});