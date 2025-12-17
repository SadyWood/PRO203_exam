import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";

import { EmployeeCheckinStyles } from "@/styles";
import { Colors } from "@/constants/colors";
import { checkerApi } from "@/services/checkerApi";
import { childrenApi } from "@/services/staffApi";
import type { CheckerResponseDto } from "@/services/types/checker";
import type { ChildResponseDto } from "@/services/types/staff";

type CheckStatus = "NONE" | "INN" | "HENTET" | "SYK" | "FERIE";

type ChildStatus = {
  status: CheckStatus;
  time?: string;
};

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

  const [children, setChildren] = useState<ChildResponseDto[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildResponseDto | null>(null);
  const [statuses, setStatuses] = useState<Record<string, ChildStatus>>({});
  const [loading, setLoading] = useState(false);
  const [loadingFromApi, setLoadingFromApi] = useState(true);

  const loadFromApi = useCallback(async () => {
    setLoadingFromApi(true);
    try {
      // Load children from API
      let childrenList: ChildResponseDto[] = [];
      try {
        childrenList = await childrenApi.getAllChildren();
        setChildren(childrenList);
      } catch (childErr) {
        console.log("Feil ved uthenting av barn:", childErr);
      }

      // Load active check-ins
      const active: CheckerResponseDto[] = await checkerApi.getActive();

      setStatuses(() => {
        const statusMap: Record<string, ChildStatus> = {};

        // Default: NONE for all children
        childrenList.forEach((child) => {
          statusMap[child.id] = { status: "NONE" };
        });

        // Update with active check-ins
        active.forEach((record) => {
          statusMap[record.childId] = {
            status: "INN",
            time: formatTimeFromIso(record.checkInDate ?? record.initializedOn),
          };
        });

        return statusMap;
      });
    } catch (err) {
      console.log("Feil ved lasting av data:", err);
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

  async function handleSetStatus(child: ChildResponseDto, status: CheckStatus) {
    setLoading(true);
    try {
      if (status === "INN") {
        await checkerApi.checkIn({ childId: child.id } as any);
      }

      if (status === "HENTET") {
        await checkerApi.checkOut({ childId: child.id } as any);
      }

      // SYK/FERIE: ingen API-kall her enda (beholder eksisterende oppførsel)

      setStatuses((prev) => {
        const next: Record<string, ChildStatus> = {
          ...prev,
          [child.id]: { status, time: nowHHMM() },
        };
        return next;
      });
    } catch (err) {
      console.log("Feil ved registrering:", err);
    } finally {
      setSelectedChild(null);
      setLoading(false);
    }
  }

  const getChildDisplayName = (child: ChildResponseDto): string => {
    return `${child.firstName} ${child.lastName}`.toUpperCase();
  };

  const getChildInitial = (child: ChildResponseDto): string => {
    return child.firstName.charAt(0).toUpperCase();
  };

  if (loadingFromApi && children.length === 0) {
    return (
      <View style={[EmployeeCheckinStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={EmployeeCheckinStyles.container}>
      {/* Header */}
      <View style={EmployeeCheckinStyles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <Text style={EmployeeCheckinStyles.title}>INNSJEKKING</Text>

        <TouchableOpacity onPress={loadFromApi}>
          <Ionicons name={loadingFromApi ? "sync" : "refresh"} size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <ScrollView contentContainerStyle={EmployeeCheckinStyles.grid}>
        {children.length === 0 ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: Colors.textMuted }}>Ingen barn funnet</Text>
          </View>
        ) : (
          children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={EmployeeCheckinStyles.childCard}
              onPress={() => setSelectedChild(child)}
            >
              <View style={EmployeeCheckinStyles.avatarCircle}>
                <Text style={EmployeeCheckinStyles.avatarInitial}>{getChildInitial(child)}</Text>
              </View>

              <Text style={EmployeeCheckinStyles.childName}>{getChildDisplayName(child)}</Text>
              <Text style={EmployeeCheckinStyles.statusLabel}>
                {statusLabel(child.id)}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Popup */}
      {selectedChild && (
        <View style={EmployeeCheckinStyles.overlay}>
          <View style={EmployeeCheckinStyles.popupCard}>
            <View style={EmployeeCheckinStyles.popupHeaderRow}>
              <Text style={EmployeeCheckinStyles.popupName}>{getChildDisplayName(selectedChild)}</Text>
              <TouchableOpacity onPress={() => setSelectedChild(null)}>
                <Ionicons name="close" size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={EmployeeCheckinStyles.popupAvatarCircle}>
              <Text style={EmployeeCheckinStyles.popupAvatarInitial}>
                {getChildInitial(selectedChild)}
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
