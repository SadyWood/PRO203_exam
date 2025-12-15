import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { EmployeeChildrenStyles } from "@/styles";

type Child = {
  id: string;
  name: string;
  subtitle: string;
};

const CHILDREN: Child[] = [
  { id: "edith-id", name: "Edith", subtitle: "Avdeling Bjørn" },
  { id: "ella-id", name: "Ella", subtitle: "Avdeling Bjørn" },
  { id: "omar-id", name: "Omar", subtitle: "Avdeling Bjørn" },
];

const CHECKIN_STORAGE_KEY = "employee_checkin_statuses_bjorn";

type CheckStatus = "NONE" | "INN" | "HENTET" | "SYK" | "FERIE";

type ChildStatus = {
  status: CheckStatus;
  time?: string;
};

export default function EmployeeChildrenScreen() {
  const router = useRouter();

  /**
   * TODO (BACKEND):
   * - Erstatt hardkodet CHILDREN med API-kall
   * - GET /api/staff/departments/{departmentId}/children
   */
  const [statuses, setStatuses] = useState<Record<string, ChildStatus>>({});

  const loadStatuses = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(CHECKIN_STORAGE_KEY);
      setStatuses(stored ? JSON.parse(stored) : {});
    } catch {
      setStatuses({});
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStatuses();
    }, [loadStatuses])
  );

  useEffect(() => {
    const id = setInterval(() => {
      loadStatuses();
    }, 1000);

    return () => clearInterval(id);
  }, [loadStatuses]);

  return (
    <View style={EmployeeChildrenStyles.screen}>
      <View style={EmployeeChildrenStyles.container}>
        <View style={EmployeeChildrenStyles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} />
          </Pressable>

          <Text style={EmployeeChildrenStyles.title}>Barn</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={EmployeeChildrenStyles.listContent}>
          {CHILDREN.map((c) => {
            const st = statuses[c.id]?.status ?? "NONE";

            const isIn = st === "INN";
            const isOut = st === "HENTET";
            const isSick = st === "SYK";
            const isVacation = st === "FERIE";

            return (
              <Pressable
                key={c.id}
                style={EmployeeChildrenStyles.item}
                onPress={() => router.push(`/child/${c.id}`)}
              >
                <View style={EmployeeChildrenStyles.itemLeft}>
                  <View style={EmployeeChildrenStyles.titleRow}>
                    <Text style={EmployeeChildrenStyles.itemTitle}>{c.name}</Text>

                    <View
                      style={[
                        EmployeeChildrenStyles.statusPill,
                        st === "NONE" && EmployeeChildrenStyles.statusPillNone,
                        isIn && EmployeeChildrenStyles.statusPillIn,
                        (isOut || isSick) && EmployeeChildrenStyles.statusPillOut,
                        isVacation && EmployeeChildrenStyles.statusPillVacation,
                      ]}
                    >
                      <View
                        style={[
                          EmployeeChildrenStyles.statusDot,
                          st === "NONE" && EmployeeChildrenStyles.statusDotNone,
                          isIn && EmployeeChildrenStyles.statusDotIn,
                          (isOut || isSick) && EmployeeChildrenStyles.statusDotOut,
                          isVacation && EmployeeChildrenStyles.statusDotVacation,
                        ]}
                      />
                      <Text
                        style={[
                          EmployeeChildrenStyles.statusText,
                          st === "NONE" && EmployeeChildrenStyles.statusTextNone,
                          isIn && EmployeeChildrenStyles.statusTextIn,
                          (isOut || isSick) && EmployeeChildrenStyles.statusTextOut,
                          isVacation && EmployeeChildrenStyles.statusTextVacation,
                        ]}
                      >
                        {st === "NONE"
                          ? "IKKE REG ENDA"
                          : st === "INN"
                          ? "INN"
                          : st === "HENTET"
                          ? "HENTET"
                          : st === "SYK"
                          ? "SYK"
                          : "FERIE"}
                      </Text>
                    </View>
                  </View>

                  <Text style={EmployeeChildrenStyles.itemSubtitle}>{c.subtitle}</Text>
                </View>

                <Text style={EmployeeChildrenStyles.arrow}>➜</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
