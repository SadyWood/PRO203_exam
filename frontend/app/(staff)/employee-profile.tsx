import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getCurrentUser, logout } from "@/services/authApi";
import { useEffect, useState } from "react";
import { EmployeeProfileStyles } from "@/styles";
import { UserResponseDto } from "@/services/types/auth";
import { staffApi, kindergartenApi, StaffResponseDto, KindergartenResponseDto } from "@/services/staffApi";
import { Colors } from "@/constants/colors";

export default function EmployeeProfile() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffResponseDto | null>(null);
  const [kindergarten, setKindergarten] = useState<KindergartenResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser?.profileId) {
          try {
            const staff = await staffApi.getCurrentStaff(currentUser.profileId);
            setStaffProfile(staff);

            if (staff.kindergartenId) {
              try {
                const kg = await kindergartenApi.getKindergarten(staff.kindergartenId);
                setKindergarten(kg);
              } catch (kgErr) {
                console.log("Feil ved uthenting av barnehage:", kgErr);
              }
            }
          } catch (staffErr) {
            console.log("Feil ved uthenting av ansattprofil:", staffErr);
          }
        }
      } catch (err) {
        console.log("Feil ved uthenting av bruker:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Use staff profile data if available, fallback to user data
  const name = staffProfile
    ? `${staffProfile.firstName} ${staffProfile.lastName}`
    : user?.fullName ?? "Laster...";
  const email = staffProfile?.email ?? user?.email ?? "";
  const phone = staffProfile?.phoneNumber ?? user?.phoneNumber ?? "";
  const position = staffProfile?.position ?? user?.position ?? "";
  const kindergartenName = kindergarten?.name ?? "";
  const isBoss = user?.role === "BOSS";

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };
  if (loading) {
    return (
      <View style={[EmployeeProfileStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <ScrollView style={EmployeeProfileStyles.container}>

      {/* Header */}
      <View style={EmployeeProfileStyles.headerCard}>
        <Image
          source={{ uri: user?.profilePictureUrl || "https://randomuser.me/api/portraits/lego/1.jpg" }}
          style={EmployeeProfileStyles.avatar}
        />

        <View style={EmployeeProfileStyles.headerRight}>
          <Text style={EmployeeProfileStyles.name}>{name}</Text>
          {isBoss && (
            <View style={{ backgroundColor: Colors.primaryBlue, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 }}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>Daglig leder</Text>
            </View>
          )}
          {position && !isBoss && (
            <Text style={{ color: Colors.textMuted, fontSize: 14, marginTop: 4 }}>{position}</Text>
          )}
        </View>
      </View>

      {/* Kontaktinfo */}
      <Text style={EmployeeProfileStyles.sectionTitle}>
        Kontaktinformasjon
      </Text>

      <View style={EmployeeProfileStyles.infoBox}>
        {email && (
          <View style={EmployeeProfileStyles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={Colors.textMuted} />
            <Text style={EmployeeProfileStyles.infoText}>{email}</Text>
          </View>
        )}

        {phone && (
          <View style={EmployeeProfileStyles.infoRow}>
            <Ionicons name="call-outline" size={20} color={Colors.textMuted} />
            <Text style={EmployeeProfileStyles.infoText}>{phone}</Text>
          </View>
        )}

        {kindergartenName && (
          <View style={EmployeeProfileStyles.infoRow}>
            <Ionicons name="business-outline" size={20} color={Colors.textMuted} />
            <Text style={EmployeeProfileStyles.infoText}>{kindergartenName}</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <Pressable
        style={[
          EmployeeProfileStyles.primaryBtn,
          EmployeeProfileStyles.primaryBtnPrimary
        ]}
        onPress={() => router.push("/(staff)/employee-edit-profile")}
      >
        <Text style={EmployeeProfileStyles.primaryBtnText}>
          Rediger profil
        </Text>
      </Pressable>

      <Pressable
        style={[
          EmployeeProfileStyles.primaryBtn,
          EmployeeProfileStyles.primaryBtnDanger
        ]}
        onPress={handleLogout}
      >
        <Text
          style={[
            EmployeeProfileStyles.primaryBtnText,
            EmployeeProfileStyles.primaryBtnTextDanger
          ]}
        >
          Logg ut
        </Text>
      </Pressable>

    </ScrollView>
  );

}
  