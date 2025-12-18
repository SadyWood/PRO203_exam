import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddChildStyles as styles } from "@/styles";
import { Colors } from "@/constants/colors";

const API_BASE_URL = Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

interface Kindergarten {
    id: string;
    name: string;
    address?: string;
}

export default function AddChildScreen() {
    const router = useRouter();

    // Child basic info
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Kindergarten selection
    const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
    const [selectedKindergartenId, setSelectedKindergartenId] = useState<string | null>(null);
    const [assignKindergartenLater, setAssignKindergartenLater] = useState(false);
    const [loadingKindergartens, setLoadingKindergartens] = useState(true);

    // Date input as separate fields
    const [birthDay, setBirthDay] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthYear, setBirthYear] = useState("");

    // Refs for auto-focus
    const monthRef = useRef<TextInput>(null);
    const yearRef = useRef<TextInput>(null);

    // Calendar picker state
    const [showCalendarPicker, setShowCalendarPicker] = useState(false);
    const [calendarDate, setCalendarDate] = useState(new Date(2022, 0, 1));

    // Health data toggle and fields
    const [addHealthLater, setAddHealthLater] = useState(true);
    const [allergies, setAllergies] = useState("");
    const [medicalConditions, setMedicalConditions] = useState("");
    const [medications, setMedications] = useState("");
    const [dietaryRestrictions, setDietaryRestrictions] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");

    // Coparent toggle and fields
    const [addCoparentLater, setAddCoparentLater] = useState(true);
    const [coparentEmail, setCoparentEmail] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Fetch kindergartens on mount
    useEffect(() => {
        const fetchKindergartens = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/kindergartens`);
                if (res.ok) {
                    const data = await res.json();
                    setKindergartens(data);
                }
            } catch (error) {
                console.log("Could not fetch kindergartens:", error);
            } finally {
                setLoadingKindergartens(false);
            }
        };
        fetchKindergartens();
    }, []);

    // Handle day input
    const handleDayChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, "");
        if (cleaned.length <= 2) {
            setBirthDay(cleaned);
            if (cleaned.length === 2) {
                monthRef.current?.focus();
            }
        }
    };

    // Handle month input
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

    // Validate and format the birth date
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

        // Format as YYYY-MM-DD
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

    const handleAddChild = async () => {
        const birthDate = getFormattedBirthDate();

        // Validate required fields
        if (!firstName || !lastName) {
            setErrorMsg("Fyll ut barnets navn");
            return;
        }

        if (!birthDate) {
            setErrorMsg("Ugyldig fødselsdato. Bruk format: DD MM ÅÅÅÅ");
            return;
        }

        // Validate kindergarten selection
        if (!assignKindergartenLater && !selectedKindergartenId) {
            setErrorMsg("Velg en barnehage eller velg 'Senere'");
            return;
        }

        // Validate health data if not adding later
        if (!addHealthLater && !emergencyContact) {
            setErrorMsg("Nødkontakt er påkrevd for helsedata");
            return;
        }

        // Validate coparent if not adding later
        if (!addCoparentLater && !coparentEmail) {
            setErrorMsg("E-post er påkrevd for medforelder");
            return;
        }

        setErrorMsg(null);
        setSuccessMsg(null);
        setIsLoading(true);

        try {
            const userStr = await AsyncStorage.getItem("currentUser");
            if (!userStr) {
                setErrorMsg("Ikke logget inn");
                return;
            }

            const user = JSON.parse(userStr);
            const token = await AsyncStorage.getItem("authToken");

            // Step 1: Create the child
            const childRes = await fetch(`${API_BASE_URL}/api/children`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    birthDate,
                    parentId: user.profileId,
                    kindergartenId: assignKindergartenLater ? null : selectedKindergartenId,
                }),
            });

            if (!childRes.ok) {
                const errorText = await childRes.text();
                setErrorMsg(errorText || "Kunne ikke legge til barnet");
                return;
            }

            const childData = await childRes.json();
            const childId = childData.id;

            // Step 2: Add health data if not adding later
            if (!addHealthLater) {
                const healthRes = await fetch(`${API_BASE_URL}/api/health-data/child/${childId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        allergies: allergies || null,
                        medicalConditions: medicalConditions || null,
                        medications: medications || null,
                        dietaryRestrictions: dietaryRestrictions || null,
                        emergencyContact: emergencyContact,
                    }),
                });

                if (!healthRes.ok) {
                    console.log("Kunne ikke legge til helsedata");
                }
            }

            // Step 3: Invite coparent if not adding later
            if (!addCoparentLater && coparentEmail) {
                // TODO: Implement coparent invitation API when available
                console.log("Coparent invitation not yet implemented:", coparentEmail);
            }

            setSuccessMsg("Barnet ble lagt til!");

            // Navigate back after short delay
            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (error) {
            console.error(error);
            setErrorMsg("Noe gikk galt");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.select({ ios: "padding", android: undefined })}
        >
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Legg til barn</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.card}>
                    {/* Basic Info */}
                    <Text style={styles.sectionTitle}>Barnets informasjon</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Fornavn *"
                        placeholderTextColor={Colors.textMuted}
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Etternavn *"
                        placeholderTextColor={Colors.textMuted}
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                    />

                    <Text style={styles.label}>Fødselsdato *</Text>
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

                    {/* Calendar picker */}
                    {showCalendarPicker && (
                        Platform.OS === "ios" ? (
                            <View style={styles.calendarPickerContainer}>
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
                                    <Text style={styles.calendarConfirmButtonText}>Bekreft dato</Text>
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

                    <View style={styles.divider} />

                    {/* Kindergarten Section */}
                    <Text style={styles.sectionTitle}>Barnehage</Text>
                    <View style={styles.optionToggleRow}>
                        <Text style={styles.optionToggleText}>Velg barnehage nå?</Text>
                        <View style={styles.optionToggleButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.optionToggleButton,
                                    !assignKindergartenLater && styles.optionToggleButtonActive,
                                ]}
                                onPress={() => setAssignKindergartenLater(false)}
                            >
                                <Text style={styles.optionToggleButtonText}>Ja</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.optionToggleButton,
                                    assignKindergartenLater && styles.optionToggleButtonActive,
                                ]}
                                onPress={() => setAssignKindergartenLater(true)}
                            >
                                <Text style={styles.optionToggleButtonText}>Senere</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {!assignKindergartenLater && (
                        <View style={styles.optionalSection}>
                            <Text style={styles.helpText}>
                                Velg barnehagen barnet går i. Hvis du ikke finner barnehagen, velg "Senere".
                            </Text>
                            {loadingKindergartens ? (
                                <ActivityIndicator size="small" color={Colors.primaryBlue} />
                            ) : kindergartens.length === 0 ? (
                                <Text style={styles.helpText}>Ingen barnehager funnet</Text>
                            ) : (
                                <View style={styles.kindergartenList}>
                                    {kindergartens.map((kg) => (
                                        <TouchableOpacity
                                            key={kg.id}
                                            style={[
                                                styles.kindergartenItem,
                                                selectedKindergartenId === kg.id && styles.kindergartenItemSelected,
                                            ]}
                                            onPress={() => setSelectedKindergartenId(kg.id)}
                                        >
                                            <Ionicons
                                                name={selectedKindergartenId === kg.id ? "radio-button-on" : "radio-button-off"}
                                                size={20}
                                                color={selectedKindergartenId === kg.id ? Colors.green : Colors.textMuted}
                                            />
                                            <View style={styles.kindergartenInfo}>
                                                <Text style={styles.kindergartenName}>{kg.name}</Text>
                                                {kg.address && (
                                                    <Text style={styles.kindergartenAddress}>{kg.address}</Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.divider} />

                    {/* Health Data Section */}
                    <Text style={styles.sectionTitle}>Helsedata</Text>
                    <View style={styles.optionToggleRow}>
                        <Text style={styles.optionToggleText}>Legg til helsedata nå?</Text>
                        <View style={styles.optionToggleButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.optionToggleButton,
                                    !addHealthLater && styles.optionToggleButtonActive,
                                ]}
                                onPress={() => setAddHealthLater(false)}
                            >
                                <Text style={styles.optionToggleButtonText}>Ja</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.optionToggleButton,
                                    addHealthLater && styles.optionToggleButtonActive,
                                ]}
                                onPress={() => setAddHealthLater(true)}
                            >
                                <Text style={styles.optionToggleButtonText}>Senere</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {!addHealthLater && (
                        <View style={styles.optionalSection}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nødkontakt (telefon) *"
                                placeholderTextColor={Colors.textMuted}
                                value={emergencyContact}
                                onChangeText={setEmergencyContact}
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Allergier"
                                placeholderTextColor={Colors.textMuted}
                                value={allergies}
                                onChangeText={setAllergies}
                                multiline
                            />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Medisinske tilstander"
                                placeholderTextColor={Colors.textMuted}
                                value={medicalConditions}
                                onChangeText={setMedicalConditions}
                                multiline
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Medisiner"
                                placeholderTextColor={Colors.textMuted}
                                value={medications}
                                onChangeText={setMedications}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Kostholdsbegrensninger"
                                placeholderTextColor={Colors.textMuted}
                                value={dietaryRestrictions}
                                onChangeText={setDietaryRestrictions}
                            />
                        </View>
                    )}

                    <View style={styles.divider} />

                    {/* Coparent Section */}
                    <Text style={styles.sectionTitle}>Medforelder</Text>
                    <View style={styles.optionToggleRow}>
                        <Text style={styles.optionToggleText}>Koble til medforelder nå?</Text>
                        <View style={styles.optionToggleButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.optionToggleButton,
                                    !addCoparentLater && styles.optionToggleButtonActive,
                                ]}
                                onPress={() => setAddCoparentLater(false)}
                            >
                                <Text style={styles.optionToggleButtonText}>Ja</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.optionToggleButton,
                                    addCoparentLater && styles.optionToggleButtonActive,
                                ]}
                                onPress={() => setAddCoparentLater(true)}
                            >
                                <Text style={styles.optionToggleButtonText}>Senere</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {!addCoparentLater && (
                        <View style={styles.optionalSection}>
                            <Text style={styles.helpText}>
                                Medforelderen må ha en konto. Vi sender en invitasjon til e-posten.
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Medforelders e-post *"
                                placeholderTextColor={Colors.textMuted}
                                value={coparentEmail}
                                onChangeText={setCoparentEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    )}

                    {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
                    {successMsg && <Text style={styles.success}>{successMsg}</Text>}

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleAddChild}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color={Colors.text} />
                        ) : (
                            <Text style={styles.buttonText}>Legg til barn</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
