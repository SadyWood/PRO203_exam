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

type CheckStatus = "NONE" | "PENDING" | "INN" | "HENTET" | "SYK" | "FERIE";

type ChildStatus = {
  status: CheckStatus;
  time?: string;
  checkInId?: string; // For confirming pending check-ins
  droppedOffByName?: string;
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

      // Load active check-ins (confirmed)
      const active: CheckerResponseDto[] = await checkerApi.getActive();

      // Load pending check-ins (awaiting confirmation)
      let pending: CheckerResponseDto[] = [];
      try {
        pending = await checkerApi.getPending();
      } catch (pendingErr) {
        console.log("Feil ved uthenting av ventende innsjekk:", pendingErr);
      }

      setStatuses(() => {
        const statusMap: Record<string, ChildStatus> = {};

        // Default: NONE for all children
        childrenList.forEach((child) => {
          statusMap[child.id] = { status: "NONE" };
        });

        // Update with pending check-ins (awaiting confirmation)
        pending.forEach((record) => {
          statusMap[record.childId] = {
            status: "PENDING",
            time: formatTimeFromIso(record.checkInDate ?? record.initializedOn),
            checkInId: record.id,
            droppedOffByName: record.droppedOffPersonName ?? undefined,
          };
        });

        // Update with confirmed active check-ins (override pending if somehow both exist)
        active.forEach((record) => {
          // Only mark as INN if it's confirmed (has droppedOffConfirmedBy)
          if (record.droppedOffConfirmedBy) {
            statusMap[record.childId] = {
              status: "INN",
              time: formatTimeFromIso(record.checkInDate ?? record.initializedOn),
              checkInId: record.id,
            };
          }
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
    if (s.status === "PENDING") return s.droppedOffByName
      ? `Levert av ${s.droppedOffByName} kl. ${s.time} - Venter bekreftelse`
      : s.time ? `Levert kl. ${s.time} - Venter bekreftelse` : "Venter bekreftelse";
    if (s.status === "INN") return s.time ? `Bekreftet kl. ${s.time}` : "Bekreftet";
    if (s.status === "HENTET") return s.time ? `Hentet kl. ${s.time}` : "Hentet";
    if (s.status === "SYK") return "Registrert syk";
    if (s.status === "FERIE") return "Registrert ferie";
    return "Ingen registrering";
  }

  async function handleConfirmCheckIn(child: ChildResponseDto) {
    const childStatus = statuses[child.id];
    if (!childStatus?.checkInId) return;

    setLoading(true);
    try {
      await checkerApi.confirmCheckIn(childStatus.checkInId);

      // Update local status to confirmed
      setStatuses((prev) => ({
        ...prev,
        [child.id]: {
          ...prev[child.id],
          status: "INN",
        },
      }));
    } catch (err) {
      console.log("Feil ved bekreftelse:", err);
    } finally {
      setSelectedChild(null);
      setLoading(false);
    }
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
          children.map((child) => {
            const childStatus = statuses[child.id];
            const isPending = childStatus?.status === "PENDING";
            const isConfirmed = childStatus?.status === "INN";

            return (
              <TouchableOpacity
                key={child.id}
                style={[
                  EmployeeCheckinStyles.childCard,
                  isPending && { backgroundColor: "#FEF3C7", borderWidth: 2, borderColor: "#F59E0B" },
                  isConfirmed && { backgroundColor: "#DCFCE7", borderWidth: 2, borderColor: "#16A34A" },
                ]}
                onPress={() => setSelectedChild(child)}
              >
                <View style={[
                  EmployeeCheckinStyles.avatarCircle,
                  isPending && { backgroundColor: "#F59E0B" },
                  isConfirmed && { backgroundColor: "#16A34A" },
                ]}>
                  <Text style={EmployeeCheckinStyles.avatarInitial}>{getChildInitial(child)}</Text>
                </View>

                <Text style={EmployeeCheckinStyles.childName}>{getChildDisplayName(child)}</Text>
                <Text style={[
                  EmployeeCheckinStyles.statusLabel,
                  isPending && { color: "#92400E", fontWeight: "600" },
                  isConfirmed && { color: "#166534" },
                ]}>
                  {statusLabel(child.id)}
                </Text>
              </TouchableOpacity>
            );
          })
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

            {/* Show pending info if applicable */}
            {statuses[selectedChild.id]?.status === "PENDING" && (
              <View style={{ backgroundColor: "#FEF3C7", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <Text style={{ color: "#92400E", fontWeight: "600", textAlign: "center" }}>
                  Levert av: {statuses[selectedChild.id]?.droppedOffByName || "Forelder"}
                </Text>
                <Text style={{ color: "#92400E", textAlign: "center", marginTop: 4 }}>
                  Kl. {statuses[selectedChild.id]?.time}
                </Text>
              </View>
            )}

            <View style={EmployeeCheckinStyles.popupButtons}>
              {/* Show confirm button if pending */}
              {statuses[selectedChild.id]?.status === "PENDING" && (
                <TouchableOpacity
                  style={[EmployeeCheckinStyles.popupButton, { backgroundColor: "#16A34A" }]}
                  onPress={() => handleConfirmCheckIn(selectedChild)}
                  disabled={loading}
                >
                  <Text style={[EmployeeCheckinStyles.popupButtonText, { color: "#fff" }]}>
                    {loading ? "Bekrefter..." : "Bekreft mottak"}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Regular status buttons */}
              {statuses[selectedChild.id]?.status !== "PENDING" && (
                <>
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
                </>
              )}

              {/* Also show checkout option for pending (in case parent made mistake) */}
              {statuses[selectedChild.id]?.status === "PENDING" && (
                <TouchableOpacity
                  style={[EmployeeCheckinStyles.popupButton, { backgroundColor: "#DC2626", marginTop: 8 }]}
                  onPress={() => handleSetStatus(selectedChild, "HENTET")}
                  disabled={loading}
                >
                  <Text style={[EmployeeCheckinStyles.popupButtonText, { color: "#fff" }]}>
                    Avvis (Registrer hentet)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
