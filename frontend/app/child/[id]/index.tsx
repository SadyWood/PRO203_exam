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

import {
  AppStyles,
  ButtonStyles,
  ChildProfileStyles,
} from "@/styles";

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
    // TODO: childrenApi.getChildById(childId)
    setChild(MOCK_CHILDREN[childId] ?? null);
  }, [childId]);

  if (!child) {
    return (
      <View style={AppStyles.screen}>
        <View style={AppStyles.container}>
          <Text style={AppStyles.text}>Fant ikke barn</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={AppStyles.screen} contentContainerStyle={AppStyles.container}>
      {/* Back */}
      <TouchableOpacity onPress={() => router.replace("/profile")}>
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
            <Text style={ChildProfileStyles.dateText}>{child.birthDate}</Text>
          </View>
        </View>
      </View>

      <View style={ChildProfileStyles.sectionBox}>
        <Text style={AppStyles.text}>Avdeling: {child.department}</Text>
      </View>

      <Text style={AppStyles.sectionTitle}>Tillatelser</Text>
      <View style={ChildProfileStyles.sectionBox}>
        <View style={ChildProfileStyles.permissionRow}>
          <Text style={AppStyles.text}>Deling av bilder</Text>
          <Switch value={child.sharePhotos} disabled />
        </View>
        <View style={ChildProfileStyles.permissionRow}>
          <Text style={AppStyles.text}>Bli med på turer</Text>
          <Switch value={child.tripPermission} disabled />
        </View>
        <View style={ChildProfileStyles.permissionRow}>
          <Text style={AppStyles.text}>Dele navn offentlig</Text>
          <Switch value={child.showNamePublic} disabled />
        </View>
      </View>

      <Text style={AppStyles.sectionTitle}>Helsehensyn</Text>
      <View style={ChildProfileStyles.sectionBox}>
        <Text style={AppStyles.text}>Matallergier</Text>
        {child.foodAllergies.length === 0 ? (
          <Text style={AppStyles.textMuted}>Ingen registrert</Text>
        ) : (
          child.foodAllergies.map((a) => (
            <View key={a} style={ChildProfileStyles.listItem}>
              <Text style={AppStyles.text}>{a}</Text>
            </View>
          ))
        )}

        <Text style={[AppStyles.text, { marginTop: 8 }]}>Annet</Text>
        {child.otherHealth.length === 0 ? (
          <Text style={AppStyles.textMuted}>Ingen registrert</Text>
        ) : (
          child.otherHealth.map((h) => (
            <View key={h} style={ChildProfileStyles.listItem}>
              <Text style={AppStyles.text}>{h}</Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        style={[ButtonStyles.base, ButtonStyles.neutral]}
        onPress={() => router.push(`/child/${childId}/edit`)}
      >
        <Text style={ButtonStyles.textDark}>Rediger info</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
