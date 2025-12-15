import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { EmployeeCheckinStyles } from "@/styles";
import { checkerApi } from "@/services/checkerApi";
import type { CheckerResponseDto } from "@/services/types/checker";

type CheckStatus = "NONE" | "INN" | "HENTET" | "SYK" | "FERIE";

type Child = {
  id: string;
  name: string;
};

type ChildStatus = {
  status: CheckStatus;
  time?: string;
};

const CHILDREN: Child[] = [
  { id: "ella-id", name: "ELLA" },
  { id: "omar-id", name: "OMAR" },
  { id: "sander-id", name: "SANDER" },
  { id: "isa-id", name: "ISA" },
  { id: "edith-id", name: "EDITH" },
  { id: "theodor-id", name: "THEODOR" },
  { id: "lucia-id", name: "LUCIA" },
  { id: "farah-id", name: "FARAH" },
  { id: "hakon-id", name: "HÅKON" },
];

const CHECKIN_STORAGE_KEY = "employee_checkin_statuses_bjorn";

/**
 * TODO (BACKEND):
 * - Avdelingen sin status bør komme fra backend (ikke AsyncStorage).
 * - GET /api/staff/departments/{departmentId}/children/statuses
 * - POST /api/staff/checkin (childId, status, timestamp, staffId)
 * - Når dette er på plass: fjern CHECKIN_STORAGE_KEY + saveToLocalStorage.
 */
async function saveToLocalStorage(next: Record<string, ChildStatus>) {
  try {
    await AsyncStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore for now
  }
}

function formatTimeFromIso(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
}

function nowHHMM(): string {
  return new Date().toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EmployeeCheckinScreen() {
  const router = useRouter();

  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [statuses, setStatuses] = useState<Record<string, ChildStatus>>({});
  const [loading, setLoading] = useState(false);
  const [loadingFromApi, setLoadingFromApi] = useState(false);

  const loadFromApi = useCallback(async () => {
    setLoadingFromApi(true);
    try {
      const active: CheckerResponseDto[] = await checkerApi.getActive();

      setStatuses((prev) => {
        const copy: Record<string, ChildStatus> = { ...prev };

        // Default: NONE for alle (med mindre vi setter INN fra API)
        CHILDREN.forEach((child) => {
          if (!copy[child.id]) copy[child.id] = { status: "NONE" };
          if (copy[child.id].status === "INN") copy[child.id] = { status: "NONE" };
        });

        active.forEach((record) => {
          copy[record.childId] = {
            status: "INN",
            time: formatTimeFromIso(record.checkInDate ?? record.initializedOn),
          };
        });

        // ✅ Sync til EmployeeHome/EmployeeChildren i frontend-demo
        saveToLocalStorage(copy);
        return copy;
      });
    } finally {
      setLoadingFromApi(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFromApi();
    }, [loadFromApi])
  );

  function statusLabel(childId: string): string {
    const s = statuses[childId];
    if (!s || s.status === "NONE") return "Ingen registrering enda";
    if (s.status === "INN") return s.time ? `Ankom kl. ${s.time}` : "Ankommet";
    if (s.status === "HENTET") return s.time ? `Hentet kl. ${s.time}` : "Hentet";
    if (s.status === "SYK") return "Registrert syk";
    if (s.status === "FERIE") return "Registrert ferie";
    return "Ingen registrering";
  }

  async function handleSetStatus(child: Child, status: CheckStatus) {
    setLoading(true);
    try {
      if (status === "INN") {
        await checkerApi.checkIn({ childId: child.id } as any);
      }

      if (status === "HENTET") {
        await checkerApi.checkOut({ childId: child.id } as any);
      }

      // SYK/FERIE: ingen API-kall her enda (beholder eksisterende oppførsel)
    } finally {
      setStatuses((prev) => {
        const next: Record<string, ChildStatus> = {
          ...prev,
          [child.id]: { status, time: nowHHMM() },
        };

        // ✅ Sync til EmployeeHome/EmployeeChildren i frontend-demo
        saveToLocalStorage(next);

        return next;
      });

      setSelectedChild(null);
      setLoading(false);
    }
  }

  return (
    <View style={EmployeeCheckinStyles.container}>
      {/* Header */}
      <View style={EmployeeCheckinStyles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>

        <Text style={EmployeeCheckinStyles.title}>AVDELING BJØRN</Text>

        <TouchableOpacity onPress={loadFromApi}>
          <Ionicons name={loadingFromApi ? "sync" : "refresh"} size={22} />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <ScrollView contentContainerStyle={EmployeeCheckinStyles.grid}>
        {CHILDREN.map((child) => (
          <TouchableOpacity
            key={child.id}
            style={EmployeeCheckinStyles.childCard}
            onPress={() => setSelectedChild(child)}
          >
            <View style={EmployeeCheckinStyles.avatarCircle}>
              <Text style={EmployeeCheckinStyles.avatarInitial}>{child.name[0]}</Text>
            </View>

            <Text style={EmployeeCheckinStyles.childName}>{child.name}</Text>
            <Text style={EmployeeCheckinStyles.statusLabel}>
              {statusLabel(child.id)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Popup */}
      {selectedChild && (
        <View style={EmployeeCheckinStyles.overlay}>
          <View style={EmployeeCheckinStyles.popupCard}>
            <View style={EmployeeCheckinStyles.popupHeaderRow}>
              <Text style={EmployeeCheckinStyles.popupName}>{selectedChild.name}</Text>
              <TouchableOpacity onPress={() => setSelectedChild(null)}>
                <Ionicons name="close" size={22} />
              </TouchableOpacity>
            </View>

            <View style={EmployeeCheckinStyles.popupAvatarCircle}>
              <Text style={EmployeeCheckinStyles.popupAvatarInitial}>
                {selectedChild.name[0]}
              </Text>
            </View>

            <View style={EmployeeCheckinStyles.popupButtons}>
              {(["INN", "SYK", "HENTET", "FERIE"] as CheckStatus[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={EmployeeCheckinStyles.popupButton}
                  onPress={() => handleSetStatus(selectedChild, s)}
                  disabled={loading}
                >
                  <Text style={EmployeeCheckinStyles.popupButtonText}>
                    Registrer {s.toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
