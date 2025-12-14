import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ParentMessagesStyles } from "@/styles";

const MOCK_THREADS = [
  {
    id: "1",
    name: "Karoline",
    subtitle: "Lærer i Stian avdeling Bjørn",
    unreadCount: 1,
    lastMessage:
      "Hei Olai! Stian skal på tur i morgen til slottet. Husk ekstra sokker ...",
  },
  {
    id: "2",
    name: "Simon",
    subtitle: "Lærer i Edith avdeling Loppe",
    unreadCount: 0,
    lastMessage: "Takk for at du leverte lappen til turen i dag!",
  },
  {
    id: "3",
    name: "Pia",
    subtitle: "Rektor Eventyrhagen Barnehage",
    unreadCount: 0,
    lastMessage: "Ny månedsplan ligger nå i appen under kalender.",
  },
];

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <View style={ParentMessagesStyles.screen}>
      <View style={ParentMessagesStyles.container}>
        <Text style={ParentMessagesStyles.title}>Meldinger</Text>

        <ScrollView contentContainerStyle={ParentMessagesStyles.listContent}>
          {MOCK_THREADS.map((thread) => (
            <TouchableOpacity
              key={thread.id}
              style={ParentMessagesStyles.item}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/messages/[id]",
                  params: { id: thread.id },
                })
              }
            >
              <View style={ParentMessagesStyles.itemLeft}>
                <Text style={ParentMessagesStyles.itemTitle}>
                  {thread.name}
                </Text>

                {thread.subtitle ? (
                  <Text style={ParentMessagesStyles.itemSubtitle}>
                    {thread.subtitle}
                  </Text>
                ) : null}

                <Text
                  style={ParentMessagesStyles.preview}
                  numberOfLines={1}
                >
                  {thread.lastMessage}
                </Text>
              </View>

              {thread.unreadCount > 0 && (
                <View style={ParentMessagesStyles.badge}>
                  <Text style={ParentMessagesStyles.badgeText}>
                    {thread.unreadCount}
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
