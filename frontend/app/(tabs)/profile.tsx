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
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "@/services/authApi";
import { Child } from "@/models/child";
import { ParentProfileStyles } from "@/styles";
import { Colors } from "@/constants/colors";

const API_BASE_URL = Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export default function ProfileScreen() {
    const router = useRouter();

    const [parentData, setParentData] = useState<any>(null);
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
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
        }

        fetchProfile();
    }, []);

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
                console.log("Parent data:", data);
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
        <ScrollView style={ParentProfileStyles.container}>
            {/* Profile Card */}
            {loading ? (
                <View style={ParentProfileStyles.profileCard}>
                    <ActivityIndicator size="small" color={Colors.primaryBlue} />
                </View>
            ) : (
                <View style={ParentProfileStyles.profileCard}>
                    <Image
                        source={{ uri: "https://randomuser.me/api/portraits/boy/32.jpg" }}
                        style={ParentProfileStyles.avatar}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={ParentProfileStyles.name}>
                            {parentData?.firstName} {parentData?.lastName}
                        </Text>
                    </View>
                </View>
            )}

            {/* Contact Information */}
            <View style={ParentProfileStyles.section}>
                <Text style={ParentProfileStyles.sectionTitle}>
                    Kontaktinformasjon
                </Text>

                <View style={ParentProfileStyles.infoBox}>
                    <View style={ParentProfileStyles.infoRow}>
                        <Ionicons
                            name="mail-outline"
                            size={18}
                            style={ParentProfileStyles.infoIcon}
                        />
                        <Text style={ParentProfileStyles.infoText}>
                            {parentData?.email || "Ingen e-post"}
                        </Text>
                    </View>

                    <View style={ParentProfileStyles.infoRow}>
                        <Ionicons
                            name="call-outline"
                            size={18}
                            style={ParentProfileStyles.infoIcon}
                        />
                        <Text style={ParentProfileStyles.infoText}>
                            {parentData?.phoneNumber || "Ingen telefon"}
                        </Text>
                    </View>

                    <View style={ParentProfileStyles.infoRow}>
                        <Ionicons
                            name="home-outline"
                            size={18}
                            style={ParentProfileStyles.infoIcon}
                        />
                        <Text style={ParentProfileStyles.infoText}>
                            {parentData?.address || "Ingen adresse"}
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Pressable
                        style={[
                            ParentProfileStyles.primaryBtn,
                            ParentProfileStyles.primaryBtnNeutral,
                        ]}
                        onPress={() => router.push("/edit-profile")}
                    >
                        <Text style={ParentProfileStyles.primaryBtnText}>
                            Rediger info
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Children */}
            <View style={ParentProfileStyles.section}>
                <Text style={ParentProfileStyles.sectionTitle}>Barn</Text>

                {loading ? (
                    <ActivityIndicator size="small" color={Colors.primaryBlue} />
                ) : children.length > 0 ? (
                    children.map((child) => (
                        <TouchableOpacity
                            key={child.id}
                            style={ParentProfileStyles.childItem}
                            onPress={() => router.push(`/child/${child.id}`)}
                        >
                            <Text style={ParentProfileStyles.childName}>
                                {child.firstName} {child.lastName}
                            </Text>
                            <Ionicons name="arrow-forward" size={20} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={ParentProfileStyles.infoText}>
                        Ingen barn registrert
                    </Text>
                )}
            </View>

            {/* Co-parent */}
            <View style={ParentProfileStyles.section}>
                <Text style={ParentProfileStyles.sectionTitle}>Medforelder</Text>

                {parentData?.coParents && parentData.coParents.length > 0 ? (
                    parentData.coParents.map((coParent: any) => (
                        <TouchableOpacity
                            key={coParent.id}
                            style={ParentProfileStyles.childItem}
                        >
                            <Text style={ParentProfileStyles.childName}>
                                {coParent.firstName} {coParent.lastName}
                            </Text>
                            <Ionicons name="arrow-forward" size={20} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <TouchableOpacity style={ParentProfileStyles.childItem}>
                        <Text style={ParentProfileStyles.childName}>
                            Kari Mette Hansen
                        </Text>
                        <Ionicons name="arrow-forward" size={20} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Logout */}
            <View style={ParentProfileStyles.section}>
                <Pressable
                    style={[
                        ParentProfileStyles.primaryBtn,
                        ParentProfileStyles.primaryBtnDanger,
                    ]}
                    onPress={handleLogout}
                >
                    <Text
                        style={[
                            ParentProfileStyles.primaryBtnText,
                            ParentProfileStyles.primaryBtnTextDanger,
                        ]}
                    >
                        Logg ut
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}