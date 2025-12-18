import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authRefresh } from "./_layout";
import { useLocalSearchParams } from "expo-router";
import { RegistrationStyles as styles } from "@/styles";

const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

type Role = "PARENT" | "STAFF" | "BOSS";

export default function RegisterScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Child registration toggle
  const [wantsToAddChild, setWantsToAddChild] = useState(false);
  const [childFirstName, setChildFirstName] = useState("");
  const [childLastName, setChildLastName] = useState("");
  const [childBirthDate, setChildBirthDate] = useState("");
  const [childBirthDateObj, setChildBirthDateObj] = useState(new Date(2022, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [kindergartenId, setKindergartenId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState("");
  const [kindergartens, setKindergartens] = useState<any[]>([]);
  const [kindergartenName, setKindergartenName] = useState("");
  const [kindergartenAddress, setKindergartenAddress] = useState("");
  const [kindergartenPhone, setKindergartenPhone] = useState("");
  const [kindergartenEmail, setKindergartenEmail] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedRole === "STAFF") {
      fetchKindergartens();
    }
  }, [selectedRole]);

  async function fetchKindergartens() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/kindergartens`);
      if (res.ok) {
        const data = await res.json();
        setKindergartens(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    // On Android, dismiss picker after selection
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (event.type === "dismissed") {
      return;
    }

    if (selectedDate) {
      setChildBirthDateObj(selectedDate);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      setChildBirthDate(formatted);
    }
  };

  const handleDatePickerPress = () => {
    setShowDatePicker(true);
  };

  const confirmIOSDate = () => {
    setShowDatePicker(false);
    // Date is already set via onDateChange
    if (!childBirthDate) {
      // Set default if no date selected yet
      const date = childBirthDateObj;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      setChildBirthDate(`${year}-${month}-${day}`);
    }
  };

  async function handleRegister() {
    if (!selectedRole || !firstName || !lastName) {
      setErrorMsg("Ikke fylt ut obligatoriske felt...");
      return;
    }

    if (selectedRole === "STAFF" && !kindergartenId) {
      setErrorMsg("Ikke valgt barnehage.");
      return;
    }

    if (selectedRole === "BOSS" && !kindergartenName) {
      setErrorMsg("Ikke oppgitt barnehagens navn.");
      return;
    }

    // Validate child data if user wants to add child
    if (selectedRole === "PARENT" && wantsToAddChild) {
      if (!childFirstName || !childLastName || !childBirthDate) {
        setErrorMsg("Fyll ut all informasjon om barnet eller velg 'Legg til senere'.");
        return;
      }
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const registrationData: any = {
        role: selectedRole,
        firstName,
        lastName,
        phoneNumber,
      };

      if (selectedRole === "STAFF") {
        registrationData.employeeId = employeeId;
        registrationData.position = position;
        registrationData.kindergartenId = kindergartenId;
      } else if (selectedRole === "BOSS") {
        registrationData.employeeId = employeeId;
        registrationData.kindergartenName = kindergartenName;
        registrationData.kindergartenAddress = kindergartenAddress;
        registrationData.kindergartenPhone = kindergartenPhone;
        registrationData.kindergartenEmail = kindergartenEmail;
      }

      console.log("Registering with data:", registrationData);

      const res = await fetch(
        `${API_BASE_URL}/api/auth/complete-registration/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Registrering feilet");
      }

      const loginResponse = await res.json();

      await AsyncStorage.setItem("authToken", loginResponse.token);
      await AsyncStorage.setItem("currentUser", JSON.stringify(loginResponse.user));
      await authRefresh();

      console.log("Registration successful!", loginResponse);

      if (selectedRole === "PARENT") {
        if (wantsToAddChild && childFirstName && childLastName && childBirthDate) {
          await addChild(loginResponse.user.profileId);
        }
        router.replace("/home");
      } else if (selectedRole === "STAFF" || selectedRole === "BOSS") {
        router.replace("/(staff)/employee-home");
      }
    } catch (err: any) {
      console.log(err);
      setErrorMsg(err.message || "Noe gikk galt");
    } finally {
      setIsLoading(false);
    }
  }

  async function addChild(parentId: string) {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const res = await fetch(`${API_BASE_URL}/api/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: childFirstName,
          lastName: childLastName,
          birthDate: childBirthDate,
          parentId: parentId,
        }),
      });

      if (res.ok) {
        console.log("Child added");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Stack.Screen options={{ title: "Fullfør registrering" }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Fullfør registrering</Text>

          <Text style={styles.sectionTitle}>Velg rolle:</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[styles.roleButton, selectedRole === "PARENT" && styles.roleButtonActive]}
              onPress={() => setSelectedRole("PARENT")}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === "PARENT" && styles.roleButtonTextActive,
                ]}
              >
                Forelder
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, selectedRole === "STAFF" && styles.roleButtonActive]}
              onPress={() => setSelectedRole("STAFF")}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === "STAFF" && styles.roleButtonTextActive,
                ]}
              >
                Ansatt
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, selectedRole === "BOSS" && styles.roleButtonActive]}
              onPress={() => setSelectedRole("BOSS")}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === "BOSS" && styles.roleButtonTextActive,
                ]}
              >
                Sjef
              </Text>
            </TouchableOpacity>
          </View>

          {selectedRole && (
            <>
              <Text style={styles.sectionTitle}>Personlig informasjon:</Text>

              <TextInput
                style={styles.input}
                placeholder="* Fornavn"
                placeholderTextColor={Colors.textMuted}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="* Etternavn"
                placeholderTextColor={Colors.textMuted}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Telefonnummer"
                placeholderTextColor={Colors.textMuted}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />

              {selectedRole === "PARENT" && (
                <>
                  <Text style={styles.sectionTitle}>Legg til barn:</Text>

                  <View style={styles.optionToggleRow}>
                    <Text style={styles.optionToggleText}>
                      Vil du legge til et barn nå?
                    </Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        style={[
                          styles.optionToggleButton,
                          wantsToAddChild && styles.optionToggleButtonActive,
                        ]}
                        onPress={() => setWantsToAddChild(true)}
                      >
                        <Text style={styles.optionToggleButtonText}>Ja</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.optionToggleButton,
                          !wantsToAddChild && styles.optionToggleButtonActive,
                        ]}
                        onPress={() => setWantsToAddChild(false)}
                      >
                        <Text style={styles.optionToggleButtonText}>Senere</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {wantsToAddChild && (
                    <>
                      <Text style={styles.helpText}>
                        Du kan legge til flere barn og helsedata via profilen din.
                      </Text>

                      <TextInput
                        style={styles.input}
                        placeholder="* Barnets fornavn"
                        placeholderTextColor={Colors.textMuted}
                        value={childFirstName}
                        onChangeText={setChildFirstName}
                        autoCapitalize="words"
                      />

                      <TextInput
                        style={styles.input}
                        placeholder="* Barnets etternavn"
                        placeholderTextColor={Colors.textMuted}
                        value={childLastName}
                        onChangeText={setChildLastName}
                        autoCapitalize="words"
                      />

                      <Text style={styles.label}>* Fødselsdato:</Text>

                      {Platform.OS === "ios" ? (
                        <>
                          <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={handleDatePickerPress}
                          >
                            <Text style={childBirthDate ? styles.dateText : styles.datePlaceholder}>
                              {childBirthDate
                                ? new Date(childBirthDate).toLocaleDateString("nb-NO")
                                : "Velg fødselsdato"}
                            </Text>
                          </TouchableOpacity>

                          {showDatePicker && (
                            <View style={styles.datePickerContainer}>
                              <DateTimePicker
                                value={childBirthDateObj}
                                mode="date"
                                display="spinner"
                                onChange={onDateChange}
                                maximumDate={new Date()}
                                minimumDate={new Date(2018, 0, 1)}
                                locale="nb-NO"
                              />
                              <TouchableOpacity
                                style={[styles.button, { marginTop: 8 }]}
                                onPress={confirmIOSDate}
                              >
                                <Text style={styles.buttonText}>Bekreft dato</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </>
                      ) : (
                        <>
                          <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={handleDatePickerPress}
                          >
                            <Text style={childBirthDate ? styles.dateText : styles.datePlaceholder}>
                              {childBirthDate
                                ? new Date(childBirthDate).toLocaleDateString("nb-NO")
                                : "Trykk for å velge fødselsdato"}
                            </Text>
                          </TouchableOpacity>

                          {showDatePicker && (
                            <DateTimePicker
                              value={childBirthDateObj}
                              mode="date"
                              display="default"
                              onChange={onDateChange}
                              maximumDate={new Date()}
                              minimumDate={new Date(2018, 0, 1)}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {selectedRole === "STAFF" && (
                <>
                  <Text style={styles.sectionTitle}>Arbeidsinformasjon:</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Ansattnummer"
                    placeholderTextColor={Colors.textMuted}
                    value={employeeId}
                    onChangeText={setEmployeeId}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Stilling"
                    placeholderTextColor={Colors.textMuted}
                    value={position}
                    onChangeText={setPosition}
                  />

                  <Text style={styles.label}>* Velg barnehage:</Text>
                  {kindergartens.length > 0 ? (
                    <View style={styles.pickerContainer}>
                      {kindergartens.map((kg) => (
                        <TouchableOpacity
                          key={kg.id}
                          style={[
                            styles.kindergartenOption,
                            kindergartenId === kg.id && styles.kindergartenOptionActive,
                          ]}
                          onPress={() => setKindergartenId(kg.id)}
                        >
                          <Text style={styles.kindergartenText}>{kg.name}</Text>
                          {kg.address && (
                            <Text style={styles.kindergartenAddress}>{kg.address}</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.helpText}>Laster inn barnehager...</Text>
                  )}
                </>
              )}

              {selectedRole === "BOSS" && (
                <>
                  <Text style={styles.sectionTitle}>Arbeidsinformasjon:</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Ansattnummer"
                    placeholderTextColor={Colors.textMuted}
                    value={employeeId}
                    onChangeText={setEmployeeId}
                  />

                  <Text style={styles.sectionTitle}>Opprett barnehage:</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="* Barnehagens navn"
                    placeholderTextColor={Colors.textMuted}
                    value={kindergartenName}
                    onChangeText={setKindergartenName}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Adresse"
                    placeholderTextColor={Colors.textMuted}
                    value={kindergartenAddress}
                    onChangeText={setKindergartenAddress}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Telefon"
                    placeholderTextColor={Colors.textMuted}
                    value={kindergartenPhone}
                    onChangeText={setKindergartenPhone}
                    keyboardType="phone-pad"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="E-post"
                    placeholderTextColor={Colors.textMuted}
                    value={kindergartenEmail}
                    onChangeText={setKindergartenEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </>
              )}

              {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

              <Pressable
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Registrerer..." : "Lagre"}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
