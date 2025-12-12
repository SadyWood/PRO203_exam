import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";

import { CheckinStyles } from "@/styles";
import { checkerApi } from "../../services/checkerApi";
import type { CheckerResponseDto } from "../../services/types/checker";

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

function formatTimeFromIso(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleTimeString("nb-NO", {
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
        const copy = { ...prev };

        CHILDREN.forEach((child) => {
          if (!copy[child.id] || copy[child.id].status === "INN") {
            copy[child.id] = { status: "NONE" };
          }
        });

        active.forEach((record) => {
          copy[record.childId] = {
            status: "INN",
            time: formatTimeFromIso(
              record.checkInDate ?? record.initializedOn
            ),
          };
        });

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
      if (status === "INN")
        await checkerApi.checkIn({ childId: child.id } as any);

      if (status === "HENTET")
        await checkerApi.checkOut({ childId: child.id } as any);
    } finally {
      setStatuses((prev) => ({
        ...prev,
        [child.id]: {
          status,
          time: new Date().toLocaleTimeString("nb-NO", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      }));
      setSelectedChild(null);
      setLoading(false);
    }
  }

  return (
    <View style={CheckinStyles.container}>

      {/* Header */}
      <View style={CheckinStyles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>

        <Text style={CheckinStyles.title}>AVDELING BJØRN</Text>

        <TouchableOpacity onPress={loadFromApi}>
          <Ionicons
            name={loadingFromApi ? "sync" : "refresh"}
            size={22}
          />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <ScrollView contentContainerStyle={CheckinStyles.grid}>
        {CHILDREN.map((child) => (
          <TouchableOpacity
            key={child.id}
            style={CheckinStyles.childCard}
            onPress={() => setSelectedChild(child)}
          >
            <View style={CheckinStyles.avatarCircle}>
              <Text style={CheckinStyles.avatarInitial}>
                {child.name[0]}
              </Text>
            </View>

            <Text style={CheckinStyles.childName}>{child.name}</Text>
            <Text style={CheckinStyles.statusLabel}>
              {statusLabel(child.id)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Popup */}
      {selectedChild && (
        <View style={CheckinStyles.overlay}>
          <View style={CheckinStyles.popupCard}>
            <View style={CheckinStyles.popupHeaderRow}>
              <Text style={CheckinStyles.popupName}>
                {selectedChild.name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedChild(null)}>
                <Ionicons name="close" size={22} />
              </TouchableOpacity>
            </View>

            <View style={CheckinStyles.popupAvatarCircle}>
              <Text style={CheckinStyles.popupAvatarInitial}>
                {selectedChild.name[0]}
              </Text>
            </View>

            <View style={CheckinStyles.popupButtons}>
              {(["INN", "SYK", "HENTET", "FERIE"] as CheckStatus[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={CheckinStyles.popupButton}
                  onPress={() => handleSetStatus(selectedChild, s)}
                  disabled={loading}
                >
                  <Text style={CheckinStyles.popupButtonText}>
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
