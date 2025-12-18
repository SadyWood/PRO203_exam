import { Stack, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
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

  // Date input as separate fields
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  // Calendar picker state
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date(2022, 0, 1));

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

  // Handle day input with auto-focus
  const handleDayChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 2) {
      setBirthDay(cleaned);
      if (cleaned.length === 2) {
        monthRef.current?.focus();
      }
    }
  };

  // Handle month input with auto-focus
  const handleMonthChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 2) {
      setBirthMonth(cleaned);
      if (cleaned.length === 2) {
        yearRef.current?.focus();
      }
    }
  };

  // Handle year input
  const handleYearChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 4) {
      setBirthYear(cleaned);
    }
  };

  // Get formatted birth date for API
  const getFormattedBirthDate = (): string | null => {
    const day = parseInt(birthDay, 10);
    const month = parseInt(birthMonth, 10);
    const year = parseInt(birthYear, 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }

    if (day < 1 || day > 31) return null;
    if (month < 1 || month > 12) return null;
    if (year < 2010 || year > new Date().getFullYear()) return null;

    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  // Handle calendar date selection
  const onCalendarDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowCalendarPicker(false);
    }

    if (event.type === "dismissed") {
      return;
    }

    if (selectedDate) {
      setCalendarDate(selectedDate);
      setBirthDay(String(selectedDate.getDate()).padStart(2, "0"));
      setBirthMonth(String(selectedDate.getMonth() + 1).padStart(2, "0"));
      setBirthYear(String(selectedDate.getFullYear()));
    }
  };

  const confirmCalendarDate = () => {
    setShowCalendarPicker(false);
    setBirthDay(String(calendarDate.getDate()).padStart(2, "0"));
    setBirthMonth(String(calendarDate.getMonth() + 1).padStart(2, "0"));
    setBirthYear(String(calendarDate.getFullYear()));
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
      const birthDate = getFormattedBirthDate();
      if (!childFirstName || !childLastName || !birthDate) {
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
        const birthDate = getFormattedBirthDate();
        if (wantsToAddChild && childFirstName && childLastName && birthDate) {
          await addChild(loginResponse.user.profileId, birthDate);
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

  async function addChild(parentId: string, birthDate: string) {
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
          birthDate: birthDate,
          // Note: kindergartenId is optional, can be added later
        }),
      });

      if (res.ok) {
        console.log("Child added successfully");
      } else {
        const errorText = await res.text();
        console.error("Failed to add child:", errorText);
      }
    } catch (error) {
      console.error("Error adding child:", error);
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
                    <View style={styles.childFormContainer}>
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

                      {/* Date input row */}
                      <View style={styles.dateInputRow}>
                        <View style={styles.dateInputWrapper}>
                          <TextInput
                            style={styles.dateInputSmall}
                            placeholder="DD"
                            placeholderTextColor={Colors.textMuted}
                            value={birthDay}
                            onChangeText={handleDayChange}
                            keyboardType="number-pad"
                            maxLength={2}
                          />
                          <Text style={styles.dateInputLabel}>Dag</Text>
                        </View>

                        <Text style={styles.dateSeparator}>/</Text>

                        <View style={styles.dateInputWrapper}>
                          <TextInput
                            ref={monthRef}
                            style={styles.dateInputSmall}
                            placeholder="MM"
                            placeholderTextColor={Colors.textMuted}
                            value={birthMonth}
                            onChangeText={handleMonthChange}
                            keyboardType="number-pad"
                            maxLength={2}
                          />
                          <Text style={styles.dateInputLabel}>Måned</Text>
                        </View>

                        <Text style={styles.dateSeparator}>/</Text>

                        <View style={styles.dateInputWrapperLarge}>
                          <TextInput
                            ref={yearRef}
                            style={styles.dateInputLarge}
                            placeholder="ÅÅÅÅ"
                            placeholderTextColor={Colors.textMuted}
                            value={birthYear}
                            onChangeText={handleYearChange}
                            keyboardType="number-pad"
                            maxLength={4}
                          />
                          <Text style={styles.dateInputLabel}>År</Text>
                        </View>

                        {/* Calendar picker button */}
                        <TouchableOpacity
                          style={styles.calendarButton}
                          onPress={() => setShowCalendarPicker(true)}
                        >
                          <Ionicons name="calendar-outline" size={24} color={Colors.primaryBlue} />
                        </TouchableOpacity>
                      </View>

                      {/* Calendar picker modal/inline */}
                      {showCalendarPicker && (
                        Platform.OS === "ios" ? (
                          <View style={styles.datePickerContainer}>
                            <DateTimePicker
                              value={calendarDate}
                              mode="date"
                              display="spinner"
                              onChange={onCalendarDateChange}
                              maximumDate={new Date()}
                              minimumDate={new Date(2010, 0, 1)}
                              locale="nb-NO"
                            />
                            <TouchableOpacity
                              style={styles.calendarConfirmButton}
                              onPress={confirmCalendarDate}
                            >
                              <Text style={styles.buttonText}>Bekreft dato</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <DateTimePicker
                            value={calendarDate}
                            mode="date"
                            display="default"
                            onChange={onCalendarDateChange}
                            maximumDate={new Date()}
                            minimumDate={new Date(2010, 0, 1)}
                          />
                        )
                      )}
                    </View>
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
