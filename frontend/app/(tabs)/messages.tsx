import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ParentMessagesStyles } from "@/styles";
import {
  MOCK_PARENT_THREADS,
  type ParentThread,
} from "../(mock)/mockParentThreads";

type ThreadSummary = {
  id: string;
  name: string;
  subtitle: string;
  lastMessage: string;
};

function lastMessageFromMock(t: ParentThread) {
  return t.messages[t.messages.length - 1]?.text ?? "Ingen meldinger enda";
}

export default function MessagesScreen() {
  const router = useRouter();
  const [threads, setThreads] = useState<ThreadSummary[]>([]);

  const loadThreads = useCallback(async () => {
    const next: ThreadSummary[] = [];

    for (const t of Object.values(MOCK_PARENT_THREADS)) {
      const key = `parent_chat_${t.id}`;
      let msgs = t.messages;

      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored) msgs = JSON.parse(stored);
      } catch {}

      const last = msgs[msgs.length - 1];

      next.push({
        id: t.id,
        name: t.name,
        subtitle: t.subtitle,
        lastMessage: last?.text ?? lastMessageFromMock(t),
      });
    }

    setThreads(next);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadThreads();
    }, [loadThreads])
  );

  return (
    <View style={ParentMessagesStyles.screen}>
      <View style={ParentMessagesStyles.container}>
        <Text style={ParentMessagesStyles.title}>Meldinger</Text>

        <ScrollView contentContainerStyle={ParentMessagesStyles.listContent}>
          {threads.map((thread) => (
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

                <Text style={ParentMessagesStyles.preview} numberOfLines={1}>
                  {thread.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
