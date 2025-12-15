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
import { useEffect, useMemo, useRef, useState } from "react";

import { ChatStyles } from "@/styles";
import {
  MOCK_PARENT_THREADS,
  type ParentThread,
  type ParentMessage,
} from "../../(mock)/mockParentThreads";

export default function MessageChatScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const threadId = typeof params.id === "string" ? params.id : "1";

  const thread: ParentThread = useMemo(() => {
    return MOCK_PARENT_THREADS[threadId] ?? MOCK_PARENT_THREADS["1"];
  }, [threadId]);

  const storageKey = `parent_chat_${threadId}`;

  const [messages, setMessages] = useState<ParentMessage[]>(thread.messages);
  const [inputText, setInputText] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  function handleBack() {
    router.replace("/(tabs)/messages");
  }
  

  useEffect(() => {
    let mounted = true;

    async function loadMessages() {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        const msgs: ParentMessage[] = stored ? JSON.parse(stored) : thread.messages;
        if (!mounted) return;
        setMessages(msgs);
      } catch {
        setMessages(thread.messages);
      }
    }

    loadMessages();
    return () => {
      mounted = false;
    };
  }, [storageKey, thread.messages]);

  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(t);
  }, [messages.length]);

  async function handleSend() {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMessage: ParentMessage = {
      id: Date.now().toString(),
      from: "parent",
      text: trimmed,
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    setInputText("");

    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
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
          ref={scrollRef}
          style={ChatStyles.messagesBox}
          contentContainerStyle={ChatStyles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((m) => {
            const isStaff = m.from === "staff";

            return (
              <View
                key={m.id}
                style={[
                  ChatStyles.bubble,
                  // ✅ Farger: blå = staff, hvit = parent
                  isStaff ? ChatStyles.staffBubble : ChatStyles.parentBubble,
                  // ✅ Side: staff venstre, parent høyre
                  { alignSelf: isStaff ? "flex-start" : "flex-end" },
                ]}
              >
                <Text
                  style={[
                    ChatStyles.bubbleText,
                    isStaff ? ChatStyles.staffText : ChatStyles.parentText,
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
