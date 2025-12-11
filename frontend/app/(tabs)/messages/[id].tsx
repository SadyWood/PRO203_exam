import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
  } from "react-native";
  import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

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
// TODO: Bruk backend for å hente trådinfo og meldinger (messagesApi.getThreadById)
// Denne konstanten brukes kun som fallback/demo-data.
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
      {
        id: "m3",
        from: "karoline",
        text: "Supert!",
      },
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

  const threadId = params.id ?? "1";
  const thread = THREADS[threadId];

  const [messages, setMessages] = useState<Message[]>(thread.messages);
  const [inputText, setInputText] = useState("");

  const storageKey = `chat_${threadId}`;

  // TODO: Når backend er klar:
  // 1. Hent meldinger fra backend (messagesApi.getMessages(threadId))
  // 2. Bruk AsyncStorage som cache/offline fallback.
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) {
          const parsed: Message[] = JSON.parse(stored);
          setMessages(parsed);
        } else {
          setMessages(thread.messages);
        }
      } catch (e) {
        console.log("Feil ved lesing av meldinger:", e);
      }
    };

    loadMessages();
  }, [storageKey, thread.messages]);

  // legg til i state + lagre i storage
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

    // TODO: Når backend er klar – send meldingen til serveren:
    // await messagesApi.sendMessage(threadId, trimmed);
    // og oppdater state basert på svaret fra backend.
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.log("Feil ved lagring av melding:", e);
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>


        <View style={styles.header}>
          <Text style={styles.name}>{thread.name}</Text>
          <Text style={styles.subtitle}>{thread.subtitle}</Text>
        </View>

        <ScrollView
          style={styles.messages}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => {
            const isParent = m.from === "forelder";

            return (
              <View
                key={m.id}
                style={[
                  styles.bubbleRow,
                  isParent
                    ? { justifyContent: "flex-end" }
                    : { justifyContent: "flex-start" },
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isParent ? styles.parentBubble : styles.teacherBubble,
                  ]}
                >
                  <Text style={styles.bubbleText}>{m.text}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Skriv en melding..."
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  messages: {
    flex: 1,
  },
  bubbleRow: {
    width: "100%",
    marginVertical: 4,
    flexDirection: "row",
  },
  bubble: {
    maxWidth: "80%",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  teacherBubble: {
    backgroundColor: "#e5e7eb",
    borderTopLeftRadius: 0,
  },
  parentBubble: {
    backgroundColor: Colors.primaryLightBlue,
    borderTopRightRadius: 0,
  },
  bubbleText: {
    fontSize: 14,
    color: Colors.text,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.text,
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryBlue,
    alignItems: "center",
    justifyContent: "center",
  },
});