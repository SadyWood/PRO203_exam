import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppStyles, ButtonStyles, CheckinStyles } from "@/styles";
import { checkerApi } from "../services/checkerApi";
import type { PersonType } from "../services/types/checker";

type CheckStatus = "INN" | "UT" | "NONE";

type Child = {
  id: string;
  name: string;
};

const PARENT_PERSON_TYPE: PersonType = "Parent";

const MOCK_PARENT_ID = "parent-id";
const MOCK_PARENT_NAME = "Ola Hansen";

const MOCK_CHILDREN: Child[] = [
  { id: "edith-id", name: "Edith" }, 
];

function statusKey(childId: string) {
  return `checkin_status_${childId}`;
}
function timeKey(childId: string) {
  return `checkin_time_${childId}`;
}

function formatNowForDisplay(): string {
  const now = new Date();
  return now.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
}

export default function CheckinScreen() {
  const router = useRouter();

  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // status per barn
  const [statusMap, setStatusMap] = useState<Record<string, CheckStatus>>({});
  const [timeMap, setTimeMap] = useState<Record<string, string | null>>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLocalForAll = useCallback(async () => {
    const nextStatus: Record<string, CheckStatus> = {};
    const nextTime: Record<string, string | null> = {};

    for (const c of MOCK_CHILDREN) {
      const s = await AsyncStorage.getItem(statusKey(c.id));
      const t = await AsyncStorage.getItem(timeKey(c.id));

      if (s === "INN" || s === "UT") nextStatus[c.id] = s;
      else nextStatus[c.id] = "NONE";

      nextTime[c.id] = t ?? null;
    }

    setStatusMap(nextStatus);
    setTimeMap(nextTime);
  }, []);

  useEffect(() => {
    loadLocalForAll().catch(() => {});
  }, [loadLocalForAll]);

  async function updateLocal(childId: string, newStatus: CheckStatus) {
    const t = formatNowForDisplay();

    if (newStatus === "INN" || newStatus === "UT") {
      await AsyncStorage.setItem(statusKey(childId), newStatus);
      await AsyncStorage.setItem(timeKey(childId), t);
    } else {
      await AsyncStorage.removeItem(statusKey(childId));
      await AsyncStorage.removeItem(timeKey(childId));
    }

    setStatusMap((prev) => ({ ...prev, [childId]: newStatus }));
    setTimeMap((prev) => ({ ...prev, [childId]: t }));
  }

  async function handleCheckIn(child: Child) {
    setLoading(true);
    setError(null);

    try {
      await checkerApi.checkIn({
        childId: child.id,
        droppedOffBy: MOCK_PARENT_ID,
        droppedOffPersonType: PARENT_PERSON_TYPE,
        droppedOffPersonName: MOCK_PARENT_NAME,
        droppedOffConfirmedBy: null, 
        notes: null,
      });

      await updateLocal(child.id, "INN");
      setSelectedChild(null);
    } catch (e: any) {
      console.log("Feil ved check-in:", e);
      setError("Kunne ikke registrere levering. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckOut(child: Child) {
    setLoading(true);
    setError(null);

    try {
      await checkerApi.checkOut({
        childId: child.id,
        pickedUpBy: MOCK_PARENT_ID,
        pickedUpPersonType: PARENT_PERSON_TYPE,
        pickedUpPersonName: MOCK_PARENT_NAME,
        pickedUpConfirmedBy: null, 
        pickedUpConfirmed: false, 
        notes: null,
      });

      await updateLocal(child.id, "UT");
      setSelectedChild(null);
    } catch (e: any) {
      console.log("Feil ved check-out:", e);
      setError("Kunne ikke registrere henting. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  function statusLabel(childId: string) {
    const s = statusMap[childId] ?? "NONE";
    const t = timeMap[childId];

    if (s === "INN") return t ? `Levert kl. ${t}` : "Levert";
    if (s === "UT") return t ? `Hentet kl. ${t}` : "Hentet";
    return "Ingen status";
  }

  return (
    <View style={AppStyles.screen}>
      <View style={CheckinStyles.container}>
        <View style={CheckinStyles.topRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={AppStyles.text}>←</Text>
          </TouchableOpacity>

          <Text style={CheckinStyles.title}>Sjekk inn / ut</Text>
          <View />
        </View>

        {error && (
          <View style={AppStyles.cardWhite}>
            <Text style={AppStyles.text}>{error}</Text>
          </View>
        )}

        <ScrollView contentContainerStyle={CheckinStyles.grid}>
          {MOCK_CHILDREN.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={CheckinStyles.childCard}
              onPress={() => setSelectedChild(child)}
              activeOpacity={0.85}
            >
              <View style={CheckinStyles.avatarCircle}>
                <Text style={CheckinStyles.avatarInitial}>
                  {child.name.slice(0, 1).toUpperCase()}
                </Text>
              </View>

              <Text style={CheckinStyles.childName}>{child.name}</Text>
              <Text style={CheckinStyles.statusLabel}>{statusLabel(child.id)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {!!selectedChild && (
          <View style={CheckinStyles.overlay}>
            <View style={CheckinStyles.popupCard}>
              <View style={CheckinStyles.popupHeaderRow}>
                <Text style={CheckinStyles.popupName}>{selectedChild.name}</Text>

                <TouchableOpacity onPress={() => setSelectedChild(null)}>
                  <Text style={AppStyles.text}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={CheckinStyles.popupAvatarCircle}>
                <Text style={CheckinStyles.popupAvatarInitial}>
                  {selectedChild.name.slice(0, 1).toUpperCase()}
                </Text>
              </View>

              <View style={CheckinStyles.popupButtons}>
                <TouchableOpacity
                  style={[ButtonStyles.base, ButtonStyles.primary]}
                  onPress={() => handleCheckIn(selectedChild)}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={ButtonStyles.textDark}>
                    {loading ? "Lagrer..." : "Lever"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[ButtonStyles.base, ButtonStyles.danger]}
                  onPress={() => handleCheckOut(selectedChild)}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={ButtonStyles.textLight}>
                    {loading ? "Lagrer..." : "Hent"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[ButtonStyles.base, ButtonStyles.neutral]}
                  onPress={() => setSelectedChild(null)}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={ButtonStyles.textDark}>Avbryt</Text>
                </TouchableOpacity>
              </View>

              <Text style={AppStyles.textMuted}>
                Foreldre registrerer levering/henting. Ansatt kan senere bekrefte i
                ansatt-appen når dere kobler begge til samme backend.
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
