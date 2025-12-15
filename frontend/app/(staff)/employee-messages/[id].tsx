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
import { useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ChatStyles } from "@/styles";
import { MOCK_THREADS, type Message, type Thread } from "../../../(mock)/mockThreads";

export default function EmployeeChat() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const threadId = typeof params.id === "string" ? params.id : "1";

  const thread: Thread = useMemo(() => {
    return MOCK_THREADS[threadId] ?? MOCK_THREADS["1"];
  }, [threadId]);

  const messagesKey = `chat_thread_${threadId}`;
  const lastSeenKey = `chat_thread_last_seen_${threadId}`;

  const [messages, setMessages] = useState<Message[]>(thread.messages);
  const [input, setInput] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  function handleBack() {
    router.replace("/(staff)/employee-messages");
  }


  useEffect(() => {
    async function load() {
      const stored = await AsyncStorage.getItem(messagesKey);
      const msgs = stored ? JSON.parse(stored) : thread.messages;
      setMessages(msgs);

      const last = msgs[msgs.length - 1];
      if (last) {
        await AsyncStorage.setItem(lastSeenKey, last.id);
      }
    }
    load();
  }, [messagesKey, lastSeenKey, thread.messages]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

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

    await AsyncStorage.setItem(messagesKey, JSON.stringify(updated));
    await AsyncStorage.setItem(lastSeenKey, newMsg.id); 
  }

  return (
    <KeyboardAvoidingView
      style={ChatStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={ChatStyles.container}>
        <View style={ChatStyles.headerRow}>
        <TouchableOpacity onPress={handleBack}>
            <Ionicons name="chevron-back" size={26} />
          </TouchableOpacity>
          <View style={ChatStyles.headerBox}>
            <Text style={ChatStyles.name}>{thread.name}</Text>
            <Text style={ChatStyles.subtitle}>{thread.subtitle}</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={ChatStyles.messagesBox}
          contentContainerStyle={ChatStyles.messagesContent}
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

        <View style={ChatStyles.inputRow}>
          <TextInput
            style={ChatStyles.chatInput}
            placeholder="Skriv en melding..."
            value={input}
            onChangeText={setInput}
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
