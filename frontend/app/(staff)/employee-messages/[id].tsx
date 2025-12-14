import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ChatStyles } from "@/styles";

type Message = {
  id: string;
  from: "parent" | "staff";
  text: string;
};

type Thread = {
  id: string;
  name: string;
  subtitle: string;
  messages: Message[];
};

export default function EmployeeChat() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const THREADS: Record<string, Thread> = {
    "1": {
      id: "1",
      name: "Ola Hansen",
      subtitle: "Foresatt til Stian • Avdeling Bjørn",
      messages: [],
    },
  };

  const threadId = typeof params.id === "string" ? params.id : "1";
  const thread = useMemo(
    () => THREADS[threadId] ?? THREADS["1"],
    [threadId]
  );

  const storageKey = `chat_staff_${threadId}`;

  const [messages, setMessages] = useState<Message[]>(thread.messages);
  const [input, setInput] = useState("");

  function handleBack() {
    router.replace("/(staff)/employee-messages");
  }

  useEffect(() => {
    async function loadMessages() {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) setMessages(JSON.parse(stored));
    }
    loadMessages();
  }, [storageKey]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      from: "staff",
      text: trimmed,
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setInput("");

    await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
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
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => {
            const isStaff = msg.from === "staff";

            return (
              <View
                key={msg.id}
                style={[
                  ChatStyles.bubble,
                  isStaff
                    ? ChatStyles.staffBubble
                    : ChatStyles.parentBubble,
                ]}
              >
                <Text
                  style={[
                    ChatStyles.bubbleText,
                    isStaff
                      ? ChatStyles.staffText
                      : ChatStyles.parentText,
                  ]}
                >
                  {msg.text}
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
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />

          <TouchableOpacity
            style={ChatStyles.sendButton}
            onPress={sendMessage}
          >
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
