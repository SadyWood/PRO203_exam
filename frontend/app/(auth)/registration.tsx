import { KeyboardAvoidingView,Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { completeRegistration,CompleteRegistrationDto,RegistrationRole,} from "@/services/authApi";
import { Colors } from "@/constants/colors";

type Params = {
  fullName?: string;
  email?: string;
};

export default function CompleteRegistrationScreen() {
  const router = useRouter();
  const { fullName, email } = useLocalSearchParams<Params>();

  const [role, setRole] = useState<RegistrationRole | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (fullName && !firstName && !lastName) {
      const parts = String(fullName).split(" ");
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" "));
    }
  }, [fullName]);

  function validate(): boolean {
    if (!role) {
      setErrorMsg("Velg om du er forelder eller ansatt.");
      return false;
    }
    if (!firstName || firstName.trim().length < 2) {
      setErrorMsg("Fornavn må være minst 2 tegn.");
      return false;
    }
    if (!lastName || lastName.trim().length < 2) {
      setErrorMsg("Etternavn må være minst 2 tegn.");
      return false;
    }
    if (role === "STAFF" && !employeeId.trim()) {
      setErrorMsg("Ansatt-ID må fylles ut for ansatte.");
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (role === null) {
      setErrorMsg("Velg om du er forelder eller ansatt.");
      return;
    }

    const payload: CompleteRegistrationDto = {
      role,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim() || undefined,
      address: role === "PARENT" ? address.trim() || undefined : undefined,
      employeeId:
        role === "STAFF" ? employeeId.trim() || undefined : undefined,
      position: role === "STAFF" ? position.trim() || undefined : undefined,
    };

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await completeRegistration(payload);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message ?? "Noe gikk galt. Prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function RoleButton({
    value,
    label,
  }: {
    value: RegistrationRole;
    label: string;
  }) {
    const active = role === value;
    return (
      <Pressable
        onPress={() => setRole(value)}
        style={[
          styles.roleButton,
          active && styles.roleButtonActive,
        ]}
      >
        <Text
          style={[
            styles.roleButtonText,
            active && styles.roleButtonTextActive,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Fullfør registrering" }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Velkommen!</Text>
            {email && (
              <Text style={styles.subtitle}>
                Du er logget inn som{" "}
                <Text style={styles.bold}>{email}</Text>
              </Text>
            )}

            <Text style={styles.sectionTitle}>Hvem er du?</Text>
            <View style={styles.roleRow}>
              <RoleButton value="PARENT" label="Forelder" />
              <RoleButton value="STAFF" label="Ansatt" />
            </View>

            <Text style={styles.sectionTitle}>Personinfo</Text>

            <Text style={styles.label}>Fornavn *</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="F.eks. Ola"
            />

            <Text style={styles.label}>Etternavn *</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="F.eks. Nordmann"
            />

            <Text style={styles.label}>Telefon</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="F.eks. 12345678"
              keyboardType="phone-pad"
            />

            {role === "PARENT" && (
              <>
                <Text style={styles.sectionTitle}>Adresse (valgfritt)</Text>
                <Text style={styles.label}>Adresse</Text>
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Gate, postnummer, sted"
                />
              </>
            )}

            {role === "STAFF" && (
              <>
                <Text style={styles.sectionTitle}>Ansattinfo</Text>
                <Text style={styles.label}>Ansatt-ID *</Text>
                <TextInput
                  style={styles.input}
                  value={employeeId}
                  onChangeText={setEmployeeId}
                  placeholder="F.eks. A123"
                />

                <Text style={styles.label}>Stilling</Text>
                <TextInput
                  style={styles.input}
                  value={position}
                  onChangeText={setPosition}
                  placeholder="F.eks. Pedagogisk leder"
                />
              </>
            )}

            {errorMsg && (
              <Text style={styles.errorText}>{errorMsg}</Text>
            )}

            <Pressable
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.submitButtonText}>
                  Fullfør registrering
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: Colors.background,
    justifyContent: "center",
  },

  card: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: Colors.card,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    color: Colors.text,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    color: Colors.textMuted,
  },

  bold: {
    fontWeight: "600",
  },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },

  roleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },

  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  roleButtonActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },

  roleButtonText: {
    fontSize: 14,
    color: Colors.textMuted,
  },

  roleButtonTextActive: {
    color: Colors.text,
    fontWeight: "600",
  },

  label: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 13,
    color: Colors.textMuted,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: Colors.background,
    color: Colors.text,
  },

  errorText: {
    marginTop: 12,
    color: Colors.red,
    fontSize: 13,
  },

  submitButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primaryBlue,
    alignItems: "center",
  },

  submitButtonDisabled: {
    opacity: 0.7,
  },

  submitButtonText: {
    color: Colors.text,
    fontWeight: "600",
    fontSize: 16,
  },
});
