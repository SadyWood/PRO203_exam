import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";

import { ChatStyles } from "@/styles";

type Message = {
  id: string;
  from: "karoline" | "simon" | "pia" | "forelder";
  text: string;
};

type Thread = {
  id: string;
  name: string;
  subtitle: string;
  messages: Message[];
};

// ✅ MOCK beholdes (ingen backend)
const THREADS: Record<string, Thread> = {
  "1": {
    id: "1",
    name: "Karoline",
    subtitle: "Lærer til Stian avdeling Bjørn",
    messages: [
      {
        id: "m1",
        from: "karoline",
        text:
          "Hei Olai! Stian skal på tur i morgen til slottet, men jeg ser i hylla hans at han har for få ekstra par med sokker og ull undertøy. Dette kommer til å trenges hvis han blir våt underveis på turen.",
      },
      {
        id: "m2",
        from: "forelder",
        text:
          "Hei Karoline! Takk for beskjed. Jeg skal huske å ta med ekstra sokker og ull undertøy når Stian kommer til barnehagen i morgen.",
      },
      { id: "m3", from: "karoline", text: "Supert!" },
    ],
  },
  "2": {
    id: "2",
    name: "Simon",
    subtitle: "Lærer til Edith avdeling Loppe",
    messages: [
      {
        id: "m1",
        from: "simon",
        text: "Hei! Edith hadde en veldig fin dag i dag ☺️",
      },
    ],
  },
  "3": {
    id: "3",
    name: "Pia",
    subtitle: "Rektor Eventyrhagen Barnehage",
    messages: [
      {
        id: "m1",
        from: "pia",
        text: "Hei! Ny månedsplan ligger nå i kalenderen i appen.",
      },
    ],
  },
};

export default function MessageChatScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const threadId = typeof params.id === "string" ? params.id : "1";
  const thread = useMemo(() => THREADS[threadId] ?? THREADS["1"], [threadId]);

  const storageKey = `chat_${threadId}`;

  const [messages, setMessages] = useState<Message[]>(thread.messages);
  const [inputText, setInputText] = useState("");

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/messages");
  }

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);

        if (stored) {
          const parsed: Message[] = JSON.parse(stored);
          if (parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }

        setMessages(thread.messages);
      } catch (e) {
        console.log("Feil ved lesing av meldinger:", e);
        setMessages(thread.messages);
      }
    };

    loadMessages();
  }, [storageKey, thread.messages]);

  async function handleSend() {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: "forelder",
      text: trimmed,
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    setInputText("");

    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.log("Feil ved lagring av melding:", e);
    }
  }

  return (
    <KeyboardAvoidingView
      style={ChatStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={ChatStyles.container}>
        {/* Header */}
        <View style={ChatStyles.headerRow}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="chevron-back" size={26} />
          </TouchableOpacity>

          <View style={ChatStyles.headerBox}>
            <Text style={ChatStyles.name}>{thread.name}</Text>
            <Text style={ChatStyles.subtitle}>{thread.subtitle}</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          style={ChatStyles.messagesBox}
          contentContainerStyle={ChatStyles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => {
            const isParent = m.from === "forelder";

            return (
              <View
                key={m.id}
                style={[
                  ChatStyles.bubble,
                  isParent ? ChatStyles.staffBubble : ChatStyles.parentBubble,
                ]}
              >
                <Text
                  style={[
                    ChatStyles.bubbleText,
                    isParent ? ChatStyles.staffText : ChatStyles.parentText,
                  ]}
                >
                  {m.text}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Input */}
        <View style={ChatStyles.inputRow}>
          <TextInput
            style={ChatStyles.chatInput}
            placeholder="Skriv en melding..."
            value={inputText}
            onChangeText={setInputText}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity style={ChatStyles.sendButton} onPress={handleSend}>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
