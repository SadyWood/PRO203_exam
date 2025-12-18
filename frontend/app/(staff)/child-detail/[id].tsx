import { View, Text, ScrollView, Pressable, ActivityIndicator, Linking, TextInput, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { ChildDetailStyles as styles } from "@/styles";
import { getCurrentUser } from "@/services/authApi";
import {
    childrenApi,
    healthApi,
    parentApi,
    relationshipApi,
    staffApi,
    ChildResponseDto,
    HealthDataResponseDto,
    ParentResponseDto,
    ParentChildDto,
    StaffResponseDto,
} from "@/services/staffApi";
import { noteApi, NoteResponseDto } from "@/services/noteApi";

type ParentWithRelationship = ParentResponseDto & {
    relationship?: ParentChildDto;
};

export default function ChildDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [child, setChild] = useState<ChildResponseDto | null>(null);
    const [healthData, setHealthData] = useState<HealthDataResponseDto | null>(null);
    const [parents, setParents] = useState<ParentWithRelationship[]>([]);
    const [notes, setNotes] = useState<NoteResponseDto[]>([]);
    const [staffProfile, setStaffProfile] = useState<StaffResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    // Note form state
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [savingNote, setSavingNote] = useState(false);

    const loadData = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);

            // Get current user and staff profile
            const currentUser = await getCurrentUser();
            if (currentUser?.profileId) {
                const staff = await staffApi.getCurrentStaff(currentUser.profileId);
                setStaffProfile(staff);
            }

            // Fetch child info
            const childData = await childrenApi.getChildById(id);
            setChild(childData);

            // Fetch health data
            try {
                const health = await healthApi.getHealthDataByChild(id);
                setHealthData(health);
            } catch {
                setHealthData(null);
            }

            // Fetch parent relationships
            try {
                const relationships = await relationshipApi.getRelationshipsByChild(id);

                const parentPromises = relationships.map(async (rel): Promise<ParentWithRelationship | null> => {
                    try {
                        const parent = await parentApi.getParentById(rel.parentId);
                        return { ...parent, relationship: rel };
                    } catch {
                        return null;
                    }
                });

                const parentResults = await Promise.all(parentPromises);
                const validParents = parentResults.filter((p): p is ParentWithRelationship => p !== null);
                setParents(validParents);
            } catch {
                setParents([]);
            }

            // Fetch notes for this child
            try {
                const childNotes = await noteApi.getNotesByChild(id);
                setNotes(childNotes || []);
            } catch {
                setNotes([]);
            }

        } catch (err) {
            console.log("Feil ved lasting av data:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const calculateAge = (birthDate?: string): string => {
        if (!birthDate) return "Ukjent alder";
        const birth = new Date(birthDate);
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();

        if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
            years--;
            months += 12;
        }
        if (today.getDate() < birth.getDate()) {
            months--;
        }

        if (years === 0) {
            return `${months} måneder`;
        }
        return `${years} år${months > 0 ? ` og ${months} mnd` : ""}`;
    };

    const formatBirthDate = (birthDate?: string): string => {
        if (!birthDate) return "Ukjent";
        return new Date(birthDate).toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handleCall = (phoneNumber?: string) => {
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
        }
    };

    const handleEmail = (email?: string) => {
        if (email) {
            Linking.openURL(`mailto:${email}`);
        }
    };

    const handleSaveNote = async () => {
        if (!noteTitle.trim() || !noteContent.trim() || !child || !staffProfile?.kindergartenId) {
            return;
        }

        setSavingNote(true);
        try {
            const today = new Date().toISOString().split("T")[0];
            await noteApi.createNote({
                childId: child.id,
                kindergartenId: staffProfile.kindergartenId,
                title: noteTitle.trim(),
                content: noteContent.trim(),
                noteDate: today,
            });

            // Refresh notes
            const updatedNotes = await noteApi.getNotesByChild(child.id);
            setNotes(updatedNotes || []);

            // Reset form
            setNoteTitle("");
            setNoteContent("");
            setShowNoteForm(false);
        } catch (error) {
            console.log("Feil ved lagring av notat:", error);
        } finally {
            setSavingNote(false);
        }
    };

    const formatNoteDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Check if staff can add notes (isAdmin)
    const canAddNotes = staffProfile?.isAdmin === true;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primaryBlue} />
            </View>
        );
    }

    if (!child) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Kunne ikke finne barnet</Text>
                <Pressable onPress={() => router.back()} style={styles.backLink}>
                    <Text style={styles.backLinkText}>Gå tilbake</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Barneprofil</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Child Info Card */}
                <View style={styles.card}>
                    <View style={styles.childHeader}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                            </Text>
                        </View>
                        <View style={styles.childInfo}>
                            <Text style={styles.childName}>{child.firstName} {child.lastName}</Text>
                            <Text style={styles.childAge}>{calculateAge(child.birthDate)}</Text>
                            <View style={[
                                styles.statusBadge,
                                child.checkedIn ? styles.statusBadgeIn : styles.statusBadgeOut
                            ]}>
                                <Text style={[
                                    styles.statusBadgeText,
                                    child.checkedIn ? styles.statusBadgeTextIn : styles.statusBadgeTextOut
                                ]}>
                                    {child.checkedIn ? "Inne i barnehagen" : "Ikke innsjekket"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Fødselsdato</Text>
                        <Text style={styles.infoValue}>{formatBirthDate(child.birthDate)}</Text>
                    </View>

                    {child.groupName && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Avdeling</Text>
                            <Text style={styles.infoValue}>{child.groupName}</Text>
                        </View>
                    )}
                </View>

                {/* Notes Section - for admin staff */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderLeft}>
                            <Ionicons name="document-text-outline" size={20} color={Colors.primaryBlue} />
                            <Text style={styles.cardTitle}>Notater</Text>
                        </View>
                        {canAddNotes && !showNoteForm && (
                            <TouchableOpacity
                                style={styles.addNoteButton}
                                onPress={() => setShowNoteForm(true)}
                            >
                                <Ionicons name="add" size={16} color={Colors.text} />
                                <Text style={styles.addNoteButtonText}>Legg til</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Note Form */}
                    {showNoteForm && (
                        <View style={styles.noteForm}>
                            <TextInput
                                style={styles.noteInput}
                                placeholder="Tittel"
                                placeholderTextColor={Colors.textMuted}
                                value={noteTitle}
                                onChangeText={setNoteTitle}
                            />
                            <TextInput
                                style={[styles.noteInput, styles.noteTextArea]}
                                placeholder="Skriv notat her... (synlig for foreldre)"
                                placeholderTextColor={Colors.textMuted}
                                value={noteContent}
                                onChangeText={setNoteContent}
                                multiline
                            />
                            <View style={styles.noteFormButtons}>
                                <TouchableOpacity
                                    style={styles.noteCancelButton}
                                    onPress={() => {
                                        setShowNoteForm(false);
                                        setNoteTitle("");
                                        setNoteContent("");
                                    }}
                                >
                                    <Text style={styles.noteCancelButtonText}>Avbryt</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.noteSaveButton,
                                        (!noteTitle.trim() || !noteContent.trim() || savingNote) && styles.noteSaveButtonDisabled
                                    ]}
                                    onPress={handleSaveNote}
                                    disabled={!noteTitle.trim() || !noteContent.trim() || savingNote}
                                >
                                    <Text style={styles.noteSaveButtonText}>
                                        {savingNote ? "Lagrer..." : "Lagre"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Notes List */}
                    {notes.length === 0 ? (
                        <Text style={styles.noDataText}>Ingen notater for dette barnet</Text>
                    ) : (
                        notes.map((note) => (
                            <View key={note.id} style={styles.noteCard}>
                                <Text style={styles.noteTitle}>{note.title}</Text>
                                <Text style={styles.noteContent}>{note.content}</Text>
                                <Text style={styles.noteMeta}>
                                    {note.createdByName} • {formatNoteDate(note.createdAt)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                {/* Health & Medical Info */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderLeft}>
                            <Ionicons name="medical-outline" size={20} color={Colors.primaryBlue} />
                            <Text style={styles.cardTitle}>Helseinformasjon</Text>
                        </View>
                    </View>

                    {healthData ? (
                        <>
                            {healthData.allergies && (
                                <View style={styles.healthRow}>
                                    <Text style={styles.healthLabel}>Allergier</Text>
                                    <Text style={styles.healthValue}>{healthData.allergies}</Text>
                                </View>
                            )}

                            {healthData.medicalConditions && (
                                <View style={styles.healthRow}>
                                    <Text style={styles.healthLabel}>Medisinske tilstander</Text>
                                    <Text style={styles.healthValue}>{healthData.medicalConditions}</Text>
                                </View>
                            )}

                            {healthData.medications && (
                                <View style={styles.healthRow}>
                                    <Text style={styles.healthLabel}>Medisiner</Text>
                                    <Text style={styles.healthValue}>{healthData.medications}</Text>
                                </View>
                            )}

                            {healthData.dietaryRestrictions && (
                                <View style={styles.healthRow}>
                                    <Text style={styles.healthLabel}>Kostholdsbegrensninger</Text>
                                    <Text style={styles.healthValue}>{healthData.dietaryRestrictions}</Text>
                                </View>
                            )}

                            {healthData.emergencyContact && (
                                <View style={styles.healthRow}>
                                    <Text style={styles.healthLabel}>Nødkontakt</Text>
                                    <Text style={styles.healthValue}>{healthData.emergencyContact}</Text>
                                </View>
                            )}

                            {!healthData.allergies && !healthData.medicalConditions && !healthData.medications && !healthData.dietaryRestrictions && (
                                <Text style={styles.noDataText}>Ingen helseinformasjon registrert</Text>
                            )}
                        </>
                    ) : (
                        <Text style={styles.noDataText}>Ingen helseinformasjon registrert</Text>
                    )}
                </View>

                {/* Parents / Contacts */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderLeft}>
                            <Ionicons name="people-outline" size={20} color={Colors.primaryBlue} />
                            <Text style={styles.cardTitle}>Foresatte</Text>
                        </View>
                    </View>

                    {parents.length === 0 ? (
                        <Text style={styles.noDataText}>Ingen foresatte registrert</Text>
                    ) : (
                        parents.map((parent) => (
                            <View key={parent.id} style={styles.parentCard}>
                                <View style={styles.parentInfo}>
                                    <Text style={styles.parentName}>
                                        {parent.firstName} {parent.lastName}
                                    </Text>
                                    {parent.relationship?.isPrimaryContact && (
                                        <View style={styles.primaryBadge}>
                                            <Text style={styles.primaryBadgeText}>Hovedkontakt</Text>
                                        </View>
                                    )}
                                    {parent.relationship?.relationStatus && (
                                        <Text style={styles.relationText}>
                                            {parent.relationship.relationStatus}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.parentActions}>
                                    {parent.phoneNumber && (
                                        <Pressable
                                            style={styles.actionButton}
                                            onPress={() => handleCall(parent.phoneNumber)}
                                        >
                                            <Ionicons name="call-outline" size={20} color={Colors.primaryBlue} />
                                            <Text style={styles.actionButtonText}>Ring</Text>
                                        </Pressable>
                                    )}

                                    {parent.email && (
                                        <Pressable
                                            style={styles.actionButton}
                                            onPress={() => handleEmail(parent.email)}
                                        >
                                            <Ionicons name="mail-outline" size={20} color={Colors.primaryBlue} />
                                            <Text style={styles.actionButtonText}>E-post</Text>
                                        </Pressable>
                                    )}
                                </View>

                                {parent.phoneNumber && (
                                    <Text style={styles.contactDetail}>{parent.phoneNumber}</Text>
                                )}
                                {parent.email && (
                                    <Text style={styles.contactDetail}>{parent.email}</Text>
                                )}

                                {parent.relationship?.canCheckOut === false && (
                                    <View style={styles.warningBadge}>
                                        <Ionicons name="warning-outline" size={14} color="#B45309" />
                                        <Text style={styles.warningText}>Kan ikke hente barnet</Text>
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
