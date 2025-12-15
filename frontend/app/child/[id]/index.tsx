import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { ChildProfileStyles } from "@/styles";

type Child = {
  id: string;
  name: string;
  birthDate: string;
  department: string;
  sharePhotos: boolean;
  tripPermission: boolean;
  showNamePublic: boolean;
  foodAllergies: string[];
  otherHealth: string[];
};

export default function ChildProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const childId = typeof id === "string" ? id : "";

  const MOCK_CHILDREN: Record<string, Child> = {
    "edith-id": {
      id: "edith-id",
      name: "Edith Hansen",
      birthDate: "05.05.2023",
      department: "Bjørn",
      sharePhotos: true,
      tripPermission: true,
      showNamePublic: false,
      foodAllergies: ["Gluten", "Peanøtter"],
      otherHealth: ["Allergisk mot pels"],
    },
  };

  const [child, setChild] = useState<Child | null>(null);

  useEffect(() => {
    // TODO (BACKEND): childrenApi.getChildById(childId)
    setChild(MOCK_CHILDREN[childId] ?? null);
  }, [childId]);

  if (!child) {
    return (
      <View style={ChildProfileStyles.screen}>
        <View style={ChildProfileStyles.container}>
          <Text style={ChildProfileStyles.text}>Fant ikke barn</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={ChildProfileStyles.screen}
      contentContainerStyle={ChildProfileStyles.container}
    >
      {/* Back */}
      <TouchableOpacity
       onPress={() => { if (router.canGoBack()) { router.back();
        } else {
         router.replace("/profile");
         }
       }} >
        <Ionicons name="chevron-back" size={26} />
      </TouchableOpacity>

      {/* Header */}
      <View style={ChildProfileStyles.headerCard}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/lego/1.jpg" }}
          style={ChildProfileStyles.avatar}
        />
        <View style={ChildProfileStyles.headerTextBox}>
          <Text style={ChildProfileStyles.name}>{child.name}</Text>
          <View style={ChildProfileStyles.dateChip}>
            <Text style={ChildProfileStyles.dateText}>
              {child.birthDate}
            </Text>
          </View>
        </View>
      </View>

      {/* Avdeling */}
      <View style={ChildProfileStyles.sectionBox}>
        <Text style={ChildProfileStyles.text}>
          Avdeling: {child.department}
        </Text>
      </View>

      {/* Tillatelser */}
      <Text style={ChildProfileStyles.sectionTitle}>Tillatelser</Text>
      <View style={ChildProfileStyles.sectionBox}>
        <View style={ChildProfileStyles.permissionRow}>
          <Text style={ChildProfileStyles.text}>Deling av bilder</Text>
          <Switch value={child.sharePhotos} disabled />
        </View>

        <View style={ChildProfileStyles.permissionRow}>
          <Text style={ChildProfileStyles.text}>Bli med på turer</Text>
          <Switch value={child.tripPermission} disabled />
        </View>

        <View style={ChildProfileStyles.permissionRow}>
          <Text style={ChildProfileStyles.text}>
            Dele navn offentlig
          </Text>
          <Switch value={child.showNamePublic} disabled />
        </View>
      </View>

      {/* Helse */}
      <Text style={ChildProfileStyles.sectionTitle}>Helsehensyn</Text>
      <View style={ChildProfileStyles.sectionBox}>
        <Text style={ChildProfileStyles.text}>Matallergier</Text>

        {child.foodAllergies.length === 0 ? (
          <Text style={ChildProfileStyles.textMuted}>
            Ingen registrert
          </Text>
        ) : (
          child.foodAllergies.map((a) => (
            <View key={a} style={ChildProfileStyles.listItem}>
              <Text style={ChildProfileStyles.text}>{a}</Text>
            </View>
          ))
        )}

        <Text style={[ChildProfileStyles.text, { marginTop: 8 }]}>
          Annet
        </Text>

        {child.otherHealth.length === 0 ? (
          <Text style={ChildProfileStyles.textMuted}>
            Ingen registrert
          </Text>
        ) : (
          child.otherHealth.map((h) => (
            <View key={h} style={ChildProfileStyles.listItem}>
              <Text style={ChildProfileStyles.text}>{h}</Text>
            </View>
          ))
        )}
      </View>

      {/* Rediger */}
      <TouchableOpacity
        style={[
          ChildProfileStyles.btnBase,
          ChildProfileStyles.btnNeutral,
        ]}
        onPress={() => router.push(`/child/${childId}/edit`)}
      >
        <Text style={ChildProfileStyles.btnTextDark}>
          Rediger info
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
