import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { ParentCheckinStyles } from "@/styles";
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
  return now.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CheckinScreen() {
  const router = useRouter();

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
    } catch (e) {
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
    } catch (e) {
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
    <View style={ParentCheckinStyles.safeArea}>
      <ScrollView contentContainerStyle={ParentCheckinStyles.scrollContent}>
        {/* Header */}
        <View style={ParentCheckinStyles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} />
          </TouchableOpacity>

          <Text style={ParentCheckinStyles.headerTitle}>
            Sjekk inn / ut
          </Text>

          <View style={{ width: 26 }} />
        </View>

        <Text style={ParentCheckinStyles.subtitle}>
          Velg barn og registrer levering eller henting.
        </Text>

        {error && (
          <View style={ParentCheckinStyles.errorCard}>
            <Text style={ParentCheckinStyles.errorText}>{error}</Text>
          </View>
        )}

        {MOCK_CHILDREN.map((child) => {
          const s = statusMap[child.id] ?? "NONE";
          const isIn = s === "INN";
          const isOut = s === "UT";

          return (
            <View key={child.id} style={ParentCheckinStyles.childCard}>
              <Text style={ParentCheckinStyles.childTitle}>Barn</Text>

              <View style={ParentCheckinStyles.childHeaderRow}>
                <Text style={ParentCheckinStyles.childName}>
                  {child.name}
                </Text>

                {(isIn || isOut) && (
                  <View
                    style={[
                      ParentCheckinStyles.statusPill,
                      isIn
                        ? ParentCheckinStyles.statusPillIn
                        : ParentCheckinStyles.statusPillOut,
                    ]}
                  >
                    <View
                      style={[
                        ParentCheckinStyles.statusDot,
                        isIn
                          ? ParentCheckinStyles.statusDotIn
                          : ParentCheckinStyles.statusDotOut,
                      ]}
                    />
                    <Text
                      style={[
                        ParentCheckinStyles.statusText,
                        isIn
                          ? ParentCheckinStyles.statusTextIn
                          : ParentCheckinStyles.statusTextOut,
                      ]}
                    >
                      {isIn ? "Levert" : "Hentet"}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={ParentCheckinStyles.lastChangeText}>
                {statusLabel(child.id)}
              </Text>

              <TouchableOpacity
                style={[
                  ParentCheckinStyles.checkButton,
                  ParentCheckinStyles.checkButtonIn,
                ]}
                onPress={() => handleCheckIn(child)}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    ParentCheckinStyles.checkButtonText,
                    ParentCheckinStyles.checkButtonTextIn,
                  ]}
                >
                  {loading ? "Lagrer..." : "Lever"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  ParentCheckinStyles.checkButton,
                  ParentCheckinStyles.checkButtonOut,
                ]}
                onPress={() => handleCheckOut(child)}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    ParentCheckinStyles.checkButtonText,
                    ParentCheckinStyles.checkButtonTextOut,
                  ]}
                >
                  {loading ? "Lagrer..." : "Hent"}
                </Text>
              </TouchableOpacity>

              <Text style={ParentCheckinStyles.infoText}>
                Foreldre registrerer levering/henting. Ansatt kan senere
                bekrefte i ansatt-appen.
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
