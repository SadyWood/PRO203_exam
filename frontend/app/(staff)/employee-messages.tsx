import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { EmployeeMessagesStyles } from "@/styles";
import { MOCK_THREADS, type Thread } from "../../(mock)/mockThreads";

type StaffThreadSummary = {
  id: string;
  name: string;
  subtitle: string;
  unreadCount: number;
  lastMessage: string;
};

function getLastMessageText(thread: Thread) {
  const last = thread.messages[thread.messages.length - 1];
  return last?.text ?? "Ingen meldinger enda";
}

export default function EmployeeMessages() {
  const router = useRouter();
  const [threads, setThreads] = useState<StaffThreadSummary[]>([]);

  const loadThreads = useCallback(async () => {
    const result: StaffThreadSummary[] = [];

    for (const thread of Object.values(MOCK_THREADS)) {
      const messagesKey = `chat_thread_${thread.id}`;
      const lastSeenKey = `chat_thread_last_seen_${thread.id}`;

      let messages = thread.messages;
      let unreadCount = 0;

      try {
        const storedMessages = await AsyncStorage.getItem(messagesKey);
        const lastSeen = await AsyncStorage.getItem(lastSeenKey);

        if (storedMessages) {
          messages = JSON.parse(storedMessages);
        }

        const lastMsg = messages[messages.length - 1];

        // 👉 ekte unread-logikk
        if (
          lastMsg &&
          lastMsg.from === "parent" &&
          (!lastSeen || lastSeen !== lastMsg.id)
        ) {
          unreadCount = 1;
        }

        result.push({
          id: thread.id,
          name: thread.name,
          subtitle: thread.subtitle,
          unreadCount,
          lastMessage: lastMsg?.text ?? getLastMessageText(thread),
        });
      } catch {
        result.push({
          id: thread.id,
          name: thread.name,
          subtitle: thread.subtitle,
          unreadCount: 0,
          lastMessage: getLastMessageText(thread),
        });
      }
    }

    setThreads(result);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadThreads();
    }, [loadThreads])
  );

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
          {threads.map((t) => (
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
                <Text style={EmployeeMessagesStyles.itemSubtitle}>
                  {t.subtitle}
                </Text>
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
