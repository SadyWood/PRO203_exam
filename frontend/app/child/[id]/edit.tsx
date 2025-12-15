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

import { ChildEditStyles } from "@/styles";

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
   // TODO (BACKEND):
  // Flytt MOCK_CHILDREN ut av komponenten (eller fjern helt) når backend er klar.
 // Data skal hentes fra API basert på childId, f.eks. childrenApi.getChild(childId)

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
    // TODO (BACKEND):
      // 1) Hent barnets detaljer:
  // const child = await childrenApi.getChild(childId)
   // 2) Map API-respons til ChildForm
    // 3) Håndter feil (401/403/404) og sett error-melding

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
    <ScrollView
      style={ChildEditStyles.screen}
      contentContainerStyle={ChildEditStyles.scrollContent}
    >
      <TouchableOpacity
        style={ChildEditStyles.backButton}
        onPress={() => router.replace(`/child/${childId}`)}
      >
        <Ionicons name="chevron-back" size={26} />
      </TouchableOpacity>

      <Text style={ChildEditStyles.title}>
        {loading ? "Laster..." : `Rediger ${form.name || "barn"}`}
      </Text>

      <View style={ChildEditStyles.card}>
        <Text style={ChildEditStyles.label}>Navn</Text>
        <TextInput
          style={ChildEditStyles.input}
          value={form.name}
          onChangeText={(t) => update("name", t)}
        />

        <Text style={ChildEditStyles.label}>Fødselsdato</Text>
        <TextInput
          style={ChildEditStyles.input}
          value={form.birthDate}
          onChangeText={(t) => update("birthDate", t)}
        />

        <Text style={ChildEditStyles.label}>Avdeling</Text>
        <TextInput
          style={ChildEditStyles.input}
          value={form.department}
          onChangeText={(t) => update("department", t)}
        />
      </View>

      <Text style={ChildEditStyles.sectionTitle}>Tillatelser</Text>
      <View style={ChildEditStyles.card}>
        <View style={ChildEditStyles.switchRow}>
          <Text style={ChildEditStyles.switchLabel}>Deling av bilder</Text>
          <Switch
            value={form.sharePhotos}
            onValueChange={(v) => update("sharePhotos", v)}
          />
        </View>

        <View style={ChildEditStyles.switchRow}>
          <Text style={ChildEditStyles.switchLabel}>Bli med på turer</Text>
          <Switch
            value={form.tripPermission}
            onValueChange={(v) => update("tripPermission", v)}
          />
        </View>

        <View style={ChildEditStyles.switchRow}>
          <Text style={ChildEditStyles.switchLabel}>
            Dele barnets navn offentlig
          </Text>
          <Switch
            value={form.showNamePublic}
            onValueChange={(v) => update("showNamePublic", v)}
          />
        </View>
      </View>

      <Text style={ChildEditStyles.sectionTitle}>Helsehensyn</Text>
      <View style={ChildEditStyles.card}>
        <Text style={ChildEditStyles.label}>Matallergier</Text>
        <TextInput
          style={[ChildEditStyles.input, ChildEditStyles.multilineInput]}
          value={form.foodAllergies}
          onChangeText={(t) => update("foodAllergies", t)}
          multiline
        />

        <Text style={ChildEditStyles.label}>Annet</Text>
        <TextInput
          style={[ChildEditStyles.input, ChildEditStyles.multilineInput]}
          value={form.otherHealth}
          onChangeText={(t) => update("otherHealth", t)}
          multiline
        />
      </View>

      {error && (
        <View style={ChildEditStyles.errorBox}>
          <Text style={ChildEditStyles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          ChildEditStyles.saveButton,
          (saving || loading) && ChildEditStyles.saveButtonDisabled,
        ]}
        onPress={handleSave}
        disabled={saving || loading}
      >
        <Text style={ChildEditStyles.saveButtonText}>
          {saving ? "Lagrer..." : "Lagre"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
