import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/colors";
import { getCurrentUser } from "@/services/authApi";
import { AdminStyles } from "@/styles";
import type { UserResponseDto } from "@/services/types/auth";

// Admin screen - Provides group management, staff management, kindergarten settings

export default function AdministrationScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponseDto | null>(null);

  useEffect(() => {
    async function checkAccess() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Only BOSS role can access administration
      if (currentUser?.role !== "BOSS") {
        router.back();
      }
    }
    checkAccess();
  }, []);

  // Menu items for admin navigation
  const menuItems = [
    {
      id: "groups",
      title: "Administrer grupper",
      description: "Opprett, rediger og slett grupper",
      icon: "people-outline" as const,
      route: "/(staff)/admin/manage-groups",
    },
    {
      id: "staff",
      title: "Administrer ansatte",
      description: "Gi eller fjern admin-rettigheter",
      icon: "person-outline" as const,
      route: "/(staff)/admin/manage-staff",
    },
    {
      id: "kindergarten",
      title: "Barnehageinnstillinger",
      description: "Oppdater barnehageinformasjon",
      icon: "settings-outline" as const,
      route: "/(staff)/admin/kindergarten-settings",
    },
  ];

  return (
    <View style={AdminStyles.container}>
      {/* Header with back navigation */}
      <View style={[AdminStyles.header, { marginBottom: 24 }]}>
        <Pressable onPress={() => router.back()} style={AdminStyles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={AdminStyles.title}>Administrasjon</Text>
        <View style={AdminStyles.headerSpacer} />
      </View>

      {/* Admin menu items */}
      <ScrollView style={AdminStyles.listContainer}>
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            style={AdminStyles.menuCard}
            onPress={() => router.push(item.route as any)}
          >
            <View style={AdminStyles.menuIconContainer}>
              <Ionicons name={item.icon} size={24} color={Colors.primaryBlue} />
            </View>
            <View style={AdminStyles.menuContent}>
              <Text style={AdminStyles.menuTitle}>{item.title}</Text>
              <Text style={AdminStyles.menuDescription}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
