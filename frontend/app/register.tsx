import { Stack, useRouter } from "expo-router";
import {useEffect, useState} from "react";
import { KeyboardAvoidingView,Platform,Pressable,StyleSheet,Text, TextInput,View, ScrollView, TouchableOpacity} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import {Colors} from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authRefresh} from "./_layout";
import {useLocalSearchParams} from "expo-router";

const API_BASE_URL = Platform.OS === "android"
? "http://10.0.2.2:8080"
    : "http://localhost:8080"

type Role = "PARENT" | "STAFF" | "BOSS";

export default function RegisterScreen(){
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string}>();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [childFirstName, setChildFirstName] = useState("");
  const [childLastName, setChildLastName] = useState("");
  const [childBirthDate, setChildBirthDate] = useState("");
  const [childBirthDateObj, setChildBirthDateObj] = useState(new Date(2025, 0, 1));
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
    if (selectedRole === "STAFF"){
      fetchKindergartens();

    }
  }, [selectedRole]);

  async function fetchKindergartens(){
    try {
      const res = await fetch(`${API_BASE_URL}/api/kindergartens`);
      if(res.ok){
        const data = await res.json();
        setKindergartens(data)

      }
    }catch (error){
      console.log(error)

    }
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if(Platform.OS === 'android'){
      setShowDatePicker(false);
    }

    if (selectedDate){
      setChildBirthDateObj(selectedDate);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() +1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formatted = `${year}-${month}-${day}`;

      setChildBirthDate(formatted);

    }
  };

  async function handleRegister(){
    if (!selectedRole || !firstName || !lastName){
      setErrorMsg("ikke fylt ut obligatoriske felt...");
      return;

    }

    if (selectedRole === "STAFF" && !kindergartenId){
      setErrorMsg("Ikke valgt barnehage.");
      return;

    }

    if (selectedRole === "BOSS" && !kindergartenName){
      setErrorMsg("Ikke oppgitt barnehagens navn.");
      return;

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

      if (!res.ok){
        const errorText = await res.text();
        throw new Error(errorText || "Registrering feilet");

      }

      const loginResponse = await res.json();

      await AsyncStorage.setItem("authToken", loginResponse.token);
      await AsyncStorage.setItem("currentUser", JSON.stringify(loginResponse.user));
      await authRefresh();

      console.log("Registration successful!", loginResponse);

      if (selectedRole === "PARENT"){
        if (childFirstName && childLastName && childBirthDate){
        await addChild(loginResponse.user.profileId);

        }
        router.replace("/home");

      }else if(selectedRole === "STAFF" || selectedRole === "BOSS"){
        router.replace("/")

      }

    }catch (err: any){
      console.log(err);

    }finally{
      setIsLoading(false);

    }
  }

  async function addChild(parentId: string){
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

      if (res.ok){
        console.log("Child added");
      }

    }catch (error){
      console.error(error);

    }
  }

  return(
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ios: "padding", android: undefined})}>

      <Stack.Screen options={{ title: "Fullfør registrering"}}/>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.card}>
          <Text style={styles.title}>Fullfør registrering</Text>

          <Text style={styles.sectionTitle}>Velg rolle:</Text>
          <View style={styles.roleButtons}>

            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === "PARENT" && styles.roleButtonActive,

              ]}
              onPress={() => setSelectedRole("PARENT")}>

              <Text
                style={[
                    styles.roleButtonText,
                    selectedRole === "PARENT" && styles.roleButtonTextActive,
                ]}> Forelder </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={[
                  styles.roleButton,
                  selectedRole === "STAFF" && styles.roleButtonActive,

              ]}
              onPress={() => setSelectedRole("STAFF")}>
              <Text
                style={[
                  styles.roleButtonText,
                  selectedRole === "STAFF" && styles.roleButtonTextActive,

                ]}> Ansatt </Text>

            </TouchableOpacity>

            <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === "BOSS" && styles.roleButtonActive,

                ]}
                onPress={() => setSelectedRole("BOSS")}>
              <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === "BOSS" && styles.roleButtonTextActive,

                  ]}> Sjef </Text>

            </TouchableOpacity>

          </View>

          {selectedRole && (
              <>
                <Text style={styles.sectionTitle}> Personlig informasjon:</Text>

                <TextInput
                  style={styles.input}
                  placeholder="* Fornavn"
                  placeholderTextColor={Colors.textMuted}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"/>

                <TextInput
                    style={styles.input}
                    placeholder="* Etternavn"
                    placeholderTextColor={Colors.textMuted}
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"/>

                <TextInput
                    style={styles.input}
                    placeholder="* Telefon nummer"
                    placeholderTextColor={Colors.textMuted}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    autoCapitalize="words"/>

                {selectedRole === "PARENT" && (
                    <>
                      <Text style={styles.sectionTitle}>
                        Legg til barn (valgfritt):
                      </Text>
                      <Text style={styles.helpText}>
                        Du kan også legge til barn senere.
                      </Text>

                      <TextInput
                          style={styles.input}
                          placeholder="Barnets fornavn"
                          placeholderTextColor={Colors.textMuted}
                          value={childFirstName}
                          onChangeText={setChildFirstName}
                          autoCapitalize="words"/>

                      <TextInput
                          style={styles.input}
                          placeholder="Barnets etternavn"
                          placeholderTextColor={Colors.textMuted}
                          value={childLastName}
                          onChangeText={setChildLastName}
                          autoCapitalize="words"/>

                      <Text style={styles.label}>Fødselsdato:</Text>
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}>

                        <Text style={childBirthDate ? styles.dateText : styles.datePlaceholder}>
                          {childBirthDate
                          ? new Date(childBirthDate).toLocaleDateString('no-NO')
                          : "Velg fødselsdato"}
                        </Text>
                      </TouchableOpacity>

                      {showDatePicker && (
                          <DateTimePicker
                            value={childBirthDateObj}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                            maximumDate={new Date()}
                            minimumDate={new Date(2018, 0, 1)}/>

                      )}

                    </>
                )}

                {selectedRole === "STAFF" &&(
                    <>
                      <Text style={styles.sectionTitle}>Arbeidsinformasjon:</Text>

                      <TextInput
                        style={styles.input}
                        placeholder="Ansattnummer"
                        placeholderTextColor={Colors.textMuted}
                        value={employeeId}
                        onChangeText={setEmployeeId}/>

                      <TextInput
                          style={styles.input}
                          placeholder="Stilling"
                          placeholderTextColor={Colors.textMuted}
                          value={position}
                          onChangeText={setPosition}/>

                      <Text style={styles.label}>* Velg barnehage</Text>
                      {kindergartens.length > 0 ?(
                          <View style={styles.pickerContainer}>
                            {kindergartens.map((kg) => (
                                <TouchableOpacity
                                key={kg.id}
                                style={[
                                    styles.kindergartenOption,
                                    kindergartenId === kg.id && styles.kindergartenOptionActive,
                                ]}
                                onPress={() => setKindergartenId(kg.id)}>

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
                          onChangeText={setEmployeeId}/>

                      <Text style={styles.sectionTitle}>Opprett barnehage:</Text>

                      <TextInput
                          style={styles.input}
                          placeholder="* Barnehagens navn"
                          placeholderTextColor={Colors.textMuted}
                          value={kindergartenName}
                          onChangeText={setKindergartenName}/>

                      <TextInput
                          style={styles.input}
                          placeholder="Adresse"
                          placeholderTextColor={Colors.textMuted}
                          value={kindergartenAddress}
                          onChangeText={setKindergartenAddress}/>

                      <TextInput
                          style={styles.input}
                          placeholder="Telefon"
                          placeholderTextColor={Colors.textMuted}
                          value={kindergartenPhone}
                          onChangeText={setKindergartenPhone}
                          keyboardType="phone-pad"/>

                      <TextInput
                          style={styles.input}
                          placeholder="E-post"
                          placeholderTextColor={Colors.textMuted}
                          value={kindergartenEmail}
                          onChangeText={setKindergartenEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"/>

                    </>

                )}

                {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

                <Pressable
                  style={[
                      styles.button, isLoading &&
                      {opacity: 0.65}
                  ]}
                  onPress={handleRegister}
                  disabled={isLoading}>

                  <Text style={styles.buttonText}>
                    {isLoading ? "Registrerer.." : "Lagre"}

                  </Text>

                </Pressable>

              </>
          )}

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );

}

const styles = StyleSheet.create({
  kindergartenAddress: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  datePickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    borderColor: Colors.primaryLightBlue,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  datePlaceholder: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40,
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
    marginBottom: 16,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 8,
  },
  helpText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primaryLightBlue,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: Colors.primaryBlue,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  roleButtonTextActive: {
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderColor: Colors.primaryLightBlue,
    color: Colors.text,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    gap: 8,
  },
  kindergartenOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.primaryLightBlue,
    borderWidth: 2,
    borderColor: "transparent",
  },
  kindergartenOptionActive: {
    borderColor: Colors.primaryBlue,
    backgroundColor: "#fff",
  },
  kindergartenText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  error: {
    color: Colors.red,
    marginTop: 4,
    fontSize: 14,
  },
  button: {
    marginTop: 16,
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
  },
});