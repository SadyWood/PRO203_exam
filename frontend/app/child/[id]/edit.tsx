import {
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { EditChildStyles } from "@/styles";

type ChildForm = {
  name: string;
  birthDate: string;
  department: string;

  sharePhotos: boolean;
  tripPermission: boolean;
  showNamePublic: boolean;

  foodAllergies: string;
  otherHealth: string;
};

export default function EditChildScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const childId = typeof id === "string" ? id : "";

  const [form, setForm] = useState<ChildForm>({
    name: "",
    birthDate: "",
    department: "",
    sharePhotos: false,
    tripPermission: false,
    showNamePublic: false,
    foodAllergies: "",
    otherHealth: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MOCK_CHILDREN: Record<string, ChildForm> = {
    "edith-id": {
      name: "Edith Hansen",
      birthDate: "05.05.2023",
      department: "Bjørn",
      sharePhotos: true,
      tripPermission: true,
      showNamePublic: false,
      foodAllergies: "Gluten, Peanøtter",
      otherHealth: "Allergisk mot pels",
    },
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const mock = MOCK_CHILDREN[childId];
    if (mock) setForm(mock);
    else setForm((p) => ({ ...p, name: `Barn (${childId})` }));

    setLoading(false);
  }, [childId]);

  function update<K extends keyof ChildForm>(key: K, value: ChildForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      // TODO: childrenApi.updateChild(childId, form)
      console.log("Lagrer barn:", childId, form);
      router.replace(`/child/${childId}`);
    } catch {
      setError("Kunne ikke lagre endringene.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={EditChildStyles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      <TouchableOpacity
        style={EditChildStyles.backButton}
        onPress={() => router.replace(`/child/${childId}`)}
      >
        <Ionicons name="chevron-back" size={26} />
      </TouchableOpacity>

      <Text style={EditChildStyles.title}>
        {loading ? "Laster..." : `Rediger ${form.name || "barn"}`}
      </Text>

      <View style={EditChildStyles.card}>
        <Text style={EditChildStyles.label}>Navn</Text>
        <TextInput
          style={EditChildStyles.input}
          value={form.name}
          onChangeText={(t) => update("name", t)}
        />

        <Text style={EditChildStyles.label}>Fødselsdato</Text>
        <TextInput
          style={EditChildStyles.input}
          value={form.birthDate}
          onChangeText={(t) => update("birthDate", t)}
        />

        <Text style={EditChildStyles.label}>Avdeling</Text>
        <TextInput
          style={EditChildStyles.input}
          value={form.department}
          onChangeText={(t) => update("department", t)}
        />
      </View>

      <Text style={EditChildStyles.sectionTitle}>Tillatelser</Text>
      <View style={EditChildStyles.card}>
        <View style={EditChildStyles.switchRow}>
          <Text style={EditChildStyles.switchLabel}>Deling av bilder</Text>
          <Switch value={form.sharePhotos} onValueChange={(v) => update("sharePhotos", v)} />
        </View>

        <View style={EditChildStyles.switchRow}>
          <Text style={EditChildStyles.switchLabel}>Bli med på turer</Text>
          <Switch value={form.tripPermission} onValueChange={(v) => update("tripPermission", v)} />
        </View>

        <View style={EditChildStyles.switchRow}>
          <Text style={EditChildStyles.switchLabel}>Dele barnets navn offentlig</Text>
          <Switch value={form.showNamePublic} onValueChange={(v) => update("showNamePublic", v)} />
        </View>
      </View>

      <Text style={EditChildStyles.sectionTitle}>Helsehensyn</Text>
      <View style={EditChildStyles.card}>
        <Text style={EditChildStyles.label}>Matallergier</Text>
        <TextInput
          style={[EditChildStyles.input, EditChildStyles.multilineInput]}
          value={form.foodAllergies}
          onChangeText={(t) => update("foodAllergies", t)}
          multiline
        />

        <Text style={EditChildStyles.label}>Annet</Text>
        <TextInput
          style={[EditChildStyles.input, EditChildStyles.multilineInput]}
          value={form.otherHealth}
          onChangeText={(t) => update("otherHealth", t)}
          multiline
        />
      </View>

      {error && (
        <View style={EditChildStyles.errorBox}>
          <Text style={EditChildStyles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          EditChildStyles.saveButton,
          (saving || loading) && EditChildStyles.saveButtonDisabled,
        ]}
        onPress={handleSave}
        disabled={saving || loading}
      >
        <Text style={EditChildStyles.saveButtonText}>
          {saving ? "Lagrer..." : "Lagre"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
