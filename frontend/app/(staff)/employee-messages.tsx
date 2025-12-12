import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AppStyles, ListStyles } from "@/styles";

const THREADS = [
  {
    id: "1",
    name: "Ola Hansen",
    subtitle: "Far til Stian i avdeling Bjørn",
    unreadCount: 1,
  },
  { id: "2", name: "Simon", subtitle: "", unreadCount: 0 },
  { id: "3", name: "Pia", subtitle: "", unreadCount: 0 },
];

export default function EmployeeMessages() {
  const router = useRouter();

  return (
    <View style={[AppStyles.screen, { flex: 1 }]}>
      <View style={[AppStyles.container, { flex: 1 }]}>

        {/* Header row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} />
          </TouchableOpacity>

          <Text style={AppStyles.title}>Meldinger</Text>
        </View>

        <ScrollView
          style={{ marginTop: 12, flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {THREADS.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={ListStyles.item}
              onPress={() =>
                router.push({
                  pathname: "/(staff)/employee-messages/[id]",
                  params: { id: t.id },
                })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={ListStyles.title}>{t.name}</Text>
                {t.subtitle ? (
                  <Text style={ListStyles.subtitle}>{t.subtitle}</Text>
                ) : null}
              </View>

              {t.unreadCount > 0 && (
                <View style={ListStyles.badge}>
                  <Text style={ListStyles.badgeText}>{t.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

      </View>
    </View>
  );
}
