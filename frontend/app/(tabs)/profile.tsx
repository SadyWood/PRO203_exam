import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Platform,
    Pressable,
} from "react-native";
import { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "@/services/authApi";
import { Child } from "@/models/child";
import { ParentProfileStyles as styles } from "@/styles";
import { Colors } from "@/constants/colors";

const API_BASE_URL = Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export default function ProfileScreen() {
    const router = useRouter();

    const [parentData, setParentData] = useState<any>(null);
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const userStr = await AsyncStorage.getItem("currentUser");
            if (userStr) {
                const user = JSON.parse(userStr);

                if (user.profileId && user.role === "PARENT") {
                    await fetchParentProfile(user.profileId);
                    await fetchChildren(user.profileId);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [fetchProfile])
    );

    async function fetchParentProfile(parentId: string) {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const res = await fetch(`${API_BASE_URL}/api/parents/${parentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setParentData(data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchChildren(parentId: string) {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const res = await fetch(`${API_BASE_URL}/api/children/parent/${parentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setChildren(data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleLogout() {
        try {
            await logout();
            console.log("Logged out");
            router.replace("/");
        } catch (error) {
            console.log("Logout error:", error);
        }
    }

    return (
        <ScrollView style={styles.container}>
            {/* Profile Card */}
            {loading ? (
                <View style={styles.profileCard}>
                    <ActivityIndicator size="small" color={Colors.primaryBlue} />
                </View>
            ) : (
                <View style={styles.profileCard}>
                    <Image
                        source={{ uri: "https://randomuser.me/api/portraits/lego/1.jpg" }}
                        style={styles.avatar}
                    />
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>
                            {parentData?.firstName} {parentData?.lastName}
                        </Text>
                    </View>
                </View>
            )}

            {/* Contact Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    Kontaktinformasjon
                </Text>

                <View style={styles.infoBox}>
                    <View style={styles.infoRow}>
                        <Ionicons
                            name="mail-outline"
                            size={18}
                            style={styles.infoIcon}
                        />
                        <Text style={styles.infoText}>
                            {parentData?.email || "Ingen e-post"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="call-outline"
                            size={18}
                            style={styles.infoIcon}
                        />
                        <Text style={styles.infoText}>
                            {parentData?.phoneNumber || "Ingen telefon"}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="home-outline"
                            size={18}
                            style={styles.infoIcon}
                        />
                        <Text style={styles.infoText}>
                            {parentData?.address || "Ingen adresse"}
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonMarginTop}>
                    <Pressable
                        style={[
                            styles.primaryBtn,
                            styles.primaryBtnNeutral,
                        ]}
                        onPress={() => router.push("/edit-profile")}
                    >
                        <Text style={styles.primaryBtnText}>
                            Rediger info
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Children */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Barn</Text>

                {loading ? (
                    <ActivityIndicator size="small" color={Colors.primaryBlue} />
                ) : children.length > 0 ? (
                    children.map((child) => (
                        <TouchableOpacity
                            key={child.id}
                            style={styles.childItem}
                            onPress={() => router.push(`/child/${child.id}`)}
                        >
                            <Text style={styles.childName}>
                                {child.firstName} {child.lastName}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>
                        Ingen barn registrert
                    </Text>
                )}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push("/add-child")}
                >
                    <Ionicons name="add-circle-outline" size={20} color={Colors.text} />
                    <Text style={styles.addButtonText}>Legg til barn</Text>
                </TouchableOpacity>
            </View>

            {/* Co-parent */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Medforelder</Text>

                {parentData?.coParents && parentData.coParents.length > 0 ? (
                    parentData.coParents.map((coParent: any) => (
                        <TouchableOpacity
                            key={coParent.id}
                            style={styles.childItem}
                        >
                            <Text style={styles.childName}>
                                {coParent.firstName} {coParent.lastName}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>
                        Ingen medforelder registrert
                    </Text>
                )}
            </View>

            {/* Logout */}
            <View style={styles.section}>
                <Pressable
                    style={[
                        styles.primaryBtn,
                        styles.primaryBtnDanger,
                    ]}
                    onPress={handleLogout}
                >
                    <Text
                        style={[
                            styles.primaryBtnText,
                            styles.primaryBtnTextDanger,
                        ]}
                    >
                        Logg ut
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}
