import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { EmployeeMessagesStyles } from "@/styles";

type StaffThreadSummary = {
  id: string;
  name: string;
  subtitle: string;
  unreadCount: number;
  lastMessage: string;
};

const THREADS: StaffThreadSummary[] = [
  {
    id: "1",
    name: "Ola Hansen",
    subtitle: "Foresatt til Stian • Avdeling Bjørn",
    unreadCount: 1,
    lastMessage:
      "Hei! Vi finner ikke den blå lua til Stian. Har dere sett den i garderoben i dag?",
  },
  {
    id: "2",
    name: "Mariam Ali",
    subtitle: "Foresatt til Edith • Avdeling Loppe",
    unreadCount: 0,
    lastMessage:
      "Tusen takk for oppdateringen i dag 😊 Edith sovnet tidlig hjemme etter en fin dag.",
  },
  {
    id: "3",
    name: "Jonas Nilsen",
    subtitle: "Foresatt til Amir • Avdeling Rev",
    unreadCount: 0,
    lastMessage:
      "Hei! Amir blir hentet av bestemor kl. 15:30 i dag. Hun heter Ragnhild.",
  },
  {
    id: "4",
    name: "Sara Berg",
    subtitle: "Foresatt til Lea • Avdeling Bjørn",
    unreadCount: 2,
    lastMessage:
      "Kan dere minne Lea på å ta med regntøy i morgen? Det skal visst regne på turdag.",
  },
];

export default function EmployeeMessages() {
  const router = useRouter();

  return (
    <View style={EmployeeMessagesStyles.screen}>
      <View style={EmployeeMessagesStyles.container}>
        {/* Header */}
        <View style={EmployeeMessagesStyles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} />
          </TouchableOpacity>

          <Text style={EmployeeMessagesStyles.title}>Meldinger</Text>
        </View>

        <ScrollView
          style={EmployeeMessagesStyles.list}
          contentContainerStyle={EmployeeMessagesStyles.listContent}
        >
          {THREADS.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={EmployeeMessagesStyles.item}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/(staff)/employee-messages/[id]",
                  params: { id: t.id },
                })
              }
            >
              <View style={EmployeeMessagesStyles.itemLeft}>
                <Text style={EmployeeMessagesStyles.itemTitle}>{t.name}</Text>

                {t.subtitle ? (
                  <Text style={EmployeeMessagesStyles.itemSubtitle}>
                    {t.subtitle}
                  </Text>
                ) : null}

                <Text
                  style={EmployeeMessagesStyles.preview}
                  numberOfLines={1}
                >
                  {t.lastMessage}
                </Text>
              </View>

              {t.unreadCount > 0 && (
                <View style={EmployeeMessagesStyles.badge}>
                  <Text style={EmployeeMessagesStyles.badgeText}>
                    {t.unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
