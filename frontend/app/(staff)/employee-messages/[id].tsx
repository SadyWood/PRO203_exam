import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
  } from "react-native";
  import { Ionicons } from "@expo/vector-icons";
  import { Colors } from "@/constants/colors";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
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
  
  //  byttes ut med backend senere
  const THREADS: Record<string, Thread> = {
    "1": {
      id: "1",
      name: "Ola Hansen",
      subtitle: "Far til Stian i avdeling Bjørn",
      messages: [
        {
          id: "m1",
          from: "parent",
          text: "Hei! Vi finner ikke den blå lua...",
        },
        {
          id: "m2",
          from: "staff",
          text: "Hei Ola! Takk for beskjed...",
        },
        {
          id: "m3",
          from: "parent",
          text: "Tusen takk! Det setter vi pris på",
        },
      ],
    },
  };
  
  export default function EmployeeChat() {
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string }>();
  
    const threadId = typeof params.id === "string" ? params.id : "1";
    const thread = THREADS[threadId] ?? THREADS["1"];
  
    const storageKey = `chat_staff_${threadId}`;
  
    const [messages, setMessages] = useState<Message[]>(thread.messages);
    const [input, setInput] = useState("");
  
    // Last meldinger fra asyncStorage 
    useEffect(() => {
      async function loadMessages() {
        try {
          const stored = await AsyncStorage.getItem(storageKey);
          if (stored) {
            const parsed: Message[] = JSON.parse(stored);
            setMessages(parsed);
          } else {
            setMessages(thread.messages);
          }
        } catch (err) {
          console.log("Feil ved lasting av meldinger:", err);
        }
      }
  
      loadMessages();
    }, [storageKey, thread.messages]);
  
    async function sendMessage() {
      const trimmed = input.trim();
      if (!trimmed) return;
  
      const newMsg: Message = {
        id: Date.now().toString(),
        from: "staff",
        text: trimmed,
      };
  
      const updated: Message[] = [...messages, newMsg];
      setMessages(updated);
      setInput("");
  
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.log("Feil ved lagring i storage:", err);
      }
  
      // TODO: send til backend når API er klart
    }
  
    return (
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
         >

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.nameBox}>
          <Text style={styles.name}>{thread.name}</Text>
          <Text style={styles.subtitle}>{thread.subtitle}</Text>
        </View>
  
        <ScrollView style={styles.messagesBox}>
          {messages.map((msg: Message) => {
            const isStaff = msg.from === "staff";
  
            return (
              <View
                key={msg.id}
                style={[
                  styles.bubble,
                  isStaff ? styles.staffBubble : styles.parentBubble,
                ]}
              >
                <Text style={styles.bubbleText}>{msg.text}</Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Skriv en melding..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="arrow-forward" size={20} color={"white"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#FFF2F2",
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    backButton: {
      marginBottom: 10,
    },
    headerBox: {
      backgroundColor: "#BACEFF",
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center",
    },
    headerText: {
      fontSize: 20,
      fontWeight: "700",
    },
    nameBox: {
      alignItems: "center",
      marginTop: 12,
      marginBottom: 12,
    },
    name: {
      fontSize: 17,
      fontWeight: "700",
    },
    subtitle: {
      fontSize: 13,
      color: Colors.textMuted,
    },
    messagesBox: {
      flex: 1,
      marginTop: 10,
    },
    bubble: {
      padding: 12,
      borderRadius: 14,
      marginVertical: 6,
      maxWidth: "80%",
    },
    parentBubble: {
      backgroundColor: "#BEE3FF",
      alignSelf: "flex-start",
    },
    staffBubble: {
      backgroundColor: "#D9D9D9",
      alignSelf: "flex-end",
    },
    bubbleText: {
      fontSize: 15,
      color: Colors.text,
    },
    inputRow: {
      flexDirection: "row",
      marginBottom: 20,
      marginTop: 10,
    },
    input: {
      flex: 1,
      backgroundColor: "#E6E6E6",
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginRight: 8,
      fontSize: 15,
    },
    sendButton: {
      backgroundColor: Colors.primaryBlue,
      width: 38,
      height: 38,
      borderRadius: 19,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  