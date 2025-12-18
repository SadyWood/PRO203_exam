import React, { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DailySummaryStyles as styles } from "@/styles";
import { Colors } from "@/constants/colors";
import { noteApi, NoteResponseDto } from "@/services/noteApi";

const API_BASE_URL = Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

interface Child {
    id: string;
    firstName: string;
    lastName: string;
    kindergartenId?: string;
}

export default function DailySummaryScreen() {
    const router = useRouter();

    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Notes from backend
    const [notes, setNotes] = useState<NoteResponseDto[]>([]);

    // Placeholder data until diaper/sleep backend is implemented
    const [diaperChanges] = useState<any[]>([]);
    const [sleepRecords] = useState<any[]>([]);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const userStr = await AsyncStorage.getItem("currentUser");
            if (!userStr) return;

            const user = JSON.parse(userStr);
            if (!user.profileId || user.role !== "PARENT") return;

            const token = await AsyncStorage.getItem("authToken");

            // Fetch children - uses /api/children which auto-filters by authenticated parent
            const childrenRes = await fetch(
                `${API_BASE_URL}/api/children`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (childrenRes.ok) {
                const childrenData = await childrenRes.json();
                setChildren(childrenData);
                if (childrenData.length > 0 && !selectedChildId) {
                    setSelectedChildId(childrenData[0].id);
                }
            }
        } catch (error) {
            console.log("Feil ved lasting:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch notes when selected child changes
    const loadNotes = useCallback(async () => {
        if (!selectedChildId) return;

        try {
            const today = new Date().toISOString().split("T")[0];
            const childNotes = await noteApi.getNotesByChildAndRange(selectedChildId, today, today);
            setNotes(childNotes || []);
        } catch (error) {
            console.log("Feil ved lasting av notater:", error);
            setNotes([]);
        }
    }, [selectedChildId]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    useFocusEffect(
        useCallback(() => {
            if (selectedChildId) {
                loadNotes();
            }
        }, [selectedChildId, loadNotes])
    );

    const today = new Date().toLocaleDateString("nb-NO", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    const selectedChild = children.find((c) => c.id === selectedChildId);

    // Filter notes by type (staff notes only for this view)
    const staffNotes = notes.filter((n) => n.createdByType === "Staff");

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primaryBlue} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Dagens sammendrag</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Child selector (if multiple children) */}
                {children.length > 1 && (
                    <View style={styles.childSelector}>
                        {children.map((child) => (
                            <TouchableOpacity
                                key={child.id}
                                style={[
                                    styles.childTab,
                                    selectedChildId === child.id && styles.childTabActive,
                                ]}
                                onPress={() => setSelectedChildId(child.id)}
                            >
                                <Text
                                    style={[
                                        styles.childTabText,
                                        selectedChildId === child.id && styles.childTabTextActive,
                                    ]}
                                >
                                    {child.firstName}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Date header */}
                <Text style={styles.dateHeader}>{today}</Text>

                {children.length === 0 ? (
                    <Text style={styles.emptyText}>
                        Ingen barn registrert. Legg til barn via profilen din.
                    </Text>
                ) : (
                    <>
                        {/* Diaper changes section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="water-outline" size={18} color={Colors.brown} />
                                <Text style={styles.sectionTitle}>Bleieskift</Text>
                            </View>

                            {diaperChanges.length === 0 ? (
                                <Text style={styles.emptyText}>
                                    Ingen bleieskift registrert i dag
                                </Text>
                            ) : (
                                diaperChanges.map((change, index) => (
                                    <View key={index} style={[styles.card, styles.diaperCard]}>
                                        <View style={styles.cardRow}>
                                            <Text style={styles.cardText}>{change.type}</Text>
                                            <Text style={styles.cardTime}>kl. {change.time}</Text>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>

                        <View style={styles.divider} />

                        {/* Sleep section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="moon-outline" size={18} color={Colors.primaryBlue} />
                                <Text style={styles.sectionTitle}>Søvn</Text>
                            </View>

                            {sleepRecords.length === 0 ? (
                                <Text style={styles.emptyText}>
                                    Ingen søvn registrert i dag
                                </Text>
                            ) : (
                                sleepRecords.map((sleep, index) => (
                                    <View key={index} style={[styles.card, styles.sleepCard]}>
                                        <View style={styles.cardRow}>
                                            <Text style={styles.cardTextBold}>
                                                {selectedChild?.firstName} sov:
                                            </Text>
                                            <Text style={styles.cardText}>
                                                {sleep.startTime} - {sleep.endTime}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>

                        <View style={styles.divider} />

                        {/* Notes section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="document-text-outline" size={18} color={Colors.text} />
                                <Text style={styles.sectionTitle}>Notater fra personalet</Text>
                            </View>

                            {staffNotes.length === 0 ? (
                                <Text style={styles.emptyText}>
                                    Ingen notater for i dag
                                </Text>
                            ) : (
                                staffNotes.map((note) => (
                                    <View key={note.id} style={[styles.card, styles.noteCard]}>
                                        <Text style={styles.cardTextBold}>{note.title}</Text>
                                        <Text style={styles.noteText}>{note.content}</Text>
                                        <Text style={styles.noteAuthor}>
                                            - {note.createdByName}, {new Date(note.createdAt).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}
