import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { ParentCheckinStyles } from "@/styles";
import { checkerApi } from "@/services/checkerApi";
import type { PersonType, CheckerResponseDto } from "@/services/types/checker";
import { Colors } from "@/constants/colors";

const API_BASE_URL = Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

// Status: NONE = not checked in, PENDING = checked in awaiting confirmation, CONFIRMED = staff confirmed
type CheckStatus = "NONE" | "PENDING" | "CONFIRMED";

type Child = {
  id: string;
  firstName: string;
  lastName: string;
};

type ChildCheckInStatus = {
  status: CheckStatus;
  checkInTime: string | null;
  checkInId: string | null;
};

const PARENT_PERSON_TYPE: PersonType = "Parent";

function formatTimeForDisplay(isoTime: string | null): string {
  if (!isoTime) return "";
  const date = new Date(isoTime);
  return date.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CheckinScreen() {
  const router = useRouter();

  const [children, setChildren] = useState<Child[]>([]);
  const [parentId, setParentId] = useState<string>("");
  const [parentName, setParentName] = useState<string>("");
  const [statusMap, setStatusMap] = useState<Record<string, ChildCheckInStatus>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load children and parent info
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoadingData(true);
      const userStr = await AsyncStorage.getItem("currentUser");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      if (!user.profileId || user.role !== "PARENT") return;

      setParentId(user.profileId);

      const token = await AsyncStorage.getItem("authToken");

      // Fetch parent profile for name
      const parentRes = await fetch(`${API_BASE_URL}/api/parents/${user.profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (parentRes.ok) {
        const parentData = await parentRes.json();
        setParentName(`${parentData.firstName} ${parentData.lastName}`);
      }

      // Fetch children
      const childrenRes = await fetch(`${API_BASE_URL}/api/children`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (childrenRes.ok) {
        const childrenData = await childrenRes.json();
        setChildren(childrenData);

        // Fetch real check-in status from backend for each child
        const nextStatus: Record<string, ChildCheckInStatus> = {};

        for (const c of childrenData) {
          try {
            const checkInStatus = await checkerApi.getChildStatus(c.id);
            if (checkInStatus && checkInStatus.checkInDate) {
              // Child is checked in
              const isConfirmed = checkInStatus.droppedOffConfirmedBy !== null;
              nextStatus[c.id] = {
                status: isConfirmed ? "CONFIRMED" : "PENDING",
                checkInTime: checkInStatus.checkInDate,
                checkInId: checkInStatus.id,
              };
            } else {
              nextStatus[c.id] = {
                status: "NONE",
                checkInTime: null,
                checkInId: null,
              };
            }
          } catch (e) {
            console.log("Error fetching status for child:", c.id, e);
            nextStatus[c.id] = {
              status: "NONE",
              checkInTime: null,
              checkInId: null,
            };
          }
        }

        setStatusMap(nextStatus);
      }
    } catch (err) {
      console.log("Error loading data:", err);
    } finally {
      setLoadingData(false);
    }
  }

  async function handleCheckIn(child: Child) {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await checkerApi.checkIn({
        childId: child.id,
        droppedOffBy: parentId,
        droppedOffPersonType: PARENT_PERSON_TYPE,
        droppedOffPersonName: parentName,
        droppedOffConfirmedBy: null,
        notes: null,
      });

      // Update local status
      setStatusMap((prev) => ({
        ...prev,
        [child.id]: {
          status: "PENDING",
          checkInTime: result.checkInDate,
          checkInId: result.id,
        },
      }));

      setSuccessMessage(`${child.firstName} er registrert som levert. Venter på bekreftelse fra ansatt.`);
    } catch (e: any) {
      console.log("Feil ved check-in:", e);
      if (e.message?.includes("already checked in")) {
        setError("Barnet er allerede sjekket inn.");
      } else {
        setError("Kunne ikke registrere levering. Prøv igjen.");
      }
    } finally {
      setLoading(false);
    }
  }

  function getStatusInfo(childId: string) {
    const info = statusMap[childId];
    if (!info || info.status === "NONE") {
      return {
        label: "Ikke sjekket inn",
        isPending: false,
        isConfirmed: false,
        time: null,
      };
    }

    const timeStr = formatTimeForDisplay(info.checkInTime);

    if (info.status === "PENDING") {
      return {
        label: timeStr ? `Levert kl. ${timeStr} - Venter på bekreftelse` : "Venter på bekreftelse",
        isPending: true,
        isConfirmed: false,
        time: timeStr,
      };
    }

    return {
      label: timeStr ? `Bekreftet levert kl. ${timeStr}` : "Bekreftet levert",
      isPending: false,
      isConfirmed: true,
      time: timeStr,
    };
  }

  if (loadingData) {
    return (
      <View style={[ParentCheckinStyles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primaryBlue} />
      </View>
    );
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

        {successMessage && (
          <View style={[ParentCheckinStyles.errorCard, { backgroundColor: "#DCFCE7", borderColor: "#16A34A" }]}>
            <Text style={[ParentCheckinStyles.errorText, { color: "#16A34A" }]}>{successMessage}</Text>
          </View>
        )}

        {children.length === 0 ? (
          <View style={ParentCheckinStyles.childCard}>
            <Text style={ParentCheckinStyles.childTitle}>Ingen barn registrert</Text>
            <Text style={ParentCheckinStyles.infoText}>
              Du har ingen barn registrert. Legg til barn via profilen din.
            </Text>
          </View>
        ) : (
          children.map((child) => {
            const statusInfo = getStatusInfo(child.id);
            const canCheckIn = !statusInfo.isPending && !statusInfo.isConfirmed;

            return (
              <View key={child.id} style={ParentCheckinStyles.childCard}>
                <Text style={ParentCheckinStyles.childTitle}>Barn</Text>

                <View style={ParentCheckinStyles.childHeaderRow}>
                  <Text style={ParentCheckinStyles.childName}>
                    {child.firstName} {child.lastName}
                  </Text>

                  {(statusInfo.isPending || statusInfo.isConfirmed) && (
                    <View
                      style={[
                        ParentCheckinStyles.statusPill,
                        statusInfo.isConfirmed
                          ? ParentCheckinStyles.statusPillIn
                          : { backgroundColor: "#FEF3C7", borderColor: "#F59E0B" },
                      ]}
                    >
                      <View
                        style={[
                          ParentCheckinStyles.statusDot,
                          statusInfo.isConfirmed
                            ? ParentCheckinStyles.statusDotIn
                            : { backgroundColor: "#F59E0B" },
                        ]}
                      />
                      <Text
                        style={[
                          ParentCheckinStyles.statusText,
                          statusInfo.isConfirmed
                            ? ParentCheckinStyles.statusTextIn
                            : { color: "#92400E" },
                        ]}
                      >
                        {statusInfo.isConfirmed ? "Bekreftet" : "Venter"}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={ParentCheckinStyles.lastChangeText}>
                  {statusInfo.label}
                </Text>

                {canCheckIn ? (
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
                      {loading ? "Registrerer..." : "Registrer levering"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[ParentCheckinStyles.checkButton, { backgroundColor: "#E5E7EB" }]}>
                    <Text style={[ParentCheckinStyles.checkButtonText, { color: "#6B7280" }]}>
                      {statusInfo.isPending ? "Venter på bekreftelse fra ansatt" : "Barnet er levert"}
                    </Text>
                  </View>
                )}

                <Text style={ParentCheckinStyles.infoText}>
                  {statusInfo.isPending
                    ? "En ansatt vil bekrefte at barnet er mottatt."
                    : statusInfo.isConfirmed
                    ? "Barnet er bekreftet mottatt av ansatt."
                    : "Registrer levering når du leverer barnet i barnehagen. En ansatt vil bekrefte mottak."}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
